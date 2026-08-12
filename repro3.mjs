const mod = await import("/home/ubuntu/conv_repro.mjs");
// কোনো স্পেস নেই, কোট সরাসরি বাংলার পাশে
const variants = [
  "একনির্মাণ”\u2014\u2018Constructed reality\u2019wuo লেখা",
  "একনির্মাণ” — \u2018Constructed reality\u2019 ড়ি",
  "\u201C — \u2018Constructed reality\u2019 wuo",
];
for (const t of variants) {
  console.log("ইনপুট:", JSON.stringify(t));
  for (const s of mod.mapSegmentsToBijoy(t, "u2b")) console.log("  ", s.bangla ? "BN" : "LT", JSON.stringify(s.text));
}
