/*
 * ডিজাইন দিক: টিল ডেস্ক — কনভার্টার ইঞ্জিন
 * অভ্র/ইউনিকোড ⇄ বিজয় (সুতন্নী এমজে) রূপান্তর পরিষেবা।
 * ইনপুট ফন্ট: সোলাইমান লিপি / কালপুরুষ (হিন্দ সিলিগুড়ি দিয়ে প্রিভিউ)
 * আউটপুট ফন্ট: SutonnyMJ (@font-face দিয়ে সাইটে এম্বেড করা হয়েছে);
 * ইংরেজি অংশে Times New Roman ফলব্যাক।
 *
 * যুক্তবর্ণ নিয়ম: ন্ত, ল্ল, য়, ড়, ঢ়, র-ফলা, রেফ, জ্ঞ, ক্ষ, শ্র — কোনো ভাঙন নেই।
 * বিরামচিহ্ন নিয়ম (ফন্ট-গ্লিফ স্ক্যান করে যাচাইকৃত — SutonnyMJ_real.ttf):
 *   । → | (U+007C) — সুনতন্নীতে সোজা একটা লাইন গ্লিফ (canonical dari)
 *   ॥ → \\ (U+005C) — সুনতন্নীতে ডাবল-দারি গ্লিফ
 *   [ ] → আপনা আপনা (U+005B/U+005D — ফন্টে সঠিক ব্র্যাকেট গ্লিফ আছে)
 *   , ; ! ?        → আপনা আপনা স্থানেই থাকে
 *   “ ” → Ò Ó      — ইনভার্টেড কোয়াট সঠিক "66"/"99" গ্লিফে
 *   ‘ ’ → Ô Õ      — সিংগেল ইনভার্টেড কোয়াট
 *   — → Ñ          — এম-ড্যাশ র-এর মতো লাগবে না, সঠিক ড্যাশ গ্লিফ দেখাবে
 */
import {
  unicodeToBijoy as libUnicodeToBijoy,
  bijoyToUnicode as libBijoyToUnicode,
} from "@abdalgolabs/ansi-unicode-converter";

export type ConvertDirection = "u2b" | "b2u";

/* ── বিরামচিহ্ন প্রি-প্রসেস (u2b) ─────────────────────────────
 * বিরামচিহ্নগুলো বিজয়-লাইব্রেরিয়ার আগেই বিজয়-কোডে (Ò Ó Ô Õ Ñ) নেওয়া হয়।
 * কারণ: লাইব্রেরি ' বা " সোজা পাস-থ্রু করে (যেগুলো সুতন্নীতে হ/অন্যর মতো
 * গ্লিফ)। লাইব্রেরি ইতোমধ্যে । কে '|'-তে (U+007C — সুনতন্নীতে সোজা দাঁড়ি)
 * বদলায় এবং [ ] ( ) সঠিক কোডেই রাখে — তাই প্রি-ম্যাপে দাঁড়ি/ব্র্যাকেট টাচ না
 * করে শুধু উদ্ধৃতি ও ড্যাশ ফিক্স করা হয়।
 */
function preMapPunctuation(s: string): string {
  const map: Record<string, string> = {
    // দাঁড়ি ও ব্র্যাকেট লাইব্রেরি সঠিকভাবেই | (U+007C), [ ] (U+005B/U+005D)
    // কোডে রাখে — এখানে পরিবর্তন করা হয় না।
    "\u2014": "\u00D1", // em-dash
    "\u0965": "\uE001", // ॥ ডাবল-দারি — প্লেসহোল্ডার (লাইব্রেরি \\ কে ॥ বদলায় — পরে বসানো হবে)
    "\u2013": "\u00D1", // en-dash — একই ড্যাশ গ্লিফ
    "\u201C": "\u00D2", // “ open double
    "\u201D": "\u00D3", // ” close double
    "\u2018": "\u00D4", // ‘ open single
    "\u2019": "\u00D5", // ’ close single / apostrophe
  };
  let out = "";
  let open = true;
  for (const ch of s) {
    if (ch === '"') {
      // সোজা দুই উদ্ধৃতি — প্রসঙ্গ অনুযায়ী “/” গ্লিফে
      out += open ? "\u00D2" : "\u00D3";
      open = !open;
    } else if (ch === "'") {
      // সোজা এক উদ্ধৃতি/অ্যাপোস্ট্রফি — হ-এর মতো গ্লিফ না, বেঁকে-যাওয়া টিক Õ
      out += "\u00D5";
    } else if (map[ch]) {
      out += map[ch];
    } else {
      out += ch;
    }
  }
  return out;
}

