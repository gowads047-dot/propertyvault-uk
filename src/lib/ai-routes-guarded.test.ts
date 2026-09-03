import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Every route that spends money must meter itself.
 *
 * The limiter was built and wired into /api/deal-ai-verdict, and five other
 * routes that call Anthropic on the same key were left open: two chats and
 * three document extractors, unauthenticated and unmetered. Nobody noticed
 * because nothing was checking — the omission was invisible.
 *
 * This walks the route tree rather than naming the routes, so a new one that
 * calls the API and forgets the guard fails here instead of appearing on a
 * bill.
 */

const API_DIR = join(process.cwd(), "src", "app", "api");

function routeFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...routeFiles(full));
    else if (entry === "route.ts") out.push(full);
  }
  return out;
}

/** Calls a paid model API. */
function callsAnthropic(src: string): boolean {
  return /@anthropic-ai\/sdk|new Anthropic\(|anthropic\.messages\.create/.test(src);
}

/** Has something in front of the call that bounds how often it happens. */
function isMetered(src: string): boolean {
  return /guardAI\(|consumeAll\(/.test(src);
}

describe("routes that spend money", () => {
  const files = routeFiles(API_DIR);

  it("finds the API routes at all, so a broken walk cannot pass silently", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it("meters every route that calls Anthropic", () => {
    const unmetered = files
      .filter(f => callsAnthropic(readFileSync(f, "utf8")))
      .filter(f => !isMetered(readFileSync(f, "utf8")))
      .map(f => f.slice(f.indexOf("api")).replace(/\\/g, "/"));

    expect(unmetered, `unmetered AI routes:\n${unmetered.join("\n")}`).toEqual([]);
  });

  it("actually detects an AI route, so the filter is not matching nothing", () => {
    const withAI = files.filter(f => callsAnthropic(readFileSync(f, "utf8")));
    expect(withAI.length).toBeGreaterThanOrEqual(5);
  });

  // The guard has to run before the body is read, or a large upload is paid
  // for in bandwidth and parsing before it is refused.
  it("puts the guard before the request body is parsed", () => {
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      if (!callsAnthropic(src) || !src.includes("guardAI(")) continue;
      const guard = src.indexOf("guardAI(");
      const parse = src.search(/await req\.(json|formData)\(\)/);
      if (parse >= 0) {
        expect(guard, f).toBeLessThan(parse);
      }
    }
  });
});
