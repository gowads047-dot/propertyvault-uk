-- ============================================================================
-- MAKAN: company lets
-- Run in: Supabase Dashboard -> SQL Editor. Requires makan-rooms-schema.sql.
--
-- The whole product in a few columns.
--
-- Ring an estate agent about a 4-bed for supported living and they say no on
-- the spot -- not after asking the landlord. A company let replaces their
-- ongoing management fee, typically 10-12% of rent for years, with a one-off
-- tenant-find fee at best. So the landlord never hears the offer existed, even
-- when their property has been void for six weeks and they would take a
-- three-year guaranteed lease tomorrow.
--
-- `let_types` is what routes around that. A landlord ticks "companies" once,
-- and every operator searching can see it. That is the entire mechanism.
--
-- Nothing here touches bookings or payments: the operator runs the serviced
-- accommodation, the lease is signed between landlord and company, and Makan
-- is the place they found each other.
-- ============================================================================


-- ── Organisations that hold demand rather than supply ───────────────────────
--
-- A serviced-accommodation or supported-living company taking properties on
-- lease is neither a landlord nor a care "provider" in the existing sense, and
-- calling them either makes the search filters lie.
alter table public.makan_org drop constraint if exists makan_org_kind_check;
alter table public.makan_org add constraint makan_org_kind_check
  check (kind in ('landlord', 'operator', 'provider', 'referrer', 'commissioner'));


-- ── What can be let ─────────────────────────────────────────────────────────
--
-- 'whole_unit' already existed but reads as internal jargon; 'whole_property'
-- is what a landlord would call it, and both are kept so nothing breaks.
alter table public.makan_space drop constraint if exists makan_space_kind_check;
alter table public.makan_space add constraint makan_space_kind_check
  check (kind in ('room', 'studio', 'whole_property', 'whole_unit'));


-- ── Who the landlord will let to, and on what terms ─────────────────────────

alter table public.makan_space
  add column if not exists let_types text[] not null default array['tenant'],
  add column if not exists min_lease_months int,
  add column if not exists guaranteed_rent_considered boolean not null default false,
  add column if not exists permitted_uses text[] not null default '{}';

-- Every element has to be a value the filters know about, and the array cannot
-- be empty -- a listing nobody is allowed to answer is not a listing.
alter table public.makan_space drop constraint if exists makan_space_let_types_check;
alter table public.makan_space add constraint makan_space_let_types_check
  check (
    -- cardinality(), not array_length(). array_length on an empty array
    -- returns NULL rather than 0, and a CHECK whose expression is NULL passes
    -- — so the obvious `array_length(...) >= 1` silently allowed exactly the
    -- case it was written to stop.
    cardinality(let_types) >= 1
    and let_types <@ array['tenant', 'company']::text[]
  );

-- Only meaningful when the landlord accepts company lets. Left empty otherwise
-- rather than defaulting to "anything", which would put properties in front of
-- operators the landlord never agreed to.
alter table public.makan_space drop constraint if exists makan_space_permitted_uses_check;
alter table public.makan_space add constraint makan_space_permitted_uses_check
  check (permitted_uses <@ array['serviced_accommodation', 'supported_living', 'hmo', 'social_housing']::text[]);

alter table public.makan_space drop constraint if exists makan_space_min_lease_check;
alter table public.makan_space add constraint makan_space_min_lease_check
  check (min_lease_months is null or (min_lease_months >= 1 and min_lease_months <= 120));

-- An operator's search is always "company lets, this use, this area", so the
-- array columns are the ones that need indexing.
create index if not exists makan_space_let_types_idx on public.makan_space using gin (let_types);
create index if not exists makan_space_permitted_uses_idx on public.makan_space using gin (permitted_uses);


-- ── The same question on a Wanted post ──────────────────────────────────────
--
-- So an operator can say "company let, supported living, 3 years" and a
-- landlord reading the board knows immediately whether it is for them.
alter table public.makan_wanted
  add column if not exists let_type text not null default 'tenant',
  add column if not exists intended_use text,
  add column if not exists lease_months int;

alter table public.makan_wanted drop constraint if exists makan_wanted_let_type_check;
alter table public.makan_wanted add constraint makan_wanted_let_type_check
  check (let_type in ('tenant', 'company'));

alter table public.makan_wanted drop constraint if exists makan_wanted_intended_use_check;
alter table public.makan_wanted add constraint makan_wanted_intended_use_check
  check (intended_use is null or intended_use in ('serviced_accommodation', 'supported_living', 'hmo', 'social_housing'));


-- ============================================================================
-- VERIFY
-- ============================================================================

select
  (select count(*) from information_schema.columns
     where table_schema='public' and table_name='makan_space'
       and column_name in ('let_types','min_lease_months','guaranteed_rent_considered','permitted_uses')) as space_cols,
  (select count(*) from information_schema.columns
     where table_schema='public' and table_name='makan_wanted'
       and column_name in ('let_type','intended_use','lease_months')) as wanted_cols,
  (select count(*) from pg_indexes where schemaname='public'
     and indexname in ('makan_space_let_types_idx','makan_space_permitted_uses_idx')) as indexes;
