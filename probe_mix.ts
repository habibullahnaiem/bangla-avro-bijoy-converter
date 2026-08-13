import { restoreCleanUnicode } from "./client/src/lib/converter.ts";
console.log("restoreCleanUnicode:", JSON.stringify(restoreCleanUnicode("ÒThe quickÓ ÑGB e")));
