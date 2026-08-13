// চূড়ান্ত নক্শা: e06b6c7d-যুগের আচরণ ফেরানো — convertToUnicode = পুরো-টেক্সট libBijoyToUnicode।
// রান-স্প্লিট এবাং restoreRun ফেলে দেওয়া। ব2u-নর্মালাইজেশন: ‡→† lib-এর আগে, 9DF→9AF+9BC পরে।
import { execSync } from "node:child_process";
// চেকপয়েন্ট e06b6c7d-এর restoreCleanUnicode-এর পরবর্তী অংশ (restoreCleanUnicode-এর পর convertToBijoy দিকে কী হয়) দেখা
const out = execSync("git show e06b6c7d:client/src/lib/converter.ts", { encoding: "utf8" });
const i = out.indexOf("export function convertToBijoy");
console.log(out.slice(i, i + 300));
