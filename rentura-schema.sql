-- ============================================================
-- RENTURA — Full Production Database Schema
-- Run in Supabase SQL editor
-- ============================================================

-- Enable uuid extension
create extension if not exists "uuid-ossp";

-- ── Properties ──────────────────────────────────────────────
create table if not exists public.rentura_properties (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  address       text not null,
  nickname      text,
  property_type text not null default 'house' check (property_type in ('house','flat','hmo','commercial','other')),
  bedrooms      int,
  purchase_date date,
  purchase_price numeric(12,2),
  current_value  numeric(12,2),
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Tenants ─────────────────────────────────────────────────
create table if not exists public.rentura_tenants (
  id               uuid primary key default uuid_generate_v4(),
  property_id      uuid references public.rentura_properties(id) on delete cascade not null,
  user_id          uuid references auth.users(id) on delete cascade not null,
  name             text not null,
  email            text,
  phone            text,
  monthly_rent     numeric(10,2),
  move_in_date     date,
  move_out_date    date,
  deposit_amount   numeric(10,2),
  deposit_scheme   text,
  is_current       boolean default true,
  created_at       timestamptz default now()
);

-- ── Mortgages ───────────────────────────────────────────────
create table if not exists public.rentura_mortgages (
  id                 uuid primary key default uuid_generate_v4(),
  property_id        uuid references public.rentura_properties(id) on delete cascade not null,
  user_id            uuid references auth.users(id) on delete cascade not null,
  lender             text,
  product_name       text,
  interest_rate      numeric(5,3),
  monthly_payment    numeric(10,2),
  remaining_balance  numeric(12,2),
  fixed_term_expiry  date,
  erc_expiry         date,
  svr_rate           numeric(5,3),
  trust_level        text default 'suggested' check (trust_level in ('verified','confirmed','suggested')),
  is_current         boolean default true,
  created_at         timestamptz default now()
);

-- ── Compliance Certificates ──────────────────────────────────
create table if not exists public.rentura_compliance (
  id               uuid primary key default uuid_generate_v4(),
  property_id      uuid references public.rentura_properties(id) on delete cascade not null,
  user_id          uuid references auth.users(id) on delete cascade not null,
  certificate_type text not null,
  issue_date       date,
  expiry_date      date,
  trust_level      text default 'suggested' check (trust_level in ('verified','confirmed','suggested')),
  notes            text,
  file_url         text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── Maintenance ─────────────────────────────────────────────
create table if not exists public.rentura_maintenance (
  id               uuid primary key default uuid_generate_v4(),
  property_id      uuid references public.rentura_properties(id) on delete cascade not null,
  user_id          uuid references auth.users(id) on delete cascade not null,
  title            text not null,
  description      text,
  category         text default 'other' check (category in ('plumbing','electrical','structural','appliance','damp','roofing','other')),
  urgency          text default 'routine' check (urgency in ('emergency','urgent','routine')),
  status           text default 'open' check (status in ('open','in_progress','resolved')),
  contractor_name  text,
  contractor_phone text,
  contractor_email text,
  estimated_cost   numeric(10,2),
  actual_cost      numeric(10,2),
  reported_date    date default current_date,
  scheduled_date   date,
  resolved_date    date,
  is_improvement   boolean default false,
  notes            text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── Events / Audit Log ──────────────────────────────────────
create table if not exists public.rentura_events (
  id           uuid primary key default uuid_generate_v4(),
  property_id  uuid references public.rentura_properties(id) on delete cascade not null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  event_type   text not null,
  title        text not null,
  description  text,
  amount       numeric(10,2),
  trust_level  text default 'suggested' check (trust_level in ('verified','confirmed','suggested')),
  metadata     jsonb default '{}',
  event_date   date default current_date,
  created_at   timestamptz default now()
);

-- ── Expenses ────────────────────────────────────────────────
create table if not exists public.rentura_expenses (
  id           uuid primary key default uuid_generate_v4(),
  property_id  uuid references public.rentura_properties(id) on delete cascade not null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  category     text not null check (category in ('mortgage','insurance','maintenance','management','utilities','council_tax','compliance','professional_fees','other')),
  description  text not null,
  amount       numeric(10,2) not null,
  date         date default current_date,
  receipt_url  text,
  tax_year     text,
  created_at   timestamptz default now()
);

-- ── Income Records ──────────────────────────────────────────
create table if not exists public.rentura_income (
  id           uuid primary key default uuid_generate_v4(),
  property_id  uuid references public.rentura_properties(id) on delete cascade not null,
  tenant_id    uuid references public.rentura_tenants(id) on delete set null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  amount       numeric(10,2) not null,
  type         text default 'rent' check (type in ('rent','deposit','other')),
  date         date default current_date,
  notes        text,
  created_at   timestamptz default now()
);

-- ── Documents ───────────────────────────────────────────────
create table if not exists public.rentura_documents (
  id           uuid primary key default uuid_generate_v4(),
  property_id  uuid references public.rentura_properties(id) on delete cascade,
  tenant_id    uuid references public.rentura_tenants(id) on delete set null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  name         text not null,
  category     text not null check (category in ('tenancy','compliance','mortgage','insurance','correspondence','financial','other')),
  file_url     text not null,
  file_size    int,
  mime_type    text,
  notes        text,
  created_at   timestamptz default now()
);

-- ── Waitlist (early access signups) ─────────────────────────
create table if not exists public.rentura_waitlist (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null unique,
  portfolio  text,
  created_at timestamptz default now()
);

-- ── Subscriptions (Stripe sync) ──────────────────────────────
create table if not exists public.rentura_subscriptions (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id   text unique,
  stripe_subscription_id text unique,
  plan                 text default 'early_access',
  status               text default 'active' check (status in ('active','cancelled','past_due','trialing')),
  current_period_end   timestamptz,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- ── Indexes ──────────────────────────────────────────────────
create index if not exists rentura_properties_user_id on public.rentura_properties(user_id);
create index if not exists rentura_tenants_property_id on public.rentura_tenants(property_id);
create index if not exists rentura_tenants_user_id on public.rentura_tenants(user_id);
create index if not exists rentura_mortgages_property_id on public.rentura_mortgages(property_id);
create index if not exists rentura_compliance_property_id on public.rentura_compliance(property_id);
create index if not exists rentura_compliance_expiry on public.rentura_compliance(expiry_date);
create index if not exists rentura_maintenance_property_id on public.rentura_maintenance(property_id);
create index if not exists rentura_maintenance_status on public.rentura_maintenance(status);
create index if not exists rentura_events_property_id on public.rentura_events(property_id);
create index if not exists rentura_events_user_id on public.rentura_events(user_id);
create index if not exists rentura_expenses_property_id on public.rentura_expenses(property_id);
create index if not exists rentura_income_property_id on public.rentura_income(property_id);
create index if not exists rentura_documents_property_id on public.rentura_documents(property_id);
create index if not exists rentura_documents_user_id on public.rentura_documents(user_id);

-- ── Row Level Security ────────────────────────────────────────
alter table public.rentura_properties      enable row level security;
alter table public.rentura_tenants         enable row level security;
alter table public.rentura_mortgages       enable row level security;
alter table public.rentura_compliance      enable row level security;
alter table public.rentura_maintenance     enable row level security;
alter table public.rentura_events          enable row level security;
alter table public.rentura_expenses        enable row level security;
alter table public.rentura_income          enable row level security;
alter table public.rentura_documents       enable row level security;
alter table public.rentura_subscriptions   enable row level security;

-- Properties: users see only their own
create policy "rentura_properties_own" on public.rentura_properties
  for all using (auth.uid() = user_id);

create policy "rentura_tenants_own" on public.rentura_tenants
  for all using (auth.uid() = user_id);

create policy "rentura_mortgages_own" on public.rentura_mortgages
  for all using (auth.uid() = user_id);

create policy "rentura_compliance_own" on public.rentura_compliance
  for all using (auth.uid() = user_id);

create policy "rentura_maintenance_own" on public.rentura_maintenance
  for all using (auth.uid() = user_id);

create policy "rentura_events_own" on public.rentura_events
  for all using (auth.uid() = user_id);

create policy "rentura_expenses_own" on public.rentura_expenses
  for all using (auth.uid() = user_id);

create policy "rentura_income_own" on public.rentura_income
  for all using (auth.uid() = user_id);

create policy "rentura_documents_own" on public.rentura_documents
  for all using (auth.uid() = user_id);

create policy "rentura_subscriptions_own" on public.rentura_subscriptions
  for all using (auth.uid() = user_id);

-- Waitlist: anyone can insert, only admins read
create policy "rentura_waitlist_insert" on public.rentura_waitlist
  for insert with check (true);

-- ── Storage bucket for documents/certs ───────────────────────
insert into storage.buckets (id, name, public)
  values ('rentura-docs', 'rentura-docs', false)
  on conflict (id) do nothing;

create policy "rentura_docs_upload" on storage.objects
  for insert with check (bucket_id = 'rentura-docs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "rentura_docs_read" on storage.objects
  for select using (bucket_id = 'rentura-docs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "rentura_docs_delete" on storage.objects
  for delete using (bucket_id = 'rentura-docs' and auth.uid()::text = (storage.foldername(name))[1]);

-- ── Updated_at trigger ───────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger rentura_properties_updated_at before update on public.rentura_properties
  for each row execute procedure public.handle_updated_at();

create trigger rentura_compliance_updated_at before update on public.rentura_compliance
  for each row execute procedure public.handle_updated_at();

create trigger rentura_maintenance_updated_at before update on public.rentura_maintenance
  for each row execute procedure public.handle_updated_at();