export function convertToBijoy(text: string): string {
  // বিরামচিহ্ন প্রথমে বিজয়-কোডে → তারপর বাংলা অক্ষর লাইব্রেরি দিয়ে
  // প্লেসহোল্ডার U+E001 → \\ \\ (ডাবল-দারি) বসানো হয় লাইব্রেরির পরে
  return libUnicodeToBijoy(preMapPunctuation(text)).replace(/\uE001/g, "\u005C\u005C");
}

export function convertToUnicode(text: string): string {
  let r = libBijoyToUnicode(text);
  // বিপরীত দিকেও সাংকেতিক কোডপয়েন্টগুলো নর্মালাইজ করা।
  // লাইব্রেরি ইতোমধ্যে Ò→“ Õ→’ Ñ→— রাউন্ড-ট্রিপ করে।
  // সুনতন্নীতে \\ (U+005C) = ডাবল-দারি — হাতে বিজয়-থেকে বাংলায় বদলাও।
  // লাইব্রেরি | কে । তে বদলায় না — একক দাঁড়িও হাতে বদলাও।
  r = r.replace(/\u005C{2}/g, "॥").replace(/\u005C/g, "॥");
  r = r.replace(/\u007C/g, "।");
  // প্লেসহোল্ডার (যদি কোনো বিজয় টেক্সটে U+E001 এসে থাকে)
  r = r.replace(/\uE001/g, "॥");
  return r;
}

export function convert(text: string, direction: ConvertDirection): string {
  if (direction === "u2b") return convertToBijoy(text);
  return convertToUnicode(text);
}

/* ── ফাইল কনভার্টার: TXT / DOCX ─────────────────────────────── */
import JSZip from "jszip";

export type FileConvertResult =
  | { kind: "txt"; blob: Blob; name: string }
  | { kind: "docx"; blob: Blob; name: string };

export async function convertFile(
  file: File,
  direction: ConvertDirection,
): Promise<FileConvertResult> {
  const name = file.name.replace(/\.(docx|txt)$/i, "");
  if (file.name.toLowerCase().endsWith(".docx")) {
    const blob = await convertDocx(file, direction);
    return { kind: "docx", blob, name: `${name}_bijoy.docx` };
  }
  // TXT ও অন্যান্য টেক্সট ফরম্যাট
  const raw = await file.text();
  const converted = convert(raw, direction);
  // সুতন্নী এমজে ANSI ফন্ট — windows-1252 এনকোডিংয়ে ডাউনলোড
  const encoder = new TextEncoder(); // UTF-8 first, then encode to windows-1252 via manual map
  const bytes = toWindows1252(converted);
  const blob = new Blob([bytes], {
    type: "text/plain;charset=windows-1252",
  });
  return { kind: "txt", blob, name: `${name}_bijoy.txt` };
}

/** UTF-8 → windows-1252 বাইট (0x00–0xFF); রেঞ্জের বাইরে হলে `?` */
function toWindows1252(text: string): Uint8Array {
  const out = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    out[i] = code < 256 ? code : code >= 0x0100 && code <= 0x20ac ? 0x3f : 0x3f;
  }
  return out;
}

