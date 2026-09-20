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
