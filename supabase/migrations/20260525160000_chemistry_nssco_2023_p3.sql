-- ===========================================================================
-- NSSCO Chemistry 2023 Paper 3 (6117/3) — Alt to Practical, 4 questions, 18 sub-parts, 40 marks
-- Verbatim NIED wording. Mark scheme + commentary from
-- DNEA Examiners Report 2023 (Chemistry section, pages 102-105).
-- ===========================================================================

do $$
declare
  chem_id uuid;
begin
  select id into chem_id from public.subjects where slug = 'chemistry' limit 1;
  if chem_id is null then raise notice 'Chemistry subject not found'; return; end if;

  -- ─── Q1(a)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '1(a)', 2, 'free',
    'fill_in',
    E'Fig. 1.1 shows a container of a cleaning agent that contains ammonia and sand.\n\n**(a)** Describe a **test** to show that the sample of the cleaning agent contains **ammonia**.\n\nGive both the test and the result. Format: ''''test: ___; result: ___''''.',
    '/past-papers/chemistry-nssco-2023-p3/cleaning-bottle.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'damp red litmus paper turns blue',
        'moist red litmus paper turns blue',
        'wet red litmus turns blue',
        'damp red litmus, turns blue',
        'test: damp red litmus paper; result: turns blue'
    )
, 'must_contain', jsonb_build_array('litmus', 'blue')
    ),
    false,
    E'Test: damp red litmus paper; [1]\nResult: turns blue; [1]\n\n**Examiner commentary:** Fairly answered. Candidates should give full test + result. Refer to ANNEXE B (qualitative analysis) in the syllabus.',
    E'**Test for ammonia (NH₃) gas:**\n• Use **damp (moist) RED litmus paper**\n• If ammonia is present → **paper turns BLUE** (ammonia is alkaline)\n\nWhy damp? The water lets NH₃ dissolve and form NH₄OH, which is alkaline.\nWhy RED litmus? Red litmus turns blue with alkali (and alkalis turn it blue). Blue litmus turning red would mean acid — wrong direction.\n\nDifferent from test for chlorine (damp litmus BLEACHES) — read carefully which one is asked.',
    true
  );

  -- ─── Q1(b)  [3 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '1(b)', 3, 'free',
    'fill_in',
    E'Fig. 1.1 shows a container of a cleaning agent that contains ammonia and sand.\n\nFig. 1.2 shows apparatus used to obtain pure water from the cleaning-agent mixture by distillation. A = a flame/burner, B = a round-bottomed flask, C = a long tube with water cooling.\n\n**(b)** Name the apparatus **A**, **B** and **C** shown in Fig. 1.2.\n\nGive the three names in order separated by commas (e.g. ''''Bunsen burner, round-bottom flask, Liebig condenser'''').',
    '/past-papers/chemistry-nssco-2023-p3/purification-abc.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'Bunsen burner round bottom flask Liebig condenser',
        'Bunsen burner, round-bottom flask, Liebig condenser',
        'Bunsen burner, round bottom flask, Liebig condenser',
        'bunsen, round bottom flask, liebig condenser',
        'Bunsen, round-bottomed flask, condenser'
    )
