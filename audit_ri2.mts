import { convertToBijoy } from './client/src/lib/converter.ts';
function hex(s: string) { return [...s].map(c => c.charCodeAt(0).toString(16)).join(' '); }
// What user typed? Try candidates:
const cand = [
  "\u098B",      // ঋ (Ri vowel)
  "\u09C3",      // ৃ (Ri vowel sign)
  "\u098B\u0995", // ঋক
  "\u09B0\u09BF",  // রি (ri)
  "\u09B0\u09C3",  // র + ৃ
  "ঋণ",
];
for (const c of cand) {
  console.log("in:", c, hex(c), "=>", JSON.stringify(convertToBijoy(c)), hex(convertToBijoy(c)));
}
// Does any output contain 2026 (ellipsis)?
const out = convertToBijoy("\u09C3");
console.log("contains 2026?", out.includes("\u2026"));
// What does SutonnyMJ display for 0x201E?
console.log("chr 201E:", String.fromCharCode(0x201E));
console.log("chr 201e hex:", 0x201E.toString(16));
