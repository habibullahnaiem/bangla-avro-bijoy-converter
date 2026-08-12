const mod = await import("/home/ubuntu/conv_repro.mjs");
// ভেরিয়ান্ট: কোট-পর-বাংলা অক্ষর — 'Constructed reality' পাশে ড়ি
const t2 = "\u201C\u2014 \u2018Constructed reality\u2019\u09A1\u09BC\u09BF";
console.log("ইনপুট:", JSON.stringify(t2));
for (const s of mod.mapSegmentsToBijoy(t2, "u2b")) console.log(s.bangla ? "BN" : "LT", JSON.stringify(s.text));
// আরেক ভেরিয়ান্ট: এম-ড্যাশ দুই পাশে স্পেস+বাংলা
const t3 = "একনির্মাণ” \u2014 'Constructed reality' ";
console.log("---", JSON.stringify(t3));
for (const s of mod.mapSegmentsToBijoy(t3, "u2b")) console.log(s.bangla ? "BN" : "LT", JSON.stringify(s.text));