, 'must_contain', jsonb_build_array('Bunsen', 'flask', 'condenser')
    ),
    false,
    E'A — Bunsen burner; B — round-bottom flask; C — Liebig condenser; [3 marks, 1 each]\n\n**Examiner commentary:** Fairly answered. Some confused round-bottomed flask with conical flask. Others misspelt names.',
    E'**Distillation apparatus (left → right):**\n• **A — Bunsen burner**: provides the heat\n• **B — Round-bottom flask**: holds the liquid being distilled (round so it heats evenly)\n• **C — Liebig condenser**: long glass tube with cold water jacket; vapour from the flask passes through, cools, and condenses back to liquid\n\n⚠ Round-BOTTOM flask (not round-BOTTOMED — both accepted). NOT a conical flask (conical has a flat bottom, narrow neck).',
    true
  );

  -- ─── Q1(c)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '3', '1(c)', 3, 'paid',
    'free_text',
    E'Fig. 1.1 shows a container of a cleaning agent that contains ammonia and sand.\n\n**(c)** Explain how to obtain **pure sand** from the cleaning-agent mixture.',
    '/past-papers/chemistry-nssco-2023-p3/cleaning-bottle.png',
    E'All 3 marks (sequence):\n1. Filter (or decant) the mixture — sand is insoluble, stays as residue;\n2. Wash the residue (sand) with water — removes any remaining ammonia/dirt;\n3. Dry the sand (e.g. in a warm oven, on a watch glass, or in the sun);\n\n**Examiner commentary:** Many gained credit for filtration (1 of 3 marks). Many wrongly described CRYSTALLISATION — but sand is already a solid in the mixture, not formed by evaporation. Emphasise Topic 1 ''Experimental techniques''.',
    E'Award 1 mark each: (1) FILTRATION/decanting to separate sand; (2) WASH the residue with water; (3) DRY the sand. PENALISE ''crystallisation'' (wrong — sand doesn''t crystallise, it''s already a solid in the mixture); ''evaporate'' alone without filtration; just ''separate''.',
    E'**Three-step purification of insoluble solid:**\n\n1. **FILTER (or decant)** — pour mixture through filter paper. Sand is **insoluble** → stays on the filter as **residue**. The liquid (ammonia solution) passes through.\n2. **WASH** the residue with **distilled water** — rinses off any remaining ammonia solution clinging to the sand grains.\n3. **DRY** — leave in a warm oven / on a watch glass in the sun / blot with filter paper.\n\nNOT crystallisation — that''s for getting solids out of solutions (and sand isn''t dissolved here, it''s a solid suspended in liquid).',
    true
  );

  -- ─── Q2(a)  [3 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '2(a)', 3, 'free',
    'fill_in',
    E'Calcium carbonate reacts with dilute hydrochloric acid releasing carbon dioxide gas. Fig. 2.1 shows the set-up of the experiment. Large lumps of calcium carbonate were used. The volume of carbon dioxide produced was measured every 30 seconds for 240 seconds.\n\n**(a)** Use the measuring-cylinder diagrams in Table 2.1 (at 0, 30, 60, 90, 120, 150, 180, 210, 240 seconds) to give the total volume of carbon dioxide produced (in cm³) at each time.\n\nGive the 9 values separated by commas (e.g. ''''0, 13, 25, ...'''').',
    '/past-papers/chemistry-nssco-2023-p3/caco3-apparatus.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '0 13 25 34 42 50 56 59 59',
        '0, 13, 25, 34, 42, 50, 56, 59, 59',
        '0,13,25,34,42,50,56,59,59'
    )
