-- ===========================================================================
-- NSSCO Physics 2024 Paper 2 (6118/2) — 8 questions, 46 sub-parts, 80 marks
-- Verbatim NIED wording. Mark scheme + commentary from
-- DNEA Examiners Report 2024 (Physics section, pages 656-662).
-- Uses the new 'calculation' question type for numeric answers.
-- ===========================================================================

do $$
declare
  phys_id uuid;
begin
  select id into phys_id from public.subjects where slug = 'physics' limit 1;
  if phys_id is null then raise notice 'Physics subject not found'; return; end if;

  -- ─── Q1(a)  [3 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '1(a)', 3, 'free',
    'fill_in',
    E'Classify these as scalar or vector: speed, velocity, distance, force, kinetic energy.\n\n**(a)** Complete Table 1.1 — state whether each is a scalar or vector. Format: ''''S V S V S'''' (in order speed, velocity, distance, force, KE).',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'scalar vector scalar vector scalar',
        'S V S V S',
        'scalar, vector, scalar, vector, scalar'
    )
, 'must_contain', jsonb_build_array('scalar', 'vector')
    ),
    false,
    E'Speed — Scalar; Velocity — Vector; Distance — Scalar; Force — Vector; Kinetic energy — Scalar; [3 marks: all 5 = 3; 3-4 = 2; 2 = 1; 1 or 0 = 0]\n\n**Examiner commentary:** Many answered correctly. Some couldn''t identify KE as scalar. Spelling errors cost marks.',
    E'**Vectors (magnitude AND direction):** velocity, force, displacement, acceleration, momentum, weight.\n**Scalars (magnitude only):** speed, distance, mass, time, energy (all forms — KE, PE), temperature, density.\n\n• Speed = SCALAR (just size; no direction)\n• Velocity = VECTOR (speed in a particular direction)\n• Distance = SCALAR (just total path length)\n• Force = VECTOR (has direction)\n• Kinetic energy = SCALAR (energy is a scalar — only how much, not which way)\n\nMemory hook: any kind of ENERGY is scalar. Velocity/force/acceleration are vector (they have an arrow).',
    true
  );

  -- ─── Q1(b)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '1(b)(i)', 1, 'free',
    'fill_in',
    E'Fig. 1.1 shows how the **speed of a car** varies over a short time. Different parts of the journey are labelled **A, B, C, D, E**:\n• A — flat at 0 m/s from t=0 to t=4 s\n• B — rising linearly from 0 to 16 m/s, t=4 to t=8 s\n• C — flat at 16 m/s from t=8 to t=20 s\n• D — falling linearly from 16 to 0 m/s, t=20 to t=28 s\n• E — flat at 0 m/s from t=28 onwards\n\n**(b)(i)** State a part of the graph (A, B, C, D or E) that shows the car **at rest**.',
    '/past-papers/physics-nssco-2024-p2/speed-time-graph.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'A',
        'E',
        'A or E',
        'a',
        'e'
    )
    ),
    false,
    E'A or E (both flat at speed = 0); [1 mark]\n\n**Examiner commentary:** Well answered. Some confused ''at rest'' on speed-time vs distance-time graphs.',
    E'**On a SPEED-TIME graph, ''at rest'' means speed = 0** (graph touching the time axis).\n\nLook for where the line is **AT zero** on the y-axis:\n• **A** — the car is at speed 0 at the start (before t=4 s)\n• **E** — the car is back at speed 0 at the end (after t=28 s)\n\nEither answer scores. Don''t confuse with constant speed (a horizontal line ABOVE the axis — that''s moving at constant speed, not ''at rest'').',
    true
  );

  -- ─── Q1(b)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '1(b)(ii)', 1, 'free',
    'fill_in',
    E'Fig. 1.1 shows how the **speed of a car** varies over a short time. Different parts of the journey are labelled **A, B, C, D, E**:\n• A — flat at 0 m/s from t=0 to t=4 s\n• B — rising linearly from 0 to 16 m/s, t=4 to t=8 s\n• C — flat at 16 m/s from t=8 to t=20 s\n• D — falling linearly from 16 to 0 m/s, t=20 to t=28 s\n• E — flat at 0 m/s from t=28 onwards\n\n**(b)(ii)** State a part of the graph that shows the car moving with **constant speed**.',
    '/past-papers/physics-nssco-2024-p2/speed-time-graph.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'C',
        'c'
    )
