-- ===========================================================================
-- NSSCO Physics 2024 Paper 3 (6118/3) — Alt to Practical, 4 questions, 20 sub-parts, 40 marks
-- Verbatim NIED wording. Mark scheme + commentary from
-- DNEA Examiners Report 2024 (Physics section, pages 663-666).
-- ===========================================================================

do $$
declare
  phys_id uuid;
begin
  select id into phys_id from public.subjects where slug = 'physics' limit 1;
  if phys_id is null then raise notice 'Physics subject not found'; return; end if;

  -- ─── Q1(a)  [1 mark, free, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '1(a)', 1, 'free',
    'calculation',
    E'A student investigates the effect of air resistance on the swing of a **pendulum**. The setup: a clamp at the top, a thin string of length **d**, and a small bob at the bottom.\n\nFig. 1.1 shows the balance reading: **99.65 g**.\n\n**(a)** Record the mass **m** of the pendulum bob, to the **nearest GRAM**.',
    '/past-papers/physics-nssco-2024-p3/pendulum-bob.png',
    jsonb_build_object(
      'value', 100::numeric,
      'tolerance', 0.5::numeric,
      'unit', 'g',
      'accept_units', jsonb_build_array('g', 'grams', 'gram')
    ),
    E'100 (g) — round 99.65 g UP to the nearest whole gram; [1 mark]\n\n**Examiner commentary:** Very few got this right — most didn''t round to the NEAREST GRAM.',
    E'**Rounding to the nearest gram** means whole-number answer.\n\n• 99.65 g → 99 (round DOWN if < .5) OR 100 (round UP if ≥ .5)\n• .65 ≥ .5 → round UP\n• **Answer: 100 g** ✓\n\nDon''t write 99.65, 99, or 99.7 — the question asks for the nearest WHOLE NUMBER (gram).',
    true
  );

  -- ─── Q1(b)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '1(b)(i)', 1, 'free',
    'fill_in',
    E'A student investigates the effect of air resistance on the swing of a **pendulum**. The setup: a clamp at the top, a thin string of length **d**, and a small bob at the bottom.\n\nThe student times 10 complete oscillations three times. Stopwatch readings (Fig. 1.3): t1 = 00:15.08, t2 = 00:15.23, t3 = 00:15.17 (min:sec.hundredths format).\n\n**(b)(i)** Record the three times t1, t2, t3 in **seconds** (e.g. ''''15.08, 15.23, 15.17'''').',
    '/past-papers/physics-nssco-2024-p3/stopwatches.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '15.08 15.23 15.17',
        '15.08, 15.23, 15.17',
        't1=15.08 t2=15.23 t3=15.17',
        't1 = 15.08 s, t2 = 15.23 s, t3 = 15.17 s'
    )
