import { unicodeToBijoy, bijoyToUnicode } from "@abdalgolabs/ansi-unicode-converter";
const tests = ["'hello'", '"hello"', "পরীক্ষা।", "পরীক্ষা॥", "।"];
for (const t of tests) {
  const b = unicodeToBijoy(t);
  console.log(JSON.stringify(t), "->", JSON.stringify(b), "->", JSON.stringify(bijoyToUnicode(b)));
}
// check whether library touches these chars
for (const ch of ["\u0027", "\u0022", "\u0021", "\u002e", "\u002c", "\u003b"]) {
  console.log("pass-thru test:", JSON.stringify(ch), "->", JSON.stringify(unicodeToBijoy(ch)), "->", JSON.stringify(bijoyToUnicode(unicodeToBijoy(ch))));
}
