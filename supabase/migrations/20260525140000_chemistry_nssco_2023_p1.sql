-- ===========================================================================
-- NSSCO Chemistry 2023 Paper 1 (6117/1) — 40 MCQ questions, 40 marks
-- Verbatim NIED wording. Official answers + commentary from
-- the DNEA Examiners Report 2023 (Chemistry section, pages 95-96).
-- Diagrams cropped from past-papers/nssco-chemistry/2023/
-- into public/past-papers/chemistry-nssco-2023-p1/
-- ===========================================================================

do $$
declare
  chem_id uuid;
begin
  select id into chem_id from public.subjects where slug = 'chemistry' limit 1;
  if chem_id is null then
    raise notice 'Chemistry subject not found — skipping seed';
    return;
  end if;

  -- ─── Q1 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '1', 1, 'free',
    'mcq',
    E'Diagrams 1, 2 and 3 represent particle arrangements in three states of matter (1 = solid, 2 = liquid, 3 = gas).\n\nWhich statement correctly compares the kinetic energy of particles?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','1 has higher kinetic energy than 2'),
      jsonb_build_object('id','b','text','2 has lower kinetic energy than both 1 and 3'),
      jsonb_build_object('id','c','text','2 has higher kinetic energy than 3'),
      jsonb_build_object('id','d','text','3 has higher kinetic energy than both 1 and 2')
    ),
    to_jsonb('d'::text),
    '/past-papers/chemistry-nssco-2023-p1/q1-states-of-matter.png',
    E'D — 3 has higher kinetic energy than both 1 and 2 [1 mark]. 72.4% chose the correct option.',
    E'The three diagrams show:\n• 1 = solid (tightly packed lattice)\n• 2 = liquid (close but disordered)\n• 3 = gas (far apart, fast moving)\n\nKinetic energy of particles increases **solid → liquid → gas**:\n• Solids vibrate in fixed positions (least KE)\n• Liquids slide past each other (more KE)\n• Gases zoom around freely (most KE)\n\nSo diagram **3 (gas)** has higher KE than BOTH 1 (solid) and 2 (liquid). Answer = **D**.',
    true
  );

  -- ─── Q2 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '2', 1, 'free',
    'mcq',
    E'A certain food colouring contains a dissolved mixture of red and yellow dyes.\n\nIt is suspected that the mixture was contaminated with a third dye **X**.\n\nWhich method could be used to investigate the presence of the third dye?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','chromatography'),
      jsonb_build_object('id','b','text','distillation'),
      jsonb_build_object('id','c','text','evaporation'),
      jsonb_build_object('id','d','text','filtration')
    ),
    to_jsonb('a'::text),
    null,
    E'A — chromatography [1 mark]. Very well answered (87.1%).',
    E'**Chromatography** is the standard technique for **separating mixtures of dissolved coloured substances** (dyes, inks, plant pigments).\n\n• How: dot the mixture onto chromatography paper, dip the bottom in solvent → different dyes travel up at different rates → separate spots.\n• If THREE separate spots appear (not the expected two), there''s a third dye.\n\nThe others don''t separate dyes:\n• Distillation — separates liquids by boiling point\n• Evaporation — removes solvent, leaves all dyes mixed\n• Filtration — separates solid from liquid',
    true
  );

  -- ─── Q3 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '3', 1, 'free',
    'mcq',
    E'A tea bag was added to each of the beakers shown in the diagram. One beaker contained hot water and the other beaker contained cold water. In both beakers the colour spreads out.\n\nWhich result and explanation are correct?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','colour spreads faster in cold water — particles move faster at a higher temperature'),
      jsonb_build_object('id','b','text','colour spreads slower in cold water — particles move slower at a higher temperature'),
      jsonb_build_object('id','c','text','colour spreads faster in hot water — particles move faster at a higher temperature'),
      jsonb_build_object('id','d','text','colour spreads slower in hot water — particles move slower at a higher temperature')
    ),
    to_jsonb('c'::text),
    '/past-papers/chemistry-nssco-2023-p1/q3-tea-bag-diffusion.png',
    E'C [1 mark]. Very well answered (93.1%). Majority recognised colour spreads faster in hot water with the correct explanation.',
    E'**Diffusion is faster at higher temperatures** because particles have more kinetic energy and move faster.\n\nAt higher temperature:\n• Water molecules move faster\n• Dye molecules also move faster\n• → dye spreads through the water MORE quickly\n\nSo: hot water → faster spreading + correct reason = **C**.\n\nB and D incorrectly state particles move slower at higher temperature — that''s the opposite of reality.',
    true
  );

  -- ─── Q4 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '4', 1, 'free',
    'mcq',
    E'Which expression gives the number of **nucleons** in ⁽ᴬ⁾Xᴢ (mass number A, atomic number Z)?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','Z'),
      jsonb_build_object('id','c','text','A – Z'),
      jsonb_build_object('id','d','text','Z – A')
    ),
    to_jsonb('a'::text),
    null,
    E'A [1 mark]. Poorly answered — only 31.6% chose correctly. Many candidates confused nucleons with neutrons.',
    E'Key definitions for atomic notation `ᴬZX`:\n• **Z** (atomic number) = number of **protons**\n• **A** (mass number / nucleon number) = number of **nucleons** = protons + neutrons\n• Number of **neutrons** = A − Z\n• Number of **electrons** = Z (for a neutral atom)\n\n**Nucleons = protons + neutrons = A.** That''s the definition of mass number.\n\nIf you read ''neutrons'' you''d pick C (A−Z). The question said NUCLEONS = total particles in nucleus = **A**.',
    true
  );

  -- ─── Q5 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '5', 1, 'free',
    'mcq',
    E'An element Y is in **Group V** of the Periodic Table.\n\nWhich of the following is true about the atomic structure of element Y?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','It has 5 occupied shells.'),
      jsonb_build_object('id','b','text','It has 5 electrons in the outer shell.'),
      jsonb_build_object('id','c','text','It has 5 protons in its nucleus.'),
      jsonb_build_object('id','d','text','It has 5 neutrons in its nucleus.')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Well answered (80.2%). Candidates linked group number to outer-shell electrons.',
    E'**Group number = number of electrons in the outer shell** (for main-group elements I–VII).\n\n• Group I → 1 outer electron (Na, K, Li)\n• Group II → 2 outer electrons\n• ...\n• **Group V → 5 outer electrons** ✓ (e.g. nitrogen, phosphorus)\n• Group VII → 7 outer electrons (halogens)\n\nNot related to group number: total shells (depends on period), protons (depends on element), or neutrons (varies by isotope).',
    true
  );

  -- ─── Q6 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '6', 1, 'free',
    'mcq',
    E'Which metal forms a hydroxide which is **very soluble** in water?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','calcium'),
      jsonb_build_object('id','b','text','copper'),
      jsonb_build_object('id','c','text','lithium'),
      jsonb_build_object('id','d','text','magnesium')
    ),
    to_jsonb('c'::text),
    null,
    E'C — lithium [1 mark]. Very poorly answered. Candidates wrongly chose A (calcium hydroxide — only slightly soluble). They failed to recognise that lithium is in Group I and Group I forms soluble hydroxides.',
    E'Solubility of metal hydroxides:\n• **Group I hydroxides (LiOH, NaOH, KOH)** → very SOLUBLE — strongly alkaline ✓\n• Group II hydroxides:\n  - Ca(OH)₂ — slightly soluble (limewater)\n  - Mg(OH)₂ — almost insoluble (milk of magnesia)\n• Transition metal hydroxides like Cu(OH)₂ → INSOLUBLE (blue precipitate)\n\nLithium is in Group I → very soluble hydroxide.',
    true
  );

  -- ─── Q7 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '7', 1, 'free',
    'mcq',
    E'Bromine is found in Group VII of the Periodic Table.\n\nWhich row is true about the colour and the physical state of bromine at room temperature?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','red-brown — solid'),
      jsonb_build_object('id','b','text','red-brown — liquid'),
      jsonb_build_object('id','c','text','yellow-green — gas'),
      jsonb_build_object('id','d','text','yellow-green — liquid')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Poorly answered (40.7%). Many chose C, confusing bromine with chlorine.',
    E'Halogens at room temperature:\n• Fluorine (F₂) — pale yellow GAS\n• Chlorine (Cl₂) — yellow-green GAS\n• **Bromine (Br₂) — red-brown LIQUID** ✓ (only non-metal liquid at r.t.)\n• Iodine (I₂) — grey-black SOLID (sublimes to purple vapour)\n\nMemory hook: ''Bromine is brown and runs'' (red-brown liquid). Don''t mix it up with chlorine (yellow-green gas).',
    true
  );

  -- ─── Q8 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '8', 1, 'free',
    'mcq',
    E'Which name is given to mixtures of a metal with other metals?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','alloy'),
      jsonb_build_object('id','b','text','compound'),
      jsonb_build_object('id','c','text','element'),
      jsonb_build_object('id','d','text','ore')
    ),
    to_jsonb('a'::text),
    null,
    E'A — alloy [1 mark]. Very well answered (80.2%).',
    E'Key terms:\n• **Alloy** — a MIXTURE of two or more metals (or metal + small amount of non-metal). Examples: brass (Cu+Zn), steel (Fe+C), bronze (Cu+Sn) ✓\n• Compound — two or more elements CHEMICALLY bonded (e.g. NaCl)\n• Element — single type of atom (e.g. iron, oxygen)\n• Ore — rock containing a metal compound that''s worth extracting (e.g. haematite for iron)\n\nAlloys are MIXTURES, not compounds — atoms are not chemically bonded, just mixed.',
    true
  );

  -- ─── Q9 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '9', 1, 'free',
    'mcq',
    E'Which substance has the correct type of bonding?\n\n| substance | ionic | covalent | metallic |\n|---|---|---|---|\n| **A** carbon dioxide | ✓ | ✗ | ✗ |\n| **B** magnesium bromide | ✗ | ✗ | ✓ |\n| **C** sodium | ✓ | ✗ | ✗ |\n| **D** oxygen | ✗ | ✓ | ✗ |',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('d'::text),
    null,
    E'D — oxygen has covalent bonding [1 mark]. Fairly well answered (56.9%).',
    E'Bonding types matched to substances:\n• **Carbon dioxide (CO₂)** — covalent (non-metal + non-metal). Row A wrongly says ionic.\n• **Magnesium bromide (MgBr₂)** — ionic (metal + non-metal). Row B wrongly says metallic.\n• **Sodium (Na)** — metallic (a metal). Row C wrongly says ionic.\n• **Oxygen (O₂)** — covalent (non-metal molecule). Row D correctly says covalent ✓\n\nRule: metal+non-metal=ionic; non-metal+non-metal=covalent; metal alone=metallic.',
    true
  );

  -- ─── Q10 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '10', 1, 'free',
    'mcq',
    E'Lithium atoms react with chlorine atoms to form lithium chloride.\n\nWhich statement is correct?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','Lithium loses one electron to form a negative charge.'),
      jsonb_build_object('id','b','text','Lithium gains one electron to form a positive charge.'),
      jsonb_build_object('id','c','text','Chlorine loses one electron to form a negative charge.'),
      jsonb_build_object('id','d','text','Chlorine gains one electron to form a negative charge.')
    ),
    to_jsonb('d'::text),
    null,
    E'D [1 mark]. Fairly answered. Option A was the most common wrong answer — candidates knew lithium loses electrons but gave the wrong charge. 51.4% chose correctly.',
    E'In LiCl formation:\n• **Lithium (Li, Group I)** has 1 outer electron → **LOSES** 1 electron → becomes **Li⁺** (positive)\n• **Chlorine (Cl, Group VII)** has 7 outer electrons → **GAINS** 1 electron → becomes **Cl⁻** (negative) ✓\n\nRule: **lose electrons → positive ion; gain electrons → negative ion**. Lithium loses (so positive), chlorine gains (so negative). Only D matches.',
    true
  );

  -- ─── Q11 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '11', 1, 'free',
    'mcq',
    E'**R**, **S** and **T** represent three different structures of an element.\n\nR = graphite, S = diamond, T = buckminsterfullerene.\n\nWhich structures are giant covalent lattices?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','R, S and T'),
      jsonb_build_object('id','b','text','R and S only'),
      jsonb_build_object('id','c','text','R and T only'),
      jsonb_build_object('id','d','text','S and T only')
    ),
    to_jsonb('b'::text),
    '/past-papers/chemistry-nssco-2023-p1/q11-structures-RST.png',
    E'B — R and S only [1 mark]. Poorly answered (41.4%). Candidates failed to recall that buckminsterfullerene is a simple molecular structure.',
    E'Allotropes of carbon:\n• **R — Graphite** — GIANT covalent lattice (layers of hexagonal sheets) ✓\n• **S — Diamond** — GIANT covalent lattice (tetrahedral 3D network) ✓\n• **T — Buckminsterfullerene (C₆₀)** — SIMPLE MOLECULAR structure (single sphere of 60 atoms, weak forces BETWEEN molecules) ✗\n\n''Giant'' means the structure extends indefinitely in 3D. C₆₀ is a discrete molecule — not giant.',
    true
  );

  -- ─── Q12 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '12', 1, 'free',
    'mcq',
    E'Which of the following explains why metals have a **high melting point**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','Their atoms are regularly arranged in layers.'),
      jsonb_build_object('id','b','text','They have a lattice of positive ions.'),
      jsonb_build_object('id','c','text','They have free moving electrons that can carry charge.'),
      jsonb_build_object('id','d','text','They have strong electrostatic forces.')
    ),
    to_jsonb('d'::text),
    null,
    E'D [1 mark]. Fairly well answered (50.6%).',
    E'Why metals melt at high temperatures:\n\nMetals = lattice of **positive ions** in a sea of delocalised electrons. The **STRONG electrostatic forces** of attraction between positive ions and the negative electron sea hold the structure together.\n\nLots of energy needed to overcome these forces → **high melting point**.\n\n• A — true but doesn''t explain WHY they''re hard to melt\n• B — describes structure, not the reason for high m.p.\n• C — explains electrical conductivity, not melting point\n• **D — strong electrostatic forces** = the actual reason ✓',
    true
  );

  -- ─── Q13 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '13', 1, 'free',
    'mcq',
    E'The diagram represents the generalised structure of a substance with alternating + and – ions in a lattice.\n\nWhat is the substance?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','chlorine'),
      jsonb_build_object('id','b','text','sodium'),
      jsonb_build_object('id','c','text','sulfur dioxide'),
      jsonb_build_object('id','d','text','xenon')
    ),
    to_jsonb('b'::text),
    '/past-papers/chemistry-nssco-2023-p1/q13-ionic-structure.png',
    E'B — sodium [1 mark]. Poorly answered (31.0%). Most failed to recognise the generalised structure of a metal.',
    E'Wait — re-read the question. The diagram shows + (positive ions) AND − (electrons/negative charges). That''s a **metallic structure** = a metal lattice with delocalised electrons.\n\nMatch substances:\n• Chlorine (Cl₂) — simple molecular (covalent) — wrong\n• **Sodium (Na)** — metallic structure → lattice of Na⁺ ions in sea of electrons ✓\n• Sulfur dioxide (SO₂) — simple molecular (covalent) — wrong\n• Xenon (Xe) — noble gas, single atoms — wrong\n\nOnly sodium has a metallic lattice.',
    true
  );

  -- ─── Q14 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '14', 1, 'free',
    'mcq',
    E'The word equation shows the reaction between hydrogen and oxygen to produce water.\n\nhydrogen + oxygen → water\n\nWhat is the balanced chemical equation for the reaction?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','2H + 2O → 2H₂O'),
      jsonb_build_object('id','b','text','H₂ + O₂ → 2H₂O'),
      jsonb_build_object('id','c','text','H₂ + O₂ → H₂O'),
      jsonb_build_object('id','d','text','2H₂ + O₂ → 2H₂O')
    ),
    to_jsonb('d'::text),
    null,
    E'D [1 mark]. Well answered (60%).',
    E'Two checks for a balanced equation:\n1. **Diatomic molecules**: H₂ and O₂ (NOT lone H or O atoms) — rules out A\n2. **Balance atoms** on both sides:\n\n2H₂ + O₂ → 2H₂O\n• Hydrogens: LEFT 2×2 = 4 ✓ RIGHT 2×2 = 4 ✓\n• Oxygens: LEFT 2 ✓ RIGHT 2×1 = 2 ✓\n\nB: 2 H on left, 4 H on right — not balanced.\nC: 2 O on left, 1 O on right — not balanced.\n**D balances both elements.**',
    true
  );

  -- ─── Q15 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '15', 1, 'free',
    'mcq',
    E'Polythene is an example of a material found in the environment.\n\nWhich row is correct about the nature of polythene and the type of bonds it consists of?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','natural — covalent'),
      jsonb_build_object('id','b','text','natural — ionic'),
      jsonb_build_object('id','c','text','synthetic — covalent'),
      jsonb_build_object('id','d','text','synthetic — ionic')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. Poorly answered (41.7%). Many wrongly chose A.',
    E'Polythene (polyethylene):\n• **Synthetic** — made in factories by polymerisation of ethene (NOT from a natural source like cotton or wool) ✓\n• **Covalent** bonding — made of non-metal atoms (C and H) sharing electrons ✓\n\nAll plastics/polymers are made of small covalent molecules joined together — they''re never ionic.\nNatural polymers include starch, protein, DNA (still covalent though). Polythene is synthetic.',
    true
  );

  -- ─── Q16 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '16', 1, 'free',
    'mcq',
    E'Which other substance, other than clay, is used to make **cement**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','limestone'),
      jsonb_build_object('id','b','text','sand'),
      jsonb_build_object('id','c','text','stones'),
      jsonb_build_object('id','d','text','water')
    ),
    to_jsonb('a'::text),
    null,
    E'A — limestone [1 mark]. Well answered (60.7%).',
    E'**Cement is made from heating LIMESTONE (CaCO₃) + CLAY together in a kiln.**\n\nProcess: limestone + clay → cement powder. Cement is then mixed with sand + stones + water to make CONCRETE — but cement itself comes from just limestone + clay.\n\n• Limestone (calcium carbonate) → answer ✓\n• Sand → ingredient of concrete, not cement\n• Stones → ingredient of concrete, not cement\n• Water → mixes with cement to set, but isn''t an ingredient of the powder',
    true
  );

  -- ─── Q17 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '17', 1, 'free',
    'mcq',
    E'The diagram shows the generalised structure of a soap molecule with a polar head **X** and a non-polar tail **Y**.\n\nWhich row is correct about how soap removes oily stains during washing?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','X mixes with water — Y mixes with water'),
      jsonb_build_object('id','b','text','X mixes with water — Y mixes with the oily stains'),
      jsonb_build_object('id','c','text','X mixes with the oily stains — Y mixes with the oily stains'),
      jsonb_build_object('id','d','text','X mixes with the oily stains — Y mixes with water')
    ),
    to_jsonb('b'::text),
    '/past-papers/chemistry-nssco-2023-p1/q17-soap-molecule.png',
    E'B [1 mark]. Well answered (72.7%).',
    E'Soap = a ''two-faced'' molecule:\n• **X — head end (polar, ionic)** → ''hydrophilic'' (water-loving) → mixes with WATER ✓\n• **Y — tail end (long hydrocarbon chain)** → ''hydrophobic'' (water-fearing) → mixes with OIL/GREASE ✓\n\nIn washing:\n1. Tails grab onto the oily dirt\n2. Heads stay in the water\n3. Oil droplet gets surrounded by soap molecules\n4. Whole ''micelle'' is rinsed away by water\n\nSo X→water, Y→oil = **B**.',
    true
  );

  -- ─── Q18 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '18', 1, 'free',
    'mcq',
    E'Which oxide is **acidic**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','aluminium oxide'),
      jsonb_build_object('id','b','text','magnesium oxide'),
      jsonb_build_object('id','c','text','carbon dioxide'),
      jsonb_build_object('id','d','text','potassium oxide')
    ),
    to_jsonb('c'::text),
    null,
    E'C — carbon dioxide [1 mark]. Poorly answered (31.1%). Non-metallic oxides are acidic. Evidence of guessing.',
    E'**Rule: Non-metal oxides = ACIDIC. Metal oxides = BASIC (or amphoteric in middle).**\n\n• **Carbon dioxide (CO₂)** — non-metal oxide → ACIDIC ✓ (forms carbonic acid in water)\n• Magnesium oxide, potassium oxide — both metal oxides → basic\n• Aluminium oxide — amphoteric (acts as both acid AND base) — special case\n\nOther acidic oxides: SO₂, SO₃, NO₂, P₄O₁₀. All non-metal oxides.',
    true
  );

  -- ─── Q19 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '19', 1, 'free',
    'mcq',
    E'Naphthalene is a hydrocarbon often used in moth balls.\n\nThe percentage composition is **93.75% carbon and 6.25% hydrogen**.\n\nWhat is the empirical formula of naphthalene?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','CH'),
      jsonb_build_object('id','b','text','C₃H₂'),
      jsonb_build_object('id','c','text','C₄H₅'),
      jsonb_build_object('id','d','text','C₅H₄')
    ),
    to_jsonb('d'::text),
    null,
    E'D [1 mark]. Poorly answered (24%). Option A was the most common wrong answer.',
    E'**Three-step empirical formula calculation:**\n\n1. **Divide % by Ar:**\n   - C: 93.75 ÷ 12 = 7.8125\n   - H: 6.25 ÷ 1 = 6.25\n\n2. **Divide by smallest (6.25):**\n   - C: 7.8125 ÷ 6.25 = 1.25\n   - H: 6.25 ÷ 6.25 = 1\n\n3. **Multiply to get whole numbers** (×4 here):\n   - C: 1.25 × 4 = 5\n   - H: 1 × 4 = 4\n\n→ Empirical formula = **C₅H₄** ✓\n\n(Molecular formula of naphthalene is C₁₀H₈ = 2 × C₅H₄.)',
    true
  );

  -- ─── Q20 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '20', 1, 'free',
    'mcq',
    E'A solution of potassium carbonate, **K₂CO₃**, has a concentration of **0.03 mol/dm³**.\n\nWhich mass of potassium carbonate is dissolved in 1 dm³ of this solution?\n\n(Ar: K=39, C=12, O=16)',
    jsonb_build_array(
      jsonb_build_object('id','a','text','1.38 g'),
      jsonb_build_object('id','b','text','4.14 g'),
      jsonb_build_object('id','c','text','13.80 g'),
      jsonb_build_object('id','d','text','41.40 g')
    ),
    to_jsonb('b'::text),
    null,
    E'B — 4.14 g [1 mark]. Fairly answered (54.7%).',
    E'**Steps:**\n\n1. **Mr of K₂CO₃** = (2×39) + 12 + (3×16) = 78 + 12 + 48 = **138 g/mol**\n2. **moles** in 1 dm³ at 0.03 mol/dm³ = 0.03 mol\n3. **mass = moles × Mr** = 0.03 × 138 = **4.14 g** ✓\n\nFormula trio:\n• n = m / Mr\n• c = n / V\n• m = n × Mr = c × V × Mr\n\nDirect: m = 0.03 × 1 × 138 = 4.14 g.',
    true
  );

  -- ─── Q21 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '21', 1, 'free',
    'mcq',
    E'The diagram shows the electrolysis of **molten sodium chloride, NaCl**, with electrode X positive and electrode Y negative.\n\nWhich is correct?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','oxidation occurs at electrode X and the equation is: 2Cl⁻ → Cl₂ + 2e⁻'),
      jsonb_build_object('id','b','text','oxidation occurs at electrode Y and the equation is: Na⁺ + e⁻ → Na'),
      jsonb_build_object('id','c','text','reduction occurs at electrode X and the equation is: Na⁺ + e⁻ → Na'),
      jsonb_build_object('id','d','text','reduction occurs at electrode Y and the equation is: 2Cl⁻ → Cl₂ + 2e⁻')
    ),
    to_jsonb('a'::text),
    '/past-papers/chemistry-nssco-2023-p1/q21-electrolysis-nacl.png',
    E'A [1 mark]. Poorly answered (40.4%) — challenging and demanding.',
    E'**Two rules to memorise:**\n• **OIL RIG**: Oxidation = Loss of electrons; Reduction = Gain of electrons\n• At the **anode (+ve electrode)** → **oxidation** happens (negative ions lose electrons)\n• At the **cathode (−ve electrode)** → **reduction** happens (positive ions gain electrons)\n\nElectrode X is **+ve** (anode):\n• Cl⁻ ions attracted, lose e⁻ → Cl₂ gas\n• **2Cl⁻ → Cl₂ + 2e⁻** (oxidation — loses electrons) ✓\n\nElectrode Y is −ve (cathode):\n• Na⁺ + e⁻ → Na (reduction)\n\nSo X = oxidation with 2Cl⁻ equation = **A**.',
    true
  );

  -- ─── Q22 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '22', 1, 'free',
    'mcq',
    E'Which row describes the properties of a **transition element**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','high density — low melting point — no colour of compounds'),
      jsonb_build_object('id','b','text','high density — high melting point — blue compounds'),
      jsonb_build_object('id','c','text','low density — low melting point — brown compounds'),
      jsonb_build_object('id','d','text','low density — high melting point — blue compounds')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Fairly answered (50.1%).',
    E'Transition metals (the d-block, e.g. Cu, Fe, Cr, Ni):\n• **HIGH density** — heavy metals (iron is ~7.9 g/cm³)\n• **HIGH melting point** — strong metallic bonds\n• **COLOURED compounds** — characteristic feature! (Cu²⁺ blue, Fe²⁺ green, Fe³⁺ orange/brown, Cr³⁺ green)\n• Variable oxidation states\n• Useful catalysts\n\n''Blue compounds'' is a typical example — copper(II) salts are blue. Row **B** has all three correct.',
    true
  );

  -- ─── Q23 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '23', 1, 'free',
    'mcq',
    E'Which statement is **true** about catalysts?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A catalyst changes chemically after participating in a chemical reaction.'),
      jsonb_build_object('id','b','text','A catalyst increases the rate of reaction by reducing the activation energy of a reaction.'),
      jsonb_build_object('id','c','text','An inhibitor is a substance that increases the rate of a reaction.'),
      jsonb_build_object('id','d','text','Enzymes are proteins that catalyse inorganic reactions.')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Well answered (73%).',
    E'Catalyst facts:\n• A catalyst **lowers the activation energy** (Ea) → more molecules have enough energy to react → faster rate ✓\n• A catalyst is **NOT chemically changed** at the end (so A is wrong)\n• An **inhibitor** SLOWS down reactions (so C is wrong)\n• **Enzymes** catalyse **BIOLOGICAL** reactions, not inorganic ones (so D is wrong)\n\nOnly **B** is correct.',
    true
  );

  -- ─── Q24 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '24', 1, 'free',
    'mcq',
    E'The word equation shows the reaction between iron(III) oxide and aluminium.\n\niron(III) oxide + aluminium → iron + aluminium oxide\n\nWhich substance is the **reducing agent** in the reaction?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','aluminium'),
      jsonb_build_object('id','b','text','aluminium oxide'),
      jsonb_build_object('id','c','text','iron(III) oxide'),
      jsonb_build_object('id','d','text','iron')
    ),
    to_jsonb('a'::text),
    null,
    E'A — aluminium [1 mark]. Poorly answered (35.3%).',
    E'A **reducing agent** is the species that DONATES electrons (i.e. itself gets oxidised).\n\nIn this reaction:\n• **Iron(III) oxide** → iron: iron goes from Fe³⁺ to Fe (gains electrons = reduced)\n• **Aluminium** → aluminium oxide: Al goes from 0 to Al³⁺ (loses electrons = OXIDISED)\n\nThe one being oxidised is the **REDUCING agent**.\n• Aluminium is oxidised → aluminium is the reducing agent ✓\n• Iron(III) oxide is reduced → iron(III) oxide is the oxidising agent\n\nMnemonic: ''A reducing agent reduces something ELSE — so itself gets oxidised.''',
    true
  );

  -- ─── Q25 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '25', 1, 'free',
    'mcq',
    E'Which statement(s) describe the properties of acids?\n\n1. react with ammonium sulfate to form ammonia\n2. react with metals to form salt and water\n3. react with carbonates to form salts, water and carbon dioxide',
    jsonb_build_array(
      jsonb_build_object('id','a','text','1 and 2 only'),
      jsonb_build_object('id','b','text','2 only'),
      jsonb_build_object('id','c','text','2 and 3 only'),
      jsonb_build_object('id','d','text','3 only')
    ),
    to_jsonb('d'::text),
    null,
    E'D — 3 only [1 mark]. Poorly answered. Most wrongly chose C — they didn''t notice statement 2 says ''salt and WATER'' instead of ''salt and HYDROGEN GAS''.',
    E'Standard acid reactions:\n• acid + metal → salt + **HYDROGEN GAS** (NOT water) — so statement 2 is WRONG\n• acid + carbonate → salt + water + CO₂ — statement 3 ✓\n• acid + ammonium salt → ammonia? **NO** — alkalis react with ammonium salts to release NH₃. Statement 1 is WRONG.\n\nOnly statement 3 is true → answer **D**.\n\nRead carefully: ''salt and water'' looks right at a glance but the actual product is ''salt and hydrogen gas''.',
    true
  );

  -- ─── Q26 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '26', 1, 'free',
    'mcq',
    E'Which two materials are **most** suitable to prepare sodium nitrate?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','sodium and nitrogen'),
      jsonb_build_object('id','b','text','sodium and dilute nitric acid'),
      jsonb_build_object('id','c','text','sodium hydroxide and dilute nitric acid'),
      jsonb_build_object('id','d','text','sodium oxide and ethanoic acid')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. Poorly answered (25.9%). Evidence of guessing.',
    E'Standard salt preparation = **acid + alkali → salt + water (neutralisation)**.\n\n• A — sodium and nitrogen wouldn''t directly form sodium nitrate (no oxygen available)\n• B — sodium metal + nitric acid → too violent, dangerous explosion\n• **C — NaOH + HNO₃ → NaNO₃ + H₂O** — safe neutralisation ✓\n• D — sodium oxide + ethanoic acid → sodium ETHANOATE (wrong salt)\n\nFor a NITRATE you need NITRIC acid. For a SODIUM salt you need an SAFE source of sodium = NaOH (not Na metal).',
    true
  );

  -- ─── Q27 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '27', 1, 'free',
    'mcq',
    E'Which aqueous ion forms a white precipitate when **acidified aqueous barium nitrate** is added to it?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','chloride'),
      jsonb_build_object('id','b','text','iodide'),
      jsonb_build_object('id','c','text','nitrate'),
      jsonb_build_object('id','d','text','sulfate')
    ),
    to_jsonb('d'::text),
    null,
    E'D — sulfate [1 mark]. Poorly answered (31.1%). Confusion between chloride and sulfate.',
    E'**Test for sulfate ions (SO₄²⁻):**\n1. Acidify the sample with dilute nitric acid\n2. Add aqueous barium nitrate / barium chloride\n3. **White precipitate of barium sulfate (BaSO₄)** forms = positive test ✓\n\nDon''t confuse with:\n• Chloride test — use SILVER nitrate (Ag⁺), get a WHITE precipitate of AgCl. (Barium nitrate doesn''t react with chloride.)\n• Iodide test — use silver nitrate, get YELLOW precipitate of AgI.\n• Nitrate — needs aluminium powder + NaOH + warming (smells of ammonia).',
    true
  );

  -- ─── Q28 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '28', 1, 'free',
    'mcq',
    E'Which metal is extracted from the ore, **chalcopyrite**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','aluminium'),
      jsonb_build_object('id','b','text','copper'),
      jsonb_build_object('id','c','text','iron'),
      jsonb_build_object('id','d','text','lead')
    ),
    to_jsonb('b'::text),
    null,
    E'B — copper [1 mark]. Well answered (72.1%).',
    E'**Common ores to know:**\n• Bauxite → aluminium\n• **Chalcopyrite (CuFeS₂) → copper** ✓\n• Haematite (Fe₂O₃) / magnetite (Fe₃O₄) → iron\n• Galena (PbS) → lead\n• Cinnabar (HgS) → mercury\n• Zinc blende (ZnS) → zinc\n\n''Chalco-'' from Greek ''chalkos'' = copper. The name itself gives it away.',
    true
  );

  -- ─── Q29 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '29', 1, 'free',
    'mcq',
    E'Four identical iron nails are placed in test-tubes with different conditions:\n• **A** — galvanised nail\n• **B** — painted nail\n• **C** — nail covered in a damp cloth\n• **D** — greased nail\n\nWhich of the following iron nails rust?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','A'),
      jsonb_build_object('id','b','text','B'),
      jsonb_build_object('id','c','text','C'),
      jsonb_build_object('id','d','text','D')
    ),
    to_jsonb('c'::text),
    '/past-papers/chemistry-nssco-2023-p1/q29-rusting-nails.png',
    E'C [1 mark]. Well answered (66.1%). Candidates recognised that rusting requires moisture and air.',
    E'**Rusting requires BOTH water AND oxygen** (from air).\n\n• **A — galvanised**: nail is coated in zinc → zinc reacts instead → no rust\n• **B — painted**: paint blocks water + air → no rust\n• **C — damp cloth**: WATER + AIR both present → RUSTS ✓\n• **D — greased**: grease blocks water → no rust\n\nThe damp cloth provides water AND lets air through → perfect rusting conditions.',
    true
  );

  -- ─── Q30 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '30', 1, 'free',
    'mcq',
    E'What is the **general formula** of alkanes?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','CₙH₂ₙ'),
      jsonb_build_object('id','b','text','CₙH₂ₙ₊₁'),
      jsonb_build_object('id','c','text','CₙH₂ₙ₊₂'),
      jsonb_build_object('id','d','text','CₙH₂ₙ₊₁OH')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. Poorly answered (45.1%). Evidence of guessing, especially between A and B.',
    E'Homologous series general formulas (memorise these!):\n• **Alkanes (saturated)**: **CₙH₂ₙ₊₂** ✓ (e.g. CH₄, C₂H₆, C₃H₈)\n• Alkenes (one double bond): CₙH₂ₙ (e.g. C₂H₄, C₃H₆)\n• Alkynes (one triple bond): CₙH₂ₙ₋₂\n• Alcohols: CₙH₂ₙ₊₁OH (e.g. CH₃OH, C₂H₅OH)\n• Carboxylic acids: CₙH₂ₙ₊₁COOH\n\nOption B (CₙH₂ₙ₊₁) is the **alkyl group** formula, not a complete alkane.',
    true
  );

  -- ─── Q31 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '31', 1, 'free',
    'mcq',
    E'Which pair of compounds belong to the **same homologous series**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','CH₃CH₃ and CH₃CH₂CH₃'),
      jsonb_build_object('id','b','text','CH₃CH₂OH and CH₃OCH₂CH₃'),
      jsonb_build_object('id','c','text','CH₂CHCH₂CH₃ and CH₃CH₂CH₂CH₃'),
      jsonb_build_object('id','d','text','CH₃CH₂OH and CH₂CHCH₂OH')
    ),
    to_jsonb('a'::text),
    null,
    E'A [1 mark]. Poorly answered (23.2%). Structural formulae made it more demanding. Option C was a common wrong answer.',
    E'**Homologous series = compounds with the same general formula** (same functional group, differ by CH₂).\n\n• **A** — CH₃CH₃ (ethane, C₂H₆) and CH₃CH₂CH₃ (propane, C₃H₈) — BOTH alkanes ✓\n• B — first is alcohol (ethanol), second is an ether — different families\n• C — CH₂CHCH₂CH₃ is an alkene (has C=C), CH₃CH₂CH₂CH₃ is an alkane — different families\n• D — first is alcohol, second is an UNSATURATED alcohol (has C=C) — slightly different groups\n\nOnly A: two pure alkanes from the alkane series.',
    true
  );

  -- ─── Q32 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '32', 1, 'free',
    'mcq',
    E'The structures of two compounds:\n• **P**: CH₃—CH(CH₃)—CH₂—CH₃ (an alkane with a branch — methylpropane)\n• **Q**: CH₃—CH₂—CH=CH₂ (an alkene — but-1-ene)\n\nWhich row about the structures is correct?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','reacts readily with bromine: P; forms a polymer: P'),
      jsonb_build_object('id','b','text','reacts readily with bromine: P; forms a polymer: Q'),
      jsonb_build_object('id','c','text','reacts readily with bromine: Q; forms a polymer: P'),
      jsonb_build_object('id','d','text','reacts readily with bromine: Q; forms a polymer: Q')
    ),
    to_jsonb('d'::text),
    '/past-papers/chemistry-nssco-2023-p1/q32-structures-PQ.png',
    E'D [1 mark]. Very poorly answered (15.5%). Most chose B. They failed to recognise that only the alkene Q can react with bromine.',
    E'**Alkenes have a C=C double bond — that makes them reactive.**\n\nP is an **alkane** (only single bonds) — unreactive with bromine, no polymerisation.\nQ is an **alkene** (has C=C) — BOTH:\n• **Reacts with bromine**: Q + Br₂ → decolourises bromine water (test for unsaturation) ✓\n• **Polymerises**: many Q molecules link up → poly(butene) ✓\n\nBoth properties belong to Q (the alkene). Answer = **D** (Q for both).',
    true
  );

  -- ─── Q33 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '33', 1, 'free',
    'mcq',
    E'What is the name of the product formed when this reaction takes place?\n\nCH₃COOH + CH₃CH₂OH →',
    jsonb_build_array(
      jsonb_build_object('id','a','text','ethyl ethanoate'),
      jsonb_build_object('id','b','text','ethyl methanoate'),
      jsonb_build_object('id','c','text','methyl ethanoate'),
      jsonb_build_object('id','d','text','methyl propanoate')
    ),
    to_jsonb('a'::text),
    null,
    E'A — ethyl ethanoate [1 mark]. Poorly answered (41.5%). Many candidates appeared to be guessing.',
    E'**Esterification: carboxylic acid + alcohol → ester + water.**\n\nNaming an ester = ''*alcohol-part* + *acid-part*'':\n• From the alcohol (CH₃CH₂OH = ethanol) → **ethyl** (the alkyl group)\n• From the acid (CH₃COOH = ethanoic acid) → **ethanoate**\n• → **ethyl ethanoate** ✓\n\nGeneral pattern:\n• methanol + acid X → methyl X-oate\n• ethanol + acid X → ethyl X-oate\n\nHere both are ''eth-'' = 2 carbons each → ethyl ethanoate.',
    true
  );

  -- ─── Q34 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '34', 1, 'free',
    'mcq',
    E'The diagram shows part of a polymer with C=O groups linked to N–H groups (amide linkages: –CO–NH–).\n\nWhich polymer is represented?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','a carbohydrate'),
      jsonb_build_object('id','b','text','a protein'),
      jsonb_build_object('id','c','text','nylon'),
      jsonb_build_object('id','d','text','terylene')
    ),
    to_jsonb('c'::text),
    '/past-papers/chemistry-nssco-2023-p1/q34-polymer-structure.png',
    E'C — nylon [1 mark]. Poorly answered (39.3%).',
    E'Identify the polymer by its **linkage**:\n• **Carbohydrate (starch/cellulose)** — glycosidic linkage (–O–)\n• **Protein** — amide linkage (–CO–NH–) BUT joining amino acids; it would be a NATURAL polymer\n• **Nylon** — synthetic polyamide; amide linkages (–CO–NH–) joining diamines and diacids ✓\n• **Terylene** — polyester; ester linkages (–CO–O–)\n\nThe key clue: the question shows a SYNTHETIC polymer (made in industry) with amide linkages → **nylon**. (Proteins are natural, not ''shown as part of a polymer'' in this style.)',
    true
  );

  -- ─── Q35 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '35', 1, 'free',
    'mcq',
    E'What is the main reason why plastic causes environmental pollution?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','They cause acid rain.'),
      jsonb_build_object('id','b','text','They cannot be decomposed by bacteria.'),
      jsonb_build_object('id','c','text','They cause eutrophication.'),
      jsonb_build_object('id','d','text','They contribute to climate change.')
    ),
    to_jsonb('b'::text),
    null,
    E'B [1 mark]. Well answered (79.2%).',
    E'Plastics are **non-biodegradable** — bacteria can''t break down the long polymer chains. Result:\n• They pile up in landfills for centuries\n• They end up in oceans, rivers, soil\n• Wildlife eats microplastics\n• Burning them releases toxic fumes\n\nAcid rain is caused by SO₂/NOₓ from burning fuels. Eutrophication is caused by fertiliser runoff. Climate change is caused by CO₂ + greenhouse gases. The DEFINING problem of plastic is **non-biodegradability**.',
    true
  );

  -- ─── Q36 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '36', 1, 'free',
    'mcq',
    E'Which compound causes **permanent hardness** in water?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','calcium carbonate'),
      jsonb_build_object('id','b','text','calcium hydrogen carbonate'),
      jsonb_build_object('id','c','text','magnesium hydrogen carbonate'),
      jsonb_build_object('id','d','text','magnesium sulfate')
    ),
    to_jsonb('d'::text),
    null,
    E'D — magnesium sulfate [1 mark]. Fairly answered (50.1%). Option A was a common wrong answer.',
    E'Two types of hardness:\n• **Temporary hardness** — caused by Ca/Mg **HYDROGEN CARBONATES** (Ca(HCO₃)₂, Mg(HCO₃)₂). Removed by BOILING (they decompose to insoluble carbonates).\n• **Permanent hardness** — caused by Ca/Mg **SULFATES** (CaSO₄, MgSO₄) and CHLORIDES. NOT removed by boiling — sulfates don''t decompose. ✓\n\nBoth types can be removed by ion-exchange or adding washing soda (Na₂CO₃).\n\nA = calcium carbonate is INSOLUBLE — doesn''t cause hardness directly.',
    true
  );

  -- ─── Q37 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '37', 1, 'free',
    'mcq',
    E'What is the name of the method used for the **commercial preparation** of oxygen?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','diffusion'),
      jsonb_build_object('id','b','text','distillation'),
      jsonb_build_object('id','c','text','evaporation'),
      jsonb_build_object('id','d','text','fractional distillation')
    ),
    to_jsonb('d'::text),
    null,
    E'D — fractional distillation [1 mark]. Poorly answered (45.8%). Option A was a common wrong answer.',
    E'**Industrial / commercial oxygen is made by FRACTIONAL DISTILLATION of liquid air.**\n\nProcess:\n1. Air is filtered to remove dust\n2. Cooled and compressed until it liquefies (~−200°C)\n3. Slowly warmed → gases boil off at different temperatures (fractional distillation)\n   - Nitrogen boils off first (−196 °C)\n   - Oxygen later (−183 °C)\n\nThe LABORATORY method (decomposing H₂O₂) gives small amounts — not commercial scale. Diffusion doesn''t separate gases. Simple distillation can''t separate gases by such close boiling points — need fractional.',
    true
  );

  -- ─── Q38 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '38', 1, 'free',
    'mcq',
    E'Vegetation is sometimes used to form compost. This compost can be used to fertilise soils.\n\nWhich gas is likely to be present in a higher percentage during the decomposition of vegetation?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','carbon monoxide'),
      jsonb_build_object('id','b','text','methane'),
      jsonb_build_object('id','c','text','oxygen'),
      jsonb_build_object('id','d','text','sulfur dioxide')
    ),
    to_jsonb('b'::text),
    null,
    E'B — methane [1 mark]. Poorly answered (34.1%). Option A was a common wrong answer.',
    E'**Anaerobic decomposition** (no oxygen) of vegetation by bacteria releases **METHANE (CH₄)** as the main product.\n\nThat''s why:\n• Compost heaps, marshes, landfills, and rice paddies are all big sources of methane (a potent greenhouse gas)\n• ''Biogas'' from waste is mostly methane + some CO₂\n\nCO is from incomplete burning of fuels (not decomposition). Oxygen would be CONSUMED, not released. SO₂ comes from burning sulfur-containing fuels.',
    true
  );

  -- ─── Q39 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '39', 1, 'free',
    'mcq',
    E'When calcium carbonate is heated strongly, two substances Y and Z are formed.\n\n• Substance **Y** is a white solid that reacts with water, giving out heat.\n• Substance **Z** is a colourless gas.\n\nWhat are substances Y and Z?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','Y = calcium chloride; Z = carbon dioxide'),
      jsonb_build_object('id','b','text','Y = calcium oxide; Z = oxygen'),
      jsonb_build_object('id','c','text','Y = calcium oxide; Z = carbon dioxide'),
      jsonb_build_object('id','d','text','Y = calcium hydroxide; Z = oxygen')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. Poorly answered (44.1%). Many candidates appear to be guessing.',
    E'**Thermal decomposition of calcium carbonate (limestone):**\n\nCaCO₃ → CaO + CO₂\n\n• **Y = calcium oxide (CaO, quicklime)** — white solid, reacts vigorously with water (exothermic) to form Ca(OH)₂ (slaked lime) ✓\n• **Z = carbon dioxide (CO₂)** — colourless gas, turns limewater milky\n\nThis is the chemistry behind making cement and lime mortar. No chlorine present (rules out A), no oxygen released (rules out B and D).',
    true
  );

  -- ─── Q40 ──────────────────────────────────────────────────────
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, diagram_url, memo, explanation, is_published
  ) values (
    chem_id, 2023, '1', '40', 1, 'free',
    'mcq',
    E'Which of the following is a **use of sulfur dioxide (SO₂)**?',
    jsonb_build_array(
      jsonb_build_object('id','a','text','manufacture of cement'),
      jsonb_build_object('id','b','text','manufacture of detergents'),
      jsonb_build_object('id','c','text','manufacture of food preservatives'),
      jsonb_build_object('id','d','text','treating acidic soil')
    ),
    to_jsonb('c'::text),
    null,
    E'C [1 mark]. Very poorly answered (24.4%). Options B and D were common wrong answers.',
    E'**SO₂ is used as a FOOD PRESERVATIVE** (E-number E220) — kills microbes and prevents browning.\n\nFound in: dried fruits, wine, fruit juices, sausages, pickled vegetables. The chemical formulation can be SO₂ gas, sodium sulfite, or sodium metabisulfite.\n\nOther distractors:\n• Cement is made from limestone + clay (not SO₂)\n• Detergents use sulfonic acid derivatives (not SO₂ directly)\n• Acidic soil is treated with LIME (calcium hydroxide), NOT acidic SO₂ — that would make it WORSE\n\nSO₂ is also used to make sulfuric acid (the main industrial use) but among the OPTIONS GIVEN, food preservatives is correct.',
    true
  );

  raise notice 'Inserted 40 MCQ questions for Chemistry NSSCO 2023 Paper 1';
end $$;