, 'must_contain', jsonb_build_array('C')
    ),
    false,
    E'C (flat horizontal line at 16 m/s); [1 mark]\n\n**Examiner commentary:** Most got this right. Some confused with B (constant acceleration).',
    E'**''Constant speed'' on a speed-time graph = horizontal line ABOVE the x-axis.**\n\n• **C** shows the car moving at a steady 16 m/s from t=8 s to t=20 s (flat horizontal line) ✓\n• B is a sloped line going UP — that''s constant ACCELERATION, not constant speed.\n• D is a sloped line going DOWN — that''s deceleration.\n\nFlat + non-zero = constant speed.',
    true
  );

  -- ─── Q1(b)(iii)  [3 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '1(b)(iii)', 3, 'paid',
    'calculation',
    E'Fig. 1.1 shows how the **speed of a car** varies over a short time. Different parts of the journey are labelled **A, B, C, D, E**:\n• A — flat at 0 m/s from t=0 to t=4 s\n• B — rising linearly from 0 to 16 m/s, t=4 to t=8 s\n• C — flat at 16 m/s from t=8 to t=20 s\n• D — falling linearly from 16 to 0 m/s, t=20 to t=28 s\n• E — flat at 0 m/s from t=28 onwards\n\n**(b)(iii)** During part **B** of the journey the speed of the car increases from 0 to 16 m/s in 4 s. Calculate the **acceleration** and state the unit.',
    '/past-papers/physics-nssco-2024-p2/speed-time-graph.png',
    jsonb_build_object(
      'value', 4.0::numeric,
      'tolerance', 0.05::numeric,
      'unit', 'm/s²',
      'accept_units', jsonb_build_array('m/s2', 'm/s^2', 'm s-2', 'ms-2', 'm/s²')
    ),
    E'Working: acceleration = Δv ÷ Δt;\n= (16 − 0) ÷ (8 − 4)\n= 16 ÷ 4\n= **4 m/s²**; [3 marks: 1 formula, 1 substitution, 1 answer + unit]\n\n**Examiner commentary:** Many candidates struggled — weaker candidates chose the wrong part of the journey. Few gave the correct units.',
    E'**Acceleration = change in velocity ÷ time taken** (the GRADIENT of a speed-time graph).\n\n**a = (v − u) / t**\n\nFor segment B (from t=4 s to t=8 s; speed 0 → 16 m/s):\n• Δv = 16 − 0 = 16 m/s\n• Δt = 8 − 4 = 4 s\n• a = 16 ÷ 4 = **4 m/s²** ✓\n\nUnit MUST be **m/s²** (metres per second squared) — pure number loses the mark.',
    true
  );

  -- ─── Q1(c)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '1(c)', 2, 'paid',
    'free_text',
    E'Another car accelerates from rest at time 0 s with constant acceleration. Its speed at t = 20 s is 10 m/s.\n\n**(c)** Describe the line you would draw on Fig. 1.1 to show this car''s motion.',
    '/past-papers/physics-nssco-2024-p2/speed-time-graph.png',
    E'Both required (1 mark each):\n1. A single STRAIGHT line drawn FROM THE ORIGIN (0,0);\n2. The line reaches 10 m/s at t = 20 s (acceleration = 0.5 m/s², no extra lines for constant speed or deceleration);\n\n**Examiner commentary:** Few drew correctly. Many added unnecessary lines (constant speed, deceleration) which lost marks.',
    E'Award 1 mark for a straight line starting at origin. Award 1 mark for ending exactly at (20, 10). PENALISE adding extra horizontal lines for constant speed; deceleration sections.',
    E'The car accelerates with CONSTANT acceleration starting at rest — that''s a STRAIGHT line on a speed-time graph (constant gradient).\n\n• Start at (0, 0) — at rest, time 0\n• End at (20, 10) — speed 10 m/s at t = 20 s\n• Draw a SINGLE straight line connecting these two points (gradient = 0.5 m/s²)\n\nDO NOT add other lines — the question only says ''constant acceleration'', not what happens after t = 20 s.',
    true
  );

  -- ─── Q1(d)  [1 mark, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '1(d)', 1, 'paid',
    'free_text',
    E'Fig. 1.1 shows how the **speed of a car** varies over a short time. Different parts of the journey are labelled **A, B, C, D, E**:\n• A — flat at 0 m/s from t=0 to t=4 s\n• B — rising linearly from 0 to 16 m/s, t=4 to t=8 s\n• C — flat at 16 m/s from t=8 to t=20 s\n• D — falling linearly from 16 to 0 m/s, t=20 to t=28 s\n• E — flat at 0 m/s from t=28 onwards\n\nA SECOND car is drawn on the same axes, starting from origin and reaching 10 m/s at t = 20 s.\n\n**(d)** Describe, using Fig. 1.1, how you can determine **which car has the greater acceleration** (comparing your line to part B of the original car).',
    '/past-papers/physics-nssco-2024-p2/speed-time-graph.png',
    E'The car with the STEEPER LINE (or GREATER GRADIENT) has the greater acceleration; [1 mark — must be a comparative statement]\n\n**Examiner commentary:** Only strong candidates gained credit. Many didn''t use comparative words like ''steeper line'' or ''greater gradient''.',
    E'Award 1 mark for COMPARATIVE language: ''steeper line'' / ''greater gradient'' / ''bigger slope''. PENALISE answers that just say ''calculate the gradient'' without comparison.',
    E'**On a speed-time graph, gradient = acceleration.** The STEEPER the line, the larger the acceleration.\n\nCompare visually:\n• Original car''s segment B: rises from 0 to 16 m/s in 4 s → a = 4 m/s² (very steep)\n• New car: rises from 0 to 10 m/s in 20 s → a = 0.5 m/s² (gentler slope)\n\nThe original car (segment B) has the STEEPER line → the GREATER acceleration.\n\nUse comparative words: ''steeper'', ''greater gradient'', ''bigger slope''.',
    true
  );

  -- ─── Q1(e)  [3 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '1(e)', 3, 'paid',
    'calculation',
    E'A particle moves at 4 m/s for 20 s, then at 6 m/s for another 20 s, and finally at 8 m/s for the next 10 s.\n\n**(e)** Calculate the **average speed** of the particle for the entire journey.',
    null,
    jsonb_build_object(
      'value', 5.6::numeric,
      'tolerance', 0.05::numeric,
      'unit', 'm/s',
      'accept_units', jsonb_build_array('m/s', 'ms-1', 'm s-1', 'm s^-1')
    ),
    E'Working: average speed = total distance ÷ total time\n= (4 × 20) + (6 × 20) + (8 × 10) ÷ (20 + 20 + 10)\n= (80 + 120 + 80) ÷ 50\n= 280 ÷ 50\n= **5.6 m/s**; [3 marks: 1 for formula, 1 for correct distances/total time, 1 for answer + unit]\n\n**Examiner commentary:** Many candidates added the three speeds and divided by 3 — wrong. Average speed = TOTAL distance ÷ TOTAL time, not the average of the speeds.',
    E'**Average speed = TOTAL distance ÷ TOTAL time** (NOT the average of the three speeds!).\n\nStep 1 — calculate distance for each segment:\n• 4 m/s × 20 s = 80 m\n• 6 m/s × 20 s = 120 m\n• 8 m/s × 10 s = 80 m\n• **Total distance = 280 m**\n\nStep 2 — total time:\n• 20 + 20 + 10 = **50 s**\n\nStep 3 — average speed:\n• 280 ÷ 50 = **5.6 m/s** ✓\n\nCommon trap: (4+6+8)/3 = 6 m/s — WRONG. Average speed isn''t the mean of speeds because the times spent at each speed differ.',
    true
  );

  -- ─── Q2(a)(i)  [3 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '2(a)(i)', 3, 'paid',
    'calculation',
    E'A man uses a metal bar as a lever to pull a nail from a piece of wood. He applies a force of **150 N perpendicular** to the bar, at **0.50 m** from the pivot (the nail itself acts as the pivot).\n\n**(a)(i)** Calculate the **moment** of this force about the pivot, and state the unit.',
    '/past-papers/physics-nssco-2024-p2/nail-lever.png',
    jsonb_build_object(
      'value', 75::numeric,
      'tolerance', 0.5::numeric,
      'unit', 'N m',
      'accept_units', jsonb_build_array('Nm', 'N m', 'N·m', 'newton metre', 'newton metres')
    ),
    E'Working: Moment = force × perpendicular distance from pivot\n= 150 × 0.50\n= **75 N m**; [3 marks: 1 formula, 1 substitution, 1 answer + unit Nm]\n\n**Examiner commentary:** Most got it. Few struggled with the unit ''N m''.',
    E'**Moment of force = Force × perpendicular distance from pivot.**\n\n**M = F × d**\n\n• F = 150 N\n• d = 0.50 m\n• M = 150 × 0.50 = **75 N m** ✓\n\nUnit is **N m** (newton-metres) — NOT to be confused with newton (force) or joule (work/energy). The unit shows that a moment has both a force component and a distance component.',
    true
  );

  -- ─── Q2(a)(ii)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '2(a)(ii)', 2, 'free',
    'fill_in',
    E'A man uses a metal bar as a lever to pull a nail from a piece of wood. He applies a force of **150 N perpendicular** to the bar, at **0.50 m** from the pivot (the nail itself acts as the pivot).\n\n**(a)(ii)** State **two other examples** of using the turning effect of a force.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'spanner door',
        'seesaw and wheelbarrow',
        'opening door, using spanner',
        'spanner, seesaw',
        'wheelbarrow door',
        'door, spanner',
        'opening a door, sitting on a seesaw'
    )
    ),
    false,
    E'Any two from: using a spanner to rotate a nut; sitting on a seesaw; opening or closing a door; pushing/pulling a wheelbarrow; any other valid turning-force example; [2 marks, 1 each]\n\n**Examiner commentary:** Many answered correctly. Some only mentioned the TOOL (spanner, pliers) without describing the turning effect.',
    E'**Turning-effect examples** — any device that uses leverage:\n• **Spanner / wrench** rotating a nut\n• **Door** opening on its hinges\n• **Seesaw** with people on either side\n• **Wheelbarrow** (force at handles, pivot at the wheel)\n• **Scissors** (two levers)\n• **Bottle opener**\n• **Pliers**\n\nName any TWO. Be specific — ''using a spanner'' is better than just ''spanner''.',
    true
  );

  -- ─── Q2(b)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '2(b)', 1, 'free',
    'fill_in',
    E'A man uses a metal bar as a lever to pull a nail from a piece of wood. He applies a force of **150 N perpendicular** to the bar, at **0.50 m** from the pivot (the nail itself acts as the pivot).\n\nThe man tries to remove a tougher nail but the turning effect is not enough.\n\n**(b)** How can the man **increase the turning effect WITHOUT increasing the force**?',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'increase the distance',
        'increase distance from pivot',
        'use a longer bar',
        'move force further from pivot',
        'increase the perpendicular distance',
        'apply force further from the pivot',
        'increase distance of force from pivot'
    )
