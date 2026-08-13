import { convertToBijoy, convertToUnicode } from "./client/src/lib/converter.ts";

const cases = ["কৃ", "কৃষি", "ঋণ", "ঋতু", "স্মৃতি", "প্রকৃতি", "গৃহ", "হৃদয়", "বৃক্ষ"];

const describe = (value: string) =>
  [...value].map((ch) => `${ch}(U+${ch.codePointAt(0)!.toString(16).toUpperCase()})`).join(" ");

for (const input of cases) {
  const bijoy = convertToBijoy(input);
  const unicode = convertToUnicode(bijoy);
  console.log(`INPUT   ${input}`);
  console.log(`BIJOY   ${describe(bijoy)}`);
  console.log(`BACK    ${unicode} | ${unicode === input ? "PASS" : "FAIL"}`);
}
