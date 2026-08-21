#!/usr/bin/env node
/**
 * One-off: send the starter pack to subscribers who never received it.
 *
 * Between 25 June 2026 and 21 August 2026 the Resend sending domain
 * (propertyvaultuk.co.uk) was never verified, so every send was rejected.
 * The subscribe route saves to Supabase *before* sending and returns success
 * regardless, so the people are all there — they just got nothing.
 *
 * This is not a marketing send. It goes only to people who explicitly asked
 * for the pack, and it says plainly that it is late.
 *
 *   npm run backfill:starter-pack --                 # dry run (default)
 *   npm run backfill:starter-pack -- --send          # actually send
 *   npm run backfill:starter-pack -- --send --limit 5
 *   npm run backfill:starter-pack -- --only me@example.com
 *
 * Safeguards, because this touches real inboxes and cannot be undone:
 *   - Dry run unless --send is passed.
 *   - A ledger at scripts/.backfill-sent.json records every address sent to.
 *     Re-running skips them, so a crash mid-way is safe to resume and nobody
 *     is emailed twice.
 *   - Only subscribers created before --before (default: now) are considered,
 *     so anyone who signs up after the fix is left to the normal flow.
 *   - Paced at 2 sends/second to stay inside Resend's rate limit.
 *   - Stops on repeated failures rather than hammering the API.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { render } from "@react-email/render";
import React from "react";

const HERE = dirname(fileURLToPath(import.meta.url));
const LEDGER = join(HERE, ".backfill-sent.json");

// ── args ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const has = f => argv.includes(f);
const val = (f, d) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

const SEND = has("--send");
const LIMIT = Number(val("--limit", "0")) || 0;
const ONLY = val("--only", null);
const BEFORE = val("--before", new Date().toISOString());
const PER_SECOND = 2;

// ── env ─────────────────────────────────────────────────────────────────────
// Service role, not the anon key: the subscribers table has row-level
// security, so the public key can insert but reads come back empty.
const need = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "RESEND_API_KEY"];
const missing = need.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`Missing env: ${missing.join(", ")}`);
  console.error("Run with the values from .env.local loaded, e.g.:");
  console.error("  npm run backfill:starter-pack");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);
const resend = new Resend(process.env.RESEND_API_KEY);

// ── ledger ──────────────────────────────────────────────────────────────────
function loadLedger() {
  if (!existsSync(LEDGER)) return { sent: [] };
  try {
    return JSON.parse(readFileSync(LEDGER, "utf8"));
  } catch {
    console.error(`Ledger at ${LEDGER} is unreadable. Refusing to run rather than risk double-sending.`);
    process.exit(1);
  }
}
function saveLedger(l) {
  mkdirSync(dirname(LEDGER), { recursive: true });
  writeFileSync(LEDGER, JSON.stringify(l, null, 2), "utf8");
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── main ────────────────────────────────────────────────────────────────────
const { default: StarterPackEmail } = await import("../src/emails/StarterPackEmail.tsx");
const { REPLY_TO } = await import("../src/lib/site.ts");

const ledger = loadLedger();
const already = new Set(ledger.sent.map(s => s.email));

let query = supabase
  .from("subscribers")
  .select("name, email, user_type, created_at")
  .lt("created_at", BEFORE)
  .order("created_at", { ascending: true });

if (ONLY) query = query.eq("email", ONLY.toLowerCase());

const { data, error } = await query;
if (error) {
  console.error("Supabase query failed:", error.message);
  process.exit(1);
}

// De-duplicate by address; the table allows the same person to sign up twice.
const seen = new Set();
const all = (data ?? []).filter(r => {
  const e = (r.email || "").trim().toLowerCase();
  if (!e || seen.has(e)) return false;
  seen.add(e);
  return true;
});

const pending = all.filter(r => !already.has(r.email.trim().toLowerCase()));
const queue = LIMIT ? pending.slice(0, LIMIT) : pending;

console.log(`subscribers before ${BEFORE}: ${all.length}`);
console.log(`already sent (ledger):        ${all.length - pending.length}`);
console.log(`queued this run:              ${queue.length}`);
console.log(`mode:                         ${SEND ? "SEND — real email" : "DRY RUN"}`);
console.log("");

if (!queue.length) {
  console.log("Nothing to do.");
  process.exit(0);
}

if (!SEND) {
  for (const r of queue.slice(0, 20)) {
    console.log(`  would send -> ${r.email}  (${r.name || "no name"}, joined ${String(r.created_at).slice(0, 10)})`);
  }
  if (queue.length > 20) console.log(`  ... and ${queue.length - 20} more`);
  console.log("");
  // Prove the template renders before anyone commits to sending.
  const sample = queue[0];
  const html = await render(
    React.createElement(StarterPackEmail, {
      name: sample.name || "there",
      userType: sample.user_type ?? null,
      delayed: true,
    }),
  );
  const ok = html.includes("Apologies") && !/undefined|NaN/.test(html);
  console.log(`template renders: ${html.length} chars, apology present: ${html.includes("Apologies")}, clean: ${ok}`);
  console.log("\nRe-run with --send to actually send.");
  process.exit(0);
}

let sent = 0;
let consecutiveFailures = 0;

for (const r of queue) {
  const email = r.email.trim().toLowerCase();
  const name = (r.name || "there").trim();

  const { error: sendError } = await resend.emails.send({
    from: "Nass at PropertyVault <nass@propertyvaultuk.co.uk>",
    replyTo: REPLY_TO,
    to: email,
    subject: "Your Free Property Starter Pack 🏠 (sorry for the delay)",
    react: StarterPackEmail({ name, userType: r.user_type ?? null, delayed: true }),
  });

  if (sendError) {
    consecutiveFailures++;
    console.error(`  FAILED ${email}: ${sendError.message ?? sendError}`);
    if (consecutiveFailures >= 3) {
      console.error("\nThree failures in a row — stopping. Fix the cause and re-run; the ledger means nobody gets a duplicate.");
      break;
    }
  } else {
    consecutiveFailures = 0;
    sent++;
    ledger.sent.push({ email, at: new Date().toISOString() });
    saveLedger(ledger); // written per send, so a crash cannot lose the record
    console.log(`  sent ${sent}/${queue.length} -> ${email}`);
  }

  await sleep(1000 / PER_SECOND);
}

console.log(`\nDone. Sent ${sent} of ${queue.length}. Ledger: ${LEDGER}`);
