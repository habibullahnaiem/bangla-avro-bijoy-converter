import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const projectRoot = path.resolve(import.meta.dirname, "..");
const repositoryRoot = path.resolve(projectRoot, "..");
const publicDir = path.join(projectRoot, "dist", "public");
const sourcePath = path.join(repositoryRoot, "client", "public", "sw.js");
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
const cacheVersion = `avrojoy-offline-${createHash("sha256")
  .update(source)
  .update(buildAssets)
  .digest("hex")
  .slice(0, 12)}`;
const generated = source
  .replace("__AVROJOY_BUILD_CACHE_VERSION__", cacheVersion)
  .replace("  /* @vite-build-assets */", buildAssets);

if (generated === source || generated.includes("__AVROJOY_BUILD_CACHE_VERSION__")) {
  throw new Error("The service-worker build markers were not found.");
}

fs.writeFileSync(destinationPath, generated, "utf8");
console.log(`Generated ${destinationPath} with ${assetFiles.length} precached build assets (${cacheVersion}).`);
