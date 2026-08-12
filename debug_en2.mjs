import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import JSZip from "jszip";
import { build } from "esbuild";
await build({
  entryPoints: ["client/src/lib/converter.ts"], bundle: true, format: "esm",
  outfile: "/home/ubuntu/conv_vumika.mjs", platform: "browser", target: "es2022",
});
const mod = await import("/home/ubuntu/conv_vumika.mjs");
const NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const dom = new JSDOM("");
globalThis.DOMParser = dom.window.DOMParser;
globalThis.XMLSerializer = dom.window.XMLSerializer;
const raw = readFileSync("/home/ubuntu/upload/vumika.docx");
const file = new File([raw], "vumika.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
const res = await mod.convertFile(file, "u2b");
const zip = await JSZip.loadAsync(await res.blob.arrayBuffer());
const xml = await zip.file("word/document.xml").async("string");
const doc = new DOMParser().parseFromString(xml, "text/xml");
const runs = Array.from(doc.getElementsByTagNameNS(NS, "r"));
// ইংলিশ শব্দ প্রতিচ্ছন্নি: রানে থাকবে লোয়ার-কেস ইংলিশ বাড়ানো শব্দ
for (const r of runs) {
  const t = r.querySelector("t")?.textContent ?? "";
  if (/\b(the|and|of|is|are|this|that|has|have|with|from|will|not|but|was|were)\b/i.test(t) && !/[\u00C0-\u00FF]/.test(t) && !/[\u2020\u2021\u00B4\u00A8]/.test(t) && !/[\u0980-\u09FF]/.test(t)) {
    console.log(JSON.stringify(t.slice(0,40)), "=>", r.querySelector("rFonts")?.getAttribute("w:ascii"));
  }
}
