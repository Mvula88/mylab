"""Build NSSCO Biology 2023 Paper 2 — structured response, 8 questions, 80 marks.

Single source of truth for all sub-parts. Verbatim NIED wording from the
question paper PDF; official mark scheme + commentary from the DNEA Examiners
Report 2023 (Biology section, pages 50-58).

Outputs:
  - public/past-papers/biology-nssco-2023-p2/*.png   (per-figure diagram crops)
  - supabase/migrations/{ts}_biology_nssco_2023_p2.sql

Run:
  PYTHONIOENCODING=utf-8 python scripts/build_2023_p2.py
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2023-p2"
PNG_DIR = ROOT / "public" / "past-papers" / "biology-nssco-2023-p2"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260525120000_biology_nssco_2023_p2.sql"

DIAGRAMS = {
    "dicot-leaf":       ("page-02", 0.05, 0.36, 0.16, 0.76),
    "pesticide-plant":  ("page-03", 0.04, 0.40, 0.20, 0.80),
    "stem-cross":       ("page-04", 0.04, 0.22, 0.30, 0.70),
    "lactic-recovery":  ("page-07", 0.05, 0.26, 0.18, 0.80),
    "co2-photo-graph":  ("page-09", 0.04, 0.30, 0.12, 0.82),
    "enzyme-stages":    ("page-10", 0.05, 0.24, 0.10, 0.85),
    "flower-fertilise": ("page-11", 0.04, 0.34, 0.20, 0.75),
    "self-pollination": ("page-11", 0.45, 0.78, 0.20, 0.78),
    "eukaryotic-cell":  ("page-13", 0.04, 0.25, 0.16, 0.85),
}


def durl(slug: str | None) -> str | None:
    return f"/past-papers/biology-nssco-2023-p2/{slug}.png" if slug else None


# ═══════════ Q1 — Dicotyledonous leaf (10 marks) ═══════════
Q1_STEM = "Fig. 1.1 shows a cross-section of a dicotyledonous leaf."

# ═══════════ Q2 — Systemic pesticides (10 marks) ═══════════
Q2_STEM = "Fig. 2.1 shows the application of systemic pesticides to a plant."

# ═══════════ Q3 — Gas exchange (10 marks) ═══════════
Q3_STEM = "The gas exchange system in humans is adapted to allow air to pass in and out of the body, and for efficient gaseous exchange to take place."
Q3B_STEM = "In an experiment, the number of breaths per minute and the volume of air taken in per breath by a young man, were measured, at rest and after exercise.\n\n**Table 3.1**\n\n| condition | volume of air per breath / dm³ | number of breaths per minute |\n|---|---|---|\n| at rest | 0.5 | 12 |\n| after exercise | 3 | 30 |"

# ═══════════ Q4 — Lactic acid, ATP, energy uses (10 marks) ═══════════
Q4_STEM = "Fig. 4.1 shows the removal of lactic acid during the period called recovery."

# ═══════════ Q5 — Carbon cycle + photosynthesis (10 marks) ═══════════
Q5_STEM = "The list of some processes that occur in the carbon cycle is given below.\n\n• respiration\n• photosynthesis\n• combustion\n• decomposition"

# ═══════════ Q6 — Enzymes (10 marks) ═══════════
Q6_STEM = "Fig. 6.1 shows the four stages of an enzyme-controlled reaction."

# ═══════════ Q7 — Pollination & fertilisation (10 marks) ═══════════
Q7_STEM = "Fig. 7.1 shows some stages in sexual reproduction in plants."

# ═══════════ Q8 — Eukaryotic cell + DNA + mutation (10 marks) ═══════════
Q8_STEM = "Fig. 8.1 shows a eukaryotic cell."


QUESTIONS = [
    # ──────── Q1 (10 marks) ────────
    {
        "q": "1(a)(i)", "marks": 4, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "dicot-leaf",
        "prompt": "**(a)(i)** Identify the tissues labelled **A**, **B**, **C** and **D**.",
        "accepted": [
            "A upper epidermis B palisade mesophyll C spongy mesophyll D lower epidermis",
            "upper epidermis palisade mesophyll spongy mesophyll lower epidermis",
        ],
        "must_contain": ["upper epidermis", "palisade", "spongy", "lower epidermis"],
        "memo": "A — upper epidermis; B — palisade mesophyll; C — spongy mesophyll; D — lower epidermis; [4 marks, 1 each]",
        "examiner_note": "Well-answered, however, most candidates could not spell the names of the tissues correctly. Wrong spellings included epidemic, epidemas, epiderm, pallaside mesophy, sponge mesophll. Some candidates referred to palisade and spongy mesophyll layers as ONE cell (e.g. 'palisade/mesophyll cell'). Use comparative terms 'upper' and 'lower' — NOT 'up' and 'down'.",
        "explanation": "Four layers of a dicot leaf, top → bottom:\n• **A — upper epidermis** — thin transparent top layer; lets light in\n• **B — palisade mesophyll** — column-shaped cells packed with chloroplasts; main site of photosynthesis\n• **C — spongy mesophyll** — loosely-packed round cells with big air spaces between them for gas exchange\n• **D — lower epidermis** — bottom layer; has the stomata\n\nSpelling matters in this paper — write the full words.",
    },
    {
        "q": "1(a)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "dicot-leaf",
        "prompt": "**(a)(ii)** State the function of the cells labelled **Y**.",
        "accepted": [
            "to open and close the stomata",
            "control the opening and closing of the stomata",
            "regulate opening and closing of stomata",
            "open and close stomata",
        ],
        "must_contain": ["open", "close"],
        "memo": "To open and close stomata / control / regulate opening and closing of stomata; [1 mark]",
        "examiner_note": "Most candidates gave the function of the stomata instead of the guard cells. Some only gave a partial answer (e.g. 'to open the stomata') — both opening AND closing must be mentioned.",
        "explanation": "Cells **Y** are **guard cells**. Each stoma (hole in the leaf) is surrounded by two banana-shaped guard cells. Their job is to **OPEN AND CLOSE** the stoma:\n• When the leaf needs gas exchange (CO₂ in, O₂ out) → guard cells swell with water and the stoma opens\n• When the leaf is losing too much water → guard cells become limp and the stoma closes\n\nDon't confuse the cell (guard cell) with the hole (stoma).",
    },
    {
        "q": "1(a)(iii)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM, "diagram": "dicot-leaf",
        "prompt": "**(a)(iii)** On Fig. 1.1 describe where you would draw a line to the **xylem** (label it **X**) and to the **phloem** (label it **P**). State which tissue is on top and which is on the bottom in the vascular bundle of the leaf.",
        "memo": "X — labelled on xylem (upper / inner side of the vascular bundle, towards the upper epidermis); [1]\nP — labelled on phloem (lower / outer side of the vascular bundle, towards the lower epidermis); [1]",
        "rubric": "Award 1 mark for correctly identifying xylem as the UPPER part of the vascular bundle (closer to the upper epidermis). Award 1 mark for correctly identifying phloem as the LOWER part (closer to the lower epidermis). Mnemonic accepted: 'xylem above, phloem below' in a leaf vein.",
        "examiner_note": "Well answered overall, although some candidates couldn't identify the exact location of xylem and phloem. Many wrote the NAMES of the parts instead of using letters X and P as the question instructed.",
        "explanation": "In a leaf's vascular bundle (the 'vein'):\n• **Xylem (X)** — sits on TOP (towards the upper epidermis); carries water UP from the roots\n• **Phloem (P)** — sits on BOTTOM (towards the lower epidermis); carries dissolved sugars FROM the leaf to the rest of the plant\n\nMemory trick for the order in a LEAF: '**X**ylem on to**X** (top), **P**hloem on **P**lant-floor (bottom).' In a STEM vascular bundle, xylem is INNER and phloem is OUTER — it's only in the leaf vein that they sit top/bottom.",
    },
    {
        "q": "1(b)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM, "diagram": "dicot-leaf",
        "prompt": "**(b)** Explain **three** ways in which the structure of a leaf is adapted for photosynthesis.",
        "memo": (
            "Any 3 of (1 mark each):\n"
            "1. Chlorophyll / chloroplasts + absorb sunlight (to transfer energy) / move within mesophyll cells towards light;\n"
            "2. Network of veins / vascular bundle / xylem / phloem + support the leaf and transport water, mineral ions and sucrose / translocation of products of photosynthesis;\n"
            "3. Stomata + allow CO₂ to diffuse into the leaf and O₂ to diffuse out / gaseous exchange;\n"
            "4. Epidermis tissue + transparent to allow light to pass through;\n"
            "5. Cuticle + reduces water loss;\n"
            "6. Palisade mesophyll layer + more chloroplasts / closely packed / near the surface to maximise light interception / arranged at right angles to reduce cell walls light must pass through;\n"
            "7. Spongy mesophyll layer + air spaces for gaseous exchange;"
        ),
        "rubric": "Award 1 mark per adaptation (max 3). Each answer MUST have BOTH a structure AND its function/explanation — e.g. 'chloroplasts to absorb sunlight' = 1 mark, but 'has chloroplasts' alone = 0 marks. DO NOT credit external/whole-leaf features (broad, thin, flat) — the question is about internal structure adaptations.",
        "examiner_note": "Poorly answered. Most candidates gave external features (broad, thin) instead of naming the internal structure AND explaining how it is adapted. Some misunderstood the question and described the PROCESS of photosynthesis instead of the structures.",
        "explanation": "Strategy: for each adaptation, name a STRUCTURE + explain WHY it helps photosynthesis. Three solid pairs:\n\n1. **Chloroplasts (in palisade cells)** contain chlorophyll → absorb light energy for photosynthesis.\n2. **Stomata (in lower epidermis)** + guard cells → let CO₂ in and O₂ out — needed for the reaction.\n3. **Network of veins (xylem + phloem)** → bring water in (xylem) and take sugars away (phloem).\n\nAvoid: 'leaf is broad/thin/flat' — those are *external* features, not internal structural adaptations.",
    },
    # ──────── Q2 (10 marks) ────────
    {
        "q": "2(a)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": "pesticide-plant",
        "prompt": "**(a)** Describe how the pesticide reaches the leaves to kill the insects.",
        "memo": (
            "Any 3 of (1 mark each):\n"
            "1. Systemic pesticides are soluble;\n"
            "2. Absorbed by the roots / root hairs of the plant;\n"
            "3. Pass into the xylem;\n"
            "4. Transported up the xylem to the leaves;\n"
            "5. Taken in by insects eating / sucking the plant leaves;"
        ),
        "rubric": "Award 1 mark each (max 3). Must mention: (a) absorption by roots, (b) transport via XYLEM (not phloem — the pesticide is in soil), and (c) how the insect gets it. Wrong if: pesticide 'transported in phloem' (only true when sprayed on leaves, not in soil); 'kills the plant' (not the insect).",
        "examiner_note": "Most learners failed to apply their knowledge — they thought pesticides are transported by phloem instead of xylem when entering from the soil. Many also stated 'insects get pesticide from chewing' without naming xylem transport. Some only stated 'pesticide gets to xylem' but didn't explain the full pathway.",
        "explanation": "Pesticide journey when sprayed in soil:\n1. **Pesticide dissolves in soil water** (it is *soluble*)\n2. **Absorbed by root hair cells** along with water\n3. Passes into the **xylem** (water-transport tubes)\n4. **Transported UP** the xylem to the leaves\n5. **Insects eat or suck** the leaves → pesticide enters insect → insect dies\n\nKey error to avoid: when pesticide is applied to SOIL, it travels in XYLEM (not phloem). Phloem only transports it when sprayed directly on leaves.",
    },
    {
        "q": "2(b)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM + "\n\nFig. 2.2 shows a cross-section through the stem of the plant in Fig. 2.1.",
        "diagram": "stem-cross",
        "prompt": "**(b)** Which tissue in the stem (Fig. 2.2) will contain the higher concentration of the pesticide? Name the tissue.",
        "accepted": ["xylem", "the xylem"],
        "must_contain": ["xylem"],
        "memo": "(i) any xylem shaded; [1]\n(ii) xylem; [1]\n[Total 2 marks]",
        "examiner_note": "Fairly well answered. Some candidates shaded the WHOLE vascular bundle instead of only the xylem portion. A few used labelling lines with names instead of shading.",
        "explanation": "The **xylem** carries water + dissolved substances UP from the roots — including any soluble pesticide absorbed from the soil. So the xylem holds the highest concentration of pesticide in the stem.\n\nThe stem cross-section shows vascular bundles arranged in a ring. INSIDE each bundle: **xylem on the inner side** (towards the centre), **phloem on the outer side**. Only the xylem section gets shaded — not the whole vascular bundle.",
    },
    {
        "q": "2(c)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": "pesticide-plant",
        "prompt": "**(c)** Suggest the process leading to the uptake of the pesticide into the roots of the plant.",
        "memo": (
            "Any 2 of (1 mark each):\n"
            "1. Diffusion;\n"
            "2. Into root hair cells;\n"
            "3. Reference to concentration gradient of systemic pesticide (high in soil → low in root);\n"
            "4. Through cell walls / cell wall is permeable;"
        ),
        "rubric": "Award marks for: (a) naming diffusion (or active transport with concentration-gradient reasoning) — 1 mark; (b) reference to direction of concentration gradient with the LOCATION named (soil vs root) — 1 mark. PENALISE: 'high to low' without naming WHERE; describing osmosis (osmosis = water only, not solutes).",
        "examiner_note": "Poorly answered. Most candidates described OSMOSIS instead of diffusion or active transport. Many said 'high to low' without stating the area of concentration. Osmosis only moves water, not dissolved substances.",
        "explanation": "Two possible processes:\n\n• **Diffusion** — if the pesticide is MORE concentrated in soil than inside the root, it moves *down* the gradient INTO root hair cells (passively).\n• **Active transport** — if the pesticide is LESS concentrated in soil than inside the root, ATP is needed to pull it AGAINST the gradient.\n\nDon't say 'osmosis' — osmosis ONLY moves water, not dissolved pesticide molecules.\n\nState the direction WITH locations: 'pesticide is more concentrated in the soil and less concentrated in the root cells → diffuses in.'",
    },
    {
        "q": "2(d)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM,
        "diagram": "pesticide-plant",
        "prompt": "**(d)** Systemic pesticide may be applied to the leaves. Describe the process occurring that causes the pesticide to move through the plant and kill insects.",
        "memo": (
            "All 3 marking points:\n"
            "1. Translocation;\n"
            "2. (Soluble) pesticide moves through the phloem;\n"
            "3. Insects suck up the pesticide in the sap;"
        ),
        "rubric": "Award 1 mark each: (1) name the process as TRANSLOCATION; (2) state it moves in the PHLOEM; (3) explain insects SUCK the contaminated phloem sap. PENALISE: diffusion or active transport (wrong process for leaf-to-plant); 'insect eats/chews leaf' (this paper specifies sap-sucking).",
        "examiner_note": "The majority identified the process correctly but focused on translocation of sucrose and amino acid instead of the pesticide. A few wrongly identified the process as diffusion or active transport. Candidates failed to mention that the pest is sucking contaminated PHLOEM SAP — they described chewing leaves instead.",
        "explanation": "When pesticide is sprayed on LEAVES (not soil), the route is different:\n\n1. **Translocation** = movement of dissolved substances in the phloem\n2. Pesticide enters the leaf and is transported in the **phloem** (along with sugars)\n3. The phloem carries it all over the plant\n4. **Insects suck the phloem sap** (the contaminated liquid) → take pesticide → die\n\nLeaf-applied pesticide → phloem. Soil-applied pesticide → xylem. Don't mix the two routes up.",
    },
    # ──────── Q3 (10 marks) ────────
    {
        "q": "3(a)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM,
        "diagram": None,
        "prompt": "**(a)** List **three** features of the gaseous exchange surfaces in humans.",
        "memo": (
            "Any 3 of (1 mark each):\n"
            "1. Large surface area / many alveoli;\n"
            "2. Thin walls of alveoli (one cell thick) / single layer of cells / thin surface;\n"
            "3. Many blood capillaries / good blood supply;\n"
            "4. Good ventilation with air;"
        ),
        "rubric": "Award 1 mark per feature (max 3). Each feature must be specific: 'thin walls of alveoli' = 1, but 'thin' alone = 0. 'Many capillaries' = 1, 'capillaries' alone = 0. Do NOT credit features of villi (small intestine) — the question is about gas exchange (alveoli), not absorption.",
        "examiner_note": "Fairly well answered. Some candidates wrote 'thin area', 'thin capillaries', 'thin layer' or 'epithelium layer' instead of 'thin surface / thin walls'. Many omitted 'surface area' (wrote just 'large area'). Others gave features of the villus (intestine) by mistake.",
        "explanation": "Four features that make gas exchange efficient — name any THREE:\n\n1. **Large surface area** — millions of alveoli pack a huge area into the lungs\n2. **Thin walls (one cell thick)** — short distance for O₂ and CO₂ to diffuse\n3. **Rich blood supply** — many capillaries → fast removal of O₂, fast delivery of CO₂\n4. **Good ventilation** — breathing keeps fresh air coming → maintains steep concentration gradient\n\nFick's law: rate of diffusion ∝ (surface area × concentration difference) ÷ thickness. Every feature here boosts one of those.",
    },
    {
        "q": "3(b)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3_STEM + "\n\n" + Q3B_STEM,
        "diagram": None,
        "prompt": "**(b)(i)** Calculate the total volume of air breathed in by the young man per minute **at rest**.\n\nShow your working AND give the correct unit.",
        "accepted": ["6", "6 dm3", "6 dm³", "6 dm^3", "6dm3", "6dm³"],
        "must_contain": ["6"],
        "memo": "0.5 dm³ × 12 = **6 dm³**; [1 mark — unit required]",
        "examiner_note": "Well answered, although most candidates lost the mark for omitting the unit. A few used cm³ instead of dm³. Always check the unit in the question stem.",
        "explanation": "**Minute volume = tidal volume × breaths per minute.**\n\nAt rest:\n• tidal volume = 0.5 dm³ per breath\n• breaths = 12 per minute\n• minute volume = 0.5 × 12 = **6 dm³** (per minute)\n\n⚠ The unit MUST be **dm³** (or 'dm³ / min') — match the table's unit. Pure number '6' loses the mark.",
    },
    {
        "q": "3(b)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM + "\n\n" + Q3B_STEM,
        "diagram": None,
        "prompt": "**(b)(ii)** Explain why the number of breaths per minute increases after exercise.",
        "memo": (
            "Any 2 of (1 mark each):\n"
            "1. To bring in more oxygen / remove more carbon dioxide;\n"
            "2. For faster (aerobic) respiration / faster removal of lactic acid / to repay oxygen debt;"
        ),
        "rubric": "Award 1 mark for naming the gas need (more O₂ in / more CO₂ out) and 1 mark for the reason (faster respiration to release more energy / oxygen debt). PENALISE answers that describe DURING exercise (the question asks about AFTER exercise).",
        "examiner_note": "Poorly answered — many candidates interpreted the question wrongly and gave answers based on DURING the exercise instead of AFTER. Most referred to 'too much' instead of 'more oxygen in / more CO₂ taken out'.",
        "explanation": "After exercise, muscles need more energy → more aerobic respiration → more O₂ delivery and more CO₂ removal:\n\n• **Faster breathing** brings in **more oxygen** for aerobic respiration\n• Faster breathing **removes more CO₂** built up from active muscles\n• Helps **repay the oxygen debt** (oxidising the lactic acid produced anaerobically during exercise)\n\nLink it explicitly: more breaths → more O₂ → faster respiration → energy / clear lactic acid.",
    },
    {
        "q": "3(c)", "marks": 4, "tier": "paid", "type": "free_text",
        "stem": Q3_STEM,
        "diagram": None,
        "prompt": "**(c)** Describe the effects of tobacco smoke on the gaseous exchange system with reference to **carbon monoxide** and **tar**.",
        "memo": (
            "Carbon monoxide (CO) — any 2 of:\n"
            "• Combines with haemoglobin in red blood cells to form carboxyhaemoglobin;\n"
            "• Less haemoglobin available to carry oxygen / reduces O₂-carrying capacity;\n"
            "• Less oxygen reaches tissues / less respiration / less energy released;\n"
            "• Increases risk of coronary heart disease / strokes / heart failure / heart attack;\n\n"
            "Tar — any 2 of:\n"
            "• Is a carcinogen / causes lung cancer / cancer of the mouth or throat;\n"
            "• Is an irritant — causes over-secretion of mucus;\n"
            "• Damages / paralyses cilia;\n"
            "• Forms a sticky layer inside the lungs;\n"
            "• Causes breakdown of alveoli walls (alveoli burst / merge);\n"
            "• Reduces surface-area-to-volume ratio → less gas exchange;\n"
            "• Can lead to emphysema / bronchitis;"
        ),
        "rubric": "Award up to 4 marks: 2 for carbon monoxide effects (must mention haemoglobin/carboxyhaemoglobin AND O₂ delivery), 2 for tar effects (must mention cancer/carcinogen AND one structural effect — cilia damage OR alveoli damage). PENALISE swapping effects: lung cancer attributed to CO (wrong) or heart disease to tar (wrong). DO NOT credit 'oxyhaemoglobin' as CO's product — the correct term is CARBOXYhaemoglobin.",
        "examiner_note": "Poorly answered. Most candidates SWAPPED the effects of the two chemicals (lung cancer under carbon monoxide, heart attack under tar). Many wrote 'oxyhaemoglobin' instead of 'CARBOXYhaemoglobin'. Some said 'mix with haemoglobin' instead of 'combines / binds with haemoglobin'.",
        "explanation": "**Carbon monoxide (CO)** — affects oxygen DELIVERY:\n• Binds to haemoglobin → forms **carboxyhaemoglobin** (irreversible at low CO levels)\n• Reduces blood's oxygen-carrying capacity\n• Less O₂ to tissues → less respiration → less energy\n• Heart works harder → coronary heart disease, strokes, heart attack\n\n**Tar** — affects the LUNG STRUCTURE:\n• Contains **carcinogens** → lung cancer, throat/mouth cancer\n• Irritates → over-production of mucus → cough\n• **Paralyses cilia** → mucus + bacteria not cleared → infections (bronchitis)\n• Damages alveoli walls → walls merge → less surface area → **emphysema**\n\nMnemonic: **CO → Cardiac/Oxygen problems**. **Tar → Tumours, Alveoli, Respiratory tract**.",
    },
    # ──────── Q4 (10 marks) ────────
    {
        "q": "4(a)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q4_STEM, "diagram": "lactic-recovery",
        "prompt": "**(a)(i)** With reference to the graph, how long did it take to reach full recovery?",
        "accepted": ["1 hour", "1 hr", "1", "1.0 hour"],
        "must_contain": ["1"],
        "memo": "1 hour; [1 mark — unit required]",
        "examiner_note": "Well answered, however a few candidates lost the mark for omitting the unit. Very few candidates could not interpret the graph correctly.",
        "explanation": "**Full recovery** = the point where 100% of the lactic acid has been removed (the curve has flattened at the top).\n\nReading the graph: the curve flattens off at the **1 hour** mark — that's where full recovery is reached.\n\nAlways include the unit (**hour**) on graph-reading questions; just '1' loses the mark.",
    },
    {
        "q": "4(a)(ii)", "marks": 4, "tier": "paid", "type": "free_text",
        "stem": Q4_STEM, "diagram": "lactic-recovery",
        "prompt": "**(a)(ii)** Describe what happens to the lactic acid that has been produced in the muscles once anaerobic respiration stops.",
        "memo": (
            "Any 4 of (1 mark each):\n"
            "1. Transported to the liver;\n"
            "2. By the blood;\n"
            "3. Oxidised / broken down to carbon dioxide and water;\n"
            "4. OR converted (back) to glucose;\n"
            "5. Then (stored as) glycogen;"
        ),
        "rubric": "Award 1 mark each: (1) destination = LIVER; (2) transported by BLOOD; (3) one possible fate — oxidised to CO₂ + water; (4) another fate — converted back to glucose / stored as glycogen. PENALISE answers that describe lactic acid FORMATION (this asks about its REMOVAL); describe lactic acid being 'used by the body' without specifying liver and breakdown.",
        "examiner_note": "Most candidates misunderstood the question and referred to oxygen debt, deamination, blood sugar, hormones — none correct. Many described lactic acid being formed (instead of removed). Candidates didn't identify the correct organ (LIVER) or transport route (BLOOD).",
        "explanation": "When exercise stops, the body has to clear the lactic acid built up:\n\n1. Lactic acid **diffuses out of muscles** into the blood\n2. **Blood transports it to the LIVER**\n3. In the liver, lactic acid is either:\n   • **Oxidised** (using O₂) → broken down to CO₂ + H₂O + energy, OR\n   • **Converted back to glucose** → stored as glycogen in liver/muscles\n4. This takes time → that's the 'recovery period' shown on the graph\n5. Extra O₂ needed for this oxidation = the **oxygen debt** repaid after exercise\n\nLiver + blood are the two organs/tissues you must name.",
    },
    {
        "q": "4(b)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q4_STEM, "diagram": "lactic-recovery",
        "prompt": "**(b)** State the number of ATP molecules released during aerobic and anaerobic respiration (per glucose molecule).\n\nGive aerobic, then anaerobic (e.g. ''aerobic 38, anaerobic 2'').",
        "accepted": [
            "aerobic 38 anaerobic 2",
            "38 and 2", "38, 2", "38 2",
        ],
        "must_contain": ["38", "2"],
        "memo": "Aerobic — 38 ATP per glucose / much more efficient; [1]\nAnaerobic — 2 ATP per glucose / relatively small amount; [1]",
        "examiner_note": "Fairly well answered. Some candidates wrote the chemical equations for the two types of respiration instead of just the ATP number. Some swapped the two numbers.",
        "explanation": "Per glucose molecule:\n• **Aerobic respiration: 38 ATP** (with O₂; complete oxidation in mitochondria) — high yield\n• **Anaerobic respiration: 2 ATP** (no O₂; glucose → lactic acid in muscle) — low yield\n\nThat's a ~19× difference. Why we need O₂: it's the difference between getting 2 vs 38 ATP from the same glucose.",
    },
    {
        "q": "4(c)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q4_STEM, "diagram": None,
        "prompt": "**(c)** State **three** uses of energy in the human body.",
        "memo": (
            "Any 3 of (1 mark each) — must be a PROCESS, not a description:\n"
            "• Growth / development / tissue repair / cell division / asexual reproduction;\n"
            "• Muscle contraction / movement / breathing / heartbeat / circulation;\n"
            "• Protein synthesis;\n"
            "• Transmission of nerve impulses / release of neurotransmitters;\n"
            "• Active transport;\n"
            "• Maintenance of constant body temperature;\n"
            "• Chemical reactions / metabolism;\n"
            "• Propelling sperm cells;\n"
            "• Mental activities;\n"
            "• Fighting pathogens;\n"
            "• Flicking movements of cilia;"
        ),
        "rubric": "Award 1 mark per process. STATEMENT form expected ('muscle contraction', 'active transport') NOT description form ('to remove waste products of metabolism'). PENALISE long-form descriptions that don't NAME the process.",
        "examiner_note": "Most candidates wrote descriptions of the uses of energy rather than STATING the main processes. For example, 'to remove waste products' instead of 'excretion'. Some over-specified ('active transport in the ileum' = limiting; just 'active transport' is fine).",
        "explanation": "Energy uses in the body — name any THREE as one-word/short processes:\n\n• **Muscle contraction** (movement, breathing, heartbeat)\n• **Active transport** (e.g. pumping ions across cell membranes)\n• **Protein synthesis** / cell building\n• **Growth, repair, cell division**\n• **Nerve impulse transmission**\n• **Temperature regulation** (keeping body at 37 °C)\n\nWrite the process NAME, not a description.",
    },
    # ──────── Q5 (10 marks) ────────
    {
        "q": "5(a)(i)", "marks": 4, "tier": "paid", "type": "free_text",
        "stem": Q5_STEM, "diagram": None,
        "prompt": "**(a)(i)** Classify the processes into those that **remove** carbon from the atmosphere and those that **return** carbon to the atmosphere.\n\nGive the answer as two lists.",
        "memo": (
            "Remove carbon FROM the atmosphere (1 mark each):\n"
            "• Photosynthesis;\n\n"
            "Return carbon TO the atmosphere (1 mark each):\n"
            "• Respiration;\n"
            "• Combustion;\n"
            "• Decomposition;\n\n[Total: 4 marks — full credit if all 4 placed correctly]"
        ),
        "rubric": "Award 1 mark per correctly classified process (4 total). Photosynthesis = REMOVES (uses CO₂). Respiration, combustion, decomposition = ALL RETURN CO₂ to the atmosphere.",
        "examiner_note": "Few candidates seemed not to have an idea of processes involved in the carbon cycle. Some failed to spell the processes correctly. Some drew the carbon cycle diagram instead of just listing the terms.",
        "explanation": "Carbon cycle direction matters:\n\n**REMOVES CO₂ from atmosphere:**\n• **Photosynthesis** — plants take in CO₂ to make glucose\n\n**RETURNS CO₂ to atmosphere:**\n• **Respiration** — living organisms release CO₂ as waste\n• **Combustion** — burning fuels (wood, petrol, coal) releases CO₂\n• **Decomposition** — bacteria/fungi break down dead matter and release CO₂\n\nOnly ONE process puts carbon INTO living organisms = photosynthesis. Every other process puts it back into the air.",
    },
    {
        "q": "5(a)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q5_STEM, "diagram": None,
        "prompt": "**(a)(ii)** Name **a** process in the carbon cycle that neither removes nor returns carbon to the atmosphere.",
        "accepted": ["fossilisation", "fossilization", "feeding"],
        "must_contain": ["foss"],
        "memo": "Feeding / fossilisation; [1 mark]",
        "examiner_note": "The majority of candidates could not identify the processes that neither remove nor return carbon to the atmosphere. Common misspellings: 'fosilation', 'fossilication', 'fossiliation', 'fossisation'.",
        "explanation": "Some carbon cycle steps just MOVE carbon BETWEEN reservoirs (without touching the atmosphere):\n\n• **Fossilisation** — dead organisms get buried under sediment, slowly turning into coal/oil/gas. Carbon moves from biosphere → underground.\n• **Feeding** — animals eat plants/other animals. Carbon moves between organisms, no atmospheric exchange.\n\nSpell **fossilisation** carefully — common misspellings lose the mark.",
    },
    {
        "q": "5(b)(i)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": "Fig. 5.2 shows how carbon dioxide affects the rate of photosynthesis in a plant.",
        "diagram": "co2-photo-graph",
        "prompt": "**(b)(i)** Describe the effect of changing the carbon dioxide concentration on the rate of photosynthesis. Use the information from Fig. 5.2 to illustrate your answer.",
        "memo": (
            "Any 3 of (1 mark each):\n"
            "1. Carbon dioxide is a reactant in photosynthesis;\n"
            "2. Increase in CO₂ concentration increases the rate of photosynthesis;\n"
            "3. Until an optimum is reached;\n"
            "4. Further increase in CO₂ concentration → rate remains constant;\n"
            "5. Reference to correct data: increase phase (0.008-0.078 % CO₂ → 0-20 arbitrary units rate) / constant phase (0.079-0.16 % CO₂ → 20 au rate);"
        ),
        "rubric": "Award 1 mark per point (max 3). Must include: (a) trend description (rate increases then plateaus); (b) reason (CO₂ is a reactant, but it stops being limiting); (c) data citation from the graph with UNITS. PENALISE: 'high' / 'lower' / 'greater' (use INCREASES / DECREASES); no data quoted; no units.",
        "examiner_note": "Many candidates misinterpreted the graph and couldn't differentiate dependent vs independent variables. Wrong words: 'high' instead of 'increase', 'lower' instead of 'decrease'. The majority failed to use correct figures from the graph and didn't give units.",
        "explanation": "How to describe a graph in 3 sentences:\n\n1. **Trend (low region)**: 'As CO₂ concentration increases from 0 to about 0.08 %, the rate of photosynthesis increases from 0 to about 20 arbitrary units.'\n2. **Reason**: 'CO₂ is a *reactant* in photosynthesis, so more CO₂ → faster reaction — *until* another factor (light, temperature, chlorophyll) becomes limiting.'\n3. **Trend (high region)**: 'Above ~0.08 % CO₂, the rate **plateaus** (stays constant) at about 20 au — CO₂ is no longer the limiting factor.'\n\nAlways cite NUMBERS with UNITS from the graph.",
    },
    {
        "q": "5(b)(ii)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": "Fig. 5.2 shows how carbon dioxide affects the rate of photosynthesis in a plant.",
        "diagram": "co2-photo-graph",
        "prompt": "**(b)(ii)** State the **balanced chemical equation** for photosynthesis.",
        "accepted": [
            "6CO2 + 6H2O -> C6H12O6 + 6O2",
            "6CO2 + 6H2O → C6H12O6 + 6O2",
            "6 CO2 + 6 H2O -> C6H12O6 + 6 O2",
            "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
        ],
        "must_contain": ["6CO", "6H", "C6H12O6", "6O"],
        "memo": "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂; [2 marks — 1 for reactants + products, 1 for balancing]",
        "examiner_note": "Some candidates could not distinguish between the chemical and word equations. Some failed to use an arrow to separate reactants from products. A few mixed up reactants vs products.",
        "explanation": "**Balanced chemical equation for photosynthesis:**\n\n**6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂**\n\n• Reactants (LEFT of arrow): 6 carbon dioxide + 6 water\n• Products (RIGHT of arrow): 1 glucose (C₆H₁₂O₆) + 6 oxygen\n• The 6s make it **balanced**: 6 C, 12 H, 18 O on each side\n\nUse an arrow (→), NOT an equals sign (=). Write the small numbers as subscripts where possible.",
    },
    # ──────── Q6 (10 marks) ────────
    {
        "q": "6(a)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q6_STEM, "diagram": "enzyme-stages",
        "prompt": "**(a)** Identify **Q** and **S** in Fig. 6.1.",
        "accepted": [
            "Q substrate S product",
            "Q-substrate S-products",
            "substrate, products",
        ],
        "must_contain": ["substrate", "product"],
        "memo": "Q — substrate; [1]\nS — product / products; [1]\n[Total 2 marks]",
        "examiner_note": "Most candidates answered correctly. Only a few misspelt 'substrate' — wrote 'substate', 'subrate', 'subtrate' or 'substance'. Candidates differentiate enzyme from substrate well.",
        "explanation": "Lock-and-key model of an enzyme reaction:\n\n• **Q (substrate)** — the molecule the enzyme acts on. Shape matches the enzyme's active site.\n• Enzyme + substrate → **enzyme-substrate complex** (stages 2 and 3)\n• **S (product/s)** — what the substrate is converted INTO after the reaction\n• The enzyme is unchanged and reusable\n\nSpell 'substrate' carefully — common wrong spellings lose the mark.",
    },
    {
        "q": "6(b)(i)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q6_STEM, "diagram": "enzyme-stages",
        "prompt": "**(b)(i)** Explain how a rise in temperature may **increase** the rate of an enzyme-controlled reaction.",
        "memo": (
            "Any 2 of (1 mark each):\n"
            "1. Heat provides energy to the molecules / more kinetic energy;\n"
            "2. Molecules move faster / more collisions occur;\n"
            "3. More enzyme-substrate complexes (ESC) form / more products formed;"
        ),
        "rubric": "Award 1 mark each: kinetic energy increases AND collision frequency increases AND more ESC. Must be about temperature BELOW optimum (the question says 'increase'). PENALISE answers about temperature ABOVE optimum (denaturation).",
        "examiner_note": "Most candidates answered this question poorly. They focused on the effect of INCREASE above optimum (denaturation) rather than from low → optimum and the rate of reaction.",
        "explanation": "Below the optimum temperature, heating SPEEDS UP the reaction:\n\n1. **Heat = kinetic energy** — enzyme and substrate molecules **move faster**\n2. **More collisions** between enzyme and substrate per second\n3. **More successful collisions** form enzyme-substrate complexes → faster product formation\n\nKey: the question asks about INCREASING the rate — so describe the temperature range BELOW the optimum. Above the optimum, the enzyme starts denaturing — that's the opposite effect.",
    },
    {
        "q": "6(b)(ii)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q6_STEM, "diagram": "enzyme-stages",
        "prompt": "**(b)(ii)** Suggest what happens to the **active site** when the enzyme is denatured by high temperature, and state **why** the enzyme can no longer catalyse a reaction even after the temperature is lowered.",
        "memo": (
            "Any 2 of (1 mark each):\n"
            "1. Active site loses / changes shape;\n"
            "2. Substrate no longer fits into the active site / does not complement the active site;\n"
            "3. The shape change is permanent / irreversible;"
        ),
        "rubric": "Award 1 mark each: (1) active-site shape changes; (2) substrate no longer fits / not complementary; (3) change is PERMANENT / IRREVERSIBLE — this last point is what answers WHY lowering temperature doesn't help. PENALISE 'enzyme changes shape' (must say ACTIVE SITE); 'enzyme fits onto active site' (substrate fits, not enzyme).",
        "examiner_note": "Above 50% answered correctly. A few candidates referred to the ENZYME changing shape instead of the ACTIVE SITE. Some said enzymes fit on the active site instead of the substrate.",
        "explanation": "**Denaturation** at high temperature:\n\n1. The strong heat **breaks the bonds** holding the enzyme's 3D shape together\n2. The **active site changes shape** (no longer the right shape for the substrate)\n3. **Substrate can no longer bind** → no enzyme-substrate complex → no reaction\n4. The change is **PERMANENT/IRREVERSIBLE** — cooling back down does NOT restore the original shape (think of a boiled egg — you can't 'unboil' it)\n\nKey word: **active site** (not just 'enzyme') AND **permanent**.",
    },
    {
        "q": "6(b)(iii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q6_STEM, "diagram": "enzyme-stages",
        "prompt": "**(b)(iii)** Name **one** other environmental factor that may cause the denaturation of an enzyme.",
        "accepted": ["pH", "ph", "pH (extreme)", "very high pH", "very low pH"],
        "must_contain": ["pH"],
        "memo": "pH; [1 mark]",
        "examiner_note": "The majority answered correctly although a few candidates referred to 'pH concentration', 'pH scale', 'extreme pH', 'pH range', 'low pH', 'high pH', 'pH of the enzyme', 'pH balance' or 'soil pH' — accept these.",
        "explanation": "Two environmental factors denature enzymes:\n• **Temperature** (already covered in this question)\n• **pH** — each enzyme has an optimum pH. Move too far from it (too acidic OR too alkaline) and the bonds holding the active site break → denaturation\n\nExamples: pepsin (stomach) prefers pH 2 (very acidic). Amylase (mouth/intestine) prefers pH 7. Put either enzyme in the wrong pH → denaturation.",
    },
    {
        "q": "6(c)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Chemical digestion occurs in the stomach.",
        "diagram": None,
        "prompt": "**(c)(i)** Name an **enzyme** that acts in the stomach.",
        "accepted": ["pepsin", "Pepsin"],
        "must_contain": ["pepsin"],
        "memo": "Pepsin; [1 mark]",
        "examiner_note": "Poorly answered. Candidates could not differentiate between enzymes, substrates and end products.",
        "explanation": "**Pepsin** — the main enzyme in the stomach.\n\n• Made by stomach lining cells\n• Works best in acidic conditions (pH ~2) — the stomach is acidic on purpose\n• Digests proteins into smaller peptides",
    },
    {
        "q": "6(c)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Chemical digestion occurs in the stomach. The enzyme that acts in the stomach is pepsin.",
        "diagram": None,
        "prompt": "**(c)(ii)** State the **substrate** of pepsin.",
        "accepted": ["protein", "proteins", "Protein"],
        "must_contain": ["protein"],
        "memo": "Protein; [1 mark]",
        "examiner_note": "Poorly answered. Candidates could not differentiate between enzymes, substrates and end products.",
        "explanation": "Pepsin's substrate = **protein**.\n\nIt's a protease (protein-cutting enzyme). It cuts long protein chains into shorter pieces (polypeptides). Other proteases work later in the small intestine to finish the job.",
    },
    {
        "q": "6(c)(iii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Chemical digestion occurs in the stomach. The enzyme pepsin digests protein.",
        "diagram": None,
        "prompt": "**(c)(iii)** State the **end products** of pepsin's reaction.",
        "accepted": ["polypeptides", "polypeptide", "peptides"],
        "must_contain": ["peptide"],
        "memo": "Polypeptides; [1 mark]",
        "examiner_note": "Poorly answered. Candidates could not differentiate between enzymes, substrates and end products.",
        "explanation": "Pepsin's products = **polypeptides** (shorter protein chains).\n\n• Pepsin is a *protease*, but it does NOT go all the way to amino acids\n• It chops long proteins into shorter polypeptides\n• These travel into the small intestine where OTHER enzymes (trypsin, peptidases) finish the breakdown → amino acids\n\nFinal end products of FULL protein digestion = amino acids — but pepsin alone stops at polypeptides.",
    },
    # ──────── Q7 (10 marks) ────────
    {
        "q": "7(a)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q7_STEM, "diagram": "flower-fertilise",
        "prompt": "**(a)** Describe the events that occur after germination of the pollen grain on the stigma leading to fertilisation.",
        "memo": (
            "Any 3 of (1 mark each):\n"
            "1. Growth of pollen tube (from the pollen grain);\n"
            "2. Through the style / ovary;\n"
            "3. The (male) nucleus inside the pollen grain slips / moves down the pollen tube as it grows;\n"
            "4. Pollen tube / male nucleus enters the ovule;\n"
            "5. The ovum in the ovule contains the female nucleus;\n"
            "6. The male nucleus FUSES with the female nucleus;\n"
            "7. To form a zygote;"
        ),
        "rubric": "Award 1 mark per event (max 3). Must include in correct order: pollen TUBE growth, route (style → ovary → ovule), and FUSION of nuclei. PENALISE 'pollen grain grows in style' (it's the TUBE, not the grain); 'combine' instead of 'fuse'; describing pollination rather than fertilisation.",
        "examiner_note": "Only a few candidates gave correct descriptions. Many referred to pollen TUBES as pollen GRAINS. Many seemed not to have an understanding of flower structure (e.g. 'pollen grain grows in style'). Many gave a DEFINITION of fertilisation instead of describing the events. Misspelt 'zygote' and 'gamete'. Some used 'combine' instead of 'fuse'.",
        "explanation": "Pollination → fertilisation pathway in 6 steps:\n\n1. **Pollen grain germinates** on the stigma\n2. **Pollen tube grows** down the style (the tube — not the grain — does the growing)\n3. Pollen tube reaches the **ovary**, then enters the **ovule**\n4. The **male nucleus** (inside the pollen tube) **moves down** the tube\n5. The male nucleus **FUSES** with the **female nucleus** (egg) inside the ovule\n6. Fusion forms a **zygote** — this is fertilisation\n\nKey vocabulary: **pollen tube** (not grain) grows; nuclei **fuse** (not 'combine').",
    },
    {
        "q": "7(b)(i)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q7_STEM + "\n\nFig. 7.2 shows self-pollination.",
        "diagram": "self-pollination",
        "prompt": "**(b)(i)** Define *self-pollination*.",
        "memo": (
            "Both points required (1 mark each):\n"
            "1. The transfer of pollen grains from the anther;\n"
            "2. To the stigma of the same flower OR a different flower on the same plant;"
        ),
        "rubric": "Award 1 mark for naming TRANSFER FROM ANTHER, and 1 mark for naming TO STIGMA OF SAME FLOWER or DIFFERENT FLOWER ON SAME PLANT. The 'same plant' qualifier is essential — without it, the definition doesn't distinguish from cross-pollination.",
        "examiner_note": "Fairly well answered. However, it seems candidates were not properly taught the SYLLABUS definition of self-pollination.",
        "explanation": "**Self-pollination** = transfer of pollen from the anther → stigma of the **same flower** OR a **different flower on the SAME plant**.\n\nKey: ANY part of the same plant. If pollen goes to a different plant of the same species, that's **cross-pollination** instead.\n\nWrite both halves to get both marks: 'from anther' AND 'to stigma of same flower / same plant'.",
    },
    {
        "q": "7(b)(ii)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q7_STEM, "diagram": "self-pollination",
        "prompt": "**(b)(ii)** Suggest **two advantages** and **one disadvantage** of self-pollination.",
        "memo": (
            "Two advantages (1 mark each):\n"
            "• Less pollen wasted;\n"
            "• No reliance / dependence on external carrier / pollinator;\n"
            "• Features of species can be maintained / better chance of survival;\n\n"
            "One disadvantage (1 mark):\n"
            "• Less / lack of variation in offspring / species;\n"
            "• Genetic defects may arise;\n"
            "• Reduced health of species / susceptible to diseases / resistance to disease is reduced;"
        ),
        "rubric": "Award 2 marks for two advantages (separate, distinct points) and 1 mark for one disadvantage. Must NOT confuse with asexual reproduction's advantages/disadvantages (asexual = no variation; self-pollination still produces variation via meiosis, but LESS variation than cross-pollination).",
        "examiner_note": "Many candidates could not suggest the advantages and disadvantages of self-pollination. Many stated the advantages of ASEXUAL REPRODUCTION instead.",
        "explanation": "**Self-pollination advantages** (it's reliable):\n• **Less pollen wasted** — pollen doesn't have to travel\n• **No dependence on insects/wind** — can happen even without pollinators\n• **Maintains good combinations** of genes/features in the species\n\n**Self-pollination disadvantage** (low variation):\n• **Less genetic variation** in offspring → less adaptable\n• **More risk of inheriting genetic defects** (closely-related genomes)\n• Whole population could be **wiped out by a single disease** if no resistant individuals exist\n\nDon't confuse this with asexual reproduction — self-pollination still uses gametes + meiosis.",
    },
    {
        "q": "7(b)(iii)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q7_STEM, "diagram": None,
        "prompt": "**(b)(iii)** Name **two** agents of pollination.",
        "accepted": [
            "insects and wind", "wind and insects",
            "insects, wind", "wind, insects",
        ],
        "must_contain": ["insect", "wind"],
        "memo": "Insects; [1]\nWind; [1]\n[Total 2 marks]",
        "examiner_note": "Well answered, yet some candidates listed animals (mammals, humans, water) as agents of pollination instead of insects and wind as stated in the syllabus.",
        "explanation": "Two agents of pollination (the NSSCO syllabus):\n• **Insects** (bees, butterflies, beetles) — carry pollen on their bodies between flowers\n• **Wind** — blows light pollen grains from anther to stigma (grasses, most cereal crops)\n\nWater and animals can technically be agents in nature, but the **syllabus** lists only **insects** and **wind**.",
    },
    # ──────── Q8 (10 marks) ────────
    {
        "q": "8(a)", "marks": 4, "tier": "paid", "type": "free_text",
        "stem": Q8_STEM, "diagram": "eukaryotic-cell",
        "prompt": "**(a)** State the functions of the following structures:\n\n• ribosome\n• mitochondria\n• smooth endoplasmic reticulum\n• vesicle",
        "memo": (
            "All four required (1 mark each):\n"
            "1. **Ribosomes** — protein synthesis;\n"
            "2. **Mitochondria** — site of (aerobic) respiration / energy release / produces ATP;\n"
            "3. **Smooth endoplasmic reticulum** — synthesis of lipids / metabolism of carbohydrates / production of steroid hormones / transport of substances (rough ER functions also accepted as smooth ER's specific role is not in syllabus);\n"
            "4. **Vesicles** — store / transport / digest / secrete substances / become lysosomes;"
        ),
        "rubric": "Award 1 mark each. Be flexible on phrasing of ER (smooth ER's specific role isn't in the syllabus, so any reasonable ER function counts). PENALISE 'mitochondria PRODUCES energy' (energy can't be 'produced'; it's released/transferred — but accept it if intent is clear).",
        "examiner_note": "Poorly answered (functions of eukaryotic cell parts). Many candidates didn't know all four functions.",
        "explanation": "Four organelle functions:\n\n1. **Ribosomes** — site of **protein synthesis** (read mRNA, make proteins)\n2. **Mitochondria** — site of **aerobic respiration** → release **ATP** (energy) for the cell\n3. **Smooth ER** — makes **lipids**, helps metabolise carbohydrates, makes steroid hormones, transports substances (the syllabus is flexible about ER details)\n4. **Vesicles** — small membrane sacs that **store, transport, or release** substances (secretion, digestion, etc.)\n\nMnemonic: 'Ribosome = Reading (mRNA), Mitochondria = Money (ATP), Smooth ER = Spreads (lipids), Vesicle = Vehicle (transport).'",
    },
    {
        "q": "8(b)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q8_STEM, "diagram": None,
        "prompt": "**(b)** Describe the structure of **DNA**.",
        "memo": (
            "Any 2 of (1 mark each):\n"
            "1. Two strands coiled together / forms a double helix;\n"
            "2. Consists of many nucleotides;\n"
            "3. Each nucleotide = sugar + phosphate + base;\n"
            "4. Strands contain bases A, T, C, G;\n"
            "5. Bases always pair the same way — A with T, C with G;"
        ),
        "rubric": "Award 2 marks max. At least ONE of the marks must come from structural features (double helix / nucleotide composition); the other can be from base pairing. PENALISE defining DNA's function ('carries genetic information') without structural details; defining 'chromosome' instead of DNA.",
        "examiner_note": "Most candidates defined CHROMOSOMES, but some wrote what DNA STANDS FOR. Others explained it as DNA testing between a parent and a child instead of describing the STRUCTURE.",
        "explanation": "**Structure of DNA** in 4 bullets:\n\n1. **Double helix** — two strands twisted around each other (Watson and Crick, 1953)\n2. Each strand is made of many **nucleotides** linked together\n3. Each **nucleotide** = phosphate group + 5-carbon sugar + 1 of 4 bases (A, T, C, G)\n4. **Bases pair specifically**: A↔T and C↔G — held by hydrogen bonds\n\nDon't confuse DNA (the molecule) with the chromosome (DNA + protein, supercoiled).",
    },
    {
        "q": "8(c)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q8_STEM, "diagram": None,
        "prompt": "**(c)(i)** Define *gene mutation*.",
        "accepted": [
            "a change in a base sequence of DNA",
            "change in the base sequence of DNA",
            "a change in the sequence of bases in DNA",
            "change in DNA base sequence",
        ],
        "must_contain": ["base", "DNA"],
        "memo": "A change in the base sequence of DNA; [1 mark]",
        "examiner_note": "Most candidates failed to define gene mutation. Many described chromosomal mutation, or environmental causes, instead of the molecular definition.",
        "explanation": "**Gene mutation = a change in the base sequence of DNA.**\n\nFor example, the sickle-cell anaemia mutation is just ONE base change in the haemoglobin gene (A→T in one position) — but it changes the resulting protein and causes the disease.\n\nKey words you need: **change**, **base sequence**, **DNA**.",
    },
    {
        "q": "8(c)(ii)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q8_STEM + "\n\nSickle cell anaemia was the first genetic disease to be described in terms of a gene mutation.",
        "diagram": None,
        "prompt": "**(c)(ii)** Describe the **symptoms** of sickle cell anaemia.",
        "memo": (
            "Any 3 of (1 mark each):\n"
            "• Distorted / sickle-shaped red blood cells / fewer normal red blood cells / less haemoglobin;\n"
            "• Fatigue / exhaustion / breathlessness / tiredness / less active;\n"
            "• Suffers strokes / thrombosis / formation of clots / heart attack / blindness / damage to lungs / kidneys / heart;\n"
            "• Painful crises / periods of pain / pain in joints and bones / swelling of hands or feet;\n"
            "• Yellowish / pale skin;\n"
            "• Often hospitalised for transfusion; at risk of acute chest syndrome;"
        ),
        "rubric": "Award 1 mark per symptom (max 3). Must be SYMPTOMS (what the patient experiences/shows), not features of Down syndrome (flat face, slanted eyes) which is a COMMON mistake. Accept any 3 distinct symptoms from the memo.",
        "examiner_note": "Poorly answered. Symptoms were not stated correctly. Many candidates described features of Down syndrome (flat faces, short fingers, slanted eyes) instead of sickle-cell symptoms.",
        "explanation": "**Sickle-cell anaemia symptoms** — name any THREE:\n\n• **Sickle-shaped red blood cells** — less surface area, less efficient at carrying O₂; cells get stuck in capillaries\n• **Fatigue, weakness, breathlessness** — less O₂ delivery to tissues\n• **Painful crises** — sickle cells block small blood vessels → pain in joints, bones, swelling of hands/feet\n• **Strokes / heart attack / organ damage** — blocked vessels in brain, heart, kidneys, lungs\n• **Pale or yellowish skin** (jaundice from broken-down red cells)\n• **Frequent hospitalisation** for blood transfusions\n\nDo NOT confuse with Down syndrome — different condition, different cause (chromosomal not gene mutation).",
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
    out.append(f"-- NSSCO Biology 2023 Paper 2 (6116/2) — 8 questions, {len(QUESTIONS)} sub-parts, 80 marks")
    out.append("-- Verbatim NIED wording from past-papers/nssco-biology/2023/")
    out.append("-- Mark scheme + commentary from DNEA Examiners Report 2023 (pages 50-58)")
    out.append("-- Diagrams: public/past-papers/biology-nssco-2023-p2/*.png")
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
            out.append(f"    bio_id, 2023, '2', '{q['q']}', {q['marks']}, '{q['tier']}',")
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
            out.append(f"    bio_id, 2023, '2', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'free_text',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['rubric'])},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        out.append("")

    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} structured sub-parts for Biology NSSCO 2023 Paper 2';")
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
