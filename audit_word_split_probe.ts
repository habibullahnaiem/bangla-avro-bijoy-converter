import { unicodeToBijoy } from "@abdalgolabs/ansi-unicode-converter";
import { convertToBijoy } from "./client/src/lib/converter.ts";

const cases = [
  "এখন রেল এখন",
  "রেল এখনই আসবে",
  "করেছে বেশি দেখেছে",
  "শান্ত, শ্রেণি—রেল",
  "‘রেল’ এখন",
  "শ+ে+র",
];

for (const text of cases) {
  const split = text.split(/(\s+)/).map((chunk) => unicodeToBijoy(chunk)).join("");
  console.log(JSON.stringify({ text, current: convertToBijoy(text), split }));
}
