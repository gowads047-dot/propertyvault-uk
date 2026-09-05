-- Joining the two halves of a property's life.
--
-- NOT YET RUN. Read this before you run it — see "What this changes" below.
--
-- ── The problem ────────────────────────────────────────────────────────────
--
-- The platform models a property twice and never connects the two.
--
--   pv_property         something you are considering. Has a stage, which
--                       runs screening → purchased and then stops.
--   rentura_properties  something you already own. Has no stage at all.
--
-- So a house you researched in March and bought in September is two unrelated
-- rows, and the evidence, the scores and the maximum-offer working you built
-- up while deciding are stranded on the wrong side of the purchase. That is
-- the single biggest reason the product reads as a set of tools rather than
-- one place: nothing survives the moment of buying.
--
-- ── What this changes ──────────────────────────────────────────────────────
--
--   1. Widens pv_property.stage to cover ownership, not just acquisition.
--   2. Adds pv_property.rentura_property_id so a researched property can point
--      at the managed property it became.
--
-- Both are additive. No column is dropped, no value is rewritten, and every
-- row that exists today remains valid — the new stages are additions to the
-- check constraint, not replacements. Running this cannot lose data.
--
-- ── What it deliberately does not do ───────────────────────────────────────
--
-- It does not merge the two tables, migrate any rows, or change anything in
-- Rentura. Rentura is live and working; a property there keeps its own row,
-- its own RLS and its own identity. The link is a pointer, not a takeover.
--
-- It also does not backfill the pointer. Nothing can currently work out which
-- pv_property became which rentura_property, and guessing from a postcode
-- would attach one person's research to another person's house.

begin;

-- ── 1. The stage constraint, widened ───────────────────────────────────────
--
-- Existing values are all still permitted, so this cannot reject a live row.
-- The six new ones correspond to the lifecycle stages in src/lib/lifecycle.ts,
-- which lists them in STAGES_PENDING_MIGRATION until this runs.

alter table public.pv_property drop constraint if exists pv_property_stage_check;

alter table public.pv_property add constraint pv_property_stage_check
  check (stage in (
    -- Acquisition, unchanged.
    'screening','analysing','viewing','offer',
    'negotiating','under_offer','due_diligence','purchased',
    -- Ownership. The half that was missing.
    'refurbishing','rent_ready','let','managed','optimising','selling','sold',
    -- Left the pipeline, unchanged.
    'rejected','archived'
  ));

-- ── 2. The link ────────────────────────────────────────────────────────────
--
-- on delete set null rather than cascade: deleting the managed property must
-- not take the research with it. The two records have independent lifetimes
-- and the pointer is the weaker claim of the two.

alter table public.pv_property
  add column if not exists rentura_property_id uuid
    references public.rentura_properties(id) on delete set null;

-- One researched property per managed property. Partial, because the column is
-- null for everything that has not been bought — which is most rows, and a
-- plain unique index would allow only one of them.
create unique index if not exists pv_property_rentura_link
  on public.pv_property (rentura_property_id)
  where rentura_property_id is not null;

-- Finding the research from the managed side, which is the direction the
-- property page reads in.
create index if not exists pv_property_rentura_idx
  on public.pv_property (rentura_property_id)
  where rentura_property_id is not null;

-- A link is a claim that these are the same house, so it may only be made by
-- somebody who owns both sides of it. An anonymous property has no user to
-- compare against and cannot be linked at all — it must be claimed first.
alter table public.pv_property drop constraint if exists pv_property_link_needs_owner;
alter table public.pv_property add constraint pv_property_link_needs_owner
  check (rentura_property_id is null or user_id is not null);

commit;

-- ── Verifying it ───────────────────────────────────────────────────────────
--
-- Run these afterwards. The first should return every stage including the new
-- ones; the second should return the column with is_nullable = YES.
--
--   select pg_get_constraintdef(oid) from pg_constraint
--    where conname = 'pv_property_stage_check';
--
--   select column_name, data_type, is_nullable
--     from information_schema.columns
--    where table_name = 'pv_property' and column_name = 'rentura_property_id';
--
-- ── Rolling it back ────────────────────────────────────────────────────────
--
-- Safe only while no row uses a new stage or the link. Check first:
--
--   select count(*) from public.pv_property
--    where rentura_property_id is not null
--       or stage in ('refurbishing','rent_ready','let','managed',
--                    'optimising','selling','sold');
--
-- If that returns 0:
--
--   alter table public.pv_property drop constraint pv_property_link_needs_owner;
--   drop index if exists pv_property_rentura_link;
--   drop index if exists pv_property_rentura_idx;
--   alter table public.pv_property drop column rentura_property_id;
--   alter table public.pv_property drop constraint pv_property_stage_check;
--   alter table public.pv_property add constraint pv_property_stage_check
--     check (stage in ('screening','analysing','viewing','offer','negotiating',
--                      'under_offer','due_diligence','purchased','rejected','archived'));
