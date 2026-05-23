-- ===========================================================================
-- NSSCO Chemistry 2023 Paper 2 (6117/2) — 8 questions, 54 sub-parts, 80 marks
-- Verbatim NIED wording. Mark scheme + commentary from
-- DNEA Examiners Report 2023 (Chemistry section, pages 95-101).
-- ===========================================================================

do $$
declare
  chem_id uuid;
begin
  select id into chem_id from public.subjects where slug = 'chemistry' limit 1;
  if chem_id is null then raise notice 'Chemistry subject not found'; return; end if;

  -- ─── Q1(a)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '1(a)', 1, 'free',
    'fill_in',
    E'Bromine has two stable isotopes, ⁷⁹₃₅Br and ⁸¹₃₅Br.\n\n**(a)** State what **79** represents in ⁷⁹₃₅Br.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'nucleon number',
        'mass number',
        'number of protons and neutrons',
        'nucleon/mass number',
        'relative atomic mass'
    )
    ),
    false,
    E'Nucleon / mass number / number of protons and neutrons in the nucleus of an atom / relative atomic mass; [1 mark]\n\n**Examiner commentary:** Well answered, although a few gave ''nucleus number'' instead of nucleon number/mass number.',
    E'**Atomic notation: ᴬZX**\n• Top number A = **mass number / nucleon number** = total protons + neutrons (= 79 here)\n• Bottom number Z = **atomic number** = number of protons (= 35 here)\n\nSo ''79'' tells you the bromine atom has 79 particles in its nucleus altogether.',
    true
  );

  -- ─── Q1(b)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '1(b)', 2, 'paid',
    'free_text',
    E'Bromine has two stable isotopes, ⁷⁹₃₅Br and ⁸¹₃₅Br.\n\n**(b)** Define the term *isotope*.',
    null,
    E'Both required (1 mark each):\n1. Atoms of the same element / atoms with the same number of protons (atomic number);\n2. But different nucleon/mass number OR different number of neutrons;\n\n**Examiner commentary:** Poorly answered. Candidates didn''t realise number of protons stays the same while number of neutrons differs. Confusion between atom and element.',
    E'Award 1 mark for ''same protons / same atomic number / same element'' and 1 mark for ''different neutrons / different mass numbers''. PENALISE answers that only give one half OR confuse atom/element.',
    E'**Isotopes = atoms of the SAME ELEMENT with DIFFERENT NUMBERS OF NEUTRONS.**\n\nBoth halves required:\n• SAME — atomic number (number of protons) — so they''re the same element\n• DIFFERENT — mass number (so different number of neutrons)\n\nExample: ⁷⁹Br has 35 p + 44 n; ⁸¹Br has 35 p + 46 n. Same element (bromine, 35 protons), different mass.',
    true
  );

  -- ─── Q1(c)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '1(c)', 2, 'free',
    'fill_in',
    E'Bromine has two stable isotopes, ⁷⁹₃₅Br and ⁸¹₃₅Br.\n\n**(c)** Complete the table for ⁷⁹₃₅Br and ⁸¹₃₅Br:\n\n| isotope | protons | neutrons | electrons |\n|---|---|---|---|\n| ⁷⁹₃₅Br | ? | ? | ? |\n| ⁸¹₃₅Br | ? | ? | ? |\n\nGive the six numbers (top row then bottom row, e.g. ''''35 44 35 35 46 35'''').',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '35 44 35 35 46 35',
        '35, 44, 35, 35, 46, 35'
    )
, 'must_contain', jsonb_build_array('35', '44', '46')
    ),
    false,
    E'⁷⁹Br: 35 protons, 44 neutrons, 35 electrons;\n⁸¹Br: 35 protons, 46 neutrons, 35 electrons;\n[1 mark per correct row, 2 total]\n\n**Examiner commentary:** Well answered for protons; many used the nucleon number for neutrons (instead of A−Z).',
    E'**For neutral atoms:**\n• protons = atomic number = 35 (for both, same element)\n• neutrons = mass number − atomic number\n  - ⁷⁹Br: 79 − 35 = **44 neutrons**\n  - ⁸¹Br: 81 − 35 = **46 neutrons**\n• electrons = protons (for neutral atom) = 35 (for both)\n\nIsotopes differ ONLY in neutron count.',
    true
  );

  -- ─── Q1(d)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '1(d)(i)', 1, 'free',
    'fill_in',
    E'Bromine has two stable isotopes, ⁷⁹₃₅Br and ⁸¹₃₅Br.\n\n**(d)(i)** Describe **one** disadvantage of using radioactive isotopes as a source of energy.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'produces toxic nuclear waste',
        'produces radioactive waste',
        'non-renewable',
        'causes mutations',
        'causes cancer',
        'expensive',
        'risk of nuclear accident'
    )
    ),
    false,
    E'Any one of: produces toxic/radioactive waste; non-renewable; causes mutations or cancer; [1 mark]\n\n**Examiner commentary:** Poorly answered.',
    E'Drawbacks of nuclear (radioactive) energy:\n• **Radioactive waste** — stays dangerous for thousands of years, hard to dispose safely\n• Can cause **mutations / cancer** in living things (if leaks occur)\n• **Non-renewable** — uranium ore is finite\n• Risk of nuclear accidents (e.g. Chernobyl, Fukushima)\n\nAny one disadvantage scores the mark.',
    true
  );

  -- ─── Q1(d)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '1(d)(ii)', 1, 'free',
    'fill_in',
    E'Bromine has two stable isotopes, ⁷⁹₃₅Br and ⁸¹₃₅Br.\n\n**(d)(ii)** Give **one** use of **carbon-14**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'carbon dating',
        'radiocarbon dating',
        'dating fossils',
        'dating',
        'carbon-14 dating'
    )
, 'must_contain', jsonb_build_array('dating')
    ),
    false,
    E'(Carbon) dating; [1 mark]\n\n**Examiner commentary:** Well answered. Some used wrong terms like ''time'' instead of ''age of fossils''.',
    E'**Carbon-14 dating (radiocarbon dating)** uses the fixed decay rate of ¹⁴C to estimate the **age of once-living things** — fossils, ancient wood, mummies, etc.\n\nHalf-life of ¹⁴C ≈ 5,730 years → useful for dating up to ~50,000-year-old samples.',
    true
  );

  -- ─── Q2(a)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(a)', 1, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\n**(a)** Give the element that has the **largest atomic radius** in Period 3.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'sodium',
        'Na'
    )
    ),
    false,
    E'Sodium / Na (correct spelling); [1 mark]\n\n**Examiner commentary:** Poorly answered. Many gave argon instead of sodium. Atomic radius trends across a period need attention.',
    E'**Across a period, atomic radius DECREASES** (more protons pull electrons in tighter, but same shell).\n\nSo in Period 3: Na > Mg > Al > Si > P > S > Cl > Ar.\n\n**Sodium (Na) is on the LEFT, has the FEWEST protons → biggest radius.**\n\nDown a Group, radius INCREASES (more shells).',
    true
  );

  -- ─── Q2(b)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(b)(i)', 1, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\n**(b)(i)** Describe **one physical property** of sodium.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'soft',
        'shiny',
        'low melting point',
        'low density',
        'good conductor of electricity',
        'good conductor of heat',
        'silvery'
    )
    ),
    false,
    E'Any one: soft / shiny / low melting point / low density / good conductor of heat or electricity; [1 mark]\n\n**Examiner commentary:** Fairly well answered. Some gave general metal properties (e.g. ductile) without considering sodium specifically.',
    E'Sodium''s unique properties (it''s a Group I alkali metal):\n• **Soft** — can be cut with a knife (unusual for a metal)\n• **Shiny** — when freshly cut (tarnishes quickly in air)\n• **Low density** — floats on water\n• **Low melting point** (~98 °C) for a metal\n• Good conductor of electricity & heat\n\nAny ONE counts. Don''t say ''malleable'' or ''ductile'' for sodium — too general.',
    true
  );

  -- ─── Q2(b)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(b)(ii)', 1, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\n**(b)(ii)** Write down the electronic configuration of the **sodium ION (Na⁺)**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '2,8',
        '2.8',
        '2 8',
        '2,8 (Na+)'
    )
