import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

describe("AvroJoy origin story discovery", () => {
  it("registers the public story route and connects it from the About card and footer", () => {
    const app = fs.readFileSync(path.join(repositoryRoot, "client/src/App.tsx"), "utf8");
    const home = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/Home.tsx"), "utf8");

    expect(app).toContain('path={"/avrojoy-er-jonmokotha"}');
    expect(home).toContain("অভ্রজয়ের জন্মকথা পড়ুন");
    expect(home).toContain("আমাদের গল্প");
    expect(home).toContain("অনুমতি ছাড়া এই সাইটের code, design বা content কপি/পুনঃপ্রকাশ নিষিদ্ধ।");
  });

  it("publishes Bengali Article metadata and a sitemap entry for the story", () => {
    const story = fs.readFileSync(path.join(repositoryRoot, "client/src/pages/AvroJoyStory.tsx"), "utf8");
    const sitemap = fs.readFileSync(path.join(repositoryRoot, "client/public/sitemap.xml"), "utf8");

    expect(story).toContain('"@type": "Article"');
    expect(story).toContain('link[rel="canonical"]');
    expect(story).toContain("মো. হাবিবুল্লাহ নাঈম");
    expect(sitemap).toContain("https://avrojoy.vercel.app/avrojoy-er-jonmokotha");
  });
});
