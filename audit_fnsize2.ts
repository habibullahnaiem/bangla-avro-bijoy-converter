// ফুটনোট মার্ক-সাইজ রাউন্ড-২ পরীক্ষা — তিন ধরনের মার্কের আউটপুট রান
// (নেটিভ footnoteReference, ম্যানুয়াল bn-ডিজিট, ম্যানুয়াল ASCII ডিজিট)
// টেক্সট/ফন্ট/সাইজ রিপোর্ট করে ও কনভার্টেড ডক ডিস্কে রাখে।
import { JSDOM } from "jsdom";
const dom = new JSDOM();
(globalThis as any).DOMParser = dom.window.DOMParser;
(globalThis as any).XMLSerializer = dom.window.XMLSerializer;
(globalThis as any).Document = dom.window.Document;
(globalThis as any).Element = dom.window.Element;
(globalThis as any).Node = dom.window.Node;

import JSZip from "jszip";
import fs from "fs";
import { convertFile } from "./client/src/lib/converter";

async function main() {
  const buf = fs.readFileSync("/tmp/fn_test2.docx");
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const file = new File([blob], "fn_test2.docx", { type: blob.type });
  const result = await convertFile(file, "u2b");
  if (result.kind !== "docx") {
    console.error("unexpected result kind:", result.kind);
    process.exit(1);
  }
  const outBuf = new Uint8Array(await result.blob.arrayBuffer());
  fs.writeFileSync("/tmp/fn_test2_bijoy.docx", outBuf);
  const zip = await JSZip.loadAsync(outBuf);
  for (const part of ["word/document.xml"]) {
    const xml = await zip.file(part)!.async("string");
    const re = /<w:r>.*?<\/w:r>/gs;
    let m;
    while ((m = re.exec(xml)) !== null) {
      const r = m[0];
      const isRef = /<w:footnoteReference/.test(r);
      const style = r.match(/<w:rStyle w:val="(\w+)"/);
      const va = r.match(/<w:vertAlign w:val="(\w+)"/);
      const sz = r.match(/<w:sz w:val="(\d+)"/);
      const rf = r.match(/<w:rFonts[^>]*cs="(\w[^"]*)"/);
      const t = (r.match(/<w:t[^>]*>([^<]*)<\/w:t>/) ?? [])[1] ?? "(empty)";
      console.log(
        [" ref:", isRef ? "YES" : "no ",
         " style:", style?.[1] ?? "-",
         " super:", va?.[1] ?? "-",
         " sz:", sz?.[1] ?? "def",
         " cs:", rf?.[1] ?? "?",
         " txt:", JSON.stringify(t.slice(0, 24))].join(""),
      );
    }
  }
  console.log("saved /tmp/fn_test2_bijoy.docx", result.blob.size);
}
main().catch((e) => { console.error(e); process.exit(1); });
