// @ts-nocheck
const { execSync } = require("child_process");
const fs = require("fs");
fs.writeFileSync("audit_qp_shim3.ts", '// @ts-nocheck\nexport { convertToBijoy } from "./client/src/lib/converter";\n');
execSync(`npx esbuild audit_qp_shim3.ts --bundle --format=esm --outfile=/tmp/audit_qp3.mjs --tsconfig=tsconfig.json 2>&1 | tail -1`, { cwd: __dirname, stdio: "pipe" });
(async () => {
  const { convertToBijoy } = await import("/tmp/audit_qp3.mjs");
  const cases = ["শ+র+ব", "শ+র-ফলা+ে-কার", "শ+ে+র", "শ্র+ে+ণী", "র+ব", "র-ফলা", "‘শুরুর সিংগেল কোট’", "শেরপুর, শের+এর", "৫+ে-কার", "দে+দুয়ার"];
  for (const t of cases) {
    const raw = convertToBijoy(t);
    const codes = [...raw].map(c=>c+"U+"+c.codePointAt(0).toString(16).toUpperCase().padStart(4,"0")).join(" ");
    console.log("IN  :", t);
    console.log("FIX:", raw, "->", codes);
    console.log("---");
  }
})();
