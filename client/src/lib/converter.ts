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
// বিজয়-মিশ্র টেক্সটে (রিস্টোর-পরবর্তী) ইউনিকোডে U+0980-09FF বাংলা লেটার থাকে না —
// কারণ বিজয় a-z ASCII-তে ম্যাপ হয়; তবে প্রি-কার-চিহ্ন (‡ † ˆ ‰) এবাং অনুস্বার/
// বিসর্গ (ঁ ং ঃ) থাকলে এটি বাংলা-প্রসঙ্গ।
const PRE_KAR_MARKERS_RE = /[‡†ˆ‰ঁংঃ]/;

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
    // ঋ-কার (U+09C3) — সুনতন্নী-কোড e„ (U+0065 U+201E)। লাইব্রেরি শব্দ-শেষে/
    // একক ঋ-কারে ভুলে U+2026 (এলিপসিস) এমিট করে — এখানেই e„-তে বসানো হয,
    // যাতে পরের এলিপসিস-নর্মালাইজেশন (2026→"...") এটাকে স্পর্শ না করে।
    "\u09C3": "\u201E",
  };
  // ইংরেজি-প্রসঙ্গের কর্লি-কোট/ড্যাশ কোথায়? টেক্সটে অন্য কোনো বাংলা
  // অক্ষর নেই এবং লাতিন-চরিত্রের পাশে (অথবা কোনো পাশেই কিছু নেই) — সেগুলো
  // নেউট্রাল করা হয় কারণ লাইব্রেরি নিজেই “ ” — কে Ò Ó Ñ-এ ম্যাপ করে ফেলে।
  // বাংলা-প্রসঙ্গের ড্যাশ/কোট আগের মতই নিচে বিজয়-কোডে ম্যাপ হয়।
  if (!BANGLA_RE.test(s) && !PRE_KAR_MARKERS_RE.test(s)) {
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
    } else if (ch === "\u00D2") {
      // আমার নেটিভ ওপেন-ডাবল-কোট (Ò) — কনভার্টারের " টোগলের মতোই
      // হুবহু বসানো হয এবাং জোড়ার স্টেট নেয় (D3 আসতে) — পরে বাড়তি
      // রানের কোট-দিক সঠিক রাখে।
      out += ch;
      open = false;
    } else if (ch === "\u00D3") {
      // আমার নেটিভ ক্লোজ-ডাবল-কোট (Ó) — স্টেট ফেরত ওপেনে।
      out += ch;
      open = true;
    } else {
      out += ch;
    }
  }
  return out;
}

// লাইব্রেরি-নেটিভ আর্টিফ্যাক্ট (U+E002/U+E003): লাইব্রেরি চ্ছ (ch+ch+h) →
// ”Qv / ”Qvq এবাং ন্থ → š’ এমিট করে — এগুলো আমাদের প্রি-ম্যাপের
// কোট-মার্কার (D2–D5) নয়, সোজা বিজয়-কোড। রিস্টোর-পরবর্তী পুনরূৎপাদনে
// (unmap D3→” হওয়ার পর) আমাদের preMap ”→Ó করে ফেলত — ফলে দ্বিতীয়
// রানে ডাবল-ম্যাপ হয়ে আউটপুট ভেঙে যায় (†k‡l ï‡fÓQvq)। সমাধান: preMap-এর
// আগে এই প্যারান্টারের আর্টিফ্যাক্টকে প্রাইভেট-প্ল্যাসহোল্ডারে সার্ক করে পরে ফেরত আনা।
const ART_PH_D3 = "\uE002";
const ART_PH_D5 = "\uE003";
function protectLibArtifacts(s: string): string {
  // আর্টিফ্যাক্ট স্প্যান: চ্ছ → ”Q (শুধু ”Q — এর পরের v/q আ-কার/য়-কোড, স্পৃশ্য নয়)
  return s.replace(/\u201DQ/g, ART_PH_D3).replace(/\u0161\u2019/g, ART_PH_D5);
}
function restoreLibArtifacts(s: string): string {
  // চ্ছ-আর্টিফ্যাক্ট (”Q) — Q অংশটি ছ-লেটার-কোড (0x51) যা protect-এ খাওয়া হয়েছিল;
  // রিস্টোরে ”Q (মার্কার + লেটার) দুইটাই ফেরত বসানো হয়।
  return s.replace(new RegExp(ART_PH_D3, "g"), "\u201DQ").replace(new RegExp(ART_PH_D5, "g"), "\u0161\u2019");
}