, 'must_contain', jsonb_build_array('15.08', '15.23', '15.17')
    ),
    false,
    E't₁ = 15.08 s; t₂ = 15.23 s; t₃ = 15.17 s; [1 mark — all three correct]\n\n**Examiner commentary:** Most got this. Some used colons instead of decimal points.',
    E'**Reading a stopwatch:**\n\nThe format `min sec 1/100s` means: minutes, seconds, hundredths of a second.\n\n• 00:15.08 = 0 min + 15 s + 0.08 s = **15.08 s**\n• 00:15.23 = **15.23 s**\n• 00:15.17 = **15.17 s**\n\nUse a DECIMAL POINT (15.08), not a colon (15:08). The two digits AFTER the seconds are hundredths of a second.',
    true
  );

  -- ─── Q1(b)(ii)  [1 mark, free, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '1(b)(ii)', 1, 'free',
    'calculation',
    E't1 = 15.08 s; t2 = 15.23 s; t3 = 15.17 s.\n\n**(b)(ii)** Calculate the **average time t_ave** for 10 oscillations.',
    null,
    jsonb_build_object(
      'value', 15.16::numeric,
      'tolerance', 0.02::numeric,
      'unit', 's',
      'accept_units', jsonb_build_array('s', 'sec', 'second', 'seconds')
    ),
    E'Working: t_ave = (15.08 + 15.23 + 15.17) ÷ 3 = 45.48 ÷ 3 = **15.16 s** (to 2 d.p.); [1 mark]\n\n**Examiner commentary:** Moderately answered. Most ADDED the three times but forgot to divide by 3.',
    E'**Average = sum ÷ number of values:**\n\nt_ave = (t1 + t2 + t3) ÷ 3\n= (15.08 + 15.23 + 15.17) ÷ 3\n= 45.48 ÷ 3\n= **15.16 s** ✓\n\nKeep the same number of decimal places as the input data (2 d.p. here).',
    true
  );

  -- ─── Q1(b)(iii)  [1 mark, free, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '1(b)(iii)', 1, 'free',
    'calculation',
    E'Average time t_ave for 10 oscillations = 15.16 s.\n\n**(b)(iii)** Determine the **period T** of the pendulum (time for ONE complete oscillation).',
    null,
    jsonb_build_object(
      'value', 1.516::numeric,
      'tolerance', 0.005::numeric,
      'unit', 's',
      'accept_units', jsonb_build_array('s', 'sec', 'second', 'seconds')
    ),
    E'Working: T = t_ave ÷ 10 = 15.16 ÷ 10 = **1.516 s**; [1 mark — accept 1.52 s]\n\n**Examiner commentary:** Most got it, with some rounding errors.',
    E'**Period of one oscillation = total time ÷ number of oscillations.**\n\nT = t_ave / number of oscillations\nT = 15.16 ÷ 10\nT = **1.516 s** ✓\n\nWhy time multiple oscillations? Because timing ONE oscillation is hard to do accurately (reaction time error is huge compared to ~1.5 s). Timing 10 spreads the error over 10 cycles → much smaller per-cycle error.',
    true
  );

  -- ─── Q1(b)(iv)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '1(b)(iv)', 1, 'free',
    'fill_in',
    E'The student measured t three times and took an average.\n\n**(b)(iv)** State the **advantage** of repeating the time readings three times.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'to take an average',
        'to identify anomalous data',
        'to improve accuracy',
        'to minimize errors',
        'reduce error',
        'to enable an average to be taken',
        'for accuracy',
        'improve reliability'
    )
    ),
    false,
    E'To identify anomalous data / enable an average to be taken / improve accuracy / minimise errors; [1 mark]\n\n**Examiner commentary:** Most got it.',
    E'**Why repeat measurements?**\n\n• **Spot anomalous (outlier) readings** — if one value is very different from the others, you can spot it and discard it.\n• **Take an average** — averages multiple readings reduce random errors.\n• **Improves accuracy / reliability** of your final value.\n• **Minimises random errors** (which average out over many trials).\n\nAny one of these is a good answer. The deepest reason: random errors are reduced by averaging.',
    true
  );

  -- ─── Q1(c)(i)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '3', '1(c)(i)', 2, 'paid',
    'free_text',
    E'A student investigates the effect of air resistance on the swing of a **pendulum**. The setup: a clamp at the top, a thin string of length **d**, and a small bob at the bottom.\n\nA card was attached to provide air resistance. Period T was measured with six card sizes (5×5, 6×6, 7×7, 8×8, 9×9, 10×10 cm). Results:\n\n| size / cm² | T / s |\n|---|---|\n| 5×5 | 1.526 |\n| 6×6 | 1.532 |\n| 7×7 | 1.512 |\n| 8×8 | 1.540 |\n| 9×9 | 1.553 |\n| 10×10 | 1.542 |\n\nAnother student suggests the size of the card is DIRECTLY PROPORTIONAL to the period T.\n\n**(c)(i)** State whether the results agree with this suggestion. **Justify** your answer using the results.',
    null,
    E'Both required (1 mark each):\n1. **NO** (not directly proportional);\n2. As the size of the card INCREASES, T remains SIMILAR (around 1.5 s — only varies between 1.51 and 1.55 s, no clear trend);\n\n**Examiner commentary:** Many got the ''no'' but failed to justify properly. The justification needs reference to the results.',
    E'Award 1 mark for ''No'' / ''doesn''t agree''. Award 1 mark for justification citing specific data — T stays around 1.5 s as size doubles, no proportional increase. PENALISE ''yes'' answers (data clearly doesn''t show direct proportionality).',
    E'**Test for direct proportionality:** if y ∝ x then doubling x should double y.\n\nCheck the data:\n• Card area goes from 25 cm² (5×5) to 100 cm² (10×10) — that''s a 4× increase\n• T goes from 1.526 to 1.542 — almost the SAME (only ~1% change)\n\nIf T were proportional to size, T should also have increased by ~4× (to about 6 s). It DIDN''T. So **NO, not proportional**.\n\nThe values cluster around 1.5 s with no clear upward trend → air resistance has very little effect on the period in this range.',
    true
  );

  -- ─── Q1(c)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '1(c)(ii)', 1, 'free',
    'fill_in',
    E'Apart from length d and mass m, name another variable to keep constant.\n\n**(c)(ii)** State **one other variable** that should be kept constant.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'angle of swing',
        'amplitude',
        'angle',
        'starting angle',
        'the angle of swing',
        'displacement angle',
        'release angle'
    )
    ),
    false,
    E'The angle of swing / amplitude / displacement; [1 mark]\n\n**Examiner commentary:** Very few got it. Many showed lack of practical experience.',
    E'**Control variables** = things to keep the SAME so they don''t affect the result:\n\n• **Length** of pendulum (given)\n• **Mass** of bob (given)\n• **Angle of swing / amplitude** — release the bob from the SAME angle every time (otherwise different amplitudes change air-resistance effects)\n• Same location (g doesn''t vary)\n• Same temperature, same air movement (no draughts)\n\nThe amplitude (angle) is the key extra variable: a bigger swing creates more air resistance, which is the whole point of the experiment.',
    true
  );

  -- ─── Q2(a)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '2(a)', 1, 'free',
    'fill_in',
    E'A student finds the **spring constant k** of a steel spring. The spring hangs vertically from a clamp. A meter rule is placed alongside. The unstretched length **l₀** (measured) = **39 mm**. The student then hangs loads L = 1.0, 2.0, 3.0, 4.0, 5.0, 6.0 N and records the new length l.\n\nPoint Z is on the spring near the bottom. The unstretched length l₀ is measured between two marker rings — NOT to Z.\n\n**(a)** Explain why l₀ is **not measured to point Z** on the spring.',
    '/past-papers/physics-nssco-2024-p3/spring-setup.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'rings may extend differently',
        'rings extend differently from coils',
        'Z is not part of the spring coils',
        'Z is on the suspension ring not the coils',
        'would not give a fair measurement',
        'the rings stretch differently than the coils',
        'Z is on a ring'
    )
    ),
    false,
    E'The rings may extend differently to the coils (e.g. Z is on a suspension ring that stretches less, so including it would give a non-representative measurement); [1 mark]\n\n**Examiner commentary:** Very few got it. Many wrongly referred to Z as the bob, saying ''it isn''t part of the spring''.',
    E'**Why not measure to point Z?**\n\nPoint Z is on a **ring or end fitting**, not on the elastic coils themselves. Reasons:\n• The rings have DIFFERENT extension behaviour from the coils (they''re stiffer)\n• Measuring to Z mixes spring extension with ring deformation\n• Result: extension data would be skewed → spring constant would be wrong\n\nMeasure ONLY the extension of the coils themselves (between two fixed marker points on the coil ends). This isolates the spring''s true behaviour from end-effects.',
    true
  );

  -- ─── Q2(b)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '2(b)', 2, 'free',
    'fill_in',
    E'A student finds the **spring constant k** of a steel spring. The spring hangs vertically from a clamp. A meter rule is placed alongside. The unstretched length **l₀** (measured) = **39 mm**. The student then hangs loads L = 1.0, 2.0, 3.0, 4.0, 5.0, 6.0 N and records the new length l.\n\nl₀ = 39 mm. Lengths l for loads 1.0, 2.0, 3.0, 4.0, 5.0, 6.0 N: l = 42, 43, 46, 49, 50, 52 mm.\n\n**(b)** Calculate the **extension e = l − l₀** for each load. Give the six values (in mm), in order from L=1 to L=6, separated by commas.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '3, 4, 7, 10, 11, 13',
        '3,4,7,10,11,13',
        '3 4 7 10 11 13',
        'e1=3 e2=4 e3=7 e4=10 e5=11 e6=13'
    )
