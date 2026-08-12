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
/**
 * উদ্ধৃতি/অ্যাপোস্ট্রফ/ড্যাশ ম্যাপ — কনটেক্সট-অনুযায়ী:
 *   inBangla=true  → SutonnyMJ গ্লিফ-কোডে (ÒÓÔÕÑ) — বাংলা-প্রসঙ্গে।
 *   inBangla=false → সরাসরি ASCII ("'—) রাখা হয় — ইংরেজি-প্রসঙ্গে এগুলো
 *     Times New Roman-এ নরমাল গ্লিফ দেখায়; SutonnyMJ-কোডে বদলালে TNR-রানে
 *     ভেঙে-যাওয়া গ্লিফ (Õ, Ñ ইত্যাদি) দেখায়।
 */
function preMapPunctuation(s: string, inBangla: boolean): string {
  let out = "";
  let open = true;
  for (const ch of s) {
    if (ch === '"') {
      if (inBangla) {
        // সোজা দুই উদ্ধৃতি — প্রসঙ্গ অনুযায়ী SutonnyMJ “/” গ্লিফ-কোডে
        out += open ? "\u00D2" : "\u00D3";
        open = !open;
      } else {
        // ইংরেজি-প্রসঙ্গ: নরমাল সরাসরি উদ্ধৃতি — TNR-এ সঠিক দেখায়
        out += ch;
      }
    } else if (ch === "'") {
      if (inBangla) {
        // সোজা এক উদ্ধৃতি/অ্যাপোস্ট্রফি — SutonnyMJ টিক Õ
        out += "\u00D5";
      } else {
        // ইংরেজি-প্রসঙ্গ: সরাসরি রাখা হয়
        out += ch;
      }
    } else if (inBangla && ch === "\u2014") {
      out += "\u00D1"; // em-dash — বাংলা-প্রসঙ্গে SutonnyMJ ড্যাশ
    } else if (inBangla && ch === "\u2013") {
      out += "\u00D1"; // en-dash — বাংলা-প্রসঙ্গে একই ড্যাশ গ্লিফ
    } else if (inBangla && ch === "\u0965") {
      out += "\uE001"; // ॥ ডাবল-দারি — প্লেসহোল্ডার (পরে \\\\ বসানো হবে)
    } else if (inBangla && (ch === "\u201C" || ch === "\u201D")) {
      out += ch === "\u201C" ? "\u00D2" : "\u00D3"; // curly double
    } else if (inBangla && (ch === "\u2018" || ch === "\u2019")) {
      out += ch === "\u2018" ? "\u00D4" : "\u00D5"; // curly single / apostrophe
    } else {
      out += ch;
    }
  }
  return out;
}

export function convertToBijoy(text: string, inBangla?: boolean): string {
  // বিরামচিহ্ন প্রথমে বিজয়-কোডে → তারপর বাংলা অক্ষর লাইব্রেরি দিয়ে।
  // inBangla: সুনির্দিষ্ট করা থাকলে সেই অনুযায়ী ম্যাপ হয়; না থাকলে
  // টেক্সটে বাংলা অক্ষর থাকলে বাংলা-প্রসঙ্গ, নয়তো ইংরেজি-প্রসঙ্গ।
  // নোট: লাইব্রেরি নিজেও “”'— কে \xD2\xD3\xD4\xD5\xD1-এ বদলায় —
  // ইংরেজি-প্রসঙ্গে তাই পোস্ট-ম্যাপে আবার ASCII-তে ফেরত আনা হয়,
  // যাতে TNR-রানে সঠিক গ্লিফ (", ', —) দেখায়।
  const bangla = inBangla ?? BANGLA_RE.test(text);
  let out = libUnicodeToBijoy(preMapPunctuation(text, bangla)).replace(
    /\uE001/g,
    "\u005C\u005C",
  );
  if (!bangla) {
    out = out
      .replace(/\u00D2/g, "\u201C")
      .replace(/\u00D3/g, "\u201D")
      .replace(/\u00D4/g, "\u2018")
      .replace(/\u00D5/g, "\u2019")
      .replace(/\u00D1/g, "\u2014");
  }
  return out;
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
  if (direction === "u2b") {
    // ইউনিকোড → বিজয়: মিশ্র টেক্সটে সেগমেন্ট-অনুযায়ী আলাদা ম্যাপ —
    // ইংরেজি-সেগমেন্টের উদ্ধৃতি/অ্যাপোস্ট্রফ/ড্যাশ ASCII-ই থাকে।
    const segs = segmentBijoyText(text);
    return segs
      .map((s) => convertToBijoy(s.text, s.bangla))
      .join("");
  }
  return convertToUnicode(text);
}

