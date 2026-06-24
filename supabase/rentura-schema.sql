-- ============================================================
-- RENTURA: Property Passport Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Properties (the core record)
create table if not exists rentura_properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  address text not null,
  nickname text,
  property_type text default 'house',
  bedrooms integer,
  purchase_date date,
  purchase_price numeric(12,2),
  current_value numeric(12,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Timeline Events (everything that ever happened to a property)
create table if not exists rentura_events (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references rentura_properties(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  event_type text not null,
  title text not null,
  description text,
  amount numeric(12,2),
  trust_level text default 'confirmed',
  metadata jsonb default '{}',
  event_date date default current_date,
  created_at timestamptz default now()
);

-- Tenants
create table if not exists rentura_tenants (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references rentura_properties(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  monthly_rent numeric(10,2),
  move_in_date date,
  move_out_date date,
  deposit_amount numeric(10,2),
  deposit_scheme text,
  is_current boolean default true,
  created_at timestamptz default now()
);

-- Mortgages
create table if not exists rentura_mortgages (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references rentura_properties(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  lender text,
  product_name text,
  interest_rate numeric(5,3),
  monthly_payment numeric(10,2),
  remaining_balance numeric(12,2),
  fixed_term_expiry date,
  erc_expiry date,
  svr_rate numeric(5,3),
  trust_level text default 'confirmed',
  is_current boolean default true,
  created_at timestamptz default now()
);

-- Compliance Certificates
create table if not exists rentura_compliance (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references rentura_properties(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  certificate_type text not null,
  issue_date date,
  expiry_date date,
  trust_level text default 'confirmed',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table rentura_properties enable row level security;
alter table rentura_events enable row level security;
alter table rentura_tenants enable row level security;
alter table rentura_mortgages enable row level security;
alter table rentura_compliance enable row level security;

-- Users can only see and modify their own data
create policy "own_properties" on rentura_properties
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_events" on rentura_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_tenants" on rentura_tenants
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_mortgages" on rentura_mortgages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_compliance" on rentura_compliance
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Indexes for performance
-- ============================================================

create index if not exists idx_rentura_events_property_id on rentura_events(property_id);
create index if not exists idx_rentura_events_event_date on rentura_events(event_date desc);
create index if not exists idx_rentura_tenants_property_id on rentura_tenants(property_id);
create index if not exists idx_rentura_mortgages_property_id on rentura_mortgages(property_id);
create index if not exists idx_rentura_compliance_property_id on rentura_compliance(property_id);
create index if not exists idx_rentura_compliance_expiry on rentura_compliance(expiry_date);