, 'must_contain', jsonb_build_array('2', '8')
    ),
    false,
    E'2,8; [1 mark]\n\n**Examiner commentary:** Poorly answered. Most gave the configuration of the sodium ATOM (2,8,1) instead of the ION (Na⁺ has lost one electron).',
    E'**Na ATOM** has 11 electrons: 2,8,1\n**Na⁺ ION** has lost 1 electron → 10 electrons: **2,8** ✓\n\nNa⁺ has the same electron configuration as neon (a stable noble gas). That''s WHY sodium loses an electron — to become like a noble gas.',
    true
  );

  -- ─── Q2(b)(iii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(b)(iii)', 1, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\n**(b)(iii)** Give **one observation** when sodium reacts with **cold water**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'fizzing',
        'bubbles',
        'effervescence',
        'floats',
        'moves around',
        'melts',
        'vigorously',
        'violent',
        'smoke'
    )
    ),
    false,
    E'Any one: fizzing / bubbles / effervescence / floats / dissolves / melts into a ball / vigorous / violent; [1 mark]\n\n**Examiner commentary:** Fairly answered.',
    E'Sodium + water reaction (2Na + 2H₂O → 2NaOH + H₂):\n• **Floats** on the water (sodium is less dense than water)\n• **Fizzes / bubbles** as hydrogen gas is released\n• **Melts into a ball** from the heat of the reaction\n• Moves rapidly around the surface\n• May ignite (yellow flame) if water hot or sodium pure\n\nAny ONE observation counts. NaOH dissolved makes the water alkaline (turns indicator blue).',
    true
  );

  -- ─── Q2(b)(iv)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(b)(iv)', 1, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\n**(b)(iv)** State the **flame colour** of sodium.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'yellow',
        'bright yellow',
        'orange',
        'yellow/orange'
    )
    ),
    false,
    E'(Bright) yellow / orange; [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'**Flame test colours to memorise:**\n• **Sodium → bright yellow** ✓ (also called golden yellow)\n• Lithium → red / crimson\n• Potassium → lilac / purple\n• Calcium → orange-red / brick red\n• Copper → blue-green\n\nFlame tests identify metal cations — atoms absorb energy and re-emit light at characteristic wavelengths.',
    true
  );

  -- ─── Q2(c)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(c)(i)', 1, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\n**(c)(i)** Define a *base* in terms of proton transfer.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'proton acceptor',
        'hydrogen ion acceptor',
        'a proton acceptor',
        'accepts protons'
    )
, 'must_contain', jsonb_build_array('proton', 'accept')
    ),
    false,
    E'Proton acceptor / hydrogen-ion acceptor; [1 mark]\n\n**Examiner commentary:** Well answered. Many misspelt ''acceptor''.',
    E'**Brønsted-Lowry definitions:**\n• **Acid = proton DONOR** (gives away H⁺)\n• **Base = proton ACCEPTOR** (takes H⁺) ✓\n\nA proton is just an H⁺ ion (hydrogen ion).\n\nExample: NH₃ (base) + HCl (acid) → NH₄⁺ + Cl⁻. NH₃ accepts a proton from HCl.\n\nSpell **acceptor** carefully — the ''t'' is essential.',
    true
  );

  -- ─── Q2(c)(ii)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(c)(ii)', 2, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\nMagnesium reacts slowly with warm water to form magnesium hydroxide (a base).\n\n**(c)(ii)** Suggest the **pH** of magnesium hydroxide and give the **colour of universal indicator** (e.g. ''''pH 9 blue'''').',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'pH 9 blue',
        'pH 9 purple',
        '9 blue',
        '9 purple',
        'pH 8 blue',
        'pH 10 blue',
        'pH 11 blue',
        '8-11 blue'
    )
, 'must_contain', jsonb_build_array('blue')
    ),
    false,
    E'pH ≈ 9 (accept 8–11); universal indicator colour BLUE (accept purple); [2 marks]\n\n**Examiner commentary:** Poorly answered. Few learners could give the pH or the universal indicator colour.',
    E'**Universal indicator colour chart:**\n• pH 1–3 (strong acid) → RED\n• pH 4–6 (weak acid) → ORANGE / YELLOW\n• pH 7 (neutral) → GREEN\n• pH 8–11 (weak alkali) → **BLUE** ✓\n• pH 12–14 (strong alkali) → PURPLE / VIOLET\n\nMg(OH)₂ is only **slightly soluble** → mildly alkaline → pH ~9 → BLUE.\n(Strong alkalis like NaOH are pH 13–14 → purple.)',
    true
  );

  -- ─── Q2(c)(iii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(c)(iii)', 1, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\nMagnesium hydroxide can be used to treat indigestion by reacting with stomach acid.\n\n**(c)(iii)** State the **type of reaction** that occurs.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'neutralisation',
        'neutralization',
        'neutralisation reaction'
    )
, 'must_contain', jsonb_build_array('neutralis')
    ),
    false,
    E'Neutralisation; [1 mark — spelling matters]\n\n**Examiner commentary:** Fairly well answered. Most could not spell ''neutralisation'' correctly.',
    E'**Acid + base → salt + water = neutralisation.**\n\nStomach acid (HCl) is too strong → causes indigestion. Antacid tablets contain bases like Mg(OH)₂ or CaCO₃ that **neutralise** the excess acid:\n\nMg(OH)₂ + 2HCl → MgCl₂ + 2H₂O\n\nSpell **neutralisation** (UK) or **neutralization** (US) — both accepted.',
    true
  );

  -- ─── Q2(d)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(d)', 1, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\n**(d)** Aluminium combines with oxygen to form aluminium oxide.\n\nName the **type of oxide** aluminium oxide forms.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'amphoteric',
        'amphoteric oxide'
    )
, 'must_contain', jsonb_build_array('amphoteric')
    ),
    false,
    E'Amphoteric (oxide); [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'Oxide types:\n• **Basic oxide** — metal oxide (Na₂O, MgO) → reacts with acids\n• **Acidic oxide** — non-metal oxide (CO₂, SO₂) → reacts with bases\n• **Amphoteric oxide** — reacts with BOTH acids AND bases (Al₂O₃, ZnO, PbO) ✓\n• Neutral oxide — neither (CO, NO, H₂O)\n\nAl₂O₃ sits on the metal/non-metal borderline → has both characters.',
    true
  );

  -- ─── Q2(e)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(e)(i)', 1, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\nSilicon dioxide has a giant structure.\n\n**(e)(i)** Name the **type of bonding** in silicon dioxide.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'covalent',
        'covalent bonding',
        'giant covalent'
    )
, 'must_contain', jsonb_build_array('covalent')
    ),
    false,
    E'Covalent (bonding) — correct spelling required; [1 mark]\n\n**Examiner commentary:** Fair.',
    E'Silicon dioxide (SiO₂, quartz/sand) has a **giant COVALENT** structure.\n\nEach Si atom shares electrons with 4 O atoms (and vice versa) → 3D network of strong covalent bonds. Very different from ionic (no Si⁴⁺ or O²⁻ ions here).',
    true
  );

  -- ─── Q2(e)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(e)(ii)', 1, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\nSilicon dioxide has a giant structure.\n\n**(e)(ii)** Give **one** physical property of silicon dioxide.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'high melting point',
        'high boiling point',
        'hard',
        'poor conductor',
        'does not conduct electricity',
        'insoluble in water'
    )
    ),
    false,
    E'Any one: high melting point / high boiling point / hard / poor conductor of electricity; [1 mark]\n\n**Examiner commentary:** Fair.',
    E'Giant covalent structures like SiO₂ all share these properties:\n• **High melting/boiling point** — need to break MANY strong covalent bonds\n• **Hard** — rigid 3D network\n• **Insoluble** in water\n• **Does NOT conduct electricity** (no free ions or electrons; only covalent bonds)\n\nThink quartz — hard, doesn''t melt easily, doesn''t conduct.',
    true
  );

  -- ─── Q2(f)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(f)', 1, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\nPhosphate, PO₄³⁻, is an oxyanion.\n\n**(f)** Deduce the **formula of calcium phosphate**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'Ca3(PO4)2',
        'Ca₃(PO₄)₂',
        'Ca3(PO4)₂'
    )
