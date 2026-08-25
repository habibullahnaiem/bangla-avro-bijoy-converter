import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const projectRoot = new URL("./", import.meta.url);
const readProjectFile = (path: string) => readFileSync(new URL(path, projectRoot), "utf8");

describe("public SEO guide routes", () => {
  it("publishes three focused guides and route-specific metadata support", () => {
    const guides = readProjectFile("client/src/pages/SeoGuides.tsx");
    expect(guides).toContain('"avro-to-bijoy"');
    expect(guides).toContain('"bijoy-to-unicode"');
    expect(guides).toContain('"docx-txt-bijoy-converter"');
    expect(guides).toContain('"@type": "Article"');
    expect(guides).toContain("SutonnyMJ");
  });

  it("keeps every published guide URL discoverable in the sitemap", () => {
    const sitemap = readProjectFile("client/public/sitemap.xml");
    for (const slug of ["avro-to-bijoy", "bijoy-to-unicode", "docx-txt-bijoy-converter"]) {
      expect(sitemap).toContain(`https://avrojoy.vercel.app/${slug}`);
    }
  });
});
