import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The property schema, executed for real.
 *
 * "The constraints are written" is not "the constraints hold". This boots
 * Postgres in WASM, runs supabase/pv-property-schema.sql exactly as the
 * Supabase SQL editor would, and asserts on what actually happens — including
 * as a plain role, because a superuser bypasses RLS entirely and testing as
 * one proves nothing.
 *
 * Follows the pattern established by makan-schema.test.ts, including the
 * auth.uid() stub that lets one connection stand in for several callers.
 */

const SQL = join(process.cwd(), "supabase", "pv-property-schema.sql");

const ALICE = "11111111-1111-1111-1111-111111111111";
const BOB = "22222222-2222-2222-2222-222222222222";
const TOKEN = "a".repeat(64);
const OTHER_TOKEN = "b".repeat(64);

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

async function actAs(uid: string | null) {
  requireSetup();
  await db.exec("reset role");
  await db.exec(`select set_config('test.uid', ${uid ? `'${uid}'` : "''"}, false)`);
  // Supabase runs a signed-in request as the "authenticated" role, and the
  // policies below name it explicitly. Testing as any other role would test
  // nothing — no policy would match and every query would return empty.
  await db.exec("set role authenticated");
}

async function asAdmin() {
  requireSetup();
  await db.exec("reset role");
}

beforeAll(async () => {
  db = new PGlite();

  await db.exec(`
    create schema auth;
    create table auth.users (id uuid primary key);
    create or replace function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
    create role app_user nologin;
    create role service_role nologin;
    create role anon nologin;
    create role authenticated nologin;
  `);

  await db.exec(readFileSync(SQL, "utf8"));

  await db.exec(`
    grant usage on schema public to authenticated;
    grant select, insert, update, delete on public.pv_property, public.pv_evidence, public.pv_analysis to authenticated;
    insert into auth.users(id) values ('${ALICE}'),('${BOB}');
  `);

  // Alice owns one property; an anonymous session owns another.
  await db.exec(`
    insert into pv_property(user_id, source, source_ref, postcode, dedupe_key, asking_price)
    values ('${ALICE}', 'url', 'https://rightmove.co.uk/properties/1', 'NG7 1AA', 'url:rightmove.co.uk#1', 185000);

    insert into pv_property(claim_token, source, postcode, dedupe_key)
    values ('${TOKEN}', 'postcode', 'B29 6AA', 'pc:B29 6AA');
  `);

  ready = true;
}, 60_000);

describe("ownership", () => {
  // The XOR: a property belongs to a user or to a session, never both, never
  // neither. Without this a row could be orphaned or double-owned.
  it("refuses a property with no owner", async () => {
    await asAdmin();
    await expect(db.exec(
      `insert into pv_property(source, dedupe_key) values ('manual','x:1')`,
    )).rejects.toThrow(/pv_property_has_one_owner/);
  });

  it("refuses a property with two owners", async () => {
    await asAdmin();
    await expect(db.exec(
      `insert into pv_property(user_id, claim_token, source, dedupe_key)
       values ('${ALICE}', '${TOKEN}', 'manual', 'x:2')`,
    )).rejects.toThrow(/pv_property_has_one_owner/);
  });
});

describe("deduplication", () => {
  it("stops the same user vaulting the same listing twice", async () => {
    await asAdmin();
    await expect(db.exec(
      `insert into pv_property(user_id, source, dedupe_key)
       values ('${ALICE}', 'url', 'url:rightmove.co.uk#1')`,
    )).rejects.toThrow(/pv_property_user_dedupe/);
  });

  it("lets a different user vault the same listing", async () => {
    await asAdmin();
    await expect(db.exec(
      `insert into pv_property(user_id, source, dedupe_key)
       values ('${BOB}', 'url', 'url:rightmove.co.uk#1')`,
    )).resolves.not.toThrow();
  });

  it("stops the same anonymous session duplicating", async () => {
    await asAdmin();
    await expect(db.exec(
      `insert into pv_property(claim_token, source, dedupe_key)
       values ('${TOKEN}', 'postcode', 'pc:B29 6AA')`,
    )).rejects.toThrow(/pv_property_anon_dedupe/);
  });
});