, 'must_contain', jsonb_build_array('0', '59')
    ),
    false,
    E'0, 13, 25, 34, 42, 50, 56, 59, 59 cm³; [3 marks for all 9 correct; 2 for 6-8; 1 for 4-5]\n\n**Examiner commentary:** Well answered. Some problems caused by inverted measuring cylinder diagrams (as in real life). Inconsistencies in precision and units in the table body.',
    E'**Reading inverted measuring cylinders:**\n\nThe cylinder is upside-down (collecting gas over water) → numbers run the opposite way! Read the level by looking at where the water meets the air.\n\nReadings at each time:\n• 0 s — cylinder full of water, no gas → **0 cm³**\n• 30 s — **13 cm³**\n• 60 s — **25 cm³**\n• 90 s — **34 cm³**\n• 120 s — **42 cm³**\n• 150 s — **50 cm³**\n• 180 s — **56 cm³**\n• 210 s — **59 cm³** (almost flat)\n• 240 s — **59 cm³** (reaction stopped)\n\nDon''t include ''cm³'' in each table cell — units go in the header.',
    true
  );

  -- ─── Q2(b)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '3', '2(b)', 3, 'paid',
    'free_text',
    E'Calcium carbonate reacts with dilute hydrochloric acid releasing carbon dioxide gas. Fig. 2.1 shows the set-up of the experiment. Large lumps of calcium carbonate were used. The volume of carbon dioxide produced was measured every 30 seconds for 240 seconds.\n\n**(b)** Describe how you would **plot a graph** of total volume of CO₂ (y-axis, 0-60 cm³) against time (x-axis, 0-240 s), and draw a line of best fit.\n\nDescribe: how you''d mark points, how you''d draw the line of best fit, and what shape it should be.',
    null,
    E'All 3 marks:\n1. All 9 points correctly plotted within a small square (within 1 mm of the correct value);\n2. (Or 4-8 points = 1 mark; 6-8 = 2 marks)\n3. **Smooth CURVE** of best fit (thickness ≤ 1 mm) that balances the points;\n\n**Examiner commentary:** Fair share scored 1-2 marks. Smooth curve was rarely scored. Common errors: drawing a straight line of best fit when curve was needed; wobbly/wavy/feathery/kinky curves; dot-to-dot by freehand or ruler. Crosses scored better than dots.',
    E'Award marks for: (1) accurate plotting with SMALL crosses/dots (not ''blobs'' > 1 mm); (2) a SMOOTH CURVE of best fit (not a straight line — the data curves over); (3) curve balances above/below points evenly. PENALISE blobs, dot-to-dot freehand, wobbly curves.',
    E'**Three things examiners check:**\n\n1. **Plotting** — use small, sharp **crosses (×)** at each (time, volume) pair. Avoid ''blobs'' — they cost the plotting mark.\n2. **Shape** — it''s a **smooth CURVE** (the reaction rate slows down over time), NOT a straight line.\n3. **Best fit** — the curve should be SMOOTH (drawn in one motion, no wobbles) and pass close to (but not through every) point, balancing above/below.\n\nDon''t ''connect the dots'' — that''s for joining specific points, not for showing a trend.',
    true
  );

  -- ─── Q2(c)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '3', '2(c)', 3, 'paid',
    'free_text',
    E'Calcium carbonate reacts with dilute hydrochloric acid releasing carbon dioxide gas. Fig. 2.1 shows the set-up of the experiment. Large lumps of calcium carbonate were used. The volume of carbon dioxide produced was measured every 30 seconds for 240 seconds.\n\naverage rate = (total volume of CO₂ produced / cm³) ÷ (time / s)\n\n**(c)** Calculate the **average rate** of this reaction for the first **100 seconds**. Show your working and give the correct unit.',
    null,
    E'All 3 marks:\n1. Value of volume AT 100 s read from graph ≈ 37 cm³ (accept 35-39);\n2. Calculation: 37 / 100 = 0.37 (cm³/s);\n3. Unit: **cm³/s** (or cm³ s⁻¹);\n\n**Examiner commentary:** Stronger candidates read the graph correctly at 100 s. Many MISINTERPRETED ''average'' and added together all volume values from the table — this was not credited. The mark for the unit was fairly accessible.',
    E'Award 1 mark for correct GRAPH READING at t = 100 s (~37 cm³, accept 35-39); 1 mark for correct CALCULATION (divide that value by 100); 1 mark for UNIT (cm³/s or cm³ s⁻¹). PENALISE: adding table values instead of reading the graph at 100 s; missing unit.',
    E'**Step-by-step:**\n\n1. **Read** the graph at t = 100 s → volume ≈ **37 cm³** (between the 90 s value of 34 and the 120 s value of 42)\n\n2. **Calculate** using the formula given:\n   average rate = 37 cm³ ÷ 100 s = **0.37 cm³/s**\n\n3. **Unit** must be included: **cm³/s** (or cm³ s⁻¹).\n\n⚠ ''Average'' does NOT mean adding all readings and dividing by 9. It means using the formula given. Read the graph at 100 s, divide by 100, add unit.',
    true
  );

  -- ─── Q2(d)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '2(d)', 1, 'free',
    'fill_in',
    E'Calcium carbonate reacts with dilute hydrochloric acid releasing carbon dioxide gas. Fig. 2.1 shows the set-up of the experiment. Large lumps of calcium carbonate were used. The volume of carbon dioxide produced was measured every 30 seconds for 240 seconds.\n\n**(d)** State a reason why, eventually, **no more gas will be produced**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'all the calcium carbonate will have reacted',
        'all the calcium carbonate is used up',
        'calcium carbonate has been used up',
        'all the acid will have reacted',
        'all the acid is used up',
        'all the reactants used up',
        'calcium carbonate finished',
        'one of the reactants is used up'
    )
    ),
    false,
    E'All the calcium carbonate has been used up / all the acid has been used up; [1 mark]\n\n**Examiner commentary:** Common error: ''reaction is constant'' or ''in equilibrium'' — these imply the reaction is still going, so were NOT credited.',
    E'When the curve levels off (plateaus), **one of the reactants has been fully used up**. The reaction stops because there''s nothing left to react.\n\n• In this question, **calcium carbonate** is the limiting reactant (acid is in excess) — so when all CaCO₃ has reacted, no more CO₂ is produced.\n\nDon''t say ''reaction is constant'' or ''reached equilibrium'' — those suggest the reaction is still happening. The correct word is **''used up'' / ''finished'' / ''reacted completely''**.',
    true
  );

  -- ─── Q2(e)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '3', '2(e)', 2, 'paid',
    'free_text',
    E'Calcium carbonate reacts with dilute hydrochloric acid releasing carbon dioxide gas. Fig. 2.1 shows the set-up of the experiment. Large lumps of calcium carbonate were used. The volume of carbon dioxide produced was measured every 30 seconds for 240 seconds.\n\n**(e)** Suggest and explain the **effect on the rate of reaction** of using the **same mass of calcium carbonate POWDER** instead of large lumps.',
    null,
    E'Both required (1 mark each):\n1. Faster reaction / increased rate;\n2. (Because) powder has a LARGER surface area (than lumps);\n\n**Examiner commentary:** Many gained credit for the qualitative comparison.',
    E'Award 1 mark for FASTER rate, 1 mark for LARGER SURFACE AREA (must be comparative — ''larger'', ''more'', not just ''has surface area''). Accept ''more particles exposed to acid → more collisions''.',
    E'**Powder vs lumps (same total mass):**\n\nA POWDER has many small particles → **much larger total surface area** than the same mass as a few big lumps.\n\n• More surface → more acid particles can collide with the CaCO₃ → more frequent successful collisions → **faster rate of reaction**.\n• The TOTAL volume of CO₂ at the end stays the SAME (same mass of CaCO₃), but the reaction REACHES that level much sooner.\n\nUse comparative words: ''powder has LARGER surface area, so rate is FASTER''.',
    true
  );

  -- ─── Q2(f)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '2(f)', 2, 'free',
    'fill_in',
    E'Calcium carbonate reacts with dilute hydrochloric acid releasing carbon dioxide gas. Fig. 2.1 shows the set-up of the experiment. Large lumps of calcium carbonate were used. The volume of carbon dioxide produced was measured every 30 seconds for 240 seconds.\n\n**(f)** A learner suggests that using a **gas syringe** to collect the gas instead of a measuring cylinder will **improve the accuracy** of the experiment.\n\nState whether you **agree or disagree** and **justify** your answer. Format: ''''agree, [reason]''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'agree, gas syringe is more precise',
        'agree, measuring cylinder less precise',
        'agree more accurate',
        'agree, no gas dissolves in water',
        'yes, gas syringe is more precise',
        'agree, gas syringe more precise',
        'agree, some CO2 dissolves in water in measuring cylinder'
    )
, 'must_contain', jsonb_build_array('agree')
    ),
    false,
    E'Statement: AGREE (yes / true); [1]\nJustification: measuring cylinder is less precise / some CO₂ may dissolve in water in measuring cylinder method; [1]\n\n**Examiner commentary:** Best-answered part of the paper — most agreed. Justification was demanding — only the best responses mentioned precision OR dissolution.',
    E'**Agree** — gas syringes give more accurate readings:\n\n1. **Precision**: Gas syringes can read to **1 cm³** (or finer) directly. Inverted measuring cylinders often have larger graduations and the meniscus reading is harder.\n\n2. **No gas loss to water**: CO₂ is **slightly soluble in water** — so when collected over water (measuring cylinder method), some CO₂ dissolves and isn''t counted → volume reading is too low. A gas syringe captures everything.\n\nEither reason gets the justification mark.',
    true
  );

  -- ─── Q3(a)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '3(a)', 1, 'free',
    'fill_in',
    E'Two solids, A and B, were analysed. Solid B is **lithium chloride**. Tests on solid A and their observations are summarised in the table on the question paper:\n• Appearance — blue crystals\n• Test 1 (heated gently until blue colour disappeared) — solid turned white, liquid droplets formed in the boiling tube\n• Test 2 (liquid droplets tested with universal indicator paper) — paper turned green\n• Test 3 (solution A + NaOH) — light blue precipitate, insoluble in excess\n• Test 4 (solution A + dilute nitric acid + barium nitrate) — white precipitate\n• Test 5 (flame test on solid A) — blue-green colour\n\n**(a)** Test 1 states the solid should be heated gently first. In terms of **safety**, explain why it is necessary to heat gently at first.',
    '/past-papers/chemistry-nssco-2023-p3/tests-table-A.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'solid spits out of the tube',
        'to prevent the solid spitting out',
        'tube might crack',
        'tube might break',
        'to prevent the test tube cracking',
        'to prevent the test-tube from breaking due to thermal shock',
        'stops the solid from spitting'
    )
    ),
    false,
    E'Solid might spit out of the tube / tube might crack (from thermal shock); [1 mark]\n\n**Examiner commentary:** Many candidates referred to the test tube or the contents of the test tube.',
    E'**Safety reason for heating GENTLY first:**\n\n• Sudden strong heating causes **thermal shock** → the glass test tube can **crack/break**\n• Sudden expansion of trapped water vapour can cause the solid to **spit out** dangerously\n\nGentle heating = even expansion + controlled water release. Once safe, strong heating can follow.',
    true
  );

  -- ─── Q3(b)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '3(b)', 1, 'free',
    'fill_in',
    E'Two solids, A and B, were analysed. Solid B is **lithium chloride**. Tests on solid A and their observations are summarised in the table on the question paper:\n• Appearance — blue crystals\n• Test 1 (heated gently until blue colour disappeared) — solid turned white, liquid droplets formed in the boiling tube\n• Test 2 (liquid droplets tested with universal indicator paper) — paper turned green\n• Test 3 (solution A + NaOH) — light blue precipitate, insoluble in excess\n• Test 4 (solution A + dilute nitric acid + barium nitrate) — white precipitate\n• Test 5 (flame test on solid A) — blue-green colour\n\n**(b)** Test 2: universal indicator paper turned **green** when liquid droplets from the boiling tube were tested.\n\nIdentify the **liquid** being tested.',
    '/past-papers/chemistry-nssco-2023-p3/tests-table-A.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'water',
        'Water',
        'H2O'
    )
    ),
    false,
    E'Water; [1 mark]\n\n**Examiner commentary:** Generally well answered.',
    E'Universal indicator **turns GREEN at pH 7** = **NEUTRAL**.\n\nThe only common neutral liquid is **water (H₂O)**.\n\nContext: blue crystals (CuSO₄·5H₂O) lose their water of crystallisation when heated:\nCuSO₄·5H₂O → CuSO₄ + 5H₂O\n\nThe ''liquid droplets'' are this water collecting on the cool upper part of the boiling tube.',
    true
  );

  -- ─── Q3(c)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '3(c)', 2, 'free',
    'fill_in',
    E'Two solids, A and B, were analysed. Solid B is **lithium chloride**. Tests on solid A and their observations are summarised in the table on the question paper:\n• Appearance — blue crystals\n• Test 1 (heated gently until blue colour disappeared) — solid turned white, liquid droplets formed in the boiling tube\n• Test 2 (liquid droplets tested with universal indicator paper) — paper turned green\n• Test 3 (solution A + NaOH) — light blue precipitate, insoluble in excess\n• Test 4 (solution A + dilute nitric acid + barium nitrate) — white precipitate\n• Test 5 (flame test on solid A) — blue-green colour\n\n**(c)** Identify **solid A**.\n\nGive the cation and the anion (or full chemical name).',
    '/past-papers/chemistry-nssco-2023-p3/tests-table-A.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'copper sulfate',
        'copper(II) sulfate',
        'Cu2+ and SO4 2-',
        'copper(II) sulfate (CuSO4)',
        'CuSO4',
        'hydrated copper sulfate',
        'copper sulphate'
    )
, 'must_contain', jsonb_build_array('copper', 'sulfate')
    ),
    false,
    E'Copper / Cu²⁺ [1]; Sulfate / SO₄²⁻ [1]; [Total 2 marks]\n\n→ Solid A = copper(II) sulfate (CuSO₄) — the blue crystals were the hydrated form, CuSO₄·5H₂O.\n\n**Examiner commentary:** Fair. Most candidates scored at least 1 mark, usually for the copper part.',
    E'**Putting the clues together:**\n\n• Blue crystals → contains **Cu²⁺** (copper ions are blue in solution)\n• On heating turns white → was hydrated (the blue→white change is classic for CuSO₄·5H₂O → CuSO₄)\n• Solution + NaOH → light blue precipitate (Cu(OH)₂, insoluble in excess) → confirms **Cu²⁺**\n• Solution + nitric acid + barium nitrate → white precipitate (BaSO₄) → confirms **sulfate (SO₄²⁻)**\n• Flame test blue-green → confirms copper\n\n→ **Solid A = copper(II) sulfate, CuSO₄** (the hydrated crystals are CuSO₄·5H₂O).',
    true
  );

  -- ─── Q3(d)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '3(d)', 1, 'free',
    'fill_in',
    E'Two solids, A and B, were analysed. Solid B is **lithium chloride**. Tests on solid A and their observations are summarised in the table on the question paper:\n• Appearance — blue crystals\n• Test 1 (heated gently until blue colour disappeared) — solid turned white, liquid droplets formed in the boiling tube\n• Test 2 (liquid droplets tested with universal indicator paper) — paper turned green\n• Test 3 (solution A + NaOH) — light blue precipitate, insoluble in excess\n• Test 4 (solution A + dilute nitric acid + barium nitrate) — white precipitate\n• Test 5 (flame test on solid A) — blue-green colour\n\nThe container of nitric acid is labelled CORROSIVE.\n\n**(d)** State **one safety precaution** when using nitric acid.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'wear gloves',
        'wear protective gloves',
        'wear goggles',
        'wear safety goggles',
        'avoid skin contact',
        'wear lab coat',
        'do not taste',
        'avoid contact with skin',
        'use a fume hood'
    )
    ),
    false,
    E'Any one: avoid contact with skin / wear (protective) gloves; avoid getting in eyes / wear goggles; avoid smelling, drinking or tasting; [1 mark]\n\n**Examiner commentary:** —',
    E'**Safety precautions when using corrosive substances:**\n\n• **Wear safety goggles** — protect eyes (corrosives cause blindness if splashed)\n• **Wear protective gloves** — avoid skin contact (causes chemical burns)\n• **Wear lab coat** — protect clothes/skin\n• **Use a fume hood** — avoid breathing fumes\n• Never **taste** or **smell directly**\n\nName any ONE precaution. Be specific — ''be careful'' or ''wear PPE'' is too vague.',
    true
  );

  -- ─── Q3(e)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '3(e)', 1, 'free',
    'fill_in',
    E'Two solids, A and B, were analysed. Solid B is **lithium chloride**. Tests on solid A and their observations are summarised in the table on the question paper:\n• Appearance — blue crystals\n• Test 1 (heated gently until blue colour disappeared) — solid turned white, liquid droplets formed in the boiling tube\n• Test 2 (liquid droplets tested with universal indicator paper) — paper turned green\n• Test 3 (solution A + NaOH) — light blue precipitate, insoluble in excess\n• Test 4 (solution A + dilute nitric acid + barium nitrate) — white precipitate\n• Test 5 (flame test on solid A) — blue-green colour\n\nSolid B is lithium chloride.\n\n**(e)** Describe the **appearance of solid B**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'white',
        'white solid',
        'white crystals',
        'white crystalline solid'
    )
, 'must_contain', jsonb_build_array('white')
    ),
    false,
    E'White (solid / crystals); [1 mark]\n\n**Examiner commentary:** Very poorly answered. Candidates not familiar with the appearance of substances. (Similar issue in 2022 with copper carbonate.)',
    E'**Most ionic solids of Group 1 (Li, Na, K, etc.) are WHITE.**\n\nLithium chloride (LiCl) is a **white crystalline solid** at room temperature.\n\nGeneral rule: salts of metals from Group 1 are usually white (unless they contain a coloured anion like permanganate or chromate). Transition metal salts (Cu, Fe, Cr) are typically coloured.',
    true
  );

  -- ─── Q3(f)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '3(f)(i)', 1, 'free',
    'fill_in',
    E'Two solids, A and B, were analysed. Solid B is **lithium chloride**. Tests on solid A and their observations are summarised in the table on the question paper:\n• Appearance — blue crystals\n• Test 1 (heated gently until blue colour disappeared) — solid turned white, liquid droplets formed in the boiling tube\n• Test 2 (liquid droplets tested with universal indicator paper) — paper turned green\n• Test 3 (solution A + NaOH) — light blue precipitate, insoluble in excess\n• Test 4 (solution A + dilute nitric acid + barium nitrate) — white precipitate\n• Test 5 (flame test on solid A) — blue-green colour\n\nDistilled water was added to solid B and shaken to make solution B. To the first portion of solution B, an excess of aqueous sodium hydroxide was added.\n\n**(f)(i)** What is observed when excess NaOH is added to solution B?',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'no reaction',
        'no change',
        'stays the same',
        'no observable reaction',
        'nothing happens',
        'no visible change',
        'solution remains colourless'
    )
    ),
    false,
    E'No reaction / no change / stays the same; [1 mark]\n\n**Examiner commentary:** Candidates find negative tests challenging. Many gave a positive result for chloride ions instead.',
    E'**NaOH test is for METAL CATIONS** (forms coloured precipitates with transition metals, white with Al/Zn/Ca, etc.).\n\n**Lithium (Li⁺) is a Group 1 cation → LiOH is SOLUBLE → no precipitate forms.**\n\nSo: **no reaction / no visible change** when NaOH is added to LiCl solution.\n\nThis is a NEGATIVE test result — that''s also useful information (it rules out transition metals, Al, Mg, Ca, etc.).',
    true
  );

  -- ─── Q3(f)(ii)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '3(f)(ii)', 2, 'free',
    'fill_in',
    E'Two solids, A and B, were analysed. Solid B is **lithium chloride**. Tests on solid A and their observations are summarised in the table on the question paper:\n• Appearance — blue crystals\n• Test 1 (heated gently until blue colour disappeared) — solid turned white, liquid droplets formed in the boiling tube\n• Test 2 (liquid droplets tested with universal indicator paper) — paper turned green\n• Test 3 (solution A + NaOH) — light blue precipitate, insoluble in excess\n• Test 4 (solution A + dilute nitric acid + barium nitrate) — white precipitate\n• Test 5 (flame test on solid A) — blue-green colour\n\nTo the second portion of solution B, dilute nitric acid and aqueous silver nitrate were added.\n\n**(f)(ii)** What is observed when dilute nitric acid + aqueous silver nitrate are added to solution B? Describe the appearance (colour + state).',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'white precipitate',
        'white ppt',
        'white precipitate forms',
        'a white precipitate forms',
        'white precipitate of silver chloride'
    )
, 'must_contain', jsonb_build_array('white', 'precipitate')
    ),
    false,
    E'Colour: WHITE [1]; State: PRECIPITATE / ppt [1]; [2 marks]\n\n**Examiner commentary:** Best responses identified white precipitate. Some gave random precipitate colours from ANNEXE B without thought.',
    E'**Test for CHLORIDE ions (Cl⁻):**\n• Acidify with dilute nitric acid (prevents false positives)\n• Add aqueous **silver nitrate (AgNO₃)**\n• **WHITE PRECIPITATE** of silver chloride (AgCl) → positive test ✓\n\nLiCl dissolves to give Li⁺ + Cl⁻. The Cl⁻ reacts with Ag⁺ → AgCl ↓ white.\n\nOther halides for comparison:\n• Cl⁻ → white AgCl\n• Br⁻ → cream AgBr\n• I⁻ → yellow AgI',
    true
  );

  -- ─── Q3(g)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '3', '3(g)', 1, 'free',
    'fill_in',
    E'Two solids, A and B, were analysed. Solid B is **lithium chloride**. Tests on solid A and their observations are summarised in the table on the question paper:\n• Appearance — blue crystals\n• Test 1 (heated gently until blue colour disappeared) — solid turned white, liquid droplets formed in the boiling tube\n• Test 2 (liquid droplets tested with universal indicator paper) — paper turned green\n• Test 3 (solution A + NaOH) — light blue precipitate, insoluble in excess\n• Test 4 (solution A + dilute nitric acid + barium nitrate) — white precipitate\n• Test 5 (flame test on solid A) — blue-green colour\n\nA flame test was carried out on solid B (lithium chloride).\n\n**(g)** Give the **observed flame colour**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'red',
        'red flame',
        'crimson',
        'crimson red'
    )
, 'must_contain', jsonb_build_array('red')
    ),
    false,
    E'Red (flame); [1 mark]\n\n**Examiner commentary:** Only a handful gave an acceptable colour. Some confused gas tests with flame tests, or guessed from the full range of flame colours.',
    E'**Flame test colours for Group 1 + 2 metals:**\n• Lithium (Li⁺) — **RED / CRIMSON** ✓\n• Sodium (Na⁺) — yellow/orange\n• Potassium (K⁺) — lilac/purple\n• Calcium (Ca²⁺) — orange-red / brick red\n• Barium (Ba²⁺) — green\n• Copper (Cu²⁺) — blue-green\n\n**Lithium → RED.** Don''t confuse with calcium (also reddish, but more orange-brick).',
    true
  );

  -- ─── Q4  [8 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '3', '4', 8, 'paid',
    'free_text',
    E'Sodium thiosulfate reacts with dilute hydrochloric acid. Sulfur forms during this reaction and the mixture turns cloudy.\n\nNa₂S₂O₃(aq) + 2HCl(aq) → 2NaCl(aq) + 2H₂O(l) + SO₂(g) + S(s)\n\nMaterials provided:\n• 50 cm³ sodium thiosulfate of 0.25 mol/dm³ concentration\n• 50 cm³ sodium thiosulfate of 1.00 mol/dm³ concentration\n• dilute hydrochloric acid\n• 20 cm³ measuring cylinder\n• 2 × 250 cm³ conical flasks\n• 1 × stop-watch\n• 1 × A4 piece of paper with a cross marked on it\n\nPlan an experiment to investigate whether the **speed of reaction** between sodium thiosulfate and dilute hydrochloric acid depends on the **concentration of sodium thiosulfate**.\n\nIn your plan describe:\n• the method (steps) and apparatus\n• the measurements you take\n• the variables you control\n• how you use your results to reach a conclusion',
    null,
    E'Up to 8 marks (M1-M8):\n\n**Method:**\n• M1 — pour SODIUM THIOSULFATE into a conical flask;\n• M2 — place the conical flask on the A4 paper with the cross marked on it;\n• M3 — add a measured volume of HYDROCHLORIC ACID to the conical flask;\n\n**Measurements:**\n• M4 — measure the VOLUME of hydrochloric acid using a measuring cylinder;\n• M5 — measure the TIME taken for the cross to DISAPPEAR using a stopwatch;\n• M6 — REPEAT with sodium thiosulfate of the DIFFERENT (other) concentration;\n\n**Variables to control:**\n• M7 — keep the VOLUME of hydrochloric acid the SAME in both runs;\n\n**Conclusion:**\n• M8 — compare the time taken for the cross to disappear at each concentration; if the higher concentration of thiosulfate gives a SHORTER time, then the rate is HIGHER at higher concentration (so rate depends on concentration);\n\n**Examiner commentary:** Mixed performance. At better centres, candidates gave well-sequenced descriptions with clear diagrams (up to full marks). At others, candidates didn''t understand the A4 paper''s role (it goes UNDER the flask to view the cross through the contents) or weren''t familiar with rates. Some confused it with paper chromatography (from 2022). Most common marks: pouring acid + thiosulfate into flasks.',
    E'Award up to 8 marks for a complete plan covering: METHOD (use thiosulfate + flask + cross + add acid), MEASUREMENTS (volume of acid + time for cross to disappear + repeat at other concentration), CONTROLS (volume of acid kept constant), CONCLUSION (compare times → relate to concentration trend). PENALISE: putting paper inside the flask; using paper for chromatography (wrong context); not REPEATING at second concentration; saying ''amount'' instead of ''volume''.',
    E'**The classic ''disappearing cross'' experiment** for measuring reaction rate:\n\n**Method:**\n1. Pour 50 cm³ of sodium thiosulfate (0.25 mol/dm³) into a conical flask.\n2. Place the conical flask **on top of** the A4 paper with the cross marked on it — you''ll look DOWN through the flask at the cross.\n3. Add a measured volume of dilute HCl (e.g. 10 cm³) using a measuring cylinder. Start the stopwatch immediately.\n4. Stop the stopwatch when the cross **disappears from view** (because sulfur has clouded the solution).\n\n**Measurements:**\n• Volume of HCl (using 20 cm³ measuring cylinder)\n• Time for cross to disappear (stopwatch)\n\n**Repeat** with 50 cm³ of the 1.00 mol/dm³ thiosulfate (a different concentration).\n\n**Variables to KEEP THE SAME** (controls):\n• Volume of HCl\n• Volume of thiosulfate\n• Temperature\n• Same person watching the cross\n\n**Conclusion:**\n• Compare the two times. Shorter time = faster reaction.\n• If the **higher concentration gives the shorter time**, then rate **does depend** on concentration of thiosulfate (higher concentration → more particles → more collisions → faster rate).',
    true
  );

  raise notice 'Inserted 18 sub-parts for Chemistry NSSCO 2023 Paper 3';
end $$;
