-- Rent Arrears Escalation
-- Run in Supabase SQL Editor

create table if not exists rentura_arrears (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade not null,
  tenant_id        uuid references rentura_tenants(id) on delete cascade not null,
  property_id      uuid references rentura_properties(id) on delete set null,
  stage            integer not null default 1 check (stage between 1 and 5),
  status           text    not null default 'active' check (status in ('active', 'resolved', 'court')),
  total_owed       numeric(10,2) not null default 0,
  monthly_rent     numeric(10,2) not null default 0,
  first_missed_date date not null,
  last_payment_date date,
  notes            text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create table if not exists rentura_arrears_events (
  id          uuid primary key default gen_random_uuid(),
  arrears_id  uuid references rentura_arrears(id) on delete cascade not null,
  user_id     uuid references auth.users(id) on delete cascade not null,
  event_type  text not null, -- opened | stage_change | payment | contact | letter_sent | note | resolved
  stage       integer,
  note        text,
  amount      numeric(10,2),
  date        date not null default current_date,
  created_at  timestamptz default now()
);

-- Indexes
create index if not exists idx_arrears_user_id    on rentura_arrears(user_id);
create index if not exists idx_arrears_tenant_id  on rentura_arrears(tenant_id);
create index if not exists idx_arrears_status     on rentura_arrears(status);
create index if not exists idx_arrears_events_arrears_id on rentura_arrears_events(arrears_id);

-- RLS
alter table rentura_arrears        enable row level security;
alter table rentura_arrears_events enable row level security;

create policy "own_arrears" on rentura_arrears
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_arrears_events" on rentura_arrears_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
