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
    expect(index).toContain('"name": "অভ্রজয় (AvroJoy)"');
    expect(index).toContain('"alternateName": ["অভ্রজয়", "AvroJoy", "avrojoy.vercel.app"]');
    expect(index).toContain('"@id": "https://avrojoy.vercel.app/#organization"');
    expect(guides).toContain('isPartOf: { "@id": `${BASE_URL}/#website` }');
    expect(guides).toContain('"@type": "BreadcrumbList"');
    expect(guides).toContain("অভ্রজয়ের মূল কনভার্টারে যান");
  });

  it("presents the Avro-to-Bijoy route as a people-first Unicode-to-Bijoy landing page", () => {
    const home = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/Home.tsx"), "utf8");
    const guides = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/SeoGuides.tsx"), "utf8");
    const styles = fs.readFileSync(path.join(repositoryRoot, "client/src/index.css"), "utf8");

    expect(guides).toContain("ইউনিকোড টু বিজয় কনভার্টার");
    expect(guides).toContain("ইউনিকোড টু বিজয় বলতে আধুনিক অভ্র/Unicode বাংলা লেখাকে");
    expect(guides).toContain("ইউনিকোড টু বিজয় করতে কী লাগবে?");
    expect(guides).toContain("কোন কাজে Unicode টু বিজয় দরকার হয়?");
    expect(guides).toContain("থিসিস ও গবেষণাপত্র");
    expect(guides).toContain("বই, জার্নাল ও DTP handoff");
    expect(guides).toContain("থিসিস বা Word file দেওয়ার আগে অভ্রজয়ের review method");
    expect(guides).toContain("এটি কোনো স্বয়ংক্রিয় নিখুঁততার guarantee নয়");
    expect(guides).toContain("Formatting-sensitive অংশ দেখুন");
    expect(guides).toContain("যুক্তাক্ষর, কারচিহ্ন বা যতিচিহ্ন রূপান্তরের পর কীভাবে যাচাই করব?");
    expect(guides).toContain("আমার লেখা কি server-এ পাঠানো বা সংরক্ষণ করা হয়?");
    expect(guides).toContain('"@type": "FAQPage"');
    expect(styles).toContain(".dark .seo-guide-page [class*=\"bg-card\"]");
    expect(styles).toContain("html:not(.dark) .seo-guide-page article p:not(.text-primary)");
    expect(home).toContain("ইউনিকোড টু বিজয় গাইড");
    expect(home).toContain('href="/avro-to-bijoy"');
    expect(styles).toContain("html:not(.dark) .seo-guide-page .text-foreground");
    expect(styles).toContain("explicit opaque foreground layer");
  });

  it("presents the Bijoy-to-Unicode route with exact Bengali intent and a source-aware review workflow", () => {
    const guides = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/SeoGuides.tsx"), "utf8");
    const prerenderer = fs.readFileSync(
      path.join(repositoryRoot, "vercel-static/scripts/prerender-guides.mjs"),
      "utf8",
    );

    expect(guides).toContain("বিজয় থেকে ইউনিকোড কনভার্টার");
    expect(guides).toContain("বিজয় টু ইউনিকোড");
    expect(guides).toContain("বিজয় টু ইউনিকোড করার আগে সংক্ষিপ্ত review method");
    expect(guides).toContain("ওয়েবসাইট ও সামাজিক মাধ্যমে পুনঃব্যবহার");
    expect(guides).toContain("রূপান্তরের ফল অর্থহীন বা ভাঙা দেখালে কী করব?");
    expect(prerenderer).toContain("বিজয় থেকে ইউনিকোড কনভার্টার");
    expect(prerenderer).toContain("বিজয় টু ইউনিকোড করার আগে সংক্ষিপ্ত review method");
    expect(prerenderer).toContain('aria-labelledby="use-cases-title"');
  });

  it("presents the DOCX and TXT route as a formatting-aware file-conversion guide", () => {
    const guides = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/SeoGuides.tsx"), "utf8");
    const prerenderer = fs.readFileSync(
      path.join(repositoryRoot, "vercel-static/scripts/prerender-guides.mjs"),
      "utf8",
    );

    expect(guides).toContain("DOCX বিজয় কনভার্টার");
    expect(guides).toContain("Word ফাইল বিজয় কনভার্টার");
    expect(guides).toContain("DOCX বিজয় কনভার্ট করার আগে file review method");
    expect(guides).toContain("Formatting-sensitive Word document");
    expect(guides).toContain("Bold, italic, table বা reference থাকা DOCX কীভাবে যাচাই করব?");
    expect(prerenderer).toContain("DOCX বিজয় কনভার্টার");
    expect(prerenderer).toContain("DOCX বিজয় কনভার্ট করার আগে file review method");
    expect(prerenderer).toContain("কোন DOCX/TXT কাজে file conversion দরকার হয়?");
  });
});
