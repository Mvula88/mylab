-- ===========================================================================
-- NSSCO Chemistry 2024 Paper 2 (6117/2) — 7 questions, 56 sub-parts, 80 marks
-- Verbatim NIED wording. Mark scheme + commentary from
-- DNEA Examiners Report 2024 (Chemistry section, pages 107-111).
-- ===========================================================================

do $$
declare
  chem_id uuid;
begin
  select id into chem_id from public.subjects where slug = 'chemistry' limit 1;
  if chem_id is null then raise notice 'Chemistry subject not found'; return; end if;

  -- ─── Q1(a)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '1(a)(i)', 1, 'free',
    'fill_in',
    E'Fig. 1.1 shows part of the Periodic Table with seven letters placed in different positions:\n• **B** — top-right corner (Group 0)\n• **E** — top-right block (Group VI/VII area, period 2)\n• **F** — Group III area, period 3\n• **G** — Group II area, period 2\n• **C** — Group I, period 4 (left side, fourth row)\n• **D** — middle, transition metals area (period 4)\n• **A** — Group VII, period 4 (right side, fourth row)\n\nThe letters do NOT represent the symbols of the elements.\n\n**(a)(i)** Choose the letter (from A to F) which is in the **same period as calcium**.',
    '/past-papers/chemistry-nssco-2024-p2/periodic-positions.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'C',
        'A',
        'D',
        'potassium',
        'bromine',
        'copper'
    )
    ),
    false,
    E'C / A / D (allow correct element names: potassium / bromine / copper); [1 mark]\n\n**Examiner commentary:** Well answered. Some used names/symbols instead of letters as instructed.',
    E'**Period 4** of the periodic table contains: K, Ca, Sc, Ti, V, Cr, Mn, Fe, Co, Ni, Cu, Zn, Ga, Ge, As, Se, **Br**, Kr.\n\nFrom the diagram, the letters in Period 4 are: **C (Group I)**, **D (transition metals)**, **A (Group VII)** — any of these scores the mark.\n\n⚠ The question says ''Choose, from A to F, the element'' — answer with a LETTER, not a name (although the examiner accepts both).',
    true
  );

  -- ─── Q1(a)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '1(a)(ii)', 1, 'free',
    'fill_in',
    E'Fig. 1.1 shows part of the Periodic Table with seven letters placed in different positions:\n• **B** — top-right corner (Group 0)\n• **E** — top-right block (Group VI/VII area, period 2)\n• **F** — Group III area, period 3\n• **G** — Group II area, period 2\n• **C** — Group I, period 4 (left side, fourth row)\n• **D** — middle, transition metals area (period 4)\n• **A** — Group VII, period 4 (right side, fourth row)\n\nThe letters do NOT represent the symbols of the elements.\n\n**(a)(ii)** Choose the letter which is a **liquid at room temperature** with **diatomic molecules**.',
    '/past-papers/chemistry-nssco-2024-p2/periodic-positions.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'A',
        'bromine',
        'Br2'
    )
    ),
    false,
    E'A (bromine); [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'Only **bromine (Br₂)** is a liquid at room temperature AND forms diatomic molecules (the only non-metal liquid).\n\n• Mercury is the only LIQUID METAL — but it''s monatomic\n• All other liquids on the periodic table are solids or gases at room temp\n\nBromine sits in Group VII, Period 4 → letter **A** in this diagram.',
    true
  );

  -- ─── Q1(a)(iii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '1(a)(iii)', 1, 'free',
    'fill_in',
    E'Fig. 1.1 shows part of the Periodic Table with seven letters placed in different positions:\n• **B** — top-right corner (Group 0)\n• **E** — top-right block (Group VI/VII area, period 2)\n• **F** — Group III area, period 3\n• **G** — Group II area, period 2\n• **C** — Group I, period 4 (left side, fourth row)\n• **D** — middle, transition metals area (period 4)\n• **A** — Group VII, period 4 (right side, fourth row)\n\nThe letters do NOT represent the symbols of the elements.\n\n**(a)(iii)** Choose the letter which forms an **amphoteric oxide**.',
    '/past-papers/chemistry-nssco-2024-p2/periodic-positions.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'F',
        'aluminium',
        'Al'
    )
    ),
    false,
    E'F (aluminium); [1 mark]\n\n**Examiner commentary:** —',
    E'**Amphoteric oxide** = reacts with BOTH acids AND bases.\n\nAt NSSCO level the main example is **aluminium oxide (Al₂O₃)**. Zinc oxide (ZnO) and lead oxide (PbO) are also amphoteric.\n\nAluminium sits in Group III, Period 3 → letter **F** in this diagram.',
    true
  );

  -- ─── Q1(a)(iv)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '1(a)(iv)', 1, 'free',
    'fill_in',
    E'Fig. 1.1 shows part of the Periodic Table with seven letters placed in different positions:\n• **B** — top-right corner (Group 0)\n• **E** — top-right block (Group VI/VII area, period 2)\n• **F** — Group III area, period 3\n• **G** — Group II area, period 2\n• **C** — Group I, period 4 (left side, fourth row)\n• **D** — middle, transition metals area (period 4)\n• **A** — Group VII, period 4 (right side, fourth row)\n\nThe letters do NOT represent the symbols of the elements.\n\n**(a)(iv)** Choose the letter which forms a **soluble hydroxide** with water.',
    '/past-papers/chemistry-nssco-2024-p2/periodic-positions.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'C',
        'potassium',
        'K'
    )
    ),
    false,
    E'C (potassium); [1 mark]\n\n**Examiner commentary:** —',
    E'**Group I hydroxides (LiOH, NaOH, KOH)** are all very soluble in water — they make strong alkalis.\n\nIn the diagram, C is in Group I, Period 4 = **potassium (K)**, which forms KOH (very soluble).\n\nGroup II hydroxides like Ca(OH)₂ are only slightly soluble — not ''soluble''. Transition metal hydroxides are insoluble.',
    true
  );

  -- ─── Q1(a)(v)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '1(a)(v)', 1, 'free',
    'fill_in',
    E'Fig. 1.1 shows part of the Periodic Table with seven letters placed in different positions:\n• **B** — top-right corner (Group 0)\n• **E** — top-right block (Group VI/VII area, period 2)\n• **F** — Group III area, period 3\n• **G** — Group II area, period 2\n• **C** — Group I, period 4 (left side, fourth row)\n• **D** — middle, transition metals area (period 4)\n• **A** — Group VII, period 4 (right side, fourth row)\n\nThe letters do NOT represent the symbols of the elements.\n\n**(a)(v)** Choose the letter which is **used to fill weather balloons**.',
    '/past-papers/chemistry-nssco-2024-p2/periodic-positions.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'B',
        'helium',
        'He'
    )
    ),
    false,
    E'B (helium); [1 mark]\n\n**Examiner commentary:** —',
    E'**Helium (He)** is used in weather balloons (and party balloons) because:\n• **Less dense than air** → balloons float\n• **Inert** (Group 0 noble gas) → doesn''t react / non-flammable (unlike hydrogen, which is also lighter but explodes!)\n\nIn the diagram, B sits at the top right corner of Group 0 = helium.',
    true
  );

  -- ─── Q1(b)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '1(b)', 2, 'paid',
    'free_text',
    E'Fig. 1.1 shows part of the Periodic Table with seven letters placed in different positions:\n• **B** — top-right corner (Group 0)\n• **E** — top-right block (Group VI/VII area, period 2)\n• **F** — Group III area, period 3\n• **G** — Group II area, period 2\n• **C** — Group I, period 4 (left side, fourth row)\n• **D** — middle, transition metals area (period 4)\n• **A** — Group VII, period 4 (right side, fourth row)\n\nThe letters do NOT represent the symbols of the elements.\n\n**D** is a transition element. Transition elements are harder and stronger than Group I elements.\n\n**(b)** Describe **two other properties** of transition elements which are **different from those of Group I elements**.',
    '/past-papers/chemistry-nssco-2024-p2/periodic-positions.png',
    E'Any 2 of (1 mark each):\n• High density;\n• High melting point / high boiling point;\n• Form coloured compounds;\n• Often act as catalysts;\n• Have more than one oxidation state / variable valency;\n• Are LESS reactive (than Group I);\n\n**Examiner commentary:** Moderately answered. Many candidates gave general metal properties (e.g. ''good conductor of electricity'') — but those apply to Group I metals too.',
    E'Award 1 mark each (max 2). Must be COMPARATIVE to Group I (not general metal properties shared by both). PENALISE ''electrical conductor'' (all metals are), ''shiny'' (all metals are). The accepted answers all reflect characteristic transition-metal-only features.',
    E'Properties of transition metals that **distinguish them from Group I**:\n\n• **High density** (Group I metals are very light — Li, Na, K float on water)\n• **High melting points** (Group I metals melt easily — sodium at 98 °C, potassium at 63 °C)\n• **Coloured compounds** (Cu²⁺ blue, Fe²⁺ green, Fe³⁺ orange — Group I compounds are colourless/white)\n• **Catalysts** (Fe in Haber process, Ni in hydrogenation — Group I metals aren''t used as catalysts)\n• **Variable oxidation states** (Fe²⁺/Fe³⁺, Cu⁺/Cu²⁺ — Group I always +1)\n• **Less reactive** (don''t react vigorously with water — Group I do)\n\nAny TWO of these for full marks.',
    true
  );

  -- ─── Q2(a)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '2(a)', 2, 'free',
    'fill_in',
    E'Magnesium forms the ion Mg²⁺ and bromine forms the ion Br⁻. These two ions form magnesium bromide (MgBr₂).\n\n[Br: A=80, Z=35]\n\n**(a)** State the **number of electrons and neutrons** in a bromide ion (Br⁻). Format: ''''electrons: ___; neutrons: ___''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'electrons 36 neutrons 45',
        '36 and 45',
        '36, 45',
        'electrons: 36, neutrons: 45'
    )
, 'must_contain', jsonb_build_array('36', '45')
    ),
    false,
    E'Number of electrons = **36**; [1]\nNumber of neutrons = **45**; [1]\n\n**Examiner commentary:** Moderately answered. Many couldn''t differentiate atom from ion. They forgot Br⁻ has one EXTRA electron.',
    E'**Bromide ion = Br⁻ (Br atom with one EXTRA electron).**\n\nFor Br (Z=35, A=80):\n• Protons = 35 (Z)\n• Neutrons = A − Z = 80 − 35 = **45**\n• Electrons in atom = 35, but Br⁻ has GAINED 1 electron → 35 + 1 = **36**\n\nSo: 36 electrons, 45 neutrons.\n\nNegative ion (−1) → has 1 MORE electron than the atom. Positive ion (+1) → has 1 LESS.',
    true
  );

  -- ─── Q2(b)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '2(b)', 1, 'free',
    'fill_in',
    E'Magnesium forms the ion Mg²⁺ and bromine forms the ion Br⁻. These two ions form magnesium bromide (MgBr₂).\n\n**(b)** Describe how a magnesium ion, **Mg²⁺**, is formed from a magnesium atom, Mg.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'loses 2 electrons',
        'by losing 2 electrons',
        'transfer of 2 electrons',
        'Mg gives away 2 electrons',
        'loses two electrons',
        'loss of two electrons',
        'loss of 2 electrons'
    )
, 'must_contain', jsonb_build_array('lose', '2')
    ),
    false,
    E'By the transfer / LOSS of (2) electrons; [1 mark]\n\n**Examiner commentary:** Moderately answered. Some confused ''lose'' (give away) with ''loose'' (not tight).',
    E'**Mg → Mg²⁺ + 2e⁻**\n\nMagnesium atom has 2 outer electrons (electron config 2,8,**2**). To become stable like the noble gas neon (2,8), it **LOSES** both outer electrons → forms the **Mg²⁺** ion (positive because more protons than electrons now).\n\nThe word is ''LOSE'' (verb, to give up) — NOT ''loose'' (adjective, the opposite of tight). Common spelling slip in chemistry exams.',
    true
  );

  -- ─── Q2(c)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '2(c)', 3, 'paid',
    'free_text',
    E'Magnesium forms the ion Mg²⁺ and bromine forms the ion Br⁻. These two ions form magnesium bromide (MgBr₂).\n\nMagnesium bromide is an **ionic compound**.\n\n**(c)** Describe the **dot-and-cross diagrams** for the ions in **magnesium bromide (MgBr₂)**. Show outer shells only and explicit charges.',
    null,
    E'All 3 marks:\n• 1 mark — Mg²⁺ shown (square brackets, 2+ charge, can be drawn with NO outer electrons or with empty outer shell);\n• 1 mark — TWO Br⁻ ions (square brackets, 1− charge each);\n• 1 mark — 8 electrons (mix of dots and crosses) on each bromide outer shell;\n\n**Examiner commentary:** Poorly answered. Many couldn''t show charges. Some drew covalent bond instead of ionic.',
    E'Award 1 mark each: (1) Mg²⁺ correctly shown; (2) TWO Br⁻ ions (1 Mg : 2 Br ratio); (3) 8 electrons on each Br outer shell. PENALISE: drawing covalent (shared) bond between Mg and Br; missing charges; only one Br shown; wrong charge magnitudes.',
    E'**Dot-and-cross for MgBr₂:**\n\n• **Mg²⁺**: [Mg]²⁺ — no outer electrons (it lost both). Square brackets and the 2+ outside.\n• **Two Br⁻ ions**: each shown as [Br with 8 outer electrons]⁻. Use 7 dots from Br + 1 cross to show the gained electron. Square brackets and 1− outside.\n\nLook like:\n\n[Mg]²⁺  [×●●●●●●●●Br]⁻  [×●●●●●●●●Br]⁻\n\nIonic compounds are DRAWN AS SEPARATE IONS (in brackets), not as bonded atoms. Always include the charges.',
    true
  );

  -- ─── Q2(d)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '2(d)(i)', 1, 'free',
    'fill_in',
    E'Magnesium forms the ion Mg²⁺ and bromine forms the ion Br⁻. These two ions form magnesium bromide (MgBr₂).\n\n**(d)(i)** Name the **process** that uses electricity to break down aqueous or molten ionic compounds.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'electrolysis',
        'Electrolysis'
    )
, 'must_contain', jsonb_build_array('electrolysis')
    ),
    false,
    E'Electrolysis; [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'**Electrolysis** = decomposition of ionic compound (molten or in solution) by an electric current.\n\nThe electrolytic cell has:\n• Anode (+ve electrode) — negative ions go here, get oxidised\n• Cathode (−ve electrode) — positive ions go here, get reduced\n• Electrolyte — the molten/aqueous ionic compound providing free ions',
    true
  );

  -- ─── Q2(d)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '2(d)(ii)', 1, 'free',
    'fill_in',
    E'Magnesium forms the ion Mg²⁺ and bromine forms the ion Br⁻. These two ions form magnesium bromide (MgBr₂).\n\n**(d)(ii)** Explain **why** the ionic compound must be **aqueous or molten** for electrolysis to occur.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'ions must be free to move and carry charge',
        'the ions need to be free to move',
        'so ions can move and carry charge',
        'ions are free to move and conduct electricity',
        'ions must move to conduct electricity',
        'to allow ions to move'
    )
, 'must_contain', jsonb_build_array('ions', 'move')
    ),
    false,
    E'The IONS need to be free to MOVE and carry charge; [1 mark — must mention IONS, not ''electrons'']\n\n**Examiner commentary:** Moderately answered. Some used ''electrons'' instead of ''ions''.',
    E'**Solid ionic compounds DON''T conduct** because the ions are locked in a rigid lattice — they can''t move.\n\nWhen melted OR dissolved in water:\n• Ions become **free to move** through the liquid\n• Positive ions move to the cathode, negative ions move to the anode\n• This **movement of charged particles = electric current**\n• Reactions happen at the electrodes\n\nKey: it''s the IONS (charged particles) that carry current in electrolysis — NOT electrons. Saying ''electrons need to move'' loses the mark.',
    true
  );

  -- ─── Q2(d)(iii)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '2(d)(iii)', 2, 'free',
    'fill_in',
    E'Magnesium forms the ion Mg²⁺ and bromine forms the ion Br⁻. These two ions form magnesium bromide (MgBr₂).\n\n**(d)(iii)** Write the **ionic half-equations** for the reactions at the cathode and anode (using single arrows).\n\nFormat: ''''cathode: ___; anode: ___''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'cathode Mg2+ + 2e- -> Mg; anode 2Br- -> Br2 + 2e-',
        'Mg2+ + 2e- -> Mg and 2Br- -> Br2 + 2e-',
        'Mg2+ + 2e -> Mg; 2Br- -> Br2 + 2e'
    )
