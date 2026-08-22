-- Run this in Supabase dashboard → SQL Editor

-- Enquiries from /contact.
--
-- The form used to post straight to formsubmit.co, which returned a success
-- page and delivered nothing: the destination address was never activated, so
-- every enquiry was accepted and discarded. Writing the enquiry here first
-- means a lead is never lost to an email provider being unavailable — the
-- email is a notification, not the system of record.

create table if not exists contact_messages (
  id          uuid        default gen_random_uuid() primary key,
  name        text        not null,
  email       text        not null,
  subject     text,
  message     text        not null,
  -- Which form it came from: contact, guaranteed-rent, list-property,
  -- makan-wanted. All four used to post to FormSubmit and all four were
  -- dropping enquiries.
  source      text        default 'contact',
  -- Form-specific extras kept structured rather than flattened into the
  -- message: phone and postcode for guaranteed rent, property details for
  -- list-property, and so on.
  details     jsonb,
  emailed     boolean     default false,
  created_at  timestamptz default now()
);

-- Answering "what came in today" and "what still needs emailing on".
create index if not exists contact_messages_created_idx on contact_messages (created_at desc);
create index if not exists contact_messages_unemailed_idx on contact_messages (created_at desc) where emailed = false;
create index if not exists contact_messages_source_idx on contact_messages (source, created_at desc);

alter table contact_messages enable row level security;

-- The website (anon key) may leave a message and nothing else. No select
-- policy for anon: enquiries contain other people's names, addresses and
-- circumstances, and must not be readable from the browser.
create policy "anon can insert" on contact_messages
  for insert to anon with check (true);

create policy "service role can read" on contact_messages
  for select to service_role using (true);

create policy "service role can update" on contact_messages
  for update to service_role using (true);
