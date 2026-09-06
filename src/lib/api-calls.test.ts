import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";
import config from "../../next.config";

/**
 * Every call to our own API ends with a slash before the query string.
 *
 * next.config sets trailingSlash: true, so /api/thing is answered with a 308
 * to /api/thing/ and the request is made twice. Twenty-nine call sites were
 * doing that — every form on the site, the admin pages, the tenant portal and
 * the deal analyser — each one paying a round trip on every submission.
 *
 * Two files already carried a comment warning about exactly this, written
 * after it was noticed on one route and fixed there. That is the shape of most
 * of the defects found in this codebase: a correct fix applied where it was
 * discovered and nowhere else. This is the version that holds.
 *
 * A 308 does preserve the method and the body, so nothing was broken. It was
 * slow in a way nobody would ever see in a stack trace.
 */

const SRC = join(process.cwd(), "src");

/**
 * Every .ts/.tsx under src, excluding tests.
 *
 * readdirSync with `recursive` rather than a hand-rolled walk. The obvious
 * version — recurse where entry.isDirectory() — silently returns nothing on
 * this machine, because Dirent.isDirectory() reports false for every directory
 * under src here. A walk that finds no files makes every assertion below pass
 * by finding nothing to check, which is the worst way for a guard to fail.
 * Hence the count assertion in the first test.
 */
const files = readdirSync(SRC, { recursive: true, encoding: "utf8" })
  .filter(p => /\.tsx?$/.test(p) && !p.includes(".test."))
  .map(p => join(SRC, p));
const rel = (p: string) => p.slice(process.cwd().length + 1).split(sep).join("/");

/**
 * A fetch to our own API whose path stops at a character other than a slash.
 * Matches both quoting styles, and both the bare path and the one that runs
 * straight into a query string.
 */
const SLASHLESS = /(?:auth)?[Ff]etch\(\s*[`"](\/api\/[A-Za-z0-9/_-]*[A-Za-z0-9_-])[`"?]/g;

describe("calls to our own API", () => {
  it("finds source files, so the check below is not vacuous", () => {
    expect(files.length).toBeGreaterThan(100);
  });

  it("only matters while trailingSlash is on", () => {
    // If this is ever turned off the rule inverts, and this test should go
    // with it rather than being quietly relaxed.
    expect(config.trailingSlash).toBe(true);
  });

  it("finds at least one correctly-slashed call, so the pattern is right", () => {
    // Guards against a regex that matches nothing and therefore never fails.
    const anyApiCall = files.some(f =>
      /(?:auth)?[Ff]etch\(\s*[`"]\/api\//.test(readFileSync(f, "utf8")),
    );
    expect(anyApiCall).toBe(true);
  });

  it("ends every path with a slash, so none of them takes a 308 first", () => {
    const offenders: string[] = [];
    for (const file of files) {
      for (const m of readFileSync(file, "utf8").matchAll(SLASHLESS)) {
        offenders.push(`${rel(file)} → ${m[1]}`);
      }
    }
    expect(offenders, `these take a redirect hop:\n${offenders.join("\n")}`).toEqual([]);
  });
});
