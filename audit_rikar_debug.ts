import { convertToBijoy, convertToUnicode } from "./client/src/lib/converter.ts";

const cases = ["কৃ", "কৃষি", "ঋণ", "ঋতু", "স্মৃতি", "প্রকৃতি", "গৃহ", "হৃদয়", "বৃক্ষ"];

// SutonnyMJ-এর র-কারে একটিমাত্র blanket byte নেই। Upstream library base/
// conjunct অনুযায়ী U+2026 অথবা U+201E দেয়; দুইটিই রাখা জরুরি। এই regression
// table কোনো preview CSS বা post-conversion canonicalization-কে তা বদলাতে দেবে না।
const expectedBijoy: Record<string, string> = {
  "কৃ": "K…",
  "কৃষি": "K…wl",
  "স্মৃতি": "¯§„wZ",
  "প্রকৃতি": "cÖK…wZ",
  "গৃহ": "M„n",
  "বৃক্ষ": "e„¶",
};

const describe = (value: string) =>
  [...value].map((ch) => `${ch}(U+${ch.codePointAt(0)!.toString(16).toUpperCase()})`).join(" ");

for (const input of cases) {
  const bijoy = convertToBijoy(input);
  const unicode = convertToUnicode(bijoy);
  console.log(`INPUT   ${input}`);
  console.log(`BIJOY   ${describe(bijoy)}`);
  console.log(`BACK    ${unicode} | ${unicode === input ? "PASS" : "FAIL"}`);
  if (unicode !== input) throw new Error(`Round-trip failed for ${input}`);
  if (expectedBijoy[input] && bijoy !== expectedBijoy[input]) {
    throw new Error(`Context byte mismatch for ${input}: ${JSON.stringify(bijoy)}`);
  }
}

console.log("R-kar contextual byte audit passed.");
