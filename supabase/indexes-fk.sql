-- Covering indexes for the foreign keys the app filters by, and the eleven
-- pairs of identical indexes the Rentura schema had ended up with (each
-- table got its index from two files with different naming habits).
--
-- From Supabase's performance advisor, 20 Sep 2026. Applied to production
-- through the connector the same day; kept here so a fresh database gets
-- the same shape. The right-to-rent indexes are the ones
-- rentura-right-to-rent.sql already declares — that file only ever half
-- ran in production (see missing-policies.sql).

create index if not exists rentura_right_to_rent_user_id on public.rentura_right_to_rent (user_id);
create index if not exists rentura_right_to_rent_tenant_id on public.rentura_right_to_rent (tenant_id);
create index if not exists rentura_compliance_user_id on public.rentura_compliance (user_id);
create index if not exists rentura_maintenance_user_id on public.rentura_maintenance (user_id);
create index if not exists rentura_mortgages_user_id on public.rentura_mortgages (user_id);
create index if not exists rentura_arrears_property_id on public.rentura_arrears (property_id);
create index if not exists rentura_arrears_events_user_id on public.rentura_arrears_events (user_id);
create index if not exists rentura_documents_tenant_id on public.rentura_documents (tenant_id);
create index if not exists rentura_income_tenant_id on public.rentura_income (tenant_id);
create index if not exists tenant_issue_updates_issue_id on public.tenant_issue_updates (issue_id);
create index if not exists enquiries_listing_id on public.enquiries (listing_id);
create index if not exists enquiries_sender_id on public.enquiries (sender_id);
create index if not exists favourites_listing_id on public.favourites (listing_id);
create index if not exists makan_enquiry_message_author_id on public.makan_enquiry_message (author_id);
create index if not exists makan_media_unit_id on public.makan_media (unit_id);
create index if not exists makan_media_building_id on public.makan_media (building_id);
create index if not exists makan_wanted_org_id on public.makan_wanted (org_id);
create index if not exists makan_audit_actor_id on public.makan_audit (actor_id);

-- The duplicates: keep the table-prefixed name, drop the idx_ twin.
drop index if exists public.idx_rentura_compliance_expiry;
drop index if exists public.idx_rentura_compliance_property_id;
drop index if exists public.idx_documents_property_id;
drop index if exists public.idx_documents_user_id;
drop index if exists public.idx_rentura_events_property_id;
drop index if exists public.idx_expenses_property_id;
drop index if exists public.idx_income_property_id;
drop index if exists public.idx_rentura_maintenance_property_id;
drop index if exists public.idx_rentura_maintenance_status;
drop index if exists public.idx_rentura_mortgages_property_id;
drop index if exists public.idx_rentura_tenants_property_id;
