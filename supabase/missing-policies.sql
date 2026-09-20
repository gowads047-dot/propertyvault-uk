-- Found 20 Sep 2026 by comparing pg_policies with what the browser queries.
-- Paste into the SQL editor; the connector refuses policy DDL and bucket rows.
--
-- Three tables had RLS on with no policy, which PostgREST turns into an
-- empty list on read and a 42501 on write — and supabase-js returns that
-- as a value, so nothing was ever thrown or shown:
--
--   rentura_right_to_rent  every right-to-rent check a landlord saved was
--                          refused, and the list always read empty
--   tenant_issues          written by API routes (service key), read by the
--                          landlord dashboard and chat with the session —
--                          landlords never saw a tenant issue
--   tenant-attachments     the storage bucket the tenant issue pages upload
--                          to did not exist

create policy "Users manage own rtr checks"
  on public.rentura_right_to_rent
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Landlords read own tenant issues"
  on public.tenant_issues
  for select
  using ((select auth.uid()) = landlord_user_id);

-- Public read (landlords open attachments by URL from the issue thread);
-- writes only through signed upload URLs minted by /api/tenant/upload/
-- with the service key, so no insert policy for anon or authenticated.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tenant-attachments', 'tenant-attachments', true, 52428800,
  array['image/jpeg','image/png','image/webp','image/heic','video/mp4','video/quicktime','video/webm','application/pdf']
)
on conflict (id) do nothing;

-- makan_org / makan_org_member: no insert policy on either, so a landlord's
-- first publish on Makan — which creates their organisation and makes them
-- its owner (ensureOrg in src/app/makan/list/page.tsx) — was refused with
-- 42501. Only the seeded organisation could ever list. Two insert policies
-- would not be enough on their own: the page reads the new org's id back,
-- and makan_org's read policy only shows an org to its members, of which a
-- brand-new org has none. So the whole step is one function, run as
-- definer: create the org, make the caller its owner, hand back the id.
create or replace function public.makan_create_org(org_name text, org_slug text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  caller uuid := auth.uid();
  new_org uuid;
begin
  if caller is null then
    raise exception 'Sign in to create an organisation' using errcode = '42501';
  end if;
  if exists (select 1 from public.makan_org_member m where m.user_id = caller) then
    raise exception 'You already belong to an organisation' using errcode = '23505';
  end if;
  insert into public.makan_org (name, slug, kind)
  values (left(org_name, 120), left(org_slug, 120), 'landlord')
  returning id into new_org;
  insert into public.makan_org_member (org_id, user_id, role)
  values (new_org, caller, 'owner');
  return new_org;
end;
$$;
revoke all on function public.makan_create_org(text, text) from public;
grant execute on function public.makan_create_org(text, text) to authenticated;