, 'must_contain', jsonb_build_array('distance')
    ),
    false,
    E'Increase the distance (of the force from the pivot); [1 mark]\n\n**Examiner commentary:** Weaker candidates said ''increase the length of the metal bar'' — not enough. The mark requires increasing the perpendicular distance from pivot to the line of force.',
    E'**Moment = Force × distance.** If you can''t change F, change d.\n\nIncrease the **perpendicular distance** from the pivot to where the force is applied:\n• Push at the FAR end of the bar (not near the pivot)\n• Use a LONGER bar so you can push further out\n\nThis is why long levers (''give me a place to stand and I''ll move the world'' — Archimedes). Big d × small F can equal a huge moment.',
    true
  );

  -- ─── Q2(c)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '2(c)', 1, 'free',
    'fill_in',
    E'Equilibrium of a system.\n\n**(c)** State **one condition** for a system to be in **equilibrium**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'no resultant force',
        'no net force',
        'no resultant moment',
        'no net moment',
        'clockwise moment equals anticlockwise moment',
        'anticlockwise moment equals clockwise moment',
        'sum of forces is zero',
        'no resultant turning effect',
        'sum of moments is zero'
    )
    ),
    false,
    E'No resultant force / no resultant moment (or torque) / total anticlockwise moment = total clockwise moment; [1 mark]\n\n**Examiner commentary:** Many gave insufficient information — ''forces on both sides are equal'' isn''t quite the same as ''no resultant force''.',
    E'**Equilibrium = no NET force AND no NET moment (turning effect).**\n\nTwo conditions:\n1. **Sum of forces = 0** (no resultant force in any direction)\n2. **Sum of moments = 0** (clockwise = anticlockwise about ANY point)\n\nThe question asks for ONE condition — either one of these is correct.\n\nKey word: **NO RESULTANT** (not just ''balanced'' or ''forces are equal'' — be specific that the NET is zero).',
    true
  );

  -- ─── Q3(a)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '3(a)', 2, 'paid',
    'free_text',
    E'A substance starts in the solid state at −36 °C and is heated at a CONSTANT rate for 28 minutes. Temperature record:\n\n| time / min | 0 | 1 | 2 | 6 | 10 | 14 | 18 | 22 | 24 | 26 | 28 |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n| T / °C | −36 | −16 | −9 | −9 | −9 | −9 | 32 | 75 | 101 | 121 | 121 |\n\n**(a)** Define **latent heat**.',
    null,
    E'The quantity of heat energy absorbed OR released WHEN a substance changes state WITHOUT changing its temperature; [2 marks — need ''change of state'' AND ''constant/no change in temperature'']\n\n**Examiner commentary:** Most couldn''t define. Common confusion with specific heat capacity. Some left out the ''constant temperature'' part.',
    E'Award 1 mark for ''heat absorbed/released'' AND 1 mark for the two key conditions: ''change of state'' + ''no change in temperature''. PENALISE: defining specific heat capacity by mistake; missing the constant-temperature condition.',
    E'**Latent heat** = energy hidden in the bond-breaking (or bond-making) that happens DURING a state change — without the temperature changing.\n\nKey points:\n• Energy is **absorbed** (melting, boiling) or **released** (freezing, condensing)\n• Happens DURING a **change of state**\n• Temperature stays CONSTANT during the change (energy goes into breaking bonds, not into raising T)\n\nDon''t confuse with specific HEAT CAPACITY (which is energy to RAISE temperature by 1 K, not change state).',
    true
  );

  -- ─── Q3(b)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '3(b)', 1, 'free',
    'fill_in',
    E'A substance starts in the solid state at −36 °C and is heated at a CONSTANT rate for 28 minutes. Temperature record:\n\n| time / min | 0 | 1 | 2 | 6 | 10 | 14 | 18 | 22 | 24 | 26 | 28 |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n| T / °C | −36 | −16 | −9 | −9 | −9 | −9 | 32 | 75 | 101 | 121 | 121 |\n\n**(b)** State a **time** in Table 3.1 at which the energy is being supplied as **latent heat of fusion** (melting).',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '2',
        '6',
        '10',
        '14',
        '2 min',
        '6 min',
        '10 min',
        '14 min',
        '2 minutes'
    )
    ),
    false,
    E'Any time between 2 min and 14 min inclusive (the plateau at −9 °C — substance is melting); [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'**Latent heat of FUSION = energy absorbed during MELTING (solid → liquid).**\n\nLook for the **FLAT plateau** in the table where temperature stays constant — that''s when the substance is changing state.\n\nIn Table 3.1, T stays at **−9 °C from t = 2 to t = 14 minutes**. During this time:\n• Energy is still being supplied (heating at constant rate)\n• Temperature doesn''t change\n• → Energy is going into BREAKING the bonds of the solid (melting it)\n\nAny time between 2 and 14 min is acceptable.',
    true
  );

  -- ─── Q3(c)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '3(c)', 2, 'paid',
    'free_text',
    E'A substance starts in the solid state at −36 °C and is heated at a CONSTANT rate for 28 minutes. Temperature record:\n\n| time / min | 0 | 1 | 2 | 6 | 10 | 14 | 18 | 22 | 24 | 26 | 28 |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n| T / °C | −36 | −16 | −9 | −9 | −9 | −9 | 32 | 75 | 101 | 121 | 121 |\n\n**(c)** Explain the **energy changes** undergone by the molecules when latent heat of **vaporisation** is being supplied.',
    null,
    E'Both required (1 mark each):\n1. POTENTIAL energy of the molecules INCREASES (no change in kinetic energy because temperature is constant);\n2. Bonds / forces between molecules are WEAKENED or OVERCOME;\n\n**Examiner commentary:** Very poorly answered. Many wrongly said ''molecules gain kinetic energy'' — but at constant temperature, KE doesn''t change. It''s POTENTIAL energy that rises as bonds break.',
    E'Award 1 mark for ''potential energy increases'' (don''t accept ''kinetic energy increases'' — that would mean T rises). Award 1 mark for ''bonds weakened/broken'' or ''forces between molecules overcome''. PENALISE: ''molecules move faster'' — that implies KE going up, which doesn''t happen at constant T.',
    E'**During boiling (latent heat of vaporisation), temperature is constant** — so molecules'' average kinetic energy DOESN''T change (KE ∝ T).\n\nWhere does the energy go?\n• Into INCREASING the **POTENTIAL energy** of the molecules (separating them against intermolecular forces) ✓\n• The bonds / forces between molecules are **WEAKENED or OVERCOME**\n• Molecules become free to move much further apart (liquid → gas: large volume increase)\n\nKey distinction: KE = temperature; PE = arrangement. State change is PE change at constant KE.',
    true
  );

  -- ─── Q3(d)(i)  [2 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '3(d)(i)', 2, 'paid',
    'calculation',
    E'A substance starts in the solid state at −36 °C and is heated at a CONSTANT rate for 28 minutes. Temperature record:\n\n| time / min | 0 | 1 | 2 | 6 | 10 | 14 | 18 | 22 | 24 | 26 | 28 |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n| T / °C | −36 | −16 | −9 | −9 | −9 | −9 | 32 | 75 | 101 | 121 | 121 |\n\nThe rate of heating is **2.0 kW** (2000 W).\n\n**(d)(i)** Calculate how much **energy** is supplied to the substance during the period **18 to 22 minutes**.',
    null,
    jsonb_build_object(
      'value', 480000::numeric,
      'tolerance', 0.01::numeric,
      'unit', 'J',
      'accept_units', jsonb_build_array('J', 'joule', 'joules')
    ),
    E'Working: Energy = Power × time;\n= 2000 W × (22 − 18) × 60 s\n= 2000 × 240\n= **480 000 J** (or 480 kJ);\n[2 marks: 1 for formula and conversions, 1 for final answer]\n\n**Examiner commentary:** Fairly answered. Many forgot to convert kW → W or minutes → seconds.',
    E'**Energy = Power × time** (basic power formula).\n\nUnit watch:\n• Power: 2.0 kW = **2000 W** (must be in watts for joules)\n• Time: 22 − 18 = 4 min = **4 × 60 = 240 s** (must be in seconds)\n\nE = 2000 × 240 = **480 000 J** (= 480 kJ) ✓\n\nCommon trap: forgetting to convert kW to W (would give 4800 — wrong by ×1000) or minutes to seconds (would give 8000 — wrong by ×60). Always check units match.',
    true
  );

  -- ─── Q3(d)(ii)  [3 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '3(d)(ii)', 3, 'paid',
    'calculation',
    E'A substance starts in the solid state at −36 °C and is heated at a CONSTANT rate for 28 minutes. Temperature record:\n\n| time / min | 0 | 1 | 2 | 6 | 10 | 14 | 18 | 22 | 24 | 26 | 28 |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n| T / °C | −36 | −16 | −9 | −9 | −9 | −9 | 32 | 75 | 101 | 121 | 121 |\n\nSpecific heat capacity = **1760 J/(kg·°C)**. Use the data for 18-22 minutes (temperature goes from 32 °C to 75 °C; energy supplied = 480 000 J from part (i)).\n\n**(d)(ii)** Calculate the **mass** of the substance being heated.',
    null,
    jsonb_build_object(
      'value', 6.34::numeric,
      'tolerance', 0.05::numeric,
      'unit', 'kg',
      'accept_units', jsonb_build_array('kg', 'kilogram', 'kilograms')
    ),
    E'Working: Q = mcΔT → m = Q ÷ (c × ΔT)\n= 480 000 ÷ (1760 × (75 − 32))\n= 480 000 ÷ (1760 × 43)\n= 480 000 ÷ 75 680\n= **6.34 kg** (accept any rounding from 2 s.f.);\n[3 marks: 1 formula rearranged, 1 ΔT correct, 1 final answer]\n\n**Examiner commentary:** Fairly answered. Many failed to make m the subject of the formula. Some struggled to calculate ΔT = 75 − 32.',
    E'**Heat capacity formula: Q = m × c × ΔT.**\n\nRearrange for mass: **m = Q ÷ (c × ΔT)**\n\nValues:\n• Q = 480 000 J (from part (i))\n• c = 1760 J/(kg·°C)\n• ΔT = T_final − T_initial = 75 − 32 = **43 °C** (NOT 75 − 0!)\n\nm = 480 000 ÷ (1760 × 43) = 480 000 ÷ 75 680 = **6.34 kg** ✓\n\nWatch out: in the 18-22 minute period the temperature goes from 32 °C (at 18 min) to 75 °C (at 22 min) — use the START and END temperatures, not just the final.',
    true
  );

  -- ─── Q4(a)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '4(a)', 1, 'free',
    'fill_in',
    E'A ripple tank produces circular wavefronts. Two corks **A** and **B** float on the water. The wavelength is **8.0 cm**.\n\nFig. 4.2 shows how the displacement of cork A varies with time — a sine wave with amplitude **2 mm** and period **0.50 s**.\n\n**(a)** State the **amplitude** of the vibrations of cork A as the wave passes. (Units: mm)',
    '/past-papers/physics-nssco-2024-p2/displacement-graph.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '2',
        '2.0',
        '2 mm',
        '2.0 mm'
    )
