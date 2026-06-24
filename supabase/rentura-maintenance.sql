-- ============================================================
-- RENTURA: Maintenance Workflow Table
-- Run this in Supabase SQL Editor (separate from the initial schema)
-- ============================================================

create table if not exists rentura_maintenance (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references rentura_properties(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  category text default 'other',        -- plumbing | electrical | structural | appliance | damp | roofing | other
  urgency text default 'routine',        -- emergency | urgent | routine
  status text default 'open',            -- open | in_progress | resolved
  contractor_name text,
  contractor_phone text,
  contractor_email text,
  estimated_cost numeric(10,2),
  actual_cost numeric(10,2),
  reported_date date default current_date,
  scheduled_date date,
  resolved_date date,
  is_improvement boolean default false,  -- true = capital improvement (not tax deductible as repair)
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table rentura_maintenance enable row level security;

create policy "own_maintenance" on rentura_maintenance
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_rentura_maintenance_property_id on rentura_maintenance(property_id);
create index if not exists idx_rentura_maintenance_status on rentura_maintenance(status);
create index if not exists idx_rentura_maintenance_urgency on rentura_maintenance(urgency);
