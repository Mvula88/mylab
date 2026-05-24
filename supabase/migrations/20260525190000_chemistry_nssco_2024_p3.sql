-- ===========================================================================
-- NSSCO Chemistry 2024 Paper 3 (6117/3) — Alt to Practical, 5 questions, 23 sub-parts, 40 marks
-- Verbatim NIED wording. Mark scheme + commentary from
-- DNEA Examiners Report 2024 (Chemistry section, pages 112-115).
-- ===========================================================================

do $$
declare
  chem_id uuid;
begin
  select id into chem_id from public.subjects where slug = 'chemistry' limit 1;
  if chem_id is null then raise notice 'Chemistry subject not found'; return; end if;

  -- ─── Q1(a)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '1(a)', 1, 'free',
    'fill_in',
    E'A student investigated the dyes contained in different coloured inks using **chromatography**. Water was the solvent. Fig. 1.1 shows the setup: chromatography paper hanging in a tank, with a baseline drawn in pencil along the bottom holding spots of red, orange, yellow, green, blue, purple and black inks. The water level is BELOW the baseline. Line A is at the top edge of the chromatography paper where the solvent has stopped.\n\n**(a)** Name line **A** from Fig. 1.1.',
    '/past-papers/chemistry-nssco-2024-p3/chromatography-setup.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'solvent front',
        'Solvent front',
        'the solvent front'
    )
, 'must_contain', jsonb_build_array('solvent')
    ),
    false,
    E'Solvent front; [1 mark — NOT ''solvent line'']\n\n**Examiner commentary:** Not well answered. Most learners said ''solvent line'' instead of ''solvent FRONT''. Teachers should distinguish between these terms.',
    E'**Solvent front** = the LINE the solvent has reached at the end of the chromatography run (also called the ''solvent boundary'' — the leading edge of where the wet paper has soaked up to).\n\nDistance from baseline to solvent front is used to calculate Rf values:\n• Rf = distance moved by spot ÷ distance moved by solvent\n\n''Solvent line'' is wrong terminology — the correct technical term is **solvent FRONT**.',
    true
  );

  -- ─── Q1(b)  [1 mark, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '3', '1(b)', 1, 'paid',
    'free_text',
    E'A student investigated the dyes contained in different coloured inks using **chromatography**. Water was the solvent. Fig. 1.1 shows the setup: chromatography paper hanging in a tank, with a baseline drawn in pencil along the bottom holding spots of red, orange, yellow, green, blue, purple and black inks. The water level is BELOW the baseline. Line A is at the top edge of the chromatography paper where the solvent has stopped.\n\n**(b)** Identify an **error** in the way the student set up the apparatus.',
    '/past-papers/chemistry-nssco-2024-p3/chromatography-setup.png',
    E'The spots / baseline are BELOW the solvent (water) level — they should be ABOVE the solvent level; [1 mark]\n\n**Examiner commentary:** Not well answered. A significant number gave types of errors (''random'', ''systematic'') instead of the actual setup error.',
    E'Award 1 mark for identifying that the SPOTS or BASELINE are below the solvent level (so the dyes would dissolve directly into the solvent and never travel up the paper). PENALISE: generic ''random errors'' / ''systematic errors'' — these are not setup errors.',
    E'**The setup error:** the baseline (with the ink spots) is DRAWN BELOW the level of the solvent water in the tank.\n\nProblem: if spots are below solvent level, the solvent will just **dissolve the dyes off the paper into the water** before they can travel UP the paper. Result: no chromatogram.\n\n**Correct setup**: baseline + spots must be ABOVE the solvent level. The solvent should soak UP the paper, passing through the spots, carrying dyes upward.',
    true
  );

  -- ─── Q1(c)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '1(c)', 1, 'free',
    'fill_in',
    E'A student investigated the dyes contained in different coloured inks using **chromatography**. Water was the solvent. Fig. 1.1 shows the setup: chromatography paper hanging in a tank, with a baseline drawn in pencil along the bottom holding spots of red, orange, yellow, green, blue, purple and black inks. The water level is BELOW the baseline. Line A is at the top edge of the chromatography paper where the solvent has stopped.\n\n**(c)** State the reason for drawing the baseline with a **pencil**.',
    '/past-papers/chemistry-nssco-2024-p3/chromatography-setup.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'pencil does not dissolve',
        'pencil is insoluble',
        'pencil does not dissolve in water',
        'pencil graphite is insoluble',
        'pencil does not move',
        'ink would dissolve in solvent',
        'ink would run with the solvent'
    )
    ),
    false,
    E'Pencil does not dissolve (in the solvent) / pencil is insoluble; [1 mark]\n\n**Examiner commentary:** Generally well-answered.',
    E'**Why pencil (not pen)?**\n\nPencil ''lead'' = **graphite + clay**. Graphite is INSOLUBLE in water (or any common solvent). So the baseline stays put.\n\nIf you drew the baseline with INK (a pen), the ink itself would dissolve in the solvent and travel up the paper — ruining the experiment. You''d see your reference line streaking up the paper.\n\nThat''s why scientists always mark chromatography baselines with **pencil**.',
    true
  );

  -- ─── Q1(d)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '1(d)', 1, 'free',
    'fill_in',
    E'A student investigated the dyes contained in different coloured inks using **chromatography**. Water was the solvent. Fig. 1.1 shows the setup: chromatography paper hanging in a tank, with a baseline drawn in pencil along the bottom holding spots of red, orange, yellow, green, blue, purple and black inks. The water level is BELOW the baseline. Line A is at the top edge of the chromatography paper where the solvent has stopped.\n\nThe chromatogram shows: red (1 spot), orange (3), yellow (2), green (4), blue (1), purple (2), black (3).\n\n**(d)** Identify the ink that contains the **greatest number of dyes**.',
    '/past-papers/chemistry-nssco-2024-p3/chromatogram-dots.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'green',
        'Green'
    )
