import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";

/**
 * Every browser caller of a Turnstile-protected route sends the token.
 *
 * The contact and subscribe routes verify a Turnstile token and fail
 * closed once TURNSTILE_SECRET_KEY is set. The Academy waitlist and the
 * Rentura deletion request posted to them without one: fine today, refused
 * the day the keys go live — and the pages would have shown success
 * anyway. This walks the client code for those two paths and holds each
 * file to the widget helper.
 */
const PROTECTED = ['"/api/contact/"', '"/api/subscribe/"'];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(name) && !name.includes(".test.")) out.push(p);
  }
  return out;
}

describe("Turnstile coverage", () => {
  it("every page or component posting to a protected route reads the widget's token", () => {
    const root = process.cwd();
    const callers: string[] = [];
    const missing: string[] = [];
    for (const file of walk(join(root, "src"))) {
      const rel = file.slice(root.length + 1).split(sep).join("/");
      if (rel.startsWith("src/app/api/")) continue;
      const src = readFileSync(file, "utf8");
      if (!PROTECTED.some((p) => src.includes(p))) continue;
      callers.push(rel);
      // Either the JSON helper, or the widget inside a form that is posted
      // as FormData (the hidden input travels with it).
      const covered = src.includes("turnstileToken(") || (src.includes("<Turnstile") && src.includes("new FormData("));
      if (!covered) missing.push(rel);
    }
    expect(missing).toEqual([]);
    expect(callers.length).toBeGreaterThanOrEqual(6);
  });
});