, 'must_contain', jsonb_build_array('Ca', 'PO4')
    ),
    false,
    E'Ca₃(PO₄)₂; [1 mark — must have brackets around PO₄ and the subscript 2]\n\n**Examiner commentary:** Poorly answered. Some wrote calcium last in the formula.',
    E'**Charge balance trick (swap and drop):**\n• Ca²⁺ → take the 2, drop as PO₄ subscript\n• PO₄³⁻ → take the 3, drop as Ca subscript\n\n→ **Ca₃(PO₄)₂**\n\nBrackets around (PO₄) because the subscript 2 must apply to the WHOLE phosphate group, not just one O.\n\nCheck charges: 3 × (+2) = +6; 2 × (−3) = −6 ✓ balanced.',
    true
  );

  -- ─── Q2(g)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(g)', 2, 'paid',
    'free_text',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\nSulfur combines with carbon to give carbon disulfide, CS₂.\n\n**(g)** Describe the **dot-and-cross diagram** of the carbon disulfide molecule (CS₂). Show outer electrons only. Specify the bonds between C and each S.',
    null,
    E'Both required (1 mark each):\n1. Two double bonds (one C=S on each side), with carbon in the middle;\n2. Rest of the structure correct — carbon has 4 outer electrons (all bonded), each sulfur has 6 outer electrons (4 bonded + 2 lone pair shown);\n\nNote: circles for shells are optional.\n\n**Examiner commentary:** Poorly answered. Candidates didn''t write the structural formula first before drawing.',
    E'Award 1 mark for correct C=S double bonding on BOTH sides; 1 mark for correct outer-shell electron count on all 3 atoms (C: 4 bonded; S: 4 bonded + 2 lone pairs). PENALISE single bonds; missing lone pairs on S.',
    E'Carbon disulfide structure (like CO₂):\n\n**S = C = S**\n\nDot-and-cross diagram:\n• Carbon (4 outer electrons) makes TWO **double bonds** — uses all 4 electrons\n• Each sulfur (6 outer electrons) makes ONE double bond (4 shared electrons) and keeps 2 **lone pairs** (4 non-bonding electrons)\n\nDraw: S=C=S linear, with dots (or crosses) showing each shared pair (4 electrons per double bond) and two lone pairs on each S.\n\nStart by writing the structural formula → that tells you the bonding.',
    true
  );

  -- ─── Q2(h)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(h)(i)', 1, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\nChlorine is added to water to make it safe to drink.\n\n**(h)(i)** Explain **why** adding chlorine makes water safe to drink.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'kills bacteria',
        'kills microorganisms',
        'kills germs',
        'kills pathogens',
        'chlorine kills bacteria',
        'kills micro-organisms'
    )
, 'must_contain', jsonb_build_array('kills')
    ),
    false,
    E'Chlorine KILLS micro-organisms / bacteria; [1 mark — use ''kills'', not ''removes'']\n\n**Examiner commentary:** Well answered. Use ''kills'' (not ''removes'') the bacteria.',
    E'**Chlorination = disinfection of water supplies.**\n\nChlorine (Cl₂) or chloramine added to drinking water at ~1 ppm:\n• Reacts with water → HOCl (hypochlorous acid)\n• HOCl kills bacteria, viruses, microorganisms\n• Result: water safe from cholera, typhoid, etc.\n\nUse the word **KILLS** — examiners reject ''removes'' (chlorine doesn''t filter them out, it destroys them).',
    true
  );

  -- ─── Q2(h)(ii)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(h)(ii)', 2, 'free',
    'fill_in',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\n**(h)(ii)** Describe a **chemical test** for chlorine (state TEST + RESULT).',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'damp litmus paper bleaches',
        'moist litmus paper bleached',
        'damp blue litmus paper turns red then bleaches',
        'damp litmus paper turns white'
    )
, 'must_contain', jsonb_build_array('litmus', 'bleach')
    ),
    false,
    E'Test: damp (moist) litmus paper; [1]\nResult: bleaches / turns white; [1 — result depends on correct test]\n\n**Examiner commentary:** Fair. Most recalled the test but failed to state the litmus paper must be DAMP. Common misspelling: ''dump'' instead of ''damp''.',
    E'**Test for chlorine gas:**\n1. Hold **DAMP (moist) litmus paper** at the mouth of the test tube\n2. **Bleaches** (turns WHITE) — this is positive for Cl₂\n\n**Key:** the paper must be DAMP — dry litmus doesn''t react with chlorine. Water lets the chlorine dissolve and form the bleaching agent HOCl.\n\nDifferent from chlorine ions (Cl⁻) test, which uses silver nitrate.',
    true
  );

  -- ─── Q2(h)(iii)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '2(h)(iii)', 2, 'paid',
    'free_text',
    E'Period 3 contains the elements sodium to argon.\n\nNa  Mg  Al  Si  P  S  Cl  Ar\n\nArgon is a noble gas.\n\n**(h)(iii)** State and explain **one use** of argon.',
    null,
    E'Use: filling lamps / light bulbs (or filling double-glazing, welding shield gas); [1]\nExplanation: argon is unreactive / inert (because outer shell is full); [1]\n\n**Examiner commentary:** Fair. Most recalled the use but failed to give the explanation.',
    E'Award 1 mark for naming a USE (lamps / welding / double-glazing / preserving documents). Award 1 mark for explanation: inert/unreactive due to full outer shell. PENALISE answers with only the use but no explanation.',
    E'**Argon (Ar, Group 0/noble gas)** uses + reason:\n\n**Use:** filling **light bulbs / lamps** (or welding shield gas, or double-glazed windows)\n\n**Explanation:** Argon is **unreactive (inert)** — it has a full outer electron shell (8 electrons) so it doesn''t form bonds. In a light bulb, this stops the hot tungsten filament reacting with oxygen and burning out.\n\nAlways pair USE + REASON — half the marks come from the explanation.',
    true
  );

  -- ─── Q3(a)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '3(a)', 2, 'paid',
    'free_text',
    E'Fig. 3.1 shows the electrolysis of molten lead(II) bromide.\n\n**(a)** Describe what is meant by the term **electrolysis**.',
    '/past-papers/chemistry-nssco-2023-p2/electrolysis-pbbr2.png',
    E'Both required (1 mark each):\n1. Decomposition of an ionic compound / electrolyte / molten substance;\n2. Using an electric current;\n\n**Examiner commentary:** Poorly answered. Many couldn''t differentiate electrolyte from electrodes. Majority couldn''t describe the meaning of electrolysis.',
    E'Award 1 mark for ''decomposition / breaking down'' of an ionic/molten substance, and 1 mark for ''electric current''. PENALISE answers about conduction WITHOUT mentioning decomposition.',
    E'**Electrolysis = breaking down an ionic compound by passing an electric current through it.**\n\nMust have BOTH:\n• What — **decomposition** (breakdown) of an ionic compound (molten or in solution)\n• How — using an **electric current**\n\nResult: positive ions are reduced at the cathode; negative ions are oxidised at the anode. The compound is split into its elements.',
    true
  );

  -- ─── Q3(b)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '3(b)', 1, 'free',
    'fill_in',
    E'Fig. 3.1 shows the electrolysis of molten lead(II) bromide.\n\n**(b)** State the name given to the **negative electrode**.',
    '/past-papers/chemistry-nssco-2023-p2/electrolysis-pbbr2.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'cathode',
        'the cathode'
    )
