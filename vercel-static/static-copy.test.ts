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

    expect(home).toContain("থিসিস, বই, রিপোর্ট বা Word-এর বাংলা লেখা বিজয়ে নিতে");
    expect(home).toContain("bold/italic, DOCX/TXT ও বাংলা–ইংরেজি mixed text");
    expect(home).toContain("SutonnyMJ–Times New Roman preview-তে ফল যাচাই করুন");
    expect(home).toContain("অভ্র/ইউনিকোড → বিজয়");
    expect(home).toContain("বিজয় → অভ্র/ইউনিকোড");
  });

  it("keeps the primary conversion routes clearly discoverable in the current sitemap", () => {
    const sitemap = fs.readFileSync(path.join(repositoryRoot, "client/public/sitemap.xml"), "utf8");

    expect(sitemap).toContain("https://avrojoy.vercel.app/");
    expect(sitemap).toContain("https://avrojoy.vercel.app/avro-to-bijoy");
    expect(sitemap).toContain("<lastmod>2026-08-26</lastmod>");
  });

  it("builds crawl-visible static HTML for the high-intent guide routes", () => {
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
  });

  it("states AvroJoy as the root site identity rather than its hosting provider", () => {
    const homepage = fs.readFileSync(path.join(repositoryRoot, "client/index.html"), "utf8");
    const guides = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/SeoGuides.tsx"), "utf8");

    expect(homepage).toContain('"name": "অভ্রজয় (AvroJoy)"');
    expect(homepage).toContain('"@id": "https://avrojoy.vercel.app/#organization"');
    expect(homepage).toContain('<meta property="og:site_name" content="অভ্রজয় (AvroJoy)" />');
    expect(guides).toContain('"@type": "BreadcrumbList"');
    expect(guides).toContain('name: "অভ্রজয় (AvroJoy)"');
  });

  it("builds the Vercel static project from the shared root client and keeps the public asset proxy", () => {
    const viteConfig = fs.readFileSync(path.join(staticProjectRoot, "vite.config.ts"), "utf8");
    const vercelConfig = fs.readFileSync(path.join(staticProjectRoot, "vercel.json"), "utf8");

    expect(viteConfig).toContain('path.resolve(repositoryRoot, "client")');
    expect(vercelConfig).toContain('"outputDirectory": "dist/public"');
    expect(vercelConfig).toContain('"source": "/manus-storage/(.*)"');
  });
});
