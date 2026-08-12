/*
 * ডিজাইন দিক: টিল ডেস্ক — কনভার্টার ইঞ্জিন
 * অভ্র/ইউনিকোড ⇄ বিজয় (সুতন্নী এমজে) রূপান্তর পরিষেবা।
 * ইনপুট ফন্ট: সোলাইমান লিপি / কালপুরুষ (হিন্দ সিলিগুড়ি দিয়ে প্রিভিউ)
 * আউটপুট ফন্ট: SutonniMJ (@font-face দিয়ে সাইটে এম্বেড করা হয়েছে);
 * ইংরেজি অংশে Times New Roman ফলব্যাক।
 *
 * যুক্তবর্ণ নিয়ম: ন্ত, ল্ল, য়, ড়, ঢ়, র-ফলা, রেফ, জ্ঞ, ক্ষ, শ্র — কোনো ভাঙন নেই।
 * বিরামচিহ্ন নিয়ম (যাচাইকৃত):
 *   । → ¥ (U+00A5)  — দাঁড়ি হ-এর মতো লাগবে না, সঠিক দাঁড়ি গ্লিফ দেখাবে
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

/* ── বিরামচিহ্ন পোস্ট-প্রসেস (u2b) ───────────────────────────── */
const U2B_PUNCT: Record<string, string> = {
  "।": "\u00A5", // দাঁড়ি — ¥ গ্লিফ সুতন্নীতে সঠিক দাঁড়ি
  "॥": "\u00A5\u00A5",
  "\u2014": "\u00D1", // em-dash —
  "\u2013": "\u00D1", // en-dash — একই ড্যাশ গ্লিফ
  "\u201C": "\u00D2", // “ open double
  "\u201D": "\u00D3", // ” close double
  "\u2018": "\u00D4", // ‘ open single
  "\u2019": "\u00D5", // ’ close single / apostrophe
};

/** স্ট্রেইট দুই উদ্ধৃতি " কে প্রসঙ্গ অনুযায়ী Ò/Ó-তে নেওয়া */
function fixStraightQuotes(s: string): string {
  let out = "";
  let open = true;
  for (const ch of s) {
    if (ch === '"') {
      out += open ? "\u00D2" : "\u00D3";
      open = !open;
    } else if (ch === "'") {
      // ' বাংলা বা উদ্ধৃতির মধ্যে ক্ষুদ্র টিক → বেঁকে যাওয়া গ্লিফ Õ
      out += "\u00D5";
    } else {
      out += ch;
    }
  }
  return out;
}

export function convertToBijoy(text: string): string {
  let r = libUnicodeToBijoy(text);
  // লাইব্রেরির ম্যাপিং-এর পরে প্রতিটি ইউনিকোড বিরামচিহ্ন কাঠামোগতভাবে বদলাও
  for (const [src, dst] of Object.entries(U2B_PUNCT)) {
    r = r.split(src).join(dst);
  }
  r = fixStraightQuotes(r);
  return r;
}

