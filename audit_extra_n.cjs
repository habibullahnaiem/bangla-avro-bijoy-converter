// @ts-nocheck
// রিপ্রো: "কারণ" -> Kvi (vRkv) হওয়ার কথা, কিন্তু ব্যবহারকারী "vRkvn" (Kvin) দেখছেন।
// পাশাপাশি নামের বানান: নাইম (ন+া+ঈ+ম দীর্ঘ ঈ).
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const shim = `// @ts-nocheck
export { convert, convertToBijoy, convertToUnicode, convertFile,
  segmentBijoyText, mapSegmentsToBijoy, processDocXml } from "./client/src/lib/converter";
`;
fs.writeFileSync(path.resolve(__dirname, "audit_extra_n_shim.ts"), shim);
execSync(
  `npx esbuild audit_extra_n_shim.ts --bundle --format=esm --outfile=/tmp/audit_extra_n_bundle.mjs --tsconfig=tsconfig.json 2>&1 | tail -3`,
  { cwd: __dirname, stdio: "pipe" }
);
console.log("bundle ok");

const cases = [
  "কারণ",
  "কারণ।",
  "কারণ কাজ",
  "রেল",
  "মো. হাবিবুল্লাহ নাইম",
];

(async () => {
  const mod = await import("/tmp/audit_extra_n_bundle.mjs");
  const fn = mod.convertToBijoy;
  if (!fn) {
    console.log("exports:", Object.keys(mod));
    process.exit(1);
  }
  for (const c of cases) {
    const r = fn(c);
    const hex = Array.from(r).map((ch) => ch.charCodeAt(0).toString(16)).join(" ");
    console.log(JSON.stringify(c), "->", JSON.stringify(r));
    console.log("   codes:", hex);
  }
})();