, 'must_contain', jsonb_build_array('3', '4', '7', '10', '11', '13')
    ),
    false,
    E'e values: **3, 4, 7, 10, 11, 13** (mm); [2 marks: 1 for method, 1 for all six correct]\n\n**Examiner commentary:** Moderately answered. Many calculated using e = l − L (wrong) instead of e = l − l₀.',
    E'**Extension = current length − unstretched length:**\n\ne = l − l₀ (where l₀ = 39 mm)\n\n| L / N | l / mm | e = l − 39 / mm |\n|---|---|---|\n| 1.0 | 42 | **3** |\n| 2.0 | 43 | **4** |\n| 3.0 | 46 | **7** |\n| 4.0 | 49 | **10** |\n| 5.0 | 50 | **11** |\n| 6.0 | 52 | **13** |\n\nCommon trap: using e = l − L (length minus load) gives nonsense — you can''t subtract a length from a force.',
    true
  );

  -- ─── Q2(c)  [5 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '3', '2(c)', 5, 'paid',
    'free_text',
    E'A student finds the **spring constant k** of a steel spring. The spring hangs vertically from a clamp. A meter rule is placed alongside. The unstretched length **l₀** (measured) = **39 mm**. The student then hangs loads L = 1.0, 2.0, 3.0, 4.0, 5.0, 6.0 N and records the new length l.\n\nData: L (N) = 1, 2, 3, 4, 5, 6; e (mm) = 3, 4, 7, 10, 11, 13.\n\n**(c)** Describe how to plot a graph of **extension e** (y-axis) against **load L** (x-axis), with a line of best fit. Include axis labels, scales, plotting style, and line of best fit.',
    null,
    E'All 5 marks:\n1. Axes labelled with quantity AND unit, the right way round (L/N on x; e/mm on y);\n2. Scales suitable — plots occupying at least HALF of the grid in both x and y directions;\n3. All 6 points plotted correctly to ±½ small square;\n(plotting 4 marks: 3 axes/scale + plot accuracy = 4)\n4. (plotting accuracy)\n5. WELL-JUDGED THIN STRAIGHT LINE of best fit (thickness ≤ ½ small square)\n\n**Examiner commentary:** Many well-drawn graphs. Plotting was mostly careful. Some forced lines through origin when plots didn''t justify it.',
    E'Award up to 5 marks: (a) correct axis labels with units; (b) sensible scales (occupy ≥ half grid both ways); (c) all 6 plots accurate (≤½ square); (d) plots in correct positions; (e) well-judged thin STRAIGHT line of best fit (the data is linear). PENALISE: blobs, dot-to-dot freehand, scales that bunch the data in a corner.',
    E'**Five checkpoints on a graph for full marks:**\n\n1. **Axes labelled correctly**: x = L / N (load in newtons), y = e / mm (extension in millimetres). The slash means ''in units of''.\n2. **Scales**: use the FULL grid (at least half of it both ways). Start from 0 if it makes sense; otherwise pick a sensible range.\n3. **Plot all 6 points** with small ×''s or dots (not blobs > 1 mm).\n4. **Line of best fit**: a thin SINGLE straight line that BALANCES the points (some above, some below). Use a ruler. DON''T force it through (0,0) unless the data shows it goes there.\n5. **Neat overall** — sharp pencil, no smudges.',
    true
  );

  -- ─── Q2(d)  [4 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '2(d)', 4, 'paid',
    'calculation',
    E'A student finds the **spring constant k** of a steel spring. The spring hangs vertically from a clamp. A meter rule is placed alongside. The unstretched length **l₀** (measured) = **39 mm**. The student then hangs loads L = 1.0, 2.0, 3.0, 4.0, 5.0, 6.0 N and records the new length l.\n\nThe gradient of your graph (e vs L) equals the spring constant k. (Theoretically, k is in mm/N — for a graph of extension/load.)\n\n**(d)** Use the graph to determine **k**. Show your method (large triangle, change in e / change in L) and give the value with unit. Expected range: about 2.0 mm/N (Δe ≈ 10 mm over ΔL = 5 N).',
    null,
    jsonb_build_object(
      'value', 2.0::numeric,
      'tolerance', 0.5::numeric,
      'unit', 'mm/N',
      'accept_units', jsonb_build_array('mm/N', 'mm N-1', 'mm/newton', 'mm per N')
    ),
    E'Working:\n• Draw a LARGE triangle on the line of best fit (large = covers ≥ half the line)\n• Read change in e ÷ change in L using corner points on the line\n• Example: from L = 1 N (e ≈ 3 mm) to L = 6 N (e ≈ 13 mm): gradient = (13-3)/(6-1) = 10/5 = **2 mm/N**\n[4 marks: 1 triangle indicated, 1 substitution shown, 1 answer in correct range, 1 unit]\n\n**Examiner commentary:** Most showed a clear large triangle. Few drew triangles to plotted points not on the best-fit line.',
    E'**Gradient method (for line of best fit):**\n\n1. Draw a LARGE right-angled TRIANGLE on the line of best fit (the larger the better — reduces % error).\n2. Use the CORNERS of the triangle, NOT individual data points. The corners must be ON THE LINE.\n3. Read Δe (vertical) and ΔL (horizontal).\n4. **Gradient = Δe ÷ ΔL** = change in extension ÷ change in load\n\nFor this data: from (1 N, ~3 mm) to (6 N, ~13 mm): gradient = (13 − 3) / (6 − 1) = 10 / 5 = **2 mm/N** ✓\n\nUnit: mm/N (since e is in mm and L is in N, gradient = mm divided by N). This is essentially 1/k in standard form — the bigger the gradient, the SOFTER the spring.',
    true
  );

  -- ─── Q3(a)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '3(a)', 2, 'free',
    'fill_in',
    E'A student investigates how the resistance of a wire varies with length. A resistance wire WXYZ is connected via a crocodile clip to a circuit with a power supply, a fixed resistor and TWO METERS (one for potential difference, one for current). WZ = 90 cm of wire.\n\n**(a)** State the names of instruments **1** (measures potential difference) and **2** (measures current). Format: ''''1: ___; 2: ___''''.',
    '/past-papers/physics-nssco-2024-p3/wire-circuit.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'voltmeter and ammeter',
        '1 voltmeter 2 ammeter',
        'voltmeter, ammeter',
        '1: voltmeter; 2: ammeter'
    )