, 'must_contain', jsonb_build_array('2')
    ),
    false,
    E'2.0 (mm); [1 mark]\n\n**Examiner commentary:** Most got 2 mm. Some confused with time (gave 0.25 etc).',
    E'**Amplitude** = the MAXIMUM displacement from the rest position (the centre of the wave).\n\nOn the graph the displacement oscillates between **+2 mm and −2 mm**. The amplitude is the maximum height = **2.0 mm** ✓\n\nNot to be confused with:\n• Wavelength — distance between consecutive crests (here 8 cm)\n• Period — time for one full cycle (here 0.50 s, from the graph)\n\nAmplitude is half the peak-to-peak distance, measured from the centre line.',
    true
  );

  -- ─── Q4(b)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '4(b)', 2, 'paid',
    'free_text',
    E'A ripple tank produces circular wavefronts. Two corks **A** and **B** float on the water. The wavelength is **8.0 cm**.\n\nFig. 4.2 shows how the displacement of cork A varies with time — a sine wave with amplitude **2 mm** and period **0.50 s**.\n\nThe horizontal distance between A and B is HALF the wavelength.\n\n**(b)** Describe how to sketch a graph of cork B''s displacement vs time on the SAME axes as cork A.',
    '/past-papers/physics-nssco-2024-p2/displacement-graph.png',
    E'Both required (1 mark each):\n1. Same period (0.50 s) and same amplitude (2 mm) as wave A — at LEAST one full cycle drawn;\n2. Drawn in OPPOSITE PHASE (180°) to wave A — i.e. when A is at +2 mm, B is at −2 mm;\n\n**Examiner commentary:** Very few answered correctly. Many drew a wave but didn''t use the half-wavelength information.',
    E'Award 1 mark for same period and amplitude as A. Award 1 mark for being EXACTLY OUT OF PHASE (180° / π radians shift). PENALISE: different period; smaller amplitude; phase difference of less than half a wavelength.',
    E'**Half a wavelength apart = 180° out of phase = mirror image.**\n\nThe wave travels outward as a circular wavefront. Two points half a wavelength apart oscillate in OPPOSITE directions: when A is at the top of a crest, B is at the bottom of a trough.\n\nSketch B as:\n• Same period (0.50 s) as A\n• Same amplitude (2 mm)\n• Shifted 180° (inverted) — so when A''s peak is at +2 mm, B''s is at −2 mm at the same time\n• It looks like A''s curve flipped upside-down\n\nThis is **antiphase** (opposite phase). At λ apart they''d be in phase; at λ/2, they''re antiphase.',
    true
  );

  -- ─── Q4(c)(i)  [2 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '4(c)(i)', 2, 'paid',
    'calculation',
    E'A ripple tank produces circular wavefronts. Two corks **A** and **B** float on the water. The wavelength is **8.0 cm**.\n\nFig. 4.2 shows how the displacement of cork A varies with time — a sine wave with amplitude **2 mm** and period **0.50 s**.\n\n**(c)(i)** Use the graph to determine the **frequency** of the wave. (Period = 0.50 s from graph.)',
    '/past-papers/physics-nssco-2024-p2/displacement-graph.png',
    jsonb_build_object(
      'value', 2.0::numeric,
      'tolerance', 0.05::numeric,
      'unit', 'Hz',
      'accept_units', jsonb_build_array('Hz', 'hz', 'hertz', '/s', 's^-1', 's-1')
    ),
    E'Working: f = 1/T;\n= 1 / 0.50\n= **2 Hz**;\n[2 marks: 1 formula, 1 answer + unit]\n\n**Examiner commentary:** Most could write the formula but failed to read the period correctly. Some used wrong symbol (p instead of T).',
    E'**Frequency = 1 / period.** f = 1/T.\n\nFrom the graph: one complete cycle takes from t = 0 to t = 0.50 s → **T = 0.50 s** (one full crest-to-crest distance on the time axis).\n\nf = 1 ÷ 0.50 = **2.0 Hz** (cycles per second) ✓\n\nUnit: Hz (hertz) = 1/s (per second). Always check the unit.',
    true
  );

  -- ─── Q4(c)(ii)  [2 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '4(c)(ii)', 2, 'paid',
    'calculation',
    E'A ripple tank produces circular wavefronts. Two corks **A** and **B** float on the water. The wavelength is **8.0 cm**.\n\nFig. 4.2 shows how the displacement of cork A varies with time — a sine wave with amplitude **2 mm** and period **0.50 s**.\n\nDistance from centre of tank to edge = **40 cm**. Wave frequency = 2 Hz (from part i).\n\n**(c)(ii)** Calculate the **time** taken by a wavefront to travel from the centre of the tank to the edge.',
    '/past-papers/physics-nssco-2024-p2/ripple-tank.png',
    jsonb_build_object(
      'value', 2.5::numeric,
      'tolerance', 0.05::numeric,
      'unit', 's',
      'accept_units', jsonb_build_array('s', 'sec', 'second', 'seconds')
    ),
    E'Working:\nFirst find wave speed: v = f × λ = 2 × 8 = 16 cm/s\nThen time: t = distance ÷ speed = 40 ÷ 16 = **2.5 s**\n[2 marks: 1 method, 1 answer + unit; ecf from part (i)]\n\n**Examiner commentary:** Many used v = fλ instead of t = d/v — i.e. they calculated speed but then didn''t get time.',
    E'**Two-step problem:**\n\n1. Find the **wave speed**: v = f × λ\n   • v = 2.0 × 8.0 = **16 cm/s**\n\n2. Find the **time** to cover 40 cm: t = distance ÷ speed\n   • t = 40 ÷ 16 = **2.5 s** ✓\n\nThe wave equation gives speed; then use distance/speed to get time. Watch units: both in cm here, so they cancel.',
    true
  );

  -- ─── Q4(d)(i)  [1 mark, free, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '4(d)(i)', 1, 'free',
    'calculation',
    E'A ray of light refracts from air into glass. The ray inside the air makes a 55° angle with the GLASS SURFACE (boundary).\n\n**(d)(i)** Determine the **angle of incidence** of the ray on the glass.',
    '/past-papers/physics-nssco-2024-p2/refraction-glass.png',
    jsonb_build_object(
      'value', 35::numeric,
      'tolerance', 0.5::numeric,
      'unit', '°',
      'accept_units', jsonb_build_array('°', 'deg', 'degrees', 'degree', '')
    ),
    E'Working: angle of incidence is measured FROM THE NORMAL, not from the surface;\n= 90 − 55\n= **35°**;\n[1 mark]\n\n**Examiner commentary:** Most failed — they simply COPIED 55° as the incident angle, which is wrong. Some tried to measure with a protractor.',
    E'**Angles in optics are ALWAYS measured FROM THE NORMAL** (the perpendicular dashed line at the surface), not from the surface itself.\n\nIf the ray makes 55° WITH THE SURFACE, then the angle with the NORMAL (which is at 90° to the surface) is:\n\n**90° − 55° = 35°** ✓\n\nThis is the **angle of incidence**. The 55° given is a distractor — always check whether the angle in the diagram is to the surface or to the normal.',
    true
  );

  -- ─── Q4(d)(ii)  [2 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '4(d)(ii)', 2, 'paid',
    'calculation',
    E'Glass has refractive index **n = 1.5**. The angle of incidence (in air) is 35° (from part i).\n\n**(d)(ii)** Calculate the **angle of refraction** in the glass.',
    '/past-papers/physics-nssco-2024-p2/refraction-glass.png',
    jsonb_build_object(
      'value', 22.5::numeric,
      'tolerance', 1.0::numeric,
      'unit', '°',
      'accept_units', jsonb_build_array('°', 'deg', 'degrees', '')
    ),
    E'Working: n = sin(i) / sin(r) → sin(r) = sin(i) / n;\nsin(r) = sin(35°) / 1.5 = 0.5736 / 1.5 = 0.3824\nr = sin⁻¹(0.3824) = **22.5°** (accept 2 s.f.);\n[2 marks: 1 rearrangement, 1 answer + unit]\n\n**Examiner commentary:** Many failed to rearrange Snell''s law. Some did the substitution but couldn''t compute inverse sine. ECF from (d)(i).',
    E'**Snell''s law: n = sin(i) ÷ sin(r)** (where i = incidence, r = refraction, in the second medium).\n\nRearrange for r:\nsin(r) = sin(i) / n\nsin(r) = sin(35°) / 1.5\nsin(r) = 0.5736 / 1.5 = **0.3824**\n\nTake inverse sin:\nr = sin⁻¹(0.3824) = **22.5°** (≈ 22.5° to 1 d.p.) ✓\n\nKey skill: rearranging the formula AND using the inverse-sin (sin⁻¹) button on a calculator. When light enters a denser medium (higher n), r < i — the ray bends TOWARDS the normal.',
    true
  );

  -- ─── Q4(e)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '4(e)(i)', 1, 'free',
    'fill_in',
    E'Waves moving from deep into shallow water.\n\n**(e)(i)** Define the term **wave front**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'the line containing points in the same phase',
        'line joining adjacent points in same phase',
        'a line joining points in the same phase',
        'a line containing adjacent points in the same phase',
        'joining crests in same phase',
        'line joining points in phase'
    )
