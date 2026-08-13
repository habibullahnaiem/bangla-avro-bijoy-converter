import { bijoyToUnicode } from "@abdalgolabs/ansi-unicode-converter";
import {
  convertToBijoy,
  restoreLibArtifacts,
  protectLibArtifacts,
  preMapPunctuation,
} from "./client/src/lib/converter";

const orig = "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।";
const b = convertToBijoy(orig);
console.log("bijoy:", JSON.stringify(b));

// walk the segment loop as convertToUnicode does
let out = "";
for (const seg of b.split(/([\u0980-\u09FF]+)/)) {
  if (seg === "") continue;
  const hasBangla = /[\u0980-\u09FF]/.test(seg);
  if (hasBangla) {
    let r = bijoyToUnicode(seg);
    out += r;
    console.log("bangla seg:", JSON.stringify(seg), "->", JSON.stringify(r), "len", seg.length, "->", r.length);
  } else {
    console.log("non-bangla seg:", JSON.stringify(seg), "len", seg.length);
    const r = bijoyToUnicode(seg);
    console.log("  lib->", JSON.stringify(r), "len", r.length);
    out += r;
  }
}
console.log("loop result:", JSON.stringify(out), "len", out.length);
