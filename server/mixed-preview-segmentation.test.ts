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
});
