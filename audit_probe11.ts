import { execSync } from "node:child_process";
const out = execSync("git show e06b6c7d:client/src/lib/converter.ts", { encoding: "utf8" });
const m = out.match(/function restoreCleanUnicode[\s\S]*?^}/m);
console.log(m ? m[0].slice(0, 3000) : "not found");
console.log("---convertToUnicode---");
const m2 = out.match(/export function convertToUnicode[\s\S]*?^}/m);
console.log(m2 ? m2[0] : "not found");
