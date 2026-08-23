import { convert } from "./client/src/lib/converter";

const corpus = "কৃষি কৃষ্টি তৃণ মৃত্যু দৃশ্য স্মৃতি ন্ট ল্ল য় ড় ঢ় প্র শ্র জ্ঞ ক্ষ। “কোট” ‘কোট’ — …";
const reference = "K…wl K…wó Z…Y g„Zz¨ `„k¨ ¯§„wZ ›U jø q o X় cÖ kÖ Á ¶| Ò‡KvUÓ Ô‡KvUÕ — „";
const avrojoy = convert(corpus, "u2b");
const referenceRoundTrip = convert(reference, "b2u");
const avrojoyRoundTrip = convert(avrojoy, "b2u");

const units = (text: string) => Array.from(text).map((char) => `U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`);

console.log(JSON.stringify({ corpus, reference, avrojoy, matchesReference: reference === avrojoy, referenceRoundTrip, avrojoyRoundTrip, referenceUnits: units(reference), avrojoyUnits: units(avrojoy) }, null, 2));
