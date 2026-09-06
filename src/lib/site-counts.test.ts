import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { siteMetrics } from "./site";

/**
 * The site quotes its own counts in one voice.
 *
 * site.test.ts already checks siteMetrics against the filesystem, so the
 * numbers in site.ts are right. The problem was that most of the copy did not
 * read them. The homepage advertised "22 Free Calculators" and "All 22
 * Calculators" while /calculators, the root layout, the JSON-LD and fourteen
 * area guides all said 23 — and 23 was correct.
 *
 * A literal that happens to be right today is the same bug as one that is
 * wrong. Both stop tracking the thing they describe the moment a calculator is
 * added, and the fourteen area pages would each have to be found again.
 *
 * So this forbids the literal rather than correcting it. Interpolate
 * siteMetrics and the count can only ever be wrong in one place, which
 * site.test.ts already guards.
 */

const SRC = join(process.cwd(), "src");

const files = readdirSync(SRC, { recursive: true, encoding: "utf8" })
  .filter(p => /\.tsx?$/.test(p) && !p.includes(".test."))
  .map(p => p.split("\\").join("/"))
  // site.ts is where the numbers are allowed to be literals.
  .filter(p => p !== "lib/site.ts");

/**
 * A count of something siteMetrics tracks, written as a number in the copy.
 *
 * Deliberately narrow: "23 calculators" and "19 templates", not every number
 * near a noun. A wider net catches "3 weeks", "£9.99/month" and every year in
 * a blog post, and a check that fires on prose gets switched off.
 */
const LITERAL =
  /(?<!Section\s)(?<!section\s)\b(\d{1,3})\s+(?:free\s+|legal\s+|property\s+|UK\s+)*(calculators?|templates?|area guides?|blog posts?)\b/gi;

type Hit = { where: string; text: string };

/**
 * Counts of collections siteMetrics does not track.
 *
 * The Academy's email swipe file genuinely holds eleven emails, which has
 * nothing to do with the nineteen legal templates on /templates. Listing it
 * here rather than loosening the pattern keeps the exception visible: an
 * entry has to be argued for, and a new one cannot appear by accident.
 */
const NOT_SITE_METRICS: { file: string; text: string; why: string }[] = [
  {
    file: "app/academy/dashboard/page.tsx",
    text: "11 templates",
    why: "the Academy email swipe file, not the /templates library",
  },
];

function literalCounts(): Hit[] {
  const hits: Hit[] = [];
  for (const rel of files) {
    const full = join(SRC, rel);
    if (!statSync(full).isFile()) continue;
    const src = readFileSync(full, "utf8");
    for (const m of src.matchAll(LITERAL)) {
      const allowed = NOT_SITE_METRICS.some(
        a => a.file === rel && a.text.toLowerCase() === m[0].toLowerCase(),
      );
      if (allowed) continue;
      hits.push({
        where: `src/${rel}:${src.slice(0, m.index).split("\n").length}`,
        text: m[0],
      });
    }
  }
  return hits;
}

describe("counts come from siteMetrics, never from a literal", () => {
  it("reads the whole tree", () => {
    expect(files.length).toBeGreaterThan(200);
  });

  it("still recognises the literal it was written for", () => {
    const samples = ["22 Free Calculators", "23 free property calculators", "19 legal templates"];
    for (const s of samples) {
      LITERAL.lastIndex = 0;
      expect(LITERAL.test(s), `detector missed: ${s}`).toBe(true);
    }
  });

  it("has counts that match the filesystem", () => {
    // Belt and braces alongside site.test.ts: if that ever stops running,
    // a wrong constant would otherwise propagate everywhere silently.
    // statSync rather than Dirent.isDirectory(), which reports false for
    // everything under src on this machine.
    const dirs = (p: string) =>
      readdirSync(join(SRC, "app", p), { encoding: "utf8" })
        .filter(name => statSync(join(SRC, "app", p, name)).isDirectory()).length;
    expect(siteMetrics.calculators).toBe(dirs("calculators"));
    expect(siteMetrics.templates).toBe(dirs("templates"));
  });

  it("finds no hardcoded counts in the copy", () => {
    const hits = literalCounts();
    const detail = hits.map(h => `  ${h.where}  "${h.text}"`).join("\n");
    expect(
      hits,
      "write these as ${siteMetrics.calculators} / ${siteMetrics.templates} so they " +
        "track the filesystem. A literal that is correct today silently goes stale " +
        `the next time one is added.\n\n${detail}`,
    ).toEqual([]);
  });
});
