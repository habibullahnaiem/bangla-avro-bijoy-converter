import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("clipboard paste fallback", () => {
  const home = fs.readFileSync(
    path.resolve(import.meta.dirname, "../client/src/pages/Home.tsx"),
    "utf8",
  );

  it("keeps the existing programmatic clipboard path when available", () => {
    expect(home).toContain("navigator.clipboard?.readText?.()");
    expect(home).toContain('setInput((prev) => prev + text)');
  });

  it("focuses the editable textarea and gives native-paste guidance if access is denied", () => {
    expect(home).toContain("const inputEditorRef = useRef<HTMLTextAreaElement>(null)");
    expect(home).toContain("ref={inputEditorRef}");
    expect(home).toContain("focusManualPasteTarget();");
    expect(home).toContain("Ctrl+V / ⌘V");
    expect(home).toContain("চেপে ধরে Paste করুন");
  });
});
