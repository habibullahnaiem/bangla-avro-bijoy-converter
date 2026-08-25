import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..", "..");

describe("Vercel static copy boundaries", () => {
  it("keeps the public Home page free of authentication, tRPC, and cloud-document code", () => {
    const home = fs.readFileSync(path.join(projectRoot, "client/src/pages/Home.tsx"), "utf8");

    expect(home).not.toMatch(/useAuth|startLogin|trpc\.|storedDocuments|saveSelectedDocument/);
  });

  it("uses a static Vercel build with a public asset proxy", () => {
    const vercelConfig = fs.readFileSync(path.join(projectRoot, "vercel.json"), "utf8");

    expect(vercelConfig).toContain('"outputDirectory": "dist/public"');
    expect(vercelConfig).toContain('"source": "/manus-storage/(.*)"');
  });
});
