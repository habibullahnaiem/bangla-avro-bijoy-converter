import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import JSZip from "jszip";
import { build } from "esbuild";

await build({
  entryPoints: ["client/src/lib/converter.ts"],
  bundle: true, format: "esm", outfile: "/home/ubuntu/conv_vumika.mjs",
  platform: "browser", target: "es2022",
});
const mod = await import("/home/ubuntu/conv_vumika.mjs");

const NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const dom = new JSDOM("");
globalThis.DOMParser = dom.window.DOMParser;
globalThis.XMLSerializer = dom.window.XMLSerializer;

const raw = readFileSync("/home/ubuntu/upload/vumika.docx");
const zip = await JSZip.loadAsync(raw);
const origXml = await zip.file("word/document.xml").async("string");
const origDoc = new DOMParser().parseFromString(origXml, "text/xml");
const runs = Array.from(origDoc.getElementsByTagNameNS(NS, "r"));

// উৎসের শুধু-ইংলিশ রান কতগুলো
let enOnly = 0, enOnlyLen = 0;
for (const r of runs) {
  const t = r.querySelector("t")?.textContent ?? "";
  if (!t) continue;
  const hasLat = /[A-Za-z0-9]/.test(t);
  const hasBn = /[\u0980-\u09FF]/.test(t);
  if (hasLat && !hasBn && !/[\u00C0-\u00FF]/.test(t)) { enOnly++; enOnlyLen += t.length; }
}
console.log("উৎসের ASCII-ইংলিশ রান:", enOnly, "মোট লেন:", enOnlyLen);

// এখন কনভার্ট করে এই রানগুলো ট্র্যাক করি
const file = new File([raw], "vumika.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
const res = await mod.convertFile(file, "u2b");
const zip2 = await JSZip.loadAsync(await res.blob.arrayBuffer());
const outXml = await zip2.file("word/document.xml").async("string");
const outDoc = new DOMParser().parseFromString(outXml, "text/xml");
const outRuns = Array.from(outDoc.getElementsByTagNameNS(NS, "r"));
let bad = 0;
const samples = [];
for (const r of outRuns) {
  const t = r.querySelector("t")?.textContent ?? "";
  const f = r.querySelector("rFonts")?.getAttribute("w:ascii");
  // Bijoy-কোডে আউটপুট-ইংলিশ: লাটিন অক্ষর+ASCII পাংকচুয়েশন কিন্তু non-ASCII Latin (†‡) নেই
  const isAsciiEn = /[A-Za-z0-9]/.test(t) && !/[\u0980-\u09FF]/.test(t) && !/[\u00C0-\u00FF]/.test(t) && !/[\u2018\u2019\u201C\u201D\u2014]/.test(t);
  if (isAsciiEn && f !== "Times New Roman") { bad++; if (samples.length < 10) samples.push({t: t.slice(0,30), f}); }
}
console.log("আউটপুট ASCII-ইংলিশ রান যা TNR নয়:", bad);
samples.forEach(s => console.log(JSON.stringify(s.t), '=>', s.f));