, 'must_contain', jsonb_build_array('phase')
    ),
    false,
    E'A line containing (adjacent) points that are in the SAME PHASE; [1 mark — must mention ''phase'']\n\n**Examiner commentary:** Most couldn''t define correctly.',
    E'**Wave front** = an imaginary line joining all points on a wave that are **in the same PHASE** (same point in their oscillation cycle — e.g. all at the peak of a crest, or all at the trough).\n\nFor a water wave, the crests (the white lines you can see) ARE wave fronts.\n\nFor a circular wave (like the ripple tank), the wave fronts are concentric circles expanding outward. For a plane wave (in this question), they are straight parallel lines.',
    true
  );

  -- ─── Q4(e)(ii)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '4(e)(ii)', 3, 'paid',
    'free_text',
    E'Waves move from deep water to shallow water. The boundary is at right angles to the direction of travel.\n\n**(e)(ii)** Describe what happens to wave fronts in the **shallow water** (boundary perpendicular to the direction of travel). Specify: number of wave fronts drawn, their direction, their spacing/wavelength.',
    '/past-papers/physics-nssco-2024-p2/wave-fronts.png',
    E'All 3 marks:\n1. At least 3 wave fronts shown AFTER the boundary;\n2. Drawn VERTICAL (parallel to the boundary, since the boundary is perpendicular to the wave direction — no refraction / no bending);\n3. CLOSER together — SMALLER wavelength (because wave SLOWS in shallow water; frequency unchanged → wavelength decreases);\n\n**Examiner commentary:** Fairly answered. Many couldn''t differentiate between reflection and refraction. Many drew the wave bending when in fact it shouldn''t — the boundary was perpendicular to the direction of travel.',
    E'Award 3 marks: (a) ≥3 wave fronts after boundary; (b) vertical/parallel to boundary (no bending — the wave hits the boundary head-on); (c) wavelength SMALLER (closer spacing) than in deep water. PENALISE drawings showing the waves bending — refraction only happens at an oblique angle.',
    E'**Waves at a PERPENDICULAR boundary — they DON''T bend.**\n\nKey facts when waves enter shallow water:\n• Speed **DECREASES** (waves slow down in shallow water)\n• Frequency stays the SAME (set by the source)\n• Wavelength DECREASES (because v = fλ; v down + f constant → λ down)\n• Direction stays the same IF the boundary is perpendicular (head-on entry, no refraction)\n\nDraw at least 3 vertical lines (parallel to the boundary) in the shallow side, with SMALLER gaps between them than in the deep side.',
    true
  );

  -- ─── Q5(a)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '5(a)', 1, 'free',
    'fill_in',
    E'Parts of the electromagnetic spectrum, in order of increasing wavelength:\n\n**radio waves — Q — infrared waves — visible light — ultraviolet waves — X-rays — γ-rays**\n\n**(a)** State the name of part **Q** (between radio and infrared).',
    '/past-papers/physics-nssco-2024-p2/em-spectrum.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'microwaves',
        'Microwaves',
        'microwave'
    )
