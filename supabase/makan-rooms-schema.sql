-- ============================================================================
-- MAKAN: room-level schema
-- Run in: Supabase Dashboard -> SQL Editor -> New Query
--
-- ADDITIVE. This does not touch the existing `listings` table, which stays
-- exactly as it is until a deliberate cutover. Production currently holds 0
-- rooms, so there is no data to migrate -- the old table can simply be dropped
-- once /makan/rooms reads from here instead.
--
-- ---------------------------------------------------------------------------
-- WHY THIS SHAPE
--
-- The old model was one row per advert: `property_type` as 'Room'|'Flat'|
-- 'House', a single `price`, and `bedrooms` as an integer. A six-room HMO
-- cannot be represented in it at all, which blocks room rental, supported
-- accommodation and portfolio management simultaneously.
--
-- Five levels replace it:
--
--   place     country / region / city / district / postcode district
--   building  a physical address. HMO licence, EPC, council.
--   unit      a lettable whole inside a building: a flat, or the whole house
--   space     a room OR a whole-unit let -- the thing with a price and a status
--   listing   a PUBLICATION of a space to one audience
--
-- The split between `space` and `listing` is the important one, and the reason
-- the rest works. A room is a physical fact. A listing is a decision to
-- advertise it, to a particular audience, at a particular price. Keeping them
-- apart gives us, for free:
--
--   * the same room advertised publicly AND privately to a named commissioner
--   * occupied rooms that still exist in the system, with notice dates
--   * relisting without re-entering anything
--   * price history
--   * the audit trail supported accommodation legally requires
--
-- Merge them and all of that has to be rebuilt later.
--
-- `bed` is deliberately not modelled. It only matters for hostel-style shared
-- rooms and can be added as a child of `space` later without migrating
-- anything. `area` folds into the `place` tree rather than being its own level.
--
-- Coordinates are plain numerics here, not PostGIS geography. PostGIS arrives
-- with the map work; enabling it early would make this migration fail on a
-- project that does not have the extension. Adding a geography column later is
-- a one-line ALTER.
-- ============================================================================


-- ============================================================================
-- 1. ORGANISATIONS
--
-- A provider is an organisation with members, not a single user account. The
-- existing `profiles.role` cannot express "Sarah at Midland Supported Living
-- can edit vacancies but not billing", and every permission below hangs off
-- org membership rather than off the individual.
-- ============================================================================