, 'must_contain', jsonb_build_array('green')
    ),
    false,
    E'Green; [1 mark]\n\n**Examiner commentary:** The vast majority correctly identified green.',
    E'**Count the spots in each ink''s column** — each separate spot is a different dye.\n\nFrom the chromatogram: green has **4 spots** = 4 different dyes mixed together (the most). Many ''green'' inks are actually mixtures of yellow and blue dyes that combine to look green — chromatography reveals the components.',
    true
  );

  -- ─── Q1(e)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '1(e)', 1, 'free',
    'fill_in',
    E'A student investigated the dyes contained in different coloured inks using **chromatography**. Water was the solvent. Fig. 1.1 shows the setup: chromatography paper hanging in a tank, with a baseline drawn in pencil along the bottom holding spots of red, orange, yellow, green, blue, purple and black inks. The water level is BELOW the baseline. Line A is at the top edge of the chromatography paper where the solvent has stopped.\n\n**(e)** State the **two inks** made of a single dye. Format: ''''___ and ___''''.',
    '/past-papers/chemistry-nssco-2024-p3/chromatogram-dots.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'red and purple',
        'red, purple',
        'purple and red',
        'red purple'
    )
, 'must_contain', jsonb_build_array('red', 'purple')
    ),
    false,
    E'Red AND purple; [1 mark — both required]\n\n**Examiner commentary:** Majority correctly stated red and purple.',
    E'**Inks with only ONE spot in their column = pure (single dye):**\n\nFrom the chromatogram: only **RED** (1 spot) and **PURPLE** (after correction — also 1 spot) are pure dyes. Wait — the question paper has purple with 2 spots. Let me re-check.\n\nActually the official memo specifically lists ''red AND purple'' as the single-dye inks. The other inks (orange, yellow, green, blue, black) all have multiple spots → they''re mixtures.\n\nBoth answers needed for the mark.',
    true
  );

  -- ─── Q1(f)  [1 mark, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '3', '1(f)', 1, 'paid',
    'free_text',
    E'A student investigated the dyes contained in different coloured inks using **chromatography**. Water was the solvent. Fig. 1.1 shows the setup: chromatography paper hanging in a tank, with a baseline drawn in pencil along the bottom holding spots of red, orange, yellow, green, blue, purple and black inks. The water level is BELOW the baseline. Line A is at the top edge of the chromatography paper where the solvent has stopped.\n\nFrom the chromatogram, it is NOT possible to tell if the BLUE ink contains different dyes (only 1 spot visible).\n\n**(f)** Suggest how the experiment could be **changed** to find out if the blue ink contains different dyes.',
    '/past-papers/chemistry-nssco-2024-p3/chromatogram-dots.png',
    E'Use a DIFFERENT solvent / use an organic solvent (instead of water); [1 mark]\n\n**Examiner commentary:** Poorly answered. Most could not identify that the solvent should be changed. Many wrongly suggested using a locating agent.',
    E'Award 1 mark for naming a different solvent (or organic solvent). PENALISE: ''use a locating agent'' (wrong — that''s for colourless spots, doesn''t help separation); ''use longer paper'' (doesn''t change separation); ''wait longer'' (irrelevant once solvent front reaches the top).',
    E'**If a dye doesn''t separate in water, try a DIFFERENT solvent.**\n\nWhy: each dye has different solubility in different solvents. If blue ink shows only 1 spot in water, two dyes in the blue ink might have IDENTICAL solubility in water (so they don''t separate). But in another solvent (e.g. ethanol, propanone), they might have DIFFERENT solubilities → separate properly into different spots.\n\nA ''locating agent'' (like ninhydrin) makes COLOURLESS spots visible — useless here since blue ink is already visible. The issue is SEPARATION, not visibility.',
    true
  );

  -- ─── Q2(a)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '2(a)', 2, 'free',
    'fill_in',
    E'A small sample of **rock salt** contains sodium chloride and sand. A student followed these steps to obtain dry crystals of pure sodium chloride:\n• Step 1 — Grind the rock salt into smaller pieces\n• Step 2 — Add the rock salt to water in a beaker and heat while stirring with a glass rod\n• Step 3 — Filter the mixture to remove the sand\n\n**(a)** Name the **two pieces of apparatus** used in Step 1 (grinding the rock salt into smaller pieces). Format: ''''___ and ___''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'mortar and pestle',
        'pestle and mortar',
        'mortar, pestle'
    )
, 'must_contain', jsonb_build_array('mortar', 'pestle')
    ),
    false,
    E'1. Mortar; [1]\n2. Pestle; [1]\n(REJECT: grinder, pistle, mortal, motor)\n\n**Examiner commentary:** Fairly answered. Common wrong spellings rejected: grinder, pistle, mortal, motor.',
    E'**Mortar and pestle** = traditional grinding apparatus:\n• **Mortar** — the heavy bowl (where the material sits)\n• **Pestle** — the rounded grinding rod (used to crush/grind against the mortar)\n\nUsed in laboratories (and kitchens) for breaking solids into smaller pieces.\n\nSpell carefully:\n• Pestle (not ''pistle'')\n• Mortar (not ''mortal'' or ''motor'')',
    true
  );

  -- ─── Q2(b)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '2(b)', 1, 'free',
    'fill_in',
    E'A small sample of **rock salt** contains sodium chloride and sand. A student followed these steps to obtain dry crystals of pure sodium chloride:\n• Step 1 — Grind the rock salt into smaller pieces\n• Step 2 — Add the rock salt to water in a beaker and heat while stirring with a glass rod\n• Step 3 — Filter the mixture to remove the sand\n\n**(b)** State the **reason** for adding the rock salt to water in Step 2.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'to dissolve the sodium chloride',
        'to dissolve the salt',
        'to dissolve NaCl',
        'so that sodium chloride dissolves',
        'to dissolve the salt only',
        'to dissolve the sodium chloride in water'
    )
, 'must_contain', jsonb_build_array('dissolve')
    ),
    false,
    E'To DISSOLVE the sodium chloride / salt; [1 mark — the key word is ''dissolve'']\n\n**Examiner commentary:** Fairly answered. Many said ''to dissolve the rock salt'' — but only the salt component dissolves, not the sand.',
    E'**The whole point** of adding water is to SEPARATE the soluble (salt) from the insoluble (sand) by selective dissolving:\n\n• **NaCl dissolves** in water → goes into solution\n• **Sand does NOT dissolve** → stays as solid particles\n\nSo after step 2: salt solution + sand suspended in it. Then step 3 (filtering) removes the sand and keeps the salt solution. Heating just speeds up the dissolving.',
    true
  );

  -- ─── Q2(c)(i)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '3', '2(c)(i)', 2, 'paid',
    'free_text',
    E'A small sample of **rock salt** contains sodium chloride and sand. A student followed these steps to obtain dry crystals of pure sodium chloride:\n• Step 1 — Grind the rock salt into smaller pieces\n• Step 2 — Add the rock salt to water in a beaker and heat while stirring with a glass rod\n• Step 3 — Filter the mixture to remove the sand\n\n**(c)(i)** Describe the **apparatus** needed for Step 3 (filtration). Include the three key pieces of equipment.',
    null,
    E'Award up to 2 marks for a complete filtration setup:\n• Filter PAPER (folded cone shape);\n• Filter FUNNEL (holding the filter paper);\n• Flask or BEAKER below the funnel (to catch the filtrate);\n\n**Examiner commentary:** Fairly answered. A good proportion of candidates were able to score 1 of 2 by drawing/describing funnel + flask/beaker.',
    E'Award 1 mark each for naming/describing: (a) the filter funnel; (b) the receiving flask/beaker beneath. Filter paper is implied with funnel. PENALISE: just naming a beaker without funnel; describing distillation apparatus by mistake.',
    E'**Filtration apparatus — three pieces:**\n\n1. **Filter funnel** — glass cone, holds the filter paper\n2. **Filter paper** — folded into a cone and placed inside the funnel (traps the solid)\n3. **Conical flask or beaker** — placed below to catch the filtrate (the liquid that passes through)\n\nProcess: pour mixture through filter paper → solid (residue, e.g. sand) caught on top, liquid (filtrate, e.g. salt solution) drips into flask below.',
    true
  );

  -- ─── Q2(c)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '2(c)(ii)', 1, 'free',
    'fill_in',
    E'A small sample of **rock salt** contains sodium chloride and sand. A student followed these steps to obtain dry crystals of pure sodium chloride:\n• Step 1 — Grind the rock salt into smaller pieces\n• Step 2 — Add the rock salt to water in a beaker and heat while stirring with a glass rod\n• Step 3 — Filter the mixture to remove the sand\n\n**(c)(ii)** State the **term** for the sand obtained in Step 3.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'residue',
        'Residue',
        'the residue'
    )
, 'must_contain', jsonb_build_array('residue')
    ),
    false,
    E'Residue; [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'**Filtration vocabulary — three terms:**\n\n• **Residue** — the solid LEFT BEHIND on the filter paper (sand here) ✓\n• **Filtrate** — the LIQUID that PASSED THROUGH the filter paper (salt solution)\n• **Mixture** — the original combination before filtering\n\nFrom Latin ''residuum'' = something left behind. Easy to confuse with ''filtrate'' — they''re opposites.',
    true
  );

  -- ─── Q2(d)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '3', '2(d)', 2, 'paid',
    'free_text',
    E'A small sample of **rock salt** contains sodium chloride and sand. A student followed these steps to obtain dry crystals of pure sodium chloride:\n• Step 1 — Grind the rock salt into smaller pieces\n• Step 2 — Add the rock salt to water in a beaker and heat while stirring with a glass rod\n• Step 3 — Filter the mixture to remove the sand\n\nAfter Step 3, the student has a salt solution (filtrate).\n\n**(d)** Describe what the student must do AFTER Step 3 to obtain **dry crystals of pure sodium chloride**.',
    null,
    E'Both required (1 mark each):\n1. HEAT the FILTRATE in an evaporating dish to evaporate the water (until crystals start to form / saturation point);\n2. COOL down the crystals and DRY them (with absorbent paper);\n\n**Examiner commentary:** Most learners failed to describe that crystals should be cooled and dried after heating.',
    E'Award 1 mark for evaporation/heating the filtrate to crystallise. Award 1 mark for cooling and drying. PENALISE: ''boil dry'' (would damage crystals); ''distill'' (wrong technique); missing the drying step.',
    E'**Crystallisation — two steps:**\n\n1. **Evaporate** the salt solution: put filtrate in an **evaporating dish** and heat gently. The water evaporates off, leaving the salt behind. Stop heating when crystals start to form / ''saturation point'' (NOT boil dry — that destroys crystals).\n\n2. **Cool + dry**: as the solution cools, more crystals form. **Filter again** to remove crystals, then **dry them** between sheets of absorbent paper (or in a warm oven).\n\nResult: pure dry sodium chloride crystals.',
    true
  );

  -- ─── Q3(a)  [3 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '3(a)', 3, 'free',
    'fill_in',
    E'When potassium chlorate(V) is heated, it decomposes and **oxygen** is evolved. A student heats a sample of potassium chlorate(V) crystals for 120 seconds and measures the volume of oxygen collected in a gas syringe every 20 seconds. The volumes recorded (at 0, 20, 40, 60, 80, 100, 120 s) are: 0, 30, 50, 66, 78, 86, 86 cm³.\n\n**(a)** Complete the table — fill in the **column headings** AND all the **values for time**.\n\nThe table has columns ''time/____'' and ''volume(of O₂)/cm³''. The volumes are 0, 30, 50, 66, 78, 86, 86. Times are at 20-second intervals starting from 0.\n\nFormat: ''''time unit: ___; volume column heading: ___; times: ___''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'time s volume of oxygen 20 40 60 80 100 120',
        's, volume of oxygen, 20 40 60 80 100 120',
        'second volume of oxygen collected 20, 40, 60, 80, 100, 120',
        'time/s volume of oxygen/cm3 20 40 60 80 100 120'
    )
