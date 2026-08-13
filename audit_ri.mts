import { convertToBijoy } from './client/src/lib/converter.ts';
function hex(s: string) { return [...s].map(c => c.charCodeAt(0).toString(16)).join(' '); }
const cases = ["ঋ", "ঋষি", "বৃহদায়তন", "সমৃদ্ধ", "ঋণ"];
for (const c of cases) {
  const out = convertToBijoy(c);
  console.log(c, "=>", JSON.stringify(out), "|", hex(out));
}
