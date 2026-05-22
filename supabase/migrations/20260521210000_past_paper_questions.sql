-- ============================================================================
-- Past-paper questions — rewritten NIED exam questions with memo (mark scheme)
-- preserved verbatim. These are the SOURCE for topic tests and final exams.
-- Two tiers:
--   free  → auto-marked (mcq / true_false / numeric / fill_in)
--   paid  → AI-marked extended response, marked by Haiku against `memo` + `rubric`
-- A learner pays from their wallet for paid Qs.
-- ============================================================================

create table if not exists public.past_paper_questions (
  id uuid primary key default gen_random_uuid(),

  -- Provenance — where this Q came from
  subject_id   uuid not null references public.subjects(id) on delete cascade,
  topic_id     uuid references public.topics(id) on delete set null,  -- nullable: some Qs span topics
  paper_year   int not null,                              -- e.g. 2023
  paper_no     text not null,                             -- '1','2','3','5','6'
  q_number     text not null,                             -- '1','1a','1ai','2(b)(ii)' etc.
  marks        int not null default 1,                    -- total marks for this Q
  tier         text not null default 'free' check (tier in ('free','paid')),

  -- Content — REWRITTEN by us, not verbatim from NIED (copyright safety)
  type         text not null check (type in ('mcq','true_false','numeric','fill_in','free_text')),
  prompt       text not null,
  options      jsonb,                                     -- mcq: [{id,text},...]
  correct      jsonb,                                     -- canonical answer per `questions.correct` rules
  case_sensitive boolean default false,
  tolerance    numeric,                                   -- numeric Qs
  unit         text,                                      -- numeric Qs

  -- Mark scheme (preserved from NIED memorandum — used by Haiku to mark paid Qs)
  memo         text,                                      -- mark-allocation notes ("3 marks: 1 for terminology, 1 for ..., 1 for...")
  rubric       text,                                      -- AI marking rubric for paid Qs
  explanation  text,                                      -- learner-facing explanation after answering

  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_papers_subject_topic on public.past_paper_questions(subject_id, topic_id);
create index if not exists idx_papers_year_paper    on public.past_paper_questions(paper_year, paper_no);
create index if not exists idx_papers_tier          on public.past_paper_questions(tier);
create index if not exists idx_papers_published     on public.past_paper_questions(is_published);

drop trigger if exists trg_papers_updated on public.past_paper_questions;
create trigger trg_papers_updated before update on public.past_paper_questions
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Convenience: a unique "paper" identity = (subject_id, paper_year, paper_no).
-- We don't make a separate `papers` table; we derive the list by GROUP BY.
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.past_paper_questions enable row level security;

drop policy if exists "past_papers: public read published" on public.past_paper_questions;
create policy "past_papers: public read published" on public.past_paper_questions
  for select using (is_published or public.is_admin());

drop policy if exists "past_papers: admin write" on public.past_paper_questions;
create policy "past_papers: admin write" on public.past_paper_questions
  for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- Helper view: distinct papers per subject (handy for the final-exam picker)
-- ----------------------------------------------------------------------------
create or replace view public.past_papers as
  select
    subject_id,
    paper_year,
    paper_no,
    count(*) as question_count,
    sum(marks) as total_marks,
    bool_and(is_published) as fully_published
  from public.past_paper_questions
  group by subject_id, paper_year, paper_no;

-- View inherits RLS from the underlying table.
