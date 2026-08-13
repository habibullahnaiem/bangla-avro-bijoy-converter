import {
  unicodeToBijoy,
  bijoyToUnicode,
} from "@abdalgolabs/ansi-unicode-converter";
import { convertToBijoy, convertToUnicode } from "./client/src/lib/converter.ts";

const words = [
  "রেল",
  "এখন",
  "এখনই",
  "কেন",
  "এটি",
  "বেল",
  "মেলা",
  "দেখুন",
  "করেছে",
  "বেশি",
  "শ্রেণি",
  "শান্ত",
  "পান্থ",
];

const cps = (s: string) =>
  Array.from(s)
    .map((c) => `U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`)
    .join(" ");

for (const word of words) {
  const raw = unicodeToBijoy(word);
  const normalized = convertToBijoy(word);
  const rawBack = bijoyToUnicode(raw);
  const currentBack = convertToUnicode(normalized);
  console.log(JSON.stringify({ word, raw, rawCodes: cps(raw), normalized, normalizedCodes: cps(normalized), rawBack, currentBack }));
}