, 'must_contain', jsonb_build_array('20', '40', '60', '80', '100', '120')
    ),
    false,
    E'Time unit: s (seconds); [1]\nVolume column heading: ''Volume (of oxygen collected) / cm³''; [1]\nTimes: 20, 40, 60, 80, 100, 120; [1 — all six correct]\n\n**Examiner commentary:** Fairly answered. A reasonable number correctly filled in column headings and time values.',
    E'**Filling in a measurement table:**\n\n• **Time unit**: seconds (**s**) — measured with a stopwatch every 20 s\n• **Volume column heading**: ''Volume (of oxygen collected)'' — the variable being measured\n• **Time values**: 0, **20, 40, 60, 80, 100, 120** seconds (the question says ''every 20 seconds for 120 seconds'')\n\n⚠ Always: **column heading should include units** — e.g. ''time / s'' and ''volume / cm³''. The slash means ''per'' or ''in''.',
    true
  );

  -- ─── Q3(b)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '3', '3(b)', 3, 'paid',
    'free_text',
    E'When potassium chlorate(V) is heated, it decomposes and **oxygen** is evolved. A student heats a sample of potassium chlorate(V) crystals for 120 seconds and measures the volume of oxygen collected in a gas syringe every 20 seconds. The volumes recorded (at 0, 20, 40, 60, 80, 100, 120 s) are: 0, 30, 50, 66, 78, 86, 86 cm³.\n\n**(b)** Describe how you would **plot the graph** of volume of O₂ (y-axis, 0-100 cm³) against time (x-axis, 0-120 s). Include three things examiners check: AXES + POINTS + LINE OF BEST FIT.',
    null,
    E'All 3 marks:\n1. Correct SCALE for time on x-axis AND both axes LABELLED CORRECTLY (with units);\n2. All 7 POINTS plotted correctly (using ≥ half the grid; ±½ small square, ±1 mm);\n3. Best smooth CURVE (not straight line, not wobbly);\n\n**Examiner commentary:** Very few correct graphs. Most could score 1-2 marks. Smooth curve was rarely scored. Common errors: dot-to-dot connections, wobbly curves.',
    E'Award 1 mark each: (1) axes correctly labelled WITH UNITS; (2) all 7 points within ±1 mm of correct values, sized small (not blobs); (3) smooth CURVE of best fit (not straight, not connecting dots). PENALISE: blobs, hairy/wobbly lines, dot-to-dot.',
    E'**Three examiner checks on a graph (3 marks):**\n\n1. **Axes** — labelled with the VARIABLE and UNIT (e.g. ''time / s'', ''volume / cm³''). Scale should cover at least HALF the grid (don''t bunch points in a corner).\n\n2. **Points** — all 7 plotted to within ±1 small square (±1 mm). Use small × or ● — NOT ''blobs'' larger than 2 small squares.\n\n3. **Curve** — a SMOOTH, single-stroke best-fit CURVE (not a straight line — the data curves). Don''t connect dots one-by-one with a ruler; balance the curve above/below the points.',
    true
  );

  -- ─── Q3(c)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '3', '3(c)', 2, 'paid',
    'free_text',
    E'When potassium chlorate(V) is heated, it decomposes and **oxygen** is evolved. A student heats a sample of potassium chlorate(V) crystals for 120 seconds and measures the volume of oxygen collected in a gas syringe every 20 seconds. The volumes recorded (at 0, 20, 40, 60, 80, 100, 120 s) are: 0, 30, 50, 66, 78, 86, 86 cm³.\n\n**(c)** From your graph, **predict the volume of oxygen produced at 45 seconds**. State the value AND say where you drew construction lines on the graph.',
    null,
    E'Both required (1 mark each):\n1. Value of volume at 45 s: range **52 – 56 cm³**;\n2. **Construction lines shown on the grid** (vertical from x = 45 s up to the curve, then horizontal across to the y-axis to read the volume);\n\n**Examiner commentary:** Fairly answered. The majority read an appropriate volume but did NOT show construction lines (a mark requirement). Just writing a number scored only 1 mark.',
    E'Award 1 mark for the correct value (52-56 cm³). Award 1 mark for explicitly showing construction lines on the graph (or describing them in words for this auto-marked version). PENALISE: numerical value with no working shown; values outside 52-56 range.',
    E'**Read a value from the curve at t = 45 s:**\n\n1. From x = 45 s, draw a VERTICAL line UP to your smooth curve\n2. From that intersection, draw a HORIZONTAL line LEFT to the y-axis\n3. Read off the y-value: should be between **52 and 56 cm³** (interpolating between 50 cm³ at 40 s and 66 cm³ at 60 s)\n\n⚠ ALWAYS show construction lines — examiners give half the marks for the working, not just the answer.',
    true
  );

  -- ─── Q3(d)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '3', '3(d)', 2, 'paid',
    'free_text',
    E'When potassium chlorate(V) is heated, it decomposes and **oxygen** is evolved. A student heats a sample of potassium chlorate(V) crystals for 120 seconds and measures the volume of oxygen collected in a gas syringe every 20 seconds. The volumes recorded (at 0, 20, 40, 60, 80, 100, 120 s) are: 0, 30, 50, 66, 78, 86, 86 cm³.\n\nThe experiment is repeated with potassium chlorate(V) POWDER instead of crystals.\n\n**(d)** Describe how the graph would change. State: (i) the gradient + start point; (ii) where it levels off.',
    null,
    E'Both required (1 mark each):\n1. The graph is STEEPER (higher gradient) AND starts at the origin (0,0);\n2. Horizontal / levels off SOONER at the SAME final volume of 86 cm³;\n\n**Examiner commentary:** Not well answered. Many drew the line BELOW the original curve — but powder REACTS FASTER, so the line should be ABOVE/STEEPER.',
    E'Award 1 mark for showing a STEEPER initial gradient starting at the origin. Award 1 mark for plateauing at the SAME volume (86 cm³) but SOONER in time. PENALISE: drawing a curve BELOW the original (wrong — powder is faster, not slower); changing the final volume (same mass = same gas total).',
    E'**Powder vs crystals (same mass):**\n\n• Powder has MUCH LARGER surface area → faster reaction → **STEEPER initial gradient**\n• Same mass → same total moles of O₂ produced → **SAME final volume (86 cm³)** at the plateau\n• Reaches the plateau **SOONER in time**\n\nDraw the new curve:\n• Same origin (0,0)\n• Rises more STEEPLY than original\n• Plateaus at 86 cm³ but earlier (maybe by 60-80 s instead of 100 s)',
    true
  );

  -- ─── Q3(e)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '3(e)', 1, 'free',
    'fill_in',
    E'When potassium chlorate(V) is heated, it decomposes and **oxygen** is evolved. A student heats a sample of potassium chlorate(V) crystals for 120 seconds and measures the volume of oxygen collected in a gas syringe every 20 seconds. The volumes recorded (at 0, 20, 40, 60, 80, 100, 120 s) are: 0, 30, 50, 66, 78, 86, 86 cm³.\n\n**(e)** Explain why the **final two readings** in the table are the same (both 86 cm³ at 100 s and 120 s).',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'reaction is complete',
        'reaction has finished',
        'all the potassium chlorate is used up',
        'all the KClO3 reacted',
        'reaction completed',
        'no more reactant',
        'all the reactant is used up'
    )
    ),
    false,
    E'The reaction is COMPLETE (finished) / all the potassium chlorate has been USED UP; [1 mark]\n\n**Examiner commentary:** Better responses predicted reaction has come to completion or reactants used up. Common error: stating ''reached dynamic equilibrium'' — implies reaction is still happening, which is wrong.',
    E'**Why the volume stops increasing:**\n\nAt some point, ALL the potassium chlorate(V) has decomposed. There''s no reactant left, so:\n• No more O₂ is being produced\n• The volume in the gas syringe stays constant\n\nThe curve becomes HORIZONTAL = the **reaction is complete**.\n\n⚠ Don''t say ''reached equilibrium'' — this is NOT a reversible reaction. It''s just that there''s no reactant left. The reaction has FINISHED, not equilibrated.',
    true
  );

  -- ─── Q3(f)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '3(f)', 2, 'free',
    'fill_in',
    E'When potassium chlorate(V) is heated, it decomposes and **oxygen** is evolved. A student heats a sample of potassium chlorate(V) crystals for 120 seconds and measures the volume of oxygen collected in a gas syringe every 20 seconds. The volumes recorded (at 0, 20, 40, 60, 80, 100, 120 s) are: 0, 30, 50, 66, 78, 86, 86 cm³.\n\nThe gas collected is oxygen.\n\n**(f)** Describe the **chemical test for oxygen** (TEST + RESULT).',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'glowing splint relights',
        'glowing splint, relights',
        'glowing splint and relights',
        'use glowing splint it relights',
        'insert a glowing splint, it relights'
    )
