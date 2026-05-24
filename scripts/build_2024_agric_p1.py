"""Build NSSCO Agricultural Science 2024 Paper 1 — 8 Section A + 4 Section B, 120 marks.

Verbatim NIED wording for prompts. Mark scheme + commentary from the DNEA
Examiners Report 2024 (Ag Science section, pages 35-43). No standalone memo
PDF exists for Ag Science — the Examiner Report's "Answer" blocks ARE the memo.

Question types used:
  fill_in     — short verbatim answers (auto-marked, accepted list + must_contain)
  calculation — numerical with working area (Q5(b)(iii), Q8(a)(ii))
  free_text   — short explanation / describe (AI-marked against memo)
  mcq         — multiple choice (Q2(d), Q3(a)(iii), Q7(c))
  drawing     — graph/diagram drawing — student describes their sketch or uploads photo
  essay       — Section B extended response (15-mark questions, choice of 2)
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2024-agric-p1"
PNG_DIR = ROOT / "public" / "past-papers" / "agriculture-nssco-2024-p1"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260525250000_agriculture_nssco_2024_p1.sql"

# (page_name, y_top, y_bot, x_left, x_right) — fractions of page
DIAGRAMS = {
    "q1-weeds-graph":       ("page-02", 0.20, 0.78, 0.06, 0.88),
    "q2-erosion-x-y":       ("page-04", 0.30, 0.96, 0.10, 0.88),
    "q2-drainage":          ("page-05", 0.30, 0.62, 0.10, 0.88),
    "q3-plant-cell":        ("page-06", 0.06, 0.36, 0.20, 0.78),
    "q4-harrow":            ("page-07", 0.10, 0.42, 0.10, 0.88),
    "q4-maize-plant":       ("page-08", 0.04, 0.50, 0.18, 0.78),
    "q5-pasture-graph":     ("page-09", 0.18, 0.52, 0.04, 0.88),
    "q6-reproductive":      ("page-11", 0.06, 0.34, 0.06, 0.88),
    "q6-gmo":               ("page-11", 0.36, 0.62, 0.18, 0.78),
    "q6-breeds":            ("page-12", 0.32, 0.58, 0.12, 0.78),
    "q7-trees":             ("page-13", 0.06, 0.42, 0.10, 0.78),
    "q8-enterprise":        ("page-15", 0.04, 0.62, 0.06, 0.92),
    "q8-yogurt-tuna":       ("page-16", 0.12, 0.40, 0.18, 0.78),
}


def durl(slug):
    return f"/past-papers/agriculture-nssco-2024-p1/{slug}.png" if slug else None


# ============================================================================
# STEMS — repeated verbatim across sub-parts of the same main question so the
# renderer's "show stem once" dedup works.
# ============================================================================
Q1_STEM = "Fig. 1.1 is a bar graph that shows the number of weeds in seed beds some days after transplanting a cereal crop. One seed bed was covered with mulch while the other seed bed was left without mulch.\n\n• 21 days: without mulch ≈ 490 weeds/m²; with mulch ≈ 20\n• 35 days: without mulch ≈ 310 weeds/m²; with mulch ≈ 10\n• 56 days: without mulch ≈ 250 weeds/m²; with mulch ≈ 20"
Q2_STEM = "Soil types, erosion, drainage and waterlogging."
Q3_STEM = "Fig. 3.1 shows a plant cell placed in a **concentrated sugar solution**. Arrows on the diagram point outward from the cell. Labels: cell wall, X (the vacuole, which has shrunk), cytoplasm."
Q4_STEM = "Fig. 4.1 shows the implement used in land preparation for planting maize. Fig. 4.2 shows a maize plant with parts labelled **A** (the tassel at the top), **silk** (hanging out of the cob), and **leaf**."
Q5_STEM = "Fig. 5.1 shows the influence of the age of pasture on its digestibility, energy levels and protein content. Stages of plant growth cycle (from young to old):\n• active growth, green — digestibility 70%, energy 9.5 MJ/kg, protein 16%\n• late vegetation, green\n• early flowering\n• mid flowering, green and dead — digestibility 55%, energy 7.5 MJ/kg, protein 10%\n• late flowering\n• dry grass and stalks\n• dry stalks — digestibility 40%, energy 4.8 MJ/kg, protein 4%\n\nx-axis: age of pasture (weeks 4, 8, 12, 28, 32, 36, 40)."
Q6_STEM = "Fig. 6.1 shows the reproductive system of a cow and a bull, with parts labelled A–I.\n• Cow: **A** = oviduct/fallopian tube; **B** = uterus; **C** = vagina; **D** = cervix; **E** = ovary\n• Bull: **F** = seminal vesicles (accessory glands); **G** = vas deferens; **H** = urethra (in penis); **I** = epididymis/testis"
Q7_STEM = "Fig. 7.1 shows people cutting down trees in one of Namibia's community forests."
Q8_STEM = "Fig. 8.1 shows the output from a maize enterprise.\n• Output: 2 ha maize field, 1620 kg/ha. Maize sold for N\\$ 10.00/kg.\n• Variable costs: Seeds N\\$ 1 500; Fertiliser N\\$ 2 100; Insecticide N\\$ 3 500 (total N\\$ 7 100)\n• Fixed costs: Rent N\\$ 4 000; Labour N\\$ 4 050"


# ============================================================================
# SECTION A — 8 questions, 90 marks
# ============================================================================
QUESTIONS = [
    # ─── Q1: Mulch and weeds (10 marks) ─────────────────────────────────────
    {"q": "1(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": Q1_STEM, "diagram": "q1-weeds-graph",
     "prompt": "**(a)(i)** State the number of days after transplanting when the number of weeds in the seed bed **with mulch** was the **least**.",
     "accepted": ["35", "35 days", "35 days after transplanting"],
     "must_contain": ["35"],
     "memo": "35 (days); [1 mark]",
     "examiner_note": "Most candidates were able to read the number of days from the graph.",
     "explanation": "Read off the SMALLEST bar in the 'with mulch' series. The three with-mulch bars are roughly 20, 10, 20 — the smallest is at **35 days** (≈ 10 weeds/m²)."},

    {"q": "1(a)(ii)", "marks": 2, "tier": "free", "type": "fill_in",
     "stem": Q1_STEM, "diagram": "q1-weeds-graph",
     "prompt": "**(a)(ii)** State the **number of weeds** 56 days after transplanting in the seed bed:\n• with mulch, ___\n• without mulch ___\n\nWrite as 'mulch X, no mulch Y'.",
     "accepted": ["mulch 20, no mulch 250", "20 and 250", "mulch=20 nomulch=250", "20, 250", "with mulch 20 without mulch 250"],
     "must_contain": ["20", "250"],
     "memo": "with mulch — 20; without mulch — 250; [2 marks, 1 each]",
     "examiner_note": "Fairly well answered. However, some candidates lost marks for referring to the number of days/weeks while the question asked the number of weeds.",
     "explanation": "Read the 56-day pair of bars:\n• **with mulch** = **20** weeds/m² (a tiny bar)\n• **without mulch** = **250** weeds/m² (the tall black bar)\n\nCommon trap: candidates wrote a number of days (21, 35, 56) instead of reading the **weed count** off the y-axis. The question asks for **weeds**, not time."},

    {"q": "1(a)(iii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q1_STEM, "diagram": "q1-weeds-graph",
     "prompt": "**(a)(iii)** Suggest why the number of weeds in the seed bed with mulch was relatively **low**.",
     "memo": "Any 2 of (1 mark each):\n• mulch suppresses the growth of weeds;\n• physically hinders the emerging weeds;\n• prevents weeds from getting sunlight (so weed seeds can't photosynthesise / germinate);",
     "rubric": "Award 1 mark per distinct mechanism (max 2). ACCEPT: 'blocks light', 'smothers seedlings', 'keeps soil cool so weeds dormant'. PENALISE generic 'mulch is good for soil' with no mechanism.",
     "examiner_note": "Poorly answered. Most candidates found it challenging — required them to suggest effects of mulch on weed growth.",
     "explanation": "Mulch is a **physical barrier** that sits on the soil surface. Two main effects on weeds:\n\n1. **Blocks sunlight** — most weed seeds need light to germinate; under mulch they stay dormant.\n2. **Physical obstacle** — even if a weed germinates, the mulch layer smothers the tiny seedling before it can break through.\n\nA third valid point: mulch keeps the topsoil cooler and moister, which suits the crop (well established) but not the surface-germinating weed seeds."},

    {"q": "1(b)", "marks": 3, "tier": "paid", "type": "free_text",
     "stem": Q1_STEM, "diagram": None,
     "prompt": "**(b)** Apart from weed control, outline the **other ways in which mulching is important**.",
     "memo": "Any 3 of (1 mark each):\n• reduces evaporation;\n• keeps the soil moist / conserves soil moisture;\n• reduces splash erosion / reduces soil loss;\n• organic mulch improves soil fertility when it rots / decomposes;\n• keeps the soil temperature constant (moderates temperature);",
     "rubric": "Award 1 mark per distinct benefit (max 3). PENALISE repetition of one idea in different words (e.g. 'conserves water' AND 'keeps soil moist' = one point only).",
     "examiner_note": "Well answered. Most candidates have knowledge on the importance of mulching.",
     "explanation": "**Mulching = covering bare soil with a layer of material** (straw, leaves, plastic). Benefits beyond weed control:\n\n1. **Reduces evaporation** → soil stays moist longer between rains/irrigation\n2. **Prevents splash erosion** → rain drops hit the mulch, not the bare soil, so soil particles aren't dislodged\n3. **Adds organic matter** (organic mulch only) → as it rots it releases nutrients, improving soil fertility and structure\n4. **Moderates soil temperature** → cooler in summer, warmer in winter — protects roots and microbes\n\nName any THREE for full marks."},

    {"q": "1(c)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": "Effects of humidity on plant growth.", "diagram": None,
     "prompt": "**(c)** Suggest how **low** and **high** humidity might affect a plant **negatively**.\n• low humidity: ___\n• high humidity: ___",
     "memo": "1 mark each:\n• low humidity — increases evaporation / increases transpiration (causes wilting / water stress);\n• high humidity — increases the spread of fungal diseases / pests;",
     "rubric": "Award 1 mark for low (must give a NEGATIVE effect — more evaporation/transpiration/wilting). Award 1 mark for high (must say diseases/fungi/pests). PENALISE candidates who give POSITIVE effects (the question explicitly says 'negatively').",
     "examiner_note": "Poorly answered. Most candidates gave positive effects of humidity even though the question clearly asked for negative effects.",
     "explanation": "Humidity = water vapour in the air. Both extremes hurt plants:\n\n**Low humidity (dry air):**\n• Steep water-vapour gradient between leaf and air → **transpiration rate shoots up**\n• Plant loses water faster than roots absorb it → **wilting**, leaf curling, eventually death\n\n**High humidity (damp air):**\n• Leaf surfaces stay wet for longer → ideal for **fungal spores** (powdery mildew, downy mildew, rust) and many pests\n• Transpiration almost stops → poor uptake of minerals (which travel up the xylem in the transpiration stream)\n\nKey: the question says NEGATIVE effects only — don't list 'helps photosynthesis' or 'good for growth'."},

    # ─── Q2: Soil types, erosion, drainage (14 marks) ───────────────────────
    {"q": "2(a)", "marks": 4, "tier": "free", "type": "fill_in",
     "stem": "Identify the soil type matching each description.", "diagram": None,
     "prompt": "**(a)** State the soil type that fits each description.\n1 Sticky when moist, can be molded into any shape and can be polished.\n2 Can be molded and sticks to fingers slightly when moist.\n3 Feels coarse and is structure-less.\n4 Has large and small pore spaces, which retain water fairly.\n\nFormat: '1 X; 2 Y; 3 Z; 4 W'.",
     "accepted": [
         "1 clay; 2 loam; 3 sand; 4 loam",
         "1 clay 2 loam 3 sand 4 loam",
         "clay, loam, sand, loam",
         "clay loam sand loam",
         "1 - clay 2 - loam 3 - sand 4 - loam",
     ],
     "must_contain": ["clay", "loam", "sand"],
     "memo": "1 clay; 2 loam; 3 sand; 4 loam; [4 marks, 1 each]",
     "examiner_note": "Well answered. Most candidates correctly identified the soil type fitting the descriptions given.",
     "explanation": "**Three soil types by feel:**\n\n• **Clay** — particles < 0.002 mm; sticky/plastic when wet, hard when dry; takes a polish when rubbed; holds lots of water and nutrients but poorly drained.\n• **Sand** — particles > 0.06 mm; coarse/gritty feel, no plasticity, falls apart in the hand; drains freely, poor at holding nutrients.\n• **Loam** — balanced mix of sand + silt + clay; mouldable but not as sticky as pure clay; the gardener's ideal — has both large pores (drainage, air) and small pores (water retention).\n\nDescriptions 1 (sticky + polished) and 3 (coarse, structureless) point clearly to clay and sand. 2 and 4 both fit **loam** because loam can both be moulded slightly AND has mixed pore sizes."},

    {"q": "2(b)(i)", "marks": 2, "tier": "free", "type": "fill_in",
     "stem": Q2_STEM, "diagram": "q2-erosion-x-y",
     "prompt": "**(b)(i)** Fig. 2.1 shows two types of soil erosion on agricultural land.\n• X = a deep, eroded channel cutting through the landscape\n• Y = a slope with raindrops, with arrows showing detachment → transport → deposition\n\nIdentify the types of soil erosion **X** and **Y**.\nFormat: 'X - …; Y - …'.",
     "accepted": [
         "X - gully erosion; Y - splash erosion",
         "x gully y splash",
         "gully and splash",
         "X gully Y splash",
         "X - gully Y - splash",
     ],
     "must_contain": ["gully", "splash"],
     "memo": "X — gully erosion; Y — splash erosion; [2 marks, 1 each]",
     "examiner_note": "Fairly answered. Some candidates refer to gully erosion as rill or sheet erosion and splash erosion was mostly spelled as 'spalash' or 'spulush'.",
     "explanation": "**Types of water erosion** ranked by severity:\n• **Splash erosion** — raindrop impact dislodges soil particles, then they're carried downhill (the very first stage). Diagram Y shows this — raindrops + arrows for detachment/transport/deposition.\n• **Sheet erosion** — a uniform thin layer of soil is washed off the whole slope.\n• **Rill erosion** — small channels (< 30 cm deep) form.\n• **Gully erosion** — large, deep, often un-cross-able channels (image X). Hardest to repair, often makes the land unusable for farming.\n\nSpell carefully: **gully** (not gulley) and **splash** (not 'spalash')."},

    {"q": "2(b)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q2_STEM, "diagram": "q2-erosion-x-y",
     "prompt": "**(b)(ii)** Suggest **two best practices** that can be used to **restore the land at X** in Fig. 2.1 (gully erosion).",
     "memo": "Any 2 of (1 mark each):\n• introduce vegetation cover / plant grass;\n• plugging gullies (fill them with stones / brushwood / soil);\n• gabion blocks / gabion walls (wire baskets of stones placed in the gully bed);",
     "rubric": "Award 1 mark per distinct practice (max 2). ACCEPT: 'reshape/regrade slopes', 'build check dams'. PENALISE 'fence off the area' alone (prevents new damage but doesn't restore).",
     "examiner_note": "Poorly answered. Candidates do not have sufficient knowledge on gully erosion, therefore, they could not come up with best practices to restore the land at X.",
     "explanation": "**Gully repair** is hard — once a gully forms, water keeps choosing the same path. Three proven restoration practices:\n\n1. **Plant vegetation** — grasses (especially deep-rooted ones like Vetiver) bind the soil; trees on the gully banks shade and stabilise.\n2. **Plug the gully** — fill it with stones, brushwood, sandbags, or soil to break up the water flow.\n3. **Gabion structures** — wire mesh baskets filled with rocks, placed across the gully as small check dams. They slow water down and trap silt, which gradually builds the floor back up.\n\nLong term: control the catchment uphill of the gully (contour banks, ground cover) so less water reaches the gully head."},

    {"q": "2(b)(iii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q2_STEM, "diagram": "q2-erosion-x-y",
     "prompt": "**(b)(iii)** Explain why **zero tillage** will be a suitable tilling method on the land at **Y** in Fig. 2.1 (splash erosion on a slope).",
     "memo": "Both required (1 mark each):\n• zero tillage does not disturb soil structure;\n• erosion will be minimised / reduced;",
     "rubric": "Award 1 mark for 'soil structure NOT disturbed' (or 'soil cover/residues retained'). Award 1 mark for 'less erosion' (linking back to Y). PENALISE generic 'saves time/labour' answers.",
     "examiner_note": "Poorly answered. It was challenging for candidates to relate the principles of zero tillage to the landscape (steep slope) in the diagram.",
     "explanation": "**Zero tillage (no-till)** = planting directly into uncultivated soil with crop residues left on top. Why it suits a slope prone to splash erosion:\n\n1. **Soil structure stays intact** — no ploughing means soil aggregates are not broken up; they bind together and resist being splashed loose.\n2. **Crop residues on the surface** act like mulch — they take the brunt of raindrop impact, so the soil itself is never bared.\n3. Roots from previous crops keep holding the soil in place.\n\nCompare with conventional ploughing on a slope — the loose, bare turned-over soil is washed downhill at the first heavy rain."},

    {"q": "2(c)(i)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": Q2_STEM, "diagram": "q2-drainage",
     "prompt": "**(c)(i)** Fig. 2.2 shows plants growing in undrained and drained soils. The drained soil has perforated pipes laid below the root zone to carry water away.\n\nIdentify the **drainage system** shown in Fig. 2.2.",
     "accepted": ["pipe drain", "pipe drainage", "subsurface pipe drainage", "tile drainage", "underground pipes", "pipe drain system"],
     "must_contain": ["pipe"],
     "memo": "pipe drain; [1 mark]",
     "examiner_note": "Poorly answered. Most candidates identified the drainage system as ditches instead of pipe drainage system.",
     "explanation": "**Pipe drainage** (also called 'tile' or 'subsurface' drainage) = perforated pipes buried below the root zone. They collect excess water from the soil and carry it to an outfall.\n\nDistinct from:\n• **Ditches / open drains** — visible channels on the surface (would be drawn as trenches, not buried pipes).\n• **French drains** — gravel-filled trenches without pipes."},

    {"q": "2(c)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q2_STEM, "diagram": "q2-drainage",
     "prompt": "**(c)(ii)** With reference to Fig. 2.2, explain how **undrained condition** could **limit plant growth**.",
     "memo": "Any 2 of (1 mark each):\n• inhibit / reduce / slow down root growth;\n• inhibit / reduce the absorption of nutrients;\n• limit leaf area expansion that hinders photosynthesis;",
     "rubric": "Award 1 mark per distinct biological effect (max 2). ACCEPT: 'roots can't get oxygen / suffocate', 'reduces respiration'. PENALISE generic 'plant dies' without mechanism.",
     "examiner_note": "Poorly answered as most candidates could not score a mark on this question. It was challenging for them to deduce answers making references to the data given in a diagram.",
     "explanation": "**Waterlogged soil = water fills all the pore spaces, no air reaches the roots.** Consequences:\n\n1. **Roots can't respire** — without oxygen, root cells switch to anaerobic respiration, which produces toxic by-products and very little ATP. Roots grow poorly and may die.\n2. **Poor nutrient uptake** — active uptake of mineral ions needs ATP from respiration; with low ATP, less absorption.\n3. **Smaller leaves and stunted growth** — less water + mineral supply reaching the shoot → leaves don't expand fully → less photosynthesis → less growth.\n\nThis is exactly what Fig 2.2 shows: the undrained plant is shorter and weaker than the drained one."},

    {"q": "2(d)", "marks": 1, "tier": "free", "type": "mcq",
     "stem": Q2_STEM, "diagram": None,
     "prompt": "**(d)** Why is a **waterlogged soil** considered unsuitable for crop growth?",
     "options": [
         {"id": "a", "text": "has regular supply of water to plants"},
         {"id": "b", "text": "has optimum condition for seed germination"},
         {"id": "c", "text": "there is absence of aeration of soil in the root zone of plants"},
         {"id": "d", "text": "there is a regular supply of nutrients within the root zone of plants"},
     ],
     "correct": "c",
     "memo": "C; [1 mark] — waterlogged = pores filled with water, no air → no oxygen for roots.",
     "examiner_note": "Well answered. Candidates could correctly identify a reason why a waterlogged soil is considered unsuitable for crop growth.",
     "explanation": "**Roots need oxygen to respire.** Waterlogging fills the soil's air pockets with water, so no oxygen can reach the roots. Without respiration, roots can't make ATP, can't absorb nutrients, and eventually die.\n\nWhy the others are wrong:\n• A & D — 'regular supply' would be GOOD; they're not problems.\n• B — waterlogged is NOT optimum; most seeds rot in saturated soil.\n• C — correct: the problem is **lack of aeration**."},

    # ─── Q3: Plant cell + transport (8 marks) ───────────────────────────────
    {"q": "3(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": Q3_STEM, "diagram": "q3-plant-cell",
     "prompt": "**(a)(i)** State what is represented by the **arrows** on Fig. 3.1 (pointing outward from the cell).",
     "accepted": [
         "water moving out of the cell",
         "water movement out",
         "exosmosis",
         "water moving out",
         "water leaving the cell",
         "water moves out of cell",
         "movement of water out of cell",
     ],
     "must_contain": ["water"],
     "memo": "water movement / water moving out the cell / exosmosis; [1 mark]",
     "examiner_note": "Well answered. However, some candidates referred to the process of osmosis and loss of water from the plant (transpiration).",
     "explanation": "Arrows point **outward** = water is **leaving** the cell.\n\nWhen a plant cell is placed in a **concentrated sugar solution** (high solute outside, low water concentration outside), water moves out **through the partially permeable membrane** by **osmosis** — from the dilute inside to the concentrated outside.\n\nThis specific 'water out' direction is sometimes called **exosmosis**.\n\nDon't confuse with **transpiration** (water loss from leaves to the air) — that's a different scale."},

    {"q": "3(a)(ii)", "marks": 3, "tier": "paid", "type": "free_text",
     "stem": Q3_STEM, "diagram": "q3-plant-cell",
     "prompt": "**(a)(ii)** Describe the **process** leading to the appearance of the cell shown in Fig. 3.1 (vacuole shrunk, cytoplasm pulled away from cell wall).",
     "memo": "Any 3 of (1 mark each):\n• (more) water moves out of the vacuole / out of the cell;\n• shrunken vacuole;\n• cell membrane pulls away from cell wall;\n• cytoplasm pulls away from the cell wall;\n• cell becomes flaccid / plasmolysed;",
     "rubric": "Award 1 mark per distinct stage of plasmolysis (max 3). PENALISE 'cell shrinks' alone (vague — must say WHICH parts shrink and how).",
     "examiner_note": "Fairly well answered. Some candidates lost marks for referring to shrunken cytoplasm instead of a shrunken vacuole.",
     "explanation": "**Plasmolysis** = what you see when a plant cell loses too much water to a hypertonic solution.\n\nStep by step:\n1. Sugar concentration **outside > inside the vacuole** → water concentration LOWER outside.\n2. Water moves **out of the vacuole**, across the cytoplasm, through the cell membrane, into the surrounding solution **by osmosis**.\n3. The **vacuole shrinks** (it's the main water-holding compartment).\n4. As volume drops, the **cytoplasm and cell membrane pull away from the rigid cell wall** → gap appears between membrane and wall.\n5. The cell loses turgor → becomes **flaccid / plasmolysed**.\n\nKey distinction: the **vacuole** shrinks; the **cytoplasm** is what *pulls away*. Examiner penalises 'shrunken cytoplasm'."},

    {"q": "3(a)(iii)", "marks": 1, "tier": "free", "type": "mcq",
     "stem": Q3_STEM, "diagram": "q3-plant-cell",
     "prompt": "**(a)(iii)** Which type of pests **feed on the cell sap** found in part **X** (the vacuole)?",
     "options": [
         {"id": "a", "text": "biting and chewing pests"},
         {"id": "b", "text": "boring pests"},
         {"id": "c", "text": "piercing and sucking pests"},
         {"id": "d", "text": "soil pests"},
     ],
     "correct": "c",
     "memo": "C; [1 mark] — aphids, whiteflies, leafhoppers etc. use needle-like mouthparts to pierce the cell and suck the sap.",
     "examiner_note": "Well answered. Candidates could identify piercing and sucking pests as the type of pest which feed on the cell sap found in X (vacuole).",
     "explanation": "**Cell sap = the fluid inside the vacuole** (water + dissolved sugars, salts, amino acids). To reach it, a pest needs a **needle-like mouth (stylet)** that pierces the cell wall and sucks the contents out.\n\nThe four pest mouthpart types:\n• **Biting and chewing** (locusts, caterpillars) — chew solid leaf tissue, don't single out sap.\n• **Boring** (stem borers, weevils) — tunnel into wood/stem.\n• **Piercing and sucking** ✓ (aphids, whiteflies, scale insects, mealybugs, leafhoppers) — pierce cell, suck cell sap.\n• **Soil pests** (cutworms, white grubs) — feed on roots in soil."},

    {"q": "3(b)", "marks": 3, "tier": "paid", "type": "free_text",
     "stem": "Movement of mineral salts from soil into a plant.", "diagram": None,
     "prompt": "**(b)** Describe the **passage of dissolved mineral salts** from the soil through the vascular tissues.",
     "memo": "Any 3 of (1 mark each):\n• dissolved minerals **diffuse** into the root (from soil water);\n• from higher concentration in soil to lower concentration in root, **down the concentration gradient**;\n• OR moved by **active transport** from lower to higher concentration, **against the gradient using energy**;\n• dissolved minerals are transported via the **xylem vessels**;\n• carried up by the **transpiration pull / stream**;",
     "rubric": "Award 1 mark per distinct stage (max 3). Must mention BOTH the uptake mechanism (diffusion OR active transport) AND xylem transport. PENALISE 'minerals move by osmosis' (osmosis is for water, not minerals).",
     "examiner_note": "Poorly answered. There is a misconception between osmosis and diffusion concepts. Most candidates indicated dissolved mineral salts moving by osmosis instead of diffusing from the soil into the roots. The majority also referred to plant absorbing mineral through the xylem.",
     "explanation": "**Two steps: into the root, then up the plant.**\n\n**Into the root (from soil water → root cells):**\n• When soil mineral concentration > root concentration → **diffusion** down the gradient.\n• When soil concentration < root (more common for nitrate, phosphate, K⁺) → **active transport** using ATP, pulling minerals INTO the root against the gradient.\n\n**Up the plant (from root → leaves):**\n• Minerals are dissolved in water and travel up the **XYLEM** vessels (NOT phloem — phloem carries sugars).\n• Pulled up by the **transpiration stream** — as leaves lose water, more is sucked up from the roots.\n\nCommon traps:\n• **Osmosis ≠ diffusion of minerals.** Osmosis is water only (across a partially permeable membrane).\n• **Xylem ≠ phloem.** Minerals + water go up xylem; sugars go up/down phloem."},

    # ─── Q4: Harrow + maize plant (9 marks) ─────────────────────────────────
    {"q": "4(a)", "marks": 2, "tier": "free", "type": "fill_in",
     "stem": Q4_STEM, "diagram": "q4-harrow",
     "prompt": "**(a)** Identify the implement in Fig. 4.1 and state its function.\nFormat: 'name: ___; function: ___'.",
     "accepted": [
         "name: harrow; function: level the soil",
         "harrow level soil",
         "harrow - levels the soil",
         "harrow, levels soil and breaks clods",
         "harrow; break large soil clods",
         "name harrow function break soil clods",
     ],
     "must_contain": ["harrow"],
     "memo": "name — harrow; function — level the soil / break large soil clods (lumps); [2 marks: 1 name, 1 function]",
     "examiner_note": "Fairly well answered. Some candidates spelled a harrow as 'hallow'. The function of a harrow was mostly referred to as 'harrowing' instead of levelling.",
     "explanation": "**Harrow** = a secondary tillage implement used AFTER ploughing to:\n• **Break up large clods** of soil into a finer tilth\n• **Level the seed bed** so seeds are sown at uniform depth\n• Cover broadcast seed lightly\n• Uproot small weeds\n\nThe diagram shows a frame with many small downward-pointing teeth — that's a spike-tooth (or peg-tooth) harrow being towed.\n\nDon't write 'function: harrowing' — that's circular. The function is *levelling and breaking clods*. Spell **harrow**, not 'hallow'."},

    {"q": "4(b)(i)", "marks": 2, "tier": "free", "type": "fill_in",
     "stem": Q4_STEM, "diagram": "q4-maize-plant",
     "prompt": "**(b)(i)** Identify part **A** in Fig. 4.2 (the structure at the very top of the maize plant) and state its function.\nFormat: 'name: ___; function: ___'.",
     "accepted": [
         "name: tassel; function: produce pollen",
         "tassel produces pollen grains",
         "tassel - produces pollen grains / male sex cells",
         "anthers, produce pollen",
         "tassel pollen",
         "name tassel function produce pollen",
     ],
     "must_contain": ["tassel"],
     "memo": "name — tassel (anthers); function — produce pollen grains / male sex cell; [2 marks: 1 name, 1 function]",
     "examiner_note": "Fairly well answered. Most candidates scored one mark for the tassel but failed to state its function. Tassel was spelled as 'tassen' and 'tessel' by some candidates.",
     "explanation": "**Tassel** = the male flower structure at the very top of a maize plant. It carries the **anthers**, which release **pollen grains** (the male gametes) into the wind.\n\nWind carries the pollen down to the **silk** of the same plant or a nearby plant. Each silk thread is the style of one ovule — when a pollen grain lands on it and grows down, one kernel of maize is fertilised.\n\nSpell carefully: **tassel** (not 'tassen' / 'tessel')."},

    {"q": "4(b)(ii)", "marks": 1, "tier": "paid", "type": "free_text",
     "stem": Q4_STEM, "diagram": "q4-maize-plant",
     "prompt": "**(b)(ii)** The silk in Fig. 4.2 hangs **outside the cob**. State the reason why this is an **advantage** to the plant.",
     "memo": "to trap pollen grains from the wind; [1 mark]",
     "rubric": "Award 1 mark for explicit mention of CATCHING pollen / wind pollination. PENALISE 'so the cob can grow' or generic anatomy descriptions.",
     "examiner_note": "Poorly answered. Most candidates could not state the reason why silk hangs outside the cob.",
     "explanation": "**Silk = the styles of the female flowers**, one thread per ovule (per future kernel of maize).\n\nMaize is **wind-pollinated**. By hanging OUTSIDE the husk of the cob, the silk:\n• Catches airborne pollen grains drifting down from the tassels of nearby plants\n• Each silk that catches a pollen grain → that grain grows down the silk → fertilises ONE kernel\n\nIf the silk stayed inside the cob, it would never meet pollen and the cob would have no kernels. Sticking out is essential to seed set."},

    {"q": "4(c)(i)", "marks": 2, "tier": "free", "type": "fill_in",
     "stem": "Photosynthesis — environmental factors.", "diagram": None,
     "prompt": "**(c)(i)** State **two environmental factors** that the plant leaf needs to make sugars.",
     "accepted": [
         "sunlight and carbon dioxide",
         "sunlight, carbon dioxide",
         "light and CO2",
         "carbon dioxide and water",
         "sunlight and water",
         "light, CO2",
         "sunlight; carbon dioxide",
     ],
     "must_contain": [],
     "memo": "Any 2 of: sunlight; carbon dioxide; water; [2 marks, 1 each]",
     "examiner_note": "Well answered. Only few candidates named factors such [as] wind and humidity.",
     "explanation": "**Photosynthesis equation:** 6 CO₂ + 6 H₂O — (light + chlorophyll) → C₆H₁₂O₆ + 6 O₂\n\nThe **environmental** inputs (i.e. from outside the plant) are:\n1. **Sunlight** (energy source)\n2. **Carbon dioxide** (from the air, via stomata)\n3. **Water** (from soil via roots)\n\nName any TWO. Chlorophyll is an internal pigment (not environmental). Temperature is a *condition* not a *raw material*. Wind and humidity affect transpiration, not the sugar-making reaction directly."},

    {"q": "4(c)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": "Leaf adaptations.", "diagram": None,
     "prompt": "**(c)(ii)** Suggest the **reasons** for the following features of a leaf.\n• large surface area: ___\n• absence of chloroplasts in the epidermis: ___",
     "memo": "1 mark each:\n• large surface area — to expose as much as possible to sunlight / air / gases (maximise absorption of light + CO₂);\n• absence of chloroplasts in the epidermis — enables sunlight to penetrate through to the mesophyll (where chloroplasts are concentrated);",
     "rubric": "Award 1 mark for surface-area reason (must link to light OR gas exchange). Award 1 mark for epidermis reason (must say 'lets light through to mesophyll'). PENALISE 'because it's a leaf' or surface descriptions without function.",
     "examiner_note": "Poorly answered. Most candidates have no knowledge on how the features of the leaf are related to function.",
     "explanation": "**Form follows function — every leaf feature serves photosynthesis:**\n\n• **Large surface area** — bigger area = more sunlight intercepted AND more stomata for CO₂ to enter. More raw materials → more sugars.\n• **Transparent epidermis (no chloroplasts)** — the epidermis is the protective skin layer on top of the leaf. If it had chloroplasts, light would be absorbed there and never reach the **palisade mesophyll** underneath (where MOST chloroplasts are). Keeping the epidermis transparent is like a clear roof on a greenhouse.\n\nOther leaf features and their reasons (for context):\n• Thin → short diffusion path for CO₂\n• Veins → bring water, take sugars away\n• Stomata on lower side → gas exchange + reduces water loss"},

    # ─── Q5: Pasture + ruminant nutrition (10 marks) ───────────────────────
    {"q": "5(a)", "marks": 2, "tier": "free", "type": "fill_in",
     "stem": "Functions of protein in animal diet.", "diagram": None,
     "prompt": "**(a)** Outline **two functions** of protein in animal diet.\nFormat: '1 ___; 2 ___'.",
     "accepted": [
         "1 for growth; 2 for repair of damaged tissues",
         "growth and repair",
         "growth, repair of worn tissues",
         "for growth and replacement of damaged cells",
         "growth; production",
         "1 growth 2 production",
         "growth and production",
     ],
     "must_contain": [],
     "memo": "Any 2 of (1 mark each): for growth; for repair of damaged/worn out tissues (replacement of lost or damaged cells); for production (milk, eggs, wool);",
     "examiner_note": "Well answered. Candidates know the functions of protein in animal diet.",
     "explanation": "**Protein supplies amino acids — the building blocks of body tissues.** Main uses:\n\n1. **Growth** — building new cells, muscle, bone matrix, organs (especially in young animals)\n2. **Repair / replacement** — replacing worn-out cells, healing wounds, replacing skin cells, gut lining, blood cells\n3. **Production** — making milk protein (casein), egg protein (albumin), wool keratin, etc.\n4. (Minor) Energy if carbohydrate/fat insufficient — but protein is too expensive for this normally.\n\nAny TWO of those score full marks."},

    {"q": "5(b)(i)", "marks": 1, "tier": "paid", "type": "free_text",
     "stem": Q5_STEM, "diagram": "q5-pasture-graph",
     "prompt": "**(b)(i)** Describe the **relationship** between the **protein content** and the **age of the pasture**.",
     "memo": "as the pasture reaches maturity / gets older, protein starts to decline / decrease (and vice versa); [1 mark]",
     "rubric": "Award 1 mark for INVERSE relationship (older = less protein, younger = more protein). PENALISE bare 'they differ' or restating the numbers without describing the trend.",
     "examiner_note": "Poorly answered. Most candidates were challenged to analyse data in order to establish the relationship between the protein content and the age of the pasture. Most candidates do not know the difference between dependent variable and independent variable.",
     "explanation": "**Inverse / negative relationship: as age increases → protein decreases.**\n\nFrom Fig 5.1:\n• Young pasture (4 weeks, active growth): 16% protein\n• Mid-stage (mid-flowering): 10% protein\n• Old (dry stalks): only 4% protein\n\nWhy: young grass is mostly leaves (high protein); as it matures it flowers, seeds, dries out, and the proportion of stalks (mostly cellulose — low protein) increases.\n\nFarming consequence: cattle on old, dry pasture aren't getting enough protein → growth slows and milk yield drops → that's when you supplement (see (b)(ii))."},

    {"q": "5(b)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q5_STEM, "diagram": "q5-pasture-graph",
     "prompt": "**(b)(ii)** The percentage of digestibility can be used by a farmer as an indicator of when supplementary feeds can be introduced.\n\nSuggest, with a reason, from which **percentage of digestibility** of the pasture in Fig. 5.1 will the farmer be required to start introducing **supplementary feeds**.",
     "memo": "Both required (1 mark each):\n• 50% (digestibility);\n• to correct nutrient imbalance present in the available pasture / the grass is dry / it has less nutritional value / low protein / low energy;",
     "rubric": "Award 1 mark for stating ≈50% as the threshold. Award 1 mark for any valid REASON (drop in nutritional value, dry grass, low protein/energy). PENALISE giving only a number or only a reason — both required.",
     "examiner_note": "Poorly answered. Most candidates found it difficult to analyse data given in order to make a suggestion on when and why to introduce supplementary feeds.",
     "explanation": "**Threshold ≈ 50% digestibility** (below this, even a full belly isn't enough).\n\nFrom Fig 5.1, digestibility drops as pasture ages. Once it falls below ~50%:\n• A cow eats the maximum she can but absorbs less and less of it.\n• Protein and energy are also at low levels (only 10% protein, 7.5 MJ/kg by mid-flowering).\n• The deficit must be made up with **supplementary feeds** (concentrates, hay, silage, mineral licks).\n\nWithout supplements: weight loss, lower milk yield, poor reproduction.\n\nRule of thumb in extensive grazing: by the late dry season, every cow needs supplements."},

    {"q": "5(b)(iii)", "marks": 3, "tier": "paid", "type": "calculation",
     "stem": "A sheep eats 10 kg of dry matter that has 40% digestibility.", "diagram": None,
     "prompt": "**(b)(iii)** Work out the **dry matter** that will be **excreted in the faeces**.\nShow your working. Answer in kg.",
     "correct": {"value": 6, "tolerance": 0.05, "unit": "kg", "accept_units": ["kg", "kilogram", "kilograms"]},
     "memo": "Working:\nDigested = 40% × 10 = (40/100) × 10 = **4 kg**\nExcreted in faeces = total − digested = 10 − 4 = **6 kg**;\n[3 marks: 1 for digested fraction, 1 for subtraction, 1 for final answer with unit]",
     "examiner_note": "Fairly well answered. Most candidates could score two marks, losing the third mark for failing to calculate the mass excreted in faeces or failing to write the final answer with the unit (kg).",
     "explanation": "**Digestibility = the fraction of dry matter the animal can actually absorb.** The rest comes out as faeces.\n\nStep 1 — How much DID the sheep digest?\n• 40% of 10 kg = (40/100) × 10 = **4 kg digested**\n\nStep 2 — How much was NOT digested (= excreted)?\n• 10 kg eaten − 4 kg digested = **6 kg in faeces** ✓\n\nUnit: **kg** (always include the unit — examiners are strict)."},

    {"q": "5(c)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": "Continuous grazing.", "diagram": None,
     "prompt": "**(c)** State **two disadvantages** of a **continuous grazing system**.",
     "memo": "Any 2 of (1 mark each):\n• may lead to overgrazing;\n• may encourage the building up of disease causing organisms / difficult to control diseases and parasites;\n• pasture never gets time to recover;\n• may lead to low yield per animal;\n• controlled breeding may be difficult;\n• quality of livestock products may be low;\n• may lead to soil erosion;",
     "rubric": "Award 1 mark per distinct disadvantage (max 2). PENALISE repetition (e.g. 'overgrazing' and 'pasture damage' = one point).",
     "examiner_note": "Well answered. Most candidates have knowledge on continuous grazing system.",
     "explanation": "**Continuous grazing** = animals stay on the SAME piece of land all year round, with no break for the pasture.\n\nProblems:\n• **Overgrazing** — favoured plants are eaten down to the soil before they can regrow.\n• **No pasture recovery** — grass needs a rest period to regrow leaves and replenish root reserves.\n• **Parasite build-up** — worm eggs in dung re-infect the same animals continuously (rotation breaks the parasite cycle).\n• **Selective grazing** — animals only eat the tastiest species → unpalatable species (often invasive) take over.\n• **Soil erosion** on bare patches\n• **Controlled breeding** harder — bulls and cows always together\n\nCompare with **rotational grazing** which avoids most of these by moving stock between paddocks."},

    # ─── Q6: Reproduction + breeds (16 marks) ──────────────────────────────
    {"q": "6(a)", "marks": 4, "tier": "free", "type": "fill_in",
     "stem": Q6_STEM, "diagram": "q6-reproductive",
     "prompt": "**(a)** Using letters from Fig. 6.1, indicate in which reproductive part of the farm animal the following events occur.\n1 semen is deposited during mating: ___\n2 production of fluid that nourishes the sperm cell: ___\n3 oestrogen is produced: ___\n4 immature sperm cells are stored: ___\n\nFormat: '1 X 2 Y 3 Z 4 W'.",
     "accepted": [
         "1 E 2 F 3 C 4 H",
         "1E 2F 3C 4H",
         "E F C H",
         "E, F, C, H",
         "1-E 2-F 3-C 4-H",
     ],
     "must_contain": ["E", "F", "C", "H"],
     "memo": "1 — E (vagina/cervix where semen is deposited);\n2 — F (seminal vesicles — produce nourishing fluid);\n3 — C (ovary — produces oestrogen);\n4 — H (epididymis — stores immature sperm);\n[4 marks, 1 each]",
     "examiner_note": "Well answered. However, some candidates wrote the name of the parts instead of letters.",
     "explanation": "**Mapping events to anatomical parts:**\n\n1. **Semen deposition** → into the **vagina/cervix** (E) during mating. Sperm then swim up.\n2. **Nourishing fluid for sperm** → from the **accessory glands**, especially the **seminal vesicles (F)**. The fluid + sperm together = semen.\n3. **Oestrogen production** → by the **ovary (C)** in the cow (oestrogen is the female reproductive hormone that triggers heat/oestrus).\n4. **Sperm storage (maturation)** → in the **epididymis (H)** — sperm are made in the testis but mature and are stored in the epididymis until ejaculation.\n\nWrite LETTERS, not part names — the question asks for letters."},

    {"q": "6(b)(i)", "marks": 3, "tier": "paid", "type": "free_text",
     "stem": "Genetic modification in animals. Fig. 6.2 shows: bacterium with insect-resistant gene → copy of gene extracted → inserted into regular cow → insect-resistant cow.", "diagram": "q6-gmo",
     "prompt": "**(b)(i)** Explain what is meant by the terms **genetic modification** and **gene**.\n• genetic modification: ___\n• gene: ___",
     "memo": "All required:\n• genetic modification (2 marks) — manipulating the action of a gene to produce a new one with new characteristic; OR copying a gene from one organism and moving it into another in order to change the genetic make-up of that organism;\n• gene (1 mark) — basic unit of inheritance that determines a characteristic of an organism;",
     "rubric": "Award up to 2 for genetic modification (must include 'moving/manipulating gene' AND 'change characteristic'). Award 1 for gene (must say 'unit of inheritance' OR 'determines a characteristic'). PENALISE 'allele/version of a gene' for gene (that's an allele, not a gene).",
     "examiner_note": "Poorly answered. Most candidates could not give the correct explanation of genetic modification and gene. Gene was mostly referred to as an alternative form of a gene.",
     "explanation": "**Gene** = the **basic unit of inheritance** — a stretch of DNA that codes for one trait/characteristic of an organism (e.g. coat colour, milk yield, disease resistance). Don't confuse with **allele** (a *version* of a gene — e.g. black vs red coat).\n\n**Genetic modification (GM, transgenesis)** = deliberately changing an organism's DNA, usually by:\n1. **Cutting out** a gene from one organism (here, an insect-resistance gene from a bacterium)\n2. **Inserting** it into another organism's genome (here, the cow)\n3. The modified organism now expresses the new trait (insect resistance)\n\nThis is different from selective breeding (which just chooses parents); GM directly edits the DNA."},

    {"q": "6(b)(ii)", "marks": 3, "tier": "paid", "type": "free_text",
     "stem": "Positive effects of genetic modification in farm animals.", "diagram": None,
     "prompt": "**(b)(ii)** Other than insect resistance, suggest **three positive effects** of genetic modification to farm animals.",
     "memo": "Any 3 of (1 mark each):\n• improve fertility;\n• improve quality of products;\n• increase the yield;\n• fast growth;\n• increase disease resistance;\n• better-tasting meat;\n• adaptation to harsh environment / local conditions;\n• drought resistance;",
     "rubric": "Award 1 mark per distinct benefit (max 3). PENALISE negative effects (the question specifies POSITIVE), and repetition of one idea in different words.",
     "examiner_note": "Well answered. Only few candidates referred to the negative effects of genetic modification.",
     "explanation": "**GM in livestock** lets breeders introduce specific desirable traits much faster than traditional breeding. Beyond insect resistance:\n\n1. **Faster growth** — animals reach market weight sooner (less feed needed)\n2. **Higher yields** — more milk per cow, more eggs per hen, more wool per sheep\n3. **Disease resistance** — built-in immunity to mastitis, foot-and-mouth, etc.\n4. **Better product quality** — leaner meat, higher protein milk, longer-staple wool\n5. **Improved fertility** — more offspring per breeding cycle\n6. **Drought / heat tolerance** — vital for African and Namibian conditions\n7. **Better feed conversion** — same feed produces more meat/milk → cheaper farming\n\nThe question wants POSITIVE only — don't list 'ethical concerns' etc."},

    {"q": "6(c)(i)", "marks": 1, "tier": "free", "type": "fill_in",
     "stem": Q6_STEM + " Fig. 6.3 shows two beef breeds: Brahman (hump on shoulders, large drooping ears) and breed W (multi-coloured/spotted hide, long curved horns).", "diagram": "q6-breeds",
     "prompt": "**(c)(i)** Identify breed **W**.",
     "accepted": ["Sanga", "Nguni", "Sanga or Nguni", "sanga", "nguni"],
     "must_contain": [],
     "memo": "Sanga / Nguni; [1 mark — either accepted]",
     "examiner_note": "Well answered. Few candidates lost a mark for spelling Sanga as Kasanga/Kasongo/Sang and for spelling Nguni as Nungi/Guni.",
     "explanation": "**Breed W = Sanga (also called Nguni)** — an indigenous Southern African breed.\n\nID features:\n• **Multi-coloured spotted hide** (no two animals look the same)\n• **Long curved horns**\n• Medium frame, smooth coat\n• Highly **adapted to local conditions** — drought, ticks, disease\n\nDifferent from Brahman (Asian Bos indicus origin — large hump, drooping ears, single-colour).\n\nSpell carefully: **Sanga** or **Nguni** — both score. 'Kasanga' or 'Nungi' do NOT score."},

    {"q": "6(c)(ii)", "marks": 4, "tier": "paid", "type": "free_text",
     "stem": Q6_STEM + " Fig. 6.3 shows Brahman.", "diagram": "q6-breeds",
     "prompt": "**(c)(ii)** Many local commercial farmers prefer to farm with **Brahman breed**. Outline the **characteristics of Brahman** that might have influenced their preference.",
     "memo": "Any 4 of (1 mark each):\n• tolerate drought;\n• parasites / diseases resistant;\n• adapted to local conditions / withstands high temperature;\n• provides meat of good quality;\n• high yield / more meat;\n• longevity (lives long, productive years);",
     "rubric": "Award 1 mark per distinct trait (max 4). PENALISE generic 'good for farming' or repetition of one idea.",
     "examiner_note": "Well answered. However, the spelling of meat and drought was a challenge to some candidates. They were spelled as 'meet' and 'draught' respectively.",
     "explanation": "**Brahman (Bos indicus, originally from India)** is the most common beef breed in Namibia's commercial farms. Why:\n\n1. **Drought tolerant** — can go longer without water than European breeds\n2. **Heat tolerant** — loose skin, dark pigmentation under skin, large hump store water and energy\n3. **Tick / parasite resistant** — thick skin and natural oils repel ticks; resistant to tick-borne diseases\n4. **Heat-stable metabolism** — eats efficiently even at 35-40 °C when European breeds stop grazing\n5. **High meat yield** — large frame, finishes to good carcass weight\n6. **Long productive life** (longevity) — cows breed for many years\n7. **Adapted to sparse veld** — can convert low-quality grazing into meat\n\nSpell **meat** (not meet) and **drought** (not draught)."},

    {"q": "6(c)(iii)", "marks": 1, "tier": "paid", "type": "free_text",
     "stem": Q6_STEM + " Breed W (Sanga/Nguni) has long horns.", "diagram": "q6-breeds",
     "prompt": "**(c)(iii)** State **one threat** that breed **W** poses to other animals on the farm.",
     "memo": "long horns that can injure other animals; [1 mark]",
     "rubric": "Award 1 mark for a SPECIFIC threat (long horns → injury). PENALISE bare 'they are dangerous' without saying why.",
     "examiner_note": "Poorly answered. Most candidates could not understand what is meant by 'threat' and 'poses'. As a result, they could only give the characteristic of breed W.",
     "explanation": "Breed W (Sanga / Nguni) has **long, curved horns**. In a mixed herd these horns are a **safety hazard**:\n\n• Can **injure other cattle** during dominance fights or normal jostling at feeding/watering points\n• Can injure smaller stock (calves, goats, sheep) sharing the kraal\n• Can damage fencing and handling facilities\n• Can injure farm workers\n\nMany commercial farmers **dehorn** Sanga/Nguni calves at a few weeks old to avoid this. Polled (naturally hornless) genetics are also being bred in.\n\nKey: the question asks for a THREAT (something dangerous), not a characteristic. 'Long horns' alone is a feature — link it to INJURY for the mark."},

    # ─── Q7: Community forests + conservancies (11 marks) ───────────────────
    {"q": "7(a)(i)", "marks": 2, "tier": "free", "type": "free_text",
     "stem": Q7_STEM, "diagram": "q7-trees",
     "prompt": "**(a)(i)** State **two possible reasons** why people cut down trees.",
     "memo": "Any 2 of (1 mark each):\n• timber / furniture / wood carving;\n• create agricultural space / farming;\n• building houses / infrastructure / roads;\n• firewood (fuel for cooking and heating);",
     "rubric": "Award 1 mark per distinct reason (max 2). PENALISE repetition (e.g. 'wood for chairs' AND 'wood for tables' = one use).",
     "examiner_note": "Well answered. Candidates could suggest reasons for the cutting down of trees in community forests.",
     "explanation": "**Why rural communities cut trees:**\n\n1. **Firewood** — still the main cooking fuel in most rural Namibian households\n2. **Timber for construction** — house poles, fence posts, roofing\n3. **Furniture / wood carving** — chairs, tables, curios for sale\n4. **Clearing land for farming** — making space for crop fields or grazing\n5. **Charcoal production** — both for own use and as a cash crop\n6. **Road / infrastructure development**\n\nAny TWO of these score full marks. Make them DISTINCT (e.g. don't write 'firewood' + 'fuel' = same point)."},

    {"q": "7(a)(ii)", "marks": 4, "tier": "paid", "type": "free_text",
     "stem": Q7_STEM, "diagram": "q7-trees",
     "prompt": "**(a)(ii)** Suggest the **problems** this community might experience in **future** as a result of their action in Fig. 7.1.",
     "memo": "Any 4 of (1 mark each):\n• floods;\n• limited supply of wood / timber in future;\n• no herbal medication;\n• loss of habitat for animals and birds;\n• disturb water cycle;\n• heat waves;\n• loss of fertile top soil / soil erosion;",
     "rubric": "Award 1 mark per distinct LOCAL community impact (max 4). PENALISE 'global warming' (the question says THIS community, not the planet) and repetition.",
     "examiner_note": "Fairly well answered. Most candidates referred to deforestation [as] an activity illustrated in the diagram. Few candidates looked at global problems such as global warming while the question makes reference to a specific community.",
     "explanation": "**Local consequences of cutting all the trees in a community forest:**\n\n1. **Flooding** — no roots to slow water, no canopy to break rain → runoff floods low ground.\n2. **Soil erosion** — bare ground washed away, losing topsoil that took centuries to form.\n3. **Wood shortage** — the same community soon has no firewood or timber.\n4. **Loss of medicinal plants** (herbal medication) — many useful species grow only in intact forest.\n5. **Loss of wildlife habitat** — birds, small mammals, bees lose nesting sites; the community loses honey, bushmeat, eco-tourism income.\n6. **Disrupted water cycle** — fewer trees = less transpiration = less local rain; springs and rivers may dry.\n7. **Heat waves** — no shade, soil heats up, microclimate becomes hotter and drier.\n\nFour DISTINCT impacts = 4 marks. Keep them LOCAL — global warming isn't the angle here."},

    {"q": "7(b)", "marks": 4, "tier": "paid", "type": "free_text",
     "stem": "Establishing a community forest in Namibia.", "diagram": None,
     "prompt": "**(b)** Outline any **four steps** that a community must follow if it wishes to **establish a community forest**.",
     "memo": "Any 4 of (1 mark each):\n• community agreement;\n• form community resource management bodies;\n• stakeholder identification;\n• define jurisdiction;\n• identify land-use units;\n• describe land-use units;\n• develop / set objectives and regulations;\n• benefit distribution plan;\n• management plan (documents and documentation);\n• review and discussion of management plan;\n• gazetting application;\n• gazetting (officially declared in Government Gazette);\n• initiation phase;\n• application and declaration phase;\n• implementation and monitoring phase;",
     "rubric": "Award 1 mark per distinct procedural step (max 4). ACCEPT steps in any order. PENALISE conservancy-establishment steps if confused with community forest.",
     "examiner_note": "Fairly well answered. Some candidates referred to the requirements that must be met to establish a conservancy.",
     "explanation": "**Setting up a community forest in Namibia (Forest Act, 2001):**\n\n1. **Community agreement** — community first decides it wants a forest\n2. **Form a Forest Management Body** (committee responsible for running the forest)\n3. **Identify stakeholders** — traditional authority, neighbouring communities, ministry\n4. **Demarcate jurisdiction** — clear boundaries of the forest area\n5. **Define land-use units** — separate zones for grazing, harvesting, conservation, tourism\n6. **Set objectives & regulations** — what can/can't be done in each zone\n7. **Benefit-distribution plan** — how income from forest products is shared\n8. **Draft a management plan** — formal document to submit\n9. **Application** to the Ministry of Agriculture / Directorate of Forestry\n10. **Gazetting** — official Government Gazette publication confirms legal status\n11. **Implementation & monitoring** — ongoing\n\nList any FOUR for full marks."},

    {"q": "7(c)", "marks": 1, "tier": "free", "type": "mcq",
     "stem": "First conservancies gazetted in Namibia.", "diagram": None,
     "prompt": "**(c)** Which **communal conservancy** was among the **first four conservancies** that were **gazetted in Namibia in 1998**?",
     "options": [
         {"id": "a", "text": "//Gamaseb"},
         {"id": "b", "text": "Khoadi-//Hôas"},
         {"id": "c", "text": "King Nehale"},
         {"id": "d", "text": "Lusese"},
     ],
     "correct": "b",
     "memo": "B; [1 mark] — Khoadi-//Hôas was one of the first four conservancies gazetted in 1998 (along with Nyae Nyae, Salambala and ≠Khoadi //Hôas).",
     "examiner_note": "Poorly answered. Candidates lack knowledge about the history of conservancies in Namibia.",
     "explanation": "**The first four communal conservancies** were gazetted in **1998** under Namibia's CBNRM (Community-Based Natural Resource Management) programme:\n\n1. **Nyae Nyae** (Otjozondjupa)\n2. **Salambala** (Zambezi)\n3. **#Khoadi-//Hôas** (Kunene)\n4. **Torra** (Kunene)\n\nOf the four MCQ options, only **Khoadi-//Hôas (B)** is in that founding group.\n\nNamibia now has ~86 communal conservancies covering ~20% of the country — a world-leading conservation model that returns wildlife revenue to rural communities."},

    # ─── Q8: Gross margin + value-adding (12 marks) ────────────────────────
    {"q": "8(a)(i)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q8_STEM, "diagram": "q8-enterprise",
     "prompt": "**(a)(i)** Define **gross margin**.",
     "memo": "amount of money remaining; once the variable cost has been deducted from the overall outputs of the enterprise; [2 marks: 1 for 'money remaining', 1 for 'variable costs subtracted from output/income']",
     "rubric": "Award 1 mark for 'money / amount remaining'. Award 1 mark for explicit 'variable costs subtracted from gross income/output'. PENALISE definitions that say 'profit minus all costs' (that's net profit, not gross margin).",
     "examiner_note": "Poorly answered. Candidates could not define gross margin. Few candidates that made an attempt, but failed to indicate where the variable costs were deducted.",
     "explanation": "**Gross margin = Gross income (output) − Variable costs.**\n\nIt's the money left over AFTER paying for the variable inputs that change with how much you produce (seeds, fertiliser, insecticide). It does NOT yet subtract fixed costs (rent, labour, depreciation).\n\nWhy farmers use it:\n• Quick measure of how PROFITABLE one crop / enterprise is\n• Easy to compare two enterprises (maize vs sorghum) on the same farm\n• Tells you whether each extra hectare is worth planting\n\nDifferent from:\n• **Net profit** = Gross margin − Fixed costs\n• **Gross income** = total sales (before subtracting anything)"},

    {"q": "8(a)(ii)", "marks": 4, "tier": "paid", "type": "calculation",
     "stem": Q8_STEM + "\n\n(Output: 1620 kg/ha × 2 ha = 3 240 kg sold at N\\$ 10/kg = N\\$ 32 400 gross income. Variable costs total N\\$ 1 500 + N\\$ 2 100 + N\\$ 3 500 = N\\$ 7 100.)", "diagram": "q8-enterprise",
     "prompt": "**(a)(ii)** Calculate the **gross margin** obtained from the maize enterprise in Fig. 8.1. Show your working and the formula used.\nAnswer in N$.",
     "correct": {"value": 25300, "tolerance": 0.5, "unit": "N$", "accept_units": ["N$", "N $", "NAD", "n$", "n $"]},
     "memo": "Working:\nTotal output / gross income = 1 620 × 2 ha = 3 240 kg → × N\\$ 10 = N\\$ 32 400.00;\nGross margin = Gross income − variable costs;\n= 32 400.00 − 7 100;\n= **N\\$ 25 300.00**;\n[4 marks: 1 yield, 1 gross income, 1 formula, 1 final answer]",
     "examiner_note": "Poorly answered. Candidates found it very difficult to work out the total outputs/gross income of an enterprise, which was a prerequisite to calculating the gross margin. The formula to calculate gross margin is not known.",
     "explanation": "**Four steps — write each one to show working:**\n\n**Step 1 — Total kg of maize harvested:**\n• 1 620 kg/ha × 2 ha = **3 240 kg**\n\n**Step 2 — Gross income (output × price):**\n• 3 240 kg × N\\$ 10/kg = **N\\$ 32 400**\n\n**Step 3 — Total variable costs:**\n• N\\$ 1 500 + N\\$ 2 100 + N\\$ 3 500 = **N\\$ 7 100**\n\n**Step 4 — Gross margin:**\n• **Gross margin = Gross income − Variable costs**\n• = 32 400 − 7 100 = **N\\$ 25 300** ✓\n\nNote: fixed costs (rent + labour = N\\$ 8 050) are NOT subtracted at this stage — that comes when calculating NET profit, not gross margin."},

    {"q": "8(a)(iii)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": Q8_STEM + " Gross margin = N\\$ 25 300; fixed costs (rent + labour) = N\\$ 4 000 + N\\$ 4 050 = N\\$ 8 050.", "diagram": "q8-enterprise",
     "prompt": "**(a)(iii)** State whether the enterprise in Fig. 8.1 has made a **profit** or a **loss**. Give a **reason** for your answer.",
     "memo": "Both required (1 mark each):\n• profit;\n• the farm outputs / income are more than the inputs / expenses;",
     "rubric": "Award 1 mark for 'profit'. Award 1 mark for justifying it (e.g. 'income > total costs', or specific numbers: 32 400 > 7 100 + 8 050 = 15 150). PENALISE 'loss' without arithmetic — it's wrong (the figures clearly show a profit).",
     "examiner_note": "Fairly well answered. Most candidates could get a mark for indicating profit but they could not justify their answer. Others lost all the marks for stating that the enterprise made a loss.",
     "explanation": "**Profit check: Income > Total costs.**\n\n• Income = N\\$ 32 400\n• Variable costs = N\\$ 7 100\n• Fixed costs = N\\$ 4 000 + N\\$ 4 050 = N\\$ 8 050\n• **Total costs = 7 100 + 8 050 = N\\$ 15 150**\n• **Net profit = 32 400 − 15 150 = N\\$ 17 250** → enterprise is profitable ✓\n\nSo the answer is **PROFIT**, and the reason is that **income exceeds total expenses** (or equivalently, the gross margin of N\\$ 25 300 is more than fixed costs of N\\$ 8 050)."},

    {"q": "8(b)", "marks": 2, "tier": "free", "type": "fill_in",
     "stem": "Value-added agricultural products: A = Yogurt; B = Canned tuna.", "diagram": "q8-yogurt-tuna",
     "prompt": "**(b)** Suggest the **methods used in preserving** products A (yogurt) and B (canned tuna).\nFormat: 'A: ___; B: ___'.",
     "accepted": [
         "A culturing B canning",
         "A: culturing; B: canning",
         "A fermentation B canning",
         "A homogenization B canning",
         "A: fermentation B: canning",
         "culturing and canning",
         "A culturing/fermentation; B canning",
     ],
     "must_contain": ["canning"],
     "memo": "A — culturing / homogenisation / fermentation;\nB — canning;\n[2 marks, 1 each]",
     "examiner_note": "A — Poorly answered. The value-added product was unfamiliar to candidates. Therefore, suggesting the preservation method used was difficult. B — Well answered. Candidates could easily identify canning as a preservation method for product B. Canning was, however, spelled as 'curning' / 'carning' / 'scanning'.",
     "explanation": "**A — Yogurt** is preserved (and made!) by **fermentation / culturing**:\n• Live bacteria (Lactobacillus, Streptococcus) are added to milk\n• They convert lactose to lactic acid → low pH → spoilage bacteria can't grow\n• Often also **homogenised** (fat mixed in uniformly) and refrigerated\n\n**B — Canned tuna** is preserved by **canning**:\n• Fish is sealed in an air-tight can\n• Heated under pressure to ~120 °C (kills all bacteria and spores)\n• Cooled — no oxygen, no microbes → keeps for years at room temperature\n\nSpell **canning** (not curning / scanning)."},

    {"q": "8(c)", "marks": 2, "tier": "paid", "type": "free_text",
     "stem": "Effect of HIV/AIDS among farm workers on value-adding.", "diagram": None,
     "prompt": "**(c)** Explain how the **addition of value to agricultural products on the farm** may be affected by the **occurrence of HIV/AIDS among farm workers**.",
     "memo": "Any 2 of (1 mark each):\n• farm productivity decreases;\n• workforce too sick to work;\n• high absenteeism;",
     "rubric": "Award 1 mark per distinct productivity impact (max 2). PENALISE answers about HIV TRANSMISSION (not the question) or stigmatising statements about consumers refusing to buy.",
     "examiner_note": "Well answered. However, some candidates referred to HIV transmission and how consumers will not buy food produced by HIV/AIDS farm workers (a sign of stigmatization).",
     "explanation": "**Value-adding** (processing milk → cheese, tomatoes → sauce, meat → biltong) is **labour-intensive**. When workers fall ill with HIV/AIDS:\n\n1. **Farm productivity drops** — fewer hours of skilled work go into processing\n2. **Workforce too sick to work** — skilled processors lose strength; quality suffers\n3. **High absenteeism** — workers off sick or attending funerals → batch processing can't keep up\n4. (Knock-on) Training costs rise as the farm has to retrain replacements\n\nFocus on PRODUCTIVITY. Avoid:\n• How HIV spreads (irrelevant)\n• Statements that consumers won't buy from HIV-positive workers (stigmatising AND incorrect — HIV does not pass through food)."},

    # ═══════════════════════════════════════════════════════════════════════
    # SECTION B — 4 extended-response essays, 15 marks each, choose any TWO
    # All marked as 'essay' type — large textarea, AI-marked against memo
    # ═══════════════════════════════════════════════════════════════════════
    # ─── Q9: Beef exports, marketing channels, beef weaner rations (15) ────
    {"q": "9(a)", "marks": 6, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q9 — Beef cattle exports and standards.", "diagram": None,
     "prompt": "**Q9 (a)** Name **two countries** that import beef cattle from Namibia AND explain the **international standards** that Namibia must meet before beef cattle are exported. [6]",
     "memo": "Countries (2 marks, 1 each — any 2 of): South Africa; Angola; (accept Botswana, Zimbabwe, Zambia);\nStandards (4 marks, 1 each — any 4 of):\n• movement permit and export permit are required;\n• all animals must be clearly marked / ear-tagged / branded;\n• all animals must be healthy / disease-free;\n• all animals must be vaccinated;\n• all animals must be parasite-free / treated for internal parasites (72 hours before export);\n• animal loading and truck sealing must be done under veterinary supervision;",
     "rubric": "Award 1 mark per country (max 2) and 1 mark per standard (max 4). PENALISE generic 'must be good quality' — needs specific veterinary/regulatory requirements.",
     "examiner_note": "The question was fairly answered. Candidates could name at least one country (South Africa) that import beef cattle from Namibia. On international standards for exporting beef cattle, some candidates referred to requirements for exporting beef (meat).",
     "explanation": "**Live beef cattle export from Namibia — major markets:**\n• **South Africa** — biggest single buyer (feedlots and abattoirs)\n• **Angola** — growing market north of the border\n• Also: Botswana, Zambia, Zimbabwe\n\n**Veterinary / regulatory requirements (set by DVS — Directorate of Veterinary Services):**\n1. **Permits** — movement permit + export permit issued by DVS\n2. **Identification** — every animal ear-tagged or branded with traceable ID\n3. **Health certification** — vet inspection certifying disease-free status\n4. **Vaccinations** up to date (anthrax, foot-and-mouth, etc.)\n5. **Parasite treatment** — internal parasites dosed 72 h before loading\n6. **Loading under vet supervision** — truck sealed and certified by an official vet at the loading point\n7. Compliance with importing country's specific rules (e.g. FMD-free zone certification)\n\nThese rules protect Namibia's hard-won FMD-free status south of the veterinary cordon fence — the basis for premium beef access to EU and other markets."},

    {"q": "9(b)", "marks": 5, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q9 — Marketing channels in agriculture.", "diagram": None,
     "prompt": "**Q9 (b)** Discuss **five ways** in which **marketing channels may pose problems** in agriculture production. [5]",
     "memo": "Any 5 of (1 mark each):\n• distance from the point of production at the farm to consumers (long supply chain);\n• lack of good transport;\n• long chain of middlemen / too many agents (reduce farmer's share);\n• lack of storage facilities / cooling facilities;\n• forced sales (farmer must sell at whatever price is offered because produce is perishable);\n• farms far apart over a large area (high collection cost);",
     "rubric": "Award 1 mark per DISTINCT problem (max 5). PENALISE repetition (e.g. 'no roads' AND 'bad transport' = one point).",
     "examiner_note": "Poorly answered. Only few candidates could discuss ways marketing channels pose problems in agriculture production scoring 2-3 marks but majority scored 0 mark, a sign that they lack knowledge on the topic (marketing of agricultural produce).",
     "explanation": "**Marketing channel = the path farm produce takes from the farmer to the consumer.** In Namibia (sparse population, long distances) it's full of friction:\n\n1. **Long distance farm → market** — most commercial farms are 500+ km from major cities; transport eats into margins.\n2. **Poor transport infrastructure** — gravel roads, few cold-chain trucks; produce spoils en route.\n3. **Too many middlemen** — auctioneer + transporter + wholesaler + retailer each take a cut → farmer gets a small share of consumer price.\n4. **Lack of storage / cold facilities** — milk, vegetables, meat must move quickly or rot.\n5. **Forced sales** — perishable produce + no storage = farmer accepts whatever price the buyer offers (no bargaining power).\n6. **Geographic spread of farms** — collecting small loads from far-apart farms is expensive.\n7. **Limited market information** — farmers can't compare prices across buyers.\n\nFive of these = full marks."},

    {"q": "9(c)", "marks": 4, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q9 — Finishing beef weaners for marketing.", "diagram": None,
     "prompt": "**Q9 (c)** Discuss **suitable rations** that would be required to **finish off beef weaners** for marketing. [4]",
     "memo": "All required:\n• **production ration** (extra protein-rich feed);\n• extra food / feed given to animal / more protein → to gain more weight / achieve additional output / grow;\n• **maintenance ration / balanced ration**;\n• to ensure normal functioning of body processes / maintain good health / prevent deficiency diseases;\n[4 marks: 1 each — naming production ration, its purpose, naming maintenance ration, its purpose]",
     "rubric": "Award 1 mark for naming each ration type and 1 mark for each correct purpose. PENALISE bare lists of feeds without saying WHY.",
     "examiner_note": "Fairly answered. Most candidates could mention the two suitable rations but they were unable to state why those rations are given to finish off beef weaners for marketing.",
     "explanation": "**Finishing a beef weaner = the last few months before slaughter**, where you push weight gain and fat cover. Two ration types together:\n\n**1. Production ration** (the 'extra')\n• Energy- and protein-dense concentrates (maize meal + protein source like oilcake)\n• Aim: rapid weight gain → bigger carcass → higher price per animal\n• Without this, the animal would only maintain its current weight\n\n**2. Maintenance ration** (the basic)\n• Roughage (hay, silage, veld grazing) — keeps the rumen working\n• Vitamin and mineral supplements\n• Aim: keep all body processes (heart, respiration, digestion, immunity) functioning normally\n• Prevents deficiency diseases (e.g. phosphorus deficiency, vitamin A)\n\n**Together** = balanced finishing diet — maintains health AND drives weight gain. Without the maintenance side, you push weight but the animal gets sick; without the production side, no profit from finishing."},

    # ─── Q10: Beef breeds, breeding cycle, overstocking (15) ───────────────
    {"q": "10(a)", "marks": 4, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q10 — Namibian beef breeds (other than Brahman).", "diagram": None,
     "prompt": "**Q10 (a)** Name **two beef breeds** recommended for use in Namibia other than Brahman AND describe the **importance of their products to the economy**. [4]",
     "memo": "Breeds (any 2 of, 1 mark each): Bonsmara; Sanga / Nguni (Indigenous); Afrikaner; Hereford; Simmentaler;\nImportance to economy (2 marks, 1 each — any 2 of):\n• beef is exported to provide foreign currency;\n• beef is sold to provide income;\n• hides provide raw materials / leather / processed into upholstery / cattle leather produces garments / accessories;",
     "rubric": "Award 1 mark per named breed (max 2) and 1 mark per distinct economic contribution (max 2). PENALISE breed characteristics rather than economic role.",
     "examiner_note": "Well answered. Only few candidates focused on the characteristics of the breeds rather than on the importance of their products to the economy. The spelling of beef breeds (Bonsmara, Sanga/Nguni and Simmentaler) was a problem.",
     "explanation": "**Beef breeds recommended for Namibia (other than Brahman):**\n• **Bonsmara** — South African composite (5/8 Afrikaner + 3/16 Hereford + 3/16 Shorthorn). Heat-tolerant, good fertility, common across commercial farms.\n• **Sanga / Nguni** — indigenous, multi-coloured, disease-resistant; popular in communal areas.\n• **Afrikaner** — large red breed, drought-tolerant, used in many crosses.\n• **Hereford** — British breed, white face; good meat quality, used in feedlots.\n• **Simmentaler** — Swiss origin, dual-purpose; large, fast-growing.\n\n**Why these breeds matter to Namibia's economy:**\n1. **Export beef → foreign currency** — Namibia exports beef to EU, China, Norway, South Africa; agriculture earns billions of N\\$ in forex annually.\n2. **Domestic income** — meat sales support tens of thousands of farming households.\n3. **Hides / leather industry** — by-product processed into upholstery, garments, accessories — adds value beyond the carcass.\n4. **Employment** — abattoirs, feedlots, transport, vets, fencing all feed off the beef cluster.\n\nSpell breed names exactly: **Bonsmara**, **Sanga**, **Nguni**, **Simmentaler**."},

    {"q": "10(b)", "marks": 6, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q10 — Managing the breeding cycle.", "diagram": None,
     "prompt": "**Q10 (b)** Discuss how the **breeding cycle of farm animals** can be **managed** in order to **increase the yield**. [6]",
     "memo": "Any 6 of (1 mark each):\n• keep records of all animals (heat dates, services, pregnancies, births);\n• mating of bull with cows should be done at a certain time (controlled breeding season);\n• ensure calves are born almost at the same time / at the right time;\n• calves born when there is plenty of nutritional food / rain season;\n• for the calves to grow fast;\n• for the mother to produce more milk (lactation matches feed availability);\n• allow cows to recover before next pregnancy / birth process;",
     "rubric": "Award 1 mark per distinct management practice (max 6). PENALISE candidates who give selection criteria (which breeds to choose) — that's not breeding-cycle management.",
     "examiner_note": "Poorly answered. Candidates misinterpreted the question and majority gave the qualities to be considered when choosing animals for breeding purposes.",
     "explanation": "**Managing the breeding CYCLE = timing matings, pregnancies and recoveries to maximise output.** Key practices:\n\n1. **Record-keeping** — heat dates, services, pregnancies, calving dates; lets you decide when to expose cows to the bull, when to dry off, when to wean.\n2. **Controlled breeding season** — keep the bull SEPARATE from cows for most of the year; only run him with the herd for ~90 days (e.g. Dec–Feb) so calves all come together (e.g. Sep–Nov).\n3. **Calves born at the right time** — schedule calving for the start of the rainy season → plenty of green grass for lactating cows.\n4. **Heavy lactation matches feed** — cow produces more milk when pasture is best → calf grows fast → bigger weaner sold.\n5. **Rest period (dry period)** — allow cow ≥ 60 days between weaning a calf and calving the next one → her body rebuilds reserves, next calf is born strong.\n6. **Synchronised oestrus** (use hormones if needed) → easier AI, all cows pregnant in one window.\n7. **Pregnancy diagnosis** — confirm at 2-3 months so non-pregnant cows are re-bred or culled.\n\nSix distinct points = 6 marks. Stay on TIMING and MANAGEMENT, not on selecting which breed."},

    {"q": "10(c)", "marks": 5, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q10 — Effect of overstocking on pasture.", "diagram": None,
     "prompt": "**Q10 (c)** Explain how **keeping a larger number of animals than the land can support** may lead to a **pasture losing its value**. [5]",
     "memo": "Any 5 of (1 mark each):\n• trampling of pasture leads to soil compaction;\n• overgrazing leads to loss of vegetation cover / soil erosion;\n• selective grazing leads to increase in unpalatable grass / invaders / invasive alien species / leads to animals feeding on poor grasses;\n• pasture do not get time to recover;\n• bush encroachment (if only grazers are kept on the land);",
     "rubric": "Award 1 mark per distinct PASTURE degradation mechanism (max 5). PENALISE answers that just list 'overstocking is bad' without explaining how the pasture loses value.",
     "examiner_note": "Fairly answered. Some candidates failed to read the question properly as they gave the effects of overstocking without limiting their answers to the pasture. Overstocking was the common answer provided by many candidates despite having 'keeping large number of animals than the land can support' in the question.",
     "explanation": "**Overstocking = stocking rate > carrying capacity.** Cascade of pasture damage:\n\n1. **Trampling → soil compaction** — too many hooves pack the topsoil down → poor water infiltration → runoff and erosion.\n2. **Overgrazing → bare ground** — grass eaten faster than it can regrow → patches go bare → wind and rain erode topsoil.\n3. **Pasture never rests** — grasses can't replenish root reserves → die out → the most productive species disappear first.\n4. **Selective grazing → unpalatable species take over** — animals strip the tasty grasses and avoid the bitter/spiky ones → invasive aliens (e.g. *Stipagrostis*, weeds) replace good fodder species.\n5. **Bush encroachment** — when fire is suppressed and only grazers (not browsers) are kept, woody shrubs (e.g. blackthorn, sickle bush) invade and choke out grass. Huge problem on Namibian commercial farms — millions of N\\$ spent on debushing.\n6. (Eventually) **Desertification** — bare, compacted, eroded land can't support stock at all → carrying capacity falls permanently.\n\nFive of these mechanisms = full marks. Stay on the pasture, not on animal symptoms."},

    # ─── Q11: Cereal seed bed prep, legumes, IPM cultural (15) ─────────────
    {"q": "11(a)", "marks": 5, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q11 — Seed bed preparation for cereals.", "diagram": None,
     "prompt": "**Q11 (a)** Discuss the **methods** that can be employed in **preparing the seed bed** for **planting cereal crops**. [5]",
     "memo": "Any 5 of (1 mark each — discuss each step):\nFor maize / millet / sorghum / oats / barley / wheat / upland rice:\n• clear the land — to remove weeds;\n• dig / plough the soil — to loosen it;\n• harrow / rake — to level the soil / to break large soil clods / so water does not flow on one side of the seedbed;\n• determine the soil pH — to correct the soil pH according to the crop planted;\n• fertilise the soil — to increase the soil fertility;\n• water the soil — to moisten the soil / dissolve the nutrients;\n• any reference to measurements — mark out seed bed boundaries / rows;\n(Lowland / wetland rice: clear land; repair / construct bunds — retain water; primary tillage — loosen / overturn soil; harrowing — break clods; flooding — control weeds.)",
     "rubric": "Award 1 mark per distinct method PROPERLY DISCUSSED (step + reason). PENALISE bare lists ('plough, harrow, plant') without explaining each step.",
     "examiner_note": "Poorly answered. Most candidates could not cope with this question. Very few candidates that score 1-2 marks just outlined the methods of preparing the seedbed without any discussion.",
     "explanation": "**Cereal seed bed prep — step + reason for each:**\n\n1. **Clear the land** (remove crop residues, weeds, stones) — gives the cereal seed an open, weed-free start.\n2. **Plough / dig** — primary tillage that overturns and **loosens** the soil so roots can penetrate and water can soak in.\n3. **Harrow** (secondary tillage) — **breaks down clods and levels the surface** so seeds are sown at uniform depth; uneven ground causes water to run off one side.\n4. **Test soil pH** — cereals prefer ~6.0–6.5; if too acidic, **add lime**; if too alkaline, **add sulphur** or organic matter.\n5. **Apply fertiliser** (compound NPK or compost) — replaces nutrients used by previous crops; cereals are heavy feeders, especially of N for leaf growth.\n6. **Pre-irrigate / water** — moist soil germinates seeds reliably; dry soil delays emergence.\n7. **Mark out rows / boundaries** — use line + stick or planter to space rows evenly so weeding and harvesting are easy.\n\nKey: 'DISCUSS' means **method + WHY**. Five fully-discussed steps = 5 marks."},

    {"q": "11(b)", "marks": 6, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q11 — Legumes and soil fertility.", "diagram": None,
     "prompt": "**Q11 (b)** Name **one leguminous crop** AND explain its **value in maintaining soil fertility**. [6]",
     "memo": "All required:\n• a leguminous crop (1 mark) — any of: beans / peas / lucerne / clover / cowpeas / groundnuts;\n• has nitrogen-fixing bacteria (1);\n• in the root nodules (1);\n• that can absorb atmospheric nitrogen (1);\n• convert it into nitrate (1);\n• when legume dies and decomposes nitrogen is released back into the soil (1);",
     "rubric": "Award 1 mark for naming a legume. Award up to 5 marks for the explanation IN CORRECT SEQUENCE: nodules → bacteria → atmospheric N → nitrate → release on decomposition. PENALISE 'noodles' / 'noddles' for nodules.",
     "examiner_note": "Fairly well answered. However, most candidates lost a mark for spelling nodules as 'noodles' / 'noddles'. Most candidates also failed to use a correct answering sequence. Example: stating first that legume has root nodules, that contains nitrogen fixing bacteria, that absorb atmospheric nitrogen and convert it to nitrates.",
     "explanation": "**Legume example:** cowpea / groundnut / soybean / lucerne / clover / beans / peas.\n\n**Why legumes maintain soil fertility — biological nitrogen fixation:**\n\n1. The roots of legumes form a **symbiosis with *Rhizobium* bacteria**.\n2. The bacteria live inside **root nodules** — small swellings on the roots (NOT 'noodles' — spell carefully).\n3. These bacteria can take **nitrogen gas (N₂) from the air** in soil pores — something no other crop can do.\n4. They use the enzyme **nitrogenase** to **convert N₂ into ammonium (NH₄⁺), then nitrate (NO₃⁻)** — the forms plants can use.\n5. The legume uses some of this nitrogen for itself; the rest enriches the surrounding soil.\n6. When the legume **dies and decomposes** (or is ploughed in as green manure), the remaining nitrogen is **released into the soil**, available for the NEXT crop.\n\nFarming use: **rotate** legumes with cereals (maize one year, cowpea next year) to keep soil nitrogen high without buying nitrogen fertiliser.\n\nWrite in the correct ORDER: nodules → bacteria → atmospheric N → nitrate → release on death."},

    {"q": "11(c)", "marks": 4, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q11 — IPM using cultural methods.", "diagram": None,
     "prompt": "**Q11 (c)** Discuss how **Integrated Pest Management (IPM)** could be used to **control pests in crops** using **cultural methods**. [4]",
     "memo": "Any 4 of (1 mark each, must be DISCUSSED not just named):\n1. crop rotation to kill / interplanting or strip cropping to disturb the life cycle of the pests;\n2. winter ploughing / soil treatment which helps to destroy pests (in their pupal stage) by exposing them to the sun and cold weather / harsh weather;\n3. early ploughing which enables sharp rays of the sun to enter the soil and kills the pests' eggs / larvae;\n4. planting resistant cultivars / selection of suitable plants that are specially bred to resist / minimise pest attack;\n5. weed control to destroy pest habitats;",
     "rubric": "Award 1 mark per cultural method PROPERLY DISCUSSED (method + how it controls pests). PENALISE bare lists without explanation, or non-cultural methods (chemical sprays, biological control with predators).",
     "examiner_note": "Poorly answered. Almost all candidates misinterpreted the question. They mostly explain what is IPM and all other methods entails in controlling pests without making references to cultural methods. Few candidates listed the cultural methods to control the pests without discussing them and that was not good enough to score marks.",
     "explanation": "**Cultural control = changing FARMING PRACTICES to make life hard for pests** (no chemicals, no biocontrol agents). Four examples to discuss:\n\n1. **Crop rotation** — don't grow the same crop in the same place two years running. Pests specific to that crop (e.g. maize stalk borer) starve when their host disappears. Strip cropping / intercropping further breaks the pest's life cycle.\n\n2. **Winter / deep ploughing** — turning the soil in winter EXPOSES pest pupae and larvae to **cold and direct sunlight**, killing them before spring emergence.\n\n3. **Early ploughing** — preparing the seedbed early lets the sun bake the topsoil → kills pest eggs and tiny larvae before the crop is even planted.\n\n4. **Resistant cultivars** — choose varieties bred specifically to resist a common pest (e.g. aphid-resistant wheat). Genetics do the pest control work.\n\n5. **Weed control** — many weeds are alternative hosts/shelters for pests. Keep the field and field edges weed-free → no refuge.\n\n**Key:** the question asks specifically for **cultural** methods (not chemical sprays, not biological control with ladybirds). And it says 'DISCUSS', so name the method AND explain how it kills/discourages the pest."},

    # ─── Q12: Shifting cultivation + rural development (15) ────────────────
    {"q": "12(a)", "marks": 7, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q12 — Shifting cultivation in Namibia.", "diagram": None,
     "prompt": "**Q12 (a)** Describe **shifting cultivation** AND suggest **two reasons** why it may NOT be a **viable method** to Namibian farmers. [7]",
     "memo": "Description (5 marks, 1 each):\n• farmer clears the land by cutting down trees and removing stumps;\n• farmer uses the cleared land to grow crops;\n• until the land is exhausted in terms of nutrients;\n• farmer shifts to another land;\n• allows the (original) land to recover;\nSuggestions / reasons not viable (any 2 of, 1 mark each):\n• Namibian population has increased thus land is used up to build shelters / houses;\n• more people need more food, making it impossible to leave the land uncultivated for some time;\n• land is scarce due to population increase;",
     "rubric": "Award up to 5 for description (the 5 stages of shifting cultivation in correct order). Award up to 2 for reasons (must link to Namibia: population pressure / land scarcity / food demand). PENALISE 'cleaning' the land — it's CLEARING (removing vegetation).",
     "examiner_note": "Well answered. Candidates could describe shifting cultivation but they could not suggest why it not a viable method to Namibian farmers. Few candidates referred to cleaning of the land instead of clearing the land. Some candidates indicated farming / grazing animals on the land as a reason for clearing the land instead of using the land to grow crops.",
     "explanation": "**Shifting cultivation (slash-and-burn)** — a traditional rotation system:\n\n1. **Clear the land** — cut down trees, remove stumps, burn brush (releases nutrients into soil).\n2. **Plant crops** on the cleared land — typically maize, sorghum, millet.\n3. **Crop for 2–4 years** until soil fertility falls off (most easily-released nutrients are used up by the crops).\n4. **Abandon and move on** — clear a NEW patch elsewhere when the old one is exhausted.\n5. **Old patch fallows** — vegetation regrows over 15–30 years, restoring fertility. Farmer eventually returns to the same spot.\n\n**Why it's NOT viable in modern Namibia:**\n\n1. **Population pressure** — far more people now share the same land. No spare land lying fallow.\n2. **Land scarcity** — most arable land already allocated to farming, conservancies, infrastructure or housing.\n3. **Food security** — can't feed 3+ million Namibians from intermittent crop cycles; need every hectare producing every year.\n4. **Conservation** — clearing forests for new fields conflicts with Namibia's environmental protection laws and CBNRM.\n5. **Investment** — modern farmers invest in fencing, irrigation, fertility — can't abandon those.\n\nDescription (5 marks) + 2 reasons (2 marks) = 7."},

    {"q": "12(b)", "marks": 4, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q12 — Agriculture and rural living conditions.", "diagram": None,
     "prompt": "**Q12 (b)** Discuss how **Agriculture can help improve the living conditions** for rural people in Namibia. [4]",
     "memo": "Any 4 of (1 mark each):\n• food production / improves food security / food self-sufficiency;\n• income generation through selling of surplus products;\n• create employment / self-employment / community members employed in small to medium scale farming projects;\n• provision of raw materials;\n• through agricultural earnings, some farmers can establish markets to sell their products commercially;\n• as more money is invested in the area, this improves economic and social infrastructure;",
     "rubric": "Award 1 mark per DISTINCT contribution to rural welfare (max 4). PENALISE 'agriculture is good' without specifying which dimension of life improves.",
     "examiner_note": "Well answered. Most candidates could score at least 3 out of 4 marks.",
     "explanation": "**How agriculture lifts rural living standards:**\n\n1. **Food security** — families grow their own food → less hunger, less dependence on shops or food aid.\n2. **Income from surplus** — selling crops, livestock, milk, eggs → cash for school fees, medicine, clothing.\n3. **Employment & self-employment** — small/medium farms employ neighbours; many rural Namibians ARE the farmer (subsistence + commercial).\n4. **Raw materials for industry** — hides for leather, cotton for textiles, grain for milling, milk for processing → adds value chains in rural areas.\n5. **Market development** — once farms generate surplus, traders set up local markets, expanding economic activity.\n6. **Improved infrastructure** — roads, clinics, schools follow rural prosperity (money brings services).\n7. **Skills transfer** — extension services, farmer groups, cooperatives → people learn financial literacy, agronomy.\n\nFour distinct contributions = 4 marks."},

    {"q": "12(c)", "marks": 4, "tier": "paid", "type": "essay",
     "stem": "SECTION B Q12 — Government support for rural development.", "diagram": None,
     "prompt": "**Q12 (c)** Explain how the **Namibian government** can help in the **development of rural communities**. [4]",
     "memo": "Any 4 of (1 mark each):\n• providing financial assistance to major agricultural projects in the community;\n• subsidising certified seeds / fertilisers / transport / tractors / ploughing services;\n• setting up livestock handling facilities; vaccinating animals for free;\n• setting up green irrigation schemes to improve food production;\n• providing employment / jobs to rural people (through various agricultural projects);\n• providing free advice and extension services to communities;\n• assisting farmers in the establishment of conservancies;",
     "rubric": "Award 1 mark per SPECIFIC government intervention (max 4). PENALISE generic 'help them' / 'educate people' / 'give loans' without saying what FOR.",
     "examiner_note": "Well answered. However, some candidates gave general answers such as educating people in the community, give them loan / financial assistance etc.",
     "explanation": "**Government interventions that specifically build rural communities:**\n\n1. **Financial assistance to agricultural projects** — Agribank loans, grants for irrigation or livestock infrastructure.\n2. **Subsidised inputs** — certified seed, fertiliser, ploughing services, tractor hire schemes — at below-market prices so smallholders can access them.\n3. **Livestock handling facilities** — communal crush pens, dip tanks; free / subsidised vaccination campaigns against anthrax, FMD, lumpy skin disease.\n4. **Green schemes (irrigation)** — the Green Scheme programme set up irrigated farms (Etunda, Sikondo, Olushandja) creating jobs and growing maize / wheat / vegetables.\n5. **Employment via state agricultural projects** — Ministry of Agriculture employs rural workers directly.\n6. **Free extension services** — agricultural extension officers visit, advise on crops, livestock, soil and water management.\n7. **Conservancy support** — Ministry of Environment helps communities form conservancies (tourism + wildlife revenue).\n8. **Rural infrastructure** — boreholes, roads, electricity, mobile coverage — government investment.\n\nFour SPECIFIC actions = 4 marks."},
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
    out.append(f"-- NSSCO Agricultural Science 2024 Paper 1 (6115/1) — Section A (90) + Section B (60 available)")
    out.append(f"-- 8 Section A questions, 4 Section B essays, {len(QUESTIONS)} sub-parts, 120 marks total")
    out.append("-- Verbatim NIED wording for prompts. Mark scheme + commentary from")
    out.append("-- DNEA Examiners Report 2024 (Agricultural Science section, pages 35-43).")
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
            out.append(f"    agric_id, 2024, '1', '{q['q']}', {q['marks']}, '{q['tier']}',")
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
            out.append(f"    agric_id, 2024, '1', '{q['q']}', {q['marks']}, '{q['tier']}',")
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
            out.append(f"    agric_id, 2024, '1', '{q['q']}', {q['marks']}, '{q['tier']}',")
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
            out.append(f"    agric_id, 2024, '1', '{q['q']}', {q['marks']}, '{q['tier']}',")
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
    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} sub-parts for Agricultural Science NSSCO 2024 Paper 1';")
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