, 'must_contain', jsonb_build_array('Mg', 'Br')
    ),
    false,
    E'Cathode: Mg²⁺ + 2e⁻ → Mg; [1]\nAnode: 2Br⁻ → Br₂ + 2e⁻ (accept 2Br⁻ − 2e⁻ → Br₂); [1]\n\n**Examiner commentary:** Moderately answered. Many got the cathode but not the anode. Some forgot the minus sign on electrons (e⁻).',
    E'**Two half-equations:**\n\n**Cathode (−ve, reduction)** — Mg²⁺ ions GAIN electrons → become Mg metal:\n**Mg²⁺ + 2e⁻ → Mg**\n\n**Anode (+ve, oxidation)** — Br⁻ ions LOSE electrons → become Br₂ gas:\n**2Br⁻ → Br₂ + 2e⁻**\n\nKey checks: each half-equation BALANCES atoms AND charges. Two Br⁻ (total charge 2−) → Br₂ (neutral) + 2e⁻ (charge 2−). Charges balance. ✓',
    true
  );

  -- ─── Q2(e)(i)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '2(e)(i)', 2, 'paid',
    'free_text',
    E'Magnesium forms the ion Mg²⁺ and bromine forms the ion Br⁻. These two ions form magnesium bromide (MgBr₂).\n\nBoth magnesium bromide and diamond form lattices.\n\n**(e)(i)** Distinguish between the **lattice of magnesium bromide** and that of **diamond**.',
    null,
    E'Both required (1 mark each):\n1. The lattice of MgBr₂ is a giant IONIC lattice;\n2. While the lattice of diamond is giant COVALENT / giant molecular / macromolecular;\n\n**Examiner commentary:** Poorly answered. Most couldn''t distinguish ionic from covalent lattices.',
    E'Award 1 mark for each correct comparison. Must mention BOTH ''ionic'' (for MgBr₂) and ''covalent / giant covalent'' (for diamond). PENALISE answers that don''t compare or just describe one.',
    E'**Two types of GIANT lattices:**\n\n• **MgBr₂ — Giant IONIC lattice**: alternating Mg²⁺ and Br⁻ ions held by **electrostatic forces** of attraction between oppositely charged ions.\n• **Diamond — Giant COVALENT lattice** (also called giant molecular or macromolecular): every C atom is **covalently bonded to 4 other C atoms** in a 3D tetrahedral network.\n\nKey difference: IONIC = positive + negative ions; COVALENT = atoms sharing electrons. Both ''giant'' (3D networks), but different bonding types.',
    true
  );

  -- ─── Q2(e)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '2(e)(ii)', 1, 'free',
    'fill_in',
    E'Magnesium forms the ion Mg²⁺ and bromine forms the ion Br⁻. These two ions form magnesium bromide (MgBr₂).\n\nDiamond is an allotrope of carbon.\n\n**(e)(ii)** Describe the **structure of diamond**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'each carbon is bonded to 4 other carbons',
        'each carbon atom bonded to four other carbon atoms',
        'tetrahedral',
        'each C bonded to 4 C',
        'carbon bonded to 4 other carbon atoms tetrahedrally'
    )
