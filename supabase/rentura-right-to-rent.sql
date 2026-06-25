-- Right to Rent checks table
-- Run this in Supabase SQL Editor

create table if not exists rentura_right_to_rent (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  tenant_id     uuid references rentura_tenants(id) on delete cascade not null,
  document_type text not null,
  document_ref  text,
  check_date    date not null,
  time_limited  boolean not null default false,
  expiry_date   date,
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Index for fast per-tenant lookups
create index if not exists idx_rtr_tenant_id on rentura_right_to_rent(tenant_id);
create index if not exists idx_rtr_user_id   on rentura_right_to_rent(user_id);
create index if not exists idx_rtr_expiry    on rentura_right_to_rent(expiry_date) where time_limited = true;

-- Row-level security: landlord sees only their own checks
alter table rentura_right_to_rent enable row level security;

create policy "Users manage own rtr checks"
  on rentura_right_to_rent
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
