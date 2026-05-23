"""Build NSSCO Chemistry 2023 Paper 1 — 40 MCQ questions, 40 marks.

Verbatim NIED wording from the question paper PDF. Official answer key + per-question
commentary from the DNEA Examiners Report 2023 (Chemistry section, pages 95-96).

Outputs:
  - public/past-papers/chemistry-nssco-2023-p1/q{N}-{slug}.png
  - supabase/migrations/{ts}_chemistry_nssco_2023_p1.sql

Run:
  PYTHONIOENCODING=utf-8 python scripts/build_2023_chem_p1.py
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2023-chem-p1"
PNG_DIR = ROOT / "public" / "past-papers" / "chemistry-nssco-2023-p1"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260525140000_chemistry_nssco_2023_p1.sql"

QUESTIONS = [
    # ── Q1: states of matter (diagram) ──
    {
        "q": "1", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Diagrams 1, 2 and 3 represent particle arrangements in three states of matter (1 = solid, 2 = liquid, 3 = gas).\n\nWhich statement correctly compares the kinetic energy of particles?",
        "options": [
            ("a", "1 has higher kinetic energy than 2"),
            ("b", "2 has lower kinetic energy than both 1 and 3"),
            ("c", "2 has higher kinetic energy than 3"),
            ("d", "3 has higher kinetic energy than both 1 and 2"),
        ],
        "commentary": "D — 3 has higher kinetic energy than both 1 and 2 [1 mark]. 72.4% chose the correct option.",
        "explanation": "The three diagrams show:\n• 1 = solid (tightly packed lattice)\n• 2 = liquid (close but disordered)\n• 3 = gas (far apart, fast moving)\n\nKinetic energy of particles increases **solid → liquid → gas**:\n• Solids vibrate in fixed positions (least KE)\n• Liquids slide past each other (more KE)\n• Gases zoom around freely (most KE)\n\nSo diagram **3 (gas)** has higher KE than BOTH 1 (solid) and 2 (liquid). Answer = **D**.",
        "diagram": ("page-02", 0.06, 0.16, 0.18, 0.80, "states-of-matter"),
    },
    # ── Q2: chromatography (text only) ──
    {
        "q": "2", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "A certain food colouring contains a dissolved mixture of red and yellow dyes.\n\nIt is suspected that the mixture was contaminated with a third dye **X**.\n\nWhich method could be used to investigate the presence of the third dye?",
        "options": [("a", "chromatography"), ("b", "distillation"), ("c", "evaporation"), ("d", "filtration")],
        "commentary": "A — chromatography [1 mark]. Very well answered (87.1%).",
        "explanation": "**Chromatography** is the standard technique for **separating mixtures of dissolved coloured substances** (dyes, inks, plant pigments).\n\n• How: dot the mixture onto chromatography paper, dip the bottom in solvent → different dyes travel up at different rates → separate spots.\n• If THREE separate spots appear (not the expected two), there's a third dye.\n\nThe others don't separate dyes:\n• Distillation — separates liquids by boiling point\n• Evaporation — removes solvent, leaves all dyes mixed\n• Filtration — separates solid from liquid",
        "diagram": None,
    },
    # ── Q3: diffusion hot vs cold water (diagram) ──
    {
        "q": "3", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "A tea bag was added to each of the beakers shown in the diagram. One beaker contained hot water and the other beaker contained cold water. In both beakers the colour spreads out.\n\nWhich result and explanation are correct?",
        "options": [
            ("a", "colour spreads faster in cold water — particles move faster at a higher temperature"),
            ("b", "colour spreads slower in cold water — particles move slower at a higher temperature"),
            ("c", "colour spreads faster in hot water — particles move faster at a higher temperature"),
            ("d", "colour spreads slower in hot water — particles move slower at a higher temperature"),
        ],
        "commentary": "C [1 mark]. Very well answered (93.1%). Majority recognised colour spreads faster in hot water with the correct explanation.",
        "explanation": "**Diffusion is faster at higher temperatures** because particles have more kinetic energy and move faster.\n\nAt higher temperature:\n• Water molecules move faster\n• Dye molecules also move faster\n• → dye spreads through the water MORE quickly\n\nSo: hot water → faster spreading + correct reason = **C**.\n\nB and D incorrectly state particles move slower at higher temperature — that's the opposite of reality.",
        "diagram": ("page-02", 0.50, 0.68, 0.18, 0.78, "tea-bag-diffusion"),
    },
    # ── Q4: nucleons (text only) ──
    {
        "q": "4", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "Which expression gives the number of **nucleons** in ⁽ᴬ⁾Xᴢ (mass number A, atomic number Z)?",
        "options": [("a", "A"), ("b", "Z"), ("c", "A – Z"), ("d", "Z – A")],
        "commentary": "A [1 mark]. Poorly answered — only 31.6% chose correctly. Many candidates confused nucleons with neutrons.",
        "explanation": "Key definitions for atomic notation `ᴬZX`:\n• **Z** (atomic number) = number of **protons**\n• **A** (mass number / nucleon number) = number of **nucleons** = protons + neutrons\n• Number of **neutrons** = A − Z\n• Number of **electrons** = Z (for a neutral atom)\n\n**Nucleons = protons + neutrons = A.** That's the definition of mass number.\n\nIf you read 'neutrons' you'd pick C (A−Z). The question said NUCLEONS = total particles in nucleus = **A**.",
        "diagram": None,
    },
    # ── Q5: Group V atomic structure (text only) ──
    {
        "q": "5", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "An element Y is in **Group V** of the Periodic Table.\n\nWhich of the following is true about the atomic structure of element Y?",
        "options": [
            ("a", "It has 5 occupied shells."),
            ("b", "It has 5 electrons in the outer shell."),
            ("c", "It has 5 protons in its nucleus."),
            ("d", "It has 5 neutrons in its nucleus."),
        ],
        "commentary": "B [1 mark]. Well answered (80.2%). Candidates linked group number to outer-shell electrons.",
        "explanation": "**Group number = number of electrons in the outer shell** (for main-group elements I–VII).\n\n• Group I → 1 outer electron (Na, K, Li)\n• Group II → 2 outer electrons\n• ...\n• **Group V → 5 outer electrons** ✓ (e.g. nitrogen, phosphorus)\n• Group VII → 7 outer electrons (halogens)\n\nNot related to group number: total shells (depends on period), protons (depends on element), or neutrons (varies by isotope).",
        "diagram": None,
    },
    # ── Q6: soluble hydroxide (text only) ──
    {
        "q": "6", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Which metal forms a hydroxide which is **very soluble** in water?",
        "options": [("a", "calcium"), ("b", "copper"), ("c", "lithium"), ("d", "magnesium")],
        "commentary": "C — lithium [1 mark]. Very poorly answered. Candidates wrongly chose A (calcium hydroxide — only slightly soluble). They failed to recognise that lithium is in Group I and Group I forms soluble hydroxides.",
        "explanation": "Solubility of metal hydroxides:\n• **Group I hydroxides (LiOH, NaOH, KOH)** → very SOLUBLE — strongly alkaline ✓\n• Group II hydroxides:\n  - Ca(OH)₂ — slightly soluble (limewater)\n  - Mg(OH)₂ — almost insoluble (milk of magnesia)\n• Transition metal hydroxides like Cu(OH)₂ → INSOLUBLE (blue precipitate)\n\nLithium is in Group I → very soluble hydroxide.",
        "diagram": None,
    },
    # ── Q7: bromine colour + state (text only) ──
    {
        "q": "7", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "Bromine is found in Group VII of the Periodic Table.\n\nWhich row is true about the colour and the physical state of bromine at room temperature?",
        "options": [
            ("a", "red-brown — solid"),
            ("b", "red-brown — liquid"),
            ("c", "yellow-green — gas"),
            ("d", "yellow-green — liquid"),
        ],
        "commentary": "B [1 mark]. Poorly answered (40.7%). Many chose C, confusing bromine with chlorine.",
        "explanation": "Halogens at room temperature:\n• Fluorine (F₂) — pale yellow GAS\n• Chlorine (Cl₂) — yellow-green GAS\n• **Bromine (Br₂) — red-brown LIQUID** ✓ (only non-metal liquid at r.t.)\n• Iodine (I₂) — grey-black SOLID (sublimes to purple vapour)\n\nMemory hook: 'Bromine is brown and runs' (red-brown liquid). Don't mix it up with chlorine (yellow-green gas).",
        "diagram": None,
    },
    # ── Q8: alloy (text only) ──
    {
        "q": "8", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "Which name is given to mixtures of a metal with other metals?",
        "options": [("a", "alloy"), ("b", "compound"), ("c", "element"), ("d", "ore")],
        "commentary": "A — alloy [1 mark]. Very well answered (80.2%).",
        "explanation": "Key terms:\n• **Alloy** — a MIXTURE of two or more metals (or metal + small amount of non-metal). Examples: brass (Cu+Zn), steel (Fe+C), bronze (Cu+Sn) ✓\n• Compound — two or more elements CHEMICALLY bonded (e.g. NaCl)\n• Element — single type of atom (e.g. iron, oxygen)\n• Ore — rock containing a metal compound that's worth extracting (e.g. haematite for iron)\n\nAlloys are MIXTURES, not compounds — atoms are not chemically bonded, just mixed.",
        "diagram": None,
    },
    # ── Q9: bonding types (text only with table) ──
    {
        "q": "9", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which substance has the correct type of bonding?\n\n| substance | ionic | covalent | metallic |\n|---|---|---|---|\n| **A** carbon dioxide | ✓ | ✗ | ✗ |\n| **B** magnesium bromide | ✗ | ✗ | ✓ |\n| **C** sodium | ✓ | ✗ | ✗ |\n| **D** oxygen | ✗ | ✓ | ✗ |",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "D — oxygen has covalent bonding [1 mark]. Fairly well answered (56.9%).",
        "explanation": "Bonding types matched to substances:\n• **Carbon dioxide (CO₂)** — covalent (non-metal + non-metal). Row A wrongly says ionic.\n• **Magnesium bromide (MgBr₂)** — ionic (metal + non-metal). Row B wrongly says metallic.\n• **Sodium (Na)** — metallic (a metal). Row C wrongly says ionic.\n• **Oxygen (O₂)** — covalent (non-metal molecule). Row D correctly says covalent ✓\n\nRule: metal+non-metal=ionic; non-metal+non-metal=covalent; metal alone=metallic.",
        "diagram": None,
    },
    # ── Q10: lithium ↔ chloride (text only) ──
    {
        "q": "10", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Lithium atoms react with chlorine atoms to form lithium chloride.\n\nWhich statement is correct?",
        "options": [
            ("a", "Lithium loses one electron to form a negative charge."),
            ("b", "Lithium gains one electron to form a positive charge."),
            ("c", "Chlorine loses one electron to form a negative charge."),
            ("d", "Chlorine gains one electron to form a negative charge."),
        ],
        "commentary": "D [1 mark]. Fairly answered. Option A was the most common wrong answer — candidates knew lithium loses electrons but gave the wrong charge. 51.4% chose correctly.",
        "explanation": "In LiCl formation:\n• **Lithium (Li, Group I)** has 1 outer electron → **LOSES** 1 electron → becomes **Li⁺** (positive)\n• **Chlorine (Cl, Group VII)** has 7 outer electrons → **GAINS** 1 electron → becomes **Cl⁻** (negative) ✓\n\nRule: **lose electrons → positive ion; gain electrons → negative ion**. Lithium loses (so positive), chlorine gains (so negative). Only D matches.",
        "diagram": None,
    },
    # ── Q11: giant covalent lattices (diagram) ──
    {
        "q": "11", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "**R**, **S** and **T** represent three different structures of an element.\n\nR = graphite, S = diamond, T = buckminsterfullerene.\n\nWhich structures are giant covalent lattices?",
        "options": [
            ("a", "R, S and T"),
            ("b", "R and S only"),
            ("c", "R and T only"),
            ("d", "S and T only"),
        ],
        "commentary": "B — R and S only [1 mark]. Poorly answered (41.4%). Candidates failed to recall that buckminsterfullerene is a simple molecular structure.",
        "explanation": "Allotropes of carbon:\n• **R — Graphite** — GIANT covalent lattice (layers of hexagonal sheets) ✓\n• **S — Diamond** — GIANT covalent lattice (tetrahedral 3D network) ✓\n• **T — Buckminsterfullerene (C₆₀)** — SIMPLE MOLECULAR structure (single sphere of 60 atoms, weak forces BETWEEN molecules) ✗\n\n'Giant' means the structure extends indefinitely in 3D. C₆₀ is a discrete molecule — not giant.",
        "diagram": ("page-04", 0.20, 0.42, 0.10, 0.85, "structures-RST"),
    },
    # ── Q12: why metals high melting point (text only) ──
    {
        "q": "12", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which of the following explains why metals have a **high melting point**?",
        "options": [
            ("a", "Their atoms are regularly arranged in layers."),
            ("b", "They have a lattice of positive ions."),
            ("c", "They have free moving electrons that can carry charge."),
            ("d", "They have strong electrostatic forces."),
        ],
        "commentary": "D [1 mark]. Fairly well answered (50.6%).",
        "explanation": "Why metals melt at high temperatures:\n\nMetals = lattice of **positive ions** in a sea of delocalised electrons. The **STRONG electrostatic forces** of attraction between positive ions and the negative electron sea hold the structure together.\n\nLots of energy needed to overcome these forces → **high melting point**.\n\n• A — true but doesn't explain WHY they're hard to melt\n• B — describes structure, not the reason for high m.p.\n• C — explains electrical conductivity, not melting point\n• **D — strong electrostatic forces** = the actual reason ✓",
        "diagram": None,
    },
    # ── Q13: ionic structure (diagram) ──
    {
        "q": "13", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "The diagram represents the generalised structure of a substance with alternating + and – ions in a lattice.\n\nWhat is the substance?",
        "options": [("a", "chlorine"), ("b", "sodium"), ("c", "sulfur dioxide"), ("d", "xenon")],
        "commentary": "B — sodium [1 mark]. Poorly answered (31.0%). Most failed to recognise the generalised structure of a metal.",
        "explanation": "Wait — re-read the question. The diagram shows + (positive ions) AND − (electrons/negative charges). That's a **metallic structure** = a metal lattice with delocalised electrons.\n\nMatch substances:\n• Chlorine (Cl₂) — simple molecular (covalent) — wrong\n• **Sodium (Na)** — metallic structure → lattice of Na⁺ ions in sea of electrons ✓\n• Sulfur dioxide (SO₂) — simple molecular (covalent) — wrong\n• Xenon (Xe) — noble gas, single atoms — wrong\n\nOnly sodium has a metallic lattice.",
        "diagram": ("page-04", 0.65, 0.86, 0.28, 0.66, "ionic-structure"),
    },
    # ── Q14: balanced equation H + O (text only) ──
    {
        "q": "14", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "The word equation shows the reaction between hydrogen and oxygen to produce water.\n\nhydrogen + oxygen → water\n\nWhat is the balanced chemical equation for the reaction?",
        "options": [
            ("a", "2H + 2O → 2H₂O"),
            ("b", "H₂ + O₂ → 2H₂O"),
            ("c", "H₂ + O₂ → H₂O"),
            ("d", "2H₂ + O₂ → 2H₂O"),
        ],
        "commentary": "D [1 mark]. Well answered (60%).",
        "explanation": "Two checks for a balanced equation:\n1. **Diatomic molecules**: H₂ and O₂ (NOT lone H or O atoms) — rules out A\n2. **Balance atoms** on both sides:\n\n2H₂ + O₂ → 2H₂O\n• Hydrogens: LEFT 2×2 = 4 ✓ RIGHT 2×2 = 4 ✓\n• Oxygens: LEFT 2 ✓ RIGHT 2×1 = 2 ✓\n\nB: 2 H on left, 4 H on right — not balanced.\nC: 2 O on left, 1 O on right — not balanced.\n**D balances both elements.**",
        "diagram": None,
    },
    # ── Q15: polythene (text only) ──
    {
        "q": "15", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Polythene is an example of a material found in the environment.\n\nWhich row is correct about the nature of polythene and the type of bonds it consists of?",
        "options": [
            ("a", "natural — covalent"),
            ("b", "natural — ionic"),
            ("c", "synthetic — covalent"),
            ("d", "synthetic — ionic"),
        ],
        "commentary": "C [1 mark]. Poorly answered (41.7%). Many wrongly chose A.",
        "explanation": "Polythene (polyethylene):\n• **Synthetic** — made in factories by polymerisation of ethene (NOT from a natural source like cotton or wool) ✓\n• **Covalent** bonding — made of non-metal atoms (C and H) sharing electrons ✓\n\nAll plastics/polymers are made of small covalent molecules joined together — they're never ionic.\nNatural polymers include starch, protein, DNA (still covalent though). Polythene is synthetic.",
        "diagram": None,
    },
    # ── Q16: cement (text only) ──
    {
        "q": "16", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "Which other substance, other than clay, is used to make **cement**?",
        "options": [("a", "limestone"), ("b", "sand"), ("c", "stones"), ("d", "water")],
        "commentary": "A — limestone [1 mark]. Well answered (60.7%).",
        "explanation": "**Cement is made from heating LIMESTONE (CaCO₃) + CLAY together in a kiln.**\n\nProcess: limestone + clay → cement powder. Cement is then mixed with sand + stones + water to make CONCRETE — but cement itself comes from just limestone + clay.\n\n• Limestone (calcium carbonate) → answer ✓\n• Sand → ingredient of concrete, not cement\n• Stones → ingredient of concrete, not cement\n• Water → mixes with cement to set, but isn't an ingredient of the powder",
        "diagram": None,
    },
    # ── Q17: soap molecule (diagram) ──
    {
        "q": "17", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "The diagram shows the generalised structure of a soap molecule with a polar head **X** and a non-polar tail **Y**.\n\nWhich row is correct about how soap removes oily stains during washing?",
        "options": [
            ("a", "X mixes with water — Y mixes with water"),
            ("b", "X mixes with water — Y mixes with the oily stains"),
            ("c", "X mixes with the oily stains — Y mixes with the oily stains"),
            ("d", "X mixes with the oily stains — Y mixes with water"),
        ],
        "commentary": "B [1 mark]. Well answered (72.7%).",
        "explanation": "Soap = a 'two-faced' molecule:\n• **X — head end (polar, ionic)** → 'hydrophilic' (water-loving) → mixes with WATER ✓\n• **Y — tail end (long hydrocarbon chain)** → 'hydrophobic' (water-fearing) → mixes with OIL/GREASE ✓\n\nIn washing:\n1. Tails grab onto the oily dirt\n2. Heads stay in the water\n3. Oil droplet gets surrounded by soap molecules\n4. Whole 'micelle' is rinsed away by water\n\nSo X→water, Y→oil = **B**.",
        "diagram": ("page-05", 0.51, 0.61, 0.14, 0.80, "soap-molecule"),
    },
    # ── Q18: acidic oxide (text only) ──
    {
        "q": "18", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Which oxide is **acidic**?",
        "options": [("a", "aluminium oxide"), ("b", "magnesium oxide"), ("c", "carbon dioxide"), ("d", "potassium oxide")],
        "commentary": "C — carbon dioxide [1 mark]. Poorly answered (31.1%). Non-metallic oxides are acidic. Evidence of guessing.",
        "explanation": "**Rule: Non-metal oxides = ACIDIC. Metal oxides = BASIC (or amphoteric in middle).**\n\n• **Carbon dioxide (CO₂)** — non-metal oxide → ACIDIC ✓ (forms carbonic acid in water)\n• Magnesium oxide, potassium oxide — both metal oxides → basic\n• Aluminium oxide — amphoteric (acts as both acid AND base) — special case\n\nOther acidic oxides: SO₂, SO₃, NO₂, P₄O₁₀. All non-metal oxides.",
        "diagram": None,
    },
    # ── Q19: empirical formula (text only) ──
    {
        "q": "19", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Naphthalene is a hydrocarbon often used in moth balls.\n\nThe percentage composition is **93.75% carbon and 6.25% hydrogen**.\n\nWhat is the empirical formula of naphthalene?",
        "options": [("a", "CH"), ("b", "C₃H₂"), ("c", "C₄H₅"), ("d", "C₅H₄")],
        "commentary": "D [1 mark]. Poorly answered (24%). Option A was the most common wrong answer.",
        "explanation": "**Three-step empirical formula calculation:**\n\n1. **Divide % by Ar:**\n   - C: 93.75 ÷ 12 = 7.8125\n   - H: 6.25 ÷ 1 = 6.25\n\n2. **Divide by smallest (6.25):**\n   - C: 7.8125 ÷ 6.25 = 1.25\n   - H: 6.25 ÷ 6.25 = 1\n\n3. **Multiply to get whole numbers** (×4 here):\n   - C: 1.25 × 4 = 5\n   - H: 1 × 4 = 4\n\n→ Empirical formula = **C₅H₄** ✓\n\n(Molecular formula of naphthalene is C₁₀H₈ = 2 × C₅H₄.)",
        "diagram": None,
    },
    # ── Q20: mass from concentration (text only) ──
    {
        "q": "20", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "A solution of potassium carbonate, **K₂CO₃**, has a concentration of **0.03 mol/dm³**.\n\nWhich mass of potassium carbonate is dissolved in 1 dm³ of this solution?\n\n(Ar: K=39, C=12, O=16)",
        "options": [("a", "1.38 g"), ("b", "4.14 g"), ("c", "13.80 g"), ("d", "41.40 g")],
        "commentary": "B — 4.14 g [1 mark]. Fairly answered (54.7%).",
        "explanation": "**Steps:**\n\n1. **Mr of K₂CO₃** = (2×39) + 12 + (3×16) = 78 + 12 + 48 = **138 g/mol**\n2. **moles** in 1 dm³ at 0.03 mol/dm³ = 0.03 mol\n3. **mass = moles × Mr** = 0.03 × 138 = **4.14 g** ✓\n\nFormula trio:\n• n = m / Mr\n• c = n / V\n• m = n × Mr = c × V × Mr\n\nDirect: m = 0.03 × 1 × 138 = 4.14 g.",
        "diagram": None,
    },
    # ── Q21: electrolysis molten NaCl (diagram) ──
    {
        "q": "21", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The diagram shows the electrolysis of **molten sodium chloride, NaCl**, with electrode X positive and electrode Y negative.\n\nWhich is correct?",
        "options": [
            ("a", "oxidation occurs at electrode X and the equation is: 2Cl⁻ → Cl₂ + 2e⁻"),
            ("b", "oxidation occurs at electrode Y and the equation is: Na⁺ + e⁻ → Na"),
            ("c", "reduction occurs at electrode X and the equation is: Na⁺ + e⁻ → Na"),
            ("d", "reduction occurs at electrode Y and the equation is: 2Cl⁻ → Cl₂ + 2e⁻"),
        ],
        "commentary": "A [1 mark]. Poorly answered (40.4%) — challenging and demanding.",
        "explanation": "**Two rules to memorise:**\n• **OIL RIG**: Oxidation = Loss of electrons; Reduction = Gain of electrons\n• At the **anode (+ve electrode)** → **oxidation** happens (negative ions lose electrons)\n• At the **cathode (−ve electrode)** → **reduction** happens (positive ions gain electrons)\n\nElectrode X is **+ve** (anode):\n• Cl⁻ ions attracted, lose e⁻ → Cl₂ gas\n• **2Cl⁻ → Cl₂ + 2e⁻** (oxidation — loses electrons) ✓\n\nElectrode Y is −ve (cathode):\n• Na⁺ + e⁻ → Na (reduction)\n\nSo X = oxidation with 2Cl⁻ equation = **A**.",
        "diagram": ("page-06", 0.34, 0.58, 0.16, 0.82, "electrolysis-nacl"),
    },
    # ── Q22: transition element properties (text only) ──
    {
        "q": "22", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "Which row describes the properties of a **transition element**?",
        "options": [
            ("a", "high density — low melting point — no colour of compounds"),
            ("b", "high density — high melting point — blue compounds"),
            ("c", "low density — low melting point — brown compounds"),
            ("d", "low density — high melting point — blue compounds"),
        ],
        "commentary": "B [1 mark]. Fairly answered (50.1%).",
        "explanation": "Transition metals (the d-block, e.g. Cu, Fe, Cr, Ni):\n• **HIGH density** — heavy metals (iron is ~7.9 g/cm³)\n• **HIGH melting point** — strong metallic bonds\n• **COLOURED compounds** — characteristic feature! (Cu²⁺ blue, Fe²⁺ green, Fe³⁺ orange/brown, Cr³⁺ green)\n• Variable oxidation states\n• Useful catalysts\n\n'Blue compounds' is a typical example — copper(II) salts are blue. Row **B** has all three correct.",
        "diagram": None,
    },
    # ── Q23: catalysts (text only) ──
    {
        "q": "23", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "Which statement is **true** about catalysts?",
        "options": [
            ("a", "A catalyst changes chemically after participating in a chemical reaction."),
            ("b", "A catalyst increases the rate of reaction by reducing the activation energy of a reaction."),
            ("c", "An inhibitor is a substance that increases the rate of a reaction."),
            ("d", "Enzymes are proteins that catalyse inorganic reactions."),
        ],
        "commentary": "B [1 mark]. Well answered (73%).",
        "explanation": "Catalyst facts:\n• A catalyst **lowers the activation energy** (Ea) → more molecules have enough energy to react → faster rate ✓\n• A catalyst is **NOT chemically changed** at the end (so A is wrong)\n• An **inhibitor** SLOWS down reactions (so C is wrong)\n• **Enzymes** catalyse **BIOLOGICAL** reactions, not inorganic ones (so D is wrong)\n\nOnly **B** is correct.",
        "diagram": None,
    },
    # ── Q24: reducing agent (text only) ──
    {
        "q": "24", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The word equation shows the reaction between iron(III) oxide and aluminium.\n\niron(III) oxide + aluminium → iron + aluminium oxide\n\nWhich substance is the **reducing agent** in the reaction?",
        "options": [("a", "aluminium"), ("b", "aluminium oxide"), ("c", "iron(III) oxide"), ("d", "iron")],
        "commentary": "A — aluminium [1 mark]. Poorly answered (35.3%).",
        "explanation": "A **reducing agent** is the species that DONATES electrons (i.e. itself gets oxidised).\n\nIn this reaction:\n• **Iron(III) oxide** → iron: iron goes from Fe³⁺ to Fe (gains electrons = reduced)\n• **Aluminium** → aluminium oxide: Al goes from 0 to Al³⁺ (loses electrons = OXIDISED)\n\nThe one being oxidised is the **REDUCING agent**.\n• Aluminium is oxidised → aluminium is the reducing agent ✓\n• Iron(III) oxide is reduced → iron(III) oxide is the oxidising agent\n\nMnemonic: 'A reducing agent reduces something ELSE — so itself gets oxidised.'",
        "diagram": None,
    },
    # ── Q25: properties of acids (text only) ──
    {
        "q": "25", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which statement(s) describe the properties of acids?\n\n1. react with ammonium sulfate to form ammonia\n2. react with metals to form salt and water\n3. react with carbonates to form salts, water and carbon dioxide",
        "options": [("a", "1 and 2 only"), ("b", "2 only"), ("c", "2 and 3 only"), ("d", "3 only")],
        "commentary": "D — 3 only [1 mark]. Poorly answered. Most wrongly chose C — they didn't notice statement 2 says 'salt and WATER' instead of 'salt and HYDROGEN GAS'.",
        "explanation": "Standard acid reactions:\n• acid + metal → salt + **HYDROGEN GAS** (NOT water) — so statement 2 is WRONG\n• acid + carbonate → salt + water + CO₂ — statement 3 ✓\n• acid + ammonium salt → ammonia? **NO** — alkalis react with ammonium salts to release NH₃. Statement 1 is WRONG.\n\nOnly statement 3 is true → answer **D**.\n\nRead carefully: 'salt and water' looks right at a glance but the actual product is 'salt and hydrogen gas'.",
        "diagram": None,
    },
    # ── Q26: making sodium nitrate (text only) ──
    {
        "q": "26", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Which two materials are **most** suitable to prepare sodium nitrate?",
        "options": [
            ("a", "sodium and nitrogen"),
            ("b", "sodium and dilute nitric acid"),
            ("c", "sodium hydroxide and dilute nitric acid"),
            ("d", "sodium oxide and ethanoic acid"),
        ],
        "commentary": "C [1 mark]. Poorly answered (25.9%). Evidence of guessing.",
        "explanation": "Standard salt preparation = **acid + alkali → salt + water (neutralisation)**.\n\n• A — sodium and nitrogen wouldn't directly form sodium nitrate (no oxygen available)\n• B — sodium metal + nitric acid → too violent, dangerous explosion\n• **C — NaOH + HNO₃ → NaNO₃ + H₂O** — safe neutralisation ✓\n• D — sodium oxide + ethanoic acid → sodium ETHANOATE (wrong salt)\n\nFor a NITRATE you need NITRIC acid. For a SODIUM salt you need an SAFE source of sodium = NaOH (not Na metal).",
        "diagram": None,
    },
    # ── Q27: white precipitate with barium nitrate (text only) ──
    {
        "q": "27", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which aqueous ion forms a white precipitate when **acidified aqueous barium nitrate** is added to it?",
        "options": [("a", "chloride"), ("b", "iodide"), ("c", "nitrate"), ("d", "sulfate")],
        "commentary": "D — sulfate [1 mark]. Poorly answered (31.1%). Confusion between chloride and sulfate.",
        "explanation": "**Test for sulfate ions (SO₄²⁻):**\n1. Acidify the sample with dilute nitric acid\n2. Add aqueous barium nitrate / barium chloride\n3. **White precipitate of barium sulfate (BaSO₄)** forms = positive test ✓\n\nDon't confuse with:\n• Chloride test — use SILVER nitrate (Ag⁺), get a WHITE precipitate of AgCl. (Barium nitrate doesn't react with chloride.)\n• Iodide test — use silver nitrate, get YELLOW precipitate of AgI.\n• Nitrate — needs aluminium powder + NaOH + warming (smells of ammonia).",
        "diagram": None,
    },
    # ── Q28: chalcopyrite ore (text only) ──
    {
        "q": "28", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "Which metal is extracted from the ore, **chalcopyrite**?",
        "options": [("a", "aluminium"), ("b", "copper"), ("c", "iron"), ("d", "lead")],
        "commentary": "B — copper [1 mark]. Well answered (72.1%).",
        "explanation": "**Common ores to know:**\n• Bauxite → aluminium\n• **Chalcopyrite (CuFeS₂) → copper** ✓\n• Haematite (Fe₂O₃) / magnetite (Fe₃O₄) → iron\n• Galena (PbS) → lead\n• Cinnabar (HgS) → mercury\n• Zinc blende (ZnS) → zinc\n\n'Chalco-' from Greek 'chalkos' = copper. The name itself gives it away.",
        "diagram": None,
    },
    # ── Q29: rusting nails (diagram) ──
    {
        "q": "29", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Four identical iron nails are placed in test-tubes with different conditions:\n• **A** — galvanised nail\n• **B** — painted nail\n• **C** — nail covered in a damp cloth\n• **D** — greased nail\n\nWhich of the following iron nails rust?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "C [1 mark]. Well answered (66.1%). Candidates recognised that rusting requires moisture and air.",
        "explanation": "**Rusting requires BOTH water AND oxygen** (from air).\n\n• **A — galvanised**: nail is coated in zinc → zinc reacts instead → no rust\n• **B — painted**: paint blocks water + air → no rust\n• **C — damp cloth**: WATER + AIR both present → RUSTS ✓\n• **D — greased**: grease blocks water → no rust\n\nThe damp cloth provides water AND lets air through → perfect rusting conditions.",
        "diagram": ("page-08", 0.40, 0.60, 0.10, 0.92, "rusting-nails"),
    },
    # ── Q30: alkane formula (text only) ──
    {
        "q": "30", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "What is the **general formula** of alkanes?",
        "options": [
            ("a", "CₙH₂ₙ"),
            ("b", "CₙH₂ₙ₊₁"),
            ("c", "CₙH₂ₙ₊₂"),
            ("d", "CₙH₂ₙ₊₁OH"),
        ],
        "commentary": "C [1 mark]. Poorly answered (45.1%). Evidence of guessing, especially between A and B.",
        "explanation": "Homologous series general formulas (memorise these!):\n• **Alkanes (saturated)**: **CₙH₂ₙ₊₂** ✓ (e.g. CH₄, C₂H₆, C₃H₈)\n• Alkenes (one double bond): CₙH₂ₙ (e.g. C₂H₄, C₃H₆)\n• Alkynes (one triple bond): CₙH₂ₙ₋₂\n• Alcohols: CₙH₂ₙ₊₁OH (e.g. CH₃OH, C₂H₅OH)\n• Carboxylic acids: CₙH₂ₙ₊₁COOH\n\nOption B (CₙH₂ₙ₊₁) is the **alkyl group** formula, not a complete alkane.",
        "diagram": None,
    },
    # ── Q31: homologous series (text only) ──
    {
        "q": "31", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "Which pair of compounds belong to the **same homologous series**?",
        "options": [
            ("a", "CH₃CH₃ and CH₃CH₂CH₃"),
            ("b", "CH₃CH₂OH and CH₃OCH₂CH₃"),
            ("c", "CH₂CHCH₂CH₃ and CH₃CH₂CH₂CH₃"),
            ("d", "CH₃CH₂OH and CH₂CHCH₂OH"),
        ],
        "commentary": "A [1 mark]. Poorly answered (23.2%). Structural formulae made it more demanding. Option C was a common wrong answer.",
        "explanation": "**Homologous series = compounds with the same general formula** (same functional group, differ by CH₂).\n\n• **A** — CH₃CH₃ (ethane, C₂H₆) and CH₃CH₂CH₃ (propane, C₃H₈) — BOTH alkanes ✓\n• B — first is alcohol (ethanol), second is an ether — different families\n• C — CH₂CHCH₂CH₃ is an alkene (has C=C), CH₃CH₂CH₂CH₃ is an alkane — different families\n• D — first is alcohol, second is an UNSATURATED alcohol (has C=C) — slightly different groups\n\nOnly A: two pure alkanes from the alkane series.",
        "diagram": None,
    },
    # ── Q32: alkene + bromine (diagram) ──
    {
        "q": "32", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "The structures of two compounds:\n• **P**: CH₃—CH(CH₃)—CH₂—CH₃ (an alkane with a branch — methylpropane)\n• **Q**: CH₃—CH₂—CH=CH₂ (an alkene — but-1-ene)\n\nWhich row about the structures is correct?",
        "options": [
            ("a", "reacts readily with bromine: P; forms a polymer: P"),
            ("b", "reacts readily with bromine: P; forms a polymer: Q"),
            ("c", "reacts readily with bromine: Q; forms a polymer: P"),
            ("d", "reacts readily with bromine: Q; forms a polymer: Q"),
        ],
        "commentary": "D [1 mark]. Very poorly answered (15.5%). Most chose B. They failed to recognise that only the alkene Q can react with bromine.",
        "explanation": "**Alkenes have a C=C double bond — that makes them reactive.**\n\nP is an **alkane** (only single bonds) — unreactive with bromine, no polymerisation.\nQ is an **alkene** (has C=C) — BOTH:\n• **Reacts with bromine**: Q + Br₂ → decolourises bromine water (test for unsaturation) ✓\n• **Polymerises**: many Q molecules link up → poly(butene) ✓\n\nBoth properties belong to Q (the alkene). Answer = **D** (Q for both).",
        "diagram": ("page-09", 0.06, 0.16, 0.20, 0.78, "structures-PQ"),
    },
    # ── Q33: esterification product (text only) ──
    {
        "q": "33", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "What is the name of the product formed when this reaction takes place?\n\nCH₃COOH + CH₃CH₂OH →",
        "options": [("a", "ethyl ethanoate"), ("b", "ethyl methanoate"), ("c", "methyl ethanoate"), ("d", "methyl propanoate")],
        "commentary": "A — ethyl ethanoate [1 mark]. Poorly answered (41.5%). Many candidates appeared to be guessing.",
        "explanation": "**Esterification: carboxylic acid + alcohol → ester + water.**\n\nNaming an ester = '*alcohol-part* + *acid-part*':\n• From the alcohol (CH₃CH₂OH = ethanol) → **ethyl** (the alkyl group)\n• From the acid (CH₃COOH = ethanoic acid) → **ethanoate**\n• → **ethyl ethanoate** ✓\n\nGeneral pattern:\n• methanol + acid X → methyl X-oate\n• ethanol + acid X → ethyl X-oate\n\nHere both are 'eth-' = 2 carbons each → ethyl ethanoate.",
        "diagram": None,
    },
    # ── Q34: nylon polymer (diagram) ──
    {
        "q": "34", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The diagram shows part of a polymer with C=O groups linked to N–H groups (amide linkages: –CO–NH–).\n\nWhich polymer is represented?",
        "options": [("a", "a carbohydrate"), ("b", "a protein"), ("c", "nylon"), ("d", "terylene")],
        "commentary": "C — nylon [1 mark]. Poorly answered (39.3%).",
        "explanation": "Identify the polymer by its **linkage**:\n• **Carbohydrate (starch/cellulose)** — glycosidic linkage (–O–)\n• **Protein** — amide linkage (–CO–NH–) BUT joining amino acids; it would be a NATURAL polymer\n• **Nylon** — synthetic polyamide; amide linkages (–CO–NH–) joining diamines and diacids ✓\n• **Terylene** — polyester; ester linkages (–CO–O–)\n\nThe key clue: the question shows a SYNTHETIC polymer (made in industry) with amide linkages → **nylon**. (Proteins are natural, not 'shown as part of a polymer' in this style.)",
        "diagram": ("page-09", 0.42, 0.54, 0.06, 0.94, "polymer-structure"),
    },
    # ── Q35: plastic pollution (text only) ──
    {
        "q": "35", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "What is the main reason why plastic causes environmental pollution?",
        "options": [
            ("a", "They cause acid rain."),
            ("b", "They cannot be decomposed by bacteria."),
            ("c", "They cause eutrophication."),
            ("d", "They contribute to climate change."),
        ],
        "commentary": "B [1 mark]. Well answered (79.2%).",
        "explanation": "Plastics are **non-biodegradable** — bacteria can't break down the long polymer chains. Result:\n• They pile up in landfills for centuries\n• They end up in oceans, rivers, soil\n• Wildlife eats microplastics\n• Burning them releases toxic fumes\n\nAcid rain is caused by SO₂/NOₓ from burning fuels. Eutrophication is caused by fertiliser runoff. Climate change is caused by CO₂ + greenhouse gases. The DEFINING problem of plastic is **non-biodegradability**.",
        "diagram": None,
    },
    # ── Q36: permanent hardness (text only) ──
    {
        "q": "36", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which compound causes **permanent hardness** in water?",
        "options": [
            ("a", "calcium carbonate"),
            ("b", "calcium hydrogen carbonate"),
            ("c", "magnesium hydrogen carbonate"),
            ("d", "magnesium sulfate"),
        ],
        "commentary": "D — magnesium sulfate [1 mark]. Fairly answered (50.1%). Option A was a common wrong answer.",
        "explanation": "Two types of hardness:\n• **Temporary hardness** — caused by Ca/Mg **HYDROGEN CARBONATES** (Ca(HCO₃)₂, Mg(HCO₃)₂). Removed by BOILING (they decompose to insoluble carbonates).\n• **Permanent hardness** — caused by Ca/Mg **SULFATES** (CaSO₄, MgSO₄) and CHLORIDES. NOT removed by boiling — sulfates don't decompose. ✓\n\nBoth types can be removed by ion-exchange or adding washing soda (Na₂CO₃).\n\nA = calcium carbonate is INSOLUBLE — doesn't cause hardness directly.",
        "diagram": None,
    },
    # ── Q37: oxygen preparation (text only) ──
    {
        "q": "37", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "What is the name of the method used for the **commercial preparation** of oxygen?",
        "options": [("a", "diffusion"), ("b", "distillation"), ("c", "evaporation"), ("d", "fractional distillation")],
        "commentary": "D — fractional distillation [1 mark]. Poorly answered (45.8%). Option A was a common wrong answer.",
        "explanation": "**Industrial / commercial oxygen is made by FRACTIONAL DISTILLATION of liquid air.**\n\nProcess:\n1. Air is filtered to remove dust\n2. Cooled and compressed until it liquefies (~−200°C)\n3. Slowly warmed → gases boil off at different temperatures (fractional distillation)\n   - Nitrogen boils off first (−196 °C)\n   - Oxygen later (−183 °C)\n\nThe LABORATORY method (decomposing H₂O₂) gives small amounts — not commercial scale. Diffusion doesn't separate gases. Simple distillation can't separate gases by such close boiling points — need fractional.",
        "diagram": None,
    },
    # ── Q38: methane from decomposition (text only) ──
    {
        "q": "38", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "Vegetation is sometimes used to form compost. This compost can be used to fertilise soils.\n\nWhich gas is likely to be present in a higher percentage during the decomposition of vegetation?",
        "options": [("a", "carbon monoxide"), ("b", "methane"), ("c", "oxygen"), ("d", "sulfur dioxide")],
        "commentary": "B — methane [1 mark]. Poorly answered (34.1%). Option A was a common wrong answer.",
        "explanation": "**Anaerobic decomposition** (no oxygen) of vegetation by bacteria releases **METHANE (CH₄)** as the main product.\n\nThat's why:\n• Compost heaps, marshes, landfills, and rice paddies are all big sources of methane (a potent greenhouse gas)\n• 'Biogas' from waste is mostly methane + some CO₂\n\nCO is from incomplete burning of fuels (not decomposition). Oxygen would be CONSUMED, not released. SO₂ comes from burning sulfur-containing fuels.",
        "diagram": None,
    },
    # ── Q39: heating limestone (text only) ──
    {
        "q": "39", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "When calcium carbonate is heated strongly, two substances Y and Z are formed.\n\n• Substance **Y** is a white solid that reacts with water, giving out heat.\n• Substance **Z** is a colourless gas.\n\nWhat are substances Y and Z?",
        "options": [
            ("a", "Y = calcium chloride; Z = carbon dioxide"),
            ("b", "Y = calcium oxide; Z = oxygen"),
            ("c", "Y = calcium oxide; Z = carbon dioxide"),
            ("d", "Y = calcium hydroxide; Z = oxygen"),
        ],
        "commentary": "C [1 mark]. Poorly answered (44.1%). Many candidates appear to be guessing.",
        "explanation": "**Thermal decomposition of calcium carbonate (limestone):**\n\nCaCO₃ → CaO + CO₂\n\n• **Y = calcium oxide (CaO, quicklime)** — white solid, reacts vigorously with water (exothermic) to form Ca(OH)₂ (slaked lime) ✓\n• **Z = carbon dioxide (CO₂)** — colourless gas, turns limewater milky\n\nThis is the chemistry behind making cement and lime mortar. No chlorine present (rules out A), no oxygen released (rules out B and D).",
        "diagram": None,
    },
    # ── Q40: sulfur dioxide use (text only) ──
    {
        "q": "40", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Which of the following is a **use of sulfur dioxide (SO₂)**?",
        "options": [
            ("a", "manufacture of cement"),
            ("b", "manufacture of detergents"),
            ("c", "manufacture of food preservatives"),
            ("d", "treating acidic soil"),
        ],
        "commentary": "C [1 mark]. Very poorly answered (24.4%). Options B and D were common wrong answers.",
        "explanation": "**SO₂ is used as a FOOD PRESERVATIVE** (E-number E220) — kills microbes and prevents browning.\n\nFound in: dried fruits, wine, fruit juices, sausages, pickled vegetables. The chemical formulation can be SO₂ gas, sodium sulfite, or sodium metabisulfite.\n\nOther distractors:\n• Cement is made from limestone + clay (not SO₂)\n• Detergents use sulfonic acid derivatives (not SO₂ directly)\n• Acidic soil is treated with LIME (calcium hydroxide), NOT acidic SO₂ — that would make it WORSE\n\nSO₂ is also used to make sulfuric acid (the main industrial use) but among the OPTIONS GIVEN, food preservatives is correct.",
        "diagram": None,
    },
]


def _flatten_to_white(img: Image.Image) -> Image.Image:
    if img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        return bg
    return img.convert("RGB")


def extract_diagrams() -> None:
    PNG_DIR.mkdir(parents=True, exist_ok=True)
    for q in QUESTIONS:
        if q["diagram"] is None:
            continue
        page_name, y_top, y_bot, x_left, x_right, slug = q["diagram"]
        page_path = PAGES_DIR / f"{page_name}.png"
        if not page_path.exists():
            print(f"  Q{q['q']}: page render missing: {page_path}")
            continue
        img = _flatten_to_white(Image.open(page_path))
        W, H = img.size
        crop = img.crop((int(W * x_left), int(H * y_top), int(W * x_right), int(H * y_bot)))
        out_name = f"q{q['q']}-{slug}.png"
        crop.save(PNG_DIR / out_name, optimize=True)
        print(f"  Q{q['q']:>2}: {out_name:34s} {crop.size[0]}x{crop.size[1]}")


def sql_escape(s: str) -> str:
    if s is None:
        return "null"
    s = s.replace("\\", "\\\\").replace("'", "''").replace("\n", "\\n")
    return f"E'{s}'"


def options_jsonb(options: list[tuple[str, str]]) -> str:
    parts = []
    for oid, otext in options:
        otext_safe = otext.replace("'", "''")
        parts.append(f"jsonb_build_object('id','{oid}','text','{otext_safe}')")
    return "jsonb_build_array(\n      " + ",\n      ".join(parts) + "\n    )"


def emit_sql() -> None:
    out = []
    out.append("-- " + "=" * 75)
    out.append("-- NSSCO Chemistry 2023 Paper 1 (6117/1) — 40 MCQ questions, 40 marks")
    out.append("-- Verbatim NIED wording. Official answers + commentary from")
    out.append("-- the DNEA Examiners Report 2023 (Chemistry section, pages 95-96).")
    out.append("-- Diagrams cropped from past-papers/nssco-chemistry/2023/")
    out.append("-- into public/past-papers/chemistry-nssco-2023-p1/")
    out.append("-- " + "=" * 75)
    out.append("")
    out.append("do $$")
    out.append("declare")
    out.append("  chem_id uuid;")
    out.append("begin")
    out.append("  select id into chem_id from public.subjects where slug = 'chemistry' limit 1;")
    out.append("  if chem_id is null then")
    out.append("    raise notice 'Chemistry subject not found — skipping seed';")
    out.append("    return;")
    out.append("  end if;")
    out.append("")

    for q in QUESTIONS:
        if q["diagram"] is not None:
            slug = q["diagram"][5]
            diagram_url = f"'/past-papers/chemistry-nssco-2023-p1/q{q['q']}-{slug}.png'"
        else:
            diagram_url = "null"

        out.append(f"  -- ─── Q{q['q']} ──────────────────────────────────────────────────────")
        out.append("  insert into public.past_paper_questions (")
        out.append("    subject_id, paper_year, paper_no, q_number, marks, tier,")
        out.append("    type, prompt, options, correct, diagram_url, memo, explanation, is_published")
        out.append("  ) values (")
        out.append(f"    chem_id, 2023, '1', '{q['q']}', {q['marks']}, '{q['tier']}',")
        out.append(f"    'mcq',")
        out.append(f"    {sql_escape(q['prompt'])},")
        out.append(f"    {options_jsonb(q['options'])},")
        out.append(f"    to_jsonb('{q['correct']}'::text),")
        out.append(f"    {diagram_url},")
        out.append(f"    {sql_escape(q['commentary'])},")
        out.append(f"    {sql_escape(q['explanation'])},")
        out.append(f"    true")
        out.append("  );")
        out.append("")

    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} MCQ questions for Chemistry NSSCO 2023 Paper 1';")
    out.append("end $$;")

    MIGRATION_PATH.parent.mkdir(parents=True, exist_ok=True)
    MIGRATION_PATH.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"Wrote migration: {MIGRATION_PATH.relative_to(ROOT)}  ({len(QUESTIONS)} rows)")


if __name__ == "__main__":
    print(f"Extracting diagrams for {sum(1 for q in QUESTIONS if q['diagram'])} of {len(QUESTIONS)} questions:")
    extract_diagrams()
    print()
    emit_sql()
    print(f"\nDone. Total marks: {sum(q['marks'] for q in QUESTIONS)}")