, 'must_contain', jsonb_build_array('4', 'carbon')
    ),
    false,
    E'Each carbon atom is bonded to **4 other carbon atoms** / tetrahedral arrangement; [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'**Diamond structure:**\n• Each carbon atom forms **4 covalent bonds** to 4 other carbon atoms\n• Arranged in a **tetrahedral** geometry (109.5° between bonds)\n• Extends in a 3D network throughout the entire crystal — there are no separate molecules in a diamond\n\nThat''s why diamond is so hard — you can''t move atoms without breaking very strong covalent bonds throughout the structure.',
    true
  );

  -- ─── Q2(e)(iii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '2(e)(iii)', 1, 'free',
    'fill_in',
    E'Magnesium forms the ion Mg²⁺ and bromine forms the ion Br⁻. These two ions form magnesium bromide (MgBr₂).\n\n**(e)(iii)** In terms of **bonding**, explain why **diamond has a high melting point**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'strong covalent bonds',
        'many strong covalent bonds',
        'strong (covalent) bonds throughout',
        'has strong covalent bonds',
        'strong bonds need lots of energy to break'
    )
, 'must_contain', jsonb_build_array('strong', 'covalent')
    ),
    false,
    E'It has **strong COVALENT bonds** (between all the carbon atoms — many bonds to break); [1 mark]\n\n**Examiner commentary:** Fairly answered. Majority referred to ''electrostatic forces'' instead of ''covalent bonds''.',
    E'Diamond''s high melting point comes from:\n• **Many STRONG COVALENT bonds** throughout the entire 3D lattice\n• To melt, EVERY one of these bonds must be broken — needs ENORMOUS energy\n• Result: melting point of diamond is about **3500 °C** (no metal even comes close)\n\nDon''t say ''electrostatic forces'' — that''s ionic compounds. Diamond is covalent (atoms sharing electrons), not ionic.',
    true
  );

  -- ─── Q3(a)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '3(a)', 1, 'free',
    'fill_in',
    E'Ammonia is manufactured by the **Haber process**. When nitrogen is reacted with hydrogen in a closed container, an equilibrium mixture is formed. An iron catalyst is used and the reaction is exothermic.\n\n**N₂ + H₂ ⇌ NH₃**\n\n**(a)** Balance the chemical equation:\n\nN₂ + .....H₂ ⇌ .....NH₃\n\nGive the two coefficients (e.g. ''''3 and 2'''').',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '3 and 2',
        '3, 2',
        '3 2',
        'N2 + 3H2 -> 2NH3'
    )
, 'must_contain', jsonb_build_array('3', '2')
    ),
    false,
    E'**N₂ + 3H₂ ⇌ 2NH₃** (coefficients: 3 and 2); [1 mark]\n\n**Examiner commentary:** Well answered. Many were able to balance the equation.',
    E'**Balance step by step:**\n\nN: LHS has 2 N (from N₂) → RHS needs 2 N → coefficient of NH₃ = **2** → 2NH₃ has 2 N ✓\n\nH: RHS now has 2×3 = 6 H → LHS needs 6 H → coefficient of H₂ = **3** → 3H₂ has 6 H ✓\n\n**N₂ + 3H₂ ⇌ 2NH₃**\n\nThis is the classic Haber-Bosch process equation — remember the 1:3:2 ratio.',
    true
  );

  -- ─── Q3(b)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '3(b)', 1, 'free',
    'fill_in',
    E'Ammonia is manufactured by the **Haber process**. When nitrogen is reacted with hydrogen in a closed container, an equilibrium mixture is formed. An iron catalyst is used and the reaction is exothermic.\n\n**N₂ + H₂ ⇌ NH₃**\n\n**(b)** State **why a catalyst is used** in the Haber process.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'to speed up the reaction',
        'increases the rate of reaction',
        'to increase the rate of reaction',
        'speeds up the reaction',
        'lowers activation energy',
        'provides alternative pathway with lower activation energy',
        'to make the reaction faster'
    )
    ),
    false,
    E'To SPEED UP the chemical reaction / provide alternative pathway by lowering activation energy; [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'**A catalyst INCREASES the RATE of reaction** without being used up.\n\nFor the Haber process:\n• Iron catalyst (Fe) lets the reaction reach equilibrium MUCH faster\n• Without the catalyst, the reaction would be too slow to be economical\n\nNote: a catalyst does NOT change the position of equilibrium or the yield — it only changes HOW FAST equilibrium is reached.',
    true
  );

  -- ─── Q3(c)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '3(c)', 2, 'paid',
    'free_text',
    E'Ammonia is manufactured by the **Haber process**. When nitrogen is reacted with hydrogen in a closed container, an equilibrium mixture is formed. An iron catalyst is used and the reaction is exothermic.\n\n**N₂ + H₂ ⇌ NH₃**\n\n**(c)** Explain, in terms of **bond breaking and bond forming**, why the reaction is **exothermic**.',
    null,
    E'Both required (1 mark each):\n1. Bond breaking is ENDOTHERMIC (energy absorbed) AND bond making is EXOTHERMIC (energy released);\n2. MORE energy is RELEASED in making bonds than is ABSORBED in breaking bonds;\n\n**Examiner commentary:** Poorly answered. Many couldn''t differentiate which process involves bond breaking vs bond forming.',
    E'Award 1 mark for stating bond breaking = endothermic AND bond making = exothermic. Award 1 mark for the COMPARISON: more energy released than absorbed (net exothermic). PENALISE contradictions; bond making described as endothermic.',
    E'**Two energy facts to memorise:**\n\n1. **Breaking bonds REQUIRES energy** (endothermic — you must put energy IN to pull atoms apart)\n2. **Making bonds RELEASES energy** (exothermic — atoms ''snap together'' giving out energy)\n\n**Overall ΔH = energy absorbed (breaking) − energy released (making)**\n\nFor an EXOTHERMIC reaction:\n• Energy released when new bonds form (in NH₃) > energy absorbed when old bonds break (in N₂ and H₂)\n• Net: energy LEAVES the system → surroundings get warmer\n\nFor the Haber process this is true — the N–H bonds in NH₃ release more energy than is needed to break N≡N and H–H bonds.',
    true
  );

  -- ─── Q3(d)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '3(d)', 2, 'paid',
    'free_text',
    E'Ammonia is manufactured by the **Haber process**. When nitrogen is reacted with hydrogen in a closed container, an equilibrium mixture is formed. An iron catalyst is used and the reaction is exothermic.\n\n**N₂ + H₂ ⇌ NH₃**\n\n**(d)** Describe and explain the **effect on the position of equilibrium** when the **pressure is decreased**.',
    null,
    E'Both required (1 mark each):\n1. The equilibrium shifts to the LEFT / more reactants formed;\n2. When pressure is decreased, equilibrium shifts to the side with MORE MOLES OF GAS (LHS has 4 moles: 1+3; RHS has 2 moles);\n\n**Examiner commentary:** The LEAST well answered question on this paper. Very few could give the effect; some gave contradicting answers.',
    E'Award 1 mark for stating LHS / more reactants / equilibrium shifts LEFT. Award 1 mark for explanation in terms of moles of gas (LHS has more moles). PENALISE: contradicting statements (shifts left because pressure increases); ''shifts to reactants'' without justification.',
    E'**Le Chatelier''s principle for pressure:**\n\nWhen pressure DECREASES, the system tries to RAISE the pressure → equilibrium shifts toward the side with MORE moles of gas.\n\nCount moles in this equation:\n• LHS: N₂ + 3H₂ = **4 moles of gas**\n• RHS: 2NH₃ = **2 moles of gas**\n\nSince LHS has MORE moles → low pressure favours LHS → **equilibrium shifts to the LEFT** (more reactants formed, less ammonia).\n\nThat''s WHY industrial Haber process uses HIGH pressure (~200 atm) — it pushes equilibrium toward the right (more NH₃).',
    true
  );

  -- ─── Q3(e)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '3(e)', 1, 'free',
    'fill_in',
    E'Ammonia is manufactured by the **Haber process**. When nitrogen is reacted with hydrogen in a closed container, an equilibrium mixture is formed. An iron catalyst is used and the reaction is exothermic.\n\n**N₂ + H₂ ⇌ NH₃**\n\n**(e)** State the **shape** of a molecule of **ammonia (NH₃)**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'pyramidal',
        'triangular pyramidal',
        'trigonal pyramidal',
        '(triangular) pyramidal'
    )
, 'must_contain', jsonb_build_array('pyramid')
    ),
    false,
    E'(Triangular / trigonal) pyramidal — REJECT ''pyramide''; [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'**Ammonia (NH₃) shape: TRIGONAL PYRAMIDAL** (sometimes called ''triangular pyramidal'').\n\nWhy: nitrogen has 4 electron pairs around it — 3 bonding pairs (to H atoms) + 1 lone pair. The lone pair pushes the 3 N–H bonds down → pyramid shape (bond angle ~107°).\n\nDon''t confuse with:\n• Methane (CH₄) — TETRAHEDRAL (4 bonds, no lone pair)\n• Water (H₂O) — BENT (2 bonds, 2 lone pairs)\n\nSpell ''pyramidal'' carefully — ''pyramide'' is wrong.',
    true
  );

  -- ─── Q3(f)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '3(f)', 1, 'free',
    'fill_in',
    E'Ammonia is manufactured by the **Haber process**. When nitrogen is reacted with hydrogen in a closed container, an equilibrium mixture is formed. An iron catalyst is used and the reaction is exothermic.\n\n**N₂ + H₂ ⇌ NH₃**\n\nAmmonia is a base.\n\n**(f)** Name the **ion** present in ammonia solution that makes it alkaline.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'hydroxide',
        'OH-',
        'hydroxide ion',
        'OH⁻',
        'OH'
    )
