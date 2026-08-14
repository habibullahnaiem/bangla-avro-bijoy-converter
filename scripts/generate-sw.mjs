import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(projectRoot, "dist", "public");
const sourcePath = path.join(projectRoot, "client", "public", "sw.js");
const destinationPath = path.join(publicDir, "sw.js");

if (!fs.existsSync(publicDir)) {
  throw new Error(`Production public directory was not found: ${publicDir}`);
}

const assetFiles = [];
const collectFiles = (directory, relativeDirectory = "") => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      collectFiles(absolutePath, relativePath);
    } else if (entry.name !== "sw.js") {
      assetFiles.push(`/${relativePath.split(path.sep).join("/")}`);
    }
  }
};

collectFiles(publicDir);
assetFiles.sort();

const source = fs.readFileSync(sourcePath, "utf8");
const buildAssets = assetFiles.map((asset) => `  ${JSON.stringify(asset)},`).join("\n");
const generated = source.replace("  /* @vite-build-assets */", buildAssets);

if (generated === source) {
  throw new Error("The service-worker build asset marker was not found.");
}

fs.writeFileSync(destinationPath, generated, "utf8");
console.log(`Generated ${destinationPath} with ${assetFiles.length} precached build assets.`);
