import { convertToUnicode, convertToBijoy } from "./client/src/lib/converter";

const orig = "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।";
const b = convertToBijoy(orig);
const r = convertToUnicode(b);
console.log("orig len", orig.length, "bijoy len", b.length, "roundtrip len", r.length);
console.log("roundtrip:", r === orig ? "PASS" : "FAIL");
if (r !== orig) {
  for (let i = 0; i < orig.length || i < r.length; i++) {
    if (orig[i] !== r[i]) {
      console.log("diff at", i);
      break;
    }
  }
}
