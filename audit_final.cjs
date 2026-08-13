// চূড়ান্ত অডিট: সাক্ষর বানান (ন+া+ঈ+ম), trailing ণ-ন সমস্যা, ও উদাহরণ টেক্সট রেন্ডারিং
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const shim = `// @ts-nocheck
export { convert, convertToBijoy, convertToUnicode, convertFile,
  segmentBijoyText, mapSegmentsToBijoy, processDocXml } from "./client/src/lib/converter";
`;
fs.writeFileSync(path.resolve(__dirname, "audit_final_shim.ts"), shim);
execSync(
  `npx esbuild audit_final_shim.ts --bundle --format=esm --outfile=/tmp/audit_final_bundle.mjs --tsconfig=tsconfig.json 2>&1 | tail -3`,
  { cwd: __dirname, stdio: "pipe" }
);

// Home.tsx-এর সাক্ষর কোডপয়েন্ট যাচাই
const homeSrc = fs.readFileSync("client/src/pages/Home.tsx", "utf8");
const m = homeSrc.match(/মো\. হাবিবুল্ল[াোে]হ ন[ািেী]\?[ঈই]\?ম/);
if (m) {
  const name = m[0];
  const cps = Array.from(name).map((c) => c.charCodeAt(0).toString(16));
  const ok = cps.join(" ") === "9ae 9cb 2e 20 9b9 9be 9ac 9bf 9ac 9c1 9b2 9cd 9b2 9be 9b9 20 9a8 9be 988 9ae";
  console.log("সাক্ষর নাম:", name, ok ? "✅ (ন+া+ঈ+ম সঠিক)" : "❌", "codes:", cps.join(" "));
}

// বিজয় কনভার্সন টেস্ট
(async () => {
  const mod = await import("/tmp/audit_final_bundle.mjs");
  const fn = mod.convertToBijoy;
  console.log("\n--- কনভার্সন টেস্ট ---");
  const tests = [
    ["কারণ", "KviY", "ণ-এর শেষে 'ন' হারানো/যোগ হওয়া চেক (কন্যনিকাল: KviY)"],
    ["কারণ।", "KviY|", "দাঁড়ি সহ"],
    ["নাইম", "bvBg", "ছোট ই (পরীক্ষা)"],
    ["নাঈম", "bvCg", "দীর্ঘ ঈ — এটিই সঠিক বানান"],
    ["মো. হাবিবুল্লাহ নাঈম", "†gv. nvweeyjøvn bvCg", "সম্পূর্ণ নাম"],
    ["রেল", "†ij", "র-ফলার এ-কার (রেল)"],
    ["শ্রেণি", "†kÖwY" , "শ্র+ে+ণী (কন্যনিকাল: †kÖwY, † শব্দ-শুরুতে লাইব্রেরির গণ্যন Bijoy প্লেসমেন্ট)"],
  ];
  let pass = 0;
  for (const [inp, exp, note] of tests) {
    const out = fn(inp);
    const ok = out === exp;
    if (ok) pass++;
    console.log((ok ? "✅" : "❌"), JSON.stringify(inp), "->", JSON.stringify(out), "(আশা:", JSON.stringify(exp) + ")", "|", note);
  }
  console.log(`\n${pass}/${tests.length} পাস`);
})();
