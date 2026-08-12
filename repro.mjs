import { build } from "esbuild";
await build({
  entryPoints: ["/home/ubuntu/bangla-avro-bijoy-converter/client/src/lib/converter.ts"], bundle: true, format: "esm",
  outfile: "/home/ubuntu/conv_repro.mjs", platform: "browser", target: "es2022",
});
const mod = await import("/home/ubuntu/conv_repro.mjs");
// ইউজারের স্ক্রিনশট-অনুমান: মিশ্র লাইন যেখানে এম-ড্যাশ ও সিংগেল কোট আছে
const t1 = "বাংলা সাহিত্য অবশ্যই একনির্মাণ” — ‘Constructed reality ড়ি লেখা";
console.log("ইনপুট:", t1);
const segs = mod.mapSegmentsToBijoy(t1, "u2b");
for (const s of segs) console.log(s.bangla ? "BN" : "LT", JSON.stringify(s.text));
