"""Build the NSSCO Biology 2024 Paper 1 question set: diagrams + SQL migration.

This file is the SINGLE SOURCE OF TRUTH for all 40 MCQ questions in Paper 1.
Each question is a dict with verbatim prompt + options + the official answer
(from the DNEA Examiner's Report 2024). For questions with diagrams, a
(page_filename, y_top, y_bot, x_left, x_right) tuple specifies how to crop the
diagram from the page render produced by scripts/pdf_to_pages.py.

Outputs:
  - public/past-papers/biology-nssco-2024-p1/q{N}-{name}.png  (per-question crops)
  - supabase/migrations/{ts}_biology_nssco_2024_p1.sql        (40 INSERT rows)

Run:
  PYTHONIOENCODING=utf-8 python scripts/build_2024_p1.py
"""
from __future__ import annotations
import json
import re
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2024-p1"
PNG_DIR = ROOT / "public" / "past-papers" / "biology-nssco-2024-p1"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260523000000_biology_nssco_2024_p1.sql"

# Crop tuple: (page_filename, y_top, y_bot, x_left, x_right) in fractions of the page.
# Example: ("page-02", 0.10, 0.28, 0.30, 0.75)  -> crops page-02.png from y=10%..28% and x=30%..75%
# None = no diagram for this question (text-only or table inline in prompt).