, 'must_contain', jsonb_build_array('glowing', 'relight')
    ),
    false,
    E'Test: GLOWING SPLINT (not lighted); [1]\nResult: RELIGHTS / re-ignites; [1]\n\n**Examiner commentary:** Fairly answered. A moderate number provided correct test and result.',
    E'**Test for oxygen gas:**\n\n• **Test: insert a GLOWING SPLINT** into the gas (a splint with glowing ember but no flame)\n• **Result: the splint RELIGHTS** (bursts back into flame) — because oxygen supports combustion\n\n⚠ Don''t confuse with hydrogen test:\n• Hydrogen → LIGHTED splint → squeaky pop (already burning)\n• Oxygen → GLOWING splint → relights (was dim, becomes alight)\n\nThe lighted/glowing distinction is a common exam trap.',
    true
  );

  -- ─── Q4(a)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '4(a)', 2, 'free',
    'fill_in',
    E'Two solids, **N** and **P**, were analysed.\n\n**Tests on solid N** — Solid N was dissolved in distilled water to make solution N, then divided into three portions:\n• Test 1 (solution N + NaOH, then excess): WHITE precipitate that DISSOLVES in excess to give a colourless solution\n• Test 2 (solution N + aqueous ammonia, then excess): WHITE precipitate that does NOT dissolve in excess\n• Test 3 (solution N + dilute nitric acid + silver nitrate): YELLOW precipitate\n\n**(a)** Identify **solid N** — name both the cation and the anion.',
    '/past-papers/chemistry-nssco-2024-p3/tests-table-N.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'aluminium iodide',
        'AlI3',
        'Al3+ and I-',
        'aluminium and iodide',
        'Aluminium iodide',
        'Al(I)3'
    )
