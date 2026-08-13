const { build } = require('esbuild');
const fs = require('fs');
(async () => {
  await build({ entryPoints: ['client/src/lib/converter.ts'], bundle: true, outfile: '/tmp/ekar_bundle.mjs', format: 'esm', platform: 'browser' });
  const mod = await import('file:///tmp/ekar_bundle.mjs');
  const f = mod.convertToBijoy;
  const cases = [
    ["কারণ", "KviY"],
    ["কাজ", "Kvj"],
    ["কথা", "K\_?v"],
    ["পরের", null],
    ["মেনে", null],
    ["কারণ কাজ", "KviY Kvj"],
    ["শব্দ পরীক্ষা, কারণ কাজ । বাংলাকার", null],
    ["শ+ে+র", null],
    ["শ্র+ে+ণী", null],
    ["সকল কথা মেনে চলা চাই", null],
  ];
  for (const [inp, exp] of cases) {
    const out = f(inp);
    console.log(JSON.stringify(inp), "=>", JSON.stringify(out), exp ? (out === exp ? "OK" : `EXP ${exp}`) : "");
  }
})();
