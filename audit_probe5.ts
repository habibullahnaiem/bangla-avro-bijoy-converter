import { bijoyToUnicode, unicodeToBijoy } from "@abdalgolabs/ansi-unicode-converter";

console.log("q->", JSON.stringify(bijoyToUnicode("q")), "code", bijoyToUnicode("q").charCodeAt(0).toString(16));
console.log("Y->", JSON.stringify(bijoyToUnicode("Y")), "code", bijoyToUnicode("Y").charCodeAt(0).toString(16));
console.log("Zvgvq->", JSON.stringify(bijoyToUnicode("Zvgvq")));
console.log("Zvgvqq->", JSON.stringify(bijoyToUnicode("Zvgvqq")));
console.log("Unicode য়->bijoy:", JSON.stringify(unicodeToBijoy("\u09af\u09bc")));
console.log("Unicode ড়->bijoy:", JSON.stringify(unicodeToBijoy("\u09a1\u09bc")));
console.log("Unicode ঢ়->bijoy:", JSON.stringify(unicodeToBijoy("\u09a2\u09bc")));
