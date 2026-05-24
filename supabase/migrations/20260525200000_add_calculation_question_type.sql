-- ============================================================================
-- Add 'calculation' question type for Physics-style numerical questions with
-- a working area + final value + unit. The renderer (PastPaperQuiz.jsx) treats
-- the `correct` jsonb as { value, tolerance, unit, accept_units }.
-- ============================================================================

alter table public.past_paper_questions
  drop constraint if exists past_paper_questions_type_check;

alter table public.past_paper_questions
  add constraint past_paper_questions_type_check
  check (type in ('mcq','true_false','numeric','fill_in','free_text','calculation'));