/* ── DOCX রূপান্তর: XML সরাসরি হাঁটা → ফরম্যাটিং অক্ষুণ্ণ ───── */
async function convertDocx(
  file: File,
  direction: ConvertDirection,
): Promise<Blob> {
  const buffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  const convertFn = (t: string) => convert(t, direction);

  // যেসব পার্টে টেক্সট থাকে
  const parts = [
    "word/document.xml",
    "word/header1.xml",
    "word/header2.xml",
    "word/header3.xml",
    "word/footer1.xml",
    "word/footer2.xml",
    "word/footer3.xml",
    "word/footnotes.xml",
    "word/endnotes.xml",
  ];

  for (const partPath of parts) {
    const entry = zip.file(partPath);
    if (!entry) continue;
    const xml = await entry.async("string");
    // Word কখনও কখনও ডকে অবৈধ XML কন্ট্রোল ক্যারেক্টার রাখে (0x03, 0x1F ইত্যাদি)।
    // DOMParser এতে থ্রো করে আর ওয়ার্ডও সেরকম ডক খুলতে পারে না — তাই পার্সের
    // আগেই পুরো XML স্ট্রিং থেকে অবৈধ ক্যারেক্টার সরানো হয়। ট্যাব (0x09), ক্যারেজ
    // রিটার্ন (0x0D) ও লাইনফিড (0x0A) বৈধ XML ক্যারেক্টার, রাখা হয়।
    const cleanXml = stripIllegalXmlChars(xml);
    const convertedXml = processDocXml(cleanXml, convertFn);
    zip.file(partPath, convertedXml);
  }

  const blob = await zip.generateAsync({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  return blob;
}

/**
 * document.xml / footnotes.xml / header-footer: প্রতিটি <w:t> টেক্সট নোডের
 * কনটেন্ট রূপান্তর করে এবং ফন্ট-হিন্ট সেট করে। <w:b>, <w:i>, স্টাইল,
 * ফুটনোট রেফারেন্স — সব অক্ষুণ্ণ থাকে।
 */
function processDocXml(xml: string, convertFn: (t: string) => string): string {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

  // প্রথম পাস: টেক্সট রূপান্তর — যেসব <w:t>-তে বাংলা বা বিরামচিহ্ন আছে
  const textNodes = Array.from(doc.getElementsByTagNameNS(ns, "t"));
  const runPlans: {
    run: Element;
    text: string;
    origHasBangla: boolean;
    mixed: boolean;
    convText: string; // রূপান্তর-পরবর্তী টেক্সট — পাঙ্কচুয়েশন-শুধু রান (যেমন দাঁড়ি)
  }[] = []; // SutonnyMJ পেতে পারে কিনা সেটার জন্য দরকার।

  for (const node of textNodes) {
    const text = node.textContent ?? "";
    if (!text || !hasBanglaOrPunct(text)) continue;
    const converted = sanitizeXml(convertFn(text));
    node.textContent = converted;

    const run = node.parentElement; // w:r
    if (run && run.localName === "r" && !runPlans.some((p) => p.run === run)) {
      runPlans.push({
        run,
        text,
        origHasBangla: BANGLA_RE.test(text),
        mixed: hasMixedSegments(text),
        convText: converted,
      });
    }
  }

  // দ্বিতীয় পাস: ফন্ট অ্যাসাইনমেন্ট — প্রত্যেক w:r-এ স্পষ্ট rFonts দেওয়া হয়।
  // কারণ: পূর্ববর্তী ডকে প্রত্যেক রানে w:rFonts="Kalpurush" লেখা থাকত — যেসব
  // রান স্পর্শ করা হত না (যেমন ফাঁকা-স্থানের রান, ইংরেজি-শুধু রান) Word-এ
  // কালপুরুষেই দেখাত। এখন প্রতিটি রানে ফন্ট বাধ্যতামূলক:
  //   বাংলা (বা যুক্তবর্ণ-ধারী) রান → SutonnyMJ
  //   ল্যাটিন/ইংরেজি রান  → Times New Roman
  //   ফাঁকা-স্থান/বিরামচিহ্ন-শুধু রান → সন্দর্ভ অনুযায়ী পরের ধাপে (মিশ্র
  //     সেগমেন্ট-ভাগ বা ইংরেজি-রানের সাথে না থাকলে SutonnyMJ — কারণ পুরো
  //     ডকুমেন্ট বাংলা)
  for (const plan of runPlans) {
    if (plan.mixed) {
      // মূল টেক্সটেই সেগমেন্ট ভাগ করি, প্রত্যেক সেগমেন্ট আলাদা রূপান্তরিত হয় —
      // বিজয়-কনভার্টার প্রতি-টেক্সট রূপান্তর করে বলে সেগমেন্ট-আলাদা করাই সঠিক
      splitMixedRun(plan.run, ns, plan.text, convertFn);
    } else {
      // সিন্ধান্ত: উৎসে বাংলা থাকলে, অথবা রূপান্তর-পরবর্তী টেক্সটে বিজয়-
      // পাঙ্কচুয়েশন (দাঁড়ি ', কোট ইত্যাদি) থাকলে → SutonnyMJ; বাকি সব →
      // Times New Roman। এতে দাঁড়ি-শুধু রানও সঠিক ফন্টে থাকে।
      rFontsAttr(
        plan.run,
        ns,
        needsSutonnyMJ(plan.text, plan.convText) ? "SutonnyMJ" : "Times New Roman",
      );
    }
  }

  // তৃতীয় পাস: বাকি সব রান (যেসব স্পর্শ হয়নি) — ফাঁকা-স্থান, ইংরেজি-শুধু বা
  // শুধু-বিরামচিহ্ন রানেও স্পষ্ট ফন্ট দেওয়া। প্রতিটি রানের নিজস্ব টেক্সট অনুযায়ী:
  // ল্যাটিন অক্ষর/সংখ্যা থাকলে Times New Roman, নয়তো SutonnyMJ।
  const allRuns = Array.from(doc.getElementsByTagNameNS(ns, "r"));
  const planned = new Set(runPlans.map((p) => p.run));
  for (const run of allRuns) {
    if (planned.has(run)) continue;
    const texts = Array.from(run.getElementsByTagNameNS(ns, "t")).map(
      (n) => n.textContent ?? "",
    );
    const joined = texts.join("");
    const want = LATIN_RE.test(joined) ? "Times New Roman" : "SutonnyMJ";
    rFontsAttr(run, ns, want);
  }
  return new XMLSerializer().serializeToString(doc);
}

// XML 1.0-এ অবৈধ কন্ট্রোল ক্যারেক্টার (0x00–0x08, 0x0B, 0x0C, 0x0E–0x1F, সারোগেট)
// পুরো XML-এ এলে DOMParser থ্রো করে ও Word ডকুমেন্ট খুলতে পারে না —
// পার্সের আগে পুরো স্ট্রিং থেকে সরাতে হয় (ট্যাব/রিটার্ন/লাইনফিড বৈধ, রাখা হয়)
function stripIllegalXmlChars(xml: string): string {
  return xml.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "");
}

// XML 1.0-এ অবৈধ কন্ট্রোল ক্যারেক্টার (0x00–0x08, 0x0B, 0x0C, 0x0E–0x1F, সারোগেট)
// টেক্সটে এলে Word পুরো ডকুমেন্ট খুলতে পারে না — রূপান্তরের পর সরিয়ে দিতে হয়
function sanitizeXml(text: string): string {
  return text.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\uD800-\uDFFF]/g,
    "",
  );
}

