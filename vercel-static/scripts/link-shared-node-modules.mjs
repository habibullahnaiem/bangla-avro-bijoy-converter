import fs from "node:fs";
import path from "node:path";

const staticProjectRoot = path.resolve(import.meta.dirname, "..");
const repositoryRoot = path.resolve(staticProjectRoot, "..");
const sharedNodeModulesPath = path.join(repositoryRoot, "node_modules");
const staticNodeModulesPath = path.join(staticProjectRoot, "node_modules");

if (!fs.existsSync(staticNodeModulesPath)) {
  throw new Error("The Vercel static project dependencies were not installed.");
}

if (!fs.existsSync(sharedNodeModulesPath)) {
  fs.symlinkSync(path.relative(repositoryRoot, staticNodeModulesPath), sharedNodeModulesPath, "dir");
  console.log("Linked shared root dependencies to the Vercel static project dependencies.");
}
