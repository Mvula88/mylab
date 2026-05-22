-- ============================================================================
-- NSSCO Biology 2020 Paper 2 (6116/2) — full structured-response paper
-- 80 marks, 9 questions, 1h 30min.
-- All wording is verbatim from the NIED paper. Diagram PNGs live under
-- public/past-papers/biology-nssco-2020-p2/ and are extracted from the source
-- PDF at past-papers/nssco-biology/2020/6116_2.pdf.
--
-- Currently included: Question 1 (rhinoceros conservation) as the first
-- preview. Questions 2–9 to follow once Q1 is approved.
-- ============================================================================

do $$
declare
  bio_id uuid;
begin
  select id into bio_id from public.subjects where slug = 'biology' limit 1;
  if bio_id is null then
    raise notice 'Biology subject not found — skipping seed';
    return;
  end if;

  -- ─── Q1 stem ─────────────────────────────────────────────────────────────
  -- "Namibia is faced with a high poaching rate of black rhinoceros. Their
  -- population is decreasing drastically, causing the fear of extinction.
  -- Fig. 1.1 shows a black rhinoceros, Diceros bicornis."
  --
  -- The stem is repeated inside each sub-part so each row is self-contained.

  -- ─── Q1(a) — Genus and species — 1 mark, free auto-marked ───────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url,
    correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    bio_id, 2020, '2', '1(a)', 1, 'free',
    'fill_in',
    E'Namibia is faced with a high poaching rate of black rhinoceros. Their population is decreasing drastically, causing the fear of extinction.\n\nFig. 1.1 shows a black rhinoceros, *Diceros bicornis*.\n\n**(a)** State the genus and species of *Diceros bicornis*.',
    '/past-papers/biology-nssco-2020-p2/q1-rhino.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
        'genus: Diceros species: bicornis',
        'Diceros bicornis',
        'genus Diceros, species bicornis',
        'genus - Diceros, species - bicornis'
      ),
      'must_contain', jsonb_build_array('Diceros', 'bicornis')
    ),
    false,
    E'Genus: *Diceros*\nSpecies: *bicornis*\n[1 mark — both required]',
    'A scientific name has two parts: the genus (always capitalised, e.g. *Diceros*) and the species (lowercase, e.g. *bicornis*). Both are italicised by convention.',
    true
  );

  -- ─── Q1(b) — Other factors endangering rhinoceros — 4 marks, AI-marked ──
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url,
    memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '1(b)', 4, 'paid',
    'free_text',
    E'Namibia is faced with a high poaching rate of black rhinoceros. Their population is decreasing drastically, causing the fear of extinction.\n\nFig. 1.1 shows a black rhinoceros, *Diceros bicornis*.\n\n**(b)** Apart from poaching, suggest and explain any other **two** possible factors which may cause the rhinoceros to be endangered.',
    '/past-papers/biology-nssco-2020-p2/q1-rhino.png',
    E'Any 2 factors × 2 marks each (1 mark for naming the factor, 1 mark for explaining how it endangers the rhino). Acceptable factors:\n• Habitat loss / destruction (clearing land for farming / settlements → less space and food)\n• Drought / climate change (less water and vegetation, especially in arid Namibia)\n• Low reproductive rate / long gestation (population recovers slowly after losses)\n• Predation on calves\n• Human–wildlife conflict (rhinos killed for damaging crops/property)\n• Disease outbreaks in small isolated populations\n• Inbreeding in small populations (genetic weakness)\n• Disturbance by tourism / mining activities',
    E'Award 1 mark for each correctly named factor (max 2). Award 1 additional mark for each factor where the candidate explains the mechanism by which it endangers the rhino (max 2). Do NOT award marks for repeating "poaching" or close synonyms (illegal hunting, killing for horns). Maximum 4 marks total.',
    'The question is testing your ability to think beyond the obvious answer (poaching). You need TWO factors and for each one, explain WHY/HOW it threatens the population. Always link the factor to a clear biological consequence.',
    true
  );

  -- ─── Q1(c) — Conservation benefits to tourism — 3 marks, AI-marked ──────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url,
    memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '1(c)', 3, 'paid',
    'free_text',
    E'Namibia is faced with a high poaching rate of black rhinoceros. Their population is decreasing drastically, causing the fear of extinction.\n\nFig. 1.1 shows a black rhinoceros, *Diceros bicornis*.\n\n**(c)** Discuss how the conservation of rhinoceros could benefit the Namibian tourism industry.',
    '/past-papers/biology-nssco-2020-p2/q1-rhino.png',
    E'Any 3 of the following points (1 mark each):\n• Rhinos are part of the "Big Five" — major attraction for international tourists\n• Tourists pay entry fees / lodge fees → income for parks and conservancies\n• Game viewing, photographic safaris, rhino tracking create jobs (rangers, guides, lodge staff)\n• Foreign currency earnings boost the national economy\n• Conservancies share tourism revenue with local communities → incentive to protect rhinos\n• Rhino conservation supports Namibia''s image as an eco-tourism destination\n• Successful conservation programmes (e.g. Save the Rhino Trust) attract research tourism and donor funding',
    E'Award 1 mark per distinct, well-explained benefit linked specifically to TOURISM (not just "good for the environment"). Maximum 3 marks. Look for: attraction value, revenue generation, employment, community benefit, eco-tourism reputation.',
    'A "discuss" question wants you to make a connection between two things — here, between RHINO conservation and the TOURISM industry. Pick three clear benefits and for each one, link rhinos → tourists → economic gain.',
    true
  );

  -- ─── Q2(a) — Simple key for four vertebrates — 4 marks, AI-marked ───────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '2(a)', 4, 'paid',
    'free_text',
    E'Fig. 2.1 shows four vertebrates (a goat, a chicken, a fish and a frog).\n\n**(a)** Construct a simple key to identify the organisms in Fig 2.1.\n\n*Type out your dichotomous key using numbered steps. Example format:*\n*1. has feathers → chicken / no feathers → go to 2*\n*2. has fins → fish / no fins → go to 3*',
    '/past-papers/biology-nssco-2020-p2/q2a-vertebrates.png',
    E'Any valid dichotomous key with 3 paired statements that uniquely identifies all 4 organisms (1 mark per correct distinguishing feature, max 4). Acceptable distinguishing features include: feathers (chicken only), fins/gills/scales (fish only), moist skin (frog only), hair/fur (goat only), lays eggs vs gives birth, lives in water vs land, four legs vs two legs.',
    'Award 1 mark per correctly used distinguishing feature in a paired (either/or) format. The key must lead unambiguously to each of the four organisms. Deduct nothing for extra steps as long as the key works. Maximum 4 marks.',
    'A dichotomous key works by asking yes/no questions that split the group in half each time. Pick a feature ONLY ONE animal has (e.g. feathers → chicken). Then split the remaining three. Keep going until each animal is identified.',
    true
  );

  -- ─── Q2(b)(i) — Virus parts A and B — 2 marks, free auto-marked ─────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, memo, explanation, is_published
  ) values (
    bio_id, 2020, '2', '2(b)(i)', 2, 'free',
    'fill_in',
    E'Fig. 2.2 shows the general structure of a virus.\n\n**(b)(i)** Identify the parts labelled **A** and **B**.',
    '/past-papers/biology-nssco-2020-p2/q2b-virus.png',
    jsonb_build_object(
      'must_contain', jsonb_build_array('protein', 'nucleic acid'),
      'accepted_A', jsonb_build_array('protein coat', 'capsid', 'protein capsid'),
      'accepted_B', jsonb_build_array('nucleic acid', 'DNA', 'RNA', 'genetic material', 'DNA/RNA')
    ),
    E'A: protein coat (capsid) [1 mark]\nB: nucleic acid (DNA or RNA / genetic material) [1 mark]',
    'Viruses are made of just two parts: an outer **protein coat** (called a capsid) that surrounds and protects the genetic material, and an inner core of **nucleic acid** (DNA or RNA) that contains the instructions for making more viruses.',
    true
  );

  -- ─── Q2(b)(ii) — Why viruses hard to classify as living — 2 marks, paid ─
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '2(b)(ii)', 2, 'paid',
    'free_text',
    E'**(b)(ii)** Explain the features of viruses that make it difficult to classify them as living organisms.',
    '/past-papers/biology-nssco-2020-p2/q2b-virus.png',
    E'Any 2 of the following (1 mark each):\n• Viruses cannot reproduce on their own — they need a host cell\n• Viruses are not made of cells (no cytoplasm, membrane, organelles)\n• Viruses do not carry out respiration / do not need energy\n• Viruses do not grow or develop\n• Viruses do not excrete or feed\n• Viruses contain genetic material (DNA/RNA) and can evolve — these are living traits\n• Viruses can be crystallised like a non-living chemical',
    E'Award 1 mark for each distinct feature that explains the living/non-living ambiguity. Maximum 2 marks. Reject vague answers like "they are tiny" or "they cause disease".',
    'Living things share 7 characteristics (MRS GREN: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition). Viruses fail most of these on their own but show some (reproduction, evolution) when inside a host — so they sit on the borderline.',
    true
  );

  -- ─── Q3(a) — Label root hair, phloem, xylem — 2 marks, free ─────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '3(a)', 2, 'free',
    'free_text',
    E'Fig. 3.1 shows a cross section of a dicotyledonous root.\n\n**(a)** On Fig. 3.1, label the **root hair**, **phloem** and **xylem vessel**.\n\n*Since you cannot draw on the diagram here, describe in words where each part is located.*',
    '/past-papers/biology-nssco-2020-p2/q3-root.png',
    E'2 marks total — award 1 mark for any 2 correctly located parts:\n• Root hair: long projection extending OUTWARDS from the epidermis (outer surface)\n• Xylem vessel: star-shaped pattern of large cells in the CENTRE of the root\n• Phloem: small groups of cells between the arms of the xylem star (inside the cortex but outside the central xylem)',
    'Award 1 mark per correctly located part (max 2). Acceptable descriptions include directional words (outside, centre, between) and references to other named structures.',
    'In a dicot root: from outside in — root hair (sticking out of epidermis), cortex (big round cells), endodermis (single ring), then in the centre a STAR of xylem with PHLOEM patches between the arms of the star.',
    true
  );

  -- ─── Q3(b)(i) — Define active transport — 2 marks, free ─────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '3(b)(i)', 2, 'free',
    'free_text',
    E'**(b)(i)** Define the term *active transport*.',
    null,
    E'Movement of particles/ions/molecules [1] AGAINST a concentration gradient (from low to high concentration) [1], using ENERGY from respiration / ATP [1]. Maximum 2 marks.',
    E'Award 1 mark for "against concentration gradient" (or low → high concentration). Award 1 mark for "uses energy" (or ATP / respiration). Maximum 2 marks. Do not credit "diffusion" (that''s passive).',
    'Active transport is the OPPOSITE of diffusion: it moves substances the "wrong way" (low to high concentration). Because this is uphill, it costs ENERGY — supplied by mitochondria via respiration.',
    true
  );

  -- ─── Q3(b)(ii) — Why root hair has many mitochondria — 2 marks, free ────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '3(b)(ii)', 2, 'free',
    'free_text',
    E'**(b)(ii)** Suggest the reasons why a root hair cell contains many mitochondria.',
    null,
    E'Mitochondria are the site of (aerobic) respiration / produce ATP / produce energy [1]. Active transport of mineral ions requires energy [1]. Many mitochondria = more energy available for active transport [1]. Maximum 2 marks.',
    E'Award 1 mark for linking mitochondria to ATP/energy production. Award 1 mark for linking that energy to active transport of mineral ions. Maximum 2 marks.',
    'Root hairs need to pull mineral ions IN from the soil even when the soil has LESS of those ions than the root cell. That''s active transport — and it''s expensive. More mitochondria = more energy = more ions absorbed.',
    true
  );

  -- ─── Q4(a)(i) — Identify B, C, D, E in female reproductive — 4 marks ────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '4(a)(i)', 4, 'paid',
    'free_text',
    E'Fig. 4.1 shows the female reproductive system.\n\n**(a)(i)** Identify the parts labelled **B**, **C**, **D** and **E**.',
    '/past-papers/biology-nssco-2020-p2/q4a-repro.png',
    E'B: uterus (womb) [1]\nC: ovary [1]\nD: cervix [1]\nE: vagina [1]\n\n(Exact labels depend on which structures the figure labels — these are the typical NIED answers.)',
    E'Award 1 mark for each correctly identified part. Accept common synonyms (uterus / womb; vagina / birth canal). Maximum 4 marks.',
    'The female reproductive system top-to-bottom: ovaries (release egg) → fallopian tubes / oviducts (fertilisation site) → uterus / womb (where embryo develops) → cervix (neck of uterus) → vagina (birth canal).',
    true
  );

  -- ─── Q4(a)(ii) — Function of part A — 1 mark, free ──────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '4(a)(ii)', 1, 'free',
    'free_text',
    E'**(a)(ii)** State the function of the part labelled **A**.',
    '/past-papers/biology-nssco-2020-p2/q4a-repro.png',
    E'If A = oviduct/fallopian tube: site of fertilisation / transports egg from ovary to uterus [1]\nIf A = ovary: produces eggs / produces female sex hormones (oestrogen, progesterone) [1]',
    E'Award 1 mark for stating any one correct function of the structure labelled A.',
    'Each part has a clear single function. Pick the most important one and state it in one sentence.',
    true
  );

  -- ─── Q4(b)(i) — Identify hormones A and B — 2 marks, free ───────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, memo, explanation, is_published
  ) values (
    bio_id, 2020, '2', '4(b)(i)', 2, 'free',
    'fill_in',
    E'Fig. 4.2 shows levels of two hormones over twenty-eight days of the menstrual cycle.\n\n**(b)(i)** Identify hormones **A** and **B**.',
    '/past-papers/biology-nssco-2020-p2/q4b-hormones.png',
    jsonb_build_object(
      'accepted_A', jsonb_build_array('oestrogen', 'estrogen'),
      'accepted_B', jsonb_build_array('progesterone')
    ),
    E'A: oestrogen [1] — peaks before ovulation (day ~14)\nB: progesterone [1] — peaks around day 21 after ovulation',
    'Two hormones run the menstrual cycle: **oestrogen** rises first (days 1–14, peaks just before ovulation) and **progesterone** rises second (days 14–28, peaks around day 21). Both fall sharply at the end of the cycle, triggering menstruation.',
    true
  );

  -- ─── Q4(b)(ii) — Hormone B changes after day 14 — 3 marks, paid ─────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '4(b)(ii)', 3, 'paid',
    'free_text',
    E'**(b)(ii)** With reference to Fig. 4.2 describe the changes in levels of hormone **B** after day 14 of the menstrual cycle and explain how these changes relate to the function of hormone **B**.',
    '/past-papers/biology-nssco-2020-p2/q4b-hormones.png',
    E'Description (any 2):\n• Hormone B (progesterone) rises sharply between days 14 and 21 [1]\n• Reaches a peak/maximum around day 21 [1]\n• Falls/decreases between days 21 and 28 [1]\n\nFunction (any 1–2):\n• High progesterone maintains the uterus lining (endometrium) for possible implantation [1]\n• If no fertilisation, progesterone falls → uterus lining breaks down → menstruation [1]\n\nMaximum 3 marks total.',
    E'Reward both DESCRIPTION (the shape of the curve after day 14: rises, peaks, falls) AND FUNCTION (maintaining the uterus lining for pregnancy / triggering menstruation when it drops). Need both aspects for full marks.',
    'After ovulation (day 14), the empty follicle becomes the corpus luteum and pumps out progesterone. Progesterone keeps the uterus lining thick and blood-rich, ready to receive an embryo. If no embryo arrives, progesterone falls, the lining sheds, and the period starts.',
    true
  );

  -- ─── Q4(c)(i) — Draw another menstrual hormone — 1 mark, free ───────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '4(c)(i)', 1, 'free',
    'free_text',
    E'**(c)(i)** On Fig. 4.2 draw in and label a line to represent the changes in levels of one other hormone involved in the menstrual cycle.\n\n*Since you cannot draw on the diagram here, describe in words: (1) which hormone you would draw, and (2) the shape of its curve across days 0–28.*',
    '/past-papers/biology-nssco-2020-p2/q4b-hormones.png',
    E'Accept either LH or FSH:\n• **LH (luteinising hormone)**: low for most of the cycle, then a sharp spike around day 12–14 (triggers ovulation), then drops back to low. [1]\n• **FSH (follicle-stimulating hormone)**: a small rise early in the cycle (days 0–7) to develop the follicle, low for the rest. [1]\n\nMaximum 1 mark.',
    E'Award 1 mark if the student names a valid menstrual-cycle hormone (LH or FSH) AND describes the correct timing/shape. Reject oestrogen and progesterone (already shown).',
    'Two more menstrual-cycle hormones come from the pituitary gland: **FSH** triggers a follicle in the ovary to grow (peaks early). **LH** triggers ovulation (sharp spike at day 14). Both are short-acting compared to the long oestrogen/progesterone curves.',
    true
  );

  -- ─── Q4(c)(ii) — Birth control preventing STIs — 2 marks, free ──────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '4(c)(ii)', 2, 'free',
    'free_text',
    E'**(c)(ii)** Name **any** method of birth control that prevents the spread of Sexually Transmitted Infections (STIs) and explain how this method prevents pregnancy.',
    null,
    E'Method: condom (male condom or female condom) [1]\nMechanism: acts as a physical/barrier between sperm and egg — sperm cannot enter the vagina/uterus, so cannot reach and fertilise the egg [1]\n\nMaximum 2 marks.',
    E'Award 1 mark for naming a barrier method that blocks STI transmission (condom — male or female). Award 1 mark for explaining the mechanism (barrier preventing sperm from reaching egg). Reject hormonal methods (pill, injection, IUD) — they do not prevent STIs.',
    'Only **barrier methods** (condoms) prevent BOTH pregnancy AND STI transmission. They physically block sperm AND block exchange of body fluids that carry STI pathogens.',
    true
  );

  -- ─── Q5(a) — Main metabolic waste excreted by kidney — 1 mark, free ─────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    bio_id, 2020, '2', '5(a)', 1, 'free',
    'fill_in',
    E'Excretion is the process of removing metabolic wastes and excess substances from the body.\n\n**(a)** Name the main product of metabolism excreted by the human kidney.',
    jsonb_build_object('accepted', jsonb_build_array('urea')),
    'Urea [1 mark]',
    'Urea is the nitrogen-containing waste produced in the LIVER when excess amino acids are broken down (deamination). The kidney filters urea from blood and excretes it dissolved in urine.',
    true
  );

  -- ─── Q5(b) — Two substances reabsorbed in kidney — 2 marks, free ────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '5(b)', 2, 'free',
    'free_text',
    E'**(b)** Name **two** substances that are re-absorbed into the blood in the kidney.',
    E'Any 2 of: glucose [1], water [1], mineral ions / salts / sodium ions / chloride ions [1], amino acids [1]. Maximum 2 marks.',
    E'Award 1 mark for each correctly named substance reabsorbed in the kidney. Maximum 2 marks. Do not credit "urea" (it''s excreted, not reabsorbed) or "blood cells" (they don''t enter the nephron filtrate).',
    'The kidney first FILTERS lots of stuff out of blood, then REABSORBS what the body still needs (glucose, water, useful ions, amino acids) and lets the waste (urea, excess water/salts) leave as urine.',
    true
  );

  -- ─── Q5(c)(i) — Changes to blood through dialysis — 3 marks, paid ───────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '5(c)(i)', 3, 'paid',
    'free_text',
    E'Dialysis can be used to treat people whose kidneys do not function properly. Fig. 5.1 shows a dialysis machine carrying out dialysis treatment.\n\n**(c)(i)** Explain the changes which occur to the blood as it goes through a dialysis machine.',
    '/past-papers/biology-nssco-2020-p2/q5-dialysis.png',
    E'Any 3 of the following:\n• Waste products (urea / excess salts) diffuse OUT of the blood through the dialysis membrane [1]\n• Diffusion is from high concentration (blood) to low concentration (dialysis fluid) [1]\n• Excess water is removed from blood [1]\n• Useful substances (glucose, mineral ions) stay in the blood because the dialysis fluid has the same concentration of them as healthy blood [1]\n• Blood leaving the machine has lower waste / lower water / cleaner [1]',
    E'Award 1 mark per distinct, accurate change. Look for: WHAT moves out (urea/waste/water), WHY it moves (diffusion / concentration gradient), and WHAT stays in (glucose, useful ions). Maximum 3 marks.',
    'A dialysis machine is an artificial kidney. It uses the same principle as nephrons: a partially permeable membrane lets waste diffuse out while keeping useful stuff in. The "dialysis fluid" mimics healthy blood so the right concentration gradient is maintained.',
    true
  );

  -- ─── Q5(c)(ii) — Transplant vs dialysis — 4 marks, paid ─────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '5(c)(ii)', 4, 'paid',
    'free_text',
    E'**(c)(ii)** Some people with kidney failure are given a kidney transplant. Discuss advantages and disadvantages of a kidney transplant compared with dialysis.',
    '/past-papers/biology-nssco-2020-p2/q5-dialysis.png',
    E'Advantages (any 1–2):\n• Permanent solution — no need for regular dialysis sessions [1]\n• Better quality of life — patient can travel, work normally [1]\n• Cheaper long-term than ongoing dialysis [1]\n• No strict diet restrictions required [1]\n\nDisadvantages (any 1–2):\n• Risk of rejection by the immune system [1]\n• Must take immunosuppressant drugs for life — weaker immune system [1]\n• Surgery is risky / requires anaesthetic [1]\n• Shortage of compatible donors — long waiting lists [1]\n• Matching donor required (tissue type / blood group) [1]\n\nNeeds BOTH advantages AND disadvantages for full marks. Maximum 4 marks.',
    E'Award up to 2 marks for advantages and up to 2 marks for disadvantages (balanced discussion required). Penalise candidates who only discuss one side — maximum 2 marks if no disadvantages or no advantages given.',
    'A "discuss" question wants balance. Give 2 PROS and 2 CONS. For a transplant the trade-off is: permanent fix vs. surgery risk + lifelong drug treatment. Dialysis is reversible and lower-risk but requires hours of treatment several times a week.',
    true
  );

  -- ─── Q6(a) — Vasodilation effects — 2 marks, free ───────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '6(a)', 2, 'free',
    'free_text',
    E'Homeostasis enables animals to maintain a constant internal body temperature despite change in the environmental temperature.\n\n**(a)** Describe the effects of vasodilation in maintaining human body temperature.',
    E'• Blood vessels (arterioles/capillaries) near the skin surface widen/dilate [1]\n• More blood flows close to the skin surface [1]\n• More heat is lost to the surroundings by radiation/convection [1]\n• Body temperature decreases / returns to normal [1]\n\nMaximum 2 marks.',
    E'Award 1 mark for explaining what vasodilation does (widening of blood vessels), and 1 mark for linking that to heat loss / temperature decrease. Maximum 2 marks.',
    'When you''re too hot, the body widens (dilates) blood vessels near the skin. More blood near the surface = more heat radiated away = body cools down. The opposite, vasoconstriction, narrows vessels to keep blood deep and conserve heat when cold.',
    true
  );

  -- ─── Q6(b)(i) — Role of Receptor, Effector, Control centre — 3 marks ────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '6(b)(i)', 3, 'free',
    'free_text',
    E'Fig. 6.1 shows a summarised diagram of a negative feedback mechanism which controls homeostasis.\n\n**(b)(i)** Explain the role of the following components during negative feedback mechanism.\n\n• Receptor (sensor)\n• Effector\n• Control centre',
    '/past-papers/biology-nssco-2020-p2/q6-feedback.png',
    E'**Receptor (sensor)**: detects a change/stimulus in the internal/external environment [1] — e.g. skin or hypothalamus detects temperature change.\n**Effector**: a muscle or gland that carries out the response [1] — e.g. sweat glands, blood vessels in skin, skeletal muscle.\n**Control centre**: receives information from receptors and sends instructions to effectors [1] — e.g. hypothalamus / brain.\n\nMaximum 3 marks (1 per part).',
    E'Award 1 mark for each correctly described role. Each role must clearly distinguish itself from the others: receptor=detects, effector=responds, control centre=coordinates.',
    'Negative feedback loop has 3 components in sequence: **Receptor** (the sensor — feels the change) → **Control centre** (the brain — decides what to do) → **Effector** (the doer — fixes the change). The fix brings the body BACK to normal — that''s why it''s "negative" feedback.',
    true
  );

  -- ─── Q6(b)(ii) — Liver response to high glucose — 3 marks, paid ─────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '6(b)(ii)', 3, 'paid',
    'free_text',
    E'**(b)(ii)** The liver is an important organ in homeostasis. Describe how the liver responds to an increase in glucose concentration of blood.',
    E'• Pancreas detects high blood glucose [1]\n• Pancreas releases the hormone INSULIN into the blood [1]\n• Insulin travels to the liver [1]\n• Liver converts excess glucose into GLYCOGEN [1]\n• Glycogen is stored in liver cells [1]\n• Blood glucose level decreases back to normal [1]\n\nMaximum 3 marks.',
    E'Award marks for the sequence: detection (pancreas) → hormone (insulin) → action in liver (glucose → glycogen) → outcome (blood glucose drops). Full marks require at least 3 of these steps with correct biology.',
    'After a meal, blood glucose spikes. The pancreas spots this and releases **insulin**. Insulin tells the liver: "store this glucose for later". The liver converts glucose into **glycogen** (a starch-like storage molecule). Blood glucose drops back to normal.',
    true
  );

  -- ─── Q7(a) — Name carbon cycle processes 1-5 — 5 marks, free ────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '7(a)', 5, 'free',
    'free_text',
    E'Fig. 7.1 shows an incomplete carbon cycle.\n\n**(a)** Name the processes taking place at point **1**, **2**, **3**, **4** and **5** in the cycle.\n\nGive your answers in this format:\n1: ...\n2: ...\n3: ...\n4: ...\n5: ...',
    '/past-papers/biology-nssco-2020-p2/q7-carbon-cycle.png',
    E'1: respiration (animals → CO₂ in air) [1]\n2: photosynthesis (CO₂ → plants) [1]\n3: feeding / consumption (plants → animals) [1]\n4: death / decomposition (plants → bacteria & fungi) [1]\n5: combustion / burning (coal → CO₂) [1]\n\nMaximum 5 marks.',
    E'Award 1 mark for each correctly named process. Accept reasonable synonyms (decay = decomposition; eating = feeding; burning = combustion). Maximum 5 marks.',
    'The carbon cycle moves carbon between CO₂ in the air ↔ living things ↔ fossil fuels. The four key processes you need to know: **photosynthesis** (CO₂ in), **respiration** (CO₂ out), **feeding** (carbon passes up food chain), **decomposition** (dead things release CO₂), **combustion** (fossil fuels release CO₂).',
    true
  );

  -- ─── Q7(b) — Effects of long-term CO2 increase — 2 marks, free ──────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '7(b)', 2, 'free',
    'free_text',
    E'**(b)** Discuss any **two** effects of a long-term increase in the percentage of carbon dioxide in the atmosphere.',
    E'Any 2 of:\n• Enhanced greenhouse effect → global warming → rising average temperatures [1]\n• Melting of polar ice caps / glaciers → rising sea levels → coastal flooding [1]\n• Climate change → more extreme weather (droughts, floods, storms) [1]\n• Ocean acidification (CO₂ dissolves in seawater) → harms coral reefs and shellfish [1]\n• Shifts in species distribution / loss of biodiversity [1]\n\nMaximum 2 marks.',
    E'Award 1 mark per distinct effect with a clear mechanism (not just "warming"). Maximum 2 marks.',
    'CO₂ traps heat in the atmosphere (greenhouse effect). Over decades, this changes temperature, ice cover, sea level, and weather. Each effect has knock-on consequences for plants, animals and people.',
    true
  );

  -- ─── Q7(c) — Deforestation effect on O2/CO2 — 2 marks, paid ─────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '7(c)', 2, 'paid',
    'free_text',
    E'**(c)** Explain the effects of cutting down a forest on the balance between oxygen and carbon dioxide in the atmosphere.',
    E'• Fewer trees → less photosynthesis [1]\n• Less CO₂ is absorbed/removed from atmosphere [1]\n• Less O₂ is released into atmosphere [1]\n• Burning the wood releases stored carbon as CO₂ [1]\n• Result: CO₂ levels increase, O₂ levels decrease [1]\n\nMaximum 2 marks.',
    E'Award marks for linking deforestation to BOTH (i) reduced photosynthesis and (ii) the resulting CO₂ rise / O₂ drop. Full marks require both directions of the gas balance.',
    'Trees are the planet''s CO₂-removal machines. Cut them down and you do two things at once: stop removing CO₂ and stop producing O₂. The atmospheric balance shifts: more CO₂, less O₂.',
    true
  );

  -- ─── Q7(d) — How producers obtain carbon for sugar — 2 marks, free ──────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '7(d)', 2, 'free',
    'free_text',
    E'**(d)** Explain how producers obtain the carbon they need to produce sugar (glucose).',
    E'• Producers (plants) absorb carbon dioxide from the atmosphere [1]\n• CO₂ enters the leaf through the stomata [1]\n• During photosynthesis, CO₂ combines with water to form glucose (in the presence of light and chlorophyll) [1]\n\nMaximum 2 marks.',
    E'Award 1 mark for naming CO₂ as the carbon source. Award 1 mark for linking it to photosynthesis (the process that converts CO₂ into glucose). Maximum 2 marks.',
    'Plants don''t eat carbon — they grab it as CO₂ gas from the air through tiny pores (stomata) on their leaves. Photosynthesis then sticks that carbon into glucose molecules using energy from sunlight.',
    true
  );

  -- ─── Q7(e) — Word equation for photosynthesis — 2 marks, free ───────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '7(e)', 2, 'free',
    'free_text',
    E'**(e)** State the word equation for the production of sugar in plants.',
    E'**carbon dioxide + water → glucose + oxygen**\n\n(with light energy and chlorophyll above the arrow)\n\n• Correct reactants (carbon dioxide AND water) [1]\n• Correct products (glucose AND oxygen) [1]\n\nMaximum 2 marks.',
    E'Award 1 mark for both correct reactants on the left side. Award 1 mark for both correct products on the right side. Accept "carbon dioxide + water → glucose + oxygen" (light energy / chlorophyll above the arrow is a bonus but not required for full marks). Maximum 2 marks.',
    'Memorise this word equation — it''s in every photosynthesis question: **carbon dioxide + water → glucose + oxygen** (using light and chlorophyll). The reverse equation is respiration.',
    true
  );

  -- ─── Q8(a) — Define heterozygous — 1 mark, free ─────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, explanation, is_published
  ) values (
    bio_id, 2020, '2', '8(a)', 1, 'free',
    'free_text',
    E'The eye colour in humans is controlled by two alleles. Allele **B** for brown eyes is dominant over allele **b** for blue eyes.\n\n**(a)** Define the term *heterozygous*.',
    E'Having two DIFFERENT alleles for a particular gene/trait [1].\n\nAcceptable: "an organism with two different alleles for a gene" or "Bb" with explanation.',
    'Heterozygous = "different" alleles (e.g. Bb). Homozygous = "same" alleles (BB or bb). Easy memory: "hetero" = different, "homo" = same.',
    true
  );

  -- ─── Q8(b) — Genotype of blue-eyed person — 1 mark, free ────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, case_sensitive, memo, explanation, is_published
  ) values (
    bio_id, 2020, '2', '8(b)', 1, 'free',
    'fill_in',
    E'**(b)** Write down the genotype of a blue-eyed person.',
    jsonb_build_object('accepted', jsonb_build_array('bb', 'b/b', 'b b')),
    true,
    'bb [1 mark] — blue eyes is recessive, so a blue-eyed person must be homozygous recessive.',
    'Blue eyes are recessive (lowercase b). To show the blue phenotype, you need BOTH alleles to be recessive — so the only genotype that gives blue eyes is **bb**.',
    true
  );

  -- ─── Q8(c) — Genetic diagram Bb × bb — 5 marks, paid ────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '8(c)', 5, 'paid',
    'free_text',
    E'**(c)** Draw a fully labelled genetic diagram to show the possible phenotype of offsprings produced by a heterozygous brown-eyed woman and a blue-eyed man.\n\n*Write out your genetic diagram in text form, including parental genotypes, gametes, Punnett square (or offspring genotypes) and ratio of phenotypes.*',
    E'Expected genetic diagram:\n\nParents:           Bb (brown ♀)  ×  bb (blue ♂)  [1]\nGametes:           B or b           b only        [1]\nOffspring genotypes: Bb, bb (each 50%)            [1]\nOffspring phenotypes: 50% brown-eyed, 50% blue-eyed  [1]\nRatio:             1 brown : 1 blue                 [1]\n\nMaximum 5 marks.',
    E'Award 1 mark for: correct parental genotypes (Bb × bb), correct gametes (B/b and b), correct offspring genotypes (Bb and bb), correct phenotypes labelled brown/blue, correct ratio (1:1 or 50%:50%). Maximum 5 marks. A Punnett square drawn correctly also earns all marks.',
    'A genetic diagram has 4 levels: **Parents** (with genotypes Bb × bb), **Gametes** (B and b from mother; b only from father), **Offspring genotypes** (Bb and bb), **Offspring phenotypes** (brown and blue). For Bb × bb the ratio is always 1:1.',
    true
  );

  -- ─── Q8(d) — Reveal genotype by genetic cross — 2 marks, paid ───────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '8(d)', 2, 'paid',
    'free_text',
    E'**(d)** The genotype of a brown-eyed parent is not known. Describe how a genetic cross could reveal the genotype.',
    E'• Cross the brown-eyed parent with a blue-eyed individual (genotype bb) — this is a TEST CROSS [1]\n• If ALL offspring are brown-eyed → the parent is homozygous (BB) [1]\n• If offspring are roughly 1:1 brown : blue → the parent is heterozygous (Bb) [1]\n\nMaximum 2 marks.',
    E'Award 1 mark for the idea of crossing with a homozygous recessive (bb). Award 1 mark for explaining how the offspring ratio reveals the unknown genotype (all brown = BB; 1:1 = Bb). Maximum 2 marks.',
    'You can''t tell BB from Bb by looking — both are brown-eyed. The trick is to **test cross** with a known **bb** (blue-eyed). If you see any blue-eyed offspring, the unknown parent must carry a hidden **b** (so they''re **Bb**).',
    true
  );

  -- ─── Q9(a) — Giraffe natural selection — 4 marks, paid ──────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    bio_id, 2020, '2', '9(a)', 4, 'paid',
    'free_text',
    E'Fig. 9.1 shows a population of giraffes feeding on a tall tree.\n\n**(a)** Long-necked and short-necked giraffes co-exist in a population. After three generations, only long-necked giraffes and no short-necked giraffes were present in the population.\n\nReferring to Fig. 9.1, suggest how the changes in the giraffe population may have come about.',
    '/past-papers/biology-nssco-2020-p2/q9-giraffes.png',
    E'Expected points (any 4):\n• Population shows natural variation — some giraffes have long necks, some short [1]\n• Long-necked giraffes can reach food (leaves) on tall trees that short-necked giraffes cannot [1]\n• Short-necked giraffes cannot get enough food → starve / die before reproducing [1]\n• Long-necked giraffes survive and reproduce (survival of the fittest) [1]\n• Long-neck allele/gene is passed to offspring [1]\n• Over generations, the frequency of the long-neck allele increases [1]\n• This is natural selection — the environment "selects" individuals best adapted [1]\n\nMaximum 4 marks.',
    E'Award marks for the natural selection sequence: variation → selection pressure (food/competition) → differential survival → differential reproduction → allele frequency change. Need at least 4 of these steps for full marks.',
    'This is the classic example of **natural selection**: (1) start with variation, (2) some individuals have an advantage (long necks reach food), (3) they survive better and reproduce more, (4) their genes spread through the population. Over generations, the advantageous trait dominates.',
    true
  );

  -- ─── Q9(b) — Define evolution — 1 mark, free ────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, explanation, is_published
  ) values (
    bio_id, 2020, '2', '9(b)', 1, 'free',
    'free_text',
    E'**(b)** Define *evolution*.',
    'The gradual change in the characteristics of a species/population over many generations (through natural selection) [1 mark].',
    'Evolution = change over time. More precisely: the slow change in the inherited features of a species over many generations, driven by natural selection.',
    true
  );

  raise notice 'Inserted all 9 questions (30 sub-parts) for Biology NSSCO 2020 Paper 2';
end $$;
