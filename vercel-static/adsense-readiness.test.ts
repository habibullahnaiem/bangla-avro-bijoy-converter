import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

describe("AdSense application readiness pages", () => {
  it("registers the public privacy, terms, contact, and thesis checklist routes", () => {
    const app = fs.readFileSync(path.join(repositoryRoot, "client/src/App.tsx"), "utf8");

    expect(app).toContain('path={"/privacy"}');
    expect(app).toContain('path={"/terms"}');
    expect(app).toContain('path={"/contact"}');
    expect(app).toContain('path={"/thesis-bijoy-checklist"}');
  });

  it("publishes route metadata, structured data, footer discovery links, and sitemap entries", () => {
    const pages = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/PublicInfoPages.tsx"), "utf8");
    const home = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/Home.tsx"), "utf8");
    const sitemap = fs.readFileSync(path.join(repositoryRoot, "client/public/sitemap.xml"), "utf8");

    expect(pages).toContain('"@type": page.structuredType');
    expect(pages).toContain('link[rel="canonical"]');
    expect(pages).toContain("Google AdSense বিজ্ঞাপন চালু নেই");
    expect(home).toContain("গোপনীয়তা");
    expect(home).toContain("ব্যবহারের শর্ত");
    expect(home).toContain("থিসিস checklist");
    expect(home).toContain("site-footer__nav");
    for (const slug of ["privacy", "terms", "contact", "thesis-bijoy-checklist"]) {
      expect(sitemap).toContain(`https://avrojoy.vercel.app/${slug}`);
    }
  });
});
