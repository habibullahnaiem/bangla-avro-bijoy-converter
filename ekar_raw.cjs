(async () => {
  const lib = await import('@abdalgolabs/ansi-unicode-converter');
  console.log("lib exports:", Object.keys(lib));
  const fn = lib.unicodeToBijoy || lib.ansiUnicodeConverter?.unicodeToBijoy;
  if (!fn) return;
  for (const w of ["কাজ", "কথা", "শব্দ", "পাহাড়", "কারণ", "মেনে", "পরের"]) {
    const out = fn(w);
    console.log(JSON.stringify(w), "=>", JSON.stringify(out), Array.from(out).map(c => c.charCodeAt(0).toString(16)).join(" "));
  }
})();