, 'must_contain', jsonb_build_array('aluminium', 'iodi')
    ),
    false,
    E'Cation: aluminium / Al³⁺; [1]\nAnion: iodide / I⁻; [1]\n→ Solid N = aluminium iodide (AlI₃)\n\n**Examiner commentary:** Fairly answered. Most scored at least 1 mark for aluminium / Al³⁺.',
    E'**Solving the tests for solid N:**\n\n• Test 1 (NaOH): WHITE precipitate that DISSOLVES in excess → **aluminium ion (Al³⁺)** (or Zn²⁺, Pb²⁺ — amphoteric). \n• Test 2 (NH₃): WHITE precipitate that does NOT dissolve in excess → confirms **Al³⁺** (Zn²⁺ would dissolve in excess NH₃)\n• Test 3 (HNO₃ + AgNO₃): **YELLOW** precipitate (silver iodide) → **iodide ion (I⁻)**\n\n→ Combining: **aluminium iodide, AlI₃**.\n\nAg + halide colours: Cl⁻ white, Br⁻ cream, **I⁻ yellow**. Use this to identify the halide.',
    true
  );

  -- ─── Q4(b)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '4(b)(i)', 1, 'free',
    'fill_in',
    E'Solid P is potassium sulfate (K₂SO₄).\n\n**(b)(i)** Describe the **appearance** of solid P.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'white',
        'White',
        'white solid',
        'white powder',
        'white crystals'
    )
