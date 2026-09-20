import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The statements the form routes send, executed against the real schema.
 *
 * Every route test mocks supabase-js, so a statement that Postgres would
 * refuse passes green. That is how #177 shipped an upsert with
 * ON CONFLICT (email) against a unique index on lower(email) — 42P10, every
 * newsletter sign-up a 500 for two hours — with 1,300 tests passing. This
 * boots Postgres in WASM, applies the four form-related schema files exactly
 * as the SQL editor would, and runs each route's statements as the role the
 * route actually uses. What Postgres refuses here, it refuses in production.
 *
 * The auth shim is the one pv-schema.test.ts uses: PGlite has no Supabase
 * roles or auth schema, so they are created, and the tests act as anon or
 * service_role rather than as the superuser, who bypasses RLS.
 */
const FILES = ["subscribers.sql", "subscribers-consent.sql", "contact-messages.sql", "app-errors.sql"];

let db: PGlite;
let ready = false;

async function as(role: "anon" | "service_role" | "none") {
  await db.exec("reset role");
  if (role !== "none") await db.exec(`set role ${role}`);
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create schema auth;
    create table auth.users (id uuid primary key);
    create or replace function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin;
  `);
  for (const f of FILES) await db.exec(readFileSync(join(process.cwd(), "supabase", f), "utf8"));
  // What Supabase grants by default: the API roles can reach public, and
  // service_role bypasses RLS. app-errors.sql revokes anon/authenticated
  // itself, but its revoke ran before this grant, so it is repeated after.
  await db.exec(`
    grant usage on schema public to anon, authenticated, service_role;
    grant select, insert, update, delete on all tables in schema public to anon, authenticated, service_role;
    revoke all on public.app_errors from anon, authenticated;
    alter role service_role bypassrls;
  `);
  ready = true;
}, 60_000);

function requireSetup() {
  if (!ready) throw new Error("PGlite setup did not complete — look at the beforeAll hook.");
}

describe("subscribe route (service role)", () => {
  it("read, insert, update — the statements the route sends — all run", async () => {
    requireSetup();
    await as("service_role");
    const none = await db.query("select id, unsubscribed_at from subscribers where email = $1", ["jane@example.com"]);
    expect(none.rows).toHaveLength(0);
    await db.query(
      "insert into subscribers (name, email, user_type, source, attribution) values ($1, $2, $3, 'popup', $4)",
      ["Jane", "jane@example.com", "landlord", { utm_source: "instagram" }],
    );
    const row = await db.query<{ id: string; unsubscribed_at: string | null }>(
      "select id, unsubscribed_at from subscribers where email = $1",
      ["jane@example.com"],
    );
    expect(row.rows).toHaveLength(1);
    await db.query("update subscribers set attribution = $1 where id = $2", [{ utm_source: "google" }, row.rows[0].id]);
    const after = await db.query<{ attribution: { utm_source: string } }>("select attribution from subscribers where id = $1", [row.rows[0].id]);
    expect(after.rows[0].attribution).toEqual({ utm_source: "google" });
  });

  it("refuses the upsert #177 shipped: ON CONFLICT (email) cannot use the lower(email) index", async () => {
    requireSetup();
    await as("service_role");
    await expect(
      db.query("insert into subscribers (name, email) values ('x', 'jane@example.com') on conflict (email) do update set name = excluded.name"),
    ).rejects.toThrow(/no unique or exclusion constraint matching the ON CONFLICT/);
  });

  it("the unique index is case-insensitive, so a second sign-up in different case is a duplicate", async () => {
    requireSetup();
    await as("service_role");
    await expect(db.query("insert into subscribers (name, email) values ('x', 'Jane@Example.com')")).rejects.toThrow(/duplicate key/);
  });

  it("anon can insert but cannot update, which is why the route holds the service key", async () => {
    requireSetup();
    await as("anon");
    await db.query("insert into subscribers (name, email) values ('Sam', 'tenant@email.com')");
    const r = await db.query("update subscribers set name = 'Mallory' where email = 'tenant@email.com'");
    expect(r.affectedRows ?? 0).toBe(0);
    await as("service_role");
    const check = await db.query<{ name: string }>("select name from subscribers where email = 'tenant@email.com'");
    expect(check.rows[0].name).toBe("Sam");
  });
});

describe("unsubscribe route (service role)", () => {
  it("eq marks exactly one address; ilike would have treated _ as a wildcard", async () => {
    requireSetup();
    await as("service_role");
    await db.query("insert into subscribers (name, email) values ('A', 'jane_doe@email.com'), ('B', 'jane.doe@email.com')");
    const likeMatches = await db.query("select email from subscribers where email ilike $1", ["jane_doe@email.com"]);
    expect(likeMatches.rows).toHaveLength(2); // the bug #186 fixed
    const r = await db.query("update subscribers set unsubscribed_at = now() where email = $1", ["jane_doe@email.com"]);
    expect(r.affectedRows).toBe(1);
    const still = await db.query<{ email: string }>(
      "select email from subscribers where unsubscribed_at is null and email in ('jane_doe@email.com', 'jane.doe@email.com')",
    );
    expect(still.rows.map(x => x.email)).toEqual(["jane.doe@email.com"]);
  });
});

describe("contact route (service role)", () => {
  it("insert returning id, then the emailed flag — and anon could not get the id back", async () => {
    requireSetup();
    await as("anon");
    // insert … returning needs select under RLS; anon has no select policy.
    await expect(
      db.query(
        "insert into contact_messages (name, email, message, source, details) values ('P', 'landlord@email.com', '', 'guaranteed-rent', $1) returning id",
        [{ phone: "07000000000", consent: "2026-09-19T22:00:00Z" }],
      ),
    ).rejects.toThrow(/row-level security/);
    await as("service_role");
    const ins = await db.query<{ id: string }>(
      "insert into contact_messages (name, email, message, source, details) values ('P', 'landlord@email.com', '', 'guaranteed-rent', $1) returning id",
      [{ phone: "07000000000", consent: "2026-09-19T22:00:00Z", utm_source: "probe" }],
    );
    const id = ins.rows[0].id;
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    await db.query("update contact_messages set emailed = true where id = $1", [id]);
    const row = await db.query<{ emailed: boolean; consent: string }>(
      "select emailed, details->>'consent' as consent from contact_messages where id = $1",
      [id],
    );
    expect(row.rows[0]).toEqual({ emailed: true, consent: "2026-09-19T22:00:00Z" });
  });
});

describe("app_errors (service role only)", () => {
  it("takes the row the reporter writes, and refuses anon entirely", async () => {
    requireSetup();
    await as("service_role");
    await db.query(
      "insert into app_errors (side, message, stack, digest, path, method, router, route_type, user_agent, meta) values ('client', $1, $2, null, '/about/', 'GET', 'App Router', 'window.onerror', 'UA', null)",
      ["TypeError: x is not a function", "at a.js:1"],
    );
    await expect(db.query("insert into app_errors (side, message) values ('elsewhere', 'x')")).rejects.toThrow(/check constraint/);
    await as("anon");
    await expect(db.query("select count(*) from app_errors")).rejects.toThrow(/permission denied/);
    await expect(db.query("insert into app_errors (side, message) values ('client', 'x')")).rejects.toThrow(/permission denied/);
  });
});
