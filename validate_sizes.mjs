// ডকুমেন্ট-সাইজ ভ্যালিডেশন: ইংলিশ/ল্যাটিন রান → w:sz = Bangla sz − 4 হাফ-পয়েন্ট (2pt কম)
// esbuild দিয়ে converter.ts বান্ডেল করে convertFile দিয়ে vumika.docx প্রক্রিয়া করা হয়।
import { execSync } from "node:child_process";
import fs from "node:fs";
import { JSDOM } from "jsdom";

// globals inject
const dom = new JSDOM("");
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.DOMParser = dom.window.DOMParser;
globalThis.XMLSerializer = dom.window.XMLSerializer;
globalThis.Element = dom.window.Element;
globalThis.Node = dom.window.Node;
globalThis.File = dom.window.File ?? class File { constructor(p, n) { this._p = p; this.name = n; } async arrayBuffer() { return Buffer.concat(this._p); } get type() { return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; } };
globalThis.Blob = globalThis.Blob || class Blob { constructor() {} };
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

// File.arrayBuffer needs real Uint8Array — rebuild:
globalThis.File = class File {
  constructor(parts, name) { this.parts = parts; this.name = name; this.type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; }
  async arrayBuffer() {
    const bufs = this.parts.map(p => Buffer.from(p));
    const total = bufs.reduce((a, b) => a + b.length, 0);
    const out = Buffer.alloc(total);
    let off = 0;
    for (const b of bufs) { b.copy(out, off); off += b.length; }
    return new Uint8Array(out).buffer;
  }
};

const out = execSync("npx esbuild client/src/lib/converter.ts --bundle --format=esm --platform=browser", { encoding: "utf8" });
fs.writeFileSync("/home/ubuntu/conv_sz.mjs", out);
const mod = await import("/home/ubuntu/conv_sz.mjs");
const fnName = Object.keys(mod).find(k => /convertFile/i.test(k));
const convertFile = mod[fnName];
console.log("export used:", fnName);

const data = fs.readFileSync("/home/ubuntu/vumika.docx");
const file = new File([data], "vumika.docx");
const res = await convertFile(file, "u2b");
const bytes = Buffer.from(await res.blob.arrayBuffer());
fs.writeFileSync("/home/ubuntu/vumika_bijoy_sized.docx", bytes);

// unzip document.xml and inspect
execSync("rm -rf /tmp/sz_check && mkdir -p /tmp/sz_check && cd /tmp/sz_check && unzip -o -q /home/ubuntu/vumika_bijoy_sized.docx");
const xml = fs.readFileSync("/tmp/sz_check/word/document.xml", "utf8");

// ডিফল্ট হাফ-পয়েন্ট
const def = /<w:docDefaults>.*?<w:sz w:val="(\d+)"/s.exec(xml);
const defHalf = def ? Number(def[1]) : 28;
console.log("ডিফল্ট sz (হাফ-পয়েন্ট):", defHalf, "= ", defHalf / 2, "pt");

// প্রতি রান: rFonts + sz (নিজস্ব)
const runs = /<w:r [^>]*>.*?<\/w:r>/gs.exec; // placeholder
let m;
const runRe = /<w:r(?: [^>]*)?>[\s\S]*?<\/w:r>/g;
let tnrWrong = 0, tnrCorrect = 0, sutonnyWrong = 0;
const issues = [];
let total = 0;
while ((m = runRe.exec(xml)) !== null) {
  const r = m[0];
  const fm = /<w:rFonts [^>]*w:ascii="([^"]+)"/.exec(r);
  const szm = /<w:sz(?:Cs)? w:val="(\d+)"/.exec(r);
  const tm = /<w:t[^>]*>([\s\S]*?)<\/w:t>/.exec(r);
  if (!fm || !tm) continue;
  total++;
  const font = fm[1];
  const txt = tm[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  const sz = szm ? Number(szm[1]) : null;
  if (font === "Times New Roman") {
    // ইংলিশ রানে sz থাকতে হবে এবং ডিফল্টের চেয়ে ৪ কম
    if (sz === null) { tnrWrong++; if (issues.length < 5) issues.push(`TNR নো-sz: "${txt.slice(0, 40)}"`); }
    else if (sz !== defHalf - 4) { tnrWrong++; if (issues.length < 5) issues.push(`TNR sz=${sz} (আশা ${defHalf - 4}): "${txt.slice(0, 40)}"`); }
    else tnrCorrect++;
  } else {
    // SutonnyMJ রানের নিজস্ব sz (লেখকের সাইজ/হাইলাইট) প্রিজার্ভ করা হয়
    // ডিফল্টের সাথে ভিন্ন হতেই পারে — এটা ভুল নয়
  }
}
console.log("মোট রান:", total, "| TNR সঠিক-সাইজ:", tnrCorrect, "| TNR ভুল/অনুপস্থিত:", tnrWrong, "| SutonnyMJ ভুল-সাইজ:", sutonnyWrong);
issues.forEach(i => console.log("  ISSUE:", i));
process.exit(tnrWrong + sutonnyWrong === 0 ? 0 : 1);
