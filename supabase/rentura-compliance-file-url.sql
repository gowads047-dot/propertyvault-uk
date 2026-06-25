-- Add file attachment support to compliance records
-- Run in Supabase SQL Editor

-- Extra columns for richer compliance data
alter table rentura_compliance add column if not exists file_url text;
alter table rentura_compliance add column if not exists contractor text;
alter table rentura_compliance add column if not exists cert_reference text;

-- Storage bucket for compliance certificates
insert into storage.buckets (id, name, public)
values ('rentura-certificates', 'rentura-certificates', false)
on conflict (id) do nothing;

-- RLS: users can only manage their own files
create policy "rentura_cert_upload" on storage.objects
  for insert with check (
    bucket_id = 'rentura-certificates'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "rentura_cert_read" on storage.objects
  for select using (
    bucket_id = 'rentura-certificates'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "rentura_cert_delete" on storage.objects
  for delete using (
    bucket_id = 'rentura-certificates'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