, 'must_contain', jsonb_build_array('voltmeter', 'ammeter')
    ),
    false,
    E'1 — voltmeter; [1]\n2 — ammeter; [1]\n[Total 2 marks — spell correctly]\n\n**Examiner commentary:** Most got names right but swapped them. Some misspelt ''voltmeter'' or ''ammeter''.',
    E'**Match instrument to quantity:**\n\n• **Voltmeter** — measures POTENTIAL DIFFERENCE (voltage) across a component. Connected in PARALLEL across the component.\n• **Ammeter** — measures CURRENT through a component. Connected in SERIES with the component.\n\nIn the diagram, instrument 1 is across the wire (parallel) — voltmeter. Instrument 2 is in line with the wire (series) — ammeter.\n\nSpelling: voltmeter (one t), ammeter (double m).',
    true
  );

  -- ─── Q3(b)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '3(b)', 2, 'free',
    'fill_in',
    E'A student investigates how the resistance of a wire varies with length. A resistance wire WXYZ is connected via a crocodile clip to a circuit with a power supply, a fixed resistor and TWO METERS (one for potential difference, one for current). WZ = 90 cm of wire.\n\nVoltmeter reading is shown on Fig. 3.2 (scale 0-5V, needle at 2.6V). Ammeter reading on Fig. 3.3 (scale 0-1A, needle at 0.36A).\n\n**(b)** Record the **potential difference V** and **current I** from the meters. Format: ''''V: ___ V; I: ___ A''''.',
    '/past-papers/physics-nssco-2024-p3/meters-VI.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'V 2.6 I 0.36',
        'V: 2.6 V; I: 0.36 A',
        '2.6 and 0.36',
        'V=2.6 I=0.36'
    )
