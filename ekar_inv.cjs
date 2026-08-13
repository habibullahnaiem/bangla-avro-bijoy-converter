(async () => {
  const lib = await import('@abdalgolabs/ansi-unicode-converter');
  const u2b = lib.unicodeToBijoy, b2u = lib.bijoyToUnicode;
  // Round-trip check for the corrupted words
  for (const w of ["কাজ", "কথা", "শব্দ", "কারণ"]) {
    const out = u2b(w);
    const back = b2u(out);
    console.log(JSON.stringify(w), "=>", JSON.stringify(out), "roundtrip:", JSON.stringify(back), back === w ? "OK" : "BROKEN");
  }
})();