QUESTIONS = [
    # ── Q1: instrument (digital balance showing 0.007 g) ────────────────────
    {
        "q": "1", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The diagram shows an instrument that can be used in a Biology laboratory.\n\nWhat does the instrument measure?",
        "options": [("a", "mass"), ("b", "temperature"), ("c", "time"), ("d", "volume")],
        "commentary": "A — mass [1 mark]. This was the easiest question in the paper and 97% of candidates got it right.",
        "explanation": "A digital balance (electronic scale) displays **mass** in grams. The reading '0.007 g' is what tells you it measures mass — not temperature (°C), time (seconds), or volume (cm³).",
        "diagram": ("page-02", 0.08, 0.20, 0.28, 0.75, "instrument"),
    },
    # ── Q2: binomial system (text only) ────────────────────────────────────
    {
        "q": "2", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Which two taxa are used in naming organisms using the binomial system?",
        "options": [("a", "family and kingdom"), ("b", "family and genus"), ("c", "genus and species"), ("d", "kingdom and species")],
        "commentary": "C — genus and species [1 mark]. This question was scored by 92% of candidates as it only required basic information about the binomial system.",
        "explanation": "The binomial (two-name) system uses **genus** (capitalised, e.g. *Homo*) and **species** (lowercase, e.g. *sapiens*). Together they uniquely name an organism. Family, kingdom, etc. are higher classification levels — not part of the species name.",
        "diagram": None,
    },
    # ── Q3: palisade vs liver cell (text only) ──────────────────────────────
    {
        "q": "3", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "Palisade cells are found in plant leaves.\n\nWhich feature is present in a palisade cell but **not** in a liver cell?",
        "options": [("a", "cell membrane"), ("b", "chloroplast"), ("c", "cytoplasm"), ("d", "nucleus")],
        "commentary": "B — chloroplast [1 mark]. The majority of candidates (73%) did well; wrong answers were scattered almost equally among the other three options.",
        "explanation": "Palisade cells are PLANT cells specialised for photosynthesis — they have **chloroplasts** packed with chlorophyll. Liver (animal) cells lack chloroplasts. Cell membrane, cytoplasm and nucleus are found in both plant AND animal cells.",
        "diagram": None,
    },
    # ── Q4: magnification (text only) ───────────────────────────────────────
    {
        "q": "4", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "The actual size of an object is 2000 µm.  A drawing of the same object measures 50 mm.\n\nWhat is the magnification of the drawing?",
        "options": [("a", "× 0.025"), ("b", "× 25"), ("c", "× 100"), ("d", "× 100 000")],
        "commentary": "B — × 25 [1 mark]. Poorly performed; many candidates chose A because they divided drawing size by actual size without first converting to the same unit. Convert: 50 mm × 1000 = 50 000 µm. Magnification = 50 000 µm ÷ 2000 µm = ×25.",
        "explanation": "**Magnification = image size ÷ actual size.** But BOTH must be in the same unit first.\n• 50 mm = 50 000 µm\n• 50 000 ÷ 2000 = **×25**\n\nNever divide values with different units — that's where most learners lose this mark.",
        "diagram": None,
    },
    # ── Q5: leaf level of organisation (diagram) ────────────────────────────
    {
        "q": "5", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "The diagram shows a leaf.\n\nAt what level of organisation is a leaf?",
        "options": [("a", "cell"), ("b", "organ"), ("c", "organ system"), ("d", "tissue")],
        "commentary": "B — organ [1 mark]. Only 45% of candidates answered correctly. Second most popular was D (tissue). Teachers should give examples of plant tissues and organ systems when teaching levels of organisation.",
        "explanation": "Levels of organisation, smallest → largest: **cell → tissue → organ → organ system → organism.** A leaf is made of SEVERAL tissues (epidermis, palisade, spongy mesophyll, xylem, phloem) working together for one function (photosynthesis) — that makes it an **organ**.",
        "diagram": ("page-03", 0.06, 0.24, 0.28, 0.65, "leaf"),
    },
    # ── Q6: eukaryotic cell (diagram with labels A-D) ───────────────────────
    {
        "q": "6", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The diagram shows a eukaryotic cell.\n\nWhich structure produces ATP during respiration?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "A [1 mark]. Slightly above-average score; second most popular was B. It is very important for learners to identify parts of the cell.",
        "explanation": "**Mitochondria** are the site of aerobic respiration — they produce ATP (energy). Label A points to a mitochondrion (oval shape with inner folds). B = ribosomes/ER, C = nucleus, D = membrane structures.",
        "diagram": ("page-03", 0.43, 0.78, 0.28, 0.68, "eukaryotic-cell"),
    },
    # ── Q7: molecule movement into cell (diagram) ───────────────────────────
    {
        "q": "7", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The diagram shows the movement of molecules from outside the cell into the cell.\n\nWhich phrase describes how the molecules move from outside the cell into the cell?",
        "options": [
            ("a", "against the concentration gradient by active transport"),
            ("b", "against the concentration gradient by facilitated diffusion"),
            ("c", "down a concentration gradient by osmosis"),
            ("d", "down a concentration gradient by diffusion"),
        ],
        "commentary": "A — against the concentration gradient by active transport [1 mark]. A significant number of candidates were split between C and D — they thought movement was diffusion, but the diagram shows molecules going from LOWER to HIGHER concentration AND energy is involved.",
        "explanation": "Two clues in the diagram: (1) more molecules on the INSIDE than OUTSIDE means movement is **against the concentration gradient**, and (2) the 'energy' burst symbol means ATP is being used. Together = **active transport**. Diffusion and osmosis are passive (no energy, down a gradient).",
        "diagram": ("page-04", 0.04, 0.26, 0.18, 0.85, "molecule-movement"),
    },
    # ── Q8: DNA base pairing (text only) ────────────────────────────────────
    {
        "q": "8", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "DNA bases pair up to form two strands during DNA replication.\n\nWhich bases are paired correctly?",
        "options": [("a", "G with A"), ("b", "G with C"), ("c", "G with G"), ("d", "G with T")],
        "commentary": "B — G with C [1 mark]. About 56% got it right (low for a simple recall question). Mnemonic suggestion from the examiners: 'Apples are in the Tree and Cars are in the Garage' (A–T and C–G).",
        "explanation": "DNA has 4 bases: **A, T, C, G**. They pair only in specific ways:\n• A pairs with T (Apples ↔ Tree)\n• C pairs with G (Cars ↔ Garage)\n\nSo **G pairs only with C**.",
        "diagram": None,
    },
    # ── Q9: reducing sugar test table ──────────────────────────────────────
    {
        "q": "9", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "A learner carried out a food test to determine whether milk sugar, lactose, is a reducing sugar.\n\nWhich row is a correct description of the test?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "C [1 mark]. 48% got it correct. Candidates only needed to know the reagent, procedure and positive result for the reducing sugar test — likely due to insufficient laboratory practical work in schools.",
        "explanation": "**Benedict's test** for reducing sugars: add Benedict's solution → HEAT in a water bath → positive result is a **brick-red precipitate**. Biuret is for protein (not sugar). Always 'heat' for Benedict's. The exact colour examiners want is 'brick-red', not just 'red' or 'orange'.",
        "diagram": ("page-04", 0.42, 0.78, 0.18, 0.82, "food-test-table"),
    },
    # ── Q10: enzyme temperature graph ──────────────────────────────────────
    {
        "q": "10", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The graph shows the effect of temperature on the activity of an enzyme.\n\nAt which temperature is the enzyme **most** active?",
        "options": [("a", "15°C"), ("b", "35°C"), ("c", "45°C"), ("d", "55°C")],
        "commentary": "C — 45°C [1 mark]. 62% of candidates interpreted the graph correctly.",
        "explanation": "**Optimum temperature** = the temperature at which the enzyme works fastest = the PEAK of the graph. Below the peak, the enzyme is too slow. Above the peak, the enzyme denatures (its shape changes irreversibly). For this graph, the peak is at **45°C**.",
        "diagram": ("page-05", 0.05, 0.28, 0.20, 0.75, "enzyme-graph"),
    },
    # ── Q11: nitrate deficiency (text only) ────────────────────────────────
    {
        "q": "11", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "What will happen to a green plant grown in soil that is deficient in nitrate ions?",
        "options": [
            ("a", "It will have large leaves and small flowers."),
            ("b", "It will have purple leaves and poor root growth."),
            ("c", "It will have yellow leaves and poor overall growth."),
            ("d", "It will have white leaves and a thick stem."),
        ],
        "commentary": "C [1 mark]. 68% answered correctly. Option A came second — likely because of 'large leaves'.",
        "explanation": "Plants need **nitrate ions** to make proteins (including chlorophyll). Without nitrates:\n• Yellow leaves (no chlorophyll → no green colour)\n• Poor overall growth (no proteins for tissue building)\n\nPurple leaves = phosphate deficiency. White leaves = magnesium deficiency.",
        "diagram": None,
    },
    # ── Q12: digestion of starch (text only) ───────────────────────────────
    {
        "q": "12", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "In which part of the human alimentary canal does the digestion of starch begin?",
        "options": [("a", "mouth"), ("b", "oesophagus"), ("c", "small intestine"), ("d", "stomach")],
        "commentary": "A — mouth [1 mark]. Only 52% got it correct; option D (stomach) was second most popular.",
        "explanation": "Starch digestion starts in the **mouth** thanks to the enzyme **salivary amylase** in saliva. The oesophagus only transports food. The stomach digests protein (pepsin). Starch digestion continues in the small intestine (pancreatic amylase) but doesn't BEGIN there.",
        "diagram": None,
    },
    # ── Q13: nutrition order (text only — arrows visual but no diagram crop) ──
    {
        "q": "13", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "In which order do these events occur in human nutrition?",
        "options": [
            ("a", "digestion → ingestion → absorption → egestion"),
            ("b", "digestion → ingestion → egestion → absorption"),
            ("c", "ingestion → digestion → absorption → egestion"),
            ("d", "ingestion → digestion → egestion → absorption"),
        ],
        "commentary": "C [1 mark]. Well performed — 76% scored.",
        "explanation": "Nutrition steps in order:\n1. **Ingestion** — taking food into the mouth\n2. **Digestion** — breaking food down (mechanical + enzymes)\n3. **Absorption** — small soluble molecules pass into the blood (small intestine)\n4. **Egestion** — undigested waste leaves the body (anus)\n\nNote: egestion is ALWAYS last.",
        "diagram": None,
    },
    # ── Q14: food packet tables (diagrams) ─────────────────────────────────
    {
        "q": "14", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The information below is taken from four packets of food.\n\nWhich food would be suitable for a person suffering from constipation?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "C [1 mark]. 60% of candidates scored; option A also attracted a number of candidates.",
        "explanation": "Constipation = difficulty passing faeces. The remedy is **high fibre** — fibre adds bulk to faeces and stimulates peristalsis in the gut. Look at the fibre values:\n• A = 1 g\n• B = 4.9 g\n• C = **8.1 g** ← highest\n• D = 1.1 g\n\nThe food with the most fibre helps constipation most.",
        "diagram": ("page-06", 0.06, 0.42, 0.10, 0.90, "food-packets"),
    },
    # ── Q15: transpiration graph (diagram) ─────────────────────────────────
    {
        "q": "15", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The graph shows how the rate of transpiration is affected by factor **X**.\n\nWhat could be factor **X**?",
        "options": [("a", "humidity"), ("b", "light intensity"), ("c", "temperature"), ("d", "wind speed")],
        "commentary": "A — humidity [1 mark]. Poorly performed — only 40% got it right. Candidates continue to struggle with graph interpretation.",
        "explanation": "The graph shows transpiration **DECREASING** as factor X **INCREASES**.\n• **Humidity**: more humid air → less water vapour gradient between leaf and air → slower transpiration ✓\n• Light intensity, temperature, wind speed all INCREASE transpiration.\n\nOnly humidity decreases it — so X = humidity.",
        "diagram": ("page-06", 0.44, 0.84, 0.18, 0.75, "transpiration-graph"),
    },
    # ── Q16: plant stem section (diagram) ──────────────────────────────────
    {
        "q": "16", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The diagram shows a section through a plant stem.\n\nIn which tissue does the translocation of systemic pesticides take place?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "C [1 mark]. Below-average — 48% got it right. Option A also attracted candidates — likely because they confused xylem and phloem.",
        "explanation": "**Translocation** = movement of sugars (and absorbed pesticides) through the **phloem**. Xylem only transports water + minerals UPWARDS from roots to leaves; it cannot move pesticides 'systemically' through the plant. Phloem in the stem is usually shown as the OUTER ring of the vascular bundle.",
        "diagram": ("page-07", 0.04, 0.32, 0.15, 0.85, "stem-section"),
    },
    # ── Q17: heart blood vessels labelled 1-4 (diagram + table options) ────
    {
        "q": "17", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "The diagram shows a vertical section through the heart.\n\nWhat are the functions of the blood vessels numbered 1, 2, 3 and 4?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "D [1 mark]. Only 43% got it correct. Candidates needed to know the function of four blood vessels and this proved a challenge.",
        "explanation": "The four major heart vessels:\n• **1 (vena cava)** — carries blood FROM the body to the heart\n• **2 (pulmonary artery)** — carries blood TO the lungs\n• **3 (pulmonary vein)** — carries blood FROM the lungs\n• **4 (aorta)** — carries blood TO the body\n\nSo: 1=from body, 2=to lungs, 3=from lungs, 4=to body — row **D** matches.",
        "diagram": ("page-07", 0.35, 0.84, 0.10, 0.85, "heart-vessels"),
    },
    # ── Q18: coronary disease method (diagram) ─────────────────────────────
    {
        "q": "18", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The diagram shows a method of treating coronary heart disease.\n\nWhich method of treating a coronary heart disease is shown in the diagram?",
        "options": [("a", "angioplasty"), ("b", "coronary by-pass"), ("c", "stent"), ("d", "using aspirin")],
        "commentary": "A — angioplasty [1 mark]. Only 37% scored — one of the poorest-performing questions. Candidates should be made familiar with the images of different procedures.",
        "explanation": "The diagram shows a **balloon being inflated inside the artery** to widen it — that's **angioplasty**. A stent would be a metal mesh left in place. By-pass uses a graft vessel. Aspirin is a drug, not a procedure.",
        "diagram": ("page-08", 0.06, 0.32, 0.10, 0.92, "angioplasty"),
    },
    # ── Q19: mechanical defences (text only) ───────────────────────────────
    {
        "q": "19", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The body has different types of defences against pathogens.\n\n1. antibodies\n2. hair in the nose\n3. mucus\n4. skin\n\nWhich defences are mechanical?",
        "options": [
            ("a", "1 and 2 only"),
            ("b", "1, 2 and 3 only"),
            ("c", "2, 3 and 4 only"),
            ("d", "2 and 4 only"),
        ],
        "commentary": "C — 2, 3 and 4 only [1 mark]. Only 39% got it correct. Many candidates failed to link **mucus** to mechanical defence.",
        "explanation": "**Mechanical (physical) defences** physically BLOCK or TRAP pathogens before they enter cells:\n• Hair in nose — traps dust/microbes ✓\n• Mucus — traps microbes in the airways ✓\n• Skin — physical barrier ✓\n\nAntibodies are CHEMICAL (specific immune response, not mechanical).",
        "diagram": None,
    },
    # ── Q20: inspired/expired air table (diagram) ──────────────────────────
    {
        "q": "20", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "The table shows the composition of inspired and expired air.\n\nWhat are the percentages of **X** and **Y**?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "B [1 mark]. Slightly above-average — only 51% scored.",
        "explanation": "Inspired vs expired air:\n• CO₂ goes from 0.04% (inspired) up to about **4%** (expired) — we breathe OUT more CO₂\n• Nitrogen stays at **78%** — it's not used by the body\n• Other gases stay 1%\n\nSo X = 4 and Y = 78 — row **B**.",
        "diagram": ("page-09", 0.05, 0.50, 0.10, 0.85, "air-table"),
    },
    # ── Q21: aerobic respiration equation (diagram) ────────────────────────
    {
        "q": "21", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The equation for aerobic respiration given below is incomplete.\n\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + ……………\n\nWhich information is needed to complete it?",
        "options": [("a", "C₃H₆O₃"), ("b", "2C₂H₅OH"), ("c", "6H₂O"), ("d", "6O₂")],
        "commentary": "C — 6H₂O [1 mark]. Well performed — 76% scored.",
        "explanation": "**Aerobic respiration** word + balanced equation:\n\nglucose + oxygen → carbon dioxide + water + ENERGY\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + **6H₂O**\n\nThe missing product is water (6 H₂O molecules to balance the hydrogen and oxygen atoms).",
        "diagram": None,
    },
    # ── Q22: human urinary system (diagram) ────────────────────────────────
    {
        "q": "22", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The diagram shows the human urinary system.\n\nWhich organ re-absorbs glucose so that glucose is not lost in urine?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "A — kidney [1 mark]. Well performed — 77% scored.",
        "explanation": "The **kidney** (A) filters blood AND re-absorbs useful substances like **glucose, water, and salts** back into the blood, so they aren't lost in urine. B = ureter (transports urine), C = bladder (stores urine), D = urethra (releases urine).",
        "diagram": ("page-09", 0.52, 0.92, 0.30, 0.78, "urinary-system"),
    },
    # ── Q23: kidney transplant advantage (text only) ───────────────────────
    {
        "q": "23", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "In which way is a kidney transplant advantageous compared to the dialysis treatment?",
        "options": [
            ("a", "there is no organ rejection"),
            ("b", "it is a permanent solution"),
            ("c", "it is less expensive"),
            ("d", "it is not a risky procedure"),
        ],
        "commentary": "B [1 mark]. Only 41% scored. Many candidates opted for D — but a transplant is a surgical procedure, so it IS risky.",
        "explanation": "A kidney transplant is a **permanent (or long-term) solution** — you replace the failed kidney with a working one, so you no longer need dialysis. However, the transplant CAN be rejected, it IS expensive (surgery + lifelong drugs), and surgery IS risky. The only true advantage among the options is permanence.",
        "diagram": None,
    },
    # ── Q24: seedling response to light (diagram) ──────────────────────────
    {
        "q": "24", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The diagram shows a seedling responding to light.\n\nWhat explains the response of the shoot?",
        "options": [
            ("a", "inhibited cell elongation of the lower side of the shoot"),
            ("b", "equal growth of cells on the upper and lower sides of the shoot"),
            ("c", "stimulated cell elongation of the lower side of the shoot"),
            ("d", "slowed growth of cells of the whole shoot"),
        ],
        "commentary": "C [1 mark]. Only 48% got it correct. Answers were 'all over', indicating confusion about tropism.",
        "explanation": "This is **positive phototropism** — shoots grow TOWARDS light. The hormone **auxin** moves to the shaded (lower) side of the shoot. Auxin **stimulates** cells on the shaded side to elongate (grow longer), making the shoot bend towards the light. Stimulation, not inhibition.",
        "diagram": ("page-10", 0.10, 0.42, 0.20, 0.80, "phototropism"),
    },
    # ── Q25: neurone (diagram) ─────────────────────────────────────────────
    {
        "q": "25", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The diagram shows a neurone.\n\nWhich neurone is shown in the diagram?",
        "options": [("a", "motor"), ("b", "relay"), ("c", "sensory"), ("d", "synapse")],
        "commentary": "C — sensory [1 mark]. 59% scored.",
        "explanation": "Three types of neurone:\n• **Sensory** — long DENDRITE from receptor to cell body, then a short axon to the spinal cord. Cell body is in the middle/side, not at the end.\n• **Motor** — cell body at one end, long axon to the muscle.\n• **Relay** — short, found in CNS.\n\nThe diagram shows a long dendrite and the cell body to one side — that's a **sensory** neurone. (Synapse isn't a neurone — it's the gap between two neurones.)",
        "diagram": ("page-10", 0.42, 0.66, 0.10, 0.92, "neurone"),
    },
    # ── Q26: eye accommodation (diagram + table options) ───────────────────
    {
        "q": "26", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The parts of the eye shown in the diagram are involved in accommodation.\n\nHow does each part change to accommodate a near object?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "A [1 mark]. Only 30% got it correct. Candidates needed to know the changes in three parts of the eye to accommodate a NEAR object. What happens for a near object is the opposite of what happens for a far object.",
        "explanation": "Accommodation for a **NEAR** object:\n• **Ciliary muscles CONTRACT** (tighten)\n• **Suspensory ligaments SLACKEN** (loosen)\n• **Lens becomes MORE CONVEX** (fatter) — bends light more\n\nFor a far object, it's the opposite (relax / tighten / less convex). Row **A** matches near-object accommodation.",
        "diagram": ("page-11", 0.05, 0.42, 0.10, 0.90, "eye-accommodation"),
    },
    # ── Q27: voluntary action (text only) ──────────────────────────────────
    {
        "q": "27", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Which response is an example of a voluntary action?",
        "options": [
            ("a", "changing the size of the pupil when entering a brightly lit room"),
            ("b", "salivating when looking at a delicious meal"),
            ("c", "answering the teacher's question in class"),
            ("d", "withdrawing a hand from a hot object"),
        ],
        "commentary": "C [1 mark]. 51% scored. Options A and D were also very popular.",
        "explanation": "**Voluntary actions** are controlled CONSCIOUSLY by the brain — you choose to do them. Answering a question requires thought → voluntary. The others are reflexes (involuntary, automatic): pupil constriction, salivation, hand withdrawal from heat all happen without conscious thought.",
        "diagram": None,
    },
    # ── Q28: endocrine glands (diagram) ────────────────────────────────────
    {
        "q": "28", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "The diagram shows the major endocrine glands in the human body.\n\nWhich endocrine gland produces insulin?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "B — pancreas [1 mark]. 67% answered correctly.",
        "explanation": "**Insulin** is produced by the **pancreas** (B in the diagram, located behind the stomach). A = pituitary (in brain), C = adrenals (on top of kidneys), D = ovaries/testes. Insulin lowers blood glucose by telling the liver to convert glucose into glycogen.",
        "diagram": ("page-11", 0.46, 0.92, 0.18, 0.85, "endocrine-glands"),
    },
    # ── Q29: temperature regulation (text only) ────────────────────────────
    {
        "q": "29", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Below is a list of processes involved in temperature regulation in humans.\n\n• shivering\n• sweating\n• vasoconstriction\n• vasodilation\n\nWhich processes occur when the body temperature rises above 37°C?",
        "options": [
            ("a", "shivering and sweating"),
            ("b", "sweating and vasoconstriction"),
            ("c", "sweating and vasodilation"),
            ("d", "vasoconstriction and vasodilation"),
        ],
        "commentary": "C [1 mark]. 58% scored.",
        "explanation": "When body temperature is **too HIGH** (above 37°C):\n• **Sweating** — sweat evaporates from skin, removing heat ✓\n• **Vasodilation** — skin blood vessels widen, more heat lost by radiation ✓\n\nShivering and vasoconstriction are responses to being too COLD — they generate or conserve heat.",
        "diagram": None,
    },
    # ── Q30: chromosomes sperm vs skin cell (text-only table) ──────────────
    {
        "q": "30", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "The diploid number of chromosomes in the nucleus of the cell of a domestic cat is 38.\n\nHow many chromosomes will be in a sperm cell nucleus and a skin cell nucleus?",
        "options": [
            ("a", "sperm 19, skin 19"),
            ("b", "sperm 19, skin 38"),
            ("c", "sperm 38, skin 38"),
            ("d", "sperm 38, skin 19"),
        ],
        "commentary": "B [1 mark]. Most poorly performed question — only 25% scored. Most popular option was A, which is totally incorrect.",
        "explanation": "A sperm cell is a **gamete** — it's HAPLOID, so it has HALF the diploid number: 38 ÷ 2 = **19 chromosomes**. A skin cell is a normal body (somatic) cell — it stays DIPLOID with the full **38 chromosomes**. Fertilisation will then restore 38 in the zygote.",
        "diagram": None,
    },
    # ── Q31: menstrual cycle hormones — table options ──────────────────────
    {
        "q": "31", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "The menstrual cycle is controlled by the hormones FSH, LH, oestrogen and progesterone.\n\nWhich row shows a correct match between a hormone and its function?",
        "options": [
            ("a", "FSH — repairs the endometrium after menstruation"),
            ("b", "LH — causes the release of the mature egg from the ovary"),
            ("c", "oestrogen — maintains the thickness of the endometrium"),
            ("d", "progesterone — causes the growth of the follicles in the ovary"),
        ],
        "commentary": "B [1 mark]. Only 36% scored. Option C was nearly as popular as the correct B. More emphasis is needed on the function of reproductive hormones.",
        "explanation": "Correct hormone–function pairs:\n• **FSH** — grows the follicle (NOT repair the lining)\n• **LH** — triggers ovulation (releases the egg) ✓\n• **Oestrogen** — repairs the lining (NOT maintain it)\n• **Progesterone** — maintains the lining (NOT grow follicles)\n\nOnly row B is correct.",
        "diagram": None,
    },
    # ── Q32: umbilical cord (diagram) ──────────────────────────────────────
    {
        "q": "32", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The diagram shows a foetus during pregnancy.\n\nWhat is the function of the umbilical cord?",
        "options": [
            ("a", "absorbs mechanical shock"),
            ("b", "absorbs excess heat during pregnancy"),
            ("c", "attaches the foetus to the placenta"),
            ("d", "produces hormones during pregnancy"),
        ],
        "commentary": "C [1 mark]. Well performed by 83% of candidates.",
        "explanation": "The **umbilical cord** connects the foetus to the **placenta**. Blood vessels inside the cord carry oxygen and nutrients TO the foetus and waste AWAY from it. Mechanical shock is absorbed by **amniotic fluid**. Hormones are made by the **placenta**, not the cord.",
        "diagram": ("page-13", 0.04, 0.21, 0.18, 0.82, "umbilical-cord"),
    },
    # ── Q33: birth control with surgery (text only) ────────────────────────
    {
        "q": "33", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which method of birth control involves surgery?",
        "options": [("a", "abstinence"), ("b", "condom"), ("c", "IUD"), ("d", "vasectomy")],
        "commentary": "D — vasectomy [1 mark]. 62% scored.",
        "explanation": "A **vasectomy** is a surgical operation that cuts and ties the sperm ducts (vas deferens) in a male. The others are non-surgical: abstinence (behaviour), condom (barrier), IUD (fitted device — placed, not 'surgical').",
        "diagram": None,
    },
    # ── Q34: genetic cross 3:1 (text only) ─────────────────────────────────
    {
        "q": "34", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Height in plants is controlled by a pair of alleles.  Allele T for tall height is dominant over allele t for short height.  Plants can be cross-pollinated to produce the required height.\n\nWhich crossing will produce a phenotypic ratio of 3:1 tall to short in the offspring?",
        "options": [("a", "TT × tt"), ("b", "Tt × tt"), ("c", "Tt × Tt"), ("d", "TT × Tt")],
        "commentary": "C [1 mark]. Slightly above average — 53% scored.",
        "explanation": "Only **Tt × Tt** gives a 3:1 ratio. Punnett square:\n\n|  | T | t |\n|--|---|---|\n|T | TT| Tt|\n|t | Tt| tt|\n\n→ 1 TT + 2 Tt = 3 tall; 1 tt = 1 short. **3:1**.\n\nThe other crosses give: TT×tt → all Tt (all tall); Tt×tt → 1:1; TT×Tt → all tall.",
        "diagram": None,
    },
    # ── Q35: discontinuous variation (text only) ───────────────────────────
    {
        "q": "35", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which type of variation is discontinuous?",
        "options": [
            ("a", "height in humans"),
            ("b", "length of leaves"),
            ("c", "mass of seeds"),
            ("d", "sex in humans"),
        ],
        "commentary": "D — sex in humans [1 mark]. Only 43% scored, although it appears to be an easy question.",
        "explanation": "**Discontinuous** variation has a SMALL number of distinct categories with NO intermediates — e.g. male / female, blood group A/B/AB/O, attached/free earlobe. Height, leaf length, and seed mass all show a CONTINUOUS range (any value within a range) — that's **continuous** variation.",
        "diagram": None,
    },
    # ── Q36: hydrophyte leaf (diagram with labels A-D) ─────────────────────
    {
        "q": "36", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "The diagram shows a photomicrograph of a leaf of a hydrophyte.\n\nWhich adaptive feature enables the leaf to float on the water surface?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "B [1 mark]. Extremely poorly performed — only 28% scored. It seems the adaptive feature of large air spaces in aquatic plants is not well known.",
        "explanation": "A **hydrophyte** (water plant) has **large air spaces** (called aerenchyma) inside the leaf — these make the leaf less dense than water so it floats. Label B points to the large air-filled cavities. The other labels point to epidermis, cuticle, and other tissues that don't provide buoyancy.",
        "diagram": ("page-14", 0.07, 0.24, 0.18, 0.82, "hydrophyte-leaf"),
    },
    # ── Q37: food chain energy (text only) ─────────────────────────────────
    {
        "q": "37", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which organism has the lowest amount of energy available compared to the energy entering the food chain?",
        "options": [
            ("a", "carnivore that feeds on herbivores"),
            ("b", "herbivores that feed on the producers"),
            ("c", "producer that makes its own food"),
            ("d", "consumer that feeds on carnivores"),
        ],
        "commentary": "D [1 mark]. Only 40% scored. Many candidates were attracted to C — but C is the PRODUCER which has the MOST energy.",
        "explanation": "Energy **decreases** at each trophic level (only ~10% passes on — the rest is lost as heat). The LONGER the food chain, the LESS energy reaches the top. A 'consumer that feeds on carnivores' = TERTIARY consumer (4th level) — that's the highest level listed, so it has the LEAST energy.",
        "diagram": None,
    },
    # ── Q38: sigmoid growth curve (diagram) ────────────────────────────────
    {
        "q": "38", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The graph shows the phases of the sigmoid growth curve of population growth.\n\nWhich factor could limit the growth of the population at 5?",
        "options": [
            ("a", "decreased predation"),
            ("b", "lack of diseases"),
            ("c", "limited food supply"),
            ("d", "excess of reproducing individuals"),
        ],
        "commentary": "C [1 mark]. 63% got it correct.",
        "explanation": "Stage 5 on a sigmoid growth curve is the **stationary/plateau phase** — population is no longer growing because **limiting factors** (food, water, space, predators, disease) cap the size. **Limited food supply** is a classic limiting factor. The other options would all ALLOW growth, not limit it.",
        "diagram": ("page-14", 0.46, 0.70, 0.22, 0.78, "sigmoid-growth"),
    },
    # ── Q39: eutrophication sequence (text only) ───────────────────────────
    {
        "q": "39", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "The events listed below occur during eutrophication in a lake.\n\n1. aerobic bacteria break down dead organic matter\n2. algae absorb the nutrients, bloom and die\n3. amphibians, crustaceans and fish die due to lack of oxygen\n4. nutrients enter the lake\n5. water becomes deoxygenated\n\nWhich sequence of events is correct?",
        "options": [
            ("a", "2 → 1 → 3 → 4 → 5"),
            ("b", "2 → 1 → 5 → 4 → 3"),
            ("c", "4 → 3 → 5 → 1 → 2"),
            ("d", "4 → 2 → 1 → 5 → 3"),
        ],
        "commentary": "D [1 mark]. 59% scored.",
        "explanation": "Eutrophication sequence:\n1. **Nutrients enter the lake** (e.g. fertiliser runoff)\n2. **Algae bloom** — they absorb the nutrients, then die\n3. **Aerobic bacteria decompose** the dead algae\n4. Bacteria use up OXYGEN — water becomes **deoxygenated**\n5. **Fish and other animals die** from lack of oxygen\n\nThe order is 4 → 2 → 1 → 5 → 3.",
        "diagram": None,
    },
    # ── Q40: sustain fish stocks methods (table options) ───────────────────
    {
        "q": "40", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "Which methods can be used to help sustain fish stocks?\n\n(Table shows ✓ for 'method used' and ✗ for 'method not used' across four columns: education, legal quotas, restocking, increased fishing.)",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "A [1 mark]. Only 40% got it correct. Teachers need to ensure the last topics also get attention.",
        "explanation": "To **sustain** fish stocks (keep them at a healthy level long-term):\n• **Education** about overfishing ✓\n• **Legal quotas** — limit how many fish can be caught ✓\n• **Restocking** — release young fish to replace those caught ✓\n• **Increased fishing** ✗ — this DEPLETES stocks, not sustains them\n\nRow A is the only one that includes the three good methods AND excludes 'increased fishing'.",
        "diagram": ("page-15", 0.38, 0.55, 0.10, 0.78, "fish-stocks-table"),
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# Diagram extraction
# ─────────────────────────────────────────────────────────────────────────────

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
        img = Image.open(page_path).convert("RGB")
        W, H = img.size
        crop = img.crop((int(W * x_left), int(H * y_top), int(W * x_right), int(H * y_bot)))
        out_name = f"q{q['q']}-{slug}.png"
        crop.save(PNG_DIR / out_name, optimize=True)
        print(f"  Q{q['q']:>2}: {out_name:34s} {crop.size[0]}x{crop.size[1]}")


# ─────────────────────────────────────────────────────────────────────────────
# SQL emission
# ─────────────────────────────────────────────────────────────────────────────

def sql_escape(s: str) -> str:
    """Produce a Postgres E'...' literal from a Python string."""
    if s is None:
        return "null"
    s = s.replace("\\", "\\\\").replace("'", "''").replace("\n", "\\n")
    return f"E'{s}'"


def options_jsonb(options: list[tuple[str, str]]) -> str:
    """Produce a jsonb_build_array of jsonb_build_object(id, text) calls."""
    parts = []
    for oid, otext in options:
        otext_safe = otext.replace("'", "''")
        parts.append(f"jsonb_build_object('id','{oid}','text','{otext_safe}')")
    return "jsonb_build_array(\n      " + ",\n      ".join(parts) + "\n    )"


def emit_sql() -> None:
    out = []
    out.append("-- " + "=" * 75)
    out.append("-- NSSCO Biology 2024 Paper 1 (6116/1) — 40 MCQ questions, 40 marks")
    out.append("-- Verbatim NIED wording. Official answers + commentary from")
    out.append("-- the DNEA Examiner's Report 2024 (Biology section, pages 47-49).")
    out.append("-- Diagrams cropped from past-papers/nssco-biology/2024/6116-1.pdf")
    out.append("-- into public/past-papers/biology-nssco-2024-p1/")
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
        # Find the slug for this question's diagram URL (if any)
        if q["diagram"] is not None:
            slug = q["diagram"][5]
            diagram_url = f"'/past-papers/biology-nssco-2024-p1/q{q['q']}-{slug}.png'"
        else:
            diagram_url = "null"

        out.append(f"  -- ─── Q{q['q']} ──────────────────────────────────────────────────────")
        out.append("  insert into public.past_paper_questions (")
        out.append("    subject_id, paper_year, paper_no, q_number, marks, tier,")
        out.append("    type, prompt, options, correct, diagram_url, memo, explanation, is_published")
        out.append("  ) values (")
        out.append(f"    bio_id, 2024, '1', '{q['q']}', {q['marks']}, '{q['tier']}',")
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

    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} MCQ questions for Biology NSSCO 2024 Paper 1';")
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
