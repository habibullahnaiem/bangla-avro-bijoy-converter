const { buildSync } = require("esbuild");
const fs = require("fs");
const { JSDOM } = require("jsdom");
const { DOMParser, XMLSerializer } = new JSDOM("").window;

buildSync({
  entryPoints: ["/home/ubuntu/bangla-avro-bijoy-converter/client/src/lib/converter.ts"],
  bundle: true, format: "cjs", outfile: "/home/ubuntu/conv_demo.cjs", conditions: ["browser"],
});
const lib = require("/home/ubuntu/conv_demo.cjs");
const convertFile = lib.convertFile;

const dom = new JSDOM("");
globalThis.DOMParser = dom.window.DOMParser;
globalThis.XMLSerializer = dom.window.XMLSerializer;

async function run() {
  const buf = fs.readFileSync("/home/ubuntu/upload/vumika.docx");
  const file = new File([buf], "vumika.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  const result = await convertFile(file, "u2b");
  const ab = await result.blob.arrayBuffer(); const out = Buffer.from(ab).toString("binary");
  const doc = new DOMParser().parseFromString(out, "text/xml");
  const runs = doc.getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "r");
  let demoFont = null, demoText = null;
  let wrong = 0;
  for (const r of runs) {
    const wt = r.getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "t");
    const text = wt.length ? wt[0].textContent : "";
    const rPr = r.getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "rFonts")[0];
    const font = rPr ? rPr.getAttribute("w:ascii") : null;
    if (text.includes("writing")) { demoFont = font; demoText = text; }
    // সত্যিকারের ইংরেজি শব্দ-ধারী রান (যেটা Bijoy-এ বাংলা-প্রতিলিপি নয়)
    // Bijoy-প্রতিলিপিতে বাংলা অক্ষর থাকবে না কিন্তু সুনতন্নী-কোডে ‡†¨ƒৱ৮৹ইত্যাদি থাকে — আমরা
    // সাধারণ ইংরেজি শব্দ (দীর্ঘ লাতিন) আর কোনো বাংলা-আকৃতি চরিত্র নেই এবাং স্পেস-সহ পাশের টেক্সট দেখি।
  }
  console.log("demo-run font:", demoFont, "| text:", JSON.stringify(demoText));
}
run().catch(e => { console.error(e); process.exit(1); });