, 'must_contain', jsonb_build_array('OH')
    ),
    false,
    E'Hydroxide / OH⁻; [1 mark — symbol must include the minus charge if given]\n\n**Examiner commentary:** Well answered. Some gave the formula but missed the charge (writing ''OH.'' instead of OH⁻).',
    E'**Ammonia + water → ammonium hydroxide:**\n\nNH₃ + H₂O ⇌ NH₄⁺ + OH⁻\n\nThe **hydroxide ion (OH⁻)** is what makes the solution alkaline.\n\nAll alkalis release OH⁻ in water — that''s the definition of an alkali. (NaOH gives OH⁻, KOH gives OH⁻, ammonia solution gives OH⁻ via this reaction.)',
    true
  );

  -- ─── Q3(g)(i)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '3(g)(i)', 2, 'paid',
    'free_text',
    E'Ammonia is manufactured by the **Haber process**. When nitrogen is reacted with hydrogen in a closed container, an equilibrium mixture is formed. An iron catalyst is used and the reaction is exothermic.\n\n**N₂ + H₂ ⇌ NH₃**\n\n3NH₃ + H₃PO₄ → (NH₄)₃PO₄\n\n2.891 g of phosphoric acid, H₃PO₄, reacts with ammonia.\n\n[H=1, P=31, O=16, N=14]\n\n**(g)(i)** Calculate the **number of moles in 2.891 g of phosphoric acid (H₃PO₄)**. Show your working.',
    null,
    E'Working (2 marks):\n1. Formula: n = m / Mr (Mr of H₃PO₄ = 3 + 31 + 64 = 98); [1]\n2. Calculation: n = 2.891 / 98 = **0.0295 mol** (no rounding off — accept any correct rounding from 2 s.f.); [1]\n\n**Examiner commentary:** Most candidates were awarded full credit. The most common error was rounding off incorrectly.',
    E'Award 1 mark for correct formula and Mr (98). Award 1 mark for the final answer (0.0295 mol or correctly rounded to 2+ s.f.). PENALISE wrong rounding (e.g. 0.029 if presented as the only answer).',
    E'**Three-step mole calculation:**\n\n1. **Mr of H₃PO₄** = (3 × 1) + 31 + (4 × 16) = 3 + 31 + 64 = **98 g/mol**\n2. **Formula**: n = m ÷ Mr\n3. **Calculation**: n = 2.891 ÷ 98 = **0.0295 mol** (to 3 s.f.)\n\nDon''t round too early — keep this value for part (ii).',
    true
  );

  -- ─── Q3(g)(ii)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '3(g)(ii)', 2, 'paid',
    'free_text',
    E'Ammonia is manufactured by the **Haber process**. When nitrogen is reacted with hydrogen in a closed container, an equilibrium mixture is formed. An iron catalyst is used and the reaction is exothermic.\n\n**N₂ + H₂ ⇌ NH₃**\n\n3NH₃ + H₃PO₄ → (NH₄)₃PO₄\n\nMoles of H₃PO₄ = 0.0295 mol (from part (i))\n\n[Mr NH₃ = 17]\n\n**(g)(ii)** Calculate the **mass of ammonia (NH₃)** that reacts with 2.891 g of H₃PO₄. Show your working.',
    null,
    E'Working (2 marks):\n1. Mole ratio: 3 NH₃ : 1 H₃PO₄ → moles of NH₃ = 0.0295 × 3 = **0.0885 mol**; [1]\n2. Mass: m = n × Mr = 0.0885 × 17 = **1.5045 g** (accept rounded to ~1.50 g); [1]\nError-carried-forward (ECF) applies from part (i).\n\n**Examiner commentary:** Most candidates could not use the mole ratio from the balanced equation.',
    E'Award 1 mark for using the 3:1 mole ratio (0.0885 seen) and 1 mark for the final mass (~1.50 g). ECF from part (i) if the candidate''s earlier value was wrong.',
    E'**Two steps using the mole ratio:**\n\n1. From the equation **3NH₃ + H₃PO₄ → (NH₄)₃PO₄**: ratio is 3 NH₃ : 1 H₃PO₄\n   → moles of NH₃ = 3 × 0.0295 = **0.0885 mol**\n\n2. **Mass = moles × Mr** (Mr of NH₃ = 17):\n   → mass = 0.0885 × 17 = **1.50 g** (3 s.f.)\n\nKey insight: ALWAYS use the COEFFICIENTS from the balanced equation to get the mole ratio. Without the ''3'' in front of NH₃, you''d be off by a factor of 3.',
    true
  );

  -- ─── Q3(g)(iii)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '3(g)(iii)', 2, 'free',
    'fill_in',
    E'Ammonia is manufactured by the **Haber process**. When nitrogen is reacted with hydrogen in a closed container, an equilibrium mixture is formed. An iron catalyst is used and the reaction is exothermic.\n\n**N₂ + H₂ ⇌ NH₃**\n\nAmmonium phosphate is a fertiliser.\n\n**(g)(iii)** State **two other elements** present in fertilisers (other than phosphorus). Format: ''''___ and ___''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'potassium and nitrogen',
        'nitrogen and potassium',
        'K and N',
        'N and K',
        'nitrogen, potassium'
    )
, 'must_contain', jsonb_build_array('potass', 'nitro')
    ),
    false,
    E'1. Potassium (K); [1]\n2. Nitrogen (N); [1]\n\n**Examiner commentary:** Many candidates could give the other elements.',
    E'**NPK fertiliser** — the three macronutrient elements:\n• **N — Nitrogen** (for leafy growth, proteins)\n• **P — Phosphorus** (already given in the question)\n• **K — Potassium** (for flowers, fruits, water balance)\n\nThe question asks for two OTHER than phosphorus → **Nitrogen and Potassium** ✓\n\nMemory hook: NPK is on every fertiliser bag — three numbers like ''10-5-5'' = 10% N, 5% P, 5% K.',
    true
  );

  -- ─── Q4(a)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '4(a)', 2, 'free',
    'fill_in',
    E'Fig. 4.1 shows two test-tubes each containing dilute hydrochloric acid:\n• Test-tube **X** — universal indicator paper added\n• Test-tube **Y** — magnesium ribbon added\n\n**(a)** Describe what would be observed in each test-tube. Format: ''''X: ___; Y: ___''''.',
    '/past-papers/chemistry-nssco-2024-p2/test-tubes-XY.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'X universal indicator turns red Y magnesium dissolves and fizzing',
        'X turns red Y fizzes',
        'X red Y bubbles',
        'X turns red Y dissolves and bubbles',
        'X red Y effervescence'
    )
, 'must_contain', jsonb_build_array('red')
    ),
    false,
    E'X: Universal indicator turns RED (acid is pH ~1-3); [1]\nY: Magnesium dissolves / fizzes / produces bubbles / effervescence / gas given off (any one); [1]\n\n**Examiner commentary:** Well answered. A few referred to universal indicator as ''blue litmus paper turning red''. Some gave conclusions instead of observations for Y.',
    E'**Observations (what you SEE):**\n\n**Test-tube X (universal indicator + HCl):**\n• Universal indicator paper turns **RED** (HCl is a strong acid, pH ~1-2)\n• Red shows STRONG acid; orange/yellow shows weak acid; green = neutral; blue/purple = alkali\n\n**Test-tube Y (magnesium + HCl):**\n• Magnesium **dissolves** (gets smaller, eventually disappears)\n• **Fizzing / bubbles / effervescence** (hydrogen gas released)\n• Reaction: Mg + 2HCl → MgCl₂ + H₂\n\n''Magnesium reacts'' would be conclusion. The OBSERVATION is what you see — bubbles, dissolving, fizzing.',
    true
  );

  -- ─── Q4(b)  [1 mark, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '4(b)', 1, 'paid',
    'free_text',
    E'Fig. 4.1 shows two test-tubes each containing dilute hydrochloric acid:\n• Test-tube **X** — universal indicator paper added\n• Test-tube **Y** — magnesium ribbon added\n\nHydrochloric acid is a strong acid.\n\n**(b)** Explain the difference between **strong and weak acids** in terms of **dissociation into ions**.',
    null,
    E'Both halves required (1 mark for the COMPARISON):\n• Strong acid DISSOCIATES (ionises) COMPLETELY (fully) in water;\n• Weak acid dissociates PARTIALLY (slightly / partly) in water;\n\n**Examiner commentary:** Fairly answered. Many couldn''t give a clear comparison.',
    E'Award 1 mark for a CLEAR comparison showing strong = complete dissociation AND weak = partial. PENALISE answers that only describe one (e.g. ''strong acid dissociates fully'' without the contrast).',
    E'**The key difference is about IONISATION in water:**\n\n• **Strong acid** (HCl, H₂SO₄, HNO₃) — **COMPLETELY** dissociates into ions in water:\n  HCl + H₂O → H⁺ + Cl⁻ (every HCl molecule ionises)\n• **Weak acid** (ethanoic acid, citric acid) — only **PARTIALLY** dissociates (most molecules stay intact):\n  CH₃COOH ⇌ CH₃COO⁻ + H⁺ (only ~1% ionise)\n\nStrong acids have a LOWER pH at the same concentration because they produce more H⁺ ions.',
    true
  );

  -- ─── Q4(c)(i)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '4(c)(i)', 2, 'free',
    'fill_in',
    E'Acids react with alkalis in neutralisation to give salt and water.\n\n**(c)(i)** Describe the **chemical test for water**. State the TEST and the RESULT.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'anhydrous copper sulfate turns blue',
        'anhydrous CuSO4 turns blue',
        'white copper sulfate turns blue',
        'anhydrous cobalt chloride turns pink',
        'blue cobalt chloride turns pink',
        'anhydrous cobalt chloride turns from blue to pink'
    )
, 'must_contain', jsonb_build_array('blue')
    ),
    false,
    E'Test: Add drops of water to **anhydrous (white) copper(II) sulfate** OR anhydrous (blue) cobalt chloride; [1]\nResult: **Turns BLUE** (for CuSO₄) OR turns PINK (for CoCl₂); [1]\n\n**Examiner commentary:** Candidates did well — many had practiced this.',
    E'**Two chemical tests for water:**\n\n• **Anhydrous copper(II) sulfate** (WHITE) → turns **BLUE** ✓ (forms hydrated CuSO₄·5H₂O)\n• **Anhydrous cobalt chloride** (BLUE) → turns **PINK** (forms hydrated CoCl₂·6H₂O)\n\n⚠ These tests show that the liquid IS water — but they don''t show it''s PURE water. For purity, check the boiling point (100 °C) or freezing point (0 °C).',
    true
  );

  -- ─── Q4(c)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '4(c)(ii)', 1, 'free',
    'fill_in',
    E'Acids react with alkalis in neutralisation to give salt and water.\n\n**(c)(ii)** Give the **name of the salt** formed when **calcium hydroxide** neutralises **sulfuric acid**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'calcium sulfate',
        'Calcium sulfate',
        'calcium sulphate'
    )
, 'must_contain', jsonb_build_array('calcium', 'sulfate')
    ),
    false,
    E'Calcium sulfate (CaSO₄); [1 mark — REJECT ''calcium sulfide'']\n\n**Examiner commentary:** Most candidates answered reasonably well. Some referred to ''sulfide'' instead of ''sulfate'' (wrong product).',
    E'**Acid + base → salt + water (neutralisation):**\n\nCa(OH)₂ + H₂SO₄ → **CaSO₄** + 2H₂O\n\n• Calcium hydroxide (alkali) + sulfuric acid → **calcium sulfate** + water\n\nName the salt from the ACID:\n• Hydrochloric acid → chloride\n• Sulfuric acid → **sulfate**\n• Nitric acid → nitrate\n• Phosphoric acid → phosphate\n\nDon''t write ''sulfide'' (that''s the S²⁻ ion, made by reacting with sulfur — different chemistry).',
    true
  );

  -- ─── Q4(d)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '4(d)(i)', 1, 'free',
    'fill_in',
    E'Silver chloride (AgCl) is an insoluble salt.\n\n**(d)(i)** Name the **method** used to prepare insoluble salts.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'precipitation',
        'Precipitation',
        'double decomposition',
        'ionic precipitation'
    )
    ),
    false,
    E'Precipitation / double decomposition; [1 mark]\n\n**Examiner commentary:** A lot of candidates struggled — referring to ''filtration'' and ''crystallisation'' instead of precipitation.',
    E'**Three ways to prepare salts:**\n• Soluble salt (acid + insoluble base) — react, then evaporate to crystallise\n• Soluble salt of Group I (acid + alkali) — titration, then evaporate\n• **Insoluble salt** — **PRECIPITATION**: mix two SOLUBLE solutions that contain the ions of the desired salt → insoluble salt drops out as a solid (filter it off)\n\nAlso called **double decomposition** (cations and anions swap partners).',
    true
  );

  -- ─── Q4(d)(ii)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '4(d)(ii)', 2, 'free',
    'fill_in',
    E'Silver chloride (AgCl) is an insoluble salt prepared by precipitation.\n\n**(d)(ii)** Suggest **two suitable starting materials** for preparing silver chloride. Format: ''''___ and ___''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'silver nitrate and sodium chloride',
        'silver nitrate and potassium chloride',
        'AgNO3 and NaCl',
        'AgNO3 and KCl',
        'silver nitrate, sodium chloride'
    )
