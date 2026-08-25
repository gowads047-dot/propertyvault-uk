-- ============================================================================
-- MAKAN: the Wanted board
-- Run in: Supabase Dashboard -> SQL Editor. Requires makan-rooms-schema.sql.
--
-- Why this exists before the search work:
--
-- Wanted is the only surface that is useful with zero supply, which is exactly
-- where Makan is. Search over nine rooms is worthless; a board of people
-- saying what they need is a reason for a landlord to turn up. Every other
-- feature gets better as inventory grows -- this one is at its most valuable
-- when there is none.
--
-- The page it replaces posted to /api/contact and emailed. Nothing was ever
-- displayed, so no landlord could answer and no poster could see they were not
-- alone. That is a contact form, not a marketplace.
-- ============================================================================

create table if not exists public.makan_wanted (
  id uuid primary key default gen_random_uuid(),

  created_by uuid not null references public.profiles(id) on delete cascade,
  -- Set when posted on behalf of a provider or council rather than by an
  -- individual. Drives the default channel below.
  org_id uuid references public.makan_org(id) on delete set null,

  kind text not null check (kind in ('room', 'whole_property', 'supported_placement')),

  -- place_id when we can resolve what they typed to the place tree; area_text
  -- is always kept, because "near the QE" is information even when it does not
  -- match a district.
  place_id uuid references public.makan_place(id) on delete set null,
  area_text text not null,

  budget_max_pcm int check (budget_max_pcm is null or budget_max_pcm >= 0),
  needed_from date,
  detail text,

  -- A provider looking to place someone must not broadcast that publicly, so
  -- supported_placement posts default to landlords_only at the application
  -- layer and the policies below enforce who can read each channel.
  channel text not null default 'public' check (channel in ('public', 'landlords_only')),

  status text not null default 'open' check (status in ('open', 'fulfilled', 'closed')),

  -- A wanted post that outlives the need is worse than none: it wastes the
  -- landlord's reply. Sixty days, then it stops being visible.
  expires_at timestamptz not null default (now() + interval '60 days'),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists makan_wanted_live_idx
  on public.makan_wanted (status, expires_at) where status = 'open';
create index if not exists makan_wanted_author_idx on public.makan_wanted (created_by);
create index if not exists makan_wanted_place_idx on public.makan_wanted (place_id);


-- ============================================================================
-- Helpers
-- ============================================================================

-- Is the caller in a position to answer a wanted post? Landlords and providers
-- hold rooms; referrers and commissioners do not, so they see only the public
-- board. security definer for the same reason as the rest: a policy that reads
-- makan_org_member directly would recurse against its own policy.
create or replace function public.makan_holds_supply()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1
    from public.makan_org_member m
    join public.makan_org o on o.id = m.org_id
    where m.user_id = auth.uid()
      and o.kind in ('landlord', 'provider')
  );
$$;

create or replace function public.makan_wanted_visible(target uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.makan_wanted w
    where w.id = target
      and w.status = 'open'
      and w.expires_at > now()
      and (w.channel = 'public' or public.makan_holds_supply())
  );
$$;


-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.makan_wanted enable row level security;

-- Anyone may read an open, unexpired public post. landlords_only posts are
-- limited to people who actually hold rooms. Authors always see their own,
-- whatever its state, so a closed post does not vanish from its owner.
drop policy if exists makan_wanted_read on public.makan_wanted;
create policy makan_wanted_read on public.makan_wanted for select
  using (created_by = auth.uid() or public.makan_wanted_visible(id));

-- You may only post as yourself. Without the created_by check a signed-in user
-- could attribute a post to somebody else.
drop policy if exists makan_wanted_insert on public.makan_wanted;
create policy makan_wanted_insert on public.makan_wanted for insert
  with check (created_by = auth.uid());

drop policy if exists makan_wanted_update on public.makan_wanted;
create policy makan_wanted_update on public.makan_wanted for update
  using (created_by = auth.uid()) with check (created_by = auth.uid());

drop policy if exists makan_wanted_delete on public.makan_wanted;
create policy makan_wanted_delete on public.makan_wanted for delete
  using (created_by = auth.uid());


-- ============================================================================
-- Triggers
-- ============================================================================

drop trigger if exists makan_wanted_touch on public.makan_wanted;
create trigger makan_wanted_touch before update on public.makan_wanted
  for each row execute function public.makan_touch_updated_at();


-- ============================================================================
-- VERIFY
-- ============================================================================

select
  (select count(*) from information_schema.columns
     where table_schema='public' and table_name='makan_wanted') as columns,
  (select count(*) from pg_policies
     where schemaname='public' and tablename='makan_wanted') as policies,
  (select relrowsecurity from pg_class
     where relnamespace='public'::regnamespace and relname='makan_wanted') as rls_on;
