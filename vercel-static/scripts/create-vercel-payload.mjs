import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const payloadPath = "/tmp/avrojoy-vercel-deploy-payload.json";
const files = [];

const addFile = (absolutePath, relativePath) => {
  files.push({
    file: relativePath.split(path.sep).join("/"),
    data: fs.readFileSync(absolutePath, "utf8"),
    encoding: "utf-8",
  });
};

const addDirectory = (relativeDirectory) => {
  const absoluteDirectory = path.join(projectRoot, relativeDirectory);
  for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".manus") continue;
    const relativePath = path.join(relativeDirectory, entry.name);
    const absolutePath = path.join(projectRoot, relativePath);
    if (entry.isDirectory()) {
      addDirectory(relativePath);
    } else {
      addFile(absolutePath, relativePath);
    }
  }
};

addDirectory("client");
for (const relativePath of [
  "package.json",
  "pnpm-lock.yaml",
  "tsconfig.json",
  "vite.config.ts",
  "vitest.config.ts",
  "vercel.json",
  "scripts/generate-sw.mjs",
]) {
  addFile(path.join(projectRoot, relativePath), relativePath);
}

fs.writeFileSync(
  payloadPath,
  JSON.stringify({
    teamId: "team_HuoLBit14aLp5bfkrllltnD7",
    name: "avrojoy-static",
    target: "production",
    projectSettings: {
      framework: "vite",
      buildCommand: "pnpm run build",
      installCommand: "pnpm install --frozen-lockfile",
      outputDirectory: "dist/public",
    },
    files,
  }),
);

console.log(`Prepared ${files.length} source files for Vercel deployment.`);