, 'must_contain', jsonb_build_array('silver nitrate')
    ),
    false,
    E'1. Silver nitrate (AgNO₃); [1]\n2. Sodium chloride (NaCl) OR potassium chloride (KCl) — any soluble chloride; [1]\n\n**Examiner commentary:** Not well answered. Many candidates misread ''starting materials'' as ''starting apparatus'' (beaker, funnel, filter paper).',
    E'**For precipitation, mix two SOLUBLE compounds that contain the Ag⁺ and Cl⁻ ions:**\n\n• Need **Ag⁺** → from soluble silver salt: **silver nitrate (AgNO₃)** (silver salts are mostly insoluble except nitrate)\n• Need **Cl⁻** → from soluble chloride: **sodium chloride (NaCl)** or KCl\n\nReaction:\nAgNO₃ + NaCl → **AgCl ↓** (white precipitate) + NaNO₃ (stays in solution)\n\nFilter, wash, and dry the AgCl precipitate to get pure salt.\n\n⚠ NOT ''apparatus'' — the question asks for starting MATERIALS (chemicals).',
    true
  );

  -- ─── Q5(a)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '5(a)(i)', 1, 'free',
    'fill_in',
    E'A list of elements is shown:\n\n**zinc, copper, hydrogen, carbon, barium, calcium, magnesium, iron, aluminium, sodium**\n\n**(a)(i)** Identify a metal which **burns with a bright yellow flame**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'sodium',
        'Sodium',
        'Na'
    )
, 'must_contain', jsonb_build_array('sodium')
    ),
    false,
    E'Sodium; [1 mark]\n\n**Examiner commentary:** Fairly answered. Majority could not identify the metal.',
    E'**Sodium burns with a bright YELLOW (golden) flame.** Same colour as the flame test for sodium.\n\nNa + O₂ → Na₂O (sodium oxide)\n\nMemory: street lamps that look yellow-orange contain sodium vapour — same colour. Don''t confuse with potassium (lilac) or calcium (orange-red).',
    true
  );

  -- ─── Q5(a)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '5(a)(ii)', 1, 'free',
    'fill_in',
    E'A list of elements is shown:\n\n**zinc, copper, hydrogen, carbon, barium, calcium, magnesium, iron, aluminium, sodium**\n\n**(a)(ii)** Identify **the least reactive metal** in the list.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'copper',
        'Copper',
        'Cu'
    )
, 'must_contain', jsonb_build_array('copper')
    ),
    false,
    E'Copper; [1 mark]\n\n**Examiner commentary:** Very well answered.',
    E'**Reactivity series** (from list) — most reactive at TOP, least at BOTTOM:\n\nNa, Ca, Mg, Al, (C), Zn, Fe, (H), **Cu**\n\nBarium is also reactive (Group II like Ca). Hydrogen is a non-metal and carbon is non-metal too.\n\nAmong the METALS listed, **copper is the lowest** in the reactivity series → **least reactive** ✓. That''s why copper doesn''t react with dilute acids or water.',
    true
  );

  -- ─── Q5(a)(iii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '5(a)(iii)', 1, 'free',
    'fill_in',
    E'A list of elements is shown:\n\n**zinc, copper, hydrogen, carbon, barium, calcium, magnesium, iron, aluminium, sodium**\n\n**(a)(iii)** Identify the **non-metal component of steel**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'carbon',
        'Carbon',
        'C'
    )
, 'must_contain', jsonb_build_array('carbon')
    ),
    false,
    E'Carbon; [1 mark]\n\n**Examiner commentary:** Many candidates got this correct.',
    E'**Steel = iron + a small amount of CARBON** (and sometimes other elements).\n\nThe carbon content makes steel **harder and stronger** than pure iron:\n• Mild steel (~0.2% C) — used in cars, building structures\n• High-carbon steel (~1% C) — harder, used in tools, knives\n• Stainless steel — also contains chromium + nickel\n\nIron is the metal; carbon is the non-metal in the alloy.',
    true
  );

  -- ─── Q5(a)(iv)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '5(a)(iv)', 1, 'free',
    'fill_in',
    E'A list of elements is shown:\n\n**zinc, copper, hydrogen, carbon, barium, calcium, magnesium, iron, aluminium, sodium**\n\n**(a)(iv)** Identify a metal which is **extracted by reduction of its ore using carbon**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'iron',
        'zinc',
        'Iron',
        'Zinc',
        'Fe',
        'Zn'
    )
    ),
    false,
    E'Iron OR zinc; [1 mark]\n\n**Examiner commentary:** Many could identify the metal.',
    E'**Carbon reduces metal oxides** for metals BELOW carbon in the reactivity series:\n• **Iron** (blast furnace): Fe₂O₃ + 3C → 2Fe + 3CO ✓\n• **Zinc**: ZnO + C → Zn + CO ✓\n\nMetals ABOVE carbon (K, Na, Ca, Mg, Al) need ELECTROLYSIS instead — carbon isn''t reactive enough to displace them.\n\nMetals LIKE COPPER are often found native or are easy to extract by simple heating.',
    true
  );

  -- ─── Q5(a)(v)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '5(a)(v)', 1, 'free',
    'fill_in',
    E'A list of elements is shown:\n\n**zinc, copper, hydrogen, carbon, barium, calcium, magnesium, iron, aluminium, sodium**\n\n**(a)(v)** Identify a metal which is used to **galvanise iron**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'zinc',
        'Zinc',
        'Zn'
    )
