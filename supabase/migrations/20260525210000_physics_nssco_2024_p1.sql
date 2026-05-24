-- ===========================================================================
-- NSSCO Physics 2024 Paper 1 (6118/1) — 40 MCQ questions, 40 marks
-- Verbatim NIED wording. Answer key + commentary from
-- DNEA Examiners Report 2024 (Physics section, pages 653-655).
-- Note: Q9 was ANNULLED (no valid option); all candidates compensated.
-- ===========================================================================

do $$
declare
  phys_id uuid;
begin
  select id into phys_id from public.subjects where slug = 'physics' limit 1;
  if phys_id is null then raise notice 'Physics subject not found'; return; end if;

  -- ─── Q1 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '1', 1, 'free',
    'mcq',
    E'Which instrument is used to measure **accurately** the **inner diameter** of a wedding ring?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','30 cm ruler'),
      jsonb_build_object('id','b','text','metre rule'),
      jsonb_build_object('id','c','text','micrometer screw gauge'),
      jsonb_build_object('id','d','text','vernier calipers')
    ),
    to_jsonb('d'::text),
    null,
    E'D — vernier calipers [1 mark]. Poorly answered (39.7%). Most thought C (micrometer screw gauge), but a micrometer can''t measure INTERNAL dimensions. Vernier calipers have INSIDE jaws as well as outside jaws.',
    E'**Vernier calipers** have THREE types of jaws:\n• **Outside jaws** — for measuring outer dimensions (e.g. width of a coin)\n• **Inside jaws** — for measuring INTERNAL dimensions (e.g. **inner diameter** of a ring) ✓\n• Depth probe — for measuring depths of holes\n\nA micrometer screw gauge is MORE PRECISE (0.01 mm vs 0.1 mm) but only has outer-facing anvils — useless for inside measurements. Pick vernier when you need flexibility.',
    true
  );

  -- ─── Q2 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '2', 1, 'free',
    'mcq',
    E'An object is released from rest and falls to Earth. During its fall the object is affected by air resistance, which eventually reaches a constant value.\n\nWhich description about successive stages of the motion is correct?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','constant acceleration, then constant deceleration'),
      jsonb_build_object('id','b','text','constant deceleration, then zero acceleration'),
      jsonb_build_object('id','c','text','decreasing acceleration, then constant deceleration'),
      jsonb_build_object('id','d','text','decreasing acceleration, then zero acceleration')
    ),
    to_jsonb('d'::text),
    null,
    E'D [1 mark]. Very poorly answered (13.8%). At first the object speeds up; air resistance rises with speed and reduces the net force → ACCELERATION DECREASES. When air resistance equals gravity → net force = 0 → ZERO acceleration (terminal velocity, constant speed).',
    E'**Two-stage motion of a falling object with air resistance:**\n\n1. **Stage 1 — Decreasing acceleration**: at first, gravity is much bigger than air resistance → net force ≈ weight → big acceleration. As speed grows, **air resistance grows** with it, REDUCING the net force → **acceleration decreases** (but speed still increases).\n\n2. **Stage 2 — Zero acceleration (terminal velocity)**: eventually air resistance EQUALS weight → net force = 0 → **NO acceleration**. The object keeps falling at a **constant speed** (not decelerating — deceleration means slowing down, which doesn''t happen).\n\nKey trap: zero acceleration ≠ deceleration. Constant speed = zero acceleration.',
    true
  );

  -- ─── Q3 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '3', 1, 'free',
    'mcq',
    E'A speed-vs-time graph shows a train going from 0 to 20 m/s linearly in 100 s, then constant 20 m/s from 100 to 500 s, then decelerating linearly from 500 to 900 s back to 0.\n\nWhich statement about the train is correct?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','Its acceleration reached 4000 m/s² in the first 100 s.'),
      jsonb_build_object('id','b','text','Its deceleration occurred over a 4000 m distance.'),
      jsonb_build_object('id','c','text','It travelled 2000 m in the first 100 s.'),
      jsonb_build_object('id','d','text','It travelled 10 000 m at constant speed.')
    ),
    to_jsonb('b'::text),
    '/past-papers/physics-nssco-2024-p1/q3-train-speed-graph.png',
    E'B [1 mark]. Poorly answered (28.7%). Distance = AREA under graph.',
    E'**On a speed-time graph, distance = AREA under the curve.**\n\nCheck each option:\n• **A** — Acceleration = slope = 20÷100 = 0.2 m/s² (NOT 4000). ✗\n• **B** — Deceleration phase: triangle from t=500 to t=900, height 20 m/s. Area = ½ × 400 × 20 = **4000 m** ✓\n• **C** — First 100 s: triangle, area = ½ × 100 × 20 = 1000 m (NOT 2000). ✗\n• **D** — Constant phase 100 to 500 s = 400 s × 20 m/s = 8000 m (NOT 10000). ✗\n\nOnly B matches.',
    true
  );

  -- ─── Q4 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '4', 1, 'free',
    'mcq',
    E'Which quantity has the **same unit as force** (newton, N)?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','electromotive force'),
      jsonb_build_object('id','b','text','moment of force'),
      jsonb_build_object('id','c','text','weight of an object'),
      jsonb_build_object('id','d','text','work done on an object')
    ),
    to_jsonb('c'::text),
    null,
    E'C — weight [1 mark]. Fairly answered (57.8%). Some guessed between B and C.',
    E'**Match the quantity to its SI unit:**\n• Electromotive force (e.m.f.) — **volts (V)**, despite the name\n• Moment of force (torque) — **newton-metres (N·m)**\n• **Weight = mass × g** — measured in **newtons (N)** ✓ (same unit as force)\n• Work done — **joules (J)**\n\nWeight IS a force — that''s why it shares the unit of force. The ''electromotive force'' is mis-named (it''s a voltage, not a force).',
    true
  );

  -- ─── Q5 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '5', 1, 'free',
    'mcq',
    E'Which words describe why a physical quantity is classified as a **vector** quantity?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','direction only'),
      jsonb_build_object('id','b','text','size but no direction'),
      jsonb_build_object('id','c','text','both size and direction'),
      jsonb_build_object('id','d','text','neither size nor direction')
    ),
    to_jsonb('c'::text),
    null,
    E'C — both size and direction [1 mark]. Very well answered (82.9%).',
    E'**Vector vs scalar:**\n• **Vector** — has BOTH **magnitude (size)** AND **direction** (e.g. velocity, force, displacement, acceleration, momentum)\n• Scalar — has only magnitude, no direction (e.g. speed, distance, mass, energy, temperature, time)\n\nKey examples to memorise:\n• Displacement (vector) vs distance (scalar)\n• Velocity (vector) vs speed (scalar)\n\nBoth a number AND an arrow → vector.',
    true
  );

  -- ─── Q6 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '6', 1, 'free',
    'mcq',
    E'Pressure is force acting per unit area.\n\nWhich changes produce the **same pressure**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','double the area and double the force'),
      jsonb_build_object('id','b','text','double the area and halve the force'),
      jsonb_build_object('id','c','text','double the area and make the force four times bigger'),
      jsonb_build_object('id','d','text','halve the area and double the force')
    ),
    to_jsonb('a'::text),
    null,
    E'A [1 mark]. Fairly answered (52%). P = F/A — if both F and A are doubled, the ratio (and so the pressure) stays the same.',
    E'**Pressure formula: P = F ÷ A.**\n\nFor pressure to be the SAME, the ratio F/A must stay the same.\n• A — F×2 ÷ A×2 = same ✓\n• B — F÷2 ÷ A×2 = ¼ of original → smaller pressure\n• C — F×4 ÷ A×2 = 2× original\n• D — F×2 ÷ A÷2 = 4× original → much bigger\n\nDouble BOTH → cancel out → same pressure.',
    true
  );

  -- ─── Q7 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '7', 1, 'free',
    'mcq',
    E'A uniform beam is pivoted at its centre. Three weights are placed as shown:\n• **300 N** on the LEFT, 0.40 m from the pivot\n• **350 N** on the RIGHT, at distance **d** from the pivot\n• **100 N** on the RIGHT, 0.50 m from the pivot\n\nThe beam is balanced. What is the length **d**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','0.020 m'),
      jsonb_build_object('id','b','text','0.050 m'),
      jsonb_build_object('id','c','text','0.20 m'),
      jsonb_build_object('id','d','text','0.48 m')
    ),
    to_jsonb('c'::text),
    '/past-papers/physics-nssco-2024-p1/q7-balanced-beam.png',
    E'C — 0.20 m [1 mark]. Fairly answered (59.2%). 300×0.40 = 350d + 100×0.50 → 120 = 350d + 50 → d = 0.20 m.',
    E'**Principle of moments: total clockwise moment = total anticlockwise moment.**\n\nMoment = force × perpendicular distance from pivot.\n\n**Anticlockwise (left side):** 300 N × 0.40 m = **120 N·m**\n**Clockwise (right side):** 350 × d + 100 × 0.50 = 350d + 50\n\nSetting equal:\n120 = 350d + 50\n70 = 350d\nd = **0.20 m** ✓',
    true
  );

  -- ─── Q8 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '8', 1, 'free',
    'mcq',
    E'Four objects of equal mass rest on a smooth surface. The centre of mass of each is labelled G:\n• A — triangular prism with low G (wide base)\n• B — tall narrow rectangle with HIGH G (narrow base)\n• C — squat rectangle with low-mid G\n• D — trapezium leaning to one side with mid G\n\nWhich object is the **least stable**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('b'::text),
    '/past-papers/physics-nssco-2024-p1/q8-stability-shapes.png',
    E'B [1 mark]. Poorly answered (48.6%). Stability needs wide base + low centre of gravity. B has a narrow base AND a high centre of gravity — least stable.',
    E'**Two rules for stability:**\n1. **Wider base** → more stable (object''s centre of gravity stays above the base for a larger tilt)\n2. **LOWER centre of gravity** → more stable\n\nLeast stable = OPPOSITE of both:\n• **Narrow base + HIGH centre of gravity** → B ✓\n• A (triangle): wide base, low G — most stable\n• C: medium\n• D: leaning shape but moderate G\n\nA tall narrow object tips over easily because a small tilt moves its centre of gravity past the edge of the base.',
    true
  );

  -- ─── Q9 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '9', 1, 'free',
    'mcq',
    E'**[ANNULLED]** A 400 kg object moving at speed v collides head-on with a 200 kg object moving at 100 m/s in the opposite direction. They stick together and move at 80 m/s.\n\nWhat was the speed v of the 400 kg object?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','50 m/s (annulled — accept any)'),
      jsonb_build_object('id','b','text','70 m/s (annulled — accept any)'),
      jsonb_build_object('id','c','text','80 m/s (annulled — accept any)'),
      jsonb_build_object('id','d','text','100 m/s (annulled — accept any)')
    ),
    to_jsonb('a'::text),
    null,
    E'ANNULLED. None of the options is correct. The actual answer (using momentum conservation) is **170 m/s** — not in the options. NIED compensated all candidates so any answer scores the mark here.',
    E'**Conservation of momentum**: p_before = p_after.\n\nTake right as positive. 400 kg moves at +v; 200 kg moves at −100 (opposite direction).\n• Before: 400v + 200(−100) = 400v − 20000\n• After: combined 600 kg × 80 = 48000\n\nSetting equal:\n400v − 20000 = 48000\n400v = 68000\nv = **170 m/s**\n\n170 m/s wasn''t among the printed options (A=50, B=70, C=80, D=100). NIED treated this question as faulty (annulled) — every candidate was awarded the mark regardless of which option they chose.',
    true
  );

  -- ─── Q10 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '10', 1, 'free',
    'mcq',
    E'A 0.5 kg soccer ball is dropped from a height of 3.0 m. Air resistance is negligible.\n\nWhich row gives the **maximum kinetic energy** attained by the ball? [g = 10 m/s²]',
    jsonb_build_array(
      jsonb_build_object('id','a','text','7.5 J — as it lands'),
      jsonb_build_object('id','b','text','7.5 J — at the highest height'),
      jsonb_build_object('id','c','text','15 J — as it lands'),
      jsonb_build_object('id','d','text','15 J — at the highest height')
    ),
    to_jsonb('c'::text),
    null,
    E'C — 15 J as it lands [1 mark]. Poorly answered (37.7%). PE = mgh = 0.5 × 10 × 3.0 = 15 J. All this PE is converted to KE as the ball lands (max KE at ground).',
    E'**Energy conservation:** total energy = PE + KE = constant.\n\nAt the TOP (h = 3 m, just before release): all energy is PE\n• PE = m × g × h = 0.5 × 10 × 3.0 = **15 J**\n• KE = 0 (at rest)\n\nAt the BOTTOM (just before landing): all PE has converted to KE\n• PE = 0 (h = 0)\n• **KE = 15 J** ← maximum ✓\n\nAt the highest point KE is ZERO (it''s stationary just before release). Maximum KE is at the LOWEST point (just before landing).',
    true
  );

  -- ─── Q11 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '11', 1, 'free',
    'mcq',
    E'Which type of energy is described as energy possessed due to **position above the ground**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','chemical energy'),
      jsonb_build_object('id','b','text','kinetic energy'),
      jsonb_build_object('id','c','text','potential energy'),
      jsonb_build_object('id','d','text','strain energy')
    ),
    to_jsonb('c'::text),
    null,
    E'C — potential energy [1 mark]. Fairly answered (60.1%). Option B common wrong — confusion with kinetic.',
    E'**Energy types — match the cause to the type:**\n• Position ABOVE the ground → **Gravitational POTENTIAL energy (GPE)** ✓\n• Movement → KINETIC energy (KE)\n• Stored in chemical bonds (food, batteries, fuel) → CHEMICAL energy\n• Stretched springs, compressed material → STRAIN (elastic potential) energy\n\nFormula for GPE: **PE = mgh** (depends on mass, gravity AND HEIGHT).',
    true
  );

  -- ─── Q12 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '12', 1, 'free',
    'mcq',
    E'Three forces act on an object:\n• 30 N pointing LEFT\n• 5 N pointing RIGHT (top edge)\n• 5 N pointing RIGHT (bottom edge)\n\nWhat is the **resultant force**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','10 N towards the right'),
      jsonb_build_object('id','b','text','20 N towards the left'),
      jsonb_build_object('id','c','text','30 N towards the left'),
      jsonb_build_object('id','d','text','40 N towards the right')
    ),
    to_jsonb('b'::text),
    '/past-papers/physics-nssco-2024-p1/q12-three-forces.png',
    E'B — 20 N towards the left [1 mark]. Fairly answered (59.7%). 30 N left − (5 + 5) right = 20 N left.',
    E'**Resultant force = vector SUM of all forces.**\n\nTake LEFT as positive (the bigger direction):\n• Left forces: 30 N\n• Right forces: 5 + 5 = 10 N\n• Net: **30 − 10 = 20 N to the LEFT** ✓\n\nWhen forces point in OPPOSITE directions, SUBTRACT them. The direction of the resultant is the direction of the BIGGER force.',
    true
  );

  -- ─── Q13 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '13', 1, 'free',
    'mcq',
    E'Which statement defines **specific latent heat**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','The heat absorbed to change the state of 1 kg of a substance.'),
      jsonb_build_object('id','b','text','The heat absorbed to change the state of a substance.'),
      jsonb_build_object('id','c','text','The heat required to raise the temperature of 1 kg of a substance by 1 K.'),
      jsonb_build_object('id','d','text','The heat required to raise the temperature of a substance by 1 K.')
    ),
    to_jsonb('a'::text),
    null,
    E'A [1 mark]. Poorly answered (39.5%). Option C common wrong — confusion with specific heat capacity.',
    E'**Two similar terms — don''t mix up:**\n\n• **Specific LATENT heat** — energy to **change STATE** of **1 kg** (no temperature change). E.g. melting ice at 0 °C → 0 °C water.\n• **Specific HEAT CAPACITY** — energy to **change TEMPERATURE** of 1 kg by **1 K (or 1 °C)** (no state change).\n\nKey word **''state''** = latent heat. Key words **''temperature... by 1 K''** = heat capacity.\n\nA names the right thing per 1 kg. B is missing the ''1 kg''. C and D describe heat capacity.',
    true
  );

  -- ─── Q14 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '14', 1, 'free',
    'mcq',
    E'To mark a scale on a thermometer, standard temperatures known as **fixed points** are needed.\n\nWhich of the following provides a fixed point?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','the room temperature'),
      jsonb_build_object('id','b','text','the temperature inside a freezer'),
      jsonb_build_object('id','c','text','the temperature of pure melting ice'),
      jsonb_build_object('id','d','text','the temperature of warm water')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. Poorly answered (35%). Many wrongly chose A.',
    E'**Fixed points** are temperatures that are ALWAYS the SAME under standard conditions:\n• **Pure melting ice → 0 °C** (lower fixed point) ✓\n• Pure boiling water at 1 atm → 100 °C (upper fixed point)\n\nRoom temperature, freezer temperature, warm water — all VARIABLE → not fixed points. They depend on weather, settings, exact source — can''t be used to calibrate a thermometer.',
    true
  );

  -- ─── Q15 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '15', 1, 'free',
    'mcq',
    E'Two statements describe changes of state due to COOLING:\n• **Change 1**: molecules stop moving around and just vibrate about fixed positions.\n• **Change 2**: molecules move closer together but continue to travel throughout the substance.\n\nWhich row identifies these changes?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','1=condensation, 2=melting'),
      jsonb_build_object('id','b','text','1=condensation, 2=solidification'),
      jsonb_build_object('id','c','text','1=solidification, 2=condensation'),
      jsonb_build_object('id','d','text','1=solidification, 2=melting')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. Poorly answered (39.9%). Most got change 1 right (solidification) but missed change 2 (condensation, not melting).',
    E'**Match each description to its state change:**\n\n• **Change 1** — particles in FIXED positions, just vibrate → **SOLID** behaviour. Cooling INTO this state = **SOLIDIFICATION** (also called freezing) ✓\n• **Change 2** — particles CLOSER together but STILL TRAVELLING THROUGHOUT → **LIQUID** behaviour. Cooling FROM gas INTO this state = **CONDENSATION** ✓\n\nThe question said ''due to cooling'' — that rules out melting (which is heating from solid → liquid). It must be solidification + condensation = **C**.',
    true
  );

  -- ─── Q16 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '16', 1, 'free',
    'mcq',
    E'At a certain temperature, **all particles stop moving**. Which statement describes this temperature?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','The absolute zero and it is 0 °C.'),
      jsonb_build_object('id','b','text','The absolute zero and it is 0 Kelvin.'),
      jsonb_build_object('id','c','text','The freezing point and it is 0 °C.'),
      jsonb_build_object('id','d','text','The freezing point and it is 0 Kelvin.')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Poorly answered (23.6%). Many candidates correctly identified absolute zero but couldn''t recall it''s 0 K (not 0 °C).',
    E'**Absolute zero (0 K) = the temperature at which all particle motion stops.**\n\n• 0 K = **−273 °C** (NOT 0 °C)\n• 0 °C = the freezing point of pure water = +273 K (cold but particles still move)\n\nDon''t confuse:\n• Freezing point (water → ice) = 0 °C = 273 K\n• Absolute zero = 0 K = −273 °C (much colder)\n\nKelvin scale starts at absolute zero. Convert: K = °C + 273.',
    true
  );

  -- ─── Q17 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '17', 1, 'free',
    'mcq',
    E'An object of cast iron has mass 2.0 kg. 23 000 J of energy raised its temperature from 50 °C to 75 °C.\n\nWhat is the **specific heat capacity** of cast iron?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','153 J/(kg·°C)'),
      jsonb_build_object('id','b','text','230 J/(kg·°C)'),
      jsonb_build_object('id','c','text','460 J/(kg·°C)'),
      jsonb_build_object('id','d','text','920 J/(kg·°C)')
    ),
    to_jsonb('c'::text),
    null,
    E'C — 460 J/(kg·°C) [1 mark]. Well answered (66%). Q = mcΔT → c = Q ÷ (m × ΔT) = 23000 ÷ (2.0 × 25) = 460.',
    E'**Formula:** Q = m × c × ΔT (heat energy = mass × specific heat capacity × temperature change).\n\nRearrange for c:\n**c = Q ÷ (m × ΔT)**\n\nValues:\n• Q = 23 000 J\n• m = 2.0 kg\n• ΔT = 75 − 50 = 25 °C\n\nc = 23 000 ÷ (2.0 × 25) = 23 000 ÷ 50 = **460 J/(kg·°C)** ✓\n\nTypical c values: water ≈ 4200, aluminium ≈ 900, iron/steel ≈ 460. Iron has lower c than water — heats up faster.',
    true
  );

  -- ─── Q18 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '18', 1, 'free',
    'mcq',
    E'Ice is trapped at the BOTTOM of a tube containing water, held by a metal gauze. The water at the TOP of the tube is boiled before the ice at the bottom melts.\n\nWhy does the ice melt so slowly?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','Hot water is denser than cold water.'),
      jsonb_build_object('id','b','text','Ice is a poor absorber of heat.'),
      jsonb_build_object('id','c','text','Metal gauze does not allow heat to pass through.'),
      jsonb_build_object('id','d','text','Water is a poor conductor of heat.')
    ),
    to_jsonb('d'::text),
    '/past-papers/physics-nssco-2024-p1/q18-ice-tube.png',
    E'D [1 mark]. Poorly answered (18.05%). Evidence of guessing.',
    E'**Why heat doesn''t reach the ice:**\n\nWater is a **POOR CONDUCTOR** of heat. The heat at the top (where it''s boiling) can''t conduct DOWN through the water to reach the ice.\n\nNormally hot water would RISE by **convection** — but the heat source is at the top, so hot water can''t rise any further. There''s NO convection current to carry heat down.\n\nWithout convection, the only way down is **conduction** — and water conducts heat very poorly → ice melts very slowly.\n\nThis is a classic experiment showing **water is a poor conductor of heat**.',
    true
  );

  -- ─── Q19 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '19', 1, 'free',
    'mcq',
    E'What is the name given to the **transfer of heat energy which does NOT require a medium**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','conduction'),
      jsonb_build_object('id','b','text','convection'),
      jsonb_build_object('id','c','text','evaporation'),
      jsonb_build_object('id','d','text','radiation')
    ),
    to_jsonb('d'::text),
    null,
    E'D — radiation [1 mark]. Fairly answered (54.7%).',
    E'**Three ways heat is transferred:**\n• **Conduction** — needs a SOLID medium (vibrating particles)\n• **Convection** — needs a FLUID medium (currents in liquid/gas)\n• **Radiation** — needs NO medium! Travels as electromagnetic waves through vacuum ✓\n\nThat''s why we feel the Sun''s heat across 150 million km of empty space — RADIATION. Conduction and convection would never reach us.\n\nEvaporation isn''t a heat-transfer method — it''s a phase change (liquid → gas).',
    true
  );

  -- ─── Q20 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '20', 1, 'free',
    'mcq',
    E'Which row shows an example of a **transverse wave** AND an example of a **longitudinal wave**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','transverse=light, longitudinal=radio'),
      jsonb_build_object('id','b','text','transverse=light, longitudinal=sound'),
      jsonb_build_object('id','c','text','transverse=sound, longitudinal=surface of water'),
      jsonb_build_object('id','d','text','transverse=surface of water, longitudinal=light')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Fairly answered (65%).',
    E'**Two types of wave:**\n• **Transverse** — oscillations PERPENDICULAR to direction of travel (e.g. **light**, all EM waves, water surface waves, waves on a string)\n• **Longitudinal** — oscillations PARALLEL to direction of travel (e.g. **sound**, P-waves in earthquakes)\n\nA wrong: radio is transverse (EM wave), not longitudinal.\nC wrong: sound is LONGITUDINAL, water is transverse — swapped.\nD wrong: light is TRANSVERSE, not longitudinal.\n\n**B**: light = transverse ✓, sound = longitudinal ✓.',
    true
  );

  -- ─── Q21 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '21', 1, 'free',
    'mcq',
    E'Which electromagnetic waves have the **shortest wavelength**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','gamma rays'),
      jsonb_build_object('id','b','text','infra-red waves'),
      jsonb_build_object('id','c','text','microwaves'),
      jsonb_build_object('id','d','text','radio waves')
    ),
    to_jsonb('a'::text),
    null,
    E'A — gamma rays [1 mark]. Fairly answered (50.9%).',
    E'**EM spectrum, by INCREASING wavelength (or decreasing frequency):**\n\n**Gamma → X-rays → UV → Visible → Infrared → Microwaves → Radio**\n\n• **Gamma rays — SHORTEST wavelength** ✓ (and highest frequency, highest energy)\n• Radio waves — LONGEST wavelength (and lowest frequency)\n\nMemory hook: ''Gentlemen Xerox Up Vital Information Monday Replies'' = Gamma, X-ray, UV, Visible, IR, Microwave, Radio (left = short, right = long).',
    true
  );

  -- ─── Q22 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '22', 1, 'free',
    'mcq',
    E'A UV wave has wavelength **3.0 × 10⁻⁷ m** and frequency **1.0 × 10¹⁵ Hz**.\n\nWhat is the **speed** of this wave?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','3.3 × 10⁻²³ m/s'),
      jsonb_build_object('id','b','text','3.0 × 10⁸ m/s'),
      jsonb_build_object('id','c','text','3.0 × 10⁹ m/s'),
      jsonb_build_object('id','d','text','3.3 × 10²² m/s')
    ),
    to_jsonb('b'::text),
    null,
    E'B — 3.0 × 10⁸ m/s [1 mark]. Well answered (75.1%). c = λ × f = 3.0e-7 × 1.0e15 = 3.0e8 m/s.',
    E'**Wave equation: speed = wavelength × frequency**\n\n**v = λ × f**\n\nv = (3.0 × 10⁻⁷ m) × (1.0 × 10¹⁵ Hz)\nv = 3.0 × 10⁽⁻⁷⁺¹⁵⁾ = **3.0 × 10⁸ m/s** ✓\n\nThis is the speed of light (c)! All electromagnetic waves (including UV) travel at c in vacuum.\n\nWhen multiplying powers of 10, ADD the exponents: −7 + 15 = 8. Common slip: forgetting the negative sign on −7.',
    true
  );

  -- ─── Q23 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '23', 1, 'free',
    'mcq',
    E'In which substance does **sound travel fastest**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','air'),
      jsonb_build_object('id','b','text','steel'),
      jsonb_build_object('id','c','text','vacuum'),
      jsonb_build_object('id','d','text','water')
    ),
    to_jsonb('b'::text),
    null,
    E'B — steel [1 mark]. Poorly answered (31.5%). Option A common wrong.',
    E'**Sound speed: SOLID > LIQUID > GAS** (denser packing → faster vibration transmission).\n\nApproximate speeds:\n• **Steel (solid) — ~5000 m/s** ✓ fastest\n• Water (liquid) — ~1500 m/s\n• Air (gas) — ~340 m/s\n• Vacuum — **NO sound** (no particles to vibrate)\n\nSound needs a medium. Closer/denser particles = faster transmission. Steel has tightly bonded atoms, so sound zips through it fast.',
    true
  );

  -- ─── Q24 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '24', 1, 'free',
    'mcq',
    E'A ray of light refracts from AIR into GLASS. The diagram labels four angles:\n• **w** — between ray and the air-glass boundary (on the air side)\n• **x** — between incoming ray and the normal (on the air side)\n• **y** — between refracted ray and the glass-air boundary (on the glass side)\n• **z** — between refracted ray and the normal (on the glass side)\n\nWhich angle represents the **angle of refraction**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','w'),
      jsonb_build_object('id','b','text','x'),
      jsonb_build_object('id','c','text','y'),
      jsonb_build_object('id','d','text','z')
    ),
    to_jsonb('d'::text),
    '/past-papers/physics-nssco-2024-p1/q24-refraction-angles.png',
    E'D — z [1 mark]. Fairly answered (59.3%). Most thought it was y. Angles are always measured FROM THE NORMAL.',
    E'**Important rule:** angles in optics are ALWAYS measured **FROM THE NORMAL** (the dashed line perpendicular to the surface) — NEVER from the surface itself.\n\n• **Angle of incidence** = between incoming ray and the normal (in the FIRST medium, here air) = **x**\n• **Angle of refraction** = between refracted ray and the normal (in the SECOND medium, here glass) = **z** ✓\n\nAngles w and y are wrong — they''re measured from the surface (the boundary). Don''t be tempted!',
    true
  );

  -- ─── Q25 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '25', 1, 'free',
    'mcq',
    E'An object O is in front of a converging lens. The ray diagram shows TWO light rays from the tip of O — they appear to DIVERGE behind the lens (don''t converge to a real image), but their backward extensions cross at a point on the same side as the object.\n\nP is to the LEFT of O. Q is BETWEEN O and the lens.\n\nWhich point (P or Q) is the **principal focus** and what type of image is formed?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','P — real'),
      jsonb_build_object('id','b','text','P — virtual'),
      jsonb_build_object('id','c','text','Q — real'),
      jsonb_build_object('id','d','text','Q — virtual')
    ),
    to_jsonb('b'::text),
    '/past-papers/physics-nssco-2024-p1/q25-lens-rays.png',
    E'B — P, virtual [1 mark]. Poorly answered (32.1%).',
    E'**Two facts to read off the diagram:**\n\n1. **Principal focus (F)** — where parallel rays converge AFTER passing through the lens. In this diagram, **P** is the point where the lens converges parallel rays from infinity → P = principal focus.\n\n2. **Image type** — if the object is BETWEEN the lens and F (closer than the focal length), the rays DIVERGE after the lens. Tracing them backwards gives a **VIRTUAL, upright, magnified image** (like a magnifying glass) on the SAME side as the object. ✓\n\nReal images: rays actually converge on the OTHER side, can be projected on a screen. Virtual: rays only appear to converge (when extended back), can''t be projected.',
    true
  );

  -- ─── Q26 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '26', 1, 'free',
    'mcq',
    E'What is the approximate **range of audible sound frequencies** for a healthy human ear?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','20 Hz to 20 000 Hz only'),
      jsonb_build_object('id','b','text','200 Hz to 2 000 Hz only'),
      jsonb_build_object('id','c','text','200 Hz to 20 000 Hz only'),
      jsonb_build_object('id','d','text','2 000 Hz to 200 000 Hz only')
    ),
    to_jsonb('a'::text),
    null,
    E'A — 20 Hz to 20 000 Hz [1 mark]. Well answered (68.9%).',
    E'**Human hearing range: 20 Hz to 20 000 Hz (20 kHz).**\n\n• Below 20 Hz = INFRASOUND (we feel it but can''t hear; elephants, whales use this)\n• Above 20 000 Hz = ULTRASOUND (dogs hear up to 45 kHz, bats up to 100 kHz)\n\nMemory hook: ''20 to 20 000'' — easy to remember.\n\nThe upper limit decreases with age (older adults often top out around 15 kHz). The lower limit stays roughly fixed.',
    true
  );

  -- ─── Q27 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '27', 1, 'free',
    'mcq',
    E'A bat emits a sound pulse toward a mountain. The sound is reflected and returns in **6.0 s**. The mountain is **1000 m** away.\n\nWhat is the speed of this sound?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','167 m/s'),
      jsonb_build_object('id','b','text','333 m/s'),
      jsonb_build_object('id','c','text','3 000 m/s'),
      jsonb_build_object('id','d','text','6 000 m/s')
    ),
    to_jsonb('b'::text),
    null,
    E'B — 333 m/s [1 mark]. Poorly answered (18.8%). Many chose A (167) — they forgot the sound travels TO the mountain AND BACK (total 2000 m).',
    E'**Echo question — remember the round trip!**\n\nThe sound travels:\n• TO the mountain (1000 m forward)\n• BACK to the bat (1000 m return)\n• **Total distance = 2 × 1000 = 2000 m**\n• Total time = 6.0 s\n\n**speed = distance ÷ time = 2000 ÷ 6.0 = 333 m/s** ✓\n\nThis is realistic — sound in air ≈ 340 m/s.\n\nCommon trap: 1000 ÷ 6 = 167 m/s — but that ignores the return trip.',
    true
  );

  -- ─── Q28 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '28', 1, 'free',
    'mcq',
    E'What is the **unit for the energy used by an electrical appliance**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','coulombs per second'),
      jsonb_build_object('id','b','text','joules per second'),
      jsonb_build_object('id','c','text','kilowatt-hour'),
      jsonb_build_object('id','d','text','volt per ampere')
    ),
    to_jsonb('c'::text),
    null,
    E'C — kilowatt-hour [1 mark]. Poorly answered (43.1%).',
    E'**Match unit to quantity:**\n• Coulombs per second (C/s) = **CURRENT** (in amperes)\n• Joules per second (J/s) = **POWER** (in watts)\n• **Kilowatt-hour (kWh)** = **ENERGY** ✓ (a 1 kW device used for 1 hour uses 1 kWh)\n• Volt per ampere = RESISTANCE (in ohms)\n\nThe kilowatt-hour is what your electricity bill measures. Officially energy could be in joules (1 kWh = 3 600 000 J), but appliance energy use is conventionally in kWh.',
    true
  );

  -- ─── Q29 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '29', 1, 'free',
    'mcq',
    E'A metal conductor is connected to a battery. Which statement describes the **current** in the metal conductor?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','Flow of electrons from the negative to the positive terminal.'),
      jsonb_build_object('id','b','text','Flow of electrons from the positive to the negative terminal.'),
      jsonb_build_object('id','c','text','Flow of protons from the negative to the positive terminal.'),
      jsonb_build_object('id','d','text','Flow of protons from the positive to the negative terminal.')
    ),
    to_jsonb('a'::text),
    null,
    E'A [1 mark]. Poorly answered (26.6%). Option B common wrong — but the negative terminal repels electrons, sending them to the positive terminal.',
    E'**Electron flow direction (in a wire):**\n\nElectrons are NEGATIVELY charged. They are:\n• REPELLED by the negative terminal of the battery\n• ATTRACTED by the positive terminal\n• → They flow **FROM NEGATIVE TO POSITIVE** ✓\n\nNote: **CONVENTIONAL current** flows the OTHER way (positive to negative — agreed by historical convention before electrons were discovered). The question asks about the ACTUAL ELECTRON flow → **A**.\n\nProtons don''t move in metal wires — they''re locked in the nuclei.',
    true
  );

  -- ─── Q30 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '30', 1, 'free',
    'mcq',
    E'Which electrical symbol represents a **variable resistor**?\n\n• **A** — circle with an X through it (lamp)\n• **B** — rectangle with a DIAGONAL ARROW through it (variable resistor / rheostat)\n• **C** — plain rectangle (fixed resistor)\n• **D** — triangle pointing into a vertical line (diode)',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('b'::text),
    '/past-papers/physics-nssco-2024-p1/q30-circuit-symbols.png',
    E'B [1 mark]. Well answered (72.4%).',
    E'**Common circuit symbols:**\n• A — Lamp (× through circle)\n• **B — Variable resistor / rheostat** — rectangle with a diagonal arrow through it ✓\n• C — Fixed resistor (plain rectangle)\n• D — Diode (triangle + line) — only lets current through one way\n\nThe ARROW indicates ''variable'' (can be adjusted, like a dimmer dial).',
    true
  );

  -- ─── Q31 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '31', 1, 'free',
    'mcq',
    E'Two 4 Ω resistors are in **parallel**, supplied by a 4 V source.\n\nWhat is the **total current** in the circuit?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','0.5 A'),
      jsonb_build_object('id','b','text','1.0 A'),
      jsonb_build_object('id','c','text','2.0 A'),
      jsonb_build_object('id','d','text','4.0 A')
    ),
    to_jsonb('c'::text),
    '/past-papers/physics-nssco-2024-p1/q31-parallel-resistors.png',
    E'C — 2.0 A [1 mark]. Poorly answered (38.8%). Many wrongly ADDED 4 Ω + 4 Ω to get 8 Ω, then 0.5 A — but they''re in PARALLEL, not series.',
    E'**Two resistors in PARALLEL — total resistance is LESS than either single one:**\n\n1/R_total = 1/R1 + 1/R2 = 1/4 + 1/4 = 2/4 = 1/2\n→ **R_total = 2 Ω**\n\nShortcut for two EQUAL parallel resistors: R_total = R ÷ 2 → 4 ÷ 2 = **2 Ω**.\n\nNow apply Ohm''s law:\n**I = V ÷ R = 4 V ÷ 2 Ω = 2.0 A** ✓\n\nKey trap: don''t ADD parallel resistors. The COMBINED resistance is smaller because the current has TWO paths to flow through.',
    true
  );

  -- ─── Q32 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '32', 1, 'free',
    'mcq',
    E'Four wires made of the same metal:\n• A — length 3.0 m, diameter 1.0 mm\n• B — length 3.0 m, diameter 1.3 mm\n• C — length 4.0 m, diameter 1.0 mm\n• D — length 4.0 m, diameter 1.3 mm\n\nWhich has the **smallest resistance**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Poorly answered (25.4%). Length ∝ R (longer = more resistance); diameter² ∝ 1/R (thicker = less resistance).',
    E'**Two rules for wire resistance:**\n• **Length** ↑ → resistance ↑ (longer wire = more resistance) → choose SHORTEST length (3.0 m)\n• **Diameter** ↑ → resistance ↓ (thicker wire = less resistance) → choose LARGEST diameter (1.3 mm)\n\nCombining: shortest AND thickest → **B (3.0 m, 1.3 mm)** ✓\n\nA — same length as B but thinner → more resistance.\nD — same diameter as B but longer → more resistance.\nC — longest AND thinnest → highest resistance.',
    true
  );

  -- ─── Q33 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '33', 1, 'free',
    'mcq',
    E'Which colour correctly identifies the **neutral wire** in a mains plug?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','blue'),
      jsonb_build_object('id','b','text','brown'),
      jsonb_build_object('id','c','text','green'),
      jsonb_build_object('id','d','text','red')
    ),
    to_jsonb('a'::text),
    null,
    E'A — blue [1 mark]. Poorly answered (43.6%). Evidence of guessing.',
    E'**Standard mains wiring colour code (UK / Namibia):**\n• **Live (L)** — **BROWN** (used to be RED in older wiring)\n• **Neutral (N)** — **BLUE** ✓ (used to be BLACK)\n• **Earth (E)** — **GREEN/YELLOW stripes** (used to be plain green)\n\nMemory hook: Blue = Neutral (both ''pale'' and ''unloaded''). Brown = Live (bringing the energy). Green/yellow = Earth (the ground).',
    true
  );

  -- ─── Q34 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '34', 1, 'free',
    'mcq',
    E'A diagram of a **RELAY** shows: a vertical solenoid coil, an armature with a pivot on the side, and contacts. When CURRENT flows in the coil, the armature is attracted toward the coil and closes the contacts.\n\nWhich option diagram correctly shows this **''current-on'' state** (armature pulled towards coil, contacts CLOSED)?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('b'::text),
    '/past-papers/physics-nssco-2024-p1/q34-relay-states.png',
    E'B [1 mark]. Well answered (63.6%).',
    E'**How a relay works:**\n\n1. Current in the coil → coil becomes an **electromagnet**\n2. The electromagnet ATTRACTS the iron armature, pulling one end towards the coil\n3. The other end of the armature (the pivot rotates it) presses the CONTACTS TOGETHER\n4. Contacts touch → main (high-current) circuit completes\n\nIn the ''current ON'' diagram you need to see:\n• Armature pulled TOWARDS the coil\n• Contacts CLOSED (touching)\n\nOption B shows both — armature tilted toward coil and contacts pressed together.',
    true
  );

  -- ─── Q35 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '35', 1, 'free',
    'mcq',
    E'A 100% efficient step-down transformer lights a lamp from a **240 V** mains. The transformer has a power output of **1200 W**.\n\nWhat is the **current in the primary coil**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','0.2 A'),
      jsonb_build_object('id','b','text','0.4 A'),
      jsonb_build_object('id','c','text','2.5 A'),
      jsonb_build_object('id','d','text','5.0 A')
    ),
    to_jsonb('d'::text),
    '/past-papers/physics-nssco-2024-p1/q35-transformer-circuit.png',
    E'D — 5.0 A [1 mark]. Fairly answered (57.4%). Option A common wrong.',
    E'**100% efficient transformer**: Power IN = Power OUT.\n\nP = V × I, so:\n**Power_primary = V_primary × I_primary**\n1200 = 240 × I_primary\nI_primary = **1200 ÷ 240 = 5.0 A** ✓\n\nKey insight: the primary voltage is 240 V (the mains side) — the question gives 1200 W as the OUTPUT power, but for a 100% efficient transformer, the INPUT power is also 1200 W.\n\nDon''t confuse primary/secondary: ''step-down'' means lower voltage on the secondary — but the primary is on the MAINS (240 V) side.',
    true
  );

  -- ─── Q36 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '36', 1, 'free',
    'mcq',
    E'The diagram shows the magnetic field around **two bar magnets**. Field lines emerge from BOTH inner ends and curve outward (away from the gap between the magnets).\n\nWhich statement is correct?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','Attract — poles facing each other are both north.'),
      jsonb_build_object('id','b','text','Attract — poles facing each other are north and south.'),
      jsonb_build_object('id','c','text','Repel — poles facing each other are both north.'),
      jsonb_build_object('id','d','text','Repel — poles facing each other are north and south.')
    ),
    to_jsonb('c'::text),
    '/past-papers/physics-nssco-2024-p1/q36-magnetic-field.png',
    E'C [1 mark]. Well answered (71%).',
    E'**Reading magnetic field patterns:**\n\n• **Field lines always go OUT of a NORTH pole and IN to a SOUTH pole**.\n• When the field lines from two magnets **CURVE AWAY from each other** (don''t connect end-to-end), the poles facing each other are the **SAME polarity** → they REPEL.\n• When field lines from two magnets **CONNECT in a smooth curve** between them, the poles are OPPOSITE → they ATTRACT.\n\nHere: field lines emerge from BOTH facing ends and bend AWAY → both N → **like poles repel** → **C** ✓\n\nRule: like poles repel, unlike poles attract.',
    true
  );

  -- ─── Q37 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '37', 1, 'free',
    'mcq',
    E'What is the **effect of using a split-ring commutator**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','Ensures current is the same in all parts of a series circuit.'),
      jsonb_build_object('id','b','text','Generates an alternating electric current.'),
      jsonb_build_object('id','c','text','Produces a force on a current-carrying coil.'),
      jsonb_build_object('id','d','text','Reverses the direction of the current in the coil of a motor.')
    ),
    to_jsonb('d'::text),
    null,
    E'D [1 mark]. Poorly answered (32.8%). Evidence of guessing.',
    E'**Split-ring commutator** = a metal ring SPLIT INTO TWO halves, with brushes pressing against them.\n\nFound on **DC motors**. As the coil rotates:\n• Every half-turn, the brushes swap to the OPPOSITE half of the split ring\n• This **REVERSES the direction of current** in the coil ✓\n• The reversal keeps the force/torque on the coil always in the SAME direction → coil keeps spinning the same way\n\nWithout the commutator, the coil would rotate to a position and stop (or oscillate). The commutator''s job is to flip the current so the motor keeps turning.\n\n(A SLIP-ring — NOT split — keeps the current going the same way, used in AC generators.)',
    true
  );

  -- ─── Q38 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '38', 1, 'free',
    'mcq',
    E'A simple **DC motor** has a coil between two magnets (S on left, N on right).\n\nWhich change makes the motor **rotate FASTER**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','increasing the number of turns on the coil'),
      jsonb_build_object('id','b','text','removing the magnets'),
      jsonb_build_object('id','c','text','reversing the battery'),
      jsonb_build_object('id','d','text','reversing the polarity of the magnets')
    ),
    to_jsonb('a'::text),
    '/past-papers/physics-nssco-2024-p1/q38-dc-motor.png',
    E'A [1 mark]. Very well answered (85.6%).',
    E'**Three ways to make a DC motor spin FASTER:**\n• **Increase the current** (use a higher voltage or stronger battery)\n• Use **STRONGER magnets** (more magnetic field)\n• **Increase the number of TURNS on the coil** ✓ (each turn adds extra force)\n\nWhy A is right: force on a wire in a magnetic field = B × I × L. More turns = more ''effective wire length'' in the field → bigger force → faster rotation.\n\nWhy the others are wrong:\n• B — removing magnets → NO field → motor STOPS (not faster)\n• C — reversing battery → motor spins the OTHER way (same speed)\n• D — reversing magnets → same effect, reverses direction',
    true
  );

  -- ─── Q39 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '39', 1, 'free',
    'mcq',
    E'How many **nucleons** are in one neutral atom of the thorium isotope **²³⁴₉₀Th**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','90'),
      jsonb_build_object('id','b','text','142'),
      jsonb_build_object('id','c','text','144'),
      jsonb_build_object('id','d','text','234')
    ),
    to_jsonb('d'::text),
    null,
    E'D — 234 [1 mark]. Poorly answered (30.9%). Many wrongly computed 234 − 90 = 144 thinking nucleons = neutrons.',
    E'**Nucleons = total particles in the nucleus = protons + neutrons.**\n\nFor an atom written ᴬZX:\n• **A** (top number, MASS number) = nucleons = **protons + neutrons**\n• Z (bottom number, ATOMIC number) = protons only\n\nFor ²³⁴₉₀Th:\n• Nucleons (A) = **234** ✓\n• Protons (Z) = 90\n• Neutrons = A − Z = 234 − 90 = 144\n• Electrons = Z = 90 (neutral atom)\n\nKey trap: don''t subtract! ''144'' (option C) is the NEUTRON count, not nucleons.',
    true
  );

  -- ─── Q40 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    phys_id, 2024, '1', '40', 1, 'free',
    'mcq',
    E'Which row indicates that the particle emitted is an **alpha particle**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','strong ionising effect — deflected from positive to negative in an electric field'),
      jsonb_build_object('id','b','text','strong ionising effect — no deflection'),
      jsonb_build_object('id','c','text','weak ionising effect — deflected from positive to negative'),
      jsonb_build_object('id','d','text','weak ionising effect — no deflection')
    ),
    to_jsonb('a'::text),
    null,
    E'A [1 mark]. Fairly answered (57.8%). Some guessed between B and C.',
    E'**Alpha vs beta vs gamma:**\n\n| Property | Alpha (α) | Beta (β) | Gamma (γ) |\n|---|---|---|---|\n| Charge | +2 | −1 | 0 |\n| Mass | high (helium nucleus) | low (electron) | none (EM wave) |\n| Ionisation | **STRONG** ✓ | medium | weak |\n| Penetration | low (paper) | medium (aluminium) | high (lead) |\n| Deflection in E-field | yes, **+ → −** ✓ | yes, − → + | no |\n\nAlpha has the strongest ionising effect because of its high charge and mass. Being positively charged, it''s deflected from + to − (towards the negative plate) in an electric field.',
    true
  );

  raise notice 'Inserted 40 MCQ questions for Physics NSSCO 2024 Paper 1';
end $$;