describe("row level security", () => {
  it("shows a user only their own properties", async () => {
    await actAs(ALICE);
    const r = await db.query<{ n: string }>("select count(*)::text n from pv_property");
    expect(r.rows[0].n).toBe("1");

    await actAs(BOB);
    const b = await db.query<{ dedupe_key: string }>("select dedupe_key from pv_property");
    expect(b.rows).toHaveLength(1);
    expect(b.rows[0].dedupe_key).toBe("url:rightmove.co.uk#1");
  });

  // The anonymous row is served through the application, which holds the
  // token. It must not be reachable by a signed-in stranger.
  it("hides anonymous properties from every signed-in user", async () => {
    for (const uid of [ALICE, BOB]) {
      await actAs(uid);
      const r = await db.query<{ n: string }>(
        "select count(*)::text n from pv_property where claim_token is not null",
      );
      expect(r.rows[0].n, uid).toBe("0");
    }
  });

  it("shows nothing at all to an unauthenticated caller", async () => {
    await actAs(null);
    const r = await db.query<{ n: string }>("select count(*)::text n from pv_property");
    expect(r.rows[0].n).toBe("0");
  });

  it("stops a user writing a property owned by someone else", async () => {
    await actAs(BOB);
    const r = await db.query<{ n: string }>(
      `update pv_property set asking_price = 1 where user_id = '${ALICE}' returning 1 as n`,
    );
    expect(r.rows).toHaveLength(0);
  });

  it("stops a user inserting a property owned by someone else", async () => {
    await actAs(BOB);
    await expect(db.query(
      `insert into pv_property(user_id, source, dedupe_key) values ('${ALICE}','manual','x:3')`,
    )).rejects.toThrow(/row-level security/i);
  });

  it("gates evidence and analysis behind the parent property", async () => {
    await asAdmin();
    const p = await db.query<{ id: string }>(
      `select id from pv_property where user_id = '${ALICE}' limit 1`,
    );
    const id = p.rows[0].id;
    await db.exec(
      `insert into pv_evidence(property_id, field, value_num, state, source)
       values ('${id}','sold_median',198000,'verified','HM Land Registry')`,
    );

    await actAs(ALICE);
    expect((await db.query("select 1 from pv_evidence")).rows).toHaveLength(1);

    await actAs(BOB);
    expect((await db.query("select 1 from pv_evidence")).rows).toHaveLength(0);
  });
});

describe("evidence integrity", () => {
  // The rule the whole trust system rests on.
  it("refuses a verified figure with no source", async () => {
    await asAdmin();
    const p = await db.query<{ id: string }>("select id from pv_property limit 1");
    await expect(db.exec(
      `insert into pv_evidence(property_id, field, value_num, state)
       values ('${p.rows[0].id}','rent',950,'verified')`,
    )).rejects.toThrow(/pv_evidence_verified_needs_source/);
  });

  it("refuses a state outside the known set", async () => {
    await asAdmin();
    const p = await db.query<{ id: string }>("select id from pv_property limit 1");
    await expect(db.exec(
      `insert into pv_evidence(property_id, field, state, source)
       values ('${p.rows[0].id}','rent','probably','somewhere')`,
    )).rejects.toThrow();
  });

  it("keeps one current row per field", async () => {
    await asAdmin();
    const p = await db.query<{ id: string }>("select id from pv_property limit 1");
    await expect(db.exec(
      `insert into pv_evidence(property_id, field, value_num, state, source)
       values ('${p.rows[0].id}','sold_median',1,'verified','x')`,
    )).rejects.toThrow(/pv_evidence_field/);
  });

  it("removes evidence and analysis with the property", async () => {
    await asAdmin();
    const p = await db.query<{ id: string }>(
      `insert into pv_property(user_id, source, dedupe_key)
       values ('${BOB}','manual','x:cascade') returning id`,
    );
    const id = p.rows[0].id;
    await db.exec(`insert into pv_evidence(property_id, field, state) values ('${id}','rent','assumed')`);
    await db.exec(`insert into pv_analysis(property_id, inputs, computed) values ('${id}','{}','{}')`);
    await db.exec(`delete from pv_property where id = '${id}'`);

    const left = await db.query<{ n: string }>(
      `select (select count(*) from pv_evidence where property_id='${id}')
            + (select count(*) from pv_analysis where property_id='${id}') as n`,
    );
    expect(String(left.rows[0].n)).toBe("0");
  });
});

