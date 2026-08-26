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

  it("builds the Vercel static project from the shared root client and keeps the public asset proxy", () => {
    const viteConfig = fs.readFileSync(path.join(staticProjectRoot, "vite.config.ts"), "utf8");
    const vercelConfig = fs.readFileSync(path.join(staticProjectRoot, "vercel.json"), "utf8");

    expect(viteConfig).toContain('path.resolve(repositoryRoot, "client")');
    expect(vercelConfig).toContain('"outputDirectory": "dist/public"');
    expect(vercelConfig).toContain('"source": "/manus-storage/(.*)"');
  });
});
