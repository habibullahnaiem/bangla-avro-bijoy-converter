import { JSDOM } from "jsdom";
import JSZip from "jszip";
import fs from "fs";
import { convertFile, convertToBijoy, repairBijoyFontFile } from "./client/src/lib/converter";

const dom = new JSDOM();
(globalThis as any).DOMParser = dom.window.DOMParser;
(globalThis as any).XMLSerializer = dom.window.XMLSerializer;
(globalThis as any).Document = dom.window.Document;
(globalThis as any).Element = dom.window.Element;
(globalThis as any).Node = dom.window.Node;

const NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const CT = "http://schemas.openxmlformats.org/package/2006/content-types";
const REPORTED_NOTE_QUOTE_BIJOY = "ÔPuv‡`i eywS †PvL Av‡QÕ";

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
  <Override PartName="/word/endnotes.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml"/>
  <Override PartName="/word/footnotes.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml"/>
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
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rIdEndnotes" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes" Target="endnotes.xml"/>
  <Relationship Id="rIdFootnotes" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes" Target="footnotes.xml"/>
</Relationships>`,
  );
  zip.file(
    "word/styles.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<w:styles xmlns:w="${NS}">
  <w:docDefaults><w:rPrDefault><w:rPr><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:rPrDefault></w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
  <w:style w:type="paragraph" w:styleId="EndnoteText"><w:name w:val="endnote text"/><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="FootnoteText"><w:name w:val="footnote text"/><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:style>
  <w:style w:type="character" w:styleId="EndnoteReference"><w:name w:val="endnote reference"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:vertAlign w:val="superscript"/></w:rPr></w:style>
</w:styles>`,
  );
  zip.file(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="${NS}"><w:body>
  <w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>প্র, ল্ল, ত্ব, ক্ষ, জ্ঞ, শ্র, কৃষিভিত্তিক — English 2026</w:t></w:r>
  </w:p><w:sectPr/>
  <w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>টাকার দিকে।</w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>…</w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>ওদিকে তাকিয়ে</w:t></w:r>
  </w:p><w:sectPr/>
  <w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>এন্ডনোটসহ বাংলা বাক্য</w:t></w:r>
    <w:r><w:rPr><w:rStyle w:val="EndnoteReference"/><w:vertAlign w:val="superscript"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr><w:endnoteReference w:id="1"/></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t> এরপরও বাক্য আছে</w:t></w:r>
  </w:p><w:sectPr/>
  <w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>ফুটনোটসহ বাংলা বাক্য</w:t></w:r>
    <w:r><w:rPr><w:vertAlign w:val="superscript"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr><w:footnoteReference w:id="1"/></w:r>
  </w:p><w:sectPr/>
  <w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>বাংলা সূত্রে </w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>‘</w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>Discreditable Identity</w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t>’</w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/><w:sz w:val="28"/></w:rPr><w:t> প্রসঙ্গ।</w:t></w:r>
  </w:p><w:sectPr/>
</w:body></w:document>`,
  );
  zip.file(
    "word/endnotes.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:endnotes xmlns:w="${NS}">
  <w:endnote w:id="-1" w:type="separator"><w:p><w:r><w:separator/></w:r></w:p></w:endnote>
  <w:endnote w:id="0" w:type="continuationSeparator"><w:p><w:r><w:continuationSeparator/></w:r></w:p></w:endnote>
  <w:endnote w:id="1"><w:p><w:pPr><w:pStyle w:val="EndnoteText"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/></w:rPr><w:t>‘আল্লাহ’র এন্ডনোট’</w:t></w:r></w:p></w:endnote>
</w:endnotes>`,
  );
  zip.file(
    "word/footnotes.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:footnotes xmlns:w="${NS}">
  <w:footnote w:id="-1" w:type="separator"><w:p><w:r><w:separator/></w:r></w:p></w:footnote>
  <w:footnote w:id="0" w:type="continuationSeparator"><w:p><w:r><w:continuationSeparator/></w:r></w:p></w:footnote>
  <w:footnote w:id="1"><w:p><w:pPr><w:pStyle w:val="FootnoteText"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/></w:rPr><w:t>‘</w:t></w:r><w:r><w:rPr><w:rFonts w:ascii="Kalpurush" w:hAnsi="Kalpurush" w:cs="Kalpurush"/></w:rPr><w:t>চাঁদের বুঝি চোখ আছে’</w:t></w:r></w:p></w:footnote>
</w:footnotes>`,
  );
  return zip;
}

type ExpectedSizes = { banglaHalfPoints?: number; englishHalfPoints?: number };

function fontSlots(run: Element): string[] {
  const rPr = run.getElementsByTagNameNS(NS, "rPr")[0];
  const rFonts = rPr?.getElementsByTagNameNS(NS, "rFonts")[0];
  if (!rFonts) return [];
  return ["ascii", "hAnsi", "eastAsia", "cs"].map((key) =>
    rFonts.getAttribute(`w:${key}`) ?? rFonts.getAttributeNS(NS, key) ?? "",
  );
}

function assertFontSlots(run: Element, expected: string, label: string): void {
  const slots = fontSlots(run);
  if (slots.length !== 4 || slots.some((slot) => slot !== expected)) {
    throw new Error(`${label}: expected ${expected} in every font slot, got ${slots.join(", ") || "none"}`);
  }
}

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
    const isEnglishText = ["English 2026", "‘", "Discreditable Identity", "’"].includes(text);
    const expectedHalfPoints = isEnglishText ? expectedSizes.englishHalfPoints : expectedSizes.banglaHalfPoints;
    if (text && expectedHalfPoints !== undefined && sz !== String(expectedHalfPoints)) unexpectedSizeValues++;
    if (text) {
      const expectedFont = isEnglishText ? "Times New Roman" : "SutonnyMJ";
      if (fontSlots(run).some((value) => value !== expectedFont)) fontMismatch++;
    }
  }
  console.log(`${label}: runs=${runs.length}, mismatchedSizePairs=${mismatchedSizePairs}, fontMismatch=${fontMismatch}, unexpectedSizeValues=${unexpectedSizeValues}`);
  if (mismatchedSizePairs || fontMismatch || unexpectedSizeValues || runs.length < 2) {
    throw new Error(`${label}: DOCX run invariants failed`);
  }
}

async function inspectEnglishSmartQuoteDirection(path: string): Promise<void> {
  const zip = await JSZip.loadAsync(fs.readFileSync(path));
  const xml = await zip.file("word/document.xml")!.async("string");
  const document = new DOMParser().parseFromString(xml, "text/xml");
  const runs = Array.from(document.getElementsByTagNameNS(NS, "r"));
  const quotedTitleRuns = runs.filter((run) =>
    ["‘", "Discreditable Identity", "’"].includes(
      run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "",
    ),
  );
  const title = quotedTitleRuns
    .map((run) => run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "")
    .join("");
  if (title !== "‘Discreditable Identity’") {
    throw new Error(`English smart quotes lost their direction: ${title}`);
  }
  for (const run of quotedTitleRuns) {
    assertFontSlots(run, "Times New Roman", "English smart-quote title");
  }
  console.log("english-smart-quote-direction: passed");
}

async function inspectCanonicalRikarByte(path: string): Promise<void> {
  const zip = await JSZip.loadAsync(fs.readFileSync(path));
  const xml = await zip.file("word/document.xml")!.async("string");
  const document = new DOMParser().parseFromString(xml, "text/xml");
  const runs = Array.from(document.getElementsByTagNameNS(NS, "r"));
  const canonicalRun = runs.find((run) =>
    (run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "").includes("K…wlwfwËK"),
  );
  const legacyGapRun = runs.find((run) =>
    (run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "").includes("K„wlwfwËK"),
  );
  if (!canonicalRun || legacyGapRun) {
    throw new Error("DOCX R-kar did not use the canonical U+2026 SutonnyMJ byte");
  }
  assertFontSlots(canonicalRun, "SutonnyMJ", "canonical R-kar DOCX run");
  console.log("canonical-rikar-byte: passed");
}

async function inspectEndnoteHandling(path: string): Promise<void> {
  const zip = await JSZip.loadAsync(fs.readFileSync(path));
  const documentXml = await zip.file("word/document.xml")!.async("string");
  const endnotesXml = await zip.file("word/endnotes.xml")!.async("string");
  const footnotesXml = await zip.file("word/footnotes.xml")!.async("string");
  const stylesXml = await zip.file("word/styles.xml")!.async("string");
  const document = new DOMParser().parseFromString(documentXml, "text/xml");
  const endnotes = new DOMParser().parseFromString(endnotesXml, "text/xml");
  const footnotes = new DOMParser().parseFromString(footnotesXml, "text/xml");
  const styles = new DOMParser().parseFromString(stylesXml, "text/xml");
  const referenceRuns = Array.from(document.getElementsByTagNameNS(NS, "r")).filter(
    (run) => run.getElementsByTagNameNS(NS, "endnoteReference").length > 0,
  );
  if (referenceRuns.length !== 1) throw new Error(`endnote reference count mismatch: ${referenceRuns.length}`);
  const reference = referenceRuns[0];
  assertFontSlots(reference, "SutonnyMJ", "endnote reference");
  const precedingTextRun = reference.previousElementSibling;
  const trailingTextRun = reference.nextElementSibling;
  if (reference.getElementsByTagNameNS(NS, "t").length !== 0) {
    throw new Error("endnote reference marker absorbed ordinary text");
  }
  if (!precedingTextRun || precedingTextRun.localName !== "r") {
    throw new Error("text before the endnote reference was not preserved as its own run");
  }
  const precedingText = precedingTextRun.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "";
  if (!precedingText || precedingTextRun.getElementsByTagNameNS(NS, "endnoteReference").length > 0) {
    throw new Error("text before the endnote reference was absorbed into the marker run");
  }
  assertFontSlots(precedingTextRun, "SutonnyMJ", "text before endnote reference");
  if (!trailingTextRun || trailingTextRun.localName !== "r") {
    throw new Error("text after the endnote reference was not preserved as its own run");
  }
  const trailingText = trailingTextRun.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "";
  if (!trailingText || trailingTextRun.getElementsByTagNameNS(NS, "endnoteReference").length > 0) {
    throw new Error("trailing text was absorbed into the endnote reference run");
  }
  assertFontSlots(trailingTextRun, "SutonnyMJ", "trailing text after endnote reference");
  const referencePr = reference.getElementsByTagNameNS(NS, "rPr")[0];
  if (
    referencePr?.getElementsByTagNameNS(NS, "rStyle")[0]?.getAttributeNS(NS, "val") !== "EndnoteReference" ||
    referencePr.getElementsByTagNameNS(NS, "vertAlign")[0]?.getAttributeNS(NS, "val") !== "superscript"
  ) {
    throw new Error("endnote reference lost its Word superscript style");
  }
  const assertNormalizedNoteQuotes = (note: Document, label: "endnote" | "footnote") => {
    const bodyRuns = Array.from(note.getElementsByTagNameNS(NS, "r")).filter(
      (run) => (run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "").length > 0,
    );
    const joined = bodyRuns
      .map((run) => run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "")
      .join("");
    const sourceText =
      label === "endnote" ? "‘আল্লাহ’র এন্ডনোট’" : "‘চাঁদের বুঝি চোখ আছে’";
    const expectedQuoteBytes =
      label === "footnote" ? REPORTED_NOTE_QUOTE_BIJOY : convertToBijoy(sourceText);
    if (joined !== expectedQuoteBytes) {
      throw new Error(`${label} quote bytes changed: ${joined}`);
    }
    const openingQuote = bodyRuns.find((run) =>
      (run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "").startsWith("Ô"),
    );
    const closingQuote = bodyRuns.find((run) => {
      const text = run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "";
      if (!text.endsWith("Õ")) return false;
      const properties = run.getElementsByTagNameNS(NS, "rPr")[0];
      const fonts = properties?.getElementsByTagNameNS(NS, "rFonts")[0];
      return (
        properties?.getElementsByTagNameNS(NS, "cs").length === 1 &&
        fonts?.getAttributeNS(NS, "hint") === "cs"
      );
    });
    if (!openingQuote || !closingQuote) {
      throw new Error(`${label} quote markers were not isolated safely`);
    }
    const apostropheCount = Array.from(joined).filter((character) => character === "Õ").length;
    if (label === "endnote" && apostropheCount !== 2) {
      throw new Error(`endnote apostrophe byte was modified or lost: ${apostropheCount}`);
    }
    assertFontSlots(openingQuote, "SutonnyMJ", `${label} opening quote`);
    assertFontSlots(closingQuote, "SutonnyMJ", `${label} closing quote`);
    for (const [name, quoteRun] of [["opening", openingQuote], ["closing", closingQuote]] as const) {
      const properties = quoteRun.getElementsByTagNameNS(NS, "rPr")[0];
      const fonts = properties?.getElementsByTagNameNS(NS, "rFonts")[0];
      if (
        properties?.getElementsByTagNameNS(NS, "cs").length !== 1 ||
        fonts?.getAttributeNS(NS, "hint") !== "cs"
      ) {
        throw new Error(`${label} ${name} quote did not receive the Complex Script lock`);
      }
    }
    const openingSize = openingQuote
      .getElementsByTagNameNS(NS, "sz")[0]
      ?.getAttributeNS(NS, "val");
    const closingSize = closingQuote
      .getElementsByTagNameNS(NS, "sz")[0]
      ?.getAttributeNS(NS, "val");
    if (openingSize !== undefined || closingSize !== undefined) {
      throw new Error(`${label} quote sizes were unexpectedly overridden: ${openingSize}/${closingSize}`);
    }
    if (closingQuote.getElementsByTagNameNS(NS, "w").length !== 0) {
      throw new Error(`${label} closing quote retained the ineffective width override`);
    }
    if (label === "endnote") {
      const innerApostrophe = bodyRuns.find(
        (run) =>
          run !== closingQuote &&
          (run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "").includes("Õ"),
      );
      const innerApostropheSize = innerApostrophe
        ?.getElementsByTagNameNS(NS, "sz")[0]
        ?.getAttributeNS(NS, "val");
      if (innerApostropheSize !== undefined) {
        throw new Error(`word-internal endnote apostrophe received quote scaling: ${innerApostropheSize}`);
      }
    }
    if (/[\u0980-\u09FF]/.test(joined)) {
      throw new Error(`${label} body still contains Unicode Bengali after Bijoy conversion`);
    }
  };
  assertNormalizedNoteQuotes(endnotes, "endnote");
  assertNormalizedNoteQuotes(footnotes, "footnote");
  const endnoteReferenceStyle = Array.from(styles.getElementsByTagNameNS(NS, "style")).find(
    (style) => style.getAttributeNS(NS, "styleId") === "EndnoteReference",
  );
  const styleRunProperties = endnoteReferenceStyle
    ? Array.from(endnoteReferenceStyle.children).find((child) => child.localName === "rPr")
    : undefined;
  if (!styleRunProperties) throw new Error("EndnoteReference style is missing run properties");
  if (Array.from(styleRunProperties.children).some((child) => child.localName === "rFonts")) {
    throw new Error("EndnoteReference style retained a competing font override");
  }
  if (
    !Array.from(styleRunProperties.children).some(
      (child) =>
        child.localName === "vertAlign" &&
        (child.getAttributeNS(NS, "val") ?? child.getAttribute("w:val")) === "superscript",
    )
  ) {
    throw new Error("EndnoteReference style lost its superscript behavior");
  }
  console.log("endnote-reference-and-body: passed");
}

async function inspectBijoyFontRepair(): Promise<void> {
  const bijoyText = "mKvj‡ejv †_‡K Avwg †Zvgvi m‡½ K_v ewj|";
  const englishText = "English text must remain Times New Roman.";
  const zip = minimalDocx();
  const sourceXml = await zip.file("word/document.xml")!.async("string");
  const repairFixture = sourceXml.replace(
    "<w:sectPr/>",
    `<w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:lang w:val="bn-BD" w:eastAsia="bn-BD" w:bidi="bn-BD"/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr><w:t>${bijoyText}</w:t></w:r>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:lang w:val="en-US"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>${englishText}</w:t></w:r>
    </w:p><w:sectPr/>`,
  );
  zip.file("word/document.xml", repairFixture);
  const source = await zip.generateAsync({ type: "uint8array" });
  const input = new File([source], "damaged_bijoy.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const repaired = await repairBijoyFontFile(input);
  if (repaired.kind !== "docx") throw new Error("Expected DOCX repair result");

  const repairedZip = await JSZip.loadAsync(new Uint8Array(await repaired.blob.arrayBuffer()));
  const repairedXml = await repairedZip.file("word/document.xml")!.async("string");
  const document = new DOMParser().parseFromString(repairedXml, "text/xml");
  const textRuns = Array.from(document.getElementsByTagNameNS(NS, "r"));
  const repairedBijoyRun = textRuns.find(
    (run) => (run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "") === bijoyText,
  );
  const preservedEnglishRun = textRuns.find(
    (run) => (run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "") === englishText,
  );
  if (!repairedBijoyRun || !preservedEnglishRun) {
    throw new Error("repair fixture text runs were changed or lost");
  }
  assertFontSlots(repairedBijoyRun, "SutonnyMJ", "repaired high-confidence Bijoy run");
  assertFontSlots(preservedEnglishRun, "Times New Roman", "ordinary English repair control");
  const allText = Array.from(document.getElementsByTagNameNS(NS, "t"))
    .map((node) => node.textContent ?? "")
    .join("");
  if (!allText.includes(bijoyText) || !allText.includes(englishText)) {
    throw new Error("Bijoy font repair modified document text");
  }
  console.log("bijoy-font-repair: passed");
}

function rewriteRunSizes(xml: string, banglaHalfPoints: number, englishHalfPoints: number): string {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const runs = Array.from(doc.getElementsByTagNameNS(NS, "r"));
  for (const run of runs) {
    const text = run.getElementsByTagNameNS(NS, "t")[0]?.textContent ?? "";
    const rPr = run.getElementsByTagNameNS(NS, "rPr")[0];
    if (!rPr || !text) continue;
    const isEnglishText = ["English 2026", "‘", "Discreditable Identity", "’"].includes(text);
    const halfPoints = isEnglishText ? englishHalfPoints : banglaHalfPoints;
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
  await inspectDocx(outputPath, "converted-14pt-12pt", { banglaHalfPoints: 28, englishHalfPoints: 24 });
  await inspectEnglishSmartQuoteDirection(outputPath);
  await inspectCanonicalRikarByte(outputPath);
  await inspectEndnoteHandling(outputPath);
  await inspectBijoyFontRepair();

  const zip = await JSZip.loadAsync(output);
  const editedXml = await zip.file("word/document.xml")!.async("string");
  if (/<w:t(?:\s[^>]*)?>…<\/w:t>/.test(editedXml)) {
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
  await inspectDocx(editedPath, "simulated-indent-edit", { banglaHalfPoints: 28, englishHalfPoints: 24 });

  const sizeVariants = [
    { label: "10pt-8pt", banglaHalfPoints: 20, englishHalfPoints: 16 },
    { label: "16pt-14pt", banglaHalfPoints: 32, englishHalfPoints: 28 },
    { label: "18pt-16pt", banglaHalfPoints: 36, englishHalfPoints: 32 },
  ];
  for (const variant of sizeVariants) {
    const variantZip = await JSZip.loadAsync(output);
    const sourceXml = await variantZip.file("word/document.xml")!.async("string");
    const variantXml = rewriteRunSizes(sourceXml, variant.banglaHalfPoints, variant.englishHalfPoints);
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
