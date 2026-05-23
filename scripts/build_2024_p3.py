"""Build NSSCO Biology 2024 Paper 3 (Alternative to Practical) — 4 questions, 40 marks.

Single source of truth for all 22 sub-parts. Verbatim NIED wording from
past-papers/nssco-biology/2024/6116-3.pdf, official mark scheme + commentary
from the DNEA Examiner's Report 2024 (pages 58-61 of the report).

Paper 3 tests experimental skills (ability C1-C4). Some sub-parts (drawings,
histograms) are paper-based practical tasks that can't be auto-marked; they
are entered as `free_text` with a rubric that flags the requirement.

Outputs:
  - public/past-papers/biology-nssco-2024-p3/*.png   (per-figure diagram crops)
  - supabase/migrations/{ts}_biology_nssco_2024_p3.sql

Run:
  PYTHONIOENCODING=utf-8 python scripts/build_2024_p3.py
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2024-p3"
PNG_DIR = ROOT / "public" / "past-papers" / "biology-nssco-2024-p3"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260524000000_biology_nssco_2024_p3.sql"

# ── Diagrams: (slug → page_name, y_top, y_bot, x_left, x_right) ────────────
DIAGRAMS = {
    "onion-before":  ("page-02", 0.13, 0.37, 0.28, 0.82),  # Fig 1.1 — onion cells with A, B labels
    "onion-after":   ("page-03", 0.06, 0.27, 0.22, 0.74),  # Fig 1.2 — onion cells after salt
    "testtubes":     ("page-04", 0.45, 0.66, 0.08, 0.74),  # Fig 2.1 — 4 test-tubes A/B/C/D
    "cylinder":      ("page-07", 0.16, 0.50, 0.32, 0.66),  # Fig 3.1 — measuring cylinder
    "beakers":       ("page-08", 0.08, 0.40, 0.18, 0.85),  # Fig 3.2 — two beakers + thermometers (A left, B right)
    "leaf":          ("page-10", 0.05, 0.36, 0.18, 0.76),  # Fig 4.1 — leaf with mm ruler
}

def durl(slug: str | None) -> str | None:
    return f"/past-papers/biology-nssco-2024-p3/{slug}.png" if slug else None


# ─────────────────────────────────────────────────────────────────────────────
# Question stems (each is shown once per main question on the learner page)
# ─────────────────────────────────────────────────────────────────────────────
Q1_STEM = ""  # Q1(a) has no stem image; (b) introduces Figs 1.1 and 1.2 in their own sub-parts

Q2_STEM = (
    "An experiment was carried out to investigate the effect of light on gas exchange "
    "of an aquatic plant leaf using **hydrogencarbonate indicator solution**.\n\n"
    "Hydrogencarbonate indicator solution can be used to study gas exchange in different "
    "light conditions and will change from **orange/red to yellow** with increasing carbon "
    "dioxide, or **purple** with decreasing carbon dioxide.\n\n"
    "Hydrogencarbonate indicator solution was added to each of the 4 test-tubes:\n"
    "• **A** — no leaf in the test-tube (control test-tube)\n"
    "• **B** — a leaf was placed in the test-tube and left in the light\n"
    "• **C** — a leaf was placed in the test-tube which was wrapped in **black paper** to block out the light\n"
    "• **D** — a leaf was placed in the test-tube which was wrapped in **gauze** to allow partial light\n\n"
    "A bung was placed in the mouth of each test-tube and all 4 test-tubes were left in the light for one hour.\n\n"
    "**Table 2.1 — results after one hour:**\n\n"
    "| test-tube | colour at start | colour after 1 hour |\n"
    "|---|---|---|\n"
    "| A | orange | orange |\n"
    "| B | orange | **purple** |\n"
    "| C | orange | **yellow** |\n"
    "| D | orange | orange |"
)

Q3A_STEM = (
    "Fig. 3.1 shows a measuring cylinder containing water. Three learners recorded the volume reading from the measuring cylinder in Fig. 3.1.\n\n"
    "Their readings were:\n"
    "• Learner 1: 98 cm³\n"
    "• Learner 2: 99 cm³\n"
    "• Learner 3: 100 cm³"
)

Q3B_STEM = (
    "Grade 11 learners investigated the rate of cooling of a warm body using beakers containing hot water under different conditions. **Fig. 3.2** shows the apparatus.\n\n"
    "• Approximately 150 cm³ of hot water was poured into **beaker A** and after a short while the thermometer reading rose to the value shown in Fig. 3.2 beaker A.\n"
    "• Approximately 200 cm³ of hot water was poured into **beaker B** and after a short while the thermometer reading rose to the value shown in Fig. 3.2 beaker B.\n\n"
    "Read these temperatures (at time = 0)."
)

Q3C_STEM = (
    "The temperatures of the thermometer in each experiment at times 35 s, 70 s, 105 s, 140 s, 175 s and 210 s are shown in **Table 3.1**.\n\n"
    "**Table 3.1:**\n\n"
    "| time / ____ | temperature of water in beaker A / ____ | temperature of water in beaker B / ____ |\n"
    "|---|---|---|\n"
    "| 0 | … | … |\n"
    "| … | 76.0 | 73.0 |\n"
    "| … | 73.0 | 71.0 |\n"
    "| … | 70.5 | 69.5 |\n"
    "| … | 68.0 | 68.0 |\n"
    "| … | 65.5 | 66.5 |\n"
    "| … | 64.0 | 65.5 |"
)

Q4_STEM = "Fig. 4.1 shows a leaf with a mm ruler positioned above it."

Q4B_STEM = (
    "The lengths of 40 leaves of a plant are measured correct to the nearest millimetre and the data are recorded in Table 4.1.\n\n"
    "**Table 4.1 — leaf lengths (mm):**\n\n"
    "```\n"
    "118  127  154  140  136  163  145  135  147  143\n"
    "146  138  146  161  126  150  180  160  151  131\n"
    "139  152  120  169  148  162  151  173  130  153\n"
    "124  170  155  149  149  137  148  144  142  129\n"
    "```"
)


QUESTIONS = [
    # ══════════════════ Q1 — Onion epidermal cells / osmosis (10 marks) ═════════════════
    {
        "q": "1(a)", "marks": 5, "tier": "paid", "type": "free_text",
        "stem": "", "diagram": None,
        "prompt": "**(a)** Describe how to investigate the effect of **distilled water** and **salt solution** in red onion epidermal cells.",
        "memo": (
            "Any 5 of (1 mark each, max 5):\n"
            "1. (Use a scalpel/tweezer to) peel a very thin layer / one layer / single layer of tissue from the epidermis (outermost layer of cells);\n"
            "2. (Trim to fit under coverslip and) place it on a microscope slide;\n"
            "3. Add (1-2 drops) salt solution / distilled water to cover the tissue;\n"
            "4. Place a coverslip over the tissue;\n"
            "5. View under microscope;\n"
            "6. Draw / dry salt water / distilled water from slide;\n"
            "7. (Reference to) drawing of cells;"
        ),
        "rubric": "Award 1 mark each (max 5) for the practical procedure to investigate the effect of solutions on red onion epidermal cells. Required steps in any order: peel a single/thin layer of epidermis from the onion; mount on slide; add salt solution OR distilled water (drops); add coverslip; view under microscope; observe/draw cells. PENALISE candidates who put BLOCKS of onion in containers of solution (a common error — that's not the same investigation). Credit can be given for partial credit if they mention correct microscope use afterwards.",
        "examiner_note": "The most common mistake was candidates putting blocks of onion in different containers of salt water/distilled water — no credit there. Candidates who then described correct microscope use gained some credit.",
        "explanation": "The investigation in standard form:\n1. **Peel a thin layer** of onion epidermis with tweezers/scalpel — must be one cell thick so light can pass through.\n2. **Trim to coverslip size**, place on a clean microscope slide.\n3. **Add a drop of solution** (either distilled water OR salt solution depending on the trial).\n4. **Lower a coverslip** over the tissue at an angle (avoids air bubbles).\n5. **View under the microscope** — low power first, then high power.\n6. **Repeat with the other solution** and compare.\n7. **Draw what you see** in each case.\n\n**Trap:** the question is about LOOKING AT CELLS, not soaking onion chunks in salt water. The cells must be observed under a microscope.",
    },
    {
        "q": "1(b)(i)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": "**Fig. 1.1** shows the image of the cells before salt solution was added.",
        "diagram": "onion-before",
        "prompt": "**(b)(i)** Identify the parts labelled **A** and **B**.",
        "accepted": [
            "A: cytoplasm, B: nucleus",
            "A cytoplasm B nucleus",
            "A is cytoplasm, B is nucleus",
        ],
        "must_contain": ["cytoplasm", "nucleus"],
        "memo": "A: cytoplasm; [1]\nB: nucleus; [1]",
        "examiner_note": "The majority of candidates recognised the labelled parts.",
        "explanation": "In a plant cell viewed under the microscope:\n• **A — cytoplasm**: the fluid filling the cell, often appears as a granular layer pressed against the cell wall when the cell is turgid.\n• **B — nucleus**: the dense circular structure inside the cytoplasm, usually visible as a dark dot.\n\nOther parts you might confuse: cell wall (the outer boundary), vacuole (the large empty-looking space — but in this image A points to the dense layer, not the central space).",
    },
    {
        "q": "1(b)(ii)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": "**Fig. 1.2** shows an image of the onion tissue **after** it was left in the salt solution.",
        "diagram": "onion-after",
        "prompt": "**(b)(ii)** Describe **and** explain the changes observed in Fig. 1.2 after the onion tissue was left in the salt solution.",
        "memo": (
            "Any 3 of (1 mark each, max 3):\n"
            "1. cytoplasm / cell membrane pulls away from cell wall;\n"
            "2. cell is plasmolysed / flaccid;\n"
            "3. water leaves cell;\n"
            "4. from higher water potential (inside cell) to lower water potential (outside);\n"
            "5. (reference to) osmosis;"
        ),
        "rubric": "Award 3 marks max. Must include BOTH description AND explanation (the command word is 'describe and explain'). Description (1 mark): cytoplasm/membrane pulled away from cell wall; cell looks shrunken/flaccid/plasmolysed. Explanation (1-2 marks): water moves out of the cell by osmosis; from higher water potential inside the cell to lower water potential outside. PENALISE candidates who only describe OR only explain. PENALISE candidates who say 'salt moves into the cell' — that's a common but wrong explanation.",
        "examiner_note": "Many candidates answered with EITHER description OR explanation, not both, limiting marks. Able candidates referred correctly to water potential differences. Some wrong explanations incorrectly stated salt moves into the cell.",
        "explanation": "Two halves to this question:\n\n**Describe what you see:** The cytoplasm and cell membrane have pulled AWAY from the cell wall. The cell looks shrivelled / shrunken. This state is called **plasmolysis** — the cell is *plasmolysed*.\n\n**Explain why:** Salt solution OUTSIDE the cell has a LOWER water potential than the cell sap INSIDE. So water moves OUT of the cell by **osmosis** (high → low water potential, through the partially permeable membrane). Without water inside, the cytoplasm shrinks and pulls away from the rigid cell wall.\n\n**Trap:** salt does NOT move into the cell — water moves OUT. The salt is the cause, but it's not what crosses the membrane.",
    },

    # ══════════════════ Q2 — Hydrogencarbonate indicator (10 marks) ══════════════════
    {
        "q": "2(a)(i)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": "testtubes",
        "prompt": "**(a)(i)** Suggest why the hydrogencarbonate indicator solution did not change colour in **test-tube A**.",
        "memo": "test-tube A: there was no leaf + no gas exchange / no absorption or release of CO₂ / no respiration / no photosynthesis; [1]",
        "rubric": "1 mark. Must link the absence of a leaf TO the absence of gas exchange (CO₂ change). 0 marks for 'there was no leaf' alone — must say WHY that matters. Accept: no leaf → no gas exchange → no CO₂ change → indicator stays the same colour.",
        "examiner_note": "Candidates mentioned 'no leaf' but could not be credited because the absence was not brought into connection with gas exchange.",
        "explanation": "Test-tube A is the **control** — empty (no leaf). The indicator only changes colour when CO₂ changes. With no leaf there's:\n• no **photosynthesis** (which would remove CO₂)\n• no **respiration** (which would add CO₂)\n\nSo CO₂ stays the same → indicator stays orange. The KEY phrase: 'no leaf → no gas exchange → no CO₂ change'.",
    },
    {
        "q": "2(a)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": "testtubes",
        "prompt": "**(a)(ii)** Suggest why the hydrogencarbonate indicator solution did not change colour in **test-tube D** (gauze, partial light).",
        "memo": (
            "test-tube D, any 2 of (1 mark each):\n"
            "1. the rate of respiration equals the rate of photosynthesis;\n"
            "2. there is no net change of CO₂ in the test-tube;"
        ),
        "rubric": "Award 2 marks max. The key insight: at COMPENSATION POINT, photosynthesis and respiration occur at the same rate, so CO₂ added (by respiration) equals CO₂ removed (by photosynthesis) → no NET change in CO₂ → indicator stays orange. Credit (1) rate of photosynthesis = rate of respiration; (1) no net change in CO₂.",
        "examiner_note": "Candidates struggled to relate gaseous exchange in the leaf to BOTH photosynthesis AND respiration.",
        "explanation": "Test-tube D has a leaf in **partial light** (gauze reduces the light).\n\nIn partial light, the leaf is at its **compensation point**:\n• **Photosynthesis** removes CO₂ — but slowly because light is limited\n• **Respiration** adds CO₂ — at its normal rate (always happening)\n• When **rate of photosynthesis = rate of respiration**, CO₂ in = CO₂ out\n• So there's **no NET change in CO₂** → indicator stays orange\n\nDifferent from B (bright light, photo > resp → CO₂ removed → purple) and C (no light, only resp → CO₂ added → yellow).",
    },
    {
        "q": "2(b)(i)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": "testtubes",
        "prompt": "**(b)(i)** Explain the change in colour of the hydrogencarbonate indicator solution in **test-tube B** (full light, turned purple).",
        "memo": "Test-tube B: rate of photosynthesis is more than rate of respiration (so less CO₂ is present in the test-tube); [1]",
        "rubric": "1 mark for stating the rate of photosynthesis > rate of respiration → CO₂ removed from indicator → solution turns purple. PENALISE 'oxygen produced' or 'starch produced' — the indicator only responds to CO₂, not O₂ or starch.",
        "examiner_note": "Better candidates understood it was the photosynthetic activity of the leaf that removed CO₂. Common error: describing the change as due to OXYGEN or STARCH. A few candidates said the leaf received CO₂ from the indicator solution.",
        "explanation": "Test-tube B has a leaf in **bright light**:\n• **Photosynthesis** is happening fast — using up CO₂\n• **Respiration** is still happening — but slower than photosynthesis\n• Net effect: **CO₂ is REMOVED** from the solution\n• Lower CO₂ → indicator turns **purple** ✓\n\n**Trap:** the indicator doesn't respond to O₂ or starch — only CO₂. Even if the leaf produces oxygen, that's not what the indicator measures.",
    },
    {
        "q": "2(b)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": "testtubes",
        "prompt": "**(b)(ii)** Explain the change in colour of the hydrogencarbonate indicator solution in **test-tube C** (black paper, turned yellow).",
        "memo": (
            "Test-tube C, any 2 of (1 mark each):\n"
            "1. no photosynthesis takes place / only respiration is taking place;\n"
            "2. CO₂ is released from respiration / no CO₂ used;"
        ),
        "rubric": "Award 2 marks max. Must link absence of light → no photosynthesis → only respiration → CO₂ released → indicator turns yellow. 1 mark for the photosynthesis/respiration explanation; 1 mark for stating CO₂ is added (not used).",
        "examiner_note": "Many correctly stated that in the absence of light the leaf could not carry out photosynthesis.",
        "explanation": "Test-tube C has a leaf in **darkness** (black paper):\n• **No light → no photosynthesis** → CO₂ not removed\n• **Respiration** continues 24/7 → CO₂ released into the solution\n• Net effect: **CO₂ INCREASES** in the solution\n• Higher CO₂ → indicator turns **yellow** ✓\n\nThis is the opposite of test-tube B. The contrast between B (CO₂ in → photo wins) and C (CO₂ out → only resp) is the key learning of this experiment.",
    },
    {
        "q": "2(c)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": "Limewater is an indicator that can be used to show the presence of carbon dioxide.",
        "diagram": None,
        "prompt": "**(c)** Suggest why limewater would **not** be a suitable indicator for use in this investigation.",
        "memo": (
            "Any 1 of (1 mark):\n"
            "- Limewater only shows the PRESENCE of CO₂ (binary — yes/no);\n"
            "- Limewater is qualitative, not quantitative — cannot distinguish AMOUNTS of CO₂;"
        ),
        "rubric": "1 mark for explaining that limewater only shows PRESENCE of CO₂ (qualitative) but this investigation needs to detect DIFFERENT AMOUNTS of CO₂ (quantitative). Reject 'limewater changes too slow' or 'limewater is toxic' — those aren't the issue.",
        "examiner_note": "Majority of candidates showed an understanding of why limewater could not be used.",
        "explanation": "Limewater turns from clear to milky/cloudy in the presence of CO₂, but it's a **qualitative** test:\n• It tells you CO₂ is present (yes/no), but **not how much**.\n• In this investigation we need to compare CO₂ amounts between test-tubes (more in C, less in B, equal in D).\n\nHydrogencarbonate indicator is **quantitative** — its colour shifts continuously with CO₂ amount (yellow ← orange ← purple), so we can distinguish more vs less CO₂. Limewater can't do that.",
    },
    {
        "q": "2(d)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(d)** Give **two** variables that should be kept constant during this investigation.",
        "memo": (
            "Any 2 of (1 mark each, max 2):\n"
            "1. volume of indicator solution / hydrogencarbonate;\n"
            "2. size / type of the leaf;\n"
            "3. temperature of environment;\n"
            "4. time until colour is recorded;"
        ),
        "rubric": "Award 1 mark each (max 2) for control variables relevant to this hydrogencarbonate-indicator gas-exchange experiment. Accept: volume of indicator; size/type/species of leaf; temperature; time before reading; same indicator concentration. REJECT 'light' — light is the INDEPENDENT variable being manipulated, not a control.",
        "examiner_note": "Many candidates correctly referred to dependent and independent variables; majority scored at least 1 mark.",
        "explanation": "Variables to keep constant (= **controlled variables**):\n• **Volume of indicator** in each tube (same starting amount)\n• **Size / type / age** of the leaf (same species, same surface area)\n• **Temperature** (affects both photosynthesis and respiration)\n• **Time** before reading the colour (must be 1 hour for all 4)\n\nThe **independent variable** (what's being changed) is LIGHT — so DO NOT list light as a controlled variable. Common mistake.",
    },
    {
        "q": "2(e)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(e)** State the purpose of the **control test-tube** (test-tube A) in this investigation.",
        "memo": (
            "Any 1 of (1 mark):\n"
            "- The control test-tube was set up to see whether the indicator would change colour with NO leaf;\n"
            "- To make sure any colour change was BECAUSE of gas exchange by the leaf (not the indicator/light itself);"
        ),
        "rubric": "1 mark for explaining the control test-tube's specific role HERE: to confirm that the colour change in tubes B/C/D is caused by the LEAF (gas exchange), not by something else (light degrading the indicator, the bung leaking, etc.). REJECT 'for comparison' alone — too vague. Must mention LEAF / GAS EXCHANGE / NO COLOUR CHANGE WITHOUT LEAF.",
        "examiner_note": "Most candidates just mentioned 'to compare'. The question expected the SPECIFIC purpose of the control test-tube in this investigation.",
        "explanation": "A control rules out alternative explanations. Test-tube A (no leaf) checks whether the indicator would change colour ON ITS OWN — from light, from the bung, from temperature, etc.\n\nA stayed ORANGE → so any colour change in B, C, D MUST be because of the **leaf's gas exchange**, not the indicator itself.\n\n**Trap:** 'for comparison' is too vague — every experiment has comparisons. State what specific factor the control RULES OUT.",
    },

    # ══════════════════ Q3 — Measuring cylinder + water cooling (10 marks) ══════════════════
    {
        "q": "3(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3A_STEM, "diagram": "cylinder",
        "prompt": "**(a)(i)** State which learner made an accurate reading.",
        "accepted": ["Learner 1", "learner 1", "1", "98", "98 cm3"],
        "must_contain_any": ["learner 1", "1", "98"],
        "memo": "Learner 1 (98 cm³); [1]",
        "examiner_note": "The majority of the candidates answered correctly.",
        "explanation": "When reading a measuring cylinder, you must:\n• Read at **eye level** (not from above or below — that's parallax error)\n• Read the **bottom of the meniscus** (the curved water surface)\n• Recognise that **each division is 2 cm³** on a 100 cm³ cylinder (not 1 cm³)\n\nThe cylinder in Fig 3.1 shows the water level between 90 and 100, but the actual reading is **98 cm³**. Learner 1 (98) had it right.",
    },
    {
        "q": "3(a)(ii)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": Q3A_STEM, "diagram": "cylinder",
        "prompt": "**(a)(ii)** State the mistake made by **one** of the other two learners.",
        "memo": (
            "Any 1 of (1 mark):\n"
            "- Learner 2 (99): divisions are every 2 cm³, not 1 — they miscounted the scale;\n"
            "- Learner 3 (100): read to top of meniscus / scale not read at right angles / parallax error;"
        ),
        "rubric": "1 mark for identifying the SPECIFIC mistake of EITHER Learner 2 or Learner 3. Accept Learner 2: misread the divisions (treated as 1 cm³ instead of 2 cm³). Accept Learner 3: read the top of the meniscus instead of the bottom; OR parallax error (didn't read at eye level/right angles). REJECT generic 'they didn't read properly'.",
        "examiner_note": "Candidates mentioned the meniscus but showed they really had no idea what it is.",
        "explanation": "Two mistakes possible:\n• **Learner 2 (99 cm³)** — counted divisions as 1 cm³ each. On a 100 cm³ cylinder with 10 major marks, each minor division is actually **2 cm³**, not 1.\n• **Learner 3 (100 cm³)** — read the TOP of the meniscus instead of the BOTTOM, OR did a *parallax error* (read from above instead of eye level — looks higher than it really is).\n\nYou only need to pick one mistake. **Meniscus** = the curved surface of water in a cylinder; always read the bottom.",
    },
    {
        "q": "3(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3B_STEM, "diagram": "beakers",
        "prompt": "**(b)** Read the temperature at time = 0 for **beaker A** and **beaker B** from Fig. 3.2.",
        "accepted": ["A: 80, B: 75", "A 80 B 75", "80 and 75", "80°C, 75°C"],
        "must_contain": ["80", "75"],
        "memo": "Beaker A: 80 (°C); Beaker B: 75 (°C); [1]",
        "examiner_note": "Just needed recording of information; majority scored full marks.",
        "explanation": "From Fig. 3.2, read each thermometer at time = 0:\n• **Beaker A** (150 cm³): thermometer reads **80 °C**\n• **Beaker B** (200 cm³): thermometer reads **75 °C**\n\nThis is the starting temperature for the cooling experiment. Note Beaker A started hotter — but A is a smaller volume, which matters for cooling rate.",
    },
    {
        "q": "3(c)(i)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q3C_STEM, "diagram": None,
        "prompt": "**(c)(i)** Complete the column headings of Table 3.1 (the units for each column).",
        "accepted": ["time/s, temp A/°C, temp B/°C", "seconds, Celsius, Celsius", "s, °C, °C"],
        "must_contain": ["s", "°C"],
        "must_contain_any_for_time": ["s", "second"],
        "must_contain_any_for_temp": ["°C", "celsius", "degrees"],
        "memo": (
            "Column 1 (time): seconds / s; [1]\n"
            "Columns 2 & 3 (temperature A and B): degrees Celsius / °C; [1]"
        ),
        "examiner_note": "Just needed recording of information; majority scored full marks.",
        "explanation": "Table column headings must include the **units**:\n• **Time** → **seconds (s)** — because the values given are 35, 70, 105 etc. measured in seconds.\n• **Temperature** → **degrees Celsius (°C)** — because thermometers in °C.\n\nWithout units, a table is meaningless. The full headings: `time / s`, `temperature of water in beaker A / °C`, `temperature of water in beaker B / °C`.",
    },
    {
        "q": "3(c)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3C_STEM, "diagram": None,
        "prompt": "**(c)(ii)** Record the values of **time** in Table 3.1 (six time values, evenly spaced).",
        "accepted": ["35, 70, 105, 140, 175, 210", "35 70 105 140 175 210"],
        "must_contain": ["35", "70", "105", "140", "175", "210"],
        "memo": "Time values: 35, 70, 105, 140, 175, 210; [1]",
        "examiner_note": "Majority of candidates scored full marks here.",
        "explanation": "The question already gave you the times (in the question stem above the table): **35 s, 70 s, 105 s, 140 s, 175 s, 210 s**.\n\nNotice they're evenly spaced (35-second intervals), which means you measured the temperature every 35 seconds. Just write them in the time column.",
    },
    {
        "q": "3(c)(iii)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": Q3C_STEM, "diagram": None,
        "prompt": "**(c)(iii)** The results in Table 3.1 show that the temperature of the water in each beaker decreases.\n\nDescribe **one other similarity** in the patterns of temperature change of the two volumes of water.",
        "memo": (
            "Any 1 appropriate pattern that fully matches the results:\n"
            "- the rate of temperature drop is greater at the start than at the end;\n"
            "- between 70-105 s and 175 s the decrease in temperature is constant;\n"
            "- both reach similar temperatures (~64-65°C) at 210 s;"
        ),
        "rubric": "1 mark for ONE valid similarity in the cooling pattern of BOTH beakers (not just one). Accept: faster cooling at start than end (rate decreases); both reach roughly similar final temperatures; both show roughly linear middle portions; both cool by ~15°C. REJECT 'both decrease' — that's already given in the question.",
        "examiner_note": "Very few candidates succeeded. Majority didn't do any calculations to find a pattern.",
        "explanation": "Look at the data and calculate the **differences between consecutive readings**:\n\nBeaker A: 80→76 (-4), 76→73 (-3), 73→70.5 (-2.5), 70.5→68 (-2.5), 68→65.5 (-2.5), 65.5→64 (-1.5)\nBeaker B: 75→73 (-2), 73→71 (-2), 71→69.5 (-1.5), 69.5→68 (-1.5), 68→66.5 (-1.5), 66.5→65.5 (-1)\n\nNotice **the drop is bigger early on, smaller later**. Both beakers do this — the rate of cooling **decreases over time**. That's a similarity. Both also end up near the same final temperature (~64-65 °C).",
    },
    {
        "q": "3(c)(iv)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": Q3C_STEM, "diagram": None,
        "prompt": "**(c)(iv)** Describe **one difference** in the patterns of temperature change of the two volumes of water.",
        "memo": "The rate of cooling is **less for a larger volume of water** (beaker B) than for the smaller volume (beaker A) / **or reverse argument (ORA)**. [1]",
        "rubric": "1 mark for stating the key difference: smaller volume (A, 150 cm³) cools FASTER than larger volume (B, 200 cm³). Accept the equivalent reverse: B cools more slowly than A. Quantitative support (e.g. 'A loses 16°C, B loses ~10°C') is welcome but not required.",
        "examiner_note": "Very demanding question. Most candidates didn't calculate to find the difference.",
        "explanation": "Compare total temperature drop:\n• Beaker A (150 cm³, smaller): 80 → 64 = **drop of 16 °C**\n• Beaker B (200 cm³, larger): 75 → 65.5 = **drop of 9.5 °C**\n\n**The smaller volume (A) cools faster than the larger volume (B).** Why? More water = more thermal energy stored (higher heat capacity for the same surface area), so it takes longer to cool down.\n\nThis is why bath water stays warm longer than a teaspoon of water at the same temperature.",
    },
    {
        "q": "3(d)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "Another learner wants to repeat the experiment in order to compare the results.",
        "diagram": None,
        "prompt": "**(d)** Suggest **two** factors that should be kept the same in order for the comparison to be fair.",
        "memo": (
            "Any 2 of (1 mark each, max 2):\n"
            "1. room temperature / external temperature / initial water temperature / start temperature of water;\n"
            "2. same volumes of water;\n"
            "3. same amount of waiting time before reading;\n"
            "4. keep thermometer at same depth;\n"
            "5. same size / thickness / material / surface area of beaker;"
        ),
        "rubric": "Award 1 mark each (max 2) for control variables that affect water cooling rate: room/external temperature; same starting water temperature; same volumes of water; same beaker size/material/surface area; same thermometer depth; same time between readings. REJECT trivial answers ('same person doing it') or already-known answers from the experiment setup.",
        "examiner_note": "Satisfying to see the majority of candidates scored full marks here.",
        "explanation": "For a **fair test** to compare results, repeat with the SAME:\n• **Room temperature** — affects cooling rate\n• **Starting water temperature** — must match the original\n• **Volume of water** in each beaker\n• **Beaker** — same size, shape, material, surface area\n• **Thermometer position** — same depth\n• **Timing intervals** — same gap between readings\n\nIn this experiment ONLY the volume difference between beakers was supposed to be the variable. Everything else stays constant.",
    },

    # ══════════════════ Q4 — Leaf drawing + magnification + histogram (10 marks) ══════════════════
    {
        "q": "4(a)(i)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q4_STEM, "diagram": "leaf",
        "prompt": "**(a)(i)** Make a **large drawing** of the leaf shown in Fig. 4.1.\n\n*(This task is paper-based. Make your drawing on paper, then describe in the box below what makes your drawing accurate — shape, proportions, edge/margin, vein pattern, etc.)*",
        "memo": (
            "Award marks for the drawing:\n"
            "S (size): drawing is LARGER than the original AND in proportion; [1]\n"
            "D (detail): shape + edge + veins are accurately represented; [1]"
        ),
        "rubric": "This is a paper-based biological drawing task — the candidate should produce a drawing on paper. For the online version, accept a candidate's self-described drawing if they explicitly note: (a) drawing is larger than the original and proportions match; (b) edge/margin shape is correct (the leaf has a smooth/entire margin with a slight tip); (c) main veins are shown including midrib and lateral veins. PENALISE for: too small; wrong proportions; cartoonish/sketchy; thick shaded lines (biological drawings use sharp single lines with no shading).",
        "examiner_note": "Many large drawings produced, but shape, proportion and component parts were a problem.",
        "explanation": "Biological drawing rules:\n• **Larger than the original** — fills the space, easier to see detail\n• **In proportion** — width-to-length ratio matches the photo\n• **Sharp single lines** — no sketching, no shading, no doubled lines\n• **Show the edge/margin clearly** — is it smooth, toothed, lobed? (This leaf has a smooth/entire margin)\n• **Draw the main veins** — central midrib + lateral veins branching off\n• **Use a sharp pencil**, no pen\n\nThis is a practical skill — paper-based on the real exam. In Practikal, do it on paper alongside your tablet and describe your drawing's features in the answer box.",
    },
    {
        "q": "4(a)(ii)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q4_STEM + " The actual leaf is **79 mm** long (or 7.9 cm).", "diagram": "leaf",
        "prompt": "**(a)(ii)** Use the length indicated on Fig. 4.1 to calculate the **magnification** of your drawing. Show your working.\n\n*(Enter your drawing length in mm and the calculated magnification, e.g. \"drawing = 158 mm; magnification = 158÷79 = ×2\")*",
        "accepted": [
            "drawing length ÷ 79 = magnification",
            "drawing length / 79 mm = ×N",
        ],
        "must_contain_any": ["79", "÷", "/", "magnification"],
        "memo": (
            "Working: drawing length (mm) ÷ 79 mm (or 7.9 cm); [1]\n"
            "Answer: correct magnification indicated as **× N** (with the multiplication sign); [1]\n"
            "Common errors: percentages or ratios used instead of ×."
        ),
        "examiner_note": "Most mistakes were inaccurate measurements of the drawn diagram. The majority correctly calculated magnification and expressed × or 'times'.",
        "explanation": "**Magnification = drawing size ÷ actual size**\n\nThe actual leaf is **79 mm** (or 7.9 cm — both units fine, BUT they must be the SAME unit for both numbers).\n\nIf your drawing is 158 mm long:\n• Magnification = 158 ÷ 79 = **× 2**\n\nIf your drawing is 200 mm long:\n• Magnification = 200 ÷ 79 = **× 2.5**\n\n**Always express magnification with the × sign** (or 'times'). NEVER as a percentage or a ratio — examiners deduct marks for that.",
    },
    {
        "q": "4(b)(i)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q4B_STEM, "diagram": None,
        "prompt": "**(b)(i)** Complete Table 4.2 by counting how many leaves fall into each length range.\n\n| range (mm) | number of leaves |\n|---|---|\n| 110 – 124 | ? |\n| 125 – 139 | ? |\n| 140 – 154 | ? |\n| 155 – 169 | ? |\n| 170 – 184 | ? |\n\n*(Enter the five values, e.g. \"3, 10, 18, 6, 3\")*",
        "accepted": [
            "3, 10, 18, 6, 3", "3 10 18 6 3",
            "110-124: 3, 125-139: 10, 140-154: 18, 155-169: 6, 170-184: 3",
        ],
        "must_contain": ["3", "10", "18", "6"],
        "memo": (
            "Correct tally counts: 3, 10, 18, 6, 3 (total = 40); [2]\n"
            "(1 mark for ≥3 ranges correct; 2 marks for all 5 ranges correct.)"
        ),
        "examiner_note": "Many candidates achieved full credit here. Some only completed the totals column without the tally marks; a few miscounted.",
        "explanation": "Go through Table 4.1 row by row and tally each leaf into its range:\n\n• **110–124** (3 leaves): 118, 120, 124, ~~~~ — wait, count again: 118, 120, 124 → **3**\n• **125–139** (10 leaves): 127, 136, 135, 138, 126, 131, 139, 130, 137, 129 → **10**\n• **140–154** (18 leaves): 154, 140, 145, 147, 143, 146, 146, 150, 151, 152, 148, 151, 153, 149, 149, 148, 144, 142 → **18**\n• **155–169** (6 leaves): 163, 161, 160, 169, 162, 155 → **6**\n• **170–184** (3 leaves): 180, 173, 170 → **3**\n\nTotal: 3 + 10 + 18 + 6 + 3 = **40** ✓\n\n**Tally marks tip:** group in 5s using IIII crossed by a line. Helps you count without losing track.",
    },
    {
        "q": "4(b)(ii)", "marks": 4, "tier": "paid", "type": "free_text",
        "stem": Q4B_STEM, "diagram": None,
        "prompt": "**(b)(ii)** Draw a **histogram** of the results from Table 4.2 on grid paper.\n\n*(This task is paper-based. On grid paper, draw the histogram. In the box below, describe how you laid it out — axis labels and units, scale chosen, where each bar starts/ends, whether bars touch.)*",
        "memo": (
            "Award (4 marks total):\n"
            "A (axes): axes labelled correctly — length/mm on x-axis, number of leaves on y-axis; [1]\n"
            "S (scale): correct scale chosen so the histogram fills more than half the grid; [1]\n"
            "P (plotting): bars plotted correctly according to the table values (3, 10, 18, 6, 3); [1]\n"
            "B (bars): bars are touching, same width, ruled straight lines; [1]"
        ),
        "rubric": "Paper-based histogram task. For online entry, accept the candidate's description if they explicitly cover: (a) both axes labelled with name AND unit (e.g. 'leaf length / mm', 'number of leaves'); (b) sensible scale that uses more than half the grid; (c) bars at correct heights (3, 10, 18, 6, 3); (d) bars TOUCHING (histogram, not bar chart) and same width, ruled. PENALISE: bar chart (gaps), line graph, freehand bars, missing axis labels, wrong heights.",
        "examiner_note": "Some excellent histograms produced. Common difficulties: labelling axes; positioning range centrally under each column; not extending bar lines to the x-axis. Some candidates drew BAR CHARTS (with gaps) instead of histograms.",
        "explanation": "Histogram rules (NSSCO mark scheme):\n• **Axes labelled** with name AND unit:\n  - x-axis: **leaf length / mm** (or just 'length / mm')\n  - y-axis: **number of leaves**\n• **Scale**: pick one that makes the histogram fill **more than half the grid**\n• **Bars at correct heights**: 3, 10, 18, 6, 3\n• **Bars TOUCHING** — this is the key thing that makes it a histogram (not a bar chart, which has gaps)\n• **Same width** for every bar (each range is 15 mm wide)\n• **Ruled lines, sharp pencil**, no shading or scribble\n• Range label centred under each bar (e.g. 110-124 centred under the first bar)\n\nA properly-drawn histogram looks like a 'staircase' rising then falling — for this data, the peak is in the middle (140-154 mm range).",
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# Diagram extraction
# ─────────────────────────────────────────────────────────────────────────────

def extract_diagrams() -> None:
    PNG_DIR.mkdir(parents=True, exist_ok=True)
    for slug, (page_name, y_top, y_bot, x_left, x_right) in DIAGRAMS.items():
        page_path = PAGES_DIR / f"{page_name}.png"
        if not page_path.exists():
            print(f"  {slug}: missing page {page_path}")
            continue
        img = Image.open(page_path).convert("RGB")
        W, H = img.size
        crop = img.crop((int(W * x_left), int(H * y_top), int(W * x_right), int(H * y_bot)))
        out_path = PNG_DIR / f"{slug}.png"
        crop.save(out_path, optimize=True)
        print(f"  {slug:18s} {crop.size[0]}x{crop.size[1]}")


# ─────────────────────────────────────────────────────────────────────────────
# SQL emission
# ─────────────────────────────────────────────────────────────────────────────

def sql_escape(s) -> str:
    if s is None:
        return "null"
    s = str(s).replace("\\", "\\\\").replace("'", "''").replace("\n", "\\n")
    return f"E'{s}'"


def build_prompt(q: dict) -> str:
    stem = q.get("stem", "")
    prompt = q["prompt"]
    return (stem + "\n\n" + prompt) if stem else prompt


def build_full_memo(q: dict) -> str:
    memo = q.get("memo", "")
    note = q.get("examiner_note", "")
    if note:
        return memo + "\n\n**Examiner commentary:** " + note
    return memo


def build_correct_jsonb(q: dict) -> str:
    accepted = q.get("accepted", [])
    accepted_strs = ",\n        ".join(f"'{a.replace(chr(39), chr(39)*2)}'" for a in accepted)
    obj_parts = [f"'accepted', jsonb_build_array(\n        {accepted_strs}\n      )"]
    mc = q.get("must_contain")
    if mc:
        mc_strs = ", ".join(f"'{m}'" for m in mc)
        obj_parts.append(f"'must_contain', jsonb_build_array({mc_strs})")
    return "jsonb_build_object(\n      " + ",\n      ".join(obj_parts) + "\n    )"


def emit_sql() -> None:
    out = []
    out.append("-- " + "=" * 75)
    out.append("-- NSSCO Biology 2024 Paper 3 (6116/3) — Alternative to Practical")
    out.append("-- 4 questions, 22 sub-parts, 40 marks")
    out.append("-- Verbatim NIED wording from past-papers/nssco-biology/2024/6116-3.pdf")
    out.append("-- Mark scheme + commentary from DNEA Examiner's Report 2024 (pp 58-61)")
    out.append("-- Diagrams: public/past-papers/biology-nssco-2024-p3/*.png")
    out.append("-- " + "=" * 75)
    out.append("")
    out.append("do $$")
    out.append("declare")
    out.append("  bio_id uuid;")
    out.append("begin")
    out.append("  select id into bio_id from public.subjects where slug = 'biology' limit 1;")
    out.append("  if bio_id is null then")
    out.append("    raise notice 'Biology subject not found — skipping seed';")
    out.append("    return;")
    out.append("  end if;")
    out.append("")

    for q in QUESTIONS:
        diagram_url = "null" if not q.get("diagram") else f"'{durl(q['diagram'])}'"
        prompt = build_prompt(q)
        memo = build_full_memo(q)

        out.append(f"  -- ─── Q{q['q']}  [{q['marks']} {'mark' if q['marks']==1 else 'marks'}, {q['tier']}, {q['type']}] ───")
        out.append("  insert into public.past_paper_questions (")
        out.append("    subject_id, paper_year, paper_no, q_number, marks, tier,")
        if q["type"] == "fill_in":
            out.append("    type, prompt, diagram_url, correct, case_sensitive,")
            out.append("    memo, explanation, is_published")
            out.append("  ) values (")
            out.append(f"    bio_id, 2024, '3', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'fill_in',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {build_correct_jsonb(q)},")
            out.append(f"    false,")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        else:  # free_text
            out.append("    type, prompt, diagram_url, memo, rubric, explanation, is_published")
            out.append("  ) values (")
            out.append(f"    bio_id, 2024, '3', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'free_text',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['rubric'])},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        out.append("")

    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} sub-parts for Biology NSSCO 2024 Paper 3';")
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
        by_q[main_q] = by_q.get(main_q, 0) + q["marks"]
    print(f"\nMarks per question: {by_q}")
    print(f"Total: {sum(q['marks'] for q in QUESTIONS)} marks across {len(QUESTIONS)} sub-parts")
