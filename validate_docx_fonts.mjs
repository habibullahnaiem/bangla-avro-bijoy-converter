// ডিওসিএক্স পাইপলাইন ফন্ট-ফিক্স ভ্যালিডেশন:
// converter.ts বান্ডল করে jsdom-এ চালাও — বাস্তব ডকের মত XML-এ
// ইংলিশ-শুধু (smart quotes/অ্যাপোস্ট্রফ/এম-ড্যাশ ধারী) রান TNR হয়েছে,
// বাংলা SutonnyMJ হয়েছে, মিশ্র রান স্প্লিট হয়েছে — সব পরীক্ষা।

import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import JSZip from "jszip";

await build({
  entryPoints: ["/home/ubuntu/bangla-avro-bijoy-converter/client/src/lib/converter.ts"],
  bundle: true,
  format: "esm",
  outfile: "/home/ubuntu/conv_test.mjs",
  platform: "browser",
  target: "es2022",
});
const mod = await import("/home/ubuntu/conv_test.mjs");

const NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

function makeDocXml(runs) {
  return (
    '<w:document xmlns:w="' +
    NS +
    '">' +
    "<w:body>" +
    "<w:p>" +
    runs
      .map(
        (r) =>
          `<w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/></w:rPr><w:t>${esc(r)}</w:t></w:r>`,
      )
      .join("") +
    "</w:p>" +
    "</w:body></w:document>"
  );
}
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// processDocXml কলে window-ভিত্তিক DOMParser/TextEncoder দরকার:
const dom = new JSDOM("");
globalThis.DOMParser = dom.window.DOMParser;
globalThis.XMLSerializer = dom.window.XMLSerializer;
globalThis.TextEncoder = TextEncoder;

// convertFile(File) কলে একটা মিনিমাল ডকস (docx zipped) বানিয়ে দিই
async function buildDoc(runs) {
  try {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
  zip.file("_rels/.rels", `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  zip.file("word/_rels/document.xml.rels", `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`);
  zip.file("word/document.xml", makeDocXml(runs));
  const buf = await zip.generateAsync({ type: "arraybuffer" });
  return new File([buf], "test.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  } catch (e) { results.push("buildDoc ERROR: " + (e.stack||e)); throw e; }
}

async function check(name, runs, expected) {
  const file = await buildDoc(runs);
  let result;
  try {
  result = await mod.convertFile(file, "u2b");
  } catch (e) {
    results.push(`${name} ERROR convertFile: ${e.stack || e}`);
    return false;
  }
  const zip = await JSZip.loadAsync(await result.blob.arrayBuffer());
  const xml = await zip.file("word/document.xml").async("string");
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const runsOut = Array.from(doc.getElementsByTagNameNS(NS, "r"));
  const fonts = runsOut.map((r) => {
    const rf = r.querySelector("rFonts");
    return (rf && rf.getAttribute("w:ascii")) || "(none)";
  });
  const flat = fonts.join("|");
  const pass = expected.every((e) => flat.includes(e)) && fonts.length >= expected.length;
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}` + (pass ? "" : ` got: ${fonts.join(",")}`));
  return pass;
}
// end check

const results = [];
let ok = true;
(async () => {
try {
// ফলাফল ধাপে ধাপে সংগ্রহ (async লুপ) — ok & Promise বাগ এড়াতে await দিয়ে কল করি
const runCheck = async (name, runs, expected) => { const p = await check(name, runs, expected); ok = ok && p; };

// 1) সাধারণ বাংলা — SutonnyMJ
await runCheck("বাংলা-শুধু", ["রেলগাড়ি"], ["SutonnyMJ"]);
// 2) ইংলিশ-শুধু — TNR
await runCheck("ইংলিশ-শুধু", ["The railway has a schedule:"], ["Times New Roman"]);
// 3) ইংলিশ + স্ট্রেইট অ্যাপোস্ট্রফ — TNR (আগে SutonnyMJ হয়ে যাওয়ার বাগ!)
await runCheck("ইংলিশ+অ্যাপোস্ট্রফ", ["It's a test"], ["Times New Roman"]);
// 4) ইংলিশ + curly অ্যাপোস্ট্রফ U+2019 — TNR (বাগ-কেস!)
await runCheck("ইংলিশ+curly apo", ["It\u2019s here"], ["Times New Roman"]);
// 5) ইংলিশ + smart কোট — TNR (বাগ-কেস!)
await runCheck("ইংলিশ+smart quotes", ["\u201CHello world\u201D"], ["Times New Roman"]);
// 6) ইংলিশ + এম-ড্যাশ — TNR (বাগ-কেস!)
await runCheck("ইংলিশ+em-dash", ["test \u2014 more"], ["Times New Roman"]);
// 7) ইংলিশ + সংখ্যা — TNR
await runCheck("ইংলিশ+নম্বর", ["12:45 AM."], ["Times New Roman"]);
// 8) বাংলা + ইংলিশ মিশ্র — স্প্লিট: SutonnyMJ|TNR
await runCheck("মিশ্র বাংলা+ইং", ["রেল schedule 12:45"], ["SutonnyMJ", "Times New Roman"]);
// 9) দাঁড়ি-শুধু রান, পরে বাংলা — SutonnyMJ
await runCheck("দাঁড়ি-পরে-বাংলা", ["।", "এটা টেস্ট"], ["SutonnyMJ", "SutonnyMJ"]);
// 10) দাঁড়ি-শুধু রান, পরে ইংলিশ — TNR
await runCheck("দাঁড়ি-পরে-ইংলিশ", ["।", "A sample sentence"], ["Times New Roman", "Times New Roman"]);
// 11) শুধু স্পেস (পরে বাংলা) — SutonnyMJ
await runCheck("স্পেস-পরে-বাংলা", [" ", "নম্বর ৫"], ["SutonnyMJ", "SutonnyMJ"]);
// 12) শুধু স্পেস (পরে ইংলিশ) — TNR
await runCheck("স্পেস-পরে-ইং", [" ", "Hello there"], ["Times New Roman", "Times New Roman"]);
// 13) বাংলা + ইংলিশ একই রানে মিশ্র (রান-স্প্লিট পাস)
await runCheck("মিশ্র পরপর", ["রেলের schedule", "AM"], ["SutonnyMJ", "Times New Roman"]);

} catch (err) {
  results.push("ERROR: " + (err && err.stack ? err.stack : err));
  ok = false;
}
const out = results.join("\n") + (ok ? "\n\nসব টেস্ট পাস" : "\n\nকিছু টেস্ট ফেইল");
console.log(out);
writeFileSync("/home/ubuntu/validate_results.txt", out);
process.exit(ok ? 0 : 1);
})();
