import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

describe("Recent history light theme", () => {
  it("keeps the empty history state on a light readable surface outside dark mode", () => {
    const styles = fs.readFileSync(path.join(repositoryRoot, "client/src/index.css"), "utf8");

    expect(styles).toContain("html:not(.dark) .history-empty-state {");
    expect(styles).toContain("html:not(.dark) .history-empty-state .text-foreground");
    expect(styles).toContain("html:not(.dark) .history-empty-state .text-muted-foreground");
    expect(styles).toContain("oklch(0.99 0.008 205 / 0.99)");
  });
});
