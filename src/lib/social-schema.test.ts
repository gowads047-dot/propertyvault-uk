import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The social operations schema, executed for real.
 *
 * Follows makan-schema.test.ts: boot Postgres in WASM, run the file exactly as
 * the Supabase SQL editor would, and assert on what the constraints actually
 * do. The two unique indexes are the ones worth proving — they are what stops
 * the same Reel being queued twice and two Reels being queued for one day,
 * and a partial index that is subtly wrong reports nothing until production.
 */

const SQL = join(process.cwd(), "supabase", "social-ops.sql");

let db: PGlite;
let ready = false;

function requireSetup() {
  if (!ready) {
    throw new Error(
      "PGlite setup did not complete — the failures below are a consequence, not the cause. " +
      "Look at the beforeAll hook.",
    );
  }
}

beforeAll(async () => {
  db = new PGlite();
  // The roles the revokes name. Supabase has them; a bare Postgres does not.
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
  `);
  await db.exec(readFileSync(SQL, "utf8"));
  ready = true;
});

const insertPost = (cols: Record<string, unknown>) => {
  const keys = Object.keys(cols);
  return db.query(
    `insert into social_posts (${keys.join(",")}) values (${keys.map((_, i) => `$${i + 1}`).join(",")}) returning id`,
    keys.map(k => cols[k]),
  );
};

describe("running the file", () => {
  it("is idempotent — running it twice changes nothing", async () => {
    requireSetup();
    await db.exec(readFileSync(SQL, "utf8"));
    const settings = await db.query<{ n: number }>("select count(*)::int as n from social_settings");
    expect(settings.rows[0].n).toBe(4);
    const facts = await db.query<{ n: number }>("select count(*)::int as n from social_facts");
    expect(facts.rows[0].n).toBe(3);
    const assets = await db.query<{ n: number }>("select count(*)::int as n from social_assets");
    expect(assets.rows[0].n).toBe(2);
  });

  it("seeds the operator state closed: not paused, nothing approved to spend, no token", async () => {
    requireSetup();
    const r = await db.query<{ key: string; value: unknown }>("select key, value from social_settings order by key");
    expect(Object.fromEntries(r.rows.map(x => [x.key, x.value]))).toEqual({
      alert_email: "info@propertyvaultuk.co.uk",
      ig_access_token: null,
      monthly_cap_gbp: 0,
      paused: false,
    });
  });

  it("does not overwrite a setting a person has changed", async () => {
    requireSetup();
    await db.exec(`update social_settings set value = 'true'::jsonb where key = 'paused'`);
    await db.exec(readFileSync(SQL, "utf8"));
    const r = await db.query<{ value: boolean }>("select value from social_settings where key = 'paused'");
    expect(r.rows[0].value).toBe(true);
    await db.exec(`update social_settings set value = 'false'::jsonb where key = 'paused'`);
  });

  it("records the licence for both music beds by track id", async () => {
    requireSetup();
    const r = await db.query<{ name: string; licence_ref: string; licence: string }>(
      "select name, licence_ref, licence from social_assets order by name",
    );
    expect(r.rows.map(x => [x.name, x.licence_ref])).toEqual([
      ["bed-a-calm-pulse.mp3", "1788735910661-0"],
      ["bed-b-tense-tick.mp3", "1788735925943-0"],
    ]);
    for (const row of r.rows) expect(row.licence).toContain("ElevenLabs");
  });

  it("seeds only facts that are already in the code, all approved", async () => {
    requireSetup();
    const r = await db.query<{ fact: string; status: string }>("select fact, status from social_facts");
    expect(r.rows.every(x => x.status === "approved")).toBe(true);
    const text = r.rows.map(x => x.fact).join(" ");
    expect(text).toContain("28% of rent");
    expect(text).toContain("£9.99");
    expect(text).toContain("Guaranteed rent");
  });
});

describe("the queue's constraints", () => {
  it("refuses a status outside the six the publisher knows", async () => {
    requireSetup();
    await expect(
      insertPost({ asset_url: "https://x/a.mp4", caption: "c", status: "pending" }),
    ).rejects.toThrow(/check constraint/i);
  });

  it("refuses the same asset twice in the calendar", async () => {
    requireSetup();
    await insertPost({ asset_url: "https://x/a.mp4", caption: "c", asset_sha256: "aaa", slot_date: "2030-01-01" });
    await expect(
      insertPost({ asset_url: "https://x/a.mp4", caption: "c", asset_sha256: "aaa", slot_date: "2030-01-02" }),
    ).rejects.toThrow(/social_posts_calendar_asset_uniq/);
  });

  it("refuses two posts on the same day", async () => {
    requireSetup();
    await expect(
      insertPost({ asset_url: "https://x/b.mp4", caption: "c", asset_sha256: "bbb", slot_date: "2030-01-01" }),
    ).rejects.toThrow(/social_posts_slot_uniq/);
  });

  // The pool is a second copy of a calendar asset. That must be allowed, or
  // there is no pool; and it must be allowed exactly once, or the pool fills
  // with the same video.
  it("allows one pool copy of a calendar asset, and only one", async () => {
    requireSetup();
    await insertPost({ asset_url: "https://x/a.mp4", caption: "c", asset_sha256: "aaa", evergreen: true });
    await expect(
      insertPost({ asset_url: "https://x/a.mp4", caption: "c", asset_sha256: "aaa", evergreen: true }),
    ).rejects.toThrow(/social_posts_pool_asset_uniq/);
  });

  // A day-of clone of a pool row has no digest of its own. Two clones on two
  // days must both be storable, otherwise the fallback works once.
  it("lets a clone without a digest take a day", async () => {
    requireSetup();
    await insertPost({
      asset_url: "https://x/a.mp4", caption: "c", slot_date: "2030-01-03",
      source_refs: JSON.stringify({ evergreen_of: "pool", asset_sha256: "aaa" }),
    });
    await insertPost({
      asset_url: "https://x/a.mp4", caption: "c", slot_date: "2030-01-04",
      source_refs: JSON.stringify({ evergreen_of: "pool", asset_sha256: "aaa" }),
    });
  });

  // The evergreen fallback takes the same date as the row it stands in for.
  // If the index counted held rows, the fallback could never be inserted.
  it("lets a held row and a live row share a day, but not two live rows", async () => {
    requireSetup();
    await insertPost({ asset_url: "https://x/h.mp4", caption: "c", slot_date: "2030-02-01", status: "held" });
    await insertPost({ asset_url: "https://x/i.mp4", caption: "c", slot_date: "2030-02-01", status: "queued" });
    await expect(
      insertPost({ asset_url: "https://x/j.mp4", caption: "c", slot_date: "2030-02-01", status: "failed" }),
    ).rejects.toThrow(/social_posts_slot_uniq/);
  });

  it("keeps an event when its post is deleted, rather than losing the log line", async () => {
    requireSetup();
    const post = await db.query<{ id: string }>(
      "insert into social_posts (asset_url, caption) values ('https://x/z.mp4', 'c') returning id",
    );
    const id = post.rows[0].id;
    await db.query("insert into social_events (post_id, level, event) values ($1, 'info', 'test')", [id]);
    await db.query("delete from social_posts where id = $1", [id]);
    const r = await db.query<{ post_id: string | null }>("select post_id from social_events where event = 'test'");
    expect(r.rows).toEqual([{ post_id: null }]);
  });

  it("refuses an event level it does not know", async () => {
    requireSetup();
    await expect(
      db.query("insert into social_events (level, event) values ('debug', 'x')"),
    ).rejects.toThrow(/check constraint/i);
  });

  it("refuses a negative spend line", async () => {
    requireSetup();
    await expect(
      db.query("insert into social_spend (vendor, gbp) values ('meta', -1)"),
    ).rejects.toThrow(/check constraint/i);
  });
});

describe("access", () => {
  // No policies at all is the design: with RLS on, a role that is not the
  // owner and has no policy sees nothing. Asserting it here is what makes
  // "service role only" a fact rather than a comment.
  it("shows anon and authenticated nothing, on every table", async () => {
    requireSetup();
    for (const role of ["anon", "authenticated"]) {
      for (const table of ["social_posts", "social_settings", "social_events", "social_spend", "social_facts", "social_assets"]) {
        await db.exec("reset role");
        await db.exec(`set role ${role}`);
        await expect(db.query(`select * from ${table} limit 1`), `${role} on ${table}`)
          .rejects.toThrow(/permission denied/);
      }
    }
    await db.exec("reset role");
  });
});
