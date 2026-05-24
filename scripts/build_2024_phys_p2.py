"""Build NSSCO Physics 2024 Paper 2 — 8 questions, 80 marks.

Verbatim NIED wording. Mark scheme + commentary from DNEA Examiners Report
2024 (Physics section, pages 656-662).

Uses the new 'calculation' question type for numerical questions: learners get
a working area + final value input + unit input. Auto-marked against the
correct value (with tolerance) and unit list.
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2024-phys-p2"
PNG_DIR = ROOT / "public" / "past-papers" / "physics-nssco-2024-p2"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260525220000_physics_nssco_2024_p2.sql"

DIAGRAMS = {
    "speed-time-graph":   ("page-02", 0.32, 0.50, 0.18, 0.78),
    "nail-lever":         ("page-04", 0.04, 0.34, 0.20, 0.78),
    "ripple-tank":        ("page-06", 0.04, 0.30, 0.30, 0.74),
    "displacement-graph": ("page-06", 0.34, 0.50, 0.10, 0.88),
    "refraction-glass":   ("page-07", 0.06, 0.36, 0.30, 0.70),
    "wave-fronts":        ("page-07", 0.38, 0.74, 0.12, 0.86),
    "em-spectrum":        ("page-08", 0.06, 0.16, 0.06, 0.94),
    "series-circuit":     ("page-09", 0.05, 0.24, 0.18, 0.82),
    "ac-generator":       ("page-11", 0.06, 0.50, 0.10, 0.88),
    "ac-output-graph":    ("page-12", 0.06, 0.30, 0.18, 0.74),
}


def durl(slug):
    return f"/past-papers/physics-nssco-2024-p2/{slug}.png" if slug else None


Q1_STEM = "Fig. 1.1 shows how the **speed of a car** varies over a short time. Different parts of the journey are labelled **A, B, C, D, E**:\n• A — flat at 0 m/s from t=0 to t=4 s\n• B — rising linearly from 0 to 16 m/s, t=4 to t=8 s\n• C — flat at 16 m/s from t=8 to t=20 s\n• D — falling linearly from 16 to 0 m/s, t=20 to t=28 s\n• E — flat at 0 m/s from t=28 onwards"
Q2_STEM = "A man uses a metal bar as a lever to pull a nail from a piece of wood. He applies a force of **150 N perpendicular** to the bar, at **0.50 m** from the pivot (the nail itself acts as the pivot)."
Q3_STEM = "A substance starts in the solid state at −36 °C and is heated at a CONSTANT rate for 28 minutes. Temperature record:\n\n| time / min | 0 | 1 | 2 | 6 | 10 | 14 | 18 | 22 | 24 | 26 | 28 |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n| T / °C | −36 | −16 | −9 | −9 | −9 | −9 | 32 | 75 | 101 | 121 | 121 |"
Q4_STEM = "A ripple tank produces circular wavefronts. Two corks **A** and **B** float on the water. The wavelength is **8.0 cm**.\n\nFig. 4.2 shows how the displacement of cork A varies with time — a sine wave with amplitude **2 mm** and period **0.50 s**."
Q5_STEM = "Parts of the electromagnetic spectrum, in order of increasing wavelength:\n\n**radio waves — Q — infrared waves — visible light — ultraviolet waves — X-rays — γ-rays**"
Q6_STEM = "A circuit has a **12 V battery** in series with two resistors: an **18 Ω** resistor and a **30 Ω** resistor."
Q7_STEM = "An **AC generator** has a coil rotating between two magnets (N on left, S on right). Components on the diagram:\n• **A** — slip rings (smooth rings, NOT split)\n• **B** — brushes (carbon contacts pressing against A)\n• **C** — the spinning coil axis\n• **D** — the magnetic poles\n\nThe coil rotates anticlockwise and the output is connected through a 25 Ω resistor."
Q8_STEM = "**Plutonium-238 (²³⁸₉₄Pu)** is a radioactive isotope that decays by emitting alpha particles."


QUESTIONS = [
    # ═══════════ Q1 (14 marks) ═══════════
    {
        "q": "1(a)", "marks": 3, "tier": "free", "type": "fill_in",
        "stem": "Classify these as scalar or vector: speed, velocity, distance, force, kinetic energy.",
        "diagram": None,
        "prompt": "**(a)** Complete Table 1.1 — state whether each is a scalar or vector. Format: ''S V S V S'' (in order speed, velocity, distance, force, KE).",
        "accepted": [
            "scalar vector scalar vector scalar",
            "S V S V S",
            "scalar, vector, scalar, vector, scalar",
        ],
        "must_contain": ["scalar", "vector"],
        "memo": "Speed — Scalar; Velocity — Vector; Distance — Scalar; Force — Vector; Kinetic energy — Scalar; [3 marks: all 5 = 3; 3-4 = 2; 2 = 1; 1 or 0 = 0]",
        "examiner_note": "Many answered correctly. Some couldn't identify KE as scalar. Spelling errors cost marks.",
        "explanation": "**Vectors (magnitude AND direction):** velocity, force, displacement, acceleration, momentum, weight.\n**Scalars (magnitude only):** speed, distance, mass, time, energy (all forms — KE, PE), temperature, density.\n\n• Speed = SCALAR (just size; no direction)\n• Velocity = VECTOR (speed in a particular direction)\n• Distance = SCALAR (just total path length)\n• Force = VECTOR (has direction)\n• Kinetic energy = SCALAR (energy is a scalar — only how much, not which way)\n\nMemory hook: any kind of ENERGY is scalar. Velocity/force/acceleration are vector (they have an arrow).",
    },
    {
        "q": "1(b)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "speed-time-graph",
        "prompt": "**(b)(i)** State a part of the graph (A, B, C, D or E) that shows the car **at rest**.",
        "accepted": ["A", "E", "A or E", "a", "e"],
        "must_contain": [],
        "memo": "A or E (both flat at speed = 0); [1 mark]",
        "examiner_note": "Well answered. Some confused 'at rest' on speed-time vs distance-time graphs.",
        "explanation": "**On a SPEED-TIME graph, 'at rest' means speed = 0** (graph touching the time axis).\n\nLook for where the line is **AT zero** on the y-axis:\n• **A** — the car is at speed 0 at the start (before t=4 s)\n• **E** — the car is back at speed 0 at the end (after t=28 s)\n\nEither answer scores. Don't confuse with constant speed (a horizontal line ABOVE the axis — that's moving at constant speed, not 'at rest').",
    },
    {
        "q": "1(b)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "speed-time-graph",
        "prompt": "**(b)(ii)** State a part of the graph that shows the car moving with **constant speed**.",
        "accepted": ["C", "c"],
        "must_contain": ["C"],
        "memo": "C (flat horizontal line at 16 m/s); [1 mark]",
        "examiner_note": "Most got this right. Some confused with B (constant acceleration).",
        "explanation": "**'Constant speed' on a speed-time graph = horizontal line ABOVE the x-axis.**\n\n• **C** shows the car moving at a steady 16 m/s from t=8 s to t=20 s (flat horizontal line) ✓\n• B is a sloped line going UP — that's constant ACCELERATION, not constant speed.\n• D is a sloped line going DOWN — that's deceleration.\n\nFlat + non-zero = constant speed.",
    },
    {
        "q": "1(b)(iii)", "marks": 3, "tier": "paid", "type": "calculation",
        "stem": Q1_STEM, "diagram": "speed-time-graph",
        "prompt": "**(b)(iii)** During part **B** of the journey the speed of the car increases from 0 to 16 m/s in 4 s. Calculate the **acceleration** and state the unit.",
        "correct": {"value": 4.0, "tolerance": 0.05, "unit": "m/s²", "accept_units": ["m/s2", "m/s^2", "m s-2", "ms-2", "m/s²"]},
        "memo": "Working: acceleration = Δv ÷ Δt;\n= (16 − 0) ÷ (8 − 4)\n= 16 ÷ 4\n= **4 m/s²**; [3 marks: 1 formula, 1 substitution, 1 answer + unit]",
        "examiner_note": "Many candidates struggled — weaker candidates chose the wrong part of the journey. Few gave the correct units.",
        "explanation": "**Acceleration = change in velocity ÷ time taken** (the GRADIENT of a speed-time graph).\n\n**a = (v − u) / t**\n\nFor segment B (from t=4 s to t=8 s; speed 0 → 16 m/s):\n• Δv = 16 − 0 = 16 m/s\n• Δt = 8 − 4 = 4 s\n• a = 16 ÷ 4 = **4 m/s²** ✓\n\nUnit MUST be **m/s²** (metres per second squared) — pure number loses the mark.",
    },
    {
        "q": "1(c)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "Another car accelerates from rest at time 0 s with constant acceleration. Its speed at t = 20 s is 10 m/s.",
        "diagram": "speed-time-graph",
        "prompt": "**(c)** Describe the line you would draw on Fig. 1.1 to show this car's motion.",
        "memo": "Both required (1 mark each):\n1. A single STRAIGHT line drawn FROM THE ORIGIN (0,0);\n2. The line reaches 10 m/s at t = 20 s (acceleration = 0.5 m/s², no extra lines for constant speed or deceleration);",
        "rubric": "Award 1 mark for a straight line starting at origin. Award 1 mark for ending exactly at (20, 10). PENALISE adding extra horizontal lines for constant speed; deceleration sections.",
        "examiner_note": "Few drew correctly. Many added unnecessary lines (constant speed, deceleration) which lost marks.",
        "explanation": "The car accelerates with CONSTANT acceleration starting at rest — that's a STRAIGHT line on a speed-time graph (constant gradient).\n\n• Start at (0, 0) — at rest, time 0\n• End at (20, 10) — speed 10 m/s at t = 20 s\n• Draw a SINGLE straight line connecting these two points (gradient = 0.5 m/s²)\n\nDO NOT add other lines — the question only says 'constant acceleration', not what happens after t = 20 s.",
    },
    {
        "q": "1(d)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM + "\n\nA SECOND car is drawn on the same axes, starting from origin and reaching 10 m/s at t = 20 s.",
        "diagram": "speed-time-graph",
        "prompt": "**(d)** Describe, using Fig. 1.1, how you can determine **which car has the greater acceleration** (comparing your line to part B of the original car).",
        "memo": "The car with the STEEPER LINE (or GREATER GRADIENT) has the greater acceleration; [1 mark — must be a comparative statement]",
        "rubric": "Award 1 mark for COMPARATIVE language: 'steeper line' / 'greater gradient' / 'bigger slope'. PENALISE answers that just say 'calculate the gradient' without comparison.",
        "examiner_note": "Only strong candidates gained credit. Many didn't use comparative words like 'steeper line' or 'greater gradient'.",
        "explanation": "**On a speed-time graph, gradient = acceleration.** The STEEPER the line, the larger the acceleration.\n\nCompare visually:\n• Original car's segment B: rises from 0 to 16 m/s in 4 s → a = 4 m/s² (very steep)\n• New car: rises from 0 to 10 m/s in 20 s → a = 0.5 m/s² (gentler slope)\n\nThe original car (segment B) has the STEEPER line → the GREATER acceleration.\n\nUse comparative words: 'steeper', 'greater gradient', 'bigger slope'.",
    },
    {
        "q": "1(e)", "marks": 3, "tier": "paid", "type": "calculation",
        "stem": "A particle moves at 4 m/s for 20 s, then at 6 m/s for another 20 s, and finally at 8 m/s for the next 10 s.",
        "diagram": None,
        "prompt": "**(e)** Calculate the **average speed** of the particle for the entire journey.",
        "correct": {"value": 5.6, "tolerance": 0.05, "unit": "m/s", "accept_units": ["m/s", "ms-1", "m s-1", "m s^-1"]},
        "memo": "Working: average speed = total distance ÷ total time\n= (4 × 20) + (6 × 20) + (8 × 10) ÷ (20 + 20 + 10)\n= (80 + 120 + 80) ÷ 50\n= 280 ÷ 50\n= **5.6 m/s**; [3 marks: 1 for formula, 1 for correct distances/total time, 1 for answer + unit]",
        "examiner_note": "Many candidates added the three speeds and divided by 3 — wrong. Average speed = TOTAL distance ÷ TOTAL time, not the average of the speeds.",
        "explanation": "**Average speed = TOTAL distance ÷ TOTAL time** (NOT the average of the three speeds!).\n\nStep 1 — calculate distance for each segment:\n• 4 m/s × 20 s = 80 m\n• 6 m/s × 20 s = 120 m\n• 8 m/s × 10 s = 80 m\n• **Total distance = 280 m**\n\nStep 2 — total time:\n• 20 + 20 + 10 = **50 s**\n\nStep 3 — average speed:\n• 280 ÷ 50 = **5.6 m/s** ✓\n\nCommon trap: (4+6+8)/3 = 6 m/s — WRONG. Average speed isn't the mean of speeds because the times spent at each speed differ.",
    },

    # ═══════════ Q2 (7 marks) ═══════════
    {
        "q": "2(a)(i)", "marks": 3, "tier": "paid", "type": "calculation",
        "stem": Q2_STEM, "diagram": "nail-lever",
        "prompt": "**(a)(i)** Calculate the **moment** of this force about the pivot, and state the unit.",
        "correct": {"value": 75, "tolerance": 0.5, "unit": "N m", "accept_units": ["Nm", "N m", "N·m", "newton metre", "newton metres"]},
        "memo": "Working: Moment = force × perpendicular distance from pivot\n= 150 × 0.50\n= **75 N m**; [3 marks: 1 formula, 1 substitution, 1 answer + unit Nm]",
        "examiner_note": "Most got it. Few struggled with the unit 'N m'.",
        "explanation": "**Moment of force = Force × perpendicular distance from pivot.**\n\n**M = F × d**\n\n• F = 150 N\n• d = 0.50 m\n• M = 150 × 0.50 = **75 N m** ✓\n\nUnit is **N m** (newton-metres) — NOT to be confused with newton (force) or joule (work/energy). The unit shows that a moment has both a force component and a distance component.",
    },
    {
        "q": "2(a)(ii)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(a)(ii)** State **two other examples** of using the turning effect of a force.",
        "accepted": [
            "spanner door",
            "seesaw and wheelbarrow",
            "opening door, using spanner",
            "spanner, seesaw",
            "wheelbarrow door",
            "door, spanner",
            "opening a door, sitting on a seesaw",
        ],
        "must_contain": [],
        "memo": "Any two from: using a spanner to rotate a nut; sitting on a seesaw; opening or closing a door; pushing/pulling a wheelbarrow; any other valid turning-force example; [2 marks, 1 each]",
        "examiner_note": "Many answered correctly. Some only mentioned the TOOL (spanner, pliers) without describing the turning effect.",
        "explanation": "**Turning-effect examples** — any device that uses leverage:\n• **Spanner / wrench** rotating a nut\n• **Door** opening on its hinges\n• **Seesaw** with people on either side\n• **Wheelbarrow** (force at handles, pivot at the wheel)\n• **Scissors** (two levers)\n• **Bottle opener**\n• **Pliers**\n\nName any TWO. Be specific — 'using a spanner' is better than just 'spanner'.",
    },
    {
        "q": "2(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM + "\n\nThe man tries to remove a tougher nail but the turning effect is not enough.",
        "diagram": None,
        "prompt": "**(b)** How can the man **increase the turning effect WITHOUT increasing the force**?",
        "accepted": [
            "increase the distance",
            "increase distance from pivot",
            "use a longer bar",
            "move force further from pivot",
            "increase the perpendicular distance",
            "apply force further from the pivot",
            "increase distance of force from pivot",
        ],
        "must_contain": ["distance"],
        "memo": "Increase the distance (of the force from the pivot); [1 mark]",
        "examiner_note": "Weaker candidates said 'increase the length of the metal bar' — not enough. The mark requires increasing the perpendicular distance from pivot to the line of force.",
        "explanation": "**Moment = Force × distance.** If you can't change F, change d.\n\nIncrease the **perpendicular distance** from the pivot to where the force is applied:\n• Push at the FAR end of the bar (not near the pivot)\n• Use a LONGER bar so you can push further out\n\nThis is why long levers ('give me a place to stand and I'll move the world' — Archimedes). Big d × small F can equal a huge moment.",
    },
    {
        "q": "2(c)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Equilibrium of a system.",
        "diagram": None,
        "prompt": "**(c)** State **one condition** for a system to be in **equilibrium**.",
        "accepted": [
            "no resultant force",
            "no net force",
            "no resultant moment",
            "no net moment",
            "clockwise moment equals anticlockwise moment",
            "anticlockwise moment equals clockwise moment",
            "sum of forces is zero",
            "no resultant turning effect",
            "sum of moments is zero",
        ],
        "must_contain": [],
        "memo": "No resultant force / no resultant moment (or torque) / total anticlockwise moment = total clockwise moment; [1 mark]",
        "examiner_note": "Many gave insufficient information — 'forces on both sides are equal' isn't quite the same as 'no resultant force'.",
        "explanation": "**Equilibrium = no NET force AND no NET moment (turning effect).**\n\nTwo conditions:\n1. **Sum of forces = 0** (no resultant force in any direction)\n2. **Sum of moments = 0** (clockwise = anticlockwise about ANY point)\n\nThe question asks for ONE condition — either one of these is correct.\n\nKey word: **NO RESULTANT** (not just 'balanced' or 'forces are equal' — be specific that the NET is zero).",
    },

    # ═══════════ Q3 (10 marks) ═══════════
    {
        "q": "3(a)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM, "diagram": None,
        "prompt": "**(a)** Define **latent heat**.",
        "memo": "The quantity of heat energy absorbed OR released WHEN a substance changes state WITHOUT changing its temperature; [2 marks — need 'change of state' AND 'constant/no change in temperature']",
        "rubric": "Award 1 mark for 'heat absorbed/released' AND 1 mark for the two key conditions: 'change of state' + 'no change in temperature'. PENALISE: defining specific heat capacity by mistake; missing the constant-temperature condition.",
        "examiner_note": "Most couldn't define. Common confusion with specific heat capacity. Some left out the 'constant temperature' part.",
        "explanation": "**Latent heat** = energy hidden in the bond-breaking (or bond-making) that happens DURING a state change — without the temperature changing.\n\nKey points:\n• Energy is **absorbed** (melting, boiling) or **released** (freezing, condensing)\n• Happens DURING a **change of state**\n• Temperature stays CONSTANT during the change (energy goes into breaking bonds, not into raising T)\n\nDon't confuse with specific HEAT CAPACITY (which is energy to RAISE temperature by 1 K, not change state).",
    },
    {
        "q": "3(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": None,
        "prompt": "**(b)** State a **time** in Table 3.1 at which the energy is being supplied as **latent heat of fusion** (melting).",
        "accepted": ["2", "6", "10", "14", "2 min", "6 min", "10 min", "14 min", "2 minutes"],
        "must_contain": [],
        "memo": "Any time between 2 min and 14 min inclusive (the plateau at −9 °C — substance is melting); [1 mark]",
        "examiner_note": "Well answered.",
        "explanation": "**Latent heat of FUSION = energy absorbed during MELTING (solid → liquid).**\n\nLook for the **FLAT plateau** in the table where temperature stays constant — that's when the substance is changing state.\n\nIn Table 3.1, T stays at **−9 °C from t = 2 to t = 14 minutes**. During this time:\n• Energy is still being supplied (heating at constant rate)\n• Temperature doesn't change\n• → Energy is going into BREAKING the bonds of the solid (melting it)\n\nAny time between 2 and 14 min is acceptable.",
    },
    {
        "q": "3(c)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM, "diagram": None,
        "prompt": "**(c)** Explain the **energy changes** undergone by the molecules when latent heat of **vaporisation** is being supplied.",
        "memo": "Both required (1 mark each):\n1. POTENTIAL energy of the molecules INCREASES (no change in kinetic energy because temperature is constant);\n2. Bonds / forces between molecules are WEAKENED or OVERCOME;",
        "rubric": "Award 1 mark for 'potential energy increases' (don't accept 'kinetic energy increases' — that would mean T rises). Award 1 mark for 'bonds weakened/broken' or 'forces between molecules overcome'. PENALISE: 'molecules move faster' — that implies KE going up, which doesn't happen at constant T.",
        "examiner_note": "Very poorly answered. Many wrongly said 'molecules gain kinetic energy' — but at constant temperature, KE doesn't change. It's POTENTIAL energy that rises as bonds break.",
        "explanation": "**During boiling (latent heat of vaporisation), temperature is constant** — so molecules' average kinetic energy DOESN'T change (KE ∝ T).\n\nWhere does the energy go?\n• Into INCREASING the **POTENTIAL energy** of the molecules (separating them against intermolecular forces) ✓\n• The bonds / forces between molecules are **WEAKENED or OVERCOME**\n• Molecules become free to move much further apart (liquid → gas: large volume increase)\n\nKey distinction: KE = temperature; PE = arrangement. State change is PE change at constant KE.",
    },
    {
        "q": "3(d)(i)", "marks": 2, "tier": "paid", "type": "calculation",
        "stem": Q3_STEM + "\n\nThe rate of heating is **2.0 kW** (2000 W).",
        "diagram": None,
        "prompt": "**(d)(i)** Calculate how much **energy** is supplied to the substance during the period **18 to 22 minutes**.",
        "correct": {"value": 480000, "tolerance": 0.01, "unit": "J", "accept_units": ["J", "joule", "joules"]},
        "memo": "Working: Energy = Power × time;\n= 2000 W × (22 − 18) × 60 s\n= 2000 × 240\n= **480 000 J** (or 480 kJ);\n[2 marks: 1 for formula and conversions, 1 for final answer]",
        "examiner_note": "Fairly answered. Many forgot to convert kW → W or minutes → seconds.",
        "explanation": "**Energy = Power × time** (basic power formula).\n\nUnit watch:\n• Power: 2.0 kW = **2000 W** (must be in watts for joules)\n• Time: 22 − 18 = 4 min = **4 × 60 = 240 s** (must be in seconds)\n\nE = 2000 × 240 = **480 000 J** (= 480 kJ) ✓\n\nCommon trap: forgetting to convert kW to W (would give 4800 — wrong by ×1000) or minutes to seconds (would give 8000 — wrong by ×60). Always check units match.",
    },
    {
        "q": "3(d)(ii)", "marks": 3, "tier": "paid", "type": "calculation",
        "stem": Q3_STEM + "\n\nSpecific heat capacity = **1760 J/(kg·°C)**. Use the data for 18-22 minutes (temperature goes from 32 °C to 75 °C; energy supplied = 480 000 J from part (i)).",
        "diagram": None,
        "prompt": "**(d)(ii)** Calculate the **mass** of the substance being heated.",
        "correct": {"value": 6.34, "tolerance": 0.05, "unit": "kg", "accept_units": ["kg", "kilogram", "kilograms"]},
        "memo": "Working: Q = mcΔT → m = Q ÷ (c × ΔT)\n= 480 000 ÷ (1760 × (75 − 32))\n= 480 000 ÷ (1760 × 43)\n= 480 000 ÷ 75 680\n= **6.34 kg** (accept any rounding from 2 s.f.);\n[3 marks: 1 formula rearranged, 1 ΔT correct, 1 final answer]",
        "examiner_note": "Fairly answered. Many failed to make m the subject of the formula. Some struggled to calculate ΔT = 75 − 32.",
        "explanation": "**Heat capacity formula: Q = m × c × ΔT.**\n\nRearrange for mass: **m = Q ÷ (c × ΔT)**\n\nValues:\n• Q = 480 000 J (from part (i))\n• c = 1760 J/(kg·°C)\n• ΔT = T_final − T_initial = 75 − 32 = **43 °C** (NOT 75 − 0!)\n\nm = 480 000 ÷ (1760 × 43) = 480 000 ÷ 75 680 = **6.34 kg** ✓\n\nWatch out: in the 18-22 minute period the temperature goes from 32 °C (at 18 min) to 75 °C (at 22 min) — use the START and END temperatures, not just the final.",
    },

    # ═══════════ Q4 (14 marks) ═══════════
    {
        "q": "4(a)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q4_STEM, "diagram": "displacement-graph",
        "prompt": "**(a)** State the **amplitude** of the vibrations of cork A as the wave passes. (Units: mm)",
        "accepted": ["2", "2.0", "2 mm", "2.0 mm"],
        "must_contain": ["2"],
        "memo": "2.0 (mm); [1 mark]",
        "examiner_note": "Most got 2 mm. Some confused with time (gave 0.25 etc).",
        "explanation": "**Amplitude** = the MAXIMUM displacement from the rest position (the centre of the wave).\n\nOn the graph the displacement oscillates between **+2 mm and −2 mm**. The amplitude is the maximum height = **2.0 mm** ✓\n\nNot to be confused with:\n• Wavelength — distance between consecutive crests (here 8 cm)\n• Period — time for one full cycle (here 0.50 s, from the graph)\n\nAmplitude is half the peak-to-peak distance, measured from the centre line.",
    },
    {
        "q": "4(b)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q4_STEM + "\n\nThe horizontal distance between A and B is HALF the wavelength.",
        "diagram": "displacement-graph",
        "prompt": "**(b)** Describe how to sketch a graph of cork B's displacement vs time on the SAME axes as cork A.",
        "memo": "Both required (1 mark each):\n1. Same period (0.50 s) and same amplitude (2 mm) as wave A — at LEAST one full cycle drawn;\n2. Drawn in OPPOSITE PHASE (180°) to wave A — i.e. when A is at +2 mm, B is at −2 mm;",
        "rubric": "Award 1 mark for same period and amplitude as A. Award 1 mark for being EXACTLY OUT OF PHASE (180° / π radians shift). PENALISE: different period; smaller amplitude; phase difference of less than half a wavelength.",
        "examiner_note": "Very few answered correctly. Many drew a wave but didn't use the half-wavelength information.",
        "explanation": "**Half a wavelength apart = 180° out of phase = mirror image.**\n\nThe wave travels outward as a circular wavefront. Two points half a wavelength apart oscillate in OPPOSITE directions: when A is at the top of a crest, B is at the bottom of a trough.\n\nSketch B as:\n• Same period (0.50 s) as A\n• Same amplitude (2 mm)\n• Shifted 180° (inverted) — so when A's peak is at +2 mm, B's is at −2 mm at the same time\n• It looks like A's curve flipped upside-down\n\nThis is **antiphase** (opposite phase). At λ apart they'd be in phase; at λ/2, they're antiphase.",
    },
    {
        "q": "4(c)(i)", "marks": 2, "tier": "paid", "type": "calculation",
        "stem": Q4_STEM, "diagram": "displacement-graph",
        "prompt": "**(c)(i)** Use the graph to determine the **frequency** of the wave. (Period = 0.50 s from graph.)",
        "correct": {"value": 2.0, "tolerance": 0.05, "unit": "Hz", "accept_units": ["Hz", "hz", "hertz", "/s", "s^-1", "s-1"]},
        "memo": "Working: f = 1/T;\n= 1 / 0.50\n= **2 Hz**;\n[2 marks: 1 formula, 1 answer + unit]",
        "examiner_note": "Most could write the formula but failed to read the period correctly. Some used wrong symbol (p instead of T).",
        "explanation": "**Frequency = 1 / period.** f = 1/T.\n\nFrom the graph: one complete cycle takes from t = 0 to t = 0.50 s → **T = 0.50 s** (one full crest-to-crest distance on the time axis).\n\nf = 1 ÷ 0.50 = **2.0 Hz** (cycles per second) ✓\n\nUnit: Hz (hertz) = 1/s (per second). Always check the unit.",
    },
    {
        "q": "4(c)(ii)", "marks": 2, "tier": "paid", "type": "calculation",
        "stem": Q4_STEM + "\n\nDistance from centre of tank to edge = **40 cm**. Wave frequency = 2 Hz (from part i).",
        "diagram": "ripple-tank",
        "prompt": "**(c)(ii)** Calculate the **time** taken by a wavefront to travel from the centre of the tank to the edge.",
        "correct": {"value": 2.5, "tolerance": 0.05, "unit": "s", "accept_units": ["s", "sec", "second", "seconds"]},
        "memo": "Working:\nFirst find wave speed: v = f × λ = 2 × 8 = 16 cm/s\nThen time: t = distance ÷ speed = 40 ÷ 16 = **2.5 s**\n[2 marks: 1 method, 1 answer + unit; ecf from part (i)]",
        "examiner_note": "Many used v = fλ instead of t = d/v — i.e. they calculated speed but then didn't get time.",
        "explanation": "**Two-step problem:**\n\n1. Find the **wave speed**: v = f × λ\n   • v = 2.0 × 8.0 = **16 cm/s**\n\n2. Find the **time** to cover 40 cm: t = distance ÷ speed\n   • t = 40 ÷ 16 = **2.5 s** ✓\n\nThe wave equation gives speed; then use distance/speed to get time. Watch units: both in cm here, so they cancel.",
    },
    {
        "q": "4(d)(i)", "marks": 1, "tier": "free", "type": "calculation",
        "stem": "A ray of light refracts from air into glass. The ray inside the air makes a 55° angle with the GLASS SURFACE (boundary).",
        "diagram": "refraction-glass",
        "prompt": "**(d)(i)** Determine the **angle of incidence** of the ray on the glass.",
        "correct": {"value": 35, "tolerance": 0.5, "unit": "°", "accept_units": ["°", "deg", "degrees", "degree", ""]},
        "memo": "Working: angle of incidence is measured FROM THE NORMAL, not from the surface;\n= 90 − 55\n= **35°**;\n[1 mark]",
        "examiner_note": "Most failed — they simply COPIED 55° as the incident angle, which is wrong. Some tried to measure with a protractor.",
        "explanation": "**Angles in optics are ALWAYS measured FROM THE NORMAL** (the perpendicular dashed line at the surface), not from the surface itself.\n\nIf the ray makes 55° WITH THE SURFACE, then the angle with the NORMAL (which is at 90° to the surface) is:\n\n**90° − 55° = 35°** ✓\n\nThis is the **angle of incidence**. The 55° given is a distractor — always check whether the angle in the diagram is to the surface or to the normal.",
    },
    {
        "q": "4(d)(ii)", "marks": 2, "tier": "paid", "type": "calculation",
        "stem": "Glass has refractive index **n = 1.5**. The angle of incidence (in air) is 35° (from part i).",
        "diagram": "refraction-glass",
        "prompt": "**(d)(ii)** Calculate the **angle of refraction** in the glass.",
        "correct": {"value": 22.5, "tolerance": 1.0, "unit": "°", "accept_units": ["°", "deg", "degrees", ""]},
        "memo": "Working: n = sin(i) / sin(r) → sin(r) = sin(i) / n;\nsin(r) = sin(35°) / 1.5 = 0.5736 / 1.5 = 0.3824\nr = sin⁻¹(0.3824) = **22.5°** (accept 2 s.f.);\n[2 marks: 1 rearrangement, 1 answer + unit]",
        "examiner_note": "Many failed to rearrange Snell's law. Some did the substitution but couldn't compute inverse sine. ECF from (d)(i).",
        "explanation": "**Snell's law: n = sin(i) ÷ sin(r)** (where i = incidence, r = refraction, in the second medium).\n\nRearrange for r:\nsin(r) = sin(i) / n\nsin(r) = sin(35°) / 1.5\nsin(r) = 0.5736 / 1.5 = **0.3824**\n\nTake inverse sin:\nr = sin⁻¹(0.3824) = **22.5°** (≈ 22.5° to 1 d.p.) ✓\n\nKey skill: rearranging the formula AND using the inverse-sin (sin⁻¹) button on a calculator. When light enters a denser medium (higher n), r < i — the ray bends TOWARDS the normal.",
    },
    {
        "q": "4(e)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Waves moving from deep into shallow water.",
        "diagram": None,
        "prompt": "**(e)(i)** Define the term **wave front**.",
        "accepted": [
            "the line containing points in the same phase",
            "line joining adjacent points in same phase",
            "a line joining points in the same phase",
            "a line containing adjacent points in the same phase",
            "joining crests in same phase",
            "line joining points in phase",
        ],
        "must_contain": ["phase"],
        "memo": "A line containing (adjacent) points that are in the SAME PHASE; [1 mark — must mention 'phase']",
        "examiner_note": "Most couldn't define correctly.",
        "explanation": "**Wave front** = an imaginary line joining all points on a wave that are **in the same PHASE** (same point in their oscillation cycle — e.g. all at the peak of a crest, or all at the trough).\n\nFor a water wave, the crests (the white lines you can see) ARE wave fronts.\n\nFor a circular wave (like the ripple tank), the wave fronts are concentric circles expanding outward. For a plane wave (in this question), they are straight parallel lines.",
    },
    {
        "q": "4(e)(ii)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": "Waves move from deep water to shallow water. The boundary is at right angles to the direction of travel.",
        "diagram": "wave-fronts",
        "prompt": "**(e)(ii)** Describe what happens to wave fronts in the **shallow water** (boundary perpendicular to the direction of travel). Specify: number of wave fronts drawn, their direction, their spacing/wavelength.",
        "memo": "All 3 marks:\n1. At least 3 wave fronts shown AFTER the boundary;\n2. Drawn VERTICAL (parallel to the boundary, since the boundary is perpendicular to the wave direction — no refraction / no bending);\n3. CLOSER together — SMALLER wavelength (because wave SLOWS in shallow water; frequency unchanged → wavelength decreases);",
        "rubric": "Award 3 marks: (a) ≥3 wave fronts after boundary; (b) vertical/parallel to boundary (no bending — the wave hits the boundary head-on); (c) wavelength SMALLER (closer spacing) than in deep water. PENALISE drawings showing the waves bending — refraction only happens at an oblique angle.",
        "examiner_note": "Fairly answered. Many couldn't differentiate between reflection and refraction. Many drew the wave bending when in fact it shouldn't — the boundary was perpendicular to the direction of travel.",
        "explanation": "**Waves at a PERPENDICULAR boundary — they DON'T bend.**\n\nKey facts when waves enter shallow water:\n• Speed **DECREASES** (waves slow down in shallow water)\n• Frequency stays the SAME (set by the source)\n• Wavelength DECREASES (because v = fλ; v down + f constant → λ down)\n• Direction stays the same IF the boundary is perpendicular (head-on entry, no refraction)\n\nDraw at least 3 vertical lines (parallel to the boundary) in the shallow side, with SMALLER gaps between them than in the deep side.",
    },

    # ═══════════ Q5 (7 marks) ═══════════
    {
        "q": "5(a)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q5_STEM, "diagram": "em-spectrum",
        "prompt": "**(a)** State the name of part **Q** (between radio and infrared).",
        "accepted": ["microwaves", "Microwaves", "microwave"],
        "must_contain": ["microwave"],
        "memo": "Microwaves; [1 mark — spelling matters]",
        "examiner_note": "Many got this. Some misspelt as 'macrowaves' or 'mircowaves' — those don't score.",
        "explanation": "**The EM spectrum, by INCREASING frequency (decreasing wavelength):**\n\nRadio → **MICROWAVES** → Infrared → Visible → UV → X-rays → Gamma\n\nSitting between radio and infrared = **microwaves**. Used for cooking, satellite communications, radar, Wi-Fi.\n\nSpell carefully: m-i-c-r-o-w-a-v-e-s.",
    },
    {
        "q": "5(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Speed of visible light in vacuum = 3.0 × 10⁸ m/s.",
        "diagram": None,
        "prompt": "**(b)** State the value of the **speed of infrared waves in a vacuum**.",
        "accepted": ["3.0 x 10^8", "3.0 x 10^8 m/s", "3 x 10^8", "3.0e8", "300000000", "3 × 10^8"],
        "must_contain": [],
        "memo": "3.0 × 10⁸ m/s; [1 mark]",
        "examiner_note": "Most knew this. Some wrote 300000000 then dropped a zero by mistake.",
        "explanation": "**All electromagnetic waves travel at the SAME speed in vacuum: c = 3.0 × 10⁸ m/s.**\n\nRadio, microwaves, infrared, visible, UV, X-rays, gamma — they ALL travel at the speed of light in vacuum. Only in matter (glass, water, air) do they slow down differently.\n\nSo infrared in vacuum = same as visible light = **3.0 × 10⁸ m/s**.",
    },
    {
        "q": "5(c)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q5_STEM, "diagram": None,
        "prompt": "**(c)** Give an example of an EM wave with **shorter wavelength than visible light**.",
        "accepted": ["ultraviolet", "UV", "X-rays", "x-rays", "X rays", "gamma rays", "gamma", "γ-rays"],
        "must_contain": [],
        "memo": "Ultraviolet (UV) / X-rays / gamma rays; [1 mark — any one, correct spelling]",
        "examiner_note": "Most got it. A few misspelt 'ultraviolet'.",
        "explanation": "**Shorter wavelength than visible light = HIGHER frequency:**\n\n• **Ultraviolet (UV)** — just shorter than violet light\n• **X-rays** — used in hospitals to see bones\n• **Gamma rays** — shortest wavelength of all\n\nAny one of these is correct. Visible light is in the middle of the spectrum; UV, X-rays, gamma rays are all to its 'short-wavelength' side (and infrared, microwaves, radio are to the 'long-wavelength' side).",
    },
    {
        "q": "5(d)(i)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "X-rays and gamma rays are used in hospitals.",
        "diagram": None,
        "prompt": "**(d)(i)** Describe **one medical use** for each. Format: 'X-rays: ___; γ-rays: ___'.",
        "memo": "Both required (1 mark each):\n• **X-rays**: detecting broken bones / damaged teeth / treating cancer (any one);\n• **γ-rays**: treating cancer / sterilising hospital equipment or food (any one);",
        "rubric": "Award 1 mark for each. For X-rays, 'view skeletal structure' alone is NOT enough — must say 'detect fractures' or similar diagnostic use. PENALISE generic 'see inside body'.",
        "examiner_note": "Most got this moderately. Few got the X-rays mark — saying 'view skeletal structure' isn't enough; must specify detecting fractures.",
        "explanation": "**Hospital uses of high-energy EM radiation:**\n\n• **X-rays** (lower energy than gamma):\n  - **Diagnostic** — detect **broken bones / fractures**, dental cavities\n  - Higher doses: treat cancer (less common)\n\n• **Gamma rays** (highest energy):\n  - **Cancer treatment** (radiotherapy — kills tumour cells)\n  - **Sterilising** medical equipment, food, blood products (kills bacteria)\n\nPair the use precisely. 'View skeletal structure' is too vague — be specific about WHAT defect you're looking for.",
    },
    {
        "q": "5(d)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "Gamma rays can be hazardous.",
        "diagram": None,
        "prompt": "**(d)(ii)** State **two reasons** why γ-rays are dangerous to living organisms.",
        "memo": "Any 2 of (1 mark each):\n• Ionising radiation / high frequency / high energy;\n• Damage or kill cells;\n• Cause radiation burns;\n• Cause cancer;\n• Cause (genetic) mutations;",
        "rubric": "Award 1 mark each (max 2). Each point must be a distinct effect — 'they're dangerous' is too vague.",
        "examiner_note": "Many got this with at least one effect.",
        "explanation": "**Why gamma rays are dangerous to living tissue:**\n\n1. **Ionising radiation** — knocks electrons off atoms, breaking molecules in cells\n2. **Kill or damage cells** — too much radiation kills healthy tissue\n3. **Cause cancer** — DNA damage can lead to uncontrolled cell growth\n4. **Cause genetic mutations** — heritable damage to DNA\n5. **Burns** — high doses cause radiation burns on skin\n\nName any TWO. Gamma rays are the most penetrating (need thick lead or concrete to shield) and the most ionising of the EM spectrum.",
    },

    # ═══════════ Q6 (11 marks) ═══════════
    {
        "q": "6(a)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q6_STEM, "diagram": "series-circuit",
        "prompt": "**(a)** State what is meant by **electromotive force (e.m.f.)**.",
        "memo": "The amount of energy dissipated/supplied by a source in driving unit charge round a complete circuit / energy transferred by the source per unit charge / the total energy per charge; [2 marks]",
        "rubric": "Award 2 marks for the full definition with 'energy per charge' and reference to the source driving charge. Award 1 mark for partial answer. ACCEPT alternative: 'p.d. across the cell when no current flows' / 'chemical energy converted to electrical per charge'.",
        "examiner_note": "Poorly answered. Most couldn't define e.m.f.",
        "explanation": "**e.m.f. = energy per unit charge supplied by a SOURCE (battery, generator) to drive charge round a complete circuit.**\n\nUnit: volt (V) = joule per coulomb (J/C).\n\nThink of e.m.f. as the 'push' a battery provides:\n• High e.m.f. (e.g. 12 V car battery) → big push\n• Low e.m.f. (e.g. 1.5 V AA cell) → smaller push\n\nDifferent from p.d. across a resistor:\n• e.m.f. is what the source provides\n• p.d. is the energy used per charge by a component\n\nAcceptable simpler form: 'p.d. across the cell when no current flows' (open-circuit voltage).",
    },
    {
        "q": "6(b)", "marks": 2, "tier": "paid", "type": "calculation",
        "stem": Q6_STEM + "\n\nThe two resistors are in SERIES.",
        "diagram": "series-circuit",
        "prompt": "**(b)** Calculate the **current** in the battery.",
        "correct": {"value": 0.25, "tolerance": 0.005, "unit": "A", "accept_units": ["A", "amp", "amps", "ampere", "amperes"]},
        "memo": "Working: R_total = R1 + R2 = 18 + 30 = 48 Ω\nI = V/R = 12 / 48 = **0.25 A**;\n[2 marks: 1 for R_total = 48 or correct setup, 1 for answer + unit]",
        "examiner_note": "Well answered. Most recalled the formula correctly.",
        "explanation": "**Series resistors: total resistance = sum of individual resistances.**\n\nR_total = R1 + R2 = 18 + 30 = **48 Ω**\n\n**Ohm's law: V = IR → I = V/R**\n\nI = 12 V ÷ 48 Ω = **0.25 A** ✓\n\nIn a series circuit, the current is the SAME everywhere (only one path).",
    },
    {
        "q": "6(c)", "marks": 1, "tier": "free", "type": "calculation",
        "stem": Q6_STEM + "\n\nCurrent = 0.25 A (from part b).",
        "diagram": "series-circuit",
        "prompt": "**(c)** Calculate the **potential difference (p.d.) across the 18 Ω resistor**.",
        "correct": {"value": 4.5, "tolerance": 0.1, "unit": "V", "accept_units": ["V", "volt", "volts"]},
        "memo": "Working: V = I × R = 0.25 × 18 = **4.5 V**; [1 mark]",
        "examiner_note": "Poorly answered. Many couldn't rearrange Ohm's law.",
        "explanation": "**Ohm's law: V = IR.**\n\nFor the 18 Ω resistor:\nV = 0.25 × 18 = **4.5 V** ✓\n\nIn a series circuit, the voltage is SHARED between resistors — bigger resistor gets bigger share. Here 18 Ω gets 4.5 V and 30 Ω gets 7.5 V (sum = 12 V = battery e.m.f. ✓).",
    },
    {
        "q": "6(d)", "marks": 2, "tier": "paid", "type": "calculation",
        "stem": Q6_STEM + "\n\nCurrent = 0.25 A; p.d. across 18 Ω = 4.5 V.",
        "diagram": "series-circuit",
        "prompt": "**(d)** Calculate the **power produced** in the 18 Ω resistor.",
        "correct": {"value": 1.125, "tolerance": 0.05, "unit": "W", "accept_units": ["W", "watt", "watts"]},
        "memo": "Working: P = V × I = 4.5 × 0.25 = **1.125 W** (or P = I²R = 0.0625 × 18 = 1.125 W; or P = V²/R = 20.25/18 = 1.125 W);\n[2 marks: 1 formula, 1 answer + unit (accept 2 s.f.)]",
        "examiner_note": "Poorly answered. Many couldn't recall the power formula.",
        "explanation": "**Three forms of the power formula** — all give the same answer for the 18 Ω resistor:\n\n• **P = V × I** = 4.5 × 0.25 = **1.125 W** ✓\n• P = I² × R = 0.25² × 18 = 0.0625 × 18 = 1.125 W ✓\n• P = V² / R = 4.5² / 18 = 20.25/18 = 1.125 W ✓\n\nUnit: W (watt) = joule per second.\n\nUse the form where you already have the values — VI is easiest here.",
    },
    {
        "q": "6(e)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q6_STEM + "\n\nThe resistors obey Ohm's law.",
        "diagram": None,
        "prompt": "**(e)** State **Ohm's law** and discuss the **temperature limitation** on this law.",
        "memo": "Both required (1 mark each):\n1. Current is (directly) PROPORTIONAL TO voltage (potential difference);\n2. ...at CONSTANT TEMPERATURE;",
        "rubric": "Award 1 mark for the law (I ∝ V), 1 mark for stating the temperature must be constant. PENALISE: just stating V=IR without mentioning proportionality; missing the constant temperature condition.",
        "examiner_note": "Fairly answered. Most stated the law but missed the temperature condition.",
        "explanation": "**Ohm's law (full statement):**\n\nThe **current** through a conductor is **directly PROPORTIONAL to the potential difference** across it, **provided the TEMPERATURE remains CONSTANT**.\n\nMathematically: V = IR (where R is constant).\n\n**Temperature limitation:** as a conductor heats up, its atoms vibrate more, scattering electrons and increasing resistance. So if you don't keep T constant, R changes and the V/I ratio drifts — the law breaks down.\n\nThat's why ohmic resistors should stay cool for the law to hold.",
    },
    {
        "q": "6(f)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Same material and length as the original wire, but DOUBLE the diameter.",
        "diagram": None,
        "prompt": "**(f)(i)** Describe how the **resistance** would change.",
        "accepted": [
            "decrease", "decreases", "lower", "smaller", "less",
            "resistance decreases", "decreases by factor of 4",
            "becomes one quarter", "reduced",
        ],
        "must_contain": [],
        "memo": "Decrease (resistance ∝ 1/area ∝ 1/diameter²; doubling d → ÷4 R); [1 mark]",
        "examiner_note": "Fairly answered.",
        "explanation": "**Resistance formula:** R = ρL/A (resistivity × length ÷ cross-sectional area).\n\nA depends on diameter: A = π(d/2)² = πd²/4.\n\nWhen you **DOUBLE the diameter**:\n• Area QUADRUPLES (×4)\n• R DECREASES by factor of 4 (R becomes ¼ of original)\n\nKey: **thicker wire → lower resistance** (more 'highway lanes' for electrons).",
    },
    {
        "q": "6(f)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Same length and diameter as the original wire, but HOTTER.",
        "diagram": None,
        "prompt": "**(f)(ii)** Describe how the **resistance** would change.",
        "accepted": [
            "increase", "increases", "higher", "greater", "more",
            "resistance increases", "rises",
        ],
        "must_contain": [],
        "memo": "Increase (atoms vibrate more, scatter electrons more); [1 mark]",
        "examiner_note": "Fairly answered.",
        "explanation": "**Higher temperature → higher resistance** (for metallic conductors).\n\nReason: as a metal heats up, its atoms vibrate MORE around their fixed positions. Electrons trying to flow through collide with these vibrating atoms more often → more scattering → harder for current to flow → **resistance INCREASES**.\n\nThis is exactly why lightbulb filaments have much higher resistance when hot (lit) than when cold (off) — the cold inrush current is a brief spike.",
    },

    # ═══════════ Q7 (6 marks) ═══════════
    {
        "q": "7(a)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q7_STEM, "diagram": "ac-generator",
        "prompt": "**(a)** Which component (A, B, C or D) **distinguishes this AC generator from a DC generator**?",
        "accepted": ["A", "a"],
        "must_contain": ["A"],
        "memo": "A (the slip rings — DC generators have split-ring commutators instead); [1 mark]",
        "examiner_note": "Fairly answered. Many confused with DC motor parts and gave B.",
        "explanation": "**AC vs DC generator — the difference is the ring contacts:**\n\n• **AC generator** uses **SLIP RINGS** (two SMOOTH continuous rings) — the current naturally reverses each half-rotation, giving AC.\n• DC generator uses a **SPLIT-RING COMMUTATOR** (one ring split into two halves) — the split flips the connection each half-rotation, keeping the current going the same direction → DC.\n\nIn this diagram, A points to the slip rings.\n\nB = brushes (carbon contacts — same in both AC and DC).\nC = coil axis (same in both).\nD = magnet (same in both).",
    },
    {
        "q": "7(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q7_STEM, "diagram": "ac-generator",
        "prompt": "**(b)** Name component **A**.",
        "accepted": ["slip ring", "slip rings", "slip-ring", "Slip rings"],
        "must_contain": ["slip"],
        "memo": "Slip ring(s); [1 mark]",
        "examiner_note": "Poorly answered. Many wrote 'split ring' — wrong (that's DC).",
        "explanation": "**Component A = SLIP RINGS** (NOT split rings!).\n\nSlip rings:\n• Two separate, SMOOTH metal rings on the rotating axis\n• Each connected to one end of the coil\n• Brushes (B) press against them to make sliding contact\n• As the coil rotates, the current naturally alternates direction → AC output ✓\n\n**SLIP** ≠ **SPLIT**. Don't confuse the words — examiners are strict on this.",
    },
    {
        "q": "7(c)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q7_STEM + "\n\nUse Fleming's right-hand rule (generator rule). N is on the left, S on the right. The coil section XY is at the top, with X on the right and Y on the left. The coil rotates anticlockwise.",
        "diagram": "ac-generator",
        "prompt": "**(c)** In which direction will the induced current flow in section **XY** of the coil?",
        "accepted": ["X to Y", "x to y", "from X to Y", "X→Y", "to the left", "left"],
        "must_contain": [],
        "memo": "X to Y (i.e. to the left); [1 mark]",
        "examiner_note": "Most candidates struggled. Many wrote 'anticlockwise' instead of X to Y.",
        "explanation": "**Use Fleming's RIGHT-hand rule for generators (induced current):**\n\n• Thumb = direction of MOTION of the wire (the velocity)\n• First finger = direction of MAGNETIC field (N to S)\n• Second finger = direction of induced CURRENT\n\nFor section XY at the top of the coil (which is moving anticlockwise — let's say the top section is now moving towards us in the diagram):\n• Field direction: from N (left) → S (right), so field points to the RIGHT\n• Motion: top of coil moves OUT of the page (anticlockwise)\n• Apply right-hand rule → current flows from X to Y (to the LEFT) ✓\n\nAnswer with a direction along the wire, not 'clockwise/anticlockwise'.",
    },
    {
        "q": "7(d)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q7_STEM + "\n\nThe original output voltage graph (Fig 7.2) is a sine wave with PEAK 100 V and PERIOD 0.10 s. The coil speed is now DOUBLED.",
        "diagram": "ac-output-graph",
        "prompt": "**(d)** Describe how the new graph (0 to 0.1 s) compares with the original. State (1) how many complete cycles in 0.1 s, (2) the new period, (3) the new amplitude.",
        "memo": "All 3 marks:\n1. TWO full waves (cycles) in the same 0.1 s span;\n2. Period of each wave = 0.05 s (half the original);\n3. Amplitude (peak) = 200 V (DOUBLE the original);",
        "rubric": "Award 1 mark each: (a) two complete waves visible in 0.1 s; (b) period halved to 0.05 s; (c) amplitude doubled to 200 V (because faster rotation → faster rate of change of flux → bigger induced e.m.f.).",
        "examiner_note": "Poorly answered. Most didn't recognise both that period halves AND amplitude doubles when speed of rotation doubles.",
        "explanation": "**Doubling the rotation speed of the coil has TWO effects:**\n\n1. **Period HALVES** (frequency doubles). Same time interval (0.1 s) now contains **TWO full waves** instead of one. New period = 0.05 s.\n\n2. **Amplitude DOUBLES** (faster motion = faster rate of change of magnetic flux through the coil → larger induced e.m.f.). New peak = **200 V**.\n\nSo the new graph: TWO sine waves over the 0.1 s span, each with peak ±200 V and period 0.05 s.\n\nKey idea: rotation speed affects BOTH frequency AND amplitude in a generator (unlike a battery).",
    },

    # ═══════════ Q8 (11 marks) ═══════════
    {
        "q": "8(a)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q8_STEM, "diagram": None,
        "prompt": "**(a)** What is meant by **radioactive decay**?",
        "memo": "(Spontaneous) break up / disintegration / decomposition / splitting of UNSTABLE NUCLEI by emitting RADIATION (or nuclear particles); [2 marks: 1 for 'break up of unstable nuclei', 1 for 'emitting radiation/particles']",
        "rubric": "Award 1 mark for 'break up / disintegration of unstable nuclei'. Award 1 mark for 'emitting radiation' (alpha, beta, gamma) or 'nuclear particles'. PENALISE 'breaks up atoms' (incorrect — only the nucleus changes).",
        "examiner_note": "Most couldn't score full marks. Needed: 'break up/disintegrate of unstable nuclei' AND 'release radiation'.",
        "explanation": "**Radioactive decay** = the spontaneous breakdown of an unstable atomic nucleus, releasing radiation (or nuclear particles).\n\nKey words for the mark scheme:\n• **Unstable nuclei** (not just 'atoms' — only the NUCLEUS decays)\n• **Break up / disintegration / decomposition** of those nuclei\n• **Emitting** radiation (alpha α, beta β, gamma γ) or nuclear particles\n\nThe process is RANDOM and SPONTANEOUS — happens by itself, can't be predicted for any single nucleus, but follows a predictable HALF-LIFE for large samples.",
    },
    {
        "q": "8(b)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q8_STEM + "\n\nThe nuclide notation for plutonium-238 is ²³⁸₉₄Pu.",
        "diagram": None,
        "prompt": "**(b)** Write the equation for the alpha decay of plutonium-238 (²³⁸₉₄Pu → daughter + alpha).",
        "memo": "²³⁸₉₄Pu → ²³⁴₉₂U + ⁴₂He (or ⁴₂α); [2 marks: 1 for correct daughter nucleus (Uranium-234), 1 for correct alpha particle ⁴₂He]",
        "rubric": "Award 1 mark for the correct daughter (²³⁴₉₂U, uranium-234). Award 1 mark for the alpha particle ⁴₂He (or α). Mass numbers must balance: 238 = 234 + 4. Atomic numbers must balance: 94 = 92 + 2.",
        "examiner_note": "Poorly answered. Many couldn't identify the daughter as Uranium and write it in nuclide notation.",
        "explanation": "**Alpha decay** = nucleus emits an alpha particle (²α = ⁴₂He, a helium nucleus).\n\nResult on the parent nucleus:\n• Mass number A: DECREASES by 4 (238 → 234)\n• Atomic number Z: DECREASES by 2 (94 → 92)\n• Element changes (Z down 2 = move two places LEFT in the periodic table)\n• Z = 92 is **Uranium (U)**\n\n**Equation:**\n\n**²³⁸₉₄Pu → ²³⁴₉₂U + ⁴₂He**\n\nCheck: mass 238 = 234 + 4 ✓; charge 94 = 92 + 2 ✓.",
    },
    {
        "q": "8(c)(i)-alpha", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Ionising effects of alpha, beta and gamma radiation.",
        "diagram": None,
        "prompt": "**(c)(i)** Compare the ionising effect of **beta-particles** with **alpha-particles**.",
        "accepted": [
            "beta is weaker", "beta weaker", "beta particles weaker",
            "beta is less ionising", "beta less ionising than alpha",
            "weaker", "less than alpha",
        ],
        "must_contain": [],
        "memo": "Beta particles are WEAKER (less ionising) than alpha particles; [1 mark]",
        "examiner_note": "Poorly answered.",
        "explanation": "**Ionising power: alpha > beta > gamma.**\n\nCompared to alpha, beta particles are **WEAKER (less ionising)**.\n\nWhy: alpha has charge +2 and high mass (helium nucleus) — strongly attracts and rips off electrons. Beta has only charge −1 and much smaller mass (an electron) — weaker pull → fewer ionisations per cm of path.\n\nAlso related: alpha is stopped by paper; beta needs aluminium foil — beta penetrates further BECAUSE it's less ionising (loses less energy per collision).",
    },
    {
        "q": "8(c)(i)-gamma", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Ionising effects of alpha, beta and gamma radiation.",
        "diagram": None,
        "prompt": "**(c)(i)** Compare the ionising effect of **beta-particles** with **gamma-rays**.",
        "accepted": [
            "beta is stronger", "beta stronger", "beta particles stronger",
            "beta is more ionising", "beta more ionising than gamma",
            "stronger", "more than gamma",
        ],
        "must_contain": [],
        "memo": "Beta particles are STRONGER (more ionising) than gamma rays; [1 mark]",
        "examiner_note": "Poorly answered.",
        "explanation": "**Ionising power: alpha > beta > GAMMA.**\n\nCompared to gamma, beta particles are **STRONGER (more ionising)**.\n\nWhy: beta is a CHARGED particle (electron, −1) — can interact with electrons in atoms via electric force, knocking them off. Gamma is an UNCHARGED EM wave — passes through matter mostly without interacting (penetrates far, but ionises little).\n\nThat's why gamma is the most penetrating (needs lead/concrete to stop) but the least ionising per cm of path.",
    },
    {
        "q": "8(c)(ii)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": "Handling radioactive materials safely.",
        "diagram": None,
        "prompt": "**(c)(ii)** State **two safety precautions** when handling radioactive materials.",
        "accepted": [
            "wear gloves and use tongs",
            "tongs and gloves",
            "wear lead apron and use tongs",
            "wear protective clothing, do not touch",
            "wear gloves, do not eat",
            "use tongs, wear lab coat",
            "gloves and tongs",
            "wear goggles and gloves",
        ],
        "must_contain": [],
        "memo": "Any 2 of (1 mark each): wear lead-lined apron / protective clothes / goggles; do not eat or drink; do not point source at people; use tongs/tweezers to handle; do not touch with bare hands / wear gloves; cover wounds;",
        "examiner_note": "Well answered. Most got the standard precautions.",
        "explanation": "**Two precautions when handling radioactive sources:**\n\n• **Wear protective clothing** (lab coat, lead apron, goggles, gloves)\n• **Use tongs or tweezers** — never touch source with bare hands (keeps source away from skin)\n• **Do not point** source at people\n• **Do not eat or drink** in the lab (avoid ingestion)\n• **Cover any open wounds** (avoid contamination through cuts)\n• Keep exposure time SHORT and distance LARGE\n\nGoal: minimise exposure (time, distance, shielding — the three pillars of radiation safety).",
    },
    {
        "q": "8(d)", "marks": 3, "tier": "paid", "type": "calculation",
        "stem": "Another radioactive isotope has a **half-life of 6.0 years**. The sample starts at **12 mg**.",
        "diagram": None,
        "prompt": "**(d)** Calculate the mass of the isotope remaining after **18 years**.",
        "correct": {"value": 1.5, "tolerance": 0.05, "unit": "mg", "accept_units": ["mg", "milligram", "milligrams"]},
        "memo": "Working:\nNumber of half-lives = 18 ÷ 6.0 = 3\nMass remaining = 12 × (½)³ = 12 × 1/8 = **1.5 mg**;\n[3 marks: 1 for n=3, 1 for halving 3 times, 1 for final answer + unit]",
        "examiner_note": "Poorly answered. Few used the formula correctly.",
        "explanation": "**Half-life problem — three steps:**\n\n1. **Number of half-lives** = total time ÷ half-life = 18 ÷ 6.0 = **3**\n\n2. **Each half-life halves the mass:**\n   • Start: 12 mg\n   • After 1 half-life (6 years): 12 ÷ 2 = 6 mg\n   • After 2 half-lives (12 years): 6 ÷ 2 = 3 mg\n   • After 3 half-lives (18 years): 3 ÷ 2 = **1.5 mg** ✓\n\n3. **Formula:** m = m₀ × (1/2)ⁿ where n = number of half-lives\n   = 12 × (1/2)³ = 12 × 1/8 = 1.5 mg\n\nFractions to memorise: after 1 half-life = ½; after 2 = ¼; after 3 = ⅛; after 4 = 1/16.",
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
        print(f"  {slug:24s} {crop.size[0]}x{crop.size[1]}")


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
    out.append(f"-- NSSCO Physics 2024 Paper 2 (6118/2) — 8 questions, {len(QUESTIONS)} sub-parts, 80 marks")
    out.append("-- Verbatim NIED wording. Mark scheme + commentary from")
    out.append("-- DNEA Examiners Report 2024 (Physics section, pages 656-662).")
    out.append("-- Uses the new 'calculation' question type for numeric answers.")
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
            out.append(f"    phys_id, 2024, '2', '{q['q']}', {q['marks']}, '{q['tier']}',")
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
            out.append(f"    phys_id, 2024, '2', '{q['q']}', {q['marks']}, '{q['tier']}',")
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
            out.append(f"    phys_id, 2024, '2', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'free_text',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['rubric'])},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        out.append("")
    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} sub-parts for Physics NSSCO 2024 Paper 2';")
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
