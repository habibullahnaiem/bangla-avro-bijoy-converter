import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(repositoryRoot, "client", "src"),
      "@assets": path.resolve(repositoryRoot, "attached_assets"),
    },
  },
  root: path.resolve(repositoryRoot, "client"),
  publicDir: path.resolve(repositoryRoot, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist", "public"),
    emptyOutDir: true,
  },
  preview: {
    allowedHosts: true,
  },
});
