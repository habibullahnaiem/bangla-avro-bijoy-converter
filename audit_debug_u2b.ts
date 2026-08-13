import { bijoyToUnicode } from "@abdalgolabs/ansi-unicode-converter";
import { convertToUnicode, convertToBijoy } from "./client/src/lib/converter";
const t = convertToBijoy("এখনই");
console.log("u2b:", JSON.stringify(t));
// replicate the loop
const CODE_GROUP_RE = /([\u2020\u2021]*[A-Za-z]+(?:'[A-Za-z]+)*)/;
let out = "";
for (const seg of t.split(/([\u0980-\u09FF]+)/)) {
  if (seg === "") continue;
  const hasBangla = /[\u0980-\u09FF]/.test(seg);
  if (hasBangla) {
    out += "BANG(" + bijoyToUnicode(seg) + ")";
  } else if (CODE_GROUP_RE.test(seg)) {
    const m = seg.match(CODE_GROUP_RE);
    console.log("seg:", JSON.stringify(seg), "match:", m ? JSON.stringify(m[1]) : null);
    if (m && /^[\u2020\u2021]/.test(m[1])) {
      out += "DAG(" + m[1] + ")";
    } else if (m && /^[a-z]+/.test(m[1])) {
      out += "LOWER(" + bijoyToUnicode(m[1]) + ")";
    } else {
      out += "UNMAP(" + seg + ")";
    }
  } else {
    out += "PASS(" + seg + ")";
  }
}
console.log("out:", JSON.stringify(out));
console.log("convertToUnicode(t):", JSON.stringify(convertToUnicode(t)));
