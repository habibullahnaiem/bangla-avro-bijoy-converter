const data = require("@abdalgolabs/ansi-unicode-converter/dist/data.js");
const uni = data.uni2bijoy_string_conversion_map;
if (!uni) { console.log("map keys:", Object.keys(data)); process.exit(0); }
function find(uniTarget) {
  const out = [];
  for (const k of Object.keys(uni)) {
    if (uni[k] === uniTarget) out.push({ bijoy: k, hex: Array.from(k).map((c) => c.charCodeAt(0).toString(16)).join(" ") });
  }
  return out;
}
for (const t of ["শ্র", "ণী", "শ্রে", "শ্রি", "ণি", "শ্রো"]) {
  console.log(t, "->", find(t));
}
