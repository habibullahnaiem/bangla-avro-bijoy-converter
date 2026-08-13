import { restoreCleanUnicode } from "./client/src/lib/converter.ts";
const mixed = "\u00d2The quick brown fox\u00d3 \u00d1GB e\u09be\u0995\u09cd\u09af\u09a4\u09bf \u09ac\u09be\u0982\u09b2\u09be\u09b0 \u099a\u09c7\u09af\u09bc\u09c7 2pt \u099b\u09cb\u099f\u0964";
console.log("clean:", JSON.stringify(restoreCleanUnicode(mixed)));
