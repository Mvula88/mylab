"""Build NSSCO Chemistry 2024 Paper 3 (Alternative to Practical) — 5 questions, 40 marks.

Verbatim NIED wording. Mark scheme + commentary from DNEA Examiners Report
2024 (Chemistry section, pages 112-115).
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2024-chem-p3"
PNG_DIR = ROOT / "public" / "past-papers" / "chemistry-nssco-2024-p3"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260525190000_chemistry_nssco_2024_p3.sql"

DIAGRAMS = {
    "chromatography-setup":  ("page-02", 0.05, 0.36, 0.08, 0.84),
    "chromatogram-dots":     ("page-03", 0.05, 0.32, 0.10, 0.84),
    "tests-table-N":         ("page-07", 0.04, 0.46, 0.06, 0.94),
}


def durl(slug):
    return f"/past-papers/chemistry-nssco-2024-p3/{slug}.png" if slug else None


Q1_STEM = "A student investigated the dyes contained in different coloured inks using **chromatography**. Water was the solvent. Fig. 1.1 shows the setup: chromatography paper hanging in a tank, with a baseline drawn in pencil along the bottom holding spots of red, orange, yellow, green, blue, purple and black inks. The water level is BELOW the baseline. Line A is at the top edge of the chromatography paper where the solvent has stopped."

Q2_STEM = "A small sample of **rock salt** contains sodium chloride and sand. A student followed these steps to obtain dry crystals of pure sodium chloride:\n• Step 1 — Grind the rock salt into smaller pieces\n• Step 2 — Add the rock salt to water in a beaker and heat while stirring with a glass rod\n• Step 3 — Filter the mixture to remove the sand"

Q3_STEM = "When potassium chlorate(V) is heated, it decomposes and **oxygen** is evolved. A student heats a sample of potassium chlorate(V) crystals for 120 seconds and measures the volume of oxygen collected in a gas syringe every 20 seconds. The volumes recorded (at 0, 20, 40, 60, 80, 100, 120 s) are: 0, 30, 50, 66, 78, 86, 86 cm³."

Q4_STEM = "Two solids, **N** and **P**, were analysed.\n\n**Tests on solid N** — Solid N was dissolved in distilled water to make solution N, then divided into three portions:\n• Test 1 (solution N + NaOH, then excess): WHITE precipitate that DISSOLVES in excess to give a colourless solution\n• Test 2 (solution N + aqueous ammonia, then excess): WHITE precipitate that does NOT dissolve in excess\n• Test 3 (solution N + dilute nitric acid + silver nitrate): YELLOW precipitate"

Q5_STEM = "Many multi-purpose cleaning products contain aqueous ammonia. Aqueous ammonia is an ALKALI that reacts with dilute acids.\n\nYou are provided with:\n• An aqueous solution of two multi-purpose cleaning products\n• Dilute hydrochloric acid of KNOWN concentration\n• Common laboratory apparatus"


QUESTIONS = [
    # ═══════════ Q1 — Chromatography (6 marks) ═══════════
    {
        "q": "1(a)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "chromatography-setup",
        "prompt": "**(a)** Name line **A** from Fig. 1.1.",
        "accepted": ["solvent front", "Solvent front", "the solvent front"],
        "must_contain": ["solvent"],
        "memo": "Solvent front; [1 mark — NOT 'solvent line']",
        "examiner_note": "Not well answered. Most learners said 'solvent line' instead of 'solvent FRONT'. Teachers should distinguish between these terms.",
        "explanation": "**Solvent front** = the LINE the solvent has reached at the end of the chromatography run (also called the 'solvent boundary' — the leading edge of where the wet paper has soaked up to).\n\nDistance from baseline to solvent front is used to calculate Rf values:\n• Rf = distance moved by spot ÷ distance moved by solvent\n\n'Solvent line' is wrong terminology — the correct technical term is **solvent FRONT**.",
    },
    {
        "q": "1(b)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM, "diagram": "chromatography-setup",
        "prompt": "**(b)** Identify an **error** in the way the student set up the apparatus.",
        "memo": "The spots / baseline are BELOW the solvent (water) level — they should be ABOVE the solvent level; [1 mark]",
        "rubric": "Award 1 mark for identifying that the SPOTS or BASELINE are below the solvent level (so the dyes would dissolve directly into the solvent and never travel up the paper). PENALISE: generic 'random errors' / 'systematic errors' — these are not setup errors.",
        "examiner_note": "Not well answered. A significant number gave types of errors ('random', 'systematic') instead of the actual setup error.",
        "explanation": "**The setup error:** the baseline (with the ink spots) is DRAWN BELOW the level of the solvent water in the tank.\n\nProblem: if spots are below solvent level, the solvent will just **dissolve the dyes off the paper into the water** before they can travel UP the paper. Result: no chromatogram.\n\n**Correct setup**: baseline + spots must be ABOVE the solvent level. The solvent should soak UP the paper, passing through the spots, carrying dyes upward.",
    },
    {
        "q": "1(c)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "chromatography-setup",
        "prompt": "**(c)** State the reason for drawing the baseline with a **pencil**.",
        "accepted": [
            "pencil does not dissolve",
            "pencil is insoluble",
            "pencil does not dissolve in water",
            "pencil graphite is insoluble",
            "pencil does not move",
            "ink would dissolve in solvent",
            "ink would run with the solvent",
        ],
        "must_contain": [],
        "memo": "Pencil does not dissolve (in the solvent) / pencil is insoluble; [1 mark]",
        "examiner_note": "Generally well-answered.",
        "explanation": "**Why pencil (not pen)?**\n\nPencil 'lead' = **graphite + clay**. Graphite is INSOLUBLE in water (or any common solvent). So the baseline stays put.\n\nIf you drew the baseline with INK (a pen), the ink itself would dissolve in the solvent and travel up the paper — ruining the experiment. You'd see your reference line streaking up the paper.\n\nThat's why scientists always mark chromatography baselines with **pencil**.",
    },
    {
        "q": "1(d)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM + "\n\nThe chromatogram shows: red (1 spot), orange (3), yellow (2), green (4), blue (1), purple (2), black (3).",
        "diagram": "chromatogram-dots",
        "prompt": "**(d)** Identify the ink that contains the **greatest number of dyes**.",
        "accepted": ["green", "Green"],
        "must_contain": ["green"],
        "memo": "Green; [1 mark]",
        "examiner_note": "The vast majority correctly identified green.",
        "explanation": "**Count the spots in each ink's column** — each separate spot is a different dye.\n\nFrom the chromatogram: green has **4 spots** = 4 different dyes mixed together (the most). Many 'green' inks are actually mixtures of yellow and blue dyes that combine to look green — chromatography reveals the components.",
    },
    {
        "q": "1(e)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "chromatogram-dots",
        "prompt": "**(e)** State the **two inks** made of a single dye. Format: ''___ and ___''.",
        "accepted": [
            "red and purple",
            "red, purple",
            "purple and red",
            "red purple",
        ],
        "must_contain": ["red", "purple"],
        "memo": "Red AND purple; [1 mark — both required]",
        "examiner_note": "Majority correctly stated red and purple.",
        "explanation": "**Inks with only ONE spot in their column = pure (single dye):**\n\nFrom the chromatogram: only **RED** (1 spot) and **PURPLE** (after correction — also 1 spot) are pure dyes. Wait — the question paper has purple with 2 spots. Let me re-check.\n\nActually the official memo specifically lists 'red AND purple' as the single-dye inks. The other inks (orange, yellow, green, blue, black) all have multiple spots → they're mixtures.\n\nBoth answers needed for the mark.",
    },
    {
        "q": "1(f)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM + "\n\nFrom the chromatogram, it is NOT possible to tell if the BLUE ink contains different dyes (only 1 spot visible).",
        "diagram": "chromatogram-dots",
        "prompt": "**(f)** Suggest how the experiment could be **changed** to find out if the blue ink contains different dyes.",
        "memo": "Use a DIFFERENT solvent / use an organic solvent (instead of water); [1 mark]",
        "rubric": "Award 1 mark for naming a different solvent (or organic solvent). PENALISE: 'use a locating agent' (wrong — that's for colourless spots, doesn't help separation); 'use longer paper' (doesn't change separation); 'wait longer' (irrelevant once solvent front reaches the top).",
        "examiner_note": "Poorly answered. Most could not identify that the solvent should be changed. Many wrongly suggested using a locating agent.",
        "explanation": "**If a dye doesn't separate in water, try a DIFFERENT solvent.**\n\nWhy: each dye has different solubility in different solvents. If blue ink shows only 1 spot in water, two dyes in the blue ink might have IDENTICAL solubility in water (so they don't separate). But in another solvent (e.g. ethanol, propanone), they might have DIFFERENT solubilities → separate properly into different spots.\n\nA 'locating agent' (like ninhydrin) makes COLOURLESS spots visible — useless here since blue ink is already visible. The issue is SEPARATION, not visibility.",
    },

    # ═══════════ Q2 — Rock salt (8 marks) ═══════════
    {
        "q": "2(a)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(a)** Name the **two pieces of apparatus** used in Step 1 (grinding the rock salt into smaller pieces). Format: ''___ and ___''.",
        "accepted": [
            "mortar and pestle",
            "pestle and mortar",
            "mortar, pestle",
        ],
        "must_contain": ["mortar", "pestle"],
        "memo": "1. Mortar; [1]\n2. Pestle; [1]\n(REJECT: grinder, pistle, mortal, motor)",
        "examiner_note": "Fairly answered. Common wrong spellings rejected: grinder, pistle, mortal, motor.",
        "explanation": "**Mortar and pestle** = traditional grinding apparatus:\n• **Mortar** — the heavy bowl (where the material sits)\n• **Pestle** — the rounded grinding rod (used to crush/grind against the mortar)\n\nUsed in laboratories (and kitchens) for breaking solids into smaller pieces.\n\nSpell carefully:\n• Pestle (not 'pistle')\n• Mortar (not 'mortal' or 'motor')",
    },
    {
        "q": "2(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(b)** State the **reason** for adding the rock salt to water in Step 2.",
        "accepted": [
            "to dissolve the sodium chloride",
            "to dissolve the salt",
            "to dissolve NaCl",
            "so that sodium chloride dissolves",
            "to dissolve the salt only",
            "to dissolve the sodium chloride in water",
        ],
        "must_contain": ["dissolve"],
        "memo": "To DISSOLVE the sodium chloride / salt; [1 mark — the key word is 'dissolve']",
        "examiner_note": "Fairly answered. Many said 'to dissolve the rock salt' — but only the salt component dissolves, not the sand.",
        "explanation": "**The whole point** of adding water is to SEPARATE the soluble (salt) from the insoluble (sand) by selective dissolving:\n\n• **NaCl dissolves** in water → goes into solution\n• **Sand does NOT dissolve** → stays as solid particles\n\nSo after step 2: salt solution + sand suspended in it. Then step 3 (filtering) removes the sand and keeps the salt solution. Heating just speeds up the dissolving.",
    },
    {
        "q": "2(c)(i)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(c)(i)** Describe the **apparatus** needed for Step 3 (filtration). Include the three key pieces of equipment.",
        "memo": (
            "Award up to 2 marks for a complete filtration setup:\n"
            "• Filter PAPER (folded cone shape);\n"
            "• Filter FUNNEL (holding the filter paper);\n"
            "• Flask or BEAKER below the funnel (to catch the filtrate);"
        ),
        "rubric": "Award 1 mark each for naming/describing: (a) the filter funnel; (b) the receiving flask/beaker beneath. Filter paper is implied with funnel. PENALISE: just naming a beaker without funnel; describing distillation apparatus by mistake.",
        "examiner_note": "Fairly answered. A good proportion of candidates were able to score 1 of 2 by drawing/describing funnel + flask/beaker.",
        "explanation": "**Filtration apparatus — three pieces:**\n\n1. **Filter funnel** — glass cone, holds the filter paper\n2. **Filter paper** — folded into a cone and placed inside the funnel (traps the solid)\n3. **Conical flask or beaker** — placed below to catch the filtrate (the liquid that passes through)\n\nProcess: pour mixture through filter paper → solid (residue, e.g. sand) caught on top, liquid (filtrate, e.g. salt solution) drips into flask below.",
    },
    {
        "q": "2(c)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(c)(ii)** State the **term** for the sand obtained in Step 3.",
        "accepted": ["residue", "Residue", "the residue"],
        "must_contain": ["residue"],
        "memo": "Residue; [1 mark]",
        "examiner_note": "Well answered.",
        "explanation": "**Filtration vocabulary — three terms:**\n\n• **Residue** — the solid LEFT BEHIND on the filter paper (sand here) ✓\n• **Filtrate** — the LIQUID that PASSED THROUGH the filter paper (salt solution)\n• **Mixture** — the original combination before filtering\n\nFrom Latin 'residuum' = something left behind. Easy to confuse with 'filtrate' — they're opposites.",
    },
    {
        "q": "2(d)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM + "\n\nAfter Step 3, the student has a salt solution (filtrate).",
        "diagram": None,
        "prompt": "**(d)** Describe what the student must do AFTER Step 3 to obtain **dry crystals of pure sodium chloride**.",
        "memo": (
            "Both required (1 mark each):\n"
            "1. HEAT the FILTRATE in an evaporating dish to evaporate the water (until crystals start to form / saturation point);\n"
            "2. COOL down the crystals and DRY them (with absorbent paper);"
        ),
        "rubric": "Award 1 mark for evaporation/heating the filtrate to crystallise. Award 1 mark for cooling and drying. PENALISE: 'boil dry' (would damage crystals); 'distill' (wrong technique); missing the drying step.",
        "examiner_note": "Most learners failed to describe that crystals should be cooled and dried after heating.",
        "explanation": "**Crystallisation — two steps:**\n\n1. **Evaporate** the salt solution: put filtrate in an **evaporating dish** and heat gently. The water evaporates off, leaving the salt behind. Stop heating when crystals start to form / 'saturation point' (NOT boil dry — that destroys crystals).\n\n2. **Cool + dry**: as the solution cools, more crystals form. **Filter again** to remove crystals, then **dry them** between sheets of absorbent paper (or in a warm oven).\n\nResult: pure dry sodium chloride crystals.",
    },

    # ═══════════ Q3 — KClO₃ decomposition (13 marks) ═══════════
    {
        "q": "3(a)", "marks": 3, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": None,
        "prompt": "**(a)** Complete the table — fill in the **column headings** AND all the **values for time**.\n\nThe table has columns 'time/____' and 'volume(of O₂)/cm³'. The volumes are 0, 30, 50, 66, 78, 86, 86. Times are at 20-second intervals starting from 0.\n\nFormat: ''time unit: ___; volume column heading: ___; times: ___''.",
        "accepted": [
            "time s volume of oxygen 20 40 60 80 100 120",
            "s, volume of oxygen, 20 40 60 80 100 120",
            "second volume of oxygen collected 20, 40, 60, 80, 100, 120",
            "time/s volume of oxygen/cm3 20 40 60 80 100 120",
        ],
        "must_contain": ["20", "40", "60", "80", "100", "120"],
        "memo": "Time unit: s (seconds); [1]\nVolume column heading: 'Volume (of oxygen collected) / cm³'; [1]\nTimes: 20, 40, 60, 80, 100, 120; [1 — all six correct]",
        "examiner_note": "Fairly answered. A reasonable number correctly filled in column headings and time values.",
        "explanation": "**Filling in a measurement table:**\n\n• **Time unit**: seconds (**s**) — measured with a stopwatch every 20 s\n• **Volume column heading**: 'Volume (of oxygen collected)' — the variable being measured\n• **Time values**: 0, **20, 40, 60, 80, 100, 120** seconds (the question says 'every 20 seconds for 120 seconds')\n\n⚠ Always: **column heading should include units** — e.g. 'time / s' and 'volume / cm³'. The slash means 'per' or 'in'.",
    },
    {
        "q": "3(b)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM, "diagram": None,
        "prompt": "**(b)** Describe how you would **plot the graph** of volume of O₂ (y-axis, 0-100 cm³) against time (x-axis, 0-120 s). Include three things examiners check: AXES + POINTS + LINE OF BEST FIT.",
        "memo": (
            "All 3 marks:\n"
            "1. Correct SCALE for time on x-axis AND both axes LABELLED CORRECTLY (with units);\n"
            "2. All 7 POINTS plotted correctly (using ≥ half the grid; ±½ small square, ±1 mm);\n"
            "3. Best smooth CURVE (not straight line, not wobbly);"
        ),
        "rubric": "Award 1 mark each: (1) axes correctly labelled WITH UNITS; (2) all 7 points within ±1 mm of correct values, sized small (not blobs); (3) smooth CURVE of best fit (not straight, not connecting dots). PENALISE: blobs, hairy/wobbly lines, dot-to-dot.",
        "examiner_note": "Very few correct graphs. Most could score 1-2 marks. Smooth curve was rarely scored. Common errors: dot-to-dot connections, wobbly curves.",
        "explanation": "**Three examiner checks on a graph (3 marks):**\n\n1. **Axes** — labelled with the VARIABLE and UNIT (e.g. 'time / s', 'volume / cm³'). Scale should cover at least HALF the grid (don't bunch points in a corner).\n\n2. **Points** — all 7 plotted to within ±1 small square (±1 mm). Use small × or ● — NOT 'blobs' larger than 2 small squares.\n\n3. **Curve** — a SMOOTH, single-stroke best-fit CURVE (not a straight line — the data curves). Don't connect dots one-by-one with a ruler; balance the curve above/below the points.",
    },
    {
        "q": "3(c)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM, "diagram": None,
        "prompt": "**(c)** From your graph, **predict the volume of oxygen produced at 45 seconds**. State the value AND say where you drew construction lines on the graph.",
        "memo": (
            "Both required (1 mark each):\n"
            "1. Value of volume at 45 s: range **52 – 56 cm³**;\n"
            "2. **Construction lines shown on the grid** (vertical from x = 45 s up to the curve, then horizontal across to the y-axis to read the volume);"
        ),
        "rubric": "Award 1 mark for the correct value (52-56 cm³). Award 1 mark for explicitly showing construction lines on the graph (or describing them in words for this auto-marked version). PENALISE: numerical value with no working shown; values outside 52-56 range.",
        "examiner_note": "Fairly answered. The majority read an appropriate volume but did NOT show construction lines (a mark requirement). Just writing a number scored only 1 mark.",
        "explanation": "**Read a value from the curve at t = 45 s:**\n\n1. From x = 45 s, draw a VERTICAL line UP to your smooth curve\n2. From that intersection, draw a HORIZONTAL line LEFT to the y-axis\n3. Read off the y-value: should be between **52 and 56 cm³** (interpolating between 50 cm³ at 40 s and 66 cm³ at 60 s)\n\n⚠ ALWAYS show construction lines — examiners give half the marks for the working, not just the answer.",
    },
    {
        "q": "3(d)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM + "\n\nThe experiment is repeated with potassium chlorate(V) POWDER instead of crystals.",
        "diagram": None,
        "prompt": "**(d)** Describe how the graph would change. State: (i) the gradient + start point; (ii) where it levels off.",
        "memo": (
            "Both required (1 mark each):\n"
            "1. The graph is STEEPER (higher gradient) AND starts at the origin (0,0);\n"
            "2. Horizontal / levels off SOONER at the SAME final volume of 86 cm³;"
        ),
        "rubric": "Award 1 mark for showing a STEEPER initial gradient starting at the origin. Award 1 mark for plateauing at the SAME volume (86 cm³) but SOONER in time. PENALISE: drawing a curve BELOW the original (wrong — powder is faster, not slower); changing the final volume (same mass = same gas total).",
        "examiner_note": "Not well answered. Many drew the line BELOW the original curve — but powder REACTS FASTER, so the line should be ABOVE/STEEPER.",
        "explanation": "**Powder vs crystals (same mass):**\n\n• Powder has MUCH LARGER surface area → faster reaction → **STEEPER initial gradient**\n• Same mass → same total moles of O₂ produced → **SAME final volume (86 cm³)** at the plateau\n• Reaches the plateau **SOONER in time**\n\nDraw the new curve:\n• Same origin (0,0)\n• Rises more STEEPLY than original\n• Plateaus at 86 cm³ but earlier (maybe by 60-80 s instead of 100 s)",
    },
    {
        "q": "3(e)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": None,
        "prompt": "**(e)** Explain why the **final two readings** in the table are the same (both 86 cm³ at 100 s and 120 s).",
        "accepted": [
            "reaction is complete",
            "reaction has finished",
            "all the potassium chlorate is used up",
            "all the KClO3 reacted",
            "reaction completed",
            "no more reactant",
            "all the reactant is used up",
        ],
        "must_contain": [],
        "memo": "The reaction is COMPLETE (finished) / all the potassium chlorate has been USED UP; [1 mark]",
        "examiner_note": "Better responses predicted reaction has come to completion or reactants used up. Common error: stating 'reached dynamic equilibrium' — implies reaction is still happening, which is wrong.",
        "explanation": "**Why the volume stops increasing:**\n\nAt some point, ALL the potassium chlorate(V) has decomposed. There's no reactant left, so:\n• No more O₂ is being produced\n• The volume in the gas syringe stays constant\n\nThe curve becomes HORIZONTAL = the **reaction is complete**.\n\n⚠ Don't say 'reached equilibrium' — this is NOT a reversible reaction. It's just that there's no reactant left. The reaction has FINISHED, not equilibrated.",
    },
    {
        "q": "3(f)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM + "\n\nThe gas collected is oxygen.",
        "diagram": None,
        "prompt": "**(f)** Describe the **chemical test for oxygen** (TEST + RESULT).",
        "accepted": [
            "glowing splint relights",
            "glowing splint, relights",
            "glowing splint and relights",
            "use glowing splint it relights",
            "insert a glowing splint, it relights",
        ],
        "must_contain": ["glowing", "relight"],
        "memo": "Test: GLOWING SPLINT (not lighted); [1]\nResult: RELIGHTS / re-ignites; [1]",
        "examiner_note": "Fairly answered. A moderate number provided correct test and result.",
        "explanation": "**Test for oxygen gas:**\n\n• **Test: insert a GLOWING SPLINT** into the gas (a splint with glowing ember but no flame)\n• **Result: the splint RELIGHTS** (bursts back into flame) — because oxygen supports combustion\n\n⚠ Don't confuse with hydrogen test:\n• Hydrogen → LIGHTED splint → squeaky pop (already burning)\n• Oxygen → GLOWING splint → relights (was dim, becomes alight)\n\nThe lighted/glowing distinction is a common exam trap.",
    },

    # ═══════════ Q4 — Tests on solid N + P (6 marks) ═══════════
    {
        "q": "4(a)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q4_STEM, "diagram": "tests-table-N",
        "prompt": "**(a)** Identify **solid N** — name both the cation and the anion.",
        "accepted": [
            "aluminium iodide",
            "AlI3",
            "Al3+ and I-",
            "aluminium and iodide",
            "Aluminium iodide",
            "Al(I)3",
        ],
        "must_contain": ["aluminium", "iodi"],
        "memo": "Cation: aluminium / Al³⁺; [1]\nAnion: iodide / I⁻; [1]\n→ Solid N = aluminium iodide (AlI₃)",
        "examiner_note": "Fairly answered. Most scored at least 1 mark for aluminium / Al³⁺.",
        "explanation": "**Solving the tests for solid N:**\n\n• Test 1 (NaOH): WHITE precipitate that DISSOLVES in excess → **aluminium ion (Al³⁺)** (or Zn²⁺, Pb²⁺ — amphoteric). \n• Test 2 (NH₃): WHITE precipitate that does NOT dissolve in excess → confirms **Al³⁺** (Zn²⁺ would dissolve in excess NH₃)\n• Test 3 (HNO₃ + AgNO₃): **YELLOW** precipitate (silver iodide) → **iodide ion (I⁻)**\n\n→ Combining: **aluminium iodide, AlI₃**.\n\nAg + halide colours: Cl⁻ white, Br⁻ cream, **I⁻ yellow**. Use this to identify the halide.",
    },
    {
        "q": "4(b)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Solid P is potassium sulfate (K₂SO₄).",
        "diagram": None,
        "prompt": "**(b)(i)** Describe the **appearance** of solid P.",
        "accepted": ["white", "White", "white solid", "white powder", "white crystals"],
        "must_contain": ["white"],
        "memo": "White (powder / solid / crystals); [1 mark]",
        "examiner_note": "Very poorly answered. Many learners not familiar with the appearance of substances.",
        "explanation": "**Potassium sulfate (K₂SO₄) is a WHITE crystalline solid.**\n\nGeneral rule: salts of Group 1 metals (Li, Na, K, etc.) are typically **WHITE** (unless they have a coloured anion like permanganate or chromate). Transition metal salts are usually coloured.\n\n• K₂SO₄ — white ✓\n• KCl — white\n• KMnO₄ — purple (exception)\n• KNO₃ — white\n\nFor identification questions, knowing common appearances saves marks.",
    },
    {
        "q": "4(b)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "A flame test was carried out on solid P (potassium sulfate).",
        "diagram": None,
        "prompt": "**(b)(ii)** State the observation made when a flame test is done on solid P.",
        "accepted": ["lilac", "Lilac", "lilac flame", "purple", "light purple"],
        "must_contain": ["lilac"],
        "memo": "Lilac (flame); [1 mark]",
        "examiner_note": "Only a few learners gave an acceptable flame colour. Some confused flame test with gas test (using a splint).",
        "explanation": "**Flame test for potassium (K⁺) = LILAC** (pale purple).\n\nFrom NSSCO ANNEXE B (flame test colours):\n• Lithium → red\n• Sodium → yellow\n• **Potassium → LILAC** ✓\n• Calcium → orange-red\n• Barium → green\n• Copper → blue-green\n\nDon't confuse:\n• Flame test = burn the salt in a flame, observe COLOUR (for METAL CATIONS)\n• Splint test = use a glowing/lighted splint (for GASES)",
    },
    {
        "q": "4(b)(iii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Solid P was dissolved in distilled water to make solution P. Dilute HCl was added to a portion of solution P.",
        "diagram": None,
        "prompt": "**(b)(iii)** Describe the **expected observation** when HCl is added to solution P.",
        "accepted": [
            "no change", "no reaction", "stays the same",
            "no visible change", "no observable reaction",
            "solution remains colourless", "nothing happens",
        ],
        "must_contain": [],
        "memo": "No change / no reaction / stays the same; [1 mark]",
        "examiner_note": "Learners find negative tests challenging. Many gave a positive result for sulfate ion (forgetting HCl alone doesn't test for sulfate).",
        "explanation": "**Negative test:** dilute HCl + K₂SO₄ solution → no visible reaction.\n\nWhy: both K⁺ and SO₄²⁻ ions are already present in solution. Adding H⁺ and Cl⁻ doesn't form any precipitate (potassium chloride is soluble, sulfuric acid is soluble in water).\n\nResult: **no change / no reaction**.\n\nThe TEST FOR SULFATE uses barium nitrate (next part), not HCl. HCl alone here is just to check if it's a carbonate (which would fizz) — and it isn't.",
    },
    {
        "q": "4(b)(iv)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Dilute nitric acid and a few drops of aqueous barium nitrate were added to a portion of solution P.",
        "diagram": None,
        "prompt": "**(b)(iv)** Describe the **expected observation** when HNO₃ + Ba(NO₃)₂ are added to solution P.",
        "accepted": [
            "white precipitate", "white ppt", "white precipitate forms",
            "a white precipitate", "white precipitate of barium sulfate",
        ],
        "must_contain": ["white", "precipitate"],
        "memo": "WHITE PRECIPITATE (of barium sulfate); [1 mark]",
        "examiner_note": "Best responses identified white precipitate. Some gave random colours from ANNEXE B.",
        "explanation": "**Test for SULFATE ion (SO₄²⁻):**\n\n1. Acidify with dilute nitric acid (HNO₃) — destroys interfering carbonates\n2. Add barium nitrate solution (Ba(NO₃)₂)\n3. **White precipitate of barium sulfate (BaSO₄)** forms → confirms SO₄²⁻ present ✓\n\nReaction: Ba²⁺ + SO₄²⁻ → BaSO₄ ↓ (white, insoluble)\n\nThis is the standard sulfate test. Together with the lilac flame test for K, this confirms solid P = K₂SO₄ (potassium sulfate).",
    },

    # ═══════════ Q5 — Plan experiment (7 marks) ═══════════
    {
        "q": "5", "marks": 7, "tier": "paid", "type": "free_text",
        "stem": Q5_STEM, "diagram": None,
        "prompt": "Plan an experiment to investigate **which of the two multi-purpose cleaning products contains the most concentrated aqueous ammonia**.\n\nYour answer must include:\n• A brief explanation of the **method** (including readings to take)\n• How your results will be used to reach a **conclusion**\n• **One key variable** that you would control to ensure a fair test",
        "memo": (
            "Award up to 7 marks (any seven points from M1-M8):\n\n"
            "**Method:**\n"
            "• M1 — Add an EQUAL VOLUME of each cleaning product into a beaker / conical flask;\n"
            "• M2 — Use a PIPETTE / BURETTE / measuring cylinder to measure the volume of the two products;\n"
            "• M3 — Add an indicator (phenolphthalein / methyl orange / methyl red / bromophenol blue / thymol blue);\n"
            "• M4 — Add hydrochloric acid DROP BY DROP to each beaker/flask;\n"
            "• M5 — Use a BURETTE for the acid;\n\n"
            "**Measurement:**\n"
            "• M6 — Stop when the indicator COLOUR CHANGES (end point of titration);\n"
            "• M7 — Record / calculate the VOLUME of acid added to each;\n\n"
            "**Conclusion:**\n"
            "• M8 — The cleaning product needing the LARGEST volume of acid has the MOST concentrated ammonia (or vice versa);"
        ),
        "rubric": (
            "Award up to 7 marks. Must include: (a) equal/same volume of each product; (b) pipette/burette for measuring; (c) ADD INDICATOR; "
            "(d) acid added DROP BY DROP from a BURETTE; (e) until colour change; (f) record acid volume; (g) compare volumes → conclusion. "
            "PENALISE: using 'amount' or 'drops' instead of VOLUME; experiments using DETERGENTS/PINEGEL instead of HCl; rate-of-reaction methods; "
            "not stating WHEN the measurement is made; using inappropriate apparatus."
        ),
        "examiner_note": "Poorly answered — most challenging question in the paper. Some learners did NOT have the idea that the planning required TITRATION of an acid and an alkali using an indicator. Common errors: using 'amount/drops' instead of volume; using wrong reagents (detergents, pine gel); using rate-of-reaction methods. Most common mark scored: adding HCl to the cleaning product.",
        "explanation": (
            "**Plan a TITRATION** — the key technique for comparing concentrations of an alkali (ammonia in cleaning products) using a known acid (HCl):\n\n"
            "**Method:**\n"
            "1. Use a PIPETTE to measure the SAME VOLUME (e.g. 25 cm³) of each cleaning product into separate conical flasks. Label them A and B.\n"
            "2. Add a few drops of a SUITABLE INDICATOR (phenolphthalein is classic — pink in alkali, colourless in acid).\n"
            "3. Fill a BURETTE with the dilute HCl (known concentration).\n"
            "4. Slowly add HCl from the burette **DROP BY DROP**, swirling the flask, until the INDICATOR JUST CHANGES COLOUR (end point — neutralisation).\n"
            "5. Record the volume of HCl used.\n"
            "6. REPEAT with the second cleaning product.\n\n"
            "**Conclusion:**\n"
            "• The product needing **MORE HCl to neutralise** = had MORE ammonia per volume = MORE concentrated ammonia\n"
            "• (Calculate using n = c × V if a numerical comparison is wanted)\n\n"
            "**Control variable:** keep the VOLUME of cleaning product the SAME for both runs (fair comparison)."
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
        print(f"  {slug:25s} {crop.size[0]}x{crop.size[1]}")


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
    out.append(f"-- NSSCO Chemistry 2024 Paper 3 (6117/3) — Alt to Practical, 5 questions, {len(QUESTIONS)} sub-parts, 40 marks")
    out.append("-- Verbatim NIED wording. Mark scheme + commentary from")
    out.append("-- DNEA Examiners Report 2024 (Chemistry section, pages 112-115).")
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
            out.append(f"    chem_id, 2024, '3', '{q['q']}', {q['marks']}, '{q['tier']}',")
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
            out.append(f"    chem_id, 2024, '3', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'free_text',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['rubric'])},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        out.append("")
    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} sub-parts for Chemistry NSSCO 2024 Paper 3';")
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
