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
// ইংরেজি-প্রসঙ্গের কর্লি-কোট/ড্যাশকে ASCII-সমতুল্যে নেউট্রাল করা —
// রান-ভাগের আগে ডক্স-পাইপলাইন আর ব্রাউজার-পাইপলাইন দুই জায়গাই ব্যবহৃত।
function neutralizeLatinPunct(s: string): string {
  return s
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u2018/g, "'")
    .replace(/\u2019/g, "'")
    .replace(/[\u2014\u2013]/g, "-");
}

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
  // ইংরেজি-প্রসঙ্গের কর্লি-কোট/ড্যাশ কোথায়? টেক্সটে অন্য কোনো বাংলা
  // অক্ষর নেই এবং লাতিন-চরিত্রের পাশে (অথবা কোনো পাশেই কিছু নেই) — সেগুলো
  // নেউট্রাল করা হয় কারণ লাইব্রেরি নিজেই “ ” — কে Ò Ó Ñ-এ ম্যাপ করে ফেলে।
  // বাংলা-প্রসঙ্গের ড্যাশ/কোট আগের মতই নিচে বিজয়-কোডে ম্যাপ হয়।
  if (!BANGLA_RE.test(s)) {
    const hasLatin = /[A-Za-z0-9]/.test(s);
    if (hasLatin) return neutralizeLatinPunct(s);
    // শুধু-বিরামচিহ্ন স্ট্রিং (কোনো লেখা নেই) — উদাহরণ: দুটো বাংলা
    // শব্দের মাঝে একটি এন-ড্যাশ রান। এখানে বিজয়-কোডে ম্যাপ করা হয়
    // (এম/এন-ড্যাশ → Ñ, কোট → ঊ/ডি ওপেন/ক্লোজ ক্রমে) এবং নেবার-কনটেক্সট
    // দিয়ে পরে ফন্ট নির্ধারণ করা হয়।
    s = s.replace(/[\u2014\u2013]/g, "\u00D1");
  }
  // ইনপুট-স্ট্রিং-এ আগের/পরের চরিত্র পাওয়ার হেল্পার
  const isWordChar = (c: string | null) =>
    c !== null && /[A-Za-z0-9\u0980-\u09FF]/.test(c);
  const resPrev = () => (i > 0 ? s[i - 1] : null);
  const resNext = () => (i + 1 < s.length ? s[i + 1] : null);
  let out = "";
  let open = true;
  let i = 0;
  for (const ch of s) {
    i++;
    if (ch === '"') {
      // সোজা দুই উদ্ধৃতি — প্রসঙ্গ অনুযায়ী “/” গ্লিফে
      out += open ? "\u00D2" : "\u00D3";
      open = !open;
    } else if (ch === "'") {
      // সোজা এক উদ্ধৃতি — জোড়ায় ওপেন/ক্লোজ হয় (D4–D5); শব্দের ভেতরে
      // (অ্যাপোস্ট্রফি) হলে ক্লোজ Õ; অন্যথায় ওপেন D4
      const prevIn = resPrev();
      const nextIn = resNext();
      const apostrophe =
        isWordChar(prevIn) && isWordChar(nextIn);
      if (apostrophe) {
        out += "\u00D5"; // apostrophe → ’
      } else if (open) {
        out += "\u00D4"; // leading/open → ‘
        open = false;
      } else {
        out += "\u00D5"; // trailing/close → ’
        open = true;
      }
    } else if (map[ch]) {
      out += map[ch];
    } else {
      out += ch;
    }
  }
  return out;
}

