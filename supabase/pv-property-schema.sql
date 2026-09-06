-- The property that persists.
--
-- RUN THIS IN PRODUCTION.
--
-- Until now there has been no property in this database. rentura_properties is
-- an asset you already own and manage; nothing represented a property you were
-- considering. That gap is why the deal analyser computes a full analysis and
-- discards it on refresh, and why there is no memory, comparison, monitoring
-- or portfolio context anywhere in the product.
--
-- Three tables:
--   pv_property  what it is
--   pv_evidence  where every figure about it came from
--   pv_analysis  what we concluded, at a point in time
--
-- ── On anonymous ownership ─────────────────────────────────────────────────
--
-- The main site has no logged-in state. Rather than block this on building
-- accounts, a property may be owned by a session instead of a user: user_id is
-- nullable and claim_token identifies an anonymous owner. Signing up later
-- claims them. This is deliberate — forcing registration before the product
-- has demonstrated anything is how the current funnel already fails.

-- gen_random_uuid() is in Postgres core from 13 onwards, so no extension
-- is needed. Requiring pgcrypto would also break the PGlite schema test.

-- ── The property ───────────────────────────────────────────────────────────

create table if not exists public.pv_property (
  id            uuid primary key default gen_random_uuid(),

  -- Exactly one of these identifies the owner. Enforced below.
  user_id       uuid references auth.users(id) on delete cascade,
  claim_token   text,

  -- Where it came in from, kept so a re-vault can be recognised as the same
  -- property rather than creating a duplicate.
  source        text not null check (source in ('url','postcode','address','manual')),
  source_ref    text,

  -- Identity. uprn is null until a resolution service provides one.
  address       text,
  postcode      text,
  uprn          text,

  property_type text,
  bedrooms      smallint check (bedrooms is null or (bedrooms >= 0 and bedrooms <= 50)),
  asking_price  numeric(12,2) check (asking_price is null or asking_price >= 0),

  -- Where this sits in its life. The UI changes by stage.
  --
  -- Widened by pv-lifecycle.sql, which has been applied — the ownership half
  -- was added once the product had somewhere to put it. Restated here rather
  -- than left to the later file, because this is the schema anyone reads first
  -- and a constraint described in two places must not disagree.
  --
  -- The other half of that migration, rentura_property_id, is deliberately NOT
  -- restated here. It carries a foreign key to rentura_properties, and adding
  -- it would make this file impossible to apply on its own — which
  -- pv-schema.test.ts proves it can be, by running it against an empty
  -- Postgres. That independence is worth more than having the column
  -- described in two places.
  stage         text not null default 'screening'
                check (stage in (
                  -- Acquisition.
                  'screening','analysing','viewing','offer',
                  'negotiating','under_offer','due_diligence','purchased',
                  -- Ownership.
                  'refurbishing','rent_ready','let','managed',
                  'optimising','selling','sold',
                  -- Left the pipeline.
                  'rejected','archived')),


  -- A stable key for "is this the same property", derived in the application
  -- so the rule lives next to its tests rather than in a trigger.
  dedupe_key    text not null,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint pv_property_has_one_owner
    check ((user_id is null) <> (claim_token is null))
);

-- Re-vaulting the same listing updates rather than duplicates. Partial indexes
-- because the owner is one column or the other, never both.
create unique index if not exists pv_property_user_dedupe
  on public.pv_property (user_id, dedupe_key) where user_id is not null;
create unique index if not exists pv_property_anon_dedupe
  on public.pv_property (claim_token, dedupe_key) where claim_token is not null;

create index if not exists pv_property_user_idx on public.pv_property (user_id, updated_at desc);
create index if not exists pv_property_stage_idx on public.pv_property (user_id, stage);

-- ── Evidence: where every figure came from ─────────────────────────────────
--
-- This table IS the trust system. A "Verified" badge that is not backed by a
-- row here is a badge somebody drew.

create table if not exists public.pv_evidence (
  id           uuid primary key default gen_random_uuid(),
  property_id  uuid not null references public.pv_property(id) on delete cascade,

  -- e.g. 'rent', 'sold_median', 'sdlt', 'epc_rating'.
  field        text not null,

  -- One of these is set. Numbers stay numeric so they can be compared and
  -- charted rather than parsed back out of a string.
  value_num    numeric,
  value_text   text,
  -- For ranges: "rent is £1,375-£1,450".
  value_low    numeric,
  value_high   numeric,

  -- The whole point of the table.
  state        text not null check (state in
                 ('verified','estimated','calculated','assumed','user','missing')),
  source       text,          -- 'HM Land Registry', 'lib/tax.ts', 'user'
  source_url   text,
  method       text,          -- how it was derived, in one line
  checked_at   timestamptz not null default now(),

  created_at   timestamptz not null default now()
);

