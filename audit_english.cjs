// @ts-nocheck
const fs=1
const { unicodeToBijoy } = require("@abdalgolabs/ansi-unicode-converter");

// বর্তমান converter.ts-এর preMapPunctuation-এর কাছাকাছি (ইংরেজি-প্রসঙ্গ-অজানা)
function preMap(s) {
  let o = "";
  let open = true;
  for (const ch of s) {
    if (ch === "\u201C" || ch === "\u0022") {
      o += open ? "\u00D2" : "\u00D3";
      open = true; // সরলীকৃত
    } else if (ch === "\u201D") o += "\u00D3";
    else if (ch === "\u2018") o += "\u00D4";
    else if (ch === "\u2019" || ch === "\u0027") o += "\u00D5";
    else if (ch === "\u2014") o += "\u00D1";
    else if (ch === "\u2013") o += "\u00D0";
    else o += ch;
  }
  return o;
}

const cases = [
  "It's a test",
  "Hello world 12:45",
  "\u201CTesting\u201D — ok",
  "\u09B0\u09C7\u09B2\u0997\u09BE\u09A1\u09BC\u09BF Railway has a schedule",
];
for (const c of cases) {
  console.log("SRC:", JSON.stringify(c));
  console.log("  pre :", JSON.stringify(preMap(c)));
  console.log("  conv:", JSON.stringify(unicodeToBijoy(preMap(c))));
  console.log("  bare:", JSON.stringify(unicodeToBijoy(c)));
}

// segmentBijoyText-এর বর্তমান নিয়ম: dash/quote সবসময় bangla=true ফলো-থ্রু
function seg(text) {
  const out = [];
  let cur = "";
  let curB = false;
  const BAN = /[\u0980-\u09FF]/;
  const bp =
    /[\u0980-\u09FF।॥\u2014\u2013\u201C\u201D\u2018\u2019\u201B;\u0022\u0027]/;
  for (const ch of text) {
    const b = BAN.test(ch);
    const p = bp.test(ch);
    const nb = b ? true : /[A-Za-z0-9]/.test(ch) ? false : curB;
    if (cur === "" || nb === curB) {
      cur += ch;
      curB = nb;
    } else {
      out.push(cur + "[" + (curB ? "BN" : "LT") + "]");
      cur = ch;
      curB = nb;
    }
  }
  if (cur) out.push(cur + "[" + (curB ? "BN" : "LT") + "]");
  return out.join(" | ");
}
console.log("\nSEG:");
console.log(
  seg("\u09B0\u09C7\u09B2\u0997\u09BE\u09A1\u09BC\u09BF \u2014 \u2019Constructed reality\u2019 \u09A1\u09BC\u09BF"),
);
console.log(seg("It's a test — ok"));
