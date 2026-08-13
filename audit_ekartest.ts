import { convertToBijoy, convertToUnicode } from "./client/src/lib/converter";
const cases = [
  "এখনই",    // GLbB
  "এটি",     // GwU
  "এবং",
  "একা",
  "রেল এখনই আসবে",
  "এখনই রেল",
];
for (const t of cases) {
  const b = convertToBijoy(t);
  const r = convertToUnicode(b);
  const ok = r === t ? "PASS" : "FAIL";
  console.log(`${ok} | ${t} -> ${b} -> ${r}`);
}
