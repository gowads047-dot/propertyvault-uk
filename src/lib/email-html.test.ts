import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";

/**
 * Email HTML has no stylesheet, so a CSS custom property resolves to nothing:
 * `color:var(--gold-ink)` in a mail client is the client's default colour.
 * Fourteen headings across ten transactional emails shipped that way. This
 * holds every route handler and email template to literal colours.
 */
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(name) && !name.includes(".test.")) out.push(p);
  }
  return out;
}

describe("email HTML uses literal colours", () => {
  it("has no CSS custom properties in API routes or email templates", () => {
    const root = process.cwd();
    const files = [...walk(join(root, "src", "app", "api")), ...walk(join(root, "src", "emails"))];
    const offenders: string[] = [];
    for (const file of files) {
      const src = readFileSync(file, "utf8");
      const rel = file.slice(root.length + 1).split(sep).join("/");
      src.split("\n").forEach((line, i) => {
        if (line.includes("var(--")) offenders.push(`${rel}:${i + 1}`);
      });
    }
    expect(offenders).toEqual([]);
    expect(files.length).toBeGreaterThan(20);
  });
});