, 'must_contain', jsonb_build_array('zinc')
    ),
    false,
    E'Zinc; [1 mark]\n\n**Examiner commentary:** Well performed.',
    E'**Galvanising** = coating iron/steel with a thin layer of **ZINC** to prevent rust.\n\nHow it protects:\n1. Physical barrier — zinc blocks air and water from reaching the iron\n2. **Sacrificial protection** — even if scratched, zinc is MORE reactive than iron, so it corrodes preferentially (zinc reacts instead of the iron)\n\nUsed for: roofing sheets, nails, buckets, fencing. The shiny grey coating is zinc.',
    true
  );

  -- ─── Q5(b)  [1 mark, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '5(b)', 1, 'paid',
    'free_text',
    E'A list of elements is shown:\n\n**zinc, copper, hydrogen, carbon, barium, calcium, magnesium, iron, aluminium, sodium**\n\n**(b)** Compare **one physical property** of metals and non-metals.',
    null,
    E'Any one COMPARISON (1 mark):\n• Metals have HIGH density / HIGH melting & boiling point / good conductors of heat & electricity / malleable / ductile / shiny;\n• while non-metals have LOW density / LOW m.p. & b.p. / poor conductors / brittle / dull;\n\n**Examiner commentary:** Fairly answered. Majority could not give a CLEAR COMPARISON between metals and non-metals.',
    E'Award 1 mark for ONE clear comparison (must contrast metals with non-metals — both halves needed). PENALISE answers that only describe metals OR only describe non-metals.',
    E'**Pick ONE property and compare both sides:**\n\n| Property | Metals | Non-metals |\n|---|---|---|\n| Density | High | Low |\n| Melting point | High | Low |\n| Conductivity | Good | Poor (insulators) |\n| Appearance | Shiny | Dull |\n| Malleability | Malleable | Brittle |\n\nExample answer: ''Metals have HIGH melting and boiling points while non-metals have LOW melting and boiling points.''\n\nKey: the answer MUST CONTRAST the two — describing only metals (or only non-metals) doesn''t score.',
    true
  );

  -- ─── Q5(c)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '5(c)(i)', 1, 'free',
    'fill_in',
    E'Aluminium is a widely used metal.\n\n**(c)(i)** Explain why a sample of aluminium can appear **LESS reactive than expected**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'protective oxide layer',
        'oxide layer protects it',
        'has a stable oxide layer',
        'aluminium has a protective oxide layer',
        'thin layer of aluminium oxide on the surface',
        'protective layer of aluminium oxide',
        'stable oxide layer prevents further reaction'
    )
, 'must_contain', jsonb_build_array('oxide')
    ),
    false,
    E'It forms a (thin, PROTECTIVE or STABLE) layer of aluminium oxide on its surface; [1 mark — ''protective'' or ''stable'' required]\n\n**Examiner commentary:** Not very well answered. A lot of candidates only referred to ''oxide layer'' without mentioning ''protective'' or ''stable''.',
    E'**Aluminium''s surprise:**\n\nAl is HIGH in the reactivity series (above Zn, Fe, even above carbon). It should react vigorously with air and water. BUT:\n\n• Air immediately reacts with the surface → forms a **thin, tough, PROTECTIVE layer of Al₂O₃** (aluminium oxide)\n• This layer is **stable** and **stops further reaction**\n• So Al APPEARS unreactive\n\nThis is why aluminium pans, window frames, drink cans don''t corrode — the invisible oxide layer protects everything underneath. Anodising thickens this layer for extra protection.',
    true
  );

  -- ─── Q5(c)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '5(c)(ii)', 1, 'free',
    'fill_in',
    E'Aluminium is extracted from its main ore by electrolysis.\n\n**(c)(ii)** Name the **main ore of aluminium**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'bauxite',
        'Bauxite'
    )
, 'must_contain', jsonb_build_array('bauxite')
    ),
    false,
    E'Bauxite; [1 mark — spelling matters]\n\n**Examiner commentary:** Majority misspelt ''bauxite''. Some confused with haematite (iron ore).',
    E'**Bauxite** = the main ore of aluminium. Mostly aluminium oxide (Al₂O₃) mixed with iron oxide and other impurities.\n\nAluminium is extracted from purified bauxite by **electrolysis** of molten Al₂O₃ (dissolved in cryolite, Na₃AlF₆, to lower the melting point):\n• At cathode: Al³⁺ + 3e⁻ → Al\n• At anode: 2O²⁻ → O₂ + 4e⁻\n\nDon''t confuse:\n• **Bauxite** → aluminium\n• Haematite → iron',
    true
  );

  -- ─── Q5(d)(i)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '5(d)(i)', 2, 'free',
    'fill_in',
    E'When zinc granules are added to aqueous copper(II) sulfate, a red-pink solid forms and the solution becomes colourless.\n\n**(d)(i)** Name the **red-pink solid** and the **colourless solution**. Format: ''''solid: ___; solution: ___''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'copper and zinc sulfate',
        'solid copper solution zinc sulfate',
        'copper, zinc sulfate',
        'Cu, ZnSO4'
    )
, 'must_contain', jsonb_build_array('copper', 'zinc sulfate')
    ),
    false,
    E'Red-pink solid: COPPER; [1]\nColourless solution: ZINC SULFATE; [1]\n[Total 2 marks]\n\n**Examiner commentary:** Poorly answered. Many couldn''t identify the type of reaction.',
    E'**Displacement reaction:**\n\nZn + CuSO₄ → ZnSO₄ + Cu\n\n• **Red-pink solid = COPPER metal** (Cu²⁺ is reduced to Cu⁰)\n• **Colourless solution = ZINC SULFATE** (Zn²⁺ ions are colourless, replacing the BLUE Cu²⁺ ions)\n\nThe colour change (blue → colourless) is a key clue that Cu²⁺ has been displaced from solution.',
    true
  );

  -- ─── Q5(d)(ii)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '5(d)(ii)', 2, 'paid',
    'free_text',
    E'When zinc granules are added to aqueous copper(II) sulfate, a red-pink solid forms and the solution becomes colourless.\n\n**(d)(ii)** Explain why a red-pink solid and a colourless solution are formed.',
    null,
    E'Both required (1 mark each):\n1. Zinc is MORE REACTIVE than copper;\n2. (So) zinc DISPLACES copper from its compound (copper sulfate);\n\n**Examiner commentary:** Many referred to ''zinc REPLACE copper'' instead of ''zinc DISPLACE copper'' (wrong word).',
    E'Award 1 mark for stating zinc is more reactive than copper, 1 mark for using the word DISPLACES (or ''displacement reaction''). PENALISE ''replace'' or vague ''reacts with''.',
    E'**Displacement rule:** A more reactive metal **DISPLACES** a less reactive metal from its compound.\n\n• Reactivity: Zn > Cu (zinc is higher in the series)\n• So **zinc displaces copper** from copper(II) sulfate\n• Zn becomes Zn²⁺ (dissolves into solution → zinc sulfate)\n• Cu²⁺ becomes Cu metal (deposits as red-pink solid)\n\nUse the exact word **DISPLACES** (or ''displacement'') — examiners reject ''replaces'' or ''swaps with''.',
    true
  );

  -- ─── Q5(d)(iii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '5(d)(iii)', 1, 'free',
    'fill_in',
    E'Zn + CuSO₄ → ZnSO₄ + Cu\n\n**(d)(iii)** In terms of changes in ionic charge, state which substance is **oxidised**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'zinc',
        'Zinc',
        'Zn'
    )
, 'must_contain', jsonb_build_array('zinc')
    ),
    false,
    E'Zinc (Zn → Zn²⁺ + 2e⁻; loses electrons → oxidised); [1 mark]\n\n**Examiner commentary:** Many candidates referred to ''zinc sulfate'' or ''zinc ions'' instead of zinc element itself.',
    E'**OIL RIG: Oxidation Is Loss (of electrons).**\n\nZn → Zn²⁺ + 2e⁻\n• Zinc goes from charge 0 to +2 → it LOSES 2 electrons → ZINC is **OXIDISED** ✓\n\nMeanwhile, Cu²⁺ → Cu (copper goes from +2 to 0 → gains 2 electrons → REDUCED).\n\nAnswer is ZINC (the element/atom), not zinc sulfate (the product) or zinc ions (the result).',
    true
  );

  -- ─── Q6(a)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '6(a)', 1, 'free',
    'fill_in',
    E'Ethanol is an alcohol. Alcohols are a ''family'' of organic compounds which have the same general formula.\n\n**(a)** What is the **name** given to any family of organic compounds with the same general formula and similar chemical properties?',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'homologous series',
        'Homologous series',
        'homologous',
        'homologue series'
    )
, 'must_contain', jsonb_build_array('homolog')
    ),
    false,
    E'Homologous series; [1 mark — spelling important]\n\n**Examiner commentary:** Candidates struggled with the spelling of ''homologous''.',
    E'**Homologous series** = a family of organic compounds where members:\n• Have the same general formula\n• Differ by a CH₂ unit\n• Have similar chemical properties (same functional group)\n• Have a gradual change in physical properties (boiling point, density)\n\nExamples: alkanes (CH₄, C₂H₆, C₃H₈ ...), alkenes, alcohols, carboxylic acids.\n\nSpell carefully: **homo-LOG-ous** (Greek root, like ''analog'').',
    true
  );

  -- ─── Q6(b)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '6(b)', 1, 'free',
    'fill_in',
    E'Ethanol is an alcohol. Alcohols are a ''family'' of organic compounds which have the same general formula.\n\n**(b)** Give the **general formula of alcohols**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'CnH2n+1OH',
        'CₙH₂ₙ₊₁OH',
        'CnH2n+1 OH'
    )
, 'must_contain', jsonb_build_array('OH')
    ),
    false,
    E'CₙH₂ₙ₊₁OH; [1 mark — correct answer only]\n\n**Examiner commentary:** Candidates found this very hard; many wrote the alkane formula instead.',
    E'**General formulas to memorise:**\n• Alkanes: **CₙH₂ₙ₊₂**\n• Alkenes: CₙH₂ₙ\n• **Alcohols: CₙH₂ₙ₊₁OH** ✓ (alkane minus one H, plus OH)\n• Carboxylic acids: CₙH₂ₙ₊₁COOH\n\nExamples:\n• n=1 → CH₃OH (methanol)\n• n=2 → C₂H₅OH (ethanol)\n• n=3 → C₃H₇OH (propanol)\n\nThe OH is the alcohol functional group.',
    true
  );

  -- ─── Q6(c)(i)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '6(c)(i)', 2, 'free',
    'fill_in',
    E'Ethanol is an alcohol. Alcohols are a ''family'' of organic compounds which have the same general formula.\n\nEthanol can be manufactured by the fermentation of glucose, C₆H₁₂O₆.\n\n**(c)(i)** State **two conditions** needed for the fermentation of glucose. Format: ''''___ and ___''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'yeast and 25-37 C',
        'yeast and 25-37 degrees',
        'yeast and temperature 25-37',
        'yeast, 25-37 degrees Celsius',
        'yeast and anaerobic conditions',
        'yeast and no oxygen',
        'yeast and warm temperature',
        'yeast, anaerobic'
    )
