import { JSDOM } from "jsdom";
import { convertFile } from "./client/src/lib/converter";
async function main() {
  const dom = new JSDOM("");
  if (!(globalThis as any).DOMParser) (globalThis as any).DOMParser = dom.window.DOMParser;
  const f1 = new (dom.window as any).File(["রাজশাহী বিশ্ববিদ্যালয়"], "test.txt", { type: "text/plain" });
  const r1 = await convertFile(f1, "u2b");
  console.log("u2b txt name:", r1.name);
  const f2 = new (dom.window as any).File([`কারণ`], "test.txt", { type: "text/plain" });
  const r2 = await convertFile(f2, "b2u");
  console.log("b2u txt name:", r2.name);
  console.log("PASS:", r1.name === "test_bijoy.txt" && r2.name === "test_avro.txt");
}
main().catch((e) => { console.error(e); process.exit(1); });