, 'must_contain', jsonb_build_array('cathode')
    ),
    false,
    E'Cathode; [1 mark — spelling]\n\n**Examiner commentary:** Moderate. Spelling was the main challenge.',
    E'**Two electrodes — memory hooks:**\n• **Cathode = NEGATIVE** electrode (cations come here; reduction) — ''cat-ions go to cathode''\n• **Anode = POSITIVE** electrode (anions come here; oxidation) — ''an-ions go to anode''\n\nSpell carefully: c-a-t-h-o-d-e.',
    true
  );

  -- ─── Q3(c)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '3(c)', 2, 'paid',
    'free_text',
    E'Fig. 3.1 shows the electrolysis of molten lead(II) bromide.\n\n**(c)** Give **two observations** when the circuit is closed.',
    '/past-papers/chemistry-nssco-2023-p2/electrolysis-pbbr2.png',
    E'Any 2 of (1 mark each):\n1. Bulb lights up;\n2. Red-brown vapour at the positive electrode (bromine);\n3. Grey solid (lead) collects at the bottom / at the negative electrode;\n\n**Examiner commentary:** Poorly answered. Candidates gave product names instead of OBSERVATIONS. Only a few mentioned the bulb lighting.',
    E'Award 1 mark each for two distinct observations. The bulb lighting demonstrates electrical conductivity; the red-brown vapour shows Br₂ at the anode; the grey lead at the cathode. PENALISE answers that only name PRODUCTS without describing the OBSERVATION.',
    E'**Observations = what you SEE / sense, not the products by name.**\n\n• **Bulb lights up** — current flows, electrolyte conducts\n• At positive electrode (anode): **red-brown VAPOUR** appears (this is bromine vapour, Br₂)\n• At negative electrode (cathode): **grey/silvery solid** forms (this is molten lead, Pb)\n\nSay ''red-brown vapour'' — not just ''bromine''. Say ''grey solid'' — not just ''lead''. The observation describes the appearance.',
    true
  );

  -- ─── Q3(d)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '3(d)', 2, 'free',
    'fill_in',
    E'Fig. 3.1 shows the electrolysis of molten lead(II) bromide.\n\n**(d)** Name the **product at the positive electrode** and give its half-ionic equation.\n\nFormat: ''''product, equation''''',
    '/past-papers/chemistry-nssco-2023-p2/electrolysis-pbbr2.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'bromine, 2Br- -> Br2 + 2e-',
        'bromine Br2 2Br- -> Br2 + 2e-',
        'Br2 2Br- → Br2 + 2e-'
    )
, 'must_contain', jsonb_build_array('Br')
    ),
    false,
    E'Product: bromine / Br₂; [1]\nHalf-equation: 2Br⁻ → Br₂ + 2e⁻; [1]\n\n**Examiner commentary:** Moderate. Some gave ''bromide'' instead of bromine. Many left the half-equation blank.',
    E'**At the positive electrode (anode) — oxidation:**\n• Negative ions (Br⁻) are attracted\n• They LOSE electrons → form neutral atoms → pair up as Br₂ gas\n\n**Half-equation:** **2Br⁻ → Br₂ + 2e⁻**\n\n⚠ Product is **BROMINE** (Br₂, the element) — NOT ''bromide'' (Br⁻, the ion before reaction).',
    true
  );

  -- ─── Q4(a)(i)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '4(a)(i)', 2, 'free',
    'fill_in',
    E'When calcium carbonate is added to dilute hydrochloric acid, carbon dioxide gas is formed. A learner added a small mass of powdered calcium carbonate to an excess of 0.1 mol/dm³ hydrochloric acid. Fig. 4.1 shows the graph of the results.\n\n**(a)(i)** Name the **two pieces of apparatus** needed to take the measurements shown on the graph (volume of gas vs time).',
    '/past-papers/chemistry-nssco-2023-p2/caco3-graph.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'gas syringe and stopwatch',
        'measuring cylinder and stopwatch',
        'syringe stopwatch',
        'gas syringe, stopwatch'
    )
, 'must_contain', jsonb_build_array('watch')
    ),
    false,
    E'Any TWO of (1 mark each): (gas) syringe / measuring cylinder; (stop)watch; [2 marks]\n\n**Examiner commentary:** Well answered. Many couldn''t spell the apparatus names correctly.',
    E'To measure GAS VOLUME over TIME, you need:\n• **Gas syringe** OR **inverted measuring cylinder** (over water) — measures gas volume\n• **Stopwatch** — measures time\n\nThe graph shows volume (y) vs time (x), so you need apparatus to measure BOTH variables.',
    true
  );

  -- ─── Q4(a)(ii)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '4(a)(ii)', 3, 'paid',
    'free_text',
    E'When calcium carbonate is added to dilute hydrochloric acid, carbon dioxide gas is formed. A learner added a small mass of powdered calcium carbonate to an excess of 0.1 mol/dm³ hydrochloric acid. Fig. 4.1 shows the graph of the results.\n\n**(a)(ii)** The total volume of gas collected was **180 cm³** at room temperature and pressure.\n\nCalculate the **mass, in grams, of calcium carbonate** used.\n\nCaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂\n\n(1 mol of gas = 24 000 cm³ at r.t.p.; Mr CaCO₃ = 100)',
    '/past-papers/chemistry-nssco-2023-p2/caco3-graph.png',
    E'All 3 marks:\n1. moles of CO₂ = 180 / 24 000 = 0.0075 mol;\n2. Use mole ratio 1:1 (CaCO₃ : CO₂) → moles of CaCO₃ = 0.0075 mol;\n3. mass = n × Mr = 0.0075 × 100 = **0.75 g**;\n\n**Examiner commentary:** Moderate. Many could only score the formula mark. Some failed to get the number of moles or to convert cm³ to dm³.',
    E'Award 1 mark each: (1) moles of gas = 0.0075; (2) recognise 1:1 ratio CaCO₃:CO₂; (3) mass = 0.75 g. Show full working — examiners reward partial answers.',
    E'**Three steps:**\n\n1. **Moles of gas** (at r.t.p., 1 mol = 24 000 cm³):\n   n(CO₂) = 180 / 24 000 = **0.0075 mol**\n\n2. **Mole ratio** from equation: CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂\n   1 mol CaCO₃ → 1 mol CO₂\n   So n(CaCO₃) = **0.0075 mol**\n\n3. **Mass** = moles × Mr:\n   m(CaCO₃) = 0.0075 × 100 = **0.75 g** ✓',
    true
  );

  -- ─── Q4(b)(i)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '4(b)(i)', 2, 'paid',
    'free_text',
    E'When calcium carbonate is added to dilute hydrochloric acid, carbon dioxide gas is formed. A learner added a small mass of powdered calcium carbonate to an excess of 0.1 mol/dm³ hydrochloric acid. Fig. 4.1 shows the graph of the results.\n\n**(b)(i)** Describe the graph you would draw if the **same mass** of calcium carbonate is added as **large lumps** instead of powder (all other conditions the same). Compare start, slope, and final level vs the original.',
    '/past-papers/chemistry-nssco-2023-p2/caco3-graph.png',
    E'Both required (1 mark each):\n1. Line starts at the origin (0,0);\n2. Has a LOWER gradient (less steep) than the original curve, BUT levels off at the SAME volume as the original;\n\n**Examiner commentary:** Poorly answered. Many got the starting point but couldn''t show the LESS STEEP gradient. Some failed to level the graph at the same final volume.',
    E'Award 1 mark for correct starting point AND finishing level (same total gas — same mass of CaCO₃ used). Award 1 mark for correct gradient (less steep / shallower than powder). PENALISE answers showing a different final volume — total gas is the same since same mass.',
    E'Compared to powder, large LUMPS give:\n• **Same start** (0,0) — no gas at t=0\n• **Less steep** gradient — slower reaction (less surface area = fewer collisions)\n• **Same final volume** — same mass of CaCO₃ → same final amount of CO₂\n\nDraw a curve that starts together, rises more SLOWLY, but flattens at the SAME plateau as the powder graph.',
    true
  );

  -- ─── Q4(b)(ii)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '4(b)(ii)', 2, 'paid',
    'free_text',
    E'When calcium carbonate is added to dilute hydrochloric acid, carbon dioxide gas is formed. A learner added a small mass of powdered calcium carbonate to an excess of 0.1 mol/dm³ hydrochloric acid. Fig. 4.1 shows the graph of the results.\n\n**(b)(ii)** Explain why your graph in (b)(i) is **different** from the original graph (Fig. 4.1).',
    '/past-papers/chemistry-nssco-2023-p2/caco3-graph.png',
    E'Both required (1 mark each):\n1. Lumps have a LOWER (smaller) surface area than powder;\n2. So the reaction is SLOWER than the original (fewer collisions per second between acid and solid);\n\n**Examiner commentary:** Fair. Many failed to clearly COMPARE how surface area affects rate. Some failed to use comparative words.',
    E'Award 1 mark for naming SURFACE AREA difference, and 1 mark for COMPARATIVE rate explanation (slower / lower rate / fewer collisions). PENALISE answers that don''t use comparative words (''more'', ''less'', ''slower'').',
    E'**Powder has a MUCH LARGER surface area than lumps** (same mass, but tiny pieces expose more atoms to the acid).\n\n• More surface area → more contact between acid + carbonate → more successful collisions per second → faster reaction\n• Lumps → less surface → fewer collisions → slower reaction\n\nUse **comparative words**: ''lumps have LOWER surface area than powder, so reaction is SLOWER than the original''.',
    true
  );

  -- ─── Q4(c)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '4(c)', 1, 'free',
    'fill_in',
    E'When calcium carbonate is added to dilute hydrochloric acid, carbon dioxide gas is formed. A learner added a small mass of powdered calcium carbonate to an excess of 0.1 mol/dm³ hydrochloric acid. Fig. 4.1 shows the graph of the results.\n\n**(c)** State **one other factor** that affects the rate of a reaction.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'concentration',
        'catalyst',
        'temperature',
        'pressure',
        'light',
        'use of catalyst'
    )
    ),
    false,
    E'Any one: concentration / catalyst / temperature / pressure / light; [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'**Five factors affecting reaction rate:**\n• **Temperature** — higher temp → more KE → more successful collisions\n• **Concentration** (or pressure for gases) — more particles per volume → more collisions\n• **Surface area** — already used in this Q\n• **Catalyst** — lowers activation energy\n• **Light** (for photochemical reactions, e.g. photosynthesis)\n\nName ANY ONE.',
    true
  );

  -- ─── Q5(a)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '5(a)', 1, 'free',
    'fill_in',
    E'A good example of an endothermic reaction is dissolving a salt.\n\n**(a)** Explain the meaning of the phrase *endothermic reaction*.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'absorbs energy from the surroundings',
        'takes in energy',
        'absorbs heat',
        'takes in heat from surroundings',
        'reaction that absorbs energy'
    )
