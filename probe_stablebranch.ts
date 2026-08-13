import { convertToUnicode, convertToBijoy } from "./client/src/lib/converter.ts";
console.log("u2b:", JSON.stringify(convertToBijoy("“The quick brown fox” —GB e")));
console.log("b2u:", JSON.stringify(convertToUnicode("ÒThe quick brown foxÓ ÑGB e")));
