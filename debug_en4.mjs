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
for (const r of doc.getElementsByTagNameNS(NS, "r")) {
  const t = r.querySelector("t")?.textContent ?? "";
  if (t.includes("demo writing")) {
    console.log(JSON.stringify(t), "=>", r.querySelector("rFonts")?.getAttribute("w:ascii"));
  }
}
// zipped output file
const buf = Buffer.from(await zip.generateAsync({type:"arraybuffer"}));
writeFileSync("/home/ubuntu/vumika_bijoy9.docx", buf);
console.log("saved");
function writeFileSync(p, b){ import("fs").then(fs=>fs.writeFileSync(p,b)); }
