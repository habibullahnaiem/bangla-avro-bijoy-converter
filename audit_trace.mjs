import { bijoyToUnicode } from "@abdalgolabs/ansi-unicode-converter";
const CODE_GROUP_RE = /([\u2020\u2021]*[A-Za-z]+(?:'[A-Za-z]+)*)/;
const BIJOY_VOWEL_CODES = /[vwiZDg]/;
function isBijoyToken(tok) {
  if (!/[A-Za-z]/.test(tok)) return false;
  if (/^[\u2020\u2021]/.test(tok)) return true;
  if (!/^[A-Z]/.test(tok)) return true;
  return BIJOY_VOWEL_CODES.test(tok.slice(1));
}
const seg = " †ij GLb kn‡i ‡ijPvjK hvb ";
let out = "";
for (const t of seg.split(CODE_GROUP_RE)) {
  if (t === "") continue;
  if (isBijoyToken(t)) {
    out += " [" + t + "->" + bijoyToUnicode(t.replace(/\u2021/g, "\u2020")) + "]";
  } else {
    out += " {" + t + "}";
  }
}
console.log("parts:", JSON.stringify(seg.split(CODE_GROUP_RE)));
console.log("out:", out);
