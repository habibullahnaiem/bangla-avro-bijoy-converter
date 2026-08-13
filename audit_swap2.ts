// Isolated swap-flow replication to locate the mismatch.
import { convertToBijoy, convertToUnicode } from "./client/src/lib/converter";

const input0 = "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।";
const bijoy1 = convertToBijoy(input0);
console.log("bijoy1:", JSON.stringify(bijoy1));
const afterSwapIn = convertToUnicode(bijoy1 || input0);
console.log("afterSwapIn:", JSON.stringify(afterSwapIn));
console.log("len:", input0.length, afterSwapIn.length);
const uniOut = convertToUnicode(afterSwapIn);
console.log("uniOut:", JSON.stringify(uniOut));
console.log("roundtrip:", uniOut === input0);
const back = convertToBijoy(uniOut);
console.log("b2u->u2b reconvert:", back === bijoy1);
