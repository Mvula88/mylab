"""Build NSSCO Biology 2023 Paper 3 (Alternative to Practical) — 4 questions, 40 marks.

Single source of truth for all sub-parts. Verbatim NIED wording from the
question paper PDF; expected answers + commentary from the DNEA Examiners
Report 2023 (Biology section, pages 58-61).

Outputs:
  - public/past-papers/biology-nssco-2023-p3/*.png   (per-figure diagram crops)
  - supabase/migrations/{ts}_biology_nssco_2023_p3.sql

Run:
  PYTHONIOENCODING=utf-8 python scripts/build_2023_p3.py
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2023-p3"
PNG_DIR = ROOT / "public" / "past-papers" / "biology-nssco-2023-p3"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260525130000_biology_nssco_2023_p3.sql"

DIAGRAMS = {
    "root-tip":         ("page-06", 0.10, 0.46, 0.32, 0.68),
    "yeast-apparatus":  ("page-07", 0.06, 0.42, 0.18, 0.68),
    "apples-browning":  ("page-09", 0.13, 0.56, 0.08, 0.94),
}


def durl(slug: str | None) -> str | None:
    return f"/past-papers/biology-nssco-2023-p3/{slug}.png" if slug else None


# ═══════════ Q1 stems ═══════════
Q1_STEM = "A Grade 11 learner carried out an investigation to compare the rate of transpiration with the rate of water absorption in a plant.\n\nThe learner took the readings at four hour intervals during a twenty-four hour period when there was little wind.\n\n**Table 1.1**\n\n| time | rate of water absorption / g per hour | rate of transpiration / g per hour |\n|---|---|---|\n| 00:00 | 2.0 | 0.5 |\n| 04:00 | 1.5 | 0.3 |\n| 08:00 | 1.5 | 2.0 |\n| 12:00 | 3.5 | 5.0 |\n| 16:00 | 5.6 | 7.3 |\n| 20:00 | 3.4 | 0.9 |\n| 24:00 | 2.0 | 0.5 |"

# ═══════════ Q2 stems ═══════════
Q2_STEM = "The plant growth hormone **auxin** is involved in tropic responses in plants such as gravitropism.\n\nA Grade 11 learner investigated the length of the roots from maize seedlings grown at different concentrations of auxins. The root length of four seedlings were measured. Results in **Table 2.1**.\n\n| % auxin | root 1 / mm | root 2 / mm | root 3 / mm | root 4 / mm | average / mm |\n|---|---|---|---|---|---|\n| 0.0 | 15 | 18 | 14 | 15 | 15.5 |\n| 0.2 | 18 | 19 | 20 | 18 | 18.8 |\n| 0.4 | 24 | 22 | 22 | 23 | 22.8 |\n| 0.6 | 17 | 18 | 17 | 19 | ?  |\n| 0.8 | 13 | 14 |  5 | 12 | 13.0 |\n| 1.0 | 12 | 10 | 12 | 11 | 11.3 |"

# ═══════════ Q3 stems ═══════════
Q3_STEM = "Fig. 3.1 shows the apparatus used to investigate **anaerobic respiration** in yeast. The setup uses yeast in glucose solution with an oil layer on top, connected to a tube of lime water."

# ═══════════ Q4 stems ═══════════
Q4_STEM = "Peeled apples turn brown when exposed to air as shown in Fig. 4.1.\n\nThis browning is caused by an enzyme called **polyphenol oxidase** which acts on phenol compounds in the apple. This causes the apple to change from white → light brown → dark brown. Polyphenol oxidase can be affected by temperature and pH.\n\n**Table 4.1** — results after 12 minutes\n\n| tube | phenol / cm³ | apple extract / cm³ | acid / cm³ | alkali / cm³ | appearance |\n|---|---|---|---|---|---|\n| 1 | 2.5 | 2.5 | – | – | dark brown |\n| 2 | 2.5 | 2.5 | 3 | – | white |\n| 3 | 2.5 | 2.5 | – | 3 | light brown |\n| 4 | 2.5 | 2.5 | 5.5 | – | white |\n| 5 | 2.5 | 2.5 (boiled) | 3 | – | white |"


QUESTIONS = [
    # ──────── Q1 (10 marks) ────────
    {
        "q": "1(a)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM, "diagram": None,
        "prompt": "**(a)** Plot **line graphs** of both sets of data in Table 1.1 on a grid (time on the x-axis, rate on the y-axis up to 8 g/hour). Describe the plotting choices you would make:\n\n• How would you mark and distinguish the two sets of points (key)?\n• How would you join the points?\n• Where would your y-axis scale start and end and what increments would you use?",
        "memo": (
            "All 3 marks required:\n"
            "P — All points plotted correctly (both lines);\n"
            "L — Plotted points joined with RULED LINES (not free-hand or extrapolated past the data);\n"
            "K — Correct KEY clearly distinguishing the two sets (different symbols or labelled lines);"
        ),
        "rubric": "Award 1 mark each for: (P) describing accurate plotting (small dots/crosses, not huge); (L) joining with RULED straight lines between points, NOT extrapolated past last data point; (K) including a KEY with distinct symbols or labels for the two lines. PENALISE extrapolation, huge dot symbols (>2 squares), missing key.",
        "examiner_note": "The majority gave a correct KEY but couldn't provide correct plots. Plotted points weren't joined with a ruled line. Huge dots/crosses covered up to 2 small squares. Extrapolation past the data was common, costing the L mark.",
        "explanation": "Three things examiners always check on a plotted graph:\n\n• **P (plotting)** — every point at the right (x, y) value. Use SMALL, neat crosses (×) or dots — not big blobs that span multiple squares.\n• **L (lines)** — join consecutive points with a **ruled straight line**. Do NOT continue the line past the last data point (no extrapolation unless asked).\n• **K (key)** — show a small box with the legend: e.g. '× = transpiration, ● = absorption'.\n\nA tidy graph with a clear key wins all 3 marks easily — most candidates lose marks for sloppy plotting, not for misreading the data.",
    },
    {
        "q": "1(b)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": None,
        "prompt": "**(b)(i)** Estimate the time of sunrise on that day.",
        "accepted": ["04:00", "05:00", "06:00", "around 06:00", "06:00 (any time 04:00-06:00)", "4-6 am", "between 04:00 and 06:00"],
        "must_contain": [],
        "memo": "Any time from 04:00 up to 06:00; [1 mark]",
        "examiner_note": "The majority could not give the time of sunrise. Those who got the correct time often lost the explanation mark by failing to connect stomata opening to light.",
        "explanation": "Sunrise is when light first reaches the plant. Two clues from the table:\n• Transpiration starts to **rise sharply** between 04:00 (0.3) and 08:00 (2.0)\n• Transpiration rises when light triggers the **stomata to open** → water vapour escapes faster\n\nSo sunrise must be between 04:00 and 06:00 (any time in that range is accepted).",
    },
    {
        "q": "1(b)(ii)", "marks": 1, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM, "diagram": None,
        "prompt": "**(b)(ii)** Explain your answer in (b)(i) using information on the graph.",
        "memo": "Transpiration suddenly rises + as the stomata open in the light; [1 mark — BOTH halves needed]",
        "rubric": "Award 1 mark for explaining BOTH: (a) transpiration suddenly rises on the graph AND (b) because stomata open in response to LIGHT (sunrise). PENALISE answers that only mention the rise without linking to stomata + light.",
        "examiner_note": "Candidates who got the correct sunrise time still lost this mark because they only said 'transpiration suddenly rises' without linking it to stomata opening when light hits the leaves.",
        "explanation": "Link two facts:\n1. **Observation**: transpiration rate **shoots up** between 04:00 and 08:00 (from 0.3 → 2.0 g/hour)\n2. **Reason**: light at sunrise causes **stomata to open** → water vapour escapes from the leaves much faster\n\nBoth halves must be in your answer to get the mark.",
    },
    {
        "q": "1(c)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": None,
        "prompt": "**(c)(i)** For how long during the day had the water loss remained **greater than** water absorption?",
        "accepted": ["8 hours", "8 hrs", "8 hour", "10 hours", "11 hours", "10-11 hours"],
        "must_contain": ["hour"],
        "memo": "Table-based answer: 8 hours; Graph-based answer: 10–11 hours; [1 mark — unit required]",
        "examiner_note": "Very challenging. Majority wrote the range '08:00–16:00' or '8h00' instead of a duration like '8 hours'.",
        "explanation": "Look at the times when **transpiration > absorption**:\n• 08:00 — transpiration 2.0, absorption 1.5 (loss > absorption begins)\n• 12:00 — 5.0 > 3.5 still\n• 16:00 — 7.3 > 5.6 still\n• 20:00 — 0.9 < 3.4 (now absorption catches up)\n\nUsing the **table**: from 08:00 → 16:00 = **8 hours**. Using the **graph** (allowing for crossing points between data points): about 10–11 hours.\n\nGive the answer as a DURATION ('8 hours'), not a range ('08:00–16:00').",
    },
    {
        "q": "1(c)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": None,
        "prompt": "**(c)(ii)** Suggest what could be done to provide a better balance between water absorption and water loss from the plant.",
        "accepted": ["supply more water", "water the plant more", "provide shading", "shade the plant", "water more", "more water"],
        "must_contain": [],
        "memo": "Supply more water / provide shading; [1 mark]",
        "examiner_note": "Answered well by the majority of candidates.",
        "explanation": "Two practical ways to balance absorption and loss:\n• **Supply more water** — water the soil more often → more available for the roots to absorb\n• **Provide shading** — less direct sunlight → cooler leaves → less transpiration\n\nEither answer is accepted.",
    },
    {
        "q": "1(d)(i)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM, "diagram": None,
        "prompt": "**(d)(i)** Explain what happens **in the plant** to cause absorption to rise after 08:00.",
        "memo": (
            "Any 2 of (1 mark each):\n"
            "1. More water being lost by transpiration;\n"
            "2. Excess transpiration lowers water potential of cells;\n"
            "3. More osmosis from soil solution;\n"
            "4. More water moving into xylem from roots;"
        ),
        "rubric": "Award up to 2 marks. Must link transpiration → reduced cell water potential → more uptake by osmosis. PENALISE answers about respiration, photosynthesis, or temperature without connecting to the investigation (water absorption).",
        "examiner_note": "Poorly answered. Candidates referenced respiration, photosynthesis, temperature — not connected to the investigation. Use of comparative words ('more', 'less') was a big problem.",
        "explanation": "Cause-and-effect chain after sunrise:\n\n1. Stomata open → **more transpiration** (water lost from leaves)\n2. Cells in the leaf lose water → their **water potential drops**\n3. Water moves UP from xylem → root cells lose water too\n4. Root cells now have **lower water potential** than soil → **more osmosis** from soil into roots\n5. Result: **absorption rises** to keep up with the losses\n\nThe absorption ROSE because the plant was losing water from the top — water gets pulled up the xylem (transpiration stream).",
    },
    {
        "q": "1(d)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": None,
        "prompt": "**(d)(ii)** Suggest a reason why absorption starts to **fall** again after 16:00.",
        "accepted": [
            "transpiration decreases", "transpiration rate decreases", "less transpiration",
            "lower transpiration", "no need for more absorption",
        ],
        "must_contain": ["transpiration"],
        "memo": "Transpiration decreases (no need for more absorption); [1 mark]",
        "examiner_note": "To suggest a reason why absorption falls after 16:00 seemed very difficult for the candidates.",
        "explanation": "After 16:00, the sun goes down → light decreases → **stomata begin to close** → **transpiration falls** (look at the table: 7.3 g/hr at 16:00 → 0.9 g/hr at 20:00).\n\nWith less water being lost, the plant doesn't need to absorb as much — so absorption falls back too. The whole cycle reverses.",
    },
    # ──────── Q2 (10 marks) ────────
    {
        "q": "2(a)(i)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(a)(i)** Calculate the average root length at the concentration of **0.6 %**. Show your working and give your answer to **one decimal place**.",
        "accepted": ["17.8", "17.8 mm", "(17+18+17+19)/4 = 17.8", "71/4 = 17.8", "17.75", "17.75 rounded to 17.8"],
        "must_contain": ["17.8"],
        "memo": "Working: (17 + 18 + 17 + 19) ÷ 4 = 71/4 = **17.8 mm**; [2 marks — 1 for correct working, 1 for correct answer to 1 d.p.]",
        "examiner_note": "Well answered, although many candidates failed to write the answer in the Table as instructed.",
        "explanation": "**Mean = sum of values ÷ count.**\n\nAt 0.6 %: 17 + 18 + 17 + 19 = 71\n\nMean = 71 ÷ 4 = **17.75 mm** → rounded to **17.8 mm** (1 d.p.)\n\nShow:\n• The full addition\n• The division\n• The final number to the EXACT decimal places the question asks for",
    },
    {
        "q": "2(a)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": None,
        "prompt": "**(a)(ii)** Identify **one** anomalous data value in Table 2.1.",
        "accepted": [
            "5", "5 in column 3 row 0.8", "5 (at 0.8% concentration)",
            "the 5 at 0.8 percent", "5mm in row 0.8",
        ],
        "must_contain": ["5"],
        "memo": "Encircle the **5** in the row for 0.8 % concentration (root 3 column); [1 mark]",
        "examiner_note": "Quite a number of candidates could not identify the anomalous data. Anomalous data is an observation that deviates significantly from the rest of the data set.",
        "explanation": "**Anomaly** = a value that doesn't fit the pattern of the rest of the data.\n\nLook at the 0.8 % row: 13, 14, **5**, 12 — three of these are around 12–14 mm, but one is **5 mm**. That's the anomaly — way too low compared to its siblings, and it doesn't match the trend of the other concentrations either.\n\nIn an exam, draw a clear circle around it.",
    },
    {
        "q": "2(b)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM + "\n\nFig. 2.1 shows the data plotted: percentage concentration of auxin (x) vs average root length (y).",
        "diagram": None,
        "prompt": "**(b)** Describe the **trend** shown by the data in Fig. 2.1.",
        "memo": (
            "Any 3 of (1 mark each):\n"
            "1. Low concentrations increase / stimulate / promote root length (the lower the concentration, the higher the root length up to a point);\n"
            "2. High concentrations decrease / inhibit root length (the higher the concentration, the lower the root length);\n"
            "3. 0.4 % concentration produces the longest root length (optimum/peak);"
        ),
        "rubric": "Award 1 mark per distinct point (max 3): low-concentration effect (stimulates), high-concentration effect (inhibits), AND identify the optimum (0.4 %). Must cite the 0.4 % value for the optimum mark. PENALISE 'concentration affects root length' (too vague); only describing one half of the curve.",
        "examiner_note": "Candidates familiar with the effect of auxin concentration on root growth could easily answer.",
        "explanation": "A typical 'hormone has both effects' curve. Describe in THREE parts:\n\n1. **Low concentrations stimulate**: as auxin increases from 0 → 0.4 %, average root length INCREASES (15.5 → 22.8 mm) — auxin promotes root growth at low concentrations.\n2. **Peak**: at **0.4 % auxin**, root length is at its MAXIMUM (~22.8 mm) — this is the optimum.\n3. **High concentrations inhibit**: above 0.4 %, root length DECREASES (down to 11.3 mm at 1.0 %) — too much auxin actually slows or stops root growth.\n\nAlways describe BOTH halves of an inverted-U curve, AND name the peak.",
    },
    {
        "q": "2(c)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Fig. 2.2 shows the root tip of a maize seedling. R and S mark the ends of a line across the tip.",
        "diagram": "root-tip",
        "prompt": "**(c)(i)** Measure the length of line **RS** on Fig. 2.2. Give your answer with units.",
        "accepted": [
            "15 mm", "16 mm", "17 mm",
            "15mm", "16mm", "17mm",
            "1.5 cm", "1.6 cm", "1.7 cm",
        ],
        "must_contain": ["mm"],
        "memo": "Any of: 15 mm / 16 mm / 17 mm (or 1.5 cm / 1.6 cm / 1.7 cm); [1 mark — unit required]",
        "examiner_note": "Perceived as a give-away but about half of candidates lost the mark. Many couldn't read the scale of a ruler in millimetres. Candidates must indicate the units used.",
        "explanation": "**How to measure correctly:**\n1. Line up your ruler so the '0' is exactly on point R\n2. Read where the ruler crosses point S\n3. Use **mm** (millimetres) unless the question says otherwise — they're the standard for biological drawings\n4. Always include the **unit** — '15' loses the mark, '15 mm' gets it\n\nThe accepted answer range is 15–17 mm because the image can be printed at slightly different sizes; examiners allow a small tolerance.",
    },
    {
        "q": "2(c)(ii)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": "Fig. 2.2 shows the root tip of a maize seedling. The actual length of the image along line RS is 280 μm.",
        "diagram": "root-tip",
        "prompt": "**(c)(ii)** Calculate the **magnification** of the root tip at RS. Show your working, including the formula used.",
        "memo": (
            "All 3 marks required:\n"
            "1. Unit conversion: 280 μm = 0.28 mm (or 15 mm = 15000 μm);\n"
            "2. Formula stated: magnification = size of image ÷ actual size;\n"
            "3. Correct calculation: e.g. 15 mm ÷ 0.28 mm = ×53.6 (or ×57.1 if measured 16 mm; ×60.7 if measured 17 mm);"
        ),
        "rubric": "Award 3 marks: (1) unit conversion so both values are in the same unit; (2) formula 'magnification = image size ÷ actual size' explicitly written; (3) correct calculation with multiplication sign (×) and NO units (magnification has no units). PENALISE: missing × sign; units (mm, cm) attached to magnification; wrong rounding.",
        "examiner_note": "Most recalled the formula but substituted wrongly. Common errors: missing × sign; units attached to magnification (×53.6 mm — WRONG); wrong rounding. Some candidates didn't convert units to the same scale before dividing — biggest single cause of lost marks.",
        "explanation": "**Three steps to a magnification calculation:**\n\n1. **Convert** both lengths to the SAME unit:\n   • 280 μm ÷ 1000 = **0.28 mm**\n   *(or 15 mm × 1000 = 15 000 μm)*\n\n2. **Formula**: \n   `magnification = image size ÷ actual size`\n\n3. **Calculation** (if you measured 15 mm):\n   • magnification = 15 mm ÷ 0.28 mm\n   • = **×53.6** (or ×57.1 for 16 mm; ×60.7 for 17 mm)\n\n**Crucial:** magnification has **NO UNITS** — write '×53.6', never '53.6 mm'. The × sign is REQUIRED.",
    },
    # ──────── Q3 (10 marks) ────────
    {
        "q": "3(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": "yeast-apparatus",
        "prompt": "**(a)(i)** Give a reason why all equipment is **sterilised** when setting up the apparatus.",
        "accepted": [
            "to kill respiring microorganisms",
            "kill microorganisms", "kill bacteria",
            "kill other microorganisms that respire", "to kill other organisms",
        ],
        "must_contain": ["kill"],
        "memo": "To kill (other) respiring microorganisms; [1 mark]",
        "examiner_note": "Many centres failed to introduce this investigation to the candidates — responses showed unfamiliarity with the apparatus.",
        "explanation": "Sterilising the equipment **kills other microorganisms** (bacteria, fungi, other yeasts) that might be on the glassware.\n\nIf you don't sterilise:\n• Other microbes also respire → produce CO₂ → confounds your results\n• You can't tell if the bubbles came from YOUR yeast or from contaminants\n\nSterilising removes the contaminants so any CO₂ produced is definitely from the yeast you added.",
    },
    {
        "q": "3(a)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": "yeast-apparatus",
        "prompt": "**(a)(ii)** Give a reason why the **5 g of glucose** is put in **warm water** in a test-tube and **shaken**.",
        "accepted": ["to dissolve glucose", "dissolve the glucose", "dissolve glucose", "make glucose solution"],
        "must_contain": ["dissolve"],
        "memo": "To dissolve the glucose; [1 mark]",
        "examiner_note": "Many centres failed to introduce this investigation to candidates.",
        "explanation": "**Warm water + shaking = faster dissolving.**\n\nGlucose dissolves in water, but slowly in cold water. Warm water + shaking gives:\n• Higher kinetic energy of water molecules → faster solute–solvent interaction\n• Shaking mixes the glucose with fresh water → prevents glucose settling at the bottom\n\nResult: glucose dissolves quickly into a clear solution that the yeast can use.",
    },
    {
        "q": "3(a)(iii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": "yeast-apparatus",
        "prompt": "**(a)(iii)** Give a reason why the glucose solution is **covered with a layer of oil**.",
        "accepted": [
            "to prevent any oxygen present in the air from dissolving in the sugar solution",
            "to prevent oxygen from dissolving in the solution",
            "to keep oxygen out of the glucose solution",
            "stops oxygen entering the solution", "prevent oxygen entering",
        ],
        "must_contain": ["oxygen"],
        "memo": "To prevent oxygen from the air dissolving in the sugar solution; [1 mark]",
        "examiner_note": "Many candidates didn't connect the oil layer to keeping oxygen out — they instead linked it to other roles (emulsification etc.).",
        "explanation": "**Oil floats on top of water** and forms a barrier.\n\nThe whole point of this experiment is **ANAEROBIC** respiration (NO oxygen). If oxygen from the air dissolves into the glucose solution:\n• Yeast would do AEROBIC respiration instead → different products (CO₂ + water + lots of ATP)\n• You'd get the wrong result — the experiment is invalid\n\nThe **oil layer prevents oxygen from dissolving** into the sugar solution → yeast is forced to respire anaerobically.",
    },
    {
        "q": "3(a)(iv)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM, "diagram": "yeast-apparatus",
        "prompt": "**(a)(iv)** Give a reason why the **rubber stopper** must be **sealed properly**.",
        "accepted": [
            "to prevent oxygen from entering",
            "to prevent oxygen entering the test-tube",
            "stop oxygen entering", "keep oxygen out",
            "prevents oxygen entry", "to stop air entering",
        ],
        "must_contain": ["oxygen"],
        "memo": "To prevent oxygen from entering (the test-tube); [1 mark]",
        "examiner_note": "Many centres failed to introduce this investigation to candidates.",
        "explanation": "Same logic as the oil layer — **keep oxygen out**.\n\nThe rubber stopper seals the top of the apparatus. If it's loose, air (containing oxygen) leaks in → yeast switches to aerobic respiration → experiment ruined.\n\nIt also ensures any gas the yeast produces (CO₂) **only escapes through the delivery tube into the lime water** — so you can detect it.",
    },
    {
        "q": "3(b)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM, "diagram": "yeast-apparatus",
        "prompt": "**(b)** After a few hours the **lime water turned milky**. Explain a conclusion for that observation.",
        "memo": (
            "Both required (1 mark each):\n"
            "1. Carbon dioxide is produced;\n"
            "2. During anaerobic respiration (by yeast);"
        ),
        "rubric": "Award 1 mark for naming CARBON DIOXIDE as the gas produced AND 1 mark for linking it to ANAEROBIC respiration in YEAST. PENALISE: emulsification (wrong — that's why oil is there, not lime water); aerobic respiration (the oil/seal prevents O₂).",
        "examiner_note": "Disappointing — candidates couldn't connect the observation to the investigation. Some linked lime water turning milky to emulsification (because of the oil layer).",
        "explanation": "**Lime water test for CO₂:**\n• Clear → milky white = **carbon dioxide is present**\n\nIn this apparatus:\n• Yeast is using glucose with NO oxygen (because of oil + seal)\n• So yeast does **ANAEROBIC respiration**: glucose → ethanol (alcohol) + **CO₂** + a little energy\n• The CO₂ produced bubbles through the delivery tube into the lime water → turns it milky\n\n**Conclusion: CO₂ is produced by yeast during anaerobic respiration.** Write BOTH halves.",
    },
    {
        "q": "3(c)", "marks": 4, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM, "diagram": "yeast-apparatus",
        "prompt": "**(c)** Describe how you would **investigate the effect of temperature** on the rate of anaerobic respiration in yeast, using similar apparatus to that in Fig. 3.1.",
        "memo": (
            "Any 4 of (1 mark each):\n"
            "1. Set up 2-3 identical apparatus as in Fig. 3.1;\n"
            "2. Use tap water instead of lime water (to count bubbles);\n"
            "3. Keep constants: same amount of water / glucose solution / yeast in each;\n"
            "4. Reference to using DIFFERENT TEMPERATURES (e.g. 10 °C, 30 °C, 50 °C);\n"
            "5. Reference to HOW different temperatures are obtained (water bath, ice bath, hot water);\n"
            "6. (Set a timer and) count the NUMBER OF BUBBLES produced in each apparatus in a fixed time (1–5 minutes);\n"
            "7. The apparatus producing the MOST bubbles indicates the best/optimum temperature for anaerobic respiration;"
        ),
        "rubric": "Award up to 4 marks. Required elements: (a) variable manipulation (different temperatures, ideally specified); (b) constants/controls (amount of yeast, glucose); (c) measurement (count bubbles per minute); (d) conclusion logic (most bubbles = best temperature). PENALISE: designing a DIFFERENT investigation; vague 'change the temperature' with no specifics; no method of measuring the dependent variable.",
        "examiner_note": "Most candidates found this question challenging. It was common for candidates to design their OWN investigation other than the one asked. Marks were awarded for: having different set-ups using the SAME apparatus, varying temperature, naming factors kept constant, stating how results are measured, and how to interpret them.",
        "explanation": "**A proper investigation plan for 4 marks** — write something like this:\n\n1. Set up **3 identical apparatus** as in Fig. 3.1 — but use **tap water (not lime water)** so I can COUNT BUBBLES easily.\n2. Use the **same** amount of yeast (e.g. 5 g), glucose solution (50 cm³), and oil layer in each.\n3. Place each tube in a different **water bath** at different temperatures: e.g. **10 °C, 30 °C, 50 °C** (use ice for cold, hot water for warm).\n4. Wait 5 minutes for the system to equilibrate, then **count the number of bubbles** produced in the next 5 minutes.\n5. The setup with the **MOST bubbles per minute** = the optimum temperature for anaerobic respiration in yeast.\n\nKey: identical apparatus, ONE variable (temperature) changed, controls listed, measurable dependent variable, clear conclusion logic.",
    },
    # ──────── Q4 (10 marks) ────────
    {
        "q": "4(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q4_STEM, "diagram": "apples-browning",
        "prompt": "**(a)(i)** Name the **substrate** in this investigation.",
        "accepted": ["phenol", "phenol compounds", "phenol (compounds in apple cells)"],
        "must_contain": ["phenol"],
        "memo": "Phenol (compounds in apple cells); [1 mark]",
        "examiner_note": "Well answered by the majority.",
        "explanation": "**Substrate** = the molecule the enzyme acts on.\n\nThe enzyme here is **polyphenol oxidase**. By name, it acts on **phenol** (or polyphenol) compounds in the apple. Phenol is the substrate that gets converted into the brown pigments.\n\nKey: identify the enzyme's name → it tells you the substrate.",
    },
    {
        "q": "4(a)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q4_STEM, "diagram": "apples-browning",
        "prompt": "**(a)(ii)** Give an explanation for the observed results in **test-tube 5** (where the apple extract was boiled — the contents stayed WHITE).",
        "memo": (
            "Both required (1 mark each):\n"
            "1. Enzymes are denatured / the active site of the enzyme changed shape (due to boiling);\n"
            "2. Could not break down phenol compounds (so no brown pigment formed);"
        ),
        "rubric": "Award 1 mark for naming DENATURATION (or 'active site changed shape') AND 1 mark for the consequence (enzyme can't break down phenol → no browning). PENALISE: 'enzymes were KILLED' or 'DESTROYED' (wrong words — denatured is correct).",
        "examiner_note": "Most common mistake: writing that enzymes were 'KILLED' or 'DESTROYED' instead of DENATURED.",
        "explanation": "**Why test-tube 5 stayed white:**\n\n1. The apple extract was **boiled** → very high temperature\n2. The high temperature **denatured** the enzyme (polyphenol oxidase) — its active site changed shape PERMANENTLY\n3. Denatured enzyme can NO LONGER bind to its substrate (phenol)\n4. Phenol is NOT broken down → NO brown pigment formed → tube stays WHITE\n\n⚠ Use the word **DENATURED** — examiners will not accept 'killed' or 'destroyed' (enzymes are not alive in the first place).",
    },
    {
        "q": "4(a)(iii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q4_STEM, "diagram": "apples-browning",
        "prompt": "**(a)(iii)** Suggest **one** way in which apples, once peeled, can be **prevented from turning brown**.",
        "accepted": [
            "add lemon juice", "put in lemon juice", "add lemon", "put lemon juice on the apple",
            "put in water", "soak in water", "submerge in water",
        ],
        "must_contain": [],
        "memo": "Add lemon juice / put in water; [1 mark — must include HOW to apply it]",
        "examiner_note": "Many candidates mentioned correct substances but lost the mark by writing 'use' instead of 'put in' or 'add'. The instruction must specify the action.",
        "explanation": "Two simple kitchen methods that prevent browning:\n\n• **Add lemon juice** — lemon juice is acidic (pH ~2). It denatures the polyphenol oxidase enzyme so it can't act on the phenol.\n• **Put the apples in water** — submerging the apple in water blocks oxygen from reaching the cut surface. The enzyme needs O₂ to do the browning reaction.\n\n⚠ Don't just say 'lemon juice' or 'water' — say what to DO with it: 'add', 'put in', 'soak in', 'apply'. Vague words lose the mark.",
    },
    {
        "q": "4(a)(iv)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q4_STEM, "diagram": "apples-browning",
        "prompt": "**(a)(iv)** Under which **pH conditions** does the enzyme work best?",
        "accepted": ["neutral", "neutral conditions", "neutral pH", "about pH 7", "pH 7", "around 7", "pH 7 (neutral)"],
        "must_contain": [],
        "memo": "Neutral conditions / about pH 7; [1 mark]",
        "examiner_note": "Well answered by the majority of candidates.",
        "explanation": "**Reading the table to find optimum pH:**\n\n• Tube 1 (no acid, no alkali → ~pH 7) → **dark brown** = MOST browning = enzyme working FASTEST\n• Tube 2 (acid) → white = enzyme inactive\n• Tube 3 (alkali) → light brown = enzyme partly working\n• Tube 4 (more acid) → white = enzyme dead\n\nThe more browning, the more active the enzyme. Tube 1 (no acid/alkali added → roughly neutral, pH 7) has the most browning → so **pH 7 / neutral** is the optimum.",
    },
    {
        "q": "4(b)", "marks": 5, "tier": "paid", "type": "free_text",
        "stem": "Potatoes and peppers are good sources of vitamin C.\n\nThe **DCPIP test** for vitamin C: DCPIP solution is BLUE. When vitamin C is added, the solution turns colourless. The MORE vitamin C present, the FEWER drops of food extract are needed to decolourise the DCPIP.",
        "diagram": None,
        "prompt": "**(b)** Describe how you will investigate which of these two food substances contains the **most vitamin C** using the DCPIP test.",
        "memo": (
            "Any 5 of (1 mark each):\n"
            "1. Crush the two food samples and make a solution / extract from each;\n"
            "2. Put the SAME amount of DCPIP solution in two separate containers / test-tubes;\n"
            "3. Add food solution DROP BY DROP into the DCPIP solution until the colour disappears (becomes colourless);\n"
            "4. Count the NUMBER OF DROPS of food solution needed for each;\n"
            "5. Compare the number of drops used between the two foods;\n"
            "6. Conclusion: LESS extract used → MORE vitamin C present (or reverse — more drops → less vitamin C);"
        ),
        "rubric": "Award up to 5 marks. Must include: (1) preparation of solutions from both foods; (2) equal DCPIP in two tubes; (3) drop-by-drop addition until colourless; (4) counting drops; (5) comparison + conclusion logic. PENALISE: using wrong reagent (iodine for starch, Biuret for protein, Benedict's for sugar); only saying 'DCPIP turns colourless' without method; no comparison.",
        "examiner_note": "Many candidates found this challenging. Marks for: having two set-ups; naming a constant (same DCPIP amount); stating measurement method; interpreting results. Many candidates ONLY scored 1 mark by just mentioning DCPIP changes blue to colourless. Some named the WRONG reagents (iodine, Biuret, barium sulfate, Benedict's) and described the WRONG positive results.",
        "explanation": "**A complete DCPIP comparison method for 5 marks** — write something like:\n\n1. **Prepare extracts**: crush a measured mass of potato (e.g. 10 g) with a known volume of water (e.g. 50 cm³). Repeat with peppers using the SAME mass and volume.\n2. **Set up two tubes**: pipette the SAME volume of DCPIP solution (e.g. 1 cm³) into two separate test-tubes — one for potato, one for pepper.\n3. **Titration**: using a dropping pipette, add the potato extract **DROP BY DROP** to the first DCPIP tube, **swirling after each drop**, until the BLUE colour just disappears.\n4. **Count drops**: record the number of drops used. Repeat with the pepper extract in the second tube — record drops used.\n5. **Compare and conclude**: the food needing **FEWER drops** to decolourise the DCPIP contains **more vitamin C** (because each drop has more vitamin C in it).\n\nKey: ONE variable (food type) changes, EVERYTHING ELSE stays the same. Measurable result (drops). Clear conclusion.",
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# Diagram extraction
# ─────────────────────────────────────────────────────────────────────────────

def _flatten_to_white(img: Image.Image) -> Image.Image:
    if img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        return bg
    return img.convert("RGB")


def extract_diagrams() -> None:
    PNG_DIR.mkdir(parents=True, exist_ok=True)
    for slug, (page_name, y_top, y_bot, x_left, x_right) in DIAGRAMS.items():
        page_path = PAGES_DIR / f"{page_name}.png"
        if not page_path.exists():
            print(f"  {slug}: missing page {page_path}")
            continue
        img = _flatten_to_white(Image.open(page_path))
        W, H = img.size
        crop = img.crop((int(W * x_left), int(H * y_top), int(W * x_right), int(H * y_bot)))
        out_path = PNG_DIR / f"{slug}.png"
        crop.save(out_path, optimize=True)
        print(f"  {slug:22s} {crop.size[0]}x{crop.size[1]}")


# ─────────────────────────────────────────────────────────────────────────────
# SQL emission
# ─────────────────────────────────────────────────────────────────────────────

def sql_escape(s: str | None) -> str:
    if s is None:
        return "null"
    s = s.replace("\\", "\\\\").replace("'", "''").replace("\n", "\\n")
    return f"E'{s}'"


def build_prompt(q: dict) -> str:
    stem = q.get("stem", "")
    return (stem + "\n\n" + q["prompt"]) if stem else q["prompt"]


def build_full_memo(q: dict) -> str:
    memo = q.get("memo", "")
    note = q.get("examiner_note", "")
    return memo + "\n\n**Examiner commentary:** " + note if note else memo


def build_correct_jsonb(q: dict) -> str:
    parts = ["'accepted', jsonb_build_array("]
    accepted_strs = ",\n        ".join(f"'{a.replace(chr(39), chr(39)*2)}'" for a in q.get("accepted", []))
    parts.append("      " + accepted_strs)
    parts.append("    )")
    mc = q.get("must_contain")
    if mc:
        mc_strs = ", ".join(f"'{m.replace(chr(39), chr(39)*2)}'" for m in mc)
        parts.append(f", 'must_contain', jsonb_build_array({mc_strs})")
    return "jsonb_build_object(\n      " + "\n".join(parts) + "\n    )"


def emit_sql() -> None:
    out = []
    out.append("-- " + "=" * 75)
    out.append(f"-- NSSCO Biology 2023 Paper 3 (6116/3) — Alt to Practical, 4 questions, {len(QUESTIONS)} sub-parts, 40 marks")
    out.append("-- Verbatim NIED wording from past-papers/nssco-biology/2023/")
    out.append("-- Expected answers + commentary from DNEA Examiners Report 2023 (pages 58-61)")
    out.append("-- Diagrams: public/past-papers/biology-nssco-2023-p3/*.png")
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
        mark_word = "mark" if q["marks"] == 1 else "marks"

        out.append(f"  -- ─── Q{q['q']}  [{q['marks']} {mark_word}, {q['tier']}, {q['type']}] ───")
        out.append("  insert into public.past_paper_questions (")
        out.append("    subject_id, paper_year, paper_no, q_number, marks, tier,")
        if q["type"] == "fill_in":
            out.append("    type, prompt, diagram_url, correct, case_sensitive,")
            out.append("    memo, explanation, is_published")
            out.append("  ) values (")
            out.append(f"    bio_id, 2023, '3', '{q['q']}', {q['marks']}, '{q['tier']}',")
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
            out.append(f"    bio_id, 2023, '3', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'free_text',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['rubric'])},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        out.append("")

    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} structured sub-parts for Biology NSSCO 2023 Paper 3';")
    out.append("end $$;")

    MIGRATION_PATH.parent.mkdir(parents=True, exist_ok=True)
    MIGRATION_PATH.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"\nWrote migration: {MIGRATION_PATH.relative_to(ROOT)}  ({len(QUESTIONS)} rows)")


if __name__ == "__main__":
    print(f"Extracting {len(DIAGRAMS)} diagrams:")
    extract_diagrams()
    emit_sql()
    total_marks = sum(q["marks"] for q in QUESTIONS)
    by_q: dict[str, int] = {}
    for q in QUESTIONS:
        main_q = q["q"].split("(")[0]
        by_q.setdefault(main_q, 0)
        by_q[main_q] += q["marks"]
    print(f"\nMarks per question: {by_q}")
    print(f"Total: {total_marks} marks across {len(QUESTIONS)} sub-parts")
