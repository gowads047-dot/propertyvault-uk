-- ============================================================================
-- MAKAN: create your organisation and put yourself in it
--
-- Run AFTER makan-rooms-schema.sql, in: Supabase Dashboard -> SQL Editor.
--
-- STATUS: BLOCK 1 was run against production on 2026-08-28 for
-- gowads_18@hotmail.co.uk, which now owns the org "PropertyVault Rooms"
-- (slug propertyvault-rooms). BLOCK 2 was deliberately NOT run — the sample
-- building is invented data and this is a live database.
--
-- Rooms belong to an organisation rather than to a single account, so the Room
-- Manager needs you to be a member of one before it will show you anything.
-- This creates that organisation and adds you as its owner.
--
-- BEFORE YOU RUN IT: change the email on the v_email line below to whatever
-- address you signed up to Makan with at /makan/auth. If you have not signed
-- up yet, do that first -- this script cannot create the account for you, and
-- it will stop with a clear message rather than doing half the job.
--
-- Safe to run more than once. Nothing here is public: the organisation is
-- private until it is verified, and BLOCK 2's sample rooms are created
-- unlisted, so no listing exists and nothing can appear in search.
-- ============================================================================


-- ============================================================================
-- BLOCK 1 — your organisation. Required.
-- ============================================================================

do $$
declare
  -- ↓↓↓ CHANGE THIS to your Makan sign-in email ↓↓↓
  v_email text := 'gowads_18@hotmail.co.uk';

  v_user uuid;
  v_org  uuid;
begin
  select id into v_user from auth.users where lower(email) = lower(v_email);

  if v_user is null then
    raise exception
      'No Makan account found for %. Sign up at /makan/auth first, then run this again.', v_email;
  end if;

  -- The handle_new_user trigger on auth.users normally creates this. Belt and
  -- braces in case the account predates it.
  insert into public.profiles (id, name)
  values (v_user, split_part(v_email, '@', 1))
  on conflict (id) do nothing;

  insert into public.makan_org (name, slug, kind)
  values ('PropertyVault Rooms', 'propertyvault-rooms', 'landlord')
  on conflict (slug) do update set name = excluded.name
  returning id into v_org;

  insert into public.makan_org_member (org_id, user_id, role)
  values (v_org, v_user, 'owner')
  on conflict (org_id, user_id) do update set role = 'owner';

  raise notice 'Done. Org % now has % as owner.', v_org, v_email;
end $$;


-- ============================================================================
-- BLOCK 2 — four sample rooms, so the Room Manager has something to show.
--
-- OPTIONAL. Skip it if you would rather add a real building through the app.
--
-- The address is invented and the rooms are deliberately given a spread of
-- statuses so you can see the filter chips, the staleness marker and the
-- freshness column doing their jobs. Room 4 is backdated 45 days so it trips
-- the "not confirmed for 30 days" amber flag.
--
-- No listing rows are created, so none of this is visible to anyone but you.
-- To remove it afterwards:
--
--   delete from public.makan_building where id = '5eed0000-0000-4000-8000-000000000001';
--
-- which cascades to the unit and all four rooms.
-- ============================================================================

do $$
declare
  v_org      uuid;
  v_building uuid := '5eed0000-0000-4000-8000-000000000001';
  v_unit     uuid := '5eed0000-0000-4000-8000-000000000002';
begin
  select id into v_org from public.makan_org where slug = 'propertyvault-rooms';
  if v_org is null then
    raise exception 'Run BLOCK 1 first.';
  end if;

  insert into public.makan_building (id, org_id, address_line1, city, postcode, council)
  values (v_building, v_org, 'SAMPLE — 12 Chapel Street', 'Birmingham', 'B29 6AA', 'Birmingham City Council')
  on conflict (id) do nothing;

  insert into public.makan_unit (id, building_id, label, unit_type, bedrooms, bathrooms, shared_kitchen, shared_bathrooms)
  values (v_unit, v_building, 'Whole house', 'house', 4, 2, true, 2)
  on conflict (id) do nothing;

  insert into public.makan_space
    (id, unit_id, kind, label, ensuite, furnished, rent_pcm, bills_included, status, available_from, status_confirmed_at)
  values
    ('5eed0000-0000-4000-8000-000000000101', v_unit, 'room', 'Room 1', true,  'furnished', 650, true,  'available_now',  null,             now()),
    ('5eed0000-0000-4000-8000-000000000102', v_unit, 'room', 'Room 2', false, 'furnished', 575, true,  'occupied',       null,             now() - interval '6 days'),
    ('5eed0000-0000-4000-8000-000000000103', v_unit, 'room', 'Room 3', false, 'furnished', 600, true,  'notice_given',   current_date + 21, now() - interval '2 days'),
    -- Backdated so it shows up as needing confirmation and sorts to the top.
    ('5eed0000-0000-4000-8000-000000000104', v_unit, 'room', 'Room 4', true,  'furnished', 695, false, 'available_now',  null,             now() - interval '45 days')
  on conflict (id) do nothing;

  raise notice 'Sample building added: 4 rooms, none listed publicly.';
end $$;


-- ============================================================================
-- VERIFY — what you should see in the Room Manager
-- ============================================================================

select
  b.address_line1 as building,
  s.label         as room,
  s.status,
  s.rent_pcm,
  date_trunc('minute', now() - s.status_confirmed_at) as unconfirmed_for
from public.makan_space s
join public.makan_unit u     on u.id = s.unit_id
join public.makan_building b on b.id = u.building_id
join public.makan_org_member m on m.org_id = b.org_id
where m.user_id = auth.uid()
order by s.label;
