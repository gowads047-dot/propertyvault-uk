-- profiles: who may read whose row.
--
-- Found 20 Sep 2026. The table holds every user's name, phone and WhatsApp
-- number, and its only select policy was "Public profiles viewable" with
-- using (true): anyone holding the anon key — which is in the page source —
-- could list every landlord's phone number with one request. The number is
-- meant to be public only for a Makan landlord with a live listing; a
-- Rentura landlord who typed theirs into Settings never agreed to that.
--
-- A row is readable when the reader has a reason to see it:
--   - it is their own;
--   - its owner has an active listing (the listing page shows name +
--     WhatsApp so viewers can get in touch);
--   - the two of them are on opposite ends of an enquiry (the inbox shows
--     the other party's name);
--   - its owner sent a Makan enquiry to a space the reader's organisation
--     lets (the org inbox shows the sender's name).
--
-- Paste into the SQL editor; the connector refuses policy DDL.

drop policy if exists "Public profiles viewable" on public.profiles;

create policy "Profiles visible with a reason"
  on public.profiles
  for select
  using (
    (select auth.uid()) = id
    or exists (
      select 1 from public.listings l
      where l.user_id = profiles.id and l.status = 'active'
    )
    or exists (
      select 1 from public.enquiries e
      where (e.sender_id = profiles.id and e.recipient_id = (select auth.uid()))
         or (e.recipient_id = profiles.id and e.sender_id = (select auth.uid()))
    )
    or exists (
      select 1 from public.makan_enquiry me
      where me.sender_id = profiles.id and public.makan_enquiry_is_landlord(me.id)
    )
  );
