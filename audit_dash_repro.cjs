// @ts-nocheck
// standalone en-dash রূপান্তর টেস্ট — কনভার্টারের মূল প্রতিভাব
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const shim = `// @ts-nocheck
export { convertToBijoy } from "./client/src/lib/converter";
`;
fs.writeFileSync(path.resolve(__dirname, "audit_dash_shim.ts"), shim);
execSync(
  `npx esbuild audit_dash_shim.ts --bundle --format=esm --outfile=/tmp/audit_dash_bundle.mjs --tsconfig=tsconfig.json 2>&1 | tail -3`,
  { cwd: __dirname }
);
import("/tmp/audit_dash_bundle.mjs").then(({ convertToBijoy }) => {
  const out = convertToBijoy("\u2013");
  console.log("convertToBijoy('\u2013') =", JSON.stringify(out));
  const ok = out === "\u00D1";
  console.log(ok ? "পাস — বিজয়-ড্যাশ কোড (Ñ)" : "ফেইল — raw '–' এখনো পাস করছে");
  // আরও কেইস: ' – ' স্পেসসহ
  const out2 = convertToBijoy(" – ");
  console.log("convertToBijoy(' – ') =", JSON.stringify(out2));
});
