-- ============================================================================
-- MAKAN: enquiries
-- Run in: Supabase Dashboard -> SQL Editor. Requires makan-rooms-schema.sql.
--
-- Sending an enquiry on a property portal today is posting into a void: you
-- fill a form, get "your message has been sent", and never learn whether a
-- human read it. Renters answer that by messaging ten landlords and hoping,
-- which makes every landlord's inbox worse, which makes replies slower.
--
-- Two tables rather than one, because the enquiry is a thread with a state,
-- not a single message. The state is what lets the renter see "read 2 hours
-- ago" instead of nothing at all, and it is recorded by the landlord's client
-- actually opening it -- not assumed.
-- ============================================================================

create table if not exists public.makan_enquiry (
  id uuid primary key default gen_random_uuid(),

  space_id uuid not null references public.makan_space(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,

  -- Optional context the landlord actually wants before replying. Kept on the
  -- thread rather than buried in the first message so it stays scannable.
  move_in date,
  phone text,

  status text not null default 'new' check (status in ('new', 'read', 'replied', 'closed')),
  read_at timestamptz,
  replied_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One open thread per person per room. A renter chasing a reply should bump
  -- the existing thread, not start a second one the landlord has to reconcile.
  unique (space_id, sender_id)
);

create index if not exists makan_enquiry_space_idx on public.makan_enquiry(space_id);
create index if not exists makan_enquiry_sender_idx on public.makan_enquiry(sender_id);
create index if not exists makan_enquiry_unread_idx
  on public.makan_enquiry(status, created_at desc) where status = 'new';

create table if not exists public.makan_enquiry_message (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.makan_enquiry(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists makan_enquiry_message_thread_idx
  on public.makan_enquiry_message(enquiry_id, created_at);


-- ============================================================================
-- Helpers
-- ============================================================================

-- Can the caller act as the landlord on this thread? security definer for the
-- same reason as everywhere else here: a policy reading makan_org_member
-- directly would recurse against that table's own policy.
create or replace function public.makan_enquiry_is_landlord(target uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.makan_enquiry e
    where e.id = target
      and public.makan_is_member(public.makan_space_org(e.space_id))
  );
$$;

create or replace function public.makan_enquiry_is_sender(target uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.makan_enquiry e
    where e.id = target and e.sender_id = auth.uid()
  );
$$;


-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.makan_enquiry enable row level security;
alter table public.makan_enquiry_message enable row level security;

-- Exactly two parties see a thread: the person who sent it and the org that
-- owns the room. Nobody else, including other members of the public.
drop policy if exists makan_enquiry_read on public.makan_enquiry;
create policy makan_enquiry_read on public.makan_enquiry for select
  using (sender_id = auth.uid() or public.makan_is_member(public.makan_space_org(space_id)));

-- You may only enquire as yourself, and only about a room you can actually
-- see. Without the visibility check a signed-in user could enumerate space ids
-- and enquire about unpublished or commissioner-only rooms, which would leak
-- their existence.
drop policy if exists makan_enquiry_insert on public.makan_enquiry;
create policy makan_enquiry_insert on public.makan_enquiry for insert
  with check (sender_id = auth.uid() and public.makan_space_is_visible(space_id));

-- Only the landlord moves the thread's state. A sender marking their own
-- enquiry "replied" would make the whole signal worthless.
drop policy if exists makan_enquiry_update on public.makan_enquiry;
create policy makan_enquiry_update on public.makan_enquiry for update
  using (public.makan_is_member(public.makan_space_org(space_id)))
  with check (public.makan_is_member(public.makan_space_org(space_id)));

drop policy if exists makan_enquiry_message_read on public.makan_enquiry_message;
create policy makan_enquiry_message_read on public.makan_enquiry_message for select
  using (public.makan_enquiry_is_sender(enquiry_id) or public.makan_enquiry_is_landlord(enquiry_id));

-- Either party may add to a thread they are on, as themselves.
drop policy if exists makan_enquiry_message_insert on public.makan_enquiry_message;
create policy makan_enquiry_message_insert on public.makan_enquiry_message for insert
  with check (
    author_id = auth.uid()
    and (public.makan_enquiry_is_sender(enquiry_id) or public.makan_enquiry_is_landlord(enquiry_id))
  );

-- No update, no delete, for anyone. A message somebody can edit after the fact
-- is not a record of what was said.


-- ============================================================================
-- Triggers
-- ============================================================================

drop trigger if exists makan_enquiry_touch on public.makan_enquiry;
create trigger makan_enquiry_touch before update on public.makan_enquiry
  for each row execute function public.makan_touch_updated_at();

-- A landlord message is what "replied" means. Deriving it from the messages
-- rather than trusting the client to set a flag keeps the renter-facing signal
-- honest.
create or replace function public.makan_enquiry_mark_replied()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.makan_enquiry e
     set status = 'replied',
         replied_at = coalesce(e.replied_at, now())
   where e.id = new.enquiry_id
     and e.sender_id <> new.author_id
     and e.status <> 'closed';
  return new;
end;
$$;

drop trigger if exists makan_enquiry_replied_trg on public.makan_enquiry_message;
create trigger makan_enquiry_replied_trg
  after insert on public.makan_enquiry_message
  for each row execute function public.makan_enquiry_mark_replied();


-- ============================================================================
-- VERIFY
-- ============================================================================

select
  (select count(*) from information_schema.columns
     where table_schema='public' and table_name like 'makan_enquiry%') as columns,
  (select count(*) from pg_policies
     where schemaname='public' and tablename like 'makan_enquiry%') as policies,
  (select count(*) from pg_class
     where relnamespace='public'::regnamespace and relname like 'makan_enquiry%'
       and relkind='r' and relrowsecurity) as rls_on;


-- ============================================================================
-- Responsiveness, as an aggregate only
--
-- The renter-facing "usually replies within N hours" cannot be computed by the
-- client: RLS means a renter sees only their own threads, which is correct and
-- must stay that way. This returns the aggregate and nothing else -- no ids,
-- no bodies, no counterparties -- and only once there are enough replied
-- threads for the number to mean anything.
--
-- The floor matches MIN_SAMPLE_FOR_RESPONSIVENESS in src/lib/makan-enquiry.ts.
-- Below it the function returns no row, and the UI shows nothing rather than
-- something encouraging.
-- ============================================================================

create or replace function public.makan_org_responsiveness(target_org uuid)
returns table (replied_count int, median_minutes numeric)
language sql security definer stable set search_path = public as $$
  with gaps as (
    select extract(epoch from (e.replied_at - e.created_at)) / 60 as mins
    from public.makan_enquiry e
    join public.makan_space s on s.id = e.space_id
    join public.makan_unit u on u.id = s.unit_id
    join public.makan_building b on b.id = u.building_id
    where b.org_id = target_org
      and e.replied_at is not null
      and e.replied_at >= e.created_at
  )
  select count(*)::int, percentile_cont(0.5) within group (order by mins)
  from gaps
  having count(*) >= 3;
$$;

-- anon and authenticated are Supabase's roles; a bare Postgres (which is what
-- the test suite runs the migration against) has neither. Granting
-- unconditionally made this file fail everywhere except Supabase.
do $grant$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    grant execute on function public.makan_org_responsiveness(uuid) to anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    grant execute on function public.makan_org_responsiveness(uuid) to authenticated;
  end if;
end
$grant$;
