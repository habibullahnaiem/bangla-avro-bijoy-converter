import { bijoyToUnicode } from "@abdalgolabs/ansi-unicode-converter";
// replicate stable restoreCleanUnicode marker branch
function unmapContextFreeMarkers(text: string): string {
  return text
    .replace(/\uE001/g, "\u0965")
    .replace(/\u005C\u005C/g, "\u0965")
    .replace(/\u007C/g, "।");
}
function convertToBijoyRaw(seg: string): string {
  return bijoyToUnicode(seg)
    .replace(/\u005C{2}/g, "॥")
    .replace(/\u007C/g, "।")
    .replace(/\uE001/g, "॥")
    .replace(/\u09DF/g, "\u09af\u09bc");
}
// stable restoreCleanUnicode: marker-run → convertToBijoyRaw(unmapContextFreeMarkers(seg))
let out = "";
for (const seg of "ÒThe quick brown foxÓ ÑGB e".split(/([\u0980-\u09FF]+)/)) {
  if (seg === "") continue;
  const hasBangla = /[\u0980-\u09FF]/.test(seg);
  if (hasBangla) { out += seg; }
  else if (/[ÑÒÓÔÕ\\|E001]/.test(seg)) { out += convertToBijoyRaw(unmapContextFreeMarkers(seg)); }
  else { out += seg; }
}
console.log("stable-restore output:", JSON.stringify(out));
