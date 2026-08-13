// লাইব্রেরি-নিজের বিহেভিয়ার: ইংলিশ-শুধু টেক্সটে কর্লি কোট/ড্যাশের কী ঘটে
import { unicodeToBijoy } from "@abdalgolabs/ansi-unicode-converter";
const cases = [
  "\u201CTesting\u201D — ok",
  "It\u2019s \u2018quoted\u2019",
  "It's simple",
];
for (const c of cases) {
  const out = unicodeToBijoy(c);
  console.log("SRC:", JSON.stringify(c));
  console.log("LIB:", JSON.stringify(out));
  const hasCode = /[\u00D0-\u00D5]/.test(out);
  console.log("  ", hasCode ? "mapped to SutonnyMJ codes (BAD for English-only)" : "clean");
}
