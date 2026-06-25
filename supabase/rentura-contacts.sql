-- Contractor and contact directory for Rentura
-- Run in Supabase SQL Editor

create table if not exists rentura_contacts (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid references auth.users(id) on delete cascade not null,
  name      text not null,
  role      text not null default 'contractor', -- contractor | agent | supplier | solicitor | other
  specialty text,   -- plumber | electrician | gas_engineer | builder | locksmith | decorator | cleaner | other
  phone     text,
  whatsapp  text,   -- normalised number for wa.me links (digits only, with country code)
  email     text,
  notes     text,
  preferred boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_contacts_user_id on rentura_contacts(user_id);
create index if not exists idx_contacts_specialty on rentura_contacts(specialty);

alter table rentura_contacts enable row level security;

create policy "own_contacts" on rentura_contacts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
