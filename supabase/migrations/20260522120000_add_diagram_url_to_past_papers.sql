-- ============================================================================
-- Add diagram_url to past_paper_questions
-- Many NSSCO questions include a figure (photo, diagram, graph, table). Each
-- question that has a figure points at a PNG cropped from the source PDF and
-- stored under public/past-papers/{paper-slug}/{q}.png — served as a static
-- asset by Next.js.
-- ============================================================================

alter table public.past_paper_questions
  add column if not exists diagram_url text;

comment on column public.past_paper_questions.diagram_url is
  'Path to a static PNG of the question''s figure (e.g. ''/past-papers/biology-nssco-2020-p2/q1-rhino.png''). Null when the question has no figure.';
