import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { mapSegmentsToBijoy } from "../client/src/lib/converter";

describe("mixed Bangla-English Bijoy preview segmentation", () => {
  it("keeps the English run as original Latin text while marking it for the Latin font", () => {
    const segments = mapSegmentsToBijoy("আমার English 42", "u2b");
    const latin = segments.filter((segment) => !segment.bangla);

    expect(latin).toEqual([{ text: "English 42", bangla: false }]);
    expect(segments.some((segment) => segment.bangla)).toBe(true);
  });

  it("pins the intended font family on each preview run instead of relying on mobile inheritance", () => {
    const home = fs.readFileSync(
      path.resolve(import.meta.dirname, "../client/src/pages/Home.tsx"),
      "utf8",
    );

    expect(home).toContain('const previewFontFamily = className.includes("seg-lat")');
    expect(home).toContain('fontFamily: previewFontFamily');
    expect(home).toContain('fontSynthesis: "none"');
  });

  it("caches the mobile Bijoy font through a readable request rather than an opaque no-CORS response", () => {
    const serviceWorker = fs.readFileSync(
      path.resolve(import.meta.dirname, "../client/public/sw.js"),
      "utf8",
    );
    const homepage = fs.readFileSync(
      path.resolve(import.meta.dirname, "../client/index.html"),
      "utf8",
    );

    expect(serviceWorker).toContain('new Request(url, { cache: "reload" })');
    expect(serviceWorker).not.toContain('mode: "no-cors"');
    expect(serviceWorker).toContain("await cache.put(request, response)");
    expect(homepage).toContain('as="font" href="/manus-storage/SutonnyMJ_danDi_v2_5618afeb.ttf"');
  });
});