describe("analysis snapshots", () => {
  it("keeps every run rather than overwriting", async () => {
    await asAdmin();
    const p = await db.query<{ id: string }>(
      `insert into pv_property(user_id, source, dedupe_key)
       values ('${BOB}','manual','x:snapshots') returning id`,
    );
    const id = p.rows[0].id;
    await db.exec(`
      insert into pv_analysis(property_id, inputs, computed, score, band) values
        ('${id}','{"rent":900}','{"cf":40}',63,'WATCHLIST'),
        ('${id}','{"rent":975}','{"cf":115}',71,'WATCHLIST');
    `);
    const r = await db.query<{ n: string }>(
      `select count(*)::text n from pv_analysis where property_id='${id}'`,
    );
    expect(r.rows[0].n).toBe("2");
  });

  it("refuses a score outside 0-100 or an unknown band", async () => {
    await asAdmin();
    const p = await db.query<{ id: string }>("select id from pv_property limit 1");
    const id = p.rows[0].id;
    await expect(db.exec(
      `insert into pv_analysis(property_id, inputs, computed, score) values ('${id}','{}','{}',101)`,
    )).rejects.toThrow();
    await expect(db.exec(
      `insert into pv_analysis(property_id, inputs, computed, band) values ('${id}','{}','{}','GREAT')`,
    )).rejects.toThrow();
  });
});

describe("claiming anonymous properties", () => {
  it("refuses a guessably short token", async () => {
    await actAs(BOB);
    await expect(db.query("select pv_claim_properties('short')")).rejects.toThrow(/invalid claim token/);
  });

  it("refuses when nobody is signed in", async () => {
    await actAs(null);
    await expect(db.query(`select pv_claim_properties('${TOKEN}')`)).rejects.toThrow(/must be signed in/);
  });

  it("moves the session's properties to the account", async () => {
    await actAs(BOB);
    const r = await db.query<{ pv_claim_properties: number }>(
      `select pv_claim_properties('${TOKEN}')`,
    );
    expect(r.rows[0].pv_claim_properties).toBe(1);

    const mine = await db.query<{ n: string }>(
      "select count(*)::text n from pv_property where claim_token is not null",
    );
    expect(mine.rows[0].n).toBe("0");
  });

  it("claims nothing for a token that owns nothing", async () => {
    await actAs(BOB);
    const r = await db.query<{ pv_claim_properties: number }>(
      `select pv_claim_properties('${OTHER_TOKEN}')`,
    );
    expect(r.rows[0].pv_claim_properties).toBe(0);
  });

  // The partial unique index would otherwise reject the whole statement and
  // the user would lose every property in the claim, not just the clash.
  it("skips a property that would collide with one already owned", async () => {
    await asAdmin();
    const tok = "c".repeat(64);
    await db.exec(`
      insert into pv_property(user_id, source, dedupe_key) values ('${BOB}','manual','pc:LS1 1AA');
      insert into pv_property(claim_token, source, dedupe_key) values ('${tok}','manual','pc:LS1 1AA');
      insert into pv_property(claim_token, source, dedupe_key) values ('${tok}','manual','pc:LS2 2BB');
    `);

    await actAs(BOB);
    const r = await db.query<{ pv_claim_properties: number }>(`select pv_claim_properties('${tok}')`);
    expect(r.rows[0].pv_claim_properties).toBe(1);   // the non-colliding one only

    await asAdmin();
    const left = await db.query<{ n: string }>(
      `select count(*)::text n from pv_property where claim_token = '${tok}'`,
    );
    expect(left.rows[0].n).toBe("1");                 // the clash is left alone
  });
});
