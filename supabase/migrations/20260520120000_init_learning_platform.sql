-- ============================================================================
-- Practikal learning platform — Stage 1 schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE where possible).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PROFILES — extends auth.users with role + curriculum preferences
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'learner' check (role in ('learner', 'admin')),
  curriculum text default 'nssco' check (curriculum in ('nssco', 'nsscas', 'both')),
  country text default 'NA',
  school text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile row when a new auth.user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: am I an admin? Used in RLS policies for content tables.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ----------------------------------------------------------------------------
-- 2. SUBJECTS — top of the syllabus tree (Biology, Chemistry, English, etc.)
-- ----------------------------------------------------------------------------
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  curriculum text not null check (curriculum in ('nssco', 'nsscas', 'both')),
  category text,                  -- 'science' | 'humanities' | 'languages' | 'commerce' | 'practical' | 'maths'
  icon text,                      -- lucide-react icon name (e.g. 'Atom', 'BookOpen')
  blurb text,
  has_labs boolean not null default false,
  sort_order int not null default 100,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 3. TOPICS — chapters inside a subject (e.g. Biology → Photosynthesis)
-- ----------------------------------------------------------------------------
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  slug text not null,
  title text not null,
  blurb text,
  sort_order int not null default 100,
  created_at timestamptz not null default now(),
  unique (subject_id, slug)
);

create index if not exists idx_topics_subject on public.topics(subject_id, sort_order);

-- ----------------------------------------------------------------------------
-- 4. LESSONS — individual units inside a topic. Each lesson MAY have a video,
--    a markdown body, and/or a link to one of the existing 3D lab pages.
--    Activities & quizzes attach to lessons in Stage 3.
-- ----------------------------------------------------------------------------
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  slug text not null,
  title text not null,
  body_md text,                   -- Markdown lesson content
  video_url text,                 -- Supabase Storage URL or external embed
  video_storage_path text,        -- If uploaded to Supabase Storage, the path
  lab_slug text,                  -- Optional: e.g. 'elodea' → links to /elodea page
  duration_minutes int,
  is_published boolean not null default false,
  sort_order int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (topic_id, slug)
);

create index if not exists idx_lessons_topic on public.lessons(topic_id, sort_order);
create index if not exists idx_lessons_published on public.lessons(is_published);

-- ----------------------------------------------------------------------------
-- 5. LESSON_PROGRESS — which lessons each learner has completed
-- ----------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);

-- ----------------------------------------------------------------------------
-- 6. LAB_ATTEMPTS — record every time a learner opens / completes a lab.
--    Lab pages are existing Next.js pages keyed by `lab_slug` (e.g. 'elodea').
-- ----------------------------------------------------------------------------
create table if not exists public.lab_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lab_slug text not null,
  lesson_id uuid references public.lessons(id) on delete set null,
  opened_at timestamptz not null default now(),
  completed_at timestamptz,
  score numeric(5,2),             -- Optional, if lab self-reports a score
  notes jsonb                     -- Optional: lab-specific data (observations, etc.)
);

create index if not exists idx_lab_attempts_user on public.lab_attempts(user_id);
create index if not exists idx_lab_attempts_slug on public.lab_attempts(lab_slug);

-- ----------------------------------------------------------------------------
-- 7. updated_at triggers
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_lessons_updated on public.lessons;
create trigger trg_lessons_updated before update on public.lessons
  for each row execute function public.set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.lab_attempts enable row level security;

-- ---- profiles -----------------------------------------------------------
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles: admin reads all" on public.profiles;
create policy "profiles: admin reads all" on public.profiles
  for select using (public.is_admin());

-- ---- subjects / topics / lessons: public catalog, admin-write -----------
drop policy if exists "subjects: public read" on public.subjects;
create policy "subjects: public read" on public.subjects
  for select using (true);

drop policy if exists "subjects: admin write" on public.subjects;
create policy "subjects: admin write" on public.subjects
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "topics: public read" on public.topics;
create policy "topics: public read" on public.topics
  for select using (true);

drop policy if exists "topics: admin write" on public.topics;
create policy "topics: admin write" on public.topics
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "lessons: public read published" on public.lessons;
create policy "lessons: public read published" on public.lessons
  for select using (is_published or public.is_admin());

drop policy if exists "lessons: admin write" on public.lessons;
create policy "lessons: admin write" on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- lesson_progress: each learner sees/edits only their own rows -------
drop policy if exists "lesson_progress: own" on public.lesson_progress;
create policy "lesson_progress: own" on public.lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lesson_progress: admin reads all" on public.lesson_progress;
create policy "lesson_progress: admin reads all" on public.lesson_progress
  for select using (public.is_admin());

-- ---- lab_attempts: same pattern -----------------------------------------
drop policy if exists "lab_attempts: own" on public.lab_attempts;
create policy "lab_attempts: own" on public.lab_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lab_attempts: admin reads all" on public.lab_attempts;
create policy "lab_attempts: admin reads all" on public.lab_attempts
  for select using (public.is_admin());
