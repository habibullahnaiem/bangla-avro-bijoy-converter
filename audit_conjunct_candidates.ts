/** Candidate byte checks derived from a controlled reference-site comparison. */
import { convert } from "./client/src/lib/converter";

const candidates = [
  { input: "গ্রু", reference: "MÖæ" },
  { input: "র্", reference: "©" },
  { input: "ষ্ক্র", reference: "l&µ" },
  { input: "্র্য", reference: "ª¨" },
  { input: "ক্ষ্ন", reference: "¶&b" },
  { input: "ক্ষ্ণ", reference: "¶&Y" },
  { input: "ণ্ণ", reference: "Y&Y" },
  { input: "ণ্ন", reference: "Y&b" },
  { input: "ত্রূ", reference: "Î~" },
];

const verifiedOverrides: Record<string, string> = {
  "ক্ষ্ন": "¶&b",
  "ক্ষ্ণ": "¶&Y",
  "ণ্ণ": "Y&Y",
  "ণ্ন": "Y&b",
  "ত্রূ": "Î~",
};

let failures = 0;

for (const candidate of candidates) {
  const actual = convert(candidate.input, "u2b");
  const actualBack = convert(actual, "b2u");
  const referenceBack = convert(candidate.reference, "b2u");
  const expected = verifiedOverrides[candidate.input] ?? candidate.reference;
  const isCompleteVerifiedConjunct = candidate.input in verifiedOverrides || candidate.input === "গ্রু" || candidate.input === "ষ্ক্র";
  const passed = !isCompleteVerifiedConjunct || (
    actual === expected && actualBack.normalize("NFC") === candidate.input.normalize("NFC")
  );
  if (!passed) failures += 1;
  console.log(JSON.stringify({ ...candidate, expected, actual, actualBack, referenceBack, isCompleteVerifiedConjunct, passed }));
}

if (failures) process.exitCode = 1;
