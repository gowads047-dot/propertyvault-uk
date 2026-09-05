#!/usr/bin/env node
/**
 * Which schema files have actually been applied.
 *
 * There are eighteen .sql files in supabase/ and nothing records which have
 * been run. Each one says "RUN THIS IN PRODUCTION" in a comment and then
 * relies on somebody remembering. That held until a migration was reported as
 * run, the database had never seen it, and the only way to find out was a
 * hand-written probe.
 *
 * Reads the manifest by parsing it rather than importing it, matching
 * check-env.mjs, so this runs with plain node and needs no build step.
 *
 * Prints names and status only, never a key.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

// ── The manifest ───────────────────────────────────────────────────────────

const src = readFileSync(join(root, "src", "lib", "db-manifest.ts"), "utf8");
const body = src.slice(src.indexOf("MIGRATIONS: Migration[]"));

const migrations = [];
for (const m of body.matchAll(/^\s{2}\{\s*$([\s\S]*?)^\s{2}\},$/gm)) {
  const f = m[1];
  const file = f.match(/file:\s*"([^"]+)"/)?.[1];
  if (!file) continue;

  const kind = f.match(/kind:\s*"(table|column|unverifiable)"/)?.[1];
  migrations.push({
    file,
    kind,
    table: f.match(/table:\s*"([^"]+)"/)?.[1],
    column: f.match(/column:\s*"([^"]+)"/)?.[1],
    because: f.match(/because:\s*\n?\s*"([^"]+)"/)?.[1],
  });
}

if (migrations.length === 0) {
  console.error("Could not read the manifest. Has src/lib/db-manifest.ts changed shape?");
  process.exit(2);
}

// ── Every .sql file must be in the manifest, and vice versa ────────────────
//
// A migration nobody listed is a migration this script silently ignores, which
// is the same blind spot it exists to remove.

const onDisk = readdirSync(join(root, "supabase")).filter(f => f.endsWith(".sql")).sort();
const listed = new Set(migrations.map(m => m.file));
const unlisted = onDisk.filter(f => !listed.has(f));
const missing = [...listed].filter(f => !onDisk.includes(f));

if (unlisted.length || missing.length) {
  for (const f of unlisted) console.error(`  supabase/${f} exists but is not in the manifest`);
  for (const f of missing) console.error(`  the manifest lists ${f}, which is not in supabase/`);
  console.error("\nAdd it to src/lib/db-manifest.ts, with a marker that proves it ran.");
  process.exit(2);
}

// ── Credentials ────────────────────────────────────────────────────────────

function fromEnvFile(name) {
  const path = join(root, ".env.local");
  if (!existsSync(path)) return undefined;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = new RegExp(`^\\s*${name}\\s*=\\s*(.+)$`).exec(line);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return undefined;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? fromEnvFile("NEXT_PUBLIC_SUPABASE_URL");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? fromEnvFile("SUPABASE_SERVICE_ROLE_KEY");

if (!url || !key) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, in the environment or .env.local.");
  process.exit(2);
}

// The project ref, so the output says which database was checked. Running a
// migration against the wrong project and reading the right one is the exact
// confusion this is meant to end.
const project = url.replace(/^https:\/\//, "").split(".")[0];

// ── Probing ────────────────────────────────────────────────────────────────

async function probe(m) {
  if (m.kind === "unverifiable") return { status: "unknown", detail: m.because };

  const path = m.kind === "table"
    ? `${m.table}?limit=0`
    : `${m.table}?select=${m.column}&limit=0`;

  let res, text;
  try {
    res = await fetch(`${url}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    text = await res.text();
  } catch (err) {
    return { status: "error", detail: `could not reach the database (${err.message})` };
  }

  if (res.status === 200) return { status: "applied" };

  // 42P01 relation does not exist, 42703 column does not exist.
  if (text.includes("42P01") || text.includes("42703")) {
    return {
      status: "missing",
      detail: m.kind === "table" ? `no table ${m.table}` : `no ${m.table}.${m.column}`,
    };
  }

  // Anything else is a problem with the check, not an answer about the
  // migration. Reporting it as "not applied" could get one run twice.
  return { status: "error", detail: `HTTP ${res.status}` };
}

const results = await Promise.all(migrations.map(async m => ({ m, r: await probe(m) })));

// ── Output ─────────────────────────────────────────────────────────────────

const MARK = { applied: "ok  ", missing: "MISS", unknown: "?   ", error: "ERR " };
const width = Math.max(...migrations.map(m => m.file.length));

console.log(`\nSchema files against project ${project}\n`);
for (const { m, r } of results) {
  const detail = r.detail ? `  ${r.detail}` : "";
  console.log(`  ${MARK[r.status]}  ${m.file.padEnd(width)}${detail}`);
}

const count = s => results.filter(x => x.r.status === s).length;
const notRun = results.filter(x => x.r.status === "missing");
const errors = results.filter(x => x.r.status === "error");

console.log(
  `\n  ${count("applied")} applied · ${count("missing")} not run · ` +
  `${count("unknown")} cannot be checked · ${count("error")} errored\n`,
);

if (notRun.length) {
  console.log("Not run:");
  for (const { m } of notRun) console.log(`  supabase/${m.file}`);
  console.log("\nRun each in the Supabase SQL editor, then re-run this.\n");
}

if (errors.length) {
  console.log("Could not be checked — these say nothing either way:");
  for (const { m, r } of errors) console.log(`  supabase/${m.file}  ${r.detail}`);
  console.log("");
}

// A missing migration is a finding, not a failure of the check. Non-zero only
// when the check itself could not do its job, so this can sit in CI without
// turning red every time a new .sql file is committed ahead of being run.
//
// exitCode rather than process.exit(): the latter tears the process down while
// undici still holds its connection handles, and libuv aborts with an
// assertion failure on Windows. Setting the code and letting node finish
// normally gives the same result without the crash on the way out.
process.exitCode = errors.length ? 1 : 0;
