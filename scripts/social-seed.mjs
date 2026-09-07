/**
 * Put the 30-day calendar into the publishing queue.
 *
 *   npm run social:seed                              from tomorrow (London)
 *   npm run social:seed -- 2026-09-15                from a chosen day
 *   npm run social:seed -- --evergreen 1,5,12        add pool copies of those days
 *   npm run social:seed -- --dry-run                 show what would be inserted
 *   npm run social:seed -- --refresh-digests         after a re-render: update the
 *                                                    digest on queued rows whose file changed
 *
 * Idempotent: a video already in the queue (same digest, same kind of row) is
 * skipped, so re-running after a partial seed, or after days have gone out,
 * changes nothing that is already there. A date that is already taken is
 * reported and skipped rather than shifting anything.
 *
 * Which is exactly why a re-render needs --refresh-digests rather than a
 * re-seed: `npm run reels` changes every file's digest, so a plain re-seed
 * sees thirty unknown videos and thirty taken dates and inserts nothing,
 * while the queued rows still carry the digests of files that no longer
 * exist. --refresh-digests rewrites asset_sha256 on queued rows (dated and
 * pool) to match the files now on disk, and touches nothing else.
 *
 * Runs with tsx so it can import the calendar the site uses. Needs
 * NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, which `npm run`
 * loads from .env.local. Prints names and counts, never a key.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { calendarRows, digestUpdates, evergreenRows, parseDays } from "../src/lib/social/seed";
import { addDays, isYmd, londonDate } from "../src/lib/social/dates";

const root = process.cwd();
if (!existsSync(join(root, "package.json"))) {
  console.error("Run this from the repository root.");
  process.exit(1);
}

// ── Arguments ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const refreshDigests = args.includes("--refresh-digests");
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

// ── Digests ────────────────────────────────────────────────────────────────

const reelsDir = join(root, "public", "reels");
const digests = new Map();
/** The file's digest, or null when it is not on disk. */
function sha256IfPresent(file) {
  if (!digests.has(file)) {
    const p = join(reelsDir, file);
    digests.set(file, existsSync(p) ? createHash("sha256").update(readFileSync(p)).digest("hex") : null);
  }
  return digests.get(file);
}
function sha256Of(file) {
  const d = sha256IfPresent(file);
  if (d === null) throw new Error(`public/reels/${file} is not on disk — render it first (npm run reels)`);
  return d;
}

const db = createClient(url, key, { auth: { persistSession: false } });

// ── --refresh-digests ──────────────────────────────────────────────────────

if (refreshDigests) {
  const queued = await db
    .from("social_posts")
    .select("id, asset_url, asset_sha256, status, slot_date, evergreen, format")
    .eq("channel", "instagram")
    .eq("status", "queued");
  if (queued.error) {
    console.error(`Could not read social_posts on ${project}: ${queued.error.message}`);
    process.exit(2);
  }

  const updates = digestUpdates(queued.data, sha256IfPresent);
  const missing = queued.data.filter(r => {
    const m = /\/reels\/([a-z0-9-]+\.mp4)$/i.exec(r.asset_url);
    return m && sha256IfPresent(m[1]) === null;
  });

  console.log(`\nRefreshing digests on ${project}${dryRun ? " (dry run)" : ""}`);
  console.log(`${queued.data.length} queued rows; ${updates.length} point at a file whose digest changed\n`);
  for (const r of missing) {
    console.log(`  MISSING ${String(r.evergreen ? "pool" : r.slot_date).padEnd(10)} ${r.asset_url.split("/").pop()}  (not on disk; left alone)`);
  }

  let updated = 0, failed = 0;
  for (const u of updates) {
    const row = queued.data.find(r => r.id === u.id);
    const label = `${String(row.evergreen ? "pool" : row.slot_date).padEnd(10)} ${u.file}  ${(u.from ?? "none").slice(0, 12)}… → ${u.to.slice(0, 12)}…`;
    if (dryRun) { console.log(`  would   ${label}`); updated++; continue; }
    const { error } = await db.from("social_posts").update({ asset_sha256: u.to, updated_at: new Date().toISOString() }).eq("id", u.id);
    if (error) { console.log(`  FAIL    ${label}  ${error.message}`); failed++; }
    else { console.log(`  update  ${label}`); updated++; }
  }
  console.log(`\n  ${updated} ${dryRun ? "would be updated" : "updated"} · ${missing.length} missing on disk · ${failed} failed\n`);
  process.exitCode = failed ? 1 : 0;
} else {
  // ── The rows ─────────────────────────────────────────────────────────────

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

  // ── What is already there ────────────────────────────────────────────────

  const existing = await db
    .from("social_posts")
    .select("asset_sha256, evergreen, is_clone, slot_date, status")
    .eq("channel", "instagram");
  if (existing.error) {
    console.error(`Could not read social_posts on ${project}: ${existing.error.message}`);
    console.error("Has supabase/social-ops.sql been run? `npm run check:db` will say.");
    process.exit(2);
  }

  // Clones are not calendar rows: a pool asset that stood in for a day does
  // not make the calendar think it already holds that video.
  const have = new Set(
    existing.data
      .filter(r => r.asset_sha256 && !r.is_clone)
      .map(r => `${r.evergreen ? "pool" : "cal"}:${r.asset_sha256}`),
  );
  const takenDates = new Set(
    existing.data
      .filter(r => r.slot_date && ["queued", "publishing", "published", "failed"].includes(r.status))
      .map(r => r.slot_date),
  );

  // ── Insert ───────────────────────────────────────────────────────────────

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
}