, 'must_contain', jsonb_build_array('absorb', 'energy')
    ),
    false,
    E'(Chemical) reaction that ABSORBS energy from the surroundings; [1 mark]\n\n**Examiner commentary:** Poorly answered. Candidates confused endothermic and exothermic. Wrong terms like ''given in'' instead of ''taken in''.',
    E'**Two opposite definitions to memorise:**\n• **ENDOthermic** — **ENter**s the system; energy ABSORBED from surroundings → surroundings get COLDER (e.g. cold packs, dissolving NH₄NO₃, photosynthesis)\n• **EXOthermic** — energy EXits the system; energy RELEASED to surroundings → surroundings get HOTTER (e.g. combustion, neutralisation, respiration)\n\nKey words: ENDO = takes IN / absorbs; EXO = gives OUT / releases.',
    true
  );

  -- ─── Q5(b)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '5(b)', 3, 'paid',
    'free_text',
    E'A good example of an endothermic reaction is dissolving a salt.\n\n**2HI(g) ⇌ H₂(g) + I₂(g)**\n\nBond energies: H–H = 436 kJ/mol; I–I = 151 kJ/mol; H–I = 299 kJ/mol\n\n**(b)** Use the bond energy data to calculate the overall **energy change (∆H)** for the reaction shown.',
    null,
    E'All 3 marks:\n1. Formula: ΔH = (energy absorbed when bonds BREAK) − (energy released when bonds FORM);\n2. Bonds broken: 2 × H–I = 2 × 299 = 598 kJ;\n   Bonds formed: 1 × H–H + 1 × I–I = 436 + 151 = 587 kJ;\n3. ΔH = 598 − 587 = **+11 kJ/mol** (positive → endothermic);\n\n**Examiner commentary:** Very poorly answered. Most couldn''t give the formula. Those who calculated couldn''t give the (+) sign for endothermic.',
    E'Award 1 mark for correct formula structure; 1 mark for correctly identifying bonds broken (2× H–I = 598) AND bonds formed (H–H + I–I = 587); 1 mark for ΔH = +11 with positive sign. PENALISE missing sign on endothermic answer.',
    E'**Three-step bond-energy calculation:**\n\n1. **Formula:** ΔH = Σ(bonds broken) − Σ(bonds formed)\n\n2. **Bonds in reactants (broken):**\n   • 2HI → break 2 H–I bonds = 2 × 299 = **598 kJ** absorbed\n\n3. **Bonds in products (formed):**\n   • H₂ has 1 H–H = 436 kJ\n   • I₂ has 1 I–I = 151 kJ\n   • Total = **587 kJ** released\n\nΔH = 598 − 587 = **+11 kJ/mol**\n\n**Positive ΔH → ENDOTHERMIC** (matches the question''s phrasing).',
    true
  );

  -- ─── Q5(c)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '5(c)(i)', 1, 'free',
    'fill_in',
    E'A good example of an endothermic reaction is dissolving a salt.\n\n2SO₂(g) + O₂(g) ⇌ 2SO₃(g)    ΔH = −197 kJ/mol\n\n**(c)(i)** Explain what is meant by a **dynamic equilibrium**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'rate of forward reaction equals rate of backward reaction',
        'forward and reverse rates are equal',
        'rate of forward = rate of reverse'
    )
