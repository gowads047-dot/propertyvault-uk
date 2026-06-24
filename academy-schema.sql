-- ============================================================
-- ACADEMY — Full Production Database Schema
-- Run in Supabase SQL editor AFTER supabase-schema.sql
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── Courses ─────────────────────────────────────────────────
create table if not exists public.academy_courses (
  id           uuid primary key default uuid_generate_v4(),
  slug         text not null unique,
  title        text not null,
  subtitle     text,
  description  text,
  thumbnail_url text,
  category     text not null check (category in ('investing','brrr','hmo','tax','finance','legal','deal-sourcing','mindset')),
  difficulty   text default 'beginner' check (difficulty in ('beginner','intermediate','advanced')),
  duration_hrs numeric(4,1),
  lesson_count int default 0,
  is_free      boolean default false,
  is_published boolean default false,
  sort_order   int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── Modules ─────────────────────────────────────────────────
create table if not exists public.academy_modules (
  id          uuid primary key default uuid_generate_v4(),
  course_id   uuid references public.academy_courses(id) on delete cascade not null,
  title       text not null,
  description text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ── Lessons ─────────────────────────────────────────────────
create table if not exists public.academy_lessons (
  id           uuid primary key default uuid_generate_v4(),
  module_id    uuid references public.academy_modules(id) on delete cascade not null,
  course_id    uuid references public.academy_courses(id) on delete cascade not null,
  title        text not null,
  content      text,
  video_url    text,
  duration_min int,
  is_free      boolean default false,
  sort_order   int default 0,
  created_at   timestamptz default now()
);

-- ── Enrollments ─────────────────────────────────────────────
create table if not exists public.academy_enrollments (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  course_id   uuid references public.academy_courses(id) on delete cascade not null,
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique (user_id, course_id)
);

-- ── Lesson Progress ──────────────────────────────────────────
create table if not exists public.academy_progress (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  lesson_id     uuid references public.academy_lessons(id) on delete cascade not null,
  course_id     uuid references public.academy_courses(id) on delete cascade not null,
  completed     boolean default false,
  completed_at  timestamptz,
  watch_seconds int default 0,
  unique (user_id, lesson_id)
);

-- ── Certificates ─────────────────────────────────────────────
create table if not exists public.academy_certificates (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  course_id    uuid references public.academy_courses(id) on delete cascade not null,
  issued_at    timestamptz default now(),
  cert_code    text unique not null default upper(substring(uuid_generate_v4()::text, 1, 8)),
  unique (user_id, course_id)
);

-- ── Downloads / Resources ────────────────────────────────────
create table if not exists public.academy_resources (
  id          uuid primary key default uuid_generate_v4(),
  course_id   uuid references public.academy_courses(id) on delete cascade,
  lesson_id   uuid references public.academy_lessons(id) on delete cascade,
  title       text not null,
  description text,
  file_url    text not null,
  file_type   text,
  is_free     boolean default false,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ── Subscriptions (Stripe sync) ──────────────────────────────
create table if not exists public.academy_subscriptions (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id   text unique,
  stripe_subscription_id text unique,
  plan                 text default 'monthly',
  status               text default 'active' check (status in ('active','cancelled','past_due','trialing')),
  current_period_end   timestamptz,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- ── Indexes ──────────────────────────────────────────────────
create index if not exists academy_modules_course_id on public.academy_modules(course_id);
create index if not exists academy_lessons_module_id on public.academy_lessons(module_id);
create index if not exists academy_lessons_course_id on public.academy_lessons(course_id);
create index if not exists academy_enrollments_user_id on public.academy_enrollments(user_id);
create index if not exists academy_progress_user_id on public.academy_progress(user_id);
create index if not exists academy_progress_course_id on public.academy_progress(course_id);

-- ── Row Level Security ────────────────────────────────────────
alter table public.academy_courses      enable row level security;
alter table public.academy_modules      enable row level security;
alter table public.academy_lessons      enable row level security;
alter table public.academy_enrollments  enable row level security;
alter table public.academy_progress     enable row level security;
alter table public.academy_certificates enable row level security;
alter table public.academy_resources    enable row level security;
alter table public.academy_subscriptions enable row level security;

-- Published courses visible to all; admin can manage all
create policy "academy_courses_public" on public.academy_courses
  for select using (is_published = true);

-- Modules/lessons: visible if course is published
create policy "academy_modules_public" on public.academy_modules
  for select using (
    exists (select 1 from public.academy_courses c where c.id = course_id and c.is_published)
  );

create policy "academy_lessons_public" on public.academy_lessons
  for select using (
    exists (select 1 from public.academy_courses c where c.id = course_id and c.is_published)
  );

-- Enrollments: users see/manage their own
create policy "academy_enrollments_own" on public.academy_enrollments
  for all using (auth.uid() = user_id);

-- Progress: users see/manage their own
create policy "academy_progress_own" on public.academy_progress
  for all using (auth.uid() = user_id);

-- Certificates: users see their own
create policy "academy_certificates_own" on public.academy_certificates
  for select using (auth.uid() = user_id);

-- Resources: free resources public; paid requires enrollment
create policy "academy_resources_select" on public.academy_resources
  for select using (
    is_free = true
    or exists (
      select 1 from public.academy_enrollments e
      where e.user_id = auth.uid() and e.course_id = academy_resources.course_id
    )
  );

create policy "academy_subscriptions_own" on public.academy_subscriptions
  for all using (auth.uid() = user_id);

-- ── Seed: Core Courses ───────────────────────────────────────
insert into public.academy_courses (slug, title, subtitle, description, category, difficulty, duration_hrs, lesson_count, is_free, is_published, sort_order) values
('property-investing-fundamentals', 'Property Investing Fundamentals', 'Everything you need to start', 'A complete beginner''s guide to UK property investing. Learn how deals work, how to finance them, and what to avoid.', 'investing', 'beginner', 4.5, 12, false, true, 1),
('brrr-mastery', 'BRRR Strategy Mastery', 'Buy, Refurb, Refinance, Rent', 'The complete BRRR playbook. From deal sourcing to refinancing — build a portfolio with minimal cash left in.', 'brrr', 'intermediate', 6.0, 16, false, true, 2),
('hmo-investing', 'HMO Investing UK', 'Higher yields. More complexity.', 'How to find, licence, furnish and manage HMOs profitably. Includes Article 4 areas, room pricing, and management.', 'hmo', 'intermediate', 5.0, 14, false, true, 3),
('property-tax-masterclass', 'Property Tax Masterclass', 'Section 24, CGT, Ltd companies', 'Navigate Section 24, capital gains tax, stamp duty surcharges, and the limited company question — taught plainly.', 'tax', 'advanced', 3.5, 10, false, true, 4),
('deal-sourcing', 'Deal Sourcing Blueprint', 'Find deals before they hit Rightmove', 'Direct-to-vendor strategies, estate agent relationships, auction buying, and motivated seller marketing.', 'deal-sourcing', 'intermediate', 5.5, 15, false, true, 5),
('property-finance', 'Property Finance Explained', 'Mortgages, bridging & more', 'Buy-to-let mortgages, bridging finance, commercial loans, and how lenders actually think about your deals.', 'finance', 'beginner', 3.0, 9, true, true, 6)
on conflict (slug) do nothing;
