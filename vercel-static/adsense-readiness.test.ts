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
    expect(home).toContain('href="/avrojoy-er-jonmokotha"');
    for (const slug of ["privacy", "terms", "contact", "thesis-bijoy-checklist"]) {
      expect(sitemap).toContain(`https://avrojoy.vercel.app/${slug}`);
    }
  });

  it("identifies the homepage as the primary AvroJoy website entity and keeps guides connected to it", () => {
    const index = fs.readFileSync(path.join(repositoryRoot, "client/index.html"), "utf8");
    const guides = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/SeoGuides.tsx"), "utf8");

    expect(index).toContain('"@type": "WebSite"');
    expect(index).toContain('"@id": "https://avrojoy.vercel.app/#website"');
    expect(index).toContain('"name": "অভ্রজয়"');
    expect(index).toContain('"alternateName": ["AvroJoy", "অভ্রজয়", "avrojoy.vercel.app"]');
    expect(guides).toContain('isPartOf: { "@id": `${BASE_URL}/#website` }');
    expect(guides).toContain("অভ্রজয়ের মূল কনভার্টারে যান");
  });

  it("presents the Avro-to-Bijoy route as a people-first Unicode-to-Bijoy landing page", () => {
    const home = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/Home.tsx"), "utf8");
    const guides = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/SeoGuides.tsx"), "utf8");
    const styles = fs.readFileSync(path.join(repositoryRoot, "client/src/index.css"), "utf8");

    expect(guides).toContain("ইউনিকোড টু বিজয় কনভার্টার");
    expect(guides).toContain("ইউনিকোড টু বিজয় বলতে আধুনিক অভ্র/Unicode বাংলা লেখাকে");
    expect(guides).toContain("ইউনিকোড টু বিজয় করতে কী লাগবে?");
    expect(home).toContain("ইউনিকোড টু বিজয় গাইড");
    expect(home).toContain('href="/avro-to-bijoy"');
    expect(styles).toContain("html:not(.dark) .seo-guide-page .text-foreground");
    expect(styles).toContain("explicit opaque foreground layer");
  });
});
