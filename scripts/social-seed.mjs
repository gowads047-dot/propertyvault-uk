/**
 * Put the 30-day calendar into the publishing queue.
 *
 *   npm run social:seed                              from tomorrow (London)
 *   npm run social:seed -- 2026-09-15                from a chosen day
 *   npm run social:seed -- --evergreen 1,5,12        add pool copies of those days
 *   npm run social:seed -- --dry-run                 show what would be inserted
 *
 * Idempotent: a video already in the queue (same digest, same kind of row) is
 * skipped, so re-running after a partial seed, or after days have gone out,
 * changes nothing that is already there. A date that is already taken is
 * reported and skipped rather than shifting anything.
 *
 * Runs with tsx so it can import the calendar the site uses. Needs
 * NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, which `npm run`
 * loads from .env.local. Prints names and counts, never a key.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { calendarRows, evergreenRows, parseDays } from "../src/lib/social/seed";
import { addDays, isYmd, londonDate } from "../src/lib/social/dates";

const root = process.cwd();
if (!existsSync(join(root, "package.json"))) {
  console.error("Run this from the repository root.");
  process.exit(1);
}

// ── Arguments ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const evergreenArg = args.includes("--evergreen") ? args[args.indexOf("--evergreen") + 1] : null;
const startArg = args.find(a => !a.startsWith("--") && a !== evergreenArg);

const startDate = startArg ?? addDays(londonDate(new Date()), 1);
if (!isYmd(startDate)) {
  console.error(`Start date must be YYYY-MM-DD, got "${startDate}".`);
  process.exit(1);
}
if (args.includes("--evergreen") && !evergreenArg) {
  console.error("--evergreen needs a comma-separated list of day numbers, e.g. --evergreen 1,5,12");
  process.exit(1);
}

// ── Credentials ────────────────────────────────────────────────────────────

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^\uFEFF/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/^\uFEFF/, "");
if (!url || !key) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (npm run loads .env.local).");
  process.exit(2);
}
const project = url.replace(/^https:\/\//, "").split(".")[0];

// ── The rows ───────────────────────────────────────────────────────────────

const reelsDir = join(root, "public", "reels");
const digests = new Map();
function sha256Of(file) {
  if (!digests.has(file)) {
    const p = join(reelsDir, file);
    if (!existsSync(p)) throw new Error(`public/reels/${file} is not on disk — render it first (npm run reels)`);
    digests.set(file, createHash("sha256").update(readFileSync(p)).digest("hex"));
  }
  return digests.get(file);
}

let rows;
try {
  rows = [
    ...calendarRows({ startDate, sha256Of }),
    ...(evergreenArg ? evergreenRows({ days: parseDays(evergreenArg), sha256Of }) : []),
  ];
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
}

// ── What is already there ──────────────────────────────────────────────────

const db = createClient(url, key, { auth: { persistSession: false } });

const existing = await db
  .from("social_posts")
  .select("asset_sha256, evergreen, slot_date, status")
  .eq("channel", "instagram");
if (existing.error) {
  console.error(`Could not read social_posts on ${project}: ${existing.error.message}`);
  console.error("Has supabase/social-ops.sql been run? `npm run check:db` will say.");
  process.exit(2);
}

const have = new Set(existing.data.filter(r => r.asset_sha256).map(r => `${r.evergreen ? "pool" : "cal"}:${r.asset_sha256}`));
const takenDates = new Set(
  existing.data
    .filter(r => r.slot_date && ["queued", "publishing", "published", "failed"].includes(r.status))
    .map(r => r.slot_date),
);

// ── Insert ─────────────────────────────────────────────────────────────────

console.log(`\nSeeding social_posts on ${project}${dryRun ? " (dry run)" : ""}`);
console.log(`Calendar from ${startDate}; ${rows.length} candidate rows\n`);

let inserted = 0, skipped = 0, failed = 0;
for (const row of rows) {
  const kind = row.evergreen ? "pool" : row.slot_date;
  const label = `${String(kind).padEnd(10)} ${row.format.padEnd(11)} ${row.source_refs.calendarId}`;

  if (have.has(`${row.evergreen ? "pool" : "cal"}:${row.asset_sha256}`)) {
    console.log(`  skip    ${label}  (already queued)`);
    skipped++;
    continue;
  }
  if (row.slot_date && takenDates.has(row.slot_date)) {
    console.log(`  skip    ${label}  (date already has a live post)`);
    skipped++;
    continue;
  }
  if (dryRun) {
    console.log(`  would   ${label}`);
    inserted++;
    continue;
  }

  const { error } = await db.from("social_posts").insert(row);
  if (error) {
    console.log(`  FAIL    ${label}  ${error.message}`);
    failed++;
  } else {
    console.log(`  insert  ${label}`);
    inserted++;
  }
}

console.log(`\n  ${inserted} ${dryRun ? "would be inserted" : "inserted"} · ${skipped} skipped · ${failed} failed\n`);
if (!dryRun && inserted > 0) {
  console.log("Check it: curl -H \"Authorization: Bearer $CRON_SECRET\" https://www.propertyvaultuk.co.uk/api/social/status\n");
}

// exitCode rather than process.exit(): see scripts/check-db.mjs.
process.exitCode = failed ? 1 : 0;
