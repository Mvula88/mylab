-- ===========================================================================
-- NSSCO Biology 2023 Paper 2 (6116/2) — 8 questions, 35 sub-parts, 80 marks
-- Verbatim NIED wording from past-papers/nssco-biology/2023/
-- Mark scheme + commentary from DNEA Examiners Report 2023 (pages 50-58)
-- Diagrams: public/past-papers/biology-nssco-2023-p2/*.png
-- ===========================================================================

do $$
declare
  bio_id uuid;
begin
  select id into bio_id from public.subjects where slug = 'biology' limit 1;
  if bio_id is null then
    raise notice 'Biology subject not found — skipping seed';
    return;
  end if;

  -- ─── Q1(a)(i)  [4 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '1(a)(i)', 4, 'free',
    'fill_in',
    E'Fig. 1.1 shows a cross-section of a dicotyledonous leaf.\n\n**(a)(i)** Identify the tissues labelled **A**, **B**, **C** and **D**.',
    '/past-papers/biology-nssco-2023-p2/dicot-leaf.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'A upper epidermis B palisade mesophyll C spongy mesophyll D lower epidermis',
        'upper epidermis palisade mesophyll spongy mesophyll lower epidermis'
    )
, 'must_contain', jsonb_build_array('upper epidermis', 'palisade', 'spongy', 'lower epidermis')
    ),
    false,
    E'A — upper epidermis; B — palisade mesophyll; C — spongy mesophyll; D — lower epidermis; [4 marks, 1 each]\n\n**Examiner commentary:** Well-answered, however, most candidates could not spell the names of the tissues correctly. Wrong spellings included epidemic, epidemas, epiderm, pallaside mesophy, sponge mesophll. Some candidates referred to palisade and spongy mesophyll layers as ONE cell (e.g. ''palisade/mesophyll cell''). Use comparative terms ''upper'' and ''lower'' — NOT ''up'' and ''down''.',
    E'Four layers of a dicot leaf, top → bottom:\n• **A — upper epidermis** — thin transparent top layer; lets light in\n• **B — palisade mesophyll** — column-shaped cells packed with chloroplasts; main site of photosynthesis\n• **C — spongy mesophyll** — loosely-packed round cells with big air spaces between them for gas exchange\n• **D — lower epidermis** — bottom layer; has the stomata\n\nSpelling matters in this paper — write the full words.',
    true
  );

  -- ─── Q1(a)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '1(a)(ii)', 1, 'free',
    'fill_in',
    E'Fig. 1.1 shows a cross-section of a dicotyledonous leaf.\n\n**(a)(ii)** State the function of the cells labelled **Y**.',
    '/past-papers/biology-nssco-2023-p2/dicot-leaf.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'to open and close the stomata',
        'control the opening and closing of the stomata',
        'regulate opening and closing of stomata',
        'open and close stomata'
    )
, 'must_contain', jsonb_build_array('open', 'close')
    ),
    false,
    E'To open and close stomata / control / regulate opening and closing of stomata; [1 mark]\n\n**Examiner commentary:** Most candidates gave the function of the stomata instead of the guard cells. Some only gave a partial answer (e.g. ''to open the stomata'') — both opening AND closing must be mentioned.',
    E'Cells **Y** are **guard cells**. Each stoma (hole in the leaf) is surrounded by two banana-shaped guard cells. Their job is to **OPEN AND CLOSE** the stoma:\n• When the leaf needs gas exchange (CO₂ in, O₂ out) → guard cells swell with water and the stoma opens\n• When the leaf is losing too much water → guard cells become limp and the stoma closes\n\nDon''t confuse the cell (guard cell) with the hole (stoma).',
    true
  );

  -- ─── Q1(a)(iii)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '1(a)(iii)', 2, 'paid',
    'free_text',
    E'Fig. 1.1 shows a cross-section of a dicotyledonous leaf.\n\n**(a)(iii)** On Fig. 1.1 describe where you would draw a line to the **xylem** (label it **X**) and to the **phloem** (label it **P**). State which tissue is on top and which is on the bottom in the vascular bundle of the leaf.',
    '/past-papers/biology-nssco-2023-p2/dicot-leaf.png',
    E'X — labelled on xylem (upper / inner side of the vascular bundle, towards the upper epidermis); [1]\nP — labelled on phloem (lower / outer side of the vascular bundle, towards the lower epidermis); [1]\n\n**Examiner commentary:** Well answered overall, although some candidates couldn''t identify the exact location of xylem and phloem. Many wrote the NAMES of the parts instead of using letters X and P as the question instructed.',
    E'Award 1 mark for correctly identifying xylem as the UPPER part of the vascular bundle (closer to the upper epidermis). Award 1 mark for correctly identifying phloem as the LOWER part (closer to the lower epidermis). Mnemonic accepted: ''xylem above, phloem below'' in a leaf vein.',
    E'In a leaf''s vascular bundle (the ''vein''):\n• **Xylem (X)** — sits on TOP (towards the upper epidermis); carries water UP from the roots\n• **Phloem (P)** — sits on BOTTOM (towards the lower epidermis); carries dissolved sugars FROM the leaf to the rest of the plant\n\nMemory trick for the order in a LEAF: ''**X**ylem on to**X** (top), **P**hloem on **P**lant-floor (bottom).'' In a STEM vascular bundle, xylem is INNER and phloem is OUTER — it''s only in the leaf vein that they sit top/bottom.',
    true
  );

  -- ─── Q1(b)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '1(b)', 3, 'paid',
    'free_text',
    E'Fig. 1.1 shows a cross-section of a dicotyledonous leaf.\n\n**(b)** Explain **three** ways in which the structure of a leaf is adapted for photosynthesis.',
    '/past-papers/biology-nssco-2023-p2/dicot-leaf.png',
    E'Any 3 of (1 mark each):\n1. Chlorophyll / chloroplasts + absorb sunlight (to transfer energy) / move within mesophyll cells towards light;\n2. Network of veins / vascular bundle / xylem / phloem + support the leaf and transport water, mineral ions and sucrose / translocation of products of photosynthesis;\n3. Stomata + allow CO₂ to diffuse into the leaf and O₂ to diffuse out / gaseous exchange;\n4. Epidermis tissue + transparent to allow light to pass through;\n5. Cuticle + reduces water loss;\n6. Palisade mesophyll layer + more chloroplasts / closely packed / near the surface to maximise light interception / arranged at right angles to reduce cell walls light must pass through;\n7. Spongy mesophyll layer + air spaces for gaseous exchange;\n\n**Examiner commentary:** Poorly answered. Most candidates gave external features (broad, thin) instead of naming the internal structure AND explaining how it is adapted. Some misunderstood the question and described the PROCESS of photosynthesis instead of the structures.',
    E'Award 1 mark per adaptation (max 3). Each answer MUST have BOTH a structure AND its function/explanation — e.g. ''chloroplasts to absorb sunlight'' = 1 mark, but ''has chloroplasts'' alone = 0 marks. DO NOT credit external/whole-leaf features (broad, thin, flat) — the question is about internal structure adaptations.',
    E'Strategy: for each adaptation, name a STRUCTURE + explain WHY it helps photosynthesis. Three solid pairs:\n\n1. **Chloroplasts (in palisade cells)** contain chlorophyll → absorb light energy for photosynthesis.\n2. **Stomata (in lower epidermis)** + guard cells → let CO₂ in and O₂ out — needed for the reaction.\n3. **Network of veins (xylem + phloem)** → bring water in (xylem) and take sugars away (phloem).\n\nAvoid: ''leaf is broad/thin/flat'' — those are *external* features, not internal structural adaptations.',
    true
  );

  -- ─── Q2(a)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '2(a)', 3, 'paid',
    'free_text',
    E'Fig. 2.1 shows the application of systemic pesticides to a plant.\n\n**(a)** Describe how the pesticide reaches the leaves to kill the insects.',
    '/past-papers/biology-nssco-2023-p2/pesticide-plant.png',
    E'Any 3 of (1 mark each):\n1. Systemic pesticides are soluble;\n2. Absorbed by the roots / root hairs of the plant;\n3. Pass into the xylem;\n4. Transported up the xylem to the leaves;\n5. Taken in by insects eating / sucking the plant leaves;\n\n**Examiner commentary:** Most learners failed to apply their knowledge — they thought pesticides are transported by phloem instead of xylem when entering from the soil. Many also stated ''insects get pesticide from chewing'' without naming xylem transport. Some only stated ''pesticide gets to xylem'' but didn''t explain the full pathway.',
    E'Award 1 mark each (max 3). Must mention: (a) absorption by roots, (b) transport via XYLEM (not phloem — the pesticide is in soil), and (c) how the insect gets it. Wrong if: pesticide ''transported in phloem'' (only true when sprayed on leaves, not in soil); ''kills the plant'' (not the insect).',
    E'Pesticide journey when sprayed in soil:\n1. **Pesticide dissolves in soil water** (it is *soluble*)\n2. **Absorbed by root hair cells** along with water\n3. Passes into the **xylem** (water-transport tubes)\n4. **Transported UP** the xylem to the leaves\n5. **Insects eat or suck** the leaves → pesticide enters insect → insect dies\n\nKey error to avoid: when pesticide is applied to SOIL, it travels in XYLEM (not phloem). Phloem only transports it when sprayed directly on leaves.',
    true
  );

  -- ─── Q2(b)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '2(b)', 2, 'free',
    'fill_in',
    E'Fig. 2.1 shows the application of systemic pesticides to a plant.\n\nFig. 2.2 shows a cross-section through the stem of the plant in Fig. 2.1.\n\n**(b)** Which tissue in the stem (Fig. 2.2) will contain the higher concentration of the pesticide? Name the tissue.',
    '/past-papers/biology-nssco-2023-p2/stem-cross.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'xylem',
        'the xylem'
    )
, 'must_contain', jsonb_build_array('xylem')
    ),
    false,
    E'(i) any xylem shaded; [1]\n(ii) xylem; [1]\n[Total 2 marks]\n\n**Examiner commentary:** Fairly well answered. Some candidates shaded the WHOLE vascular bundle instead of only the xylem portion. A few used labelling lines with names instead of shading.',
    E'The **xylem** carries water + dissolved substances UP from the roots — including any soluble pesticide absorbed from the soil. So the xylem holds the highest concentration of pesticide in the stem.\n\nThe stem cross-section shows vascular bundles arranged in a ring. INSIDE each bundle: **xylem on the inner side** (towards the centre), **phloem on the outer side**. Only the xylem section gets shaded — not the whole vascular bundle.',
    true
  );

  -- ─── Q2(c)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '2(c)', 2, 'paid',
    'free_text',
    E'Fig. 2.1 shows the application of systemic pesticides to a plant.\n\n**(c)** Suggest the process leading to the uptake of the pesticide into the roots of the plant.',
    '/past-papers/biology-nssco-2023-p2/pesticide-plant.png',
    E'Any 2 of (1 mark each):\n1. Diffusion;\n2. Into root hair cells;\n3. Reference to concentration gradient of systemic pesticide (high in soil → low in root);\n4. Through cell walls / cell wall is permeable;\n\n**Examiner commentary:** Poorly answered. Most candidates described OSMOSIS instead of diffusion or active transport. Many said ''high to low'' without stating the area of concentration. Osmosis only moves water, not dissolved substances.',
    E'Award marks for: (a) naming diffusion (or active transport with concentration-gradient reasoning) — 1 mark; (b) reference to direction of concentration gradient with the LOCATION named (soil vs root) — 1 mark. PENALISE: ''high to low'' without naming WHERE; describing osmosis (osmosis = water only, not solutes).',
    E'Two possible processes:\n\n• **Diffusion** — if the pesticide is MORE concentrated in soil than inside the root, it moves *down* the gradient INTO root hair cells (passively).\n• **Active transport** — if the pesticide is LESS concentrated in soil than inside the root, ATP is needed to pull it AGAINST the gradient.\n\nDon''t say ''osmosis'' — osmosis ONLY moves water, not dissolved pesticide molecules.\n\nState the direction WITH locations: ''pesticide is more concentrated in the soil and less concentrated in the root cells → diffuses in.''',
    true
  );

  -- ─── Q2(d)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '2(d)', 3, 'paid',
    'free_text',
    E'Fig. 2.1 shows the application of systemic pesticides to a plant.\n\n**(d)** Systemic pesticide may be applied to the leaves. Describe the process occurring that causes the pesticide to move through the plant and kill insects.',
    '/past-papers/biology-nssco-2023-p2/pesticide-plant.png',
    E'All 3 marking points:\n1. Translocation;\n2. (Soluble) pesticide moves through the phloem;\n3. Insects suck up the pesticide in the sap;\n\n**Examiner commentary:** The majority identified the process correctly but focused on translocation of sucrose and amino acid instead of the pesticide. A few wrongly identified the process as diffusion or active transport. Candidates failed to mention that the pest is sucking contaminated PHLOEM SAP — they described chewing leaves instead.',
    E'Award 1 mark each: (1) name the process as TRANSLOCATION; (2) state it moves in the PHLOEM; (3) explain insects SUCK the contaminated phloem sap. PENALISE: diffusion or active transport (wrong process for leaf-to-plant); ''insect eats/chews leaf'' (this paper specifies sap-sucking).',
    E'When pesticide is sprayed on LEAVES (not soil), the route is different:\n\n1. **Translocation** = movement of dissolved substances in the phloem\n2. Pesticide enters the leaf and is transported in the **phloem** (along with sugars)\n3. The phloem carries it all over the plant\n4. **Insects suck the phloem sap** (the contaminated liquid) → take pesticide → die\n\nLeaf-applied pesticide → phloem. Soil-applied pesticide → xylem. Don''t mix the two routes up.',
    true
  );

  -- ─── Q3(a)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '3(a)', 3, 'paid',
    'free_text',
    E'The gas exchange system in humans is adapted to allow air to pass in and out of the body, and for efficient gaseous exchange to take place.\n\n**(a)** List **three** features of the gaseous exchange surfaces in humans.',
    null,
    E'Any 3 of (1 mark each):\n1. Large surface area / many alveoli;\n2. Thin walls of alveoli (one cell thick) / single layer of cells / thin surface;\n3. Many blood capillaries / good blood supply;\n4. Good ventilation with air;\n\n**Examiner commentary:** Fairly well answered. Some candidates wrote ''thin area'', ''thin capillaries'', ''thin layer'' or ''epithelium layer'' instead of ''thin surface / thin walls''. Many omitted ''surface area'' (wrote just ''large area''). Others gave features of the villus (intestine) by mistake.',
    E'Award 1 mark per feature (max 3). Each feature must be specific: ''thin walls of alveoli'' = 1, but ''thin'' alone = 0. ''Many capillaries'' = 1, ''capillaries'' alone = 0. Do NOT credit features of villi (small intestine) — the question is about gas exchange (alveoli), not absorption.',
    E'Four features that make gas exchange efficient — name any THREE:\n\n1. **Large surface area** — millions of alveoli pack a huge area into the lungs\n2. **Thin walls (one cell thick)** — short distance for O₂ and CO₂ to diffuse\n3. **Rich blood supply** — many capillaries → fast removal of O₂, fast delivery of CO₂\n4. **Good ventilation** — breathing keeps fresh air coming → maintains steep concentration gradient\n\nFick''s law: rate of diffusion ∝ (surface area × concentration difference) ÷ thickness. Every feature here boosts one of those.',
    true
  );

  -- ─── Q3(b)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '3(b)(i)', 1, 'free',
    'fill_in',
    E'The gas exchange system in humans is adapted to allow air to pass in and out of the body, and for efficient gaseous exchange to take place.\n\nIn an experiment, the number of breaths per minute and the volume of air taken in per breath by a young man, were measured, at rest and after exercise.\n\n**Table 3.1**\n\n| condition | volume of air per breath / dm³ | number of breaths per minute |\n|---|---|---|\n| at rest | 0.5 | 12 |\n| after exercise | 3 | 30 |\n\n**(b)(i)** Calculate the total volume of air breathed in by the young man per minute **at rest**.\n\nShow your working AND give the correct unit.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '6',
        '6 dm3',
        '6 dm³',
        '6 dm^3',
        '6dm3',
        '6dm³'
    )
, 'must_contain', jsonb_build_array('6')
    ),
    false,
    E'0.5 dm³ × 12 = **6 dm³**; [1 mark — unit required]\n\n**Examiner commentary:** Well answered, although most candidates lost the mark for omitting the unit. A few used cm³ instead of dm³. Always check the unit in the question stem.',
    E'**Minute volume = tidal volume × breaths per minute.**\n\nAt rest:\n• tidal volume = 0.5 dm³ per breath\n• breaths = 12 per minute\n• minute volume = 0.5 × 12 = **6 dm³** (per minute)\n\n⚠ The unit MUST be **dm³** (or ''dm³ / min'') — match the table''s unit. Pure number ''6'' loses the mark.',
    true
  );

  -- ─── Q3(b)(ii)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '3(b)(ii)', 2, 'paid',
    'free_text',
    E'The gas exchange system in humans is adapted to allow air to pass in and out of the body, and for efficient gaseous exchange to take place.\n\nIn an experiment, the number of breaths per minute and the volume of air taken in per breath by a young man, were measured, at rest and after exercise.\n\n**Table 3.1**\n\n| condition | volume of air per breath / dm³ | number of breaths per minute |\n|---|---|---|\n| at rest | 0.5 | 12 |\n| after exercise | 3 | 30 |\n\n**(b)(ii)** Explain why the number of breaths per minute increases after exercise.',
    null,
    E'Any 2 of (1 mark each):\n1. To bring in more oxygen / remove more carbon dioxide;\n2. For faster (aerobic) respiration / faster removal of lactic acid / to repay oxygen debt;\n\n**Examiner commentary:** Poorly answered — many candidates interpreted the question wrongly and gave answers based on DURING the exercise instead of AFTER. Most referred to ''too much'' instead of ''more oxygen in / more CO₂ taken out''.',
    E'Award 1 mark for naming the gas need (more O₂ in / more CO₂ out) and 1 mark for the reason (faster respiration to release more energy / oxygen debt). PENALISE answers that describe DURING exercise (the question asks about AFTER exercise).',
    E'After exercise, muscles need more energy → more aerobic respiration → more O₂ delivery and more CO₂ removal:\n\n• **Faster breathing** brings in **more oxygen** for aerobic respiration\n• Faster breathing **removes more CO₂** built up from active muscles\n• Helps **repay the oxygen debt** (oxidising the lactic acid produced anaerobically during exercise)\n\nLink it explicitly: more breaths → more O₂ → faster respiration → energy / clear lactic acid.',
    true
  );

  -- ─── Q3(c)  [4 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '3(c)', 4, 'paid',
    'free_text',
    E'The gas exchange system in humans is adapted to allow air to pass in and out of the body, and for efficient gaseous exchange to take place.\n\n**(c)** Describe the effects of tobacco smoke on the gaseous exchange system with reference to **carbon monoxide** and **tar**.',
    null,
    E'Carbon monoxide (CO) — any 2 of:\n• Combines with haemoglobin in red blood cells to form carboxyhaemoglobin;\n• Less haemoglobin available to carry oxygen / reduces O₂-carrying capacity;\n• Less oxygen reaches tissues / less respiration / less energy released;\n• Increases risk of coronary heart disease / strokes / heart failure / heart attack;\n\nTar — any 2 of:\n• Is a carcinogen / causes lung cancer / cancer of the mouth or throat;\n• Is an irritant — causes over-secretion of mucus;\n• Damages / paralyses cilia;\n• Forms a sticky layer inside the lungs;\n• Causes breakdown of alveoli walls (alveoli burst / merge);\n• Reduces surface-area-to-volume ratio → less gas exchange;\n• Can lead to emphysema / bronchitis;\n\n**Examiner commentary:** Poorly answered. Most candidates SWAPPED the effects of the two chemicals (lung cancer under carbon monoxide, heart attack under tar). Many wrote ''oxyhaemoglobin'' instead of ''CARBOXYhaemoglobin''. Some said ''mix with haemoglobin'' instead of ''combines / binds with haemoglobin''.',
    E'Award up to 4 marks: 2 for carbon monoxide effects (must mention haemoglobin/carboxyhaemoglobin AND O₂ delivery), 2 for tar effects (must mention cancer/carcinogen AND one structural effect — cilia damage OR alveoli damage). PENALISE swapping effects: lung cancer attributed to CO (wrong) or heart disease to tar (wrong). DO NOT credit ''oxyhaemoglobin'' as CO''s product — the correct term is CARBOXYhaemoglobin.',
    E'**Carbon monoxide (CO)** — affects oxygen DELIVERY:\n• Binds to haemoglobin → forms **carboxyhaemoglobin** (irreversible at low CO levels)\n• Reduces blood''s oxygen-carrying capacity\n• Less O₂ to tissues → less respiration → less energy\n• Heart works harder → coronary heart disease, strokes, heart attack\n\n**Tar** — affects the LUNG STRUCTURE:\n• Contains **carcinogens** → lung cancer, throat/mouth cancer\n• Irritates → over-production of mucus → cough\n• **Paralyses cilia** → mucus + bacteria not cleared → infections (bronchitis)\n• Damages alveoli walls → walls merge → less surface area → **emphysema**\n\nMnemonic: **CO → Cardiac/Oxygen problems**. **Tar → Tumours, Alveoli, Respiratory tract**.',
    true
  );

  -- ─── Q4(a)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '4(a)(i)', 1, 'free',
    'fill_in',
    E'Fig. 4.1 shows the removal of lactic acid during the period called recovery.\n\n**(a)(i)** With reference to the graph, how long did it take to reach full recovery?',
    '/past-papers/biology-nssco-2023-p2/lactic-recovery.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '1 hour',
        '1 hr',
        '1',
        '1.0 hour'
    )
, 'must_contain', jsonb_build_array('1')
    ),
    false,
    E'1 hour; [1 mark — unit required]\n\n**Examiner commentary:** Well answered, however a few candidates lost the mark for omitting the unit. Very few candidates could not interpret the graph correctly.',
    E'**Full recovery** = the point where 100% of the lactic acid has been removed (the curve has flattened at the top).\n\nReading the graph: the curve flattens off at the **1 hour** mark — that''s where full recovery is reached.\n\nAlways include the unit (**hour**) on graph-reading questions; just ''1'' loses the mark.',
    true
  );

  -- ─── Q4(a)(ii)  [4 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '4(a)(ii)', 4, 'paid',
    'free_text',
    E'Fig. 4.1 shows the removal of lactic acid during the period called recovery.\n\n**(a)(ii)** Describe what happens to the lactic acid that has been produced in the muscles once anaerobic respiration stops.',
    '/past-papers/biology-nssco-2023-p2/lactic-recovery.png',
    E'Any 4 of (1 mark each):\n1. Transported to the liver;\n2. By the blood;\n3. Oxidised / broken down to carbon dioxide and water;\n4. OR converted (back) to glucose;\n5. Then (stored as) glycogen;\n\n**Examiner commentary:** Most candidates misunderstood the question and referred to oxygen debt, deamination, blood sugar, hormones — none correct. Many described lactic acid being formed (instead of removed). Candidates didn''t identify the correct organ (LIVER) or transport route (BLOOD).',
    E'Award 1 mark each: (1) destination = LIVER; (2) transported by BLOOD; (3) one possible fate — oxidised to CO₂ + water; (4) another fate — converted back to glucose / stored as glycogen. PENALISE answers that describe lactic acid FORMATION (this asks about its REMOVAL); describe lactic acid being ''used by the body'' without specifying liver and breakdown.',
    E'When exercise stops, the body has to clear the lactic acid built up:\n\n1. Lactic acid **diffuses out of muscles** into the blood\n2. **Blood transports it to the LIVER**\n3. In the liver, lactic acid is either:\n   • **Oxidised** (using O₂) → broken down to CO₂ + H₂O + energy, OR\n   • **Converted back to glucose** → stored as glycogen in liver/muscles\n4. This takes time → that''s the ''recovery period'' shown on the graph\n5. Extra O₂ needed for this oxidation = the **oxygen debt** repaid after exercise\n\nLiver + blood are the two organs/tissues you must name.',
    true
  );

  -- ─── Q4(b)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '4(b)', 2, 'free',
    'fill_in',
    E'Fig. 4.1 shows the removal of lactic acid during the period called recovery.\n\n**(b)** State the number of ATP molecules released during aerobic and anaerobic respiration (per glucose molecule).\n\nGive aerobic, then anaerobic (e.g. ''''aerobic 38, anaerobic 2'''').',
    '/past-papers/biology-nssco-2023-p2/lactic-recovery.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'aerobic 38 anaerobic 2',
        '38 and 2',
        '38, 2',
        '38 2'
    )
, 'must_contain', jsonb_build_array('38', '2')
    ),
    false,
    E'Aerobic — 38 ATP per glucose / much more efficient; [1]\nAnaerobic — 2 ATP per glucose / relatively small amount; [1]\n\n**Examiner commentary:** Fairly well answered. Some candidates wrote the chemical equations for the two types of respiration instead of just the ATP number. Some swapped the two numbers.',
    E'Per glucose molecule:\n• **Aerobic respiration: 38 ATP** (with O₂; complete oxidation in mitochondria) — high yield\n• **Anaerobic respiration: 2 ATP** (no O₂; glucose → lactic acid in muscle) — low yield\n\nThat''s a ~19× difference. Why we need O₂: it''s the difference between getting 2 vs 38 ATP from the same glucose.',
    true
  );

  -- ─── Q4(c)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '4(c)', 3, 'paid',
    'free_text',
    E'Fig. 4.1 shows the removal of lactic acid during the period called recovery.\n\n**(c)** State **three** uses of energy in the human body.',
    null,
    E'Any 3 of (1 mark each) — must be a PROCESS, not a description:\n• Growth / development / tissue repair / cell division / asexual reproduction;\n• Muscle contraction / movement / breathing / heartbeat / circulation;\n• Protein synthesis;\n• Transmission of nerve impulses / release of neurotransmitters;\n• Active transport;\n• Maintenance of constant body temperature;\n• Chemical reactions / metabolism;\n• Propelling sperm cells;\n• Mental activities;\n• Fighting pathogens;\n• Flicking movements of cilia;\n\n**Examiner commentary:** Most candidates wrote descriptions of the uses of energy rather than STATING the main processes. For example, ''to remove waste products'' instead of ''excretion''. Some over-specified (''active transport in the ileum'' = limiting; just ''active transport'' is fine).',
    E'Award 1 mark per process. STATEMENT form expected (''muscle contraction'', ''active transport'') NOT description form (''to remove waste products of metabolism''). PENALISE long-form descriptions that don''t NAME the process.',
    E'Energy uses in the body — name any THREE as one-word/short processes:\n\n• **Muscle contraction** (movement, breathing, heartbeat)\n• **Active transport** (e.g. pumping ions across cell membranes)\n• **Protein synthesis** / cell building\n• **Growth, repair, cell division**\n• **Nerve impulse transmission**\n• **Temperature regulation** (keeping body at 37 °C)\n\nWrite the process NAME, not a description.',
    true
  );

  -- ─── Q5(a)(i)  [4 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '5(a)(i)', 4, 'paid',
    'free_text',
    E'The list of some processes that occur in the carbon cycle is given below.\n\n• respiration\n• photosynthesis\n• combustion\n• decomposition\n\n**(a)(i)** Classify the processes into those that **remove** carbon from the atmosphere and those that **return** carbon to the atmosphere.\n\nGive the answer as two lists.',
    null,
    E'Remove carbon FROM the atmosphere (1 mark each):\n• Photosynthesis;\n\nReturn carbon TO the atmosphere (1 mark each):\n• Respiration;\n• Combustion;\n• Decomposition;\n\n[Total: 4 marks — full credit if all 4 placed correctly]\n\n**Examiner commentary:** Few candidates seemed not to have an idea of processes involved in the carbon cycle. Some failed to spell the processes correctly. Some drew the carbon cycle diagram instead of just listing the terms.',
    E'Award 1 mark per correctly classified process (4 total). Photosynthesis = REMOVES (uses CO₂). Respiration, combustion, decomposition = ALL RETURN CO₂ to the atmosphere.',
    E'Carbon cycle direction matters:\n\n**REMOVES CO₂ from atmosphere:**\n• **Photosynthesis** — plants take in CO₂ to make glucose\n\n**RETURNS CO₂ to atmosphere:**\n• **Respiration** — living organisms release CO₂ as waste\n• **Combustion** — burning fuels (wood, petrol, coal) releases CO₂\n• **Decomposition** — bacteria/fungi break down dead matter and release CO₂\n\nOnly ONE process puts carbon INTO living organisms = photosynthesis. Every other process puts it back into the air.',
    true
  );

  -- ─── Q5(a)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '5(a)(ii)', 1, 'free',
    'fill_in',
    E'The list of some processes that occur in the carbon cycle is given below.\n\n• respiration\n• photosynthesis\n• combustion\n• decomposition\n\n**(a)(ii)** Name **a** process in the carbon cycle that neither removes nor returns carbon to the atmosphere.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'fossilisation',
        'fossilization',
        'feeding'
    )
, 'must_contain', jsonb_build_array('foss')
    ),
    false,
    E'Feeding / fossilisation; [1 mark]\n\n**Examiner commentary:** The majority of candidates could not identify the processes that neither remove nor return carbon to the atmosphere. Common misspellings: ''fosilation'', ''fossilication'', ''fossiliation'', ''fossisation''.',
    E'Some carbon cycle steps just MOVE carbon BETWEEN reservoirs (without touching the atmosphere):\n\n• **Fossilisation** — dead organisms get buried under sediment, slowly turning into coal/oil/gas. Carbon moves from biosphere → underground.\n• **Feeding** — animals eat plants/other animals. Carbon moves between organisms, no atmospheric exchange.\n\nSpell **fossilisation** carefully — common misspellings lose the mark.',
    true
  );

  -- ─── Q5(b)(i)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '5(b)(i)', 3, 'paid',
    'free_text',
    E'Fig. 5.2 shows how carbon dioxide affects the rate of photosynthesis in a plant.\n\n**(b)(i)** Describe the effect of changing the carbon dioxide concentration on the rate of photosynthesis. Use the information from Fig. 5.2 to illustrate your answer.',
    '/past-papers/biology-nssco-2023-p2/co2-photo-graph.png',
    E'Any 3 of (1 mark each):\n1. Carbon dioxide is a reactant in photosynthesis;\n2. Increase in CO₂ concentration increases the rate of photosynthesis;\n3. Until an optimum is reached;\n4. Further increase in CO₂ concentration → rate remains constant;\n5. Reference to correct data: increase phase (0.008-0.078 % CO₂ → 0-20 arbitrary units rate) / constant phase (0.079-0.16 % CO₂ → 20 au rate);\n\n**Examiner commentary:** Many candidates misinterpreted the graph and couldn''t differentiate dependent vs independent variables. Wrong words: ''high'' instead of ''increase'', ''lower'' instead of ''decrease''. The majority failed to use correct figures from the graph and didn''t give units.',
    E'Award 1 mark per point (max 3). Must include: (a) trend description (rate increases then plateaus); (b) reason (CO₂ is a reactant, but it stops being limiting); (c) data citation from the graph with UNITS. PENALISE: ''high'' / ''lower'' / ''greater'' (use INCREASES / DECREASES); no data quoted; no units.',
    E'How to describe a graph in 3 sentences:\n\n1. **Trend (low region)**: ''As CO₂ concentration increases from 0 to about 0.08 %, the rate of photosynthesis increases from 0 to about 20 arbitrary units.''\n2. **Reason**: ''CO₂ is a *reactant* in photosynthesis, so more CO₂ → faster reaction — *until* another factor (light, temperature, chlorophyll) becomes limiting.''\n3. **Trend (high region)**: ''Above ~0.08 % CO₂, the rate **plateaus** (stays constant) at about 20 au — CO₂ is no longer the limiting factor.''\n\nAlways cite NUMBERS with UNITS from the graph.',
    true
  );

  -- ─── Q5(b)(ii)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '5(b)(ii)', 2, 'free',
    'fill_in',
    E'Fig. 5.2 shows how carbon dioxide affects the rate of photosynthesis in a plant.\n\n**(b)(ii)** State the **balanced chemical equation** for photosynthesis.',
    '/past-papers/biology-nssco-2023-p2/co2-photo-graph.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '6CO2 + 6H2O -> C6H12O6 + 6O2',
        '6CO2 + 6H2O → C6H12O6 + 6O2',
        '6 CO2 + 6 H2O -> C6H12O6 + 6 O2',
        '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂'
    )
, 'must_contain', jsonb_build_array('6CO', '6H', 'C6H12O6', '6O')
    ),
    false,
    E'6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂; [2 marks — 1 for reactants + products, 1 for balancing]\n\n**Examiner commentary:** Some candidates could not distinguish between the chemical and word equations. Some failed to use an arrow to separate reactants from products. A few mixed up reactants vs products.',
    E'**Balanced chemical equation for photosynthesis:**\n\n**6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂**\n\n• Reactants (LEFT of arrow): 6 carbon dioxide + 6 water\n• Products (RIGHT of arrow): 1 glucose (C₆H₁₂O₆) + 6 oxygen\n• The 6s make it **balanced**: 6 C, 12 H, 18 O on each side\n\nUse an arrow (→), NOT an equals sign (=). Write the small numbers as subscripts where possible.',
    true
  );

  -- ─── Q6(a)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '6(a)', 2, 'free',
    'fill_in',
    E'Fig. 6.1 shows the four stages of an enzyme-controlled reaction.\n\n**(a)** Identify **Q** and **S** in Fig. 6.1.',
    '/past-papers/biology-nssco-2023-p2/enzyme-stages.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'Q substrate S product',
        'Q-substrate S-products',
        'substrate, products'
    )
, 'must_contain', jsonb_build_array('substrate', 'product')
    ),
    false,
    E'Q — substrate; [1]\nS — product / products; [1]\n[Total 2 marks]\n\n**Examiner commentary:** Most candidates answered correctly. Only a few misspelt ''substrate'' — wrote ''substate'', ''subrate'', ''subtrate'' or ''substance''. Candidates differentiate enzyme from substrate well.',
    E'Lock-and-key model of an enzyme reaction:\n\n• **Q (substrate)** — the molecule the enzyme acts on. Shape matches the enzyme''s active site.\n• Enzyme + substrate → **enzyme-substrate complex** (stages 2 and 3)\n• **S (product/s)** — what the substrate is converted INTO after the reaction\n• The enzyme is unchanged and reusable\n\nSpell ''substrate'' carefully — common wrong spellings lose the mark.',
    true
  );

  -- ─── Q6(b)(i)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '6(b)(i)', 2, 'paid',
    'free_text',
    E'Fig. 6.1 shows the four stages of an enzyme-controlled reaction.\n\n**(b)(i)** Explain how a rise in temperature may **increase** the rate of an enzyme-controlled reaction.',
    '/past-papers/biology-nssco-2023-p2/enzyme-stages.png',
    E'Any 2 of (1 mark each):\n1. Heat provides energy to the molecules / more kinetic energy;\n2. Molecules move faster / more collisions occur;\n3. More enzyme-substrate complexes (ESC) form / more products formed;\n\n**Examiner commentary:** Most candidates answered this question poorly. They focused on the effect of INCREASE above optimum (denaturation) rather than from low → optimum and the rate of reaction.',
    E'Award 1 mark each: kinetic energy increases AND collision frequency increases AND more ESC. Must be about temperature BELOW optimum (the question says ''increase''). PENALISE answers about temperature ABOVE optimum (denaturation).',
    E'Below the optimum temperature, heating SPEEDS UP the reaction:\n\n1. **Heat = kinetic energy** — enzyme and substrate molecules **move faster**\n2. **More collisions** between enzyme and substrate per second\n3. **More successful collisions** form enzyme-substrate complexes → faster product formation\n\nKey: the question asks about INCREASING the rate — so describe the temperature range BELOW the optimum. Above the optimum, the enzyme starts denaturing — that''s the opposite effect.',
    true
  );

  -- ─── Q6(b)(ii)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '6(b)(ii)', 2, 'paid',
    'free_text',
    E'Fig. 6.1 shows the four stages of an enzyme-controlled reaction.\n\n**(b)(ii)** Suggest what happens to the **active site** when the enzyme is denatured by high temperature, and state **why** the enzyme can no longer catalyse a reaction even after the temperature is lowered.',
    '/past-papers/biology-nssco-2023-p2/enzyme-stages.png',
    E'Any 2 of (1 mark each):\n1. Active site loses / changes shape;\n2. Substrate no longer fits into the active site / does not complement the active site;\n3. The shape change is permanent / irreversible;\n\n**Examiner commentary:** Above 50% answered correctly. A few candidates referred to the ENZYME changing shape instead of the ACTIVE SITE. Some said enzymes fit on the active site instead of the substrate.',
    E'Award 1 mark each: (1) active-site shape changes; (2) substrate no longer fits / not complementary; (3) change is PERMANENT / IRREVERSIBLE — this last point is what answers WHY lowering temperature doesn''t help. PENALISE ''enzyme changes shape'' (must say ACTIVE SITE); ''enzyme fits onto active site'' (substrate fits, not enzyme).',
    E'**Denaturation** at high temperature:\n\n1. The strong heat **breaks the bonds** holding the enzyme''s 3D shape together\n2. The **active site changes shape** (no longer the right shape for the substrate)\n3. **Substrate can no longer bind** → no enzyme-substrate complex → no reaction\n4. The change is **PERMANENT/IRREVERSIBLE** — cooling back down does NOT restore the original shape (think of a boiled egg — you can''t ''unboil'' it)\n\nKey word: **active site** (not just ''enzyme'') AND **permanent**.',
    true
  );

  -- ─── Q6(b)(iii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '6(b)(iii)', 1, 'free',
    'fill_in',
    E'Fig. 6.1 shows the four stages of an enzyme-controlled reaction.\n\n**(b)(iii)** Name **one** other environmental factor that may cause the denaturation of an enzyme.',
    '/past-papers/biology-nssco-2023-p2/enzyme-stages.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'pH',
        'ph',
        'pH (extreme)',
        'very high pH',
        'very low pH'
    )
, 'must_contain', jsonb_build_array('pH')
    ),
    false,
    E'pH; [1 mark]\n\n**Examiner commentary:** The majority answered correctly although a few candidates referred to ''pH concentration'', ''pH scale'', ''extreme pH'', ''pH range'', ''low pH'', ''high pH'', ''pH of the enzyme'', ''pH balance'' or ''soil pH'' — accept these.',
    E'Two environmental factors denature enzymes:\n• **Temperature** (already covered in this question)\n• **pH** — each enzyme has an optimum pH. Move too far from it (too acidic OR too alkaline) and the bonds holding the active site break → denaturation\n\nExamples: pepsin (stomach) prefers pH 2 (very acidic). Amylase (mouth/intestine) prefers pH 7. Put either enzyme in the wrong pH → denaturation.',
    true
  );

  -- ─── Q6(c)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '6(c)(i)', 1, 'free',
    'fill_in',
    E'Chemical digestion occurs in the stomach.\n\n**(c)(i)** Name an **enzyme** that acts in the stomach.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'pepsin',
        'Pepsin'
    )
, 'must_contain', jsonb_build_array('pepsin')
    ),
    false,
    E'Pepsin; [1 mark]\n\n**Examiner commentary:** Poorly answered. Candidates could not differentiate between enzymes, substrates and end products.',
    E'**Pepsin** — the main enzyme in the stomach.\n\n• Made by stomach lining cells\n• Works best in acidic conditions (pH ~2) — the stomach is acidic on purpose\n• Digests proteins into smaller peptides',
    true
  );

  -- ─── Q6(c)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '6(c)(ii)', 1, 'free',
    'fill_in',
    E'Chemical digestion occurs in the stomach. The enzyme that acts in the stomach is pepsin.\n\n**(c)(ii)** State the **substrate** of pepsin.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'protein',
        'proteins',
        'Protein'
    )
, 'must_contain', jsonb_build_array('protein')
    ),
    false,
    E'Protein; [1 mark]\n\n**Examiner commentary:** Poorly answered. Candidates could not differentiate between enzymes, substrates and end products.',
    E'Pepsin''s substrate = **protein**.\n\nIt''s a protease (protein-cutting enzyme). It cuts long protein chains into shorter pieces (polypeptides). Other proteases work later in the small intestine to finish the job.',
    true
  );

  -- ─── Q6(c)(iii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '6(c)(iii)', 1, 'free',
    'fill_in',
    E'Chemical digestion occurs in the stomach. The enzyme pepsin digests protein.\n\n**(c)(iii)** State the **end products** of pepsin''s reaction.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'polypeptides',
        'polypeptide',
        'peptides'
    )
, 'must_contain', jsonb_build_array('peptide')
    ),
    false,
    E'Polypeptides; [1 mark]\n\n**Examiner commentary:** Poorly answered. Candidates could not differentiate between enzymes, substrates and end products.',
    E'Pepsin''s products = **polypeptides** (shorter protein chains).\n\n• Pepsin is a *protease*, but it does NOT go all the way to amino acids\n• It chops long proteins into shorter polypeptides\n• These travel into the small intestine where OTHER enzymes (trypsin, peptidases) finish the breakdown → amino acids\n\nFinal end products of FULL protein digestion = amino acids — but pepsin alone stops at polypeptides.',
    true
  );

  -- ─── Q7(a)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '7(a)', 3, 'paid',
    'free_text',
    E'Fig. 7.1 shows some stages in sexual reproduction in plants.\n\n**(a)** Describe the events that occur after germination of the pollen grain on the stigma leading to fertilisation.',
    '/past-papers/biology-nssco-2023-p2/flower-fertilise.png',
    E'Any 3 of (1 mark each):\n1. Growth of pollen tube (from the pollen grain);\n2. Through the style / ovary;\n3. The (male) nucleus inside the pollen grain slips / moves down the pollen tube as it grows;\n4. Pollen tube / male nucleus enters the ovule;\n5. The ovum in the ovule contains the female nucleus;\n6. The male nucleus FUSES with the female nucleus;\n7. To form a zygote;\n\n**Examiner commentary:** Only a few candidates gave correct descriptions. Many referred to pollen TUBES as pollen GRAINS. Many seemed not to have an understanding of flower structure (e.g. ''pollen grain grows in style''). Many gave a DEFINITION of fertilisation instead of describing the events. Misspelt ''zygote'' and ''gamete''. Some used ''combine'' instead of ''fuse''.',
    E'Award 1 mark per event (max 3). Must include in correct order: pollen TUBE growth, route (style → ovary → ovule), and FUSION of nuclei. PENALISE ''pollen grain grows in style'' (it''s the TUBE, not the grain); ''combine'' instead of ''fuse''; describing pollination rather than fertilisation.',
    E'Pollination → fertilisation pathway in 6 steps:\n\n1. **Pollen grain germinates** on the stigma\n2. **Pollen tube grows** down the style (the tube — not the grain — does the growing)\n3. Pollen tube reaches the **ovary**, then enters the **ovule**\n4. The **male nucleus** (inside the pollen tube) **moves down** the tube\n5. The male nucleus **FUSES** with the **female nucleus** (egg) inside the ovule\n6. Fusion forms a **zygote** — this is fertilisation\n\nKey vocabulary: **pollen tube** (not grain) grows; nuclei **fuse** (not ''combine'').',
    true
  );

  -- ─── Q7(b)(i)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '7(b)(i)', 2, 'paid',
    'free_text',
    E'Fig. 7.1 shows some stages in sexual reproduction in plants.\n\nFig. 7.2 shows self-pollination.\n\n**(b)(i)** Define *self-pollination*.',
    '/past-papers/biology-nssco-2023-p2/self-pollination.png',
    E'Both points required (1 mark each):\n1. The transfer of pollen grains from the anther;\n2. To the stigma of the same flower OR a different flower on the same plant;\n\n**Examiner commentary:** Fairly well answered. However, it seems candidates were not properly taught the SYLLABUS definition of self-pollination.',
    E'Award 1 mark for naming TRANSFER FROM ANTHER, and 1 mark for naming TO STIGMA OF SAME FLOWER or DIFFERENT FLOWER ON SAME PLANT. The ''same plant'' qualifier is essential — without it, the definition doesn''t distinguish from cross-pollination.',
    E'**Self-pollination** = transfer of pollen from the anther → stigma of the **same flower** OR a **different flower on the SAME plant**.\n\nKey: ANY part of the same plant. If pollen goes to a different plant of the same species, that''s **cross-pollination** instead.\n\nWrite both halves to get both marks: ''from anther'' AND ''to stigma of same flower / same plant''.',
    true
  );

  -- ─── Q7(b)(ii)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '7(b)(ii)', 3, 'paid',
    'free_text',
    E'Fig. 7.1 shows some stages in sexual reproduction in plants.\n\n**(b)(ii)** Suggest **two advantages** and **one disadvantage** of self-pollination.',
    '/past-papers/biology-nssco-2023-p2/self-pollination.png',
    E'Two advantages (1 mark each):\n• Less pollen wasted;\n• No reliance / dependence on external carrier / pollinator;\n• Features of species can be maintained / better chance of survival;\n\nOne disadvantage (1 mark):\n• Less / lack of variation in offspring / species;\n• Genetic defects may arise;\n• Reduced health of species / susceptible to diseases / resistance to disease is reduced;\n\n**Examiner commentary:** Many candidates could not suggest the advantages and disadvantages of self-pollination. Many stated the advantages of ASEXUAL REPRODUCTION instead.',
    E'Award 2 marks for two advantages (separate, distinct points) and 1 mark for one disadvantage. Must NOT confuse with asexual reproduction''s advantages/disadvantages (asexual = no variation; self-pollination still produces variation via meiosis, but LESS variation than cross-pollination).',
    E'**Self-pollination advantages** (it''s reliable):\n• **Less pollen wasted** — pollen doesn''t have to travel\n• **No dependence on insects/wind** — can happen even without pollinators\n• **Maintains good combinations** of genes/features in the species\n\n**Self-pollination disadvantage** (low variation):\n• **Less genetic variation** in offspring → less adaptable\n• **More risk of inheriting genetic defects** (closely-related genomes)\n• Whole population could be **wiped out by a single disease** if no resistant individuals exist\n\nDon''t confuse this with asexual reproduction — self-pollination still uses gametes + meiosis.',
    true
  );

  -- ─── Q7(b)(iii)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '7(b)(iii)', 2, 'free',
    'fill_in',
    E'Fig. 7.1 shows some stages in sexual reproduction in plants.\n\n**(b)(iii)** Name **two** agents of pollination.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'insects and wind',
        'wind and insects',
        'insects, wind',
        'wind, insects'
    )
, 'must_contain', jsonb_build_array('insect', 'wind')
    ),
    false,
    E'Insects; [1]\nWind; [1]\n[Total 2 marks]\n\n**Examiner commentary:** Well answered, yet some candidates listed animals (mammals, humans, water) as agents of pollination instead of insects and wind as stated in the syllabus.',
    E'Two agents of pollination (the NSSCO syllabus):\n• **Insects** (bees, butterflies, beetles) — carry pollen on their bodies between flowers\n• **Wind** — blows light pollen grains from anther to stigma (grasses, most cereal crops)\n\nWater and animals can technically be agents in nature, but the **syllabus** lists only **insects** and **wind**.',
    true
  );

  -- ─── Q8(a)  [4 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '8(a)', 4, 'paid',
    'free_text',
    E'Fig. 8.1 shows a eukaryotic cell.\n\n**(a)** State the functions of the following structures:\n\n• ribosome\n• mitochondria\n• smooth endoplasmic reticulum\n• vesicle',
    '/past-papers/biology-nssco-2023-p2/eukaryotic-cell.png',
    E'All four required (1 mark each):\n1. **Ribosomes** — protein synthesis;\n2. **Mitochondria** — site of (aerobic) respiration / energy release / produces ATP;\n3. **Smooth endoplasmic reticulum** — synthesis of lipids / metabolism of carbohydrates / production of steroid hormones / transport of substances (rough ER functions also accepted as smooth ER''s specific role is not in syllabus);\n4. **Vesicles** — store / transport / digest / secrete substances / become lysosomes;\n\n**Examiner commentary:** Poorly answered (functions of eukaryotic cell parts). Many candidates didn''t know all four functions.',
    E'Award 1 mark each. Be flexible on phrasing of ER (smooth ER''s specific role isn''t in the syllabus, so any reasonable ER function counts). PENALISE ''mitochondria PRODUCES energy'' (energy can''t be ''produced''; it''s released/transferred — but accept it if intent is clear).',
    E'Four organelle functions:\n\n1. **Ribosomes** — site of **protein synthesis** (read mRNA, make proteins)\n2. **Mitochondria** — site of **aerobic respiration** → release **ATP** (energy) for the cell\n3. **Smooth ER** — makes **lipids**, helps metabolise carbohydrates, makes steroid hormones, transports substances (the syllabus is flexible about ER details)\n4. **Vesicles** — small membrane sacs that **store, transport, or release** substances (secretion, digestion, etc.)\n\nMnemonic: ''Ribosome = Reading (mRNA), Mitochondria = Money (ATP), Smooth ER = Spreads (lipids), Vesicle = Vehicle (transport).''',
    true
  );

  -- ─── Q8(b)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '8(b)', 2, 'paid',
    'free_text',
    E'Fig. 8.1 shows a eukaryotic cell.\n\n**(b)** Describe the structure of **DNA**.',
    null,
    E'Any 2 of (1 mark each):\n1. Two strands coiled together / forms a double helix;\n2. Consists of many nucleotides;\n3. Each nucleotide = sugar + phosphate + base;\n4. Strands contain bases A, T, C, G;\n5. Bases always pair the same way — A with T, C with G;\n\n**Examiner commentary:** Most candidates defined CHROMOSOMES, but some wrote what DNA STANDS FOR. Others explained it as DNA testing between a parent and a child instead of describing the STRUCTURE.',
    E'Award 2 marks max. At least ONE of the marks must come from structural features (double helix / nucleotide composition); the other can be from base pairing. PENALISE defining DNA''s function (''carries genetic information'') without structural details; defining ''chromosome'' instead of DNA.',
    E'**Structure of DNA** in 4 bullets:\n\n1. **Double helix** — two strands twisted around each other (Watson and Crick, 1953)\n2. Each strand is made of many **nucleotides** linked together\n3. Each **nucleotide** = phosphate group + 5-carbon sugar + 1 of 4 bases (A, T, C, G)\n4. **Bases pair specifically**: A↔T and C↔G — held by hydrogen bonds\n\nDon''t confuse DNA (the molecule) with the chromosome (DNA + protein, supercoiled).',
    true
  );

  -- ─── Q8(c)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2023, '2', '8(c)(i)', 1, 'free',
    'fill_in',
    E'Fig. 8.1 shows a eukaryotic cell.\n\n**(c)(i)** Define *gene mutation*.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'a change in a base sequence of DNA',
        'change in the base sequence of DNA',
        'a change in the sequence of bases in DNA',
        'change in DNA base sequence'
    )
, 'must_contain', jsonb_build_array('base', 'DNA')
    ),
    false,
    E'A change in the base sequence of DNA; [1 mark]\n\n**Examiner commentary:** Most candidates failed to define gene mutation. Many described chromosomal mutation, or environmental causes, instead of the molecular definition.',
    E'**Gene mutation = a change in the base sequence of DNA.**\n\nFor example, the sickle-cell anaemia mutation is just ONE base change in the haemoglobin gene (A→T in one position) — but it changes the resulting protein and causes the disease.\n\nKey words you need: **change**, **base sequence**, **DNA**.',
    true
  );

  -- ─── Q8(c)(ii)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2023, '2', '8(c)(ii)', 3, 'paid',
    'free_text',
    E'Fig. 8.1 shows a eukaryotic cell.\n\nSickle cell anaemia was the first genetic disease to be described in terms of a gene mutation.\n\n**(c)(ii)** Describe the **symptoms** of sickle cell anaemia.',
    null,
    E'Any 3 of (1 mark each):\n• Distorted / sickle-shaped red blood cells / fewer normal red blood cells / less haemoglobin;\n• Fatigue / exhaustion / breathlessness / tiredness / less active;\n• Suffers strokes / thrombosis / formation of clots / heart attack / blindness / damage to lungs / kidneys / heart;\n• Painful crises / periods of pain / pain in joints and bones / swelling of hands or feet;\n• Yellowish / pale skin;\n• Often hospitalised for transfusion; at risk of acute chest syndrome;\n\n**Examiner commentary:** Poorly answered. Symptoms were not stated correctly. Many candidates described features of Down syndrome (flat faces, short fingers, slanted eyes) instead of sickle-cell symptoms.',
    E'Award 1 mark per symptom (max 3). Must be SYMPTOMS (what the patient experiences/shows), not features of Down syndrome (flat face, slanted eyes) which is a COMMON mistake. Accept any 3 distinct symptoms from the memo.',
    E'**Sickle-cell anaemia symptoms** — name any THREE:\n\n• **Sickle-shaped red blood cells** — less surface area, less efficient at carrying O₂; cells get stuck in capillaries\n• **Fatigue, weakness, breathlessness** — less O₂ delivery to tissues\n• **Painful crises** — sickle cells block small blood vessels → pain in joints, bones, swelling of hands/feet\n• **Strokes / heart attack / organ damage** — blocked vessels in brain, heart, kidneys, lungs\n• **Pale or yellowish skin** (jaundice from broken-down red cells)\n• **Frequent hospitalisation** for blood transfusions\n\nDo NOT confuse with Down syndrome — different condition, different cause (chromosomal not gene mutation).',
    true
  );

  raise notice 'Inserted 35 structured sub-parts for Biology NSSCO 2023 Paper 2';
end $$;
