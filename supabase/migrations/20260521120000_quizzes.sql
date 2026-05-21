-- ============================================================================
-- Stage 3 — auto-marked quizzes & activities.
-- A lesson can have one or more activities; an activity has many questions;
-- a learner can have many attempts; each attempt records per-question responses.
-- Free-text question type is added now so Stage 4 (AI marking) can plug in.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ACTIVITIES — a quiz attached to a lesson
-- ----------------------------------------------------------------------------
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  slug text not null default 'quiz',
  title text not null default 'Quiz',
  instructions text,
  pass_threshold int not null default 60,    -- percent
  shuffle_questions boolean not null default false,
  is_published boolean not null default false,
  sort_order int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, slug)
);

create index if not exists idx_activities_lesson on public.activities(lesson_id);

drop trigger if exists trg_activities_updated on public.activities;
create trigger trg_activities_updated before update on public.activities
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 2. QUESTIONS — one row per question, type-tagged
--    type: 'mcq' | 'true_false' | 'numeric' | 'fill_in' | 'free_text'
--    options (mcq only): jsonb array of {id, text}
--    correct: jsonb — type-specific:
--       mcq          → "a"               (single option id)
--       true_false   → true | false
--       numeric      → 42.5              (number; tolerance separate column)
--       fill_in      → ["water","H2O"]   (accepted answers; case_sensitive flag)
--       free_text    → null              (AI marks against rubric in Stage 4)
-- ----------------------------------------------------------------------------
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  type text not null check (type in ('mcq','true_false','numeric','fill_in','free_text')),
  prompt text not null,
  points int not null default 1,
  options jsonb,
  correct jsonb,
  explanation text,
  case_sensitive boolean default false,
  tolerance numeric,
  unit text,
  rubric text,                              -- for free_text (Stage 4)
  sort_order int not null default 100,
  created_at timestamptz not null default now()
);

create index if not exists idx_questions_activity on public.questions(activity_id, sort_order);

-- ----------------------------------------------------------------------------
-- 3. ACTIVITY_ATTEMPTS — one row per learner attempt at an activity
-- ----------------------------------------------------------------------------
create table if not exists public.activity_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score numeric(6,2),
  max_score numeric(6,2),
  passed boolean
);

create index if not exists idx_attempts_user on public.activity_attempts(user_id, submitted_at desc);
create index if not exists idx_attempts_activity on public.activity_attempts(activity_id);

-- ----------------------------------------------------------------------------
-- 4. QUESTION_RESPONSES — one row per question per attempt
-- ----------------------------------------------------------------------------
create table if not exists public.question_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.activity_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  response jsonb,
  is_correct boolean,
  points_awarded numeric(6,2) default 0,
  feedback text,                            -- AI feedback (Stage 4) or canned explanation
  created_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.activities         enable row level security;
alter table public.questions          enable row level security;
alter table public.activity_attempts  enable row level security;
alter table public.question_responses enable row level security;

-- Activities / questions: published content readable by anyone; admin writes
drop policy if exists "activities: public read published" on public.activities;
create policy "activities: public read published" on public.activities
  for select using (is_published or public.is_admin());

drop policy if exists "activities: admin write" on public.activities;
create policy "activities: admin write" on public.activities
  for all using (public.is_admin()) with check (public.is_admin());

-- Questions: visible if the parent activity is visible to the caller
drop policy if exists "questions: read with activity" on public.questions;
create policy "questions: read with activity" on public.questions
  for select using (
    exists (
      select 1 from public.activities a
      where a.id = questions.activity_id
        and (a.is_published or public.is_admin())
    )
  );

drop policy if exists "questions: admin write" on public.questions;
create policy "questions: admin write" on public.questions
  for all using (public.is_admin()) with check (public.is_admin());

-- Attempts + responses: learner sees/edits own only; admin can read all
drop policy if exists "attempts: own" on public.activity_attempts;
create policy "attempts: own" on public.activity_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "attempts: admin reads all" on public.activity_attempts;
create policy "attempts: admin reads all" on public.activity_attempts
  for select using (public.is_admin());

drop policy if exists "responses: own" on public.question_responses;
create policy "responses: own" on public.question_responses
  for all using (
    exists (
      select 1 from public.activity_attempts a
      where a.id = question_responses.attempt_id and a.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.activity_attempts a
      where a.id = question_responses.attempt_id and a.user_id = auth.uid()
    )
  );

drop policy if exists "responses: admin reads all" on public.question_responses;
create policy "responses: admin reads all" on public.question_responses
  for select using (public.is_admin());
