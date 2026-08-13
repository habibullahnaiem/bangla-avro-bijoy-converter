import { bijoyToUnicode } from "@abdalgolabs/ansi-unicode-converter";
const s1 = "\u00d2The quick brown fox\u00d3 \u00d1GB e\u09be\u0995\u09cd\u09af\u09a4\u09bf \u09ac\u09be\u0982\u09b2\u09be\u09b0 \u099a\u09c7\u09af\u09bc\u09c7 2pt \u099b\u09cb\u099f\u0964";
console.log("lib b2u:", JSON.stringify(bijoyToUnicode(s1)));
// Only the Bijoy-coded Latin run:
const s2 = "\u00d2The quick brown fox\u00d3 \u00d1GB e";
console.log("lib b2u (latin only):", JSON.stringify(bijoyToUnicode(s2)));
// Pure Bangla Bijoy for control:
const s3 = "evsjvi \u2021P\u2021q 2pt \u2021QvU";
console.log("lib b2u (bangla):", JSON.stringify(bijoyToUnicode(s3)));