, 'must_contain', jsonb_build_array('microwave')
    ),
    false,
    E'Microwaves; [1 mark — spelling matters]\n\n**Examiner commentary:** Many got this. Some misspelt as ''macrowaves'' or ''mircowaves'' — those don''t score.',
    E'**The EM spectrum, by INCREASING frequency (decreasing wavelength):**\n\nRadio → **MICROWAVES** → Infrared → Visible → UV → X-rays → Gamma\n\nSitting between radio and infrared = **microwaves**. Used for cooking, satellite communications, radar, Wi-Fi.\n\nSpell carefully: m-i-c-r-o-w-a-v-e-s.',
    true
  );

  -- ─── Q5(b)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '5(b)', 1, 'free',
    'fill_in',
    E'Speed of visible light in vacuum = 3.0 × 10⁸ m/s.\n\n**(b)** State the value of the **speed of infrared waves in a vacuum**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '3.0 x 10^8',
        '3.0 x 10^8 m/s',
        '3 x 10^8',
        '3.0e8',
        '300000000',
        '3 × 10^8'
    )
    ),
    false,
    E'3.0 × 10⁸ m/s; [1 mark]\n\n**Examiner commentary:** Most knew this. Some wrote 300000000 then dropped a zero by mistake.',
    E'**All electromagnetic waves travel at the SAME speed in vacuum: c = 3.0 × 10⁸ m/s.**\n\nRadio, microwaves, infrared, visible, UV, X-rays, gamma — they ALL travel at the speed of light in vacuum. Only in matter (glass, water, air) do they slow down differently.\n\nSo infrared in vacuum = same as visible light = **3.0 × 10⁸ m/s**.',
    true
  );

  -- ─── Q5(c)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '5(c)', 1, 'free',
    'fill_in',
    E'Parts of the electromagnetic spectrum, in order of increasing wavelength:\n\n**radio waves — Q — infrared waves — visible light — ultraviolet waves — X-rays — γ-rays**\n\n**(c)** Give an example of an EM wave with **shorter wavelength than visible light**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'ultraviolet',
        'UV',
        'X-rays',
        'x-rays',
        'X rays',
        'gamma rays',
        'gamma',
        'γ-rays'
    )
    ),
    false,
    E'Ultraviolet (UV) / X-rays / gamma rays; [1 mark — any one, correct spelling]\n\n**Examiner commentary:** Most got it. A few misspelt ''ultraviolet''.',
    E'**Shorter wavelength than visible light = HIGHER frequency:**\n\n• **Ultraviolet (UV)** — just shorter than violet light\n• **X-rays** — used in hospitals to see bones\n• **Gamma rays** — shortest wavelength of all\n\nAny one of these is correct. Visible light is in the middle of the spectrum; UV, X-rays, gamma rays are all to its ''short-wavelength'' side (and infrared, microwaves, radio are to the ''long-wavelength'' side).',
    true
  );

  -- ─── Q5(d)(i)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '5(d)(i)', 2, 'paid',
    'free_text',
    E'X-rays and gamma rays are used in hospitals.\n\n**(d)(i)** Describe **one medical use** for each. Format: ''X-rays: ___; γ-rays: ___''.',
    null,
    E'Both required (1 mark each):\n• **X-rays**: detecting broken bones / damaged teeth / treating cancer (any one);\n• **γ-rays**: treating cancer / sterilising hospital equipment or food (any one);\n\n**Examiner commentary:** Most got this moderately. Few got the X-rays mark — saying ''view skeletal structure'' isn''t enough; must specify detecting fractures.',
    E'Award 1 mark for each. For X-rays, ''view skeletal structure'' alone is NOT enough — must say ''detect fractures'' or similar diagnostic use. PENALISE generic ''see inside body''.',
    E'**Hospital uses of high-energy EM radiation:**\n\n• **X-rays** (lower energy than gamma):\n  - **Diagnostic** — detect **broken bones / fractures**, dental cavities\n  - Higher doses: treat cancer (less common)\n\n• **Gamma rays** (highest energy):\n  - **Cancer treatment** (radiotherapy — kills tumour cells)\n  - **Sterilising** medical equipment, food, blood products (kills bacteria)\n\nPair the use precisely. ''View skeletal structure'' is too vague — be specific about WHAT defect you''re looking for.',
    true
  );

  -- ─── Q5(d)(ii)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '5(d)(ii)', 2, 'paid',
    'free_text',
    E'Gamma rays can be hazardous.\n\n**(d)(ii)** State **two reasons** why γ-rays are dangerous to living organisms.',
    null,
    E'Any 2 of (1 mark each):\n• Ionising radiation / high frequency / high energy;\n• Damage or kill cells;\n• Cause radiation burns;\n• Cause cancer;\n• Cause (genetic) mutations;\n\n**Examiner commentary:** Many got this with at least one effect.',
    E'Award 1 mark each (max 2). Each point must be a distinct effect — ''they''re dangerous'' is too vague.',
    E'**Why gamma rays are dangerous to living tissue:**\n\n1. **Ionising radiation** — knocks electrons off atoms, breaking molecules in cells\n2. **Kill or damage cells** — too much radiation kills healthy tissue\n3. **Cause cancer** — DNA damage can lead to uncontrolled cell growth\n4. **Cause genetic mutations** — heritable damage to DNA\n5. **Burns** — high doses cause radiation burns on skin\n\nName any TWO. Gamma rays are the most penetrating (need thick lead or concrete to shield) and the most ionising of the EM spectrum.',
    true
  );

  -- ─── Q6(a)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '6(a)', 2, 'paid',
    'free_text',
    E'A circuit has a **12 V battery** in series with two resistors: an **18 Ω** resistor and a **30 Ω** resistor.\n\n**(a)** State what is meant by **electromotive force (e.m.f.)**.',
    '/past-papers/physics-nssco-2024-p2/series-circuit.png',
    E'The amount of energy dissipated/supplied by a source in driving unit charge round a complete circuit / energy transferred by the source per unit charge / the total energy per charge; [2 marks]\n\n**Examiner commentary:** Poorly answered. Most couldn''t define e.m.f.',
    E'Award 2 marks for the full definition with ''energy per charge'' and reference to the source driving charge. Award 1 mark for partial answer. ACCEPT alternative: ''p.d. across the cell when no current flows'' / ''chemical energy converted to electrical per charge''.',
    E'**e.m.f. = energy per unit charge supplied by a SOURCE (battery, generator) to drive charge round a complete circuit.**\n\nUnit: volt (V) = joule per coulomb (J/C).\n\nThink of e.m.f. as the ''push'' a battery provides:\n• High e.m.f. (e.g. 12 V car battery) → big push\n• Low e.m.f. (e.g. 1.5 V AA cell) → smaller push\n\nDifferent from p.d. across a resistor:\n• e.m.f. is what the source provides\n• p.d. is the energy used per charge by a component\n\nAcceptable simpler form: ''p.d. across the cell when no current flows'' (open-circuit voltage).',
    true
  );

  -- ─── Q6(b)  [2 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '6(b)', 2, 'paid',
    'calculation',
    E'A circuit has a **12 V battery** in series with two resistors: an **18 Ω** resistor and a **30 Ω** resistor.\n\nThe two resistors are in SERIES.\n\n**(b)** Calculate the **current** in the battery.',
    '/past-papers/physics-nssco-2024-p2/series-circuit.png',
    jsonb_build_object(
      'value', 0.25::numeric,
      'tolerance', 0.005::numeric,
      'unit', 'A',
      'accept_units', jsonb_build_array('A', 'amp', 'amps', 'ampere', 'amperes')
    ),
    E'Working: R_total = R1 + R2 = 18 + 30 = 48 Ω\nI = V/R = 12 / 48 = **0.25 A**;\n[2 marks: 1 for R_total = 48 or correct setup, 1 for answer + unit]\n\n**Examiner commentary:** Well answered. Most recalled the formula correctly.',
    E'**Series resistors: total resistance = sum of individual resistances.**\n\nR_total = R1 + R2 = 18 + 30 = **48 Ω**\n\n**Ohm''s law: V = IR → I = V/R**\n\nI = 12 V ÷ 48 Ω = **0.25 A** ✓\n\nIn a series circuit, the current is the SAME everywhere (only one path).',
    true
  );

  -- ─── Q6(c)  [1 mark, free, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '6(c)', 1, 'free',
    'calculation',
    E'A circuit has a **12 V battery** in series with two resistors: an **18 Ω** resistor and a **30 Ω** resistor.\n\nCurrent = 0.25 A (from part b).\n\n**(c)** Calculate the **potential difference (p.d.) across the 18 Ω resistor**.',
    '/past-papers/physics-nssco-2024-p2/series-circuit.png',
    jsonb_build_object(
      'value', 4.5::numeric,
      'tolerance', 0.1::numeric,
      'unit', 'V',
      'accept_units', jsonb_build_array('V', 'volt', 'volts')
    ),
    E'Working: V = I × R = 0.25 × 18 = **4.5 V**; [1 mark]\n\n**Examiner commentary:** Poorly answered. Many couldn''t rearrange Ohm''s law.',
    E'**Ohm''s law: V = IR.**\n\nFor the 18 Ω resistor:\nV = 0.25 × 18 = **4.5 V** ✓\n\nIn a series circuit, the voltage is SHARED between resistors — bigger resistor gets bigger share. Here 18 Ω gets 4.5 V and 30 Ω gets 7.5 V (sum = 12 V = battery e.m.f. ✓).',
    true
  );

  -- ─── Q6(d)  [2 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '6(d)', 2, 'paid',
    'calculation',
    E'A circuit has a **12 V battery** in series with two resistors: an **18 Ω** resistor and a **30 Ω** resistor.\n\nCurrent = 0.25 A; p.d. across 18 Ω = 4.5 V.\n\n**(d)** Calculate the **power produced** in the 18 Ω resistor.',
    '/past-papers/physics-nssco-2024-p2/series-circuit.png',
    jsonb_build_object(
      'value', 1.125::numeric,
      'tolerance', 0.05::numeric,
      'unit', 'W',
      'accept_units', jsonb_build_array('W', 'watt', 'watts')
    ),
    E'Working: P = V × I = 4.5 × 0.25 = **1.125 W** (or P = I²R = 0.0625 × 18 = 1.125 W; or P = V²/R = 20.25/18 = 1.125 W);\n[2 marks: 1 formula, 1 answer + unit (accept 2 s.f.)]\n\n**Examiner commentary:** Poorly answered. Many couldn''t recall the power formula.',
    E'**Three forms of the power formula** — all give the same answer for the 18 Ω resistor:\n\n• **P = V × I** = 4.5 × 0.25 = **1.125 W** ✓\n• P = I² × R = 0.25² × 18 = 0.0625 × 18 = 1.125 W ✓\n• P = V² / R = 4.5² / 18 = 20.25/18 = 1.125 W ✓\n\nUnit: W (watt) = joule per second.\n\nUse the form where you already have the values — VI is easiest here.',
    true
  );

  -- ─── Q6(e)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '6(e)', 2, 'paid',
    'free_text',
    E'A circuit has a **12 V battery** in series with two resistors: an **18 Ω** resistor and a **30 Ω** resistor.\n\nThe resistors obey Ohm''s law.\n\n**(e)** State **Ohm''s law** and discuss the **temperature limitation** on this law.',
    null,
    E'Both required (1 mark each):\n1. Current is (directly) PROPORTIONAL TO voltage (potential difference);\n2. ...at CONSTANT TEMPERATURE;\n\n**Examiner commentary:** Fairly answered. Most stated the law but missed the temperature condition.',
    E'Award 1 mark for the law (I ∝ V), 1 mark for stating the temperature must be constant. PENALISE: just stating V=IR without mentioning proportionality; missing the constant temperature condition.',
    E'**Ohm''s law (full statement):**\n\nThe **current** through a conductor is **directly PROPORTIONAL to the potential difference** across it, **provided the TEMPERATURE remains CONSTANT**.\n\nMathematically: V = IR (where R is constant).\n\n**Temperature limitation:** as a conductor heats up, its atoms vibrate more, scattering electrons and increasing resistance. So if you don''t keep T constant, R changes and the V/I ratio drifts — the law breaks down.\n\nThat''s why ohmic resistors should stay cool for the law to hold.',
    true
  );

  -- ─── Q6(f)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '6(f)(i)', 1, 'free',
    'fill_in',
    E'Same material and length as the original wire, but DOUBLE the diameter.\n\n**(f)(i)** Describe how the **resistance** would change.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'decrease',
        'decreases',
        'lower',
        'smaller',
        'less',
        'resistance decreases',
        'decreases by factor of 4',
        'becomes one quarter',
        'reduced'
    )
    ),
    false,
    E'Decrease (resistance ∝ 1/area ∝ 1/diameter²; doubling d → ÷4 R); [1 mark]\n\n**Examiner commentary:** Fairly answered.',
    E'**Resistance formula:** R = ρL/A (resistivity × length ÷ cross-sectional area).\n\nA depends on diameter: A = π(d/2)² = πd²/4.\n\nWhen you **DOUBLE the diameter**:\n• Area QUADRUPLES (×4)\n• R DECREASES by factor of 4 (R becomes ¼ of original)\n\nKey: **thicker wire → lower resistance** (more ''highway lanes'' for electrons).',
    true
  );

  -- ─── Q6(f)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '6(f)(ii)', 1, 'free',
    'fill_in',
    E'Same length and diameter as the original wire, but HOTTER.\n\n**(f)(ii)** Describe how the **resistance** would change.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'increase',
        'increases',
        'higher',
        'greater',
        'more',
        'resistance increases',
        'rises'
    )
    ),
    false,
    E'Increase (atoms vibrate more, scatter electrons more); [1 mark]\n\n**Examiner commentary:** Fairly answered.',
    E'**Higher temperature → higher resistance** (for metallic conductors).\n\nReason: as a metal heats up, its atoms vibrate MORE around their fixed positions. Electrons trying to flow through collide with these vibrating atoms more often → more scattering → harder for current to flow → **resistance INCREASES**.\n\nThis is exactly why lightbulb filaments have much higher resistance when hot (lit) than when cold (off) — the cold inrush current is a brief spike.',
    true
  );

  -- ─── Q7(a)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '7(a)', 1, 'free',
    'fill_in',
    E'An **AC generator** has a coil rotating between two magnets (N on left, S on right). Components on the diagram:\n• **A** — slip rings (smooth rings, NOT split)\n• **B** — brushes (carbon contacts pressing against A)\n• **C** — the spinning coil axis\n• **D** — the magnetic poles\n\nThe coil rotates anticlockwise and the output is connected through a 25 Ω resistor.\n\n**(a)** Which component (A, B, C or D) **distinguishes this AC generator from a DC generator**?',
    '/past-papers/physics-nssco-2024-p2/ac-generator.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'A',
        'a'
    )