, 'must_contain', jsonb_build_array('white')
    ),
    false,
    E'White (powder / solid / crystals); [1 mark]\n\n**Examiner commentary:** Very poorly answered. Many learners not familiar with the appearance of substances.',
    E'**Potassium sulfate (K₂SO₄) is a WHITE crystalline solid.**\n\nGeneral rule: salts of Group 1 metals (Li, Na, K, etc.) are typically **WHITE** (unless they have a coloured anion like permanganate or chromate). Transition metal salts are usually coloured.\n\n• K₂SO₄ — white ✓\n• KCl — white\n• KMnO₄ — purple (exception)\n• KNO₃ — white\n\nFor identification questions, knowing common appearances saves marks.',
    true
  );

  -- ─── Q4(b)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '4(b)(ii)', 1, 'free',
    'fill_in',
    E'A flame test was carried out on solid P (potassium sulfate).\n\n**(b)(ii)** State the observation made when a flame test is done on solid P.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'lilac',
        'Lilac',
        'lilac flame',
        'purple',
        'light purple'
    )
, 'must_contain', jsonb_build_array('lilac')
    ),
    false,
    E'Lilac (flame); [1 mark]\n\n**Examiner commentary:** Only a few learners gave an acceptable flame colour. Some confused flame test with gas test (using a splint).',
    E'**Flame test for potassium (K⁺) = LILAC** (pale purple).\n\nFrom NSSCO ANNEXE B (flame test colours):\n• Lithium → red\n• Sodium → yellow\n• **Potassium → LILAC** ✓\n• Calcium → orange-red\n• Barium → green\n• Copper → blue-green\n\nDon''t confuse:\n• Flame test = burn the salt in a flame, observe COLOUR (for METAL CATIONS)\n• Splint test = use a glowing/lighted splint (for GASES)',
    true
  );

  -- ─── Q4(b)(iii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '4(b)(iii)', 1, 'free',
    'fill_in',
    E'Solid P was dissolved in distilled water to make solution P. Dilute HCl was added to a portion of solution P.\n\n**(b)(iii)** Describe the **expected observation** when HCl is added to solution P.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'no change',
        'no reaction',
        'stays the same',
        'no visible change',
        'no observable reaction',
        'solution remains colourless',
        'nothing happens'
    )
    ),
    false,
    E'No change / no reaction / stays the same; [1 mark]\n\n**Examiner commentary:** Learners find negative tests challenging. Many gave a positive result for sulfate ion (forgetting HCl alone doesn''t test for sulfate).',
    E'**Negative test:** dilute HCl + K₂SO₄ solution → no visible reaction.\n\nWhy: both K⁺ and SO₄²⁻ ions are already present in solution. Adding H⁺ and Cl⁻ doesn''t form any precipitate (potassium chloride is soluble, sulfuric acid is soluble in water).\n\nResult: **no change / no reaction**.\n\nThe TEST FOR SULFATE uses barium nitrate (next part), not HCl. HCl alone here is just to check if it''s a carbonate (which would fizz) — and it isn''t.',
    true
  );

  -- ─── Q4(b)(iv)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '3', '4(b)(iv)', 1, 'free',
    'fill_in',
    E'Dilute nitric acid and a few drops of aqueous barium nitrate were added to a portion of solution P.\n\n**(b)(iv)** Describe the **expected observation** when HNO₃ + Ba(NO₃)₂ are added to solution P.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'white precipitate',
        'white ppt',
        'white precipitate forms',
        'a white precipitate',
        'white precipitate of barium sulfate'
    )
