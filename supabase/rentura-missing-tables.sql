-- ============================================================
-- RENTURA: Missing tables & columns for document scanner + contacts
-- Safe to run — all statements use IF NOT EXISTS / IF NOT EXISTS guards
-- ============================================================

-- ── Expenses (log_expense action from scanner + chat) ─────────────────────────
create table if not exists rentura_expenses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  property_id uuid references rentura_properties(id) on delete cascade,
  category    text not null default 'other',
  description text not null,
  amount      numeric(10,2) not null default 0,
  date        date not null default current_date,
  receipt_url text,
  notes       text,
  created_at  timestamptz default now()
);

alter table rentura_expenses enable row level security;
create policy "own_expenses" on rentura_expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists idx_expenses_user_id     on rentura_expenses(user_id);
create index if not exists idx_expenses_property_id on rentura_expenses(property_id);
create index if not exists idx_expenses_date        on rentura_expenses(date desc);

-- ── Income (log_income action from scanner + chat) ────────────────────────────
create table if not exists rentura_income (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  property_id uuid references rentura_properties(id) on delete cascade,
  type        text not null default 'rent',
  amount      numeric(10,2) not null default 0,
  date        date not null default current_date,
  notes       text,
  created_at  timestamptz default now()
);

alter table rentura_income enable row level security;
create policy "own_income" on rentura_income
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists idx_income_user_id     on rentura_income(user_id);
create index if not exists idx_income_property_id on rentura_income(property_id);
create index if not exists idx_income_date        on rentura_income(date desc);

-- ── Documents vault (save_to_documents action from scanner) ───────────────────
create table if not exists rentura_documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  property_id uuid references rentura_properties(id) on delete cascade,
  file_name   text not null,
  file_url    text not null,
  category    text not null default 'other',
  created_at  timestamptz default now()
);

alter table rentura_documents enable row level security;
create policy "own_documents" on rentura_documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists idx_documents_user_id     on rentura_documents(user_id);
create index if not exists idx_documents_property_id on rentura_documents(property_id);

-- Also create the rentura-docs storage bucket if not exists
insert into storage.buckets (id, name, public)
values ('rentura-docs', 'rentura-docs', false)
on conflict (id) do nothing;

create policy "rentura_docs_upload" on storage.objects
  for insert with check (
    bucket_id = 'rentura-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "rentura_docs_read" on storage.objects
  for select using (
    bucket_id = 'rentura-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "rentura_docs_delete" on storage.objects
  for delete using (
    bucket_id = 'rentura-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── Tenants: add missing columns ──────────────────────────────────────────────
alter table rentura_tenants add column if not exists first_name   text;
alter table rentura_tenants add column if not exists last_name    text;
alter table rentura_tenants add column if not exists status       text default 'active';
alter table rentura_tenants add column if not exists tenancy_start date;
alter table rentura_tenants add column if not exists tenancy_end   date;
alter table rentura_tenants add column if not exists tenancy_type  text default 'AST';
alter table rentura_tenants add column if not exists deposit_scheme text;

-- Backfill first_name / last_name from existing name column if present
update rentura_tenants
set
  first_name = split_part(name, ' ', 1),
  last_name  = nullif(trim(substring(name from position(' ' in name))), '')
where first_name is null and name is not null;

-- ── Mortgages: add missing columns ───────────────────────────────────────────
alter table rentura_mortgages add column if not exists mortgage_type text;
alter table rentura_mortgages add column if not exists notes         text;
