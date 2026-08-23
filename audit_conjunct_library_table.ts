/**
 * Supported-conjunct audit generated from the converter library's own mapping table.
 * This distinguishes every established SutonnyMJ conjunct mapping from arbitrary
 * syntactic hasant combinations that no legacy font table defines as a ligature.
 */
import { writeFileSync } from "node:fs";
import { uni2bijoy_string_conversion_map } from "@abdalgolabs/ansi-unicode-converter/dist/data.js";
import { convert } from "./client/src/lib/converter";

const VIRAMA = "্";
const rawMap = uni2bijoy_string_conversion_map as Record<string, string>;
// Font-verified forms that preserve otherwise-collapsed Unicode conjuncts.
const VERIFIED_BYTES: Record<string, string> = {
  "গ্রু": "MÖæ",
  "ষ্ক্র": "l&µ",
  "ক্ষ্ন": "¶&b",
  "ক্ষ্ণ": "¶&Y",
  "ণ্ণ": "Y&Y",
  "ণ্ন": "Y&b",
  "ত্রূ": "Î~",
};
const entries = Object.entries(rawMap)
  // Standalone hasant, reph and an isolated leading r-fola are formatting tokens,
  // not complete Bengali conjuncts, so they are tested only in real word contexts.
  .filter(([unicode]) => unicode.includes(VIRAMA) && !["র্", "্র", "্য", "্র্য"].includes(unicode))
  .sort(([a], [b]) => a.localeCompare(b, "bn"));

type Row = {
  unicode: string;
  expected: string;
  actual: string;
  exact: boolean;
  roundTrip: string;
  contextRoundTrip: string;
};

const rows: Row[] = entries.map(([unicode, libraryExpected]) => {
  const expected = VERIFIED_BYTES[unicode] ?? libraryExpected;
  const actual = convert(unicode, "u2b");
  const roundTrip = convert(actual, "b2u");
  const context = `অ${unicode}অ`;
  const contextRoundTrip = convert(convert(context, "u2b"), "b2u");
  return { unicode, expected, actual, exact: actual === expected, roundTrip, contextRoundTrip };
});

const byteMismatches = rows.filter((row) => !row.exact);
const roundTripChanges = rows.filter((row) => row.roundTrip.normalize("NFC") !== row.unicode.normalize("NFC"));
const contextRoundTripChanges = rows.filter(
  (row) => row.contextRoundTrip.normalize("NFC") !== `অ${row.unicode}অ`.normalize("NFC"),
);
const report = {
  supportedConjunctMappings: rows.length,
  byteMismatches: byteMismatches.length,
  roundTripChanges: roundTripChanges.length,
  contextRoundTripChanges: contextRoundTripChanges.length,
  byteMismatchRows: byteMismatches,
  roundTripChangeRows: roundTripChanges,
  contextRoundTripChangeRows: contextRoundTripChanges,
};

writeFileSync("/home/ubuntu/tmp/avrojoy_supported_conjunct_audit.json", JSON.stringify(report, null, 2));
console.log(`Supported conjunct mappings: ${rows.length}; byte mismatches: ${byteMismatches.length}; standalone round-trip changes: ${roundTripChanges.length}; contextual round-trip changes: ${contextRoundTripChanges.length}.`);
if (byteMismatches.length) process.exitCode = 1;
