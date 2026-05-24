"""Build NSSCO Physics 2024 Paper 3 (Alternative to Practical) — 4 questions, 40 marks.

Verbatim NIED wording. Mark scheme + commentary from DNEA Examiners Report
2024 (Physics section, pages 663-666).
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2024-phys-p3"
PNG_DIR = ROOT / "public" / "past-papers" / "physics-nssco-2024-p3"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260525230000_physics_nssco_2024_p3.sql"

DIAGRAMS = {
    "pendulum-bob":   ("page-02", 0.06, 0.22, 0.30, 0.70),
    "pendulum-swing": ("page-02", 0.30, 0.74, 0.06, 0.94),
    "stopwatches":    ("page-03", 0.04, 0.30, 0.10, 0.88),
    "spring-setup":   ("page-05", 0.05, 0.46, 0.18, 0.78),
    "wire-circuit":   ("page-08", 0.06, 0.38, 0.10, 0.90),
    "meters-VI":      ("page-08", 0.42, 0.66, 0.08, 0.88),
    "wire-supply":    ("page-10", 0.08, 0.40, 0.10, 0.90),
}


def durl(slug):
    return f"/past-papers/physics-nssco-2024-p3/{slug}.png" if slug else None


Q1_STEM = "A student investigates the effect of air resistance on the swing of a **pendulum**. The setup: a clamp at the top, a thin string of length **d**, and a small bob at the bottom."
Q2_STEM = "A student finds the **spring constant k** of a steel spring. The spring hangs vertically from a clamp. A meter rule is placed alongside. The unstretched length **l₀** (measured) = **39 mm**. The student then hangs loads L = 1.0, 2.0, 3.0, 4.0, 5.0, 6.0 N and records the new length l."
Q3_STEM = "A student investigates how the resistance of a wire varies with length. A resistance wire WXYZ is connected via a crocodile clip to a circuit with a power supply, a fixed resistor and TWO METERS (one for potential difference, one for current). WZ = 90 cm of wire."
Q4_STEM = "A physicist suggests that the **volume of hot water** will affect the **rate of cooling** of hot water in a container. Plan an experiment to investigate this relationship."


QUESTIONS = [
    # ═══════════ Q1 (8 marks) ═══════════
    {
        "q": "1(a)", "marks": 1, "tier": "free", "type": "calculation",
        "stem": Q1_STEM + "\n\nFig. 1.1 shows the balance reading: **99.65 g**.",
        "diagram": "pendulum-bob",
        "prompt": "**(a)** Record the mass **m** of the pendulum bob, to the **nearest GRAM**.",
        "correct": {"value": 100, "tolerance": 0.5, "unit": "g", "accept_units": ["g", "grams", "gram"]},
        "memo": "100 (g) — round 99.65 g UP to the nearest whole gram; [1 mark]",
        "examiner_note": "Very few got this right — most didn't round to the NEAREST GRAM.",
        "explanation": "**Rounding to the nearest gram** means whole-number answer.\n\n• 99.65 g → 99 (round DOWN if < .5) OR 100 (round UP if ≥ .5)\n• .65 ≥ .5 → round UP\n• **Answer: 100 g** ✓\n\nDon't write 99.65, 99, or 99.7 — the question asks for the nearest WHOLE NUMBER (gram).",
    },
    {
        "q": "1(b)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM + "\n\nThe student times 10 complete oscillations three times. Stopwatch readings (Fig. 1.3): t1 = 00:15.08, t2 = 00:15.23, t3 = 00:15.17 (min:sec.hundredths format).",
        "diagram": "stopwatches",
        "prompt": "**(b)(i)** Record the three times t1, t2, t3 in **seconds** (e.g. ''15.08, 15.23, 15.17'').",
        "accepted": [
            "15.08 15.23 15.17",
            "15.08, 15.23, 15.17",
            "t1=15.08 t2=15.23 t3=15.17",
            "t1 = 15.08 s, t2 = 15.23 s, t3 = 15.17 s",
        ],
        "must_contain": ["15.08", "15.23", "15.17"],
        "memo": "t₁ = 15.08 s; t₂ = 15.23 s; t₃ = 15.17 s; [1 mark — all three correct]",
        "examiner_note": "Most got this. Some used colons instead of decimal points.",
        "explanation": "**Reading a stopwatch:**\n\nThe format `min sec 1/100s` means: minutes, seconds, hundredths of a second.\n\n• 00:15.08 = 0 min + 15 s + 0.08 s = **15.08 s**\n• 00:15.23 = **15.23 s**\n• 00:15.17 = **15.17 s**\n\nUse a DECIMAL POINT (15.08), not a colon (15:08). The two digits AFTER the seconds are hundredths of a second.",
    },
    {
        "q": "1(b)(ii)", "marks": 1, "tier": "free", "type": "calculation",
        "stem": "t1 = 15.08 s; t2 = 15.23 s; t3 = 15.17 s.",
        "diagram": None,
        "prompt": "**(b)(ii)** Calculate the **average time t_ave** for 10 oscillations.",
        "correct": {"value": 15.16, "tolerance": 0.02, "unit": "s", "accept_units": ["s", "sec", "second", "seconds"]},
        "memo": "Working: t_ave = (15.08 + 15.23 + 15.17) ÷ 3 = 45.48 ÷ 3 = **15.16 s** (to 2 d.p.); [1 mark]",
        "examiner_note": "Moderately answered. Most ADDED the three times but forgot to divide by 3.",
        "explanation": "**Average = sum ÷ number of values:**\n\nt_ave = (t1 + t2 + t3) ÷ 3\n= (15.08 + 15.23 + 15.17) ÷ 3\n= 45.48 ÷ 3\n= **15.16 s** ✓\n\nKeep the same number of decimal places as the input data (2 d.p. here).",
    },
    {
        "q": "1(b)(iii)", "marks": 1, "tier": "free", "type": "calculation",
        "stem": "Average time t_ave for 10 oscillations = 15.16 s.",
        "diagram": None,
        "prompt": "**(b)(iii)** Determine the **period T** of the pendulum (time for ONE complete oscillation).",
        "correct": {"value": 1.516, "tolerance": 0.005, "unit": "s", "accept_units": ["s", "sec", "second", "seconds"]},
        "memo": "Working: T = t_ave ÷ 10 = 15.16 ÷ 10 = **1.516 s**; [1 mark — accept 1.52 s]",
        "examiner_note": "Most got it, with some rounding errors.",
        "explanation": "**Period of one oscillation = total time ÷ number of oscillations.**\n\nT = t_ave / number of oscillations\nT = 15.16 ÷ 10\nT = **1.516 s** ✓\n\nWhy time multiple oscillations? Because timing ONE oscillation is hard to do accurately (reaction time error is huge compared to ~1.5 s). Timing 10 spreads the error over 10 cycles → much smaller per-cycle error.",
    },
    {
        "q": "1(b)(iv)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "The student measured t three times and took an average.",
        "diagram": None,
        "prompt": "**(b)(iv)** State the **advantage** of repeating the time readings three times.",
        "accepted": [
            "to take an average",
            "to identify anomalous data",
            "to improve accuracy",
            "to minimize errors",
            "reduce error",
            "to enable an average to be taken",
            "for accuracy",
            "improve reliability",
        ],
        "must_contain": [],
        "memo": "To identify anomalous data / enable an average to be taken / improve accuracy / minimise errors; [1 mark]",
        "examiner_note": "Most got it.",
        "explanation": "**Why repeat measurements?**\n\n• **Spot anomalous (outlier) readings** — if one value is very different from the others, you can spot it and discard it.\n• **Take an average** — averages multiple readings reduce random errors.\n• **Improves accuracy / reliability** of your final value.\n• **Minimises random errors** (which average out over many trials).\n\nAny one of these is a good answer. The deepest reason: random errors are reduced by averaging.",
    },
    {
        "q": "1(c)(i)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM + "\n\nA card was attached to provide air resistance. Period T was measured with six card sizes (5×5, 6×6, 7×7, 8×8, 9×9, 10×10 cm). Results:\n\n| size / cm² | T / s |\n|---|---|\n| 5×5 | 1.526 |\n| 6×6 | 1.532 |\n| 7×7 | 1.512 |\n| 8×8 | 1.540 |\n| 9×9 | 1.553 |\n| 10×10 | 1.542 |\n\nAnother student suggests the size of the card is DIRECTLY PROPORTIONAL to the period T.",
        "diagram": None,
        "prompt": "**(c)(i)** State whether the results agree with this suggestion. **Justify** your answer using the results.",
        "memo": "Both required (1 mark each):\n1. **NO** (not directly proportional);\n2. As the size of the card INCREASES, T remains SIMILAR (around 1.5 s — only varies between 1.51 and 1.55 s, no clear trend);",
        "rubric": "Award 1 mark for 'No' / 'doesn't agree'. Award 1 mark for justification citing specific data — T stays around 1.5 s as size doubles, no proportional increase. PENALISE 'yes' answers (data clearly doesn't show direct proportionality).",
        "examiner_note": "Many got the 'no' but failed to justify properly. The justification needs reference to the results.",
        "explanation": "**Test for direct proportionality:** if y ∝ x then doubling x should double y.\n\nCheck the data:\n• Card area goes from 25 cm² (5×5) to 100 cm² (10×10) — that's a 4× increase\n• T goes from 1.526 to 1.542 — almost the SAME (only ~1% change)\n\nIf T were proportional to size, T should also have increased by ~4× (to about 6 s). It DIDN'T. So **NO, not proportional**.\n\nThe values cluster around 1.5 s with no clear upward trend → air resistance has very little effect on the period in this range.",
    },
    {
        "q": "1(c)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Apart from length d and mass m, name another variable to keep constant.",
        "diagram": None,
        "prompt": "**(c)(ii)** State **one other variable** that should be kept constant.",
        "accepted": [
            "angle of swing", "amplitude", "angle",
            "starting angle", "the angle of swing",
            "displacement angle", "release angle",
        ],
        "must_contain": [],
        "memo": "The angle of swing / amplitude / displacement; [1 mark]",
        "examiner_note": "Very few got it. Many showed lack of practical experience.",
        "explanation": "**Control variables** = things to keep the SAME so they don't affect the result:\n\n• **Length** of pendulum (given)\n• **Mass** of bob (given)\n• **Angle of swing / amplitude** — release the bob from the SAME angle every time (otherwise different amplitudes change air-resistance effects)\n• Same location (g doesn't vary)\n• Same temperature, same air movement (no draughts)\n\nThe amplitude (angle) is the key extra variable: a bigger swing creates more air resistance, which is the whole point of the experiment.",
    },

    # ═══════════ Q2 (12 marks) ═══════════
    {
        "q": "2(a)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM + "\n\nPoint Z is on the spring near the bottom. The unstretched length l₀ is measured between two marker rings — NOT to Z.",
        "diagram": "spring-setup",
        "prompt": "**(a)** Explain why l₀ is **not measured to point Z** on the spring.",
        "accepted": [
            "rings may extend differently",
            "rings extend differently from coils",
            "Z is not part of the spring coils",
            "Z is on the suspension ring not the coils",
            "would not give a fair measurement",
            "the rings stretch differently than the coils",
            "Z is on a ring",
        ],
        "must_contain": [],
        "memo": "The rings may extend differently to the coils (e.g. Z is on a suspension ring that stretches less, so including it would give a non-representative measurement); [1 mark]",
        "examiner_note": "Very few got it. Many wrongly referred to Z as the bob, saying 'it isn't part of the spring'.",
        "explanation": "**Why not measure to point Z?**\n\nPoint Z is on a **ring or end fitting**, not on the elastic coils themselves. Reasons:\n• The rings have DIFFERENT extension behaviour from the coils (they're stiffer)\n• Measuring to Z mixes spring extension with ring deformation\n• Result: extension data would be skewed → spring constant would be wrong\n\nMeasure ONLY the extension of the coils themselves (between two fixed marker points on the coil ends). This isolates the spring's true behaviour from end-effects.",
    },
    {
        "q": "2(b)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM + "\n\nl₀ = 39 mm. Lengths l for loads 1.0, 2.0, 3.0, 4.0, 5.0, 6.0 N: l = 42, 43, 46, 49, 50, 52 mm.",
        "diagram": None,
        "prompt": "**(b)** Calculate the **extension e = l − l₀** for each load. Give the six values (in mm), in order from L=1 to L=6, separated by commas.",
        "accepted": [
            "3, 4, 7, 10, 11, 13",
            "3,4,7,10,11,13",
            "3 4 7 10 11 13",
            "e1=3 e2=4 e3=7 e4=10 e5=11 e6=13",
        ],
        "must_contain": ["3", "4", "7", "10", "11", "13"],
        "memo": "e values: **3, 4, 7, 10, 11, 13** (mm); [2 marks: 1 for method, 1 for all six correct]",
        "examiner_note": "Moderately answered. Many calculated using e = l − L (wrong) instead of e = l − l₀.",
        "explanation": "**Extension = current length − unstretched length:**\n\ne = l − l₀ (where l₀ = 39 mm)\n\n| L / N | l / mm | e = l − 39 / mm |\n|---|---|---|\n| 1.0 | 42 | **3** |\n| 2.0 | 43 | **4** |\n| 3.0 | 46 | **7** |\n| 4.0 | 49 | **10** |\n| 5.0 | 50 | **11** |\n| 6.0 | 52 | **13** |\n\nCommon trap: using e = l − L (length minus load) gives nonsense — you can't subtract a length from a force.",
    },
    {
        "q": "2(c)", "marks": 5, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM + "\n\nData: L (N) = 1, 2, 3, 4, 5, 6; e (mm) = 3, 4, 7, 10, 11, 13.",
        "diagram": None,
        "prompt": "**(c)** Describe how to plot a graph of **extension e** (y-axis) against **load L** (x-axis), with a line of best fit. Include axis labels, scales, plotting style, and line of best fit.",
        "memo": (
            "All 5 marks:\n"
            "1. Axes labelled with quantity AND unit, the right way round (L/N on x; e/mm on y);\n"
            "2. Scales suitable — plots occupying at least HALF of the grid in both x and y directions;\n"
            "3. All 6 points plotted correctly to ±½ small square;\n"
            "(plotting 4 marks: 3 axes/scale + plot accuracy = 4)\n"
            "4. (plotting accuracy)\n"
            "5. WELL-JUDGED THIN STRAIGHT LINE of best fit (thickness ≤ ½ small square)"
        ),
        "rubric": "Award up to 5 marks: (a) correct axis labels with units; (b) sensible scales (occupy ≥ half grid both ways); (c) all 6 plots accurate (≤½ square); (d) plots in correct positions; (e) well-judged thin STRAIGHT line of best fit (the data is linear). PENALISE: blobs, dot-to-dot freehand, scales that bunch the data in a corner.",
        "examiner_note": "Many well-drawn graphs. Plotting was mostly careful. Some forced lines through origin when plots didn't justify it.",
        "explanation": "**Five checkpoints on a graph for full marks:**\n\n1. **Axes labelled correctly**: x = L / N (load in newtons), y = e / mm (extension in millimetres). The slash means 'in units of'.\n2. **Scales**: use the FULL grid (at least half of it both ways). Start from 0 if it makes sense; otherwise pick a sensible range.\n3. **Plot all 6 points** with small ×'s or dots (not blobs > 1 mm).\n4. **Line of best fit**: a thin SINGLE straight line that BALANCES the points (some above, some below). Use a ruler. DON'T force it through (0,0) unless the data shows it goes there.\n5. **Neat overall** — sharp pencil, no smudges.",
    },
    {
        "q": "2(d)", "marks": 4, "tier": "paid", "type": "calculation",
        "stem": Q2_STEM + "\n\nThe gradient of your graph (e vs L) equals the spring constant k. (Theoretically, k is in mm/N — for a graph of extension/load.)",
        "diagram": None,
        "prompt": "**(d)** Use the graph to determine **k**. Show your method (large triangle, change in e / change in L) and give the value with unit. Expected range: about 2.0 mm/N (Δe ≈ 10 mm over ΔL = 5 N).",
        "correct": {"value": 2.0, "tolerance": 0.5, "unit": "mm/N", "accept_units": ["mm/N", "mm N-1", "mm/newton", "mm per N"]},
        "memo": "Working:\n• Draw a LARGE triangle on the line of best fit (large = covers ≥ half the line)\n• Read change in e ÷ change in L using corner points on the line\n• Example: from L = 1 N (e ≈ 3 mm) to L = 6 N (e ≈ 13 mm): gradient = (13-3)/(6-1) = 10/5 = **2 mm/N**\n[4 marks: 1 triangle indicated, 1 substitution shown, 1 answer in correct range, 1 unit]",
        "examiner_note": "Most showed a clear large triangle. Few drew triangles to plotted points not on the best-fit line.",
        "explanation": "**Gradient method (for line of best fit):**\n\n1. Draw a LARGE right-angled TRIANGLE on the line of best fit (the larger the better — reduces % error).\n2. Use the CORNERS of the triangle, NOT individual data points. The corners must be ON THE LINE.\n3. Read Δe (vertical) and ΔL (horizontal).\n4. **Gradient = Δe ÷ ΔL** = change in extension ÷ change in load\n\nFor this data: from (1 N, ~3 mm) to (6 N, ~13 mm): gradient = (13 − 3) / (6 − 1) = 10 / 5 = **2 mm/N** ✓\n\nUnit: mm/N (since e is in mm and L is in N, gradient = mm divided by N). This is essentially 1/k in standard form — the bigger the gradient, the SOFTER the spring.",
    },

    # ═══════════ Q3 (12 marks) ═══════════
    {
        "q": "3(a)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM,
        "diagram": "wire-circuit",
        "prompt": "**(a)** State the names of instruments **1** (measures potential difference) and **2** (measures current). Format: ''1: ___; 2: ___''.",
        "accepted": [
            "voltmeter and ammeter",
            "1 voltmeter 2 ammeter",
            "voltmeter, ammeter",
            "1: voltmeter; 2: ammeter",
        ],
        "must_contain": ["voltmeter", "ammeter"],
        "memo": "1 — voltmeter; [1]\n2 — ammeter; [1]\n[Total 2 marks — spell correctly]",
        "examiner_note": "Most got names right but swapped them. Some misspelt 'voltmeter' or 'ammeter'.",
        "explanation": "**Match instrument to quantity:**\n\n• **Voltmeter** — measures POTENTIAL DIFFERENCE (voltage) across a component. Connected in PARALLEL across the component.\n• **Ammeter** — measures CURRENT through a component. Connected in SERIES with the component.\n\nIn the diagram, instrument 1 is across the wire (parallel) — voltmeter. Instrument 2 is in line with the wire (series) — ammeter.\n\nSpelling: voltmeter (one t), ammeter (double m).",
    },
    {
        "q": "3(b)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM + "\n\nVoltmeter reading is shown on Fig. 3.2 (scale 0-5V, needle at 2.6V). Ammeter reading on Fig. 3.3 (scale 0-1A, needle at 0.36A).",
        "diagram": "meters-VI",
        "prompt": "**(b)** Record the **potential difference V** and **current I** from the meters. Format: ''V: ___ V; I: ___ A''.",
        "accepted": [
            "V 2.6 I 0.36",
            "V: 2.6 V; I: 0.36 A",
            "2.6 and 0.36",
            "V=2.6 I=0.36",
        ],
        "must_contain": ["2.6", "0.36"],
        "memo": "V = 2.6 V; I = 0.36 A; [2 marks: 1 each]",
        "examiner_note": "Most got V correct. Many misread I as 0.28 A.",
        "explanation": "**Reading analog meters:**\n\n• Voltmeter scale 0-5 V — needle at 2.6 (between 2 and 3, closer to 3): **V = 2.6 V**\n• Ammeter scale 0-1 A — needle at 0.36 (between 0.2 and 0.4): **I = 0.36 A**\n\nTips for reading scales:\n• Look at the meter STRAIGHT ON (avoid parallax error)\n• Count the small divisions carefully\n• Include the unit (V or A) when stating the reading",
    },
    {
        "q": "3(c)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Two more lengths of the wire are tested: 60 cm and 40 cm. Their V values are 2.5 V and 2.3 V; I values are 0.52 A and 0.71 A. The table columns for V and I need units added.",
        "diagram": None,
        "prompt": "**(c)(i)** Complete the column headings — state the **units** for V and I. Format: ''V: ___; I: ___''.",
        "accepted": [
            "V V I A",
            "volts amps",
            "V: V; I: A",
            "V/V I/A",
        ],
        "must_contain": ["V", "A"],
        "memo": "V — column heading 'V / V' (volts); I — column heading 'I / A' (amps); [1 mark]",
        "examiner_note": "Well answered.",
        "explanation": "**Column headings always include UNITS, with a slash:**\n\n• 'V / V' — variable V (potential difference) measured in V (volts)\n• 'I / A' — variable I (current) measured in A (amperes)\n\nThe slash means 'divided by' — strictly the column shows the NUMBER which equals the quantity divided by the unit. This is standard physics convention.",
    },
    {
        "q": "3(c)(ii)", "marks": 2, "tier": "paid", "type": "calculation",
        "stem": "For wire lengths 60 cm and 40 cm: (V, I) = (2.5 V, 0.52 A) and (2.3 V, 0.71 A). Calculate R = V/I for each.",
        "diagram": None,
        "prompt": "**(c)(ii)** Calculate the **resistance R = V/I** for the 60 cm wire. (Calculate for 40 cm too — answer in Ω, to 2 d.p.)",
        "correct": {"value": 4.81, "tolerance": 0.05, "unit": "Ω", "accept_units": ["ohm", "ohms", "Ω", "ohm-m", "Ω"]},
        "memo": "For 60 cm: R = V/I = 2.5 / 0.52 = **4.81 Ω**;\nFor 40 cm: R = 2.3 / 0.71 = **3.24 Ω**;\n[2 marks: 1 method, 1 answer (for 60 cm)]",
        "examiner_note": "Most calculated correctly with some rounding errors.",
        "explanation": "**Ohm's law: R = V / I.**\n\nFor 60 cm of wire:\nR = 2.5 ÷ 0.52 = **4.81 Ω** ✓ (to 2 d.p.)\n\nFor 40 cm of wire (shorter):\nR = 2.3 ÷ 0.71 = **3.24 Ω** ✓\n\nNotice: shorter wire = LESS resistance. Resistance is proportional to length.",
    },
    {
        "q": "3(c)(iii)", "marks": 1, "tier": "free", "type": "calculation",
        "stem": "From your calculated R values: 60 cm → R = 4.81 Ω; 40 cm → R = 3.24 Ω. Now calculate R/l (resistance per unit length).",
        "diagram": None,
        "prompt": "**(c)(iii)** Calculate **R/l** for the 60 cm wire (in Ω/cm). Express to 2 s.f.",
        "correct": {"value": 0.080, "tolerance": 0.005, "unit": "Ω/cm", "accept_units": ["ohm/cm", "Ω/cm", "ohms per cm", "Ω/cm"]},
        "memo": "R/l for 60 cm: 4.81 ÷ 60 = **0.080 Ω/cm** (= 0.0802);\nR/l for 40 cm: 3.24 ÷ 40 = **0.081 Ω/cm**;\n[1 mark — both values close to 0.08, confirming proportionality]",
        "examiner_note": "Most got it correctly.",
        "explanation": "**R/l = resistance per unit length** (sometimes called 'resistance per cm').\n\nFor 60 cm: R/l = 4.81 / 60 = **0.0802 Ω/cm** (≈ 0.080)\nFor 40 cm: R/l = 3.24 / 40 = **0.0810 Ω/cm** (≈ 0.081)\n\nBoth values are essentially the SAME → confirms **R ∝ l** (resistance is directly proportional to length).\n\nThe constant ratio R/l shows the resistance per cm — a property of THIS wire (depends on resistivity and cross-sectional area).",
    },
    {
        "q": "3(d)", "marks": 1, "tier": "paid", "type": "calculation",
        "stem": "From part (c)(iii): R/l ≈ 0.08 Ω/cm.",
        "diagram": None,
        "prompt": "**(d)** Calculate the **resistance R₃₀** of a 30 cm length of the wire.",
        "correct": {"value": 2.4, "tolerance": 0.1, "unit": "Ω", "accept_units": ["ohm", "ohms", "Ω"]},
        "memo": "Working: R = (R/l) × l = 0.08 × 30 = **2.4 Ω**; [1 mark]",
        "examiner_note": "Very few got this. Most couldn't use proportion / R/l value.",
        "explanation": "**Use the R/l value (resistance per cm) to scale up:**\n\nFor 30 cm: R₃₀ = (R/l) × l = 0.08 × 30 = **2.4 Ω** ✓\n\nAlternative method using proportion:\nIf 60 cm has R = 4.81 Ω, then 30 cm (half the length) has half the resistance: 4.81 / 2 = 2.4 Ω ✓\n\nKey idea: resistance is DIRECTLY proportional to length. Length doubles → R doubles. Length halves → R halves.",
    },
    {
        "q": "3(e)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Different students get slightly different results.",
        "diagram": None,
        "prompt": "**(e)** Suggest **one reason** why different students may not get identical results (even with careful work).",
        "accepted": [
            "difficult to judge position of crocodile clip",
            "difficult to measure wire to nearest mm",
            "contact between wire and crocodile clip not precise",
            "difficult to interpolate readings on meters",
            "temperature of the wire may vary",
            "wire heats up",
            "interpolation errors",
            "parallax error reading the meters",
            "wire temperature changes",
        ],
        "must_contain": [],
        "memo": "Any one: difficulty in positioning crocodile clip / measuring wire to nearest mm / interpolating meter readings / wire temperature variations; [1 mark]",
        "examiner_note": "Most referred to poor practice — but the question stated the experiment was done CAREFULLY. The answer should be about unavoidable sources of error.",
        "explanation": "**Sources of unavoidable experimental error** (even with careful work):\n\n• **Crocodile clip position** — hard to place exactly at the marked length\n• **Reading the wire length** — only to the nearest mm; smaller variations are unmeasurable\n• **Meter interpolation** — needle between two scale marks → estimate needed\n• **Wire heating** — current heats the wire slightly, changing its resistance\n• **Parallax** — looking at meter at slight angle\n\nThe question says experiments are done CAREFULLY, so don't blame technique. Blame instrument/measurement limitations.",
    },
    {
        "q": "3(f)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "The wire becomes hot because of high current. The student adds a variable resistor to reduce this.",
        "diagram": "wire-supply",
        "prompt": "**(f)** Describe how to **add a variable resistor in series** with the existing components to reduce the current (and prevent overheating).",
        "memo": "Both required (1 mark each):\n1. Correct **symbol for a variable resistor** (rectangle with diagonal arrow through it);\n2. Connected **in SERIES** with all other components (so the variable resistor and the wire and the power supply all share the same single loop);",
        "rubric": "Award 1 mark for correct variable-resistor SYMBOL (rectangle with arrow). Award 1 mark for being IN SERIES — all components in one loop, current passes through everything. PENALISE: connected in parallel; wrong symbol; missing arrow.",
        "examiner_note": "Most showed a series variable resistor. Sometimes had a line through the symbol (which would short-circuit it).",
        "explanation": "**Variable resistor (rheostat)** symbol = a rectangle with a diagonal arrow through it (the arrow shows it can be 'varied').\n\nTo add it to the circuit:\n• Connect it **IN SERIES** with the wire and power supply (one continuous loop)\n• Same current flows through everything\n• Increasing the variable resistance → LESS current → wire doesn't heat up\n\nWhy series, not parallel? In parallel, the variable resistor would just divert current; in series, it adds to the total resistance and limits the current everywhere.",
    },

    # ═══════════ Q4 (8 marks) ═══════════
    {
        "q": "4", "marks": 8, "tier": "paid", "type": "free_text",
        "stem": Q4_STEM,
        "diagram": None,
        "prompt": "Plan an experiment to investigate the relationship between **volume of hot water and rate of cooling**. Include:\n• Brief description of the method + apparatus\n• Measurements to take\n• How to ensure accuracy\n• How results are processed\n• Sketch of axes for the graph\n• How a conclusion is reached",
        "memo": (
            "Up to 8 marks:\n\n"
            "**Method (4 marks):**\n"
            "• M1 — Pour (hot) water into a beaker/container;\n"
            "• M2 — Measure the INITIAL temperature of water (using a thermometer);\n"
            "• M3 — Record the temperature at EQUAL INTERVALS of TIME (using a stopwatch);\n"
            "• M4 — REPEAT the procedure using a DIFFERENT VOLUME of water (same container, same starting temperature);\n\n"
            "**Precautions for accuracy (1 mark) — any ONE of:**\n"
            "• View the thermometer at right angle (avoid parallax);\n"
            "• Thermometer not touching the sides of the container;\n"
            "• Allow thermometer liquid to expand fully before reading;\n"
            "• Hold thermometer at the tip;\n"
            "• Place container on a levelled surface;\n"
            "• Read the volume below the meniscus;\n"
            "• Repeat measurements and average;\n\n"
            "**Table (1 mark):**\n"
            "• M6 — Record measurements in a table with clear columns (time and temperature) and appropriate units;\n\n"
            "**Graph (1 mark):**\n"
            "• M7 — Sketch axes for temperature change/rate of cooling vs volume of water, OR temperature vs time, OR temperatures vs volume of water;\n\n"
            "**Conclusion (1 mark):**\n"
            "• M8 — Compare the temperature change vs volume of water to see if there is a pattern (or compare gradients/steepness of the cooling curves);"
        ),
        "rubric": (
            "Award up to 8 marks for a complete plan covering: METHOD (4 marks — pour water, measure initial T, record T at equal intervals, repeat with different volumes); "
            "PRECAUTION (1 mark — any one safety/accuracy point); "
            "TABLE (1 mark — clear columns with units); "
            "GRAPH (1 mark — axes labelled appropriately for the relationship); "
            "CONCLUSION (1 mark — compare results to find pattern or gradient comparison). "
            "PENALISE: missing 'repeat with different volumes' (the WHOLE point); not specifying initial temperature; no stopwatch."
        ),
        "examiner_note": "Many didn't do well. Most learners showed lack of practical knowledge. Few detailed coherent plans were seen. The use of containers of the same material with different water volumes was recognised by many.",
        "explanation": (
            "**Plan structure for a cooling-vs-volume experiment:**\n\n"
            "**Apparatus:** beaker (or 2-3 identical beakers), thermometer, stopwatch, measuring cylinder, kettle for hot water.\n\n"
            "**Method:**\n"
            "1. Boil water in a kettle (start at the same initial temperature each run).\n"
            "2. Measure a **VOLUME** (e.g. 100 cm³) of hot water using a measuring cylinder; pour into the beaker.\n"
            "3. Record the initial temperature with the thermometer.\n"
            "4. Start the stopwatch; record temperature every 30 seconds (or 1 minute) for ~10 minutes.\n"
            "5. **REPEAT** with different volumes (e.g. 200 cm³, 300 cm³, 400 cm³). Use the SAME container, SAME starting temperature, SAME room conditions.\n\n"
            "**Accuracy:** read thermometer at eye level (no parallax), don't let thermometer touch sides.\n\n"
            "**Table:** time/s | temperature/°C — for each volume.\n\n"
            "**Graph:** plot temperature vs time (one curve per volume — should show smaller volumes cool faster) OR plot final temperature change vs volume.\n\n"
            "**Conclusion:** if cooling rate DECREASES as volume INCREASES → confirms the hypothesis (more water = more thermal mass = slower cooling)."
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
        print(f"  {slug:20s} {crop.size[0]}x{crop.size[1]}")


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


def build_fill_in_correct(q):
    parts = ["'accepted', jsonb_build_array("]
    accepted_strs = ",\n        ".join(f"'{a.replace(chr(39), chr(39)*2)}'" for a in q.get("accepted", []))
    parts.append("      " + accepted_strs)
    parts.append("    )")
    mc = q.get("must_contain")
    if mc:
        mc_strs = ", ".join(f"'{m.replace(chr(39), chr(39)*2)}'" for m in mc)
        parts.append(f", 'must_contain', jsonb_build_array({mc_strs})")
    return "jsonb_build_object(\n      " + "\n".join(parts) + "\n    )"


def build_calc_correct(q):
    c = q["correct"]
    units = c.get("accept_units", [])
    units_arr = ", ".join(f"'{u}'" for u in units)
    return (
        "jsonb_build_object(\n"
        f"      'value', {c['value']}::numeric,\n"
        f"      'tolerance', {c.get('tolerance', 0)}::numeric,\n"
        f"      'unit', '{c.get('unit','').replace(chr(39), chr(39)*2)}',\n"
        f"      'accept_units', jsonb_build_array({units_arr})\n"
        "    )"
    )


def emit_sql():
    out = []
    out.append("-- " + "=" * 75)
    out.append(f"-- NSSCO Physics 2024 Paper 3 (6118/3) — Alt to Practical, 4 questions, {len(QUESTIONS)} sub-parts, 40 marks")
    out.append("-- Verbatim NIED wording. Mark scheme + commentary from")
    out.append("-- DNEA Examiners Report 2024 (Physics section, pages 663-666).")
    out.append("-- " + "=" * 75)
    out.append("")
    out.append("do $$")
    out.append("declare")
    out.append("  phys_id uuid;")
    out.append("begin")
    out.append("  select id into phys_id from public.subjects where slug = 'physics' limit 1;")
    out.append("  if phys_id is null then raise notice 'Physics subject not found'; return; end if;")
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
            out.append(f"    phys_id, 2024, '3', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'fill_in',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {build_fill_in_correct(q)},")
            out.append(f"    false,")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        elif q["type"] == "calculation":
            out.append("    type, prompt, diagram_url, correct,")
            out.append("    memo, explanation, is_published")
            out.append("  ) values (")
            out.append(f"    phys_id, 2024, '3', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'calculation',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {build_calc_correct(q)},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        else:
            out.append("    type, prompt, diagram_url, memo, rubric, explanation, is_published")
            out.append("  ) values (")
            out.append(f"    phys_id, 2024, '3', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'free_text',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['rubric'])},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        out.append("")
    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} sub-parts for Physics NSSCO 2024 Paper 3';")
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
