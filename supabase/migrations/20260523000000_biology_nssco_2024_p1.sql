-- ===========================================================================
-- NSSCO Biology 2024 Paper 1 (6116/1) — 40 MCQ questions, 40 marks
-- Verbatim NIED wording. Official answers + commentary from
-- the DNEA Examiner's Report 2024 (Biology section, pages 47-49).
-- Diagrams cropped from past-papers/nssco-biology/2024/6116-1.pdf
-- into public/past-papers/biology-nssco-2024-p1/
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

  -- ─── Q1 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '1', 1, 'free',
    'mcq',
    E'The diagram shows an instrument that can be used in a Biology laboratory.\n\nWhat does the instrument measure?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','mass'),
      jsonb_build_object('id','b','text','temperature'),
      jsonb_build_object('id','c','text','time'),
      jsonb_build_object('id','d','text','volume')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2024-p1/q1-instrument.png',
    E'A — mass [1 mark]. This was the easiest question in the paper and 97% of candidates got it right.',
    E'A digital balance (electronic scale) displays **mass** in grams. The reading ''0.007 g'' is what tells you it measures mass — not temperature (°C), time (seconds), or volume (cm³).',
    true
  );

  -- ─── Q2 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '2', 1, 'free',
    'mcq',
    E'Which two taxa are used in naming organisms using the binomial system?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','family and kingdom'),
      jsonb_build_object('id','b','text','family and genus'),
      jsonb_build_object('id','c','text','genus and species'),
      jsonb_build_object('id','d','text','kingdom and species')
    ),
    to_jsonb('c'::text),
    null,
    E'C — genus and species [1 mark]. This question was scored by 92% of candidates as it only required basic information about the binomial system.',
    E'The binomial (two-name) system uses **genus** (capitalised, e.g. *Homo*) and **species** (lowercase, e.g. *sapiens*). Together they uniquely name an organism. Family, kingdom, etc. are higher classification levels — not part of the species name.',
    true
  );

  -- ─── Q3 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '3', 1, 'free',
    'mcq',
    E'Palisade cells are found in plant leaves.\n\nWhich feature is present in a palisade cell but **not** in a liver cell?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','cell membrane'),
      jsonb_build_object('id','b','text','chloroplast'),
      jsonb_build_object('id','c','text','cytoplasm'),
      jsonb_build_object('id','d','text','nucleus')
    ),
    to_jsonb('b'::text),
    null,
    E'B — chloroplast [1 mark]. The majority of candidates (73%) did well; wrong answers were scattered almost equally among the other three options.',
    E'Palisade cells are PLANT cells specialised for photosynthesis — they have **chloroplasts** packed with chlorophyll. Liver (animal) cells lack chloroplasts. Cell membrane, cytoplasm and nucleus are found in both plant AND animal cells.',
    true
  );

  -- ─── Q4 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '4', 1, 'free',
    'mcq',
    E'The actual size of an object is 2000 µm.  A drawing of the same object measures 50 mm.\n\nWhat is the magnification of the drawing?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','× 0.025'),
      jsonb_build_object('id','b','text','× 25'),
      jsonb_build_object('id','c','text','× 100'),
      jsonb_build_object('id','d','text','× 100 000')
    ),
    to_jsonb('b'::text),
    null,
    E'B — × 25 [1 mark]. Poorly performed; many candidates chose A because they divided drawing size by actual size without first converting to the same unit. Convert: 50 mm × 1000 = 50 000 µm. Magnification = 50 000 µm ÷ 2000 µm = ×25.',
    E'**Magnification = image size ÷ actual size.** But BOTH must be in the same unit first.\n• 50 mm = 50 000 µm\n• 50 000 ÷ 2000 = **×25**\n\nNever divide values with different units — that''s where most learners lose this mark.',
    true
  );

  -- ─── Q5 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '5', 1, 'free',
    'mcq',
    E'The diagram shows a leaf.\n\nAt what level of organisation is a leaf?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','cell'),
      jsonb_build_object('id','b','text','organ'),
      jsonb_build_object('id','c','text','organ system'),
      jsonb_build_object('id','d','text','tissue')
    ),
    to_jsonb('b'::text),
    '/past-papers/biology-nssco-2024-p1/q5-leaf.png',
    E'B — organ [1 mark]. Only 45% of candidates answered correctly. Second most popular was D (tissue). Teachers should give examples of plant tissues and organ systems when teaching levels of organisation.',
    E'Levels of organisation, smallest → largest: **cell → tissue → organ → organ system → organism.** A leaf is made of SEVERAL tissues (epidermis, palisade, spongy mesophyll, xylem, phloem) working together for one function (photosynthesis) — that makes it an **organ**.',
    true
  );

  -- ─── Q6 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '6', 1, 'free',
    'mcq',
    E'The diagram shows a eukaryotic cell.\n\nWhich structure produces ATP during respiration?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2024-p1/q6-eukaryotic-cell.png',
    E'A [1 mark]. Slightly above-average score; second most popular was B. It is very important for learners to identify parts of the cell.',
    E'**Mitochondria** are the site of aerobic respiration — they produce ATP (energy). Label A points to a mitochondrion (oval shape with inner folds). B = ribosomes/ER, C = nucleus, D = membrane structures.',
    true
  );

  -- ─── Q7 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '7', 1, 'free',
    'mcq',
    E'The diagram shows the movement of molecules from outside the cell into the cell.\n\nWhich phrase describes how the molecules move from outside the cell into the cell?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','against the concentration gradient by active transport'),
      jsonb_build_object('id','b','text','against the concentration gradient by facilitated diffusion'),
      jsonb_build_object('id','c','text','down a concentration gradient by osmosis'),
      jsonb_build_object('id','d','text','down a concentration gradient by diffusion')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2024-p1/q7-molecule-movement.png',
    E'A — against the concentration gradient by active transport [1 mark]. A significant number of candidates were split between C and D — they thought movement was diffusion, but the diagram shows molecules going from LOWER to HIGHER concentration AND energy is involved.',
    E'Two clues in the diagram: (1) more molecules on the INSIDE than OUTSIDE means movement is **against the concentration gradient**, and (2) the ''energy'' burst symbol means ATP is being used. Together = **active transport**. Diffusion and osmosis are passive (no energy, down a gradient).',
    true
  );

  -- ─── Q8 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '8', 1, 'free',
    'mcq',
    E'DNA bases pair up to form two strands during DNA replication.\n\nWhich bases are paired correctly?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','G with A'),
      jsonb_build_object('id','b','text','G with C'),
      jsonb_build_object('id','c','text','G with G'),
      jsonb_build_object('id','d','text','G with T')
    ),
    to_jsonb('b'::text),
    null,
    E'B — G with C [1 mark]. About 56% got it right (low for a simple recall question). Mnemonic suggestion from the examiners: ''Apples are in the Tree and Cars are in the Garage'' (A–T and C–G).',
    E'DNA has 4 bases: **A, T, C, G**. They pair only in specific ways:\n• A pairs with T (Apples ↔ Tree)\n• C pairs with G (Cars ↔ Garage)\n\nSo **G pairs only with C**.',
    true
  );

  -- ─── Q9 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '9', 1, 'free',
    'mcq',
    E'A learner carried out a food test to determine whether milk sugar, lactose, is a reducing sugar.\n\nWhich row is a correct description of the test?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2024-p1/q9-food-test-table.png',
    E'C [1 mark]. 48% got it correct. Candidates only needed to know the reagent, procedure and positive result for the reducing sugar test — likely due to insufficient laboratory practical work in schools.',
    E'**Benedict''s test** for reducing sugars: add Benedict''s solution → HEAT in a water bath → positive result is a **brick-red precipitate**. Biuret is for protein (not sugar). Always ''heat'' for Benedict''s. The exact colour examiners want is ''brick-red'', not just ''red'' or ''orange''.',
    true
  );

  -- ─── Q10 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '10', 1, 'free',
    'mcq',
    E'The graph shows the effect of temperature on the activity of an enzyme.\n\nAt which temperature is the enzyme **most** active?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','15°C'),
      jsonb_build_object('id','b','text','35°C'),
      jsonb_build_object('id','c','text','45°C'),
      jsonb_build_object('id','d','text','55°C')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2024-p1/q10-enzyme-graph.png',
    E'C — 45°C [1 mark]. 62% of candidates interpreted the graph correctly.',
    E'**Optimum temperature** = the temperature at which the enzyme works fastest = the PEAK of the graph. Below the peak, the enzyme is too slow. Above the peak, the enzyme denatures (its shape changes irreversibly). For this graph, the peak is at **45°C**.',
    true
  );

  -- ─── Q11 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '11', 1, 'free',
    'mcq',
    E'What will happen to a green plant grown in soil that is deficient in nitrate ions?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','It will have large leaves and small flowers.'),
      jsonb_build_object('id','b','text','It will have purple leaves and poor root growth.'),
      jsonb_build_object('id','c','text','It will have yellow leaves and poor overall growth.'),
      jsonb_build_object('id','d','text','It will have white leaves and a thick stem.')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. 68% answered correctly. Option A came second — likely because of ''large leaves''.',
    E'Plants need **nitrate ions** to make proteins (including chlorophyll). Without nitrates:\n• Yellow leaves (no chlorophyll → no green colour)\n• Poor overall growth (no proteins for tissue building)\n\nPurple leaves = phosphate deficiency. White leaves = magnesium deficiency.',
    true
  );

  -- ─── Q12 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '12', 1, 'free',
    'mcq',
    E'In which part of the human alimentary canal does the digestion of starch begin?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','mouth'),
      jsonb_build_object('id','b','text','oesophagus'),
      jsonb_build_object('id','c','text','small intestine'),
      jsonb_build_object('id','d','text','stomach')
    ),
    to_jsonb('a'::text),
    null,
    E'A — mouth [1 mark]. Only 52% got it correct; option D (stomach) was second most popular.',
    E'Starch digestion starts in the **mouth** thanks to the enzyme **salivary amylase** in saliva. The oesophagus only transports food. The stomach digests protein (pepsin). Starch digestion continues in the small intestine (pancreatic amylase) but doesn''t BEGIN there.',
    true
  );

  -- ─── Q13 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '13', 1, 'free',
    'mcq',
    E'In which order do these events occur in human nutrition?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','digestion → ingestion → absorption → egestion'),
      jsonb_build_object('id','b','text','digestion → ingestion → egestion → absorption'),
      jsonb_build_object('id','c','text','ingestion → digestion → absorption → egestion'),
      jsonb_build_object('id','d','text','ingestion → digestion → egestion → absorption')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. Well performed — 76% scored.',
    E'Nutrition steps in order:\n1. **Ingestion** — taking food into the mouth\n2. **Digestion** — breaking food down (mechanical + enzymes)\n3. **Absorption** — small soluble molecules pass into the blood (small intestine)\n4. **Egestion** — undigested waste leaves the body (anus)\n\nNote: egestion is ALWAYS last.',
    true
  );

  -- ─── Q14 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '14', 1, 'free',
    'mcq',
    E'The information below is taken from four packets of food.\n\nWhich food would be suitable for a person suffering from constipation?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2024-p1/q14-food-packets.png',
    E'C [1 mark]. 60% of candidates scored; option A also attracted a number of candidates.',
    E'Constipation = difficulty passing faeces. The remedy is **high fibre** — fibre adds bulk to faeces and stimulates peristalsis in the gut. Look at the fibre values:\n• A = 1 g\n• B = 4.9 g\n• C = **8.1 g** ← highest\n• D = 1.1 g\n\nThe food with the most fibre helps constipation most.',
    true
  );

  -- ─── Q15 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '15', 1, 'free',
    'mcq',
    E'The graph shows how the rate of transpiration is affected by factor **X**.\n\nWhat could be factor **X**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','humidity'),
      jsonb_build_object('id','b','text','light intensity'),
      jsonb_build_object('id','c','text','temperature'),
      jsonb_build_object('id','d','text','wind speed')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2024-p1/q15-transpiration-graph.png',
    E'A — humidity [1 mark]. Poorly performed — only 40% got it right. Candidates continue to struggle with graph interpretation.',
    E'The graph shows transpiration **DECREASING** as factor X **INCREASES**.\n• **Humidity**: more humid air → less water vapour gradient between leaf and air → slower transpiration ✓\n• Light intensity, temperature, wind speed all INCREASE transpiration.\n\nOnly humidity decreases it — so X = humidity.',
    true
  );

  -- ─── Q16 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '16', 1, 'free',
    'mcq',
    E'The diagram shows a section through a plant stem.\n\nIn which tissue does the translocation of systemic pesticides take place?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2024-p1/q16-stem-section.png',
    E'C [1 mark]. Below-average — 48% got it right. Option A also attracted candidates — likely because they confused xylem and phloem.',
    E'**Translocation** = movement of sugars (and absorbed pesticides) through the **phloem**. Xylem only transports water + minerals UPWARDS from roots to leaves; it cannot move pesticides ''systemically'' through the plant. Phloem in the stem is usually shown as the OUTER ring of the vascular bundle.',
    true
  );

  -- ─── Q17 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '17', 1, 'free',
    'mcq',
    E'The diagram shows a vertical section through the heart.\n\nWhat are the functions of the blood vessels numbered 1, 2, 3 and 4?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('d'::text),
    '/past-papers/biology-nssco-2024-p1/q17-heart-vessels.png',
    E'D [1 mark]. Only 43% got it correct. Candidates needed to know the function of four blood vessels and this proved a challenge.',
    E'The four major heart vessels:\n• **1 (vena cava)** — carries blood FROM the body to the heart\n• **2 (pulmonary artery)** — carries blood TO the lungs\n• **3 (pulmonary vein)** — carries blood FROM the lungs\n• **4 (aorta)** — carries blood TO the body\n\nSo: 1=from body, 2=to lungs, 3=from lungs, 4=to body — row **D** matches.',
    true
  );

  -- ─── Q18 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '18', 1, 'free',
    'mcq',
    E'The diagram shows a method of treating coronary heart disease.\n\nWhich method of treating a coronary heart disease is shown in the diagram?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','angioplasty'),
      jsonb_build_object('id','b','text','coronary by-pass'),
      jsonb_build_object('id','c','text','stent'),
      jsonb_build_object('id','d','text','using aspirin')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2024-p1/q18-angioplasty.png',
    E'A — angioplasty [1 mark]. Only 37% scored — one of the poorest-performing questions. Candidates should be made familiar with the images of different procedures.',
    E'The diagram shows a **balloon being inflated inside the artery** to widen it — that''s **angioplasty**. A stent would be a metal mesh left in place. By-pass uses a graft vessel. Aspirin is a drug, not a procedure.',
    true
  );

  -- ─── Q19 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '19', 1, 'free',
    'mcq',
    E'The body has different types of defences against pathogens.\n\n1. antibodies\n2. hair in the nose\n3. mucus\n4. skin\n\nWhich defences are mechanical?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','1 and 2 only'),
      jsonb_build_object('id','b','text','1, 2 and 3 only'),
      jsonb_build_object('id','c','text','2, 3 and 4 only'),
      jsonb_build_object('id','d','text','2 and 4 only')
    ),
    to_jsonb('c'::text),
    null,
    E'C — 2, 3 and 4 only [1 mark]. Only 39% got it correct. Many candidates failed to link **mucus** to mechanical defence.',
    E'**Mechanical (physical) defences** physically BLOCK or TRAP pathogens before they enter cells:\n• Hair in nose — traps dust/microbes ✓\n• Mucus — traps microbes in the airways ✓\n• Skin — physical barrier ✓\n\nAntibodies are CHEMICAL (specific immune response, not mechanical).',
    true
  );

  -- ─── Q20 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '20', 1, 'free',
    'mcq',
    E'The table shows the composition of inspired and expired air.\n\nWhat are the percentages of **X** and **Y**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('b'::text),
    '/past-papers/biology-nssco-2024-p1/q20-air-table.png',
    E'B [1 mark]. Slightly above-average — only 51% scored.',
    E'Inspired vs expired air:\n• CO₂ goes from 0.04% (inspired) up to about **4%** (expired) — we breathe OUT more CO₂\n• Nitrogen stays at **78%** — it''s not used by the body\n• Other gases stay 1%\n\nSo X = 4 and Y = 78 — row **B**.',
    true
  );

  -- ─── Q21 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '21', 1, 'free',
    'mcq',
    E'The equation for aerobic respiration given below is incomplete.\n\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + ……………\n\nWhich information is needed to complete it?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','C₃H₆O₃'),
      jsonb_build_object('id','b','text','2C₂H₅OH'),
      jsonb_build_object('id','c','text','6H₂O'),
      jsonb_build_object('id','d','text','6O₂')
    ),
    to_jsonb('c'::text),
    null,
    E'C — 6H₂O [1 mark]. Well performed — 76% scored.',
    E'**Aerobic respiration** word + balanced equation:\n\nglucose + oxygen → carbon dioxide + water + ENERGY\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + **6H₂O**\n\nThe missing product is water (6 H₂O molecules to balance the hydrogen and oxygen atoms).',
    true
  );

  -- ─── Q22 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '22', 1, 'free',
    'mcq',
    E'The diagram shows the human urinary system.\n\nWhich organ re-absorbs glucose so that glucose is not lost in urine?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2024-p1/q22-urinary-system.png',
    E'A — kidney [1 mark]. Well performed — 77% scored.',
    E'The **kidney** (A) filters blood AND re-absorbs useful substances like **glucose, water, and salts** back into the blood, so they aren''t lost in urine. B = ureter (transports urine), C = bladder (stores urine), D = urethra (releases urine).',
    true
  );

  -- ─── Q23 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '23', 1, 'free',
    'mcq',
    E'In which way is a kidney transplant advantageous compared to the dialysis treatment?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','there is no organ rejection'),
      jsonb_build_object('id','b','text','it is a permanent solution'),
      jsonb_build_object('id','c','text','it is less expensive'),
      jsonb_build_object('id','d','text','it is not a risky procedure')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Only 41% scored. Many candidates opted for D — but a transplant is a surgical procedure, so it IS risky.',
    E'A kidney transplant is a **permanent (or long-term) solution** — you replace the failed kidney with a working one, so you no longer need dialysis. However, the transplant CAN be rejected, it IS expensive (surgery + lifelong drugs), and surgery IS risky. The only true advantage among the options is permanence.',
    true
  );

  -- ─── Q24 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '24', 1, 'free',
    'mcq',
    E'The diagram shows a seedling responding to light.\n\nWhat explains the response of the shoot?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','inhibited cell elongation of the lower side of the shoot'),
      jsonb_build_object('id','b','text','equal growth of cells on the upper and lower sides of the shoot'),
      jsonb_build_object('id','c','text','stimulated cell elongation of the lower side of the shoot'),
      jsonb_build_object('id','d','text','slowed growth of cells of the whole shoot')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2024-p1/q24-phototropism.png',
    E'C [1 mark]. Only 48% got it correct. Answers were ''all over'', indicating confusion about tropism.',
    E'This is **positive phototropism** — shoots grow TOWARDS light. The hormone **auxin** moves to the shaded (lower) side of the shoot. Auxin **stimulates** cells on the shaded side to elongate (grow longer), making the shoot bend towards the light. Stimulation, not inhibition.',
    true
  );

  -- ─── Q25 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '25', 1, 'free',
    'mcq',
    E'The diagram shows a neurone.\n\nWhich neurone is shown in the diagram?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','motor'),
      jsonb_build_object('id','b','text','relay'),
      jsonb_build_object('id','c','text','sensory'),
      jsonb_build_object('id','d','text','synapse')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2024-p1/q25-neurone.png',
    E'C — sensory [1 mark]. 59% scored.',
    E'Three types of neurone:\n• **Sensory** — long DENDRITE from receptor to cell body, then a short axon to the spinal cord. Cell body is in the middle/side, not at the end.\n• **Motor** — cell body at one end, long axon to the muscle.\n• **Relay** — short, found in CNS.\n\nThe diagram shows a long dendrite and the cell body to one side — that''s a **sensory** neurone. (Synapse isn''t a neurone — it''s the gap between two neurones.)',
    true
  );

  -- ─── Q26 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '26', 1, 'free',
    'mcq',
    E'The parts of the eye shown in the diagram are involved in accommodation.\n\nHow does each part change to accommodate a near object?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2024-p1/q26-eye-accommodation.png',
    E'A [1 mark]. Only 30% got it correct. Candidates needed to know the changes in three parts of the eye to accommodate a NEAR object. What happens for a near object is the opposite of what happens for a far object.',
    E'Accommodation for a **NEAR** object:\n• **Ciliary muscles CONTRACT** (tighten)\n• **Suspensory ligaments SLACKEN** (loosen)\n• **Lens becomes MORE CONVEX** (fatter) — bends light more\n\nFor a far object, it''s the opposite (relax / tighten / less convex). Row **A** matches near-object accommodation.',
    true
  );

  -- ─── Q27 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '27', 1, 'free',
    'mcq',
    E'Which response is an example of a voluntary action?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','changing the size of the pupil when entering a brightly lit room'),
      jsonb_build_object('id','b','text','salivating when looking at a delicious meal'),
      jsonb_build_object('id','c','text','answering the teacher''s question in class'),
      jsonb_build_object('id','d','text','withdrawing a hand from a hot object')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. 51% scored. Options A and D were also very popular.',
    E'**Voluntary actions** are controlled CONSCIOUSLY by the brain — you choose to do them. Answering a question requires thought → voluntary. The others are reflexes (involuntary, automatic): pupil constriction, salivation, hand withdrawal from heat all happen without conscious thought.',
    true
  );

  -- ─── Q28 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '28', 1, 'free',
    'mcq',
    E'The diagram shows the major endocrine glands in the human body.\n\nWhich endocrine gland produces insulin?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('b'::text),
    '/past-papers/biology-nssco-2024-p1/q28-endocrine-glands.png',
    E'B — pancreas [1 mark]. 67% answered correctly.',
    E'**Insulin** is produced by the **pancreas** (B in the diagram, located behind the stomach). A = pituitary (in brain), C = adrenals (on top of kidneys), D = ovaries/testes. Insulin lowers blood glucose by telling the liver to convert glucose into glycogen.',
    true
  );

  -- ─── Q29 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '29', 1, 'free',
    'mcq',
    E'Below is a list of processes involved in temperature regulation in humans.\n\n• shivering\n• sweating\n• vasoconstriction\n• vasodilation\n\nWhich processes occur when the body temperature rises above 37°C?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','shivering and sweating'),
      jsonb_build_object('id','b','text','sweating and vasoconstriction'),
      jsonb_build_object('id','c','text','sweating and vasodilation'),
      jsonb_build_object('id','d','text','vasoconstriction and vasodilation')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. 58% scored.',
    E'When body temperature is **too HIGH** (above 37°C):\n• **Sweating** — sweat evaporates from skin, removing heat ✓\n• **Vasodilation** — skin blood vessels widen, more heat lost by radiation ✓\n\nShivering and vasoconstriction are responses to being too COLD — they generate or conserve heat.',
    true
  );

  -- ─── Q30 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '30', 1, 'free',
    'mcq',
    E'The diploid number of chromosomes in the nucleus of the cell of a domestic cat is 38.\n\nHow many chromosomes will be in a sperm cell nucleus and a skin cell nucleus?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','sperm 19, skin 19'),
      jsonb_build_object('id','b','text','sperm 19, skin 38'),
      jsonb_build_object('id','c','text','sperm 38, skin 38'),
      jsonb_build_object('id','d','text','sperm 38, skin 19')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Most poorly performed question — only 25% scored. Most popular option was A, which is totally incorrect.',
    E'A sperm cell is a **gamete** — it''s HAPLOID, so it has HALF the diploid number: 38 ÷ 2 = **19 chromosomes**. A skin cell is a normal body (somatic) cell — it stays DIPLOID with the full **38 chromosomes**. Fertilisation will then restore 38 in the zygote.',
    true
  );

  -- ─── Q31 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '31', 1, 'free',
    'mcq',
    E'The menstrual cycle is controlled by the hormones FSH, LH, oestrogen and progesterone.\n\nWhich row shows a correct match between a hormone and its function?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','FSH — repairs the endometrium after menstruation'),
      jsonb_build_object('id','b','text','LH — causes the release of the mature egg from the ovary'),
      jsonb_build_object('id','c','text','oestrogen — maintains the thickness of the endometrium'),
      jsonb_build_object('id','d','text','progesterone — causes the growth of the follicles in the ovary')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Only 36% scored. Option C was nearly as popular as the correct B. More emphasis is needed on the function of reproductive hormones.',
    E'Correct hormone–function pairs:\n• **FSH** — grows the follicle (NOT repair the lining)\n• **LH** — triggers ovulation (releases the egg) ✓\n• **Oestrogen** — repairs the lining (NOT maintain it)\n• **Progesterone** — maintains the lining (NOT grow follicles)\n\nOnly row B is correct.',
    true
  );

  -- ─── Q32 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '32', 1, 'free',
    'mcq',
    E'The diagram shows a foetus during pregnancy.\n\nWhat is the function of the umbilical cord?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','absorbs mechanical shock'),
      jsonb_build_object('id','b','text','absorbs excess heat during pregnancy'),
      jsonb_build_object('id','c','text','attaches the foetus to the placenta'),
      jsonb_build_object('id','d','text','produces hormones during pregnancy')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2024-p1/q32-umbilical-cord.png',
    E'C [1 mark]. Well performed by 83% of candidates.',
    E'The **umbilical cord** connects the foetus to the **placenta**. Blood vessels inside the cord carry oxygen and nutrients TO the foetus and waste AWAY from it. Mechanical shock is absorbed by **amniotic fluid**. Hormones are made by the **placenta**, not the cord.',
    true
  );

  -- ─── Q33 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '33', 1, 'free',
    'mcq',
    E'Which method of birth control involves surgery?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','abstinence'),
      jsonb_build_object('id','b','text','condom'),
      jsonb_build_object('id','c','text','IUD'),
      jsonb_build_object('id','d','text','vasectomy')
    ),
    to_jsonb('d'::text),
    null,
    E'D — vasectomy [1 mark]. 62% scored.',
    E'A **vasectomy** is a surgical operation that cuts and ties the sperm ducts (vas deferens) in a male. The others are non-surgical: abstinence (behaviour), condom (barrier), IUD (fitted device — placed, not ''surgical'').',
    true
  );

  -- ─── Q34 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '34', 1, 'free',
    'mcq',
    E'Height in plants is controlled by a pair of alleles.  Allele T for tall height is dominant over allele t for short height.  Plants can be cross-pollinated to produce the required height.\n\nWhich crossing will produce a phenotypic ratio of 3:1 tall to short in the offspring?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','TT × tt'),
      jsonb_build_object('id','b','text','Tt × tt'),
      jsonb_build_object('id','c','text','Tt × Tt'),
      jsonb_build_object('id','d','text','TT × Tt')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. Slightly above average — 53% scored.',
    E'Only **Tt × Tt** gives a 3:1 ratio. Punnett square:\n\n|  | T | t |\n|--|---|---|\n|T | TT| Tt|\n|t | Tt| tt|\n\n→ 1 TT + 2 Tt = 3 tall; 1 tt = 1 short. **3:1**.\n\nThe other crosses give: TT×tt → all Tt (all tall); Tt×tt → 1:1; TT×Tt → all tall.',
    true
  );

  -- ─── Q35 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '35', 1, 'free',
    'mcq',
    E'Which type of variation is discontinuous?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','height in humans'),
      jsonb_build_object('id','b','text','length of leaves'),
      jsonb_build_object('id','c','text','mass of seeds'),
      jsonb_build_object('id','d','text','sex in humans')
    ),
    to_jsonb('d'::text),
    null,
    E'D — sex in humans [1 mark]. Only 43% scored, although it appears to be an easy question.',
    E'**Discontinuous** variation has a SMALL number of distinct categories with NO intermediates — e.g. male / female, blood group A/B/AB/O, attached/free earlobe. Height, leaf length, and seed mass all show a CONTINUOUS range (any value within a range) — that''s **continuous** variation.',
    true
  );

  -- ─── Q36 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '36', 1, 'free',
    'mcq',
    E'The diagram shows a photomicrograph of a leaf of a hydrophyte.\n\nWhich adaptive feature enables the leaf to float on the water surface?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('b'::text),
    '/past-papers/biology-nssco-2024-p1/q36-hydrophyte-leaf.png',
    E'B [1 mark]. Extremely poorly performed — only 28% scored. It seems the adaptive feature of large air spaces in aquatic plants is not well known.',
    E'A **hydrophyte** (water plant) has **large air spaces** (called aerenchyma) inside the leaf — these make the leaf less dense than water so it floats. Label B points to the large air-filled cavities. The other labels point to epidermis, cuticle, and other tissues that don''t provide buoyancy.',
    true
  );

  -- ─── Q37 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '37', 1, 'free',
    'mcq',
    E'Which organism has the lowest amount of energy available compared to the energy entering the food chain?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','carnivore that feeds on herbivores'),
      jsonb_build_object('id','b','text','herbivores that feed on the producers'),
      jsonb_build_object('id','c','text','producer that makes its own food'),
      jsonb_build_object('id','d','text','consumer that feeds on carnivores')
    ),
    to_jsonb('d'::text),
    null,
    E'D [1 mark]. Only 40% scored. Many candidates were attracted to C — but C is the PRODUCER which has the MOST energy.',
    E'Energy **decreases** at each trophic level (only ~10% passes on — the rest is lost as heat). The LONGER the food chain, the LESS energy reaches the top. A ''consumer that feeds on carnivores'' = TERTIARY consumer (4th level) — that''s the highest level listed, so it has the LEAST energy.',
    true
  );

  -- ─── Q38 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '38', 1, 'free',
    'mcq',
    E'The graph shows the phases of the sigmoid growth curve of population growth.\n\nWhich factor could limit the growth of the population at 5?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','decreased predation'),
      jsonb_build_object('id','b','text','lack of diseases'),
      jsonb_build_object('id','c','text','limited food supply'),
      jsonb_build_object('id','d','text','excess of reproducing individuals')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2024-p1/q38-sigmoid-growth.png',
    E'C [1 mark]. 63% got it correct.',
    E'Stage 5 on a sigmoid growth curve is the **stationary/plateau phase** — population is no longer growing because **limiting factors** (food, water, space, predators, disease) cap the size. **Limited food supply** is a classic limiting factor. The other options would all ALLOW growth, not limit it.',
    true
  );

  -- ─── Q39 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '39', 1, 'free',
    'mcq',
    E'The events listed below occur during eutrophication in a lake.\n\n1. aerobic bacteria break down dead organic matter\n2. algae absorb the nutrients, bloom and die\n3. amphibians, crustaceans and fish die due to lack of oxygen\n4. nutrients enter the lake\n5. water becomes deoxygenated\n\nWhich sequence of events is correct?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','2 → 1 → 3 → 4 → 5'),
      jsonb_build_object('id','b','text','2 → 1 → 5 → 4 → 3'),
      jsonb_build_object('id','c','text','4 → 3 → 5 → 1 → 2'),
      jsonb_build_object('id','d','text','4 → 2 → 1 → 5 → 3')
    ),
    to_jsonb('d'::text),
    null,
    E'D [1 mark]. 59% scored.',
    E'Eutrophication sequence:\n1. **Nutrients enter the lake** (e.g. fertiliser runoff)\n2. **Algae bloom** — they absorb the nutrients, then die\n3. **Aerobic bacteria decompose** the dead algae\n4. Bacteria use up OXYGEN — water becomes **deoxygenated**\n5. **Fish and other animals die** from lack of oxygen\n\nThe order is 4 → 2 → 1 → 5 → 3.',
    true
  );

  -- ─── Q40 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2024, '1', '40', 1, 'free',
    'mcq',
    E'Which methods can be used to help sustain fish stocks?\n\n(Table shows ✓ for ''method used'' and ✗ for ''method not used'' across four columns: education, legal quotas, restocking, increased fishing.)',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2024-p1/q40-fish-stocks-table.png',
    E'A [1 mark]. Only 40% got it correct. Teachers need to ensure the last topics also get attention.',
    E'To **sustain** fish stocks (keep them at a healthy level long-term):\n• **Education** about overfishing ✓\n• **Legal quotas** — limit how many fish can be caught ✓\n• **Restocking** — release young fish to replace those caught ✓\n• **Increased fishing** ✗ — this DEPLETES stocks, not sustains them\n\nRow A is the only one that includes the three good methods AND excludes ''increased fishing''.',
    true
  );

  raise notice 'Inserted 40 MCQ questions for Biology NSSCO 2024 Paper 1';
end $$;