export function convertToUnicode(text: string): string {
  let r = libBijoyToUnicode(text);
  // বিপরীত দিকেও সাংকেতিক কোডপয়েন্টগুলো নর্মালাইজ করা
  const B2U_PUNCT: Record<string, string> = {
    "\u00A5": "।",
    "\u00D1": "—",
    "\u00D2": "\u201C",
    "\u00D3": "\u201D",
    "\u00D4": "\u2018",
    "\u00D5": "\u2019",
  };
  for (const [src, dst] of Object.entries(B2U_PUNCT)) {
    r = r.split(src).join(dst);
  }
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
    const convertedXml = processDocXml(xml, convertFn);
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

  // প্রথমে প্রত্যেক <w:t>-এর রূপান্তর এক পাসে করে ফেলি — পরবর্তী সেগমেন্ট-
  // ভাগ করা নোডয়ালিস্ট সালনোর আগেই তথ্য সংগ্রহ করা হয়, ডাবল-প্রসেসিং এড়ায়
  const textNodes = Array.from(doc.getElementsByTagNameNS(ns, "t"));
  const runPlans: {
    run: Element;
    text: string;
    origHasBangla: boolean;
    origPunctOnly: boolean;
    mixed: boolean;
  }[] = [];

  for (const node of textNodes) {
    const text = node.textContent ?? "";
    if (!text || !hasBanglaOrPunct(text)) continue;
    node.textContent = convertFn(text);

    const run = node.parentElement; // w:r
    if (run && run.localName === "r" && !runPlans.some((p) => p.run === run)) {
      runPlans.push({
        run,
        text,
        origHasBangla: BANGLA_RE.test(text),
        origPunctOnly: !BANGLA_RE.test(text) && PUNCT_RE.test(text),
        mixed: hasMixedSegments(text),
      });
    }
  }

  // ফন্ট-হিন্ট ও মিশ্র রান-ভাগ — মূল টেক্সটের তথ্য অনুযায়ী
  for (const plan of runPlans) {
    if (plan.mixed) {
      // মূল টেক্সটেই সেগমেন্ট ভাগ করি, প্রত্যেক সেগমেন্ট আলাদা রূপান্তরিত হয় —
      // বিজয়-কনভার্টার প্রতি-টেক্সট রূপান্তর করে বলে সেগমেন্ট-আলাদা করাই সঠিক
      splitMixedRun(plan.run, ns, plan.text, convertFn);
    } else if (plan.origPunctOnly) {
      // বিরামচিহ্ন-শুধু রান — বিজয়ে SutonniMJ-এর ইংলিশ গ্লিফ অংশেই কোডপয়েন্ট,
      // সুতরাং Times New Roman হিন্ট সংগতি রাখে
      rFontsAttr(plan.run, ns, "Times New Roman");
    } else {
      ensureRFonts(plan.run, ns, plan.origHasBangla);
    }
  }
  return new XMLSerializer().serializeToString(doc);
}

const BANGLA_RE = /[\u0980-\u09FF]/;
const PUNCT_RE =
  /[।॥“”‘’—–¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/;

function hasBanglaOrPunct(text: string): boolean {
  return BANGLA_RE.test(text) || PUNCT_RE.test(text);
}

/** মিশ্র টেক্সটকে বাংলা/অ-বাংলা সেগমেন্টে ভাগ করার শর্ত */
function hasMixedSegments(text: string): boolean {
  // বাংলা থাকবে এবং ইংরেজি অক্ষর/সংখ্যা থাকবে — দুই-ই হলে মিশ্র।
  // কলন, টিউ, পরেন্থেসিস, সাধারণন বিরামচিহ্ন বাংলার সাথে SutonniMJ-ই ব্যবহার করে,
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
  // এতে ": Bangla and English 2026" পুরোটাই Times, "সঠিক রূপান্তর।" SutonniMJ।
  const segments: { text: string; bangla: boolean }[] = [];
  let curText = "";
  let curBangla = false;
  for (const ch of text) {
    const b = BANGLA_RE.test(ch);
    const isLatinChar = /[A-Za-z0-9]/.test(ch);
    const newBangla: boolean = b || (!isLatinChar && curBangla);
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
    t.setAttribute("xml:space", "preserve");
    t.textContent = convertFn(seg.text);
    nr.appendChild(t);
    rFontsAttr(nr, ns, seg.bangla ? "SutonniMJ" : "Times New Roman");
    frag.appendChild(nr);
  }
  parent.insertBefore(frag, anchor);
}

/** রানের rPr/rFonts হিন্ট দেওয়া বা বদলানো (রান-এর নাম ও বৈশিষ্ট্য অক্ষুণ্ণ) */
function rFontsAttr(run: Element, ns: string, want: string): void {
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
}

/** রান-এ rPr/rFonts না থাকলে SutonniMJ হিন্ট দাও; থাকলে নাম বদলাও */
function ensureRFonts(run: Element, ns: string, hasBangla: boolean): void {
  rFontsAttr(run, ns, hasBangla ? "SutonniMJ" : "Times New Roman");
}