, 'must_contain', jsonb_build_array('yeast')
    ),
    false,
    E'1. Yeast / anaerobic (in absence of oxygen) — any one; [1]\n2. Temperature 25–37 °C; [1]\n\n**Examiner commentary:** Most candidates could only score one mark — they missed the correct temperature.',
    E'**Fermentation conditions (yeast turns glucose into ethanol):**\n\n1. **YEAST** — provides the enzymes (zymase) that catalyse the reaction\n2. **Temperature 25–37 °C** — warm enough for enzymes to work, but not so hot they denature\n3. Optional: **anaerobic** (no oxygen) — otherwise the yeast just respires aerobically and you get CO₂ + water, not alcohol\n\nGive ANY TWO. The temperature range is specifically 25–37 °C (body-temperature range — yeast is alive!).',
    true
  );

  -- ─── Q6(c)(ii)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '6(c)(ii)', 2, 'free',
    'fill_in',
    E'C₆H₁₂O₆ →  ......C₂H₅OH + ......\n\n**(c)(ii)** Complete and balance the chemical equation. Give the coefficient before C₂H₅OH AND the other product (with coefficient). Format: ''''2 C2H5OH + 2 CO2''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      '2 C2H5OH + 2 CO2',
        '2 ethanol + 2 CO2',
        '2 and 2 CO2',
        '2 C2H5OH + 2CO2'
    )
, 'must_contain', jsonb_build_array('2', 'CO2')
    ),
    false,
    E'C₆H₁₂O₆ → **2** C₂H₅OH + **2 CO₂**; [2 marks — 1 for CO₂ as product, 1 for correct balancing]\n\n**Examiner commentary:** Most candidates were able to complete and balance this equation.',
    E'**Fermentation equation:**\n\nC₆H₁₂O₆ (glucose) → **2** C₂H₅OH (ethanol) + **2 CO₂** (carbon dioxide)\n\n**Balance check:**\n• C: LHS 6, RHS 2(2) + 2(1) = 4 + 2 = 6 ✓\n• H: LHS 12, RHS 2(6) = 12 ✓\n• O: LHS 6, RHS 2(1) + 2(2) = 2 + 4 = 6 ✓\n\nThe other product is CO₂ — that''s the gas that makes bread rise, beer fizzy, and wine bubble during fermentation.',
    true
  );

  -- ─── Q6(d)(i)  [3 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '6(d)(i)', 3, 'paid',
    'free_text',
    E'Ethanol is an alcohol. Alcohols are a ''family'' of organic compounds which have the same general formula.\n\nThe diagram shows reactions of ethanol:\n• Excess oxygen → gas **A** + water\n• Heat with ethanoic acid (conc. H₂SO₄) → organic liquid **B** + water\n• Oxidation with acidified KMnO₄ → liquid **C**\n• Compound **D** + steam (with acid catalyst) → ethanol\n\n**(d)(i)** Give the names of **A**, **B** and **C**. Format: ''''A: ___; B: ___; C: ___''''.',
    '/past-papers/chemistry-nssco-2024-p2/ethanol-reactions.png',
    E'A — carbon dioxide (CO₂); [1]\nB — ethyl ethanoate; [1]\nC — ethanoic acid; [1]\n\n**Examiner commentary:** A lot of candidates struggled. Majority only got A (carbon dioxide).',
    E'Award 1 mark each: A = CO₂; B = ethyl ethanoate; C = ethanoic acid. Names only (formulas not required). Accept ''ethanal'' as alternative for partial oxidation but the full product is ethanoic acid.',
    E'**Three reactions of ethanol:**\n\n• **A — excess O₂ (combustion)**: C₂H₅OH + 3O₂ → 2**CO₂** + 3H₂O\n  → Gas A is **carbon dioxide** ✓\n\n• **B — heat with ethanoic acid + conc. H₂SO₄ (esterification)**:\n  CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O\n  → Liquid B is **ethyl ethanoate** (an ester with fruity smell)\n\n• **C — oxidation with KMnO₄**:\n  C₂H₅OH + [O] → CH₃COOH + H₂O\n  → Liquid C is **ethanoic acid** (vinegar)\n\nMemorise these three reaction pathways!',
    true
  );

  -- ─── Q6(d)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '6(d)(ii)', 1, 'free',
    'fill_in',
    E'Compound D + steam (with acid catalyst) → ethanol\n\n**(d)(ii)** Deduce the identity of **compound D**, which reacts with steam to form ethanol.',
    '/past-papers/chemistry-nssco-2024-p2/ethanol-reactions.png',
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'ethene',
        'Ethene',
        'C2H4',
        'C₂H₄',
        'ethylene'
    )
, 'must_contain', jsonb_build_array('ethene')
    ),
    false,
    E'Ethene (C₂H₄); [1 mark — REJECT ''ethane'' (the alkane)]\n\n**Examiner commentary:** Majority could not identify compound D — some referred to ''ethane''.',
    E'**Industrial production of ethanol from ethene (hydration):**\n\nC₂H₄ + H₂O (steam) → C₂H₅OH\n\n• Conditions: phosphoric acid catalyst, ~300 °C, 60-70 atm\n• Compound D = **ethene** (C₂H₄, the alkene)\n\nDon''t confuse:\n• **Ethene** (C₂H₄) — has a C=C double bond → can add water → ethanol ✓\n• Ethane (C₂H₆) — saturated alkane → DOESN''T react with steam\n\nThe alkene''s double bond is what makes hydration work.',
    true
  );

  -- ─── Q6(e)(i)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '6(e)(i)', 2, 'paid',
    'free_text',
    E'A simple sugar unit can be represented as a square with H–O– on the left and –O–H on the right (a hexose monomer). Simple sugars can be polymerised to make complex carbohydrates.\n\n**(e)(i)** Describe the **structure of part of a carbohydrate polymer** made from the simple sugar shown. Describe what the linkage between two monomers looks like and how the chain repeats.',
    '/past-papers/chemistry-nssco-2024-p2/sugar-monomer.png',
    E'Both required (1 mark each):\n1. **One oxygen linkage (-O-) between two squares** (sugar units) — water has been removed (condensation);\n2. **Rest of the structure correct** — at least TWO repeating units shown, with brackets indicating the repeat pattern;\n\n**Examiner commentary:** Performed poorly. Few candidates could draw the carbohydrate polymer.',
    E'Award 1 mark for showing the GLYCOSIDIC LINKAGE: a single oxygen (–O–) joining two adjacent sugar units (squares). Award 1 mark for showing the REPEATING pattern correctly — at least 2 monomer units linked. PENALISE: showing –O–H– between sugars; missing the bracket/repeat notation; showing only one monomer.',
    E'**How sugars polymerise (forming a polysaccharide like starch):**\n\nMonomer: H–O–[square]–O–H\n\nWhen TWO sugars join, they remove a water molecule (condensation):\n[square]–O–[square]–O–[square]– ... etc.\n\nDraw it like:\n\n  –[sq]–O–[sq]–O–[sq]–O–\n\nKey features:\n• Single oxygen bridge (**glycosidic linkage**) between each pair of sugar squares\n• Bracketed [unit]ₙ to show repeat\n• H₂O removed at each join\n\nExamples: starch (plant storage), glycogen (animal storage), cellulose (plant cell walls).',
    true
  );

  -- ─── Q6(e)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '6(e)(ii)', 1, 'free',
    'fill_in',
    E'A carbohydrate polymer is broken down into simple sugars.\n\n**(e)(ii)** Name the **chemical process** that breaks a carbohydrate polymer down into simple sugars.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'hydrolysis',
        'Hydrolysis',
        'hydrolysing'
    )
, 'must_contain', jsonb_build_array('hydroly')
    ),
    false,
    E'Hydrolysis; [1 mark]\n\n**Examiner commentary:** A good number answered correctly. Some referred to ''condensation polymerisation'' — the OPPOSITE.',
    E'**Hydrolysis** = breaking down a polymer by ADDING WATER.\n\n• ''Hydro-'' = water\n• ''-lysis'' = splitting / breaking\n\nCarbohydrate + H₂O → simple sugars (e.g. starch + water → maltose → glucose)\n\nOpposite process: **condensation polymerisation** (combines monomers + releases water) — that''s how the polymer was made in the first place.\n\nProteins → amino acids by hydrolysis too. Same chemistry.',
    true
  );

  -- ─── Q6(e)(iii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '6(e)(iii)', 1, 'free',
    'fill_in',
    E'Hydrolysis breaks a carbohydrate polymer into simple sugars.\n\n**(e)(iii)** What **conditions** are needed for hydrolysis to occur?',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'acid',
        'Acid',
        'enzyme',
        'amylase',
        'dilute acid',
        'enzymes',
        'acid or enzyme'
    )
    ),
    false,
    E'Acid (accept enzyme OR amylase); [1 mark]\n\n**Examiner commentary:** Performed poorly. More revision needed.',
    E'**Two ways to hydrolyse carbohydrates:**\n\n• **Acid hydrolysis** — heat with dilute acid (HCl) — non-specific, breaks any glycosidic bond\n• **Enzymatic hydrolysis** — specific enzymes like **amylase** (in saliva, breaks starch into maltose) or other carbohydrases\n\nAcid is the textbook answer; enzyme/amylase is also accepted.\n\nWhen you chew bread, amylase in your saliva starts hydrolysing the starch into sugars — that''s why bread starts tasting sweet if you chew it long enough!',
    true
  );

  -- ─── Q7(a)(i)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '7(a)(i)', 1, 'free',
    'fill_in',
    E'The air around us is a mixture of gases. Nitrogen, oxygen and other substances are found in clean dry air.\n\n**(a)(i)** Other than nitrogen and oxygen, give **another ELEMENT** found in clean, dry air.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'argon',
        'Argon',
        'Ar',
        'helium',
        'neon',
        'noble gas'
    )
    ),
    false,
    E'Argon (accept any Group 0 / noble gas); [1 mark — must be an ELEMENT, not a compound like CO₂]\n\n**Examiner commentary:** Poorly answered. Majority referred to ''carbon dioxide'' — which is NOT an element.',
    E'**Composition of dry air:**\n• ~78% **nitrogen** (N₂)\n• ~21% **oxygen** (O₂)\n• ~0.93% **ARGON** (Ar) ← the answer ✓\n• ~0.04% carbon dioxide (CO₂) — a COMPOUND, not an element\n• Trace amounts of other noble gases (Ne, He, Kr, Xe)\n• Variable: water vapour\n\nThe question asks for an ELEMENT (not a compound). The biggest non-N/O element is argon (~1%) — that''s why it''s the textbook answer.\n\n⚠ CO₂ is a compound (made of carbon AND oxygen) — doesn''t qualify.',
    true
  );

  -- ─── Q7(a)(ii)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '7(a)(ii)', 1, 'free',
    'fill_in',
    E'The air around us is a mixture of gases. Nitrogen, oxygen and other substances are found in clean dry air.\n\nNitrogen and oxygen can be separated from liquid air.\n\n**(a)(ii)** State the name of **this process** (separating gases from liquid air).',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'fractional distillation',
        'Fractional distillation',
        'fractional distillation of liquid air'
    )
, 'must_contain', jsonb_build_array('fractional')
    ),
    false,
    E'Fractional distillation; [1 mark]\n\n**Examiner commentary:** Only a small number gave the correct process.',
    E'**Fractional distillation of LIQUID air:**\n\n1. Air is filtered (remove dust)\n2. Cooled and compressed → becomes liquid at ~−200 °C\n3. Warmed slowly in a fractionating column\n4. Gases boil off at DIFFERENT temperatures:\n   • N₂ boils first at −196 °C\n   • Ar at −186 °C\n   • O₂ last at −183 °C\n\nResult: separated pure gases.\n\nSame process as separating crude oil — different liquids with different boiling points.',
    true
  );

  -- ─── Q7(b)  [1 mark, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '7(b)', 1, 'free',
    'fill_in',
    E'The air around us is a mixture of gases. Nitrogen, oxygen and other substances are found in clean dry air.\n\n**(b)** Give **one use of oxygen**.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'breathing',
        'respiration',
        'welding',
        'steel production',
        'sewage treatment',
        'combustion',
        'burning',
        'respiration in hospitals',
        'oxygen for breathing',
        'hospitals',
        'fuel cells'
    )
    ),
    false,
    E'Any one: breathing (in hospitals) / (aerobic) respiration / welding / steel production / sewage treatment / combustion / burning; [1 mark]\n\n**Examiner commentary:** Well answered.',
    E'**Uses of oxygen (O₂):**\n• **Breathing / respiration** — medical use, in hospitals (oxygen masks for patients)\n• **Steel production** — pure O₂ blown through molten iron to remove impurities (carbon, sulfur)\n• **Welding** — oxy-acetylene torches (very hot flames)\n• **Combustion** of fuels (every fire needs oxygen)\n• **Sewage treatment** — aerobic bacteria need O₂ to break down waste\n• Fuel cells\n\nAny ONE use scores the mark.',
    true
  );

  -- ─── Q7(c)(i)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '7(c)(i)', 2, 'free',
    'fill_in',
    E'Some pollutants in air are carbon monoxide and lead compounds.\n\n**(c)(i)** Give **one effect on health** of each:\n• Carbon monoxide\n• Lead compounds\n\nFormat: ''''CO: ___; lead: ___''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'CO suffocation lead brain damage',
        'carbon monoxide death lead brain damage',
        'CO: suffocation; lead: brain damage',
        'CO suffocation; lead compounds brain damage',
        'CO causes death lead causes brain damage'
    )
