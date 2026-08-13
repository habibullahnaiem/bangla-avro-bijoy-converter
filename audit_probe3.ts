import { bijoyToUnicode } from "@abdalgolabs/ansi-unicode-converter";
import { convertToUnicode } from "./client/src/lib/converter";

const seg = "Avgvi \u2021mvbvi evsjv, Avwg \u2021Zvgvq fv\u2021jvevwm|";
const segT = seg.replace(/\u2021/g, "\u2020");
console.log("package lib(segT):", JSON.stringify(bijoyToUnicode(segT)), "len", bijoyToUnicode(segT).length);
console.log("convertToUnicode(seg):", JSON.stringify(convertToUnicode(seg)), "len", convertToUnicode(seg).length);
