-- ===========================================================================
-- NSSCO Geography 2024 Paper 3 (6137/3) — Fieldwork-style paper.
-- 2 questions × 30 marks = 60 marks total, 29 sub-parts.
--
-- Q1: BEACH STUDY in Lüderitz — beach profile + pebble size investigation
-- Q2: CBD INVESTIGATION in Lüderitz — pedestrian counts + building heights
--
-- Verbatim NIED wording from past-papers/nssco-geography/2024/6137_3.pdf
-- Mark schemes from DNEA Examiners Report 2024 (Geography P3, PDF 506–521).
-- Diagrams: public/past-papers/geography-nssco-2024-p3/*.png
-- ===========================================================================

do $$
declare
  geo_id uuid;
begin
  select id into geo_id from public.subjects where slug = 'geography' limit 1;
  if geo_id is null then
    raise notice 'Geography subject not found — skipping seed';
    return;
  end if;

  -- ════════════════════════════════════════════════════════════════════════
  -- Q1 — Beach study (profile + pebble size)  [30 marks]
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q1(a)(i)  Coastal depositional landform  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(a)(i)', 1, 'free',
    'fill_in',
    E'A group of Geography learners were planning to study beach processes in Lüderitz, a coastal town. They wanted to establish the profile of the beach by measuring the angle of the beach slope. Also, they intended to investigate how the size of pebbles on the beach varied with distance from the sea.\n\n**1 (a)(i)** A beach is a depositional landform. Name **another** depositional landform that can be found on the coast.',
    jsonb_build_object(
      'accepted', jsonb_build_array(
        'spit', 'tombolo', 'dune', 'sand dune', 'bar', 'sand bar',
        'barrier island', 'lagoon', 'mudflat', 'mud flat', 'tidal flat',
        'salt marsh', 'delta'
      )
    ),
    false,
    E'**Correct answers (any one):**\n• Spit\n• Tombolo\n• Dune\n• Bars / sand bars\n• Barrier Islands\n• Lagoon / mudflat / tidal flats\n• Salt marsh\n• Delta\n[1]\n\n**Examiner commentary:** Many candidates gave erosional landforms (cliff, headland) or features that are not specifically depositional (bay, beach). Beach itself doesn''t count — the question asks for ANOTHER depositional landform.',
    E'**Depositional** landforms are formed where the sea/wind DROPS sediment (not where it erodes rock).\n\nClassic coastal depositional landforms:\n• **Spit** — narrow strip of sand/shingle extending from the land into the sea\n• **Tombolo** — sand bar joining an island to the mainland\n• **Bar / sand bar** — a ridge of sand offshore\n• **Sand dune** — wind-blown sand piled into hills\n• **Lagoon** — water trapped behind a bar\n• **Salt marsh** — vegetated mudflat\n• **Delta** — fan of sediment where a river meets the sea\n\nNOT depositional: cliff, headland, bay, cave, arch, stack (those are erosional).',
    true
  );

  -- ─── Q1(a)(ii)a  Why check weather forecast  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(a)(ii)a', 1, 'paid',
    'free_text',
    E'**(a)(ii)** Before they began their fieldwork, their teacher reminded them about safety near the sea. Explain why the teacher asked them to:\n\n**Check the weather forecast.**',
    E'**Correct answers (any one — must link to SAFETY):**\n• To determine whether it is going to rain (avoid getting caught in storms)\n• To determine whether it''s going to be low tide or high tide\n• To determine whether it''s going to be sunny or cloudy\n• To determine whether it''s going to be windy or calm\n• To wear suitable shoes/clothing/waterproof/helmets\n• To know the appropriate day to do research\n[1]\n\n**Examiner commentary:** Most could give weather reasons but some did not link to safety. Vague answers like "to know the weather" scored 0.',
    E'Award 1 mark for any answer linking weather forecast to SAFETY on the beach. PENALISE: vague "to know the weather"; "to get accurate results" (that''s science, not safety); "extreme temperature" alone.',
    E'The mark is for the **safety** link. Best answers:\n\n• "To check the **tide times** — high tide could cut us off on the beach"\n• "To check for **storms** so we don''t get caught in dangerous weather"\n• "To know what **clothing** to wear (waterproof if rainy, sun protection if hot)"\n\nDon''t just say "to know the weather" — say why the weather matters for SAFETY.',
    true
  );

  -- ─── Q1(a)(ii)b  Why take mobile phone  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(a)(ii)b', 1, 'paid',
    'free_text',
    E'**(a)(ii)** Explain why the teacher asked them to:\n\n**Take a mobile phone with them.**',
    E'**Correct answers (any one):**\n• To call emergency services if an accident occurs\n• To google emergency remedies for stings/bites from aquatic animals\n• To take pictures / record audios of their findings\n• To know the time\n• For navigation / direction\n• To check the weather (tide schedules)\n[1]\n\n**Examiner commentary:** Most gave correct reasons but few linked to safety. Wrong: "taking selfies for memories", "to get accuracy".',
    E'Award 1 mark for a safety- or fieldwork-relevant phone use. PENALISE: "selfies for memories"; "not allowed to have cellphone".',
    E'Two strong angles:\n\n1. **Safety**: "To call **emergency services** if someone gets injured or stuck on the rocks."\n2. **Recording data**: "To take **photos** of the beach profile and **timestamp** measurements."\n\nA general "to communicate" works but the examiner prefers a specific safety or data-recording reason.',
    true
  );

  -- ─── Q1(b)(i)  Equipment for beach profile  [3m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(b)(i)', 3, 'paid',
    'free_text',
    E'**(b)** When the learners arrived at the beach, they divided themselves into groups of three and went onto the beach to begin measuring the beach''s angle to establish the beach profile. Their teacher had given each group a **clinometer**, **two ranging poles** and a **tape measure**.\n\n**(b)(i)** Describe how each group used their equipment to establish the beach profile.',
    E'**Correct answers (3 marks — 1 per equipment description):**\n• **Two ranging poles** — erect one ranging pole up the beach and another where the slope changes / erect ranging poles across the beach\n• **Tape measure** — measure the distance between the two ranging poles / measure transect line\n• **Clinometer** — measure the angle from one ranging pole to the other\n\n[3 marks]\n\n**Examiner commentary:** Most could not correctly refer to the given instruments. Wrong: "measure distance across the banks", "use clinometer to measure pebble size".',
    E'Award 1 mark per equipment used CORRECTLY: (1) ranging poles placed at start/end of section; (1) tape measure for distance between poles; (1) clinometer for slope angle. PENALISE: instrument used for wrong purpose (clinometer for pebble size); generic "use equipment to measure".',
    E'**Standard beach profile method:**\n\n1. **Two ranging poles** — plant pole A at the top of the beach, plant pole B further down where the slope changes\n2. **Tape measure** — stretched between the poles to measure the horizontal distance\n3. **Clinometer** — sight from pole A to pole B (or eye-level to eye-level) to read the slope angle in degrees\n\nRepeat down the beach in segments — each segment becomes one section of the profile.\n\nOne sentence per instrument = 3 marks.',
    true
  );

  -- ─── Q1(b)(ii)  2 problems for accuracy  [2m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(b)(ii)', 2, 'paid',
    'free_text',
    E'**(b)(ii)** Describe **two** problems the group of learners may have had in ensuring their measurements were accurate.',
    E'**Correct answers (any two):**\n• Learners did not know how to use a clinometer / incorrect use / error of parallax\n• Tape measure was twisted / too short\n• Waves distracted them / tides changing / low or high tides\n• Did not measure the distance between ranging poles accurately\n• Use not consistent — carried out by different people\n• Poles not vertical / stuck in the sand at an angle\n• Bad weather conditions (strong winds, weather changes)\n• Malfunctioning instruments\n\n[2 marks — any two]\n\n**Examiner commentary:** Generic answers like "inaccurate measurement" scored 0.',
    E'Award 1 mark per specific equipment-related problem (any 2). PENALISE: generic "inaccurate"; "learners not prepared"; "no repetition".',
    E'**Specific** problems (not just "it was inaccurate"):\n\n1. **Clinometer mis-read** — parallax error, sighting line not level\n2. **Ranging poles tilted** — poles pushed into soft sand at an angle, throwing off the slope angle\n3. **Waves / tide changing** — water level rose during the survey, moving the low-tide mark\n4. **Tape sagged** — measure not pulled taut\n5. **Different people** taking readings — inconsistency between groups\n\nPick TWO. Each must point to a specific equipment or environmental issue.',
    true
  );

  -- ─── Q1(b)(iii)a  Disadvantage of sampling  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(b)(iii)a', 1, 'paid',
    'free_text',
    E'**(b)(iii)** To measure the size of beach material, the learners picked up **a pebble every metre** along their beach profile line.\n\nExplain **one disadvantage** of this method of sampling.',
    E'**Correct answers (any one):**\n• Only selecting 1 pebble every metre / sample is too small / not reliable\n• Selected pebble may be an anomaly / not representative / no variation\n• Learner selects preferred pebble (bias)\n• Time consuming\n[1]\n\n**Examiner commentary:** Many could not refer to the SAMPLING method; gave generic measurement issues.',
    E'Award 1 mark for one disadvantage specifically of the "one pebble per metre" sampling method. PENALISE: "less time consuming" (that''s an advantage); "doesn''t give accurate measurements" (vague).',
    E'The method: pick ONE pebble at each 1-m point along the line.\n\n**Disadvantages of this sampling:**\n1. **Sample too small** — one pebble per metre = only 16 pebbles total → not statistically reliable\n2. **Anomaly risk** — the one pebble chosen might be unusually large/small for that point (not representative)\n3. **Bias** — the learner might unconsciously pick "nicer-looking" pebbles\n4. **Time consuming** — walking the whole line, stopping every metre\n\nPick ONE and state it clearly.',
    true
  );

  -- ─── Q1(b)(iii)b  Improvement to sampling  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(b)(iii)b', 1, 'paid',
    'free_text',
    E'**(b)(iii)** How could this method of sampling be improved?',
    E'**Correct answers (any one):**\n• Take a larger sample at each site and average results\n• Use a quadrat and measure ALL pebbles within the frame\n• Choose pebbles at shorter distances (e.g. every 0.5 m) to increase sample size\n• Repeat the experiment at different sites or transects\n• Use a different sampling method — random sampling / cluster / stratified\n[1]\n\n**Examiner commentary:** Wrong: "use systematic sampling" (that''s what they already did); "paint the pebbles" (unrelated); "use vernier caliper" (that''s measurement, not sampling).',
    E'Award 1 mark for an improvement to the SAMPLING method (not the measurement). PENALISE: "measure the pebbles" (not sampling); "use vernier caliper" (measurement tool); "do it the next day" (timing isn''t sampling).',
    E'**Improve the sample size or eliminate bias:**\n\n1. **Use a quadrat** — at each site, lay down a 50×50 cm quadrat and measure EVERY pebble inside (≥20 pebbles per site)\n2. **Take 5 pebbles** at each site and average their sizes (vs just 1)\n3. **Shorter intervals** — sample every 0.5 m instead of 1 m → double the sample\n4. **Random sampling** — use random number tables to pick pebble positions, eliminates bias\n\nThe key word: **sample size** or **bias reduction**.',
    true
  );

  -- ─── Q1(c)(i)  Complete beach profile plot  [2m, paid, free_text drawing] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(c)(i)', 2, 'paid',
    'free_text',
    E'**(c)(i)** The results of the learners'' measurements are shown in Table 1. Fig. 1 shows the beach profile partially plotted.\n\nTable 1 row (distance from back of beach, m) → (difference in height between ranging poles, m):  3 m → 0.5 m;  8 m → 1.1 m  (these two points are missing from Fig. 1)\n\nUse the results in Table 1 to complete the profile of the beach on Fig. 1.\n\n*Sketch your completed plot on paper. In the box below, state where each missing point sits (x, y) and which existing point you would connect it to with a ruled line.*',
    '/past-papers/geography-nssco-2024-p3/q1c-beach-profile.png',
    E'**Correct answers (2 marks):**\n• Plot at 3 m → height 0.5 m (1 mark)\n• Plot at 8 m → height 1.1 m (1 mark)\n• Both connected with ruled lines to neighbouring points\n\nAlternate marking: 1 mark per correct site.\n\n[2 marks]\n\n**Examiner commentary:** Most scored at 3 m but lost marks at 8 m. Wrong plotting and connections common.',
    E'Award 2 marks: (1) point at (3, 0.5) correctly placed and connected by ruled line; (1) point at (8, 1.1) correctly placed and connected. PENALISE: free-hand line; missing point; wrong y-value.',
    E'**Two missing data points to plot:**\n\n• **(3 m, 0.5 m)** — between the existing 2 m and 4 m points\n• **(8 m, 1.1 m)** — between the existing 7 m and 9 m points\n\n**For each point:**\n1. Mark a small cross at the (x, y) location\n2. Connect with a **ruled straight line** to the neighbouring data points (no free-hand!)\n\nIn the box, describe: *"Added a cross at (3, 0.5) connected by ruled line to the 2 m and 4 m points. Added a cross at (8, 1.1) connected to the 7 m and 9 m points."*',
    true
  );

  -- ─── Q1(d)(i)  Hypothesis 1 conclusion  [3m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(d)(i)', 3, 'paid',
    'free_text',
    E'**(d)** The learners used their results to test the following hypotheses:\n**Hypothesis 1:** *The profile of the beach will be similar to the textbook example of a typical beach.*\n**Hypothesis 2:** *Pebbles become longer as distance from the back of the beach increases.*\n\nFig. 2 shows the textbook example of a beach profile.\n\n**(d)(i)** What conclusion would the learners make about **Hypothesis 1**: *The profile of the beach will be similar to the textbook example of a typical beach*? Support your answer with evidence from Fig. 1 and Fig. 2.',
    '/past-papers/geography-nssco-2024-p3/q1d-textbook-profile.png',
    E'**Correct answers (3 marks):**\n• 1 mark — decision made on hypothesis (proven / unproven / partially proven)\n• 2 marks — data / comparative statements from Fig 1 + Fig 2\n\n**Proven (similar):**\n• Both profiles have 3–4 levels\n• Both slope upwards/downwards\n• Both change gradient at each tide level\n• Each section concave on both\n• Low water mark 1.6 m matches textbook; high tide 1.0 m matches textbook\n\n**Unproven (different):**\n• Fig. 2 has flatter section above low water mark / more gradual\n• Fig. 2 flatter section above high tide\n• Fig. 1 less steep above high spring tide\n• Fig. 2 has no flat section above storm tide / no cliff at back\n• Fig. 2 flatter overall / Fig. 1 steeper\n\n**Partially proven:**\n• Both sloping but Fig. 1 flatter/steeper\n• Both concave but Fig. 2 has no flat section above storm tide\n\n[3 marks]\n\n**Examiner commentary:** Could not link decision to comparative evidence. Many used Table 1 instead of Fig. 1 and Fig. 2.',
    E'Award 3 marks: (1) explicit decision (proven/unproven/partially); (2) two or more comparative statements citing both Fig. 1 (learners'' plot) AND Fig. 2 (textbook). PENALISE: decision without evidence; evidence without decision; use of Table 1 (wrong source).',
    E'**Structure:**\n\n1. **Decision** (1 mark): "I conclude the hypothesis is **partially proven**."\n\n2. **Comparative evidence from Fig. 1 vs Fig. 2** (2 marks):\n   - *"Similar:* both profiles slope down to low water mark, both have ~4 tide levels (storm, high spring, high tide, low water)"\n   - *"Different:* the textbook (Fig. 2) has a **cliff at the back**, but the learners'' profile (Fig. 1) just **flattens out** with no cliff."\n\nUse comparative words: *both ... but / similar ... however / matches ... whereas*.\n\nQuote specific features: cliff, tide marks, slope angles, gradient changes.',
    true
  );

  -- ─── Q1(d)(ii)  Plot pebble sizes 7m and 15m  [2m, paid, free_text drawing] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(d)(ii)', 2, 'paid',
    'free_text',
    E'**(d)(ii)** Use the results in Table 1 to plot the pebble size measurements at **7 m** and **15 m** from the back of the beach on Fig. 3 (scatter graph of pebble size).\n\nTable 1 values: 7 m → 10 cm pebble;   15 m → 2 cm pebble.\n\n*Sketch the two missing points on paper. In the box below, state the (x, y) for each point you would add.*',
    '/past-papers/geography-nssco-2024-p3/q1d-pebble-scatter.png',
    E'**Correct answers (2 marks):**\n• Plot at 7 m → 10 cm (1 mark)\n• Plot at 15 m → 2 cm (1 mark)\n\n[2 marks]\n\n**Examiner commentary:** Most plotted correctly; few lost marks for incorrect plotting of 15 m.',
    E'Award 2 marks: (1) cross at (7, 10); (1) cross at (15, 2). PENALISE: wrong axis read; cross way off (>2 squares).',
    E'**Two points to plot on the pebble-size scatter graph:**\n\n• **(7 m, 10 cm)** — at x=7 on the horizontal axis, mark a cross at y=10 cm on the vertical axis\n• **(15 m, 2 cm)** — at x=15, cross at y=2 cm (low, near the bottom)\n\nKeep crosses small (≤2 mm). Don''t join with a line — this is a SCATTER graph, points are independent.\n\nIn the box, describe: *"Added a cross at (7, 10) and a cross at (15, 2)."*',
    true
  );

  -- ─── Q1(d)(iii)  Hypothesis 2 conclusion  [3m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(d)(iii)', 3, 'paid',
    'free_text',
    E'**(d)(iii)** What conclusion would the learners make about **Hypothesis 2**: *Pebbles become longer as distance from the back of the beach increases*? Support your answer with evidence from Table 1 and Fig. 3.',
    '/past-papers/geography-nssco-2024-p3/q1d-pebble-scatter.png',
    E'**Correct answers (3 marks — 1 decision + 2 data):**\n\n**Proven (becomes longer):**\n• At 1 m, pebble = 15 cm; at 2 m, pebble = 20 cm (increase)\n• At 8 m, pebble = 2 cm; at 9–10 m, pebble = 9 cm; at 11 m, pebble = 10 cm (increase)\n\n**Unproven (does NOT become longer):**\n• At 0 m, pebble = 18 cm; at 1 m, pebble = 15 cm (DECREASE)\n• At 8 m, pebble = 2 cm; but at 7 m, pebble = 10 cm (jumbled, no pattern)\n• At 11 m, pebble = 10 cm; but at 15 m, pebble = 2 cm (DECREASE)\n\n**Partially proven:**\n• Some sections increase, others decrease — pattern is fluctuating not monotonic\n\n[3 marks]\n\n**Examiner commentary:** Many repeated the hypothesis without judgement. Did not use both Table 1 + Fig. 3 data.',
    E'Award 3 marks: (1) explicit decision; (2) data citing specific (distance, size) pairs from Table 1 and Fig. 3. PENALISE: hypothesis restated without decision; no specific data values.',
    E'**Structure:**\n\n1. **Decision**: "Hypothesis 2 is **unproven** — pebbles do NOT consistently increase in size as distance from the back of the beach increases."\n\n2. **Evidence (2 marks):**\n   - "At **0 m** the pebble is **18 cm** but at **1 m** it drops to **15 cm** — already going the wrong way."\n   - "At **8 m** the pebble is only **2 cm**, while at **2 m** it was **20 cm** — the size has decreased with distance."\n   - "At **15 m** the pebble is **2 cm**, far smaller than the 18 cm at 0 m."\n\nThe data zig-zags — no clear "longer with distance" pattern. Hypothesis **unproven** (or partially).',
    true
  );

  -- ─── Q1(d)(iv)  3 reasons size varies  [3m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(d)(iv)', 3, 'paid',
    'free_text',
    E'**(d)(iv)** Describe **three** reasons why the size of beach material varies across the beach.',
    '/past-papers/geography-nssco-2024-p3/q1d-pebble-scatter.png',
    E'**Correct answers (any three):**\n• Powerful swash / strong waves take all material up the beach (larger material upper)\n• Less powerful backwash carries only smaller material down\n• Erosion more rapid close to the sea where wave action is frequent\n• Erosional processes (abrasion, attrition) — name and explain, each gets a mark\n• Rock falls from the back of the beach provide larger material at the back\n• Different sizes of wave / wave energy / types of waves\n• Coastline shape / orientation / beach profile / distance from sea\n• Longshore drift — material carried longer distance gets more eroded\n• Geology of beach — variation in rock resistance\n• Human activities — groynes, gabions, rip-raps trap material\n\n[3 marks — any three]\n\n**Examiner commentary:** Many listed erosional processes without explaining variation. Some referred to quantity instead of size.',
    E'Award 1 mark per reason for SIZE variation across the beach (any 3). PENALISE: "deposition" alone; "velocity of the river" (this is a beach); generic "different sizes".',
    E'Three classic reasons pebbles vary in size across a beach:\n\n1. **Wave strength sorts material** — strong swash carries large pebbles UP the beach; weaker backwash leaves only small ones at the bottom\n2. **Attrition near the waterline** — pebbles at the sea edge are constantly rolled and bashed together, making them smaller and rounder than those at the back\n3. **Rock falls from cliffs** — large angular boulders at the back of the beach come from cliff collapse (not from the sea), giving big material at the top\n\nOther valid reasons: beach shape, longshore drift, geology, human groynes.',
    true
  );

  -- ─── Q1(e)(i)  Labelled diagram longshore drift  [4m, paid, free_text drawing] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(e)(i)', 4, 'paid',
    'free_text',
    E'**(e)(i)** Draw a labelled diagram to describe how waves may cause **longshore drift** on a beach.\n\n*Sketch your diagram on paper. In the box below, describe each feature/label you would include.*',
    E'**Correct answers (4 marks — 2 AOB drawing + 2 AOA description):**\n\nAOB (drawing — 2 marks):\n• 1 mark — swash and backwash arrows in repetitive zigzag motion\n• 1 mark — waves approaching coastline at an angle / prevailing wind direction shown\n\nAOA (labels/description — 2 marks):\n• 1 mark — "swash" and "backwash" labelled with arrows clearly indicating each\n• 1 mark — direction of longshore drift along the beach labelled with a clear arrow\n\n[4 marks]\n\n**Examiner commentary:** Many missed arrows in the diagram, no oblique arrow for swash, no labels for prevailing wind direction or LSD direction.',
    E'Award up to 4 marks for labelled diagram features: (1) swash + backwash arrows in zigzag; (1) waves at oblique angle to shoreline; (1) labels "swash" and "backwash"; (1) direction of LSD along beach. PENALISE: pure written description without diagram references.',
    E'**Longshore drift diagram needs:**\n\n1. Draw a **straight beach line** (top of paper) with sea below\n2. Draw **2–3 waves** approaching the beach at an **OBLIQUE angle** (not straight on) — label "prevailing wind"\n3. From each wave, draw a **swash arrow** going UP the beach at an angle (label "swash")\n4. From the top of each swash, draw a **backwash arrow** going STRAIGHT down to the sea (label "backwash")\n5. The pebble traces a **zigzag path** along the beach — draw a big arrow along the shore: **"direction of longshore drift"**\n\nKey labels: **swash, backwash, prevailing wind, longshore drift**.\n\nWithout arrows, you''ll lose marks. The arrows make the diagram.',
    true
  );

  -- ─── Q1(e)(ii)  Fieldwork to determine LSD direction  [3m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '1(e)(ii)', 3, 'paid',
    'free_text',
    E'**(e)(ii)** Describe a fieldwork the group of learners could have carried out to determine the **direction** of longshore drift.',
    E'**Correct answers (3 marks — 1 method + 2 description):**\n\n*Method options:*\n\n**Tracers (marked pebbles / oranges / coloured sand):**\n• Paint pebbles / use coloured sand or biodegradable tracer\n• Place them at the water''s edge at a starting point\n• Mark starting point with ranging poles\n• Leave for hours/days\n• Return and find where they have moved → direction of LSD\n• Do test several times to get an average\n\n**Groynes:**\n• Find an area with groynes (rock/wood barriers across the beach)\n• Measure the height/amount of beach material on each side of the groynes\n• If material is higher on ONE side, longshore drift moves material in that direction\n\n**Observation:**\n• Select a stretch of beach\n• Mark a prominent natural feature with a stake\n• Observe over time, note any changes\n\nMark allocation:\n• 1 mark — selecting method\n• 2 marks — description of the method (steps)\n\n[3 marks]\n\n**Examiner commentary:** Most described the PROCESS of LSD instead of how to determine its DIRECTION. Wrong: "use compass", "use internet", "wind vane".',
    E'Award 3 marks: (1) explicit method (tracers / groynes / observation); (2) description of how the method reveals DIRECTION of LSD. PENALISE: describing LSD process itself; "use compass" or "internet" (don''t show direction empirically); single-step methods.',
    E'**Best methods — choose one and describe steps:**\n\n**Option A: Painted pebbles (tracer)**\n1. Paint 50 pebbles bright orange\n2. Place them in a heap at the water''s edge, mark the spot with ranging poles\n3. Wait 24 hours / one tide cycle\n4. Return — find where the pebbles are now\n5. Measure the distance and direction they moved → that''s the LSD direction\n6. Repeat several times for an average\n\n**Option B: Groynes**\n1. Find a beach with groynes\n2. Measure beach height on the north vs south side of each groyne\n3. Material piles up on the UPDRIFT side → opposite direction = LSD direction\n\nGive 3+ clear steps that reveal **direction**, not just process.',
    true
  );

  -- ════════════════════════════════════════════════════════════════════════
  -- Q2 — CBD investigation in Lüderitz  [30 marks]
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q2(a)(i)  2 characteristics of CBD  [2m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(a)(i)', 2, 'paid',
    'free_text',
    E'Another class of Geography learners in Lüderitz wanted to do an investigation of the Central Business District (CBD) of their town. They decided on:\n**Hypothesis 1:** *Pedestrian flow decreases away from the centre of the CBD.*\n**Hypothesis 2:** *The tallest buildings are located in the CBD.*\n\n**2 (a)(i)** Apart from the high number of pedestrians and multi-storey buildings, describe **two** other characteristics expected of a town''s CBD.',
    E'**Correct answers (any two):**\n• Multiple lanes of traffic\n• High traffic volume / congestion\n• Overcrowded\n• Different functions / mix of high and low order functions / most services\n• Central point / accessibility / convergence of transport networks\n• Highest concentration of businesses (banks, offices, retail)\n• Oldest / historical buildings\n• Shopping malls / retail stores\n• Few residential areas\n• Highest land values / expensive rental\n• Limited parking / large parking garages\n• Deserted at night\n• High sphere of influence\n\n[2 marks — any two]\n\n**Examiner commentary:** Some learners gave just nouns without descriptive terms.',
    E'Award 1 mark per CBD characteristic (any 2). Must be a distinct feature, not a repeat of "tall buildings" or "many people". PENALISE: "infrastructure" (vague); "highway" (not a CBD feature); brand names.',
    E'A CBD has lots of features beyond just tall buildings and crowds. Two strong picks:\n\n1. **High concentration of businesses** — banks, offices, retail, financial institutions clustered together\n2. **Highest land values** — most expensive rent per square metre in the city\n\nOther valid: historical buildings, shopping malls, traffic congestion, accessibility (where roads converge), few residential homes, deserted at night when offices close.\n\nDon''t restate "many people" or "tall buildings" — those are excluded by the question.',
    true
  );

  -- ─── Q2(a)(ii)  2 reasons for building height variation  [2m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(a)(ii)', 2, 'paid',
    'free_text',
    E'**(a)(ii)** Explain **two** reasons for the variations of building heights found around a town.',
    E'**Correct answers (any two):**\n• Limited area to build on / less space means buildings must go up\n• Maximise use of land / planning laws restrict height in some places\n• Municipal rules / zoning regulations / poor planning\n• Preserve old buildings (heritage)\n• Architectural design choices\n• High land values make tall buildings cost-effective\n• Unsuitable ground for tall foundations (soft soil, water table)\n• Demand for land varies across the town\n• Different land uses / functions need different heights (office vs warehouse)\n• Availability and size of land plots\n\n[2 marks — any two]\n\n**Examiner commentary:** Many gave reasons based on size, not height. Some stated characteristics instead of REASONS.',
    E'Award 1 mark per reason for height variation (any 2). PENALISE: "because it''s a CBD" (circular); "traffic congestion" (not a reason for height); restating characteristics.',
    E'Two strong reasons heights vary:\n\n1. **Land value** — in the CBD, land is expensive, so building UP (more storeys per plot) is more profitable. In suburbs, land is cheap, so buildings stay low and spread out.\n\n2. **Planning regulations** — municipal zoning rules cap height in residential or heritage zones, but allow skyscrapers in the CBD.\n\nOther valid: foundation quality (some ground can''t support skyscrapers), heritage preservation, function (warehouses need low ceilings, offices stack high).\n\nEach reason should explain WHY one building is taller than another.',
    true
  );

  -- ─── Q2(b)(i)  3 safety considerations for pedestrian count  [3m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(b)(i)', 3, 'paid',
    'free_text',
    E'**(b)** The learners decided to do their pedestrian counts at 100 m, 200 m and 300 m distances from the town''s central point, for 10 minutes at 5 different times during the day.\n\n**(b)(i)** State **three** safety considerations learners should consider when conducting a pedestrian count.',
    E'**Correct answers (any three):**\n• Wear high-visibility clothing / reflectors / hat / sunscreen / protective gear\n• Obey traffic signals / be aware of surroundings\n• Use designated walkways / sidewalks / pathways\n• Avoid distractions\n• Don''t talk to strangers / observe from a safe spot / work in pairs or groups\n• Be aware of nearby emergency services\n• Plan during daylight hours\n• Coordinate with local authorities\n• Collect emergency contact info for each learner\n• Don''t obstruct sidewalks\n• Consider weather conditions\n• Cellphones for communication\n\n[3 marks — any three]\n\n**Examiner commentary:** Well answered overall.',
    E'Award 1 mark per safety consideration (any 3). Must specifically address SAFETY of the learners, not data accuracy. PENALISE: "do not count pedestrians" (defeats the point); "recording sheet" (a tool, not safety); "introduce yourself to pedestrians" (not safety).',
    E'Three classic safety considerations:\n\n1. **Work in pairs or groups** — never alone in an unfamiliar area\n2. **High-visibility clothing / hat / sunscreen** — visible to drivers, protected from sun\n3. **Stay on sidewalks** — don''t step into the road to count\n\nOther valid: cellphones for emergencies, daylight hours only, avoid distractions, coordinate with police/local authorities.\n\nFocus on **learner safety**, not data quality.',
    true
  );

  -- ─── Q2(b)(ii)  2 reasons for sampling method  [2m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(b)(ii)', 2, 'paid',
    'free_text',
    E'**(b)(ii)** Suggest **two** reasons why learners used this method (10-minute counts at 3 distances, at 5 different times of day) for doing the pedestrian count.',
    E'**Correct answers (any two):**\n• To see if there is a variation in pedestrians during the day\n• To increase learner''s safety / safety\n• More appropriate on a busy day\n• Reduces human bias\n• Easy to use\n• To include factors that affect specific times (going to work, lunch time)\n• To get a wider variety of results / average / accurate results\n• To get a representative sample / cover a larger area\n• Longer duration of counting unreliable — quicker, faster, less time consuming, fewer mistakes\n\n[2 marks — any two]\n\n**Examiner commentary:** Some confused pedestrians with traffic counts or passengers.',
    E'Award 1 mark per reason for THIS specific method (any 2). PENALISE: "to know where pedestrians come from" (not the goal); "to know number of cars" (different study); generic "useful" or "suitable".',
    E'**Why 10 minutes at 5 different times across 3 distances?**\n\n1. **Captures variation over the day** — morning rush, lunch, evening peak, off-peak all sampled. One snapshot would miss patterns.\n\n2. **Manageable & accurate** — 10 minutes is short enough to count accurately without getting tired and miscounting. Longer counts → more mistakes.\n\nOther valid: representative across CBD, repetitive measures → reliable averages, safer (short stints).',
    true
  );

  -- ─── Q2(c)(i)  Complete recording sheet tally  [2m, paid, free_text drawing] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(c)(i)', 2, 'paid',
    'free_text',
    E'**(c)** Table 2 shows results for Independence Street. For 200 m from central point at 08:00–08:10, the count was **17 pedestrians**.\n\n**(c)(i)** Use Table 2 to complete the recording sheet by inserting the correct **tally marks** and **tally total** in Fig. 4.\n\n*Describe in the box: (1) the tally marks you would draw to represent 17; (2) the tally total number.*',
    '/past-papers/geography-nssco-2024-p3/q2c-recording-sheet.png',
    E'**Correct answers (2 marks):**\n• 1 mark — correct tally marks: three full groups of 5 (||||̸ ||||̸ ||||̸) plus two strokes (||) = 17\n• 1 mark — correct tally total written as "17" in the total space\n\n[2 marks]\n\n**Examiner commentary:** Learners switched tally with total; tallied the total for ALL distances (194); tallied outside the space provided.',
    E'Award 2 marks: (1) tally drawn correctly (3 fives + 2 = 17, with fives shown as four strokes crossed by a diagonal); (1) total "17" in the total cell. PENALISE: tally drawn as 11 or 51 (wrong number); total in tally space.',
    E'**Tally for 17:**\n\n- 4 vertical strokes + 1 diagonal slash through them = ||||̸ (one group of 5)\n- Repeat: three full groups of 5 = ||||̸ ||||̸ ||||̸ (15)\n- Plus 2 more single strokes: ||\n- **Total in tally form: ||||̸ ||||̸ ||||̸ ||  = 17**\n\n**Tally total:** write **"17"** in the Total box.\n\nIn the answer box, describe: *"Drew 3 groups of crossed-five tally marks then 2 single strokes (17 total) in the Tally space, and wrote 17 in the Tally Total space."*',
    true
  );

  -- ─── Q2(c)(ii)  Total pedestrians Independence Street  [1m, free, numeric] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, tolerance,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(c)(ii)', 1, 'free',
    'numeric',
    E'**(c)(ii)** Calculate the total number of pedestrians surveyed by the learners on Independence Street.\n\n*Table 2 totals: 100 m → 111;  200 m → 51;  300 m → 32.*',
    '194',
    0,
    E'**Correct answer:** 111 + 51 + 32 = **194**; [1]\n\n**Examiner commentary:** Most learners calculated correctly. Wrong: 111 (forgot to add), 190/3 (wrong operation), 17 (used just one cell).',
    E'**Sum all three totals:**\n\n111 + 51 + 32 = **194 pedestrians**\n\nThe three totals come from the right-most column of Table 2 (one total per distance — 100 m, 200 m, 300 m). Add them.',
    true
  );

  -- ─── Q2(d)(i)  Draw isoline 100  [2m, paid, free_text drawing] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(d)(i)', 2, 'paid',
    'free_text',
    E'**(d)** Fig. 5 shows the results of the pedestrian count with some 50-isolines drawn.\n\n**(d)(i)** On Fig. 5, draw the **isoline to show 100 pedestrians**.\n\n*Describe in the box: where the 100-isoline would pass through, which survey points it would pass between, and that it forms a closed loop around the central point.*',
    '/past-papers/geography-nssco-2024-p3/q2d-pedestrian-map.png',
    E'**Correct answers (2 marks):**\n• 2 marks for correctly plotted closed isoline at value 100\n• Should pass BETWEEN survey points with values >100 (inside) and <100 (outside)\n• Pass between 93 and 111, between 127 and 81, etc. (interpolated)\n\n[2 marks]\n\n**Examiner commentary:** Most could not complete isoline correctly. Connecting lines THROUGH points (111, 101, 93 on same line) was wrong. Some included 93 and 81 inside (wrong side).',
    E'Award 2 marks for a closed isoline around the central point that passes between values >100 (inside) and <100 (outside). PENALISE: line drawn THROUGH data points; values on wrong side; isoline not closed.',
    E'**Key rule:** an isoline passes **BETWEEN** points (interpolated), not THROUGH them.\n\n**To draw the 100-isoline:**\n\n1. Look at each survey point. Mark those >100 (inside zone) and <100 (outside zone)\n2. The 100-line passes BETWEEN >100 and <100 points\n3. It forms a **closed loop** around the central point (172 is at the centre, so the line surrounds it)\n4. Use the existing 50-isoline as a template — the 100 line will be INSIDE the 50 line (closer to centre)\n\nIn the box, describe: *"Drew a closed loop around the central point passing between points with values just above and just below 100 (e.g. between 93 and 101, between 127 and 81)."*',
    true
  );

  -- ─── Q2(d)(ii)  Shade >150 area  [1m, paid, free_text drawing] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(d)(ii)', 1, 'paid',
    'free_text',
    E'**(d)(ii)** On Fig. 5, **shade** the area where the number of pedestrians recorded is **over 150 pedestrians**.\n\n*Describe in the box: which region of the map you would shade.*',
    '/past-papers/geography-nssco-2024-p3/q2d-pedestrian-map.png',
    E'**Correct answers (1 mark):**\n• 1 mark — shading area with more than 150 pedestrians; needs full shading across the area (not line shading)\n• The area surrounds the central point (172) extending to include the 150 isoline limit\n\n[1 mark]\n\n**Examiner commentary:** Most shaded correctly. Some shaded the whole 50-isoline area (way too big).',
    E'Award 1 mark for correctly identifying and FULLY shading the >150 area (the central enclosed zone around the 172-survey-point). PENALISE: shading the whole map; line-shading without filling.',
    E'**Locate the >150 zone:**\n• Central point survey value: 172\n• Nearby values >150: 172 (centre), 150 (just inside)\n• The area enclosed by the 150-isoline is the >150 zone\n\n**Shade it solidly** (not just lines) — this is the highest-density pedestrian area, centred on the CBD heart.\n\nIn the box: *"Shaded the small enclosed area at the central point (around the 172 value) inside the 150-isoline — the area with >150 pedestrians."*',
    true
  );

  -- ─── Q2(d)(iii)  Describe pedestrian distribution  [3m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(d)(iii)', 3, 'paid',
    'free_text',
    E'**(d)(iii)** Describe the **distribution of pedestrians** shown in Fig. 5 for the town. Support your answer with evidence from Table 2 and Fig. 5.',
    '/past-papers/geography-nssco-2024-p3/q2d-pedestrian-map.png',
    E'**Correct answers (3 marks — 2 description + 1 data):**\n• Most pedestrians are around the CBD — 140–175 pedestrians (central area)\n• Highest pedestrian flow at the centre — 172 pedestrians\n• Further from CBD → fewer pedestrians (from 172 at centre to 19 at furthest point)\n• Flows reduce as you move away — 52 / 39 / 19 / 32 at edges\n• Western/Northern edges have higher flows than Eastern/Southern (52 to 32 / 39 to 19)\n• Most rapid decrease to the east (172 → 81)\n• Kalipi Street has fewer pedestrians (~127 total); Lüderitz Street has more (~289)\n\nMark allocation:\n• 2 marks: description of distribution (pattern)\n• 1 mark: data values cited\n\n[3 marks]\n\n**Examiner commentary:** Description without evidence (or vice versa) lost marks. Some lifted data without describing pattern.',
    E'Award 3 marks: (2) descriptive statements about pattern (concentric, decreasing from centre, asymmetric); (1) at least one specific data value. PENALISE: pure data lifting without pattern; pattern without data.',
    E'**Three things to say:**\n\n1. **Concentric pattern** — pedestrians concentrate around the central point (CBD)\n2. **Decrease outward** — values drop with distance from centre (172 at centre → 19 at edge)\n3. **Asymmetric** — west/north have higher flows than east/south (52 vs 19; 39 vs 32)\n\n**Include data:** "From 172 at the centre to 19 at the far east edge, dropping rapidly along Kalipi Street."\n\nDescription + data + pattern terms = 3 marks.',
    true
  );

  -- ─── Q2(d)(iv)  Hypothesis 1 conclusion (pedestrian flow)  [3m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(d)(iv)', 3, 'paid',
    'free_text',
    E'**(d)(iv)** What conclusion would the learners make to **Hypothesis 1**: *Pedestrian flow decreases away from the centre of the CBD*? Support your answer with evidence from **Table 2 only**.',
    '/past-papers/geography-nssco-2024-p3/q2d-pedestrian-map.png',
    E'**Correct answers (3 marks — 1 decision + 2 data):**\n\n**Hypothesis proven / correct / true / accepted**\n\nEvidence from Table 2 ONLY:\n• At 100 m from central point — 111 pedestrians (total)\n• At 200 m — 51 pedestrians (total)\n• At 300 m — 32 pedestrians (total)\n\nClear decreasing pattern as distance from centre increases.\n\nMark allocation:\n• 1 mark — decision made on hypothesis\n• 2 marks — data that supports decision\n\nNB: Use only Table 2 (not Fig. 5).\n\n[3 marks]\n\n**Examiner commentary:** Most scored 2 marks but lost marks for using Fig. 5 instead of Table 2.',
    E'Award 3 marks: (1) explicit decision (proven); (2) data citing the three Table 2 totals (111, 51, 32) in order with distances. PENALISE: using Fig. 5 data; no specific distance/total pairs; no decision.',
    E'**Use Table 2 totals ONLY.**\n\n1. **Decision**: "Hypothesis 1 is **proven** — the data shows a clear decrease."\n\n2. **Evidence from Table 2:**\n   - At **100 m** from the central point: **111** pedestrians (total of all 5 times)\n   - At **200 m**: **51** pedestrians (less than half of 100 m)\n   - At **300 m**: **32** pedestrians (lowest)\n\n3. "The total drops from **111 → 51 → 32** as distance from the CBD increases, confirming the hypothesis."\n\nDon''t reference Fig. 5 — the question says Table 2 only.',
    true
  );

  -- ─── Q2(e)(i)  Average number of storeys site one  [1m, free, numeric] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, tolerance,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(e)(i)', 1, 'free',
    'numeric',
    E'**(e)** Table 3 shows the number of storeys at 10 buildings at site one: **3, 3, 5, 2, 3, 4, 2, 4, 3, 3**.\n\n**(e)(i)** Using Table 3, calculate the **average** number of storeys at this site. Round off your answer to a whole number.',
    '3',
    0,
    E'**Correct answer:** Sum = 3+3+5+2+3+4+2+4+3+3 = 32; Average = 32/10 = 3.2; **rounded to 3** (whole number); [1]\n\n**Examiner commentary:** Most could calculate but some lost marks by not rounding to whole number. Wrong: 3.2, 32.',
    E'**Average (mean) = sum ÷ count**\n\n• Sum: 3+3+5+2+3+4+2+4+3+3 = **32**\n• Count: **10** buildings\n• Average: 32 ÷ 10 = **3.2**\n• **Rounded to whole number: 3**\n\nThe question says "round off to a whole number" — so the final answer is **3**, not 3.2.',
    true
  );

  -- ─── Q2(e)(ii)  Problem of using storeys to estimate height  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(e)(ii)', 1, 'paid',
    'free_text',
    E'**(e)(ii)** Suggest **one** possible problem of using the **number of storeys** to estimate the height of a building.',
    E'**Correct answers (any one):**\n• Storey heights vary between buildings (a shopping mall storey ≠ apartment storey)\n• Inaccurate as not measured in a unit / height is normally in metres not storeys\n• Some storeys obscured by other buildings or trees\n• Some buildings have windows that don''t correspond to storeys / no windows to count\n• Very tall buildings are hard to count from street level\n• One building may have parts with different number of storeys\n• Storeys below ground level (basements) not visible\n• Shape / architectural design\n\n[1 mark]\n\n**Examiner commentary:** Wrong: "the building can fall down", "buildings are on higher elevation".',
    E'Award 1 mark for one specific problem with using storey counts. PENALISE: irrelevant problems (building collapse); "it''s hard" (vague); "time consuming" (true of any method).',
    E'**The core problem: storey height isn''t standardised.**\n\nA strong answer:\n\n*"Storey heights vary across building types. A modern office storey is about 3.5 m, while an apartment storey is about 2.7 m. Counting storeys gives no consistent measure of actual height in metres — a 5-storey office and a 5-storey apartment can differ by 4 m or more."*\n\nOther valid: very tall buildings hard to count from street level; trees obscure view; underground basements invisible.',
    true
  );

  -- ─── Q2(e)(iii)  Another method to determine building height  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(e)(iii)', 1, 'paid',
    'free_text',
    E'**(e)(iii)** Describe **another method** for determining the height of a building, apart from counting the number of storeys.',
    E'**Correct answers (any one):**\n• Use a clinometer with the tangent formula for the angle (trigonometry)\n• Surveying and trigonometry / geometry\n• Google Earth or online mapping tools / GIS\n• Photogrammetry — take a picture and calculate using known reference\n• Consult municipality / building owner / secondary data\n• Ask / interview the owner or builder\n• Use of drones\n• Using the shadow length of the building (with sun angle)\n\n[1 mark]\n\n**Examiner commentary:** Wrong: "observation", "estimation", "counting windows", "compare with other buildings", "throw a stone and use a stopwatch".',
    E'Award 1 mark for one valid alternative measurement method. PENALISE: "observation" / "estimation" (not a method); "counting windows" (same problem as storeys); silly answers (drop stone & time).',
    E'**Strong alternative methods:**\n\n1. **Clinometer + trigonometry** — measure distance from building (d) and angle to the top (θ); height = d × tan(θ). Real geographer''s method.\n\n2. **Google Earth / GIS** — many buildings have measured heights in mapping databases.\n\n3. **Shadow length** — measure shadow on a sunny day at a known sun angle, calculate height via trig.\n\n4. **Ask the municipality / building owner** — they have official construction records.\n\nPick ONE and name it clearly.',
    true
  );

  -- ─── Q2(e)(iv)  Hypothesis 2 conclusion (tallest in CBD)  [3m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(e)(iv)', 3, 'paid',
    'free_text',
    E'**(e)(iv)** Fig. 6 shows the average number of storeys at each road junction around the central point, with the 150-pedestrian isoline marking the edge of the CBD.\n\nWhat conclusion would the learners make to **Hypothesis 2**: *The tallest buildings are located in the CBD*? Support your answer with evidence from Fig. 6.',
    '/past-papers/geography-nssco-2024-p3/q2e-cbd-storeys.png',
    E'**Correct answers (3 marks — 1 decision + 2 data):**\n\n**Hypothesis unproven (or partially proven):**\n• Tallest buildings are outside / west of CBD / near motorway / near market\n• Tallest buildings in CBD are 4 storeys; tallest outside CBD are 5/6 storeys\n\n**Hypothesis proven:**\n• There are 4-storey buildings in the CBD\n• Further east and northeast, building heights decrease to 1 storey\n\n**Partially proven:**\n• Tall buildings (4 storeys) in CBD, but tall buildings (5/6 storeys) also outside CBD\n\nEvidence to use: market, storey numbers, direction, edge of CBD (150 isoline), Hage Geingob Street.\n\nMark allocation:\n• 1 mark — decision\n• 2 marks — data supporting decision\n\n[3 marks]\n\n**Examiner commentary:** Most failed to make a correct judgement or provide data from Fig. 6. Many repeated the hypothesis.',
    E'Award 3 marks: (1) explicit decision (proven / unproven / partially); (2) at least 2 data items from Fig. 6 — storey counts at specific locations + direction. PENALISE: hypothesis restated; "CBD always has high buildings" (no data); no location reference.',
    E'**Look at Fig. 6 carefully:** the 150 isoline marks the CBD edge. Inside it, buildings are mostly 3-4 storeys. Outside (especially west toward the market area), there are 5-6 storey buildings — taller than anything in the CBD itself.\n\n**Structure:**\n\n1. **Decision**: "Hypothesis 2 is **unproven / partially proven** — the tallest buildings are NOT in the CBD."\n\n2. **Evidence from Fig. 6:**\n   - "Inside the 150 isoline (CBD), the maximum height is **4 storeys**."\n   - "**West of the CBD**, near the market on Hage Geingob Street, buildings reach **5-6 storeys** — taller than any in the CBD."\n   - "**East** of the CBD, heights drop to 1-2 storeys."\n\n3. "The tallest are OUTSIDE the CBD, so the hypothesis is rejected."',
    true
  );

  -- ─── Q2(f)  Method to find urban function variation  [3m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '3', '2(f)', 3, 'paid',
    'free_text',
    E'**(f)** One group of learners wanted to find out more about how **urban function** varied across the town.\n\nDescribe a method they could use to do this.',
    E'**Correct answers (3 marks):**\n• 1 mark — mention where the survey will take place (walk along a transect / selected street / identify the street)\n• 1 mark — mention how land use will be determined (observe buildings / questionnaires / interview / secondary data from municipality)\n• 1 mark — mention how information will be recorded (mark type of land use using a key / record on a recording sheet)\n\nMethod should describe how information about land use will be collected.\n\n[3 marks]\n\n**Examiner commentary:** Most scored only 1 mark for identifying the method but could not describe it correctly.',
    E'Award 3 marks for a complete method: (1) location/transect selection; (1) data collection mechanism (observe, interview, secondary data); (1) recording method (sheet, key, coding). PENALISE: single-step methods; "use a tally" alone; "walking around" without specifics.',
    E'**A complete urban-function fieldwork method needs 3 elements:**\n\n**1. Where will you survey?**\n*"Walk along a transect line through the town — e.g. Independence Street from the CBD to the residential edge."*\n\n**2. How will you identify each building''s function?**\n*"For each building, observe and record its main use — shop, office, residence, school, etc. Where unclear, ask the occupier or check municipal records."*\n\n**3. How will you record the data?**\n*"Use a recording sheet with a colour key (red = retail, blue = office, green = residential). Mark each plot on a base map of the street using the key."*\n\nThree clear steps = 3 marks.',
    true
  );

end$$;
