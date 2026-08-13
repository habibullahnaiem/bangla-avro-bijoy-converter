import {
  convertToBijoy,
  convertToUnicode,
  convert,
  restoreCleanUnicode,
} from "./client/src/lib/converter.ts";

const orig = '"The quick brown fox" —এই বাক্যটি বাংলার চেয়ে 2pt ছোট।';
const half = orig.slice(0, Math.floor(orig.length / 2));
console.log("half:", JSON.stringify(half));

const bijHalf = convertToBijoy(half);
console.log("bij half:", JSON.stringify(bijHalf));

const mixed = bijHalf + orig.slice(half.length);
console.log("mixed:", JSON.stringify(mixed));

const restored = convertToUnicode(mixed);
console.log("b2u of mixed:", JSON.stringify(restored));

const u2bAgain = convertToBijoy(restored);
console.log("u2b again:", JSON.stringify(u2bAgain));

const u2bDirect = convertToBijoy(orig);
console.log("u2b direct:", JSON.stringify(u2bDirect));
