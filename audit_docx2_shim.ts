
import { convert } from "./client/src/lib/converter";
// processDocXml নন-এক্সপোর্টেড; কনভার্ট ফাংকশনের ইনপুট/আউটপুট-ই টেস্ট করি
const txt = "মো. হাবিবুল্লাহ নাইম";
const b = convert(txt, "u2b");
const codes = Array.from(b).map(c => c.charCodeAt(0));
const outOfRange = codes.filter(c => c > 255);
console.log("bijoy:", JSON.stringify(b), "hex:", Array.from(b).map(c=>c.charCodeAt(0).toString(16)).join(" "));
console.log("0-255 বাইরে কোড:", outOfRange.length === 0 ? "নেই (safe)" : outOfRange.map(c=>c.toString(16)).join(" "));
