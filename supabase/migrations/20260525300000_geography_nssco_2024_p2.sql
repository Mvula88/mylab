-- ===========================================================================
-- NSSCO Geography 2024 Paper 2 (6137/2) — 7 questions, all answered,
-- 42 sub-parts, 65 marks. Data-response paper with 1:50k Lüderitz map
-- extract + 10 figures/photographs.
--
-- Verbatim NIED wording from past-papers/nssco-geography/2024/6137_2.pdf
-- Mark schemes from DNEA Examiners Report 2024 (Geography P2, PDF 489–505).
-- Diagrams: public/past-papers/geography-nssco-2024-p2/*.png
--
-- Q1 (22m) Lüderitz 1:50k map — scale, distance, area, bearing, services
-- Q2  (7m) River photograph + longitudinal profile sketch
-- Q3  (8m) Jornada climate graph (Chihuahuan Desert)
-- Q4  (7m) World coal/oil reserves (table + pie charts)
-- Q5  (7m) Tourism Namibia map + tourist bar chart
-- Q6  (7m) Rural settlement diagram + Windhoek CBD photograph
-- Q7  (7m) World population graph + 4 population pyramids
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
  -- Q1 — Lüderitz 1:50,000 map  [22 marks]
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q1(a)(i)  Scale type  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '1(a)(i)', 1, 'free',
    'fill_in',
    E'Study the 1:50 000 map extract of Lüderitz (Namibia) and answer the questions.\n\n**1 (a)(i)** Identify the type of scale shown on the map.',
    '/past-papers/geography-nssco-2024-p2/q1-luderitz-map.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
        'ratio scale',
        'linear scale',
        'word scale',
        'ratio',
        'linear',
        'word',
        'numeral scale',
        'scale bar',
        '1:50000',
        '1:50 000'
      )
    ),
    false,
    E'**Correct answers (any one):**\n• by a ratio — 1:50 000\n• by a combination of figures and text — 2 cm represents 1 km (word scale)\n• by the use of a scale bar / linear scale / numeral scale\n[1]\n\n**Examiner commentary:** Most candidates scored. Wrong: "contour scale", "map scale", "calculating distance".',
    E'The map shows **three forms** of scale:\n• **Ratio/representative fraction**: 1:50,000\n• **Linear scale / scale bar**: the ruler at the bottom\n• **Word scale**: "2 cm represents 1 km"\n\nAny one of these three names earns the mark.',
    true
  );

  -- ─── Q1(a)(ii)  Runway distance  [3m, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '1(a)(ii)', 3, 'paid',
    'calculation',
    E'**1 (a)(ii)** Measure and calculate the distance of the runway of the airstrip north-east of Kolmanskop in **metres**. Show all your workings.',
    '/past-papers/geography-nssco-2024-p2/q1-luderitz-map.png',
    jsonb_build_object(
      'value', 1850,
      'tolerance', 50,
      'accept_units', jsonb_build_array('m', 'metres', 'meters')
    ),
    E'**Correct working (3 marks):**\n• 3.7 cm × 50 000 = 185 000  (measurement & multiplication)\n• 185 000 ÷ 100 = 1850 m  (conversion cm→m)\n• Answer: 1850 m  (range 1800–1900 m)\n\nMark allocation:\n• 1 mark: measurement in cm or mm\n• 1 mark: appropriate conversion to metres\n• 1 mark: answer in metres\n\nNB: Do not double-penalise if the candidate carries a measurement mistake through their answer.\n\n[3 marks]\n\n**Examiner commentary:** Most candidates confused conversion. Many divided by 100 000 instead of 100.',
    E'Award up to 3 marks: (1) measurement on map (3.6–3.8 cm); (1) correct application of map scale × 50 000; (1) final answer in metres (1800–1900 m). PENALISE: leaving answer in cm; dividing by 100 000 (gives km, not m); no working.',
    E'**Three steps for 3 marks:**\n\n1. **Measure** the runway on the map with a ruler — about **3.7 cm**\n2. **Multiply by scale**: 3.7 × 50,000 = 185,000 cm\n3. **Convert to metres**: 185,000 ÷ 100 = **1,850 m**\n\nCommon mistake: dividing by 100,000 — that gives kilometres (1.85 km), not metres. The question asks for metres.\n\nAccepted range: 1800–1900 m.',
    true
  );

  -- ─── Q1(a)(iii)  Penguin Island area  [4m, paid, calculation] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '1(a)(iii)', 4, 'paid',
    'calculation',
    E'**1 (a)(iii)** Calculate the area of Penguin Island in **square metres**. Show all your workings.',
    '/past-papers/geography-nssco-2024-p2/q1-luderitz-map.png',
    jsonb_build_object(
      'value', 625000,
      'tolerance', 175000,
      'accept_units', jsonb_build_array('m²', 'm2', 'square metres', 'square meters', 'sq m')
    ),
    E'**Correct working (4 marks):**\n• Length: 2.5 cm (2.3–2.7) × 50 000 ÷ 100 = 1250 m (1150–1350 m)\n• Breadth: 1 cm (0.8–1.2) × 50 000 ÷ 100 = 500 m (400–600 m)\n• Area = L × B = 1250 × 500 = **625 000 m²** (range 460 000 – 810 000 m²)\n\n[4 marks]\n\n**Examiner commentary:** Most candidates left this blank or calculated co-ordinates instead. Could not apply Area = L × B.',
    E'Award up to 4 marks: (1) length measured + converted; (1) breadth measured + converted; (1) apply Area = L × B; (1) correct final answer in m² within tolerance. PENALISE: leaving answer in cm² or km²; using only one dimension; no working.',
    E'**Four steps:**\n\n1. **Length**: measure on map → 2.5 cm; convert → 2.5 × 50,000 ÷ 100 = **1,250 m**\n2. **Breadth**: measure → 1 cm; convert → 1 × 50,000 ÷ 100 = **500 m**\n3. **Apply formula**: Area = L × B = 1,250 × 500\n4. **Final answer**: = **625,000 m²**\n\nAccepted range: 460,000 – 810,000 m². Units MUST be m² — not cm² or km².',
    true
  );

  -- ─── Q1(a)(iv)  Compass direction + bearing  [2m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '1(a)(iv)', 2, 'paid',
    'free_text',
    E'**1 (a)(iv)** Determine the **compass direction** and calculate the **bearing** from spot height 199 in the north eastern corner of the mapped area to the spot height 65 east of Agate Park in Lüderitz.\n\n*Write your answer as:*\n*Compass direction: ___*\n*Bearing: ___°*',
    '/past-papers/geography-nssco-2024-p2/q1-luderitz-map.png',
    E'**Correct answers (2 marks):**\n• Compass direction: South West / West South West (1)\n• Bearing: 245° (range 243°–247°) OR 218°–222° (1)\n\n[2 marks]\n\n**Examiner commentary:** Many gave NW, NE, SE or left unanswered. Bearings of 56°, 216° were wrong. Many measured DIRECTION instead of bearing.',
    E'Award 2 marks: (1) compass direction SW or WSW; (1) bearing in three digits within 243°–247° (or 218°–222°). PENALISE: NW/NE/SE (wrong quadrant); bearing without degree symbol or fewer than 3 digits; direction "left" or "back".',
    E'**Method:**\n\n1. Find spot height 199 (NE corner of map)\n2. Find spot height 65 (east of Agate Park in Lüderitz, central west area)\n3. Draw a line from 199 → 65\n4. **Direction**: the line points toward the **south-west** → answer: **South West (SW)** or **West South West (WSW)**\n5. **Bearing**: place protractor at 199 with 0° pointing **due north**; measure clockwise to your line\n   - Result is around **245°** (range 243–247°)\n\nBearings are always 3 digits (e.g. 045°, 245°). Direction TO the destination, measured clockwise from north.',
    true
  );

  -- ─── Q1(b)(i)  2 coastal physical features  [2m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '1(b)(i)', 2, 'paid',
    'free_text',
    E'**1 (b)(i)** Write down two coastal physical features along the coast of Lüderitz.',
    '/past-papers/geography-nssco-2024-p2/q1-luderitz-map.png',
    E'**Correct answers (any two):**\n• Islands\n• Bays\n• Lagoons\n• Points / Headlands\n• Cliffs\n• Beaches / sand\n• Dunes\n\n[2 marks]\n\n**Examiner commentary:** Most candidates gave man-made features (services, monuments, marine beacon, light house) or non-coastal (rivers, lakes, perennial water). Sea/ocean alone scores 0.',
    E'Award 1 mark per coastal PHYSICAL feature (any 2). PENALISE: man-made features (lighthouse, marine beacon, services); generic "sea/ocean" alone; landforms not on the coast (rivers, lakes, dry water courses).',
    E'**Coastal physical features** = natural landforms shaped by the sea/wind on the coastline.\n\nFrom the Lüderitz map, look for:\n• **Bays** — curved indents of water (e.g. Lüderitz Bay, Robert Harbour)\n• **Islands** — Penguin Island\n• **Points / Headlands** — Diaz Point, Shearwater Point\n• **Lagoons** — sheltered shallow water bodies behind a barrier\n• **Beaches**, **dunes**, **cliffs**\n\n**Not coastal features:** monuments, beacons, lighthouses, marine lights — those are HUMAN.',
    true
  );

  -- ─── Q1(b)(ii)  2 services + map evidence  [4m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '1(b)(ii)', 4, 'paid',
    'free_text',
    E'**1 (b)(ii)** Write down two services provided to the people of Lüderitz and provide map evidence to support your answers.\n\n*Format your answer as:*\n*Service 1: ___ ; Evidence 1: ___*\n*Service 2: ___ ; Evidence 2: ___*',
    '/past-papers/geography-nssco-2024-p2/q1-luderitz-map.png',
    E'**Correct answers (any two paired):**\n\n| Service | Map evidence |\n|---|---|\n| Education | School symbol |\n| Health / Medical | Health facility symbol |\n| Administration | Post Office / Police Station |\n| Religious / Worship | Church symbol |\n| Recreation | Golf Course |\n| Electricity | Power lines |\n| Transport / Communication | Railway / roads / airport |\n\n[4 marks — 2 services × (service + evidence)]\n\n**Examiner commentary:** Most confused services with evidence and listed evidence twice. Wrong evidence: "2 people walking", "railway lines" as a service.',
    E'Award 4 marks: 2 services × (1 service name + 1 valid map symbol/feature). PENALISE: same item listed as both service and evidence; vague evidence ("buildings", "lines"); services not visible on the legend.',
    E'For each service, name it **and** point to its evidence on the map:\n\n**Service 1 — Education**\nEvidence: **School symbol** marked on the map\n\n**Service 2 — Health/Medical**\nEvidence: **Health facility symbol** (medical cross)\n\nOther valid pairs:\n• Administration → Post Office / Police Station symbol\n• Religious → Church\n• Recreation → Golf Course\n• Transport → Railway / Roads / Airport / Aerodrome\n\nThe evidence must be a recognisable **map feature/symbol**, not just a repeat of the service name.',
    true
  );

  -- ─── Q1(b)(iii)  Reasons for growth of Lüderitz  [4m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '1(b)(iii)', 4, 'paid',
    'free_text',
    E'**1 (b)(iii)** Give reasons for the growth of the settlement of Lüderitz.',
    '/past-papers/geography-nssco-2024-p2/q1-luderitz-map.png',
    E'**Correct answers (any four — must link to map evidence):**\n• Coastal location — supports fishing / tourism\n• Lower-lying / gentle-sloping land — easy to build on\n• Trunk / district / other roads — transport access\n• Railway line / railway station — transport\n• Services available (school, health, etc.) — jobs and income\n• Power lines — electricity supply\n• Harbour — trade / jobs / transport\n• Nampwater camp — water source\n• Mining / mines (nearby Kolmanskop) — economic activity\n\n[4 marks — any four with reason]\n\n**Examiner commentary:** Candidates gave irrelevant reasons (fertile soil, agriculture, Benguela current) not supported by the map. Some answered "use the word IMPROVED" which is nonsense.',
    E'Award 1 mark per reason for growth that is supported by the map (any 4). PENALISE: factors NOT visible on map (fertile soil, irrigation, Benguela current); generic "high population"; reasons applicable to any settlement.',
    E'For 4 marks, give 4 reasons each backed by what you see on the map:\n\n1. **Coastal location** → enables fishing industry & port activity (you can see ships and harbour)\n2. **Harbour / quay** visible on map → trade, jobs, import/export\n3. **Roads & railway** lead into town → transport links to interior\n4. **Flat land** around the bay → easy to build houses, factories, airport\n5. **Services present** (school, church, post office) → attracts more people\n6. **Mining nearby** (Kolmanskop ghost town shows historical diamond mining) → historical economic driver\n\nEach reason should be linked to something visible on the map.',
    true
  );

  -- ─── Q1(c)  Kolmanskop coordinates  [2m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '1(c)', 2, 'paid',
    'free_text',
    E'**1 (c)** Find and calculate the co-ordinates (latitude and longitude) of the monument at Kolmanskop Ghost Town. Give your answer in degrees, minutes and seconds.\n\n*Format: __° __'' __'''' S, __° __'' __'''' E*',
    '/past-papers/geography-nssco-2024-p2/q1-luderitz-map.png',
    E'**Correct answers (2 marks):**\n• Latitude: 26° 42'' 24'''' S  (seconds range 21–27)\n• Longitude: 15° 13'' 43'''' E  (seconds range 42–44)\n\nDo not penalise on degrees or minutes — focus on seconds accuracy.\n\nMark allocation:\n• 1 mark: South co-ordinate (latitude)\n• 1 mark: East co-ordinate (longitude)\n\n[2 marks]\n\n**Examiner commentary:** Learners could not measure accurately — seconds outside acceptable range.',
    E'Award 2 marks: (1) latitude with correct degrees & minutes (26° 42''), seconds within 21–27; (1) longitude (15° 13''), seconds within 42–44. PENALISE: missing S or E indicator; degrees off by more than 1; seconds outside tolerance.',
    E'**Method:**\n\n1. Find Kolmanskop Ghost Town (south-east of Lüderitz on the map)\n2. Look at the **latitude** (horizontal lines, marked on edges):\n   - It''s between 26° 42'' and 26° 43''\n   - Estimate seconds: about **24''''** (within 21–27)\n   - **Latitude: 26° 42'' 24'''' S**\n3. Look at the **longitude** (vertical lines):\n   - Between 15° 13'' and 15° 14''\n   - Estimate seconds: **43''''** (within 42–44)\n   - **Longitude: 15° 13'' 43'''' E**\n\nAlways add **S** for southern latitudes and **E** for eastern longitudes (Namibia is south of equator, east of Greenwich).',
    true
  );

  -- ════════════════════════════════════════════════════════════════════════
  -- Q2 — River valley photograph + longitudinal profile  [7 marks]
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q2(a)(i)  Name landform  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '2(a)(i)', 1, 'free',
    'fill_in',
    E'**Photograph A** shows an upper part of a river and its valley.\n\n**2 (a)(i)** Name one landform from **Photograph A**.',
    '/past-papers/geography-nssco-2024-p2/q2-waterfall.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
        'waterfall',
        'rapids',
        'interlocking spurs',
        'gorge',
        'canyon',
        'cliffs',
        'plunge pool',
        'V-shaped valley',
        'V shaped valley'
      )
    ),
    false,
    E'**Correct answers (any one):**\n• Waterfall\n• Rapids\n• Interlocking spurs\n• Gorge / Canyon\n• Cliffs\n• Plunge pool\n[1]\n\n**Examiner commentary:** Most candidates identified landforms correctly. Wrong: "headland" (that''s coastal not river).',
    E'The photo shows an **upper-course river**. Key features visible:\n• **Waterfall** — water dropping over a step\n• **Plunge pool** — pool at the base of the waterfall\n• **Interlocking spurs** — ridges that interlock from each side\n• **V-shaped valley** — steep narrow sides\n\nAny ONE name from these earns the mark.',
    true
  );

  -- ─── Q2(a)(ii)  2 ways river transports load  [2m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '2(a)(ii)', 2, 'free',
    'fill_in',
    E'**2 (a)(ii)** State two ways how the river transports its load in this part of the river.\n\n*Format: 1. ___  2. ___*',
    '/past-papers/geography-nssco-2024-p2/q2-waterfall.png',
    jsonb_build_object(
      'must_contain', jsonb_build_array('traction')
    ),
    false,
    E'**Correct answers (any two):**\n• Traction — large stones rolled along the bed\n• Saltation — small pebbles bounce along the bed\n• Suspension — fine particles carried within the water column\n• Solution — minerals dissolved in water\n[2 marks]\n\n**Examiner commentary:** Many candidates listed erosional processes (abrasion, hydraulic action, attrition) or deposition. Those are NOT transport processes.',
    E'**Four river transport processes** (memorise the order from largest to smallest particles):\n\n1. **Traction** — boulders & large stones ROLL along the river bed\n2. **Saltation** — small pebbles BOUNCE along the bed\n3. **Suspension** — fine sand & silt FLOAT within the water column\n4. **Solution** — minerals DISSOLVED in the water\n\nPick any TWO. Don''t confuse with **erosion** processes (abrasion, attrition, hydraulic action, corrosion).',
    true
  );

  -- ─── Q2(a)(iii)  Features of river valley  [2m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '2(a)(iii)', 2, 'paid',
    'free_text',
    E'**2 (a)(iii)** Describe the features of the river valley shown in **Photograph A**.',
    '/past-papers/geography-nssco-2024-p2/q2-waterfall.png',
    E'**Correct answers (any two — use descriptive terms not just names):**\n• Deep • V-shaped • Interlocking spurs\n• Bare rocks • Rocky / mountainous / hilly\n• Pale / multicoloured rocks\n• Little / sparse vegetation\n• Steep sides\n• Narrow valley / river fills the floor\n• Forest / coniferous / pine trees\n• Cliffs / gorge\n• Shallower valley / wider valley\n• White / clear / splashing water\n• Waterfall / falling water\n[2 marks — any two with descriptive terms]\n\n**Examiner commentary:** Learners used nouns (rocks, mountains) instead of descriptive adjectives (rocky, mountainous).',
    E'Award 1 mark per descriptive feature (any 2). Must be ADJECTIVE/DESCRIPTIVE, not bare noun. PENALISE: "rocks" alone (use "rocky"); "mountains" (use "mountainous"); pure list of landforms without description.',
    E'**Use descriptive adjectives, not just nouns.** The examiner wants WORDS THAT DESCRIBE, not lists of things.\n\nGood answer: *"The valley is **steep-sided** and **narrow**, with **bare rocky** slopes and **sparse vegetation**. The river floor is **shallow** with **fast-flowing white water**."*\n\nBad answer: *"Rocks, mountains, water, trees, cliffs."* — zero descriptive terms.\n\nKey adjectives to use: deep • narrow • steep • rocky • bare • mountainous • V-shaped • forested • fast-flowing.',
    true
  );

  -- ─── Q2(b)(i)  Labels on longitudinal profile sketch  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '2(b)(i)', 1, 'paid',
    'free_text',
    E'**Fig. 1** is a sketch of the longitudinal profile of the section of the river valley shown in **Photograph A**, with three labelled points A (top), B (middle, steep drop), C (bottom).\n\n**2 (b)(i)** Add two labels to the sketch to describe the river at **A**, **B**, or **C**.\n\n*Write your two labels below — specify which point each refers to.*',
    '/past-papers/geography-nssco-2024-p2/q2-long-profile.png',
    E'**Correct answers (1 mark for any 2 correct labels):**\n• A: gentle slope / smooth flow / upper course / resistant rock\n• B: very steep / steep drop / waterfall / middle course / cliff\n• C: irregular flow / rapids / rocky / lower course / less resistant rock\n\nMark allocation:\n• 1 mark: 2 correct labels\n• 0 marks: only 1 correct label\n\n[1 mark]\n\n**Examiner commentary:** Most got it right; some confused with marine features (headland), or labelled A as source and C as mouth (wrong — these are points along the upper-course profile).',
    E'Award 1 mark for at least 2 valid labels matching A/B/C correctly. PENALISE: marine terms (headland, beach); labelling A as "source" or C as "mouth" (only 3 points along an upper-course profile, none are the actual source/mouth).',
    E'Looking at Fig. 1''s longitudinal profile (a side-view of the river bed):\n\n• **A** (top, gentle slope) → "**gentle slope / smooth flow**"\n• **B** (the steep drop) → "**waterfall / steep cliff**"\n• **C** (bottom, irregular bed) → "**rapids / rocky / irregular flow**"\n\nWrite at least 2 labels that match the position. Don''t use marine terms (no beaches or headlands on a river profile).',
    true
  );

  -- ─── Q2(b)(ii)  AOC: People object to dam  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '2(b)(ii)', 1, 'paid',
    'free_text',
    E'**2 (b)(ii)** Discuss how far you agree that people might object to a plan to build a dam across this valley.',
    '/past-papers/geography-nssco-2024-p2/q2-long-profile.png',
    E'**Correct answers (1 mark — decision + reason):**\n\n*Reasons to AGREE (people object):*\n• Displacement of communities — relocation needed\n• Loss of farmland — fertile land submerged\n• Seismic risks — large dams can trigger earthquakes\n• Flooding risks if dam fails\n• Impaired water quality — stagnation, eutrophication\n\n*Reasons to DISAGREE (people support):*\n• Economic development — jobs in construction\n• Flood control — regulates river flow\n• Water supply — reliable for agriculture, industry, domestic\n• Hydropower generation — renewable energy\n• Irrigation — boosts farming\n• Recreation & tourism — boating, fishing\n• Drinking water quality improvement\n\n[1 mark — any one decision-supported reason]\n\n**Examiner commentary:** Learners failed to connect dam-building to community impact. Wrong: "Very steep, water too fast, too much run-off".',
    E'Award 1 mark for an explicit decision (agree/disagree) supported by ONE specific community/economic/environmental impact. PENALISE: physical descriptions of the river (steep, fast water) without dam-impact link; no decision stated.',
    E'**Structure**: take a side + give one solid reason.\n\n**Example "agree, people will object":**\n> "I agree to a large extent. Building a dam would **displace communities** living downstream when their land is flooded, and **submerge fertile farmland** that supports their livelihoods."\n\n**Example "disagree, dam will be welcomed":**\n> "I disagree — most people would support the dam because it provides **reliable water supply**, **generates hydropower**, and **creates jobs** during construction."\n\nState the decision, give one specific impact. 1 mark.',
    true
  );

  -- ════════════════════════════════════════════════════════════════════════
  -- Q3 — Jornada climate graph (Chihuahuan Desert)  [8 marks]
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q3(a)(i)  Range of temperature  [1m, free, numeric] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, tolerance, unit,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '3(a)(i)', 1, 'free',
    'numeric',
    E'**Fig. 2** shows a climatic graph for Jornada, an area in the Chihuahuan Desert of Mexico.\n\n**3 (a)(i)** Calculate the range of temperature for the area.\n\n*Answer in °C.*',
    '/past-papers/geography-nssco-2024-p2/q3-climate-graph.png',
    '24',
    2,
    '°C',
    E'**Correct answer:** 24 °C (range 22–26)\n[1]\n\n**Examiner commentary:** Learners calculated the total or average instead of the range. Wrong answers: 25, 23, 32.',
    E'**Range = highest − lowest**\n\nFrom the graph:\n• Highest temperature: ~37 °C (June)\n• Lowest temperature: ~13 °C (December/January)\n• **Range = 37 − 13 = 24 °C**\n\nDon''t add them together (that''s a sum) or divide (that''s the average). RANGE is the gap between max and min.',
    true
  );

  -- ─── Q3(a)(ii)  Total annual rainfall  [1m, free, numeric] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, tolerance, unit,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '3(a)(ii)', 1, 'free',
    'numeric',
    E'**3 (a)(ii)** Calculate the total annual rainfall of this area.\n\n*Answer in mm.*',
    '/past-papers/geography-nssco-2024-p2/q3-climate-graph.png',
    '244',
    5,
    'mm',
    E'**Correct answer:** 244 mm (range 239–249 mm; margin ±5 mm)\n[1]\n\n**Examiner commentary:** Learners calculated the average. Some used the temperature scale instead of rainfall. Wrong: 10 mm, 156 mm, 4.47.',
    E'**Total annual rainfall** = sum of all 12 monthly rainfall bars.\n\nFrom the graph, the monthly rainfall values are approximately:\n• Jan 5, Feb 2, Mar 2, Apr 5, May 15, Jun 45, Jul 55, Aug 35, Sep 20, Oct 15, Nov 18, Dec 27\n\n**Sum ≈ 244 mm** (acceptable range 239–249 mm).\n\nUse the **right-hand axis** (precipitation in mm), NOT the temperature axis.',
    true
  );

  -- ─── Q3(a)(iii)  Compare Jan/July rainfall + reason  [2m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '3(a)(iii)', 2, 'paid',
    'free_text',
    E'**3 (a)(iii)** Compare the average monthly rainfall at Jornada in January and July. Suggest a reason for this difference.\n\n*Format your answer as:*\n*Comparison: ___*\n*Reason for difference: ___*',
    '/past-papers/geography-nssco-2024-p2/q3-climate-graph.png',
    E'**Correct answers (2 marks):**\n\n*Comparison (1 mark):*\n• January lower rainfall than July / July higher\n• January ~9 mm while July ~56 mm (use data)\n\n*Reason (1 mark — any one):*\n• January is winter / dry season — high atmospheric pressure\n• July is summer / wet season / tropical storms — low pressure systems\n• Higher temperature in July, lower in January\n\n[2 marks]\n\n**Examiner commentary:** Learners compared TEMPERATURE not rainfall. Some compared different months or the whole graph. Reasons given without specifying months.',
    E'Award 2 marks: (1) comparison of January vs July RAINFALL using comparative terms (higher/lower) + ideally data; (1) reason linked to pressure system or season. PENALISE: comparing temperature instead of rainfall; comparing the wrong months; no comparison word.',
    E'**Comparison (1 mark):**\n> "January has **much lower** rainfall (~9 mm) than July (~56 mm) — July has roughly 6× more."\n\n**Reason (1 mark):**\n> "July is **summer** in the northern hemisphere, when a **low-pressure system** brings warm rising air that cools and condenses into rain. January is **winter** with a **high-pressure system** that gives dry stable conditions."\n\nUse comparative words (**higher/lower/more than**) and include numbers from the graph.',
    true
  );

  -- ─── Q3(b)(i)  Variation of temperatures during year  [2m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '3(b)(i)', 2, 'paid',
    'free_text',
    E'**3 (b)(i)** Describe the variation of temperatures at Jornada during the year.',
    '/past-papers/geography-nssco-2024-p2/q3-climate-graph.png',
    E'**Correct answers (2 marks):**\n• Temperature INCREASES from January to June / higher in June compared to January (1 — summer)\n• Temperature DECREASES from June to December / lower in December than June (1 — winter)\n• Temperature FLUCTUATES across the year\n\n[2 marks]\n\n**Examiner commentary:** Many learners did not understand "variation". They compared rainfall instead. Wrong: "It is hot throughout the year", "cold summers and cold winters".',
    E'Award 2 marks: (1) summer description (rises Jan→June, peaks ~June); (1) winter description (falls July→December). Must use trend words (increase/decrease) and reference specific months. PENALISE: variation of rainfall (wrong variable); single-word answers; "always hot/cold".',
    E'**Variation** = how the temperature CHANGES across the year.\n\nFor 2 marks, describe BOTH halves of the year:\n\n1. **First half (rising)**: "Temperature **increases** from January (about 13 °C) to a peak in **June** at around **37 °C**."\n2. **Second half (falling)**: "Then temperature **decreases** from June through to December, falling back to about **13 °C**."\n\nUse trend words: **increases / decreases / peaks / falls**. Reference months. Use data from the graph.',
    true
  );

  -- ─── Q3(b)(ii)  AOC: Low pressure → rainfall  [2m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '3(b)(ii)', 2, 'paid',
    'free_text',
    E'**3 (b)(ii)** Discuss how far you agree that the weather associated with low pressure will always lead to rainfall.',
    '/past-papers/geography-nssco-2024-p2/q3-climate-graph.png',
    E'**Correct answers (2 marks — 1 decision + 1 discussion):**\n\n*AGREE because:*\n• Converging air — converges to centre, rises, cools, condenses → clouds → rainfall\n• Rising air — upward motion, expansion, cooling, condensation, rain\n• Convection — vertical air movement creates cumulonimbus clouds with heavy rain\n• Moisture availability — low-pressure systems associated with moist air\n• Atmospheric instability — rising air + moisture + temperature contrast → clouds, precipitation\n\n*DISAGREE because:*\n• Lack of moisture — dry air won''t produce rain even with low pressure\n• Stable atmosphere — air resists vertical motion → no clouds form\n• Lack of triggering mechanisms — pressure alone is not sufficient\n• Lack of instability — stable atmosphere hinders rain development\n• Subsidence — sinking air can suppress cloud formation\n\nMark allocation:\n• 1 mark: decision made\n• 1 mark: discussion\n\n[2 marks]\n\n**Examiner commentary:** Learners confused pressure systems with temperature.',
    E'Award 2 marks: (1) explicit decision; (1) one substantive reason (agree or disagree). PENALISE: confusion of pressure with temperature; "low pressure is good for weather" without mechanism; no decision.',
    E'**Structure:**\n\n1. **Decision**: "I agree to a certain extent" or "I disagree to a large extent"\n\n2. **One discussion point:**\n\n   **Agree**: "Low pressure causes air to **rise, cool, and condense**, which forms clouds and produces rain — this is the standard mechanism for convectional and frontal rainfall."\n   \n   **Disagree**: "Low pressure does NOT always bring rain — **dry air with no moisture** cannot form rain regardless of pressure. Deserts can have low pressure but no rain because there is no moisture to condense."\n\nMake a clear decision + one supporting mechanism. 2 marks.',
    true
  );

  -- ════════════════════════════════════════════════════════════════════════
  -- Q4 — World coal & oil reserves  [7 marks]
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q4(a)(i)  Define non-renewable  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '4(a)(i)', 1, 'free',
    'fill_in',
    E'Table 1 and Fig. 3 give information about world coal and oil reserves. Coal and oil are referred to as non-renewable energy sources.\n\n**4 (a)(i)** Define *non-renewable energy sources*.',
    '/past-papers/geography-nssco-2024-p2/q4-reserves.png',
    jsonb_build_object(
      'must_contain', jsonb_build_array('run out')
    ),
    false,
    E'**Correct answer:** Sources that will run out / become exhausted / take very long to be replaced (faster used than replaced); [1]\n\n**Examiner commentary:** Most learners scored. Wrong: "can be recycled", "cannot be depleted", "used over and over".',
    E'**Non-renewable** = will **run out** / become exhausted because they are used **faster than nature can replace** them.\n\nExamples: coal, oil, natural gas, uranium — formed over millions of years but consumed in decades.\n\nOpposite = **renewable** (solar, wind, hydro, biomass — these regenerate naturally).',
    true
  );

  -- ─── Q4(a)(ii)  Latin America coal percentage  [1m, free, numeric] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, tolerance, unit,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '4(a)(ii)', 1, 'free',
    'numeric',
    E'**4 (a)(ii)** Complete Table 1 by giving the percentage of coal reserves for Latin America.\n\n*Table 1 shows Latin America has 11.4 billion tonnes of a total 1034.5 billion tonnes.*\n\n*Answer in %.*',
    '/past-papers/geography-nssco-2024-p2/q4-reserves.png',
    '1',
    0,
    '%',
    E'**Correct answer:** 1 (%)  (11.4 ÷ 1034.5 × 100 ≈ 1.1, rounded to 1)\n[1]\n\n**Examiner commentary:** Learners did not know how to compute percentage. Wrong: 1.1, 3.6, 0.5.',
    E'**Percentage** = (part ÷ whole) × 100\n\n= (11.4 ÷ 1034.5) × 100\n= 1.1 %\n\nRounded to whole number = **1 %**\n\n(All the other percentages in Table 1 are whole numbers — Asia 31, Africa 6, Europe & Russia 37, North America 24, Middle East 1. So 1.1 is rounded to 1 to match the table.)',
    true
  );

  -- ─── Q4(a)(iii)  Complete pie chart  [2m, paid, free_text drawing] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '4(a)(iii)', 2, 'paid',
    'free_text',
    E'**4 (a)(iii)** Use the information in Table 1 to complete the pie chart in **Fig. 3** for the world coal reserves for **Latin America** and **Europe & Russia**. Use the key provided.\n\n*Sketch the missing segments on paper (Latin America = 1%, Europe & Russia = 37%). In the box below, describe the size and shading of each segment you would add.*',
    '/past-papers/geography-nssco-2024-p2/q4-reserves.png',
    E'**Correct answers (2 marks):**\n• 1 mark: correct division of the pie segments (Latin America 1% ≈ 3.6°; Europe & Russia 37% ≈ 133°)\n• 1 mark: correct shading using the KEY provided (Latin America = diagonal hatching; Europe & Russia = dark grey solid)\n\n[2 marks]\n\n**Examiner commentary:** Most could not plot the pie chart correctly. Some failed to shade properly. Many left it blank.',
    E'Award 2 marks: (1) correct division of segments to scale (Latin America ~3.6°, Europe & Russia ~133°); (1) correct shading from the key (matches Latin America pattern, Europe & Russia pattern). PENALISE: wrong size; using wrong key pattern; blank answer.',
    E'**Calculate segment angles:**\n\n• Latin America: 1% × 360° = **3.6°** (very thin slice)\n• Europe & Russia: 37% × 360° = **133.2°** (a third of the circle)\n\n**Sketch on paper:**\n1. Draw the missing **Latin America slice** — very narrow, shade with **diagonal hatching** (per the key)\n2. Draw the **Europe & Russia slice** — about 1/3 of the circle, shade **solid dark grey** (per the key)\n\nIn the box, describe: *"Added a thin 3.6° slice for Latin America with diagonal hatching, and a 133° slice for Europe & Russia with dark grey solid shading."*',
    true
  );

  -- ─── Q4(b)(i)  Complete paragraph (4 blanks)  [2m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '4(b)(i)', 2, 'free',
    'fill_in',
    E'**4 (b)(i)** Use Table 1 and Fig. 3 to complete the following paragraph by writing the correct answers in the open spaces.\n\n*Fill in all four blanks:*\n\n*1. Over half of the oil reserves are found in: ___*\n*2. The world''s coal reserves are found mostly in three of the six areas: Asia & Australia, Europe & Russia and ___*\n*3. The continent with less than 10% of the world reserves of both oil and coal is: ___*\n*4. Countries are developing the use of renewable sources such as: ___*',
    '/past-papers/geography-nssco-2024-p2/q4-reserves.png',
    jsonb_build_object(
      'must_contain', jsonb_build_array('middle east', 'north america', 'africa')
    ),
    false,
    E'**Correct answers:**\n1. Over half of the oil reserves are found in the **Middle East**\n2. World''s coal reserves mostly in Asia & Australia, Europe & Russia, and **North America**\n3. Continent with <10% of both oil and coal: **Africa**\n4. Renewable sources: **wind / solar / wave / geothermal / HEP (hydro) / tidal / biomass**\n\nMark allocation:\n• 2 marks: 4 correct\n• 1 mark: 2 or 3 correct\n• 0 marks: 1 correct\n\n[2 marks]\n\n**Examiner commentary:** Most could not match answers to the pie chart and table.',
    E'**Read the pie charts + Table 1 carefully:**\n\n1. **Oil reserves**: dominant slice is the Middle East (over half)\n2. **Coal reserves**: dominant areas are Asia & Australia (31%), Europe & Russia (37%), and **North America (24%)**\n3. **Africa**: oil <10% and coal only 6% — neither resource is plentiful here\n4. **Renewable sources** examples: **wind, solar, hydro/HEP, geothermal, tidal, wave, biomass** (any one)\n\nDon''t write "coal" or "oil" for blank 4 — those are non-renewable.',
    true
  );

  -- ─── Q4(b)(ii)  AOC: Regions still use oil  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '4(b)(ii)', 1, 'paid',
    'free_text',
    E'**4 (b)(ii)** Discuss how far you agree with many world regions still using oil as a source of energy.',
    '/past-papers/geography-nssco-2024-p2/q4-reserves.png',
    E'**Correct answers (1 mark — decision + reason):**\n\n*AGREE because:*\n• Oil reserves still plentiful and accessible\n• High energy density — efficient to transport/store\n• Existing infrastructure for extraction, refining, distribution\n• Economic benefits — jobs, revenue for oil-dependent countries\n• Trade & geopolitics — oil exports influence global markets\n• Familiarity — decades of established industrial processes\n\n*DISAGREE because:*\n• Environmental impact — greenhouse gases, climate change\n• Finite resource — being depleted faster than formed\n• Price volatility — geopolitical disruption causes unstable costs\n• Energy transition — countries moving to cleaner alternatives\n• Renewable technology — solar/wind cheaper and cleaner now\n\n[1 mark — any one with decision]\n\n**Examiner commentary:** Learners repeated the question or lifted answers without comparing oil to other sources.',
    E'Award 1 mark for explicit decision + one supporting reason. PENALISE: pure description of oil without judgement; lifting question text; "oil is cheap" without comparison.',
    E'**Structure: decision + one reason.**\n\n**Agree**: "I agree — oil is still widely used because the **infrastructure for extraction and distribution already exists**, and it has very **high energy density** making it efficient to transport and store."\n\n**Disagree**: "I disagree — many regions are now **shifting to renewable energy** because oil causes **greenhouse-gas emissions** and prices are **unstable due to geopolitical conflicts**."\n\nGive the decision + one reason. 1 mark.',
    true
  );

  -- ════════════════════════════════════════════════════════════════════════
  -- Q5 — Namibia tourism map + tourist bar chart  [7 marks]
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q5(a)(i)  Define leisure  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '5(a)(i)', 1, 'free',
    'fill_in',
    E'The map in **Fig. 4** shows features important to tourism in Namibia.\n\n**5 (a)(i)** Define the term *leisure*.',
    '/past-papers/geography-nssco-2024-p2/q5-tourism-map.png',
    jsonb_build_object(
      'must_contain', jsonb_build_array('free time')
    ),
    false,
    E'**Correct answer:** Use of free time for enjoyment / relaxation; [1]\n\n**Examiner commentary:** Many confused leisure with tourism (moving from one place to another).',
    E'**Leisure** = how you spend your **free time** for **enjoyment, rest or relaxation**.\n\nKey words: free time, enjoyment, relaxation, hobbies.\n\nDon''t confuse with **tourism** (travelling away from home for pleasure) — leisure can happen at home (watching TV, reading, sport).',
    true
  );

  -- ─── Q5(a)(ii)  Name 1 national park  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '5(a)(ii)', 1, 'free',
    'fill_in',
    E'**5 (a)(ii)** From **Fig. 4**, name **one** national park.',
    '/past-papers/geography-nssco-2024-p2/q5-tourism-map.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
        'Namib Naukluft National Park',
        'Namib-Naukluft National Park',
        'Namib Naukluft',
        'Skeleton Coast National Park',
        'Skeleton Coast',
        'Etosha National Park',
        'Etosha',
        'Mundumu National Park',
        'Mundumu',
        'Mamili National Park',
        'Mamili'
      )
    ),
    false,
    E'**Correct answers (any one):**\n• Namib Naukluft National Park\n• Skeleton Coast National Park\n• Etosha National Park\n• Mundumu National Park\n• Mamili National Park\n[1]\n\n**Examiner commentary:** Wrong: "Pan", "Park", "National Park", or game parks like Kaudom (a game PARK, not a national park).',
    E'The map shows **5 national parks** in Namibia (marked with the X symbol per the key):\n\n• **Etosha** National Park (north — wildlife)\n• **Namib-Naukluft** National Park (central west — desert/dunes)\n• **Skeleton Coast** National Park (north-west coast — wrecks, seals)\n• **Mundumu** National Park (Caprivi)\n• **Mamili** National Park (Caprivi)\n\nGame parks (Kaudom, Mahango, Hardap, etc.) are NOT national parks — different category.',
    true
  );

  -- ─── Q5(a)(iii)  Communication type making tourism possible  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '5(a)(iii)', 1, 'free',
    'fill_in',
    E'**5 (a)(iii)** According to **Fig. 4**, what type of communication makes tourism possible between different attractions in Namibia?',
    '/past-papers/geography-nssco-2024-p2/q5-tourism-map.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
        'roads',
        'road',
        'main roads',
        'main road'
      )
    ),
    false,
    E'**Correct answer:** Main road / road; [1]\n\n**Examiner commentary:** Learners could not identify the communication from the map KEY. Wrong: "internet", "social media advertisement", names of parks.',
    E'**Look at the key on Fig. 4**: the lines connecting all the tourist attractions are labelled **"Main roads"**.\n\nIn the geography sense, **communication** refers to transport links (roads, rail, air) NOT digital communication (internet, phone).\n\nAnswer: **roads / main roads**.',
    true
  );

  -- ─── Q5(a)(iv)  Natural feature on Skeleton Coast  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '5(a)(iv)', 1, 'free',
    'fill_in',
    E'**5 (a)(iv)** Name an outstanding natural feature on the Skeleton Coast Park.',
    '/past-papers/geography-nssco-2024-p2/q5-tourism-map.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
        'Sossusvlei',
        'Cape Cross Seal Reserve',
        'Cape Cross',
        'Hot Springs',
        'hot springs'
      )
    ),
    false,
    E'**Correct answers (any one):**\n• Sossusvlei\n• Cape Cross Seal Reserve\n• Hot Springs\n[1]\n\n**Examiner commentary:** Learners gave features not visible on Fig. 4. Wrong: "dunes", "desert", "skeleton", "coast".',
    E'On Fig. 4, look at the **Skeleton Coast Park** area (the long shaded strip along the north-west coast). The map''s star symbols mark "outstanding natural features".\n\nVisible features in or on the Skeleton Coast Park:\n• **Cape Cross Seal Reserve** — large seal colony\n• **Hot Springs**\n• **Sossusvlei** (in Namib-Naukluft, sometimes grouped with the Skeleton Coast region)\n\nAvoid generic terms like "dunes" or "the coast" — must be a NAMED specific feature.',
    true
  );

  -- ─── Q5(b)(i)  Complete bar chart (2000 & 2012)  [2m, paid, free_text drawing] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '5(b)(i)', 2, 'paid',
    'free_text',
    E'**Fig. 5** gives information about the number of tourists of the world in 2000, 2006 and 2012. The 2006 bar (1.68 million) is already drawn.\n\n**5 (b)(i)** Complete Fig. 5 to show the world''s tourist numbers in 2000 and 2012.\n\n*Values:* 2000 = 1 330 000   2012 = 1 880 000\n\n*Sketch the two missing bars on paper. In the box below, describe the height each bar should reach (in millions) and the shading you would use.*',
    '/past-papers/geography-nssco-2024-p2/q5-tourist-bar.png',
    E'**Correct answers (2 marks):**\n• 1 mark: correct plotting — bar heights match 1.33 million (2000) and 1.88 million (2012) on the y-axis\n• 1 mark: shading using the key provided (solid black bar pattern matching the 2006 bar)\n\n[2 marks]\n\n**Examiner commentary:** Could not plot the correct numbers, although most could use the key correctly.',
    E'Award 2 marks: (1) correct bar heights — 2000 reaches 1.33 (between 1.3 and 1.4 on y-axis); 2012 reaches 1.88 (between 1.8 and 1.9); (1) shading matches the 2006 bar (solid black). PENALISE: heights way off; wrong shading.',
    E'**Bar 1 — Year 2000:** 1,330,000 = **1.33 million**\nDraw a bar reaching just above the 1.3 line on the y-axis.\n\n**Bar 2 — Year 2012:** 1,880,000 = **1.88 million**\nDraw a bar reaching just below the 1.9 line on the y-axis.\n\n**Shading:** Both bars must use the **same solid black shading** as the existing 2006 bar (per the key).\n\nIn the box, describe: *"Drew a bar at 2000 reaching 1.33 million, and a bar at 2012 reaching 1.88 million, both shaded solid black to match the 2006 bar."*',
    true
  );

  -- ─── Q5(b)(ii)  AOC: Tourism economic advantage for local communities  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '5(b)(ii)', 1, 'paid',
    'free_text',
    E'**5 (b)(ii)** Discuss how far you agree that the tourism industry can provide an economic advantage for local communities.',
    '/past-papers/geography-nssco-2024-p2/q5-tourist-bar.png',
    E'**Correct answers (1 mark — decision + reason):**\n\n*AGREE because:*\n• Economic growth — tourism brings money, stimulates local economy\n• Job creation — employment for local residents\n• Increased income — higher earnings for locals\n• Small business support — helps shops/lodges grow\n• Infrastructure development — roads, airports, public facilities\n• Preservation of cultural heritage — promotes local customs/landmarks\n\n*DISAGREE because:*\n• High cost of living rises — locals priced out of housing\n• Seasonal employment — income instability\n• Loss of cultural identity — commodification of culture\n• Increased pollution — transport, waste\n• Inequality — profits go to corporations, not locals\n• Noise pollution\n• Increased crime\n\n[1 mark — decision + reason]\n\n**Examiner commentary:** Most learners could give the economic advantage but failed to make an evaluation.',
    E'Award 1 mark for explicit decision + one supported reason. PENALISE: no decision; generic "tourism is good"; "provide food for tourists" (not an economic benefit to community).',
    E'**Structure**: decision + one specific economic point.\n\n**Agree:** "I agree to a large extent — tourism creates **direct jobs** for locals as guides, lodge staff, and drivers, and supports **small businesses** like craft markets and restaurants."\n\n**Disagree:** "I disagree to a small extent because tourism profits often flow to **foreign-owned lodges** rather than local communities, and **seasonal employment** leaves workers without income for months."\n\nIn Namibia, conservancies are a strong example: ~$1.5bn N$ revenue/year stays with local communities (favours "agree").',
    true
  );

  -- ════════════════════════════════════════════════════════════════════════
  -- Q6 — Rural settlement diagram + Windhoek photograph  [7 marks]
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q6(a)(i)  Define urban sprawl  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '6(a)(i)', 1, 'free',
    'fill_in',
    E'Study **Fig. 6**, which shows a rural area with settlements X, Y and Z.\n\n**6 (a)(i)** Define the term *urban sprawl*.',
    '/past-papers/geography-nssco-2024-p2/q6-rural-area.png',
    jsonb_build_object(
      'must_contain', jsonb_build_array('spread')
    ),
    false,
    E'**Correct answer:** The spreading of urban structures into areas surrounding a city / undeveloped land / countryside / outskirts; [1]\n\n**Examiner commentary:** Learners confused with urbanisation or rural-urban migration.',
    E'**Urban sprawl** = a city **spreading outwards** into the surrounding countryside.\n\nKey words: **spread, expansion, outwards, countryside, outskirts**.\n\nDifferent from:\n• **Urbanisation** = proportion of people in towns going up\n• **Rural-urban migration** = people MOVING from countryside to cities\n\nSprawl is about the city''s **physical area** growing.',
    true
  );

  -- ─── Q6(a)(ii)  Settlement pattern at Z  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '6(a)(ii)', 1, 'free',
    'fill_in',
    E'**6 (a)(ii)** Identify the rural settlement pattern at **Z**.',
    '/past-papers/geography-nssco-2024-p2/q6-rural-area.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
        'dispersed',
        'scattered',
        'dispersed pattern',
        'scattered pattern'
      )
    ),
    false,
    E'**Correct answer:** Dispersed / Scattered pattern; [1]\n\n**Examiner commentary:** Some misspelt as "sparsely pattern".',
    E'At Z on Fig. 6, the houses are spread far apart with no clear pattern — this is a **dispersed** (or **scattered**) settlement pattern.\n\nThe three main rural patterns:\n• **Nucleated** — houses clustered together\n• **Linear** — houses in a line along a road or river\n• **Dispersed / Scattered** — houses spread out, no pattern\n\n"Sparsely" is an adverb meaning "thinly", not the name of a pattern.',
    true
  );

  -- ─── Q6(a)(iii)  Describe linear pattern Y  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '6(a)(iii)', 1, 'paid',
    'free_text',
    E'**6 (a)(iii)** Use the diagram to describe the linear pattern of settlement **Y**.',
    '/past-papers/geography-nssco-2024-p2/q6-rural-area.png',
    E'**Correct answer:** Built **along** the road; [1]\n\n**Examiner commentary:** Most candidates said "near", "close to" or "next to" the road — wrong. Linear means ALONG.',
    E'Award 1 mark for "along the road" or equivalent (e.g. "in a line following the road"). PENALISE: "next to", "near", "close to" the road — these don''t describe a LINEAR pattern.',
    E'**Linear** literally means "in a line" — the houses are built **ALONG** the road, not just NEAR it.\n\nLook at Y on the diagram: the houses form a straight line that follows the road.\n\n**Don''t write:** "next to the road" or "close to the road" — those don''t capture the linear arrangement.\n\n**Write:** "**Built along the road**" or "**arranged in a line following the road**".',
    true
  );

  -- ─── Q6(a)(iv)  Reason for X growth  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '6(a)(iv)', 1, 'free',
    'fill_in',
    E'**6 (a)(iv)** Use **Fig. 6** to give a reason for the growth of settlement **X**.',
    '/past-papers/geography-nssco-2024-p2/q6-rural-area.png',
    jsonb_build_object(
      'must_contain', jsonb_build_array('road')
    ),
    false,
    E'**Correct answer:** Cross roads / road junction / multiple roads crossing / two roads crossing; [1]\n\n**Examiner commentary:** Candidates gave irrelevant reasons — deep fertile soil, flood plain, water supply.',
    E'Look at settlement X on Fig. 6: there is a **crossroads / road junction** where two roads meet.\n\n**Cross roads** are a classic reason for settlement growth — they provide:\n• Multiple transport directions\n• A natural meeting point for trade\n• Access from all directions\n\nDon''t write "fertile soil" or "flood plain" — those don''t appear at X on the diagram.',
    true
  );

  -- ─── Q6(b)(i)  Urban part + evidence (Windhoek)  [2m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '6(b)(i)', 2, 'paid',
    'free_text',
    E'**Photograph B** shows part of a city in Namibia, Windhoek.\n\n**6 (b)(i)** Name the part of an urban settlement indicated in **Photograph B** and give one piece of evidence for your choice.\n\n*Format: Part: ___ ; Evidence: ___*',
    '/past-papers/geography-nssco-2024-p2/q6-windhoek.png',
    E'**Correct answers (2 marks):**\n• Part: **CBD / Central Business District** (1)\n• Evidence (any one):\n  - Large / tall buildings / skyscrapers / vertical zoning\n  - High volume of traffic / multiple traffic lanes\n  - Larger parking area\n\n[2 marks]\n\n**Examiner commentary:** Most candidates scored — some referred to "Windhoek city", "squatter settlement", or building names (Avani Hotel) which are wrong.',
    E'Award 2 marks: (1) "CBD" or "Central Business District"; (1) one valid piece of visible evidence (tall buildings / skyscrapers / multi-lane traffic / parking). PENALISE: city name (Windhoek); brand names (Avani); "residential area".',
    E'**Part:** This is the **CBD (Central Business District)** — the commercial heart of the city.\n\n**Evidence** (visible in the photo):\n• **Tall buildings / skyscrapers** — vertical zoning typical of a CBD\n• **Multi-lane roads** with heavy traffic\n• Mix of **offices, hotels, banks** — commercial functions\n\nDon''t name the city itself ("Windhoek") or specific buildings ("Avani") — those don''t identify the URBAN PART.',
    true
  );

  -- ─── Q6(b)(ii)  AOC: Multiple lanes solve congestion  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '6(b)(ii)', 1, 'paid',
    'free_text',
    E'**6 (b)(ii)** Discuss how far you agree that multiple traffic lanes in **Photograph B** solve the problem of traffic congestion.',
    '/past-papers/geography-nssco-2024-p2/q6-windhoek.png',
    E'**Correct answers (1 mark — decision + reason):**\n\n*AGREE because:*\n• Increased capacity — higher volume of vehicles\n• Enhanced flow — vehicles move at different speeds, less weaving\n• Improved lane discipline — drivers stay in lane\n• Easier merging — more options to merge\n• Reduced stop-and-go traffic — switching lanes to avoid stopping\n\n*DISAGREE because:*\n• Increased complexity — more confusion for drivers\n• Limited effectiveness — attracts more cars, congestion persists\n• Increased accident risk — lane-changing collisions\n• Difficulty changing lanes in heavy traffic\n• Reduced space for public transport infrastructure\n\n[1 mark — any one with decision]\n\n**Examiner commentary:** Candidates repeated the question or wrote about traffic officers.',
    E'Award 1 mark for explicit decision + one substantive reason. PENALISE: question repetition; "people move freely" without mechanism; no decision.',
    E'**Structure**: take a side + give one specific reason.\n\n**Agree:** "I agree to a large extent — multiple lanes **increase the road''s capacity**, so more vehicles can pass through at once and traffic flows more smoothly."\n\n**Disagree:** "I disagree — adding more lanes often **attracts more drivers** to the road (induced demand), and congestion returns within a few years. Better solutions are public transport investment."\n\nGive your decision + one reason. 1 mark.',
    true
  );

  -- ════════════════════════════════════════════════════════════════════════
  -- Q7 — World population graph + 4 population pyramids  [7 marks]
  -- ════════════════════════════════════════════════════════════════════════

  -- ─── Q7(a)(i)  Projected 2050 population  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '7(a)(i)', 1, 'free',
    'fill_in',
    E'**Fig. 7** shows the world''s population and projected world population change from 1750 to 2050.\n\n**7 (a)(i)** What is the projected population for 2050?',
    '/past-papers/geography-nssco-2024-p2/q7-population.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
        '9 billion',
        '9billion',
        '9 000 000 000',
        '9,000,000,000',
        '9000000000'
      )
    ),
    false,
    E'**Correct answer:** 9 billion (read from the total-population line at 2050); [1]\n\n**Examiner commentary:** Most learners scored. Wrong: 3.2, 8.5, 3.3 billion (misread axis).',
    E'Read from the **total population curve** (right-hand axis in billions) at the year 2050.\n\nThe line reaches approximately **9 billion** in 2050.\n\nDouble-check you''re reading the correct line — the bars show ANNUAL INCREMENTS (left-hand axis, millions), not total population.',
    true
  );

  -- ─── Q7(a)(ii)  Reason for population explosion from 1950  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '7(a)(ii)', 1, 'paid',
    'free_text',
    E'**7 (a)(ii)** From 1950, the world experienced a "population explosion". Give **one** reason for this population explosion.',
    '/past-papers/geography-nssco-2024-p2/q7-population.png',
    E'**Correct answers (any one):**\n• Illiteracy and lack of awareness about birth control measures\n• Increased food production / agriculture (Green Revolution)\n• Increased hygiene / sanitation\n• Advancements in medical research / vaccines / antibiotics\n• Increased life expectancy\n• Healthier diets / better nutrition\n• Increased birth rate / higher fertility rates\n[1]\n\n**Examiner commentary:** Some confused with reasons for high birth rate (traditional beliefs, church beliefs) — those are pre-1950 factors. Population explosion AFTER 1950 is mostly driven by FALLING DEATH RATES.',
    E'Award 1 mark for any one of the listed factors. PENALISE: "traditional beliefs", "church beliefs", "immigration" (those don''t explain global explosion); "low life expectancy" (wrong direction).',
    E'The **population explosion** after 1950 happened because **death rates fell faster than birth rates** — more babies survived, more adults lived longer.\n\n**One clear reason:**\n• **Medical advances** — vaccines, antibiotics, better surgery → fewer people die from disease\n• **Improved hygiene & sanitation** → fewer infant deaths\n• **Increased food production** (Green Revolution) → no widespread famine\n• **Higher life expectancy** → people live decades longer\n\nAny ONE of these earns the mark.',
    true
  );

  -- ─── Q7(b)(i)a  Pyramid: decreasing birth rate  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '7(b)(i)a', 1, 'free',
    'fill_in',
    E'**Fig. 8** shows population pyramids of four countries A, B, C and D.\n\n**7 (b)(i)** Which pyramid in Fig. 8 is most likely to show:\n\n**(a)** the country with a **decreasing birth rate**?\n\n*Answer with one letter: A, B, C, or D.*',
    '/past-papers/geography-nssco-2024-p2/q7-pyramids.png',
    jsonb_build_object(
      'accepted', jsonb_build_array('C', 'D', 'c', 'd')
    ),
    false,
    E'**Correct answer:** C or D; [1]\n\n**Examiner commentary:** Some confused birth rate with death rate. The narrowing of the base of the pyramid indicates a decreasing birth rate.',
    E'**Decreasing birth rate** = narrowing BASE of the pyramid (fewer babies & young children).\n\n• **A** — wide base (high birth rate, LEDC type)\n• **B** — bulging in middle (constrictive)\n• **C** — narrow base (developed, low birth)\n• **D** — very narrow base (ageing population — Japan-like)\n\nLook at the **0–4 age band**: which pyramid has the smallest 0–4 share? That''s the one with a decreasing birth rate.\n\nAnswer: **C or D**.',
    true
  );

  -- ─── Q7(b)(i)b  Pyramid: lowest life expectancy  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '7(b)(i)b', 1, 'free',
    'fill_in',
    E'**7 (b)(i)** Which pyramid in Fig. 8 is most likely to show:\n\n**(b)** the country with the **lowest life expectancy**?\n\n*Answer with one letter: A, B, C, or D.*',
    '/past-papers/geography-nssco-2024-p2/q7-pyramids.png',
    jsonb_build_object(
      'accepted', jsonb_build_array('A', 'a')
    ),
    false,
    E'**Correct answer:** A; [1]\n\n**Examiner commentary:** Some confused life expectancy indicators with birth/death rate features.',
    E'**Lowest life expectancy** = pyramid has very FEW people at the top (very few elderly).\n\n• **A** — pyramid narrows sharply by age 60 → most people die before 60 → low life expectancy\n• **B, C** — wider top → more elderly → higher life expectancy\n• **D** — broad top → very high life expectancy (Japan-style)\n\nAnswer: **A** (classic LEDC pyramid — wide base, narrow top, short lives).',
    true
  );

  -- ─── Q7(b)(i)c  Pyramid: highest death rate  [1m, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    geo_id, 2024, '2', '7(b)(i)c', 1, 'free',
    'fill_in',
    E'**7 (b)(i)** Which pyramid in Fig. 8 is most likely to show:\n\n**(c)** the country with the **highest death rate**?\n\n*Answer with one letter: A, B, C, or D.*',
    '/past-papers/geography-nssco-2024-p2/q7-pyramids.png',
    jsonb_build_object(
      'accepted', jsonb_build_array('A', 'a')
    ),
    false,
    E'**Correct answer:** A; [1]\n\n**Examiner commentary:** Often confused with low life expectancy — they correlate but are not identical.',
    E'**Highest death rate** = pyramid narrows sharply between age groups (many people die at each stage of life).\n\n• **A** — each age band is narrower than the one below → people dying off rapidly → high death rate\n• **B, C, D** — wider, more even age distribution → lower death rates\n\nAnswer: **A** — typical LEDC pyramid with high death rate AND high birth rate.',
    true
  );

  -- ─── Q7(b)(ii)  Pyramid D ageing  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '7(b)(ii)', 1, 'paid',
    'free_text',
    E'**7 (b)(ii)** How does the shape of population pyramid **D** in **Fig. 8** indicate that the country has an ageing population?',
    '/past-papers/geography-nssco-2024-p2/q7-pyramids.png',
    E'**Correct answers (any one — must reference SHAPE):**\n• Broad / wide top (large elderly share)\n• Narrow base (few children)\n[1]\n\n**Examiner commentary:** Most learners failed to describe the SHAPE — they listed age structures or made vague statements. Wrong: "too many elderly 75+", "high life expectancy", "wide middle".',
    E'Award 1 mark for shape-related description: "broad/wide top" OR "narrow base". PENALISE: vague terms ("unequal shape"); listing age groups without shape; "low death rate" (not a shape).',
    E'**Ageing population** = many old people, few young people.\n\nLook at pyramid D''s **SHAPE**:\n• **Top is BROAD/WIDE** — many people aged 65+\n• **Base is NARROW** — few children (0–14)\n\nUse the word **"shape"** explicitly: *"The shape of pyramid D has a **broad/wide top** showing many elderly, and a **narrow base** showing few children — both features of an ageing population."*\n\nDon''t just say "many old people" — describe the SHAPE.',
    true
  );

  -- ─── Q7(b)(iii)  AOC: Infant mortality vs healthcare  [1m, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    geo_id, 2024, '2', '7(b)(iii)', 1, 'paid',
    'free_text',
    E'**7 (b)(iii)** Discuss how far you agree that there is a relationship between infant mortality rate and healthcare.',
    '/past-papers/geography-nssco-2024-p2/q7-pyramids.png',
    E'**Correct answers (1 mark — decision + reason):**\n\n*AGREE because:*\n• Access to healthcare reduces IMR — better prenatal/postnatal care for mothers and newborns\n• Prenatal care identifies maternal health issues, reducing pregnancy complications\n• Skilled birth attendants reduce childbirth deaths\n• Neonatal care saves newborns through resuscitation, temperature regulation\n• Immunisations protect infants from deadly diseases\n\n*DISAGREE because:*\n• Socio-economic factors (poverty, education, water, nutrition) also drive IMR\n• Cultural practices (birthing methods, breastfeeding) vary independently of healthcare\n• Inadequate prenatal care may exist alongside healthcare systems\n• Disparities in healthcare access — some groups miss out\n• Health education matters — knowledge of infant care\n\n[1 mark — decision + reason]\n\n**Examiner commentary:** Learners defined the two terms instead of explaining the relationship.',
    E'Award 1 mark for explicit decision + one supporting reason linking IMR ↔ healthcare. PENALISE: pure definitions of IMR/healthcare; "they work together" without mechanism; no decision.',
    E'**Structure**: decision + one reason.\n\n**Agree:** "I agree to a large extent — countries with **better healthcare systems** have lower infant mortality because mothers have **access to skilled birth attendants, immunisations, and neonatal care**, all of which save infant lives."\n\n**Disagree:** "I disagree to some extent — IMR also depends on **poverty, education, and nutrition** which are not purely healthcare. A country with good hospitals but widespread malnutrition will still have high IMR."\n\nGive decision + one specific reason. 1 mark.',
    true
  );

end$$;
