import { JSDOM } from "jsdom";
const dom = new JSDOM();
(globalThis as any).DOMParser = dom.window.DOMParser;
(globalThis as any).XMLSerializer = dom.window.XMLSerializer;
(globalThis as any).Document = dom.window.Document;
(globalThis as any).Element = dom.window.Element;
(globalThis as any).Node = dom.window.Node;

// ফুটনোট/ইন্ডনোট মার্ক-সাইজ পরীক্ষা — convertFile (u2b) কল করে
// সুপারস্ক্রিপ্ট রানের sz অপরিবর্তিত থাকা যাচাই করে।
import JSZip from "jszip";
import fs from "fs";
import { convertFile } from "./client/src/lib/converter";

async function main() {
  const buf = fs.readFileSync("/tmp/fn_test.docx");
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const file = new File([blob], "fn_test.docx", { type: blob.type });
  const result = await convertFile(file, "u2b");
  if (result.kind !== "docx") {
    console.error("unexpected result kind:", result.kind);
    process.exit(1);
  }
  const outBuf = new Uint8Array(await result.blob.arrayBuffer());
  const zip = await JSZip.loadAsync(outBuf);
  let superRunsWithoutSz = 0;
  let superRunsTotal = 0;
  for (const part of ["word/document.xml", "word/footnotes.xml"]) {
    const e = zip.file(part);
    if (!e) { console.log(part, "MISSING"); continue; }
    const xml = await e.async("string");
    console.log("=== " + part + " ===");
    const re = /<w:r>.*?<\/w:r>/gs;
    let m;
    while ((m = re.exec(xml)) !== null) {
      const r = m[0];
      const va = r.match(/<w:vertAlign w:val="(\w+)"/);
      const sz = r.match(/<w:sz w:val="(\d+)"/);
      const szCs = r.match(/<w:szCs w:val="(\d+)"/);
      const t = (r.match(/<w:t[^>]*>([^<]*)<\/w:t>/) ?? [])[1] ?? "(empty)";
      console.log(
        " run:",
        t.slice(0, 20),
        "| vertAlign:",
        va?.[1] ?? "-",
        "| sz:",
        sz?.[1] ?? "default",
        "| szCs:",
        szCs?.[1] ?? "default",
      );
      if (va) {
        superRunsTotal++;
        // ডিফল্ট ডক-সাইজ 12pt (24 হাফ-পয়েন্ট); সুপারস্ক্রিপ্টে সংকোচন থাকা
        // উচিত নয় — sz বসলে সেটা 24 হতে হবে।
        if (sz && Number(sz[1]) !== 24) {
          superRunsWithoutSz++;
          console.log("  ^^^ PROBLEM: superscript run size not equal to base 12pt");
        }
      }
    }
  }
  console.log("\n superscript runs:", superRunsTotal, "| wrong-sized:", superRunsWithoutSz);
  console.log("OUT BLOB SIZE:", result.blob.size, "| name:", result.name);
  // দৃশ্য যাচাইযের জন্য ডিস্কে রাখা — পরে LibreOffice-এ কনভার্ট করা যাবে
  fs.writeFileSync("/tmp/fn_test_bijoy.docx", new Uint8Array(await result.blob.arrayBuffer()));
}
main().catch((e) => { console.error(e); process.exit(1); });
