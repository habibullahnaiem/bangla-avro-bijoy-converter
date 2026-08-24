/**
 * Controlled code-only comparison with captured ShumanBD public-form output.
 * This file makes no production conversion change.
 */
import { writeFileSync } from "node:fs";
import { convert } from "./client/src/lib/converter";

type Dataset = { id: string; input: string; shuman: string };

const datasets: Dataset[] = [
  {
    id: "mixed-core",
    input: "কৃষি কৃষ্টি তৃণ মৃত্যু দৃশ্য স্মৃতি ন্ট ল্ল য় ড় ঢ় প্র শ্র জ্ঞ ক্ষ। “কোট” ‘কোট’ — …",
    shuman: "K…wl K…wó Z…Y g„Zz¨ `„k¨ ¯§„wZ ›U jø q o X় cÖ kÖ Á ¶| Ò‡KvUÓ Ô‡KvUÕ — „",
  },
  {
    id: "standard-conjuncts",
    input: "ন্ত ন্থ ন্দ ন্ধ ন্ট ল্ল প্র ক্র গ্র শ্র জ্ঞ ক্ষ ত্র ত্ত দ্ধ ষ্ঠ র্ক র্গ র্দ র্ফ প্রজ্ঞা লক্ষ্মী শ্রদ্ধা কর্ম অর্থ রক্ত",
    shuman: "šÍ š’ ›` Ü ›U jø cÖ µ MÖ kÖ Á ¶ Î Ë × ô K© M© `© d© cÖÁv j²x kÖ×v Kg© A_© i³",
  },
  {
    id: "ambiguous-conjuncts",
    input: "গ্রু র্ ষ্ক্র ্র্য ক্ষ্ন ক্ষ্ণ ণ্ণ ণ্ন ত্রূ",
    shuman: "MÖæ © l&µ ª¨ ¶&b ¶&Y Y&Y Y&b Î~",
  },
];

const codePoints = (text: string) => Array.from(text).map((ch) => `U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`);
const diffChars = (left: string, right: string) => {
  const max = Math.max(Array.from(left).length, Array.from(right).length);
  return Array.from({ length: max }, (_, index) => {
    const shumanChar = Array.from(left)[index] ?? "∅";
    const avrojoyChar = Array.from(right)[index] ?? "∅";
    return shumanChar === avrojoyChar
      ? null
      : { index, shumanChar, shumanCode: codePoints(shumanChar), avrojoyChar, avrojoyCode: codePoints(avrojoyChar) };
  }).filter(Boolean);
};

const report = datasets.map(({ id, input, shuman }) => {
  const avrojoy = convert(input, "u2b");
  const inputTokens = input.split(" ");
  const shumanTokens = shuman.split(" ");
  const avrojoyTokens = avrojoy.split(" ");
  const rows = inputTokens.map((inputToken, index) => {
    const shumanToken = shumanTokens[index] ?? "";
    const avrojoyToken = avrojoyTokens[index] ?? "";
    return {
      input: inputToken,
      shuman: shumanToken,
      avrojoy: avrojoyToken,
      identical: shumanToken === avrojoyToken,
      codeDifference: diffChars(shumanToken, avrojoyToken),
      shumanReverse: convert(shumanToken, "b2u"),
      avrojoyReverse: convert(avrojoyToken, "b2u"),
    };
  });
  return {
    id,
    input,
    shuman,
    avrojoy,
    identicalOutput: shuman === avrojoy,
    differingRows: rows.filter((row) => !row.identical),
    equalRows: rows.filter((row) => row.identical).length,
    totalRows: rows.length,
  };
});

writeFileSync("/home/ubuntu/tmp/raw_bijoy_code_diff.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
