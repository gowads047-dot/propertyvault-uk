import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A landlord's first publish on Makan, run against Postgres with the real
 * schema and policies.
 *
 * ensureOrg() in src/app/makan/list/page.tsx inserts a makan_org row and a
 * makan_org_member row for the signed-in user. Production had no insert
 * policy on either table, so both were refused with 42501 and only the
 * seeded organisation could ever list a room — and even with policies the
 * page could not read the new org's id back, because an org is visible only
 * to its members. supabase/missing-policies.sql adds makan_create_org(),
 * which does the step as definer; this applies makan-rooms-schema.sql and
 * that function and calls it as the authenticated role, the way the page
 * does through supabase.rpc().
 */
let db: PGlite;
let ready = false;

const LANDLORD = "11111111-1111-4111-8111-111111111111";
const INTRUDER = "22222222-2222-4222-8222-222222222222";

async function actAs(uid: string | null) {
  await db.exec("reset role");
  await db.exec(`select set_config('test.uid', '${uid ?? ""}', false)`);
  await db.exec(`set role ${uid ? "authenticated" : "anon"}`);
}

/** Only the statements missing-policies.sql holds for Makan; the rest need tables this test does not create. */
function makanPart(sql: string): string {
  const i = sql.indexOf("-- makan_org / makan_org_member");
  if (i < 0) throw new Error("missing-policies.sql no longer has the Makan section");
  return sql.slice(i);
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create schema auth;
    create table auth.users (id uuid primary key);
    create or replace function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
    create or replace function auth.role() returns text language sql stable as
      $$ select case when nullif(current_setting('test.uid', true), '') is null then 'anon' else 'authenticated' end $$;
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin;
    insert into auth.users values ('${LANDLORD}'), ('${INTRUDER}');
    -- The schema references profiles(id); the trigger that fills it from
    -- auth.users lives elsewhere, so the two rows are made by hand.
    create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, name text, role text);
    insert into public.profiles (id, name) values ('${LANDLORD}', 'Sam'), ('${INTRUDER}', 'Intruder');
  `);
  await db.exec(readFileSync(join(process.cwd(), "supabase", "makan-rooms-schema.sql"), "utf8"));
  await db.exec(makanPart(readFileSync(join(process.cwd(), "supabase", "missing-policies.sql"), "utf8")));
  await db.exec(`
    grant usage on schema public to anon, authenticated, service_role;
    grant select, insert, update, delete on all tables in schema public to anon, authenticated, service_role;
    grant execute on all functions in schema public to anon, authenticated, service_role;
  `);
  ready = true;
}, 120_000);

function requireSetup() {
  if (!ready) throw new Error("PGlite setup did not complete — look at the beforeAll hook.");
}

describe("a landlord's first publish on Makan", () => {
  let orgId: string;

  it("creates their organisation, makes them its owner and returns the id — the rpc ensureOrg() makes", async () => {
    requireSetup();
    await actAs(LANDLORD);
    const mine = await db.query("select org_id from makan_org_member where user_id = $1 limit 1", [LANDLORD]);
    expect(mine.rows).toHaveLength(0);
    const r = await db.query<{ makan_create_org: string }>("select makan_create_org($1, $2)", ["Sam's rooms", "sams-rooms-11111111"]);
    orgId = r.rows[0].makan_create_org;
    expect(orgId).toMatch(/^[0-9a-f-]{36}$/);
    const again = await db.query<{ org_id: string; role: string }>("select org_id, role from makan_org_member where user_id = $1", [LANDLORD]);
    expect(again.rows).toEqual([{ org_id: orgId, role: "owner" }]);
    // And now, as a member, the org is readable — which is what the list page needs next.
    const org = await db.query<{ name: string }>("select name from makan_org where id = $1", [orgId]);
    expect(org.rows[0].name).toBe("Sam's rooms");
  });

  it("does not make a second organisation for someone who already has one", async () => {
    requireSetup();
    await actAs(LANDLORD);
    await expect(db.query("select makan_create_org('Again', 'again-11111111')")).rejects.toThrow(/already belong/);
  });

  it("still lets nobody insert membership rows by hand, so the function is the only door", async () => {
    requireSetup();
    await actAs(INTRUDER);
    await expect(
      db.query("insert into makan_org_member (org_id, user_id, role) values ($1, $2, 'owner')", [orgId, INTRUDER]),
    ).rejects.toThrow(/row-level security/);
  });

  it("is closed to anonymous visitors", async () => {
    requireSetup();
    await actAs(null);
    await expect(db.query("select makan_create_org('anon', 'anon-org')")).rejects.toThrow(/permission denied|Sign in/);
  });
});
