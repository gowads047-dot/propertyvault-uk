import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * supabase/profiles-privacy.sql, run against Postgres.
 *
 * profiles holds every user's phone and WhatsApp number, and its select
 * policy was `using (true)` — one anonymous request listed them all. The
 * replacement policy has four clauses, and each screen that reads a profile
 * relies on one of them: the listing page (owner has an active listing),
 * the enquiry inbox (other party on an enquiry), the Makan org inbox
 * (sender of an enquiry to a space the org lets), and Settings (own row).
 * This boots Postgres in WASM with the four tables the policy touches and
 * checks each clause opens exactly what it should and nothing else.
 */
let db: PGlite;
let ready = false;

const LANDLORD = "11111111-1111-4111-8111-111111111111"; // Makan landlord, active listing
const RENTURA = "22222222-2222-4222-8222-222222222222"; // Rentura landlord, phone in Settings, no listing
const TENANT = "33333333-3333-4333-8333-333333333333"; // sent an enquiry to LANDLORD
const STRANGER = "44444444-4444-4444-8444-444444444444";
const ORG_MEMBER = "55555555-5555-4555-8555-555555555555"; // member of the org letting the space TENANT asked about

async function actAs(uid: string | null) {
  await db.exec("reset role");
  await db.exec(`select set_config('test.uid', '${uid ?? ""}', false)`);
  await db.exec(`set role ${uid ? "authenticated" : "anon"}`);
}

async function visibleIds(): Promise<string[]> {
  const r = await db.query<{ id: string }>("select id from profiles order by id");
  return r.rows.map((x) => x.id);
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create schema auth;
    create or replace function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
    create role anon nologin;
    create role authenticated nologin;

    create table public.profiles (id uuid primary key, name text, phone text, whatsapp text);
    create table public.listings (id uuid primary key default gen_random_uuid(), user_id uuid, status text);
    create table public.enquiries (id uuid primary key default gen_random_uuid(), sender_id uuid, recipient_id uuid);
    create table public.makan_enquiry (id uuid primary key default gen_random_uuid(), sender_id uuid, space_id uuid);
    -- Production's function checks org membership through the space; here
    -- the org member is the one fixed user.
    create function public.makan_enquiry_is_landlord(target uuid) returns boolean
      language sql stable security definer as
      $$ select auth.uid() = '${ORG_MEMBER}'::uuid $$;

    alter table public.profiles enable row level security;
    alter table public.listings enable row level security;
    alter table public.enquiries enable row level security;
    alter table public.makan_enquiry enable row level security;
    create policy "Listings are viewable by everyone" on public.listings for select using (status = 'active');
    create policy "Users can view own enquiries" on public.enquiries for select
      using (auth.uid() = sender_id or auth.uid() = recipient_id);
    create policy "makan_enquiry_read" on public.makan_enquiry for select
      using (auth.uid() = sender_id or public.makan_enquiry_is_landlord(id));
    -- The policy being replaced, as production has it.
    create policy "Public profiles viewable" on public.profiles for select using (true);

    grant usage on schema public to anon, authenticated;
    grant select on all tables in schema public to anon, authenticated;

    insert into public.profiles values
      ('${LANDLORD}', 'Makan landlord', '07700 900001', '447700900001'),
      ('${RENTURA}', 'Rentura landlord', '07700 900002', null),
      ('${TENANT}', 'Tenant', '07700 900003', null),
      ('${STRANGER}', 'Stranger', null, null),
      ('${ORG_MEMBER}', 'Org member', null, null);
    insert into public.listings (user_id, status) values ('${LANDLORD}', 'active'), ('${RENTURA}', 'draft');
    insert into public.enquiries (sender_id, recipient_id) values ('${TENANT}', '${LANDLORD}');
    insert into public.makan_enquiry (sender_id, space_id) values ('${TENANT}', gen_random_uuid());
  `);
  await db.exec(readFileSync(join(process.cwd(), "supabase", "profiles-privacy.sql"), "utf8"));
  ready = true;
}, 60_000);

function requireSetup() {
  if (!ready) throw new Error("PGlite setup did not complete — look at the beforeAll hook.");
}

describe("profiles select policy", () => {
  it("anonymous: only the owner of an active listing, so the Rentura landlord's phone is not listable", async () => {
    requireSetup();
    await actAs(null);
    expect(await visibleIds()).toEqual([LANDLORD]);
    const r = await db.query<{ phone: string | null }>("select phone from profiles where id = $1", [RENTURA]);
    expect(r.rows).toHaveLength(0);
  });

  it("the listing page's read (name, whatsapp of the listing's owner) still works for anyone", async () => {
    requireSetup();
    await actAs(STRANGER);
    const r = await db.query<{ name: string; whatsapp: string }>("select name, whatsapp from profiles where id = $1", [LANDLORD]);
    expect(r.rows).toEqual([{ name: "Makan landlord", whatsapp: "447700900001" }]);
  });

  it("a signed-in stranger sees their own row and the listing owner, nobody else", async () => {
    requireSetup();
    await actAs(STRANGER);
    expect(await visibleIds()).toEqual([LANDLORD, STRANGER]);
  });

  it("the Rentura landlord can read their own row (Settings) and nobody else can", async () => {
    requireSetup();
    await actAs(RENTURA);
    expect(await visibleIds()).toEqual([LANDLORD, RENTURA]);
    await actAs(TENANT);
    expect(await visibleIds()).not.toContain(RENTURA);
  });

  it("the two ends of an enquiry can see each other (the inbox shows the sender's name)", async () => {
    requireSetup();
    await actAs(LANDLORD);
    expect(await visibleIds()).toEqual([LANDLORD, TENANT]);
    await actAs(TENANT);
    expect(await visibleIds()).toEqual([LANDLORD, TENANT]);
  });

  it("an org member sees the sender of a Makan enquiry to their space", async () => {
    requireSetup();
    await actAs(ORG_MEMBER);
    expect(await visibleIds()).toEqual([LANDLORD, TENANT, ORG_MEMBER]);
  });

  it("the old policy is gone: nothing is visible without a reason", async () => {
    requireSetup();
    const r = await db.query<{ policyname: string }>("select policyname from pg_policies where tablename = 'profiles' and cmd = 'SELECT'");
    expect(r.rows.map((x) => x.policyname)).toEqual(["Profiles visible with a reason"]);
  });
});