, 'must_contain', jsonb_build_array('A')
    ),
    false,
    E'A (the slip rings — DC generators have split-ring commutators instead); [1 mark]\n\n**Examiner commentary:** Fairly answered. Many confused with DC motor parts and gave B.',
    E'**AC vs DC generator — the difference is the ring contacts:**\n\n• **AC generator** uses **SLIP RINGS** (two SMOOTH continuous rings) — the current naturally reverses each half-rotation, giving AC.\n• DC generator uses a **SPLIT-RING COMMUTATOR** (one ring split into two halves) — the split flips the connection each half-rotation, keeping the current going the same direction → DC.\n\nIn this diagram, A points to the slip rings.\n\nB = brushes (carbon contacts — same in both AC and DC).\nC = coil axis (same in both).\nD = magnet (same in both).',
    true
  );

  -- ─── Q7(b)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '7(b)', 1, 'free',
    'fill_in',
    E'An **AC generator** has a coil rotating between two magnets (N on left, S on right). Components on the diagram:\n• **A** — slip rings (smooth rings, NOT split)\n• **B** — brushes (carbon contacts pressing against A)\n• **C** — the spinning coil axis\n• **D** — the magnetic poles\n\nThe coil rotates anticlockwise and the output is connected through a 25 Ω resistor.\n\n**(b)** Name component **A**.',
    '/past-papers/physics-nssco-2024-p2/ac-generator.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'slip ring',
        'slip rings',
        'slip-ring',
        'Slip rings'
    )
