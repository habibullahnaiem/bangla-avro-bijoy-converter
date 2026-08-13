// আগের অনুমোদিত চেকপয়েন্ট da00cd21 (footnote-parity) থেকে convertToUnicode এবাং
// restoreCleanUnicode কী ছিল দেখা — সেই আচরণই ফিরিযে আনতে হবে।
import { execSync } from "node:child_process";
const files = ["client/src/lib/converter.ts"];
for (const f of files) {
  const out = execSync(`git show da00cd21:${f}`, { encoding: "utf8" });
  const m = out.match(/export function convertToUnicode[\s\S]{0,1500}?^}/m);
  console.log(`===== ${f} @ da00cd21 =====`);
  console.log(m ? m[0] : "not found");
  // restoreCleanUnicode সংক্ষেপে
  const m2 = out.match(/function restoreCleanUnicode[\s\S]{0,2500}?^}/m);
  console.log((m2 ? m2[0].split("\n").slice(0, 30).join("\n") : "restoreCleanUnicode not found"));
}
