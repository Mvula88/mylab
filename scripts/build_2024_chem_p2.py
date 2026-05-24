"""Build NSSCO Chemistry 2024 Paper 2 — 7 questions, 80 marks.

Verbatim NIED wording. Mark scheme + commentary from DNEA Examiners Report
2024 (Chemistry section, pages 107-111).
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2024-chem-p2"
PNG_DIR = ROOT / "public" / "past-papers" / "chemistry-nssco-2024-p2"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260525180000_chemistry_nssco_2024_p2.sql"

DIAGRAMS = {
    "periodic-positions": ("page-02", 0.05, 0.22, 0.06, 0.94),
    "test-tubes-XY":      ("page-07", 0.04, 0.30, 0.30, 0.74),
    "ethanol-reactions":  ("page-12", 0.06, 0.50, 0.08, 0.92),
    "sugar-monomer":      ("page-13", 0.06, 0.14, 0.20, 0.80),
}


def durl(slug):
    return f"/past-papers/chemistry-nssco-2024-p2/{slug}.png" if slug else None


Q1_STEM = "Fig. 1.1 shows part of the Periodic Table with seven letters placed in different positions:\n• **B** — top-right corner (Group 0)\n• **E** — top-right block (Group VI/VII area, period 2)\n• **F** — Group III area, period 3\n• **G** — Group II area, period 2\n• **C** — Group I, period 4 (left side, fourth row)\n• **D** — middle, transition metals area (period 4)\n• **A** — Group VII, period 4 (right side, fourth row)\n\nThe letters do NOT represent the symbols of the elements."

Q2_STEM = "Magnesium forms the ion Mg²⁺ and bromine forms the ion Br⁻. These two ions form magnesium bromide (MgBr₂)."

Q3_STEM = "Ammonia is manufactured by the **Haber process**. When nitrogen is reacted with hydrogen in a closed container, an equilibrium mixture is formed. An iron catalyst is used and the reaction is exothermic.\n\n**N₂ + H₂ ⇌ NH₃**"

Q4_STEM = "Fig. 4.1 shows two test-tubes each containing dilute hydrochloric acid:\n• Test-tube **X** — universal indicator paper added\n• Test-tube **Y** — magnesium ribbon added"

Q5_STEM = "A list of elements is shown:\n\n**zinc, copper, hydrogen, carbon, barium, calcium, magnesium, iron, aluminium, sodium**"

Q6_STEM = "Ethanol is an alcohol. Alcohols are a 'family' of organic compounds which have the same general formula."

Q7_STEM = "The air around us is a mixture of gases. Nitrogen, oxygen and other substances are found in clean dry air."


QUESTIONS = [
    # ═══════════ Q1 — Periodic Table (7 marks) ═══════════
    {
        "q": "1(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "periodic-positions",
        "prompt": "**(a)(i)** Choose the letter (from A to F) which is in the **same period as calcium**.",
        "accepted": ["C", "A", "D", "potassium", "bromine", "copper"],
        "must_contain": [],
        "memo": "C / A / D (allow correct element names: potassium / bromine / copper); [1 mark]",
        "examiner_note": "Well answered. Some used names/symbols instead of letters as instructed.",
        "explanation": "**Period 4** of the periodic table contains: K, Ca, Sc, Ti, V, Cr, Mn, Fe, Co, Ni, Cu, Zn, Ga, Ge, As, Se, **Br**, Kr.\n\nFrom the diagram, the letters in Period 4 are: **C (Group I)**, **D (transition metals)**, **A (Group VII)** — any of these scores the mark.\n\n⚠ The question says 'Choose, from A to F, the element' — answer with a LETTER, not a name (although the examiner accepts both).",
    },
    {
        "q": "1(a)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "periodic-positions",
        "prompt": "**(a)(ii)** Choose the letter which is a **liquid at room temperature** with **diatomic molecules**.",
        "accepted": ["A", "bromine", "Br2"],
        "must_contain": [],
        "memo": "A (bromine); [1 mark]",
        "examiner_note": "Well answered.",
        "explanation": "Only **bromine (Br₂)** is a liquid at room temperature AND forms diatomic molecules (the only non-metal liquid).\n\n• Mercury is the only LIQUID METAL — but it's monatomic\n• All other liquids on the periodic table are solids or gases at room temp\n\nBromine sits in Group VII, Period 4 → letter **A** in this diagram.",
    },
    {
        "q": "1(a)(iii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "periodic-positions",
        "prompt": "**(a)(iii)** Choose the letter which forms an **amphoteric oxide**.",
        "accepted": ["F", "aluminium", "Al"],
        "must_contain": [],
        "memo": "F (aluminium); [1 mark]",
        "examiner_note": "—",
        "explanation": "**Amphoteric oxide** = reacts with BOTH acids AND bases.\n\nAt NSSCO level the main example is **aluminium oxide (Al₂O₃)**. Zinc oxide (ZnO) and lead oxide (PbO) are also amphoteric.\n\nAluminium sits in Group III, Period 3 → letter **F** in this diagram.",
    },
    {
        "q": "1(a)(iv)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "periodic-positions",
        "prompt": "**(a)(iv)** Choose the letter which forms a **soluble hydroxide** with water.",
        "accepted": ["C", "potassium", "K"],
        "must_contain": [],
        "memo": "C (potassium); [1 mark]",
        "examiner_note": "—",
        "explanation": "**Group I hydroxides (LiOH, NaOH, KOH)** are all very soluble in water — they make strong alkalis.\n\nIn the diagram, C is in Group I, Period 4 = **potassium (K)**, which forms KOH (very soluble).\n\nGroup II hydroxides like Ca(OH)₂ are only slightly soluble — not 'soluble'. Transition metal hydroxides are insoluble.",
    },
    {
        "q": "1(a)(v)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "periodic-positions",
        "prompt": "**(a)(v)** Choose the letter which is **used to fill weather balloons**.",
        "accepted": ["B", "helium", "He"],
        "must_contain": [],
        "memo": "B (helium); [1 mark]",
        "examiner_note": "—",
        "explanation": "**Helium (He)** is used in weather balloons (and party balloons) because:\n• **Less dense than air** → balloons float\n• **Inert** (Group 0 noble gas) → doesn't react / non-flammable (unlike hydrogen, which is also lighter but explodes!)\n\nIn the diagram, B sits at the top right corner of Group 0 = helium.",
    },
    {
        "q": "1(b)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM + "\n\n**D** is a transition element. Transition elements are harder and stronger than Group I elements.",
        "diagram": "periodic-positions",
        "prompt": "**(b)** Describe **two other properties** of transition elements which are **different from those of Group I elements**.",
        "memo": (
            "Any 2 of (1 mark each):\n"
            "• High density;\n"
            "• High melting point / high boiling point;\n"
            "• Form coloured compounds;\n"
            "• Often act as catalysts;\n"
            "• Have more than one oxidation state / variable valency;\n"
            "• Are LESS reactive (than Group I);"
        ),
        "rubric": "Award 1 mark each (max 2). Must be COMPARATIVE to Group I (not general metal properties shared by both). PENALISE 'electrical conductor' (all metals are), 'shiny' (all metals are). The accepted answers all reflect characteristic transition-metal-only features.",
        "examiner_note": "Moderately answered. Many candidates gave general metal properties (e.g. 'good conductor of electricity') — but those apply to Group I metals too.",
        "explanation": "Properties of transition metals that **distinguish them from Group I**:\n\n• **High density** (Group I metals are very light — Li, Na, K float on water)\n• **High melting points** (Group I metals melt easily — sodium at 98 °C, potassium at 63 °C)\n• **Coloured compounds** (Cu²⁺ blue, Fe²⁺ green, Fe³⁺ orange — Group I compounds are colourless/white)\n• **Catalysts** (Fe in Haber process, Ni in hydrogenation — Group I metals aren't used as catalysts)\n• **Variable oxidation states** (Fe²⁺/Fe³⁺, Cu⁺/Cu²⁺ — Group I always +1)\n• **Less reactive** (don't react vigorously with water — Group I do)\n\nAny TWO of these for full marks.",
    },

    # ═══════════ Q2 — Magnesium bromide (14 marks) ═══════════
    {
        "q": "2(a)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM + "\n\n[Br: A=80, Z=35]",
        "diagram": None,
        "prompt": "**(a)** State the **number of electrons and neutrons** in a bromide ion (Br⁻). Format: ''electrons: ___; neutrons: ___''.",
        "accepted": [
            "electrons 36 neutrons 45", "36 and 45", "36, 45",
            "electrons: 36, neutrons: 45",
        ],
        "must_contain": ["36", "45"],
        "memo": "Number of electrons = **36**; [1]\nNumber of neutrons = **45**; [1]",
        "examiner_note": "Moderately answered. Many couldn't differentiate atom from ion. They forgot Br⁻ has one EXTRA electron.",
        "explanation": "**Bromide ion = Br⁻ (Br atom with one EXTRA electron).**\n\nFor Br (Z=35, A=80):\n• Protons = 35 (Z)\n• Neutrons = A − Z = 80 − 35 = **45**\n• Electrons in atom = 35, but Br⁻ has GAINED 1 electron → 35 + 1 = **36**\n\nSo: 36 electrons, 45 neutrons.\n\nNegative ion (−1) → has 1 MORE electron than the atom. Positive ion (+1) → has 1 LESS.",
    },
    {
        "q": "2(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(b)** Describe how a magnesium ion, **Mg²⁺**, is formed from a magnesium atom, Mg.",
        "accepted": [
            "loses 2 electrons",
            "by losing 2 electrons",
            "transfer of 2 electrons",
            "Mg gives away 2 electrons",
            "loses two electrons",
            "loss of two electrons",
            "loss of 2 electrons",
        ],
        "must_contain": ["lose", "2"],
        "memo": "By the transfer / LOSS of (2) electrons; [1 mark]",
        "examiner_note": "Moderately answered. Some confused 'lose' (give away) with 'loose' (not tight).",
        "explanation": "**Mg → Mg²⁺ + 2e⁻**\n\nMagnesium atom has 2 outer electrons (electron config 2,8,**2**). To become stable like the noble gas neon (2,8), it **LOSES** both outer electrons → forms the **Mg²⁺** ion (positive because more protons than electrons now).\n\nThe word is 'LOSE' (verb, to give up) — NOT 'loose' (adjective, the opposite of tight). Common spelling slip in chemistry exams.",
    },
    {
        "q": "2(c)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM + "\n\nMagnesium bromide is an **ionic compound**.",
        "diagram": None,
        "prompt": "**(c)** Describe the **dot-and-cross diagrams** for the ions in **magnesium bromide (MgBr₂)**. Show outer shells only and explicit charges.",
        "memo": (
            "All 3 marks:\n"
            "• 1 mark — Mg²⁺ shown (square brackets, 2+ charge, can be drawn with NO outer electrons or with empty outer shell);\n"
            "• 1 mark — TWO Br⁻ ions (square brackets, 1− charge each);\n"
            "• 1 mark — 8 electrons (mix of dots and crosses) on each bromide outer shell;"
        ),
        "rubric": "Award 1 mark each: (1) Mg²⁺ correctly shown; (2) TWO Br⁻ ions (1 Mg : 2 Br ratio); (3) 8 electrons on each Br outer shell. PENALISE: drawing covalent (shared) bond between Mg and Br; missing charges; only one Br shown; wrong charge magnitudes.",
        "examiner_note": "Poorly answered. Many couldn't show charges. Some drew covalent bond instead of ionic.",
        "explanation": "**Dot-and-cross for MgBr₂:**\n\n• **Mg²⁺**: [Mg]²⁺ — no outer electrons (it lost both). Square brackets and the 2+ outside.\n• **Two Br⁻ ions**: each shown as [Br with 8 outer electrons]⁻. Use 7 dots from Br + 1 cross to show the gained electron. Square brackets and 1− outside.\n\nLook like:\n\n[Mg]²⁺  [×●●●●●●●●Br]⁻  [×●●●●●●●●Br]⁻\n\nIonic compounds are DRAWN AS SEPARATE IONS (in brackets), not as bonded atoms. Always include the charges.",
    },
    {
        "q": "2(d)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(d)(i)** Name the **process** that uses electricity to break down aqueous or molten ionic compounds.",
        "accepted": ["electrolysis", "Electrolysis"],
        "must_contain": ["electrolysis"],
        "memo": "Electrolysis; [1 mark]",
        "examiner_note": "Well answered.",
        "explanation": "**Electrolysis** = decomposition of ionic compound (molten or in solution) by an electric current.\n\nThe electrolytic cell has:\n• Anode (+ve electrode) — negative ions go here, get oxidised\n• Cathode (−ve electrode) — positive ions go here, get reduced\n• Electrolyte — the molten/aqueous ionic compound providing free ions",
    },
    {
        "q": "2(d)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(d)(ii)** Explain **why** the ionic compound must be **aqueous or molten** for electrolysis to occur.",
        "accepted": [
            "ions must be free to move and carry charge",
            "the ions need to be free to move",
            "so ions can move and carry charge",
            "ions are free to move and conduct electricity",
            "ions must move to conduct electricity",
            "to allow ions to move",
        ],
        "must_contain": ["ions", "move"],
        "memo": "The IONS need to be free to MOVE and carry charge; [1 mark — must mention IONS, not 'electrons']",
        "examiner_note": "Moderately answered. Some used 'electrons' instead of 'ions'.",
        "explanation": "**Solid ionic compounds DON'T conduct** because the ions are locked in a rigid lattice — they can't move.\n\nWhen melted OR dissolved in water:\n• Ions become **free to move** through the liquid\n• Positive ions move to the cathode, negative ions move to the anode\n• This **movement of charged particles = electric current**\n• Reactions happen at the electrodes\n\nKey: it's the IONS (charged particles) that carry current in electrolysis — NOT electrons. Saying 'electrons need to move' loses the mark.",
    },
    {
        "q": "2(d)(iii)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(d)(iii)** Write the **ionic half-equations** for the reactions at the cathode and anode (using single arrows).\n\nFormat: ''cathode: ___; anode: ___''.",
        "accepted": [
            "cathode Mg2+ + 2e- -> Mg; anode 2Br- -> Br2 + 2e-",
            "Mg2+ + 2e- -> Mg and 2Br- -> Br2 + 2e-",
            "Mg2+ + 2e -> Mg; 2Br- -> Br2 + 2e",
        ],
        "must_contain": ["Mg", "Br"],
        "memo": "Cathode: Mg²⁺ + 2e⁻ → Mg; [1]\nAnode: 2Br⁻ → Br₂ + 2e⁻ (accept 2Br⁻ − 2e⁻ → Br₂); [1]",
        "examiner_note": "Moderately answered. Many got the cathode but not the anode. Some forgot the minus sign on electrons (e⁻).",
        "explanation": "**Two half-equations:**\n\n**Cathode (−ve, reduction)** — Mg²⁺ ions GAIN electrons → become Mg metal:\n**Mg²⁺ + 2e⁻ → Mg**\n\n**Anode (+ve, oxidation)** — Br⁻ ions LOSE electrons → become Br₂ gas:\n**2Br⁻ → Br₂ + 2e⁻**\n\nKey checks: each half-equation BALANCES atoms AND charges. Two Br⁻ (total charge 2−) → Br₂ (neutral) + 2e⁻ (charge 2−). Charges balance. ✓",
    },
    {
        "q": "2(e)(i)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM + "\n\nBoth magnesium bromide and diamond form lattices.",
        "diagram": None,
        "prompt": "**(e)(i)** Distinguish between the **lattice of magnesium bromide** and that of **diamond**.",
        "memo": "Both required (1 mark each):\n1. The lattice of MgBr₂ is a giant IONIC lattice;\n2. While the lattice of diamond is giant COVALENT / giant molecular / macromolecular;",
        "rubric": "Award 1 mark for each correct comparison. Must mention BOTH 'ionic' (for MgBr₂) and 'covalent / giant covalent' (for diamond). PENALISE answers that don't compare or just describe one.",
        "examiner_note": "Poorly answered. Most couldn't distinguish ionic from covalent lattices.",
        "explanation": "**Two types of GIANT lattices:**\n\n• **MgBr₂ — Giant IONIC lattice**: alternating Mg²⁺ and Br⁻ ions held by **electrostatic forces** of attraction between oppositely charged ions.\n• **Diamond — Giant COVALENT lattice** (also called giant molecular or macromolecular): every C atom is **covalently bonded to 4 other C atoms** in a 3D tetrahedral network.\n\nKey difference: IONIC = positive + negative ions; COVALENT = atoms sharing electrons. Both 'giant' (3D networks), but different bonding types.",
    },
    {
        "q": "2(e)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM + "\n\nDiamond is an allotrope of carbon.",
        "diagram": None,
        "prompt": "**(e)(ii)** Describe the **structure of diamond**.",
        "accepted": [
            "each carbon is bonded to 4 other carbons",
            "each carbon atom bonded to four other carbon atoms",
            "tetrahedral",
            "each C bonded to 4 C",
            "carbon bonded to 4 other carbon atoms tetrahedrally",
        ],
        "must_contain": ["4", "carbon"],
        "memo": "Each carbon atom is bonded to **4 other carbon atoms** / tetrahedral arrangement; [1 mark]",
        "examiner_note": "Well answered.",
        "explanation": "**Diamond structure:**\n• Each carbon atom forms **4 covalent bonds** to 4 other carbon atoms\n• Arranged in a **tetrahedral** geometry (109.5° between bonds)\n• Extends in a 3D network throughout the entire crystal — there are no separate molecules in a diamond\n\nThat's why diamond is so hard — you can't move atoms without breaking very strong covalent bonds throughout the structure.",
    },
    {
        "q": "2(e)(iii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(e)(iii)** In terms of **bonding**, explain why **diamond has a high melting point**.",
        "accepted": [
            "strong covalent bonds",
            "many strong covalent bonds",
            "strong (covalent) bonds throughout",
            "has strong covalent bonds",
            "strong bonds need lots of energy to break",
        ],
        "must_contain": ["strong", "covalent"],
        "memo": "It has **strong COVALENT bonds** (between all the carbon atoms — many bonds to break); [1 mark]",
        "examiner_note": "Fairly answered. Majority referred to 'electrostatic forces' instead of 'covalent bonds'.",
        "explanation": "Diamond's high melting point comes from:\n• **Many STRONG COVALENT bonds** throughout the entire 3D lattice\n• To melt, EVERY one of these bonds must be broken — needs ENORMOUS energy\n• Result: melting point of diamond is about **3500 °C** (no metal even comes close)\n\nDon't say 'electrostatic forces' — that's ionic compounds. Diamond is covalent (atoms sharing electrons), not ionic.",
    },

    # ═══════════ Q3 — Haber process (14 marks) ═══════════
    {
        "q": "3(a)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": None,
        "prompt": "**(a)** Balance the chemical equation:\n\nN₂ + .....H₂ ⇌ .....NH₃\n\nGive the two coefficients (e.g. ''3 and 2'').",
        "accepted": ["3 and 2", "3, 2", "3 2", "N2 + 3H2 -> 2NH3"],
        "must_contain": ["3", "2"],
        "memo": "**N₂ + 3H₂ ⇌ 2NH₃** (coefficients: 3 and 2); [1 mark]",
        "examiner_note": "Well answered. Many were able to balance the equation.",
        "explanation": "**Balance step by step:**\n\nN: LHS has 2 N (from N₂) → RHS needs 2 N → coefficient of NH₃ = **2** → 2NH₃ has 2 N ✓\n\nH: RHS now has 2×3 = 6 H → LHS needs 6 H → coefficient of H₂ = **3** → 3H₂ has 6 H ✓\n\n**N₂ + 3H₂ ⇌ 2NH₃**\n\nThis is the classic Haber-Bosch process equation — remember the 1:3:2 ratio.",
    },
    {
        "q": "3(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": None,
        "prompt": "**(b)** State **why a catalyst is used** in the Haber process.",
        "accepted": [
            "to speed up the reaction",
            "increases the rate of reaction",
            "to increase the rate of reaction",
            "speeds up the reaction",
            "lowers activation energy",
            "provides alternative pathway with lower activation energy",
            "to make the reaction faster",
        ],
        "must_contain": [],
        "memo": "To SPEED UP the chemical reaction / provide alternative pathway by lowering activation energy; [1 mark]",
        "examiner_note": "Well answered.",
        "explanation": "**A catalyst INCREASES the RATE of reaction** without being used up.\n\nFor the Haber process:\n• Iron catalyst (Fe) lets the reaction reach equilibrium MUCH faster\n• Without the catalyst, the reaction would be too slow to be economical\n\nNote: a catalyst does NOT change the position of equilibrium or the yield — it only changes HOW FAST equilibrium is reached.",
    },
    {
        "q": "3(c)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM, "diagram": None,
        "prompt": "**(c)** Explain, in terms of **bond breaking and bond forming**, why the reaction is **exothermic**.",
        "memo": (
            "Both required (1 mark each):\n"
            "1. Bond breaking is ENDOTHERMIC (energy absorbed) AND bond making is EXOTHERMIC (energy released);\n"
            "2. MORE energy is RELEASED in making bonds than is ABSORBED in breaking bonds;"
        ),
        "rubric": "Award 1 mark for stating bond breaking = endothermic AND bond making = exothermic. Award 1 mark for the COMPARISON: more energy released than absorbed (net exothermic). PENALISE contradictions; bond making described as endothermic.",
        "examiner_note": "Poorly answered. Many couldn't differentiate which process involves bond breaking vs bond forming.",
        "explanation": "**Two energy facts to memorise:**\n\n1. **Breaking bonds REQUIRES energy** (endothermic — you must put energy IN to pull atoms apart)\n2. **Making bonds RELEASES energy** (exothermic — atoms 'snap together' giving out energy)\n\n**Overall ΔH = energy absorbed (breaking) − energy released (making)**\n\nFor an EXOTHERMIC reaction:\n• Energy released when new bonds form (in NH₃) > energy absorbed when old bonds break (in N₂ and H₂)\n• Net: energy LEAVES the system → surroundings get warmer\n\nFor the Haber process this is true — the N–H bonds in NH₃ release more energy than is needed to break N≡N and H–H bonds.",
    },
    {
        "q": "3(d)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM, "diagram": None,
        "prompt": "**(d)** Describe and explain the **effect on the position of equilibrium** when the **pressure is decreased**.",
        "memo": (
            "Both required (1 mark each):\n"
            "1. The equilibrium shifts to the LEFT / more reactants formed;\n"
            "2. When pressure is decreased, equilibrium shifts to the side with MORE MOLES OF GAS (LHS has 4 moles: 1+3; RHS has 2 moles);"
        ),
        "rubric": "Award 1 mark for stating LHS / more reactants / equilibrium shifts LEFT. Award 1 mark for explanation in terms of moles of gas (LHS has more moles). PENALISE: contradicting statements (shifts left because pressure increases); 'shifts to reactants' without justification.",
        "examiner_note": "The LEAST well answered question on this paper. Very few could give the effect; some gave contradicting answers.",
        "explanation": "**Le Chatelier's principle for pressure:**\n\nWhen pressure DECREASES, the system tries to RAISE the pressure → equilibrium shifts toward the side with MORE moles of gas.\n\nCount moles in this equation:\n• LHS: N₂ + 3H₂ = **4 moles of gas**\n• RHS: 2NH₃ = **2 moles of gas**\n\nSince LHS has MORE moles → low pressure favours LHS → **equilibrium shifts to the LEFT** (more reactants formed, less ammonia).\n\nThat's WHY industrial Haber process uses HIGH pressure (~200 atm) — it pushes equilibrium toward the right (more NH₃).",
    },
    {
        "q": "3(e)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": None,
        "prompt": "**(e)** State the **shape** of a molecule of **ammonia (NH₃)**.",
        "accepted": [
            "pyramidal", "triangular pyramidal", "trigonal pyramidal",
            "(triangular) pyramidal",
        ],
        "must_contain": ["pyramid"],
        "memo": "(Triangular / trigonal) pyramidal — REJECT 'pyramide'; [1 mark]",
        "examiner_note": "Well answered.",
        "explanation": "**Ammonia (NH₃) shape: TRIGONAL PYRAMIDAL** (sometimes called 'triangular pyramidal').\n\nWhy: nitrogen has 4 electron pairs around it — 3 bonding pairs (to H atoms) + 1 lone pair. The lone pair pushes the 3 N–H bonds down → pyramid shape (bond angle ~107°).\n\nDon't confuse with:\n• Methane (CH₄) — TETRAHEDRAL (4 bonds, no lone pair)\n• Water (H₂O) — BENT (2 bonds, 2 lone pairs)\n\nSpell 'pyramidal' carefully — 'pyramide' is wrong.",
    },
    {
        "q": "3(f)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM + "\n\nAmmonia is a base.",
        "diagram": None,
        "prompt": "**(f)** Name the **ion** present in ammonia solution that makes it alkaline.",
        "accepted": ["hydroxide", "OH-", "hydroxide ion", "OH⁻", "OH"],
        "must_contain": ["OH"],
        "memo": "Hydroxide / OH⁻; [1 mark — symbol must include the minus charge if given]",
        "examiner_note": "Well answered. Some gave the formula but missed the charge (writing 'OH.' instead of OH⁻).",
        "explanation": "**Ammonia + water → ammonium hydroxide:**\n\nNH₃ + H₂O ⇌ NH₄⁺ + OH⁻\n\nThe **hydroxide ion (OH⁻)** is what makes the solution alkaline.\n\nAll alkalis release OH⁻ in water — that's the definition of an alkali. (NaOH gives OH⁻, KOH gives OH⁻, ammonia solution gives OH⁻ via this reaction.)",
    },
    {
        "q": "3(g)(i)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM + "\n\n3NH₃ + H₃PO₄ → (NH₄)₃PO₄\n\n2.891 g of phosphoric acid, H₃PO₄, reacts with ammonia.\n\n[H=1, P=31, O=16, N=14]",
        "diagram": None,
        "prompt": "**(g)(i)** Calculate the **number of moles in 2.891 g of phosphoric acid (H₃PO₄)**. Show your working.",
        "memo": "Working (2 marks):\n1. Formula: n = m / Mr (Mr of H₃PO₄ = 3 + 31 + 64 = 98); [1]\n2. Calculation: n = 2.891 / 98 = **0.0295 mol** (no rounding off — accept any correct rounding from 2 s.f.); [1]",
        "rubric": "Award 1 mark for correct formula and Mr (98). Award 1 mark for the final answer (0.0295 mol or correctly rounded to 2+ s.f.). PENALISE wrong rounding (e.g. 0.029 if presented as the only answer).",
        "examiner_note": "Most candidates were awarded full credit. The most common error was rounding off incorrectly.",
        "explanation": "**Three-step mole calculation:**\n\n1. **Mr of H₃PO₄** = (3 × 1) + 31 + (4 × 16) = 3 + 31 + 64 = **98 g/mol**\n2. **Formula**: n = m ÷ Mr\n3. **Calculation**: n = 2.891 ÷ 98 = **0.0295 mol** (to 3 s.f.)\n\nDon't round too early — keep this value for part (ii).",
    },
    {
        "q": "3(g)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM + "\n\n3NH₃ + H₃PO₄ → (NH₄)₃PO₄\n\nMoles of H₃PO₄ = 0.0295 mol (from part (i))\n\n[Mr NH₃ = 17]",
        "diagram": None,
        "prompt": "**(g)(ii)** Calculate the **mass of ammonia (NH₃)** that reacts with 2.891 g of H₃PO₄. Show your working.",
        "memo": "Working (2 marks):\n1. Mole ratio: 3 NH₃ : 1 H₃PO₄ → moles of NH₃ = 0.0295 × 3 = **0.0885 mol**; [1]\n2. Mass: m = n × Mr = 0.0885 × 17 = **1.5045 g** (accept rounded to ~1.50 g); [1]\nError-carried-forward (ECF) applies from part (i).",
        "rubric": "Award 1 mark for using the 3:1 mole ratio (0.0885 seen) and 1 mark for the final mass (~1.50 g). ECF from part (i) if the candidate's earlier value was wrong.",
        "examiner_note": "Most candidates could not use the mole ratio from the balanced equation.",
        "explanation": "**Two steps using the mole ratio:**\n\n1. From the equation **3NH₃ + H₃PO₄ → (NH₄)₃PO₄**: ratio is 3 NH₃ : 1 H₃PO₄\n   → moles of NH₃ = 3 × 0.0295 = **0.0885 mol**\n\n2. **Mass = moles × Mr** (Mr of NH₃ = 17):\n   → mass = 0.0885 × 17 = **1.50 g** (3 s.f.)\n\nKey insight: ALWAYS use the COEFFICIENTS from the balanced equation to get the mole ratio. Without the '3' in front of NH₃, you'd be off by a factor of 3.",
    },
    {
        "q": "3(g)(iii)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM + "\n\nAmmonium phosphate is a fertiliser.",
        "diagram": None,
        "prompt": "**(g)(iii)** State **two other elements** present in fertilisers (other than phosphorus). Format: ''___ and ___''.",
        "accepted": [
            "potassium and nitrogen",
            "nitrogen and potassium",
            "K and N",
            "N and K",
            "nitrogen, potassium",
        ],
        "must_contain": ["potass", "nitro"],
        "memo": "1. Potassium (K); [1]\n2. Nitrogen (N); [1]",
        "examiner_note": "Many candidates could give the other elements.",
        "explanation": "**NPK fertiliser** — the three macronutrient elements:\n• **N — Nitrogen** (for leafy growth, proteins)\n• **P — Phosphorus** (already given in the question)\n• **K — Potassium** (for flowers, fruits, water balance)\n\nThe question asks for two OTHER than phosphorus → **Nitrogen and Potassium** ✓\n\nMemory hook: NPK is on every fertiliser bag — three numbers like '10-5-5' = 10% N, 5% P, 5% K.",
    },

    # ═══════════ Q4 — Acids (9 marks) ═══════════
    {
        "q": "4(a)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q4_STEM, "diagram": "test-tubes-XY",
        "prompt": "**(a)** Describe what would be observed in each test-tube. Format: ''X: ___; Y: ___''.",
        "accepted": [
            "X universal indicator turns red Y magnesium dissolves and fizzing",
            "X turns red Y fizzes",
            "X red Y bubbles",
            "X turns red Y dissolves and bubbles",
            "X red Y effervescence",
        ],
        "must_contain": ["red"],
        "memo": "X: Universal indicator turns RED (acid is pH ~1-3); [1]\nY: Magnesium dissolves / fizzes / produces bubbles / effervescence / gas given off (any one); [1]",
        "examiner_note": "Well answered. A few referred to universal indicator as 'blue litmus paper turning red'. Some gave conclusions instead of observations for Y.",
        "explanation": "**Observations (what you SEE):**\n\n**Test-tube X (universal indicator + HCl):**\n• Universal indicator paper turns **RED** (HCl is a strong acid, pH ~1-2)\n• Red shows STRONG acid; orange/yellow shows weak acid; green = neutral; blue/purple = alkali\n\n**Test-tube Y (magnesium + HCl):**\n• Magnesium **dissolves** (gets smaller, eventually disappears)\n• **Fizzing / bubbles / effervescence** (hydrogen gas released)\n• Reaction: Mg + 2HCl → MgCl₂ + H₂\n\n'Magnesium reacts' would be conclusion. The OBSERVATION is what you see — bubbles, dissolving, fizzing.",
    },
    {
        "q": "4(b)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": Q4_STEM + "\n\nHydrochloric acid is a strong acid.",
        "diagram": None,
        "prompt": "**(b)** Explain the difference between **strong and weak acids** in terms of **dissociation into ions**.",
        "memo": "Both halves required (1 mark for the COMPARISON):\n• Strong acid DISSOCIATES (ionises) COMPLETELY (fully) in water;\n• Weak acid dissociates PARTIALLY (slightly / partly) in water;",
        "rubric": "Award 1 mark for a CLEAR comparison showing strong = complete dissociation AND weak = partial. PENALISE answers that only describe one (e.g. 'strong acid dissociates fully' without the contrast).",
        "examiner_note": "Fairly answered. Many couldn't give a clear comparison.",
        "explanation": "**The key difference is about IONISATION in water:**\n\n• **Strong acid** (HCl, H₂SO₄, HNO₃) — **COMPLETELY** dissociates into ions in water:\n  HCl + H₂O → H⁺ + Cl⁻ (every HCl molecule ionises)\n• **Weak acid** (ethanoic acid, citric acid) — only **PARTIALLY** dissociates (most molecules stay intact):\n  CH₃COOH ⇌ CH₃COO⁻ + H⁺ (only ~1% ionise)\n\nStrong acids have a LOWER pH at the same concentration because they produce more H⁺ ions.",
    },
    {
        "q": "4(c)(i)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": "Acids react with alkalis in neutralisation to give salt and water.",
        "diagram": None,
        "prompt": "**(c)(i)** Describe the **chemical test for water**. State the TEST and the RESULT.",
        "accepted": [
            "anhydrous copper sulfate turns blue",
            "anhydrous CuSO4 turns blue",
            "white copper sulfate turns blue",
            "anhydrous cobalt chloride turns pink",
            "blue cobalt chloride turns pink",
            "anhydrous cobalt chloride turns from blue to pink",
        ],
        "must_contain": ["blue"],
        "memo": "Test: Add drops of water to **anhydrous (white) copper(II) sulfate** OR anhydrous (blue) cobalt chloride; [1]\nResult: **Turns BLUE** (for CuSO₄) OR turns PINK (for CoCl₂); [1]",
        "examiner_note": "Candidates did well — many had practiced this.",
        "explanation": "**Two chemical tests for water:**\n\n• **Anhydrous copper(II) sulfate** (WHITE) → turns **BLUE** ✓ (forms hydrated CuSO₄·5H₂O)\n• **Anhydrous cobalt chloride** (BLUE) → turns **PINK** (forms hydrated CoCl₂·6H₂O)\n\n⚠ These tests show that the liquid IS water — but they don't show it's PURE water. For purity, check the boiling point (100 °C) or freezing point (0 °C).",
    },
    {
        "q": "4(c)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Acids react with alkalis in neutralisation to give salt and water.",
        "diagram": None,
        "prompt": "**(c)(ii)** Give the **name of the salt** formed when **calcium hydroxide** neutralises **sulfuric acid**.",
        "accepted": ["calcium sulfate", "Calcium sulfate", "calcium sulphate"],
        "must_contain": ["calcium", "sulfate"],
        "memo": "Calcium sulfate (CaSO₄); [1 mark — REJECT 'calcium sulfide']",
        "examiner_note": "Most candidates answered reasonably well. Some referred to 'sulfide' instead of 'sulfate' (wrong product).",
        "explanation": "**Acid + base → salt + water (neutralisation):**\n\nCa(OH)₂ + H₂SO₄ → **CaSO₄** + 2H₂O\n\n• Calcium hydroxide (alkali) + sulfuric acid → **calcium sulfate** + water\n\nName the salt from the ACID:\n• Hydrochloric acid → chloride\n• Sulfuric acid → **sulfate**\n• Nitric acid → nitrate\n• Phosphoric acid → phosphate\n\nDon't write 'sulfide' (that's the S²⁻ ion, made by reacting with sulfur — different chemistry).",
    },
    {
        "q": "4(d)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Silver chloride (AgCl) is an insoluble salt.",
        "diagram": None,
        "prompt": "**(d)(i)** Name the **method** used to prepare insoluble salts.",
        "accepted": [
            "precipitation",
            "Precipitation",
            "double decomposition",
            "ionic precipitation",
        ],
        "must_contain": [],
        "memo": "Precipitation / double decomposition; [1 mark]",
        "examiner_note": "A lot of candidates struggled — referring to 'filtration' and 'crystallisation' instead of precipitation.",
        "explanation": "**Three ways to prepare salts:**\n• Soluble salt (acid + insoluble base) — react, then evaporate to crystallise\n• Soluble salt of Group I (acid + alkali) — titration, then evaporate\n• **Insoluble salt** — **PRECIPITATION**: mix two SOLUBLE solutions that contain the ions of the desired salt → insoluble salt drops out as a solid (filter it off)\n\nAlso called **double decomposition** (cations and anions swap partners).",
    },
    {
        "q": "4(d)(ii)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": "Silver chloride (AgCl) is an insoluble salt prepared by precipitation.",
        "diagram": None,
        "prompt": "**(d)(ii)** Suggest **two suitable starting materials** for preparing silver chloride. Format: ''___ and ___''.",
        "accepted": [
            "silver nitrate and sodium chloride",
            "silver nitrate and potassium chloride",
            "AgNO3 and NaCl",
            "AgNO3 and KCl",
            "silver nitrate, sodium chloride",
        ],
        "must_contain": ["silver nitrate"],
        "memo": "1. Silver nitrate (AgNO₃); [1]\n2. Sodium chloride (NaCl) OR potassium chloride (KCl) — any soluble chloride; [1]",
        "examiner_note": "Not well answered. Many candidates misread 'starting materials' as 'starting apparatus' (beaker, funnel, filter paper).",
        "explanation": "**For precipitation, mix two SOLUBLE compounds that contain the Ag⁺ and Cl⁻ ions:**\n\n• Need **Ag⁺** → from soluble silver salt: **silver nitrate (AgNO₃)** (silver salts are mostly insoluble except nitrate)\n• Need **Cl⁻** → from soluble chloride: **sodium chloride (NaCl)** or KCl\n\nReaction:\nAgNO₃ + NaCl → **AgCl ↓** (white precipitate) + NaNO₃ (stays in solution)\n\nFilter, wash, and dry the AgCl precipitate to get pure salt.\n\n⚠ NOT 'apparatus' — the question asks for starting MATERIALS (chemicals).",
    },

    # ═══════════ Q5 — Metals & reactivity (13 marks) ═══════════
    {
        "q": "5(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q5_STEM, "diagram": None,
        "prompt": "**(a)(i)** Identify a metal which **burns with a bright yellow flame**.",
        "accepted": ["sodium", "Sodium", "Na"],
        "must_contain": ["sodium"],
        "memo": "Sodium; [1 mark]",
        "examiner_note": "Fairly answered. Majority could not identify the metal.",
        "explanation": "**Sodium burns with a bright YELLOW (golden) flame.** Same colour as the flame test for sodium.\n\nNa + O₂ → Na₂O (sodium oxide)\n\nMemory: street lamps that look yellow-orange contain sodium vapour — same colour. Don't confuse with potassium (lilac) or calcium (orange-red).",
    },
    {
        "q": "5(a)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q5_STEM, "diagram": None,
        "prompt": "**(a)(ii)** Identify **the least reactive metal** in the list.",
        "accepted": ["copper", "Copper", "Cu"],
        "must_contain": ["copper"],
        "memo": "Copper; [1 mark]",
        "examiner_note": "Very well answered.",
        "explanation": "**Reactivity series** (from list) — most reactive at TOP, least at BOTTOM:\n\nNa, Ca, Mg, Al, (C), Zn, Fe, (H), **Cu**\n\nBarium is also reactive (Group II like Ca). Hydrogen is a non-metal and carbon is non-metal too.\n\nAmong the METALS listed, **copper is the lowest** in the reactivity series → **least reactive** ✓. That's why copper doesn't react with dilute acids or water.",
    },
    {
        "q": "5(a)(iii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q5_STEM, "diagram": None,
        "prompt": "**(a)(iii)** Identify the **non-metal component of steel**.",
        "accepted": ["carbon", "Carbon", "C"],
        "must_contain": ["carbon"],
        "memo": "Carbon; [1 mark]",
        "examiner_note": "Many candidates got this correct.",
        "explanation": "**Steel = iron + a small amount of CARBON** (and sometimes other elements).\n\nThe carbon content makes steel **harder and stronger** than pure iron:\n• Mild steel (~0.2% C) — used in cars, building structures\n• High-carbon steel (~1% C) — harder, used in tools, knives\n• Stainless steel — also contains chromium + nickel\n\nIron is the metal; carbon is the non-metal in the alloy.",
    },
    {
        "q": "5(a)(iv)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q5_STEM, "diagram": None,
        "prompt": "**(a)(iv)** Identify a metal which is **extracted by reduction of its ore using carbon**.",
        "accepted": ["iron", "zinc", "Iron", "Zinc", "Fe", "Zn"],
        "must_contain": [],
        "memo": "Iron OR zinc; [1 mark]",
        "examiner_note": "Many could identify the metal.",
        "explanation": "**Carbon reduces metal oxides** for metals BELOW carbon in the reactivity series:\n• **Iron** (blast furnace): Fe₂O₃ + 3C → 2Fe + 3CO ✓\n• **Zinc**: ZnO + C → Zn + CO ✓\n\nMetals ABOVE carbon (K, Na, Ca, Mg, Al) need ELECTROLYSIS instead — carbon isn't reactive enough to displace them.\n\nMetals LIKE COPPER are often found native or are easy to extract by simple heating.",
    },
    {
        "q": "5(a)(v)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q5_STEM, "diagram": None,
        "prompt": "**(a)(v)** Identify a metal which is used to **galvanise iron**.",
        "accepted": ["zinc", "Zinc", "Zn"],
        "must_contain": ["zinc"],
        "memo": "Zinc; [1 mark]",
        "examiner_note": "Well performed.",
        "explanation": "**Galvanising** = coating iron/steel with a thin layer of **ZINC** to prevent rust.\n\nHow it protects:\n1. Physical barrier — zinc blocks air and water from reaching the iron\n2. **Sacrificial protection** — even if scratched, zinc is MORE reactive than iron, so it corrodes preferentially (zinc reacts instead of the iron)\n\nUsed for: roofing sheets, nails, buckets, fencing. The shiny grey coating is zinc.",
    },
    {
        "q": "5(b)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": Q5_STEM, "diagram": None,
        "prompt": "**(b)** Compare **one physical property** of metals and non-metals.",
        "memo": (
            "Any one COMPARISON (1 mark):\n"
            "• Metals have HIGH density / HIGH melting & boiling point / good conductors of heat & electricity / malleable / ductile / shiny;\n"
            "• while non-metals have LOW density / LOW m.p. & b.p. / poor conductors / brittle / dull;"
        ),
        "rubric": "Award 1 mark for ONE clear comparison (must contrast metals with non-metals — both halves needed). PENALISE answers that only describe metals OR only describe non-metals.",
        "examiner_note": "Fairly answered. Majority could not give a CLEAR COMPARISON between metals and non-metals.",
        "explanation": "**Pick ONE property and compare both sides:**\n\n| Property | Metals | Non-metals |\n|---|---|---|\n| Density | High | Low |\n| Melting point | High | Low |\n| Conductivity | Good | Poor (insulators) |\n| Appearance | Shiny | Dull |\n| Malleability | Malleable | Brittle |\n\nExample answer: 'Metals have HIGH melting and boiling points while non-metals have LOW melting and boiling points.'\n\nKey: the answer MUST CONTRAST the two — describing only metals (or only non-metals) doesn't score.",
    },
    {
        "q": "5(c)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Aluminium is a widely used metal.",
        "diagram": None,
        "prompt": "**(c)(i)** Explain why a sample of aluminium can appear **LESS reactive than expected**.",
        "accepted": [
            "protective oxide layer",
            "oxide layer protects it",
            "has a stable oxide layer",
            "aluminium has a protective oxide layer",
            "thin layer of aluminium oxide on the surface",
            "protective layer of aluminium oxide",
            "stable oxide layer prevents further reaction",
        ],
        "must_contain": ["oxide"],
        "memo": "It forms a (thin, PROTECTIVE or STABLE) layer of aluminium oxide on its surface; [1 mark — 'protective' or 'stable' required]",
        "examiner_note": "Not very well answered. A lot of candidates only referred to 'oxide layer' without mentioning 'protective' or 'stable'.",
        "explanation": "**Aluminium's surprise:**\n\nAl is HIGH in the reactivity series (above Zn, Fe, even above carbon). It should react vigorously with air and water. BUT:\n\n• Air immediately reacts with the surface → forms a **thin, tough, PROTECTIVE layer of Al₂O₃** (aluminium oxide)\n• This layer is **stable** and **stops further reaction**\n• So Al APPEARS unreactive\n\nThis is why aluminium pans, window frames, drink cans don't corrode — the invisible oxide layer protects everything underneath. Anodising thickens this layer for extra protection.",
    },
    {
        "q": "5(c)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Aluminium is extracted from its main ore by electrolysis.",
        "diagram": None,
        "prompt": "**(c)(ii)** Name the **main ore of aluminium**.",
        "accepted": ["bauxite", "Bauxite"],
        "must_contain": ["bauxite"],
        "memo": "Bauxite; [1 mark — spelling matters]",
        "examiner_note": "Majority misspelt 'bauxite'. Some confused with haematite (iron ore).",
        "explanation": "**Bauxite** = the main ore of aluminium. Mostly aluminium oxide (Al₂O₃) mixed with iron oxide and other impurities.\n\nAluminium is extracted from purified bauxite by **electrolysis** of molten Al₂O₃ (dissolved in cryolite, Na₃AlF₆, to lower the melting point):\n• At cathode: Al³⁺ + 3e⁻ → Al\n• At anode: 2O²⁻ → O₂ + 4e⁻\n\nDon't confuse:\n• **Bauxite** → aluminium\n• Haematite → iron",
    },
    {
        "q": "5(d)(i)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": "When zinc granules are added to aqueous copper(II) sulfate, a red-pink solid forms and the solution becomes colourless.",
        "diagram": None,
        "prompt": "**(d)(i)** Name the **red-pink solid** and the **colourless solution**. Format: ''solid: ___; solution: ___''.",
        "accepted": [
            "copper and zinc sulfate",
            "solid copper solution zinc sulfate",
            "copper, zinc sulfate",
            "Cu, ZnSO4",
        ],
        "must_contain": ["copper", "zinc sulfate"],
        "memo": "Red-pink solid: COPPER; [1]\nColourless solution: ZINC SULFATE; [1]\n[Total 2 marks]",
        "examiner_note": "Poorly answered. Many couldn't identify the type of reaction.",
        "explanation": "**Displacement reaction:**\n\nZn + CuSO₄ → ZnSO₄ + Cu\n\n• **Red-pink solid = COPPER metal** (Cu²⁺ is reduced to Cu⁰)\n• **Colourless solution = ZINC SULFATE** (Zn²⁺ ions are colourless, replacing the BLUE Cu²⁺ ions)\n\nThe colour change (blue → colourless) is a key clue that Cu²⁺ has been displaced from solution.",
    },
    {
        "q": "5(d)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "When zinc granules are added to aqueous copper(II) sulfate, a red-pink solid forms and the solution becomes colourless.",
        "diagram": None,
        "prompt": "**(d)(ii)** Explain why a red-pink solid and a colourless solution are formed.",
        "memo": "Both required (1 mark each):\n1. Zinc is MORE REACTIVE than copper;\n2. (So) zinc DISPLACES copper from its compound (copper sulfate);",
        "rubric": "Award 1 mark for stating zinc is more reactive than copper, 1 mark for using the word DISPLACES (or 'displacement reaction'). PENALISE 'replace' or vague 'reacts with'.",
        "examiner_note": "Many referred to 'zinc REPLACE copper' instead of 'zinc DISPLACE copper' (wrong word).",
        "explanation": "**Displacement rule:** A more reactive metal **DISPLACES** a less reactive metal from its compound.\n\n• Reactivity: Zn > Cu (zinc is higher in the series)\n• So **zinc displaces copper** from copper(II) sulfate\n• Zn becomes Zn²⁺ (dissolves into solution → zinc sulfate)\n• Cu²⁺ becomes Cu metal (deposits as red-pink solid)\n\nUse the exact word **DISPLACES** (or 'displacement') — examiners reject 'replaces' or 'swaps with'.",
    },
    {
        "q": "5(d)(iii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Zn + CuSO₄ → ZnSO₄ + Cu",
        "diagram": None,
        "prompt": "**(d)(iii)** In terms of changes in ionic charge, state which substance is **oxidised**.",
        "accepted": ["zinc", "Zinc", "Zn"],
        "must_contain": ["zinc"],
        "memo": "Zinc (Zn → Zn²⁺ + 2e⁻; loses electrons → oxidised); [1 mark]",
        "examiner_note": "Many candidates referred to 'zinc sulfate' or 'zinc ions' instead of zinc element itself.",
        "explanation": "**OIL RIG: Oxidation Is Loss (of electrons).**\n\nZn → Zn²⁺ + 2e⁻\n• Zinc goes from charge 0 to +2 → it LOSES 2 electrons → ZINC is **OXIDISED** ✓\n\nMeanwhile, Cu²⁺ → Cu (copper goes from +2 to 0 → gains 2 electrons → REDUCED).\n\nAnswer is ZINC (the element/atom), not zinc sulfate (the product) or zinc ions (the result).",
    },

    # ═══════════ Q6 — Ethanol & alcohols (14 marks) ═══════════
    {
        "q": "6(a)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q6_STEM, "diagram": None,
        "prompt": "**(a)** What is the **name** given to any family of organic compounds with the same general formula and similar chemical properties?",
        "accepted": ["homologous series", "Homologous series", "homologous", "homologue series"],
        "must_contain": ["homolog"],
        "memo": "Homologous series; [1 mark — spelling important]",
        "examiner_note": "Candidates struggled with the spelling of 'homologous'.",
        "explanation": "**Homologous series** = a family of organic compounds where members:\n• Have the same general formula\n• Differ by a CH₂ unit\n• Have similar chemical properties (same functional group)\n• Have a gradual change in physical properties (boiling point, density)\n\nExamples: alkanes (CH₄, C₂H₆, C₃H₈ ...), alkenes, alcohols, carboxylic acids.\n\nSpell carefully: **homo-LOG-ous** (Greek root, like 'analog').",
    },
    {
        "q": "6(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q6_STEM, "diagram": None,
        "prompt": "**(b)** Give the **general formula of alcohols**.",
        "accepted": ["CnH2n+1OH", "CₙH₂ₙ₊₁OH", "CnH2n+1 OH"],
        "must_contain": ["OH"],
        "memo": "CₙH₂ₙ₊₁OH; [1 mark — correct answer only]",
        "examiner_note": "Candidates found this very hard; many wrote the alkane formula instead.",
        "explanation": "**General formulas to memorise:**\n• Alkanes: **CₙH₂ₙ₊₂**\n• Alkenes: CₙH₂ₙ\n• **Alcohols: CₙH₂ₙ₊₁OH** ✓ (alkane minus one H, plus OH)\n• Carboxylic acids: CₙH₂ₙ₊₁COOH\n\nExamples:\n• n=1 → CH₃OH (methanol)\n• n=2 → C₂H₅OH (ethanol)\n• n=3 → C₃H₇OH (propanol)\n\nThe OH is the alcohol functional group.",
    },
    {
        "q": "6(c)(i)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q6_STEM + "\n\nEthanol can be manufactured by the fermentation of glucose, C₆H₁₂O₆.",
        "diagram": None,
        "prompt": "**(c)(i)** State **two conditions** needed for the fermentation of glucose. Format: ''___ and ___''.",
        "accepted": [
            "yeast and 25-37 C", "yeast and 25-37 degrees",
            "yeast and temperature 25-37",
            "yeast, 25-37 degrees Celsius",
            "yeast and anaerobic conditions",
            "yeast and no oxygen",
            "yeast and warm temperature",
            "yeast, anaerobic",
        ],
        "must_contain": ["yeast"],
        "memo": "1. Yeast / anaerobic (in absence of oxygen) — any one; [1]\n2. Temperature 25–37 °C; [1]",
        "examiner_note": "Most candidates could only score one mark — they missed the correct temperature.",
        "explanation": "**Fermentation conditions (yeast turns glucose into ethanol):**\n\n1. **YEAST** — provides the enzymes (zymase) that catalyse the reaction\n2. **Temperature 25–37 °C** — warm enough for enzymes to work, but not so hot they denature\n3. Optional: **anaerobic** (no oxygen) — otherwise the yeast just respires aerobically and you get CO₂ + water, not alcohol\n\nGive ANY TWO. The temperature range is specifically 25–37 °C (body-temperature range — yeast is alive!).",
    },
    {
        "q": "6(c)(ii)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": "C₆H₁₂O₆ →  ......C₂H₅OH + ......",
        "diagram": None,
        "prompt": "**(c)(ii)** Complete and balance the chemical equation. Give the coefficient before C₂H₅OH AND the other product (with coefficient). Format: ''2 C2H5OH + 2 CO2''.",
        "accepted": [
            "2 C2H5OH + 2 CO2",
            "2 ethanol + 2 CO2",
            "2 and 2 CO2",
            "2 C2H5OH + 2CO2",
        ],
        "must_contain": ["2", "CO2"],
        "memo": "C₆H₁₂O₆ → **2** C₂H₅OH + **2 CO₂**; [2 marks — 1 for CO₂ as product, 1 for correct balancing]",
        "examiner_note": "Most candidates were able to complete and balance this equation.",
        "explanation": "**Fermentation equation:**\n\nC₆H₁₂O₆ (glucose) → **2** C₂H₅OH (ethanol) + **2 CO₂** (carbon dioxide)\n\n**Balance check:**\n• C: LHS 6, RHS 2(2) + 2(1) = 4 + 2 = 6 ✓\n• H: LHS 12, RHS 2(6) = 12 ✓\n• O: LHS 6, RHS 2(1) + 2(2) = 2 + 4 = 6 ✓\n\nThe other product is CO₂ — that's the gas that makes bread rise, beer fizzy, and wine bubble during fermentation.",
    },
    {
        "q": "6(d)(i)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q6_STEM + "\n\nThe diagram shows reactions of ethanol:\n• Excess oxygen → gas **A** + water\n• Heat with ethanoic acid (conc. H₂SO₄) → organic liquid **B** + water\n• Oxidation with acidified KMnO₄ → liquid **C**\n• Compound **D** + steam (with acid catalyst) → ethanol",
        "diagram": "ethanol-reactions",
        "prompt": "**(d)(i)** Give the names of **A**, **B** and **C**. Format: ''A: ___; B: ___; C: ___''.",
        "memo": "A — carbon dioxide (CO₂); [1]\nB — ethyl ethanoate; [1]\nC — ethanoic acid; [1]",
        "rubric": "Award 1 mark each: A = CO₂; B = ethyl ethanoate; C = ethanoic acid. Names only (formulas not required). Accept 'ethanal' as alternative for partial oxidation but the full product is ethanoic acid.",
        "examiner_note": "A lot of candidates struggled. Majority only got A (carbon dioxide).",
        "explanation": "**Three reactions of ethanol:**\n\n• **A — excess O₂ (combustion)**: C₂H₅OH + 3O₂ → 2**CO₂** + 3H₂O\n  → Gas A is **carbon dioxide** ✓\n\n• **B — heat with ethanoic acid + conc. H₂SO₄ (esterification)**:\n  CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O\n  → Liquid B is **ethyl ethanoate** (an ester with fruity smell)\n\n• **C — oxidation with KMnO₄**:\n  C₂H₅OH + [O] → CH₃COOH + H₂O\n  → Liquid C is **ethanoic acid** (vinegar)\n\nMemorise these three reaction pathways!",
    },
    {
        "q": "6(d)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Compound D + steam (with acid catalyst) → ethanol",
        "diagram": "ethanol-reactions",
        "prompt": "**(d)(ii)** Deduce the identity of **compound D**, which reacts with steam to form ethanol.",
        "accepted": ["ethene", "Ethene", "C2H4", "C₂H₄", "ethylene"],
        "must_contain": ["ethene"],
        "memo": "Ethene (C₂H₄); [1 mark — REJECT 'ethane' (the alkane)]",
        "examiner_note": "Majority could not identify compound D — some referred to 'ethane'.",
        "explanation": "**Industrial production of ethanol from ethene (hydration):**\n\nC₂H₄ + H₂O (steam) → C₂H₅OH\n\n• Conditions: phosphoric acid catalyst, ~300 °C, 60-70 atm\n• Compound D = **ethene** (C₂H₄, the alkene)\n\nDon't confuse:\n• **Ethene** (C₂H₄) — has a C=C double bond → can add water → ethanol ✓\n• Ethane (C₂H₆) — saturated alkane → DOESN'T react with steam\n\nThe alkene's double bond is what makes hydration work.",
    },
    {
        "q": "6(e)(i)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "A simple sugar unit can be represented as a square with H–O– on the left and –O–H on the right (a hexose monomer). Simple sugars can be polymerised to make complex carbohydrates.",
        "diagram": "sugar-monomer",
        "prompt": "**(e)(i)** Describe the **structure of part of a carbohydrate polymer** made from the simple sugar shown. Describe what the linkage between two monomers looks like and how the chain repeats.",
        "memo": (
            "Both required (1 mark each):\n"
            "1. **One oxygen linkage (-O-) between two squares** (sugar units) — water has been removed (condensation);\n"
            "2. **Rest of the structure correct** — at least TWO repeating units shown, with brackets indicating the repeat pattern;"
        ),
        "rubric": "Award 1 mark for showing the GLYCOSIDIC LINKAGE: a single oxygen (–O–) joining two adjacent sugar units (squares). Award 1 mark for showing the REPEATING pattern correctly — at least 2 monomer units linked. PENALISE: showing –O–H– between sugars; missing the bracket/repeat notation; showing only one monomer.",
        "examiner_note": "Performed poorly. Few candidates could draw the carbohydrate polymer.",
        "explanation": "**How sugars polymerise (forming a polysaccharide like starch):**\n\nMonomer: H–O–[square]–O–H\n\nWhen TWO sugars join, they remove a water molecule (condensation):\n[square]–O–[square]–O–[square]– ... etc.\n\nDraw it like:\n\n  –[sq]–O–[sq]–O–[sq]–O–\n\nKey features:\n• Single oxygen bridge (**glycosidic linkage**) between each pair of sugar squares\n• Bracketed [unit]ₙ to show repeat\n• H₂O removed at each join\n\nExamples: starch (plant storage), glycogen (animal storage), cellulose (plant cell walls).",
    },
    {
        "q": "6(e)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "A carbohydrate polymer is broken down into simple sugars.",
        "diagram": None,
        "prompt": "**(e)(ii)** Name the **chemical process** that breaks a carbohydrate polymer down into simple sugars.",
        "accepted": ["hydrolysis", "Hydrolysis", "hydrolysing"],
        "must_contain": ["hydroly"],
        "memo": "Hydrolysis; [1 mark]",
        "examiner_note": "A good number answered correctly. Some referred to 'condensation polymerisation' — the OPPOSITE.",
        "explanation": "**Hydrolysis** = breaking down a polymer by ADDING WATER.\n\n• 'Hydro-' = water\n• '-lysis' = splitting / breaking\n\nCarbohydrate + H₂O → simple sugars (e.g. starch + water → maltose → glucose)\n\nOpposite process: **condensation polymerisation** (combines monomers + releases water) — that's how the polymer was made in the first place.\n\nProteins → amino acids by hydrolysis too. Same chemistry.",
    },
    {
        "q": "6(e)(iii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Hydrolysis breaks a carbohydrate polymer into simple sugars.",
        "diagram": None,
        "prompt": "**(e)(iii)** What **conditions** are needed for hydrolysis to occur?",
        "accepted": [
            "acid", "Acid", "enzyme", "amylase",
            "dilute acid", "enzymes", "acid or enzyme",
        ],
        "must_contain": [],
        "memo": "Acid (accept enzyme OR amylase); [1 mark]",
        "examiner_note": "Performed poorly. More revision needed.",
        "explanation": "**Two ways to hydrolyse carbohydrates:**\n\n• **Acid hydrolysis** — heat with dilute acid (HCl) — non-specific, breaks any glycosidic bond\n• **Enzymatic hydrolysis** — specific enzymes like **amylase** (in saliva, breaks starch into maltose) or other carbohydrases\n\nAcid is the textbook answer; enzyme/amylase is also accepted.\n\nWhen you chew bread, amylase in your saliva starts hydrolysing the starch into sugars — that's why bread starts tasting sweet if you chew it long enough!",
    },

    # ═══════════ Q7 — Air (9 marks) ═══════════
    {
        "q": "7(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q7_STEM, "diagram": None,
        "prompt": "**(a)(i)** Other than nitrogen and oxygen, give **another ELEMENT** found in clean, dry air.",
        "accepted": ["argon", "Argon", "Ar", "helium", "neon", "noble gas"],
        "must_contain": [],
        "memo": "Argon (accept any Group 0 / noble gas); [1 mark — must be an ELEMENT, not a compound like CO₂]",
        "examiner_note": "Poorly answered. Majority referred to 'carbon dioxide' — which is NOT an element.",
        "explanation": "**Composition of dry air:**\n• ~78% **nitrogen** (N₂)\n• ~21% **oxygen** (O₂)\n• ~0.93% **ARGON** (Ar) ← the answer ✓\n• ~0.04% carbon dioxide (CO₂) — a COMPOUND, not an element\n• Trace amounts of other noble gases (Ne, He, Kr, Xe)\n• Variable: water vapour\n\nThe question asks for an ELEMENT (not a compound). The biggest non-N/O element is argon (~1%) — that's why it's the textbook answer.\n\n⚠ CO₂ is a compound (made of carbon AND oxygen) — doesn't qualify.",
    },
    {
        "q": "7(a)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q7_STEM + "\n\nNitrogen and oxygen can be separated from liquid air.",
        "diagram": None,
        "prompt": "**(a)(ii)** State the name of **this process** (separating gases from liquid air).",
        "accepted": ["fractional distillation", "Fractional distillation", "fractional distillation of liquid air"],
        "must_contain": ["fractional"],
        "memo": "Fractional distillation; [1 mark]",
        "examiner_note": "Only a small number gave the correct process.",
        "explanation": "**Fractional distillation of LIQUID air:**\n\n1. Air is filtered (remove dust)\n2. Cooled and compressed → becomes liquid at ~−200 °C\n3. Warmed slowly in a fractionating column\n4. Gases boil off at DIFFERENT temperatures:\n   • N₂ boils first at −196 °C\n   • Ar at −186 °C\n   • O₂ last at −183 °C\n\nResult: separated pure gases.\n\nSame process as separating crude oil — different liquids with different boiling points.",
    },
    {
        "q": "7(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q7_STEM, "diagram": None,
        "prompt": "**(b)** Give **one use of oxygen**.",
        "accepted": [
            "breathing", "respiration", "welding", "steel production",
            "sewage treatment", "combustion", "burning",
            "respiration in hospitals", "oxygen for breathing",
            "hospitals", "fuel cells",
        ],
        "must_contain": [],
        "memo": "Any one: breathing (in hospitals) / (aerobic) respiration / welding / steel production / sewage treatment / combustion / burning; [1 mark]",
        "examiner_note": "Well answered.",
        "explanation": "**Uses of oxygen (O₂):**\n• **Breathing / respiration** — medical use, in hospitals (oxygen masks for patients)\n• **Steel production** — pure O₂ blown through molten iron to remove impurities (carbon, sulfur)\n• **Welding** — oxy-acetylene torches (very hot flames)\n• **Combustion** of fuels (every fire needs oxygen)\n• **Sewage treatment** — aerobic bacteria need O₂ to break down waste\n• Fuel cells\n\nAny ONE use scores the mark.",
    },
    {
        "q": "7(c)(i)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": "Some pollutants in air are carbon monoxide and lead compounds.",
        "diagram": None,
        "prompt": "**(c)(i)** Give **one effect on health** of each:\n• Carbon monoxide\n• Lead compounds\n\nFormat: ''CO: ___; lead: ___''.",
        "accepted": [
            "CO suffocation lead brain damage",
            "carbon monoxide death lead brain damage",
            "CO: suffocation; lead: brain damage",
            "CO suffocation; lead compounds brain damage",
            "CO causes death lead causes brain damage",
        ],
        "must_contain": ["brain"],
        "memo": "Carbon monoxide → suffocation / death (binds to haemoglobin, prevents O₂ transport); [1]\nLead compounds → brain damage / brain cancer; [1]",
        "examiner_note": "Candidates struggled — many couldn't give the effects.",
        "explanation": "**Health effects to memorise:**\n\n• **Carbon monoxide (CO)** — binds to haemoglobin (forming carboxyhaemoglobin) and BLOCKS O₂ transport in blood → **suffocation / death** ✓\n• **Lead compounds** (from petrol, paint, batteries) — **BRAIN damage** (especially in children — affects learning and development), also kidney damage, anaemia\n\nThese are the standard NSSCO answers — short and specific.",
    },
    {
        "q": "7(c)(ii)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": "Sulfur dioxide is another pollutant which can be used for the manufacture of sulfuric acid (the Contact process).",
        "diagram": None,
        "prompt": "**(c)(ii)** State **two conditions** used in this industrial process. **Include units**. Format: ''temperature ___ °C and pressure ___ atm''.",
        "accepted": [
            "temperature 400-500 C pressure 1-2 atm",
            "400-500 C and 1-2 atm",
            "400 C 1 atm",
            "450 C 2 atm",
            "temperature 450 degrees pressure 1 atm",
            "vanadium oxide catalyst and 450 C",
        ],
        "must_contain": [],
        "memo": "Any TWO of:\n• Temperature: 400-500 °C; [1]\n• Pressure: 1-2 atm OR 100-200 kPa; [1]\n• Catalyst: vanadium(V) oxide (V₂O₅);",
        "examiner_note": "Candidates performed very well. A few missed the units.",
        "explanation": "**Contact process** — making sulfuric acid:\n\nKey step: 2SO₂ + O₂ ⇌ 2SO₃ (catalyst, exothermic)\n\nConditions:\n• **Temperature: 400–500 °C** (compromise — high enough for fast rate, low enough for good equilibrium yield since it's exothermic)\n• **Pressure: 1–2 atm** (only slightly above atmospheric — pressure doesn't help much here)\n• **Catalyst: Vanadium(V) oxide (V₂O₅)**\n\n⚠ Always include UNITS (°C and atm) — examiners deduct for missing units.",
    },
    {
        "q": "7(c)(iii)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q7_STEM, "diagram": None,
        "prompt": "**(c)(iii)** Name **one other pollutant** present in air (NOT carbon monoxide, lead, or sulfur dioxide). State its **source**. Format: ''pollutant: ___; source: ___''.",
        "memo": (
            "Pollutant + source (1 mark each, paired):\n"
            "• Excess CO₂ — from burning fossil fuels;\n"
            "• Oxides of nitrogen (NOₓ) — from internal combustion engines / car exhausts;\n"
            "• Excess methane — from decomposition of vegetation / digestion of animals (cows);\n"
            "• Unburnt hydrocarbons — from vehicle exhaust fumes;\n"
            "• Solid particles (soot, particulates) — from burning of waste materials / diesel exhaust;"
        ),
        "rubric": "Award 1 mark for naming a valid air pollutant (NOT one already given in part c). Award 1 mark for a correct source. PENALISE: pollutants already in the question (CO, lead compounds, SO₂); generic answers like 'cars cause pollution' without naming a specific pollutant.",
        "examiner_note": "Candidates struggled. Many gave CO, SO₂ or lead (already mentioned). Some described effects instead of sources.",
        "explanation": "**Air pollutants and their sources (pick ONE pair):**\n\n• **Carbon dioxide (CO₂)** — from BURNING FOSSIL FUELS (greenhouse gas, climate change)\n• **Nitrogen oxides (NOₓ)** — from CAR EXHAUSTS / internal combustion engines (cause acid rain)\n• **Methane (CH₄)** — from DECOMPOSITION of vegetation / CATTLE DIGESTION (strong greenhouse gas)\n• **Unburnt hydrocarbons** — from VEHICLE EXHAUSTS (cause smog)\n• **Particulates (soot, dust)** — from BURNING WASTE / DIESEL ENGINES (respiratory disease)\n\nMatch pollutant → source in pairs. Don't pick CO, SO₂, or lead — they're already named in the question.",
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
    out.append(f"-- NSSCO Chemistry 2024 Paper 2 (6117/2) — 7 questions, {len(QUESTIONS)} sub-parts, 80 marks")
    out.append("-- Verbatim NIED wording. Mark scheme + commentary from")
    out.append("-- DNEA Examiners Report 2024 (Chemistry section, pages 107-111).")
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
            out.append(f"    chem_id, 2024, '2', '{q['q']}', {q['marks']}, '{q['tier']}',")
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
            out.append(f"    chem_id, 2024, '2', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'free_text',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['rubric'])},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        out.append("")
    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} sub-parts for Chemistry NSSCO 2024 Paper 2';")
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
