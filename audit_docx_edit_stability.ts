import { JSDOM } from "jsdom";
import JSZip from "jszip";
import fs from "fs";
import { convertFile } from "./client/src/lib/converter";

const dom = new JSDOM();
(globalThis as any).DOMParser = dom.window.DOMParser;
(globalThis as any).XMLSerializer = dom.window.XMLSerializer;
(globalThis as any).Document = dom.window.Document;
(globalThis as any).Element = dom.window.Element;
(globalThis as any).Node = dom.window.Node;

const NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const CT = "http://schemas.openxmlformats.org/package/2006/content-types";

function minimalDocx(): JSZip {
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="${CT}">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`,
  );
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
  );
  zip.file(
    "word/_rels/document.xml.rels",
    `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`,
  );
  zip.file(
    "word/styles.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<w:styles xmlns:w="${NS}">
  <w:docDefaults><w:rPrDefault><w:rPr><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:rPrDefault></w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
</w:styles>`,
  );
  zip.file(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="${NS}"><w:body>
  <w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>প্র, ল্ল, ত্ব, ক্ষ, জ্ঞ, শ্র — English 2026</w:t></w:r>
  </w:p><w:sectPr/>
  <w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>টাকার দিকে।</w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>…</w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>ওদিকে তাকিয়ে</w:t></w:r>
  </w:p><w:sectPr/>
</w:body></w:document>`,
  );
  return zip;
}

type ExpectedSizes = { banglaHalfPoints?: number; englishHalfPoints?: number };

async function inspectDocx(
  path: string,
  label: string,
  expectedSizes: ExpectedSizes = {},
): Promise<void> {
  const zip = await JSZip.loadAsync(fs.readFileSync(path));
  const xml = await zip.file("word/document.xml")!.async("string");
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const runs = Array.from(doc.getElementsByTagNameNS(NS, "r"));
  let mismatchedSizePairs = 0;
  let fontMismatch = 0;
  let unexpectedSizeValues = 0;
  for (const run of runs) {
    const text = run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "";
    const rPr = run.getElementsByTagNameNS(NS, "rPr")[0];
    if (!rPr) continue;
    const sz = rPr.getElementsByTagNameNS(NS, "sz")[0]?.getAttributeNS(NS, "val") ?? null;
    const szCs = rPr.getElementsByTagNameNS(NS, "szCs")[0]?.getAttributeNS(NS, "val") ?? null;
    if ((sz && !szCs) || (!sz && szCs) || (sz && szCs && sz !== szCs)) mismatchedSizePairs++;
    const expectedHalfPoints =
      text === "English 2026"
        ? expectedSizes.englishHalfPoints
        : expectedSizes.banglaHalfPoints;
    if (expectedHalfPoints !== undefined && sz !== String(expectedHalfPoints)) {
      unexpectedSizeValues++;
    }
    const rFonts = rPr.getElementsByTagNameNS(NS, "rFonts")[0];
    if (rFonts) {
      // Converted Bijoy is ASCII too, so ASCII-only detection cannot classify
      // it as English. This fixture keeps the known English segment explicit;
      // every other generated segment contains Bengali Bijoy output.
      const expected = text === "English 2026" ? "Times New Roman" : "SutonnyMJ";
      const attrs = ["ascii", "hAnsi", "eastAsia", "cs"].map((key) =>
        rFonts.getAttribute(`w:${key}`) ?? rFonts.getAttributeNS(NS, key),
      );
      if (attrs.some((value) => value !== expected)) fontMismatch++;
    }
  }
  console.log(
    `${label}: runs=${runs.length}, mismatchedSizePairs=${mismatchedSizePairs}, fontMismatch=${fontMismatch}, unexpectedSizeValues=${unexpectedSizeValues}`,
  );
  if (mismatchedSizePairs || fontMismatch || unexpectedSizeValues || runs.length < 2) {
    throw new Error(`${label}: DOCX run invariants failed`);
  }
}

function rewriteRunSizes(
  xml: string,
  banglaHalfPoints: number,
  englishHalfPoints: number,
): string {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const runs = Array.from(doc.getElementsByTagNameNS(NS, "r"));
  for (const run of runs) {
    const text = run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "";
    const rPr = run.getElementsByTagNameNS(NS, "rPr")[0];
    if (!rPr || !text) continue;
    const halfPoints = text === "English 2026" ? englishHalfPoints : banglaHalfPoints;
    const value = String(halfPoints);
    const sz = rPr.getElementsByTagNameNS(NS, "sz")[0];
    const szCs = rPr.getElementsByTagNameNS(NS, "szCs")[0];
    if (sz) sz.setAttributeNS(NS, "w:val", value);
    if (szCs) szCs.setAttributeNS(NS, "w:val", value);
  }
  return new XMLSerializer().serializeToString(doc);
}

async function main() {
  const source = await minimalDocx().generateAsync({ type: "uint8array" });
  const inputPath = "/tmp/avrojoy_edit_stability_input.docx";
  fs.writeFileSync(inputPath, source);
  const file = new File([source], "edit-stability.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const result = await convertFile(file, "u2b");
  if (result.kind !== "docx") throw new Error("Expected DOCX result");
  const output = new Uint8Array(await result.blob.arrayBuffer());
  const outputPath = "/tmp/avrojoy_edit_stability_bijoy.docx";
  fs.writeFileSync(outputPath, output);
  await inspectDocx(outputPath, "converted-14pt-12pt", {
    banglaHalfPoints: 28,
    englishHalfPoints: 24,
  });

  const zip = await JSZip.loadAsync(output);
  const editedXml = await zip.file("word/document.xml")!.async("string");
  if (editedXml.includes("…")) {
    throw new Error("standalone ellipsis run was not normalized before SutonnyMJ DOCX output");
  }
  const simulatedEdit = editedXml.replace(
    "</w:pStyle>",
    "</w:pStyle><w:ind w:left=\"720\"/><w:rPr><w:sz w:val=\"32\"/><w:szCs w:val=\"32\"/></w:rPr>",
  );
  zip.file("word/document.xml", simulatedEdit);
  const edited = await zip.generateAsync({ type: "uint8array" });
  const editedPath = "/tmp/avrojoy_edit_stability_simulated_edit.docx";
  fs.writeFileSync(editedPath, edited);
  await inspectDocx(editedPath, "simulated-indent-edit", {
    banglaHalfPoints: 28,
    englishHalfPoints: 24,
  });

  const sizeVariants = [
    { label: "10pt-8pt", banglaHalfPoints: 20, englishHalfPoints: 16 },
    { label: "16pt-14pt", banglaHalfPoints: 32, englishHalfPoints: 28 },
    { label: "18pt-16pt", banglaHalfPoints: 36, englishHalfPoints: 32 },
  ];
  for (const variant of sizeVariants) {
    const variantZip = await JSZip.loadAsync(output);
    const sourceXml = await variantZip.file("word/document.xml")!.async("string");
    const variantXml = rewriteRunSizes(
      sourceXml,
      variant.banglaHalfPoints,
      variant.englishHalfPoints,
    );
    variantZip.file("word/document.xml", variantXml);
    const variantOutput = await variantZip.generateAsync({ type: "uint8array" });
    const variantPath = `/tmp/avrojoy_edit_stability_${variant.label}.docx`;
    fs.writeFileSync(variantPath, variantOutput);
    await inspectDocx(variantPath, `alternate-${variant.label}`, variant);
  }
  console.log(`wrote ${outputPath} and ${editedPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
