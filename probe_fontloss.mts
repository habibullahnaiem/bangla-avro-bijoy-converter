import { convertToBijoy, convert } from "./client/src/lib/converter.ts";

const orig = '"The quick brown fox" —এই বাক্যটি বাংলার চেয়ে 2pt ছোট।';
const bij1 = convertToBijoy(orig);
console.log("full:", JSON.stringify(bij1));

const half = orig.slice(0, Math.floor(orig.length / 2));
const mixed = convertToBijoy(half) + orig.slice(half.length);
const mBij = convertToBijoy(convert(mixed, "u2b"));
console.log("mixed:", JSON.stringify(mBij));
console.log("same:", bij1 === mBij);
