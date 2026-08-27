import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const staticProjectRoot = import.meta.dirname;

describe("Vercel static copy boundaries", () => {
  it("keeps the shared public Home page free of authentication, tRPC, and cloud-document code", () => {
    const home = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/Home.tsx"), "utf8");

    expect(home).not.toMatch(/useAuth|startLogin|trpc\.|storedDocuments|saveSelectedDocument/);
  });

  it("states the homepage’s formatting-aware Word and mixed-text value proposition", () => {
    const home = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/Home.tsx"), "utf8");
    const homepage = fs.readFileSync(path.join(repositoryRoot, "client/index.html"), "utf8");

    expect(home).toContain("থিসিস, বই, রিপোর্ট বা Word-এর বাংলা লেখা বিজয়ে নিতে");
    expect(home).toContain("bold/italic, DOCX/TXT ও বাংলা–ইংরেজি mixed text");
    expect(home).toContain("SutonnyMJ–Times New Roman preview-তে ফল যাচাই করুন");
    expect(home).toContain("অভ্র/ইউনিকোড → বিজয়");
    expect(home).toContain("বিজয় → অভ্র/ইউনিকোড");
    expect(home).toContain("ইউনিকোড টু বিজয় ও অভ্র টু বিজয় কনভার্টার");
    expect(homepage).toContain("অভ্রজয় (AvroJoy) | ইউনিকোড টু বিজয় ও অভ্র টু বিজয় কনভার্টার");
    expect(homepage).toContain('data-route="home"');
    expect(homepage).toContain("ইউনিকোড টু বিজয় গাইড");
  });

  it("preloads the active compact hero artwork and uses WebP for the shared hero surfaces", () => {
    const homepage = fs.readFileSync(path.join(repositoryRoot, "client/index.html"), "utf8");
    const stylesheet = fs.readFileSync(path.join(repositoryRoot, "client/src/index.css"), "utf8");

    expect(homepage).toContain('href="/manus-storage/avrojoy-hero-v2-banner_32621bd4.webp"');
    expect(homepage).toContain('type="image/webp"');
    expect(homepage).toContain('as="font" href="/manus-storage/SutonnyMJ_danDi_v2_5618afeb.ttf"');
    expect(stylesheet).toContain("/manus-storage/avrojoy-hero-v2-banner_32621bd4.webp");
    expect(stylesheet).toContain("/manus-storage/bangla-converter-keyboard-background_6048064b.webp");
    expect(stylesheet).not.toContain("avrojoy-hero-v2-banner_b1dad7f4.png");
    expect(stylesheet).not.toContain("bangla-converter-keyboard-background_fad26d5c.png");
  });

  it("keeps the primary conversion routes clearly discoverable in the current sitemap", () => {
    const sitemap = fs.readFileSync(path.join(repositoryRoot, "client/public/sitemap.xml"), "utf8");

    expect(sitemap).toContain("https://avrojoy.vercel.app/");
    expect(sitemap).toContain("https://avrojoy.vercel.app/avro-to-bijoy");
    expect(sitemap).toContain("<lastmod>2026-08-26</lastmod>");
  });

  it("builds crawl-visible static HTML for the high-intent guide routes and existing thesis checklist", () => {
    const packageJson = fs.readFileSync(path.join(staticProjectRoot, "package.json"), "utf8");
    const prerenderer = fs.readFileSync(
      path.join(staticProjectRoot, "scripts/prerender-guides.mjs"),
      "utf8",
    );

    expect(packageJson).toContain("node scripts/prerender-guides.mjs");
    for (const slug of ["avro-to-bijoy", "bijoy-to-unicode", "docx-txt-bijoy-converter"]) {
      expect(prerenderer).toContain(`slug: "${slug}"`);
    }
    expect(prerenderer).toContain('"@type": "FAQPage"');
    expect(prerenderer).toContain('"@type": "BreadcrumbList"');
    expect(prerenderer).toContain('data-route="${guide.slug}"');
    expect(prerenderer).toContain("থিসিস বা Word file দেওয়ার আগে অভ্রজয়ের review method");
    expect(prerenderer).toContain('aria-labelledby="review-method-title"');
    expect(prerenderer).toContain('/<div id="root">[\\s\\S]*?<\\/div>/');
    expect(prerenderer).toContain('slug: "thesis-bijoy-checklist"');
    expect(prerenderer).toContain('data-route="${checklist.slug}"');
    expect(prerenderer).toContain('avrojoy-thesis-checklist-structured-data');
  });

  it("states AvroJoy as the root site identity rather than its hosting provider", () => {
    const homepage = fs.readFileSync(path.join(repositoryRoot, "client/index.html"), "utf8");
    const guides = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/SeoGuides.tsx"), "utf8");

    expect(homepage).toContain('"name": "অভ্রজয়"');
    expect(homepage).toContain('"@id": "https://avrojoy.vercel.app/#organization"');
    expect(homepage).toContain('<meta property="og:site_name" content="অভ্রজয়" />');
    expect(guides).toContain('"@type": "BreadcrumbList"');
    expect(guides).toContain('name: "অভ্রজয়"');
  });

  it("builds the Vercel static project from the shared root client and keeps the public asset proxy", () => {
    const viteConfig = fs.readFileSync(path.join(staticProjectRoot, "vite.config.ts"), "utf8");
    const vercelConfig = fs.readFileSync(path.join(staticProjectRoot, "vercel.json"), "utf8");

    expect(viteConfig).toContain('path.resolve(repositoryRoot, "client")');
    expect(vercelConfig).toContain('"outputDirectory": "dist/public"');
    expect(vercelConfig).toContain('"source": "/manus-storage/(.*)"');
  });
});
