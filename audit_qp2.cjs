// @ts-nocheck
const { execSync } = require("child_process");
const fs = require("fs");
fs.writeFileSync("audit_qp_shim2.ts", '// @ts-nocheck\nexport { convertToBijoy } from "./client/src/lib/converter";\n');
execSync(`npx esbuild audit_qp_shim2.ts --bundle --format=esm --outfile=/tmp/audit_qp2.mjs --tsconfig=tsconfig.json 2>&1 | tail -2`, { cwd: __dirname, stdio: "pipe" });
(async () => {
  const { convertToBijoy } = await import("/tmp/audit_qp2.mjs");
  function codes(s){ return [...s].map(c=>c+"U+"+c.codePointAt(0).toString(16).toUpperCase().padStart(4,"0")).join(" "); }
  // Quote cases
  for (const t of ["‘শুরুর সিংগেল কোট’", "‘শুরুর সিংগেল কোট’ সঠিক", "'শুরুর সিংগেল কোট'", "বাক্য’ ‘একি"]) {
    console.log("IN :", t, "-> codes:", codes(t).slice(0,120));
    console.log("OUT:", convertToBijoy(t), "-> codes:", codes(convertToBijoy(t)));
    console.log("---");
  }
  // Plus cases
  for (const t of ["শ+র-ফলা+ে-কার", "শ+র-ফলা", "আ+ও", "র+ব", "শ+ে+র", "শ্র+ে+ণী"]) {
    console.log("IN :", t);
    console.log("OUT:", convertToBijoy(t));
    console.log("OUT codes:", codes(convertToBijoy(t)));
    console.log("---");
  }
})();