const BANGLA_RE = /[\u0980-\u09FF]/;
const LATIN_RE = /[A-Za-z0-9]/;
const PUNCT_RE =
  /[।॥“”‘’—–¢£¤¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ\u007C\u005C]/;

function hasBanglaOrPunct(text: string): boolean {
  return BANGLA_RE.test(text) || PUNCT_RE.test(text);
}

// কনভার্টের পরের টেক্সটে বিজয়-পাঙ্কচুয়েশন (যেমন একক দাঁড়ি ') থাকলেও
// রানটি SutonnyMJ হওয়া দরকার — নইলে দাঁড়ি Times New Roman-এ
// মতো দেখায়। সুতরাং ফন্ট-সিদ্ধান্তে "উৎসে বাংলা" নয়, "উৎসে বাংলা বা
// ফলাফলে বিজয়-পাঙ্কচুয়েশন" দেখা হয়।
function needsSutonnyMJ(origText: string, convText: string): boolean {
  return BANGLA_RE.test(origText) || PUNCT_RE.test(convText);
}

/** মিশ্র টেক্সটকে বাংলা/অ-বাংলা সেগমেন্টে ভাগ করার শর্ত */
function hasMixedSegments(text: string): boolean {
  // বাংলা থাকবে এবং ইংরেজি অক্ষর/সংখ্যা থাকবে — দুই-ই হলে মিশ্র।
  // কলন, টিউ, পরেন্থেসিস, সাধারণন বিরামচিহ্ন বাংলার সাথে SutonnyMJ-ই ব্যবহার করে,
  // সেগুলোর জন্য আলাদা রান দরকার নেই।
  return BANGLA_RE.test(text) && /[A-Za-z0-9]/.test(text);
}

