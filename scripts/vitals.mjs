#!/usr/bin/env node
/**
 * Lighthouse, mobile, on the pages that matter — with medians, because a
 * single run on a busy laptop is noise.
 *
 *   npm run vitals                          # production, 3 runs per page
 *   npm run vitals -- --runs 5              # more runs
 *   npm run vitals -- --base http://localhost:3001   # a `next start` build
 *
 * PageSpeed Insights would be simpler, but its anonymous quota is shared
 * and was exhausted for two days running when this site needed a number.
 * Lighthouse runs locally against a headless Chrome; the results are only
 * comparable run-to-run on the same machine while it is otherwise idle.
 * On 14 September 2026 identical builds scored anywhere from 41 to 82 in
 * consecutive runs on a machine that was also building — hence medians,
 * and hence the warning printed when runs disagree by more than 15.
 *
 * Nothing is installed into the project: `npx lighthouse@12` fetches it
 * into npm's cache the first time.
 */

import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = flag("--base", "https://www.propertyvaultuk.co.uk").replace(/\/+$/, "");
const RUNS = Number(flag("--runs", "3"));
const PAGES = ["/", "/guaranteed-rent/", "/calculators/stamp-duty/", "/blog/section-24-explained/"];

const dir = mkdtempSync(join(tmpdir(), "pv-vitals-"));
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};
const ms = (n) => `${(n / 1000).toFixed(1)}s`;

console.log(`Lighthouse mobile, ${RUNS} run${RUNS === 1 ? "" : "s"} per page, ${BASE}\n`);
console.log("page".padEnd(32), "perf", " LCP  ", " TBT   ", " CLS  ", " a11y", " seo", " bp", "  spread");

for (const page of PAGES) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const out = join(dir, `${page.replace(/[^a-z0-9]+/gi, "_")}-${i}.json`);
    try {
      // A command string, not an argv: on Windows npx is a .cmd and needs
      // a shell, and a shell splits the space in --chrome-flags unless the
      // value is quoted as one argument.
      const cmd = [
        "npx --yes lighthouse@12", JSON.stringify(`${BASE}${page}`),
        "--only-categories=performance,accessibility,seo,best-practices",
        "--preset=perf --form-factor=mobile --screenEmulation.mobile",
        "--output=json", `--output-path=${JSON.stringify(out)}`, "--quiet",
        '"--chrome-flags=--headless=new --no-sandbox"',
      ].join(" ");
      try {
        execSync(cmd, { stdio: "ignore" });
      } catch {
        // On Windows, chrome-launcher fails to remove its temp profile after
        // the run and Lighthouse exits non-zero — with the report already
        // written. The file is the result; the exit code is not.
      }
      if (!existsSync(out)) continue;
      const j = JSON.parse(readFileSync(out, "utf8"));
      const a = j.audits;
      runs.push({
        perf: Math.round(j.categories.performance.score * 100),
        a11y: Math.round(j.categories.accessibility.score * 100),
        seo: Math.round(j.categories.seo.score * 100),
        bp: Math.round(j.categories["best-practices"].score * 100),
        lcp: a["largest-contentful-paint"].numericValue,
        tbt: a["total-blocking-time"].numericValue,
        cls: a["cumulative-layout-shift"].numericValue,
      });
    } catch {
      // An unreadable report is left out of the median rather than counted as zero.
    }
  }
  if (!runs.length) {
    console.log(page.padEnd(32), "no successful runs");
    continue;
  }
  const perfs = runs.map((r) => r.perf);
  const spread = Math.max(...perfs) - Math.min(...perfs);
  console.log(
    page.padEnd(32),
    String(median(perfs)).padStart(4),
    ms(median(runs.map((r) => r.lcp))).padStart(6),
    `${Math.round(median(runs.map((r) => r.tbt)))}ms`.padStart(7),
    median(runs.map((r) => r.cls)).toFixed(3).padStart(6),
    String(median(runs.map((r) => r.a11y))).padStart(5),
    String(median(runs.map((r) => r.seo))).padStart(4),
    String(median(runs.map((r) => r.bp))).padStart(3),
    `  ${perfs.join("/")}${spread > 15 ? "  ← noisy; close other work and rerun" : ""}`,
  );
}
console.log(`\nRaw reports: ${dir}`);