, 'must_contain', jsonb_build_array('rate', 'forward')
    ),
    false,
    E'Rate of the forward reaction = rate of the backward (reverse) reaction; [1 mark]\n\n**Examiner commentary:** Poorly answered. More emphasis needed on chemistry definitions in the syllabus.',
    E'**Dynamic equilibrium** (in a closed reversible reaction):\n• Both forward AND backward reactions are still HAPPENING\n• But their RATES are EQUAL\n• → concentrations of reactants and products stay CONSTANT (but not zero!)\n\nKey word: **dynamic** = still moving (not static). Particles are still reacting both ways, just at equal rates.',
    true
  );

  -- ─── Q5(c)(ii)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '5(c)(ii)', 3, 'paid',
    'free_text',
    E'A good example of an endothermic reaction is dissolving a salt.\n\n2SO₂(g) + O₂(g) ⇌ 2SO₃(g)    ΔH = −197 kJ/mol\n\n**(c)(ii)** Describe the **energy diagram** (reaction profile) for this **exothermic** reaction. Show the positions of: reactants, products, activation energy (Ea), and enthalpy change (ΔH).',
    null,
    E'All 3 marks:\n1. Reactants drawn ABOVE and to the LEFT of products (since exothermic, products lower);\n2. ΔH arrow points DOWNWARDS from reactants level to products level (with arrow in correct direction for exothermic);\n3. Activation energy (Ea) arrow points from reactant level to TOP of the energy peak (transition state);\n\n**Examiner commentary:** Very poorly answered. Some drew the diagram for the previous reaction (endothermic). Some failed to label both ΔH and Ea.',
    E'Award 1 mark each: (1) reactants level higher than products (exothermic); (2) ΔH arrow correctly drawn between reactant + product levels, pointing down; (3) Ea arrow drawn from reactant level to top of activation peak. PENALISE drawing endothermic profile (reactants below products).',
    E'**Exothermic profile (ΔH = −197 kJ/mol means products are LOWER):**\n\n```\nenergy ↑\n       /\\\n      /  \\         ← transition state (top of peak)\n     /    \\        ←\n2SO₂+O₂   2SO₃     ← reactants left, products right (lower)\n  |Ea↑  |ΔH↓\n```\n\nThree labels needed:\n• **Reactants** (2SO₂ + O₂) at upper left\n• **Products** (2SO₃) at lower right\n• **Ea** = arrow from reactants UP to the peak\n• **ΔH** = arrow from reactants level DOWN to products level (negative for exothermic)',
    true
  );

  -- ─── Q5(c)(iii)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '5(c)(iii)', 2, 'paid',
    'free_text',
    E'A good example of an endothermic reaction is dissolving a salt.\n\n2SO₂(g) + O₂(g) ⇌ 2SO₃(g)    ΔH = −197 kJ/mol\n\n**(c)(iii)** State the effects on the equilibrium of:\n\n• an **increase in temperature**\n• an **increase in pressure**',
    null,
    E'Both required (1 mark each):\n1. Increase temperature → equilibrium shifts to the LEFT / backward / endothermic side / more reactants;\n2. Increase pressure → equilibrium shifts to the RIGHT / forward / more products / side with FEWER moles of gas (2 mol < 3 mol);\n\n**Examiner commentary:** Moderate. Most knew the effects but failed to EXPLAIN them.',
    E'Award 1 mark each. Le Chatelier''s principle reasoning required. PENALISE statements without direction (left/right) or without justification.',
    E'**Le Chatelier''s principle**: equilibrium shifts to OPPOSE any change.\n\n**Increase temperature** (this reaction is exothermic, releases heat):\n• System tries to cool down → favours the **endothermic direction**\n• For exothermic forward reaction → endothermic backward → shifts **LEFT** (more reactants)\n\n**Increase pressure** (count moles of gas):\n• LHS: 2 SO₂ + 1 O₂ = **3 mol of gas**\n• RHS: 2 SO₃ = **2 mol of gas**\n• Increased pressure → system favours side with FEWER moles → shifts **RIGHT** (more SO₃)',
    true
  );

  -- ─── Q6(a)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '6(a)(i)', 1, 'free',
    'fill_in',
    E'Fig. 6.1 shows an experiment where zinc metal is immersed in a solution of copper(II) sulfate.\n\n**(a)(i)** Give **one observation** when zinc reacts with copper(II) sulfate.',
    '/past-papers/chemistry-nssco-2023-p2/zinc-copper-sulfate.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'blue colour fades',
        'blue colour turns colourless',
        'brown copper deposit',
        'zinc becomes smaller',
        'blue solution becomes colourless',
        'brown layer forms on zinc'
    )
    ),
    false,
    E'Any one: blue colour fades / turns colourless; deposit/layer of brown copper forms on the zinc; zinc becomes smaller; [1 mark]\n\n**Examiner commentary:** Poorly answered. Many wrongly gave ''bubbles'' as an observation — there is no gas produced in this displacement reaction.',
    E'Displacement reaction: Zn + CuSO₄ → ZnSO₄ + Cu.\n\nObservations (what you SEE):\n• **Blue colour FADES** (Cu²⁺ ions disappearing → colourless Zn²⁺ formed)\n• **Brown copper metal** deposits on the zinc strip\n• Zinc strip gets **smaller** (it''s being used up)\n\n⚠ NO gas produced — don''t say ''bubbles''.',
    true
  );

  -- ─── Q6(a)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '6(a)(ii)', 1, 'free',
    'fill_in',
    E'Fig. 6.1 shows an experiment where zinc metal is immersed in a solution of copper(II) sulfate.\n\n**(a)(ii)** Explain your observation in part (i).',
    '/past-papers/chemistry-nssco-2023-p2/zinc-copper-sulfate.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'zinc is more reactive than copper',
        'zinc more reactive so displaces copper',
        'zinc displaces copper',
        'zinc more reactive than copper, displaces it'
    )
, 'must_contain', jsonb_build_array('reactive')
    ),
    false,
    E'Zinc is MORE REACTIVE than copper so it DISPLACES copper from its compound; [1 mark — both parts needed]\n\n**Examiner commentary:** Poorly answered. Candidates knew zinc is more reactive but didn''t mention DISPLACEMENT.',
    E'Reactivity series (relevant section): K > Ca > Na > Mg > **Zn > Fe > ... > Cu** > Ag > Au.\n\nA more reactive metal **DISPLACES** a less reactive one from its compound.\n\nZn is more reactive than Cu → Zn pushes Cu out of CuSO₄ → forms ZnSO₄ + Cu metal.\n\nState BOTH: ''more reactive'' AND ''displaces''.',
    true
  );

  -- ─── Q6(b)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '6(b)(i)', 1, 'free',
    'fill_in',
    E'Zinc is extracted from its ore.\n\n**(b)(i)** Name the **main ore** of zinc.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'zinc blende',
        'zinc-blende',
        'sphalerite',
        'ZnS'
    )
    ),
    false,
    E'Zinc blende (ZnS); [1 mark]\n\n**Examiner commentary:** Well answered. Some failed to spell ''blende'' correctly.',
    E'**Zinc blende** (also called sphalerite) is the main ore of zinc. Chemical formula = **ZnS** (zinc sulfide).\n\nOther ores by metal:\n• Iron — haematite (Fe₂O₃)\n• Aluminium — bauxite (Al₂O₃)\n• Copper — chalcopyrite (CuFeS₂)\n• Lead — galena (PbS)\n• Zinc — **zinc blende (ZnS)**',
    true
  );

  -- ─── Q6(b)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '6(b)(ii)', 1, 'free',
    'fill_in',
    E'Zinc is extracted from its ore (zinc blende, ZnS). Zinc sulfide is converted to zinc oxide.\n\n**(b)(ii)** Describe how zinc sulfide is **converted to zinc oxide** in an industrial process.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'roast in air',
        'roasted in air',
        'heated in air',
        'roast it in air',
        'roasting in air'
    )
, 'must_contain', jsonb_build_array('air')
    ),
    false,
    E'Roast in air; [1 mark]\n\n**Examiner commentary:** Fair. Many referred to zinc (the metal) not zinc sulfide being converted.',
    E'**ROASTING** = heating a metal sulfide strongly **in air (oxygen)** to convert it to a metal oxide + sulfur dioxide.\n\n2ZnS + 3O₂ → 2ZnO + 2SO₂\n\nThe SO₂ produced is then trapped and used to make sulfuric acid (no waste). After roasting, the zinc oxide is reduced to zinc metal in the next step.',
    true
  );

  -- ─── Q6(b)(iii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '6(b)(iii)', 1, 'free',
    'fill_in',
    E'Zinc oxide is then reduced in a furnace.\n\n**(b)(iii)** Name the substance **added to the furnace to reduce the zinc oxide**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'carbon',
        'coke',
        'carbon (coke)',
        'coke or carbon'
    )
    ),
    false,
    E'Carbon (coke); [1 mark]\n\n**Examiner commentary:** Fair.',
    E'**Carbon (in the form of COKE)** is added to reduce zinc oxide:\n\n2ZnO + C → 2Zn + CO₂\n(or ZnO + CO → Zn + CO₂)\n\nCarbon takes the oxygen away from the zinc → leaves pure zinc metal. This is the same principle as iron extraction in a blast furnace.',
    true
  );

  -- ─── Q6(c)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '6(c)', 1, 'free',
    'fill_in',
    E'Zinc is a useful metal.\n\n**(c)** Give **one use** of zinc metal.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'galvanising',
        'galvanizing',
        'galvanising iron',
        'making brass',
        'in batteries',
        'to make brass',
        'rust prevention'
    )
    ),
    false,
    E'Galvanising (coating iron/steel to prevent rust) / making brass; [1 mark]\n\n**Examiner commentary:** Well answered. Some misspelt ''galvanise''.',
    E'Uses of zinc:\n• **Galvanising** — coating iron/steel with zinc to prevent rust (zinc reacts in place of the iron — sacrificial protection)\n• **Brass-making** — alloy of zinc + copper\n• **Batteries** — zinc-carbon dry cells\n• Roofing sheets, die-casting\n\nSpell **galvanise/galvanize** carefully.',
    true
  );

  -- ─── Q7(a)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '7(a)', 2, 'free',
    'fill_in',
    E'Petroleum is a mixture of hydrocarbons.\n\nTwo of the processes carried out in an oil refinery are fractional distillation of petroleum and cracking of hydrocarbon fractions.\n\n**(a)** Define the term *hydrocarbon* (give the FULL definition).',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'a compound made from carbon and hydrogen only',
        'compound of carbon and hydrogen only',
        'compound made of only carbon and hydrogen',
        'compound containing only carbon and hydrogen'
    )
