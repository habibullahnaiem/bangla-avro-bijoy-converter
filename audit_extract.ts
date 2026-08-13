// extractTextFrom paragraph-break test: builds a real .docx via JSZip and calls extractTextFrom.
import { JSDOM } from "jsdom";
import JSZip from "jszip";
import { extractTextFrom } from "./client/src/lib/converter";

const xml = `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
<w:p><w:r><w:t>রাজশাহী</w:t></w:r><w:r><w:t>বিশ্ববিদ্যালয়</w:t></w:r></w:p>
<w:p><w:r><w:t>বাংলা</w:t></w:r><w:r><w:t>বিভাগ।</w:t></w:r></w:p>
<w:p><w:r><w:t>The quick brown</w:t></w:r><w:r><w:t>fox.</w:t></w:r><w:r><w:br/></w:r><w:r><w:t>Next line.</w:t></w:r></w:p>
<w:sectPr/>
</w:body></w:document>`;

async function main() {
  const dom = new JSDOM("");
  if (!(globalThis as any).DOMParser) (globalThis as any).DOMParser = dom.window.DOMParser;
  const zip = new JSZip();
  zip.file("word/document.xml", xml);
  const buf = await zip.generateAsync({ type: "arraybuffer" });
  const file = new (dom.window as any).File([buf], "t.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  const out = await extractTextFrom(file as unknown as File);
  console.log("EXTRACT RESULT:");
  console.log(JSON.stringify(out));
  const lines = out.split("\n");
  console.log("paragraphs:", lines.length, "(expect 5: 4 lines + trailing \n)");
  const p1 = out.startsWith("রাজশাহী বিশ্ববিদ্যালয়\n");
  const p2 = out.includes("বাংলা বিভাগ।\n");
  const p3 = out.includes("The quick brown fox.\nNext line.");
  const p4 = out.includes("Next line.");
  console.log("p1 ok:", p1, "| p2 ok:", p2, "| p3 ok:", p3, "| p4 (after br) ok:", p4);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
