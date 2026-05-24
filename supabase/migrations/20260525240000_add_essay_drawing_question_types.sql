-- ============================================================================
-- Add 'essay' and 'drawing' question types for Agricultural Science Section B
-- and graph/diagram drawing questions across subjects.
--
--   essay   — extended response (Section B, 15 marks). Large textarea, no
--             auto-grading, marked by Haiku against `memo` + `rubric`.
--   drawing — student sketches a graph/diagram. Renderer offers a description
--             textarea + optional photo upload of paper sketch.
-- ============================================================================

alter table public.past_paper_questions
  drop constraint if exists past_paper_questions_type_check;

alter table public.past_paper_questions
  add constraint past_paper_questions_type_check
  check (type in ('mcq','true_false','numeric','fill_in','free_text','calculation','essay','drawing'));
