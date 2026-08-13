const { execSync } = require("child_process");
const fs = require("fs");
fs.writeFileSync("ekt_shim.ts",
`export { convertToBijoy } from "./client/src/lib/converter";`);
execSync("npx esbuild ekt_shim.ts --bundle --format=esm --outfile=/tmp/ekt.mjs --tsconfig=tsconfig.json", { cwd: __dirname, stdio: "pipe" });
(async () => {
  const { convertToBijoy } = await import("/tmp/ekt.mjs");
  const cases = ["শব্দ পরীক্ষা, কারণ কাজ । বাংলা", "কারণ এ কার এখানে", "পরের এ কার আগে যাওয়া উচিত নয়"];
  for (const t of cases) console.log(JSON.stringify(t), "=>", JSON.stringify(convertToBijoy(t)));
})();