, 'must_contain', jsonb_build_array('2.6', '0.36')
    ),
    false,
    E'V = 2.6 V; I = 0.36 A; [2 marks: 1 each]\n\n**Examiner commentary:** Most got V correct. Many misread I as 0.28 A.',
    E'**Reading analog meters:**\n\n• Voltmeter scale 0-5 V — needle at 2.6 (between 2 and 3, closer to 3): **V = 2.6 V**\n• Ammeter scale 0-1 A — needle at 0.36 (between 0.2 and 0.4): **I = 0.36 A**\n\nTips for reading scales:\n• Look at the meter STRAIGHT ON (avoid parallax error)\n• Count the small divisions carefully\n• Include the unit (V or A) when stating the reading',
    true
  );

  -- ─── Q3(c)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '3(c)(i)', 1, 'free',
    'fill_in',
    E'Two more lengths of the wire are tested: 60 cm and 40 cm. Their V values are 2.5 V and 2.3 V; I values are 0.52 A and 0.71 A. The table columns for V and I need units added.\n\n**(c)(i)** Complete the column headings — state the **units** for V and I. Format: ''''V: ___; I: ___''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'V V I A',
        'volts amps',
        'V: V; I: A',
        'V/V I/A'
    )
, 'must_contain', jsonb_build_array('V', 'A')
    ),
    false,
    E'V — column heading ''V / V'' (volts); I — column heading ''I / A'' (amps); [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'**Column headings always include UNITS, with a slash:**\n\n• ''V / V'' — variable V (potential difference) measured in V (volts)\n• ''I / A'' — variable I (current) measured in A (amperes)\n\nThe slash means ''divided by'' — strictly the column shows the NUMBER which equals the quantity divided by the unit. This is standard physics convention.',
    true
  );

  -- ─── Q3(c)(ii)  [2 marks, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '3(c)(ii)', 2, 'paid',
    'calculation',
    E'For wire lengths 60 cm and 40 cm: (V, I) = (2.5 V, 0.52 A) and (2.3 V, 0.71 A). Calculate R = V/I for each.\n\n**(c)(ii)** Calculate the **resistance R = V/I** for the 60 cm wire. (Calculate for 40 cm too — answer in Ω, to 2 d.p.)',
    null,
    jsonb_build_object(
      'value', 4.81::numeric,
      'tolerance', 0.05::numeric,
      'unit', 'Ω',
      'accept_units', jsonb_build_array('ohm', 'ohms', 'Ω', 'ohm-m', 'Ω')
    ),
    E'For 60 cm: R = V/I = 2.5 / 0.52 = **4.81 Ω**;\nFor 40 cm: R = 2.3 / 0.71 = **3.24 Ω**;\n[2 marks: 1 method, 1 answer (for 60 cm)]\n\n**Examiner commentary:** Most calculated correctly with some rounding errors.',
    E'**Ohm''s law: R = V / I.**\n\nFor 60 cm of wire:\nR = 2.5 ÷ 0.52 = **4.81 Ω** ✓ (to 2 d.p.)\n\nFor 40 cm of wire (shorter):\nR = 2.3 ÷ 0.71 = **3.24 Ω** ✓\n\nNotice: shorter wire = LESS resistance. Resistance is proportional to length.',
    true
  );

  -- ─── Q3(c)(iii)  [1 mark, free, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '3(c)(iii)', 1, 'free',
    'calculation',
    E'From your calculated R values: 60 cm → R = 4.81 Ω; 40 cm → R = 3.24 Ω. Now calculate R/l (resistance per unit length).\n\n**(c)(iii)** Calculate **R/l** for the 60 cm wire (in Ω/cm). Express to 2 s.f.',
    null,
    jsonb_build_object(
      'value', 0.08::numeric,
      'tolerance', 0.005::numeric,
      'unit', 'Ω/cm',
      'accept_units', jsonb_build_array('ohm/cm', 'Ω/cm', 'ohms per cm', 'Ω/cm')
    ),
    E'R/l for 60 cm: 4.81 ÷ 60 = **0.080 Ω/cm** (= 0.0802);\nR/l for 40 cm: 3.24 ÷ 40 = **0.081 Ω/cm**;\n[1 mark — both values close to 0.08, confirming proportionality]\n\n**Examiner commentary:** Most got it correctly.',
    E'**R/l = resistance per unit length** (sometimes called ''resistance per cm'').\n\nFor 60 cm: R/l = 4.81 / 60 = **0.0802 Ω/cm** (≈ 0.080)\nFor 40 cm: R/l = 3.24 / 40 = **0.0810 Ω/cm** (≈ 0.081)\n\nBoth values are essentially the SAME → confirms **R ∝ l** (resistance is directly proportional to length).\n\nThe constant ratio R/l shows the resistance per cm — a property of THIS wire (depends on resistivity and cross-sectional area).',
    true
  );

  -- ─── Q3(d)  [1 mark, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '3(d)', 1, 'paid',
    'calculation',
    E'From part (c)(iii): R/l ≈ 0.08 Ω/cm.\n\n**(d)** Calculate the **resistance R₃₀** of a 30 cm length of the wire.',
    null,
    jsonb_build_object(
      'value', 2.4::numeric,
      'tolerance', 0.1::numeric,
      'unit', 'Ω',
      'accept_units', jsonb_build_array('ohm', 'ohms', 'Ω')
    ),
    E'Working: R = (R/l) × l = 0.08 × 30 = **2.4 Ω**; [1 mark]\n\n**Examiner commentary:** Very few got this. Most couldn''t use proportion / R/l value.',
    E'**Use the R/l value (resistance per cm) to scale up:**\n\nFor 30 cm: R₃₀ = (R/l) × l = 0.08 × 30 = **2.4 Ω** ✓\n\nAlternative method using proportion:\nIf 60 cm has R = 4.81 Ω, then 30 cm (half the length) has half the resistance: 4.81 / 2 = 2.4 Ω ✓\n\nKey idea: resistance is DIRECTLY proportional to length. Length doubles → R doubles. Length halves → R halves.',
    true
  );

  -- ─── Q3(e)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    phys_id, 2024, '3', '3(e)', 1, 'free',
    'fill_in',
    E'Different students get slightly different results.\n\n**(e)** Suggest **one reason** why different students may not get identical results (even with careful work).',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'difficult to judge position of crocodile clip',
        'difficult to measure wire to nearest mm',
        'contact between wire and crocodile clip not precise',
        'difficult to interpolate readings on meters',
        'temperature of the wire may vary',
        'wire heats up',
        'interpolation errors',
        'parallax error reading the meters',
        'wire temperature changes'
    )
    ),
    false,
    E'Any one: difficulty in positioning crocodile clip / measuring wire to nearest mm / interpolating meter readings / wire temperature variations; [1 mark]\n\n**Examiner commentary:** Most referred to poor practice — but the question stated the experiment was done CAREFULLY. The answer should be about unavoidable sources of error.',
    E'**Sources of unavoidable experimental error** (even with careful work):\n\n• **Crocodile clip position** — hard to place exactly at the marked length\n• **Reading the wire length** — only to the nearest mm; smaller variations are unmeasurable\n• **Meter interpolation** — needle between two scale marks → estimate needed\n• **Wire heating** — current heats the wire slightly, changing its resistance\n• **Parallax** — looking at meter at slight angle\n\nThe question says experiments are done CAREFULLY, so don''t blame technique. Blame instrument/measurement limitations.',
    true
  );

  -- ─── Q3(f)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '3', '3(f)', 2, 'paid',
    'free_text',
    E'The wire becomes hot because of high current. The student adds a variable resistor to reduce this.\n\n**(f)** Describe how to **add a variable resistor in series** with the existing components to reduce the current (and prevent overheating).',
    '/past-papers/physics-nssco-2024-p3/wire-supply.png',
    E'Both required (1 mark each):\n1. Correct **symbol for a variable resistor** (rectangle with diagonal arrow through it);\n2. Connected **in SERIES** with all other components (so the variable resistor and the wire and the power supply all share the same single loop);\n\n**Examiner commentary:** Most showed a series variable resistor. Sometimes had a line through the symbol (which would short-circuit it).',
    E'Award 1 mark for correct variable-resistor SYMBOL (rectangle with arrow). Award 1 mark for being IN SERIES — all components in one loop, current passes through everything. PENALISE: connected in parallel; wrong symbol; missing arrow.',
    E'**Variable resistor (rheostat)** symbol = a rectangle with a diagonal arrow through it (the arrow shows it can be ''varied'').\n\nTo add it to the circuit:\n• Connect it **IN SERIES** with the wire and power supply (one continuous loop)\n• Same current flows through everything\n• Increasing the variable resistance → LESS current → wire doesn''t heat up\n\nWhy series, not parallel? In parallel, the variable resistor would just divert current; in series, it adds to the total resistance and limits the current everywhere.',
    true
  );

  -- ─── Q4  [8 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    phys_id, 2024, '3', '4', 8, 'paid',
    'free_text',
    E'A physicist suggests that the **volume of hot water** will affect the **rate of cooling** of hot water in a container. Plan an experiment to investigate this relationship.\n\nPlan an experiment to investigate the relationship between **volume of hot water and rate of cooling**. Include:\n• Brief description of the method + apparatus\n• Measurements to take\n• How to ensure accuracy\n• How results are processed\n• Sketch of axes for the graph\n• How a conclusion is reached',
    null,
    E'Up to 8 marks:\n\n**Method (4 marks):**\n• M1 — Pour (hot) water into a beaker/container;\n• M2 — Measure the INITIAL temperature of water (using a thermometer);\n• M3 — Record the temperature at EQUAL INTERVALS of TIME (using a stopwatch);\n• M4 — REPEAT the procedure using a DIFFERENT VOLUME of water (same container, same starting temperature);\n\n**Precautions for accuracy (1 mark) — any ONE of:**\n• View the thermometer at right angle (avoid parallax);\n• Thermometer not touching the sides of the container;\n• Allow thermometer liquid to expand fully before reading;\n• Hold thermometer at the tip;\n• Place container on a levelled surface;\n• Read the volume below the meniscus;\n• Repeat measurements and average;\n\n**Table (1 mark):**\n• M6 — Record measurements in a table with clear columns (time and temperature) and appropriate units;\n\n**Graph (1 mark):**\n• M7 — Sketch axes for temperature change/rate of cooling vs volume of water, OR temperature vs time, OR temperatures vs volume of water;\n\n**Conclusion (1 mark):**\n• M8 — Compare the temperature change vs volume of water to see if there is a pattern (or compare gradients/steepness of the cooling curves);\n\n**Examiner commentary:** Many didn''t do well. Most learners showed lack of practical knowledge. Few detailed coherent plans were seen. The use of containers of the same material with different water volumes was recognised by many.',
    E'Award up to 8 marks for a complete plan covering: METHOD (4 marks — pour water, measure initial T, record T at equal intervals, repeat with different volumes); PRECAUTION (1 mark — any one safety/accuracy point); TABLE (1 mark — clear columns with units); GRAPH (1 mark — axes labelled appropriately for the relationship); CONCLUSION (1 mark — compare results to find pattern or gradient comparison). PENALISE: missing ''repeat with different volumes'' (the WHOLE point); not specifying initial temperature; no stopwatch.',
    E'**Plan structure for a cooling-vs-volume experiment:**\n\n**Apparatus:** beaker (or 2-3 identical beakers), thermometer, stopwatch, measuring cylinder, kettle for hot water.\n\n**Method:**\n1. Boil water in a kettle (start at the same initial temperature each run).\n2. Measure a **VOLUME** (e.g. 100 cm³) of hot water using a measuring cylinder; pour into the beaker.\n3. Record the initial temperature with the thermometer.\n4. Start the stopwatch; record temperature every 30 seconds (or 1 minute) for ~10 minutes.\n5. **REPEAT** with different volumes (e.g. 200 cm³, 300 cm³, 400 cm³). Use the SAME container, SAME starting temperature, SAME room conditions.\n\n**Accuracy:** read thermometer at eye level (no parallax), don''t let thermometer touch sides.\n\n**Table:** time/s | temperature/°C — for each volume.\n\n**Graph:** plot temperature vs time (one curve per volume — should show smaller volumes cool faster) OR plot final temperature change vs volume.\n\n**Conclusion:** if cooling rate DECREASES as volume INCREASES → confirms the hypothesis (more water = more thermal mass = slower cooling).',
    true
  );

  raise notice 'Inserted 20 sub-parts for Physics NSSCO 2024 Paper 3';
end $$;
