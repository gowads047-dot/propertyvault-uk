#!/usr/bin/env node
/**
 * Lighthouse accessibility across the site, one page at a time, printing
 * only what failed and why.
 *
 *   npm run a11y                                  # every URL in the sitemap, production
 *   npm run a11y -- --base http://localhost:3001  # a `next start` build
 *   npm run a11y -- /guaranteed-rent/ /templates/ # just these paths
 *   (also fine from Git Bash, which rewrites leading-slash arguments)
 *
 * Runs with the machine's own colour scheme, so on a machine set to dark it
 * audits dark mode — which is the mode the site's own Tailwind overrides
 * get wrong most often. Run it once on each setting to cover both.
 *
 * What it catches is what axe catches on the page as loaded: contrast,
 * unnamed buttons, tables without headers, duplicate ids. It does not click
 * tabs or open panels, and it samples elements rather than reading every
 * text node. For the full scan — every text node, every sitemap page, in
 * whichever colour scheme the browser is in — paste
 * scripts/contrast-scan.browser.js into the DevTools console and run
 * `await pvScanAll()`. That is what found the light-mode failures this
 * script, run on a dark machine, could not (#151).
 *
 * Nothing is installed into the project: `npx lighthouse@12` fetches it
 * into npm's cache the first time. Exit status is 1 if any page scored
 * under 100, so it can gate a release.
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
// Git Bash on Windows rewrites a leading-slash argument into a Windows path
// ("/blog/" becomes "C:/Program Files/Git/blog/"), so take the tail back.
const explicit = args
  .filter((a, i) => args[i - 1] !== "--base")
  .map((a) => a.replace(/^[A-Za-z]:\/.*?\/Git(?=\/)/, ""))
  .filter((a) => a.startsWith("/"));

async function sitemapPaths() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(/^https?:\/\/[^/]+/, ""))
    .filter((p) => p.startsWith("/"));
}

const pages = explicit.length ? explicit : await sitemapPaths();
const dir = mkdtempSync(join(tmpdir(), "pv-a11y-"));
let failed = 0;

console.log(`Lighthouse accessibility, mobile, ${pages.length} page${pages.length === 1 ? "" : "s"}, ${BASE}\n`);

for (const page of pages) {
  const out = join(dir, `${page.replace(/[^a-z0-9]+/gi, "_")}.json`);
  const cmd = [
    "npx --yes lighthouse@12", JSON.stringify(`${BASE}${page}`),
    "--only-categories=accessibility --form-factor=mobile --screenEmulation.mobile",
    "--output=json", `--output-path=${JSON.stringify(out)}`, "--quiet",
    '"--chrome-flags=--headless=new --no-sandbox"',
  ].join(" ");
  try {
    execSync(cmd, { stdio: "ignore" });
  } catch {
    // Windows: chrome-launcher fails to remove its temp profile and
    // Lighthouse exits non-zero with the report already written.
  }
  if (!existsSync(out)) {
    console.log(page.padEnd(56), "ERR  no report");
    failed++;
    continue;
  }
  const j = JSON.parse(readFileSync(out, "utf8"));
  const score = Math.round(j.categories.accessibility.score * 100);
  console.log(page.padEnd(56), String(score).padStart(3));
  if (score < 100) failed++;
  for (const [id, audit] of Object.entries(j.audits)) {
    if (audit.score !== 0) continue;
    const items = audit.details?.items ?? [];
    console.log(`    ${id} (${items.length})`);
    const seen = new Set();
    for (const it of items) {
      const key = it.node?.snippet?.slice(0, 60);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const why = (it.node.explanation ?? "").replace(/^Fix any of the following:\s*/, "").split("\n")[0].slice(0, 120);
      console.log(`      ${it.node.snippet.replace(/\s+/g, " ").slice(0, 90)}`);
      if (why) console.log(`        ${why}`);
      if (seen.size >= 6) { if (items.length > 6) console.log(`      … ${items.length - 6} more`); break; }
    }
  }
}

console.log(`\n${pages.length - failed}/${pages.length} at 100`);
process.exit(failed ? 1 : 0);
