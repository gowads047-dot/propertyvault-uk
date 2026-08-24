import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The Makan room schema, executed for real.
 *
 * Row Level Security is the access model for permissioned vacancies -- a
 * supported-accommodation listing shown only to named commissioners -- so
 * "the policies are written" is not the same as "the policies work". This
 * boots Postgres in WASM, runs supabase/makan-rooms-schema.sql exactly as the
 * Supabase SQL editor would, and asserts on what four different callers can
 * actually see.
 *
 * Two traps this exists to catch, both of which bit during authoring:
 *
 *   1. Policies that reach into each other's tables with inline EXISTS
 *      recurse. makan_space_read querying makan_unit while makan_unit_read
 *      queried makan_space produced "infinite recursion detected in policy for
 *      relation" on the first real query. Every cross-table check now goes
 *      through a security definer helper.
 *
 *   2. Superusers bypass RLS entirely, so testing as one proves nothing --
 *      the first version of this file reported everything visible to everyone
 *      and still "passed" the owner case. The tests below act as a plain role,
 *      which is what Supabase's anon and authenticated roles are.
 */

const SQL = join(process.cwd(), "supabase", "makan-rooms-schema.sql");

const LANDLORD = "11111111-1111-1111-1111-111111111111";
const COMMISSIONER = "22222222-2222-2222-2222-222222222222";
const STRANGER = "33333333-3333-3333-3333-333333333333";

const ORG_LANDLORD = "aaaaaaaa-0000-0000-0000-000000000001";
const ORG_COMMISSIONER = "aaaaaaaa-0000-0000-0000-000000000002";

let db: PGlite;

/** Run the next queries as `uid`, or as an anonymous visitor when null. */
async function actAs(uid: string | null) {
  await db.exec("reset role");
  await db.exec(`select set_config('test.uid', ${uid ? `'${uid}'` : "''"}, false)`);
  await db.exec("set role app_user");
}

async function visibleSpaces(uid: string | null): Promise<string[]> {
  await actAs(uid);
  const r = await db.query<{ label: string }>("select label from makan_space order by label");
  return r.rows.map(x => x.label);
}

beforeAll(async () => {
  db = new PGlite();

  // The slice of Supabase the migration depends on. auth.uid() reads a session
  // setting so a single connection can stand in for different callers.
  await db.exec(`
    create schema auth;
    create table auth.users (id uuid primary key);
    create or replace function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
    create table public.profiles (id uuid primary key, name text not null);
  `);

  await db.exec(readFileSync(SQL, "utf8"));

  // One landlord org with a three-room house. Room 1 is advertised publicly,
  // Room 2 only to Sandwell, Room 3 is mid-assessment and not listed at all.
  await db.exec(`
    insert into auth.users(id) values ('${LANDLORD}'),('${COMMISSIONER}'),('${STRANGER}');
    insert into public.profiles(id,name) values
      ('${LANDLORD}','Landlord'),('${COMMISSIONER}','Commissioner'),('${STRANGER}','Stranger');

    insert into makan_org(id,name,slug,kind,verified_at) values
      ('${ORG_LANDLORD}','Midlands Rooms','midlands-rooms','landlord',now()),
      ('${ORG_COMMISSIONER}','Sandwell Council','sandwell','commissioner',now());
    insert into makan_org_member(org_id,user_id,role) values
      ('${ORG_LANDLORD}','${LANDLORD}','owner'),
      ('${ORG_COMMISSIONER}','${COMMISSIONER}','owner');

    insert into makan_building(id,org_id,address_line1,city,postcode) values
      ('bbbbbbbb-0000-0000-0000-000000000001','${ORG_LANDLORD}','12 Chapel St','Birmingham','B29 6AA');
    insert into makan_unit(id,building_id,label,unit_type) values
      ('cccccccc-0000-0000-0000-000000000001','bbbbbbbb-0000-0000-0000-000000000001','Whole house','house');

    insert into makan_space(id,unit_id,kind,label,rent_pcm,status) values
      ('dddddddd-0000-0000-0000-000000000001','cccccccc-0000-0000-0000-000000000001','room','Room 1',650,'available_now'),
      ('dddddddd-0000-0000-0000-000000000002','cccccccc-0000-0000-0000-000000000001','room','Room 2',700,'available_now'),
      ('dddddddd-0000-0000-0000-000000000003','cccccccc-0000-0000-0000-000000000001','room','Room 3',600,'assessment_pending');

    insert into makan_listing(id,space_id,channel,published_at) values
      ('eeeeeeee-0000-0000-0000-000000000001','dddddddd-0000-0000-0000-000000000001','public',now()),
      ('eeeeeeee-0000-0000-0000-000000000002','dddddddd-0000-0000-0000-000000000002','commissioners',now());
    insert into makan_listing_audience(listing_id,org_id) values
      ('eeeeeeee-0000-0000-0000-000000000002','${ORG_COMMISSIONER}');
  `);

  // Act as a plain role from here on. Superusers ignore RLS, so testing as the
  // owner would silently pass no matter what the policies said.
  await db.exec(`
    create role app_user nologin;
    grant usage on schema public to app_user;
    grant select, insert, update, delete on all tables in schema public to app_user;
    grant execute on all functions in schema public to app_user;
  `);
}, 60_000);