create table if not exists public.makan_org (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,

  -- What this organisation is here to do. Drives which surfaces it can see:
  -- only providers and commissioners ever see a private vacancy.
  kind text not null check (kind in ('landlord', 'provider', 'referrer', 'commissioner')),

  contact_email text,
  contact_phone text,

  -- Verification. Each column records the identifier that was checked, and
  -- `verified_at` is set only once a human or an API has actually confirmed it.
  -- Nothing here is displayed as a badge unless verified_at is non-null --
  -- a verification system that overstates is worse than none.
  companies_house_number text,
  cqc_provider_id text,
  charity_number text,
  verified_at timestamptz,
  verified_note text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.makan_org_member (
  org_id uuid not null references public.makan_org(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create index if not exists makan_org_member_user_idx on public.makan_org_member(user_id);


-- ============================================================================
-- 2. PLACE TREE
--
-- Self-referencing so /makan/rooms/west-midlands/birmingham/selly-oak works
-- without a separate table per level, and so a search for Birmingham can pick
-- up everything beneath it.
-- ============================================================================

create table if not exists public.makan_place (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.makan_place(id) on delete cascade,
  kind text not null check (kind in ('country', 'region', 'city', 'district', 'postcode_district')),
  name text not null,
  slug text not null,

  -- ISO country code, ONS code, or postcode district ('B29'). Whatever
  -- identifier is canonical for this kind of place.
  code text,

  lat numeric(9, 6),
  lng numeric(9, 6),

  created_at timestamptz not null default now(),
  unique (parent_id, slug)
);

create index if not exists makan_place_parent_idx on public.makan_place(parent_id);
create index if not exists makan_place_code_idx on public.makan_place(code);


-- ============================================================================
-- 3. BUILDING -> UNIT -> SPACE
-- ============================================================================

create table if not exists public.makan_building (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.makan_org(id) on delete cascade,
  place_id uuid references public.makan_place(id) on delete set null,

  address_line1 text not null,
  address_line2 text,
  city text not null,
  postcode text not null,
  lat numeric(9, 6),
  lng numeric(9, 6),

  -- Checked against the council's public HMO register during verification.
  -- This is what makes "authority to let" a real badge rather than a claim.
  hmo_licence_number text,
  hmo_licence_expires date,
  council text,
  epc_rating text check (epc_rating is null or epc_rating in ('A','B','C','D','E','F','G')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists makan_building_org_idx on public.makan_building(org_id);
create index if not exists makan_building_place_idx on public.makan_building(place_id);
create index if not exists makan_building_postcode_idx on public.makan_building(postcode);

create table if not exists public.makan_unit (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.makan_building(id) on delete cascade,

  label text not null,                       -- 'Flat 1', 'Whole house', 'Ground floor'
  unit_type text not null check (unit_type in ('house', 'flat', 'studio', 'maisonette', 'bungalow')),
  bedrooms int check (bedrooms is null or bedrooms >= 0),
  bathrooms int check (bathrooms is null or bathrooms >= 0),

  -- Nullable on purpose, and only ever set from a document or a tape measure.
  -- Never inferred from a photo or a video: a wrong room size in a listing is
  -- a misleading action under the CPRs, and the liability sits with us.
  floor_area_sqm numeric(7, 2),

  council_tax_band text check (council_tax_band is null or council_tax_band in ('A','B','C','D','E','F','G','H')),

  -- Shared facilities, which is the room-rental information portals bury.
  shared_kitchen boolean not null default true,
  shared_bathrooms int,
  shared_living_room boolean not null default false,
  garden boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists makan_unit_building_idx on public.makan_unit(building_id);

-- The lifecycle. The old three values (active/pending/inactive) cannot express
-- what an HMO landlord or a provider actually needs to record.
--
-- `assessment_pending` is supported-accommodation only and must never render
-- on a public surface -- the RLS policies below enforce that rather than
-- relying on the UI to remember.
create table if not exists public.makan_space (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.makan_unit(id) on delete cascade,

  kind text not null check (kind in ('room', 'whole_unit')),
  label text not null,                       -- 'Room 3', 'Attic room', 'Whole flat'

  ensuite boolean not null default false,
  furnished text check (furnished is null or furnished in ('furnished', 'part_furnished', 'unfurnished')),
  floor_area_sqm numeric(7, 2),

  rent_pcm int check (rent_pcm is null or rent_pcm >= 0),
  bills_included boolean not null default false,
  deposit int check (deposit is null or deposit >= 0),

  status text not null default 'offline' check (status in (
    'available_now',
    'available_from',
    'notice_given',
    'reserved',
    'assessment_pending',
    'occupied',
    'maintenance',
    'offline'
  )),
  available_from date,
  notice_date date,

  -- The freshness signal, and the single most valuable column in this schema.
  -- Every portal is full of ghosts because their data is agent-fed and stale.
  -- "Availability confirmed 2 hours ago" is only possible if we record when an
  -- operator last touched the row, so the Room Manager stamps this on every
  -- status change and on an explicit "still available" confirmation.
  status_confirmed_at timestamptz not null default now(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists makan_space_unit_idx on public.makan_space(unit_id);
create index if not exists makan_space_status_idx on public.makan_space(status);
create index if not exists makan_space_stale_idx on public.makan_space(status_confirmed_at);


-- ============================================================================
-- 4. LISTING -- a publication of a space, to an audience
--
-- `channel` is what makes a private vacancy possible, and it is the part no
-- incumbent can copy: portals monetise public exposure, so a listing visible
-- to three named commissioners is worth nothing to their model.
-- ============================================================================

create table if not exists public.makan_listing (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.makan_space(id) on delete cascade,

  channel text not null default 'public' check (channel in (
    'public',          -- anyone, indexed
    'commissioners',   -- only orgs granted in makan_listing_audience
    'link_only'        -- anyone with the id, never indexed, never in search
  )),

  headline text,
  description text,

  -- May differ from the space's default rent: the same room can be offered to
  -- a commissioner at a different rate than to the open market.
  rent_pcm int check (rent_pcm is null or rent_pcm >= 0),

  published_at timestamptz,
  expires_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists makan_listing_space_idx on public.makan_listing(space_id);
create index if not exists makan_listing_live_idx on public.makan_listing(channel, published_at)
  where published_at is not null;

create table if not exists public.makan_listing_audience (
  listing_id uuid not null references public.makan_listing(id) on delete cascade,
  org_id uuid not null references public.makan_org(id) on delete cascade,
  granted_at timestamptz not null default now(),
  primary key (listing_id, org_id)
);

create index if not exists makan_listing_audience_org_idx on public.makan_listing_audience(org_id);


-- ============================================================================
-- 5. MEDIA
--
-- `provenance` is recorded, not guessed, and is shown to the user. Enhancement
-- that changes a material fact -- removing damp, adding furniture that is not
-- included -- is prohibited by policy, not merely labelled.
-- ============================================================================

create table if not exists public.makan_media (
  id uuid primary key default gen_random_uuid(),
  space_id uuid references public.makan_space(id) on delete cascade,
  unit_id uuid references public.makan_unit(id) on delete cascade,
  building_id uuid references public.makan_building(id) on delete cascade,

  url text not null,
  kind text not null default 'photo' check (kind in ('photo', 'video', 'floor_plan', 'document')),
  provenance text not null default 'uploaded' check (provenance in ('captured_in_app', 'uploaded', 'ai_enhanced', 'staged', 'concept')),
  caption text,
  sort_order int not null default 0,

  created_at timestamptz not null default now(),

  -- Media hangs off exactly one level.
  constraint makan_media_one_parent check (
    (space_id is not null)::int + (unit_id is not null)::int + (building_id is not null)::int = 1
  )
);

create index if not exists makan_media_space_idx on public.makan_media(space_id);


-- ============================================================================
-- 6. AUDIT -- append only
--
-- Every status change and every visibility change. There is no update or
-- delete grant on this table for anyone, including org owners: a record that
-- can be edited is not a record. This is what protects both sides of a
-- supported-accommodation placement.
-- ============================================================================

create table if not exists public.makan_audit (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  org_id uuid references public.makan_org(id) on delete set null,

  entity text not null,                      -- 'space' | 'listing' | 'building' | ...
  entity_id uuid not null,
  action text not null,                      -- 'status_changed' | 'published' | ...
  before jsonb,
  after jsonb,

  created_at timestamptz not null default now()
);

create index if not exists makan_audit_entity_idx on public.makan_audit(entity, entity_id);
create index if not exists makan_audit_org_idx on public.makan_audit(org_id, created_at desc);


-- ============================================================================
-- 7. HELPERS
--
-- Every cross-table check a policy needs lives in a security definer function.
-- That is not a style preference: policies that reach into each other's tables
-- with inline EXISTS deadlock. A first draft had makan_space_read querying
-- makan_unit while makan_unit_read queried makan_space, and Postgres rejects
-- that at query time -- "infinite recursion detected in policy for relation".
--
-- It does not show up when you test as a superuser, because superusers bypass
-- RLS entirely. It shows up the first time a real user loads the page.
--
-- Queries inside a definer function run as the function owner and so are not
-- re-filtered by RLS, which breaks the cycle. search_path is pinned on every
-- one -- without it a definer function is a privilege escalation waiting to
-- happen.
-- ============================================================================

create or replace function public.makan_is_member(target_org uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.makan_org_member m
    where m.org_id = target_org and m.user_id = auth.uid()
  );
$$;

create or replace function public.makan_can_write(target_org uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.makan_org_member m
    where m.org_id = target_org
      and m.user_id = auth.uid()
      and m.role in ('owner', 'admin', 'member')
  );
$$;

-- Ownership lookups. Each takes the foreign key that is present on the row
-- being checked, so the same function works for INSERT -- where the row itself
-- is not yet visible -- as for SELECT.
create or replace function public.makan_building_org(target_building uuid)
returns uuid language sql security definer stable set search_path = public as $$
  select b.org_id from public.makan_building b where b.id = target_building;
$$;

create or replace function public.makan_unit_org(target_unit uuid)
returns uuid language sql security definer stable set search_path = public as $$
  select b.org_id
  from public.makan_unit u join public.makan_building b on b.id = u.building_id
  where u.id = target_unit;
$$;

create or replace function public.makan_space_org(target_space uuid)
returns uuid language sql security definer stable set search_path = public as $$
  select b.org_id
  from public.makan_space s
  join public.makan_unit u on u.id = s.unit_id
  join public.makan_building b on b.id = u.building_id
  where s.id = target_space;
$$;

-- Is this listing reachable by the caller? Public listings are visible to
-- everyone including anon. Commissioner listings only to orgs explicitly
-- granted the audience. link_only is never visible through browsing -- it is
-- fetched by id through a server route.
create or replace function public.makan_listing_visible(target_listing uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.makan_listing l
    where l.id = target_listing
      and l.published_at is not null
      and (l.expires_at is null or l.expires_at > now())
      and (
        l.channel = 'public'
        or (l.channel = 'commissioners' and exists (
          select 1 from public.makan_listing_audience a
          join public.makan_org_member m on m.org_id = a.org_id
          where a.listing_id = l.id and m.user_id = auth.uid()
        ))
      )
  );
$$;

create or replace function public.makan_space_is_visible(target_space uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.makan_listing l
    where l.space_id = target_space and public.makan_listing_visible(l.id)
  );
$$;

create or replace function public.makan_unit_visible(target_unit uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.makan_space s
    where s.unit_id = target_unit and public.makan_space_is_visible(s.id)
  );
$$;

create or replace function public.makan_building_visible(target_building uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.makan_unit u
    where u.building_id = target_building and public.makan_unit_visible(u.id)
  );
$$;


-- ============================================================================
-- 8. ROW LEVEL SECURITY
--
-- Written before the UI, on purpose. Permissioned vacancy data has to be
-- unreachable even if an API route is wrong, so access control lives in
-- Postgres rather than in middleware.
-- ============================================================================

alter table public.makan_org              enable row level security;
alter table public.makan_org_member       enable row level security;
alter table public.makan_place            enable row level security;
alter table public.makan_building         enable row level security;
alter table public.makan_unit             enable row level security;
alter table public.makan_space            enable row level security;
alter table public.makan_listing          enable row level security;
alter table public.makan_listing_audience enable row level security;
alter table public.makan_media            enable row level security;
alter table public.makan_audit            enable row level security;

-- Places are reference data.
drop policy if exists makan_place_read on public.makan_place;
create policy makan_place_read on public.makan_place for select using (true);

-- An org's public face is readable once verified; members always see their own.
drop policy if exists makan_org_read on public.makan_org;
create policy makan_org_read on public.makan_org for select
  using (verified_at is not null or public.makan_is_member(id));

drop policy if exists makan_org_write on public.makan_org;
create policy makan_org_write on public.makan_org for update
  using (public.makan_can_write(id)) with check (public.makan_can_write(id));

drop policy if exists makan_org_member_read on public.makan_org_member;
create policy makan_org_member_read on public.makan_org_member for select
  using (public.makan_is_member(org_id));

-- Buildings and units are readable by their own org, or when they carry a
-- space that a live listing exposes.
drop policy if exists makan_building_read on public.makan_building;
create policy makan_building_read on public.makan_building for select
  using (public.makan_is_member(org_id) or public.makan_building_visible(id));

drop policy if exists makan_building_write on public.makan_building;
create policy makan_building_write on public.makan_building for all
  using (public.makan_can_write(org_id))
  with check (public.makan_can_write(org_id));

drop policy if exists makan_unit_read on public.makan_unit;
create policy makan_unit_read on public.makan_unit for select
  using (public.makan_is_member(public.makan_building_org(building_id))
         or public.makan_unit_visible(id));

drop policy if exists makan_unit_write on public.makan_unit;
create policy makan_unit_write on public.makan_unit for all
  using (public.makan_can_write(public.makan_building_org(building_id)))
  with check (public.makan_can_write(public.makan_building_org(building_id)));

-- Spaces: the owning org sees everything, including offline rooms and
-- assessment_pending ones. Everyone else sees only what a live listing
-- exposes, so assessment_pending cannot leak to a public surface through a UI
-- mistake.
drop policy if exists makan_space_read on public.makan_space;
create policy makan_space_read on public.makan_space for select
  using (public.makan_is_member(public.makan_unit_org(unit_id))
         or public.makan_space_is_visible(id));

drop policy if exists makan_space_write on public.makan_space;
create policy makan_space_write on public.makan_space for all
  using (public.makan_can_write(public.makan_unit_org(unit_id)))
  with check (public.makan_can_write(public.makan_unit_org(unit_id)));

drop policy if exists makan_listing_read on public.makan_listing;
create policy makan_listing_read on public.makan_listing for select
  using (public.makan_is_member(public.makan_space_org(space_id))
         or public.makan_listing_visible(id));

drop policy if exists makan_listing_write on public.makan_listing;
create policy makan_listing_write on public.makan_listing for all
  using (public.makan_can_write(public.makan_space_org(space_id)))
  with check (public.makan_can_write(public.makan_space_org(space_id)));

drop policy if exists makan_listing_audience_read on public.makan_listing_audience;
create policy makan_listing_audience_read on public.makan_listing_audience for select
  using (public.makan_is_member(org_id));

drop policy if exists makan_listing_audience_write on public.makan_listing_audience;
create policy makan_listing_audience_write on public.makan_listing_audience for all
  using (public.makan_can_write(public.makan_space_org(
           (select l.space_id from public.makan_listing l where l.id = listing_id))))
  with check (public.makan_can_write(public.makan_space_org(
           (select l.space_id from public.makan_listing l where l.id = listing_id))));

-- Media follows whatever it hangs off.
drop policy if exists makan_media_read on public.makan_media;
create policy makan_media_read on public.makan_media for select
  using (
    case
      when space_id    is not null then public.makan_space_is_visible(space_id)
                                     or public.makan_is_member(public.makan_space_org(space_id))
      when unit_id     is not null then public.makan_unit_visible(unit_id)
                                     or public.makan_is_member(public.makan_unit_org(unit_id))
      when building_id is not null then public.makan_building_visible(building_id)
                                     or public.makan_is_member(public.makan_building_org(building_id))
      else false
    end
  );

drop policy if exists makan_media_write on public.makan_media;
create policy makan_media_write on public.makan_media for all
  using (
    case
      when space_id    is not null then public.makan_can_write(public.makan_space_org(space_id))
      when unit_id     is not null then public.makan_can_write(public.makan_unit_org(unit_id))
      when building_id is not null then public.makan_can_write(public.makan_building_org(building_id))
      else false
    end
  )
  with check (
    case
      when space_id    is not null then public.makan_can_write(public.makan_space_org(space_id))
      when unit_id     is not null then public.makan_can_write(public.makan_unit_org(unit_id))
      when building_id is not null then public.makan_can_write(public.makan_building_org(building_id))
      else false
    end
  );

-- Audit: members read their own org's trail. Insert is allowed; update and
-- delete are granted to nobody, which is the entire point of the table.
drop policy if exists makan_audit_read on public.makan_audit;
create policy makan_audit_read on public.makan_audit for select
  using (org_id is not null and public.makan_is_member(org_id));

drop policy if exists makan_audit_insert on public.makan_audit;
create policy makan_audit_insert on public.makan_audit for insert
  with check (org_id is not null and public.makan_is_member(org_id));


-- ============================================================================
-- 9. TRIGGERS
-- ============================================================================

create or replace function public.makan_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['makan_org','makan_building','makan_unit','makan_space','makan_listing']
  loop
    execute format('drop trigger if exists %1$s_touch on public.%1$s', t);
    execute format(
      'create trigger %1$s_touch before update on public.%1$s
       for each row execute function public.makan_touch_updated_at()', t);
  end loop;
end $$;

-- Any change to a space's status re-stamps the freshness clock and writes the
-- audit row, so neither depends on the application remembering to do it.
create or replace function public.makan_space_status_audit()
returns trigger language plpgsql security definer set search_path = public as $$
declare owner_org uuid;
begin
  if new.status is distinct from old.status then
    new.status_confirmed_at = now();

    select b.org_id into owner_org
    from public.makan_unit u join public.makan_building b on b.id = u.building_id
    where u.id = new.unit_id;

    insert into public.makan_audit (actor_id, org_id, entity, entity_id, action, before, after)
    values (auth.uid(), owner_org, 'space', new.id, 'status_changed',
            jsonb_build_object('status', old.status),
            jsonb_build_object('status', new.status));
  end if;
  return new;
end;
$$;

drop trigger if exists makan_space_status_audit_trg on public.makan_space;
create trigger makan_space_status_audit_trg
  before update on public.makan_space
  for each row execute function public.makan_space_status_audit();


-- ============================================================================
-- 10. VERIFY
-- ============================================================================

select table_name,
       (select count(*) from information_schema.columns c
        where c.table_schema = 'public' and c.table_name = t.table_name) as columns
from information_schema.tables t
where table_schema = 'public' and table_name like 'makan\_%'
order by table_name;

select tablename, count(*) as policies
from pg_policies where schemaname = 'public' and tablename like 'makan\_%'
group by tablename order by tablename;
