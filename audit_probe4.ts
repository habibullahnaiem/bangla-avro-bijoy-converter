import { bijoyToUnicode } from "@abdalgolabs/ansi-unicode-converter";

const s1 = "Avwg \u2020Zvgvq fv\u2020jvevwm|";
const s2 = "Avgvi \u2020mvbvi evsjv, Avwg \u2020Zvgvq fv\u2020jvevwm|";
const s3 = "Avgvi \u2021mvbvi evsjv, Avwg \u2021Zvgvq fv\u2021jvevwm|";
for (const [name, s] of [["s1", s1], ["s2", s2], ["s3", s3]]) {
  const r = bijoyToUnicode(s);
  console.log(name, "len", s.length, "->", r.length, JSON.stringify(r));
}
const exp = "\u0986\u09ae\u09be\u09b0 \u09b8\u09cb\u09a8\u09be\u09b0 \u09ac\u09be\u0982\u09b2\u09be, \u0986\u09ae\u09bf \u09a4\u09cb\u09ae\u09be\u09af\u09bc \u09ad\u09be\u09b2\u09cb\u09ac\u09be\u09b8\u09bf\u0964";
console.log("expected len", exp.length, JSON.stringify(exp));
