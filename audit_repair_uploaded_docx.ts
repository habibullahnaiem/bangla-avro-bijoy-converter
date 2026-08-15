import { readFile, writeFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>");
Object.assign(globalThis, {
  DOMParser: dom.window.DOMParser,
  XMLSerializer: dom.window.XMLSerializer,
  File: dom.window.File,
  Blob: dom.window.Blob,
});

const sourcePath = "/home/ubuntu/upload/CH03E03PRFDFC_bijoy.docx";
const outputPath = "/home/ubuntu/Downloads/CH03E03PRFDFC_bijoy_repaired.docx";
const { repairBijoyFontFile } = await import("./client/src/lib/converter.ts");
const source = await readFile(sourcePath);
const input = new File([source], "CH03E03PRFDFC_bijoy.docx", {
  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
});

const repaired = await repairBijoyFontFile(input);
await writeFile(outputPath, new Uint8Array(await repaired.blob.arrayBuffer()));
console.log(`REPAIRED=${outputPath}`);
