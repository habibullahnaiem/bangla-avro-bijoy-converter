import {
  bijoyToUnicode,
  unicodeToBijoy,
} from "@abdalgolabs/ansi-unicode-converter";
import { convertToBijoy, convertToUnicode } from "./client/src/lib/converter.ts";

const cases = [
  "ক্রিয়া",
  "গ্রাম",
  "প্রকাশ",
  "ব্রত",
  "শ্রেণি",
  "ত্রুটি",
  "স্বপ্ন",
  "কর্ম",
  "অর্থ",
  "রক্ত",
  "শ্রদ্ধা",
  "রেফারেন্স",
];

const codepoints = (value: string) =>
  Array.from(value)
    .map((char) => `U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`)
    .join(" ");

let failures = 0;

for (const input of cases) {
  const raw = unicodeToBijoy(input);
  const normalized = convertToBijoy(input);
  const rawRoundTrip = bijoyToUnicode(raw);
  const normalizedRoundTrip = convertToUnicode(normalized);
  const ok = normalizedRoundTrip === input;

  console.log(
    JSON.stringify({
      input,
      raw,
      normalized,
      normalizedCodes: codepoints(normalized),
      rawRoundTrip,
      normalizedRoundTrip,
      ok,
    }),
  );

  if (!ok) failures += 1;
}

if (failures > 0) {
  throw new Error(`${failures} r-fola case(s) failed round-trip conversion`);
}

console.log(`r-fola audit passed: ${cases.length}/${cases.length}`);
