-- ============================================================================
-- SAMPLE SEED — NSSCO Biology 2024 Paper 1 (page 13)
-- Four rewritten questions from a single page of the NIED 2024 exam, to prove
-- the past-paper pipeline end-to-end. Each question:
--   * Has the wording REWRITTEN (not verbatim NIED) for copyright safety
--   * Has the memo (mark scheme / correct answer with reasoning) preserved
--   * Is tagged with subject + paper provenance
-- These can be expanded to the full 40-question paper once the workflow is
-- validated.
-- ============================================================================

-- Resolve the Biology subject id once and reuse it
do $$
declare
  bio_id uuid;
begin
  select id into bio_id from public.subjects where slug = 'biology' limit 1;
  if bio_id is null then
    raise notice 'Biology subject not found — skipping seed';
    return;
  end if;

  -- ─── Q32 — Function of the umbilical cord ───────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '32', 1, 'free',
    'mcq',
    'During pregnancy a foetus develops inside the uterus and is connected by an umbilical cord. What is the main function of the umbilical cord?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','absorbs mechanical shock'),
      jsonb_build_object('id','b','text','absorbs excess heat during pregnancy'),
      jsonb_build_object('id','c','text','attaches the foetus to the placenta so nutrients, oxygen and waste can be exchanged'),
      jsonb_build_object('id','d','text','produces hormones during pregnancy')
    ),
    to_jsonb('c'::text),
    'C — attaches the foetus to the placenta. [1 mark]',
    'The umbilical cord links the foetus to the placenta. Blood vessels in the cord carry oxygen and nutrients to the foetus and remove waste. The amniotic fluid absorbs shock; the placenta (not the cord) makes hormones.',
    true
  );

  -- ─── Q33 — Birth control involving surgery ──────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '33', 1, 'free',
    'mcq',
    'Which method of contraception involves a surgical procedure?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','abstinence'),
      jsonb_build_object('id','b','text','using a condom'),
      jsonb_build_object('id','c','text','fitting an intra-uterine device (IUD)'),
      jsonb_build_object('id','d','text','vasectomy')
    ),
    to_jsonb('d'::text),
    'D — vasectomy. [1 mark]',
    'A vasectomy is a surgical operation that cuts and ties the sperm ducts. The other three options are non-surgical: abstinence is behavioural, condom is a barrier, and an IUD is fitted (not a surgical procedure).',
    true
  );

  -- ─── Q34 — Cross giving 3:1 phenotypic ratio ────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '34', 1, 'free',
    'mcq',
    'In a plant species, height is controlled by a single pair of alleles. The allele T (tall) is dominant over t (short). Which cross produces offspring with a phenotypic ratio of 3 tall : 1 short?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','TT × tt'),
      jsonb_build_object('id','b','text','Tt × tt'),
      jsonb_build_object('id','c','text','Tt × Tt'),
      jsonb_build_object('id','d','text','TT × Tt')
    ),
    to_jsonb('c'::text),
    'C — Tt × Tt gives 1 TT : 2 Tt : 1 tt → 3 tall : 1 short. [1 mark]',
    'Use a Punnett square. Tt × Tt gives offspring genotypes 1 TT, 2 Tt, 1 tt. Since T is dominant, all three TT and Tt offspring are tall; only tt is short. So phenotypic ratio = 3:1.',
    true
  );

  -- ─── Q35 — Discontinuous variation ──────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '35', 1, 'free',
    'mcq',
    'Which of these is an example of DISCONTINUOUS variation?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','the height of a group of human adults'),
      jsonb_build_object('id','b','text','the length of leaves from one tree'),
      jsonb_build_object('id','c','text','the mass of seeds from one plant'),
      jsonb_build_object('id','d','text','the sex of newborn babies')
    ),
    to_jsonb('d'::text),
    'D — sex in humans. [1 mark]',
    'Discontinuous variation has a small number of clear-cut categories with no intermediates (e.g. male / female; blood group A/B/AB/O). Height, leaf length and seed mass all show a continuous range of values across many possible measurements.',
    true
  );

end $$;
