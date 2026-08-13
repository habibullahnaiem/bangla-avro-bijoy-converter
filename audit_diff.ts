import { convertToUnicode, convertToBijoy } from "./client/src/lib/converter";

const orig = "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।";
const b = convertToBijoy(orig);
const r = convertToUnicode(b);
console.log("orig len", orig.length, "bijoy len", b.length, "roundtrip len", r.length);
for (let i = 0; i < orig.length || i < r.length; i++) {
  const a = orig[i], c = r[i];
  if (a !== c) {
    console.log(
      "diff at", i,
      "orig:", a ? a.codePointAt(0)!.toString(16) : "EOL",
      "rt:", c ? c.codePointAt(0)!.toString(16) : "EOL"
    );
    console.log("orig ctx:", JSON.stringify(orig.slice(Math.max(0, i - 3), i + 3)));
    console.log("rt   ctx:", JSON.stringify(r.slice(Math.max(0, i - 3), i + 3)));
  }
}
