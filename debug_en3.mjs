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
// উৎসে দেখি ASCII ইংলিশ রান কী
const zip0 = await JSZip.loadAsync(raw);
const origXml = await zip0.file("word/document.xml").async("string");
const origDoc = new DOMParser().parseFromString(origXml, "text/xml");
const runs0 = Array.from(origDoc.getElementsByTagNameNS(NS, "r"));
for (const r of runs0) {
  const t = r.querySelector("t")?.textContent ?? "";
  if (/[A-Za-z]/.test(t) && !/[\u0980-\u09FF]/.test(t) && !/[\u00C0-\u00FF]/.test(t) && /^[ -~]+$/.test(t)) {
    console.log("SRC:", JSON.stringify(t));
  }
}
