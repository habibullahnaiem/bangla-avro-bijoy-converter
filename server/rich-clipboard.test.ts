import { describe, expect, it } from "vitest";
import { buildRichBijoyClipboardHtml } from "../client/src/lib/richClipboard";

describe("Word-compatible mixed-language rich clipboard HTML", () => {
  const html = buildRichBijoyClipboardHtml(
    [
      { text: "¶&b ", bangla: true },
      { text: "Bangla 42", bangla: false },
    ],
    20,
    18,
  );

  it("pins Bengali Bijoy bytes to SutonnyMJ for Office paste destinations", () => {
    expect(html).toContain('lang="bn-BD"');
    expect(html).toContain("font-family:SutonnyMJ");
    expect(html).toContain("mso-fareast-font-family:SutonnyMJ");
    expect(html).toContain("mso-bidi-font-family:SutonnyMJ");
  });

  it("pins every English/number run to Times New Roman rather than inheriting SutonnyMJ", () => {
    expect(html).toContain('lang="en-US"');
    expect(html).toContain("font-family:'Times New Roman'");
    expect(html).toContain("mso-ascii-font-family:'Times New Roman'");
    expect(html).toContain("mso-hansi-font-family:'Times New Roman'");
    expect(html).toContain("Bangla 42");
    expect(html).not.toContain('<div style="font-family:SutonnyMJ');
  });

  it("escapes pasted text without changing the raw plain-text clipboard payload path", () => {
    const escaped = buildRichBijoyClipboardHtml(
      [{ text: "A < B & C", bangla: false }],
      20,
      18,
    );
    expect(escaped).toContain("A &lt; B &amp; C");
  });
});
