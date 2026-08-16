import { convertToBijoy, convertToUnicode } from "./client/src/lib/converter";

const samples = [
  { label: "reported gap form", bijoy: "K„wlwfwËK" },
  { label: "reported correct form", bijoy: "K…wlwfwËK" },
];
const canonicalBijoy = "K…wlwfwËK";

const codePoints = (text: string) =>
  Array.from(text)
    .map((character) => `U+${character.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`)
    .join(" ");

let failed = false;
let decodedUnicode = "";

for (const sample of samples) {
  const unicode = convertToUnicode(sample.bijoy);
  const reconverted = convertToBijoy(unicode);
  const matchesPeer = !decodedUnicode || unicode === decodedUnicode;
  decodedUnicode ||= unicode;
  const canonicalized = reconverted === canonicalBijoy;
  failed ||= !matchesPeer || !canonicalized;
  console.log(`${matchesPeer && canonicalized ? "PASS" : "FAIL"} ${sample.label}`);
  console.log(`  Bijoy:   ${JSON.stringify(sample.bijoy)} (${codePoints(sample.bijoy)})`);
  console.log(`  Unicode: ${JSON.stringify(unicode)} (${codePoints(unicode)})`);
  console.log(`  u2b canonical: ${JSON.stringify(reconverted)} (${codePoints(reconverted)})`);
}

if (failed) process.exit(1);
