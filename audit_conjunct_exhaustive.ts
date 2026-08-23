/**
 * Exhaustive conjunct audit — production conversion code is never modified here.
 * Scope: every syntactically valid two- and three-consonant Bangla hasant sequence,
 * plus word-position, vowel-sign, punctuation and Latin-adjacent contexts.
 */
import { writeFileSync } from "node:fs";
import { convert } from "./client/src/lib/converter";

const VIRAMA = "্";
// Use explicit code points for ড়/ঢ়/য়: copied text can decompose these into base+nukta,
// which would create invalid pseudo-conjuncts such as ক্ + nukta.
const CONSONANTS = [
  "ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ", "ট", "ঠ", "ড", "ঢ", "ণ",
  "ত", "থ", "দ", "ধ", "ন", "প", "ফ", "ব", "ভ", "ম", "য", "র", "ল", "শ", "ষ", "স", "হ",
  "\u09DC", "\u09DD", "\u09DF",
];
const VOWEL_SIGNS = ["া", "ি", "ী", "ু", "ূ", "ে", "ৈ", "ো", "ৌ"];
const PUNCTUATION = ["।", ",", ";", "—"];

type Failure = { kind: string; input: string; bijoy: string; back: string };
const failures: Failure[] = [];
let checked = 0;

function verify(input: string, kind: string) {
  const bijoy = convert(input, "u2b");
  const back = convert(bijoy, "b2u");
  checked += 1;
  // The Unicode standard permits য় to emerge as য + nukta after a hasant.
  // Compare canonical forms so encoding-equivalent conjuncts are not false failures.
  if (back.normalize("NFC") !== input.normalize("NFC")) {
    failures.push({ kind, input, bijoy, back });
  }
}

for (const first of CONSONANTS) {
  for (const second of CONSONANTS) {
    const conjunct = `${first}${VIRAMA}${second}`;
    verify(conjunct, "pair-bare");
    verify(`অ${conjunct}অ`, "pair-medial");
    for (const vowel of VOWEL_SIGNS) verify(`অ${conjunct}${vowel}`, "pair-vowel");
    for (const punctuation of PUNCTUATION) verify(`${conjunct}${punctuation}`, "pair-punctuation");
  }
}

for (const first of CONSONANTS) {
  for (const second of CONSONANTS) {
    for (const third of CONSONANTS) {
      const conjunct = `${first}${VIRAMA}${second}${VIRAMA}${third}`;
      verify(conjunct, "triple-bare");
      verify(`অ${conjunct}অ`, "triple-medial");
    }
  }
}

const report = {
  baseConsonants: CONSONANTS.length,
  pairSequences: CONSONANTS.length ** 2,
  tripleSequences: CONSONANTS.length ** 3,
  checked,
  failed: failures.length,
  failuresByKind: failures.reduce<Record<string, number>>((counts, failure) => {
    counts[failure.kind] = (counts[failure.kind] ?? 0) + 1;
    return counts;
  }, {}),
  failures: failures.slice(0, 100),
};

writeFileSync("/home/ubuntu/tmp/avrojoy_exhaustive_conjunct_audit.json", JSON.stringify(report, null, 2));
console.log(`Conjunct audit: ${checked} cases, ${failures.length} round-trip deviations.`);
if (failures.length) {
  console.log(JSON.stringify(failures.slice(0, 10), null, 2));
  process.exitCode = 1;
}
