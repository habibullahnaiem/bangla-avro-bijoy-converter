import fs from "node:fs";
const src = fs.readFileSync("client/src/lib/converter.ts", "utf8");
const idx = src.indexOf("মার্কার-বিহীন পুরো-ব2য");
console.log("comment found:", idx !== -1);
console.log("has lowercase branch:", /[a-z]\/\.test\(seg\)/.test(src));
// লাইন 185-200 প্রিন্ট
const lines = src.split("\n");
for (let i = 184; i <= 200 && i < lines.length; i++) console.log(i + 1, lines[i]);
