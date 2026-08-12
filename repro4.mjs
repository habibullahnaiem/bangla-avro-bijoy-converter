// rebuild bundle fresh; force esbuild fresh
const { buildSync } = await import("esbuild");
buildSync({
  entryPoints: ["/home/ubuntu/bangla-avro-bijoy-converter/client/src/lib/converter.ts"],
  bundle: true,
  format: "esm",
  outfile: "/home/ubuntu/conv_repro.mjs",
  conditions: ["browser"],
});
const mod = await import("/home/ubuntu/conv_repro.mjs");
const t = "একনির্মাণ' — 'Constructed reality' ড়ি লেখা";
console.log("ইনপুট:", JSON.stringify(t));
for (const s of mod.mapSegmentsToBijoy(t, "u2b")) console.log("  ", s.bangla ? "BN" : "LT", JSON.stringify(s.text));
console.log("---- অন্য কেস ----");
// দাঁড়ি বাংলার পরে: বাংলা-সেগমেন্ট (ঠিক)
const t2 = "এটি সত্য। It is true। এটি সত্য — English";
for (const s of mod.mapSegmentsToBijoy(t2, "u2b")) console.log("  ", s.bangla ? "BN" : "LT", JSON.stringify(s.text));
// শুধু দাঁড়ি:
const t3 = "।";
for (const s of mod.mapSegmentsToBijoy(t3, "u2b")) console.log("  ", s.bangla ? "BN" : "LT", JSON.stringify(s.text));
