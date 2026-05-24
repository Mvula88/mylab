-- ===========================================================================
-- NSSCO Chemistry 2024 Paper 1 (6117/1) — 40 MCQ questions, 40 marks
-- Verbatim NIED wording. Answer key + commentary from
-- DNEA Examiners Report 2024 (Chemistry section, pages 105-106).
-- ===========================================================================

do $$
declare
  chem_id uuid;
begin
  select id into chem_id from public.subjects where slug = 'chemistry' limit 1;
  if chem_id is null then raise notice 'Chemistry subject not found'; return; end if;

  -- ─── Q1 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '1', 1, 'free',
    'mcq',
    E'Which piece of apparatus is used to measure **exactly 15.00 cm³** of a liquid?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','15 cm³ beaker'),
      jsonb_build_object('id','b','text','20 cm³ measuring cylinder'),
      jsonb_build_object('id','c','text','50 cm³ conical flask'),
      jsonb_build_object('id','d','text','50 cm³ burette')
    ),
    to_jsonb('d'::text),
    null,
    E'D — 50 cm³ burette [1 mark]. Poorly answered (20.8%). Option B was the most common wrong answer.',
    E'**Precision of apparatus** — match accuracy to use:\n• **Burette** — measures to **±0.05 cm³** (most precise; reads to 2 decimal places). Used for titrations ✓\n• Pipette — fixed volume (e.g. 25.00 cm³) — also precise but you can''t choose 15.00\n• Measuring cylinder — only ±0.5 cm³\n• Beakers and conical flasks — VERY rough (just markings, not for measuring)\n\nA burette can deliver exactly 15.00 cm³ by stopping at the right reading. The others can''t reach 2 decimal places.',
    true
  );

  -- ─── Q2 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '2', 1, 'free',
    'mcq',
    E'Some salt is contaminated with sand. How is a sample of solid salt obtained from the mixture?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','dissolve in water and then evaporate'),
      jsonb_build_object('id','b','text','dissolve in water, then filter and then dry the solid residue'),
      jsonb_build_object('id','c','text','dissolve in water, then filter and evaporate the filtrate'),
      jsonb_build_object('id','d','text','dissolve in water and then distil')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. Fairly well answered (51%). Many failed to recognise that the solid residue is SAND, and that the filtrate is the salt solution.',
    E'**Separating a soluble solid (salt) from an insoluble one (sand):**\n\n1. **Dissolve** in water — salt dissolves, sand doesn''t\n2. **Filter** — sand stays as RESIDUE on filter paper; salt solution passes through as FILTRATE\n3. **Evaporate** the FILTRATE — water leaves, salt crystals form\n\nKey vocabulary: residue = what''s caught on the filter (sand); filtrate = liquid that passed through (salt solution). You want the SALT, so you keep and evaporate the FILTRATE — not dry the residue (that''s the sand).',
    true
  );

  -- ─── Q3 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '3', 1, 'free',
    'mcq',
    E'The outline diagrams show three methods of purification:\n• **P** — a round-bottom flask connected to a condenser angled downward\n• **Q** — a beaker with a strip of paper dipped into a solvent\n• **S** — a shallow dish with vapour rising off liquid\n\nWhat are the three methods?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','P = chromatography, Q = distillation, S = evaporation'),
      jsonb_build_object('id','b','text','P = distillation, Q = chromatography, S = evaporation'),
      jsonb_build_object('id','c','text','P = distillation, Q = evaporation, S = chromatography'),
      jsonb_build_object('id','d','text','P = evaporation, Q = chromatography, S = distillation')
    ),
    to_jsonb('b'::text),
    '/past-papers/chemistry-nssco-2024-p1/q3-purification-methods-PQS.png',
    E'B [1 mark]. The most well-answered question in the paper (93.7%).',
    E'**Identify each apparatus:**\n\n• **P — Distillation** — flask + condenser (vapour cools and drips back as pure liquid). Used to separate a liquid from dissolved solids, or two liquids by boiling point.\n• **Q — Chromatography** — paper strip dipped in solvent. Separates a mixture of dyes/solutes by how far they travel up the paper.\n• **S — Evaporation** — open dish, liquid evaporating off. Used to get a solid from a solution (e.g. salt from saltwater).\n\nThe condenser is the giveaway for distillation.',
    true
  );

  -- ─── Q4 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '4', 1, 'free',
    'mcq',
    E'Which substance would diffuse **most quickly**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','ammonia at 0 °C'),
      jsonb_build_object('id','b','text','ammonia at 25 °C'),
      jsonb_build_object('id','c','text','carbon dioxide at 0 °C'),
      jsonb_build_object('id','d','text','carbon dioxide at 25 °C')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Poorly answered (36.6%). Candidates failed to interpret the factors affecting diffusion.',
    E'**Two factors that speed up diffusion:**\n\n1. **Higher temperature** → particles have more kinetic energy → move faster (25 °C > 0 °C)\n2. **Lower molecular mass** → lighter particles move faster (Graham''s law)\n   • Ammonia NH₃: Mr = 17\n   • Carbon dioxide CO₂: Mr = 44\n   → NH₃ is much lighter → diffuses faster\n\n**Best of both worlds: ammonia at 25 °C** (lighter AND warmer) → **B** ✓',
    true
  );

  -- ─── Q5 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '5', 1, 'free',
    'mcq',
    E'In which **species** are the numbers of **electrons and neutrons equal**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','⁹₄Be (9 nucleons, 4 protons)'),
      jsonb_build_object('id','b','text','¹⁹₉F⁻ (19 nucleons, 9 protons, negative ion)'),
      jsonb_build_object('id','c','text','²³₁₁Na⁺ (23 nucleons, 11 protons, positive ion)'),
      jsonb_build_object('id','d','text','¹⁶₈O²⁻ (16 nucleons, 8 protons, 2− ion)')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. The **most poorly answered** question in the paper (14.8%). Option D was a common wrong choice — candidates didn''t notice these are IONS (not neutral atoms).',
    E'**For each species, count electrons and neutrons:**\n\n| Species | Protons | Neutrons (A−Z) | Electrons |\n|---|---|---|---|\n| Be (neutral) | 4 | 5 | 4 |\n| **F⁻** | 9 | **10** | **10** ✓ |\n| Na⁺ | 11 | 12 | 10 |\n| O²⁻ | 8 | 8 | 10 |\n\n• Neutrons = A − Z\n• Electrons (ion) = protons ± charge (F⁻ gained 1 electron → 9+1 = 10)\n\nOnly **F⁻** has matching neutron and electron counts (both 10). Read carefully — these are IONS.',
    true
  );

  -- ─── Q6 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '6', 1, 'free',
    'mcq',
    E'Which row about **isotopes of atoms of the same element** is true?\n\n| | same number of protons | same number of neutrons |\n|---|---|---|\n| A | ✓ | ✓ |\n| B | ✗ | ✗ |\n| C | ✓ | ✗ |\n| D | ✗ | ✓ |',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. Well answered (83.5%).',
    E'**Isotopes = same element, different mass.**\n\n• Same element → SAME number of **PROTONS** ✓ (atomic number defines the element)\n• Different mass → DIFFERENT number of **NEUTRONS** ✗\n• Same charge in neutral atoms → same electrons (not asked here)\n\nSo: protons same ✓, neutrons different ✗ → row **C**.\n\nExample: ⁷⁹Br and ⁸¹Br both have 35 protons (same element, bromine) but 44 vs 46 neutrons.',
    true
  );

  -- ─── Q7 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '7', 1, 'free',
    'mcq',
    E'Which property shows a **decreasing trend** in the elements of **Group I**, going down the group?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','density'),
      jsonb_build_object('id','b','text','metallic character'),
      jsonb_build_object('id','c','text','melting point'),
      jsonb_build_object('id','d','text','reactivity with water')
    ),
    to_jsonb('c'::text),
    null,
    E'C — melting point [1 mark]. Poorly answered (40%). Many candidates guessed.',
    E'**Group I trends going DOWN the group:**\n\n• **Atomic radius INCREASES** (more shells)\n• **Density INCREASES** (heavier atoms — though jumpy)\n• **Metallic character INCREASES** (more reactive, more metallic behaviour)\n• **Reactivity with water INCREASES** (Li < Na < K < Rb — Cs explodes!)\n• **Melting point DECREASES** ✓ — Li melts at 181 °C, Cs at only 28 °C\n\nMelting point drops because the metallic bonding gets weaker as atoms get bigger (outer electron is further from nucleus).',
    true
  );

  -- ─── Q8 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '8', 1, 'free',
    'mcq',
    E'Which molecule contains **one pair of shared electrons** (a single covalent bond)?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','ammonia'),
      jsonb_build_object('id','b','text','chlorine'),
      jsonb_build_object('id','c','text','nitrogen'),
      jsonb_build_object('id','d','text','oxygen')
    ),
    to_jsonb('b'::text),
    null,
    E'B — chlorine [1 mark]. Poorly answered (47%). Option A was chosen by candidates who misread the question as ''unshared electrons''.',
    E'**Count the bonds in each molecule:**\n\n• **Cl₂ (chlorine)** — Cl–Cl, ONE single bond = **1 shared pair** ✓\n• O₂ (oxygen) — O=O, double bond = 2 shared pairs\n• N₂ (nitrogen) — N≡N, triple bond = 3 shared pairs\n• NH₃ (ammonia) — N has 3 single bonds with H = 3 shared pairs (plus 1 lone pair on N)\n\nOnly Cl₂ has just ONE shared pair of electrons.',
    true
  );

  -- ─── Q9 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '9', 1, 'free',
    'mcq',
    E'Which statement is true for **buckminsterfullerene**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','It is a nanomaterial.'),
      jsonb_build_object('id','b','text','It is an isotope of carbon.'),
      jsonb_build_object('id','c','text','It is heteronuclear.'),
      jsonb_build_object('id','d','text','It consists of carbon and hydrogen.')
    ),
    to_jsonb('a'::text),
    null,
    E'A — nanomaterial [1 mark]. Poorly answered (31%). Option B was popular — candidates confused ''isotope'' with ''allotrope''.',
    E'**Buckminsterfullerene (C₆₀)** is a football-shaped molecule of 60 carbon atoms only.\n\n• **NANOMATERIAL** ✓ — about 1 nm across (10⁻⁹ m), a key example of nanotechnology\n• An **ALLOTROPE** of carbon (different physical form, like diamond and graphite) — NOT an ''isotope''\n• **HOMONUCLEAR** (all atoms are the same — carbon only) — NOT heteronuclear\n• Pure carbon — NO hydrogen\n\nKey vocab distinction: **isotope** = same element, different mass (e.g. ¹²C vs ¹⁴C). **Allotrope** = same element, different STRUCTURE (e.g. diamond, graphite, C₆₀).',
    true
  );

  -- ─── Q10 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '10', 1, 'free',
    'mcq',
    E'How many **different elements** are present in ammonium hydroxide?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','2'),
      jsonb_build_object('id','b','text','3'),
      jsonb_build_object('id','c','text','4'),
      jsonb_build_object('id','d','text','5')
    ),
    to_jsonb('b'::text),
    null,
    E'B — 3 [1 mark]. Fairly well answered (60%). Some chose 4 (counting OH as a separate element).',
    E'**Ammonium hydroxide: NH₄OH** — let''s break it apart:\n\n• N — Nitrogen\n• H — Hydrogen (appears in both NH₄ and OH, but it''s still just ONE element)\n• O — Oxygen\n\n→ **3 different elements**: N, H, O ✓\n\nDon''t double-count an element just because it appears twice in the formula. NH₄OH has 1 N, 5 H total (4+1), 1 O — but only **3 distinct elements**.',
    true
  );

  -- ─── Q11 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '11', 1, 'free',
    'mcq',
    E'The diagrams show the arrangement of particles in three solids X, Y and Z.\n• **X** — alternating + and − ions in a regular lattice\n• **Y** — positive ions surrounded by free electrons (e⁻)\n• **Z** — close-packed circles with some atoms in a different colour\n\nThe three solids are brass, potassium and sodium chloride. Which row correctly identifies X, Y and Z?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','X=brass, Y=potassium, Z=sodium chloride'),
      jsonb_build_object('id','b','text','X=sodium chloride, Y=brass, Z=potassium'),
      jsonb_build_object('id','c','text','X=potassium, Y=sodium chloride, Z=brass'),
      jsonb_build_object('id','d','text','X=sodium chloride, Y=potassium, Z=brass')
    ),
    to_jsonb('d'::text),
    '/past-papers/chemistry-nssco-2024-p1/q11-solids-XYZ.png',
    E'D [1 mark]. Fairly well answered (51.9%).',
    E'**Match each structure to its bonding type:**\n\n• **X — Sodium chloride (NaCl)**: shows + and − **IONS** alternating in a 3D lattice = **IONIC bonding** ✓\n• **Y — Potassium (K)**: shows + ions surrounded by **delocalised electrons (e⁻)** = **METALLIC bonding** in a pure metal ✓\n• **Z — Brass (Cu+Zn ALLOY)**: shows close-packed atoms of TWO different sizes/types (the different colours) = **METAL ATOMS** of two elements packed together ✓\n\nSo row **D**: X=NaCl, Y=K, Z=brass.',
    true
  );

  -- ─── Q12 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '12', 1, 'free',
    'mcq',
    E'Which substance is used to **hydrolyse fat** during the preparation of soap?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','alkali'),
      jsonb_build_object('id','b','text','oil'),
      jsonb_build_object('id','c','text','dilute acid'),
      jsonb_build_object('id','d','text','salt')
    ),
    to_jsonb('a'::text),
    null,
    E'A — alkali [1 mark]. Poorly answered (44%). Options B and C were common wrong answers.',
    E'**Soap-making (saponification)** = fats/oils + **strong ALKALI** (like NaOH) → soap + glycerol.\n\n• Fat has ester linkages (–CO–O–)\n• Alkali (hot NaOH solution) breaks the ester linkages → ''hydrolysis''\n• Products: glycerol (released alcohol) + soap molecules (the sodium salts of the fatty acid parts)\n\nDilute acid CAN also hydrolyse esters, but soap manufacture specifically needs an alkali — you need the SODIUM SALT of the fatty acid, not the acid itself.',
    true
  );

  -- ─── Q13 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '13', 1, 'free',
    'mcq',
    E'Which term refers to an amount of substance containing approximately **6.022 × 10²³ particles**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','Avogadro''s constant'),
      jsonb_build_object('id','b','text','a mole'),
      jsonb_build_object('id','c','text','relative atomic mass'),
      jsonb_build_object('id','d','text','relative formula mass')
    ),
    to_jsonb('b'::text),
    null,
    E'B — a mole [1 mark]. Fairly well answered (52.7%). Option A common wrong answer.',
    E'**Subtle distinction:**\n\n• **A MOLE** = the **AMOUNT** of substance containing 6.022 × 10²³ particles ✓\n• **Avogadro''s constant** = the **NUMBER** 6.022 × 10²³ per mol (it''s a number, not an amount)\n• Relative atomic mass (Ar) = mass of an atom relative to ¹/₁₂ of ¹²C\n• Relative formula mass (Mr) = sum of Ar values in a compound\n\nThink: ''a dozen'' is 12 things. The number 12 is just the count. **A MOLE = a number-name for 6.022 × 10²³ things.**',
    true
  );

  -- ─── Q14 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '14', 1, 'free',
    'mcq',
    E'In a titration, 25.0 cm³ of 0.100 mol/dm³ NaOH reacts with exactly **20.0 cm³** of sulfuric acid according to:\n\n**2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O**\n\nWhat is the concentration of the sulfuric acid?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','0.0625 mol/dm³'),
      jsonb_build_object('id','b','text','0.0800 mol/dm³'),
      jsonb_build_object('id','c','text','0.125 mol/dm³'),
      jsonb_build_object('id','d','text','0.250 mol/dm³')
    ),
    to_jsonb('a'::text),
    null,
    E'A [1 mark]. Poorly answered (25.9%). Candidates appeared to be guessing.',
    E'**Three-step titration calculation:**\n\n1. **Moles of NaOH** = c × V = 0.100 × (25.0/1000) = 0.00250 mol\n\n2. **Mole ratio**: 2NaOH : 1H₂SO₄ → moles H₂SO₄ = 0.00250 ÷ 2 = **0.00125 mol**\n\n3. **Concentration H₂SO₄** = n ÷ V = 0.00125 ÷ (20.0/1000) = 0.00125 ÷ 0.020 = **0.0625 mol/dm³** ✓\n\nKey trap: don''t forget to HALVE the moles because H₂SO₄ reacts with **TWO** NaOH (the ''2'' in front of NaOH in the equation).',
    true
  );

  -- ─── Q15 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '15', 1, 'free',
    'mcq',
    E'A compound contains **1.12 g of iron and 0.16 g of oxygen**.\n\nWhat is its empirical formula? [Ar: O = 16, Fe = 56]',
    jsonb_build_array(
      jsonb_build_object('id','a','text','FeO'),
      jsonb_build_object('id','b','text','Fe₂O'),
      jsonb_build_object('id','c','text','FeO₂'),
      jsonb_build_object('id','d','text','Fe₂O₂')
    ),
    to_jsonb('b'::text),
    null,
    E'B — Fe₂O [1 mark]. Fairly well answered (64%).',
    E'**Three-step empirical formula:**\n\n1. **Divide mass by Ar**:\n   • Fe: 1.12 ÷ 56 = **0.02 mol**\n   • O: 0.16 ÷ 16 = **0.01 mol**\n\n2. **Divide by smallest (0.01)**:\n   • Fe: 0.02 ÷ 0.01 = **2**\n   • O: 0.01 ÷ 0.01 = **1**\n\n3. **Whole-number ratio**: Fe:O = **2:1** → **Fe₂O** ✓\n\nNote D (Fe₂O₂) is the same ratio (1:1) but NOT empirical — empirical formulas use the SIMPLEST whole-number ratio.',
    true
  );

  -- ─── Q16 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '16', 1, 'free',
    'mcq',
    E'Copper(II) sulfate solution can be electrolysed using carbon electrodes.\n\nWhat forms at the **cathode**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','copper'),
      jsonb_build_object('id','b','text','hydrogen'),
      jsonb_build_object('id','c','text','oxygen'),
      jsonb_build_object('id','d','text','sulfur')
    ),
    to_jsonb('a'::text),
    null,
    E'A — copper [1 mark]. Fairly well answered (58%).',
    E'**Electrolysis of aqueous CuSO₄ with carbon electrodes:**\n\nAt the **cathode (−ve)**: positive ions get reduced. The choices are Cu²⁺ and H⁺ (from water).\n• Rule: the LESS reactive ion is preferred. Copper is LESS reactive than hydrogen → **Cu²⁺ + 2e⁻ → Cu** ✓\n• You see a brown layer of copper metal forming on the cathode\n\nAt the anode (+ve): SO₄²⁻ vs OH⁻ → OH⁻ wins → O₂ gas released.\n\nSo at the cathode: **copper** (NOT hydrogen, because Cu is less reactive).',
    true
  );

  -- ─── Q17 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '17', 1, 'free',
    'mcq',
    E'A spoon is to be electroplated with silver using an aqueous silver salt as the electrolyte.\n\nWhich row is correct?\n\n| | object (spoon) is the | other electrode made from |\n|---|---|---|\n| A | anode | carbon |\n| B | anode | silver |\n| C | cathode | carbon |\n| D | cathode | silver |',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('d'::text),
    null,
    E'D [1 mark]. Poorly answered (48%). Option B common wrong — candidates unsure which electrode the object should be.',
    E'**Electroplating** = coating an object with a thin metal layer using electrolysis.\n\nTwo rules to remember:\n\n1. **The OBJECT to be plated → CATHODE (−ve)** ✓\n   • Why? Metal ions (Ag⁺) move TO the negative electrode and deposit there.\n\n2. **The OTHER electrode → made of the PLATING METAL (silver)**\n   • The silver anode dissolves into solution: Ag → Ag⁺ + e⁻\n   • This keeps the silver ion concentration in solution constant\n\nSo: spoon = cathode, other electrode = silver → row **D**.',
    true
  );

  -- ─── Q18 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '18', 1, 'free',
    'mcq',
    E'The energy-level diagram for the FORWARD direction of a reversible reaction shows products at a higher energy than reactants, with an activation-energy peak in between.\n\nWhich row correctly shows the sign of the **activation energy** and the type of **enthalpy change**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','Ea negative, endothermic'),
      jsonb_build_object('id','b','text','Ea negative, exothermic'),
      jsonb_build_object('id','c','text','Ea positive, endothermic'),
      jsonb_build_object('id','d','text','Ea positive, exothermic')
    ),
    to_jsonb('c'::text),
    '/past-papers/chemistry-nssco-2024-p1/q18-energy-diagram.png',
    E'C [1 mark]. Fairly well answered (64%).',
    E'**Two things to read off an energy diagram:**\n\n1. **Activation energy (Ea) is ALWAYS POSITIVE** — it''s energy ABSORBED to start the reaction. Even exothermic reactions need a ''push'' to start. Energy *gained* over the peak = positive.\n\n2. **Enthalpy change (ΔH) — read the level shift:**\n   • Products **HIGHER** than reactants → **ENDOTHERMIC** (system absorbed energy) → ΔH **positive**\n   • Products LOWER → exothermic → ΔH negative\n\nHere products are HIGHER → endothermic + Ea positive → **C**.',
    true
  );

  -- ─── Q19 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '19', 1, 'free',
    'mcq',
    E'**X** is a substance that reacts with hydrogen in fuel cells.\n\nWhat is X?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','carbon'),
      jsonb_build_object('id','b','text','methane'),
      jsonb_build_object('id','c','text','nitrogen'),
      jsonb_build_object('id','d','text','oxygen')
    ),
    to_jsonb('d'::text),
    null,
    E'D — oxygen [1 mark]. Poorly answered (28%). Candidates appeared to be guessing.',
    E'**Hydrogen fuel cell:** H₂ + O₂ → H₂O + electricity.\n\nThe fuel cell uses:\n• **Hydrogen** at one electrode (fuel)\n• **OXYGEN** at the other electrode (oxidiser) ✓\n• Product: pure water (clean energy!)\n\nThis is the same as the combustion of hydrogen (2H₂ + O₂ → 2H₂O) but happening electrochemically to produce a voltage rather than a flame.\n\nCarbon/methane/nitrogen don''t react with H₂ to release electrical energy.',
    true
  );

  -- ─── Q20 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '20', 1, 'free',
    'mcq',
    E'In which experiment is the rate of reaction between hydrochloric acid and calcium carbonate **fastest**?\n• **A**: dilute HCl + lumps + water at 25 °C\n• **B**: dilute HCl + powdered + water at 40 °C\n• **C**: concentrated HCl + lumps + water at 25 °C\n• **D**: concentrated HCl + powdered + water at 40 °C',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('d'::text),
    '/past-papers/chemistry-nssco-2024-p1/q20-rate-experiments-ABCD.png',
    E'D [1 mark]. Fairly well answered (59.8%). Some candidates didn''t check carefully that B has DILUTE acid while D has CONCENTRATED acid.',
    E'**Three factors that make a reaction go faster:**\n\n1. **Higher temperature** → 40 °C > 25 °C\n2. **Higher concentration** of acid → concentrated > dilute\n3. **Larger surface area** → powdered > lumps\n\nMatch each option:\n• **A** — dilute, lumps, 25 °C (slowest — all three factors are slow)\n• B — dilute, powder, 40 °C (two factors fast)\n• C — concentrated, lumps, 25 °C (one factor fast)\n• **D** — concentrated, powder, 40 °C ← ALL THREE factors maximised → **fastest** ✓',
    true
  );

  -- ─── Q21 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '21', 1, 'free',
    'mcq',
    E'Which statement is true about enzymes?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','An enzyme is an organic catalyst that decreases the activation energy of a reaction.'),
      jsonb_build_object('id','b','text','An enzyme is an organic catalyst that increases the activation energy of a reaction.'),
      jsonb_build_object('id','c','text','An enzyme is an inorganic compound of a transition element that decreases the activation energy of a reaction.'),
      jsonb_build_object('id','d','text','An enzyme is an inorganic compound of a transition element that increases the activation energy of a reaction.')
    ),
    to_jsonb('a'::text),
    null,
    E'A [1 mark]. Poorly answered (24.6%). Many couldn''t recall whether catalysts increase or decrease activation energy.',
    E'**Two key facts about enzymes:**\n\n1. **ORGANIC** — enzymes are PROTEINS (made by living things). NOT inorganic, NOT transition metal compounds.\n2. **Decreases activation energy** — like all catalysts, enzymes provide an alternative reaction pathway with a lower energy barrier, so more molecules can react.\n\n→ ''organic catalyst that DECREASES activation energy'' = **A** ✓\n\nIncreasing Ea would slow the reaction down — that''s an inhibitor, not a catalyst.',
    true
  );

  -- ─── Q22 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '22', 1, 'free',
    'mcq',
    E'Which term refers to when the **rates of the forward and backward reactions are equal**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','closed system'),
      jsonb_build_object('id','b','text','dynamic equilibrium'),
      jsonb_build_object('id','c','text','hydration'),
      jsonb_build_object('id','d','text','reversible')
    ),
    to_jsonb('b'::text),
    null,
    E'B — dynamic equilibrium [1 mark]. Well answered (84.9%).',
    E'**Dynamic equilibrium** = state in a reversible reaction where:\n• Forward and backward reactions both still HAPPENING (dynamic, not static)\n• Their RATES are EQUAL\n• Concentrations of reactants and products are CONSTANT (but non-zero)\n\nOther terms:\n• ''Closed system'' = no matter enters or leaves (necessary CONDITION for equilibrium but not the term itself)\n• ''Hydration'' = adding water\n• ''Reversible'' = describes the reaction type, not the rate-equal moment',
    true
  );

  -- ─── Q23 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '23', 1, 'free',
    'mcq',
    E'Oxidation can be defined in terms of gain or loss of oxygen and gain or loss of electrons.\n\nWhich row correctly describes **OXIDATION**?\n\n| | oxygen | electrons |\n|---|---|---|\n| A | gain | gain |\n| B | gain | loss |\n| C | loss | loss |\n| D | loss | gain |',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Fairly well answered (62.6%).',
    E'**OIL RIG mnemonic:**\n• **O**xidation **I**s **L**oss (of electrons)\n• **R**eduction **I**s **G**ain (of electrons)\n\nOxidation in terms of OXYGEN: **GAIN** of oxygen (e.g. C + O₂ → CO₂ — carbon is oxidised)\nOxidation in terms of ELECTRONS: **LOSS** of electrons (e.g. Fe → Fe²⁺ + 2e⁻ — iron is oxidised)\n\n→ Gain oxygen + Lose electrons = **B** ✓',
    true
  );

  -- ─── Q24 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '24', 1, 'free',
    'mcq',
    E'A learner tested four solutions and recorded pH values of 1, 5, 7 and 14 but forgot to write the names.\n\nWhich row CORRECTLY matches a solution with its pH?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','distilled water — pH 1'),
      jsonb_build_object('id','b','text','concentrated sulfuric acid — pH 5'),
      jsonb_build_object('id','c','text','sodium hydroxide — pH 14'),
      jsonb_build_object('id','d','text','vinegar — pH 7')
    ),
    to_jsonb('c'::text),
    null,
    E'C — sodium hydroxide pH 14 [1 mark]. Fairly well answered (58.2%).',
    E'**Match each solution to its true pH:**\n\n• Distilled water → pH 7 (neutral) — so A is wrong (claims pH 1)\n• Concentrated sulfuric acid → pH ~0 (very strong acid) — so B is wrong (claims pH 5)\n• **Sodium hydroxide → pH 13-14 (strong alkali)** ✓\n• Vinegar (ethanoic acid) → pH 3-4 (weak acid) — so D is wrong (claims pH 7)\n\nOnly C correctly matches the solution to its actual pH.',
    true
  );

  -- ─── Q25 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '25', 1, 'free',
    'mcq',
    E'Which combination of starting materials would produce **copper(II) sulfate**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','copper + aqueous zinc sulfate'),
      jsonb_build_object('id','b','text','copper + dilute sulfuric acid'),
      jsonb_build_object('id','c','text','copper(II) carbonate + aqueous sodium sulfate'),
      jsonb_build_object('id','d','text','copper(II) oxide + dilute sulfuric acid')
    ),
    to_jsonb('d'::text),
    null,
    E'D [1 mark]. Poorly answered (31.7%). All options chosen equally — evidence of guessing.',
    E'**Salt-prep route: acid + base/carbonate/oxide → salt + water (+ CO₂ if carbonate).**\n\n• A — Cu is LESS reactive than Zn → no displacement → no reaction\n• B — Cu doesn''t react with dilute H₂SO₄ (less reactive than H in acid)\n• C — CuCO₃ + Na₂SO₄ → no reaction (no driving force)\n• **D — CuO + H₂SO₄ → CuSO₄ + H₂O** ✓ (acid + metal oxide → salt + water)\n\nCopper(II) oxide is a BASE that neutralises the acid → forms copper sulfate.',
    true
  );

  -- ─── Q26 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '26', 1, 'free',
    'mcq',
    E'Which metal gives a **lilac colour** when a flame test is carried out on it?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','barium'),
      jsonb_build_object('id','b','text','calcium'),
      jsonb_build_object('id','c','text','sodium'),
      jsonb_build_object('id','d','text','potassium')
    ),
    to_jsonb('d'::text),
    null,
    E'D — potassium [1 mark]. Fairly well answered (65.3%).',
    E'**Flame test colours to memorise:**\n• Lithium → red/crimson\n• Sodium → yellow/orange\n• **Potassium → LILAC / pale purple** ✓\n• Calcium → orange-red / brick red\n• Barium → apple green\n• Copper → blue-green\n\nLilac (light purple) = potassium. Don''t confuse with magenta or pink.',
    true
  );

  -- ─── Q27 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '27', 1, 'free',
    'mcq',
    E'What is used to test for the presence of **hydrogen gas**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','damp red litmus paper'),
      jsonb_build_object('id','b','text','glowing splint'),
      jsonb_build_object('id','c','text','lighted splint'),
      jsonb_build_object('id','d','text','limewater')
    ),
    to_jsonb('c'::text),
    null,
    E'C — lighted splint [1 mark]. Fairly well answered (56.8%). Option B common wrong — confusion with the oxygen test.',
    E'**Gas tests — memorise these:**\n\n• **Hydrogen (H₂)**: **LIGHTED splint → SQUEAKY POP** ✓ (hydrogen burns explosively in air)\n• Oxygen (O₂): GLOWING splint → relights (option B is the oxygen test, not hydrogen)\n• CO₂: bubble through limewater → turns milky\n• Ammonia (NH₃): damp RED litmus → turns blue (option A is the ammonia test)\n• Chlorine (Cl₂): damp litmus → bleached\n\nKey: lighted (with flame) = hydrogen squeaky pop. Glowing (no flame, just ember) = oxygen relight.',
    true
  );

  -- ─── Q28 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '28', 1, 'free',
    'mcq',
    E'Lead is more reactive than copper but less reactive than iron.\n\nWhich method would be most suitable for extracting **lead** from its ore?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','electrolysis'),
      jsonb_build_object('id','b','text','heating alone'),
      jsonb_build_object('id','c','text','heating with carbon'),
      jsonb_build_object('id','d','text','reacting with hydrogen')
    ),
    to_jsonb('c'::text),
    null,
    E'C — heating with carbon [1 mark]. Poorly answered (47.3%). Option A common wrong — confusion on extraction methods.',
    E'**Metal extraction method depends on reactivity:**\n\n• MORE reactive than carbon (K, Na, Ca, Mg, Al) → **ELECTROLYSIS** (carbon can''t displace them)\n• LESS reactive than carbon (Zn, Fe, Sn, **Pb**, Cu) → **REDUCTION with CARBON** (cheaper) ✓\n• Below H in reactivity (Cu, Ag, Au) → found NATIVE or simple roasting\n\nLead sits between iron and copper → less reactive than carbon → use **carbon (coke)** to reduce its ore in a furnace: PbO + C → Pb + CO₂.',
    true
  );

  -- ─── Q29 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '29', 1, 'free',
    'mcq',
    E'Which statement about the reactions in the **blast furnace** is correct?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','Carbon reacts with oxygen to form carbon dioxide.'),
      jsonb_build_object('id','b','text','Carbon monoxide removes the silicon dioxide impurity forming slag.'),
      jsonb_build_object('id','c','text','Iron(III) oxide is oxidised to iron.'),
      jsonb_build_object('id','d','text','Limestone reduces iron(III) oxide to iron.')
    ),
    to_jsonb('a'::text),
    null,
    E'A [1 mark]. Fairly well answered (56%).',
    E'**Blast furnace — four key reactions:**\n\n1. **Carbon (coke) + oxygen → CO₂** ✓ (this generates heat — option A)\n2. CO₂ + more carbon → 2CO (carbon monoxide is the actual reducing agent)\n3. **3CO + Fe₂O₃ → 2Fe + 3CO₂** (iron oxide is REDUCED, not oxidised — so C is wrong)\n4. **Limestone (CaCO₃) reacts with silica (SiO₂)** to form slag — limestone (or CaO from it) removes silica, NOT iron oxide (so D is wrong, B is also wrong because limestone — not CO — removes SiO₂)\n\nOnly A is fully correct.',
    true
  );

  -- ─── Q30 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '30', 1, 'free',
    'mcq',
    E'Crude oil is separated by fractional distillation. The diagram shows X near the TOP of the column and Y in the MIDDLE-LOWER portion.\n\nWhich row identifies X and Y?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','X=diesel, Y=naphtha'),
      jsonb_build_object('id','b','text','X=diesel, Y=petrol'),
      jsonb_build_object('id','c','text','X=naphtha, Y=petrol'),
      jsonb_build_object('id','d','text','X=naphtha, Y=diesel')
    ),
    to_jsonb('d'::text),
    '/past-papers/chemistry-nssco-2024-p1/q30-fractional-tower.png',
    E'D [1 mark]. Fairly well answered (59.3%).',
    E'**Fractional distillation tower — order from TOP (cool) to BOTTOM (hot):**\n• Refinery gas (LPG)\n• Petrol (gasoline)\n• **Naphtha** ← higher up (smaller, lighter molecules)\n• Kerosene (paraffin)\n• **Diesel oil** ← lower (heavier)\n• Fuel oil\n• Bitumen (residue at the bottom)\n\nHigher up = smaller molecules, lower boiling points, condense first as vapour rises.\n\nX (top) = **naphtha**, Y (middle-lower) = **diesel** → **D**.',
    true
  );

  -- ─── Q31 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '31', 1, 'free',
    'mcq',
    E'Which formula represents an **alkane**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','C₁₁H₁₃'),
      jsonb_build_object('id','b','text','C₁₁H₂₀'),
      jsonb_build_object('id','c','text','C₁₁H₂₂'),
      jsonb_build_object('id','d','text','C₁₁H₂₄')
    ),
    to_jsonb('d'::text),
    null,
    E'D [1 mark]. Poorly answered (49.4%).',
    E'**Alkane general formula: CₙH₂ₙ₊₂.**\n\nFor n = 11: H = 2(11) + 2 = **24** → C₁₁H₂₄ ✓\n\nQuick check for other series with n=11:\n• Alkene (CₙH₂ₙ) → C₁₁H₂₂ (option C — has a C=C double bond)\n• Alkyne (CₙH₂ₙ₋₂) → C₁₁H₂₀ (option B — has a triple bond)\n• A = C₁₁H₁₃ doesn''t fit any common series\n\nOnly D fits the SATURATED alkane formula.',
    true
  );

  -- ─── Q32 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '32', 1, 'free',
    'mcq',
    E'A learner does simple chemical tests to show that solution **Z is unsaturated** (contains C=C double bonds).\n\nWhich row shows the substance used for testing and the result?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','acidified potassium manganate(VII) — turns colourless'),
      jsonb_build_object('id','b','text','acidified potassium manganate(VII) — turns purple'),
      jsonb_build_object('id','c','text','litmus — bleached'),
      jsonb_build_object('id','d','text','litmus — turns blue')
    ),
    to_jsonb('a'::text),
    null,
    E'A [1 mark]. Fairly well answered (52.6%).',
    E'**Two tests for C=C unsaturation (alkenes):**\n\n1. **Bromine water** — orange → colourless (decolourised) when alkene present.\n2. **Acidified potassium manganate(VII) (KMnO₄)** — **PURPLE → colourless** ✓ when alkene present (the C=C bond gets oxidised).\n\nLitmus tests for acidity/alkalinity — not relevant to unsaturation.\n\nSo the test is KMnO₄ (purple) and it **turns colourless** with unsaturation → **A**.',
    true
  );

  -- ─── Q33 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '33', 1, 'free',
    'mcq',
    E'Diagrams show parts of four organic structures:\n• **A** — three carbons with –OH (an alcohol)\n• **B** — two carbons joined by a **C=C double bond** (an alkene)\n• **C** — –COOH group (carboxylic acid)\n• **D** — –CO–O– (ester)\n\nWhich compound can be **manufactured by catalytic cracking**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('b'::text),
    '/past-papers/chemistry-nssco-2024-p1/q33-cracking-structures.png',
    E'B [1 mark]. Poorly answered (41.9%). Many couldn''t recall the products of catalytic cracking.',
    E'**Catalytic cracking** = breaking long alkane chains into smaller pieces, INCLUDING **alkenes** (because every cracking reaction MUST produce at least one alkene to balance the H count).\n\nFor example: C₁₀H₂₂ → C₂H₄ (ethene, an alkene) + C₈H₁₈\n\nSo the product type made by cracking is the **alkene (C=C)** → **B** ✓\n\nThe others (alcohol, acid, ester) are made by different processes (hydration, oxidation, esterification).',
    true
  );

  -- ─── Q34 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '34', 1, 'free',
    'mcq',
    E'Four structures are shown:\n• **A** — H₃C–CH₂–OH (ethanol)\n• **B** — H₃C–CH₃ (ethane)\n• **C** — H₃C–COOH (carboxylic acid with CH₃)\n• **D** — H₃C–COO–CH₂–CH₃ (an ester)\n\nWhich diagram shows the structure of **ethanoic acid**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('c'::text),
    '/past-papers/chemistry-nssco-2024-p1/q34-ethanoic-structures.png',
    E'C [1 mark]. Fairly well answered (66%). Option A common wrong (confusion with ethanol).',
    E'**Ethanoic acid = CH₃COOH** (vinegar, 2 carbons + carboxylic acid group).\n\n• A = ethanol (CH₃CH₂OH) — alcohol, ends in –OH\n• B = ethane (CH₃CH₃) — just a hydrocarbon\n• **C = ethanoic acid (CH₃COOH)** — has the –COOH carboxylic group ✓\n• D = ethyl ethanoate (an ester) — has –COO– between two carbon chains\n\n**Carboxylic acid functional group: –COOH** (C double-bonded to one O, single-bonded to OH).',
    true
  );

  -- ─── Q35 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '35', 1, 'free',
    'mcq',
    E'The diagram shows the partial structure of a polymer **S** with repeating amide linkages (–CO–NH–) connecting two different units.\n\nWhat is S?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','fat'),
      jsonb_build_object('id','b','text','nylon'),
      jsonb_build_object('id','c','text','protein'),
      jsonb_build_object('id','d','text','terylene')
    ),
    to_jsonb('b'::text),
    '/past-papers/chemistry-nssco-2024-p1/q35-polymer-S.png',
    E'B — nylon [1 mark]. Fairly well answered (53%). Options C and D common wrong.',
    E'**Identify polymers by their linkage:**\n• **Nylon** — synthetic polyamide; **amide linkages (–CO–NH–)** between two different monomers (a diamine + a dicarboxylic acid) ✓\n• Protein — natural polyamide; amide linkages too, but between amino acids — different context.\n• Terylene — polyester; ester linkages (–CO–O–), NOT amide\n• Fat — also has ester linkages (between glycerol and fatty acids)\n\nThe diagram shows a SYNTHETIC polymer with amide linkages and two different repeat units → **nylon**.',
    true
  );

  -- ─── Q36 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '36', 1, 'free',
    'mcq',
    E'Which salt is dissolved in **permanent hard water**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','MgCl₂'),
      jsonb_build_object('id','b','text','MgCO₃'),
      jsonb_build_object('id','c','text','MgHCO₃'),
      jsonb_build_object('id','d','text','MgSO₄')
    ),
    to_jsonb('d'::text),
    null,
    E'D — magnesium sulfate [1 mark]. Fairly well answered (60.3%). Option A common wrong.',
    E'**Two types of hardness:**\n• **Temporary hardness** — caused by Ca/Mg **HYDROGEN CARBONATES** (Ca(HCO₃)₂, Mg(HCO₃)₂ / MgHCO₃). Removed by BOILING (they decompose).\n• **Permanent hardness** — caused by Ca/Mg **SULFATES** (CaSO₄, **MgSO₄**) and CHLORIDES. NOT removed by boiling. ✓\n\nMgCl₂ — also causes permanent hardness, but among these options, MgSO₄ is the textbook example. MgCO₃ is insoluble (doesn''t cause hardness).\n\nAnswer = **D (MgSO₄)** — examiner''s preferred choice.',
    true
  );

  -- ─── Q37 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '37', 1, 'free',
    'mcq',
    E'Which process is used to **kill bacteria** during water treatment?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','chlorination'),
      jsonb_build_object('id','b','text','eutrophication'),
      jsonb_build_object('id','c','text','filtration'),
      jsonb_build_object('id','d','text','sedimentation')
    ),
    to_jsonb('a'::text),
    null,
    E'A — chlorination [1 mark]. Well answered (76.8%).',
    E'**Water treatment steps in order:**\n\n1. Screening — remove large debris\n2. **Sedimentation** — heavy particles settle out\n3. **Filtration** — sand/gravel filters out smaller particles\n4. **Chlorination** — chlorine added → **KILLS bacteria** ✓ (this is the disinfection step)\n5. Sometimes fluoride is added for dental health\n\nEutrophication is the OPPOSITE — pollution from fertiliser runoff that kills aquatic life.',
    true
  );

  -- ─── Q38 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '38', 1, 'free',
    'mcq',
    E'Which substance gives off **carbon dioxide on heating**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','lime'),
      jsonb_build_object('id','b','text','limestone'),
      jsonb_build_object('id','c','text','limewater'),
      jsonb_build_object('id','d','text','slaked lime')
    ),
    to_jsonb('b'::text),
    null,
    E'B — limestone [1 mark]. Fairly well answered (55.1%).',
    E'**Lime family — match each name to its formula:**\n• Lime / **quicklime** = CaO (calcium oxide) — NO CO₂\n• **Limestone** = **CaCO₃** (calcium carbonate) → **decomposes on heating: CaCO₃ → CaO + CO₂** ✓\n• Limewater = Ca(OH)₂ solution (used for the CO₂ test)\n• Slaked lime = Ca(OH)₂ (solid)\n\nOnly carbonates release CO₂ when heated. **Thermal decomposition of limestone** is the basis of cement and lime manufacture.',
    true
  );

  -- ─── Q39 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '39', 1, 'free',
    'mcq',
    E'The pH of garden soil is **4** (acidic). What could be added to change its pH to **7**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','ammonium nitrate'),
      jsonb_build_object('id','b','text','lime'),
      jsonb_build_object('id','c','text','sand'),
      jsonb_build_object('id','d','text','sodium chloride')
    ),
    to_jsonb('b'::text),
    null,
    E'B — lime [1 mark]. Poorly answered (49.1%). Option A common wrong.',
    E'**Neutralising acidic soil** = add a BASE.\n\n• **Lime** (CaO) OR slaked lime Ca(OH)₂ OR limestone CaCO₃ — all alkaline → **neutralises the acid** ✓ (raises pH to ~7)\n• Ammonium nitrate (NH₄NO₃) — a fertiliser, but it''s slightly ACIDIC — would make it WORSE\n• Sand — neutral, no pH effect\n• Sodium chloride (table salt) — neutral, no pH effect\n\nFarmers ''lime'' acidic fields to neutralise acidity and improve crop yields.',
    true
  );

  -- ─── Q40 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2024, '1', '40', 1, 'free',
    'mcq',
    E'Sulfuric acid is a strong acid. Which of the following is a **use of sulfuric acid**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','detergents'),
      jsonb_build_object('id','b','text','bleach'),
      jsonb_build_object('id','c','text','food preservative'),
      jsonb_build_object('id','d','text','paper')
    ),
    to_jsonb('a'::text),
    null,
    E'A — detergents [1 mark]. Fairly well answered (58.1%). Options B and C common wrong — confusion between SO₂ (food preservative) and sulfuric acid.',
    E'**Uses of sulfuric acid (H₂SO₄):**\n• **Detergent manufacture** ✓ — sulfonates the hydrocarbon chains to make surfactants\n• Car batteries (lead-acid)\n• Fertiliser making (ammonium sulfate)\n• Cleaning metals (pickling)\n• Plastics + dyes\n\nDon''t confuse with sulfur dioxide (SO₂) — which IS used as a food preservative (E220) and bleach. The question asks specifically about sulfuric ACID — its main industrial use among these options is detergent manufacture.',
    true
  );

  raise notice 'Inserted 40 MCQ questions for Chemistry NSSCO 2024 Paper 1';
end $$;