describe("makan schema", () => {
  it("creates every table with RLS enabled", async () => {
    await db.exec("reset role");
    const r = await db.query<{ relname: string; relrowsecurity: boolean }>(
      `select relname, relrowsecurity from pg_class
       where relnamespace = 'public'::regnamespace and relname like 'makan\\_%' and relkind = 'r'`
    );
    expect(r.rows.length).toBe(10);
    expect(r.rows.filter(x => !x.relrowsecurity).map(x => x.relname)).toEqual([]);
  });
});

describe("permissioned vacancies", () => {
  it("shows an anonymous visitor only the publicly listed room", async () => {
    expect(await visibleSpaces(null)).toEqual(["Room 1"]);
  });

  it("shows a signed-in stranger only the publicly listed room", async () => {
    expect(await visibleSpaces(STRANGER)).toEqual(["Room 1"]);
  });

  // The moat. No portal can offer this, because a listing nobody can see is
  // worth nothing to an advertising business.
  it("shows a granted commissioner the private vacancy too", async () => {
    expect(await visibleSpaces(COMMISSIONER)).toEqual(["Room 1", "Room 2"]);
  });

  // assessment_pending must never reach a public surface. That is enforced
  // here rather than in the UI, so a template mistake cannot leak it.
  it("shows the owning landlord everything, including the unlisted room", async () => {
    expect(await visibleSpaces(LANDLORD)).toEqual(["Room 1", "Room 2", "Room 3"]);
  });

  it("stops a stranger writing to another org's room", async () => {
    await actAs(STRANGER);
    await db.exec("update makan_space set rent_pcm = 1 where label = 'Room 1'");

    await actAs(LANDLORD);
    const r = await db.query<{ rent_pcm: number }>(
      "select rent_pcm from makan_space where label = 'Room 1'"
    );
    expect(r.rows[0].rent_pcm).toBe(650);
  });
});

describe("freshness and audit", () => {
  it("re-stamps status_confirmed_at and writes an audit row on a status change", async () => {
    await actAs(LANDLORD);
    const before = await db.query<{ status_confirmed_at: Date }>(
      "select status_confirmed_at from makan_space where label = 'Room 2'"
    );

    await db.exec("update makan_space set status = 'occupied' where label = 'Room 2'");

    const after = await db.query<{ status_confirmed_at: Date }>(
      "select status_confirmed_at from makan_space where label = 'Room 2'"
    );
    expect(new Date(after.rows[0].status_confirmed_at).getTime())
      .toBeGreaterThan(new Date(before.rows[0].status_confirmed_at).getTime());

    const audit = await db.query<{ action: string; before: unknown; after: unknown }>(
      `select action, before, after from makan_audit
       where entity = 'space' and entity_id = 'dddddddd-0000-0000-0000-000000000002'`
    );
    expect(audit.rows).toHaveLength(1);
    expect(audit.rows[0].action).toBe("status_changed");
    expect(audit.rows[0].before).toEqual({ status: "available_now" });
    expect(audit.rows[0].after).toEqual({ status: "occupied" });
  });

  it("grants nobody update or delete on the audit trail", async () => {
    await db.exec("reset role");
    const r = await db.query<{ cmd: string }>(
      "select cmd from pg_policies where tablename = 'makan_audit'"
    );
    const cmds = r.rows.map(x => x.cmd);
    expect(cmds).not.toContain("UPDATE");
    expect(cmds).not.toContain("DELETE");
    expect(cmds).not.toContain("ALL");
  });
});
