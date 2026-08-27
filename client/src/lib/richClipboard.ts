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

      return `<font face="${font}"><span lang="${lang}" style="${style}">${escapeHtml(segment.text)}</span></font>`;
    })
    .join("");

  // Defaulting the container to Times prevents a destination from applying
  // SutonnyMJ to a Latin run if it sanitizes a nested style. Bengali bytes still
  // always receive the explicit SutonnyMJ declaration above.
  return `<div style="font-family:'Times New Roman';mso-ascii-font-family:'Times New Roman';mso-hansi-font-family:'Times New Roman'">${parts}</div>`;
}

/**
 * Creates a browser-native rich selection and runs the user-initiated Copy
 * command. Chromium serializes this into the operating system's HTML clipboard
 * format (including the full fragment context) more reliably for desktop Word
 * than an async ClipboardItem containing only a text/html Blob.
 */
export function copyOfficeCompatibleRichHtml(html: string, plainText: string): boolean {
  if (typeof document === "undefined" || !document.body) return false;

  const holder = document.createElement("div");
  holder.contentEditable = "true";
  holder.setAttribute("aria-hidden", "true");
  holder.style.cssText =
    "position:fixed;left:-10000px;top:0;opacity:0;pointer-events:none;white-space:pre-wrap;";
  holder.innerHTML = html;
  document.body.appendChild(holder);

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(holder);
  selection?.removeAllRanges();
  selection?.addRange(range);

  let receivedClipboardEvent = false;
  const setOfficeClipboardPayload = (event: ClipboardEvent) => {
    if (!event.clipboardData) return;
    receivedClipboardEvent = true;
    event.preventDefault();
    event.clipboardData.setData("text/html", html);
    event.clipboardData.setData("text/plain", plainText);
  };

  document.addEventListener("copy", setOfficeClipboardPayload);
  try {
    const commandSucceeded = document.execCommand("copy");
    return commandSucceeded && receivedClipboardEvent;
  } catch {
    return false;
  } finally {
    document.removeEventListener("copy", setOfficeClipboardPayload);
    selection?.removeAllRanges();
    holder.remove();
  }
}
