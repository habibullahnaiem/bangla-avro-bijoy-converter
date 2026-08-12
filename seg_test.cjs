const { buildSync } = require("esbuild");
buildSync({
  entryPoints: ["/home/ubuntu/bangla-avro-bijoy-converter/client/src/lib/converter.ts"],
  bundle: true, format: "cjs", outfile: "/home/ubuntu/conv_seg.cjs", conditions: ["browser"],
});
const lib = require("/home/ubuntu/conv_seg.cjs");
const t = "রেলগাড়ি Railway has a schedule। ইংরেজি 'fast' টেস্ট — English here।";
console.log(JSON.stringify(lib.segmentBijoyText(t), null, 0));
