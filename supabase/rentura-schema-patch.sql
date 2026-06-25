-- ============================================================
-- RENTURA: Schema patch — add missing columns found during audit
-- Safe to run — all use IF NOT EXISTS guards
-- ============================================================

-- ── rentura_properties: add city, postcode, status, monthly_rent ──────────────
alter table rentura_properties add column if not exists city          text;
alter table rentura_properties add column if not exists postcode      text;
alter table rentura_properties add column if not exists status        text not null default 'active';
alter table rentura_properties add column if not exists monthly_rent  numeric(10,2);

-- ── rentura_tenants: add deposit_held ────────────────────────────────────────
alter table rentura_tenants add column if not exists deposit_held boolean not null default false;

-- ── rentura_documents: add file_size, mime_type (if not already added) ───────
alter table rentura_documents add column if not exists file_size bigint;
alter table rentura_documents add column if not exists mime_type text;