// সুনতন্নী-প্রি-কার কোড (ে-কার ‡, ৈ-কার †, ডট-ওয়ালা ˆ ‰)
// প্রি-কার যেকোনো বাংলা শব্দের **শুরুতে** বসে। লাইব্রেরির
// ReArrangeUnicodeText ইউনিকোড-পজিশন থেকে শব্দ-শুরুতে সরায় — কিন্তু
// '+' বা অন্য অ-বাংলা চরিত্রের সাথে থাকলে পজিশন ভুল থেকে যায়
// (যেমন শ+ে+র → k‡++i হয়ে যায়, শব্দ-শুরুতে না)। তাই লাইব্রেরির পরে
// আবার সরিয়ে দেওয়া হয়।
function relocatePreKars(s: string): string {
  // ‡ † ˆ ‰ একটাই একটাই নিয়ে তাদের পজিশন থেকে তুলে নিয়ে ওই "শব্দের"
  // (পরপর বাংলা/হাফন্ত/প্লাস/ড্যাশ/হাইফেন অংশ) প্রথম স্থানে বসাও
  const PRE = "\u2021\u2020\u02C6\u2030";
  // বিজয়-রূপান্তরের পর বাংলা অক্ষর লাতিন a–z কোডে — সেগুলো সবই শব্দের
  // ভেতরে। শুধু বিরামচিহ্ন (OUT) আর ফাঁক শব্দের সীমান্ত:
  const OUT = ".,;:!|\\'\"\u00D1\u00D2\u00D3\u00D4\u00D5";
  let res = "";
  for (const ch of s) {
    if (PRE.includes(ch)) {
      // শব্দ-শুরু = সের আগের যেকোনো OUT/ফাঁকের ঠিক পরে (বা স্ট্রিং-শুরু)
      let start = 0;
      for (let i = res.length - 1; i >= 0; i--) {
        const prev = res[i];
        if (OUT.includes(prev) || /\s/.test(prev)) {
          start = i + 1;
          break;
        }
      }
      res = res.slice(0, start) + ch + res.slice(start);
    } else {
      res += ch;
    }
  }
  return res;
}

