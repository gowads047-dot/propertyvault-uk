#!/usr/bin/env node
/**
 * The legal review worklist, with context.
 *
 * src/lib/legal-register.ts records which files mention law the Renters'
 * Rights Act changed, and a test keeps it honest. That list is the right shape
 * for a machine and the wrong shape for a person: nobody can review "Section
 * 21 ×14" without opening the file.
 *
 * This prints each occurrence with the sentence around it, grouped by file,
 * with the register's status against each. That is the form worth handing to a
 * solicitor — every claim the site makes about the changed law, in one place,
 * readable without a checkout.
 *
 * It classifies nothing. A page saying "Section 21 was abolished" and one
 * saying "serve a Section 21 notice" look identical to a pattern match, and
 * telling them apart is the judgement being asked for.
 *
 * Reads the register by parsing it rather than importing it, matching
 * check-env.mjs and check-db.mjs, so this runs with plain node.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const APP = join(root, "src", "app");

const TERMS = [
  { id: "section-21", re: /\bsection\s*21\b/gi, why: "No-fault possession under Section 21 was removed for new tenancies." },
  { id: "ast", re: /\bassured shorthold tenanc\w*/gi, why: "Assured shorthold tenancies cannot be granted for new lets." },
  { id: "fixed-term", re: /\bfixed[- ]term tenanc\w*/gi, why: "New tenancies are periodic; a fixed term cannot be imposed." },
  { id: "no-fault", re: /\bno[- ]fault eviction\w*/gi, why: "The route this describes no longer exists." },
];

// ── The register's statuses, so the output says what has been looked at ────

const registerSrc = readFileSync(join(root, "src", "lib", "legal-register.ts"), "utf8");
const status = new Map();
for (const m of registerSrc.matchAll(
  /\{\s*file:\s*"([^"]+)",\s*term:\s*"([^"]+)",\s*count:\s*\d+,\s*status:\s*"([^"]+)"/g,
)) {
  status.set(`${m[1]}#${m[2]}`, m[3]);
}

if (status.size === 0) {
  console.error("Could not read the register. Has src/lib/legal-register.ts changed shape?");
  process.exit(2);
}

// ── Pull each occurrence with the text around it ───────────────────────────

/** JSX and prose, minus the tags, so the context reads as a sentence. */
function textAround(src, index) {
  const from = Math.max(0, src.lastIndexOf(".", index - 1) + 1);
  const dot = src.indexOf(".", index);
  const to = dot === -1 ? Math.min(src.length, index + 160) : Math.min(dot + 1, index + 240);
  return src
    .slice(from, to)
    .replace(/<[^>]*>/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

const byFile = new Map();
const files = readdirSync(APP, { recursive: true, encoding: "utf8" })
  .filter(p => p.endsWith(".tsx") && !p.includes(".test."))
  .sort();

for (const p of files) {
  const rel = `src/app/${p.split("\\").join("/")}`;
  const src = readFileSync(join(APP, p), "utf8");
  for (const term of TERMS) {
    for (const m of src.matchAll(term.re)) {
      if (!byFile.has(rel)) byFile.set(rel, []);
      byFile.get(rel).push({ term: term.id, quote: textAround(src, m.index) });
    }
  }
}

// ── Output ─────────────────────────────────────────────────────────────────

const totalFiles = byFile.size;
const totalHits = [...byFile.values()].reduce((n, v) => n + v.length, 0);
const reviewed = [...status.values()].filter(s => s !== "not-reviewed").length;

console.log(`\nClaims about law the Renters' Rights Act changed`);
console.log(`${totalHits} occurrences across ${totalFiles} files · ${reviewed} of ${status.size} entries reviewed\n`);
console.log(`Nothing below has been classified. A page explaining that Section 21`);
console.log(`was abolished and one telling you to serve a Section 21 notice look the`);
console.log(`same to a pattern match, and telling them apart is the point of this.\n`);

for (const [file, hits] of [...byFile.entries()].sort((a, b) => b[1].length - a[1].length)) {
  const states = [...new Set(hits.map(h => status.get(`${file}#${h.term}`) ?? "unregistered"))];
  console.log(`\n${file}  [${states.join(", ")}]`);
  for (const h of hits) {
    const quote = h.quote.length > 150 ? `${h.quote.slice(0, 150)}…` : h.quote;
    console.log(`  ${h.term.padEnd(11)} ${quote}`);
  }
}

console.log(`\n\nWhat each term means now:`);
for (const t of TERMS) console.log(`  ${t.id.padEnd(11)} ${t.why}`);
console.log(`\nSet a status per entry in src/lib/legal-register.ts, with a note saying`);
console.log(`who decided and why. The test refuses a reviewed entry without one.\n`);
