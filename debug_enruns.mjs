import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import JSZip from "jszip";

await build({
  entryPoints: ["client/src/lib/converter.ts"],
  bundle: true,
  format: "esm",
  outfile: "/home/ubuntu/conv_vumika.mjs",
  platform: "browser",
  target: "es2022",
});
const mod = await import("/home/ubuntu/conv_vumika.mjs");

const NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const dom = new JSDOM("");
globalThis.DOMParser = dom.window.DOMParser;
globalThis.XMLSerializer = dom.window.XMLSerializer;

const raw = readFileSync("/home/ubuntu/upload/vumika.docx");
const file = new File([raw], "vumika.docx", {
  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
});

const res = await mod.convertFile(file, "u2b");
const zip = await JSZip.loadAsync(await res.blob.arrayBuffer());
const xml = await zip.file("word/document.xml").async("string");
const doc = new DOMParser().parseFromString(xml, "text/xml");
const runs = Array.from(doc.getElementsByTagNameNS(NS, "r"));

for (const r of runs) {
  const t = r.querySelector("t")?.textContent ?? "";
  const f = r.querySelector("rFonts")?.getAttribute("w:ascii");
  const hasEn = /[A-Za-z]{2,}/.test(t);
  const hasBn = /[\u0980-\u09FF]/.test(t);
  if (hasEn && !hasBn && f !== "Times New Roman") {
    console.log(JSON.stringify(t.slice(0, 40)), "=>", f, "|len:", t.length);
  }
}
