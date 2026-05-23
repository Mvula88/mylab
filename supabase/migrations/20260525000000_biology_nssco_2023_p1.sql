-- ===========================================================================
-- NSSCO Biology 2023 Paper 1 (6116/1) — 40 MCQ questions, 40 marks
-- Verbatim NIED wording. Official answers + commentary from
-- the DNEA Examiners Report 2023 (Biology section).
-- Diagrams cropped from past-papers/nssco-biology/2023/
-- into public/past-papers/biology-nssco-2023-p1/
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
    bio_id, 2023, '1', '1', 1, 'free',
    'mcq',
    E'A Grade 11 learner measured the length of three potato pieces that were left in distilled water for 1 hour.\n\nHe then added all three measurements together and divided the sum by 3.\n\nWhich mathematical procedure did the learner use?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','average'),
      jsonb_build_object('id','b','text','fraction'),
      jsonb_build_object('id','c','text','percentage'),
      jsonb_build_object('id','d','text','ratio')
    ),
    to_jsonb('a'::text),
    null,
    E'A — average [1 mark]. About 67% of candidates knew the correct answer. Options B and D also attracted candidates, likely due to guessing.',
    E'An **average** (mean) is calculated by **adding all values then dividing by the number of values**. Here: (length₁ + length₂ + length₃) ÷ 3 = the formula for a mean. A fraction is a part of a whole, a percentage is a fraction × 100, and a ratio compares two quantities — none of those match what the learner did.',
    true
  );

  -- ─── Q2 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '2', 1, 'free',
    'mcq',
    E'The diagram shows the structure of a virus.\n\nWhich labelled structure is the genetic material?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2023-p1/q2-virus.png',
    E'C [1 mark]. The majority of candidates, close to 80%, answered this question correctly.',
    E'Viruses have only THREE parts:\n• An outer **protein coat (capsid)** — labels A/B point to the hexagonal shell and its surface spikes\n• **Genetic material (DNA or RNA)** *inside* the coat — that''s the coiled strand labelled C\n• Sometimes envelope proteins/spikes for attaching to host cells — labelled D\n\nThe genetic material is always *inside*, never on the surface.',
    true
  );

  -- ─── Q3 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '3', 1, 'free',
    'mcq',
    E'Which row correctly matches a cell structure to its function?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','mitochondria — photosynthesis'),
      jsonb_build_object('id','b','text','ribosomes — protein synthesis'),
      jsonb_build_object('id','c','text','rough endoplasmic reticulum — digestion'),
      jsonb_build_object('id','d','text','vesicles — respiration')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. The functions of cell parts seem to be known by many candidates as 73.6% were able to find the correct answer.',
    E'Correct structure → function pairs:\n• **Mitochondria** → respiration (NOT photosynthesis — that''s chloroplasts)\n• **Ribosomes** → **protein synthesis** ✓\n• **Rough endoplasmic reticulum** → transports proteins (NOT digestion)\n• **Vesicles** → transport substances within the cell (NOT respiration)\n\nOnly row B is correct.',
    true
  );

  -- ─── Q4 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '4', 1, 'free',
    'mcq',
    E'The diagram shows two substances **Q** and **R** moving across a cell membrane into the cell.\n\nWhat can be done to facilitate the entry of substance **R** into the cell?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','reduce the amount of substance Q outside the cell'),
      jsonb_build_object('id','b','text','use optimum temperature around the cell'),
      jsonb_build_object('id','c','text','increase the amount of substance R inside the cell'),
      jsonb_build_object('id','d','text','use ATP energy for the process')
    ),
    to_jsonb('d'::text),
    '/past-papers/biology-nssco-2023-p1/q4-membrane-transport.png',
    E'D — use ATP energy [1 mark]. Many candidates found this question difficult; only 38.5% answered correctly. The concentration of R is lower OUTSIDE the cell and higher INSIDE — moving against the gradient requires active transport, which needs ATP.',
    E'Look at substance R in the diagram: there are FEWER R molecules outside the cell and MORE inside. To move R from low (outside) to high (inside) is going **against the concentration gradient**.\n\n• Diffusion / osmosis = passive, only moves DOWN a gradient — useless here\n• **Active transport** = moves substances AGAINST a gradient, but it COSTS energy → ATP is required\n\nSo the only way to facilitate R''s entry is by **using ATP**.',
    true
  );

  -- ─── Q5 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '5', 1, 'free',
    'mcq',
    E'The diagram shows the structure of a protein molecule.\n\nWhat are the basic units making up a protein molecule?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','amino acids'),
      jsonb_build_object('id','b','text','fatty acids'),
      jsonb_build_object('id','c','text','glycerol'),
      jsonb_build_object('id','d','text','glucose')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2023-p1/q5-protein-molecule.png',
    E'A — amino acids [1 mark]. This question was easy and 74.3% of candidates answered it correctly.',
    E'Three nutrients you must know by their building blocks:\n• **Protein** → made of **amino acids** ✓\n• **Lipid (fat)** → made of fatty acids + glycerol\n• **Carbohydrate** → made of simple sugars like glucose\n\nA long chain of amino acids folds into a protein. The little blocks in the diagram represent individual amino acids joined together.',
    true
  );

  -- ─── Q6 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '6', 1, 'free',
    'mcq',
    E'The diagram shows the effect of temperature on an enzyme-controlled reaction.\n\nWhich letter represents the optimum temperature for this enzyme-controlled reaction?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2023-p1/q6-enzyme-temperature-graph.png',
    E'C [1 mark]. It was easy for most candidates to spot that the optimum temperature is where the rate of reaction was at its highest. Close to 80% of candidates found the correct answer.',
    E'**Optimum temperature** = the temperature where the enzyme works **FASTEST** = the **PEAK** of the curve.\n\n• A — low rate, way below optimum\n• B — going up, but not yet at peak\n• **C — the peak (highest rate)** ✓\n• D — rate falling because the enzyme is starting to denature\n\nAlways look for the highest point on the graph.',
    true
  );

  -- ─── Q7 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '7', 1, 'free',
    'mcq',
    E'Which leaf tissue contains the most chloroplasts?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','lower epidermis'),
      jsonb_build_object('id','b','text','palisade mesophyll'),
      jsonb_build_object('id','c','text','spongy mesophyll'),
      jsonb_build_object('id','d','text','upper epidermis')
    ),
    to_jsonb('b'::text),
    null,
    E'B — palisade mesophyll [1 mark]. Slightly more than 60% of candidates answered correctly. The question appears easy and was targeting the E grade or lower candidates but 38.8% of candidates failed to find the correct answer.',
    E'Tissues of a leaf and their chloroplast content:\n• **Palisade mesophyll** — packed columns of cells *just below the top surface*, full of chloroplasts — most photosynthesis happens here ✓\n• Spongy mesophyll — has chloroplasts, but fewer, and the cells are loosely arranged\n• Upper & lower epidermis — protective layers; almost no chloroplasts (they''d block light)\n\nPalisade is closest to the light, so it gets the most chloroplasts.',
    true
  );

  -- ─── Q8 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '8', 1, 'free',
    'mcq',
    E'When carrying out a starch test on a leaf, the following four steps are carried out\n\n1. boil a leaf in water\n2. boil a leaf in ethanol\n3. rinse the leaf in water\n4. add iodine solution to a leaf\n\nWhy is step 3 necessary?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','to break the cell membranes'),
      jsonb_build_object('id','b','text','to decolourise the leaf'),
      jsonb_build_object('id','c','text','to soften the leaf'),
      jsonb_build_object('id','d','text','to break cell walls')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. At least 52.5% of the candidates knew the reason why the leaf has to be rinsed in water after being boiled in ethanol. Such knowledge is enhanced by carrying out the practical work during teaching.',
    E'What each step does in the starch test:\n1. **Boil in water** — kills cells and breaks cell membranes/walls\n2. **Boil in ethanol** — removes chlorophyll (this decolourises the leaf)\n3. **Rinse in water** — **softens the leaf** so iodine can penetrate the now-brittle tissue ✓\n4. **Add iodine** — blue-black colour = starch present\n\nA leaf taken out of hot ethanol is dry and brittle. Rinsing in water *softens* it so iodine can reach the inside.',
    true
  );

  -- ─── Q9 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '9', 1, 'free',
    'mcq',
    E'Which nutrient is lacking from the diet of a person with a swollen thyroid gland?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','iodine'),
      jsonb_build_object('id','b','text','iron'),
      jsonb_build_object('id','c','text','vitamin A'),
      jsonb_build_object('id','d','text','vitamin C')
    ),
    to_jsonb('a'::text),
    null,
    E'A — iodine [1 mark]. The performance was satisfactory. The second most popular option was B; some candidates confuse iodine with iron.',
    E'A swollen thyroid is called a **goitre**. It''s caused by **iodine deficiency** — without iodine, the thyroid cannot make its hormone (thyroxine) and *swells* trying to compensate.\n\nDeficiency cheat-sheet:\n• **Iodine** — goitre (swollen thyroid) ✓\n• Iron — anaemia (low haemoglobin)\n• Vitamin A — night blindness\n• Vitamin C — scurvy',
    true
  );

  -- ─── Q10 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '10', 1, 'free',
    'mcq',
    E'Which part of the alimentary canal is affected by the cholera bacterium?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','large intestine'),
      jsonb_build_object('id','b','text','oesophagus'),
      jsonb_build_object('id','c','text','small intestine'),
      jsonb_build_object('id','d','text','stomach')
    ),
    to_jsonb('c'::text),
    null,
    E'C — small intestine [1 mark]. Straightforward knowledge recall, but only 37.9% of candidates got it right. Many opted for D (stomach) because in everyday speech we call the whole abdominal area ''stomach''.',
    E'**Cholera** is caused by *Vibrio cholerae* bacteria. They attach to the wall of the **small intestine** and release a toxin that makes the gut pump water OUT of the body — causing severe watery diarrhoea and dehydration.\n\nThe stomach is too acidic for the bacteria to survive long; the large intestine just collects what comes from the small intestine. The damage starts in the **small intestine**.',
    true
  );

  -- ─── Q11 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '11', 1, 'free',
    'mcq',
    E'The diagram shows a structure of a villus.\n\nWhich labelled part of the villus absorbs fatty acids?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2023-p1/q11-villus.png',
    E'A [1 mark]. The majority of candidates answered the question correctly. A handful opted for B, which shows that they know the structures involved in absorption but are not sure of the substances absorbed.',
    E'A villus has two transport vessels:\n• **Lacteal** — a central lymph vessel — absorbs **fats (fatty acids + glycerol)** — label **A** ✓\n• **Blood capillaries** — surround the lacteal — absorb sugars and amino acids\n\nFatty acids are too big to enter the blood directly, so they go into the lacteal (lymph) first. The labels C/D point to blood capillaries below the villus.',
    true
  );

  -- ─── Q12 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '12', 1, 'free',
    'mcq',
    E'The diagram shows the internal structure of a leaf.\n\nAt which part does evaporation takes place?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2023-p1/q12-leaf-internal.png',
    E'C [1 mark]. Poorly answered — only 14.4% answered correctly. Most candidates picked D (stoma). Vapour FORMS at the surfaces of the spongy mesophyll cells (C); it then LEAVES through the stoma (D).',
    E'Two different steps that learners confuse:\n• **Evaporation** of water = water turns from liquid to vapour. This happens on the WET surfaces of **spongy mesophyll cells** (label C) where water from the cells meets the air in the air spaces.\n• **Diffusion out** of the leaf = water VAPOUR moves out through the stomata (label D).\n\nWater changes state *inside* the leaf (at C) before it leaves through the hole (D).',
    true
  );

  -- ─── Q13 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '13', 1, 'free',
    'mcq',
    E'Which chamber of the heart receives blood with the highest oxygen concentration?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','left atrium'),
      jsonb_build_object('id','b','text','left ventricle'),
      jsonb_build_object('id','c','text','right atrium'),
      jsonb_build_object('id','d','text','right ventricle')
    ),
    to_jsonb('a'::text),
    null,
    E'A — left atrium [1 mark]. Only 41.8% of candidates found the correct answer. Studying and understanding the content is much more useful than only revising past question papers.',
    E'Flow of blood through the heart:\n• Body → **right atrium** (deoxygenated) → right ventricle → LUNGS (gets oxygen) → **left atrium** (oxygenated) → left ventricle → body\n\nThe **left atrium RECEIVES** the freshly-oxygenated blood coming from the lungs through the pulmonary veins. So it holds blood with the highest oxygen concentration.\n\n(The left ventricle has the same oxygen level, but it doesn''t *receive* the blood — the atrium does.)',
    true
  );

  -- ─── Q14 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '14', 1, 'free',
    'mcq',
    E'What is the function of the lymphatic system?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','excrete waste'),
      jsonb_build_object('id','b','text','protection from infections'),
      jsonb_build_object('id','c','text','supply oxygen'),
      jsonb_build_object('id','d','text','transport blood')
    ),
    to_jsonb('b'::text),
    null,
    E'B — protection from infections [1 mark]. About 57.2% of candidates knew the function. Among all the options, only B applies to the lymphatic system.',
    E'The **lymphatic system** has two main jobs:\n• Returns tissue fluid (lymph) to the blood\n• **Houses lymphocytes (white blood cells)** that fight infection — this is its IMMUNE / protective role ✓\n\nThe other options match different systems:\n• Excretion → kidneys, skin, lungs\n• Oxygen supply → respiratory + circulatory systems\n• Blood transport → circulatory system (heart + blood vessels)',
    true
  );

  -- ─── Q15 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '15', 1, 'free',
    'mcq',
    E'Which blood component transports oxygen?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','plasma'),
      jsonb_build_object('id','b','text','platelets'),
      jsonb_build_object('id','c','text','red blood cells'),
      jsonb_build_object('id','d','text','white blood cells')
    ),
    to_jsonb('c'::text),
    null,
    E'C — red blood cells [1 mark]. This was the third easiest question, resulting in 81.6% of candidates answering it correctly.',
    E'Four parts of blood and what they do:\n• **Red blood cells** — carry **oxygen** using the protein haemoglobin ✓\n• White blood cells — fight infection\n• Platelets — help blood clot\n• Plasma — liquid that carries dissolved substances (CO₂, salts, glucose, urea)\n\nOnly red blood cells contain haemoglobin, which binds oxygen.',
    true
  );

  -- ─── Q16 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '16', 1, 'free',
    'mcq',
    E'Which two substances may be found in lower concentration in the inspired air compared to expired air?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','nitrogen and oxygen'),
      jsonb_build_object('id','b','text','nitrogen and water'),
      jsonb_build_object('id','c','text','oxygen and carbon dioxide'),
      jsonb_build_object('id','d','text','water and carbon dioxide')
    ),
    to_jsonb('d'::text),
    null,
    E'D — water and carbon dioxide [1 mark]. Required candidates to know which gases are waste/excess in expired air. Only 34.7% answered correctly.',
    E'The question asks: which gases are **LOWER in inspired** (breathed-in) air than in **expired** (breathed-out) air? In other words: which gases do we ADD to the air as we breathe out?\n\n• **Carbon dioxide** — we make CO₂ during respiration → exhale more of it ✓\n• **Water vapour** — lungs are moist; we exhale water vapour ✓\n• Oxygen — we USE it → less in expired air, MORE in inspired (opposite)\n• Nitrogen — body doesn''t use it, same in both\n\nSo the two that are LOWER in inspired air = water and CO₂.',
    true
  );

  -- ─── Q17 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '17', 1, 'free',
    'mcq',
    E'Which health condition is most likely caused by the accumulation of a layer of tar from tobacco smoke in the lungs?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','coronary heart disease'),
      jsonb_build_object('id','b','text','high blood pressure'),
      jsonb_build_object('id','c','text','low oxygen carrying capacity'),
      jsonb_build_object('id','d','text','lung cancer')
    ),
    to_jsonb('d'::text),
    null,
    E'D — lung cancer [1 mark]. The majority of candidates, 72.4%, answered this question correctly.',
    E'Tobacco smoke harm — match the chemical to the disease:\n• **Tar** — contains carcinogens (cancer-causing chemicals) that build up in the lungs → **lung cancer** ✓\n• Nicotine → addiction + raises blood pressure → contributes to coronary heart disease\n• Carbon monoxide → binds to haemoglobin → low oxygen carrying capacity\n\nThe question specifies **tar**, so the matching disease is lung cancer.',
    true
  );

  -- ─── Q18 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '18', 1, 'free',
    'mcq',
    E'Which is a product of anaerobic respiration in humans?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','alcohol'),
      jsonb_build_object('id','b','text','carbon dioxide'),
      jsonb_build_object('id','c','text','lactic acid'),
      jsonb_build_object('id','d','text','water')
    ),
    to_jsonb('c'::text),
    null,
    E'C — lactic acid [1 mark]. About 65% found the correct answer. Many opted for B (carbon dioxide), forgetting the question is about ANAEROBIC respiration in HUMANS.',
    E'Anaerobic respiration depends on the organism:\n• **Humans (animals)** → glucose → **lactic acid** + a little energy ✓\n• Yeast (plants) → glucose → alcohol (ethanol) + carbon dioxide + a little energy\n\nCO₂ and water are products of **aerobic** respiration — the question specifically asks about ANAEROBIC respiration. And alcohol is yeast, not humans.',
    true
  );

  -- ─── Q19 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '19', 1, 'free',
    'mcq',
    E'Which function is performed by the liver?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','controlling blood pH'),
      jsonb_build_object('id','b','text','producing insulin'),
      jsonb_build_object('id','c','text','producing urea'),
      jsonb_build_object('id','d','text','removing salts')
    ),
    to_jsonb('c'::text),
    null,
    E'C — producing urea [1 mark]. Close to 50% found the correct answer. A significant number opted for B; while insulin acts on the liver, it is produced by the pancreas — NOT the liver.',
    E'What the liver does (key roles):\n• **Produces urea** from excess amino acids (deamination) — urea is then excreted by the kidneys ✓\n• Stores glycogen and releases glucose\n• Makes bile\n• Breaks down old red blood cells\n• Detoxifies alcohol and drugs\n\nThe distractors belong to other organs: blood pH is controlled by lungs/kidneys, insulin is made by the **pancreas**, and salts are removed by the **kidneys**.',
    true
  );

  -- ─── Q20 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '20', 1, 'free',
    'mcq',
    E'Which substance is removed from blood by a dialysis machine?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','amino acids'),
      jsonb_build_object('id','b','text','glucose'),
      jsonb_build_object('id','c','text','salts'),
      jsonb_build_object('id','d','text','urea')
    ),
    to_jsonb('d'::text),
    null,
    E'D — urea [1 mark]. Only 62.4% of candidates found the correct answer although the question appears simple.',
    E'A dialysis machine does the job of a failed kidney: it removes **waste** from the blood while keeping useful substances.\n\n• **Urea** = nitrogenous waste → REMOVED ✓\n• Amino acids, glucose → useful → KEPT in blood\n• Salts → only EXCESS is removed; the dialysis fluid contains salts at the normal blood level so there''s no NET loss\n\nThe one thing the body has TOO MUCH of (and must lose) is urea.',
    true
  );

  -- ─── Q21 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '21', 1, 'free',
    'mcq',
    E'The diagram shows seedlings with roots shortly after germination, and then two days after.  Light is acting from upwards and gravity from downward.\n\nWhich growth responses are shown after two days?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','negative gravitropism and negative phototropism'),
      jsonb_build_object('id','b','text','negative phototropism and positive gravitropism'),
      jsonb_build_object('id','c','text','positive gravitropism and positive phototropism'),
      jsonb_build_object('id','d','text','positive phototropism and negative gravitropism')
    ),
    to_jsonb('d'::text),
    '/past-papers/biology-nssco-2023-p1/q21-seedlings-tropism.png',
    E'D [1 mark]. The diagram shows that two days after germination, the SHOOTS were turning UPWARDS — toward light and away from gravity. Only about 45% gave the correct answer.',
    E'Tropism naming = direction + stimulus:\n• **Positive** = growth TOWARDS the stimulus\n• **Negative** = growth AWAY from the stimulus\n\nShoots in the diagram grow UPWARDS:\n• Light is from ABOVE → growing toward light = **positive phototropism** ✓\n• Gravity acts DOWN → growing UP = **AGAINST** gravity = **negative gravitropism** ✓\n\n(Roots show the opposite: positive gravitropism + negative phototropism.)',
    true
  );

  -- ─── Q22 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '22', 1, 'free',
    'mcq',
    E'The diagram shows two neurones and the direction of impulse transmission.\n\nAt which labelled point will a neurone attach to an effector?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('d'::text),
    '/past-papers/biology-nssco-2023-p1/q22-neurones.png',
    E'D [1 mark]. Candidates needed to know the structures of motor and sensory neurones. The second most popular option was C — candidates didn''t know which part of the motor neurone connects with the effector.',
    E'Two neurones in the diagram:\n• Top neurone = **sensory** (carries impulse from a receptor in) — labels A and B on this one\n• Bottom neurone = **motor** (carries impulse OUT to an effector)\n\nAn **effector** is a muscle or gland that responds. The motor neurone''s **axon ENDS** at the effector. Label **D** is at the *terminal end* of the motor neurone — that''s where it attaches to the effector. C is the cell body, A and B are on the wrong (sensory) neurone.',
    true
  );

  -- ─── Q23 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '23', 1, 'free',
    'mcq',
    E'Which part of the eye detects light?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','cornea'),
      jsonb_build_object('id','b','text','iris'),
      jsonb_build_object('id','c','text','pupil'),
      jsonb_build_object('id','d','text','retina')
    ),
    to_jsonb('d'::text),
    null,
    E'D — retina [1 mark]. The light receptors are at the BACK of the eye (in the retina). Only 29.2% answered correctly.',
    E'Light enters the eye through several parts, but is only DETECTED at one:\n• **Cornea** — transparent front; bends (refracts) light\n• **Iris** — coloured muscle that controls pupil size\n• **Pupil** — the hole light passes through (not a structure)\n• **Retina** — the LIGHT-SENSITIVE layer at the BACK; contains rods + cones (the photoreceptors) ✓\n\nOnly the retina has cells that turn light into nerve impulses.',
    true
  );

  -- ─── Q24 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '24', 1, 'free',
    'mcq',
    E'Which change enables the eye to accommodate a near object?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','ciliary muscles contract'),
      jsonb_build_object('id','b','text','ciliary muscles relax'),
      jsonb_build_object('id','c','text','suspensory ligaments tighten'),
      jsonb_build_object('id','d','text','lens become thinner')
    ),
    to_jsonb('a'::text),
    null,
    E'A — ciliary muscles contract [1 mark]. Only about 41% answered correctly. Accommodation can only be mastered if all parts are studied in relation to one another.',
    E'Accommodation for a **NEAR** object — three linked changes:\n1. **Ciliary muscles CONTRACT** (tighten) ✓\n2. **Suspensory ligaments SLACKEN** (loosen) — so they''re NOT tightening (C is wrong)\n3. **Lens becomes FATTER / thicker** (more convex) — so it bends light more (D is wrong)\n\nFor a FAR object, it''s the opposite: muscles relax, ligaments tighten, lens becomes thinner.',
    true
  );

  -- ─── Q25 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '25', 1, 'free',
    'mcq',
    E'The diagram shows some organs of the endocrine system.\n\nWhich organ produces adrenaline?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2023-p1/q25-endocrine-organs.png',
    E'C [1 mark]. About 58% answered correctly. It is puzzling that this cohort struggled even on questions presented with familiar diagrams.',
    E'Endocrine glands in the diagram:\n• A — **thyroid** (in the neck) → produces thyroxine\n• B — **pancreas** → produces insulin / glucagon\n• **C — adrenal glands** (sit on top of the kidneys) → produce **adrenaline** ✓\n• D — **ovaries / testes** → reproductive hormones\n\nAdrenaline is the ''fight-or-flight'' hormone made by the small triangular adrenal glands above the kidneys.',
    true
  );

  -- ─── Q26 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '26', 1, 'free',
    'mcq',
    E'The diagram shows changes in blood glucose level and hormonal secretion.\n\nWhich letter shows the response resulting in a reduction in blood glucose level?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2023-p1/q26-blood-glucose-flowchart.png',
    E'A [1 mark]. Only 25% answered correctly. The question could be solved by knowing the roles of insulin and glucagon in blood-sugar regulation.',
    E'Insulin and glucagon do **opposite** jobs:\n• When blood glucose is **HIGH** → pancreas releases **insulin** → liver stores glucose as glycogen → blood glucose **DROPS** ✓\n• When blood glucose is **LOW** → pancreas releases **glucagon** → liver releases glucose → blood glucose **RISES**\n\nIn the flowchart, the route ''INCREASE in blood glucose → increase in **insulin**'' is the response that REDUCES the level → that''s **A**.',
    true
  );

  -- ─── Q27 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '27', 1, 'free',
    'mcq',
    E'Which statement describes the products of mitosis correctly?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','four genetically identical cells'),
      jsonb_build_object('id','b','text','four genetically different cells'),
      jsonb_build_object('id','c','text','two genetically identical cells'),
      jsonb_build_object('id','d','text','two genetically different cells')
    ),
    to_jsonb('c'::text),
    null,
    E'C — two genetically identical cells [1 mark]. The majority of candidates, more than 70%, scored.',
    E'**Mitosis vs meiosis** — memorise the difference:\n• **Mitosis** → **2** daughter cells, genetically **IDENTICAL** to the parent (used for growth + repair) ✓\n• Meiosis → 4 daughter cells, genetically DIFFERENT (used for making gametes)\n\nKey trick: ''mIToSIS'' has the word ''IT IS'' — IT IS the same as the parent.',
    true
  );

  -- ─── Q28 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '28', 1, 'free',
    'mcq',
    E'Which structure of the flower receives pollen grains during pollination?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','anther'),
      jsonb_build_object('id','b','text','filament'),
      jsonb_build_object('id','c','text','petal'),
      jsonb_build_object('id','d','text','stigma')
    ),
    to_jsonb('d'::text),
    null,
    E'D — stigma [1 mark]. More than 80% of candidates answered this question correctly.',
    E'Flower parts and roles:\n• Anther → **makes** pollen (male)\n• Filament → stalk that holds the anther\n• Petal → attracts pollinators\n• **Stigma** → sticky tip at the top of the female part; RECEIVES pollen during pollination ✓\n\nPollination = pollen moves FROM anther → TO stigma. The stigma is where it lands.',
    true
  );

  -- ─── Q29 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '29', 1, 'free',
    'mcq',
    E'The diagram shows some stages in the female reproductive system.\n\nWhich stage is ovulation?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2023-p1/q29-female-reproductive.png',
    E'A [1 mark]. The diagram has been used in many past questions. Only 53.7% answered correctly — assumed some candidates didn''t read the question but reproduced answers seen in past papers.',
    E'**Ovulation** = the moment a mature egg is RELEASED from the ovary.\n\nIn the diagram:\n• **A — egg leaving the ovary** = OVULATION ✓\n• B — egg moving in the oviduct (fallopian tube)\n• C — fertilisation occurring\n• D — implantation in the uterus wall\n\nOvulation is the *first* event in the journey — the egg breaking out of the ovary.',
    true
  );

  -- ─── Q30 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '30', 1, 'free',
    'mcq',
    E'Which sequence shows the correct developmental stages in humans?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','embryo  →  zygote  →  fetus'),
      jsonb_build_object('id','b','text','zygote  →  embryo  →  fetus'),
      jsonb_build_object('id','c','text','fetus  →  embryo  →  zygote'),
      jsonb_build_object('id','d','text','zygote  →  fetus  →  embryo')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. About 41% failed to spot the correct sequence. The most popular incorrect option was A, as candidates confused embryo with fetus.',
    E'Three stages in order, smallest to most developed:\n1. **Zygote** — the single cell formed at fertilisation (egg + sperm fused)\n2. **Embryo** — the ball of cells in the first ~8 weeks; organs starting to form\n3. **Fetus** — from ~9 weeks until birth; recognisable as a baby\n\nMemory hook: Z-E-F (alphabetical order is also developmental order).',
    true
  );

  -- ─── Q31 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '31', 1, 'free',
    'mcq',
    E'Which type of pathogen causes AIDS?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','bacterium'),
      jsonb_build_object('id','b','text','fungus'),
      jsonb_build_object('id','c','text','protozoan'),
      jsonb_build_object('id','d','text','virus')
    ),
    to_jsonb('d'::text),
    null,
    E'D — virus [1 mark]. This question was answered correctly by close to 80% of candidates.',
    E'AIDS is caused by **HIV (Human Immunodeficiency Virus)** — clue is in the name. HIV destroys white blood cells (helper T cells) so the immune system can no longer fight infections.\n\nOther pathogen examples to know:\n• Bacterium → cholera, TB\n• Fungus → athlete''s foot, ringworm\n• Protozoan → malaria\n• Virus → AIDS ✓, influenza, COVID-19, common cold',
    true
  );

  -- ─── Q32 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '32', 1, 'free',
    'mcq',
    E'The diagram shows how characteristics are inherited in mice.\n\nWhich mouse in the diagram shows that the white hair characteristic is recessive?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','Bb parent'),
      jsonb_build_object('id','b','text','bb parent'),
      jsonb_build_object('id','c','text','Bb offspring'),
      jsonb_build_object('id','d','text','bb offspring')
    ),
    to_jsonb('c'::text),
    '/past-papers/biology-nssco-2023-p1/q32-mice-inheritance.png',
    E'C — Bb offspring [1 mark]. Test crosses determine the genotype of parents by looking at the phenotype of offspring. Only 14.4% answered correctly.',
    E'**Recessive** = the allele is only expressed when both copies are present (e.g. **bb**). It''s MASKED when paired with a dominant allele (e.g. Bb).\n\nWhich mouse PROVES white is recessive?\n• **Bb offspring** is **BLACK** even though it CARRIES the white allele (b) — that proves the b (white) allele was masked by the dominant B → so b/white IS recessive ✓\n• The bb mouse is white because both alleles are b — that just tells you bb gives white, not which is dominant.\n• Looking at the Bb mouse and seeing ''b is hidden under B'' is the proof.',
    true
  );

  -- ─── Q33 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '33', 1, 'free',
    'mcq',
    E'Which term is used to describe an organism as having two identical alleles of a particular gene?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','heterozygous'),
      jsonb_build_object('id','b','text','homozygous'),
      jsonb_build_object('id','c','text','genotype'),
      jsonb_build_object('id','d','text','phenotype')
    ),
    to_jsonb('b'::text),
    null,
    E'B — homozygous [1 mark]. Slightly more than 60% answered correctly. It is expected for more candidates to perform well in knowledge-recall questions.',
    E'Memorise four genetics words:\n• **Homozygous** = two **SAME** alleles (e.g. BB or bb) — ''homo'' means same ✓\n• Heterozygous = two DIFFERENT alleles (e.g. Bb) — ''hetero'' means different\n• Genotype = the combination of alleles (e.g. Bb)\n• Phenotype = the physical appearance (e.g. black hair)\n\nIdentical alleles → homozygous.',
    true
  );

  -- ─── Q34 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '34', 1, 'free',
    'mcq',
    E'Which type of variation is controlled by genetic factors only?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','human height'),
      jsonb_build_object('id','b','text','size of leaves'),
      jsonb_build_object('id','c','text','skin colour'),
      jsonb_build_object('id','d','text','tongue rolling')
    ),
    to_jsonb('d'::text),
    null,
    E'D — tongue rolling [1 mark]. Only half of candidates answered correctly. Examples of variations should be emphasised.',
    E'Some variation is caused by genes alone; some is caused by genes + environment.\n\n**Genetic only** (you can''t change it by lifestyle):\n• **Tongue rolling** ✓ — you either have the gene or you don''t\n• Blood group, eye colour, gender\n\n**Genes + environment**:\n• Human height — genes set a range, but nutrition/exercise affect actual height\n• Skin colour — genes + sun exposure (tanning)\n• Size of leaves — genes + water, light, nutrients\n\nTongue rolling is the only one in the list that isn''t affected by environment.',
    true
  );

  -- ─── Q35 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '35', 1, 'free',
    'mcq',
    E'Which term is generally used to describe plants that are adapted to grow in dry environments?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','dictotyledons'),
      jsonb_build_object('id','b','text','hydrophytes'),
      jsonb_build_object('id','c','text','monocotyledons'),
      jsonb_build_object('id','d','text','xerophytes')
    ),
    to_jsonb('d'::text),
    null,
    E'D — xerophytes [1 mark]. About 76% identified the plants as xerophytes. The most popular wrong answer was B (hydrophytes) — distinction needs to be made between the two.',
    E'Root meanings make these easy:\n• **''Xero-'' = dry** → **xerophytes** = plants of DRY places (e.g. cacti, !nara melon) ✓\n• ''Hydro-'' = water → hydrophytes = plants of WATER (e.g. water lily)\n• Monocotyledons / dicotyledons = grouping by number of seed leaves — not by environment\n\nDry → xero → **xerophyte**.',
    true
  );

  -- ─── Q36 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '36', 1, 'free',
    'mcq',
    E'Which organisms are described as animals that obtain their energy by eating plants only?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','carnivores'),
      jsonb_build_object('id','b','text','decomposers'),
      jsonb_build_object('id','c','text','herbivores'),
      jsonb_build_object('id','d','text','omnivores')
    ),
    to_jsonb('c'::text),
    null,
    E'C — herbivores [1 mark]. The majority of candidates, 73%, answered this question correctly.',
    E'Feeding categories:\n• **Herbivore** — eats ONLY plants (e.g. cow, springbok) ✓\n• Carnivore — eats ONLY animals (e.g. lion, cheetah)\n• Omnivore — eats BOTH plants and animals (e.g. human, pig)\n• Decomposer — breaks down dead material (e.g. fungi, bacteria)\n\nThe key word in the question is ''plants ONLY'' → herbivore.',
    true
  );

  -- ─── Q37 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '37', 1, 'free',
    'mcq',
    E'The diagram shows a food web.\n\nWhich food chain is from this food web?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','vegetation  →  rabbits  →  stoats  →  foxes'),
      jsonb_build_object('id','b','text','vegetation  →  voles  →  spiders  →  toads'),
      jsonb_build_object('id','c','text','vegetation  →  voles  →  rabbits  →  spiders'),
      jsonb_build_object('id','d','text','vegetation  →  spiders  →  kestrels  →  stoats')
    ),
    to_jsonb('a'::text),
    '/past-papers/biology-nssco-2023-p1/q37-food-web.png',
    E'A [1 mark]. This was the easiest question in the paper and 88.5% of candidates also found it easy.',
    E'A valid **food chain** must have arrows that ALL exist in the food web — and each arrow must point FROM the eaten TO the eater.\n\nCheck each option against the web:\n• **A: vegetation → rabbits → stoats → foxes** — all arrows exist ✓\n• B — voles don''t eat spiders (voles are herbivores)\n• C — rabbits don''t eat voles\n• D — spiders don''t eat vegetation directly (they eat insects)\n\nA is the only chain where every arrow is in the web.',
    true
  );

  -- ─── Q38 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '38', 1, 'free',
    'mcq',
    E'Which process breaks down nitrates into nitrogen gas?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','decomposition'),
      jsonb_build_object('id','b','text','denitrification'),
      jsonb_build_object('id','c','text','nitrification'),
      jsonb_build_object('id','d','text','nitrogen fixation')
    ),
    to_jsonb('b'::text),
    null,
    E'B — denitrification [1 mark]. The nitrogen cycle continues to be a problem to candidates. Only 31% answered correctly.',
    E'The four nitrogen-cycle steps — names give you the meaning:\n• **Denitrification** — ''DE-nitrification'' = removes nitrogen — bacteria convert **nitrates → nitrogen GAS (N₂)** ✓\n• Nitrification — bacteria convert ammonia → nitrites → nitrates (build-up)\n• Nitrogen fixation — N₂ gas → nitrates (the OPPOSITE of denitrification)\n• Decomposition — breaks dead material into ammonia (separate step)\n\nBreaks DOWN nitrates → DEnitrification.',
    true
  );

  -- ─── Q39 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '39', 1, 'free',
    'mcq',
    E'The diagram shows a pond.\n\nWhich letter represents an ecosystem?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('b'::text),
    '/past-papers/biology-nssco-2023-p1/q39-pond-ecosystem.png',
    E'B [1 mark]. More than 70% of candidates answered the question correctly.',
    E'Ecology levels (smallest → biggest):\n• **Organism** — a single living thing (the crowned crane = A)\n• **Population** — all members of ONE species in one place\n• **Community** — all the populations together (C — all the species near the pond)\n• **Habitat** — the place where an organism lives (D — the pond water itself)\n• **Ecosystem** — the **community + its non-living environment** (B — pond water, plants, animals, sunlight, soil, etc., all interacting) ✓\n\nAn ecosystem is the WHOLE thing — that''s the bracket that includes everything.',
    true
  );

  -- ─── Q40 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    bio_id, 2023, '1', '40', 1, 'free',
    'mcq',
    E'Which method of sustaining fish stock involves teaching fishermen and a community at large about the importance of maintaining fish stock?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','captive breeding'),
      jsonb_build_object('id','b','text','education'),
      jsonb_build_object('id','c','text','re-stocking'),
      jsonb_build_object('id','d','text','setting fishing quotas')
    ),
    to_jsonb('b'::text),
    null,
    E'B — education [1 mark]. Close to 50% of candidates answered correctly, although the question seemed easy. Candidates should read questions carefully.',
    E'Match the method to its keyword:\n• **Education** — *teaching* people about fish sustainability → that''s what the question describes ✓\n• Captive breeding — breeding fish in tanks/farms\n• Re-stocking — putting young fish back into the wild\n• Fishing quotas — legal limits on how many fish can be caught\n\nThe question literally says ''teaching'' — education is the only matching option.',
    true
  );

  raise notice 'Inserted 40 MCQ questions for Biology NSSCO 2023 Paper 1';
end $$;
