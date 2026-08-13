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

const mod = await import("/tmp/audit_bundle3.mjs");
const { convert, convertToBijoy, convertToUnicode, segmentBijoyText, mapSegmentsToBijoy } = mod;

const results = [];
function check(name, actual, expected) {
  const ok = actual === expected;
  results.push({ name, ok, actual: String(actual), expected: String(expected) });
  if (!ok) console.log(`  ❌ ${name}: আশা "${expected}" পেয়েছি "${actual}"`);
  else console.log(`  ✅ ${name}`);
}

console.log("\n=== ১. যুক্তবর্ণ চেক (u2b) ===");
// ক্যারেক্টার-লেভেল: ক্যারিয়ার+ফলা বর্ণমালা
check("ন্ত 1", convert("ন্ত"), "¯ÍÍ");
check("ন্ধ", convert("ন্ধ"), "¯ª");
check("ল্ল", convert("ল্ল"), "jÑ");
check("য়", convert("য়"), "q");
check("ড়", convert("ড়"), "W");
check("ঢ়", convert("ঢ়"), "¯");
check("্র (র-ফলা)", convert("ক্র"), "†³");
check("্শ (শ-ফলা)", convert("কশ্চ"), "†±");
check("্ঞ (জ্ঞ)", convert("জ্ঞ"), "Z");
check("ঁ (অনুনাসিক)", convert("হাঁ"), "NÕ");

console.log("\n=== ২. পাঙ্কচুয়েশন চেক (u2b) ===");
check("দারি 1", convert("।"), "'");
check("দারি 2 (স্পেসসহ)", convert("হয়।"), "হয়।".replace("।", "'"));
check("ডাবল-দারি", convert("॥"), "\\");
check("ব্র্যাকেট-পাউন্ট", convert("[]"), "[]");
check("রাউন্ড-ব্র্যাকেট", convert("()"), "()");

console.log("\n=== ৩. এ-কার-মার্ক চেক ===");
// রেল → SutonnyMJ-এ †ij (এ-কার-মার্ক †+ij); শুরুতে এ-কার হেলে † নয় †ij
const rail = convert("রেল");
check("রেল", rail, "†ij");

console.log("\n=== ৪. রাউন্ড-ট্রিপ চেক ===");
function roundTrip(src) {
  return convertToUnicode(convertToBijoy(src));
}
check("রাউন্ডট্রিপ 1", roundTrip("রেল"), "রেল");
check("রাউন্ডট্রিপ 2", roundTrip("সুনতন্নী এমজে-তে"), "সুনতন্নী এমজে-তে");
check("রাউন্ডট্রিপ 3", roundTrip("সেই বাবু কালে মারে। ১২, ৪৫; ৭—৯"), "সেই বাবু কালে মারে। ১২, ৪৫; ৭—৯");
check("রাউন্ডট্রিপ 4", roundTrip("“বিজয়” ‘ফন্ট’"), "“বিজয়” ‘ফন্ট’");

console.log("\n=== ৫. এজ-কেস চেক ===");
check("খালি", convert(""), "");
check("পিওর-ইংলিশ", convert("Hello world 12:45"), "Hello world 12:45");
check("পরপর-দারি", convert("।।"), "''");
check("নেস্টেড-কোট", convert("“‘ভিতরে’ বাইরে”"), "“‘ভিতরে’ বাইরে”");

console.log("\n=== ৬. ইংরেজি-প্রসঙ্গ সেগমেন্টেশন ===");
const s = segmentBijoyText("বাংলা টেক্সট — 'Constructed reality' ড়ি লেখা।");
console.log(JSON.stringify(s));

console.log("\n=== সারসংক্ষেপ: পাস", results.filter((r) => r.ok).length, "/", results.length);
process.exit(results.every((r) => r.ok) ? 0 : 1);
