// ব্যবহারকারীর রিয়েল vumika.docx দিয়ে convertDocx পাইপলাইন পরীক্ষা —
// প্রত্যেক রান SutonnyMJ বা TNR হতে হবে, কোনো কালপুরষ থাকবে না,
// কনভার্ট-না-হওয়া বাংলা (উৎসে থাকলে) চেক, জিপ ভ্যালিড, Word ক্ষতি নেই।

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

const fonts = {};
let noFont = 0;
let badXmlAttr = 0;
let unconverted = 0;
let dariCount = 0;
let dariTnr = 0;

for (const r of runs) {
  const rf = r.querySelector("rFonts");
  const f = rf ? rf.getAttribute("w:ascii") : null;
  if (!f) noFont++;
  else fonts[f] = (fonts[f] || 0) + 1;
  if (r.hasAttribute("data-bijoy-split")) badXmlAttr++;
  const t = r.querySelector("t")?.textContent ?? "";
  // বিজয়-কোডে থাকা কাটা-না-হওয়া বাংলা (উৎস-বাংলা ক্যারেক্টার রেঞ্জ)
  if (/[\u0980-\u09FF]/.test(t)) unconverted++;
  if (t.includes("|") || t.includes("\\")) {
    dariCount++;
    if (f === "Times New Roman") dariTnr++;
  }
}

console.log("রান সংখ্যা:", runs.length);
console.log("ফন্ট ভাগ:", fonts);
console.log("ফন্ট-হীন রান:", noFont);
console.log("বাংলা-ক্যারেক্টার-ধারী (কনভার্ট-না-হওয়া) রান:", unconverted);
console.log("দাঁড়ি-ধারী রান:", dariCount, "| তার মধ্যে TNR:", dariTnr);
console.log("ডাউনলোড ফাইল:", res.name, res.kind, res.blob.size, "bytes");

// ইংরেজি-শুধু রান: কয়টা TNR হয়েছে
let enRuns = 0, enTnr = 0;
for (const r of runs) {
  const t = r.querySelector("t")?.textContent ?? "";
  if (/[A-Za-z]{2,}/.test(t) && !/[\u0980-\u09FF]/.test(t)) {
    enRuns++;
    if (r.querySelector("rFonts")?.getAttribute("w:ascii") === "Times New Roman") enTnr++;
  }
}
console.log(`ইংরেজি-ধারী রান: ${enRuns}, তার মধ্যে TNR: ${enTnr}`);

// জিপ সামগ্রিক ভ্যালিডিটি
let typesOk = false;
const ct = await zip.file("[Content_Types].xml").async("string");
typesOk = ct.includes("document.main+xml");
console.log("কনটেন্ট-টাইপস ঠিক:", typesOk);
console.log("\nফলাফল:", noFont === 0 && unconverted === 0 && dariTnr === 0 && enTnr === enRuns && badXmlAttr === 0 && typesOk ? "সব পাস" : "ফেইল");
