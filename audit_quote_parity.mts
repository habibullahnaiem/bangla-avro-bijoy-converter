// রাউন্ড-ট্রিপের কোন ভিন্নতাটাই কি কেবল কোট-দিরেকশন নিউট্রালিকরণ?
// যদি bij2-এর প্রত্যেক চরিত্র bij1-এর সাথে সেমান্টিক-সমান (যথার্থ কোট-জোড়া বজায়),
// তাহলে এই TEST-এর কঠোর সমতা-প্রত্যাশা ভুল — আমাদের কনভার্টার সঠিক।
import { convertToBijoy, convert, convertToUnicode } from "./client/src/lib/converter.ts";

const CASES = [
  "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।",
  "শেষে শুভেচ্ছায়,\n\nমো. হাবিবুল্লাহ নাঈম\nবাংলা বিভাগ, রাজশাহী বিশ্ববিদ্যালয়।",
  "আমাদের তৈরিকৃত অভ্র/ইউনিকোড ⇄ বিজয় কনভার্টার",
  "'সিঙ্গেল কোট' এবং \"ডাবল কোট\" সঠিকভাবে কাজ করছে।",
  "প্রথম বাক্যটি এখানে শেষ হলো। এরপর ডাবল-দাঁড়ি॥",
  '"The quick brown fox" —এই বাক্যটি বাংলার চেয়ে 2pt ছোট।',
];

function diffReport(a: string, b: string) {
  const diffs: string[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) diffs.push(`@${i} bij1=U+${a.charCodeAt(i).toString(16)} '${a[i] ?? ""}' bij2=U+${b.charCodeAt(i).toString(16)} '${b[i] ?? ""}'`);
  }
  return diffs;
}

for (const orig of CASES) {
  const bij1 = convertToBijoy(orig);
  const bij2 = convertToBijoy(convert(bij1, "u2b"));
  const diffs = diffReport(bij1, bij2);
  const neutral = diffs.every(d => /U+201[89a-d]/.test(d)); // সব ভিন্নতা কর্লি-কোট নিউট্রালিকরণ?
  console.log(`${neutral ? "OK-sem" : "DIFF-other"} | ${orig.slice(0, 30)}... | ${diffs.length} diff(s)`);
  for (const d of diffs.slice(0, 8)) console.log("   ", d);
  // উল্টো দিকেও: b2u → u2b → b2u বিট-পারফেক্ট?
  const back = convertToBijoy(convertToUnicode(bij1));
  const perfect = back === bij1;
  if (!perfect) {
    const d2 = diffReport(bij1, back);
    const sem = d2.every(d => /U+201[89a-d]/.test(d));
    console.log(`   back-roundtrip: ${sem ? "OK-sem" : "DIFF-other"} ${d2.length} diff(s)`);
  } else {
    console.log("   back-roundtrip: PERFECT");
  }
}
