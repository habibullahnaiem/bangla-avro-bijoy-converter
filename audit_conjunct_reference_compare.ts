/** Reference comparison only: no production mapping is changed by this file. */
import { convert } from "./client/src/lib/converter";

const corpus = "ন্ত ন্থ ন্দ ন্ধ ন্ট ল্ল প্র ক্র গ্র শ্র জ্ঞ ক্ষ ত্র ত্ত দ্ধ ষ্ঠ র্ক র্গ র্দ র্ফ প্রজ্ঞা লক্ষ্মী শ্রদ্ধা কর্ম অর্থ রক্ত";
const reference = "šÍ š’ ›` Ü ›U jø cÖ µ MÖ kÖ Á ¶ Î Ë × ô K© M© `© d© cÖÁv j²x kÖ×v Kg© A_© i³";
const avrojoy = convert(corpus, "u2b");

const rows = corpus.split(" ").map((input, index) => {
  const referenceByte = reference.split(" ")[index] ?? "";
  const avrojoyByte = avrojoy.split(" ")[index] ?? "";
  return {
    input,
    referenceByte,
    avrojoyByte,
    sameByte: referenceByte === avrojoyByte,
    referenceBack: convert(referenceByte, "b2u"),
    avrojoyBack: convert(avrojoyByte, "b2u"),
  };
});

const differing = rows.filter((row) => !row.sameByte);
const referenceRoundTripFailures = rows.filter((row) => row.referenceBack.normalize("NFC") !== row.input.normalize("NFC"));
const avrojoyRoundTripFailures = rows.filter((row) => row.avrojoyBack.normalize("NFC") !== row.input.normalize("NFC"));

console.log(JSON.stringify({ corpus, reference, avrojoy, rows, differing, referenceRoundTripFailures, avrojoyRoundTripFailures }, null, 2));
if (avrojoyRoundTripFailures.length) process.exitCode = 1;
