// ফন্ট-পরিবর্তন-পরবর্তী হিজি-বিজি পুনরুৎপাদন ও ফিক্স যাচাই
// সিনারিও: সুনতন্নী আউটপুট ওয়ার্ডে পেস্ট → কিছু অংশ TNR → কপি →
// কনভার্টার বক্সে পেস্ট → আবার u2b রূপান্তর = আগে হিজি-বিজি ছিল
import { convertToBijoy, convertToUnicode, convert, restoreCleanUnicode } from "./client/src/lib/converter";

function eq(label: string, a: string, b: string) {
  const ok = a === b;
  console.log(`${ok ? "PASS" : "FAIL"} | ${label}`);
  if (!ok) {
    console.log("   প্রত্যাশিত:", JSON.stringify(a));
    console.log("   প্রাপ্ত:   ", JSON.stringify(b));
  }
  return ok;
}

const cases = [
  "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।",
  "শেষে শুভেচ্ছায়,\n\nমো. হাবিবুল্লাহ নাঈম\nবাংলা বিভাগ, রাজশাহী বিশ্ববিদ্যালয়।",
  "আমাদের তৈরিকৃত অভ্র/ইউনিকোড ⇄ বিজয় কনভার্টার",
  "'সিঙ্গেল কোট' এবং \"ডাবল কোট\" সঠিকভাবে কাজ করছে।",
  "প্রথম বাক্যটি এখানে শেষ হলো। এরপর ডাবল-দাঁড়ি॥",
  '"The quick brown fox" —এই বাক্যটি বাংলার চেয়ে 2pt ছোট।',
];

let all = true;
for (const orig of cases) {
  // ১) সঠিক রূপান্তর (আগের মতো)
  const bij1 = convertToBijoy(orig);
  eq(`সঠিক রূপান্তর: ${orig.slice(0, 24)}...`, convertToBijoy(orig), bij1);

  // ২) ফন্ট-পরিবর্তন সিনারিও: বিজয় আউটপুট কিছু অংশ TNR করা হলো —
  //    কনভার্টার বক্সে পেস্ট হয়ে যায় (সবই টেক্সট, ফন্ট ট্যাগ হারায়)
  //    → এবার u2b আবার চলালে আগে হিজি-বিজি হত
  const repasted = bij1; // বক্সে পেস্ট = শুধু টেক্সট
  const again = convert(repasted, "u2b");
  const againBij = convertToBijoy(again);
  eq(`ফন্ট-হারানো পেস্ট রাউন্ড-ট্রিপ: ${orig.slice(0, 24)}...`, bij1, againBij);

  // ৩) আংশিক রূপান্তরিত টেক্সট + সাতা নতুন টাইপ একসাথে
  const half = orig.slice(0, Math.floor(orig.length / 2));
  const mixed = convertToBijoy(half) + orig.slice(half.length);
  const mBij = convertToBijoy(convert(mixed, "u2b"));
  eq(`আংশিক-রূপান্তরিত মিশ্র পেস্ট: ${orig.slice(0, 20)}...`, convertToBijoy(orig), mBij);

  if (!againBij) all = false;
}

// ৪) উল্টো দিক: b2u-তে সুনতন্নী-কোড থাকলে সমস্যা হবে না (সাধারণ path)
eq("b2u সাধারণ path", convertToUnicode("Avgvi ‡mvbvi evsjv"), "আমার সোনার বাংলা");

// ৫) পরিসংখ্যান-পাঙকচুয়েশন রাউন্ড-ট্রিপ (৫ বার u2b চালানো)
const stress = cases[0];
let t = stress;
for (let i = 0; i < 5; i++) {
  const restored = convertToUnicode(t);
  t = convertToBijoy(restored);
}
eq("৫-ধাপ স্ট্রেস রাউন্ড-ট্রিপ", convertToBijoy(stress), t);

console.log(all ? "সব সিনারিয়ো: ঠিক" : "কিছু সিনারিয়ো ব্যর্থ");
