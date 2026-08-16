/** R-kar-rich-preview চেক: কনভার্ট-আউটপুটে U+201E/U+2026 মার্কার-টোকেন
 * ঠিকমতো আছে কিনা এবাং রাউন্ড-ট্রিপ অক্ষুণ্ণ আছে কিনা।
 * সূত্র: "বুলবুল চৌধুরী। কৃষি মৃত্যু" — Dari-র পরে র-কার বসা শব্দ। */
import { convertToBijoy, convertToUnicode } from "./client/src/lib/converter.ts";

const cases = [
  "কৃষি",
  "তৃণ",
  "মৃত্যু",
  "বৃহৎ",
  "গৃহ",
  "হৃদয়",
  "বৃক্ষ",
  "স্মৃতি",
  "প্রকৃতি",
  "বুলবুল চৌধুরী। কৃষি মৃত্যু",
];

let allOk = true;
for (const input of cases) {
  const bijoy = convertToBijoy(input);
  const back = convertToUnicode(bijoy);
  const hasMarker = /[\u201E\u2026]/.test(bijoy);
  const hasEllipsisDot = /…/.test(bijoy);
  const ok = back === input;
  if (!ok) allOk = false;
  console.log(
    JSON.stringify({
      input,
      bijoy,
      hasMarker,
      hasEllipsisDot,
      roundTrip: back,
      ok,
    }),
  );
}
console.log(allOk ? "rikar-visual audit passed" : "rikar-visual audit FAILED");
