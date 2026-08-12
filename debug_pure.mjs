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
// শুধুমাত্র ASCII (0x20-0x7E) অক্ষর ধারী রান — এগুলো আসল ইংলিশ
const isPureAscii = t => /^[ -~]*$/.test(t) && t.length > 0;
let total = 0, tnr = 0;
for (const r of runs) {
  const t = r.querySelector("t")?.textContent ?? "";
  if (!isPureAscii(t)) continue;
  if (!/[A-Za-z0-9]/.test(t)) continue;
  total++;
  if (r.querySelector("rFonts")?.getAttribute("w:ascii") === "Times New Roman") tnr++;
}
console.log("পিওর-ASCII ইংলিশ রান:", total, "| TNR:", tnr);
