"""Build NSSCO Chemistry 2023 Paper 3 (Alternative to Practical) — 4 questions, 40 marks.

Verbatim NIED wording. Mark scheme + commentary from DNEA Examiners Report
2023 (Chemistry section, pages 102-105).
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2023-chem-p3"
PNG_DIR = ROOT / "public" / "past-papers" / "chemistry-nssco-2023-p3"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260525160000_chemistry_nssco_2023_p3.sql"

DIAGRAMS = {
    "cleaning-bottle":   ("page-02", 0.04, 0.26, 0.30, 0.62),
    "purification-abc":  ("page-02", 0.32, 0.50, 0.06, 0.92),
    "caco3-apparatus":   ("page-03", 0.06, 0.42, 0.12, 0.84),
    "tests-table-A":     ("page-07", 0.04, 0.56, 0.04, 0.94),
}


def durl(slug):
    return f"/past-papers/chemistry-nssco-2023-p3/{slug}.png" if slug else None


Q1_STEM = "Fig. 1.1 shows a container of a cleaning agent that contains ammonia and sand."
Q2_STEM = "Calcium carbonate reacts with dilute hydrochloric acid releasing carbon dioxide gas. Fig. 2.1 shows the set-up of the experiment. Large lumps of calcium carbonate were used. The volume of carbon dioxide produced was measured every 30 seconds for 240 seconds."
Q3_STEM = "Two solids, A and B, were analysed. Solid B is **lithium chloride**. Tests on solid A and their observations are summarised in the table on the question paper:\n• Appearance — blue crystals\n• Test 1 (heated gently until blue colour disappeared) — solid turned white, liquid droplets formed in the boiling tube\n• Test 2 (liquid droplets tested with universal indicator paper) — paper turned green\n• Test 3 (solution A + NaOH) — light blue precipitate, insoluble in excess\n• Test 4 (solution A + dilute nitric acid + barium nitrate) — white precipitate\n• Test 5 (flame test on solid A) — blue-green colour"
Q4_STEM = "Sodium thiosulfate reacts with dilute hydrochloric acid. Sulfur forms during this reaction and the mixture turns cloudy.\n\nNa₂S₂O₃(aq) + 2HCl(aq) → 2NaCl(aq) + 2H₂O(l) + SO₂(g) + S(s)\n\nMaterials provided:\n• 50 cm³ sodium thiosulfate of 0.25 mol/dm³ concentration\n• 50 cm³ sodium thiosulfate of 1.00 mol/dm³ concentration\n• dilute hydrochloric acid\n• 20 cm³ measuring cylinder\n• 2 × 250 cm³ conical flasks\n• 1 × stop-watch\n• 1 × A4 piece of paper with a cross marked on it"


QUESTIONS = [
    # ═══════════ Q1 — Cleaning agent (8 marks) ═══════════
    {
        "q": "1(a)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "cleaning-bottle",
        "prompt": "**(a)** Describe a **test** to show that the sample of the cleaning agent contains **ammonia**.\n\nGive both the test and the result. Format: ''test: ___; result: ___''.",
        "accepted": [
            "damp red litmus paper turns blue",
            "moist red litmus paper turns blue",
            "wet red litmus turns blue",
            "damp red litmus, turns blue",
            "test: damp red litmus paper; result: turns blue",
        ],
        "must_contain": ["litmus", "blue"],
        "memo": "Test: damp red litmus paper; [1]\nResult: turns blue; [1]",
        "examiner_note": "Fairly answered. Candidates should give full test + result. Refer to ANNEXE B (qualitative analysis) in the syllabus.",
        "explanation": "**Test for ammonia (NH₃) gas:**\n• Use **damp (moist) RED litmus paper**\n• If ammonia is present → **paper turns BLUE** (ammonia is alkaline)\n\nWhy damp? The water lets NH₃ dissolve and form NH₄OH, which is alkaline.\nWhy RED litmus? Red litmus turns blue with alkali (and alkalis turn it blue). Blue litmus turning red would mean acid — wrong direction.\n\nDifferent from test for chlorine (damp litmus BLEACHES) — read carefully which one is asked.",
    },
    {
        "q": "1(b)", "marks": 3, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM + "\n\nFig. 1.2 shows apparatus used to obtain pure water from the cleaning-agent mixture by distillation. A = a flame/burner, B = a round-bottomed flask, C = a long tube with water cooling.",
        "diagram": "purification-abc",
        "prompt": "**(b)** Name the apparatus **A**, **B** and **C** shown in Fig. 1.2.\n\nGive the three names in order separated by commas (e.g. ''Bunsen burner, round-bottom flask, Liebig condenser'').",
        "accepted": [
            "Bunsen burner round bottom flask Liebig condenser",
            "Bunsen burner, round-bottom flask, Liebig condenser",
            "Bunsen burner, round bottom flask, Liebig condenser",
            "bunsen, round bottom flask, liebig condenser",
            "Bunsen, round-bottomed flask, condenser",
        ],
        "must_contain": ["Bunsen", "flask", "condenser"],
        "memo": "A — Bunsen burner; B — round-bottom flask; C — Liebig condenser; [3 marks, 1 each]",
        "examiner_note": "Fairly answered. Some confused round-bottomed flask with conical flask. Others misspelt names.",
        "explanation": "**Distillation apparatus (left → right):**\n• **A — Bunsen burner**: provides the heat\n• **B — Round-bottom flask**: holds the liquid being distilled (round so it heats evenly)\n• **C — Liebig condenser**: long glass tube with cold water jacket; vapour from the flask passes through, cools, and condenses back to liquid\n\n⚠ Round-BOTTOM flask (not round-BOTTOMED — both accepted). NOT a conical flask (conical has a flat bottom, narrow neck).",
    },
    {
        "q": "1(c)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM, "diagram": "cleaning-bottle",
        "prompt": "**(c)** Explain how to obtain **pure sand** from the cleaning-agent mixture.",
        "memo": "All 3 marks (sequence):\n1. Filter (or decant) the mixture — sand is insoluble, stays as residue;\n2. Wash the residue (sand) with water — removes any remaining ammonia/dirt;\n3. Dry the sand (e.g. in a warm oven, on a watch glass, or in the sun);",
        "rubric": "Award 1 mark each: (1) FILTRATION/decanting to separate sand; (2) WASH the residue with water; (3) DRY the sand. PENALISE 'crystallisation' (wrong — sand doesn't crystallise, it's already a solid in the mixture); 'evaporate' alone without filtration; just 'separate'.",
        "examiner_note": "Many gained credit for filtration (1 of 3 marks). Many wrongly described CRYSTALLISATION — but sand is already a solid in the mixture, not formed by evaporation. Emphasise Topic 1 'Experimental techniques'.",
        "explanation": "**Three-step purification of insoluble solid:**\n\n1. **FILTER (or decant)** — pour mixture through filter paper. Sand is **insoluble** → stays on the filter as **residue**. The liquid (ammonia solution) passes through.\n2. **WASH** the residue with **distilled water** — rinses off any remaining ammonia solution clinging to the sand grains.\n3. **DRY** — leave in a warm oven / on a watch glass in the sun / blot with filter paper.\n\nNOT crystallisation — that's for getting solids out of solutions (and sand isn't dissolved here, it's a solid suspended in liquid).",
    },

    # ═══════════ Q2 — CaCO3 + HCl (14 marks) ═══════════
    {
        "q": "2(a)", "marks": 3, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": "caco3-apparatus",
        "prompt": "**(a)** Use the measuring-cylinder diagrams in Table 2.1 (at 0, 30, 60, 90, 120, 150, 180, 210, 240 seconds) to give the total volume of carbon dioxide produced (in cm³) at each time.\n\nGive the 9 values separated by commas (e.g. ''0, 13, 25, ...'').",
        "accepted": [
            "0 13 25 34 42 50 56 59 59",
            "0, 13, 25, 34, 42, 50, 56, 59, 59",
            "0,13,25,34,42,50,56,59,59",
        ],
        "must_contain": ["0", "59"],
        "memo": "0, 13, 25, 34, 42, 50, 56, 59, 59 cm³; [3 marks for all 9 correct; 2 for 6-8; 1 for 4-5]",
        "examiner_note": "Well answered. Some problems caused by inverted measuring cylinder diagrams (as in real life). Inconsistencies in precision and units in the table body.",
        "explanation": "**Reading inverted measuring cylinders:**\n\nThe cylinder is upside-down (collecting gas over water) → numbers run the opposite way! Read the level by looking at where the water meets the air.\n\nReadings at each time:\n• 0 s — cylinder full of water, no gas → **0 cm³**\n• 30 s — **13 cm³**\n• 60 s — **25 cm³**\n• 90 s — **34 cm³**\n• 120 s — **42 cm³**\n• 150 s — **50 cm³**\n• 180 s — **56 cm³**\n• 210 s — **59 cm³** (almost flat)\n• 240 s — **59 cm³** (reaction stopped)\n\nDon't include 'cm³' in each table cell — units go in the header.",
    },
    {
        "q": "2(b)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(b)** Describe how you would **plot a graph** of total volume of CO₂ (y-axis, 0-60 cm³) against time (x-axis, 0-240 s), and draw a line of best fit.\n\nDescribe: how you'd mark points, how you'd draw the line of best fit, and what shape it should be.",
        "memo": "All 3 marks:\n1. All 9 points correctly plotted within a small square (within 1 mm of the correct value);\n2. (Or 4-8 points = 1 mark; 6-8 = 2 marks)\n3. **Smooth CURVE** of best fit (thickness ≤ 1 mm) that balances the points;",
        "rubric": "Award marks for: (1) accurate plotting with SMALL crosses/dots (not 'blobs' > 1 mm); (2) a SMOOTH CURVE of best fit (not a straight line — the data curves over); (3) curve balances above/below points evenly. PENALISE blobs, dot-to-dot freehand, wobbly curves.",
        "examiner_note": "Fair share scored 1-2 marks. Smooth curve was rarely scored. Common errors: drawing a straight line of best fit when curve was needed; wobbly/wavy/feathery/kinky curves; dot-to-dot by freehand or ruler. Crosses scored better than dots.",
        "explanation": "**Three things examiners check:**\n\n1. **Plotting** — use small, sharp **crosses (×)** at each (time, volume) pair. Avoid 'blobs' — they cost the plotting mark.\n2. **Shape** — it's a **smooth CURVE** (the reaction rate slows down over time), NOT a straight line.\n3. **Best fit** — the curve should be SMOOTH (drawn in one motion, no wobbles) and pass close to (but not through every) point, balancing above/below.\n\nDon't 'connect the dots' — that's for joining specific points, not for showing a trend.",
    },
    {
        "q": "2(c)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM + "\n\naverage rate = (total volume of CO₂ produced / cm³) ÷ (time / s)",
        "diagram": None,
        "prompt": "**(c)** Calculate the **average rate** of this reaction for the first **100 seconds**. Show your working and give the correct unit.",
        "memo": "All 3 marks:\n1. Value of volume AT 100 s read from graph ≈ 37 cm³ (accept 35-39);\n2. Calculation: 37 / 100 = 0.37 (cm³/s);\n3. Unit: **cm³/s** (or cm³ s⁻¹);",
        "rubric": "Award 1 mark for correct GRAPH READING at t = 100 s (~37 cm³, accept 35-39); 1 mark for correct CALCULATION (divide that value by 100); 1 mark for UNIT (cm³/s or cm³ s⁻¹). PENALISE: adding table values instead of reading the graph at 100 s; missing unit.",
        "examiner_note": "Stronger candidates read the graph correctly at 100 s. Many MISINTERPRETED 'average' and added together all volume values from the table — this was not credited. The mark for the unit was fairly accessible.",
        "explanation": "**Step-by-step:**\n\n1. **Read** the graph at t = 100 s → volume ≈ **37 cm³** (between the 90 s value of 34 and the 120 s value of 42)\n\n2. **Calculate** using the formula given:\n   average rate = 37 cm³ ÷ 100 s = **0.37 cm³/s**\n\n3. **Unit** must be included: **cm³/s** (or cm³ s⁻¹).\n\n⚠ 'Average' does NOT mean adding all readings and dividing by 9. It means using the formula given. Read the graph at 100 s, divide by 100, add unit.",
    },
    {
        "q": "2(d)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(d)** State a reason why, eventually, **no more gas will be produced**.",
        "accepted": [
            "all the calcium carbonate will have reacted",
            "all the calcium carbonate is used up",
            "calcium carbonate has been used up",
            "all the acid will have reacted",
            "all the acid is used up",
            "all the reactants used up",
            "calcium carbonate finished",
            "one of the reactants is used up",
        ],
        "must_contain": [],
        "memo": "All the calcium carbonate has been used up / all the acid has been used up; [1 mark]",
        "examiner_note": "Common error: 'reaction is constant' or 'in equilibrium' — these imply the reaction is still going, so were NOT credited.",
        "explanation": "When the curve levels off (plateaus), **one of the reactants has been fully used up**. The reaction stops because there's nothing left to react.\n\n• In this question, **calcium carbonate** is the limiting reactant (acid is in excess) — so when all CaCO₃ has reacted, no more CO₂ is produced.\n\nDon't say 'reaction is constant' or 'reached equilibrium' — those suggest the reaction is still happening. The correct word is **'used up' / 'finished' / 'reacted completely'**.",
    },
    {
        "q": "2(e)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(e)** Suggest and explain the **effect on the rate of reaction** of using the **same mass of calcium carbonate POWDER** instead of large lumps.",
        "memo": "Both required (1 mark each):\n1. Faster reaction / increased rate;\n2. (Because) powder has a LARGER surface area (than lumps);",
        "rubric": "Award 1 mark for FASTER rate, 1 mark for LARGER SURFACE AREA (must be comparative — 'larger', 'more', not just 'has surface area'). Accept 'more particles exposed to acid → more collisions'.",
        "examiner_note": "Many gained credit for the qualitative comparison.",
        "explanation": "**Powder vs lumps (same total mass):**\n\nA POWDER has many small particles → **much larger total surface area** than the same mass as a few big lumps.\n\n• More surface → more acid particles can collide with the CaCO₃ → more frequent successful collisions → **faster rate of reaction**.\n• The TOTAL volume of CO₂ at the end stays the SAME (same mass of CaCO₃), but the reaction REACHES that level much sooner.\n\nUse comparative words: 'powder has LARGER surface area, so rate is FASTER'.",
    },
    {
        "q": "2(f)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(f)** A learner suggests that using a **gas syringe** to collect the gas instead of a measuring cylinder will **improve the accuracy** of the experiment.\n\nState whether you **agree or disagree** and **justify** your answer. Format: ''agree, [reason]''.",
        "accepted": [
            "agree, gas syringe is more precise",
            "agree, measuring cylinder less precise",
            "agree more accurate",
            "agree, no gas dissolves in water",
            "yes, gas syringe is more precise",
            "agree, gas syringe more precise",
            "agree, some CO2 dissolves in water in measuring cylinder",
        ],
        "must_contain": ["agree"],
        "memo": "Statement: AGREE (yes / true); [1]\nJustification: measuring cylinder is less precise / some CO₂ may dissolve in water in measuring cylinder method; [1]",
        "examiner_note": "Best-answered part of the paper — most agreed. Justification was demanding — only the best responses mentioned precision OR dissolution.",
        "explanation": "**Agree** — gas syringes give more accurate readings:\n\n1. **Precision**: Gas syringes can read to **1 cm³** (or finer) directly. Inverted measuring cylinders often have larger graduations and the meniscus reading is harder.\n\n2. **No gas loss to water**: CO₂ is **slightly soluble in water** — so when collected over water (measuring cylinder method), some CO₂ dissolves and isn't counted → volume reading is too low. A gas syringe captures everything.\n\nEither reason gets the justification mark.",
    },

    # ═══════════ Q3 — Tests on solids A and B (10 marks) ═══════════
    {
        "q": "3(a)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": "tests-table-A",
        "prompt": "**(a)** Test 1 states the solid should be heated gently first. In terms of **safety**, explain why it is necessary to heat gently at first.",
        "accepted": [
            "solid spits out of the tube",
            "to prevent the solid spitting out",
            "tube might crack",
            "tube might break",
            "to prevent the test tube cracking",
            "to prevent the test-tube from breaking due to thermal shock",
            "stops the solid from spitting",
        ],
        "must_contain": [],
        "memo": "Solid might spit out of the tube / tube might crack (from thermal shock); [1 mark]",
        "examiner_note": "Many candidates referred to the test tube or the contents of the test tube.",
        "explanation": "**Safety reason for heating GENTLY first:**\n\n• Sudden strong heating causes **thermal shock** → the glass test tube can **crack/break**\n• Sudden expansion of trapped water vapour can cause the solid to **spit out** dangerously\n\nGentle heating = even expansion + controlled water release. Once safe, strong heating can follow.",
    },
    {
        "q": "3(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": "tests-table-A",
        "prompt": "**(b)** Test 2: universal indicator paper turned **green** when liquid droplets from the boiling tube were tested.\n\nIdentify the **liquid** being tested.",
        "accepted": ["water", "Water", "H2O"],
        "must_contain": [],
        "memo": "Water; [1 mark]",
        "examiner_note": "Generally well answered.",
        "explanation": "Universal indicator **turns GREEN at pH 7** = **NEUTRAL**.\n\nThe only common neutral liquid is **water (H₂O)**.\n\nContext: blue crystals (CuSO₄·5H₂O) lose their water of crystallisation when heated:\nCuSO₄·5H₂O → CuSO₄ + 5H₂O\n\nThe 'liquid droplets' are this water collecting on the cool upper part of the boiling tube.",
    },
    {
        "q": "3(c)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": "tests-table-A",
        "prompt": "**(c)** Identify **solid A**.\n\nGive the cation and the anion (or full chemical name).",
        "accepted": [
            "copper sulfate",
            "copper(II) sulfate",
            "Cu2+ and SO4 2-",
            "copper(II) sulfate (CuSO4)",
            "CuSO4",
            "hydrated copper sulfate",
            "copper sulphate",
        ],
        "must_contain": ["copper", "sulfate"],
        "memo": "Copper / Cu²⁺ [1]; Sulfate / SO₄²⁻ [1]; [Total 2 marks]\n\n→ Solid A = copper(II) sulfate (CuSO₄) — the blue crystals were the hydrated form, CuSO₄·5H₂O.",
        "examiner_note": "Fair. Most candidates scored at least 1 mark, usually for the copper part.",
        "explanation": "**Putting the clues together:**\n\n• Blue crystals → contains **Cu²⁺** (copper ions are blue in solution)\n• On heating turns white → was hydrated (the blue→white change is classic for CuSO₄·5H₂O → CuSO₄)\n• Solution + NaOH → light blue precipitate (Cu(OH)₂, insoluble in excess) → confirms **Cu²⁺**\n• Solution + nitric acid + barium nitrate → white precipitate (BaSO₄) → confirms **sulfate (SO₄²⁻)**\n• Flame test blue-green → confirms copper\n\n→ **Solid A = copper(II) sulfate, CuSO₄** (the hydrated crystals are CuSO₄·5H₂O).",
    },
    {
        "q": "3(d)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM + "\n\nThe container of nitric acid is labelled CORROSIVE.",
        "diagram": None,
        "prompt": "**(d)** State **one safety precaution** when using nitric acid.",
        "accepted": [
            "wear gloves",
            "wear protective gloves",
            "wear goggles",
            "wear safety goggles",
            "avoid skin contact",
            "wear lab coat",
            "do not taste",
            "avoid contact with skin",
            "use a fume hood",
        ],
        "must_contain": [],
        "memo": "Any one: avoid contact with skin / wear (protective) gloves; avoid getting in eyes / wear goggles; avoid smelling, drinking or tasting; [1 mark]",
        "examiner_note": "—",
        "explanation": "**Safety precautions when using corrosive substances:**\n\n• **Wear safety goggles** — protect eyes (corrosives cause blindness if splashed)\n• **Wear protective gloves** — avoid skin contact (causes chemical burns)\n• **Wear lab coat** — protect clothes/skin\n• **Use a fume hood** — avoid breathing fumes\n• Never **taste** or **smell directly**\n\nName any ONE precaution. Be specific — 'be careful' or 'wear PPE' is too vague.",
    },
    {
        "q": "3(e)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM + "\n\nSolid B is lithium chloride.",
        "diagram": None,
        "prompt": "**(e)** Describe the **appearance of solid B**.",
        "accepted": ["white", "white solid", "white crystals", "white crystalline solid"],
        "must_contain": ["white"],
        "memo": "White (solid / crystals); [1 mark]",
        "examiner_note": "Very poorly answered. Candidates not familiar with the appearance of substances. (Similar issue in 2022 with copper carbonate.)",
        "explanation": "**Most ionic solids of Group 1 (Li, Na, K, etc.) are WHITE.**\n\nLithium chloride (LiCl) is a **white crystalline solid** at room temperature.\n\nGeneral rule: salts of metals from Group 1 are usually white (unless they contain a coloured anion like permanganate or chromate). Transition metal salts (Cu, Fe, Cr) are typically coloured.",
    },
    {
        "q": "3(f)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM + "\n\nDistilled water was added to solid B and shaken to make solution B. To the first portion of solution B, an excess of aqueous sodium hydroxide was added.",
        "diagram": None,
        "prompt": "**(f)(i)** What is observed when excess NaOH is added to solution B?",
        "accepted": [
            "no reaction",
            "no change",
            "stays the same",
            "no observable reaction",
            "nothing happens",
            "no visible change",
            "solution remains colourless",
        ],
        "must_contain": [],
        "memo": "No reaction / no change / stays the same; [1 mark]",
        "examiner_note": "Candidates find negative tests challenging. Many gave a positive result for chloride ions instead.",
        "explanation": "**NaOH test is for METAL CATIONS** (forms coloured precipitates with transition metals, white with Al/Zn/Ca, etc.).\n\n**Lithium (Li⁺) is a Group 1 cation → LiOH is SOLUBLE → no precipitate forms.**\n\nSo: **no reaction / no visible change** when NaOH is added to LiCl solution.\n\nThis is a NEGATIVE test result — that's also useful information (it rules out transition metals, Al, Mg, Ca, etc.).",
    },
    {
        "q": "3(f)(ii)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM + "\n\nTo the second portion of solution B, dilute nitric acid and aqueous silver nitrate were added.",
        "diagram": None,
        "prompt": "**(f)(ii)** What is observed when dilute nitric acid + aqueous silver nitrate are added to solution B? Describe the appearance (colour + state).",
        "accepted": [
            "white precipitate",
            "white ppt",
            "white precipitate forms",
            "a white precipitate forms",
            "white precipitate of silver chloride",
        ],
        "must_contain": ["white", "precipitate"],
        "memo": "Colour: WHITE [1]; State: PRECIPITATE / ppt [1]; [2 marks]",
        "examiner_note": "Best responses identified white precipitate. Some gave random precipitate colours from ANNEXE B without thought.",
        "explanation": "**Test for CHLORIDE ions (Cl⁻):**\n• Acidify with dilute nitric acid (prevents false positives)\n• Add aqueous **silver nitrate (AgNO₃)**\n• **WHITE PRECIPITATE** of silver chloride (AgCl) → positive test ✓\n\nLiCl dissolves to give Li⁺ + Cl⁻. The Cl⁻ reacts with Ag⁺ → AgCl ↓ white.\n\nOther halides for comparison:\n• Cl⁻ → white AgCl\n• Br⁻ → cream AgBr\n• I⁻ → yellow AgI",
    },
    {
        "q": "3(g)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM + "\n\nA flame test was carried out on solid B (lithium chloride).",
        "diagram": None,
        "prompt": "**(g)** Give the **observed flame colour**.",
        "accepted": ["red", "red flame", "crimson", "crimson red"],
        "must_contain": ["red"],
        "memo": "Red (flame); [1 mark]",
        "examiner_note": "Only a handful gave an acceptable colour. Some confused gas tests with flame tests, or guessed from the full range of flame colours.",
        "explanation": "**Flame test colours for Group 1 + 2 metals:**\n• Lithium (Li⁺) — **RED / CRIMSON** ✓\n• Sodium (Na⁺) — yellow/orange\n• Potassium (K⁺) — lilac/purple\n• Calcium (Ca²⁺) — orange-red / brick red\n• Barium (Ba²⁺) — green\n• Copper (Cu²⁺) — blue-green\n\n**Lithium → RED.** Don't confuse with calcium (also reddish, but more orange-brick).",
    },

    # ═══════════ Q4 — Planning experiment (8 marks) ═══════════
    {
        "q": "4", "marks": 8, "tier": "paid", "type": "free_text",
        "stem": Q4_STEM, "diagram": None,
        "prompt": "Plan an experiment to investigate whether the **speed of reaction** between sodium thiosulfate and dilute hydrochloric acid depends on the **concentration of sodium thiosulfate**.\n\nIn your plan describe:\n• the method (steps) and apparatus\n• the measurements you take\n• the variables you control\n• how you use your results to reach a conclusion",
        "memo": (
            "Up to 8 marks (M1-M8):\n\n"
            "**Method:**\n"
            "• M1 — pour SODIUM THIOSULFATE into a conical flask;\n"
            "• M2 — place the conical flask on the A4 paper with the cross marked on it;\n"
            "• M3 — add a measured volume of HYDROCHLORIC ACID to the conical flask;\n\n"
            "**Measurements:**\n"
            "• M4 — measure the VOLUME of hydrochloric acid using a measuring cylinder;\n"
            "• M5 — measure the TIME taken for the cross to DISAPPEAR using a stopwatch;\n"
            "• M6 — REPEAT with sodium thiosulfate of the DIFFERENT (other) concentration;\n\n"
            "**Variables to control:**\n"
            "• M7 — keep the VOLUME of hydrochloric acid the SAME in both runs;\n\n"
            "**Conclusion:**\n"
            "• M8 — compare the time taken for the cross to disappear at each concentration; if the higher concentration of thiosulfate gives a SHORTER time, then the rate is HIGHER at higher concentration (so rate depends on concentration);"
        ),
        "rubric": (
            "Award up to 8 marks for a complete plan covering: METHOD (use thiosulfate + flask + cross + add acid), "
            "MEASUREMENTS (volume of acid + time for cross to disappear + repeat at other concentration), "
            "CONTROLS (volume of acid kept constant), "
            "CONCLUSION (compare times → relate to concentration trend). "
            "PENALISE: putting paper inside the flask; using paper for chromatography (wrong context); "
            "not REPEATING at second concentration; saying 'amount' instead of 'volume'."
        ),
        "examiner_note": "Mixed performance. At better centres, candidates gave well-sequenced descriptions with clear diagrams (up to full marks). At others, candidates didn't understand the A4 paper's role (it goes UNDER the flask to view the cross through the contents) or weren't familiar with rates. Some confused it with paper chromatography (from 2022). Most common marks: pouring acid + thiosulfate into flasks.",
        "explanation": (
            "**The classic 'disappearing cross' experiment** for measuring reaction rate:\n\n"
            "**Method:**\n"
            "1. Pour 50 cm³ of sodium thiosulfate (0.25 mol/dm³) into a conical flask.\n"
            "2. Place the conical flask **on top of** the A4 paper with the cross marked on it — you'll look DOWN through the flask at the cross.\n"
            "3. Add a measured volume of dilute HCl (e.g. 10 cm³) using a measuring cylinder. Start the stopwatch immediately.\n"
            "4. Stop the stopwatch when the cross **disappears from view** (because sulfur has clouded the solution).\n\n"
            "**Measurements:**\n"
            "• Volume of HCl (using 20 cm³ measuring cylinder)\n"
            "• Time for cross to disappear (stopwatch)\n\n"
            "**Repeat** with 50 cm³ of the 1.00 mol/dm³ thiosulfate (a different concentration).\n\n"
            "**Variables to KEEP THE SAME** (controls):\n"
            "• Volume of HCl\n"
            "• Volume of thiosulfate\n"
            "• Temperature\n"
            "• Same person watching the cross\n\n"
            "**Conclusion:**\n"
            "• Compare the two times. Shorter time = faster reaction.\n"
            "• If the **higher concentration gives the shorter time**, then rate **does depend** on concentration of thiosulfate (higher concentration → more particles → more collisions → faster rate)."
        ),
    },
]


def _flatten_to_white(img):
    if img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        return bg
    return img.convert("RGB")


def extract_diagrams():
    PNG_DIR.mkdir(parents=True, exist_ok=True)
    for slug, (page_name, y_top, y_bot, x_left, x_right) in DIAGRAMS.items():
        page_path = PAGES_DIR / f"{page_name}.png"
        if not page_path.exists():
            print(f"  {slug}: missing"); continue
        img = _flatten_to_white(Image.open(page_path))
        W, H = img.size
        crop = img.crop((int(W * x_left), int(H * y_top), int(W * x_right), int(H * y_bot)))
        out = PNG_DIR / f"{slug}.png"
        crop.save(out, optimize=True)
        print(f"  {slug:22s} {crop.size[0]}x{crop.size[1]}")


def sql_escape(s):
    if s is None: return "null"
    s = s.replace("\\", "\\\\").replace("'", "''").replace("\n", "\\n")
    return f"E'{s}'"


def build_prompt(q):
    stem = q.get("stem", "")
    return (stem + "\n\n" + q["prompt"]) if stem else q["prompt"]


def build_full_memo(q):
    memo = q.get("memo", ""); note = q.get("examiner_note", "")
    return memo + "\n\n**Examiner commentary:** " + note if note else memo


def build_correct_jsonb(q):
    parts = ["'accepted', jsonb_build_array("]
    accepted_strs = ",\n        ".join(f"'{a.replace(chr(39), chr(39)*2)}'" for a in q.get("accepted", []))
    parts.append("      " + accepted_strs)
    parts.append("    )")
    mc = q.get("must_contain")
    if mc:
        mc_strs = ", ".join(f"'{m.replace(chr(39), chr(39)*2)}'" for m in mc)
        parts.append(f", 'must_contain', jsonb_build_array({mc_strs})")
    return "jsonb_build_object(\n      " + "\n".join(parts) + "\n    )"


def emit_sql():
    out = []
    out.append("-- " + "=" * 75)
    out.append(f"-- NSSCO Chemistry 2023 Paper 3 (6117/3) — Alt to Practical, 4 questions, {len(QUESTIONS)} sub-parts, 40 marks")
    out.append("-- Verbatim NIED wording. Mark scheme + commentary from")
    out.append("-- DNEA Examiners Report 2023 (Chemistry section, pages 102-105).")
    out.append("-- " + "=" * 75)
    out.append("")
    out.append("do $$")
    out.append("declare")
    out.append("  chem_id uuid;")
    out.append("begin")
    out.append("  select id into chem_id from public.subjects where slug = 'chemistry' limit 1;")
    out.append("  if chem_id is null then raise notice 'Chemistry subject not found'; return; end if;")
    out.append("")
    for q in QUESTIONS:
        diagram_url = "null" if not q.get("diagram") else f"'{durl(q['diagram'])}'"
        prompt = build_prompt(q); memo = build_full_memo(q)
        mw = "mark" if q["marks"] == 1 else "marks"
        out.append(f"  -- ─── Q{q['q']}  [{q['marks']} {mw}, {q['tier']}, {q['type']}] ───")
        out.append("  insert into public.past_paper_questions (")
        out.append("    subject_id, paper_year, paper_no, q_number, marks, tier,")
        if q["type"] == "fill_in":
            out.append("    type, prompt, diagram_url, correct, case_sensitive,")
            out.append("    memo, explanation, is_published")
            out.append("  ) values (")
            out.append(f"    chem_id, 2023, '3', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'fill_in',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {build_correct_jsonb(q)},")
            out.append(f"    false,")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        else:
            out.append("    type, prompt, diagram_url, memo, rubric, explanation, is_published")
            out.append("  ) values (")
            out.append(f"    chem_id, 2023, '3', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'free_text',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['rubric'])},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        out.append("")
    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} sub-parts for Chemistry NSSCO 2023 Paper 3';")
    out.append("end $$;")
    MIGRATION_PATH.parent.mkdir(parents=True, exist_ok=True)
    MIGRATION_PATH.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"\nWrote migration: {MIGRATION_PATH.relative_to(ROOT)}  ({len(QUESTIONS)} rows)")


if __name__ == "__main__":
    print(f"Extracting {len(DIAGRAMS)} diagrams:")
    extract_diagrams()
    emit_sql()
    by_q = {}
    for q in QUESTIONS:
        main_q = q["q"].split("(")[0]
        by_q.setdefault(main_q, 0); by_q[main_q] += q["marks"]
    print(f"\nMarks per question: {by_q}")
    print(f"Total: {sum(q['marks'] for q in QUESTIONS)} marks across {len(QUESTIONS)} sub-parts")