-- One current row per field per property; history lives in pv_analysis.
create unique index if not exists pv_evidence_field
  on public.pv_evidence (property_id, field);
create index if not exists pv_evidence_property_idx on public.pv_evidence (property_id);

-- A verified figure has to say where it came from, or it is not verified.
alter table public.pv_evidence drop constraint if exists pv_evidence_verified_needs_source;
alter table public.pv_evidence add constraint pv_evidence_verified_needs_source
  check (state <> 'verified' or source is not null);

-- ── Analysis: what we concluded, when ──────────────────────────────────────
--
-- Snapshots, not a mutable record. Storing each run is what makes "the score
-- was 63 in March, it is 71 now, here is what changed" answerable.

create table if not exists public.pv_analysis (
  id           uuid primary key default gen_random_uuid(),
  property_id  uuid not null references public.pv_property(id) on delete cascade,

  inputs       jsonb not null,   -- what was fed in
  computed     jsonb not null,   -- what came out
  score        smallint check (score is null or (score >= 0 and score <= 100)),
  band         text check (band is null or band in ('STRONG','WATCHLIST','RISKY','PASS')),

  -- How much of the analysis rested on real data rather than defaults.
  components_scored smallint,

  created_at   timestamptz not null default now()
);

create index if not exists pv_analysis_property_idx
  on public.pv_analysis (property_id, created_at desc);

-- ── Row level security ─────────────────────────────────────────────────────
--
-- Following the pattern proven by makan-media-storage.sql rather than
-- inventing a second approach. Anonymous rows are reachable only by the
-- service role: the claim token is held by the browser and checked in the
-- application, never presented to Postgres as an identity.

alter table public.pv_property enable row level security;
alter table public.pv_evidence enable row level security;
alter table public.pv_analysis enable row level security;

drop policy if exists pv_property_owner on public.pv_property;
create policy pv_property_owner on public.pv_property
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Child rows are reachable exactly when their parent is.
drop policy if exists pv_evidence_owner on public.pv_evidence;
create policy pv_evidence_owner on public.pv_evidence
  for all to authenticated
  using (exists (select 1 from public.pv_property p
                 where p.id = property_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.pv_property p
                      where p.id = property_id and p.user_id = auth.uid()));

drop policy if exists pv_analysis_owner on public.pv_analysis;
create policy pv_analysis_owner on public.pv_analysis
  for all to authenticated
  using (exists (select 1 from public.pv_property p
                 where p.id = property_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.pv_property p
                      where p.id = property_id and p.user_id = auth.uid()));

-- Nothing is readable with the anon key. Anonymous properties are served
-- through the application, which knows the claim token.
revoke all on public.pv_property, public.pv_evidence, public.pv_analysis from anon;

-- ── Claiming ───────────────────────────────────────────────────────────────
--
-- Moves anonymous properties to a real account at signup. Runs as definer
-- because the rows are invisible to the user until the moment they own them.

create or replace function public.pv_claim_properties(p_claim_token text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_moved integer;
begin
  if auth.uid() is null then
    raise exception 'must be signed in to claim';
  end if;

  -- A token is a bearer credential, so refuse a trivially guessable one
  -- rather than letting a short string sweep up somebody else's work.
  if p_claim_token is null or length(p_claim_token) < 20 then
    raise exception 'invalid claim token';
  end if;

  -- Skip anything that would collide with a property the user already has;
  -- the partial unique indexes would reject the whole statement otherwise.
  update public.pv_property src
     set user_id = auth.uid(), claim_token = null, updated_at = now()
   where src.claim_token = p_claim_token
     and not exists (
       select 1 from public.pv_property own
        where own.user_id = auth.uid() and own.dedupe_key = src.dedupe_key
     );

  get diagnostics v_moved = row_count;
  return v_moved;
end;
$$;

revoke all on function public.pv_claim_properties(text) from public, anon;
grant execute on function public.pv_claim_properties(text) to authenticated;

-- ── Housekeeping ───────────────────────────────────────────────────────────
-- Anonymous properties nobody ever claimed. Ninety days is long enough that a
-- returning visitor with the same browser still finds their work.

create or replace function public.pv_purge_unclaimed()
returns integer
language sql
security definer
set search_path = public
as $$
  with gone as (
    delete from public.pv_property
     where claim_token is not null and updated_at < now() - interval '90 days'
    returning 1
  )
  select count(*)::integer from gone;
$$;

revoke all on function public.pv_purge_unclaimed() from public, anon, authenticated;
grant execute on function public.pv_purge_unclaimed() to service_role;
