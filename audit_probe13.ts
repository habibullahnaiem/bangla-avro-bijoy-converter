import { convertToBijoy, convertToUnicode } from "./client/src/lib/converter.ts";

const t = "রেল এখন শহরে রেলচালক যান";
const b = convertToBijoy(t);
const r = convertToUnicode(b);
console.log("t:", t);
console.log("b:", b);
console.log("r:", r);
console.log("t.length", t.length, "r.length", r.length);
// char-by-char diff
let first = -1;
for (let i = 0; i < Math.max(t.length, r.length); i++) {
  if (t[i] !== r[i]) {
    if (first < 0) first = i;
    console.log(`diff@${i}: t=${t.charCodeAt(i)?.toString(16)}(${t[i] ?? "?"}) r=${r.charCodeAt(i)?.toString(16)}(${r[i] ?? "?"})`);
  }
}
console.log(first >= 0 ? "RT-BAD" : "RT-OK");

// mixed test: why garbled? trace restoreRun tokens
const mixed = "ÒThe quickÓ ÑGB e";
console.log("mixed out:", convertToUnicode(mixed));