// লাইব্রেরি পুরো বাক্য একবারে পেলে শুধু পুরো টেক্সটের শুরুতে ‡→† করে।
// ফলে `এখন রেল এখন`-এর মাঝের `রেল` ভুল করে `‡ij` হয়, যদিও সেটি নতুন
// শব্দের শুরু। আগে থেকেই preMap করা punctuation রেখে প্রতিটি Unicode শব্দ
// আলাদা করে লাইব্রেরিতে পাঠালে: শব্দের শুরুতে †, শব্দের ভেতরে ‡ — দুটোই ঠিক থাকে।
// punctuation/space আলাদা টোকেন হিসেবে থাকে, তাই quote state এবং glyph code
// বদলে যায় না; `শ+ে+র`-এর মতো explicit-plus token-ও ভাঙা হয় না।
const WORD_AWARE_BREAK_RE = /(\s+|[,;:!?()[\]{}"'“”‘’—–|ÑÒÓÔÕ\uE001])/;

function libUnicodeToBijoyWordAware(preMapped: string): string {
  return preMapped
    .split(WORD_AWARE_BREAK_RE)
    .map((part) => {
      if (!part || WORD_AWARE_BREAK_RE.test(part)) return part;
      return libUnicodeToBijoy(part);
    })
    .join("");
}

// ReArrangeUnicodeText ইউনিকোড-পজিশন থেকে শব্দ-শুরুতে সরায় — কিন্তু
// '+' বা অন্য অ-বাংলা চরিত্রের সাথে থাকলে পজিশন ভুল থেকে যায়
// (যেমন শ+ে+র → k‡++i হয়ে যায়, শব্দ-শুরুতে না)। তাই লাইব্রেরির পরে
// আবার সরিয়ে দেওয়া হয়।
export function convertToBijoy(text: string): string {
  // ১) বিরামচিহ্ন প্রথমে বিজয়-কোডে; ২) বাংলা অক্ষর লাইব্রেরি দিয়ে;
  // ৩) প্লেসহোল্ডার U+E001 → \\ (ডাবল-দারি)
  // নোট: relocatePreKars সরানো হয়েছে — সুনতন্নী/বিজয়ে ‡/† শব্দ-শুরুতে বসানো
  // আমাদের হাতে পজিশন-বদলানো শব্দ ভেঙে দেয় (কাজ→KvR, কথা→K_v ইত্যাদি)।
  // লাইব্রেরির ReArrangeUnicodeText পজিশনই সঠিক।
  // নোট: U+2026 (এলিপসিস) — লাইব্রেরি ইউনিকোড→বিজয়ে এটি "..." (তিন ডট)
  // করে দেয়, যা পরবর্তী বিজয়→ইউনিকোড রাউন্ড-ট্রিপে "…Z" কোড সঙ্গে মিশে
  // করাপশন দেয়। ইনপুটেই তিন-ডটে নর্মালাইজ করা হয় — দুই রানই একই আউটপুট দেবে।
  // নোট: লাইব্রেরি-আর্টিফ্যাক্ট প্রোটেকশন — protectLibArtifacts (preMap-এর আগে)
  // দেখো; দ্বিতীয় রানেও ডাবল-ম্যাপ রোধ করা হয়।
  return restoreLibArtifacts(
    libUnicodeToBijoyWordAware(
      preMapPunctuation(protectLibArtifacts(text.replace(/\u2026/g, "..."))),
    ),
  )
    .replace(/\u2026/g, "...") // লাইব্রেরি-পুনঃতৈরি U+2026 → তিন-ডট
    .replace(/\uE001/g, "\u005C\u005C")
    // লাইব্রেরির native e-kar placement অক্ষুণ্ণ রাখা হয়:
    // শব্দের শুরুতে † (U+2020), আর শব্দের মাঝখানে ‡ (U+2021)।
    // ‡-কে † করলে mid-word e-kar-এর মাত্রা ভেঙে যায়।
}

export function convertToUnicode(text: string): string {
  let r = libBijoyToUnicode(text);
  // বিপরীত দিকেও সাংকেতিক কোডপয়েন্টগুলো নর্মালাইজ করা।
  // লাইব্রেরি ইতোমধ্যে Ò→“ Õ→’ Ñ→— রাউন্ড-ট্রিপ করে।
  // সুনতন্নীতে \\ (U+005C) = ডাবল-দারি — হাতে বিজয়-থেকে বাংলায় বদলাও।
  // সতর্কতা: আগে দুটো টানা ব্যাকস্ল্যাশ-জোড়া → ॥, তারপর একক ব্যাকস্ল্যাশ → ॥
  // করা হত — ফলে যেকোনো যথার্থ লিটারাল ব্যাকস্ল্যাশও ॥ হয়ে যেত।
  // এবার শুধু সুনতন্নী-ডাবল-দারির প্রতিষ্ঠিত জোড়া (\\) বদলানো হয়;
  // বিজয়-কোড টেক্সটে একক \\ থাকার প্রাসঙ্গিক ব্যবহার নেই, তাই সেটি স্পর্শ করা হয় না।
  r = r.replace(/\u005C{2}/g, "॥");
  r = r.replace(/\u007C/g, "।");
  // প্লেসহোল্ডার (যদি কোনো বিজয় টেক্সটে U+E001 এসে থাকে)
  r = r.replace(/\uE001/g, "॥");
  // লাইব্রেরি-অ্যাসিমেট্রি-ফিক্স: b2u-তে q → U+09DF আসে, অথচ 9AF+9BC → q —
  // NFD নার্মালাইজেশনে 09DF → 9AF 9BC, রাউন্ড-ট্রিপ রক্ষা করে।
  r = r.replace(/য়/g, "য়");
  return r;
}

// উদাহরণস্বরূপ রূপান্তরিত সুনতন্নী-কোড চিহ্ন (preMapPunctuation-এর আউটপুট):
// Ô Ò Ó Õ (কোট), Ñ (ড্যাশ), U+E001 (ডাবল-দারি-প্লেসহোল্ডার)।
// ইউজার রিপোর্ট: সুনতন্নী আউটপুট ওয়ার্ডে পেস্ট করে কোনো অংশ ভুলে
// অন্য ফন্টে (TNR) নিলে, তা আবার u2b-ইনপুটে বসলে হিজি-বিজি হয় —
// কারণ রূপান্তরিত পাঙকচুয়েশন কোডগুলো আবার preMapPunctuation-এর
// মাধ্যমে দ্বিতীবার ম্যাপিংয়ের চেষ্টা হয়।
// সমাধান: ইনপুটে যদি রূপান্তরিত-কোড থাকে, প্রথমে একবার
// convertToUnicode দিয়ে সাফ ইউনিকোডে পুনরুদ্ধার করা হয়,
// তারপর convertToBijoy চলায়। এটি যেকোনো-ধাপের (১ বার বা বেশি)
// রূপান্তরিত টেক্সটকেও পরিষ্কার করে।
const BIJOY_PUNCT_MARKERS = /[\u00D1\u00D2\u00D3\u00D4\u00D5\uE001]/;

export function isLikelyConvertedBijoy(text: string): boolean {
  if (!BIJOY_PUNCT_MARKERS.test(text)) return false;
  // লাতিন-শব্দের প্রসঙ্গেও এ কোডগুলো পড়তে পারে — তবে রূপান্তরের
  // আগে উল্টে-ম্যাপ করা নিরাপদ, কারণ উল্টো-ম্যাপের পরেও পরবর্তী
  // convertToBijoy সঠিক প্রসঙ্গে আবার একই কোড বসাবে।
  return true;
}

/**
 * আমাদের প্রি-ম্যাপিংয়ের ঠিক উল্টো: শুধু preMapPunctuation-এর মার্কার
 * (D1–D5, E001, সুনতন্নী-ডাবল-দারি \\ এবাং লাইব্রেরি-দাঁড়ি |) নেউট্রাল
 * ইউনিকোডে ফেরত নেয় — বিজয়-লেটার কোড (a-z ইত্যাদি) স্পর্শ করে না।
 * পুরো libBijoyToUnicode রাউন্ড-ট্রিপ নয়, কারণ সেটি পাঙকচুয়েশন/কিছু
 * কোড নর্মালাইজ করে ফেলে এবাং একই-অর্থের ভিন্ন-বাইট বিজয় আউটপুট দেয়।
 */
export function unmapOurMarkers(text: string): string {
  return text
    .replace(/\u00D1/g, "—")   // Ñ → এম-ড্যাশ
    .replace(/\u00D2/g, "\u201C") // Ò → “
    .replace(/\u00D3/g, "\u201D") // Ó → ”
    .replace(/\u00D4/g, "\u2018") // Ô → ‘
    .replace(/\u00D5/g, "\u2019") // Õ → ’
    .replace(/\uE001/g, "\u0965") // প্লেসহোল্ডার → ॥
    .replace(/\u005C\u005C/g, "\u0965") // সুনতন্নী ডাবল-দারি → ॥
    .replace(/\u007C/g, "।");     // লাইব্রেরি-দাঁড়ি → ।
}

// সুনতন্নী-কোড-রানে (নতুন-টাইপ-বাংলা নেই) ব্যবহারের জন্য হালকা-সংস্করণ:
// শুধু প্রসঙ্গ-স্বাধীন কোড — প্ল্যাসহোল্ডার (E001), সুনতন্নী-ডাবল-দারি (\\)
// এবাং লাইব্রেরি-দাঁড়ি (|) — নেউট্রাল ইউনিকোডে নেয। D1–D5 (কোট/ড্যাশ)
// কনভার্টার-নেটিভ; সুনতন্নী-প্রসঙ্গে হুবহু পাস-থ্রু — এটা দ্বিতীয়-রানের
// লাতিন-প্রসঙ্গের নেউট্রালাইজেশন থেকে রক্ষা করে।
function unmapContextFreeMarkers(text: string): string {
  return text
    .replace(/\uE001/g, "\u0965")
    .replace(/\u005C\u005C/g, "\u0965")
    .replace(/\u007C/g, "।");
}

// বিজয-কোড-চরিত্রগুলো (আমাদের মার্কার + বিজয-নেটিভ ডাবল-দারি-প্ল্যাসহোল্ডার):
const OUR_MARKER_RE = /[\u00D1-\u00D5\u005C\u005C\u007C\uE001]/;

/** দিক-সুইচ/পুনরুৎপাদনের আগে টেক্সট সাফ ইউনিকোডে ফেরত আনে।
 *  **রান-ভিত্তিক:** পুরো-টেক্সট একসাথে আনে-ম্যাপ করলে আংশিক-বিজয মিশ্র টেক্সট
 *  (যেমন হাফ-বিজয + নতুন টাইপ একসাথে) হিজি-বিজি হয়ে যায় — কারণ হাফ-বিজয
 *  অংশের মার্কার আনে-ম্যাপ হলে পরের ট্যাগ-ম্যাপ দুই-বার চড়ে যায়। সমাধান:
 *  শুধু সেই রান-ই আনে-ম্যাপ হয় যেখানে বাংলা-অক্ষর নেই এবাং বিজয-কোড-চিহ্ন
 *  (মার্কার/\জোড়া/|) আছে। বাংলা-অক্ষর-থাকা রান সরাসরি ম্যাপ হয় (নতুন টাইপ);
 *  লাতিন-রান যেখানে কোনো কোড-চিহ্ন নেই তা পাস-থ্রু হয় (ইংরেজি/সংখ্যা, সরাসরি লাইব্রেরি-পাস)। */
export function restoreCleanUnicode(text: string): string {
  // বিজয-কোড-চরিত্র না থাকলে কিছুই করতে হয় না
  if (!BIJOY_PUNCT_MARKERS.test(text)) return text;
  // একটি রানে কোড-চিহ্নই না থাকলে পুরো-টেক্সটেই কিছু নেই — পাস-থ্রু
  if (!OUR_MARKER_RE.test(text)) return text;
  // রান-বিভক্ত: বাংলা-অক্ষরের সাথে/ছাড়া
  let out = "";
  for (const seg of text.split(/([\u0980-\u09FF]+)/)) {
    if (seg === "") continue;
    const hasBangla = /[\u0980-\u09FF]/.test(seg);
    if (hasBangla) {
      // নতুন-টাইপ ইউনিকোড-রান — সরাসরি ম্যাপ
      out += convertToBijoyRaw(seg);
    } else if (OUR_MARKER_RE.test(seg)) {
      // বিজয-কোড-রান — প্রথমে আনে-ম্যাপ, তারপর সরাসরি ম্যাপ।
      // সুনতন্নী-প্রসঙ্গের (কোনো নতুন-টাইপ-বাংলা নেই) রানে D1–D5
      // কনভার্টার-নেটিভ কোট/ড্যাশ-কোড — পুরো-আনম্যাপ করলে পরের
      // convertToBijoyRaw-এর preMap লাতিন-প্রসঙ্গ ধরে ”/”/— এ বদলে দিত
      // (–GB, কোট-দিক-পালট)। তাই এ রানে শুধু প্রসঙ্গ-স্বাধীন কোড
      // (প্ল্যাসহোল্ডার/ডাবল-দারি/দারি) আনম্যাপ হয়; D1–D5 হুবহু পাস-থ্রু।
      out += convertToBijoyRaw(unmapContextFreeMarkers(seg));
    } else {
      // লাতিন-রান (কোনো কোড-চিহ্ন নেই) — লাইব্রেরি-পাস-থ্রু
      out += seg;
    }
  }
  return out;
}

/** আনে-ম্যাপড ইউনিকোড-সেগমেন্টের ম্যাপ (প্রি-কার/আর্টিফ্যাক্ট-প্রোটেক্ট সহ) */
function convertToBijoyRaw(seg: string): string {
  return restoreLibArtifacts(
    libUnicodeToBijoy(preMapPunctuation(protectLibArtifacts(seg.replace(/\u2026/g, "..."))))
  )
    .replace(/\u2026/g, "...")
    .replace(/\uE001/g, "\u005C\u005C")
    // restoreCleanUnicode-এও native e-kar placement অক্ষুণ্ণ রাখা হয়:
    // শুরুতে †, শব্দের মাঝে ‡। mid-word মাত্রা রক্ষার জন্য কোনো collapse নয়।
}

export function convert(text: string, direction: ConvertDirection): string {
  if (direction === "u2b") {
    // ইনপুট আগে থেকে রূপান্তরিত সুনতন্নী হলে (ফাইল থেকে পেস্ট/আপলোড)
    // প্রথমে পুনরুদ্ধার, তারপর রূপান্তর — দুইগুণ ম্যাপিং (হিজি-বিজি) রোধ করে।
    const clean = restoreCleanUnicode(text);
    return clean === text ? convertToBijoy(text) : convertToBijoy(clean);
  }
  // b2u-তেও ইতোমধ্যে সুনতন্নী-কোড থাকার সম্ভাবনা — সরাসরি পাস-থ্রু-লাইক
  // আচরণ রাখে (convertToUnicode-এর লাইব্রেরি-রাউন্ড-ট্রিপ ক্ষতি করে না)।
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
    // সাব-নোডের ক্রম ঠিক রাখতে: w:t এবাং w:br রানগুলো বডি-ক্রমে প্রসেস করা হয়।
    // কারণ: w:br-শুধু রানে (<w:r><w:br/></w:r>) কোনো w:t থাকে না —
    // w:t-লুপে তারা এড়িয়ে যায় এবাং লাইন-বিরতি হারিয়ে যায়।
    const runs = doc.getElementsByTagName("w:r");
    let out = "";
    for (let i = 0; i < runs.length; i++) {
      const r = runs[i] as Element;
      const p = r.parentElement; // w:p
      if (!p) continue;
      const texts = r.getElementsByTagName("w:t");
      for (let j = 0; j < texts.length; j++) {
        out += texts[j].textContent ?? "";
      }
      // রান-সীমান্তে ফাঁকা-স্থান — প্রতি-রান একবারই যোগ করা হয়
      if (r.nextElementSibling && texts.length > 0) {
        out += " ";
      }
      // ব্রুক-লাইন (<w:br/>) — রানের ভেতরেই লাইন-বিরতি চাইতে পারে
      const brs = r.getElementsByTagName("w:br");
      if (brs.length > 0) out = out.replace(/ $/, "") + "\n";
      // রান প্যারাগ্রাফের শেষ রান হতে পারে — প্যারাগ্রাফ-সীমান্তে " " সরানো হয়
      // এবাং নতুন লাইন যোগ করা হয়
      if (!r.nextElementSibling && p.nextElementSibling) {
        // প্যারাগ্রাফের শেষ রান — পরের সিবলিং w:p/w:tbl হওয়ার আগে লাইন-বিরতি।
        out = out.replace(/ $/, "") + "\n";
      }
      // শেষ প্যারাগ্রাফের পর টেবিল/সেকশন/বডি-সীমান্ত — অতিরিক্ত নতুন-লাইন দরকার নেই
    }
    return out.replace(/\n +\n/g, "\n\n");
  }
  return await file.text();
}

export async function convertFile(
  file: File,
  direction: ConvertDirection,
): Promise<FileConvertResult> {
  const name = file.name.replace(/\.(docx|txt)$/i, "");
  // আউটপুট-ফাইলনাম দিক অনুযায়ী: অভ্র→বিজয় = _bijoy, বিজয়→অভ্র = _avro
  const suffix = direction === "u2b" ? "_bijoy" : "_avro";
  if (file.name.toLowerCase().endsWith(".docx")) {
    const blob = await convertDocx(file, direction);
    return { kind: "docx", blob, name: `${name}${suffix}.docx` };
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
  return { kind: "txt", blob, name: `${name}${suffix}.txt` };
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

  // EndnoteReference is a character style used only by Word's endnote markers.
  // Clear a direct style-level font override, if a source file has one, so it
  // cannot compete with the explicit SutonnyMJ font mapping we write on each
  // endnote-reference run. This deliberately leaves every ordinary paragraph,
  // every other style, and the superscript behavior untouched.
  const stylesEntry = zip.file("word/styles.xml");
  if (stylesEntry) {
    const stylesXml = await stylesEntry.async("string");
    const cleanStyles = stripIllegalXmlChars(stylesXml);
    const normalizedStyles = normalizeEndnoteReferenceStyle(cleanStyles);
    zip.file("word/styles.xml", normalizedStyles);
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
  const generatedRuns = new Set<Element>();
  for (const plan of runPlans) {
    if (plan.mixed) {
      // মূল টেক্সটেই সেগমেন্ট ভাগ করি, প্রত্যেক সেগমেন্ট আলাদা রূপান্তরিত হয় —
      // বিজয়-কনভার্টার প্রতি-টেক্সট রূপান্তর করে বলে সেগমেন্ট-আলাদা করাই সঠিক
      for (const generatedRun of splitMixedRun(plan.run, ns, plan.text, convertFn)) {
        generatedRuns.add(generatedRun);
      }
    } else {
      // সিন্ধান্ত: উৎসে বাংলা থাকলে, অথবা রূপান্তর-পরবর্তী টেক্সটে বিজয়-
      // পাঙ্কচুয়েশন (দাঁড়ি ', কোট ইত্যাদি) থাকলে → SutonnyMJ; বাকি সব →
      // Times New Roman। এতে দাঁড়ি-শুধু রানও সঠিক ফন্টে থাকে।
      const want = needsSutonnyMJ(plan.text, plan.convText)
        ? "SutonnyMJ"
        : "Times New Roman";
      rFontsAttr(plan.run, ns, want);
      // ইংলিশ/ল্যাটিন রানগুলো বাংলার চেয়ে এক ধাপ ছোট (−2pt) — ডকের
      // ডিফল্ট সাইজ ধরে: বাংলা ডিফল্টে থাকে, ইংলিশে sz কমানো হয়।
      // বয়তিক্রম: সুপারস্ক্রিপ্ট রান (ফুটনোট/ইন্ডনোট রেফারেন্স মার্ক) —
      // sz কমানোও হয় না, বাড়ানোও হয় না; বেস সাইজই থাকে।
      // ওয়ার্ড নিজেই এগুলো ইনহেরিটেড সাইজ + vertAlign super দিয়ে আঁকে —
      // তাই এখানেও হুবহু সেই আচরণ অনুকরণ করা হয় (ম্যানুয়াল মার্কের সমান)।
      if (want === "Times New Roman") {
        // সুপারস্ক্রিপ্ট রান (ফুটনোট/ইন্ডনোট মার্ক) — sz কমানোও নয়,
        // বাড়ানোও নয়; বেস সাইজই রাখা হয়। এটাই Word-এর ম্যানুয়াল
        // সুপারস্ক্রিপ্ট মার্কের আচরণের সাথে সমান (ইনহেরিটেড সাইজ + super)।
        if (isSuperscriptRun(plan.run, ns)) continue;
        smRunSize(plan.run, ns);
      } else {
        // Bengali runs keep their inherited/original size, but if the source
        // file supplied only one of sz/szCs, complete the pair so later Word
        // size edits do not make complex-script sizing diverge.
        ensureRunSizePair(plan.run, ns);
      }
    }
  }

  // তৃতীয় পাস: বাকি সব রান (যেসব স্পর্শ হয়নি) — ফাঁকা-স্থান, ইংরেজি-শুধু বা
  // শুধু-বিরামচিহ্ন রানেও স্পষ্ট ফন্ট দেওয়া। প্রতিটি রানের নিজস্ব টেক্সট অনুযায়ী:
  // ল্যাটিন অক্ষর/সংখ্যা থাকলে Times New Roman, নয়তো SutonnyMJ।
  const allRuns = Array.from(doc.getElementsByTagNameNS(ns, "r"));
  const planned = new Set(runPlans.map((p) => p.run));
  for (const run of allRuns) {
    // splitMixedRun ইতোমধ্যে প্রতিটি নতুন সেগমেন্টে সঠিক ফন্ট বসিয়েছে।
    // এগুলোকে আবার ASCII Bijoy কোড দেখে Times New Roman দিলে SutonnyMJ
    // হারিয়ে যায় এবং ফন্ট-সাইজ বদলালে আউটপুট হিজিবিজি দেখায়।
    if (planned.has(run) || generatedRuns.has(run)) continue;
    const texts = Array.from(run.getElementsByTagNameNS(ns, "t")).map(
      (n) => n.textContent ?? "",
    );
    const joined = texts.join("");
    const want = LATIN_RE.test(joined) ? "Times New Roman" : "SutonnyMJ";
    rFontsAttr(run, ns, want);
    // সুপারস্ক্রিপ্ট মার্ক (ফুটনোট/ইন্ডনোট) — ছোট না করে ৩pt বড় করা
    if (want === "Times New Roman") {
      // সুপারস্ক্রিপ্ট মার্ক — বেস সাইজেই রাখা (নেটিভ মার্কের সমান)
      if (isSuperscriptRun(run, ns)) continue;
      smRunSize(run, ns);
    } else {
      ensureRunSizePair(run, ns);
    }
  }

  // Endnote markerটি Word-এ নিজস্ব superscript run হলেও, বড় source run-এর
  // একেবারে শেষে থাকলে কিছু edit operation সেটিকে পুরো paragraph-এর সঙ্গে
  // যুক্তভাবে ধরতে পারে। তাই marker-এর ঠিক আগের শেষ শব্দটিকে আলাদা ordinary
  // run-এ রাখি। Reference run-এর নিজস্ব style/metadata এবং পরের text run
  // কোনোভাবেই বদলানো হয় না।
  isolateEndnoteAnchorWords(doc, ns);

  // শেষ স্যানিটাইজেশন পাস: split/ফন্ট-assignment-এর পর প্রতিটি direct run-এর
  // rPr-এ sz ও szCs জোড়া একসাথে থাকে কি না নিশ্চিত করি। এই ধাপটি Word-এ
  // পরে font-size বা paragraph indentation বদলালে legacy Bijoy run-এর
  // complex-script sizing বিচ্ছিন্ন হওয়া ঠেকায়।
  for (const run of Array.from(doc.getElementsByTagNameNS(ns, "r"))) {
    ensureRunSizePair(run, ns);
  }
  return new XMLSerializer().serializeToString(doc);
}

/** শুধু EndnoteReference character style-এর direct rFonts override মুছে দেয়।
 *  এতে Word-এর font-change অপারেশনে স্টাইল-লেভেলের প্রতিদ্বন্দ্বী font mapping
 *  থাকে না; তবে superscript ও অন্য সব style property সম্পূর্ণ অক্ষুণ্ণ থাকে। */
function normalizeEndnoteReferenceStyle(xml: string): string {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const endnoteReferenceStyle = Array.from(
    doc.getElementsByTagNameNS(ns, "style"),
  ).find((style) => {
    const styleId =
      style.getAttributeNS(ns, "styleId") ?? style.getAttribute("w:styleId") ?? "";
    return styleId === "EndnoteReference";
  });
  if (!endnoteReferenceStyle) return xml;

  const rPr = Array.from(endnoteReferenceStyle.children).find(
    (child) => child.localName === "rPr",
  );
  if (!rPr) return xml;

  const fontOverrides = Array.from(rPr.children).filter(
    (child) => child.localName === "rFonts",
  );
  if (fontOverrides.length === 0) return xml;
  for (const rFonts of fontOverrides) rPr.removeChild(rFonts);

  return new XMLSerializer().serializeToString(doc);
}

/**
 * Endnote marker-এর সঙ্গে শুধুই তার আগের শেষ শব্দকে adjacent রাখে। Word-এর
 * reference run-কে কখনও text run-এর সঙ্গে merge করা হয় না, কারণ তাতে
 * superscript/font metadata শব্দের উপর চলে আসতে পারে। শুধু একটি safe,
 * single-text-node run split করা হয়; complex field, hyperlink বা mixed-content
 * run স্পর্শ করা হয় না।
 */
function isolateEndnoteAnchorWords(doc: Document, ns: string): void {
  const referenceRuns = Array.from(doc.getElementsByTagNameNS(ns, "r")).filter(
    (run) => Array.from(run.children).some((child) => child.localName === "endnoteReference"),
  );

  for (const referenceRun of referenceRuns) {
    const precedingRun = referenceRun.previousElementSibling;
    if (!precedingRun || precedingRun.localName !== "r" || isSuperscriptRun(precedingRun, ns)) {
      continue;
    }

    // A run containing fields, tabs, breaks, or more than one text node carries
    // formatting semantics that must not be restructured by this narrow pass.
    const directChildren = Array.from(precedingRun.children);
    const textNodes = directChildren.filter((child) => child.localName === "t");
    if (textNodes.length !== 1 || directChildren.some((child) => child.localName !== "rPr" && child.localName !== "t")) {
      continue;
    }

    const textNode = textNodes[0];
    const text = textNode.textContent ?? "";
    // Split only when there is a genuine last word after whitespace. Its leading
    // spacing remains with the ordinary prefix so the reference stays attached
    // to the word without introducing a visible space before the marker.
    const match = text.match(/^([\s\S]*\s)(\S+)$/);
    if (!match) continue;

    textNode.textContent = match[1];
    const anchorWordRun = precedingRun.cloneNode(true) as Element;
    const anchorText = Array.from(anchorWordRun.children).find(
      (child) => child.localName === "t",
    );
    if (!anchorText || !referenceRun.parentNode) {
      textNode.textContent = text;
      continue;
    }
    anchorText.textContent = match[2];
    referenceRun.parentNode.insertBefore(anchorWordRun, referenceRun);
  }
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
  /[।॥…“”‘’—–¢£¤¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ\u007C\u005C]/;

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
  // U+2026 কখনও নিজস্ব <w:r>-এ থাকে। সেটি রূপান্তর না হলে Word SutonnyMJ-তে
  // Unicode ellipsis-কে ঋ/ৃ-কার-সদৃশ glyph হিসেবে আঁকে। উৎসের punctuation-ও
  // Bengali-context run হিসেবে ধরলে `…` → `...` একই SutonnyMJ run-এ থাকে।
  return BANGLA_RE.test(origText) || PUNCT_RE.test(origText) || PUNCT_RE.test(convText);
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
): Element[] {
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
  const generatedRuns: Element[] = [];
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
    if (want === "Times New Roman") {
      smRunSize(nr, ns);
    } else {
      // Mixed runs are newly created here, so complete the Bengali size pair
      // before Word receives the file. Without szCs, changing the font size
      // later can make the legacy Bijoy glyph run reflow unpredictably.
      ensureRunSizePair(nr, ns);
    }
    generatedRuns.push(nr);
    frag.appendChild(nr);
  }
  parent.insertBefore(frag, anchor);
  return generatedRuns;
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
  const szCsElem = rPr.querySelector(":scope > szCs");
  const defaultHalf = readDefaultHalfPts(doc, ns);
  const currentHalf = szElem
    ? Number(szElem.getAttributeNS(ns, "w:val") ?? defaultHalf)
    : szCsElem
      ? Number(szCsElem.getAttributeNS(ns, "w:val") ?? defaultHalf)
      : defaultHalf;
  const newHalf = Math.max(8, currentHalf - 4); // সর্বনিম্ন 4pt
  if (szElem) {
    szElem.setAttributeNS(ns, "w:val", String(newHalf));
  } else {
    const sz = doc.createElementNS(ns, "w:sz");
    sz.setAttributeNS(ns, "w:val", String(newHalf));
    rPr.appendChild(sz);
  }
  if (szCsElem) {
    szCsElem.setAttributeNS(ns, "w:val", String(newHalf));
  } else {
    const szCs = doc.createElementNS(ns, "w:szCs");
    szCs.setAttributeNS(ns, "w:val", String(newHalf));
    rPr.appendChild(szCs);
  }
}

/** বিদ্যমান direct size থাকলে sz এবং szCs-কে একই মানে রাখে, কিন্তু inherited
 * size-এ হস্তক্ষেপ করে না। Word-এর পরবর্তী font-size/paragraph edit-এর সময়
 * এই জোড়া একসাথে থাকা জরুরি, বিশেষত Bijoy ASCII-র complex-script rendering-এ। */
function ensureRunSizePair(run: Element, ns: string): void {
  let rPr = Array.from(run.children).find(
    (child) => child.localName === "rPr",
  ) as Element | undefined;
  if (!rPr) return;
  const szElem = Array.from(rPr.children).find(
    (child) => child.localName === "sz",
  ) as Element | undefined;
  const szCsElem = Array.from(rPr.children).find(
    (child) => child.localName === "szCs",
  ) as Element | undefined;
  if (!szElem && !szCsElem) return;
  const value =
    szElem?.getAttribute("w:val") ??
    szElem?.getAttributeNS(ns, "val") ??
    szCsElem?.getAttribute("w:val") ??
    szCsElem?.getAttributeNS(ns, "val") ??
    "";
  if (!value) return;
  if (szElem) {
    szElem.setAttributeNS(ns, "w:val", value);
  } else {
    const sz = run.ownerDocument!.createElementNS(ns, "w:sz");
    sz.setAttributeNS(ns, "w:val", value);
    rPr.appendChild(sz);
  }
  if (szCsElem) {
    szCsElem.setAttributeNS(ns, "w:val", value);
  } else {
    const szCs = run.ownerDocument!.createElementNS(ns, "w:szCs");
    szCs.setAttributeNS(ns, "w:val", value);
    rPr.appendChild(szCs);
  }
}

/** সুপারস্ক্রিপ্ট রানকে বেস সাইজের তুলনায় ৩pt (৬ হাফ-পয়েন্ট) বড় করা —
 *  Word-এর নেটিভ/ম্যানুয়াল ফুটনোট মার্কের ভিজ্যুয়াল সাইজের সমান হতে।
 *  sz ইতোমধ্যে থাকলে তার তুলনায় ৬ বেশি, না থাকলে ডিফল্ট তুলনায় ৬ বেশি। */
/** রান কি সুপারস্ক্রিপ্ট? — ফুটনোট/ইন্ডনোট রেফারেন্স মার্কগুলো Word-এ
 *  w:vertAlign="super" দিয়ে আঁকা হয়। এদের sz কমালে Word-এর নেটিভ মার্কের
 *  তুলনায় বহুত ছোট দেখায়, তাই সাইজ-সংকোচন থেকে বাদ দেওয়া হয়। */
function isSuperscriptRun(run: Element, ns: string): boolean {
  const rPr = run.querySelector(":scope > rPr");
  if (rPr) {
    const va = rPr.querySelector(":scope > vertAlign");
    if (va) {
      const v = ((va.getAttributeNS(ns, "w:val") ??
        va.getAttribute("w:val") ??
        "") as string)
        .toLowerCase();
      if (v === "super" || v === "superscript") return true;
    }
    // ওয়ার্ড-নেটিভ ফুটনোট/ইন্ডনোট রেফারেন্স রান (<w:footnoteReference> / <w:endnoteReference>)
    // সরাসরি রান-এর অংশ — এগুলোও সুপারস্ক্রিপ্ট মার্ক — এদের ধরা
    const refs = rPr.querySelectorAll(
      ":scope > footnoteReference, :scope > endnoteReference",
    );
    if (refs.length > 0) return true;
    // rStyle দিয়ে "Footnote Reference" / "Endnote Reference" স্টাইল-চালিত সুপারও ধরা
    const rs = rPr.querySelector(":scope > rStyle");
    if (rs) {
      const id = (rs.getAttributeNS(ns, "w:val") ?? "").toLowerCase();
      if (id.includes("footnoteref") || id.includes("endnoteref")) return true;
    }
  }
  // রানের নিচেই সরাসরি note-reference এলিমেন্ট থাকলেও সুপার মার্ক
  if (
    run.querySelector(":scope > footnoteReference, :scope > endnoteReference")
  )
    return true;
  return false;
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

/** রান-এ rPr/rFonts না থাকলে SutonnyMJ হিন্ট দাও; থাকলে নাম বদলাও */
function ensureRFonts(run: Element, ns: string, hasBangla: boolean): void {
  rFontsAttr(run, ns, hasBangla ? "SutonnyMJ" : "Times New Roman");
}