export function convertToBijoy(text: string): string {
  // ১) বিরামচিহ্ন প্রথমে বিজয়-কোডে; ২) বাংলা অক্ষর লাইব্রেরি দিয়ে;
  // ৩) প্লেসহোল্ডার U+E001 → \\\\ (ডাবল-দারি); ৪) প্রি-কার শব্দ-শুরুতে সারাও
  return relocatePreKars(
    libUnicodeToBijoy(preMapPunctuation(text)).replace(/\uE001/g, "\u005C\u005C"),
  );
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

  // পাঙকচুয়েশন-শুধু রানের প্রসঙ্গ নির্ণয়ের জন্য আগে-পিছের রানের টেক্সট লাগে —
  // সেজন্য প্রথমে সব টেক্সট নোডের কন্টেক্সট হিসাব করি।
  const contextOf = new Map<Element, "bangla" | "latin" | "punct">();
  for (const node of textNodes) {
    const text = node.textContent ?? "";
    const run = node.parentElement; // w:r
    if (!run) continue;
    const hasLat = LATIN_RE.test(text);
    const hasBan = BANGLA_RE.test(text);
    if (hasBan) {
      contextOf.set(run, "bangla");
    } else if (hasLat) {
      contextOf.set(run, "latin");
    } else {
      contextOf.set(run, "punct"); // শুধু-বিরামচিহ্ন — পরে নেবার-কন্টেক্সট দেখে নির্ণয়
    }
  }
  // দ্বিতীয় ধাপ: শুধু-বিরামচিহ্ন রানের প্রসঙ্গ — দূরত্ব-সীমিত নেবার-দেখা:
  // দুই দিকে অনধিক ৩ রান অবধি দেখা হয়; বাংলা-প্রসঙ্গের পাশে থাকলে বাংলা।
  for (const node of textNodes) {
    const run = node.parentElement;
    if (!run || contextOf.get(run) !== "punct") continue;
    let found: "bangla" | "latin" | null = null;
    for (let d = 1; d <= 3 && !found; d++) {
      for (const sib of [run.previousElementSibling, run.nextElementSibling]) {
        if (!sib || sib.localName !== "r") continue;
        const c = contextOf.get(sib as Element);
        if (c === "bangla") { found = "bangla"; break; }
        if (c === "latin") { found = "latin"; break; }
      }
    }
    contextOf.set(run, found ?? "bangla"); // সংদর্ভ অজানা হলে ডকুলেন্টে বাংলাই প্রাধান্য
  }

  for (const node of textNodes) {
    const text = node.textContent ?? "";
    if (!text || !hasBanglaOrPunct(text)) continue;
    const run = node.parentElement!;
    const ctx = contextOf.get(run) ?? "punct";
    // নেবার-কনটেক্সট দিয়ে রূপান্তর: পাঙকচুয়েশন-শুধু রান প্রসঙ্গ অনুযায়ী —
    // লাতিন-প্রসঙ্গে ASCII-সমতুল্য, বাংলা-প্রসঙ্গে সুনতন্নী ড্যাশ/কোট-কোড।
    // লাতিন-প্রসঙ্গে কর্লি-কোট/ড্যাশ-টাইপ বিরামচিহ্নকে আগেই ASCII-সমতুল্যে
    // নেউট্রাল করা হয় (সুনতন্নী-কোডে ম্যাপ হওয়ার আগে), ফলে লাইব্রেরি আর
    // এগুলোকে হ-/র-আকারের সুনতন্নী গ্লিফে বদলায় না।
    const conv =
      ctx === "latin"
        ? convertToBijoy(neutralizeLatinPunct(text))
        : convertToBijoy(text);
    const converted = sanitizeXml(conv);
    node.textContent = converted;

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
      const want = needsSutonnyMJ(plan.text, plan.convText)
        ? "SutonnyMJ"
        : "Times New Roman";
      rFontsAttr(plan.run, ns, want);
      // ইংলিশ/ল্যাটিন রানগুলো বাংলার চেয়ে এক ধাপ ছোট (−2pt) — ডকের
      // ডিফল্ট সাইজ ধরে: বাংলা ডিফল্টে থাকে, ইংলিশে sz কমানো হয়
      if (want === "Times New Roman") smRunSize(plan.run, ns);
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
    if (want === "Times New Roman") smRunSize(run, ns);
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

/**
 * কনভার্টেড বিজয় টেক্সটকে প্রিভিউর জন্য ফন্ট-সেগমেন্টে ভাগ করে।
 * DOCX পাইপলাইনের splitMixedRun-এর একই সন্দর্ভ-নিয়ম:
 *   বাংলা অক্ষর → বাংলা; ল্যাটিন/সংখ্যা → নন-বাংলা;
 *   বাংলা-বিরামচিহ্ন/বাকি সব → আগের সন্দর্ভ অনুসরণ (ফলো-থ্রু)।
 */
/** ইউনিকোড ইনপুট-পাশের পর্যালোচনাযয় রান ভাগ করে — প্রিভিউতে বাংলা/লাতিন
 * নির্ধারণের জন্য। ইনপুট চরিত্রের ওপর ভিত্তি করে প্রতিটি চরিত্রের বিজয় রূপের
 * স্ট্রিংটি বর্তমান সেগমেন্টে জোড়া হয়, ফলে আউটপুট-সাইজিং ইনপুটের ভাষার সাথে
 * মিলে যায় (বিজয়-কোড সব লাতিন-রেঞ্জ, তাই আউটপুট পাশে ভাগ করা যায় না)। */
export function segmentBijoyText(text: string): { text: string; bangla: boolean }[] {
  const segments: { text: string; bangla: boolean }[] = [];
  let curText = "";
  let curBangla = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const prevLetter = i > 0 && /[A-Za-z0-9\u0980-\u09FF]/.test(text[i - 1]);
    const nextLetter =
      i + 1 < text.length && /[A-Za-z0-9\u0980-\u09FF]/.test(text[i + 1]);
    const banglaPunct = /[।॥\u2014\u2013\u201C\u201D\u2018\u2019,’;\u0022\u0027]/.test(ch);
    let newBangla: boolean;
    if (BANGLA_RE.test(ch)) {
      newBangla = true;
    } else if (banglaPunct) {
      // নিকটতম-সাথি লেখা-চরিত্র: যেকোনো পাশে লেখা-চরিত্র থাকলে পাশেরই
      // সেগমেন্টে; দাঁড়ি/ডাবল-দারি সদাই বাংলা।
      if (ch === "।" || ch === "॥") {
        newBangla = true;
      } else if (prevLetter || nextLetter) {
        const nearLatin =
          (i > 0 && /[A-Za-z0-9]/.test(text[i - 1])) ||
          (i + 1 < text.length && /[A-Za-z0-9]/.test(text[i + 1]));
        newBangla = !nearLatin;
      } else {
        newBangla = curBangla;
      }
    } else if (/[A-Za-z0-9]/.test(ch)) {
      newBangla = false;
    } else {
      newBangla = curBangla;
    }
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
  return inputSegs.map((s) => ({ text: convert(s.text, direction), bangla: s.bangla }));
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
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const b = BANGLA_RE.test(ch);
    // দাঁড়ি (U+0964), কোট ইত্যাদি বাংলা রেঞ্জের বাইরে, তাই তাদের জন্য
    // কনটেক্সট উত্তরাধিকার সূত্রে ফেলে: বর্তমান সন্ধার্টরের অনুসরণ করে।
    const isPunct = PUNCT_RE.test(ch);
    const isLatinChar = /[A-Za-z0-9]/.test(ch);
    // নতুন সেগমেন্টের বাংলা-ফ্ল্যাগ: বাংলা অক্ষর → বাংলা; ল্যাটিন অক্ষর/সংখ্যা →
    // নন-বাংলা; পাঙ্কচুয়েশন → নিকটতম সাথি-লেখা-চরিত্র দেখে — যেকোনো পাশে লেখা
    // অক্ষর থাকলে তারই সেগমেন্টে; দাঁড়ি/ডাবল-দারি সদাই বাংলা; নইলে ফলো-থ্রু।
    let newBangla: boolean;
    if (b) {
      newBangla = true;
    } else if (isLatinChar) {
      newBangla = false;
    } else if (isPunct) {
      if (ch === "।" || ch === "॥" || ch === "।") {
        newBangla = true;
      } else if (i > 0 || i + 1 < text.length) {
        const nearBangla =
          (i > 0 && BANGLA_RE.test(text[i - 1])) ||
          (i + 1 < text.length && BANGLA_RE.test(text[i + 1]));
        const nearLatin =
          (i > 0 && /[A-Za-z0-9]/.test(text[i - 1])) ||
          (i + 1 < text.length && /[A-Za-z0-9]/.test(text[i + 1]));
        if (nearLatin) newBangla = false;
        else if (nearBangla) newBangla = true;
        else newBangla = curBangla;
      } else {
        newBangla = curBangla;
      }
    } else {
      newBangla = curBangla;
    }
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
    const want = seg.bangla ? "SutonnyMJ" : "Times New Roman";
    rFontsAttr(nr, ns, want);
    if (want === "Times New Roman") smRunSize(nr, ns);
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

/** ইংলিশ/ল্যাটিন রানের সাইজ −2pt করা (ডকের ডিফল্ট সাইজ ধরে) —
 *  ডক/প্যারাগ্রাফ স্টাইলের rPr থেকে ডিফল্ট ডকুমেন্ট সাইজ বের করে, তার তুলনায়
 *  হাফ-পয়েন্ট হিসেবে ৪ কম (2pt) w:sz/w:szCs দেওয়া হয়। ইতোমধ্যে রানের নিজস্ব
 *  sz থাকলে তার তুলনায় ৪ কম করা হয়। */
function smRunSize(run: Element, ns: string): void {
  const doc = run.ownerDocument!;
  let rPr = run.querySelector(":scope > rPr");
  if (!rPr) {
    rPr = doc.createElementNS(ns, "w:rPr");
    run.insertBefore(rPr, run.firstChild);
  }
  const szElem = rPr.querySelector(":scope > sz");
  const defaultHalf = readDefaultHalfPts(doc, ns);
  const currentHalf = szElem
    ? Number(szElem.getAttributeNS(ns, "w:val") ?? defaultHalf)
    : defaultHalf;
  const newHalf = Math.max(8, currentHalf - 4); // সর্বনিম্ন 4pt
  if (szElem) {
    szElem.setAttributeNS(ns, "w:val", String(newHalf));
  } else {
    const np = makeSzElems(doc, ns, newHalf);
    (rPr ?? run).appendChild(np.sz);
    (rPr ?? run).appendChild(np.cs);
  }
}

/** ডকুমেন্টের ডিফল্ট সাইজ (ডিফল্ট স্টাইল থেকে) হাফ-পয়েন্টে */
function readDefaultHalfPts(doc: Document, ns: string): number {
  const normalStyle = Array.from(
    doc.getElementsByTagNameNS(ns, "docDefaults"),
  )
    .map((dd) =>
      Array.from(dd.getElementsByTagNameNS(ns, "sz")).map((s) =>
        Number(s.getAttributeNS(ns, "w:val")),
      ),
    )
    .flat()
    .find((v) => Number.isFinite(v) && v > 0);
  return normalStyle ?? 28; // ফলব্যাক: 14pt (28 হাফ-পয়েন্ট)
}

/** w:sz + w:szCs এলিমেন্ট জোড়া (বাংলা cs-টেক্সটেও প্রযোজ্য হয়) */
function makeSzElems(
  doc: Document,
  ns: string,
  half: number,
): { sz: Element; cs: Element } {
  const sz = doc.createElementNS(ns, "w:sz");
  sz.setAttributeNS(ns, "w:val", String(half));
  const cs = doc.createElementNS(ns, "w:szCs");
  cs.setAttributeNS(ns, "w:val", String(half));
  return { sz, cs };
}

/** রান-এ rPr/rFonts না থাকলে SutonnyMJ হিন্ট দাও; থাকলে নাম বদলাও */
function ensureRFonts(run: Element, ns: string, hasBangla: boolean): void {
  rFontsAttr(run, ns, hasBangla ? "SutonnyMJ" : "Times New Roman");
}
