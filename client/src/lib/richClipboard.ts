export type ClipboardTextSegment = {
  text: string;
  bangla: boolean;
};

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

/**
 * Builds HTML for Office/Word clipboard consumers. Every run carries a direct
 * font declaration plus the Microsoft Office aliases; relying on a parent
 * SutonnyMJ declaration causes Latin source letters to render as Bijoy glyphs
 * in some paste destinations.
 */
export function buildRichBijoyClipboardHtml(
  segments: ClipboardTextSegment[],
  banglaPx: number,
  latinPx: number,
): string {
  const parts = segments
    .map((segment) => {
      const font = segment.bangla ? "SutonnyMJ" : "'Times New Roman'";
      const lang = segment.bangla ? "bn-BD" : "en-US";
      const size = segment.bangla ? banglaPx : latinPx;
      const style = [
        `font-family:${font}`,
        `mso-ascii-font-family:${font}`,
        `mso-hansi-font-family:${font}`,
        `mso-fareast-font-family:${font}`,
        `mso-bidi-font-family:${font}`,
        `font-size:${size}px`,
      ].join(";");

      return `<span lang="${lang}" style="${style}">${escapeHtml(segment.text)}</span>`;
    })
    .join("");

  // Defaulting the container to Times prevents a destination from applying
  // SutonnyMJ to a Latin run if it sanitizes a nested style. Bengali bytes still
  // always receive the explicit SutonnyMJ declaration above.
  return `<div style="font-family:'Times New Roman';mso-ascii-font-family:'Times New Roman';mso-hansi-font-family:'Times New Roman'">${parts}</div>`;
}