, 'must_contain', jsonb_build_array('brain')
    ),
    false,
    E'Carbon monoxide → suffocation / death (binds to haemoglobin, prevents O₂ transport); [1]\nLead compounds → brain damage / brain cancer; [1]\n\n**Examiner commentary:** Candidates struggled — many couldn''t give the effects.',
    E'**Health effects to memorise:**\n\n• **Carbon monoxide (CO)** — binds to haemoglobin (forming carboxyhaemoglobin) and BLOCKS O₂ transport in blood → **suffocation / death** ✓\n• **Lead compounds** (from petrol, paint, batteries) — **BRAIN damage** (especially in children — affects learning and development), also kidney damage, anaemia\n\nThese are the standard NSSCO answers — short and specific.',
    true
  );

  -- ─── Q7(c)(ii)  [2 marks, free, fill_in] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, correct, case_sensitive,
    memo, explanation, is_published
  ) values (
    chem_id, 2024, '2', '7(c)(ii)', 2, 'free',
    'fill_in',
    E'Sulfur dioxide is another pollutant which can be used for the manufacture of sulfuric acid (the Contact process).\n\n**(c)(ii)** State **two conditions** used in this industrial process. **Include units**. Format: ''''temperature ___ °C and pressure ___ atm''''.',
    null,
    jsonb_build_object(
      'accepted', jsonb_build_array(
      'temperature 400-500 C pressure 1-2 atm',
        '400-500 C and 1-2 atm',
        '400 C 1 atm',
        '450 C 2 atm',
        'temperature 450 degrees pressure 1 atm',
        'vanadium oxide catalyst and 450 C'
    )
    ),
    false,
    E'Any TWO of:\n• Temperature: 400-500 °C; [1]\n• Pressure: 1-2 atm OR 100-200 kPa; [1]\n• Catalyst: vanadium(V) oxide (V₂O₅);\n\n**Examiner commentary:** Candidates performed very well. A few missed the units.',
    E'**Contact process** — making sulfuric acid:\n\nKey step: 2SO₂ + O₂ ⇌ 2SO₃ (catalyst, exothermic)\n\nConditions:\n• **Temperature: 400–500 °C** (compromise — high enough for fast rate, low enough for good equilibrium yield since it''s exothermic)\n• **Pressure: 1–2 atm** (only slightly above atmospheric — pressure doesn''t help much here)\n• **Catalyst: Vanadium(V) oxide (V₂O₅)**\n\n⚠ Always include UNITS (°C and atm) — examiners deduct for missing units.',
    true
  );

  -- ─── Q7(c)(iii)  [2 marks, paid, free_text] ───
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, diagram_url, memo, rubric, explanation, is_published
  ) values (
    chem_id, 2024, '2', '7(c)(iii)', 2, 'paid',
    'free_text',
    E'The air around us is a mixture of gases. Nitrogen, oxygen and other substances are found in clean dry air.\n\n**(c)(iii)** Name **one other pollutant** present in air (NOT carbon monoxide, lead, or sulfur dioxide). State its **source**. Format: ''''pollutant: ___; source: ___''''.',
    null,
    E'Pollutant + source (1 mark each, paired):\n• Excess CO₂ — from burning fossil fuels;\n• Oxides of nitrogen (NOₓ) — from internal combustion engines / car exhausts;\n• Excess methane — from decomposition of vegetation / digestion of animals (cows);\n• Unburnt hydrocarbons — from vehicle exhaust fumes;\n• Solid particles (soot, particulates) — from burning of waste materials / diesel exhaust;\n\n**Examiner commentary:** Candidates struggled. Many gave CO, SO₂ or lead (already mentioned). Some described effects instead of sources.',
    E'Award 1 mark for naming a valid air pollutant (NOT one already given in part c). Award 1 mark for a correct source. PENALISE: pollutants already in the question (CO, lead compounds, SO₂); generic answers like ''cars cause pollution'' without naming a specific pollutant.',
    E'**Air pollutants and their sources (pick ONE pair):**\n\n• **Carbon dioxide (CO₂)** — from BURNING FOSSIL FUELS (greenhouse gas, climate change)\n• **Nitrogen oxides (NOₓ)** — from CAR EXHAUSTS / internal combustion engines (cause acid rain)\n• **Methane (CH₄)** — from DECOMPOSITION of vegetation / CATTLE DIGESTION (strong greenhouse gas)\n• **Unburnt hydrocarbons** — from VEHICLE EXHAUSTS (cause smog)\n• **Particulates (soot, dust)** — from BURNING WASTE / DIESEL ENGINES (respiratory disease)\n\nMatch pollutant → source in pairs. Don''t pick CO, SO₂, or lead — they''re already named in the question.',
    true
  );

  raise notice 'Inserted 56 sub-parts for Chemistry NSSCO 2024 Paper 2';
end $$;