/** মিশ্র রানকে একাধিক w:r-এ ভাগ করে ফন্ট আলাদা করে — মূল টেক্সটে সেগমেন্ট করা, প্রত্যেক সেগমেন্ট আলাদা রূপান্তরিত */
function splitMixedRun(
  run: Element,
  ns: string,
  text: string,
  convertFn: (t: string) => string,
): void {
  const doc = run.ownerDocument!;
  // রানের অন্যান্য বৈশিষ্ট্য (<w:b>, <w:i> ইত্যাদি) প্রথম সেগমেন্টে রাখি
  const rPr = run.querySelector(":scope > rPr") ?? null;
  // আগে মূল রানটি খালি করে দিই, সেগমেন্ট নোডগুলো পাশে যোগ করব
  const parent = run.parentNode!;
  const anchor = run.nextSibling;
  run.parentNode!.removeChild(run);

  // চার্টার-বাই-চার্টার সেগমেন্ট (মূল টেক্সটে): একই ফন্টের অক্ষর পরপর গ্রুপ করা।
  // সাধারণন বিরামচিহ্ন/ফাঁক (ল্যাটিন অক্ষর/সংখ্যা নেই) আগের বাংলা সন্দর্ভে রাখা হয় —
  // এতে ": Bangla and English 2026" পুরোটাই Times, "সঠিক রূপান্তর।" SutonnyMJ।
  const segments: { text: string; bangla: boolean }[] = [];
  let curText = "";
  let curBangla = false;
  for (const ch of text) {
    const b = BANGLA_RE.test(ch);
    // দাঁড়ি (U+0964), কোট ইত্যাদি বাংলা রেঞ্জের বাইরে, তাই তাদের জন্য
    // কনটেক্সট উত্তরাধিকার সূত্রে ফেলে: বর্তমান সন্দর্ভের অনুসরণ করে।
    const isPunct = PUNCT_RE.test(ch);
    const isLatinChar = /[A-Za-z0-9]/.test(ch);
    // নতুন সন্ধার্টার-টাইপ সেগমেন্টের বাংলা-ফ্ল্যাগ:
    //   বাংলা অক্ষর → বাংলা;  ল্যাটিন অক্ষর/সংখ্যা → নন-বাংলা;
    //   বাংলা-পাঙ্কচুয়েশন/বাকি সব → আগের সন্দর্ভ বজায় রাখে (ফলো-থ্রু)।
    const newBangla: boolean = b ? true : isLatinChar ? false : curBangla;
    if (curText === "" || newBangla === curBangla) {
      curText += ch;
      curBangla = newBangla;
    } else {
      segments.push({ text: curText, bangla: curBangla });
      curText = ch;
      curBangla = newBangla;
    }
  }
  if (curText) segments.push({ text: curText, bangla: curBangla });

  const frag = doc.createDocumentFragment();
  for (const seg of segments) {
    const nr = doc.createElementNS(ns, "w:r");
    const np = rPr ? doc.importNode(rPr, true) : null;
    if (np) nr.appendChild(np);
    const t = doc.createElementNS(ns, "w:t");
    // xml namespace হিসেবে সেট করতে হয় — Word অ-নেমস্পেসড xml:space অ্যাট্রিবিউট
    // থাকলে ডকুমেন্ট আর খুলতে পারে না ("Word experienced an error" দেখায়)
    t.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
    t.textContent = sanitizeXml(convertFn(seg.text));
    nr.appendChild(t);
    rFontsAttr(nr, ns, seg.bangla ? "SutonnyMJ" : "Times New Roman");
    frag.appendChild(nr);
  }
  parent.insertBefore(frag, anchor);
}

/** রানের rPr/rFonts হিন্ট দেওয়া বা বদলানো (রান-এর নাম ও বৈশিষ্ট্য অক্ষুণ্ণ) */
function rFontsAttr(run: Element, ns: string, want: string): void {
  const doc = run.ownerDocument!;
  let rPr = run.querySelector(":scope > rPr");
  if (!rPr) {
    rPr = run.ownerDocument!.createElementNS(ns, "w:rPr");
    run.insertBefore(rPr, run.firstChild);
  }
  let rFonts = rPr.querySelector(":scope > rFonts");
  if (!rFonts) {
    rFonts = run.ownerDocument!.createElementNS(ns, "w:rFonts");
    rPr.insertBefore(rFonts, rPr.firstChild);
  }
  rFonts.setAttributeNS(ns, "w:ascii", want);
  rFonts.setAttributeNS(ns, "w:hAnsi", want);
  rFonts.setAttributeNS(ns, "w:eastAsia", want);
  rFonts.setAttributeNS(ns, "w:cs", want);
  // নোট: w:rFonts ECMA-376 অনুযায়ী লিফ-এলিমেন্ট (শুধু অ্যাট্রিবিউট, চাইল্ড নোড নেই)।
  // আগে এখানে w:alias চাইল্ড যোগ করা হত (SutonnyMJ বানান-বিকল্পের জন্য) — কিন্তু
  // ওয়ার্ড স্কিমা-ভ্যালিডেশনে এই চাইল্ড রিজেক্ট করে আর ডকুমেন্টই খুলত না। তাই সরিয়ে দেওয়া হয়েছে।
}

/** রান-এ rPr/rFonts না থাকলে SutonnyMJ হিন্ট দাও; থাকলে নাম বদলাও */
function ensureRFonts(run: Element, ns: string, hasBangla: boolean): void {
  rFontsAttr(run, ns, hasBangla ? "SutonnyMJ" : "Times New Roman");
}