/* ── ফাইল কনভার্টার: TXT / DOCX ─────────────────────────────── */
import JSZip from "jszip";

export type FileConvertResult =
  | { kind: "txt"; blob: Blob; name: string }
  | { kind: "docx"; blob: Blob; name: string };

/** ফাইল (DOCX/TXT) থেকে ইউনিকোড টেক্সট তোলা — প্রিভিউর জন্য */
export async function extractTextFrom(file: File): Promise<string> {
  if (file.name.toLowerCase().endsWith(".docx")) {
    const buf = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);
    const xml = await zip.file("word/document.xml")?.async("string");
    if (!xml) return "";
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const texts = doc.getElementsByTagName("w:t");
    let out = "";
    for (let i = 0; i < texts.length; i++) {
      const t = texts[i] as Element;
      out += t.textContent ?? "";
      // প্যারাগ্রাফ/সেল-সীমান্তে নতুন লাইন
      const r = t.parentElement;
      const p = r?.parentElement;
      const afterP = p?.parentElement;
      if (afterP?.tagName === "w:tbl" || afterP?.tagName === "w:sectPr") {
        out += "\n";
      } else if (r?.nextElementSibling) {
        out += " ";
      }
    }
    return out;
  }
  return await file.text();
}

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
    const convertedXml = processDocXml(cleanXml, direction);
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
function processDocXml(xml: string, direction: ConvertDirection): string {
  const convertFn = (t: string) => convert(t, direction);
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

  // প্রথম পাস: টেক্সট রূপান্তর — যেসব <w:t>-তে বাংলা বা বিরামচিহ্ন আছে।
  // <w:instrText>-এর ভেতরের <w:t> স্পর্শ করা হয় না — এগুলো Word-এর ফিল্ড-কোড
  // (TOC, PAGE, হাইপারলিংক ইত্যাদি); এগুলো কনভার্ট করলে ফিল্ড ভেঙে যায়।
  const allT = Array.from(doc.getElementsByTagNameNS(ns, "t"));
  const textNodes = allT.filter((n) => {
    let el: Element | null = n;
    while (el) {
      if (el.localName === "instrText") return false;
      el = el.parentElement;
    }
    return true;
  });
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
    const origHasBangla = BANGLA_RE.test(text);
    // প্রতি-রান কনটেক্সট: রানেই উৎসে বাংলা অক্ষর থাকলে বাংলা-প্রসঙ্গ
    // (কোট/ড্যাশ SutonnyMJ গ্লিফে), নইতো ইংরেজি-প্রসঙ্গ — তখন উদ্ধৃতি/অ্যাপোস্ট্রফ/
    // ড্যাশ সোজা ASCII-ই রাখা হয় যাতে TNR-রানে সঠিক দেখায়।
    const converted = sanitizeXml(
      direction === "u2b" ? convertToBijoy(text, origHasBangla) : convertToUnicode(text),
    );
    node.textContent = converted;

    const run = node.parentElement; // w:r
    if (run && run.localName === "r" && !runPlans.some((p) => p.run === run)) {
      runPlans.push({
        run,
        text,
        origHasBangla,
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
      // সেগমেন্টের ভাষা-ফ্ল্যাগ অনুযায়ী কোট/ড্যাশ ম্যাপ হয় (বাংলা-সেগমেন্টে
      // SutonnyMJ গ্লিফ, ইংরেজি-সেগমেন্টে ASCII)
      splitMixedRun(plan.run, ns, plan.text, direction);
    } else {
      // সিন্ধান্ত (ফলো-থ্রু নিয়ম): রানের ভাষা-সন্ধার্ট প্রথমে নির্ধারণ করা হয়
      // উৎসের টেক্সট থেকে — বাংলা অক্ষর থাকলে SutonnyMJ; ল্যাটিন/সংখ্যা
      // থাকলে Times New Roman।
      //   - বাংলা-শুধু / বাংলা+পাঙ্কচুয়েশন রান → SutonnyMJ
      //   - ইংরেজি-শুধু / ইংরেজি+পাঙ্কচুয়েশন রান → Times New Roman
      //     (কোট ” ’, এম-ড্যাশ ইত্যাদি বিজয়-গ্লিফে বসে, তবে গ্লিফগুলো
      //     TNR-এই সঠিকভাবে রেন্ডার হয় — এগুলো ল্যাটিন-কোডেই)
      //   - দাঁড়ি-শুধু / পাঙ্কচুয়েশন-শুধু রান → আগের-পরের সন্ধার্ট ফলো
      //     করবে: পরের রান বাংলা হয়ে থাকলে SutonnyMJ (বিজয় পাঙ্কচুয়েশন
      //     গ্লিফ SutonnyMJ-তেই সঠিক), তা নয়ে হয়ে থাকলে তাই রাখা হয়
      //     (তৃতীয় পাসে স্পেস-রানের ল্যাঙ্ক করা হয়েছে)।
      const hasLat = LATIN_RE.test(plan.text);
      const font = plan.origHasBangla
        ? "SutonnyMJ"
        : hasLat
          ? "Times New Roman"
          : runLooksBanglaContext(plan, runPlans) ? "SutonnyMJ" : "Times New Roman";
      rFontsAttr(plan.run, ns, font);
    }
  }

  // তৃতীয় পাস: বাকি সব রান (যেসব স্পর্শ হয়নি) — ফাঁকা-স্থান, ইংরেজি-শুধু বা
  // শুধু-বিরামচিহ্ন রানেও স্পষ্ট ফন্ট দেওয়া। প্রতিটি রানের নিজস্ব টেক্সট অনুযায়ী:
  // ল্যাটিন অক্ষর/সংখ্যা থাকলে Times New Roman, নয়তো SutonnyMJ।
  // স্প্লিট-সেগমেন্ট রান স্কিপ (এগুলো দ্বিতীয় পাসে ইতোমধ্যে সঠিক ফন্ট পেয়েছে);
  // সারিয়ালাইজেশনের আগে মার্কার সরানো হয়।
  const allRuns = Array.from(doc.getElementsByTagNameNS(ns, "r"));
  const planned = new Set(runPlans.map((p) => p.run));
  for (const run of allRuns) {
    if (run.hasAttribute("data-bijoy-split")) {
      run.removeAttribute("data-bijoy-split");
      continue;
    }
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
/** যেকোনো লেখা-চরিত্র (বাংলা/লাটিন) — পাংক/স্পেস স্কিপ করে নিকটতম লেখা খোঁজার জন্য */
const LETTER_RE = /[\u0980-\u09FFA-Za-z0-9]/;
const PUNCT_RE =
  /[।॥“”‘’—–¢£¤¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ\u007C\u005C]/;

function hasBanglaOrPunct(text: string): boolean {
  return BANGLA_RE.test(text) || PUNCT_RE.test(text);
}

/**
 * কনভার্টেড বিজয় টেক্সটকে প্রিভিউর জন্য ফন্ট-সেগমেন্টে ভাগ করে।
 * DOCX পাইপলাইনের splitMixedRun-এর একই সন্দর্ভ-নিয়ম:
 *   বাংলা অক্ষর → বাংলা; ল্যাটিন/সংখ্যা → নন-বাংলা;
 *   নতুন নিয়ম: সমন্য-পাংক/স্পেস চরিত্রের ভাষা নিকটতম লেখা-চরিত্র দেখে; দুই পাশেই
 *   লেখা থাকলে ল্যাটিন পাশেরটি প্রাধান্য (এম-ড্যাশ র/ড় গ্লিফ এড়াতে)।
 */
function nearestLetterLang(
  chars: string[],
  i: number,
  curBangla: boolean,
): boolean {
  // প্রথমে সাথে সাথে যুক্ত লেখা দেখি — দাঁড়ি/কোট সরাসরি বাংলা অক্ষরের পাশে থাকলে
  // বাংলা ("সত্য। It" — দাঁড়ি বাংলার অংশ), ল্যাটিন পাশে থাকলে ল্যাটিন ("fast'")।
  const prev = chars[i - 1];
  const next = chars[i + 1];
  const prevLatin = prev && /[A-Za-z0-9]/.test(prev);
  const prevBangla = prev && BANGLA_RE.test(prev);
  const nextLatin = next && /[A-Za-z0-9]/.test(next);
  const nextBangla = next && BANGLA_RE.test(next);
  if (prevLatin || nextLatin) return false;
  if (prevBangla || nextBangla) return true;
  // উপরের চেক মানে: সরাসরি পাশে নেই লেখা। কিন্তু পাশাপাশি পাশের (স্পেস/কোট স্কিপ)
  // ভিন্ন ভাষা হলে: কোট/ড্যাশ লাতিন-পাশের, দাঁড়ি/ডাবল-দারি বাংলা-পাশের।
  // সরাসরি যুক্ত না হলে (এক পাশে পাশে লেখা-নেই, দুই পাশে ভিন্ন-ভাষা যেকন পাশে লেখা):
  // স্পেস/কোট-ঘেরা এম-ড্যাশ "…বাংলা' — 'English" ধরনে —
  //   প্রথম শব্দে যাচাই (প্রতিবেশী স্পেস/পাংক স্কিপ) করে লাতিন পাশের প্রাধান্য।
  // সরাসরি পাশে লেখা না থাকলে (স্পেস/কোট-ঘেরা এম-ড্যাশ) স্কিপ করে নিকটতম লেখা:
  let back = i - 1;
  while (back >= 0 && !LETTER_RE.test(chars[back])) back--;
  let fwd = i + 1;
  while (fwd < chars.length && !LETTER_RE.test(chars[fwd])) fwd++;
  if (back >= 0 && fwd < chars.length && BANGLA_RE.test(chars[back]) && /[A-Za-z0-9]/.test(chars[fwd])) {
    // বাংলা ও লাতিন দুই-ই পাশে; দাঁড়ি/ডাবল-দারি বাংলা-পাশের, বাকি কোট/ড্যাশ লাতিন।
    return !(chars[i] === "।" || chars[i] === "॥");
  }
  if ((back >= 0 && /[A-Za-z0-9]/.test(chars[back])) || (fwd < chars.length && /[A-Za-z0-9]/.test(chars[fwd]))) return false;
  if ((back >= 0 && BANGLA_RE.test(chars[back])) || (fwd < chars.length && BANGLA_RE.test(chars[fwd]))) return true;
  return curBangla;
}
/** ইউনিকোড ইনপুট-পাশের পর্যালোচনাযয় রান ভাগ করে — প্রিভিউতে বাংলা/লাতিন
 * নির্ধারণের জন্য। ইনপুট চরিত্রের ওপর ভিত্তি করে প্রতিটি চরিত্রের বিজয় রূপের
 * স্ট্রিংটি বর্তমান সেগমেন্টে জোড়া হয়, ফলে আউটপুট-সাইজিং ইনপুটের ভাষার সাথে
 * মিলে যায় (বিজয়-কোড সব লাতিন-রেঞ্জ, তাই আউটপুট পাশে ভাগ করা যায় না)। */
export function segmentBijoyText(text: string): { text: string; bangla: boolean }[] {
  const segments: { text: string; bangla: boolean }[] = [];
  let curText = "";
  let curBangla = false;
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const newBangla: boolean = BANGLA_RE.test(ch)
      ? true
      : /[A-Za-z0-9]/.test(ch)
        ? false
        : nearestLetterLang(chars, i, curBangla);
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
  return segments;
}

/** মূল ইউনিকোড টেক্সটের সেগমেন্ট নিয়মের একটি আশপাশ-সাধারণ সংস্করণ (ডিওসিএক্স পাইপলাইনের জন্য) */
function segmentMixedText(text: string): { text: string; bangla: boolean }[] {
  const segments: { text: string; bangla: boolean }[] = [];
  let curText = "";
  let curBangla = false;
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const b = BANGLA_RE.test(ch);
    const isLatinChar = /[A-Za-z0-9]/.test(ch);
    const nearLatin =
      /[A-Za-z0-9]/.test(chars[i - 1] ?? "") || /[A-Za-z0-9]/.test(chars[i + 1] ?? "");
    const newBangla: boolean = b ? true : isLatinChar ? false : nearLatin ? false : curBangla;
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
  return segments;
}

/** ইউনিকোড ইনপুটকে বিজয় আউটপুট-সেগমেন্টে ম্যাপ করে (প্রিভিউর জন্য):
 * ইনপুটের প্রতিটি চরিত্রের বিজয় রূপ সেই চরিত্রের ভাষা-সেগমেন্টে পড়ে। */
export function mapSegmentsToBijoy(
  text: string,
  direction: ConvertDirection,
): { text: string; bangla: boolean }[] {
  const inputSegs = segmentBijoyText(text);
  if (direction === "b2u") return inputSegs;
  return inputSegs.map((s) => ({
    text: convertToBijoy(s.text, s.bangla),
    bangla: s.bangla,
  }));
}

// রানের সন্ধার্ট-নির্ধারণ — পাঙ্কচুয়েশন-শুধু রান (দাঁড়ি, কোট) কোন ভাষার
// সন্ধার্টে পড়ছে তা পরের রান দেখে বোঝা যায়। ডকে পরপর রানে "নম্বর। এটা"
// ধরনে দাঁড়ি-রানের পরেই বাংলা থাকে — তাই পরের রানে বাংলা থাকলে SutonnyMJ।
function runLooksBanglaContext(
  plan: { run: Element },
  runPlans: { run: Element; origHasBangla: boolean; text: string }[],
): boolean {
  const pos = runPlans.findIndex((p) => p.run === plan.run);
  if (pos >= 0) {
    const after = runPlans.slice(pos + 1).find((p) => p.origHasBangla || LATIN_RE.test(p.text));
    if (after) return after.origHasBangla;
  }
  // পরের স্পষ্ট রান না পেলে আগের রান দেখা হয়
  const before = [...runPlans]
    .slice(0, pos >= 0 ? pos : undefined)
    .reverse()
    .find((p) => p.origHasBangla || LATIN_RE.test(p.text));
  return before ? before.origHasBangla : true; // ডিফল্ট: ডক বাংলা ধরে SutonnyMJ
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
  direction: ConvertDirection,
): void {
  const doc = run.ownerDocument!;
  // রানের অন্যান্য বৈশিষ্ট্য (<w:b>, <w:i> ইত্যাদি) প্রথম সেগমেন্টে রাখি
  const rPr = run.querySelector(":scope > rPr") ?? null;
  // আগে মূল রানটি খালি করে দিই, সেগমেন্ট নোডগুলো পাশে যোগ করব
  const parent = run.parentNode!;
  const anchor = run.nextSibling;
  run.parentNode!.removeChild(run);

  // চার্টার-বাই-চার্টার সেগমেন্ট (মূল টেক্সটে): একই ফন্টের অক্ষর পরপর গ্রুপ করা।
  //   বাংলা অক্ষর → বাংলা; ল্যাটিন অক্ষর/সংখ্যা → নন-বাংলা;
  //   কোট/ড্যাশ/পাঙ্কচুয়েশন → কাছের ল্যাটিন অক্ষর থাকলে ল্যাটিন-সেগমেন্ট
  //     (যেমন 'fast' — কোট দুটো সোজা ASCII রাখা হয়, TNR-এ সঠিক);
  //     ল্যাটিন-সন্ধার্ট না থাকলে আগের সন্ধার্ট অনুসরণ (ফলো-থ্রু)।
  const segments: { text: string; bangla: boolean }[] = [];
  let curText = "";
  let curBangla = false;
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const b = BANGLA_RE.test(ch);
    const isLatinChar = /[A-Za-z0-9]/.test(ch);
    // কোট/ড্যাশ/পাঙ্কচুয়েশন ল্যাটিন অক্ষরের পাশে থাকলে ল্যাটিন-সন্ধার্ট —
    // এতে ইংরেজি-শব্দের চারপাশের ' " — গুলো SutonnyMJ-কোডে যায় না।
    // নিকটতম লেখা-চরিত্র (পাঙ্ক/স্পেস স্কিপ) দেখে ভাষা — এম-ড্যাশ "…বাংলা' — 'English"
    // ধরনে ল্যাটিন-পাশের পেয়ে SutonnyMJ-এ র/হ-আকৃতি গ্লিফে যায় না।
    const newBangla: boolean = b
      ? true
      : isLatinChar
        ? false
        : nearestLetterLang(chars, i, curBangla);
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
    t.textContent = sanitizeXml(
      direction === "u2b" ? convertToBijoy(seg.text, seg.bangla) : convertToUnicode(seg.text),
    );
    nr.appendChild(t);
    rFontsAttr(nr, ns, seg.bangla ? "SutonnyMJ" : "Times New Roman");
    // মার্কার: তৃতীয় পাস যেন স্প্লিট-সেগমেন্ট রানে আবার ফন্ট চাপায় না —
    // সিরিয়ালাইজেশনের আগে সামনে সব মার্কার সরানো হয়।
    nr.setAttribute("data-bijoy-split", "1");
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