, 'must_contain', jsonb_build_array('carbon', 'hydrogen', 'only')
    ),
    false,
    E'(Compound) made of CARBON and HYDROGEN ONLY (with no other elements); [2 marks — 1 for ''carbon + hydrogen'', 1 for ''only/no other elements'']\n\n**Examiner commentary:** Fair. Some referred to it as an atom or element instead of a COMPOUND.',
    E'**Hydrocarbon = a COMPOUND of CARBON and HYDROGEN ONLY.**\n\nBoth parts matter:\n• ''Compound'' — not an element, not an atom\n• ''Carbon AND hydrogen'' — both elements\n• ''ONLY'' — no other elements (so methanol CH₃OH is NOT a hydrocarbon, it has O)\n\nExamples: methane (CH₄), ethene (C₂H₄), petrol (C₈H₁₈), polythene.',
    true
  );

  -- ─── Q7(b)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '7(b)(i)', 1, 'free',
    'fill_in',
    E'Petroleum is a mixture of hydrocarbons.\n\nTwo of the processes carried out in an oil refinery are fractional distillation of petroleum and cracking of hydrocarbon fractions.\n\n**(b)(i)** State **one property** of hydrocarbons that is used to separate petroleum into fractions.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'boiling point',
        'differences in boiling points',
        'different boiling points',
        'boiling points'
    )
, 'must_contain', jsonb_build_array('boiling')
    ),
    false,
    E'(Differences in) boiling points; [1 mark]\n\n**Examiner commentary:** Moderate. Most candidates indicated boiling points.',
    E'**Fractional distillation of crude oil** works because different hydrocarbons have **different boiling points**:\n\n• Small molecules (e.g. methane, ethane) → LOW boiling point → vapour rises high in the column\n• Large molecules (e.g. waxes, bitumen) → HIGH boiling point → condense low in the column\n\nThe column has a temperature gradient (hot bottom, cool top) so each fraction condenses at the right level.',
    true
  );

  -- ─── Q7(b)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '7(b)(ii)', 1, 'free',
    'fill_in',
    E'Petroleum is a mixture of hydrocarbons.\n\nTwo of the processes carried out in an oil refinery are fractional distillation of petroleum and cracking of hydrocarbon fractions.\n\nOne of the fractions formed is naphtha.\n\n**(b)(ii)** Give **one use** of naphtha.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'chemicals',
        'making chemicals',
        'feedstock for chemicals',
        'petrochemicals',
        'fuel'
    )
    ),
    false,
    E'Making chemicals / petrochemical feedstock / fuel; [1 mark]\n\n**Examiner commentary:** Moderate.',
    E'**Naphtha** (a light fraction from crude oil) is used to:\n• **Make chemicals** (petrochemical feedstock) — starting material for plastics, detergents, solvents, dyes\n• Make petrol (after further refining)\n• Cracking — turns naphtha into smaller, more useful molecules like ethene + propene\n\nMain use is as a chemical feedstock.',
    true
  );

  -- ─── Q7(c)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '7(c)(i)', 1, 'free',
    'fill_in',
    E'Petroleum is a mixture of hydrocarbons.\n\nTwo of the processes carried out in an oil refinery are fractional distillation of petroleum and cracking of hydrocarbon fractions.\n\nThe hydrocarbon C₁₀H₂₂ can be cracked to make ethene and one other hydrocarbon.\n\n**(c)(i)** Complete the equation:\n\nC₁₀H₂₂ → C₂H₄ + ............... (give the other hydrocarbon)',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'C8H18',
        'C₈H₁₈',
        'C8H18 (octane)',
        'octane'
    )
, 'must_contain', jsonb_build_array('C8H18')
    ),
    false,
    E'C₈H₁₈ (octane); [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'**Balance atoms** on both sides:\n• Left: C₁₀H₂₂ = 10 C + 22 H\n• Right so far: C₂H₄ = 2 C + 4 H\n• Missing: (10−2) C + (22−4) H = **8 C and 18 H** = **C₈H₁₈** ✓\n\nC₈H₁₈ is octane (an alkane). The other product, C₂H₄ (ethene), is an alkene → can be used to make plastics.',
    true
  );

  -- ─── Q7(c)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '7(c)(ii)', 1, 'free',
    'fill_in',
    E'Petroleum is a mixture of hydrocarbons.\n\nTwo of the processes carried out in an oil refinery are fractional distillation of petroleum and cracking of hydrocarbon fractions.\n\n**(c)(ii)** Explain the meaning of the term *cracking*.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'decomposition of a long chain hydrocarbon into a simpler more useful one',
        'breaking long-chain hydrocarbons into smaller useful ones',
        'breaking down a long-chain hydrocarbon into smaller molecules',
        'decomposition of long chain hydrocarbons'
    )
