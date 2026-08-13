// @ts-nocheck
// কোট (') ও প্লাস (+) বাগ রিপ্রো
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const shim = `// @ts-nocheck
export { convertToBijoy, mapSegmentsToBijoy } from "./client/src/lib/converter";
`;
fs.writeFileSync(path.resolve(__dirname, "audit_qp_shim.ts"), shim);
execSync(
  `npx esbuild audit_qp_shim.ts --bundle --format=esm --outfile=/tmp/audit_qp_bundle.mjs --tsconfig=tsconfig.json 2>&1 | tail -3`,
  { cwd: __dirname, stdio: "pipe" }
);

(async () => {
  const { convertToBijoy, mapSegmentsToBijoy } = await import("/tmp/audit_qp_bundle.mjs");

  const cases = [
    "'শুরুর সিংগেল কোট' সঠিক",
    "শ্রেণি (শ+র-ফলা+ে-কার)",
    "'Single' and \"double\"",
    "a+b",
  ];

  console.log("=== convertToBijoy ===");
  for (const c of cases) {
    const out = convertToBijoy(c);
    console.log("IN :", c);
    console.log("OUT:", out);
    console.log("OUT chars:", [...out].map((ch) => ch + "U+" + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")).join(" "));
    console.log("---");
  }

  console.log("=== mapSegmentsToBijoy (প্রিভিউ সেগমেন্টেশন) ===");
  for (const c of cases) {
    const segs = mapSegmentsToBijoy(c);
    console.log("IN :", c);
    for (const s of segs) {
      console.log("  seg:", JSON.stringify(s.text), "| lang:", s.lang, "| bijoy:", s.bijoy);
    }
    console.log("---");
  }
})();
