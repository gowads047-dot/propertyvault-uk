-- ============================================================================
-- Makan media storage
--
-- makan_media and its RLS already exist in makan-rooms-schema.sql. What was
-- missing is somewhere for the file itself to live, and rules about who may
-- put one there.
--
-- Paths are <space_id>/<token>.<ext>, which is what lets these policies decide
-- ownership from the path alone: the first segment is the space, and the
-- existing makan_can_write / makan_space_org helpers answer the rest. No new
-- security model, just the storage half of the one already in place.
--
-- The bucket is public-read on purpose. A listing photo is shown to anonymous
-- visitors on a public listing page, so a signed URL would have to be minted
-- per photo per page load and would expire mid-swipe. The trade is that a
-- photo attached to an unpublished draft is reachable by anyone holding the
-- URL — mitigated by the filename being a 16-character random token from a
-- 36-character alphabet, which is not guessable, but it is a trade and not an
-- absence of one. If drafts ever hold anything sensitive, move to signed URLs.
--
-- Safe to run more than once.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'makan-media',
  'makan-media',
  true,
  10485760,                                        -- 10 MB, mirrors MAX_BYTES
  array['image/jpeg', 'image/png', 'image/webp']   -- mirrors ACCEPTED_TYPES
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;


-- The space this object belongs to, or null if the path is not shaped like one.
--
-- Written as a function with an explicit regex guard rather than a bare
-- ::uuid cast in each policy: a cast on a malformed path raises, and an
-- exception inside a storage policy fails the whole request rather than
-- denying the one object.
create or replace function public.makan_media_space_of(object_name text)
returns uuid
language sql
immutable
security definer
set search_path = public
as $$
  select case
    when split_part(object_name, '/', 1) ~*
         '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then split_part(object_name, '/', 1)::uuid
    else null
  end
$$;


-- Read: anyone. The bucket is public and these are listing photos.
drop policy if exists makan_media_object_read on storage.objects;
create policy makan_media_object_read on storage.objects for select
  using (bucket_id = 'makan-media');

-- Write, update and delete: only someone who may write the space the path
-- names. An unparseable path yields a null space and is refused.
drop policy if exists makan_media_object_insert on storage.objects;
create policy makan_media_object_insert on storage.objects for insert
  with check (
    bucket_id = 'makan-media'
    and public.makan_media_space_of(name) is not null
    and public.makan_can_write(public.makan_space_org(public.makan_media_space_of(name)))
  );

drop policy if exists makan_media_object_update on storage.objects;
create policy makan_media_object_update on storage.objects for update
  using (
    bucket_id = 'makan-media'
    and public.makan_media_space_of(name) is not null
    and public.makan_can_write(public.makan_space_org(public.makan_media_space_of(name)))
  );

drop policy if exists makan_media_object_delete on storage.objects;
create policy makan_media_object_delete on storage.objects for delete
  using (
    bucket_id = 'makan-media'
    and public.makan_media_space_of(name) is not null
    and public.makan_can_write(public.makan_space_org(public.makan_media_space_of(name)))
  );


-- anon and authenticated exist on Supabase and not on a bare Postgres, so the
-- grant is conditional — the same guard the other Makan migrations use.
do $grant$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    grant execute on function public.makan_media_space_of(text) to anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    grant execute on function public.makan_media_space_of(text) to authenticated;
  end if;
end
$grant$;


-- Verification. Expect: bucket 1, policies 4, function 1.
select
  (select count(*) from storage.buckets where id = 'makan-media')            as bucket,
  (select count(*) from pg_policies
     where schemaname = 'storage' and tablename = 'objects'
       and policyname like 'makan_media_object_%')                           as policies,
  (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname = 'makan_media_space_of')      as fn;
