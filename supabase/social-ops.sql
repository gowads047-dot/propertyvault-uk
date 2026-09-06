-- Run this in Supabase dashboard → SQL Editor, then `npm run check:db`.

-- The operations layer for social publishing.
--
-- The first Instagram cron carried its whole state in the date: day one was
-- CAMPAIGN_START, and "which video goes out" was arithmetic on today. That
-- was enough to post, and not enough to operate. It could not say what had
-- actually been published, could not hold a post that failed a check, could
-- not swap in a fallback, and when the access token was never configured it
-- ran for a week and posted nothing while nobody could tell from the outside.
--
-- These six tables are the answer to "what happened, and what is about to".
-- Every row the publisher touches is recorded, every decision it makes is an
-- event, and every piece of operator state — paused, the budget, the token —
-- is a settings row rather than an environment variable that needs a deploy.
--
-- All six are service-role only. Nothing here is readable from the browser:
-- social_settings holds the Instagram access token, and the rest is
-- operational detail that has no business on a public site.

-- ── The queue ──────────────────────────────────────────────────────────────

create table if not exists public.social_posts (
  id             uuid        primary key default gen_random_uuid(),
  channel        text        not null default 'instagram',
  -- The day this post goes out, in Europe/London. Null for evergreen pool
  -- rows, which have no day of their own and are copied into one when needed.
  slot_date      date,
  -- The calendar format (autopsy, the-bill, …). Informational.
  format         text,
  -- Meta fetches this itself: plain https, no query string, no redirect.
  asset_url      text        not null,
  -- The rendered file's digest, so the same video cannot be queued twice and
  -- a re-render that changes nothing is recognised as the same asset.
  asset_sha256   text,
  caption        text        not null,
  status         text        not null default 'queued'
                 check (status in ('queued', 'publishing', 'published', 'failed', 'held', 'skipped')),
  -- Publish attempts so far. Three failures and the row is held for a person.
  attempts       integer     not null default 0,
  last_error     text,
  ig_container_id text,
  ig_media_id    text,
  permalink      text,
  published_at   timestamptz,
  -- Pool rows: published once already, and eligible to stand in for a day
  -- whose own post fails its checks. Least recently used goes first.
  evergreen      boolean     not null default false,
  last_used_at   timestamptz,
  -- The last quality-check result, in full, so a hold can be read without
  -- re-running it.
  qc             jsonb,
  -- Where the content came from: calendar id, which calculators, and for a
  -- clone, which pool row it copies.
  source_refs    jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- One calendar row per asset, and one pool row per asset. Split in two rather
-- than a single (channel, asset_sha256) index because the pool is, by design,
-- a second copy of something already in the calendar. A day-of clone of a
-- pool row carries no digest of its own (it records the pool row's under
-- source_refs) and so is never caught by either.
create unique index if not exists social_posts_calendar_asset_uniq
  on public.social_posts (channel, asset_sha256)
  where asset_sha256 is not null and not evergreen;

create unique index if not exists social_posts_pool_asset_uniq
  on public.social_posts (channel, asset_sha256)
  where asset_sha256 is not null and evergreen;

-- One live post per day per channel. Two rows on the same date would both
-- try to publish at 18:00 and one of them would be a second Reel nobody
-- scheduled. Held and skipped rows are not live: a held row keeps its date so
-- a person can see which day it was for, and the evergreen clone that stands
-- in for it takes the same date.
create unique index if not exists social_posts_slot_uniq
  on public.social_posts (channel, slot_date)
  where slot_date is not null and status in ('queued', 'publishing', 'published', 'failed');

create index if not exists social_posts_status_idx
  on public.social_posts (channel, status, slot_date);

create index if not exists social_posts_published_idx
  on public.social_posts (channel, published_at desc)
  where published_at is not null;

-- ── Operator state ─────────────────────────────────────────────────────────

create table if not exists public.social_settings (
  key         text        primary key,
  value       jsonb       not null,
  updated_at  timestamptz not null default now()
);

-- Seed values, written only when the row does not already exist so re-running
-- this file cannot un-pause a paused pipeline or discard a stored token.
--
--   paused          true stops the publisher before it reads the queue.
--   monthly_cap_gbp 0 means "no spend approved". Nothing in the pipeline
--                   spends; this is the ceiling any paid action must check
--                   against, and 0 until a person raises it.
--   alert_email     where holds and failures go.
--   ig_access_token null until the weekly refresh writes one. Until then the
--                   INSTAGRAM_ACCESS_TOKEN environment variable is used.
insert into public.social_settings (key, value) values
  ('paused',          'false'::jsonb),
  ('monthly_cap_gbp', '0'::jsonb),
  ('alert_email',     '"info@propertyvaultuk.co.uk"'::jsonb),
  ('ig_access_token', 'null'::jsonb)
on conflict (key) do nothing;

-- ── The log ────────────────────────────────────────────────────────────────

-- Every decision the publisher makes: a check that failed, a day that was
-- missed, a post that went out. Read this before the Vercel function logs;
-- it survives them.
create table if not exists public.social_events (
  id       bigserial   primary key,
  ts       timestamptz not null default now(),
  post_id  uuid        references public.social_posts (id) on delete set null,
  level    text        not null check (level in ('info', 'warn', 'error')),
  event    text        not null,
  detail   jsonb
);

create index if not exists social_events_ts_idx on public.social_events (ts desc);
create index if not exists social_events_post_idx on public.social_events (post_id);

-- ── Spend ──────────────────────────────────────────────────────────────────

-- Money spent on social, entered by a person. The weekly summary reports the
-- month so far against monthly_cap_gbp. Nothing automated writes here yet.
create table if not exists public.social_spend (
  id      bigserial     primary key,
  ts      timestamptz   not null default now(),
  vendor  text          not null,
  gbp     numeric(10,2) not null check (gbp >= 0),
  note    text
);

create index if not exists social_spend_ts_idx on public.social_spend (ts desc);

-- ── Approved facts ─────────────────────────────────────────────────────────

-- The register of things a caption is allowed to state about the business.
-- Any new claim is proposed here first and approved by a person; the standing
-- rule is no invented numbers, and this is where the non-invented ones live.
create table if not exists public.social_facts (
  id           bigserial   primary key,
  fact         text        not null,
  source_url   text,
  status       text        not null default 'proposed'
               check (status in ('proposed', 'approved', 'rejected')),
  approved_at  timestamptz,
  created_at   timestamptz not null default now()
);

-- What the captions already say today, traced to the code that computes it.
-- Seeded as approved because it is already live; guarded against re-runs.
insert into public.social_facts (fact, source_url, status, approved_at)
select f.fact, f.source_url, 'approved', now()
from (values
  ('Running costs in every worked example are an assumption at 28% of rent, and every caption that uses the figure says so.',
   'propertyvaultuk.co.uk calculators (src/lib/tax.ts, finance.ts)'),
  ('Rentura is priced at £9.99 a month with a 30-day trial.',
   'https://www.propertyvaultuk.co.uk/rentura'),
  ('Guaranteed rent is described as a product that trades headline rent for not carrying voids. It is never promised as an outcome.',
   'propertyvaultuk.co.uk calculators (src/lib/tax.ts, finance.ts)')
) as f (fact, source_url)
where not exists (select 1 from public.social_facts x where x.fact = f.fact);

-- ── Licensed assets ────────────────────────────────────────────────────────

-- Where each non-original asset came from and on what terms. A music bed with
-- no record of its licence is a takedown waiting to happen.
create table if not exists public.social_assets (
  id           bigserial   primary key,
  kind         text        not null,
  name         text        not null,
  location     text        not null,
  licence      text        not null,
  licence_ref  text,
  created_at   timestamptz not null default now()
);

insert into public.social_assets (kind, name, location, licence, licence_ref)
select a.kind, a.name, a.location, a.licence, a.licence_ref
from (values
  ('music', 'bed-a-calm-pulse.mp3', 'assets/music/bed-a-calm-pulse.mp3',
   'ElevenLabs Music, generated 2026-09-06 23:05 UTC on the owner''s ElevenLabs account; commercial use per ElevenLabs plan terms',
   '1788735910661-0'),
  ('music', 'bed-b-tense-tick.mp3', 'assets/music/bed-b-tense-tick.mp3',
   'ElevenLabs Music, generated 2026-09-06 23:05 UTC on the owner''s ElevenLabs account; commercial use per ElevenLabs plan terms',
   '1788735925943-0')
) as a (kind, name, location, licence, licence_ref)
where not exists (select 1 from public.social_assets x where x.name = a.name);

-- ── Access ─────────────────────────────────────────────────────────────────

-- Service role only. No policies at all: with RLS on and nothing granting
-- access, anon and authenticated see nothing and can write nothing. The
-- service role bypasses RLS, which is the only path the crons use.
alter table public.social_posts    enable row level security;
alter table public.social_settings enable row level security;
alter table public.social_events   enable row level security;
alter table public.social_spend    enable row level security;
alter table public.social_facts    enable row level security;
alter table public.social_assets   enable row level security;

revoke all on public.social_posts    from anon, authenticated;
revoke all on public.social_settings from anon, authenticated;
revoke all on public.social_events   from anon, authenticated;
revoke all on public.social_spend    from anon, authenticated;
revoke all on public.social_facts    from anon, authenticated;
revoke all on public.social_assets   from anon, authenticated;