, 'must_contain', jsonb_build_array('long', 'smaller')
    ),
    false,
    E'Decomposition (breaking down) of a LONG-CHAIN hydrocarbon into SMALLER, more useful ones; [1 mark]\n\n**Examiner commentary:** Fair. Most said ''breaking down'' but a few couldn''t say WHAT was broken down.',
    E'**Cracking = breaking long-chain alkanes into smaller, more useful hydrocarbons (including alkenes).**\n\nConditions: high temperature (~600 °C) + catalyst (e.g. silica/alumina, zeolite).\n\nWhy? Long-chain hydrocarbons (e.g. waxes, diesel) are in oversupply. Smaller molecules (petrol, ethene for plastics) are in demand. Cracking converts surplus → useful products.',
    true
  );

  -- ─── Q7(d)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '7(d)', 2, 'free',
    'fill_in',
    E'Ethanol can be made from ethene.\n\n**(d)** Name the **reagent** AND **condition** needed to convert ethene to ethanol. Format: ''''reagent: ___; condition: ___''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'reagent steam condition acid catalyst',
        'steam acid catalyst',
        'steam, acid catalyst',
        'steam catalyst',
        'water catalyst',
        'reagent: steam, condition: catalyst'
    )
, 'must_contain', jsonb_build_array('catalyst')
    ),
    false,
    E'Reagent: STEAM (or water); [1]\nCondition: (phosphoric) acid CATALYST (also high temperature ~300 °C and high pressure 60 atm); [1]\n\n**Examiner commentary:** Moderate. Most couldn''t differentiate between reagent and condition.',
    E'**Hydration of ethene → ethanol** (industrial process):\n\nC₂H₄ + H₂O → C₂H₅OH\n\n• **Reagent: steam (H₂O)**\n• **Conditions: phosphoric acid CATALYST**, ~300 °C, ~60 atm\n\nReagent = the substance reacting. Condition = the environment (temperature, pressure, catalyst). Don''t mix them up.',
    true
  );

  -- ─── Q7(e)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '7(e)', 1, 'free',
    'fill_in',
    E'Ethanol is converted into ethanoic acid.\n\n**(e)** State the **type of chemical change** that occurs.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'oxidation',
        'oxidation reaction'
    )
, 'must_contain', jsonb_build_array('oxid')
    ),
    false,
    E'Oxidation; [1 mark]\n\n**Examiner commentary:** Poorly answered. Many didn''t understand the question.',
    E'**Ethanol → ethanoic acid is an OXIDATION.**\n\nC₂H₅OH + [O] → CH₃COOH + H₂O\n\nReasons it''s oxidation:\n• Gain of oxygen\n• Loss of hydrogen\n• Carbon goes from oxidation state +1 (in CH₂OH) to +3 (in COOH)\n\nThis is what happens when wine ''goes off'' to vinegar — bacteria oxidise the ethanol to ethanoic acid (vinegar = dilute ethanoic acid).',
    true
  );

  -- ─── Q7(f)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '7(f)', 1, 'free',
    'fill_in',
    E'Ethene can polymerise.\n\n**(f)** State the name of the **polymer formed from ethene**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'polythene',
        'polyethene',
        'polyethylene',
        'poly(ethene)'
    )
, 'must_contain', jsonb_build_array('poly')
    ),
    false,
    E'Polyethene / polythene; [1 mark]\n\n**Examiner commentary:** Moderate.',
    E'**Ethene (C₂H₄) → polyethene (–CH₂–CH₂–)ₙ** by addition polymerisation.\n\nMany ethene molecules link together at their C=C double bonds → form a long chain. Result: **polythene/polyethene** — the most common plastic on Earth (used for bags, bottles, sheeting).\n\nName variations all accepted: polythene = polyethene = polyethylene = poly(ethene).',
    true
  );

  -- ─── Q7(g)(i)  [1 mark, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '7(g)(i)', 1, 'paid',
    'free_text',
    E'Polyesters such as terylene contain an ester linkage.\n\n**(g)(i)** Describe the structure of an **ester linkage** (show the atoms and bonds).',
    null,
    E'Ester linkage: –C(=O)–O–\n\nThat is: a carbon with a double bond to one oxygen AND a single bond to another oxygen, with the second oxygen joined to the next group. Written as –COO– or –CO–O–. [1 mark]\n\n**Examiner commentary:** Poorly answered. Some drew other polymer linkages.',
    E'Award 1 mark for showing: carbon with C=O double bond AND C–O single bond to next group. The single oxygen connects to the next carbon in the polymer chain. PENALISE amide linkage drawings (–CO–NH–).',
    E'**Ester linkage structure:**\n\n```\n    O\n    ‖\n— C — O —\n```\n\nThat''s: a carbon **DOUBLE-BONDED** to one oxygen (the carbonyl, C=O) AND **SINGLE-BONDED** to another oxygen (which connects to the next bit of chain).\n\nWritten flat as **–COO–** or **–CO–O–**.\n\nFormed when a carboxylic acid (–COOH) reacts with an alcohol (–OH), losing water.\n\n**Different from amide (–CO–NH–, found in nylon and proteins).**',
    true
  );

  -- ─── Q7(g)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '7(g)(ii)', 1, 'free',
    'fill_in',
    E'Polyesters such as terylene contain an ester linkage. Some natural polymers also contain ester linkages.\n\n**(g)(ii)** State the name of a **natural polymer** possessing an ester linkage.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'fats',
        'oils',
        'fats or oils',
        'fats and oils',
        'lipids',
        'fat',
        'oil',
        'lipid'
    )
    ),
    false,
    E'Fats / oils (lipids); [1 mark]\n\n**Examiner commentary:** Moderate. Many couldn''t distinguish natural vs synthetic polymers.',
    E'**Fats and oils (lipids)** are natural polyesters — formed from glycerol + fatty acids joined by ester linkages.\n\nWhen you eat fats, enzymes (lipases) break those ester linkages back into glycerol + fatty acids. Same chemistry as Terylene (synthetic polyester), just naturally occurring.',
    true
  );

  -- ─── Q8(a)  [3 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '8(a)', 3, 'free',
    'fill_in',
    E'Ammonium sulfate is used in fertilisers.\n\n**(a)** State the names of the **THREE elements** found in most fertilisers.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'nitrogen phosphorus potassium',
        'nitrogen, phosphorus, potassium',
        'N P K',
        'nitrogen phosphorous potassium'
    )
, 'must_contain', jsonb_build_array('nitrogen', 'phosph', 'potass')
    ),
    false,
    E'Nitrogen; Phosphorus; Potassium; [3 marks, 1 each — avoid penalising twice on spelling]\n\n**Examiner commentary:** Well answered. Some misspelt the elements.',
    E'**NPK fertilisers** contain the three essential macronutrients:\n• **N — Nitrogen** — leafy growth (proteins, chlorophyll)\n• **P — Phosphorus** — roots + flowers (DNA, ATP)\n• **K — Potassium** — flowers + fruit (enzymes, water balance)\n\nFertiliser bags show ''NPK 10-5-5'' = 10% N, 5% P, 5% K. Memory hook: **NPK = Nitrogen, Phosphorus, K (potassium uses Latin ''kalium'')**.',
    true
  );

  -- ─── Q8(b)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2023, '2', '8(b)', 2, 'free',
    'fill_in',
    E'Ammonium sulfate is used in fertilisers.\n\nFertilisers containing ammonium salts are often slightly acidic.\n\n**(b)** Name a **compound** which farmers add to the soil to make it **less acidic**, and explain **why** it is used. Format: ''''name: ___; explanation: ___''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'lime calcium oxide neutralises acid',
        'calcium oxide base neutralises',
        'lime base neutralises',
        'calcium carbonate neutralises',
        'slaked lime base',
        'limestone neutralises acid'
    )
, 'must_contain', jsonb_build_array('base')
    ),
    false,
    E'Name: (quick)lime / calcium oxide / slaked lime / calcium hydroxide / limestone / calcium carbonate; [1]\nExplanation: It is a BASE — neutralises the acid in the soil; [1]\n\n**Examiner commentary:** Fair. Most named the compound but couldn''t explain why.',
    E'**''Liming'' acidic soil:**\n\nName any one: **calcium oxide (quicklime)** OR **calcium hydroxide (slaked lime)** OR **calcium carbonate (limestone, chalk)**.\n\n**Why?** They are all **BASES** — they NEUTRALISE acid in the soil, raising the pH towards 7 → better for plant growth (most plants prefer slightly acidic to neutral soil).\n\nReaction: base + acid → salt + water. The acid is neutralised, plants thrive.',
    true
  );

  -- ─── Q8(c)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2023, '2', '8(c)', 3, 'paid',
    'free_text',
    E'Ammonium sulfate is used in fertilisers.\n\n**(c)** Discuss the **dangers of overuse of fertilisers** (the eutrophication process).',
    null,
    E'Any 3 of (1 mark each):\n1. Fertiliser gets washed into water resources (rivers / lakes);\n2. Causes overgrowth of algae (algal bloom);\n3. Algae block sunlight / prevent photosynthesis (or just block sunlight for water plants);\n4. Bacteria feed on rotting plants and use up oxygen → deoxygenated water;\n5. Leads to death of fish and other aquatic life;\n6. This whole process is called EUTROPHICATION;\n\n**Examiner commentary:** Well answered.',
    E'Award 1 mark per stage of the eutrophication sequence (max 3). Must show CAUSAL CHAIN: runoff → algae bloom → shading/decomposition → oxygen depletion → aquatic death. PENALISE generic ''damages environment'' answers without specifics.',
    E'**Eutrophication — the chain reaction:**\n\n1. Excess fertiliser (NPK) **runs off** into rivers and lakes after rain\n2. **Algae bloom** — they multiply rapidly using the nutrients\n3. Thick algal layer **blocks sunlight** → underwater plants die\n4. Dead plants + algae are decomposed by **aerobic bacteria**\n5. Bacteria use up dissolved O₂ → water becomes **deoxygenated**\n6. Fish and aquatic animals **suffocate and die**\n\nThe whole process is called **EUTROPHICATION**. Solution: use less fertiliser, plant buffer strips along rivers.',
    true
  );

  raise notice 'Inserted 54 sub-parts for Chemistry NSSCO 2023 Paper 2';
end $$;
