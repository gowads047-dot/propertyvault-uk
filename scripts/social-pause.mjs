/**
 * Stop or resume the evening publish.
 *
 *   npm run social:pause -- on      nothing is posted until turned off
 *   npm run social:pause -- off     resume
 *   npm run social:pause            show the current state
 *
 * Writes social_settings.paused. The publisher reads it before it reads the
 * queue, so "on" takes effect at the next run with no deploy. Days that pass
 * while paused are marked skipped when it resumes — they are not posted late.
 */
import { createClient } from "@supabase/supabase-js";

const arg = process.argv[2];
if (arg !== undefined && arg !== "on" && arg !== "off") {
  console.error("Usage: npm run social:pause -- on|off");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^\uFEFF/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/^\uFEFF/, "");
if (!url || !key) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (npm run loads .env.local).");
  process.exit(2);
}
const project = url.replace(/^https:\/\//, "").split(".")[0];
const db = createClient(url, key, { auth: { persistSession: false } });

if (arg) {
  const { error } = await db
    .from("social_settings")
    .upsert({ key: "paused", value: arg === "on", updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) {
    console.error(`Could not write social_settings on ${project}: ${error.message}`);
    process.exit(2);
  }
  await db.from("social_events").insert({
    level: "warn", event: arg === "on" ? "paused_by_operator" : "resumed_by_operator", detail: { via: "scripts/social-pause.mjs" },
  });
}

const { data, error } = await db.from("social_settings").select("value, updated_at").eq("key", "paused").maybeSingle();
if (error) {
  console.error(`Could not read social_settings on ${project}: ${error.message}`);
  process.exit(2);
}
const paused = data?.value === true;
console.log(`\n${project}: publishing is ${paused ? "PAUSED" : "running"}${data?.updated_at ? ` (since ${data.updated_at})` : ""}\n`);
process.exitCode = 0;
