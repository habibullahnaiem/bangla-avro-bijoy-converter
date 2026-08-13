import { convertToBijoy, convertToUnicode } from "./client/src/lib/converter.ts";
const checks: [string, string][] = [
  ["রেল", "†ij"],
  ["এখনই", "GLbB"],
  ["বৃহদ", "e„n`"],
  ["মো. হাবিবুল্লাহ নাঈম", "†gv. nvweeyjøvn bvCg"],
];
for (const [u, b] of checks) {
  const got = convertToBijoy(u);
  console.log(got === b ? "PASS" : "FAIL", u, "->", JSON.stringify(got), got === b ? "" : `(expect ${JSON.stringify(b)})`);
  const rt = convertToUnicode(got);
  console.log(rt === u ? "RT-PASS" : "RT-FAIL", got, "->", rt, rt === u ? "" : `(expect ${u})`);
}