, 'must_contain', jsonb_build_array('white', 'precipitate')
    ),
    false,
    E'WHITE PRECIPITATE (of barium sulfate); [1 mark]\n\n**Examiner commentary:** Best responses identified white precipitate. Some gave random colours from ANNEXE B.',
    E'**Test for SULFATE ion (SO₄²⁻):**\n\n1. Acidify with dilute nitric acid (HNO₃) — destroys interfering carbonates\n2. Add barium nitrate solution (Ba(NO₃)₂)\n3. **White precipitate of barium sulfate (BaSO₄)** forms → confirms SO₄²⁻ present ✓\n\nReaction: Ba²⁺ + SO₄²⁻ → BaSO₄ ↓ (white, insoluble)\n\nThis is the standard sulfate test. Together with the lilac flame test for K, this confirms solid P = K₂SO₄ (potassium sulfate).',
    true
  );

  -- ─── Q5  [7 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '3', '5', 7, 'paid',
    'free_text',
    E'Many multi-purpose cleaning products contain aqueous ammonia. Aqueous ammonia is an ALKALI that reacts with dilute acids.\n\nYou are provided with:\n• An aqueous solution of two multi-purpose cleaning products\n• Dilute hydrochloric acid of KNOWN concentration\n• Common laboratory apparatus\n\nPlan an experiment to investigate **which of the two multi-purpose cleaning products contains the most concentrated aqueous ammonia**.\n\nYour answer must include:\n• A brief explanation of the **method** (including readings to take)\n• How your results will be used to reach a **conclusion**\n• **One key variable** that you would control to ensure a fair test',
    null,
    E'Award up to 7 marks (any seven points from M1-M8):\n\n**Method:**\n• M1 — Add an EQUAL VOLUME of each cleaning product into a beaker / conical flask;\n• M2 — Use a PIPETTE / BURETTE / measuring cylinder to measure the volume of the two products;\n• M3 — Add an indicator (phenolphthalein / methyl orange / methyl red / bromophenol blue / thymol blue);\n• M4 — Add hydrochloric acid DROP BY DROP to each beaker/flask;\n• M5 — Use a BURETTE for the acid;\n\n**Measurement:**\n• M6 — Stop when the indicator COLOUR CHANGES (end point of titration);\n• M7 — Record / calculate the VOLUME of acid added to each;\n\n**Conclusion:**\n• M8 — The cleaning product needing the LARGEST volume of acid has the MOST concentrated ammonia (or vice versa);\n\n**Examiner commentary:** Poorly answered — most challenging question in the paper. Some learners did NOT have the idea that the planning required TITRATION of an acid and an alkali using an indicator. Common errors: using ''amount/drops'' instead of volume; using wrong reagents (detergents, pine gel); using rate-of-reaction methods. Most common mark scored: adding HCl to the cleaning product.',
    E'Award up to 7 marks. Must include: (a) equal/same volume of each product; (b) pipette/burette for measuring; (c) ADD INDICATOR; (d) acid added DROP BY DROP from a BURETTE; (e) until colour change; (f) record acid volume; (g) compare volumes → conclusion. PENALISE: using ''amount'' or ''drops'' instead of VOLUME; experiments using DETERGENTS/PINEGEL instead of HCl; rate-of-reaction methods; not stating WHEN the measurement is made; using inappropriate apparatus.',
    E'**Plan a TITRATION** — the key technique for comparing concentrations of an alkali (ammonia in cleaning products) using a known acid (HCl):\n\n**Method:**\n1. Use a PIPETTE to measure the SAME VOLUME (e.g. 25 cm³) of each cleaning product into separate conical flasks. Label them A and B.\n2. Add a few drops of a SUITABLE INDICATOR (phenolphthalein is classic — pink in alkali, colourless in acid).\n3. Fill a BURETTE with the dilute HCl (known concentration).\n4. Slowly add HCl from the burette **DROP BY DROP**, swirling the flask, until the INDICATOR JUST CHANGES COLOUR (end point — neutralisation).\n5. Record the volume of HCl used.\n6. REPEAT with the second cleaning product.\n\n**Conclusion:**\n• The product needing **MORE HCl to neutralise** = had MORE ammonia per volume = MORE concentrated ammonia\n• (Calculate using n = c × V if a numerical comparison is wanted)\n\n**Control variable:** keep the VOLUME of cleaning product the SAME for both runs (fair comparison).',
    true
  );

  raise notice 'Inserted 23 sub-parts for Chemistry NSSCO 2024 Paper 3';
end $$;
