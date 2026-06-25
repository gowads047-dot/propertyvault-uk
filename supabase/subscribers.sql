-- Run this in Supabase dashboard → SQL Editor

create table if not exists subscribers (
  id          uuid        default gen_random_uuid() primary key,
  name        text        not null,
  email       text        not null,
  user_type   text,
  source      text        default 'popup',
  created_at  timestamptz default now()
);

-- Prevent duplicate emails
create unique index if not exists subscribers_email_idx on subscribers (lower(email));

-- Allow the website (anon key) to insert — but not read other people's data
alter table subscribers enable row level security;

create policy "anon can insert" on subscribers
  for insert to anon with check (true);

-- Only service role (your dashboard / admin) can read all rows
create policy "service role can read" on subscribers
  for select to service_role using (true);
