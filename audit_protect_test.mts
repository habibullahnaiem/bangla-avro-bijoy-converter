// Prototype of artifact-protected pipeline:
// 1) protect library-native artifacts (”Qvq/”Qv/š’) with private placeholders before preMap
// 2) preMap (quotes/dash)
// 3) library u2b
// 4) restore artifacts
import { unicodeToBijoy, bijoyToUnicode } from '@abdalgolabs/ansi-unicode-converter';
import { convertToBijoy as realConvert } from './client/src/lib/converter.ts';
const PH_D3 = "\uE002"; // placeholder for ” artifact
const PH_D5 = "\uE003"; // placeholder for ’ artifact
function protectedConvert(text: string): string {
  // collect artifacts before preMap so they are not touched by our quote map
  const arts: string[] = [];
  let s = text
    .replace(/\u201D/g, (m, i) => { arts.push("d3"); return PH_D3; })
    .replace(/\u2019/g, (m, i) => { arts.push("d5"); return PH_D5; });
  // ... but user-input quotes would also get protected! That breaks "hello"-quotes.
  // So only protect artifacts in bijoy-context: not viable generically.
  return s;
}
// Better idea: unmapOurMarkers should NOT map D3→” / D5→’. Library-native D3/D5 must
// survive untouched. Our own markers D2/D3/D4/D5 ALSO survive untouched (leave as-is).
// Problem: our own D3 would then be preMap'd to Ó on re-conversion → double map again!
// UNLESS: preMap doesn't map D2/D3/D4/D5 — but they're U+00D2..D5 which are Latin-1,
// and map only covers 201C/201D/2018/2019/2014/2013 → our preMap never touches D2-D5!
// The only reason D3 became Ó on re-conversion was unmap D3→”. If unmap leaves D3/D5,
// then re-conversion: preMap sees D3 (not in map) → passes → library passes → D3 intact = bit-perfect!
// But what about user's ORIGINAL unicode input containing ”? Currently map[”]=Ó → D3 OK.
// And our unmap currently D3→”: without it, original user text with ” converts fine
// (preMap D3). And bijoy text with artifact D3 re-converts fine (untouched). WIN.
// Remaining worry: b2u direction — convertToUnicode leaves D3 as-is (lib passes), so
// artifact stays ” in unicode — that's how user originally pasted it; fine.
// But wait: audit expected clean Unicode to have ” for quotes? Check audit expectations.
console.log("prototype analysis complete");
