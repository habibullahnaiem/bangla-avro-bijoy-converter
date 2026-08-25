import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);
const repositoryRoot = path.resolve(templateRoot, "..");

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(repositoryRoot, "client", "src"),
      "@assets": path.resolve(repositoryRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    include: ["static-copy.test.ts", "origin-story.test.ts"],
  },
});
