// অডিট-স্ক্রিপ্ট: কনভার্টার লজিকের সিস্টেমেটিক চেক
import { execSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";

// noop
writeFileSync(
  "/home/ubuntu/bangla-avro-bijoy-converter/audit_build_tmp.mjs",
  `
import {
  convert,
  convertToBijoy,
  convertToUnicode,
  segmentBijoyText,
  mapSegmentsToBijoy,
} from "./client/src/lib/converter.ts";
globalThis.convert = convert;
globalThis.convertToBijoy = convertToBijoy;
globalThis.convertToUnicode = convertToUnicode;
globalThis.segmentBijoyText = segmentBijoyText;
globalThis.mapSegmentsToBijoy = mapSegmentsToBijoy;
`
);
try {
  execSync(
    "npx esbuild /home/ubuntu/bangla-avro-bijoy-converter/audit_build_tmp.mjs --outfile=/tmp/audit_bundle.mjs --format=esm --bundle --platform=node",
    { cwd: "/home/ubuntu/bangla-avro-bijoy-converter", stdio: "inherit" }
  );
} catch (e) {
  console.log("বান্ডেল ফেইল:", String(e.stderr).slice(0, 500));
  process.exit(1);
}

await import("/tmp/audit_bundle.mjs");
const { convert, convertToBijoy, convertToUnicode, segmentBijoyText, mapSegmentsToBijoy } = globalThis;
const u2b = (text) => convert(text, "u2b");

const results = [];
function check(name, actual, expected) {
  const ok = actual === expected;
  results.push({ name, ok, actual: String(actual), expected: String(expected) });
  if (!ok) console.log(`  ❌ ${name}: আশা "${expected}" পেয়েছি "${actual}"`);
  else console.log(`  ✅ ${name}`);
}

console.log("\n=== ১. যুক্তবর্ণ চেক (u2b) ===");
// ক্যারেক্টার-লেভেল: ক্যারিয়ার+ফলা বর্ণমালা
check("ন্ত 1", u2b("ন্ত"), "šÍ");
check("ন্ধ", u2b("ন্ধ"), "Ü");
check("ল্ল", u2b("ল্ল"), "jø");
check("য়", u2b("য়"), "q");
check("ড়", u2b("ড়"), "o");
check("ঢ়", u2b("ঢ়"), "p");
check("্র (র-ফলা)", u2b("ক্র"), "µ");
check("্শ (শ-ফলা)", u2b("কশ্চ"), "Kð");
check("্ঞ (জ্ঞ)", u2b("জ্ঞ"), "Á");
check("ঁ (অনুনাসিক)", u2b("হাঁ"), "nuv");

console.log("\n=== ২. পাঙ্কচুয়েশন চেক (u2b) ===");
check("দারি 1", u2b("।"), "|");
check("দারি 2 (স্পেসসহ)", u2b("হয়।"), "nq|");
check("ডাবল-দারি", u2b("॥"), "\\\\");
check("ব্র্যাকেট-পাউন্ট", u2b("[]"), "[]");
check("রাউন্ড-ব্র্যাকেট", u2b("()"), "()");

console.log("\n=== ৩. এ-কার-মার্ক চেক ===");
// রেল → SutonnyMJ-এ †ij (এ-কার-মার্ক †+ij); শুরুতে এ-কার হেলে † নয় †ij
const rail = u2b("রেল");
check("রেল", rail, "†ij");

console.log("\n=== ৪. রাউন্ড-ট্রিপ চেক ===");
function roundTrip(src) {
  return convertToUnicode(convertToBijoy(src));
}
check("রাউন্ডট্রিপ 1", roundTrip("রেল"), "রেল");
check("রাউন্ডট্রিপ 2", roundTrip("সুনতন্নী এমজে-তে"), "সুনতন্নী এমজে-তে");
check("রাউন্ডট্রিপ 3", roundTrip("সেই বাবু কালে মারে। ১২, ৪৫; ৭—৯"), "সেই বাবু কালে মারে। ১২, ৪৫; ৭—৯");
check("রাউন্ডট্রিপ 4", roundTrip("“বিজয়” ‘ফন্ট’"), "“বিজয়” ‘ফন্ট’");
check("মিশ্র ডাবল-কোট স্বাভাবিকীকরণ", roundTrip("“বিজয়’"), "“বিজয়”");
check("মিশ্র সিঙ্গেল-কোট স্বাভাবিকীকরণ", roundTrip("‘ফন্ট”"), "‘ফন্ট’");
check("অ্যাপোস্ট্রফি অপরিবর্তিত", roundTrip("রক’ন’রোল"), "রক’ন’রোল");

console.log("\n=== ৫. এজ-কেস চেক ===");
check("খালি", u2b(""), "");
check("পিওর-ইংলিশ", u2b("Hello world 12:45"), "Hello world 12:45");
check("পরপর-দারি", u2b("।।"), "||");
check("নেস্টেড-কোট", u2b("“‘ভিতরে’ বাইরে”"), "ÒÔwfZ‡iÕ evB‡iÓ");

console.log("\n=== ৬. ইংরেজি-প্রসঙ্গ সেগমেন্টেশন ===");
const s = segmentBijoyText("বাংলা টেক্সট — 'Constructed reality' ড়ি লেখা।");
console.log(JSON.stringify(s));

console.log("\n=== সারসংক্ষেপ: পাস", results.filter((r) => r.ok).length, "/", results.length);
process.exit(results.every((r) => r.ok) ? 0 : 1);
