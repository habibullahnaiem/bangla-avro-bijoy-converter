// @ts-nocheck
// বর্তমান সংস্করণের converter.ts (ইএসবিল্ড + রি-এক্সপোর্ট শিম) দিয়ে
// ইংরেজি-প্রসঙ্গ ও সেগমেন্টেশন টেস্ট — অডিট-ফিক্সের যাচাই
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// 1) রি-এক্সপোর্ট শিম তৈরি (প্রতিবার সজীব)
const shim = `// @ts-nocheck
export { convert, convertToBijoy, convertToUnicode, convertFile,
  segmentBijoyText, mapSegmentsToBijoy, processDocXml } from "./client/src/lib/converter";
`;
fs.writeFileSync(
  path.resolve(__dirname, "audit_verify_shim.ts"),
  shim
);

// 2) ইএসবিল্ড
execSync(
  `npx esbuild audit_verify_shim.ts --bundle --format=esm --outfile=/tmp/audit_verify_bundle.mjs --tsconfig=tsconfig.json 2>&1 | tail -3`,
  { cwd: __dirname, stdio: "pipe" }
);

(async () => {
  const mod = await import("/tmp/audit_verify_bundle.mjs");
  const { convertToBijoy, segmentBijoyText, mapSegmentsToBijoy } = mod;

  console.log("=== 1) ইংরেজি-শুধু টেক্সট: কোট/ড্যাশ পাস-থ্রু হওয়া চাই ===");
  const enCases = [
    "It's a test",
    "\u201CTesting\u201D — ok",
    "Hello world 12:45",
    "It\u2019s \u2018quoted\u2019 — really",
  ];
  for (const c of enCases) {
    const out = convertToBijoy(c);
    const bad = /[\u00D0-\u00D5\u00D2\u00D3\u00D1]/.test(out);
    console.log(`  ${bad ? "ফেইল" : "পাস  "}  SRC: ${JSON.stringify(c)}`);
    if (bad) console.log("    OUT:", JSON.stringify(out));
  }

  console.log("=== 2) সেগমেন্টেশন: dash/quote নিকটতম লেখা-চরিত্রের সেগমেন্টে ===");
  const segCases = [
    { t: "\u09B0\u09C7\u09B2\u0997\u09BE\u09A1\u09BC\u09BF Railway \u2014 \u2018Constructed reality\u2019", wantLT: ["Railway ", " \u2018Constructed reality\u2019"] },
    // দাঁড়ির পরের ফাঁক দাঁড়ির (বাংলা) সেগমেন্টেই পড়ে — স্থাপিত নিয়ম
    { t: "\u09B8\u09A4\u09CD\u09AF\u0964 It is true", wantLT: ["It is true"] },
    { t: "সত্য। ইট", wantLT: [] },
    { t: "কা\u099C \u09A8\u09BE, ক\u09BE\u099C", wantLT: [] },
  ];
  for (const c of segCases) {
    const segs = segmentBijoyText(c.t);
    const lt = segs.filter((s) => !s.bangla).map((s) => JSON.stringify(s.text));
    const ok =
      c.wantLT.length === 0
        ? lt.length === 0
        : c.wantLT.every((w) => lt.some((x) => x.includes(w)));
    console.log(`  ${ok ? "পাস" : "ফেইল"}  LT: [${lt.join(", ")}]  SRC: ${JSON.stringify(c.t)}`);
    if (!ok) console.log("    all:", JSON.stringify(segs));
  }

  console.log("=== 3) mapSegmentsToBijoy (ফাইল-প্রিভিউ পথ) ===");
  const ms = mapSegmentsToBijoy(
    "\u09B0\u09C7\u09B2\u0997\u09BE\u09A1\u09BC\u09BF \u2014 \u2018Constructed reality\u2019",
    "u2b"
  );
  const bnOk = ms[0].bangla;
  const ltOk = ms.slice(1).every((s) => !s.bangla);
  console.log(`  ${bnOk && ltOk ? "পাস" : "ফেইল"}  segs: ${JSON.stringify(ms.map((s) => ({ b: s.bangla, t: s.text })))}`);
})();
