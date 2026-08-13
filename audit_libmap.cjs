// Check ansi-unicode-converter's reverse table: which bijoy char maps to ন, ব, ণ, ঈ?
const data = require("@abdalgolabs/ansi-unicode-converter/dist/data.js");
const keys = Object.keys(data);
const pairs = { ন: [], ব: [], ণ: [], ঈ: [], ম: [] };
for (const k of keys) {
  const v = data[k];
  if (typeof v !== "string") continue;
  for (const ch of v) {
    if (pairs[ch] && pairs[ch].length < 4 && !pairs[ch].includes(k)) pairs[ch].push(k);
  }
}
for (const ch of Object.keys(pairs)) {
  console.log(ch, "->", pairs[ch], pairs[ch].map((k) => k.charCodeAt(0).toString(16)).join(" "));
}