, 'must_contain', jsonb_build_array('slip')
    ),
    false,
    E'Slip ring(s); [1 mark]\n\n**Examiner commentary:** Poorly answered. Many wrote ''split ring'' — wrong (that''s DC).',
    E'**Component A = SLIP RINGS** (NOT split rings!).\n\nSlip rings:\n• Two separate, SMOOTH metal rings on the rotating axis\n• Each connected to one end of the coil\n• Brushes (B) press against them to make sliding contact\n• As the coil rotates, the current naturally alternates direction → AC output ✓\n\n**SLIP** ≠ **SPLIT**. Don''t confuse the words — examiners are strict on this.',
    true
  );

  -- ─── Q7(c)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '7(c)', 1, 'free',
    'fill_in',
    E'An **AC generator** has a coil rotating between two magnets (N on left, S on right). Components on the diagram:\n• **A** — slip rings (smooth rings, NOT split)\n• **B** — brushes (carbon contacts pressing against A)\n• **C** — the spinning coil axis\n• **D** — the magnetic poles\n\nThe coil rotates anticlockwise and the output is connected through a 25 Ω resistor.\n\nUse Fleming''s right-hand rule (generator rule). N is on the left, S on the right. The coil section XY is at the top, with X on the right and Y on the left. The coil rotates anticlockwise.\n\n**(c)** In which direction will the induced current flow in section **XY** of the coil?',
    '/past-papers/physics-nssco-2024-p2/ac-generator.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'X to Y',
        'x to y',
        'from X to Y',
        'X→Y',
        'to the left',
        'left'
    )
    ),
    false,
    E'X to Y (i.e. to the left); [1 mark]\n\n**Examiner commentary:** Most candidates struggled. Many wrote ''anticlockwise'' instead of X to Y.',
    E'**Use Fleming''s RIGHT-hand rule for generators (induced current):**\n\n• Thumb = direction of MOTION of the wire (the velocity)\n• First finger = direction of MAGNETIC field (N to S)\n• Second finger = direction of induced CURRENT\n\nFor section XY at the top of the coil (which is moving anticlockwise — let''s say the top section is now moving towards us in the diagram):\n• Field direction: from N (left) → S (right), so field points to the RIGHT\n• Motion: top of coil moves OUT of the page (anticlockwise)\n• Apply right-hand rule → current flows from X to Y (to the LEFT) ✓\n\nAnswer with a direction along the wire, not ''clockwise/anticlockwise''.',
    true
  );

  -- ─── Q7(d)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '7(d)', 3, 'paid',
    'free_text',
    E'An **AC generator** has a coil rotating between two magnets (N on left, S on right). Components on the diagram:\n• **A** — slip rings (smooth rings, NOT split)\n• **B** — brushes (carbon contacts pressing against A)\n• **C** — the spinning coil axis\n• **D** — the magnetic poles\n\nThe coil rotates anticlockwise and the output is connected through a 25 Ω resistor.\n\nThe original output voltage graph (Fig 7.2) is a sine wave with PEAK 100 V and PERIOD 0.10 s. The coil speed is now DOUBLED.\n\n**(d)** Describe how the new graph (0 to 0.1 s) compares with the original. State (1) how many complete cycles in 0.1 s, (2) the new period, (3) the new amplitude.',
    '/past-papers/physics-nssco-2024-p2/ac-output-graph.png',
    E'All 3 marks:\n1. TWO full waves (cycles) in the same 0.1 s span;\n2. Period of each wave = 0.05 s (half the original);\n3. Amplitude (peak) = 200 V (DOUBLE the original);\n\n**Examiner commentary:** Poorly answered. Most didn''t recognise both that period halves AND amplitude doubles when speed of rotation doubles.',
    E'Award 1 mark each: (a) two complete waves visible in 0.1 s; (b) period halved to 0.05 s; (c) amplitude doubled to 200 V (because faster rotation → faster rate of change of flux → bigger induced e.m.f.).',
    E'**Doubling the rotation speed of the coil has TWO effects:**\n\n1. **Period HALVES** (frequency doubles). Same time interval (0.1 s) now contains **TWO full waves** instead of one. New period = 0.05 s.\n\n2. **Amplitude DOUBLES** (faster motion = faster rate of change of magnetic flux through the coil → larger induced e.m.f.). New peak = **200 V**.\n\nSo the new graph: TWO sine waves over the 0.1 s span, each with peak ±200 V and period 0.05 s.\n\nKey idea: rotation speed affects BOTH frequency AND amplitude in a generator (unlike a battery).',
    true
  );

  -- ─── Q8(a)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '8(a)', 2, 'paid',
    'free_text',
    E'**Plutonium-238 (²³⁸₉₄Pu)** is a radioactive isotope that decays by emitting alpha particles.\n\n**(a)** What is meant by **radioactive decay**?',
    null,
    E'(Spontaneous) break up / disintegration / decomposition / splitting of UNSTABLE NUCLEI by emitting RADIATION (or nuclear particles); [2 marks: 1 for ''break up of unstable nuclei'', 1 for ''emitting radiation/particles'']\n\n**Examiner commentary:** Most couldn''t score full marks. Needed: ''break up/disintegrate of unstable nuclei'' AND ''release radiation''.',
    E'Award 1 mark for ''break up / disintegration of unstable nuclei''. Award 1 mark for ''emitting radiation'' (alpha, beta, gamma) or ''nuclear particles''. PENALISE ''breaks up atoms'' (incorrect — only the nucleus changes).',
    E'**Radioactive decay** = the spontaneous breakdown of an unstable atomic nucleus, releasing radiation (or nuclear particles).\n\nKey words for the mark scheme:\n• **Unstable nuclei** (not just ''atoms'' — only the NUCLEUS decays)\n• **Break up / disintegration / decomposition** of those nuclei\n• **Emitting** radiation (alpha α, beta β, gamma γ) or nuclear particles\n\nThe process is RANDOM and SPONTANEOUS — happens by itself, can''t be predicted for any single nucleus, but follows a predictable HALF-LIFE for large samples.',
    true
  );

  -- ─── Q8(b)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '2', '8(b)', 2, 'paid',
    'free_text',
    E'**Plutonium-238 (²³⁸₉₄Pu)** is a radioactive isotope that decays by emitting alpha particles.\n\nThe nuclide notation for plutonium-238 is ²³⁸₉₄Pu.\n\n**(b)** Write the equation for the alpha decay of plutonium-238 (²³⁸₉₄Pu → daughter + alpha).',
    null,
    E'²³⁸₉₄Pu → ²³⁴₉₂U + ⁴₂He (or ⁴₂α); [2 marks: 1 for correct daughter nucleus (Uranium-234), 1 for correct alpha particle ⁴₂He]\n\n**Examiner commentary:** Poorly answered. Many couldn''t identify the daughter as Uranium and write it in nuclide notation.',
    E'Award 1 mark for the correct daughter (²³⁴₉₂U, uranium-234). Award 1 mark for the alpha particle ⁴₂He (or α). Mass numbers must balance: 238 = 234 + 4. Atomic numbers must balance: 94 = 92 + 2.',
    E'**Alpha decay** = nucleus emits an alpha particle (²α = ⁴₂He, a helium nucleus).\n\nResult on the parent nucleus:\n• Mass number A: DECREASES by 4 (238 → 234)\n• Atomic number Z: DECREASES by 2 (94 → 92)\n• Element changes (Z down 2 = move two places LEFT in the periodic table)\n• Z = 92 is **Uranium (U)**\n\n**Equation:**\n\n**²³⁸₉₄Pu → ²³⁴₉₂U + ⁴₂He**\n\nCheck: mass 238 = 234 + 4 ✓; charge 94 = 92 + 2 ✓.',
    true
  );

  -- ─── Q8(c)(i)-alpha  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '8(c)(i)-alpha', 1, 'free',
    'fill_in',
    E'Ionising effects of alpha, beta and gamma radiation.\n\n**(c)(i)** Compare the ionising effect of **beta-particles** with **alpha-particles**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'beta is weaker',
        'beta weaker',
        'beta particles weaker',
        'beta is less ionising',
        'beta less ionising than alpha',
        'weaker',
        'less than alpha'
    )
    ),
    false,
    E'Beta particles are WEAKER (less ionising) than alpha particles; [1 mark]\n\n**Examiner commentary:** Poorly answered.',
    E'**Ionising power: alpha > beta > gamma.**\n\nCompared to alpha, beta particles are **WEAKER (less ionising)**.\n\nWhy: alpha has charge +2 and high mass (helium nucleus) — strongly attracts and rips off electrons. Beta has only charge −1 and much smaller mass (an electron) — weaker pull → fewer ionisations per cm of path.\n\nAlso related: alpha is stopped by paper; beta needs aluminium foil — beta penetrates further BECAUSE it''s less ionising (loses less energy per collision).',
    true
  );

  -- ─── Q8(c)(i)-gamma  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '8(c)(i)-gamma', 1, 'free',
    'fill_in',
    E'Ionising effects of alpha, beta and gamma radiation.\n\n**(c)(i)** Compare the ionising effect of **beta-particles** with **gamma-rays**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'beta is stronger',
        'beta stronger',
        'beta particles stronger',
        'beta is more ionising',
        'beta more ionising than gamma',
        'stronger',
        'more than gamma'
    )
    ),
    false,
    E'Beta particles are STRONGER (more ionising) than gamma rays; [1 mark]\n\n**Examiner commentary:** Poorly answered.',
    E'**Ionising power: alpha > beta > GAMMA.**\n\nCompared to gamma, beta particles are **STRONGER (more ionising)**.\n\nWhy: beta is a CHARGED particle (electron, −1) — can interact with electrons in atoms via electric force, knocking them off. Gamma is an UNCHARGED EM wave — passes through matter mostly without interacting (penetrates far, but ionises little).\n\nThat''s why gamma is the most penetrating (needs lead/concrete to stop) but the least ionising per cm of path.',
    true
  );

  -- ─── Q8(c)(ii)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '8(c)(ii)', 2, 'free',
    'fill_in',
    E'Handling radioactive materials safely.\n\n**(c)(ii)** State **two safety precautions** when handling radioactive materials.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'wear gloves and use tongs',
        'tongs and gloves',
        'wear lead apron and use tongs',
        'wear protective clothing, do not touch',
        'wear gloves, do not eat',
        'use tongs, wear lab coat',
        'gloves and tongs',
        'wear goggles and gloves'
    )
    ),
    false,
    E'Any 2 of (1 mark each): wear lead-lined apron / protective clothes / goggles; do not eat or drink; do not point source at people; use tongs/tweezers to handle; do not touch with bare hands / wear gloves; cover wounds;\n\n**Examiner commentary:** Well answered. Most got the standard precautions.',
    E'**Two precautions when handling radioactive sources:**\n\n• **Wear protective clothing** (lab coat, lead apron, goggles, gloves)\n• **Use tongs or tweezers** — never touch source with bare hands (keeps source away from skin)\n• **Do not point** source at people\n• **Do not eat or drink** in the lab (avoid ingestion)\n• **Cover any open wounds** (avoid contamination through cuts)\n• Keep exposure time SHORT and distance LARGE\n\nGoal: minimise exposure (time, distance, shielding — the three pillars of radiation safety).',
    true
  );

  -- ─── Q8(d)  [3 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '2', '8(d)', 3, 'paid',
    'calculation',
    E'Another radioactive isotope has a **half-life of 6.0 years**. The sample starts at **12 mg**.\n\n**(d)** Calculate the mass of the isotope remaining after **18 years**.',
    null,
    jsonb_build_object(
      'value', 1.5::numeric,
      'tolerance', 0.05::numeric,
      'unit', 'mg',
      'accept_units', jsonb_build_array('mg', 'milligram', 'milligrams')
    ),
    E'Working:\nNumber of half-lives = 18 ÷ 6.0 = 3\nMass remaining = 12 × (½)³ = 12 × 1/8 = **1.5 mg**;\n[3 marks: 1 for n=3, 1 for halving 3 times, 1 for final answer + unit]\n\n**Examiner commentary:** Poorly answered. Few used the formula correctly.',
    E'**Half-life problem — three steps:**\n\n1. **Number of half-lives** = total time ÷ half-life = 18 ÷ 6.0 = **3**\n\n2. **Each half-life halves the mass:**\n   • Start: 12 mg\n   • After 1 half-life (6 years): 12 ÷ 2 = 6 mg\n   • After 2 half-lives (12 years): 6 ÷ 2 = 3 mg\n   • After 3 half-lives (18 years): 3 ÷ 2 = **1.5 mg** ✓\n\n3. **Formula:** m = m₀ × (1/2)ⁿ where n = number of half-lives\n   = 12 × (1/2)³ = 12 × 1/8 = 1.5 mg\n\nFractions to memorise: after 1 half-life = ½; after 2 = ¼; after 3 = ⅛; after 4 = 1/16.',
    true
  );

  raise notice 'Inserted 46 sub-parts for Physics NSSCO 2024 Paper 2';
end $$;
