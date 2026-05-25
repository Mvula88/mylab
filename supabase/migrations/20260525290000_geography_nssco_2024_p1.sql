-- ===========================================================================
-- NSSCO Geography 2024 Paper 1 (6137/1) — 6 essay questions (one per section
-- of A/B/C; learner answers 3), 42 sub-parts, 75 marks.
-- Verbatim NIED wording from past-papers/nssco-geography/2024/6137_1.pdf
-- Expected answers + commentary from DNEA Examiners Report 2024 (Geography
-- section, PDF pages 467–488).
-- Diagrams: public/past-papers/geography-nssco-2024-p1/*.png
--
-- Section A — PHYSICAL GEOGRAPHY (Q1 weathering, Q2 wind/desert)
-- Section B — ECONOMIC ACTIVITIES (Q3 fishing, Q4 wildlife)
-- Section C — POPULATION & SETTLEMENT (Q5 urbanisation, Q6 HIV/AIDS)
--
-- Per question: (a)(i) define [1m, free, fill_in]
--               (a)(ii) distinguish/describe [3m, paid, free_text]
--               (a)(iii) describe why [4m, paid, free_text]
--               (a)(iv) describe and explain [5m, paid, free_text]
--               (b)(i)  source-based — figure/photo [3m, paid, free_text]
--               (b)(ii) source-based OR labelled diagram only [4m, paid, free_text/drawing]
--               (c)     "How far do you agree" essay [5m, paid, free_text]
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
  -- SECTION A: PHYSICAL GEOGRAPHY
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q1(a)(i)  Define hydrolysis  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, case_sensitive, memo, explanation, is_published
  ) values (
    geo_id, 2024, '1', '1(a)(i)', 1, 'free',
    'fill_in',
    E'**SECTION A: PHYSICAL GEOGRAPHY**\n\nAnswer **one** question from Section A.\n\n**1 (a)(i)** Define the term *hydrolysis*.',
    jsonb_build_object(
      'must_contain', jsonb_build_array('water')
    ),
    false,
    E'**Correct answer:** A chemical reaction between rock minerals and water in which minerals are broken down/altered by water; minerals react with hydrogen ions in water; [1]\n\n**Examiner commentary:** Confused with hydration. Many wrote "the breaking down of rocks by water" without mentioning chemical reaction.',
    E'**Hydrolysis** is a *chemical* weathering process — water reacts with rock minerals (especially feldspar in granite) and breaks them down chemically into new minerals (e.g. clay). It''s NOT hydration (water absorbed by rock) and NOT physical breakdown by water pressure.',
    true
  );

  -- ─── Q1(a)(ii)  Distinguish weathering & erosion  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '1(a)(ii)', 3, 'paid',
    'free_text',
    E'**1 (a)(ii)** Distinguish between *weathering* and *erosion*.',
    E'**Correct answers:**\n• Weathering is the breakdown of rocks **in situ**/in place (1)\n• Erosion is the breakdown of rocks **and the transport/removal** of the broken material (1)\n• Comparison/distinction using *while/whereas/but/however* (1)\n\nMAX 2 marks if not comparatively distinguished.\n\n**Examiner commentary:** Most learners gave weathering definition correctly but failed to use comparative terms. Some confused erosion with deposition.',
    E'Award up to 3 marks: (1) weathering = breakdown in situ; (1) erosion = breakdown AND transport; (1) comparative word linking the two ("while/whereas/but"). MAX 2 marks if no comparison made. Penalise: confusing erosion with deposition; defining only one term.',
    E'The key word the examiner wants is **transport**. Weathering happens where the rock sits — nothing moves. Erosion includes transport away from the source. Use a comparative word like *whereas*: "Weathering is the breakdown of rock in place, **whereas** erosion involves both breakdown AND transport of the material."',
    true
  );

  -- ─── Q1(a)(iii)  Why chemical weathering rapid in tropical rainforests  [4 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '1(a)(iii)', 4, 'paid',
    'free_text',
    E'**1 (a)(iii)** Describe why chemical weathering is rapid in tropical rainforests.',
    E'**Correct answers (any four):**\n• High rainfall throughout the year — provides water for chemical reactions\n• High (warm) temperatures — increase the rate of chemical reactions\n• High humidity/moisture — allows chemical solutions to form\n• Dense vegetation provides CO₂ for carbonation; decaying plants produce organic acids\n• Thin/permeable soils allow water to penetrate to rock\n\n[4 marks — any four]\n\n**Examiner commentary:** Candidates wrote about physical weathering (freeze-thaw, exfoliation) instead of chemical processes.',
    E'Award 1 mark per relevant factor (any 4). Must link the factor to chemical weathering rate — e.g. "high temperature speeds chemical reactions" not just "it is hot". Penalise physical-weathering answers (no marks for freeze-thaw, exfoliation, mechanical breakdown).',
    E'Four classic factors examiners want — **water, heat, humidity, vegetation**:\n\n1. **Heavy rainfall all year** → constant water for hydrolysis & solution\n2. **High temperatures (~25 °C)** → chemical reactions ~2× faster for every 10 °C rise\n3. **High humidity** → moisture stays on rock surface allowing reactions\n4. **Dense vegetation** → decomposing plants release CO₂ + organic acids → stronger carbonation\n\nDon''t write about cracks or freeze-thaw — that''s physical weathering.',
    true
  );

  -- ─── Q1(a)(iv)  How plants facilitate breakdown of rocks  [5 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '1(a)(iv)', 5, 'paid',
    'free_text',
    E'**1 (a)(iv)** Describe and explain how plants facilitate the break down of rocks.',
    E'**Correct answers (any five):**\n• Plant roots penetrate cracks in the rock\n• Roots grow thicker over time / wedge the crack open\n• Pressure from growing roots widens the crack until rock fractures (= biological weathering)\n• Decaying plant matter releases organic acids (humic acid)\n• Acids react with rock minerals (chemical weathering) → minerals dissolved\n• Lichens & mosses growing on bare rock secrete acids that weather the surface\n• Burrowing by roots exposes more rock surface area to chemical attack\n\n[5 marks — any five with description + explanation]\n\n**Examiner commentary:** Most learners only mentioned roots growing into cracks without explaining the pressure that widens them. Few mentioned acid release from decaying matter.',
    E'Award up to 5 marks across two mechanisms: (a) MECHANICAL — root penetration + thickening + pressure causing widening + fracture [up to 3]; (b) CHEMICAL — organic acids from decay/lichens reacting with minerals [up to 3]. Description alone = max 3 marks; full mark needs description + explanation. Penalise generic "roots break rocks" with no mechanism.',
    E'Two routes plants attack rock — both should appear in a 5-mark answer:\n\n**Mechanical (biological wedging):**\n1. Seeds land in tiny cracks; roots grow in\n2. Roots **thicken** over years and push outward\n3. **Pressure** widens crack until rock fractures\n\n**Chemical (acids):**\n4. Dead leaves & roots **decay** in soil → release **organic/humic acids**\n5. Acids react with minerals (e.g. carbonates dissolve) → rock weakens\n6. **Lichens & mosses** on bare rock surfaces secrete acids that pit the surface\n\nWrite each as a sentence: *what happens* + *why it weathers rock*.',
    true
  );

  -- ─── Q1(b)(i)  Fig 1 freeze-thaw factors  [3 marks, paid, free_text] +diagram ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '1(b)(i)', 3, 'paid',
    'free_text',
    E'**(b)** Study **Fig. 1**, which shows freeze-thaw weathering.\n\n**(b)(i)** Using evidence from **Fig. 1 only**, identify and describe factors that cause freeze-thaw weathering to take place in this location.',
    '/past-papers/geography-nssco-2024-p1/q1b-freeze-thaw.png',
    E'**Correct answers (any three — must be from photograph):**\n• Snow/ice visible on mountains → temperature drops below 0 °C → water in cracks freezes\n• Bare exposed rock with no vegetation cover → no insulation, rock cools and warms rapidly\n• Pre-existing cracks/joints in the rock visible → water can enter and freeze\n• Scree/debris at the base → evidence weathering has occurred\n• High altitude mountain environment → cold temperatures + temperature fluctuation around 0 °C\n\n[3 marks — any three from Fig. 1 with description]\n\n**Examiner commentary:** Candidates wrote about freeze-thaw generally without using evidence from the photograph.',
    E'Award 1 mark per factor identified AND described, but ONLY if the factor is visible/inferable in Fig. 1. Penalise: general theory not linked to photograph; factors not visible (e.g. "high rainfall"); single-word answers without description.',
    E'The instruction says **"using evidence from Fig. 1 only"** — so every factor you give must be visible in the photo. Don''t write theory.\n\nLook at the photo: snow on peaks, bare rock, visible cracks, broken pieces lying around. For each, name what you SEE and link it to freeze-thaw:\n\n• "**Snow visible on the mountain peaks** shows temperatures drop below freezing — water in cracks turns to ice."\n• "**Cracks visible in the rock surface** show pathways where water can enter and then freeze."\n• "**Loose broken pieces around the rock** show freeze-thaw has already broken pieces off."',
    true
  );

  -- ─── Q1(b)(ii)  Diagram only — exfoliation  [4 marks, paid, drawing] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '1(b)(ii)', 4, 'paid',
    'free_text',
    E'**(b)(ii)** Using a fully labelled diagram only, describe the process of exfoliation.\n\n*(Sketch your diagram on paper. In the box below, describe each label you would include and what your diagram shows — the AI will mark your description against the diagram requirements.)*',
    E'**Correct answers (4 marks for a fully labelled diagram):**\n• 1 mark — expansion described during the day (rock surface heats and expands)\n• 1 mark — contraction described during the night (rock surface cools and contracts)\n• 1 mark — talus/scree/regolith at base of dome OR cracks/peeling layers shown\n• 1 mark — diagram is clearly related to exfoliation (e.g. dome-shaped rock with curved peeling layers)\n\n**0 marks for written explanation alone — must be a labelled diagram.**\n\nNB: Granite and regolith labels in the diagram are not necessary to trigger the marks.\n\n**Examiner commentary:** Many candidates wrote explanations only and lost the diagram mark. Diagrams must show curved/onion-skin layers peeling from a dome.',
    E'For each label/feature described, award 1 mark up to 4: (1) daytime expansion of outer rock layer; (1) nighttime contraction; (1) talus/scree/peeled layers at base or cracks shown; (1) diagram relates to exfoliation (dome shape with onion-skin layers). PENALISE pure written description with no diagram described — max 0 marks. Reward where learner clearly describes a labelled sketch.',
    E'**Exfoliation = onion-skin weathering on dome-shaped rocks** in hot deserts.\n\nDraw and label:\n1. A **dome-shaped rock** (granite outcrop)\n2. Arrow + label: **"Day: outer layer heats and expands"**\n3. Arrow + label: **"Night: outer layer cools and contracts"**\n4. **Curved peeling layers** like onion skins coming off the surface\n5. **Talus/scree pile** at the base where layers have fallen off\n\nThe instruction says "diagram only" — written paragraphs score 0 here. Sketch on paper, then in the box describe the diagram and labels you''ve drawn.',
    true
  );

  -- ─── Q1(c)  AOC: Carbonation in tropical rainforests only  [5 marks, paid, essay] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '1(c)', 5, 'paid',
    'free_text',
    E'**(c)** How far do you agree that carbonation occurs in tropical rainforests only?',
    E'**Mark allocation (5 marks total):**\n• Reserve 4 marks — judgment of accurate relevant facts\n• Reserve 1 mark — decision made\n\nDecision rules:\n- Disagree/Agree to a certain/some extent: 3:1 or 2:2 (across climates)\n- Disagree/Agree to a large/low extent: 3:1 or 4 full\n- Disagree/Agree to a full extent: 4 full\n\n**Relevant facts for evaluation:**\n\n**Tropical rainforest:** high rainfall all year allows carbonation • high temperatures speed chemical reactions • high humidity allows solutions to form • dense vegetation produces CO₂\n\n**Tropical grasslands:** high summer rainfall allows carbonation • high summer temperatures speed reactions • summer humidity\n\n**Tropical deserts:** little rainfall but fog/dew provides moisture for carbonation • high temperatures speed reactions when water available\n\n**Examiner commentary:** Candidates explained the process of carbonation but failed to evaluate whether it occurs only in tropical rainforests. Must make a clear decision.',
    E'Award up to 5 marks: 4 marks for factual judgement across climates (rainforest, grasslands, deserts, temperate); 1 mark for explicit decision (e.g. "I disagree to a large extent because..."). PENALISE: pure process description without judgement = 0 for decision; decision without supporting evaluation = 0. Reward candidates who consider MULTIPLE climates and reach a balanced verdict.',
    E'This is an **AOC (Areas of Comparison)** question — examiners want a structured argument:\n\n1. **State your decision** up front: "I disagree to a large extent..."\n2. **Give facts FOR the statement** (rainforest favours carbonation): heavy rain, warmth, humidity, plant CO₂\n3. **Give facts AGAINST the statement** (other climates also have carbonation): tropical grasslands in summer; even deserts when fog brings moisture; temperate areas with limestone (UK, Mediterranean)\n4. **Close with the justification** for your decision\n\n**Pure description of the carbonation process gets 0 evaluation marks.** Examiners want you to JUDGE the claim, not explain the chemistry.',
    true
  );

  -- ════════════════════════════════════════════════════════════════════════
  -- Q2 — PHYSICAL GEOGRAPHY (wind, desert landforms)
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q2(a)(i)  Define abrasion  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, case_sensitive, memo, explanation, is_published
  ) values (
    geo_id, 2024, '1', '2(a)(i)', 1, 'free',
    'fill_in',
    E'**2 (a)(i)** Define the term *abrasion*.',
    jsonb_build_object(
      'must_contain', jsonb_build_array('rock')
    ),
    false,
    E'**Correct answer:** The transport of sand and small stones by wind (or water), blowing/throwing them against rocks and land, eroding the rocks and breaking themselves down; [1]\n\nNB: Accept reference to definitions from river or coastal processes.\n\n**Examiner commentary:** Confused with attrition (rocks against each other in the wind/water). Abrasion = particles against a fixed rock surface.',
    E'**Abrasion** is the *sandpapering* effect — wind/water picks up sand & small stones and **flings them against rock**, scratching and wearing it down. The fixed rock is the target.\n\nDon''t confuse with **attrition** = rocks colliding with each other and getting smaller/rounder.',
    true
  );

  -- ─── Q2(a)(ii)  Distinguish surface creep & saltation  [3 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '2(a)(ii)', 3, 'paid',
    'free_text',
    E'**2 (a)(ii)** Distinguish between *surface creep* and *saltation*.',
    E'**Correct answers:**\n• Saltation — soil particles move by short bounces; medium-sized particles 0.1–0.5 mm diameter (1)\n• Surface creep — larger particles >1.0 mm in diameter; rolled along the surface (1)\n• Comparison: "while/whereas/but/and" linking the two (1)\n\nMAX 2 marks if not compared.\n\nNB: Accept reference to comparisons from river or coastal processes.\n\n**Examiner commentary:** Most learners distinguished them but lost marks for not using comparative terms.',
    E'Award 3 marks: (1) saltation = bouncing of small/medium particles; (1) surface creep = rolling of larger particles; (1) comparative word. MAX 2 marks if no comparison made.',
    E'**Saltation = small particles BOUNCE.** **Surface creep = larger particles ROLL.**\n\nUse a comparative sentence:\n\n> "Saltation moves smaller particles (0.1–0.5 mm) by bouncing them along, **whereas** surface creep moves larger particles (>1.0 mm) by rolling them along the surface."\n\nIf you don''t use a linking word, you cap at 2 marks even if both definitions are perfect.',
    true
  );

  -- ─── Q2(a)(iii)  Why seif dunes form in Namib  [4 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '2(a)(iii)', 4, 'paid',
    'free_text',
    E'**2 (a)(iii)** Describe why seif dunes are formed in the Namib Desert.',
    E'**Correct answers (any four):**\n• Strong winds to keep moving sand — parallel to dominant SW/prevailing winds\n• Slight seasonal change in wind direction / cross-winds — maintains seif shape\n• Plentiful supply of sand from inland and beaches — produces high, long elongated dunes\n• Barrier blocking sand from being blown away — builds higher, steeper dunes\n• Sparse vegetation — sand is loose and easily moved\n• Underground rock formations channel sand into linear patterns\n• Dry conditions / lack of moisture — sand remains loose\n\n[4 marks — any four]\n\n**Examiner commentary:** Most learners described HOW seif dunes form rather than WHY they form in the Namib. Reference must be to reasons not process.',
    E'Award 1 mark per relevant reason (any 4). The question is WHY (factors that enable formation), not HOW (process). Penalise process descriptions ("wind blows sand"). Reward factors specific to Namib: prevailing SW winds, abundant sand supply, sparse vegetation, dry climate.',
    E'The trap: most learners answer "**how** seif dunes form". The question asks **why** they form here specifically. Focus on Namib conditions:\n\n1. **Strong, persistent SW winds** parallel to the coast keep sand moving in one direction\n2. **Slight seasonal cross-winds** sharpen the long ridges (typical of seif)\n3. **Huge sand supply** from beaches & inland — enough to build long, high dunes\n4. **Sparse vegetation** — sand stays loose, no roots holding it\n5. **Very dry climate** — no moisture to bind grains\n\nFour of these = 4 marks. Don''t describe the dune shape or how wind moves grains.',
    true
  );

  -- ─── Q2(a)(iv)  Deflation hollow formation  [5 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '2(a)(iv)', 5, 'paid',
    'free_text',
    E'**2 (a)(iv)** Describe and explain the formation of a deflation hollow.',
    E'**Correct answers (1 description + 4 explanation = 5 marks):**\n\n*Description:*\n• Process named: deflation (Reserve 1 mark)\n\n*Explanation (any 4):*\n• Fine/loose (dry) soil/sand particles are blown away\n• The ground is lowered\n• Continuous removal of sand leaves behind a (depression) hollow\n• Larger rock fragments / bedrock are left behind\n• They are too heavy to be lifted by the wind\n\n[5 marks]\n\n**Examiner commentary:** Most learners confused the formation of a deflation hollow with the formation of an oasis. Knowledge of the deflation process was weak.',
    E'Award 5 marks: (1) explicit naming of "deflation" as the process; (4) explanation steps — what happens to fine particles + ground lowering + what is left behind + why. Penalise: confusion with oasis (no marks for water table description); generic "wind erodes rock" with no mechanism.',
    E'A **deflation hollow** is a shallow depression in a desert formed when wind blows fine sand away. Five steps for 5 marks:\n\n1. **Name the process: deflation** (= removal of loose particles by wind)\n2. **Wind blows away** fine, dry sand and silt particles\n3. The **ground level is lowered** where this happens\n4. **Continuous removal** over many years creates a **hollow/depression**\n5. **Larger pebbles & bedrock are left behind** because they are too heavy for wind to lift\n\nDon''t describe an **oasis** (which forms when the hollow reaches the water table — that''s a follow-on, not the formation of the hollow itself).',
    true
  );

  -- ─── Q2(b)(i)  Photo A dune type & formation  [3 marks, paid] +diagram ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '2(b)(i)', 3, 'paid',
    'free_text',
    E'**(b)** **Photograph A** shows a type of dune in Sossusvlei, Namibia.\n\n**(b)(i)** Identify and describe the formation of the type of dune shown in **Photograph A**.',
    '/past-papers/geography-nssco-2024-p1/q2b-sossusvlei-dunes.png',
    E'**Correct answers (3 marks):**\n• 1 mark — type of dune identified (Star dune / Barchan / Parabolic — accept what matches photo)\n• 1 mark — plentiful sand supply → large dune (or limited sand → small dune for barchan)\n• 1 mark — prevailing wind direction (one-way for barchan, multi-direction for star)\n\n**Star dune:** unlimited sand; alternating multiple wind directions pile up sand; develops from barchans when wind direction changes; forms a peak with many arms/slip faces.\n\n**Barchan:** limited sand supply; prevailing wind from one direction; sand accumulates around an obstacle.\n\n**Parabolic:** strong winds erode a vegetated section; prevailing wind from one direction; sand deposited downwind; vegetation holds the arms.\n\nNB: Wrong identification but correct description for star/barchan/parabolic = 2 marks.\n\n**Examiner commentary:** Learners identified the dune type but lacked knowledge of formation.',
    E'Award up to 3 marks: (1) correct dune type from photograph; (1) sand supply context; (1) wind regime. If type is wrong but the formation description matches a valid dune type, award 2 marks. Penalise generic "wind blows sand and forms dune" with no formation specifics.',
    E'Sossusvlei dunes in the photo are typically **star dunes** (large, with multiple radiating arms and a central peak — visible in aerial shots).\n\nFor 3 marks:\n1. **Identify**: "These are **star dunes**"\n2. **Sand supply**: "Formed where there is an **unlimited supply of sand**"\n3. **Wind regime**: "Created by **alternating winds from multiple directions** that pile sand into a peak with several arms"\n\nKey trick: 1 mark for the type even if you''re wrong about the name — if your description matches what''s in the photo. So describe what you SEE.',
    true
  );

  -- ─── Q2(b)(ii)  Labelled diagram — rock pedestal  [4 marks, paid, drawing] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '2(b)(ii)', 4, 'paid',
    'free_text',
    E'**(b)(ii)** Using a labelled diagram only, describe the formation of a rock pedestal.\n\n*(Sketch your diagram on paper. In the box below, describe each label you would include and what your diagram shows — the AI will mark your description against the diagram requirements.)*',
    E'**Correct answers (4 marks for a fully labelled diagram):**\n• 1 mark — resistant rock described/labelled (harder layer at top)\n• 1 mark — less resistant rock described/labelled (softer layer at base)\n• 1 mark — abrasion shown greatest at base (use word "abrasion" or arrows at base)\n• 1 mark — resistant rock worn slowly / less resistant worn faster\n• 1 mark — diagram is clearly related to rock pedestal (mushroom-shape)\n\n**0 marks for written description without a diagram.**\n\n**Examiner commentary:** Well answered. Some learners wrote descriptions only and lost the diagram-related marks.',
    E'Award up to 4 marks for labelled diagram features: (1) resistant rock layer labelled; (1) less resistant rock labelled; (1) abrasion shown greatest at base (wind + sand arrows hitting base, OR label "abrasion zone"); (1) differential erosion described; (1) mushroom/pedestal shape clear. Pure written paragraph = 0 marks per examiner rules — reward only where learner clearly describes a labelled sketch.',
    E'A **rock pedestal** = mushroom-shaped rock (Namib: Mukurob before its collapse). Differential erosion: hard top, soft base, sandblasted near the ground.\n\nSketch + labels:\n\n1. Mushroom-shape: **broad cap on a thin neck**\n2. Label top: **"Resistant rock (harder layer)"**\n3. Label base: **"Less resistant rock (softer layer)"**\n4. Arrows hitting the base + label: **"Abrasion greatest at base — sand carried by wind sandblasts up to 1 m"**\n5. Outcome label: **"Soft base eroded faster than hard cap → mushroom shape"**\n\n"Diagram only" — written paragraphs score 0 marks on a diagram-only question.',
    true
  );

  -- ─── Q2(c)  AOC: Wind processes more in deserts  [5 marks, paid, essay] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '2(c)', 5, 'paid',
    'free_text',
    E'**(c)** How far do you agree that wind processes are found more in desert areas (such as the Namib Desert) compared to other climates?',
    E'**Mark allocation (5 marks):**\n• Reserve 4 marks — judgment of accurate relevant facts\n• Reserve 1 mark — decision made\n\n**Facts when wind processes are strong:**\n• Absence of vegetation to cover/protect soil → loose particles available\n• Limited infrastructure → fewer barriers to slow wind\n• Absence of water / dry loose soil → easily lifted\n• Warm rising air creates winds as cooler air sinks (convection)\n• Steep pressure-gradient zones produce strong winds\n• Other climates can also have wind — coastal areas, mountain passes\n\nDecision rules: agree to a large extent / full extent / some extent / disagree.\n\n**Examiner commentary:** Candidates gave knowledge with a decision but failed to evaluate WHY wind processes are more common in deserts. Many wrote "I agree 100%".',
    E'Award up to 5 marks: 4 for factual judgement (factors enabling wind in deserts vs other climates); 1 for explicit decision. Penalise vague "I agree 100%" with no comparison. Reward learners who consider OTHER climates (coastal, mountain, polar) and make a balanced verdict.',
    E'**Structure your essay:**\n\n1. **Decision**: "I agree to a large extent..."\n2. **Why deserts favour wind processes**: dry loose sand • no vegetation • no buildings • temperature contrasts drive strong winds • abundant fine particles to transport\n3. **But other climates have wind too**: coastal areas (sea breezes, hurricanes) • temperate plains • mountain passes • polar regions (katabatic winds)\n4. **Balance**: wind processes happen everywhere, but deserts have the *combination* (loose sand + no cover + strong winds) that creates VISIBLE wind landforms (dunes, deflation hollows, pedestals)\n5. **Justify**: "Therefore, wind processes are MORE COMMON and MORE VISIBLE in deserts, but not exclusive to them."',
    true
  );

  -- ════════════════════════════════════════════════════════════════════════
  -- SECTION B: ECONOMIC ACTIVITIES AND THE USE OF RESOURCES
  -- Q3 — Fishing industry in Namibia
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q3(a)(i)  Define secondary industry  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, case_sensitive, memo, explanation, is_published
  ) values (
    geo_id, 2024, '1', '3(a)(i)', 1, 'free',
    'fill_in',
    E'**SECTION B: ECONOMIC ACTIVITIES AND THE USE OF RESOURCES**\n\nAnswer **one** question from Section B.\n\n**3 (a)(i)** Define the term *secondary industry*.',
    jsonb_build_object(
      'must_contain', jsonb_build_array('raw material')
    ),
    false,
    E'**Correct answers:** The making of a product in a factory/workshop • Industry that converts raw materials provided by primary industry into commodities/products for the consumer • Some secondary industries take semi-processed materials from other secondary industries; [1]\n\n**Examiner commentary:** Fairly well answered. Wrong: "second-hand activity", "producing raw materials".',
    E'Key words: **turning, processing, manufacturing** raw materials into finished products. Examples: fish-processing factory, brewery, clothing factory. NOT extraction (that''s primary) and NOT services (that''s tertiary).',
    true
  );

  -- ─── Q3(a)(ii)  Sustainable fishing strategies  [3 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '3(a)(ii)', 3, 'paid',
    'free_text',
    E'**3 (a)(ii)** Describe the management strategies that the fishing industry has undertaken to ensure the sustainable use of fish resources in Namibia.',
    E'**Correct answers (any three):**\n• Conservation laws / legislation / EEZ (Exclusive Economic Zone) protecting fish from overfishing\n• Control of net size & type to manage what can be caught\n• TAC (Total Allowable Catch) / quotas — limit on number of fish caught\n• Closed fishing seasons — allow fish to breed\n• Fines/penalties for overfishing\n• Patrol/monitoring (onshore and offshore) to regulate fishing\n• Fishing permits/licences required\n\n[3 marks — any three]\n\n**Examiner commentary:** Most learners scored 1–3 marks. Some confused with the importance of the fishing industry (GDP, jobs) — irrelevant here.',
    E'Award 1 mark per management strategy (any 3). Penalise: importance/benefits of fishing industry (jobs, GDP, exports); generic "protect the fish"; bare abbreviations EEZ/TAC without explanation.',
    E'**Sustainable** = keeping the resource available for the future. Three real Namibian strategies:\n\n1. **TAC / Quotas** — each company gets a limit on how many tonnes per season\n2. **Closed seasons** — fishing banned during breeding periods (Apr–Sept for some species)\n3. **Patrols** — Ministry of Fisheries patrols the 200-nautical-mile EEZ to stop illegal foreign vessels\n\nDon''t write about jobs created or export earnings — that''s benefits, not management.',
    true
  );

  -- ─── Q3(a)(iii)  Physical factors influencing fish availability  [4 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '3(a)(iii)', 4, 'paid',
    'free_text',
    E'**3 (a)(iii)** Describe the physical factors that have influenced the availability of raw materials like fish in Namibia.',
    E'**Correct answers (any four):**\n• Cold ocean currents (Benguela) — supply oxygen and encourage plankton growth that attracts fish\n• Upwelling — deep nutrient-rich water rises to surface, feeding plankton & fish\n• Marine food chain — large groups of organisms serve as food for fish\n• Length of coastline — long coast from Kunene River (N) to Orange River (S), ~1,500 km\n• Prevailing winds enable upwelling\n• Natural harbour locations for docking\n• Size of the ocean / sea area\n• Breeding grounds\n\n[4 marks — any four]\n\n**Examiner commentary:** Learners gave human factors (labour, market) or threatening factors (pollution) instead of physical factors.',
    E'Award 1 mark per physical factor (any 4). Physical = natural/non-human. Penalise: human factors (labour, market, capital, electricity); threatening factors (pollution, red tides); pure abbreviations.',
    E'**"Physical factors"** = natural conditions, not anything humans do. Namibia''s big four:\n\n1. **Benguela Current** — cold current from Antarctica brings oxygen-rich water\n2. **Upwelling** — strong winds push surface water away from coast, deep cold water rises bringing nutrients → plankton bloom → fish food\n3. **Long coastline** (~1,500 km) — large area where fish can live\n4. **Natural harbours** — Walvis Bay & Lüderitz provide sheltered docking\n\nDon''t write "labour available" or "good market" — those are human/economic.',
    true
  );

  -- ─── Q3(a)(iv)  Physical factors threatening fish  [5 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '3(a)(iv)', 5, 'paid',
    'free_text',
    E'**3 (a)(iv)** Explain the physical factors threatening the availability of fish resources.',
    E'**Correct answers (any five with explanation):**\n• Red tides / El Niño / algal blooms — toxins lower oxygen, cover gills, kill fish\n• Sulphur emissions from underwater geothermal vents — poison the water and kill fish\n• Predators (sea birds, seal colonies) — feed on fish and deplete stocks\n• Rising sea temperatures — force fish to migrate to colder waters\n• Diseases — can kill entire schools of fish\n• Ocean acidification — CO₂ absorption lowers pH, kills fish or causes migration\n• Changing currents — disrupt nutrient distribution, fish migrate\n\n0 marks for human-caused pollution.\nDescriptions only = max 3 marks.\n2+ factors with detailed explanation = full marks.\n\n[5 marks — any five]\n\n**Examiner commentary:** Most learners scored marks for descriptions but could not explain further. Some gave human factors.',
    E'Award up to 5 marks. Each factor must be PHYSICAL (natural, not human-caused) AND must have an explanation (mechanism by which it threatens fish). PENALISE: 0 marks for human pollution (litter, oil spills, sewage); descriptions without mechanism cap at 3 marks total.',
    E'Threats from **nature**, not humans. Each one needs *what* + *how it kills/displaces fish*:\n\n1. **Red tides** (algal blooms) → toxins reduce O₂ + cover gills → mass die-off\n2. **Sulphur eruptions** off Namibian coast → poison water column → fish die or flee\n3. **Predators** (Cape fur seals colonies number ~1 million) → eat huge tonnages of fish\n4. **Rising sea temperatures** (climate change) → fish species migrate south to cooler water\n5. **Ocean acidification** (CO₂ + water → carbonic acid) → kills eggs/young fish\n\nWrite each as: *factor → mechanism → effect on fish*. Pollution from humans = 0 marks.',
    true
  );

  -- ─── Q3(b)(i)  Photo B human factors  [3 marks, paid] +diagram ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '3(b)(i)', 3, 'paid',
    'free_text',
    E'**(b)** Study **Photograph B**, which shows Namibia''s fishing industry in Walvis Bay.\n\n**(b)(i)** From **Photograph B only**, describe three human factors influencing the location of fish processing plants in Walvis Bay.',
    '/past-papers/geography-nssco-2024-p1/q3b-walvis-bay.png',
    E'**Correct answers (any three from photograph):**\n• Vessels — visible in the harbour for catching fish\n• Cranes — visible for unloading fish from vessels\n• Harbour / quay / docking facilities — ships docked at the quay\n• Roads — connecting harbour to processing plants\n• Buildings / containers — for storage facilities\n• Power lines / power poles — visible infrastructure\n\n0 marks for "electricity/power/energy" alone (must be visible feature).\n\n[3 marks — any three visible factors]\n\n**Examiner commentary:** Many gave generic "labour, market, capital" — not visible in the photo.',
    E'Award 1 mark per human factor IDENTIFIED FROM THE PHOTO. Penalise: generic answers (labour, capital, market) not visible; single words without describing what role they play.',
    E'Trap: "From Photograph B only". Every factor must be **visible** in the photo. Look at what humans built/brought:\n\n1. **Ships/vessels** docked at the quay\n2. **Cranes** for unloading catches\n3. **Quay/harbour wall** (concrete docking edge)\n4. **Roads** connecting docks to factories\n5. **Storage buildings** behind the dock\n6. **Power lines/poles** providing electricity\n\nDon''t write "labour" or "market" — you can''t see those in the photo.',
    true
  );

  -- ─── Q3(b)(ii)  Photo B physical factors  [4 marks, paid] +shared diagram ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '3(b)(ii)', 4, 'paid',
    'free_text',
    E'**(b)** Study **Photograph B**, which shows Namibia''s fishing industry in Walvis Bay.\n\n**(b)(ii)** Using **Photograph B only**, name and explain two physical factors that have influenced the location of fish processing plants in Walvis Bay.',
    '/past-papers/geography-nssco-2024-p1/q3b-walvis-bay.png',
    E'**Correct answers (any two physical, with explanation):**\n• Ocean — where fish resource is found and where ships dock\n• Flat land — easy to build processing factories and workshops to repair vessels\n• Natural harbour/bay — area of calm sheltered water where ships can dock safely\n\nHarbour as transport = 0 (that''s human). Only descriptions = max 2 marks.\n\n[4 marks — any two with development/explanation]\n\n**Examiner commentary:** Poorly answered. Learners gave human factors (capital, raw materials, water).',
    E'Award up to 4 marks: (2) name two physical features; (2) explain HOW each influenced location of fish-processing plants. PENALISE: human factors (labour, capital, market); features not visible in the photo; bare naming without explanation.',
    E'Two **physical** (natural) features visible:\n\n1. **The ocean itself** — flat calm water + close to fish stocks → "plants located on the coast so fish can be unloaded quickly without spoiling"\n2. **Flat coastal land** behind the bay → "flat land in the photo allows large factory buildings to be constructed cheaply with easy road access"\n3. **Natural bay (sheltered water)** → "the curved bay shape calms wave action so ships can dock safely year-round"\n\nName + 1-sentence reason for each = full marks.',
    true
  );

  -- ─── Q3(c)  AOC: Agglomeration & fishing industry  [5 marks, paid, essay] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '3(c)', 5, 'paid',
    'free_text',
    E'**(c)** How far do you agree that the agglomeration economic effect is stimulated by different activities of the fishing industry?',
    E'**Mark allocation (5 marks):**\n• Reserve 4 marks — judgment of accurate relevant facts\n• Reserve 1 mark — decision made\n\n**Sectors of fishing industry that stimulate agglomeration:**\n• Primary: catching of fish\n• Secondary: packaging, refrigeration\n• Tertiary: financial and logistical services\n\n**Other industries that follow fishing into the same area:**\n• Schools (for workers'' children)\n• Banking services\n• Mining (in Walvis Bay region)\n• Salt farming\n• Construction services\n• Tourism\n• Weather services\n\nDecision rules: agree/disagree to some/large/full extent.\n\n**Examiner commentary:** Most learners did not understand agglomeration. Some described fishing as a system or gave job benefits without linking to industrial clustering.',
    E'Award up to 5 marks: 4 for evaluation of how fishing activities cluster/attract other industries; 1 for explicit decision. PENALISE: pure listing of fishing industry benefits without agglomeration concept; "creates jobs" without linking to industrial clustering.',
    E'**Agglomeration** = industries clustering together because each gains from the others. The trick: evaluate whether fishing CAUSES this clustering in Walvis Bay.\n\n**FOR (agree):**\n• Fishing brings **primary** activity (catching) → creates demand for **secondary** (canning, freezing factories) → these attract **tertiary** (banks, insurance, shipping agents)\n• Workers need housing → construction, retail, schools follow\n• Walvis Bay shows this: salt mines, tourism, port logistics all benefit\n\n**AGAINST (counter):**\n• Some industries (mining, salt) would be there regardless of fishing\n• Tourism is driven by climate not fish\n\n**Decision**: "I agree to a large extent" — fishing is the *primary anchor* of Walvis Bay''s agglomeration.',
    true
  );

  -- ════════════════════════════════════════════════════════════════════════
  -- Q4 — Wildlife conservation
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q4(a)(i)  Define wildlife conservation  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, case_sensitive, memo, explanation, is_published
  ) values (
    geo_id, 2024, '1', '4(a)(i)', 1, 'free',
    'fill_in',
    E'**4 (a)(i)** Define the term *wildlife conservation*.',
    jsonb_build_object(
      'must_contain', jsonb_build_array('protect')
    ),
    false,
    E'**Correct answer:** Wildlife conservation is the protection of plant and animal species as the human population encroaches on their resources; [1]\n\nKey words: protection, preserving, sustaining, taking care.\n\n**Examiner commentary:** Well answered. Wrong: "animals in the wild", "keep in the camp".',
    E'**Wildlife conservation** = protecting plant + animal species (and their habitats) from human pressure. Key verbs: **protect, preserve, sustain, manage**. Not just animals — plants count too.',
    true
  );

  -- ─── Q4(a)(ii)  Economic benefits of wildlife protection  [3 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '4(a)(ii)', 3, 'paid',
    'free_text',
    E'**4 (a)(ii)** Describe ways in which the Namibian economy benefits from wildlife protection.',
    E'**Correct answers (any three):**\n• More tax paid from jobs created in conservation/tourism\n• Income through conservancies / trophy hunting / tourism → higher standard of living / foreign currency / selling of wildlife\n• Stimulates development of tourist facilities (lodges, camps)\n• Development of local infrastructure (schools, roads near conservancies)\n• Foreign investment to protect wildlife (donor funds)\n• Creates job opportunities (guides, rangers, lodge staff)\n\n[3 marks — any three]\n\n**Examiner commentary:** Well answered. Wrong: food for locals (people benefit, not economy), clothing skins.',
    E'Award 1 mark per economic benefit (any 3). Must be ECONOMIC (income, GDP, taxes, jobs, investment) not personal/cultural benefits. Penalise "food for people" (subsistence ≠ economy).',
    E'**Namibia is a world leader in community conservancies.** Economic benefits:\n\n1. **Tourism income** — foreign visitors pay for safaris, lodges, park fees → forex earnings\n2. **Trophy hunting fees** — controlled quotas bring high-value individual hunter spending\n3. **Conservancy jobs** — game guards, anti-poaching, lodge staff (~5,000 jobs in communal conservancies)\n4. **Foreign investment & donor funds** — WWF, GIZ, EU fund conservation work\n\nDon''t write "people eat meat" — that benefits individuals, not the national economy.',
    true
  );

  -- ─── Q4(a)(iii)  Conflicts between wildlife management & land use  [4 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '4(a)(iii)', 4, 'paid',
    'free_text',
    E'**4 (a)(iii)** Describe the conflicts between the management of wild animals and other land use activities.',
    E'**Correct answers (any four):**\n• Crop & property damage — elephants, baboons raid crops; birds eat grains → farmers vs conservation\n• Grazing conflicts — livestock & wildlife compete for the same grazing\n• Predation on livestock — lions, cheetahs, leopards kill cattle/sheep → ranchers vs wildlife\n• Hunting regulations — hunters disagree with quotas, seasons, bag limits\n• Human-wildlife conflict — elephants enter villages, damage property, threaten people\n• Water rights — wildlife, agriculture, industry all compete for water\n• Wildlife tourism vs traditional land use — lodges displace local livelihoods\n• Wildlife kills or injures people\n\nDifferent conflicts are treated independently.\n\n[4 marks — any four]\n\n**Examiner commentary:** Poorly answered. Learners gave roles of management instead of conflicts.',
    E'Award 1 mark per distinct CONFLICT (any 4). Each must show a tension between wildlife and another land use. Penalise: solutions ("put fences"); benefits of conservation; descriptions of wildlife without conflict.',
    E'A **conflict** = two parties wanting the same land/resource. Four classics in Namibia:\n\n1. **Crop raids** — elephants raid mahangu fields in Caprivi; farmers vs Ministry of Environment\n2. **Livestock killed by predators** — lions kill cattle in Kunene → farmers retaliate by shooting lions\n3. **Grazing competition** — cattle and game graze the same pasture in dry years\n4. **Hunting quota disputes** — community hunters want bigger quotas; conservancies want lower quotas\n5. **Land-use change** — conservancies block traditional grazing routes\n\nState the *parties involved* in each conflict for clarity.',
    true
  );

  -- ─── Q4(a)(iv)  Positive impacts of wildlife on environment  [5 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '4(a)(iv)', 5, 'paid',
    'free_text',
    E'**4 (a)(iv)** Explain the positive impacts of wildlife animals on the environment.',
    E'**Correct answers (any five, with explanation):**\n• Increasing habitat diversity — by disturbing vegetation, turning soil, migration\n• Enhancing plant dispersal — animals carry seeds in fur, dung; break seed dormancy\n• Increased ecosystem resistance to change — herbivores accelerate nutrient cycling\n• Reduce fire spread & intensity — by consuming vegetation, trampling soil, breaking continuity\n• Increase soil carbon stocks — large herbivores lower above-ground carbon\n• Animal dung improves soil fertility — natural vegetation grows better\n• Wildlife assist with pollination\n\n2+ positive impacts with detailed explanation = full marks. Descriptions only = max 3.\n\n[5 marks — any five]\n\n**Examiner commentary:** Poorly answered. Learners confused positive with negative impacts, or gave benefits to economy instead of environment.',
    E'Award up to 5 marks: each impact must be (a) POSITIVE, (b) on the ENVIRONMENT (not economy), and (c) explained with mechanism. PENALISE: tourism/jobs (economy not environment); overgrazing/destruction (negative); "they look beautiful" (no mechanism).',
    E'Five ways wildlife HELPS ecosystems (not people):\n\n1. **Seed dispersal** — antelope, elephants eat fruit and deposit seeds in dung far from parent plant → spreads forests\n2. **Soil fertility** — dung adds nutrients → grasses grow back stronger\n3. **Nutrient cycling** — grazing speeds up the cycle: plants → animal → dung → soil → plants\n4. **Fire control** — large herbivores eat dry grass, reducing fuel load → fewer/smaller wildfires\n5. **Pollination** — bats, birds, insects pollinate native plants\n\nDon''t write "tourists love them" — that''s economic, not environmental.',
    true
  );

  -- ─── Q4(b)(i)  Fig 2 wildlife numbers Namibia/Kenya  [3 marks, paid] +diagram ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '4(b)(i)', 3, 'paid',
    'free_text',
    E'**(b)** **Fig. 2** shows wildlife numbers of two countries, Namibia and Kenya in southern Africa from 1960 to 2020.\n\n**(b)(i)** Describe the changes in wildlife numbers between Namibia and Kenya from 1960 to 2020. Support your answer with data from **Fig. 2 only**.',
    '/past-papers/geography-nssco-2024-p1/q4b-wildlife-graph.png',
    E'**Correct answers (3 marks — 2 for change + 1 for data):**\n• General increase for Namibia while Kenya decrease (from 1960 to 2020) (1)\n• Namibia steep increase from 1970 whereas Kenya continuous decrease (1)\n• Data: Highest Namibia 3,000,000 / 3 million and Kenya highest 1,500,000 / 1.5 million; lowest Namibia 500,000 (start) and Kenya lowest 350,000 (2020) (1)\n• OR: Namibia increased by ~2,500,000 while Kenya decreased by ~1,150,000 (1)\n\nNB: Data must be for BOTH countries to gain the mark.\n\n[3 marks]\n\n**Examiner commentary:** Most scored 1 mark for general trend but failed to give correct data with comparison.',
    E'Award 3 marks: (1) general trend for BOTH (Namibia up, Kenya down); (1) rate/pattern detail (steep vs gradual); (1) DATA points from graph for BOTH countries. PENALISE: trend for only one country; vague "increase/decrease" with no numbers; numbers without comparison.',
    E'Three things examiners want when describing graph data:\n\n1. **Overall trend** — Namibia up, Kenya down\n2. **Rate/pattern** — Namibia rises steeply from 1970; Kenya falls steadily throughout\n3. **Specific numbers from BOTH lines**:\n   - Namibia: ~500,000 (1960) → ~3,000,000 (2020) = **rose by 2.5 million**\n   - Kenya: ~1,500,000 (1960) → ~350,000 (2020) = **fell by 1.15 million**\n\nAlways quote figures for **both** countries — one country alone = 0 data mark.',
    true
  );

  -- ─── Q4(b)(ii)  Fig 2 environmental reasons Kenya decline  [4 marks, paid] +shared diagram ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '4(b)(ii)', 4, 'paid',
    'free_text',
    E'**(b)** **Fig. 2** shows wildlife numbers of two countries, Namibia and Kenya in southern Africa from 1960 to 2020.\n\n**(b)(ii)** Name and explain two environmental reasons for the change on Kenya''s wildlife numbers with reference to **Fig. 2**.',
    '/past-papers/geography-nssco-2024-p1/q4b-wildlife-graph.png',
    E'**Correct answers (any two with explanation):**\n• Desertification → soil degradation, loss of vegetation, less water → habitat loss → animals migrate or die\n• Deforestation → destroys natural habitats → animals lose food, shelter, water\n• Global warming → rising temperatures, droughts, floods, fires → directly harms animals & habitats\n\nAccept other environmental causes: soil erosion, less rainfall, climate change.\n\n0 marks for "pests and diseases" alone.\n\n2 reasons + explanation = 4 marks. Descriptions only = max 2.\n\n[4 marks]\n\n**Examiner commentary:** Most gave human factors (hunting, poaching) instead of environmental.',
    E'Award up to 4 marks: (2 reasons × 2 marks each: name + explain). MUST be environmental (natural processes), not human (poaching, no fence). Penalise hunting/poaching answers (those are human factors).',
    E'**Environmental** = natural-system causes, not direct human action. Two strong choices for Kenya''s decline:\n\n1. **Desertification** (especially in northern Kenya)\n   - Reason: less rainfall + overgrazing → grasses die → soil exposed\n   - Effect: habitats shrink, animals migrate or starve\n\n2. **Climate change / global warming**\n   - Reason: warmer temperatures, longer droughts\n   - Effect: water holes dry up, animals die or migrate\n\n*Poaching is the obvious answer but the examiner specifically marks it 0 here — they want environmental, not human.*',
    true
  );

  -- ─── Q4(c)  AOC: Government success in sustainable wildlife  [5 marks, paid, essay] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '4(c)', 5, 'paid',
    'free_text',
    E'**(c)** How far do you agree that the role of the government in the sustainable use of wildlife animals is a success in Namibia?',
    E'**Mark allocation (5 marks):**\n• Reserve 4 marks — judgment of relevant facts\n• Reserve 1 mark — decision\n\n**Government involvement (successes):**\n• Policy formulation on wildlife management\n• Enforcement of laws & regulations\n• Monitoring populations & allocating hunting quotas\n• Running national parks (Etosha, Skeleton Coast, Namib-Naukluft)\n• Concessions to commercial tourism\n\n**Shortcomings:**\n• Limited budget / funding\n• Poaching, corruption\n• Human–wildlife conflict\n• Population growth, land-use change\n\nDecision rules: certain extent / large extent / full extent / disagree.\n\n**Examiner commentary:** Most listed government roles but could not evaluate success.',
    E'Award up to 5 marks: 4 for balanced evaluation of successes vs shortcomings; 1 for explicit decision. PENALISE: pure listing of roles without judging success; vague "they did a good job".',
    E'**Structure:**\n\n1. **Decision**: "I agree to a large extent that government has been successful, but not fully."\n2. **Successes**:\n   • Communal conservancies (Namibia model — ~20% of country)\n   • Etosha rebound: elephant numbers up\n   • Strict anti-poaching units reduced rhino poaching after 2014 peak\n3. **Shortcomings**:\n   • Rhino poaching still ongoing\n   • Budget cuts in Min of Environment\n   • Slow compensation for crop/livestock losses → community resentment\n4. **Verdict**: Largely successful (Namibia is a world model) but gaps remain in enforcement and community compensation.',
    true
  );

  -- ════════════════════════════════════════════════════════════════════════
  -- SECTION C: POPULATION AND SETTLEMENT
  -- Q5 — Urbanisation
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q5(a)(i)  Define urbanisation  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, case_sensitive, memo, explanation, is_published
  ) values (
    geo_id, 2024, '1', '5(a)(i)', 1, 'free',
    'fill_in',
    E'**SECTION C: POPULATION AND SETTLEMENT**\n\nAnswer **one** question from Section C.\n\n**5 (a)(i)** Define the term *urbanisation*.',
    jsonb_build_object(
      'must_contain', jsonb_build_array('urban')
    ),
    false,
    E'**Correct answers:** Growth/increase in the proportion of people living in towns and cities (urban areas) • The increase in size of urban settlements; [1]\n\n0 mark for "rural-urban migration" alone — that''s a CAUSE of urbanisation, not the definition.\n\n**Examiner commentary:** Fairly well answered. Many confused with rural-urban migration.',
    E'**Urbanisation** = the *proportion* (share) of a country''s population living in towns & cities going UP. It''s a state/change at country level.\n\nIt''s caused BY rural-urban migration + higher urban birth rates, but it''s not the same thing as migration.',
    true
  );

  -- ─── Q5(a)(ii)  MEDC rural settlement negative factors  [3 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '5(a)(ii)', 3, 'paid',
    'free_text',
    E'**5 (a)(ii)** Describe factors that negatively influence the functions of rural settlements in More Economically Developed Countries (MEDCs).',
    E'**Correct answers (any three):**\n• Limited public transport (rail, bus) — hinders access for those without cars\n• Historical/cultural influence — old street pattern, planning laws limit growth\n• Rural-urban migration — population shrinks, fewer resources to maintain services\n• Decline in agriculture — incomes of rural households fall\n• Lack of infrastructure — limited healthcare, education, communication\n• Limited job opportunities — brain drain of young workers\n• Ageing population — fewer workers, reduced tax base\n• Social isolation — community engagement declines\n• Gentrification — second-home buyers push up prices, locals priced out\n\nAll services together = max 1 mark.\n\n[3 marks — any three]\n\n**Examiner commentary:** Learners used LEDC factors (no water, no electricity) instead of MEDC.',
    E'Award 1 mark per factor (any 3) that specifically affects MEDC rural areas. PENALISE: LEDC issues (no water, no power, no housing) — those score 0 here.',
    E'**MEDC rural problems are DIFFERENT from LEDC:** in MEDCs there''s electricity, water, schools — but the *people leave* and the village shrinks.\n\nThree MEDC-specific issues:\n\n1. **Ageing population** — young people move to cities; left behind are pensioners → less workforce, less tax revenue\n2. **Service decline** — local shop, school, bus route closes because too few users → spiral of decline\n3. **Gentrification / second homes** — wealthy urbanites buy holiday cottages → house prices rise → locals can''t afford to live there\n\nDon''t write "no electricity" or "lack of water" — that''s LEDC.',
    true
  );

  -- ─── Q5(a)(iii)  Why LEDC cities grow rapidly  [4 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '5(a)(iii)', 4, 'paid',
    'free_text',
    E'**5 (a)(iii)** Describe why cities in Less Economically Developed Countries (LEDCs) grow rapidly.',
    E'**Correct answers (any four):**\n• Increasing birth rates in urban areas\n• Rural-urban migration\n• More employment opportunities in cities\n• Higher salaries attract people\n• Entertainment / sport opportunities\n• Better education services\n• Better medical care\n• Low death rate in cities (better healthcare)\n\nMax 4 marks for high birth + low death — must reference CITIES not rural areas.\n\n[4 marks — any four]\n\n**Examiner commentary:** Well answered. Some referred to rural-area causes of high birth rate.',
    E'Award 1 mark per factor (any 4) explaining why URBAN areas in LEDCs grow. Must reference cities/urban benefits, not rural problems. Penalise: "lack of jobs in rural" without flipping to "more jobs in cities".',
    E'Two engines of LEDC city growth — **migration IN** and **natural increase**:\n\n**Pull factors (people migrate TO cities):**\n1. More jobs in factories, services, construction\n2. Better wages — even informal work pays more than subsistence farming\n3. Better schools & universities\n4. Better hospitals & clinics\n\n**Natural increase:**\n5. Higher birth rate in urban areas + lower death rate (medical care)\n\nFor Windhoek: ~150,000 in 1990 → ~450,000 today, driven mostly by migration from northern regions.',
    true
  );

  -- ─── Q5(a)(iv)  Negative effects urban sprawl on environment  [5 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '5(a)(iv)', 5, 'paid',
    'free_text',
    E'**5 (a)(iv)** Explain the negative effects urban sprawl has on the environment.',
    E'**Correct answers (any five with explanation):**\n• Loss of natural habitats & biodiversity — destruction and fragmentation\n• Increased air pollution — more private vehicles, longer commutes → more emissions\n• Increased water pollution — runoff from paved areas pollutes rivers\n• Increased energy consumption — transport, heating/cooling → more greenhouse gases\n• Land degradation — agricultural land lost, soil fertility reduced, erosion\n• Increased waste — more households generate more waste, strains systems\n• Increased noise pollution\n• Pressure on natural/land resources\n• Wild animals displaced from their habitats\n\nDifferent types of pollution counted separately. "Pollution alone" = 1 mark.\nDescriptions only = max 3. 2+ effects with detailed explanation = full marks.\n\n[5 marks — any five]\n\n**Examiner commentary:** Many learners did not know "urban sprawl" and gave generic urban problems.',
    E'Award up to 5 marks. Each effect must (a) be ENVIRONMENTAL (not crime/disease/overcrowding) and (b) explain HOW urban sprawl causes it. PENALISE: overcrowding, crime, disease (social not environmental); pollution mentioned once with no explanation = 1 mark only.',
    E'**Urban sprawl** = city spreads outwards into countryside, low-density expansion. Five environmental effects:\n\n1. **Habitat destruction** — bulldozers clear bushveld for housing → native species lose homes (Windhoek edges encroaching on Brakwater)\n2. **Air pollution** — longer car commutes → CO₂ & NO₂ rise\n3. **Water pollution** — tarred roads = runoff carrying oil, brake dust into streams\n4. **Land degradation** — fertile soil paved over; can''t farm again\n5. **Greenhouse emissions** — more energy used heating spread-out homes and driving longer distances\n\nDon''t write about crime or disease — those are social problems, not environmental.',
    true
  );

  -- ─── Q5(b)(i)  Photo C causes of urban problem  [3 marks, paid] +diagram ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '5(b)(i)', 3, 'paid',
    'free_text',
    E'**(b)** Study **Photograph C**, which shows an urban problem in a Less Economically Developed Country (LEDC) in Africa.\n\n**(b)(i)** Using **Photograph C only**, identify and describe the causes of this problem.',
    '/past-papers/geography-nssco-2024-p1/q5b-traffic.png',
    E'**Correct answers (1 mark identifying problem + up to 3 causes):**\n\n**Problem: Traffic congestion** (Reserve 1 mark — but learner must mention it)\n\n**Causes (any three from photo):**\n• Inadequate public transport — only 2 buses visible\n• Many people depend on private transport — lots of small cars\n• Too many cars — high density of vehicles in the photo\n• Cars flowing in one direction — high density on this side\n• Separate bus lane reduces road space for cars\n• Multiple lanes encourage more car use\n• Poorly designed road\n\n[3 marks total — including problem identification]\n\n**Examiner commentary:** Learners gave general causes (population growth, urbanisation) not visible in photo.',
    E'Award up to 3 marks: identification of the problem (traffic congestion) + causes that are VISIBLE in the photo. PENALISE: general urban-problem theory (population growth, no decentralisation) not visible; failure to name the actual problem.',
    E'Photo shows **traffic congestion** in an LEDC African city. The instruction is "from Photograph C only" — base every cause on what you SEE:\n\n1. **Many cars filling all lanes** — too many private vehicles\n2. **Only 1–2 buses visible** vs many cars — inadequate public transport encourages car use\n3. **One direction is much denser** than the other — rush-hour flow concentrated\n4. **A separate bus lane** takes up space, narrowing car lanes → congestion in remaining lanes\n\nDon''t write "population growth" — you can''t see it in the photo.',
    true
  );

  -- ─── Q5(b)(ii)  Photo C urban planner solutions  [4 marks, paid] +shared diagram ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '5(b)(ii)', 4, 'paid',
    'free_text',
    E'**(b)** Study **Photograph C**, which shows an urban problem in a Less Economically Developed Country (LEDC) in Africa.\n\n**(b)(ii)** Using **Photograph C only**, describe how urban planners have attempted to solve this problem.',
    '/past-papers/geography-nssco-2024-p1/q5b-traffic.png',
    E'**Correct answers (any four from photo):**\n• Use of public transport / buses — carry many people, reduces car numbers\n• Bus lanes / separate routes — make public transport more attractive and efficient\n• Multi-lane roads — allow more vehicles to move at once\n• Multi-lanes flowing in one direction — increase one-way capacity at peak times\n• Broken/dashed lane lines — allow switching to overtake slower cars\n\n[4 marks — any four]\n\n**Examiner commentary:** Most learners gave generic solutions (toll roads, traffic lights, railways) not in the photograph.',
    E'Award 1 mark per solution VISIBLE in the photo. PENALISE: theoretical solutions not shown (toll roads, traffic lights, encourage rural development) — those score 0 here.',
    E'Look at what the urban planners HAVE already built in the photo:\n\n1. **Dedicated bus lane** — separated from car lanes by a barrier → buses move faster, encourages bus use\n2. **Buses in service** — providing high-capacity transport (one bus = ~40 cars worth of people)\n3. **Multiple lanes per direction** — increases road capacity\n4. **Broken white lines** between lanes — allow cars to overtake/change lanes (vs solid lines that would block this)\n\nDon''t write "build a railway" — there''s no railway in the photo.',
    true
  );

  -- ─── Q5(c)  AOC: Residential areas LEDC vs MEDC  [5 marks, paid, essay] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '5(c)', 5, 'paid',
    'free_text',
    E'**(c)** How far do you agree that the location of residential areas in Less Economically Developed Countries (LEDCs) differs from the location of residential areas in More Economically Developed Countries (MEDCs)?',
    E'**Mark allocation (5 marks):**\n• Reserve 4 marks — judgment of facts about location\n• Reserve 1 mark — decision\n\n**Key differences (location of classes):**\n• High-class housing: LEDC = inner city around CBD; MEDC = outer suburbs\n• Medium-class housing: LEDC = inner suburbs; MEDC = inner suburbs (similar)\n• Low-class housing: LEDC = outer suburbs / shanties; MEDC = inner city around CBD\n• LEDCs have informal/squatter settlements on outskirts; MEDCs do not\n\nDecision rules: certain/large/full extent.\n\n**Examiner commentary:** Learners unfamiliar with urban morphology — referred to building materials and sizes instead of location.',
    E'Award up to 5 marks: 4 for evaluation of WHERE different residential classes are located in LEDCs vs MEDCs; 1 for explicit decision. PENALISE: comparing building quality or size (not location); confusing reversed pattern ("rich live near CBD in MEDC" = wrong).',
    E'**The critical reversal: in LEDCs the rich live NEAR the CBD; in MEDCs the rich live FAR from the CBD.**\n\n**Structure your essay:**\n\n1. **Decision**: "I agree to a large extent — locations differ significantly."\n\n2. **Differences:**\n   - **High-class housing**: LEDC near CBD (security, services) | MEDC outer suburbs (lower density, gardens)\n   - **Low-class housing**: LEDC outer edges (informal/squatter) | MEDC inner city (older tenement areas)\n   - **Informal settlements**: LEDC has shanty towns on the edges; MEDC effectively does not\n\n3. **Similarities**: Medium-class is in inner suburbs in both.\n\n4. **Justification**: The reversal is driven by which areas have services/security — these things are central in LEDCs but spread to suburbs in MEDCs.',
    true
  );

  -- ════════════════════════════════════════════════════════════════════════
  -- Q6 — HIV/AIDS
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q6(a)(i)  Define AIDS  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, case_sensitive, memo, explanation, is_published
  ) values (
    geo_id, 2024, '1', '6(a)(i)', 1, 'free',
    'fill_in',
    E'**6 (a)(i)** Define the term *AIDS*.',
    jsonb_build_object(
      'accepted', jsonb_build_array(
        'Acquired Immune Deficiency Syndrome',
        'Acquired Immunodeficiency Syndrome',
        'Acquired Immune-Deficiency Syndrome'
      ),
      'must_contain', jsonb_build_array('immune')
    ),
    false,
    E'**Correct answers:**\n• Acquired Immune-Deficiency Syndrome (correct acronym expansion)\n• Serious condition whereby the immune system of a person is weak to fight off illnesses\n• A disease caused by HIV\n[1]\n\nNB: Acronym spelling must be correct.\n\n**Examiner commentary:** Common misspellings — Immunity (not Immune), Defense (not Deficiency), Syndrum (not Syndrome).',
    E'**AIDS** = **A**cquired **I**mmune-**D**eficiency **S**yndrome.\n\nMemorise each word:\n• **Acquired** — you catch it (not born with it)\n• **Immune** — your immune system\n• **Deficiency** — gets weak / deficient\n• **Syndrome** — collection of symptoms\n\nSpelling matters for the mark.',
    true
  );

  -- ─── Q6(a)(ii)  Condom use impacts on population structure  [3 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '6(a)(ii)', 3, 'paid',
    'free_text',
    E'**6 (a)(ii)** Describe the positive impacts of condom use on the population structure of Namibia.',
    E'**Correct answers (any three — must refer to population STRUCTURE):**\n• More adults — fewer adults dying / higher life expectancy\n• Fewer orphans — fewer adults dying\n• More older people / higher life expectancy\n• Consistent demography of males and females — fewer adults dying\n• Low infant mortality — more children born healthy\n• Low birth rate — fewer young people / population growth slows\n• Low death rate / total population decline\n\n[3 marks — any three]\n\n**Examiner commentary:** Learners gave general benefits of condoms (prevents STDs, prevents pregnancy) instead of population-structure effects.',
    E'Award 1 mark per impact ON POPULATION STRUCTURE (age/sex/numbers of demographic groups). PENALISE: generic "prevents STDs", "prevents pregnancy" without linking to demographic structure.',
    E'**"Population structure"** = the shape of the population by age & sex (the population pyramid). How condoms reshape it:\n\n1. **Fewer adult deaths** → wider adult bands in the pyramid → higher life expectancy\n2. **Fewer orphans** → children stay with both parents → stable family unit\n3. **Lower birth rate** → narrower base of the pyramid (fewer babies)\n4. **More elderly** → top of the pyramid grows over decades\n\nDon''t write "stops spread of HIV" alone — connect it to the structure.',
    true
  );

  -- ─── Q6(a)(iii)  Negative social impacts of HIV in LEDCs  [4 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '6(a)(iii)', 4, 'paid',
    'free_text',
    E'**6 (a)(iii)** Describe the negative social impacts of HIV and AIDS on Less Economically Developed Countries (LEDCs) like Namibia.',
    E'**Correct answers (any four — social impacts):**\n• Stigma (against HIV-positive people)\n• Orphans and vulnerable children\n• Loss of productive members of society\n• Overburdened healthcare systems\n• School dropouts (children stay home to care for sick parents)\n• Gender inequalities\n• Political instability\n• Increased poverty / loss of income (people too sick to work)\n• Broken family structures\n• Increased suicide / depression\n• Discrimination\n• Crime\n\n[4 marks — any four]\n\n**Examiner commentary:** Learners gave ECONOMIC impacts (government spending, lost labour) instead of social.',
    E'Award 1 mark per SOCIAL impact (any 4). Social = affecting people, relationships, communities. PENALISE: economic impacts (lost GDP, ARV costs, lost labour productivity) — those are economic not social.',
    E'**Social** impacts = affecting people''s lives, relationships, status — not the economy. Four strong choices:\n\n1. **Orphans** — Namibia has ~100,000 AIDS orphans → vulnerable children, no parental care\n2. **Stigma & discrimination** — HIV-positive people rejected by family, community, employers\n3. **School dropouts** — children pulled out of school to care for sick parents or earn money\n4. **Broken families** — both parents sometimes die, extended family overburdened\n\nDon''t write "government spends money on ARVs" — that''s economic.',
    true
  );

  -- ─── Q6(a)(iv)  Government efforts managing HIV  [5 marks, paid] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '6(a)(iv)', 5, 'paid',
    'free_text',
    E'**6 (a)(iv)** Explain the efforts taken by the government in managing problems caused by HIV and AIDS in Namibia.',
    E'**Correct answers (any five with explanation):**\n• Awareness campaigns — government uses media to educate about risks\n• Treatment — free access to ARVs for HIV-positive people\n• Counselling and support services\n• Research — develop new prevention and treatment methods\n• Legal protections — legislate against HIV-based discrimination\n• Women emancipation / gender equality — reduce transactional sex\n• Free condom distribution — for safe sex\n• Support for orphans — lost parents to HIV/AIDS\n\nTwo+ efforts with detailed explanation = full marks. Descriptions only = max 3.\n\n[5 marks — any five]\n\n**Examiner commentary:** Some gave general advice (people must use condoms) not government efforts.',
    E'Award up to 5 marks: each effort must be GOVERNMENT action AND have explanation. PENALISE: individual advice ("people must abstain"); generic "government provides jobs" without HIV link; descriptions cap at 3 marks.',
    E'**Government-led** efforts only (not individual behaviour). Five real Namibian programmes:\n\n1. **Free ARV treatment** — government clinics provide antiretrovirals to all who test positive (~200,000 people on ART)\n2. **National awareness campaigns** — radio, TV, billboards in all languages, school programmes\n3. **Free condom distribution** — clinics, schools, public toilets\n4. **PMTCT** — Prevention of Mother-To-Child Transmission programme: free testing for pregnant women, prophylactic treatment for newborns\n5. **OVC support** — Orphans & Vulnerable Children grants under Ministry of Social Welfare\n\nDon''t write "people should abstain" — that''s individual advice, not government effort.',
    true
  );

  -- ─── Q6(b)(i)  Calculate HIV-positive population  [3 marks, paid, calculation] +diagram ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '6(b)(i)', 3, 'paid',
    'calculation',
    E'**(b)** Read the newspaper extract about HIV/AIDS prevalence and incidence in Namibia.\n\n> *Namibia has a generalized HIV epidemic, with 8.3% of the general population of 2 500 000 living with HIV. HIV/AIDS was responsible for an estimated 3 052 deaths in 2020, and the disease remains the leading cause of death among adults and among children under 5 years of age. Among adults under 25 years of age, women bear a disproportionate burden of the HIV epidemic, with a prevalence of 19.6% compared to 12.7% for men. An estimated 0.98% of children under 15 years of age are HIV infected.*  \n> *Source: 2020 Spectrum Model.*\n\n**(b)(i)** Use the information from the newspaper extract to calculate the number of people living with HIV. Show all your working.',
    '/past-papers/geography-nssco-2024-p1/q6b-hiv-extract.png',
    jsonb_build_object(
      'value', 207500,
      'tolerance', 0,
      'accept_units', jsonb_build_array('people', 'persons', '', 'individuals')
    ),
    E'**Correct working (3 marks):**\n• 8.3/100 (1 mark — convert percentage)\n• 0.083 × 2 500 000 (1 mark — substitution)\n• = 207 500 (1 mark — final answer)\n\nNB: Correct final answer alone can earn maximum marks without showing working.\n\n[3 marks]\n\n**Examiner commentary:** Majority did not show understanding of percentage calculations.',
    E'Award 3 marks: (1) convert 8.3% to fraction/decimal; (1) multiply by 2,500,000; (1) correct final answer 207,500. PENALISE: adding multiple percentages (19.6 + 12.7), forgetting to divide by 100.',
    E'**Step by step:**\n\n1. **Read off the data**: 8.3% of 2,500,000 are HIV-positive\n2. **Convert percentage** to a decimal: 8.3 ÷ 100 = **0.083**\n3. **Multiply**: 0.083 × 2,500,000 = **207,500**\n\nAnswer: **207,500 people**\n\nDon''t add 19.6% + 12.7% etc — those are sub-group prevalences, not the overall total.',
    true
  );

  -- ─── Q6(b)(ii)  Demographic impacts from extract  [4 marks, paid] +shared diagram ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '6(b)(ii)', 4, 'paid',
    'free_text',
    E'**(b)** Read the newspaper extract about HIV/AIDS prevalence and incidence in Namibia.\n\n> *Namibia has a generalized HIV epidemic, with 8.3% of the general population of 2 500 000 living with HIV. HIV/AIDS was responsible for an estimated 3 052 deaths in 2020, and the disease remains the leading cause of death among adults and among children under 5 years of age. Among adults under 25 years of age, women bear a disproportionate burden of the HIV epidemic, with a prevalence of 19.6% compared to 12.7% for men. An estimated 0.98% of children under 15 years of age are HIV infected.*  \n> *Source: 2020 Spectrum Model.*\n\n**(b)(ii)** Use the information from the newspaper extract to describe the negative demographic impacts of HIV and AIDS in Namibia.',
    '/past-papers/geography-nssco-2024-p1/q6b-hiv-extract.png',
    E'**Correct answers (any four — must ANALYSE the extract, not lift quotes):**\n• More males than females in the adult population (women die more from HIV)\n• Less adult / working-age population\n• Birth rate decreases\n• Death rate increases / total population decreases\n• Reduced life expectancy\n• Increase in infant mortality (0.98% of children HIV-positive)\n\n0 marks for LIFTING (directly copying lines from the extract).\n\n[4 marks — any four]\n\n**Examiner commentary:** Learners lifted information from the extract instead of analysing it.',
    E'Award 1 mark per demographic impact INFERRED from the data. PENALISE: direct copying of extract sentences = 0 marks; impacts not supported by the extract numbers.',
    E'**Demographic** = affecting birth rate, death rate, age structure, sex ratio, life expectancy. The extract has clues — INTERPRET them, don''t COPY them.\n\n1. **Sex ratio shifts** — 19.6% women vs 12.7% men under 25 are HIV+ → more women dying → male/female ratio becomes uneven\n2. **Death rate rises** — 3,052 deaths from HIV/AIDS in 2020 → high mortality\n3. **Life expectancy falls** — leading cause of death in adults → average lifespan drops\n4. **Infant mortality** — 0.98% of children HIV+ → babies die young\n5. **Working-age population shrinks** — adults are dying in their productive years\n\nThe examiner gives 0 for copying. Always re-state in your own words.',
    true
  );

  -- ─── Q6(c)  AOC: ARVs beneficial to Namibian economy  [5 marks, paid, essay] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '1', '6(c)', 5, 'paid',
    'free_text',
    E'**(c)** How far do you agree that the provision of antiretroviral drugs to people who are HIV positive is beneficial to the economy of Namibia?',
    E'**Mark allocation (5 marks):**\n• Reserve 4 marks — judgment of accurate facts\n• Reserve 1 mark — decision\n\n**Disadvantages to the economy:**\n• Increased government spending on ARVs that could have funded other sectors\n• Government earns nothing from ARVs (given free)\n\n**Advantages to the economy:**\n• Increased productivity — healthier people work → higher GDP\n• More young/healthy children → consistent future workforce\n\nDecision rules: certain/large/full extent.\n\n**Examiner commentary:** Learners failed to evaluate; presented general ARV benefits without filtering to economic ones. Some confused ARVs with harmful drugs.',
    E'Award up to 5 marks: 4 for balanced economic evaluation (disadvantages vs advantages); 1 for explicit decision. PENALISE: pure ARV-medical-benefits without economic link; "ARVs save lives" without economic angle.',
    E'**Structure:**\n\n1. **Decision**: "I agree to a large extent — ARVs are beneficial to the economy on balance."\n\n2. **Advantages (economic):**\n   • **Higher productivity** — HIV+ workers stay healthy and keep working → contributes to GDP (~30% of working-age Namibians are HIV+)\n   • **Less workforce loss** — fewer adults die in their prime working years\n   • **Less spending on orphan support** — parents alive means fewer wards of the state\n   • **Future workforce protected** — PMTCT means HIV-free babies\n\n3. **Disadvantages (economic):**\n   • **Huge ARV bill** — government spends N$1bn+/year on ARVs that could fund schools, roads\n   • **No direct income** — ARVs given free, no government revenue from them\n\n4. **Verdict**: "Largely beneficial — productivity & workforce gains outweigh the cost, especially long-term."',
    true
  );

end$$;
