"""Build NSSCO Agricultural Science 2023 Paper 1 — 8 Section A + 4 Section B, 120 marks.

Verbatim NIED wording for prompts. Mark scheme + commentary from the DNEA
Examiners Report 2023 (Ag Science section, pages 35-43). No standalone memo
PDF exists for Ag Science — the Examiner Report's "Answer" blocks ARE the memo.

Question types used:
  fill_in     — short verbatim answers (auto-marked, accepted list + must_contain)
  calculation — numerical with working area (Q1(c), Q2(b)(ii), Q5(b))
  free_text   — short explanation / describe (AI-marked against memo)
  mcq         — multiple choice (Q3(d), Q4(e), Q5(a)(iii), Q6(b), Q8(a)(ii))
  drawing     — graph/diagram drawing (Q5(c)(i) labelling, Q9(a)(i) water cycle)
  essay       — Section B extended response (15-mark questions, choice of 2)
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2023-agric-p1"
PNG_DIR = ROOT / "public" / "past-papers" / "agriculture-nssco-2023-p1"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260525320000_agriculture_nssco_2023_p1.sql"

# (page_name, y_top, y_bot, x_left, x_right) — fractions of page
DIAGRAMS = {
    "q1-pot-plant":        ("page-02", 0.10, 0.42, 0.20, 0.78),
    "q1-rainfall-graph":   ("page-03", 0.34, 0.74, 0.06, 0.88),
    "q2-soil-pie":         ("page-04", 0.06, 0.36, 0.18, 0.82),
    "q4-weeds-ab":         ("page-07", 0.06, 0.42, 0.06, 0.88),
    "q4-weed-effects":     ("page-07", 0.50, 0.78, 0.06, 0.88),
    "q4-smut-maize":       ("page-08", 0.50, 0.78, 0.30, 0.72),
    "q5-lactating-cow":    ("page-09", 0.06, 0.34, 0.18, 0.78),
    "q5-calf-digestive":   ("page-10", 0.06, 0.34, 0.18, 0.78),
    "q6-anthrax-cow":      ("page-11", 0.06, 0.34, 0.06, 0.88),
    "q6-vaccinating-gun":  ("page-12", 0.06, 0.30, 0.30, 0.78),
    "q7-fencing-posts":    ("page-13", 0.06, 0.30, 0.32, 0.78),
    "q7-water-pump":       ("page-14", 0.06, 0.42, 0.20, 0.78),
    "q8-demand-curve":     ("page-15", 0.06, 0.34, 0.10, 0.78),
    "q8-farm-records":     ("page-16", 0.06, 0.38, 0.10, 0.88),
}


def durl(slug):
    return f"/past-papers/agriculture-nssco-2023-p1/{slug}.png" if slug else None


# ============================================================================
# STEMS — repeated verbatim across sub-parts of the same main question so the
# renderer's "show stem once" dedup works.
# ============================================================================
Q1_STEM = "Fig. 1.1 shows a pot plant. The plant has a **fruit labelled A** at the top, **leaves**, a **gravel layer** on the soil surface in the pot, and **roots labelled B** at the base."
Q2_STEM = "Fig. 2.1 shows the distribution of soil components in a poorly drained, **waterlogged soil**:\n• water — 45%\n• X — 40%\n• living organisms — 5%\n• organic matter — 5%\n• air — 5%"
Q3_STEM = "A crop plant was grown in a soil **recently flooded by the sea**, leaving the soil with a **high salt concentration**. As a result its leaves started drying up, eventually falling off."
Q4_STEM = "Fig. 4.1 shows two common weeds affecting crops in Namibia.\n• **A** = the thorn-apple (Datura) — a broad-leaved weed with spiny, prickly seed pods.\n• **B** = the black-jack (Bidens pilosa) — a smaller plant with slender leaves and yellow flower heads with hooked seeds.\n\nFig. 4.2 shows harmful effects of weeds on crops at positions **1** and **2**:\n• **1** = a taller, leafier weed standing next to a crop with sun shining on the weed.\n• **2** = a dense weed clump with extensive roots competing with the crop's roots underground."
Q5_STEM = "Fig. 5.1 shows a **lactating cow** with her **udder** labelled, suckling a calf."
Q6_STEM = "Fig. 6.1 shows a cow grazing from a contaminated pasture which then died. The diagram has three stages:\n1. A cow grazing in a pasture **infested with spores**.\n2. **Infection in the cow** (arrow showing the cow now infected).\n3. **Dead cow — blood coming from natural orifices** (openings — nose, mouth, anus)."
Q7_STEM = "Fig. 7.1 shows a method of treating **fencing posts** by standing bundles of wooden posts upright in a **drum containing a chemical**."
Q8_STEM = "Fig. 8.1 shows an **economic principle** in trading of wheat flour.\n• y-axis: price of wheat flour / NAD (0 to 350)\n• x-axis: quantity / kg for trade (0 to 35)\n• A downward-sloping line from (0, 300) through point **A** at (10 kg, NAD 200) and point **B** at (20 kg, NAD 100) down to (30 kg, NAD 0)."


# ============================================================================
# SECTION A — 8 questions, 90 marks
# Section B — 4 essays (any 2), 30 marks available out of 60
# Total available in DB rows: 150; learner attempts 120 (90 + 2×15)
# ============================================================================
QUESTIONS = [
    # ─── Q1 (14 marks): Pot plant, nutrients, frost, gravel, rainfall ─────────
    {"q": "1(a)(i)", "marks": 2, "tier": "free", "type": "fill_in",
     "stem": Q1_STEM, "diagram": "q1-pot-plant",
     "prompt": "**(a)(i)** Name the **macro nutrients** needed by the plant for the development of the parts labelled **A** (fruit) and **B** (roots).\n• A: ___\n• B: ___\n\nFormat: 'A potassium; B phosphorus'.",
     "accepted": [
         "A potassium; B phosphorus",
         "A potassium B phosphorus",
         "potassium, phosphorus",
         "A - potassium B - phosphorus",
         "potassium phosphorus",
         "A: potassium B: phosphorus",
     ],
     "must_contain": ["potassium", "phosphorus"],
     "memo": "A — Potassium; B — Phosphorus; [2 marks, 1 each]",
     "examiner_note": "Many candidates could not apply the knowledge learnt that potassium is mainly for fruit, flower and seed production while phosphorus is for root formation. Failure to read and understand the question resulted in some candidates not identifying the parts of the plant labelled A and B.",
     "explanation": "**The three main macro-nutrients (NPK) each have a primary role in plant growth:**\n\n• **N (Nitrogen)** → leaf growth, green colour (chlorophyll)\n• **P (Phosphorus)** → **ROOT** development, energy transfer, seedling vigour\n• **K (Potassium)** → **FRUIT**, flower, seed quality; disease resistance; water regulation\n\nMatching the parts in Fig. 1.1:\n• **A = fruit** → primary nutrient for fruit/flower/seed quality is **Potassium (K)**\n• **B = roots** → primary nutrient for root development is **Phosphorus (P)**\n\nMemory aid: 'P for Plumbing (roots), K for Kwality (fruit)'."},

    {"q": "1(a)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q1_STEM, "diagram": "q1-pot-plant",
     "prompt": "**(a)(ii)** Describe **two symptoms of nutrient deficiency** that may be shown by a leaf.",
     "memo": "Any 2 of (1 mark each):\n• yellow leaves / yellow foliage / chlorosis;\n• reduced growth / stunted growth / small leaves;",
     "rubric": "Award 1 mark per distinct symptom (max 2). PENALISE: 'yellow leaves' AND 'chlorosis' = ONE mark (they mean the same thing). PENALISE misspelling 'stunted' as 'student' or 'stunned'.",
     "examiner_note": "Many candidates could only score one mark as their responses were yellow leaves and chlorosis which means the same thing. The spelling of the word 'stunted' was a challenge. It was spelled as student/stunned which has a different meaning.",
     "explanation": "**Common visible signs of nutrient deficiency on leaves:**\n\n1. **Chlorosis (yellowing)** — loss of green colour because the plant can't make enough chlorophyll (often a nitrogen, magnesium or iron deficiency).\n2. **Stunted growth / small leaves** — leaves stay tiny because the plant lacks the building blocks (especially N and P) to make full-size cells and tissues.\n\nOther accepted variants: **purple/red tint** on undersides (phosphorus deficiency), **necrotic edges** (potassium deficiency), **leaf curl** (calcium deficiency).\n\nMark scheme rule: 'yellow leaves' and 'chlorosis' = **same point**. To get 2 marks, name **two DIFFERENT symptoms**."},

    {"q": "1(a)(iii)", "marks": 3, "tier": "paid", "type": "free_text",
     "stem": Q1_STEM, "diagram": "q1-pot-plant",
     "prompt": "**(a)(iii)** Explain how the plant in Fig. 1.1 can be affected **negatively** if the temperature drops **below 0 °C**.",
     "memo": "Any 3 of (1 mark each):\n• low temperature slows molecular movement / translocation;\n• enzymes become inactive / little or less metabolism;\n• water freezes to form crystals / frost;\n• these puncture / damage cell membranes / cells burst / plant dies;\n• less water available to plants / less transpiration stream;",
     "rubric": "Award 1 mark each for: slowed metabolism / enzyme deactivation / ice crystals forming / cell damage / reduced water uptake (max 3). PENALISE generic 'plant gets cold and dies' without mechanism.",
     "examiner_note": "Many candidates could not score three marks as their responses were mainly based on general effects of temperature on plant growth instead of placing emphasis on negative effects as asked in the question.",
     "explanation": "**Below 0 °C, several things go wrong inside the plant:**\n\n1. **Slowed metabolism** — biochemical reactions depend on molecular collisions. Lower T → slower molecule movement → photosynthesis, respiration, translocation all crawl.\n2. **Enzymes go inactive** — most plant enzymes work best around 20-30 °C. Near freezing they barely catalyse → no new sugars, no new proteins.\n3. **Water freezes inside cells** — ice crystals form INSIDE plant cells. Crystals are sharp; they **puncture the cell membrane** as they expand.\n4. **Cells burst** — once the membrane is broken, the cell contents spill out and the cell dies. Whole leaves/tissues collapse → 'frost damage'.\n5. **Water uptake stops** — frozen soil water can't be absorbed by roots; xylem may freeze too. The plant suffers a kind of drought stress.\n\nThree of these for 3 marks."},

    {"q": "1(a)(iv)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q1_STEM, "diagram": "q1-pot-plant",
     "prompt": "**(a)(iv)** Suggest **one advantage** AND **one disadvantage** of placing **gravel on the soil surface** in the plant pot.\n• advantage: ___\n• disadvantage: ___",
     "memo": "1 mark each:\n• Advantage — reduces evaporation / encourages good drainage;\n• Disadvantage — may harbour insects/pests / soil compacting / preventing the expansion of the stem / increases soil temperature during hot weather;",
     "rubric": "Award 1 mark for advantage (any genuine moisture/drainage benefit). Award 1 mark for disadvantage (heat, pests, compaction, stem expansion problems). PENALISE: 'looks nice' / 'prevents weeds' (not the asked-for analysis).",
     "examiner_note": "This question was poorly answered. The question was challenging as candidates could not apply their knowledge of mulching or to critically analyse the plant so they could come up with responses such soil compacting, preventing the expansions of the stem or increases soil temperature during hot weather etc.",
     "explanation": "**Gravel on the soil surface acts like a hard mulch — same logic, different material.**\n\n**Advantages:**\n• **Reduces evaporation** — covers the soil so water doesn't escape directly into the air\n• **Improves drainage** — stops the topsoil from caking; water flows through the gravel into the soil\n\n**Disadvantages:**\n• **Harbours insects/pests** — gaps between gravel give snails, slugs, ants and millipedes a place to hide\n• **Soil compaction** — heavy gravel layer presses down on the topsoil\n• **Restricts stem expansion** — if the stem can't push outward easily, growth is choked\n• **Heats up in the sun** — stones radiate heat; in hot weather the soil and stem base get scorched\n\nPick ONE of each for full marks."},

    {"q": "1(b)", "marks": 3, "tier": "paid", "type": "free_text",
     "stem": "Soil pH and irrigation.", "diagram": None,
     "prompt": "**(b)** Explain how **over-irrigation** could contribute to a **low pH** in a soil.",
     "memo": "All required (1 mark each, max 3):\n• water dissolves the mineral salts / nutrients;\n• washes them downward / leaching;\n• nutrients are replaced by hydrogen ions; which makes the soil acidic;",
     "rubric": "Award 1 mark for water dissolving cations. Award 1 mark for leaching (downward movement). Award 1 mark for H⁺ replacing the lost cations → acidity. PENALISE 'too much water makes it acidic' with no leaching mechanism.",
     "examiner_note": "The question was reasonably well answered.",
     "explanation": "**Low pH = acidic soil. Over-irrigation creates acidity by LEACHING out the alkaline cations.**\n\nStep by step:\n\n1. **Water dissolves mineral salts** — when irrigation water flows through the soil, it dissolves the basic cations (Ca²⁺, Mg²⁺, K⁺, Na⁺) that were attached to clay particles.\n\n2. **Leaching downward** — excess water carries these dissolved nutrients DOWN the profile, past the root zone, into the deeper layers (or out the bottom of the pot / field).\n\n3. **Hydrogen ions take their place** — the negatively-charged clay particles now adsorb **H⁺ ions** instead. More free H⁺ in the soil solution = **lower pH = more acidic**.\n\nResult: nutrient-poor, acidic soil. The opposite of the natural alkalising effect that calcium-rich rocks provide.\n\nThis is why farmers in high-rainfall (or over-irrigated) areas have to LIME their fields — to replace the leached calcium and raise pH back up."},

    {"q": "1(c)", "marks": 2, "tier": "paid", "type": "calculation",
     "stem": Q1_STEM + "\n\nFig. 1.2 shows a rainfall graph. Monthly rainfall readings (mm):\n• Jan ≈ 98\n• Feb ≈ 72\n• Mar ≈ 95\n• Apr ≈ 28\n• May–Sep ≈ 0–4\n• Oct ≈ 12\n• Nov ≈ 38\n• Dec ≈ 36",
     "diagram": "q1-rainfall-graph",
     "prompt": "**(c)** Calculate the **average rainfall** for the first **3 months** of the year (Jan + Feb + Mar). Show your working.",
     "correct": {"value": 88.3, "tolerance": 1.0, "unit": "mm", "accept_units": ["mm", "millimetres", "millimeters"]},
     "memo": "Working: (98 + 72 + 95) ÷ 3 = 265 ÷ 3 = **88.3 mm**;\n[2 marks: 1 for sum-divided-by-3 method, 1 for answer with unit (mm)]",
     "examiner_note": "It was more challenging to candidates to calculate the average rainfall as they could not correctly count the amount of rainfall each rectangle block on the Y-axis represents. Some candidates who manage to find an answer failed to indicate the unit.",
     "explanation": "**Average = sum of values ÷ number of values.**\n\nRead the bars for Jan, Feb, Mar from Fig. 1.2:\n• Jan ≈ **98 mm**\n• Feb ≈ **72 mm**\n• Mar ≈ **95 mm**\n\nAdd them:\n98 + 72 + 95 = **265 mm**\n\nDivide by 3:\n265 ÷ 3 = **88.3 mm** ✓\n\nUnit **mm** is essential — losing the unit loses a mark.\n\nReading the graph: each big square on the y-axis is 20 mm; the small grid lines are 4 mm. Be careful counting."},

    # ─── Q2 (12 marks): Drainage, soil components, pore spaces, organic matter ──
    {"q": "2(a)", "marks": 2, "tier": "free", "type": "fill_in",
     "stem": Q2_STEM, "diagram": "q2-soil-pie",
     "prompt": "**(a)** State **two methods** used to **drain a waterlogged soil**.",
     "accepted": [
         "pipe drain and ditches",
         "pipe drains, ditches",
         "by pipe drain by ditches",
         "pipe drain, ditches",
         "pipe drains and ditches",
         "ditches and pipe drains",
         "underground pipes and open ditches",
     ],
     "must_contain": ["pipe", "ditch"],
     "memo": "1 mark each (max 2):\n• by pipe drain (underground perforated pipes that carry water away);\n• by ditches (open channels dug across the field to collect run-off);",
     "examiner_note": "The question was reasonably well answered. However, 'ditches' was spelled as 'dishes' by some candidates.",
     "explanation": "**Two practical drainage systems used in agriculture:**\n\n1. **Pipe drains** — perforated pipes buried below the topsoil; excess soil water seeps into the pipes and is carried to a discharge point. Long-lasting, doesn't interfere with surface farming.\n\n2. **Ditches** — open channels (trenches) dug across the field to collect surface and shallow sub-surface water and channel it away. Cheap and easy to maintain but takes up land.\n\nOther accepted answers in this family: **mole drains** (made by dragging a torpedo-shaped tool through wet subsoil); **French drains** (gravel-filled trenches).\n\nSpell DITCHES carefully — 'dishes' doesn't score."},

    {"q": "2(b)(i)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": Q2_STEM, "diagram": "q2-soil-pie",
     "prompt": "**(b)(i)** Name the soil component labelled **X** (40% of the pie chart).",
     "accepted": [
         "mineral particles",
         "minerals",
         "inorganic matter",
         "mineral",
         "mineral matter",
         "inorganic particles",
     ],
     "must_contain": ["mineral"],
     "memo": "X — mineral particles / inorganic matter; [1 mark]",
     "examiner_note": "The question was fairly well answered, however, some candidates referred to mineral salts instead of mineral particles.",
     "explanation": "**Soil has four main components by volume:**\n\n1. **Mineral particles (inorganic matter)** — sand, silt and clay; weathered rock. Typical share ≈ 45% in a healthy mineral soil. ← **This is X**.\n2. **Water** — fills some of the pore spaces.\n3. **Air** — fills the rest of the pore spaces.\n4. **Organic matter & living organisms** — humus, roots, microbes, earthworms. Typically ≈ 5%.\n\nIn Fig. 2.1 the soil is waterlogged so water has taken almost all the space (45%) and air is squeezed down to 5%. The mineral particles (the **solid skeleton** of the soil) are still 40%.\n\nWatch the wording: **mineral PARTICLES** (the solid grains), not 'mineral SALTS' (the dissolved nutrients in soil water)."},

    {"q": "2(b)(ii)", "marks": 2, "tier": "paid", "type": "calculation",
     "stem": Q2_STEM, "diagram": "q2-soil-pie",
     "prompt": "**(b)(ii)** Work out the **percentage of pore spaces that is occupied by water**. (Hint: pore space = air + water. Both share the same physical gaps in the soil.)",
     "correct": {"value": 90, "tolerance": 0.5, "unit": "%", "accept_units": ["%", "percent", "percentage", ""]},
     "memo": "Working:\n• Total pore space = air % + water % = 5 + 45 = **50%**\n• Water as % of pore space = 45 ÷ 50 × 100 = **90%**;\n[2 marks: 1 for finding total pore space (50%), 1 for the final 90%]",
     "examiner_note": "Only very few candidates (approx. 0.4%) could answer this question. The majority of candidates failed to understand first that the volume of water and air are in direct relationship to one another because they share the same space. Therefore, for candidates to work out the percentage of pore spaces occupied by water it was required to first determine the total pore spaces covered by both air and water.",
     "explanation": "**Trap: pore space ≠ 100%.**\n\nPore spaces are the GAPS between solid mineral particles. They're filled with either water or air. So:\n\n**Pore space = water + air = 45% + 5% = 50% of the soil volume.**\n\nThe other 50% is solid (mineral particles 40% + organic matter 5% + living organisms 5%).\n\nNow find what fraction of the PORE SPACE is water:\n\n**(water % / total pore space %) × 100 = (45 / 50) × 100 = 90%** ✓\n\nSo in this waterlogged soil, 90% of the available pore space is taken up by water (and only 10% by air). That's why plant roots can't breathe — almost no air in the soil."},

    {"q": "2(b)(iii)", "marks": 4, "tier": "paid", "type": "free_text",
     "stem": Q2_STEM, "diagram": "q2-soil-pie",
     "prompt": "**(b)(iii)** Describe the **role of organic matter** in the soil.",
     "memo": "Any 4 of (1 mark each):\n• binds soil particles to produce a crumb structure;\n• major source of phosphorus and sulfur, and the sole source of nitrogen / provides nutrients to the soil / improves plant growth;\n• increases the amount of water the soil can hold;\n• improves drainage;\n• improves aeration;\n• main source of energy for all micro-organisms / enhances biochemical activities in the soil;",
     "rubric": "Award 1 mark per distinct role (max 4). PENALISE 'makes soil fertile' said twice or 'helps plants' without specifying.",
     "examiner_note": "This question was generally well answered as most learners could score three marks.",
     "explanation": "**Organic matter (humus + decomposing plant/animal remains) does many jobs:**\n\n1. **Binds particles into crumbs** — produces soil 'crumb structure': peds (clumps) with gaps between them. Better for roots than dust or solid clay.\n\n2. **Releases nutrients** — main source of soil **nitrogen** (no mineral source), and a major source of **P and S** when it decomposes.\n\n3. **Holds water** — humus is sponge-like; can hold 80–90% of its weight in water. Drought buffer.\n\n4. **Improves drainage** — better structure → water moves through cracks and channels, doesn't pond.\n\n5. **Improves aeration** — same crumb structure means more air spaces → roots and microbes can breathe.\n\n6. **Energy source for microbes** — soil bacteria, fungi, earthworms all feed on organic matter → biological activity = nutrient cycling.\n\nName any FOUR — these are independent roles, so each scores."},

    {"q": "2(b)(iv)", "marks": 3, "tier": "paid", "type": "free_text",
     "stem": Q2_STEM, "diagram": "q2-soil-pie",
     "prompt": "**(b)(iv)** Suggest how **plant growth** might be **affected** when grown in the soil indicated by Fig. 2.1 (waterlogged).",
     "memo": "Any 3 of (1 mark each):\n• reduced root respiration / poor aeration;\n• plant roots will rot / die;\n• stunted growth of roots / poor plant growth;",
     "rubric": "Award 1 mark per distinct effect (max 3) — must LINK to the waterlogged condition. PENALISE 'plant dies' without saying why; 'student growth' (misspelling) loses the mark.",
     "examiner_note": "Candidates could suggest the effects but they could not justify their responses based on the pie chart given e.g poor growth due to too much water in the soil. Some candidates referred to root rotting as 'root rooting', stunt growth as 'student growth' and they lost marks as those words have other meanings.",
     "explanation": "**Waterlogged soil has 90% of its pore space filled with water → only 10% air.** Roots need oxygen, and most plants suffer:\n\n1. **Poor root respiration** — roots can't get O₂ to release energy from sugars. Without ATP they can't actively absorb nutrients.\n\n2. **Root rot** — anaerobic conditions favour pathogenic fungi (e.g. *Phytophthora*, *Pythium*); roots die and rot from the bottom up.\n\n3. **Stunted growth** — short, weak root system → can't anchor or feed the plant → tops are small, yellow, wilted.\n\nOther knock-ons: anaerobic bacteria release toxic H₂S, methane; iron and manganese become toxic; nitrogen is lost to denitrification (N₂ gas).\n\nThree distinct effects = 3 marks. Spell carefully — 'rotting' (decay), not 'rooting' (growing roots)."},

    # ─── Q3 (12 marks): Salt damage, photosynthesis, translocation, asexual ───
    {"q": "3(a)", "marks": 3, "tier": "paid", "type": "free_text",
     "stem": Q3_STEM, "diagram": None,
     "prompt": "**(a)** Describe AND **explain** the processes that take place in the plant cells leading to the **drying of leaves**.",
     "memo": "Sequence required (1 mark each, max 3):\n1 water moves out of plant (root) cells;\n2 by osmosis;\n3 reference to plasmolysis;\n4 plant wilts;",
     "rubric": "Award up to 3 marks across these stages — must include water LOSS + OSMOSIS as the mechanism + a wilting/plasmolysis consequence. PENALISE 'plant loses water' without naming osmosis. PENALISE 'water moves out of plant' (missing CELL — the question is about CELLS).",
     "examiner_note": "This question was reasonably well answered. However, most candidates lost the third mark for referring to loss of water from the plant instead of from the plant cells.",
     "explanation": "**The salt outside the cells is more concentrated than the cytoplasm inside → water flows OUT of cells by osmosis.**\n\nStep by step:\n\n1. **Salty soil water has a low water potential** (lots of solute, little 'free' water).\n2. The plant **cell sap inside the vacuole** has a higher water potential (less solute).\n3. By **osmosis** (water moves from high → low water potential through a partially permeable membrane), water flows OUT of the cells INTO the soil.\n4. The vacuole shrinks; the cytoplasm pulls away from the cell wall → **plasmolysis**.\n5. Tissue loses turgor → leaves **wilt**, then dry out, then fall off.\n\nKey phrase to use: **'water leaves the plant CELLS by OSMOSIS'**. 'Water leaves the plant' loses the third mark — the question asks about CELLS specifically."},

    {"q": "3(b)(i)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q3_STEM, "diagram": None,
     "prompt": "**(b)(i)** Explain how a **reduced number of leaves** will affect **photosynthesis**.",
     "memo": "Both required (1 mark each):\n1. reduced / less chloroplasts / less light absorbed leads to reduced photosynthesis;\n2. less stomata / surface area leads to less CO₂ absorbed;",
     "rubric": "Award 1 mark for the LIGHT/CHLOROPLAST point and 1 mark for the CO₂/STOMATA point. PENALISE circular answers like 'fewer leaves means less photosynthesis' that just repeat the question.",
     "examiner_note": "Poorly answered as many candidates could not score a mark on the question. Candidates could not come up with explanations why the reduced number of leaves affect photosynthesis. Instead, they referred to reduced leaves reduce photosynthesis repeating the exact words in the question (reduce leaves).",
     "explanation": "**Don't just rewrite the question — explain WHICH PARTS of the leaf the plant has lost.**\n\nPhotosynthesis needs THREE inputs: light, CO₂, water. Fewer leaves means fewer of the structures that capture light and CO₂:\n\n1. **Fewer chloroplasts** — chloroplasts (containing chlorophyll) are found in leaf mesophyll cells. Fewer leaves → fewer chloroplasts → less LIGHT captured → less light energy to drive photosynthesis.\n\n2. **Fewer stomata / less leaf surface** — stomata (the tiny pores on the lower epidermis) let CO₂ INTO the leaf. Less leaf area → fewer stomata → less CO₂ available → photosynthesis rate falls.\n\nWater isn't the bottleneck here (xylem still works) — light and CO₂ are."},

    {"q": "3(b)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q3_STEM, "diagram": None,
     "prompt": "**(b)(ii)** Discuss the **importance of photosynthesis** to plants.",
     "memo": "Any 2 of (1 mark each):\n• provides oxygen (needed for respiration);\n• produces carbohydrates / food to build plant cell structure / enable plant growth;\n• primary source of energy;",
     "rubric": "Award 1 mark per distinct benefit to the plant. PENALISE answers about feeding animals/humans — the question asks importance TO PLANTS.",
     "examiner_note": "Moderately well answered as the majority of candidates could only score one mark for enabling plant to produce their food. Some candidates also failed to read the question fully as they referred to plant providing food for the animals.",
     "explanation": "**Photosynthesis to the plant itself (not animals or humans):**\n\n1. **Provides oxygen** for the plant's own respiration (the O₂ in your bloodstream came from a plant once — but plants use their own O₂ first).\n\n2. **Produces carbohydrates (glucose, sucrose, starch)** that are:\n   - Burned for energy in respiration\n   - Used as raw materials to build cellulose cell walls, proteins, oils, etc.\n   - Stored in seeds, tubers, roots for later growth\n\n3. **Primary energy source** — the original capture of sunlight energy into chemical bonds. Without photosynthesis the plant has no energy currency.\n\nTrap: don't write 'plants make food for animals/humans' — the question asks importance **to plants**, not to consumers."},

    {"q": "3(c)(i)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q3_STEM, "diagram": None,
     "prompt": "**(c)(i)** Define **translocation**.",
     "memo": "Both required (1 mark each):\n• translocation is the movement of dissolved food materials made in the leaves;\n• to other parts of the plant / from source to sink;",
     "rubric": "Award 1 mark for 'movement of dissolved food/sugars'. Award 1 mark for 'from leaves/source to other parts/sink'. PENALISE definitions of transpiration (water UP the xylem) — that's the opposite.",
     "examiner_note": "Fairly well answered as most candidates could only score one mark for the movement of synthesised food but failed to state that it is from source to sink.",
     "explanation": "**Translocation = the movement of dissolved sugars (food) through the PHLOEM** of a plant, **from the source** (where it's made — the leaves doing photosynthesis) **to the sink** (where it's used or stored — roots, fruits, growing tips, seeds).\n\nKey words for full marks:\n• **Dissolved food materials** (sucrose mostly, also amino acids)\n• **Made in the leaves**\n• **To other parts** / **source to sink**\n\nDon't confuse with TRANSPIRATION (water LOSS via stomata, water moves UP the xylem) — translocation is the opposite direction (food moves DOWN the phloem, but also up to fruits)."},

    {"q": "3(c)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q3_STEM, "diagram": None,
     "prompt": "**(c)(ii)** Describe the modification of **one plant part into a food storage organ** AND name the **type of food material** it stores.",
     "memo": "Both required (1 mark each):\n• leaves modified into bulb / roots modified into swollen storage roots / stems modified into tubers;\n• stores carbohydrates / starch;",
     "rubric": "Award 1 mark for naming a specific modification (BULB / TUBER / STORAGE ROOT — must say which organ is modified). Award 1 mark for naming carbohydrate/starch as the stored food. PENALISE just 'roots store food' without modification, or 'plants store water' (water is not food).",
     "examiner_note": "Fairly well answered as most candidates scored one mark for stating the correct type of food material stored but they all failed to describe the modification of plant part into food storage.",
     "explanation": "**Plants store food by modifying specific organs into swollen storage structures:**\n\n• **Leaves → bulb** — onion, garlic. Fleshy modified leaves wrapped around a short stem.\n• **Roots → storage roots** — carrot, sweet potato, beetroot, cassava. Swollen taproots packed with starch.\n• **Stems → tubers** — Irish potato (potato is a stem tuber, not a root). Underground stems with 'eyes' (buds).\n• **Stems → corms** — taro, gladiolus. Short, solid vertical stems.\n• **Stems → rhizomes** — ginger, turmeric. Horizontal underground stems.\n\n**Food material stored:** **carbohydrates** — usually **starch** (the polymer the plant builds from glucose). Some store oils or proteins, but starch is the typical NSSCO answer.\n\nFor 2 marks: name ONE modification + say it stores STARCH (or carbohydrate)."},

    {"q": "3(d)", "marks": 1, "tier": "free", "type": "mcq",
     "stem": Q3_STEM, "diagram": None,
     "prompt": "**(d)** Which crop reproduces **asexually**?",
     "options": [
         {"id": "a", "text": "bean"},
         {"id": "b", "text": "maize"},
         {"id": "c", "text": "sorghum"},
         {"id": "d", "text": "Irish potato"},
     ],
     "correct": "d",
     "memo": "**D — Irish potato** [1 mark]. Well answered. Irish potato reproduces vegetatively from tubers (each 'eye' grows into a new plant — genetic clone of the parent).",
     "examiner_note": "Well answered as candidates correctly identified Irish potato as a crop that can produce asexually.",
     "explanation": "**Asexual (vegetative) reproduction = new plant from a piece of the parent, NOT from a seed.** Genetics are identical to the parent (clones).\n\n• **A — Bean** ✗ — reproduces by SEED (sexual, in pods after flowering)\n• **B — Maize** ✗ — reproduces by SEED (cobs of grain after wind pollination)\n• **C — Sorghum** ✗ — reproduces by SEED\n• **D — Irish potato** ✓ — reproduces by **TUBER** (each piece with an eye grows into a clone of the parent plant)\n\nOther crops that reproduce asexually: sweet potato (stem cuttings), sugarcane (stem cuttings), cassava (stem cuttings), banana (suckers), strawberry (runners), ginger (rhizome pieces)."},

    # ─── Q4 (13 marks): Weeds A & B, harmful effects, control, IPM, smut ────
    {"q": "4(a)(i)", "marks": 2, "tier": "free", "type": "fill_in",
     "stem": Q4_STEM, "diagram": "q4-weeds-ab",
     "prompt": "**(a)(i)** Identify weeds **A** and **B** in Fig. 4.1.\n• A = ___ (a spiny-pod weed; Datura)\n• B = ___ (a small weed with hooked seeds; Bidens)\n\nFormat: 'A thorn apple; B black jack'.",
     "accepted": [
         "A thorn apple; B black jack",
         "A thorn apple B black jack",
         "thorn apple, black jack",
         "thorn apple black jack",
         "A - thorn apple B - black jack",
         "A: thorn apple B: black jack",
     ],
     "must_contain": ["thorn apple", "black jack"],
     "memo": "A — Thorn apple; B — Black jack; [2 marks, 1 each]",
     "examiner_note": "Most candidates could not identify the weeds A and B. A few candidates also lost a mark for identifying weed A as 'Apple thorn' and not as 'Thorn apple'.",
     "explanation": "**Two of the most common broad-leaved weeds in Namibian crop fields:**\n\n• **A — Thorn apple** (*Datura stramonium*) — large jagged leaves; egg-shaped seed pods covered in **spines** (the 'thorn'); white/purple trumpet flowers. Highly poisonous if eaten.\n\n• **B — Black jack** (*Bidens pilosa*) — slender leaflets; small yellow daisy-like flowers; seeds with **two hooks** that stick to clothes and animal fur (= 'jack' = the hook).\n\nOrder matters: **Thorn apple**, NOT 'Apple thorn'. The first word describes the seed pod ('thorny like an apple')."},

    {"q": "4(a)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": Q4_STEM, "diagram": "q4-weeds-ab",
     "prompt": "**(a)(ii)** Suggest the **mode of spread** of weed **B** (black jack).",
     "accepted": [
         "hook on animals",
         "blown by wind",
         "hook on animal fur",
         "stick on animals",
         "attaches to animals",
         "hook on animals or wind",
         "hooked seeds stick to animals",
         "carried by animals",
         "sticks to clothes and animals",
     ],
     "must_contain": [],
     "memo": "Either: hook on animal(s) OR blown by wind; [1 mark]",
     "examiner_note": "This question was well answered as only a few candidates failed to score a mark as they referred to wind pollination and not that it is spread by wind.",
     "explanation": "**Black jack seeds have two tiny hooks (barbs) at the tip** — perfect adaptation for spread:\n\n• **Hook onto animals** (cattle, dogs, sheep, even human clothing) — the animal walks away with seeds attached, drops them somewhere new → seed germinates in fresh ground.\n• **Wind dispersal** — the small, dry seeds can also be carried short distances by wind.\n\nMain answer expected: **'hook onto animal fur'** (the diagnostic feature).\n\nTrap: don't say 'wind pollination' — pollination is about FERTILISING flowers; here we're talking about SEED DISPERSAL after fertilisation."},

    {"q": "4(b)", "marks": 2, "tier": "free", "type": "fill_in",
     "stem": Q4_STEM, "diagram": "q4-weed-effects",
     "prompt": "**(b)** Which **harmful effects** of weeds are illustrated in Fig. 4.2 at **1** and at **2**?\n• 1 (the weed is taller, blocking sun from the crop): ___\n• 2 (extensive weed roots tangled with crop roots): ___\n\nFormat: '1 competition for light; 2 competition for nutrients'.",
     "accepted": [
         "1 competition for light; 2 competition for nutrients",
         "1 light 2 nutrients",
         "1 competition for light 2 competition for water",
         "1 sunlight 2 nutrients",
         "1 light 2 water nutrients space",
         "competition for light, competition for nutrients",
         "1 competition for sunlight; 2 competition for water",
     ],
     "must_contain": ["light"],
     "memo": "1 — competition for light; 2 — competition for nutrients / water / space; [2 marks, 1 each]",
     "examiner_note": "The question was well answered. A few candidates who lost marks referred to the effects of weeds on crops in general without making reference to the effects shown in Fig. 4.2 at 1 and 2. It should be noted that only competition for sunlight was accepted at 1, while competition for water, nutrients and space was accepted at 2.",
     "explanation": "**Fig. 4.2 shows above-ground vs below-ground competition:**\n\n• **1 — above ground:** weed is **taller** than the crop and SHADES it. The crop gets less sunlight → less photosynthesis. **Competition for LIGHT/sunlight**.\n\n• **2 — below ground:** weed's roots are **dense and extensive**, sharing the same soil zone as the crop's roots. They steal water, dissolved mineral nutrients, and physical space. **Competition for NUTRIENTS / WATER / SPACE**.\n\nKey: match the answer to the FIGURE. Above-ground (1) = light; below-ground (2) = nutrients/water/space. Mixing them up loses marks."},

    {"q": "4(c)", "marks": 4, "tier": "paid", "type": "free_text",
     "stem": "Methods of weed control.", "diagram": None,
     "prompt": "**(c)** Describe how **weeds are controlled** using:\n• **biological control**: ___\n• **chemical control**: ___",
     "memo": "All 4 marks (2 per method):\n• Biological — using living organism(s); to feed on the weeds;\n• Chemical — using herbicides; to spray and kill the weeds;",
     "rubric": "Award 2 marks for biological (living organism + 'feeds on weeds'). Award 2 marks for chemical (herbicide + 'sprays and kills'). PENALISE 'pesticides' for weeds (should be herbicides); 'organisms control pests' instead of weeds; vague 'living organisms control weeds' without naming a mechanism.",
     "examiner_note": "The question was fairly well answered. However, most candidates did not read the question fully as reference to living organisms feeding on the pest was common among those who failed to score marks, when the question was clearly referring to biological WEED control and not pests. Other vague answers such as use of living organisms to control weeds cost candidates a mark as this did not specify how living organisms would control the weeds. The same error was made with chemical control where candidates referred to the use of pesticides instead of herbicides and to control pests instead of killing weeds.",
     "explanation": "**Two distinct approaches with different agents:**\n\n**Biological control (living organism vs weed):**\n• Use insects, fungi, snails, or grazing animals that **FEED ON** the target weed.\n• Example: cochineal scale insect introduced to control prickly pear cactus; weevils eating water hyacinth; goats grazing invasive bush.\n• Long-term, no chemicals needed.\n\n**Chemical control (herbicide vs weed):**\n• **Spray herbicides** that kill the weeds.\n• Selective herbicides (e.g. 2,4-D) kill broad-leaved weeds in a grass crop without harming the crop.\n• Non-selective (e.g. glyphosate) kill everything green — used before planting.\n• Fast-acting, but expensive and pollutes if overused.\n\nSpelling: HERBICIDES (kill plants/weeds), not PESTICIDES (broader term that includes insecticides, fungicides, herbicides)."},

    {"q": "4(d)", "marks": 3, "tier": "paid", "type": "free_text",
     "stem": "Integrated Pest Management (IPM).", "diagram": None,
     "prompt": "**(d)** Describe what is meant by **Integrated Pest Management (IPM)**.",
     "memo": "All 3 required (1 mark each):\n• IPM is an ecosystem-based strategy / environmentally friendly strategy;\n• which aimed at (long-term) prevention of pests;\n• through a combination of techniques;",
     "rubric": "Award 3 marks for: ecosystem-based/environmentally friendly + long-term pest prevention + combination of techniques. PENALISE 'just being environmentally friendly' as the only point — must include 'combination of techniques'.",
     "examiner_note": "Poorly answered. Most candidates have no knowledge on Integrated Pest Management. An answer like being environmentally friendly alone without mentioning 'a combination of techniques/pest controlling methods' was not sufficient enough to earn candidates any marks.",
     "explanation": "**IPM = a holistic pest-management strategy that uses MULTIPLE methods together.**\n\nThree pillars of the definition (each worth a mark):\n\n1. **Ecosystem-based / environmentally friendly** — works WITH natural systems; minimises chemical use; protects pollinators and beneficial insects.\n\n2. **Long-term prevention of pests** — not just spraying when pests appear, but **preventing** their build-up year-round (rotation, resistant varieties, monitoring, hygiene).\n\n3. **Combination of techniques** — cultural (rotation, ploughing), biological (natural enemies), mechanical (traps, weeding), chemical (LAST RESORT, targeted, low-dose) — all working together.\n\nIPM is the official approach taught in NSSCO Ag. Don't reduce it to 'no chemicals' — chemicals ARE used in IPM, just sparingly and as the last option."},

    {"q": "4(e)", "marks": 1, "tier": "free", "type": "mcq",
     "stem": "Fig. 4.3 shows a diseased maize cob: **fruiting bodies inside swollen maize grains** (large dark fungal masses bursting out of the kernels).",
     "diagram": "q4-smut-maize",
     "prompt": "**(e)** Which **type of disease** is shown in Fig. 4.3?",
     "options": [
         {"id": "a", "text": "blight"},
         {"id": "b", "text": "wilt"},
         {"id": "c", "text": "smut"},
         {"id": "d", "text": "streak"},
     ],
     "correct": "c",
     "memo": "**C — Smut** [1 mark]. Well answered. Smut diseases produce dark, dusty fungal spore masses inside swollen plant tissues (especially grains, cobs, tassels).",
     "examiner_note": "Well answered as most candidates could correctly identify smut as a type of disease shown in Fig. 4.3.",
     "explanation": "**Four fungal/viral diseases — match symptoms to diagnosis:**\n\n• **A — Blight** ✗ — rapid yellowing/browning of leaves and stems (e.g. potato blight, late blight). Affects WHOLE plants, not just grains.\n• **B — Wilt** ✗ — plant droops because xylem is blocked. Affects vascular system, not visible as masses in grain.\n• **C — Smut** ✓ — **fungal disease** that produces **dark, dusty spore masses** inside swollen plant organs — typically GRAINS, cobs, tassels. Classic 'corn smut' looks exactly like Fig. 4.3.\n• **D — Streak** ✗ — viral disease causing yellow streaks ALONG leaf veins (maize streak virus). No grain swelling.\n\nClue word in the question: **'fruiting bodies inside swollen maize grains'** = SMUT."},

    # ─── Q5 (14 marks): Lactation, water, calf digestive (drawing!) ────────
    {"q": "5(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": Q5_STEM, "diagram": "q5-lactating-cow",
     "prompt": "**(a)(i)** State what is meant by **lactation**.",
     "accepted": [
         "period of milk production",
         "milk production",
         "production of milk by a cow",
         "the period of milk production in animals",
         "process of producing milk",
         "the production of milk",
         "milk secretion",
     ],
     "must_contain": ["milk"],
     "memo": "Lactation is a period of milk production (in animals); [1 mark]",
     "examiner_note": "Fairly answered, however some candidates referred to the cow breast feeding the calf.",
     "explanation": "**Lactation** = the **period during which a female mammal produces milk** in her mammary glands, after giving birth.\n\nIt starts at calving (or near it — sometimes colostrum starts a few days before) and lasts as long as the cow is being milked or suckled (typically 10 months in dairy cattle, then 'dried off' for 2 months before the next calf).\n\nDon't confuse with:\n• **Gestation** — the pregnancy period (about 9 months in cows)\n• **Suckling / nursing** — the calf DRINKING the milk (different event)\n\nKey words: **'period of MILK PRODUCTION'** in the cow."},

    {"q": "5(a)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q5_STEM + "\n\nThe cow produces **colostrum** immediately after birth.", "diagram": "q5-lactating-cow",
     "prompt": "**(a)(ii)** Explain the **role of colostrum** to the calf.",
     "memo": "Any 2 of (1 mark each):\n• contains antibodies; which protect the calf from diseases;\n• contains protein; for growth;",
     "rubric": "Award 1 mark each for: antibody/disease-protection point AND protein/growth point. PENALISE generic 'milk for the calf' without naming antibodies or protein.",
     "examiner_note": "Fairly well answered. Most candidates could score one mark but failed to provide explanations.",
     "explanation": "**Colostrum = the YELLOWISH first milk a cow produces, in the first 24-72 hours after calving.** It's chemically different from normal milk and crucial for the newborn calf:\n\n1. **Antibodies (immunoglobulins, especially IgG)** — the calf is BORN with no immunity. Colostrum is its only source of antibodies (it can't get them across the placenta in cattle). These antibodies protect against the diseases the mother has been exposed to → calf survives its first weeks.\n\n2. **High protein** — much more concentrated than ordinary milk. Builds tissues, muscle, bone in the rapidly-growing newborn.\n\n3. **Vitamins** — especially Vitamin A and minerals.\n\n4. **Laxative effect** — helps the calf pass its first stool (meconium).\n\nKey: name **antibodies** AND **protein** — two distinct nutritional/immunological roles, two marks."},

    {"q": "5(a)(iii)", "marks": 1, "tier": "free", "type": "mcq",
     "stem": Q5_STEM, "diagram": "q5-lactating-cow",
     "prompt": "**(a)(iii)** Which **hormone** is responsible for the **enlargement of the udder** in Fig. 5.1?",
     "options": [
         {"id": "a", "text": "follicle stimulating hormone"},
         {"id": "b", "text": "luteinising hormone"},
         {"id": "c", "text": "oestrogen"},
         {"id": "d", "text": "progesterone"},
     ],
     "correct": "d",
     "memo": "**D — Progesterone** [1 mark]. Most candidates correctly stated progesterone as the hormone responsible for the enlarging udder of a cow.",
     "examiner_note": "Most candidates could correctly state progesterone as the hormone responsible for the enlarging udder of a cow in Fig. 5.1.",
     "explanation": "**Hormones in the female reproductive/lactation cycle:**\n\n• **A — FSH (follicle stimulating hormone)** ✗ — triggers egg development in the ovary; not involved in udder growth.\n• **B — LH (luteinising hormone)** ✗ — triggers ovulation (release of the egg); not udder growth.\n• **C — Oestrogen** ✗ — drives ducts in udder tissue and oestrus (heat); important but NOT the main udder-enlargement signal during pregnancy.\n• **D — Progesterone** ✓ — secreted in large amounts by the corpus luteum (and later the placenta) during PREGNANCY. **Progesterone drives the growth of milk-producing tissue (alveoli) in the udder**, preparing it for lactation.\n\nAt birth, progesterone drops sharply → prolactin takes over and milk PRODUCTION starts. But the SIZE of the udder developed under progesterone's influence."},

    {"q": "5(a)(iv)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q5_STEM, "diagram": "q5-lactating-cow",
     "prompt": "**(a)(iv)** Explain why a cow should be fed a **production ration**.",
     "memo": "Both required (1 mark each):\n• high protein levels;\n• to increase milk production;",
     "rubric": "Award 1 mark for PROTEIN (or specifically high protein). Award 1 mark for the PURPOSE (increase milk production). PENALISE 'to produce more products' (too vague — must say MILK specifically).",
     "examiner_note": "Most candidates referred to a cow producing more products instead of being specific to producing more milk. Most candidates lack knowledge that a production ration of a cow has a higher level of protein.",
     "explanation": "**Two types of rations are taught at NSSCO:**\n\n• **Maintenance ration** — just enough food to keep the cow ALIVE and healthy at her current weight; for non-producing animals (dry cows, growing heifers).\n\n• **Production ration** — **EXTRA feed ON TOP of maintenance**, designed for animals that are producing milk, growing, or fattening for slaughter. It has:\n  - **HIGH PROTEIN levels** (e.g. 16–20% crude protein for a high-yielding dairy cow)\n  - More energy (carbs/fats)\n  - More minerals (Ca, P) — milk drains the cow's calcium\n\nWhy give it to a lactating cow? **Milk is mostly protein, fat, lactose and water.** To make 30 litres of milk per day, the cow needs the building blocks IN her diet. High-protein production ration = **more milk produced**.\n\nFor full marks: **high protein** + **increase milk production** (not just 'more products')."},

    {"q": "5(b)", "marks": 2, "tier": "paid", "type": "calculation",
     "stem": "A dairy cow feeding on dry grass requires **5 dm³ of water per 50 kg** of her live weight.",
     "diagram": None,
     "prompt": "**(b)** Work out the **daily water requirement** of a cow weighing **1320 kg**. Show your working.",
     "correct": {"value": 132, "tolerance": 1, "unit": "dm³", "accept_units": ["dm3", "dm³", "dm^3", "litres", "liters", "L", "l"]},
     "memo": "Working:\n5 dm³ : 50 kg = x dm³ : 1320 kg\nx = (5 × 1320) ÷ 50\n= 6600 ÷ 50\n= **132 dm³**;\n(Or: 1320 ÷ 50 = 26.4 × 5 = 132 dm³);\n[2 marks: 1 for showing the working, 1 for the final answer 132 dm³]",
     "examiner_note": "Well answered, however, some candidates did not show their working. They only gave the final answer of 132 dm³ and they lost the first mark.",
     "explanation": "**Direct proportion (ratio) problem:**\n\n5 dm³ of water for every 50 kg of cow → how much for 1320 kg?\n\n**Method 1 — set up the ratio:**\n5 dm³ / 50 kg = x / 1320 kg\nx = (5 × 1320) / 50\nx = 6600 / 50\nx = **132 dm³** ✓\n\n**Method 2 — find the multiplier:**\n1320 / 50 = 26.4 (the cow is 26.4 'units' of 50 kg)\nWater = 26.4 × 5 = **132 dm³** ✓\n\nUnit: **dm³** (1 dm³ = 1 litre).\n\n**Show your working** — even with the correct answer, no working = lose a mark."},

    {"q": "5(c)(i)", "marks": 3, "tier": "paid", "type": "drawing",
     "stem": Q5_STEM + "\n\nFig. 5.2 shows the **digestive system of a calf** — an unlabelled diagram of: oesophagus, four-chambered stomach (rumen, reticulum, omasum, abomasum), small intestine, large intestine, and an attached liver/pancreas.",
     "diagram": "q5-calf-digestive",
     "prompt": "**(c)(i)** Use **label lines** to label the following parts on Fig. 5.2:\n• omasum\n• pancreas\n• small intestine\n\n(Sketch on paper and describe in words below, or upload a photo of your labelled diagram.)",
     "memo": "All 3 marks:\n1. **omasum** — the third stomach chamber; the SMALL, ROUND chamber between reticulum and abomasum (has many leaves of tissue inside);\n2. **pancreas** — the elongated gland sitting BESIDE the small intestine (near the duodenum), separate from the stomach chambers;\n3. **small intestine** — the LONG, COILED tube AFTER the abomasum, leading to the large intestine; [1 mark per correctly placed label]",
     "rubric": "Award 1 mark per correctly identified part. The omasum is commonly confused with abomasum. The pancreas is commonly confused with the gall bladder. PENALISE 'rumen' or 'reticulum' labelled as omasum.",
     "examiner_note": "Fairly well answered. The gall bladder was commonly labelled as pancreas, and rumen or abomasum as omasum.",
     "explanation": "**Calf digestive system landmarks (in feed order):**\n\n1. **Mouth → oesophagus** (food pipe down the neck)\n2. **RUMEN** — the BIG first chamber (left side of the abdomen). In adult cattle it's huge (50% of gut volume).\n3. **RETICULUM** — the 'honeycomb', small chamber in front of the rumen.\n4. **OMASUM** ← *label this* — round, small, packed with leaves (book/manyplies). Squeezes water out of food.\n5. **ABOMASUM** — the 'true stomach', secretes acid and enzymes.\n6. **SMALL INTESTINE** ← *label this* — long coiled tube where most digestion finishes and nutrients are absorbed.\n7. **LARGE INTESTINE** — water absorption, faeces formed.\n\nOff to the side:\n• **PANCREAS** ← *label this* — pale elongated gland next to the duodenum (start of small intestine); secretes pancreatic juice into the gut and insulin into the blood.\n• **LIVER** — large red-brown organ near the diaphragm; produces bile.\n• **GALL BLADDER** — small green sac attached to the liver; stores bile.\n\nCommon trap: candidates label the gall bladder as pancreas. The pancreas sits ALONGSIDE the small intestine, NOT attached to the liver."},

    {"q": "5(c)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q5_STEM, "diagram": "q5-calf-digestive",
     "prompt": "**(c)(ii)** Describe the **role of the liver** in the digestive system.",
     "memo": "Any 2 of (1 mark each):\n• produces bile;\n• that emulsifies fats;\n• neutralises acidic content in the chyme / food;\n• has antitoxin effects / removes toxins / neutralises toxins;",
     "rubric": "Award 1 mark per distinct liver function in digestion (max 2). PENALISE 'liver stores bile' (the GALL BLADDER stores bile; the LIVER PRODUCES it). PENALISE 'liver secretes pancreatic juice' (the pancreas does that).",
     "examiner_note": "Poorly answered as most candidates lost a mark for referring to liver storing or containing bile instead of producing bile. Liver secreting pancreatic juice was a common answer and the incorrect spelling of 'emulsifies' was common among responses.",
     "explanation": "**Liver = the body's chemistry lab. Roles in digestion:**\n\n1. **Produces bile** — the liver MAKES bile (the gall bladder just STORES it between meals).\n2. **Bile emulsifies fats** — breaks large fat globules into tiny droplets so lipase enzymes can attack them more efficiently. Without bile, fats can't be digested.\n3. **Neutralises stomach acid** — bile is alkaline; it neutralises the acidic chyme leaving the abomasum, protecting the small intestine and creating the right pH for pancreatic enzymes.\n4. **Detoxifies** — breaks down poisons (alcohol, toxins, drugs) absorbed from the gut.\n5. **Stores glycogen and vitamins** (A, D, B12).\n\nKey distinctions:\n• LIVER produces bile. GALL BLADDER stores it. (Don't swap.)\n• LIVER detoxifies. PANCREAS secretes digestive enzymes. (Don't swap.)\n• Spell **EMULSIFIES** carefully."},

    {"q": "5(c)(iii)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": Q5_STEM, "diagram": "q5-calf-digestive",
     "prompt": "**(c)(iii)** Suggest why **calves up to one week old cannot digest grass or hay**.",
     "accepted": [
         "rumen not yet fully developed",
         "rumen not fully developed",
         "no bacteria to digest cellulose",
         "rumen is not fully developed",
         "rumen is not developed yet",
         "rumen not developed",
         "calf has no rumen bacteria",
         "no cellulose-digesting bacteria",
     ],
     "must_contain": ["rumen"],
     "memo": "Either: rumen not yet fully developed OR the calf has no bacteria to digest cellulose; [1 mark]",
     "examiner_note": "Poorly answered as most candidates could not score a mark on this question. They referred to the digestive system of the calf being weak instead of not yet fully developed.",
     "explanation": "**Newborn calves are functionally MONOGASTRIC — only the abomasum (true stomach) is working.**\n\n• The rumen, reticulum and omasum are present but **TINY and UNDEVELOPED** in a one-week-old calf — they only enlarge as the calf starts nibbling solid feed.\n• The rumen doesn't yet contain its population of **cellulose-digesting bacteria and protozoa**.\n• So grass/hay (which is mostly **cellulose**) passes through undigested — only milk (which is liquid and bypasses the rumen via the oesophageal groove) can be processed.\n\nBy 6–8 weeks the rumen has been colonised by microbes and grown big enough; the calf becomes a true ruminant.\n\nKey: **rumen not yet fully developed** OR **no rumen bacteria/microbes to digest cellulose**."},

    # ─── Q6 (9 marks): Anthrax, vaccinating gun, genetics terms ────────────
    {"q": "6(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": Q6_STEM, "diagram": "q6-anthrax-cow",
     "prompt": "**(a)(i)** Name the **disease** that caused the death of the cow in Fig. 6.1.",
     "accepted": ["anthrax", "Anthrax", "anthrax disease"],
     "must_contain": ["anthrax"],
     "memo": "Anthrax; [1 mark]",
     "examiner_note": "Some candidates wrongly identified the diseases as foot and mouth. The incorrect spelling of Anthrax was common.",
     "explanation": "**Anthrax** = a deadly bacterial disease caused by ***Bacillus anthracis***.\n\nKey clues in Fig. 6.1 — diagnostic of anthrax:\n• **Spores in pasture** — anthrax spores survive in soil for DECADES; cattle pick them up while grazing.\n• **Sudden death** with **blood from natural orifices** (mouth, nose, ears, anus) — classic anthrax symptom. Blood doesn't clot.\n• Highly contagious; can spread to humans (zoonotic).\n\nDon't confuse with:\n• **Foot-and-mouth** — viral, causes blisters on feet and mouth; rarely fatal in adults.\n• **Black-leg** — bacterial, swollen muscle, no bleeding from orifices.\n\nSpell **A-N-T-H-R-A-X** (not 'antrax' or 'anthrak')."},

    {"q": "6(a)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q6_STEM, "diagram": "q6-anthrax-cow",
     "prompt": "**(a)(ii)** Describe **two symptoms** of the disease mentioned in (a)(i) **OTHER than that shown in Fig. 6.1** (i.e. not bleeding from natural orifices).",
     "memo": "Any 2 of (1 mark each):\n• high temperature / fever;\n• trembling;\n• difficulty in breathing;\n• convulsions;",
     "rubric": "Award 1 mark each (max 2). PENALISE answers that just repeat 'blood from nose/mouth' — the question explicitly excludes that. PENALISE general 'cow gets sick'.",
     "examiner_note": "Most candidates failed to study the information provided to them in the stem and in Fig. 6.1. As a result, they referred to symptoms that are already provided in Fig. 6.1 such as blood from nose and ears, while the question clearly required candidates to state other symptoms not shown.",
     "explanation": "**Anthrax symptoms NOT shown in Fig. 6.1:**\n\n1. **High temperature / fever** — body temp shoots up to 41–42 °C (normal cow ≈ 38.5 °C). The animal looks miserable, isolated.\n2. **Trembling / muscle tremors** — uncontrolled shivering, especially during the toxin's peak.\n3. **Difficulty breathing (dyspnoea)** — toxins damage the lungs and tissues; respiration is fast and laboured.\n4. **Convulsions** — seizures in the terminal stage; the animal collapses, kicks, then dies.\n5. **Sudden death** — often before any symptoms are noticed (peracute form).\n\nName any TWO that are NOT 'blood from natural orifices' (which the figure shows)."},

    {"q": "6(a)(iii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q6_STEM, "diagram": "q6-anthrax-cow",
     "prompt": "**(a)(iii)** Suggest how the **dead cow** in Fig. 6.1 should be **safely disposed**.",
     "memo": "Any 2 of (1 mark each):\n• carcass must be completely burned at the place where it died (if possible);\n• it should be buried deep down;\n• farmer / veterinary personnel should wear protective gear when handling the carcass;",
     "rubric": "Award 1 mark for BURN or DEEP BURY at the death site. Award 1 mark for protective gear (PPE — gloves AND mask, not just one). PENALISE generic 'remove the cow' or 'sell the meat'.",
     "examiner_note": "Most candidates could only score one mark for stating that the dead cow should be burned. Some candidates lost mark for specifying only one PPE e.g wearing gloves/mask. Anthrax is a highly contagious disease, therefore, wearing gloves alone will not protect a person handling such carcass.",
     "explanation": "**Anthrax spores survive in soil for decades** — disposal must DESTROY them, not just hide the carcass.\n\n**Correct disposal:**\n\n1. **BURN the carcass at the place of death** — high heat kills the spores. Don't move the body (moving it spreads contamination).\n\n2. **Bury DEEP** (at least 2 m) and cover with quicklime/disinfectant if burning isn't possible. Deep burial prevents scavengers digging it up.\n\n3. **Wear PROTECTIVE GEAR** — gloves AND face mask AND coveralls. Anthrax is **zoonotic** (transmits to humans through skin contact, inhalation, ingestion). One PPE item alone isn't enough.\n\n4. **DO NOT** open the carcass, butcher it, or eat the meat — opening lets spores escape into the soil/air.\n\nReport to the veterinary services immediately."},

    {"q": "6(b)", "marks": 1, "tier": "free", "type": "mcq",
     "stem": "Fig. 6.2 shows a **tool** used in the prevention of animal diseases: a hand-held metal instrument with a sharp needle at the front, a piston/plunger handle, a built-in chemical reservoir, and a calibrated dial — essentially a gun-shaped injector for delivering vaccine doses.",
     "diagram": "q6-vaccinating-gun",
     "prompt": "**(b)** Which **tool** is shown in Fig. 6.2?",
     "options": [
         {"id": "a", "text": "dosing gun"},
         {"id": "b", "text": "needle"},
         {"id": "c", "text": "syringe"},
         {"id": "d", "text": "vaccinating gun"},
     ],
     "correct": "d",
     "memo": "**D — Vaccinating gun** [1 mark]. Candidates could correctly identify the vaccinating gun as a tool used in preventing animal diseases.",
     "examiner_note": "Candidates could correctly identify the vaccinating gun as a tool used in preventing animal diseases.",
     "explanation": "**Veterinary injection tools — match shape to purpose:**\n\n• **A — Dosing gun** ✗ — used to give LIQUID DRUUGS BY MOUTH (oral). Has a curved nozzle, no needle. For deworming etc.\n• **B — Needle** ✗ — just the tip; needs a separate syringe.\n• **C — Syringe** ✗ — small disposable plastic body with a single dose, used by hand. Not gun-shaped.\n• **D — Vaccinating gun** ✓ — heavy-duty injector with built-in reservoir for **multiple doses**, a calibrated dial to set the dose volume, and a needle at the front. The PISTOL-GRIP design lets a farmer vaccinate a whole herd quickly. **Used to PREVENT diseases by injecting vaccines.**\n\nKey clue: the question says 'used in **PREVENTION** of animal diseases' → vaccines → vaccinating gun."},

    {"q": "6(c)", "marks": 3, "tier": "paid", "type": "fill_in",
     "stem": "Genetics terms: gene, heterozygous, dominant, homozygous, chromosome, genotype.",
     "diagram": None,
     "prompt": "**(c)** Choose the **correct term** from this list (each may be used once or not at all): gene, heterozygous, dominant, homozygous, chromosome, genotype.\n\nWrite it below the phrase that describes it:\n1. A pair of the same alleles controlling a single characteristic → ___\n2. Thread-like protein strands found in the nucleus of a cell that carries the genes → ___\n3. Hereditary unit that determines the characteristics of an organism → ___\n\nFormat: '1 homozygous; 2 chromosome; 3 gene'.",
     "accepted": [
         "1 homozygous; 2 chromosome; 3 gene",
         "1 homozygous 2 chromosome 3 gene",
         "homozygous, chromosome, gene",
         "homozygous chromosome gene",
         "1 - homozygous 2 - chromosome 3 - gene",
         "homozygous; chromosomes; gene",
         "1 homozygous 2 chromosomes 3 gene",
     ],
     "must_contain": ["homozygous", "chromosome", "gene"],
     "memo": "1 — homozygous;\n2 — chromosome(s);\n3 — gene;\n[3 marks, 1 each]",
     "examiner_note": "Most candidates could score two marks for gene and chromosome described by phrases 2 and 3.",
     "explanation": "**Six genetics terms — match to definitions:**\n\n1. **'A pair of the SAME alleles controlling a single characteristic'** → **HOMOZYGOUS** (homo = same).\n   - Opposite: heterozygous (different alleles).\n\n2. **'Thread-like protein strands found in the nucleus that carries the genes'** → **CHROMOSOME** (chrom = colour; soma = body). DNA wound around histone proteins.\n\n3. **'Hereditary unit that determines the characteristics of an organism'** → **GENE**. A specific stretch of DNA on a chromosome that codes for one trait.\n\nUnused terms in this question:\n• **Dominant** — allele expressed when paired with a recessive one.\n• **Genotype** — the genetic make-up (e.g. TT, Tt, tt).\n• **Heterozygous** — different alleles (e.g. Tt)."},

    # ─── Q7 (8 marks): Fencing posts, water pump ────────────────────────────
    {"q": "7(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": Q7_STEM, "diagram": "q7-fencing-posts",
     "prompt": "**(a)(i)** Identify the **type of fencing posts** in Fig. 7.1.",
     "accepted": ["wooden posts", "wooden", "wood posts", "wooden poles", "wood", "timber posts", "treated wooden posts"],
     "must_contain": ["wood"],
     "memo": "Wooden posts; [1 mark]",
     "examiner_note": "Well answered. However, some candidates referred to treated posts/droppers without indicating that these posts are made of wood which was the critical aspect required.",
     "explanation": "**Fig. 7.1 shows a bundle of wooden posts** standing upright in a drum of chemical preservative.\n\nThe key word is **WOOD** — wooden posts ROT, get eaten by termites, and need treatment. Metal/concrete posts don't have this problem (and aren't treated this way).\n\nDon't just say 'treated posts' or 'droppers' — say what MATERIAL they are: WOODEN POSTS."},

    {"q": "7(a)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": Q7_STEM, "diagram": "q7-fencing-posts",
     "prompt": "**(a)(ii)** Name the **chemical** used in the drum.",
     "accepted": ["creosote", "Creosote", "creosote oil"],
     "must_contain": ["creosote"],
     "memo": "Creosote; [1 mark]",
     "examiner_note": "Well answered. However, the incorrect spelling of the chemical 'creosote' was common.",
     "explanation": "**Creosote** = a thick, brown, oily wood preservative distilled from coal tar (or sometimes wood tar).\n\nProperties that make it ideal for treating fence posts:\n• **Penetrates deep** into the wood grain\n• **Toxic to fungi, insects and termites** — kills the organisms that would rot the wood\n• **Water-repellent** — keeps the post dry inside, preventing rot\n• **Cheap** and lasts 20+ years\n\nTo use: stand the bottom 30-60 cm of the post in a drum of creosote for a few days (capillary action draws the chemical up into the grain). The treated section is the part that will be buried in soil.\n\nSpelling: **C-R-E-O-S-O-T-E**."},

    {"q": "7(a)(iii)", "marks": 3, "tier": "paid", "type": "free_text",
     "stem": Q7_STEM, "diagram": "q7-fencing-posts",
     "prompt": "**(a)(iii)** Explain the **need for treating the fencing posts** as shown in Fig. 7.1.",
     "memo": "Any 3 of (1 mark each):\n• to prevent wooden posts from rotting;\n• to increase their durability (last longer);\n• to prevent termite damage;",
     "rubric": "Award 1 mark each for: prevent rot, increase durability/last longer, prevent termite/insect damage (max 3). PENALISE 'make them stronger' (treatment doesn't strengthen; it preserves).",
     "examiner_note": "Candidates who lost marks either misspelled rotting as 'rooting' or gave responses such as 'make the posts stronger' instead of 'last longer/durable'. Quite a number of candidates also described HOW wooden posts are treated instead of giving REASONS why they are treated.",
     "explanation": "**Three reasons to treat fence posts with creosote (or similar):**\n\n1. **Prevent ROTTING** — fungi attack untreated wood, especially below ground where it's moist. Creosote kills the fungi → no rot → post stays solid.\n\n2. **Increase DURABILITY** — treated posts last 20-30 years; untreated posts rot through in 2-5 years. Saves the farmer huge replacement costs.\n\n3. **Prevent TERMITE/insect damage** — termites in southern African soils destroy untreated wood fast. Creosote is highly toxic to them.\n\nSpelling watch:\n• **ROTTING** = decay (correct).\n• 'ROOTING' = growing roots (wrong word, loses mark)."},

    {"q": "7(b)(i)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": "Fig. 7.2 shows a **water pump** with these parts: a curved hand lever at top, a pump rod going down, a piston in a cylinder, a piston valve and a foot valve, an outlet spout on one side, and a rising main going down into the ground (the suction lift section).",
     "diagram": "q7-water-pump",
     "prompt": "**(b)(i)** Name the **type of water pump** shown in Fig. 7.2.",
     "accepted": ["hand pump", "Hand pump", "hand-pump", "manual pump"],
     "must_contain": ["hand"],
     "memo": "Hand pump; [1 mark]",
     "examiner_note": "The majority of candidates correctly named the hand pump.",
     "explanation": "**Fig. 7.2 is a classic HAND PUMP** — operated by a person pumping a lever up and down (no electricity needed).\n\nVisual clues in the diagram:\n• **Curved hand lever** at top — for human operation\n• **Pump rod** connecting lever to piston\n• **Cylinder with piston** — the pumping chamber\n• **Piston valve** and **foot valve** — one-way valves that direct water flow\n• **Suction lift** section — distance the pump can suck water up (max ≈ 7 m)\n\nVariants: reciprocating hand pump, India Mark II, Afridev. All work on the same principle: the user provides the energy."},

    {"q": "7(b)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": "Fig. 7.2 shows a water pump with a **pump rod** and a **foot valve**.",
     "diagram": "q7-water-pump",
     "prompt": "**(b)(ii)** Give the **functions** of:\n• **pump rod**: ___\n• **foot valve**: ___",
     "memo": "Both required (1 mark each):\n• pump rod — to lift the piston to allow water to enter the cylinder (on a downward stroke);\n• foot valve — to prevent the back flow of water;",
     "rubric": "Award 1 mark for pump rod (must say it MOVES THE PISTON, not just 'helps pump'). Award 1 mark for foot valve (PREVENT BACK FLOW). PENALISE 'pump rod pumps water' (circular).",
     "examiner_note": "The first part of the question was a challenge. Most candidates could only give general answers such as 'to pump water' instead of lifting the piston for water to enter the cylinder. The second part of the question was well answered.",
     "explanation": "**Hand-pump mechanics — what each part does:**\n\n**Pump rod:**\n• A steel/wooden rod connecting the hand lever (above) to the piston (below).\n• When the lever is pushed DOWN, the rod LIFTS THE PISTON UP.\n• When the piston rises, it creates a vacuum below it → water from the rising main is sucked UP through the foot valve INTO the cylinder.\n• When the lever is lifted, the piston falls; water trapped above the piston goes out the outlet.\n\nSo the pump rod's function is to **transfer the lever's motion to the piston** → fills the cylinder with water each stroke.\n\n**Foot valve:**\n• A one-way valve at the BOTTOM of the cylinder (where the rising main joins).\n• Lets water flow UP into the cylinder when the piston rises (suction).\n• **Prevents BACK FLOW** of water down into the well/borehole when the piston falls. Without it, every stroke would just push water back down.\n\nSo the foot valve keeps the cylinder PRIMED — water doesn't drain back."},

    # ─── Q8 (8 marks): Demand, MCQ, A & B, farm records, budget ─────────────
    {"q": "8(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": Q8_STEM, "diagram": "q8-demand-curve",
     "prompt": "**(a)(i)** Name the **economic principle** illustrated in Fig. 8.1 (a downward-sloping price-vs-quantity curve).",
     "accepted": [
         "principle of demand",
         "law of demand",
         "demand",
         "the law of demand",
         "demand curve",
         "principle of demand and supply",
     ],
     "must_contain": ["demand"],
     "memo": "Principle of demand (law of demand); [1 mark]",
     "examiner_note": "Fairly well answered. However, some candidates referred to the law of demand and supply or law of diminishing return.",
     "explanation": "**Law of demand** = a fundamental economic principle:\n\n> **As the PRICE of a good rises, the QUANTITY DEMANDED falls** (assuming everything else stays the same).\n\nGraphically: a **downward-sloping demand curve** in the price-vs-quantity plane (exactly Fig. 8.1).\n\nWhy:\n• Buyers can afford less at higher prices.\n• Buyers substitute cheaper alternatives.\n• Buyers feel each extra unit is worth less (diminishing marginal utility).\n\nDon't confuse with:\n• **Law of supply** (UPWARD-sloping curve — sellers willing to sell MORE at higher prices)\n• **Law of demand AND supply** (the equilibrium where the two curves meet)\n• **Law of diminishing returns** (totally different — about adding more input to fixed land)"},

    {"q": "8(a)(ii)", "marks": 1, "tier": "free", "type": "mcq",
     "stem": Q8_STEM, "diagram": "q8-demand-curve",
     "prompt": "**(a)(ii)** Use Fig. 8.1 to determine the **quantity of wheat flour** when the price is **NAD 250.00**.",
     "options": [
         {"id": "a", "text": "200 kg"},
         {"id": "b", "text": "100 kg"},
         {"id": "c", "text": "10 kg"},
         {"id": "d", "text": "5 kg"},
     ],
     "correct": "d",
     "memo": "**D — 5 kg** [1 mark]. Read along the line from price = 250 NAD on the y-axis to the curve, then DOWN to the x-axis: meets at about 5 kg.",
     "examiner_note": "Well answered as most candidates could correctly determine the quantity when the price of wheat was NAD 250.00.",
     "explanation": "**Read the graph carefully.**\n\nThe demand line goes from (0, 300) at the top-left to (30, 0) at the bottom-right. Two named points on the line:\n• **A** = (10 kg, 200 NAD)\n• **B** = (20 kg, 100 NAD)\n\nQuestion: at price 250 NAD, what's the quantity?\n\nFrom (0, 300) to (10, 200) — i.e. between A and the y-intercept — the line crosses 250 NAD when quantity ≈ 5 kg.\n\n• A (200 kg) ✗ — way off the graph (max is 30 kg)\n• B (100 kg) ✗ — also off the graph\n• C (10 kg) ✗ — that's where point A is (price 200)\n• D (5 kg) ✓ — correct!\n\nUsing the line equation: P = 300 - 10×Q, set P = 250 → Q = 5 kg."},

    {"q": "8(a)(iii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q8_STEM, "diagram": "q8-demand-curve",
     "prompt": "**(a)(iii)** Explain the **economic principle** in Fig. 8.1 with reference to **A** (10 kg @ 200 NAD) and **B** (20 kg @ 100 NAD) on the diagram.\n• A: ___\n• B: ___",
     "memo": "Both required (1 mark each):\n• A — the higher the price of wheat flour, the lower the quantity of flour demanded;\n• B — the lower the price of wheat flour, the higher the quantity of flour demanded;",
     "rubric": "Award 1 mark for A (HIGH price → LOW quantity). Award 1 mark for B (LOW price → HIGH quantity). PENALISE answers that don't link price and quantity together; or that get the relationship backwards.",
     "examiner_note": "Poorly answered. The question required the candidate to apply the law of demand to the graph while making reference to point A and B. This proved to be difficult at their level as they do not understand how price and demand are negatively related.",
     "explanation": "**The law of demand applied to A and B:**\n\n• **Point A: high price (NAD 200), low quantity (10 kg)** — when wheat flour is expensive, fewer buyers want to (or can afford to) buy it. **HIGH price → LOW demand.**\n\n• **Point B: low price (NAD 100), high quantity (20 kg)** — when wheat flour is cheap, more buyers want it. **LOW price → HIGH demand.**\n\nThe two points show the same law from opposite directions — price and quantity demanded are **INVERSELY (negatively) related**.\n\nUse comparative language: 'the HIGHER the price... the LOWER the quantity demanded' (for A); 'the LOWER the price... the HIGHER the quantity demanded' (for B)."},

    {"q": "8(b)", "marks": 2, "tier": "paid", "type": "fill_in",
     "stem": "Fig. 8.2 shows two farm records:\n• **W**: Assets (Cash N\\$ 5 000; Account receivable N\\$ 4 500; Tools & equipment N\\$ 1 000) vs Liabilities (Account payable N\\$ 8 000). A balance-sheet style table.\n• **X**: A crop record card showing Crop, Year, Spacing, Seed rate, Date planted, Date harvested, Yield.",
     "diagram": "q8-farm-records",
     "prompt": "**(b)** Identify the **types of farm records** labelled **W** and **X** in Fig. 8.2.\n• W = ___\n• X = ___\n\nFormat: 'W financial record; X production record'.",
     "accepted": [
         "W financial record; X production record",
         "W financial; X production",
         "financial record, production record",
         "W - financial record X - production record",
         "financial record production record",
         "W: financial record X: production record",
     ],
     "must_contain": ["financial", "production"],
     "memo": "W — financial record; X — production record; [2 marks, 1 each]",
     "examiner_note": "Fairly well answered, as few candidates do not understand what financial and production record entails. They identified record W as cash record and record X as crop year record just copying what they were seeing on Fig. 8.2.",
     "explanation": "**Farm records come in several main categories — match the content:**\n\n• **W** — shows **assets and liabilities in money** (NAD). That's a **FINANCIAL RECORD** — specifically a balance sheet / statement of financial position. Tracks the business's overall money position.\n\n• **X** — shows **crop, spacing, seed rate, dates, yield** — all the inputs and outputs for growing a specific crop. That's a **PRODUCTION RECORD** — tracks what was planted, when, how, and what came out.\n\nOther record types (not in this question):\n• **Livestock records** — births, deaths, weights, vaccinations\n• **Inventory records** — stock of seeds, feed, tools\n• **Labour records** — workers, hours, wages\n• **Sales/marketing records** — what was sold, to whom, for how much"},

    {"q": "8(c)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": "Budgeting in farm management.", "diagram": None,
     "prompt": "**(c)** Discuss the **purpose of preparing a budget** for a farming enterprise.",
     "memo": "Any 2 of (1 mark each):\n• to plan ahead;\n• to estimate the yield and income;\n• to control the flow of money in the enterprise / guide the farmer on spending;",
     "rubric": "Award 1 mark per distinct PURPOSE of budgeting (max 2). PENALISE answers about RECORD KEEPING — the question is about BUDGETING (forward-looking).",
     "examiner_note": "Poorly answered as a result of misinterpretation of the question. Most candidates referred to the importance of record keeping instead of budgeting.",
     "explanation": "**A budget = a FORWARD-LOOKING financial plan for the farm.** Records track what already happened; budgets predict what will happen next.\n\nPurposes:\n\n1. **Plan ahead** — work out what to plant, what to spend, what to expect before the season starts.\n2. **Estimate yield and income** — project how much will be harvested and how much it will sell for → check if the enterprise is worth doing.\n3. **Control cash flow** — set spending limits per category (seed, fertiliser, labour, fuel) so the farmer doesn't run out of cash mid-season. Compare actual to budget month by month.\n4. **Secure loans** — banks ask for a budget before lending.\n5. **Evaluate alternatives** — compare two crops or two enterprises on paper, pick the more profitable.\n\nKey distinction: BUDGETING ≠ RECORD KEEPING. Records look BACK, budgets look FORWARD."},

    # ============================================================================
    # SECTION B — 4 essays (any 2), 15 marks each
    # ============================================================================

    # ─── Q9 (15): Water cycle, deforestation, rural ag, conservancies vs WC ──
    {"q": "9(a)(i)", "marks": 5, "tier": "paid", "type": "drawing",
     "stem": "SECTION B Q9 — The water cycle.", "diagram": None,
     "prompt": "**Q9 (a)(i)** Using **clear labels and illustrations**, describe the **process of the water cycle**. [5]\n\n(Sketch on paper and describe in words below, or upload a photo of your labelled diagram.)",
     "memo": "The following processes should be correctly and clearly illustrated on the diagram (any 5, 1 mark each):\n• evaporation;\n• transpiration;\n• condensation;\n• precipitation / rainfall;\n• infiltration / drainage;\n• water run-off;\n• water source / river / sea / ocean;\n• respiration;",
     "rubric": "Award up to 5 marks for clearly LABELLED processes shown on the diagram (with arrows indicating direction). PENALISE missing arrows showing direction of flow.",
     "examiner_note": "The question was reasonably well answered. Most candidates could clearly draw and label the water cycle. However, a few candidates lost marks for failing to use arrows to show the processes.",
     "explanation": "**Draw a landscape with: ocean/river at the bottom; mountains; clouds; plants/trees on land. Add 5+ labelled arrows for the processes:**\n\n1. **EVAPORATION** — arrow UP from sea/river/lake. Sun heats surface water → water vapour rises.\n\n2. **TRANSPIRATION** — arrow UP from plant leaves. Water inside the plant escapes through stomata as vapour.\n\n3. **CONDENSATION** — at cloud height, vapour cools and turns back to tiny water droplets → forms clouds.\n\n4. **PRECIPITATION** — arrow DOWN from cloud (rain, snow, hail). Water falls back to surface.\n\n5. **INFILTRATION** — arrow INTO ground. Rainwater soaks down into soil, recharges groundwater.\n\n6. **SURFACE RUN-OFF** — arrow ACROSS land back to river/sea. Water flowing on the surface.\n\n7. **WATER SOURCE** — the river/ocean at the start of the cycle.\n\n8. **RESPIRATION** — animals and plants also release water vapour when they breathe (small contribution).\n\nKey: ARROWS show direction. Without arrows, examiners can't see the cycle, and you lose marks even if labels are right."},

    {"q": "9(a)(ii)", "marks": 2, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q9 — Effect of deforestation on the water cycle.", "diagram": None,
     "prompt": "**Q9 (a)(ii)** Explain how the **cutting down of trees** may affect the **water cycle**. [2]",
     "memo": "Any 2 of (1 mark each):\n• plants / trees absorb underground water;\n• fewer trees leads to less transpiration;\n• fewer trees leads to less precipitation / rainfall;",
     "rubric": "Award 1 mark per distinct effect on the water cycle (max 2). PENALISE generic 'cutting trees is bad' or general environmental effects (soil erosion, etc.) — must link to the WATER CYCLE.",
     "examiner_note": "Most candidates failed to identify the key word in the question as they referred to general effects of cutting down trees on the environment while they were required to give the effects of cutting down trees on the water cycle.",
     "explanation": "**Trees are a big part of the water cycle. Remove them and the cycle breaks down:**\n\n1. **Less transpiration** — trees pump huge amounts of water from soil into the atmosphere through their leaves. Fewer trees → less water released to the air → drier air locally.\n\n2. **Less precipitation downwind** — the moisture trees release feeds cloud formation. Less transpired water → fewer clouds → less rain (sometimes in faraway regions too).\n\n3. **More runoff, less infiltration** — without tree roots holding soil and slowing rain, water runs off the surface instead of soaking in → less groundwater recharge, more floods downstream.\n\n4. **Lower water tables** — without tree-absorbed water re-entering the cycle, the local water balance dries up; springs and wells run low.\n\nKey: link each point to A SPECIFIC STAGE of the water cycle (transpiration, precipitation, infiltration). Don't drift into 'soil erosion' or 'global warming' — those are different topics."},

    {"q": "9(b)", "marks": 4, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q9 — Agriculture and rural living conditions in Namibia.", "diagram": None,
     "prompt": "**Q9 (b)** Suggest reasons why **agriculture is seen as a contributor to the improvement of living conditions** of many Namibians in **rural communities**. [4]",
     "memo": "Any 4 of (1 mark each):\n• farmers engaged in small- and medium-scale farming to produce food for themselves;\n• and sell surplus to generate income;\n• they have agricultural projects such as poultry farming, which help to create self-employment and employment of other community members;\n• through agricultural earnings, some farmers can establish markets to sell their products commercially;\n• as more money is invested in the area, this improves economic and social infrastructure;\n• and may result in more service providers such as banks, postal services and health care in the area;",
     "rubric": "Award 1 mark per distinct contribution to RURAL LIVING STANDARDS (max 4). PENALISE: answers about what the GOVERNMENT does to help rural communities — the question asks how AGRICULTURE itself contributes.",
     "examiner_note": "The question was reasonably well answered as most candidates could score three marks. However, very few candidates could not score a mark as they discussed what the government is doing to help rural communities such as subsidizing the price of seeds and fertilizers.",
     "explanation": "**How agriculture itself raises living standards in rural Namibia:**\n\n1. **Food self-sufficiency** — families grow their own crops/livestock → less hunger, less dependence on shops.\n\n2. **Surplus income** — selling extra crops, milk, eggs, livestock provides cash for school fees, clothing, medicine.\n\n3. **Self- and other employment** — poultry projects, vegetable gardens, dairy units → owners employ neighbours.\n\n4. **Commercial markets** — once a farmer produces enough surplus, traders set up local buying points → wider business activity.\n\n5. **Infrastructure follows money** — banks, post offices, clinics open in areas where rural income exists.\n\n6. **Skills development** — farmers learn record-keeping, finance, agronomy through cooperatives and extension.\n\nFour distinct contributions = 4 marks. The question is about agriculture's role — NOT about government interventions."},

    {"q": "9(c)", "marks": 4, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q9 — Conservancies vs Wildlife Councils.", "diagram": None,
     "prompt": "**Q9 (c)** **Compare** conservancies and wildlife councils in the **form of a table**. [4]\n\nProvide at least 4 contrasting features. (Type as a markdown table or describe rows pair by pair.)",
     "memo": "Any 4 contrasts (1 mark per CORRECT CONTRASTED PAIR):\n| Conservancies | Wildlife Councils (WC) |\n| operates at local level | operates at a regional level |\n| a specific community is represented / controlled by community | a region is represented / controlled by the region |\n| covers a relatively small area / involves a small number of people | covers a large area / involves large numbers of people |\n| revenue can be used for households and projects | revenue used for area development |\n| all income is retained and they can decide how funds are spent | income placed in regional development fund; cannot be spent without permission from MET |\n| can deal directly with private sector and enter into agreements | cannot enter into agreements / cannot deal directly with private sector |",
     "rubric": "Award 1 mark per properly CONTRASTED pair (both sides must be given). Up to 4 marks. PENALISE one-sided statements (e.g. 'conservancies are local' without saying what WC are). PENALISE answers about benefits of conservancies in general — must CONTRAST with WC.",
     "examiner_note": "Well answered. Most candidates scored all the marks.",
     "explanation": "**Conservancies vs Wildlife Councils — both manage wildlife but at different scales:**\n\n| Feature | Conservancy | Wildlife Council (WC) |\n|---|---|---|\n| **Scale** | LOCAL (one community/village) | REGIONAL (covers whole region) |\n| **Control** | By the registered community | By the regional council |\n| **Area & people** | Small area, small numbers | Large area, large numbers |\n| **Revenue use** | Households + community projects | Area-wide development |\n| **Income handling** | All retained; community decides how to spend | Placed in regional fund; needs MET approval to spend |\n| **Private-sector deals** | Can sign tourism/hunting contracts directly | Cannot — must go through government |\n\nNamibia's CBNRM programme is built on conservancies — they put control of wildlife revenue directly in community hands. Wildlife Councils are larger, government-overseen bodies."},

    # ─── Q10 (15): Shifting cultivation + pest control, biodiversity, tilling ──
    {"q": "10(a)", "marks": 5, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q10 — Shifting cultivation and pest control.", "diagram": None,
     "prompt": "**Q10 (a)** Describe **shifting cultivation** as a method of land use AND outline how this method may be **helpful in controlling crop pests**. [5]",
     "memo": "Shifting cultivation (any 4 of, 1 mark each):\n• farmer clears the land by cutting down trees, removes stumps and burns them;\n• the cleared land is used for growing crops;\n• for several years until the land becomes infertile;\n• the farmer then has to move to another land;\n• allowing previous land to recover in terms of nutrients;\nPest control (1 mark):\n• breakdown of life cycles of (crop) pests (moving the crop means pests can't find their host);",
     "rubric": "Award up to 4 marks for the description (the stages) and 1 mark for the pest control benefit (life-cycle disruption). PENALISE 'cleaning' the land (it's CLEARING); 'using the land for grazing' (it's GROWING CROPS).",
     "examiner_note": "A number of candidates gave advantages and disadvantages of shifting cultivation which were not part of the question. Some candidates also referred to cleaning the land instead of clearing, using the land for grazing instead of growing crops. The majority of candidates could not explain how shifting cultivation helps to control pests.",
     "explanation": "**Shifting cultivation (slash-and-burn) — a traditional rotation system:**\n\n1. **CLEAR the land** — cut down trees, remove stumps, BURN the brush (the ash returns nutrients to soil).\n2. **Plant crops** — sorghum, millet, maize, beans.\n3. **Use the land** for several seasons (typically 2-4 years).\n4. **Land becomes infertile** — nutrients used up; weeds and pests build up.\n5. **MOVE to a new patch** — clear and burn a new area; abandon the old one.\n6. **Original land recovers** — vegetation regrows; nutrients restored over 15-30 years of fallow.\n\n**Pest control benefit:** when the farmer moves the crop, the pests that built up around the old crop site **can't find their host plant** any more → they DIE or move on. The pest **life cycle breaks down** — no continuous host = no continuous pest population.\n\nThis is why crop rotation works on the same principle at a smaller scale."},

    {"q": "10(b)", "marks": 6, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q10 — Loss of biodiversity.", "diagram": None,
     "prompt": "**Q10 (b)** Discuss the **possible consequences resulting from the loss of biodiversity**. [6]",
     "memo": "Any 6 of (1 mark each):\n• loss of habitat / shelter;\n• change in nutrient cycles;\n• decreased resource availability;\n• results in soil erosion / change in soil content;\n• result in change in water cycles / disturbs the water cycle;\n• result in wildlife extinction;\n• results in floods;\n• change in weather patterns / climate change;\n• results in accumulation of carbon dioxide / reduction in oxygen / global warming;\n• change in ecosystem functioning / food chain;",
     "rubric": "Award 1 mark per distinct CONSEQUENCE of biodiversity loss (max 6). PENALISE 'plants/animals go extinct' as the ONLY answer (that's the LOSS, not its consequences). PENALISE 'habits' (it's habitats).",
     "examiner_note": "Most candidates could at least score 3 to 4 marks. Some candidates lost marks for referring to the consequence of plant/animal extinction instead of concentrating on the environment at large. The word habitat was incorrectly spelled as 'habits'.",
     "explanation": "**Biodiversity = the variety of living organisms in an ecosystem. When we lose species and habitats, many systems collapse:**\n\n1. **Loss of habitat** — when one species disappears, others that depend on it (food, shelter) also suffer.\n2. **Disrupted nutrient cycles** — decomposers, nitrogen fixers, dung beetles are all essential to recycling nutrients. Lose them, and soils degrade.\n3. **Reduced resources** — fewer wild fruits, medicines, fish, timber, honey for humans to gather.\n4. **Soil erosion** — fewer plant roots holding the soil → wind and water carry it away.\n5. **Water cycle changes** — fewer trees → less transpiration → less rainfall (see Q9).\n6. **Extinctions cascade** — losing one species can topple a whole food web (e.g. top predator removed → herbivores overgraze).\n7. **Floods** — without vegetation, run-off increases → rivers flood downstream.\n8. **Climate change** — fewer plants → less CO₂ absorbed → more CO₂ in atmosphere → global warming.\n9. **Food-chain disruption** — predators starve when prey species disappear, and vice versa.\n10. **Ecosystem service loss** — pollination, pest control, water purification — all done for free by biodiversity. Losing biodiversity means humans have to do (or pay for) these services.\n\nName any 6 distinct effects = 6 marks."},

    {"q": "10(c)", "marks": 4, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q10 — Mechanical tilling.", "diagram": None,
     "prompt": "**Q10 (c)** Outline **TWO advantages** AND **TWO disadvantages** of **tilling the soil mechanically**. [4]",
     "memo": "Advantages (any 2 of, 1 mark each):\n• encourages good aeration for root growth;\n• encourages good drainage / infiltration;\n• secondary tillage (harrowing) provides fine tilth;\nDisadvantages (any 2 of, 1 mark each):\n• high soil moisture loss / encourages evaporation;\n• destroys soil structure;\n• heavy machinery compacts wet soil;\n• makes the soil prone to erosion;",
     "rubric": "Award 1 mark for each correct advantage (max 2) AND 1 mark for each correct disadvantage (max 2). MUST LABEL which is which. PENALISE answers about WEED CONTROL — the question is about TILLING the soil itself.",
     "examiner_note": "'Tilling the soil mechanically' took the candidates off the question. The majority could only come up with mechanical weed control measures. Most candidates also failed to indicate whether the points they are writing are advantages or disadvantages.",
     "explanation": "**Mechanical tillage = ploughing/disking/harrowing the soil with machinery (tractor + implements).**\n\n**ADVANTAGES (any 2):**\n1. **Improves aeration** — turning the soil mixes air into it, creating air gaps for roots to breathe.\n2. **Improves drainage/infiltration** — broken-up soil lets rain soak in instead of running off.\n3. **Fine tilth from harrowing** — secondary tillage (harrowing/discing) produces a fine, crumbly seedbed perfect for seed-to-soil contact.\n\n**DISADVANTAGES (any 2):**\n1. **Moisture loss** — exposing wet soil to sun and wind dries it out fast.\n2. **Destroys soil structure** — repeated tillage breaks up the natural crumb aggregates → finer, more dusty soil.\n3. **Compaction by heavy machinery** — tractor wheels compress wet soil, creating a 'plough pan' below tillage depth.\n4. **Erosion risk** — bare, loose tilled soil is easily washed away by rain or blown by wind.\n\nFOR 4 MARKS: clearly label '**Advantages:**' and '**Disadvantages:**' — don't leave the examiner to guess."},

    # ─── Q11 (15): Soil texture vs structure, fertilisers, tourism ──────────
    {"q": "11(a)(i)", "marks": 2, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q11 — Soil texture vs structure.", "diagram": None,
     "prompt": "**Q11 (a)(i)** **Distinguish** between **soil texture** and **soil structure**. [2]",
     "memo": "Both required (1 mark each):\n• Soil texture refers to the feel / coarseness or fineness of soil OR the SIZE of the soil particles;\n• Soil structure refers to the ARRANGEMENT of soil particles into aggregates of various sizes and shapes;",
     "rubric": "Award 1 mark for texture (SIZE of particles / fineness). Award 1 mark for structure (ARRANGEMENT into aggregates). PENALISE answers that don't clearly distinguish.",
     "examiner_note": "Well answered as most candidates could clearly give a difference between soil texture and structure.",
     "explanation": "**Both terms describe soil physical properties but mean different things:**\n\n• **TEXTURE = SIZE of individual particles** — what % is sand (largest), silt (medium), clay (smallest). You FEEL texture by rubbing soil between fingers: rough/coarse (sandy) or smooth/sticky (clayey).\n\n• **STRUCTURE = ARRANGEMENT of particles** — how individual grains stick together into bigger CLUMPS (aggregates, peds, crumbs). A soil can be sandy texture but with strong crumb structure; or clay texture with massive (no structure) blocks.\n\nQuick analogy: if soil were bricks, **texture** = the size of each brick, **structure** = how the bricks are stacked to build the wall.\n\nTexture is FIXED (you can't change particle sizes). Structure CAN BE CHANGED by tilling, organic matter, compaction."},

    {"q": "11(a)(ii)", "marks": 4, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q11 — Soil texture test.", "diagram": None,
     "prompt": "**Q11 (a)(ii)** Describe **one test of soil texture** that classifies soil into **sand, clay and loam soil**. [4]",
     "memo": "RUBBING TEST (any 4 of, 1 mark each):\n• rubbing test;\n• mix the soil with water / wet the soil slightly;\n• rub the soil between the forefingers and the thumb;\n• if the soil feels coarse, it is sand soil;\n• if the soil feels smooth / fine / soapy it is clay soil;\n• if the soil feels fine and coarse it is loam soil;\n\nOR SIEVE METHOD (any 4):\n• sieve method;\n• place sieves on top of each other, top sieve with the largest holes;\n• place soil sample in the top sieve;\n• shake the entire stack;\n• particles remaining on each sieve indicate the soil type by size;\n\nOR SEDIMENTATION METHOD (any 4):\n• sedimentation method;\n• fill the jar/beaker with soil sample;\n• add water and shake vigorously;\n• allow the content/mixture to settle;\n• heavy particles settle at the bottom (sand);\n• fine/small particles settle on top (clay);\n• loam will be in the middle with a mixture of large and small particles;",
     "rubric": "Award 1 mark each: name a method + describe procedure (2-3 steps) + describe results for sand AND clay AND loam. Up to 4 marks. PENALISE 'sausage test' (NOT a soil texture test).",
     "examiner_note": "Poorly answered. Most candidates could only score a mark for naming a test to determine soil texture. Few candidates referred to a sausage test which is incorrect.",
     "explanation": "**Three legitimate soil texture tests — pick one and describe it fully:**\n\n**1. RUBBING TEST (simplest):**\n• Wet a small soil sample slightly.\n• Rub between your forefinger and thumb.\n• **Coarse, gritty** → SAND.\n• **Smooth, slippery, sticky** → CLAY.\n• **Mix of coarse and smooth, slightly sticky** → LOAM.\n\n**2. SIEVE METHOD (uses equipment):**\n• Stack sieves with biggest holes on top, smallest at bottom.\n• Pour dry soil in top, shake the whole stack.\n• Material on biggest sieve = SAND; material on smallest = CLAY; in between = SILT/LOAM.\n\n**3. SEDIMENTATION (visual):**\n• Mix soil with water in a tall jar; shake hard; let it settle.\n• Heavy particles fall FAST → SAND at the bottom.\n• Light particles settle SLOWLY → CLAY on top.\n• LOAM mixes large and small → bands of both.\n\n**Sausage test is WRONG** — that's a moisture/plasticity test (Atterberg), not a primary texture test."},

    {"q": "11(b)", "marks": 5, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q11 — Over-use of nitrogenous fertilisers.", "diagram": None,
     "prompt": "**Q11 (b)** Discuss the **effects of over-use of nitrogenous fertilisers** on the **environment**. [5]",
     "memo": "Any 5 of (1 mark each):\n• fertilisers carried in run-off water;\n• contaminate / pollute water bodies;\n• leads to eutrophication;\n• algae blooms block sunlight from entering the water;\n• hinders photosynthesis (in submerged aquatic plants);\n• causes death of aquatic organisms;\n• depletes dissolved oxygen;",
     "rubric": "Award 1 mark per distinct point in the eutrophication chain (max 5). MUST FOLLOW THE LOGICAL SEQUENCE: runoff → pollution → algal bloom → light blocked → photosynthesis hindered → O₂ depleted → fish die.",
     "examiner_note": "Fairly well answered as most candidates could score 3 to 4 marks.",
     "explanation": "**Over-using nitrogen fertilisers → EUTROPHICATION → dead lakes/rivers.** Walk through the chain:\n\n1. **Run-off** — excess fertiliser washed off the field by rain.\n2. **Reaches water bodies** — nitrates and phosphates enter rivers, lakes, dams, eventually the sea.\n3. **Triggers algal blooms** — nitrates are 'fertiliser' for water plants too; algae multiply explosively.\n4. **Sunlight blocked** — thick green algal carpet covers the water surface.\n5. **Submerged plants die** — they can't photosynthesise without light → die and start rotting.\n6. **Decomposers consume oxygen** — bacteria breaking down dead algae use up the dissolved oxygen.\n7. **Fish and other aquatic life suffocate** — O₂-depleted water can't support fish, frogs, insects. Mass die-off.\n8. **Toxic water** — some algae release toxins; water becomes unsafe for humans and livestock.\n\nName any 5 stages of the chain = 5 marks. **EUTROPHICATION** is the technical term — use it for a guaranteed mark."},

    {"q": "11(c)", "marks": 4, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q11 — Tourism benefits to communities.", "diagram": None,
     "prompt": "**Q11 (c)** Suggest **ways in which communities can benefit from the tourism industry**. [4]",
     "memo": "Any 4 of (1 mark each):\n• through tour guide / game drive;\n• through trophy hunting;\n• by selling crafts to tourists / ornaments;\n• through showing tourists their traditional villages;\n• through selling thatch / cattle / vegetables to the lodges;\n• through selling wild fruits to the tourists;\n• through selling fire wood to tourists / campers;\n• renting campsites;\n• offering services such as car wash and tyre repairs;",
     "rubric": "Award 1 mark per distinct community benefit (max 4). PENALISE answers that confuse tourists with lodges (tourists don't buy thatch/cattle — lodges do). PENALISE general 'forest benefits' instead of TOURISM benefits.",
     "examiner_note": "The question was reasonably well answered. However, some candidates lost a lot of marks for referring to community selling for example fire wood/crafts to tourism instead of tourists. Few candidates based their answers on the benefits of forest to community. It should be made clear to the candidates that tourists do not buy thatch or cattle. Those must be sold to the lodges.",
     "explanation": "**Tourism creates many direct income streams for rural Namibian communities:**\n\n1. **Tour-guide jobs / game drives** — community members trained as guides; vehicles taking tourists on safaris in conservancies.\n2. **Trophy hunting** — concessions paid by hunting companies to the conservancy/community for the right to hunt limited quotas.\n3. **Craft sales to tourists** — wood carvings, baskets, jewellery, beadwork sold directly at stalls or markets.\n4. **Cultural village tours** — tourists pay to visit traditional homesteads, watch dances, learn customs.\n5. **Sales to lodges** — vegetables, thatch grass, fence poles, livestock SOLD TO the lodges (lodges then serve/use for tourists).\n6. **Wild fruit and bush food** — marula, mopane worms, berries — sold to passing tourists.\n7. **Firewood sales** to campers.\n8. **Campsite rental** — community-run campsites (Hoba, /Ai-/Ais area).\n9. **Vehicle services** — car wash, tyre repair, fuel sales along tourist routes.\n\n**Key distinction**: tourists buy CRAFTS, GAME DRIVES, CULTURAL TOURS. Lodges buy BULK SUPPLIES (thatch, livestock, vegetables) — they then service tourists. Don't mix the two."},

    # ─── Q12 (15): Beef cattle characteristics, lime/fertiliser, conservancy rejection ──
    {"q": "12(a)", "marks": 6, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q12 — Beef cattle characteristics.", "diagram": None,
     "prompt": "**Q12 (a)** Describe the **characteristics needed by cattle that are bred for beef**. [6]",
     "memo": "Any 6 of (1 mark each):\n• should be able to produce quality meat / beef (with correct meat-to-fat ratio);\n• should be able to produce more meat / beef;\n• should be able to resist diseases and parasites;\n• should be able to withstand heat / high temperature / adapt to local environment;\n• should be able to tolerate drought;\n• must have a long life span / longevity;\n• must have a high percentage of calves / high fertility;\n• docile for easy management / good temperament;\n• gain weight rapidly / high food conversion ratio;",
     "rubric": "Award 1 mark per distinct desirable trait of a BEEF (meat-producing) animal (max 6). PENALISE traits relevant only to DAIRY (big udder, high milk yield).",
     "examiner_note": "Well answered as most candidates could score 4 to 5 marks. However, some candidates referred to the factors that are considered when selecting animals for breeding purpose such as the size and growth rate of cattle.",
     "explanation": "**A good beef breed needs to convert grass into meat efficiently, cheaply, in harsh conditions:**\n\n1. **Quality meat (good meat-to-fat ratio)** — well-marbled but not over-fat; tender, tasty.\n2. **High meat yield** — large carcass, big muscle mass; high dressing percentage.\n3. **Disease resistance** — minimal vet costs, fewer losses.\n4. **Heat tolerance** — many beef breeds in Namibia handle 40 °C+ summer days.\n5. **Drought tolerance** — can lose weight in dry seasons but recover quickly when rains come.\n6. **Longevity** — long productive life, breeds for many years.\n7. **High fertility** — calves every year; high calving percentage in the herd.\n8. **Docile temperament** — easy to handle, less injury risk, less stress (stress = bad meat).\n9. **Rapid weight gain / good feed conversion** — converts grass into kg of beef efficiently; ready for slaughter sooner.\n\nNamibian breeds that fit: **Bonsmara, Brahman, Simmentaler, Sanga/Nguni, Afrikaner**. Name any 6 traits = 6 marks."},

    {"q": "12(b)", "marks": 5, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q12 — Lime and fertilisers improving pasture.", "diagram": None,
     "prompt": "**Q12 (b)** Discuss how the use of **lime AND fertilisers** improves pastures. [5]",
     "memo": "USE OF LIME (any of, 1 mark each):\n• helps to raise soil pH / making it less acidic / decreases acidity / neutralises acid;\n• adds calcium to the soil;\n• increases nutrient availability;\n• stimulates microbial or earthworm activities;\n• flocculates clay soil / improves clay soil structure;\nUSE OF FERTILISER (any of, 1 mark each):\n• helps add nutrients to the soil / improves soil fertility;\n• helps to improve the quality of grass;\n• increases grass production;",
     "rubric": "Award 1 mark per distinct effect — MUST SEPARATE lime effects FROM fertiliser effects. Up to 5 marks total. PENALISE combined answers like 'lime and fertiliser improve growth' — must be split.",
     "examiner_note": "Fairly well answered. Most candidates however, could not separate their answers as effects of lime and effects of fertiliser on the pasture. Answers were combined and sometimes they could start like 'lime and fertilizer improve the growth of grass'. This style of answering should be discouraged as it is costing candidates marks.",
     "explanation": "**SPLIT YOUR ANSWER into TWO sections** — examiners want to see lime effects AND fertiliser effects clearly distinguished.\n\n**Use of LIME (calcium carbonate) on pasture:**\n• Raises soil pH (less acidic) — many Namibian soils are slightly acidic; raising pH unlocks 'tied-up' nutrients.\n• Adds calcium directly — essential for grass cell walls and animal bones.\n• Improves nutrient availability — phosphorus and nitrogen become more uptakeable at correct pH.\n• Stimulates microbes and earthworms — they thrive at pH 6-7; their activity recycles nutrients.\n• Flocculates clay — heavy soils become more crumbly.\n\n**Use of FERTILISERS (N, P, K compounds) on pasture:**\n• Adds nutrients directly — N for leaf growth, P for roots, K for plant health.\n• Improves grass quality — more protein in the grass, better feed for livestock.\n• Increases grass production — more biomass per hectare → more grazing days → more livestock supported.\n\nFor 5 marks: aim for ~3 lime effects + ~2 fertiliser effects (or 2 + 3), clearly labelled."},

    {"q": "12(c)", "marks": 4, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q12 — Conservancy application rejection.", "diagram": None,
     "prompt": "**Q12 (c)** Suggest the **conditions** which will result in the Ministry of Environment and Tourism **REJECTING** a communal farmers' application to register as a **conservancy**. [4]",
     "memo": "Any 4 of (1 mark each):\n• the committee members do not represent the community;\n• the community does not agree with the decision of establishing a conservancy;\n• the names of committee members are not included in the application;\n• there is no benefit distribution plan that outlines how benefits will be fairly shared;\n• the boundaries of the conservancy have not been identified;\n• the members of the conservancy are not defined;\n• there is no plan for accountable management;\n• the area is within a proclaimed game park / subject to a lease;",
     "rubric": "Award 1 mark per distinct ground for REJECTION (max 4). PENALISE answers describing REQUIREMENTS for approval (the question asks what causes rejection — the inverse). PENALISE general 'they don't follow the rules'.",
     "examiner_note": "The question was poorly answered. Most candidates could not score a mark because they failed to read and interpret the question. They assumed the question is asked in the same manner they are used to.",
     "explanation": "**MET will REJECT a conservancy application that FAILS any of these requirements:**\n\n1. **Committee doesn't represent the community** — elected by a sub-group or self-appointed, not by all members.\n\n2. **Community doesn't agree** — minutes of community meetings don't show majority consent.\n\n3. **No committee names submitted** — application missing key documentation.\n\n4. **No benefit distribution plan** — must show how income (from hunting, tourism, etc.) will be shared fairly among members.\n\n5. **Boundaries not defined** — application doesn't clearly map the area being claimed.\n\n6. **Membership not defined** — no list of who is and isn't a conservancy member.\n\n7. **No accountable management plan** — no rules for elections, finance, audits, decision-making.\n\n8. **Area conflicts with existing land use** — overlaps a national park, leased farm, or other conservancy.\n\nKey: the question asks for REJECTION grounds (failures), NOT for approval requirements. Both are similar lists, just framed differently — the verbatim mark scheme talks about what's MISSING or WRONG."},
]


# ============================================================================
# Diagram extraction
# ============================================================================
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
            print(f"  {slug}: MISSING {page_path}"); continue
        img = _flatten_to_white(Image.open(page_path))
        W, H = img.size
        crop = img.crop((int(W * x_left), int(H * y_top), int(W * x_right), int(H * y_bot)))
        out = PNG_DIR / f"{slug}.png"
        crop.save(out, optimize=True)
        print(f"  {slug:24s} {crop.size[0]}x{crop.size[1]}")


# ============================================================================
# SQL generation
# ============================================================================
def sql_escape(s):
    if s is None:
        return "null"
    s = s.replace("\\", "\\\\").replace("'", "''").replace("\n", "\\n")
    return f"E'{s}'"


def build_prompt(q):
    stem = q.get("stem", "")
    return (stem + "\n\n" + q["prompt"]) if stem else q["prompt"]


def build_full_memo(q):
    memo = q.get("memo", "")
    note = q.get("examiner_note", "")
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


def build_mcq_options(q):
    rows = []
    for opt in q["options"]:
        text = opt["text"].replace("'", "''")
        rows.append(f"      jsonb_build_object('id','{opt['id']}','text','{text}')")
    return "jsonb_build_array(\n" + ",\n".join(rows) + "\n    )"


def emit_sql():
    out = []
    out.append("-- " + "=" * 75)
    out.append(f"-- NSSCO Agricultural Science 2023 Paper 1 (6115/1) — Section A (90) + Section B (60 available)")
    out.append(f"-- 8 Section A questions, 4 Section B essays, {len(QUESTIONS)} sub-parts, 120 marks total (90 + 2×15)")
    out.append("-- Verbatim NIED wording for prompts. Mark scheme + commentary from")
    out.append("-- DNEA Examiners Report 2023 (Agricultural Science section, pages 35-43).")
    out.append("-- No standalone Ag Science memo PDF exists — Examiner Report 'Answer' blocks ARE the memo.")
    out.append("-- Uses 'essay' and 'drawing' question types (added in 20260525240000).")
    out.append("-- " + "=" * 75)
    out.append("")
    out.append("do $$")
    out.append("declare")
    out.append("  agric_id uuid;")
    out.append("begin")
    out.append("  select id into agric_id from public.subjects where slug = 'agricultural-science' limit 1;")
    out.append("  if agric_id is null then raise notice 'Agricultural Science subject not found'; return; end if;")
    out.append("")
    for q in QUESTIONS:
        diagram_url = "null" if not q.get("diagram") else f"'{durl(q['diagram'])}'"
        prompt = build_prompt(q)
        memo = build_full_memo(q)
        mw = "mark" if q["marks"] == 1 else "marks"
        out.append(f"  -- ─── Q{q['q']}  [{q['marks']} {mw}, {q['tier']}, {q['type']}] ───")
        out.append("  insert into public.past_paper_questions (")
        out.append("    subject_id, paper_year, paper_no, q_number, marks, tier,")
        if q["type"] == "fill_in":
            out.append("    type, prompt, diagram_url, correct, case_sensitive,")
            out.append("    memo, explanation, is_published")
            out.append("  ) values (")
            out.append(f"    agric_id, 2023, '1', '{q['q']}', {q['marks']}, '{q['tier']}',")
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
            out.append(f"    agric_id, 2023, '1', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'calculation',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {build_calc_correct(q)},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        elif q["type"] == "mcq":
            out.append("    type, prompt, options, correct, diagram_url,")
            out.append("    memo, explanation, is_published")
            out.append("  ) values (")
            out.append(f"    agric_id, 2023, '1', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'mcq',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {build_mcq_options(q)},")
            out.append(f"    to_jsonb('{q['correct']}'::text),")
            out.append(f"    {diagram_url},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        elif q["type"] in ("essay", "drawing", "free_text"):
            type_lit = q["type"]
            out.append("    type, prompt, diagram_url, memo, rubric, explanation, is_published")
            out.append("  ) values (")
            out.append(f"    agric_id, 2023, '1', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    '{type_lit}',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q.get('rubric',''))},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        else:
            raise ValueError(f"Unhandled type: {q['type']}")
        out.append("")
    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} sub-parts for Agricultural Science NSSCO 2023 Paper 1';")
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
        by_q.setdefault(main_q, 0)
        by_q[main_q] += q["marks"]
    print(f"\nMarks per question: {by_q}")
    section_a = sum(q["marks"] for q in QUESTIONS if not q["q"].startswith(("9","10","11","12")))
    section_b = sum(q["marks"] for q in QUESTIONS if q["q"].startswith(("9","10","11","12")))
    print(f"Section A: {section_a} marks; Section B (any 2 of 4): {section_b} available")
    print(f"Total sub-parts: {len(QUESTIONS)}")
