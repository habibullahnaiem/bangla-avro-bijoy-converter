// Round-trip swap flow test: u2b -> swap -> b2u -> back to u2b should NOT garble.
import { convertToBijoy, convertToUnicode, mapSegmentsToBijoy } from "./client/src/lib/converter";

const input0 = "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।";
console.log("উদ্ধারণ:", input0);

// ধাপ ১: প্রথমে অভ্র → বিজয়
const bijoy1 = convertToBijoy(input0);
console.log("বিজয় আউটপুট:", bijoy1);

// ধাপ ২: বোতাম click — swapTexts(u2b): direction=b2u, swappedIn=convertToUnicode(bijoy1), swappedOut=output
const afterSwapIn = convertToUnicode(bijoy1 || input0);
console.log("swap পরে ইনপুট (b2u):", afterSwapIn);

// ধাপ ৩: বিজয় → অভ্র আউটপুট
const uniOut = convertToUnicode(afterSwapIn);
console.log("b2u আউটপুট:", uniOut);
console.log("  roundtrip match:", uniOut === input0 ? "PASS" : "FAIL");

// ধাপ ৪: এবার user আবার swap বা আরেকবার u2b মোডে ফিরে এসে নতুন ইনপুট টাইপ করে
// বা আগের আউটপুট copy করে উল্টো রূপান্তর করে — গুরুত্বপূর্ণ চেক:
// (a) b2u মোডে বিজয়-কোড টেক্সট অভ্রে সঠিক কি
const backToBijoy = convertToBijoy(uniOut);
console.log("  b2u->u2b reconvert:", backToBijoy === bijoy1 ? "PASS" : "FAIL (expected " + bijoy1 + ", got " + backToBijoy + ")");

// (b) আগের আউটপুটটা (বিজয় কোড) যদি user কেউ ইনপুট বক্সে পেস্ট করে b2u মোডে —
// আমাদের নতুন swap দিয়ে কিন্তু পেস্ট ফ্লো সোজা: input → আউটপুট উল্টো
const double = convertToBijoy(convertToUnicode(bijoy1));
console.log("  পুনরায় b2u (output||input পথ):", double === bijoy1 ? "PASS" : "FAIL");

// (c) হিজি-বিজি চিহ্ন: বিজয়-কোডে দীর্ঘ সংযুক্ত অক্ষর যেমন 'Y' + extra char
// বিস্তৃত চেক: প্রত্যেক রাউন্ড-ট্রিপের ফলেই মূল বিজয় কোডের সাথে মিল।
console.log("\nসব রাউন্ড-ট্রিপ:", (uniOut === input0 && backToBijoy === bijoy1 && double === bijoy1) ? "PASS" : "FAIL");
