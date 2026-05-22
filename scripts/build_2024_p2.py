"""Build NSSCO Biology 2024 Paper 2 — structured response, 8 questions, 80 marks.

Single source of truth for all 37 sub-parts. Verbatim NIED wording from the
question paper PDF, official mark scheme + commentary from the DNEA Examiner's
Report 2024 (pages 52-57 of the report).

Outputs:
  - public/past-papers/biology-nssco-2024-p2/*.png   (per-figure diagram crops)
  - supabase/migrations/{ts}_biology_nssco_2024_p2.sql

Run:
  PYTHONIOENCODING=utf-8 python scripts/build_2024_p2.py
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2024-p2"
PNG_DIR = ROOT / "public" / "past-papers" / "biology-nssco-2024-p2"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260523120000_biology_nssco_2024_p2.sql"

# ── Diagrams: (slug, page_name, y_top, y_bot, x_left, x_right) ─────────────────
# These are referenced by sub-parts via the `diagram_slug` field.
DIAGRAMS = {
    "housefly":       ("page-02", 0.08, 0.20, 0.32, 0.66),
    "alimentary":     ("page-03", 0.05, 0.30, 0.30, 0.66),
    "blood-cells":    ("page-06", 0.06, 0.32, 0.18, 0.66),
    "breathing-graph":("page-07", 0.18, 0.45, 0.08, 0.80),
    "chloroplast":    ("page-09", 0.05, 0.22, 0.08, 0.86),
    "glucose-uses":   ("page-09", 0.50, 0.80, 0.08, 0.84),
    "dicot-stem":     ("page-10", 0.06, 0.32, 0.30, 0.65),
    "meiosis":        ("page-11", 0.05, 0.50, 0.18, 0.80),
    "plant-cycle":    ("page-13", 0.06, 0.32, 0.08, 0.78),
}

# Helper to URL-format diagram slugs
def durl(slug: str) -> str:
    return f"/past-papers/biology-nssco-2024-p2/{slug}.png" if slug else None


# ─────────────────────────────────────────────────────────────────────────────
# Q1 — Housefly classification (10 marks)
# ─────────────────────────────────────────────────────────────────────────────
Q1_STEM = "Fig. 1.1 shows a housefly.\n\n*Musca domestica* is the scientific name given to a housefly."

# ─────────────────────────────────────────────────────────────────────────────
# Q2 — Alimentary canal + digestion (10 marks)
# ─────────────────────────────────────────────────────────────────────────────
Q2_STEM = "Fig. 2.1 shows the human alimentary canal and its associated parts."

# ─────────────────────────────────────────────────────────────────────────────
# Q3 — Lymphatic/circulatory + blood (10 marks)
# ─────────────────────────────────────────────────────────────────────────────
Q3C_STEM = "Fig. 3.1 shows blood components. The small fragments are responsible for blood clotting."

# ─────────────────────────────────────────────────────────────────────────────
# Q4 — Breathing & respiration (10 marks)
# ─────────────────────────────────────────────────────────────────────────────
Q4B_STEM = "Fig. 4.1 shows the effects of exercise on the breathing pattern.\n\nOne breath is counted as inhalation and exhalation. The mean volume of air breathed in per breath at rest is 500 cm³."

# ─────────────────────────────────────────────────────────────────────────────
# Q5 — Photosynthesis & translocation (11 marks)
# ─────────────────────────────────────────────────────────────────────────────
Q5A_STEM = "Fig. 5.1 summarises the process of photosynthesis in a chloroplast."
Q5B_STEM = "Photosynthesis produces glucose which can be converted into different substances.\n\nComplete Fig. 5.2 by filling in the missing information at **(i)**, **(ii)** and **(iii)** to show some of the uses of glucose in plants."
Q5C_STEM = "Fig. 5.3 shows a cross-section of a dicotyledonous stem."

# ─────────────────────────────────────────────────────────────────────────────
# Q6 — Meiosis (9 marks)
# ─────────────────────────────────────────────────────────────────────────────
Q6_STEM = "Fig. 6.1 shows a cell dividing by meiosis."

# ─────────────────────────────────────────────────────────────────────────────
# Q7 — Plant life cycle + growth (10 marks)
# ─────────────────────────────────────────────────────────────────────────────
Q7_STEM = "Fig. 7.1 shows an incomplete life cycle of a flowering plant."

# ─────────────────────────────────────────────────────────────────────────────
# Q8 — Genetics + sickle cell (10 marks)
# ─────────────────────────────────────────────────────────────────────────────
Q8B_STEM = "Variation can result in conditions such as sickle-cell anaemia.\n\n**key:**\n• **HH** — normal haemoglobin, this individual does not have sickle-cell anaemia\n• **Hh** — this individual does not have sickle-cell anaemia, but can pass the sickle-cell anaemia gene to offspring\n• **hh** — this individual has sickle-cell anaemia"


QUESTIONS = [
    # ══════════════════ Q1 — Housefly classification (10 marks) ══════════════════
    {
        "q": "1(a)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM, "diagram": "housefly",
        "prompt": "**(a)** Name the system for naming organisms.",
        "accepted": ["binomial", "binomial system", "binomial nomenclature"],
        "must_contain": ["binomial"],
        "memo": "binomial (system); [1 mark]",
        "examiner_note": "Binomial system is known by most candidates although spelling it correctly proves to be challenging to some.",
        "explanation": "The **binomial system** (also called binomial nomenclature) gives each species a two-word scientific name: genus + species. For example *Musca domestica* — genus *Musca*, species *domestica*. Always italicised, genus capitalised, species lowercase.",
    },
    {
        "q": "1(b)", "marks": 4, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM, "diagram": "housefly",
        "prompt": "**(b)** Describe **four** features visible in Fig. 1.1 that identify the housefly as an insect.",
        "memo": (
            "Any 4 of (1 mark each):\n"
            "1. three body parts / divisions / sections / head, thorax and abdomen;\n"
            "2. three pairs of legs / 6 legs;\n"
            "3. wings / 1 pair of wings;\n"
            "4. compound eyes / 1 pair of compound eyes;\n"
            "5. (1 pair of) antennae;"
        ),
        "rubric": "Award 1 mark each (max 4) for visible insect features from Fig. 1.1: body in three parts (head/thorax/abdomen); three pairs of legs (6 legs); wings (1 pair); compound eyes (1 pair); antennae (1 pair). DO NOT credit general arthropod features (exoskeleton, segmented body) unless explicitly named as insect features. DO NOT credit features not visible in the diagram.",
        "examiner_note": "Most candidates know the features of insects well. Some gave general arthropod features rather than referring to the diagram.",
        "explanation": "Insects are arthropods with three specific features visible on the housefly:\n• **Body in 3 parts**: head, thorax, abdomen\n• **6 legs** (3 pairs) attached to the thorax\n• **1 pair of wings** (flies are *Diptera* = two wings)\n• **1 pair of compound eyes**\n• **1 pair of antennae**\n\nTip: the question says 'visible in Fig. 1.1' — describe what you actually see, don't list textbook features.",
    },
    {
        "q": "1(c)(i)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q1_STEM + "\n\nInsects are classified as arthropods.", "diagram": "housefly",
        "prompt": "**(c)(i)** Name **two** other classes of arthropods.",
        "accepted": [
            "Crustacea and Arachnida", "Crustacea and Myriapoda", "Arachnida and Myriapoda",
            "Crustacean and Arachnid", "crustacea, arachnida",
        ],
        "must_contain_any_two_of": ["crustacea", "arachnid", "myriapod"],
        "memo": "Any 2 of (1 mark each): Crustacea/crustaceans; Arachnida/arachnids; Myriapoda/myriapods;",
        "examiner_note": "Many candidates answered this question correctly.",
        "explanation": "Arthropods are divided into 4 main classes:\n• **Insecta** — insects (housefly, ant, bee)\n• **Crustacea** — crustaceans (crab, lobster, shrimp)\n• **Arachnida** — arachnids (spider, scorpion, tick)\n• **Myriapoda** — myriapods (millipede, centipede)\n\nName any TWO besides Insecta. Memory trick: 'I Can Always Match' — Insects, Crustaceans, Arachnids, Myriapods.",
    },
    {
        "q": "1(c)(ii)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q1_STEM, "diagram": "housefly",
        "prompt": "**(c)(ii)** Outline **three** ways that scientists make use of the hierarchical classification system.",
        "memo": (
            "Any 3 of (1 mark each):\n"
            "1. for (easier) identification;\n"
            "2. for study purposes;\n"
            "3. for global communication;\n"
            "4. to sort/group/arrange organisms into order;\n"
            "5. to determine their evolutionary relationships;\n"
            "6. to keep track of all organisms;\n"
            "7. to keep record of organisms;"
        ),
        "rubric": "Award 1 mark each (max 3) for valid USES of hierarchical classification: easier identification; study purposes; global/universal communication (so scientists worldwide refer to the same organism); sorting/grouping organisms; determining evolutionary relationships; record-keeping/tracking species. DO NOT credit a candidate who lists the LEVELS (kingdom-phylum-class etc) — the question asks how scientists USE the system.",
        "examiner_note": "Candidates know the uses of hierarchical classification systems.",
        "explanation": "Why scientists classify organisms hierarchically:\n• **Easier identification** — a key narrows down possibilities\n• **Common language** — *Musca domestica* means the same housefly worldwide\n• **Study and grouping** — putting similar organisms together reveals patterns\n• **Evolutionary relationships** — closely-related species sit on nearby branches\n• **Record-keeping** — millions of species need a consistent filing system\n\nPick any THREE distinct uses.",
    },

    # ══════════════════ Q2 — Alimentary canal + digestion (10 marks) ══════════════════
    {
        "q": "2(a)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": "alimentary",
        "prompt": "**(a)** Define the terms *ingestion* and *absorption*.",
        "memo": (
            "Ingestion: taking in of food/substances into the body/alimentary canal through the mouth; [1]\n"
            "Absorption: movement/uptake/pass through of small (food) molecules /and ions (through the wall of the intestine) into the blood; [1]"
        ),
        "rubric": "1 mark for ingestion = taking food INTO the body/alimentary canal through the mouth. 1 mark for absorption = movement/uptake of small soluble molecules/ions (through the wall of the small intestine) INTO the blood. Reject 'digestion' wording for absorption — they must mention small molecules moving INTO blood. Accept 'lymph' alongside 'blood' for absorption.",
        "examiner_note": "Only few candidates managed to define ingestion and absorption correctly as provided in the syllabus. Note: the question paper says 'ingestion and absorption' but candidates often confused with 'ingestion and digestion'.",
        "explanation": "Two of the five nutrition steps:\n• **Ingestion** — taking food INTO the body through the mouth.\n• **Absorption** — small soluble molecules (glucose, amino acids, fatty acids) move from the small intestine INTO the blood.\n\nDon't confuse with digestion (breaking food down) or egestion (passing waste out).",
    },
    {
        "q": "2(b)", "marks": 4, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": "alimentary",
        "prompt": "**(b)** On Fig. 2.1, using label lines and letters, indicate with letter:\n\n• **P**, the part where digestion of proteins begins,\n• **B**, the site where bile is stored,\n• **L**, the part where enzyme lipase is produced,\n• **W**, the part where the absorption of water is completed.\n\nName each part:",
        "accepted": ["P: stomach; B: gall bladder; L: pancreas; W: large intestine"],
        "must_contain": ["stomach", "gall bladder", "pancreas", "large intestine"],
        "memo": (
            "Award 1 mark for each correctly identified part:\n"
            "• P – stomach;\n"
            "• B – gall bladder;\n"
            "• L – pancreas;\n"
            "• W – large intestine;"
        ),
        "examiner_note": "The general skill of labelling diagrams has improved and the use of arrows has decreased greatly. However, only a few candidates could score all the marks.",
        "explanation": "Match each letter to its organ:\n• **P (protein digestion begins)** = **stomach** — pepsin (a protease) starts breaking down proteins in acidic conditions\n• **B (bile stored)** = **gall bladder** — bile is MADE in the liver, STORED in the gall bladder\n• **L (lipase produced)** = **pancreas** — secretes pancreatic lipase into the small intestine\n• **W (water absorption completed)** = **large intestine** — most water reabsorbed here from undigested food",
    },
    {
        "q": "2(c)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM + "\n\nThe process of chemical digestion is carried out by protein molecules called enzymes.",
        "diagram": "alimentary",
        "prompt": "**(c)(i)** Name the basic units that make up enzyme molecules.",
        "accepted": ["amino acids", "amino acid"],
        "must_contain": ["amino"],
        "memo": "amino acids; [1]",
        "examiner_note": "Many candidates failed to recognise the clue given in the question that enzymes are proteins, therefore they could not give the correct answer.",
        "explanation": "**Enzymes are proteins**, and proteins are made of **amino acids** linked together in chains.\n\nThe clue is in the question: 'protein molecules called enzymes'. Proteins → amino acids. Same as any other protein in the body.",
    },
    {
        "q": "2(c)(ii)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q2_STEM, "diagram": "alimentary",
        "prompt": "**(c)(ii)** Name the final product of starch digestion.",
        "accepted": ["glucose"],
        "must_contain": ["glucose"],
        "memo": "glucose; [1]",
        "examiner_note": "Candidates lost marks by stating maltose as a final product of starch digestion instead of the correct answer.",
        "explanation": "Starch digestion happens in TWO steps:\n1. **Starch → maltose** (by amylase in mouth + pancreas)\n2. **Maltose → glucose** (by maltase in the small intestine)\n\nThe FINAL product is **glucose** — small enough to be absorbed into the blood. Maltose is only an intermediate.",
    },
    {
        "q": "2(c)(iii)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q2_STEM, "diagram": "alimentary",
        "prompt": "**(c)(iii)** Distinguish between *mechanical* and *chemical* digestion.",
        "memo": (
            "Mechanical: breaking down food into smaller pieces WITHOUT chemical change to the food molecule; [1]\n"
            "Chemical: the breaking down of LARGE, INSOLUBLE molecules into SMALLER, SOLUBLE molecules; [1]"
        ),
        "rubric": "1 mark for mechanical = physically breaking food into smaller pieces with NO chemical change. 1 mark for chemical = breaking large/insoluble molecules into small/soluble molecules (by enzymes). Reject vague answers like 'chewing vs enzymes' without the size/solubility distinction.",
        "examiner_note": "The differences between mechanical and chemical digestion is not known by most candidates. Candidates lost marks by using their own ideas instead of the clear differences provided in the syllabus.",
        "explanation": "Two types of digestion happening at the same time:\n• **Mechanical** — physically chops food into smaller pieces (chewing, churning in stomach). The food MOLECULES are the same chemically — just smaller pieces.\n• **Chemical** — enzymes break LARGE INSOLUBLE molecules into SMALL SOLUBLE ones (starch → glucose, protein → amino acids, fats → fatty acids + glycerol). The molecule itself changes.",
    },

    # ══════════════════ Q3 — Lymphatic/circulatory + blood (10 marks) ══════════════════
    {
        "q": "3(a)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "", "diagram": None,
        "prompt": "**(a)** Describe **two** similarities between the lymphatic and circulatory systems.",
        "memo": (
            "Any 2 of (1 mark each):\n"
            "1. transport of (body) fluids;\n"
            "2. defence against pathogens / contain lymphocytes;\n"
            "3. made up of vessels;\n"
            "4. have valves;"
        ),
        "rubric": "Award 1 mark each (max 2) for similarities BOTH systems share: transport body fluids; defence against pathogens / contain lymphocytes; made up of vessels; have valves. DO NOT credit DIFFERENCES (e.g. 'one has heart, other doesn't' — that's a difference, not a similarity).",
        "examiner_note": "Poorly answered. Candidates needed to point out features that the two systems have in common.",
        "explanation": "What lymphatic and circulatory have in common:\n• **Both transport body fluids** (blood vs lymph)\n• **Both are made of vessels** (arteries/veins vs lymph vessels)\n• **Both contain valves** (in veins; in lymph vessels)\n• **Both defend against pathogens** (white blood cells in blood; lymphocytes in lymph)\n\nThe trap: most learners default to listing DIFFERENCES. Re-read the command word — *similarities* means what's the SAME.",
    },
    {
        "q": "3(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": "Below is a list of different levels of organisation:\n\n**organ, organism, cell, organ system, tissue**",
        "diagram": None,
        "prompt": "**(b)** Arrange the levels of organisation, starting from the largest.",
        "accepted": [
            "organism, organ system, organ, tissue, cell",
            "organism organ system organ tissue cell",
        ],
        "must_contain_in_order": ["organism", "organ system", "organ", "tissue", "cell"],
        "memo": "organism, organ system, organ, tissue, cell [1 mark — all 5 in correct order]",
        "examiner_note": "Well answered by most candidates.",
        "explanation": "Levels of organisation from **largest → smallest**:\n\n**organism → organ system → organ → tissue → cell**\n\nMemory aid: 'Old Owls Often Take Catnaps' (Organism, Organ system, Organ, Tissue, Cell).\n\nExample with the digestive system: ORGANISM (you) → ORGAN SYSTEM (digestive) → ORGAN (stomach) → TISSUE (epithelial lining) → CELL (one stomach lining cell).",
    },
    {
        "q": "3(c)(i)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q3C_STEM, "diagram": "blood-cells",
        "prompt": "**(c)(i)** Identify component **Z**.",
        "accepted": ["white blood cell", "lymphocyte", "WBC"],
        "must_contain_any": ["white blood", "lymphocyte"],
        "memo": "White blood cell / lymphocyte; [1]",
        "examiner_note": "Component Z, white blood cell (lymphocyte), was confused with red blood cell by many candidates.",
        "explanation": "Z is a **white blood cell** (specifically a lymphocyte). Clues from the diagram: large nucleus that takes up most of the cell, no fixed shape, isolated from the red blood cell clusters. White blood cells defend the body — much fewer than red blood cells but they're easy to spot because of the prominent nucleus.",
    },
    {
        "q": "3(c)(ii)", "marks": 4, "tier": "paid", "type": "free_text",
        "stem": Q3C_STEM, "diagram": "blood-cells",
        "prompt": "**(c)(ii)** Describe the process of blood clotting.",
        "memo": (
            "Any 4 of (1 mark each, max 4):\n"
            "1. A blood vessel is damaged/cut;\n"
            "2. blood flows out of the vessel;\n"
            "3. platelets stick to the walls of damaged vessels;\n"
            "4. platelets get activated (by vit. K and calcium ions);\n"
            "5. platelets release an enzyme/thrombin;\n"
            "6. (enzyme) converts soluble fibrinogen into insoluble fibrin;\n"
            "7. fibrin forms a mesh/network of fibres;\n"
            "8. red blood cells get trapped (in the mesh);\n"
            "9. forming a scab;"
        ),
        "rubric": "Award 1 mark for each step described, max 4. Key process: vessel damaged → platelets stick → release thrombin → fibrinogen (soluble) → fibrin (insoluble) → mesh traps RBCs → scab forms. Accept any 4 steps in any sensible order. Reject vague 'blood becomes thick' without naming platelets, fibrinogen→fibrin, or mesh formation.",
        "examiner_note": "Only a few candidates described the process of blood clotting correctly to score all marks.",
        "explanation": "Blood clotting in order:\n1. **Vessel damaged** — blood starts to leak out.\n2. **Platelets stick** to the damaged wall.\n3. **Platelets release an enzyme** (thrombin), activated by vitamin K and Ca²⁺.\n4. **Soluble fibrinogen → insoluble fibrin** (thrombin catalyses this).\n5. **Fibrin forms a mesh/net** across the wound.\n6. **Red blood cells get trapped** in the mesh.\n7. **Mesh dries → scab** — wound sealed.\n\nThe key transformation to remember: fibrinogen (soluble, swims around) becomes fibrin (insoluble, sticky threads).",
    },
    {
        "q": "3(d)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "Blood is transported to the heart through the veins.", "diagram": None,
        "prompt": "**(d)** Discuss **two** ways in which veins are structurally adapted to this function.",
        "memo": (
            "Any 2 of (1 mark each — must include BOTH the feature AND how it helps):\n"
            "1. (very) wide/large lumen (relative to wall thickness) + to maximise blood flow / minimum resistance;\n"
            "2. thin walls / less muscle and elastic fibres + because blood is at very low pressure / so skeletal muscles can squeeze them;\n"
            "3. valves + to prevent backflow / stop blood pooling at the lowest ends;\n"
            "4. single layer of endothelium on the inside + reduces friction;"
        ),
        "rubric": "Each mark requires BOTH a structural feature AND an explanation of how it helps return blood to the heart. Examples: wide lumen → low resistance / maximises flow; thin walls → low pressure / squeezed by skeletal muscles; valves → prevent backflow; smooth endothelium → less friction. ZERO marks for naming a feature without explanation, and zero for naming a feature of an ARTERY (thick wall, high pressure, etc.) by mistake.",
        "examiner_note": "Most candidates know the features of a vein but could not score marks because they could not explain how these features help the vein adapt to its functions.",
        "explanation": "A vein's job is to carry low-pressure blood BACK to the heart. The structure must match:\n• **Wide lumen** → low resistance to slow-moving blood\n• **Thin walls / less muscle** → blood is at low pressure so no need for thick muscular walls; surrounding skeletal muscles can squeeze the vein to push blood forward\n• **Valves** → prevent backflow (especially against gravity in legs)\n• **Smooth endothelium** → reduces friction\n\nFOR FULL MARKS: pair every feature with a reason. 'Veins have valves' = 0. 'Veins have valves to prevent backflow' = 1.",
    },

    # ══════════════════ Q4 — Breathing & respiration (10 marks) ══════════════════
    {
        "q": "4(a)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "", "diagram": None,
        "prompt": "**(a)** Distinguish between *breathing* and *respiration*.",
        "memo": (
            "Breathing: inhalation and exhalation of air / moving air in and out of the lungs; [1]\n"
            "Respiration: release of energy (by living cells); [1]"
        ),
        "rubric": "1 mark for breathing = movement of air in/out of the lungs (inhalation + exhalation). 1 mark for respiration = release of energy from glucose/nutrients by living cells. Reject 'breathing is gaseous exchange' — that's diffusion at the alveoli, not breathing. Reject 'respiration is breathing' — they are different processes.",
        "examiner_note": "Most candidates had little understanding of the difference between breathing and respiration. They lost marks by describing air as gases, breathing as gaseous exchange, and by defining photosynthesis instead of respiration.",
        "explanation": "Two different processes that learners often confuse:\n• **Breathing** = the MECHANICAL movement of air IN and OUT of the lungs (inhalation + exhalation). It's a muscle action.\n• **Respiration** = the CHEMICAL release of energy from glucose inside every living cell.\n\nYou can be breathing AND respiring at the same time, but they're not the same thing. A plant respires but doesn't breathe.",
    },
    {
        "q": "4(b)(i)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q4B_STEM, "diagram": "breathing-graph",
        "prompt": "**(b)(i)** Using information from the graph, calculate the volume of air breathed in **per minute at rest**.\n\nShow your working and give your answer with units.",
        "accepted": [
            "12 x 500 = 6000 cm3", "12 × 500 = 6000 cm³",
            "6000 cm3", "6000 cm³", "6 dm3", "6 dm³",
            "12 breaths × 500 = 6000 cm3",
        ],
        "must_contain": ["6000", "cm"],
        "memo": (
            "Working: 12 × 500;  [1]\n"
            "Answer: = 6000 cm³;  [1]\n"
            "(Units MUST be given — examiners specifically penalised answers without units.)"
        ),
        "examiner_note": "Poorly answered. Most candidates could not read the graph and did wrong calculations. Those who tried correctly could not score all marks because they gave answers without units. It is a requirement that all numerical answers should have units.",
        "explanation": "Two steps:\n1. **Count breaths per minute at rest**: the graph at rest (first 70 s) shows about 12 breaths (count peaks in 60 s, or count in 70 s and scale).\n2. **Multiply by volume per breath**: 12 × 500 cm³ = **6000 cm³** (or 6 dm³).\n\n**The unit costs marks** — examiners explicitly state: numerical answers must have units. Always end with cm³, dm³, m³, etc.",
    },
    {
        "q": "4(b)(ii)", "marks": 4, "tier": "paid", "type": "free_text",
        "stem": Q4B_STEM + "\n\nAfter 70 seconds, the person started exercising.", "diagram": "breathing-graph",
        "prompt": "**(b)(ii)** Describe **and** explain the changes in the breathing pattern.",
        "memo": (
            "DESCRIBE + EXPLAIN, any 4 of (1 mark each):\n"
            "1. breathing rate increases / faster, or depth increases / deeper;\n"
            "2. to provide more oxygen;\n"
            "3. to increase respiration rate / faster respiration;\n"
            "4. to release more energy;\n"
            "5. to remove/excrete CO₂ faster;"
        ),
        "rubric": "Award 4 marks max. Must include BOTH description AND explanation. Description (1-2 marks): breathing rate increases AND/OR depth (volume per breath) increases. Explanation (2-3 marks): more O₂ delivered to active muscles → increased respiration rate → more energy released → more CO₂ produced and must be removed faster. Penalise candidates who describe ONLY (no reason) or explain ONLY (no observation from graph).",
        "examiner_note": "Most candidates could see that the rate and depth of breathing increased but could not give the reason. Many lost marks by explaining the increase in HEART rate instead. Emphasis must be on WHY the change is necessary — to provide more O₂ to active muscles, increase respiration rate, release more energy, remove CO₂ faster.",
        "explanation": "Read the command word carefully: **describe AND explain** = say WHAT changes AND WHY.\n\n**Describe (from graph):**\n• Breathing rate goes UP (more breaths per minute)\n• Depth of breathing goes UP (each breath is bigger)\n\n**Explain (why):**\n• Active muscles need **more O₂** for respiration\n• Faster respiration → more **energy released** for muscle contraction\n• Faster respiration also produces more **CO₂** which must be removed faster\n\nDon't talk about heart rate — that's circulation, not breathing.",
    },
    {
        "q": "4(c)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "", "diagram": None,
        "prompt": "**(c)** Describe the effects of carbon monoxide on the gas exchange system.",
        "memo": (
            "Any 2 of (1 mark each, but mark 1 must come first):\n"
            "1. CO binds/combines/reacts with haemoglobin (instead of oxygen) / forms carboxyhaemoglobin;\n"
            "2. less haemoglobin to transport oxygen / less oxygen is transported;\n"
            "3. decreases/less amount of oxygen delivered to cells/tissues;\n"
            "4. increases heart rate / leads to breathlessness / shortness of breath;"
        ),
        "rubric": "Award 2 marks max. Must include the mechanism (CO + haemoglobin → carboxyhaemoglobin) AND a consequence (less O₂ transported, less O₂ to tissues, breathlessness). 0 marks for talking only about TAR or smoking damage without naming CO's mechanism.",
        "examiner_note": "Many candidates had an understanding that CO combines with haemoglobin but failed to score the second mark. Many just gave the effects of TAR on the breathing system. CO binds to haemoglobin, leaving less haemoglobin to transport oxygen → less oxygen reaches tissues → respiration decreases → increased heart rate and breathlessness.",
        "explanation": "CO is more 'sticky' to haemoglobin than O₂ — by about 200×:\n• CO + haemoglobin → **carboxyhaemoglobin** (a permanent bond, unlike O₂)\n• Less haemoglobin is free to carry O₂\n• Less O₂ delivered to tissues → respiration slows\n• Body responds with breathlessness and faster heart rate\n\nDon't mix this with TAR (which damages cilia, causes cancer) — that's a different problem.",
    },

    # ══════════════════ Q5 — Photosynthesis & translocation (11 marks) ══════════════════
    {
        "q": "5(a)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q5A_STEM, "diagram": "chloroplast",
        "prompt": "**(a)** Name raw material **A** and substance **B** in Fig. 5.1.",
        "accepted": [
            "A: carbon dioxide, B: oxygen",
            "A = CO2, B = O2", "A: CO₂, B: O₂",
        ],
        "must_contain": ["carbon dioxide", "oxygen"],
        "memo": "Raw material A: carbon dioxide / CO₂; [1]\nSubstance B: oxygen / O₂; [1]",
        "examiner_note": "Candidates answered this question well. They know that raw material A = carbon dioxide and substance B = oxygen.",
        "explanation": "The photosynthesis equation:\n\n**CO₂ + H₂O → glucose + O₂** (with light + chlorophyll)\n\nFrom Fig. 5.1:\n• **A (raw material from air)** = **carbon dioxide (CO₂)** — taken in through stomata\n• **Water from soil** — taken in by roots, transported up by xylem\n• **Glucose** — the food made\n• **B (substance to air)** = **oxygen (O₂)** — released as a by-product",
    },
    {
        "q": "5(b)", "marks": 3, "tier": "free", "type": "fill_in",
        "stem": Q5B_STEM, "diagram": "glucose-uses",
        "prompt": "**(b)** State the substances at (i), (ii) and (iii).\n\n• **(i)** combines with [?] to produce chlorophyll\n• **(ii)** is converted into insoluble [?] for storage\n• **(iii)** combines with nitrogen to form [?]",
        "accepted": [
            "(i) nitrates / iron / magnesium  (ii) starch  (iii) amino acids / proteins",
        ],
        "must_contain": ["starch"],
        "must_contain_any_for_i": ["nitrate", "iron", "magnesium"],
        "must_contain_any_for_iii": ["amino acid", "protein"],
        "memo": (
            "(i) nitrates / iron / magnesium; [1]\n"
            "(ii) starch; [1]\n"
            "(iii) amino acids / proteins; [1]"
        ),
        "examiner_note": "Most candidates could only score one mark for (ii) starch. (i) and (iii) widely missed.",
        "explanation": "Three uses of glucose in plants:\n• **(i)** Glucose + **nitrates / Mg / Fe** → chlorophyll. Chlorophyll has a magnesium ion at its centre, and the plant takes nitrate ions from the soil to build the chlorophyll molecule.\n• **(ii)** Glucose → **starch** (insoluble) for storage. Insoluble means it won't dissolve in cell water → won't affect osmosis.\n• **(iii)** Glucose + **nitrogen** → **amino acids → proteins**. Nitrogen comes from nitrates absorbed by roots.",
    },
    {
        "q": "5(c)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": Q5C_STEM, "diagram": "dicot-stem",
        "prompt": "**(c)** Describe how translocation of sucrose can be used to control pests.",
        "memo": (
            "Any 3 of (1 mark each, max 3):\n"
            "1. systemic pesticides sprayed on plant (leaves);\n"
            "2. (pesticide) enters the leaf tissue / stomata / lenticels;\n"
            "3. transported / translocated by phloem;\n"
            "4. pests suck it / pest sucks in poisonous (contaminated) sap from phloem;\n"
            "5. pest dies;"
        ),
        "rubric": "Award 3 marks max for the systemic pesticide pathway: pesticide sprayed/applied to plant → enters leaf tissue → translocated by PHLOEM (must name phloem) → pest sucks contaminated sap → pest dies. Reject answers about xylem (xylem carries water, not sucrose) or about pesticide killing on contact (not translocation).",
        "examiner_note": "Only a few candidates answered this well. Most didn't read the question — because the previous topic was systemic pesticides applied to soil, they based their response on that. Others said sucrose kills the pest, which is wrong.",
        "explanation": "How a **systemic pesticide** works using the plant's own transport system:\n1. Pesticide sprayed onto leaves (or absorbed through stomata/lenticels)\n2. Plant translocates it together with sucrose through the **phloem** (sieve tubes in the vascular bundles)\n3. Sap-sucking pests (aphids, whiteflies) pierce the phloem to feed\n4. They suck contaminated sap and **die**\n\nKey term: 'systemic' = the chemical spreads SYSTEM-wide through the plant. Different from a 'contact' pesticide.",
    },
    {
        "q": "5(d)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": "", "diagram": None,
        "prompt": "**(d)** Explain the mechanism by which water moves up the plant, until it leaves through the stomata.",
        "memo": (
            "Any 3 of (1 mark each, max 3):\n"
            "1. (water moves up) through the xylem vessel;\n"
            "2. moves by cohesion (water molecules attract one another) / adhesion (to xylem walls) / capillarity;\n"
            "3. pulling effect creates transpiration pull;\n"
            "4. water is pushed up by root / root pressure;\n"
            "5. due to water loss / evaporation from mesophyll cells (into air spaces);\n"
            "6. water vapour diffuses out of the stomata;"
        ),
        "rubric": "Award 3 marks max for the FULL transpiration pathway up the plant: xylem (must name); driving forces (cohesion+adhesion / capillarity / transpiration pull / root pressure); evaporation from mesophyll into air spaces; diffusion of vapour out of stomata. Reject answers that only describe water entry into root (that's part of the path but not 'moving up'). Reject answers that conflate xylem with phloem.",
        "examiner_note": "Poorly answered. Most got 1 mark for stating water moves through the xylem, then described root absorption without going up the plant.",
        "explanation": "The transpiration stream, in order:\n1. Water enters roots from soil (osmosis)\n2. Travels UP the **xylem vessels** in the stem\n3. Driven by:\n   • **Cohesion** — water molecules pull each other up\n   • **Adhesion** — water sticks to the xylem walls\n   • **Transpiration pull** — evaporation from leaves pulls the column upward\n   • **Root pressure** — pushes water up from below\n4. Water reaches **mesophyll cells** in the leaf, evaporates into air spaces\n5. Water vapour **diffuses out through the stomata**\n\nThe question wants the FULL path — root → xylem → leaf → stomata. Don't stop at the root.",
    },

    # ══════════════════ Q6 — Meiosis (9 marks) ══════════════════
    {
        "q": "6(a)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q6_STEM, "diagram": "meiosis",
        "prompt": "**(a)** Identify the cell structure labelled **Q**.",
        "accepted": ["nucleus"],
        "must_contain": ["nucleus"],
        "memo": "Nucleus; [1]",
        "examiner_note": "Most candidates identified structure Q correctly.",
        "explanation": "**Q points to the nucleus** — the membrane-bound structure inside the cell containing the chromosomes. Diagrams usually show it as a circle inside a circle, with chromosomes inside. The cell membrane is on the OUTSIDE of the cell; Q is the dark circle visible INSIDE the cell.",
    },
    {
        "q": "6(b)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q6_STEM, "diagram": "meiosis",
        "prompt": "**(b)** State the diploid number of chromosomes in this cell.",
        "accepted": ["4", "4 chromosomes", "four", "four chromosomes"],
        "must_contain_any": ["4", "four"],
        "memo": "4 (chromosomes); [1]",
        "examiner_note": "Most candidates did not answer correctly — they indicated 46 (human diploid number) instead of 4 as shown in the diagram. Emphasis: chromosome number differs between organisms.",
        "explanation": "The trap: most learners memorise that **humans** have 46 chromosomes (diploid). But this question is about THIS cell in the diagram — **count the chromosomes shown in the top parent cell**: there are 4. Different organisms have different chromosome numbers: human 46, dog 78, fruit fly 8, this organism 4.",
    },
    {
        "q": "6(c)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q6_STEM, "diagram": "meiosis",
        "prompt": "**(c)** Name the organ in male animals in which meiosis occurs.",
        "accepted": ["testes", "testis", "testicle", "testicles"],
        "must_contain": ["test"],
        "memo": "Testes / testis; [1]",
        "examiner_note": "The organ in male where meiosis occurs is not known by many candidates. Responses included any part of the male reproductive system.",
        "explanation": "Meiosis in males happens in the **testes** (singular: testis). The testes produce **sperm cells** (gametes) by meiosis, which is why each sperm has HALF the chromosome number of a body cell.\n\nNot the penis, not the scrotum (just a sac), not the prostate — specifically the testes.",
    },
    {
        "q": "6(d)", "marks": 1, "tier": "free", "type": "fill_in",
        "stem": Q6_STEM, "diagram": "meiosis",
        "prompt": "**(d)** Give the specific name of cells labelled **M**, if this dividing cell is from the female animal.",
        "accepted": ["egg cells", "egg cell", "ova", "ovum", "eggs"],
        "must_contain_any": ["egg", "ova", "ovum"],
        "memo": "Egg (cells) / ova; [1]",
        "examiner_note": "Candidates' response was mostly 'ovule'. Note ovule is the plant structure, not the animal cell.",
        "explanation": "The four daughter cells (labelled M) are the **gametes** produced by meiosis.\n\n• If the cell is from a male → 4 **sperm cells** (spermatozoa)\n• If the cell is from a female → **egg cells** / **ova** (singular: ovum)\n\nDon't confuse with 'ovule' — that's the plant structure containing the egg cell.",
    },
    {
        "q": "6(e)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q6_STEM, "diagram": "meiosis",
        "prompt": "**(e)** With reference to Fig. 6.1, identify **two** features that show that this cell division is meiosis.",
        "memo": (
            "Any 2 of (1 mark each, max 2):\n"
            "1. 4 daughter cells / 4 cells produced;\n"
            "2. haploid cells / chromosome number is halved (reduced by half) / single pair of unpaired chromosomes;\n"
            "3. two-stage division;"
        ),
        "rubric": "Award 2 marks max for distinguishing features visible in Fig. 6.1: (a) 4 daughter cells produced (not 2, like mitosis); (b) haploid number — chromosome number halved (count drops from 4→2); (c) two-stage division (clearly two rounds shown in figure). Reject 'produces gametes' — that's a function, not a visible feature in the diagram.",
        "examiner_note": "Well answered. Most candidates could see 4 daughter cells produced, haploid number, and two-stage division.",
        "explanation": "Three features visible in Fig. 6.1 prove this is meiosis (not mitosis):\n1. **4 daughter cells** are produced (mitosis makes only 2)\n2. **Chromosome number halved** — parent cell had 4 chromosomes, each daughter has 2 (haploid)\n3. **Two stages of division** — the diagram shows two rounds: one cell → two cells → four cells\n\nMitosis would show: 1 cell → 2 cells, same chromosome number, one stage. Any TWO of the three features score full marks.",
    },
    {
        "q": "6(f)", "marks": 3, "tier": "paid", "type": "free_text",
        "stem": "Another type of cell division is mitosis.", "diagram": None,
        "prompt": "**(f)** Outline **three** roles of mitosis in living organisms.",
        "memo": (
            "Any 3 of (1 mark each, max 3):\n"
            "1. growth;\n"
            "2. repair (of damaged tissues);\n"
            "3. replacement of (worn out) tissues / cells;\n"
            "4. asexual reproduction (in some organisms);"
        ),
        "rubric": "Award 1 mark each (max 3) for valid mitotic roles: growth (increase in cell number); repair of damaged tissue (e.g. healing wounds); replacement of worn-out cells (skin, blood cells); asexual reproduction (in plants/single-celled organisms). Reject 'meiosis-related' answers (gametes, variation, halving chromosomes) — those belong to meiosis, not mitosis.",
        "examiner_note": "Well answered. Most candidates knew the three main roles.",
        "explanation": "**Mitosis = 1 cell → 2 identical cells with same chromosome number.** Used for:\n• **Growth** — a baby has trillions of cells; every one came from mitosis of the zygote\n• **Repair** — a cut heals by new cells dividing to close the wound\n• **Replacement** — skin, blood and gut lining wear out constantly; mitosis replaces them\n• **Asexual reproduction** — strawberry runners, hydra budding, bacteria binary fission\n\nDon't mix with meiosis (gametes, halving chromosomes) — opposite functions.",
    },

    # ══════════════════ Q7 — Plant life cycle + growth (10 marks) ══════════════════
    {
        "q": "7(a)", "marks": 2, "tier": "free", "type": "fill_in",
        "stem": Q7_STEM, "diagram": "plant-cycle",
        "prompt": "**(a)** Complete Fig. 7.1 by filling in the processes missing at **(i)** and **(ii)**.",
        "accepted": ["(i) pollination  (ii) fertilisation", "i pollination, ii fertilisation"],
        "must_contain": ["pollination", "fertilis"],  # match fertilisation/fertilization
        "memo": "(i) Pollination; [1]\n(ii) Fertilisation; [1]",
        "examiner_note": "Processes were correctly identified by most candidates. However, terms were not correctly spelled and some candidates described the processes. Sometimes the two terms were switched.",
        "explanation": "Plant sexual reproduction in order:\n1. Flower formation\n2. **(i) Pollination** — pollen transferred from anther to stigma (by wind, insects, etc.)\n3. Growth of pollen tube — the pollen grain grows a tube down through the style\n4. **(ii) Fertilisation** — male gamete (in pollen tube) fuses with the egg in the ovule\n5. Fruit and seed formation\n6. Dispersal → germination → growth\n\n**Pollination ≠ fertilisation.** Pollination just delivers the pollen. Fertilisation is the actual fusion of gametes — happens later, INSIDE the ovule.",
    },
    {
        "q": "7(b)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "", "diagram": None,
        "prompt": "**(b)** Explain how the following environmental conditions affect seed germination:\n\n• **oxygen**\n• **water**",
        "memo": (
            "Oxygen: necessary for (cell) respiration; [1]\n"
            "Water: activates enzymes / dissolves nutrients / breaks dormancy; [1]"
        ),
        "rubric": "1 mark for oxygen = needed for respiration (to release energy for germination). 1 mark for water = activates enzymes / dissolves food stores in seed / breaks dormancy. Reject 'oxygen for photosynthesis' (seeds don't photosynthesise until leaves emerge). Reject vague 'water is needed' without explaining why.",
        "examiner_note": "Many candidates lost marks for failing to provide the ROLE of oxygen and water. They referred to oxygen needed for photosynthesis. Some gave general uses of water rather than that of seed germination.",
        "explanation": "What seeds need to start growing:\n• **Oxygen** — for **respiration**. The seed releases energy from its stored food (starch/oils) to fuel rapid cell division. No O₂ → no energy → seed stays dormant.\n• **Water** — **activates enzymes** that break down stored food into soluble glucose; **dissolves nutrients** so they can be transported; **breaks dormancy** (some seeds need rain to wake up).\n\nNot photosynthesis — that comes later when leaves emerge.",
    },
    {
        "q": "7(c)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": "", "diagram": None,
        "prompt": "**(c)** Give **two** reasons why seed dispersal is important.",
        "memo": (
            "Any 2 of (1 mark each, max 2):\n"
            "1. prevents/reduces/avoids competition for resources;\n"
            "2. allows plants to colonise new areas;\n"
            "3. increases biodiversity;\n"
            "4. prevents/reduces overcrowding;\n"
            "5. reduces the risk of spreading diseases;\n"
            "6. reduces nutrient depletion from the soil;\n"
            "7. reduces inbreeding / promotes outbreeding;\n"
            "8. allows survival in case of natural disaster / prevents extinction;"
        ),
        "rubric": "Award 1 mark each (max 2) for valid reasons that dispersal helps the species: reduces competition for water/light/nutrients; lets plants colonise new areas; reduces overcrowding; reduces disease spread (pathogens spread less easily when plants are spaced out); reduces soil nutrient depletion; promotes outbreeding; survival after natural disasters. Be alert to wording — 'AVOID/PREVENT diseases' is wrong; 'REDUCE spread of diseases' is correct.",
        "examiner_note": "Most candidates failed to score full marks. They failed to use words such as reduce/avoid/decrease/increase/prevent correctly. Wrote 'avoid/prevent diseases' instead of 'reducing the spreading of diseases'. Used 'soil erosion' instead of 'soil depletion'.",
        "explanation": "Why dispersal matters — if seeds just fell next to the parent:\n• **Competition** — seedlings would fight the parent for light, water, nutrients\n• **Overcrowding** — only some survive; weaker ones die\n• **Disease** — pathogens spread fast in dense clumps; dispersal reduces this\n• **Colonisation** — new areas get populated; biodiversity grows\n• **Survival** — if disaster hits one place, dispersed populations elsewhere survive\n\nWord precision: 'REDUCES competition' / 'REDUCES spread of disease' — not 'avoids' or 'prevents'.",
    },
    {
        "q": "7(d)", "marks": 4, "tier": "paid", "type": "free_text",
        "stem": "", "diagram": None,
        "prompt": "**(d)** Apart from the dry mass method, state **two** other methods of measuring growth and discuss **one advantage** for each.",
        "memo": (
            "Method 1: Height / length of an organism or part of an organism; [1]\n"
            "Advantage: easy/fast/does not damage the organism/can be done anywhere/suitable for most organisms; [1]\n"
            "Method 2: Wet mass / weight; [1]\n"
            "Advantage: gives accurate measure for whole organism/quick for small organism/does not damage organism; [1]"
        ),
        "rubric": "Award 1 mark each (max 4) for: naming method 1 (height/length); one advantage for method 1; naming method 2 (wet mass/weight); one advantage for method 2. Each METHOD must be a measurement (not an instrument — 'ruler' is the tool, 'height' is the method). The advantage must match the method (e.g. don't say 'accurate' for height — it varies; do say 'easy/fast/non-destructive'). Reject 'biomass' for wet mass — biomass is dry mass.",
        "examiner_note": "Poorly answered. Candidates referred to INSTRUMENTS (ruler, tape measure, scale) instead of METHODS. No correlation between methods and advantages. Some wrote 'biomass' as a method (biomass = dry mass).",
        "explanation": "**Methods (not instruments):**\n• **Height / length** — measure the plant or part (e.g. shoot length)\n  *Advantage:* easy, fast, doesn't damage the organism, can be done in the field, works for most organisms.\n• **Wet mass / fresh weight** — weigh the whole organism while alive\n  *Advantage:* gives accurate whole-organism measure, quick especially for small organisms, doesn't kill it.\n\nDry mass (excluded by the question) is most accurate but requires killing/drying the organism — that's its drawback.\n\n**Trap to avoid:** ruler is the INSTRUMENT, not the method. The method is 'measure height/length'.",
    },

    # ══════════════════ Q8 — Genetics + sickle cell (10 marks) ══════════════════
    {
        "q": "8(a)", "marks": 4, "tier": "free", "type": "fill_in",
        "stem": "Match the following terms with the correct descriptions using ruled lines. One match has been done for you. Each description may only be used once or not at all.",
        "diagram": None,
        "prompt": "**(a)** Match each term to its definition.\n\nTerms:\n• **(i) evolution**\n• **(ii) homozygous**\n• **(iii) phenotype**\n• **(iv) recessive**\n• **(v) variation**\n\nDescriptions:\n• the observable features of an organism\n• differences between individuals of the same species\n• length of DNA that codes for a protein\n• a process of change over a period of time\n• having two identical alleles of a particular gene\n• an allele that is only expressed when there is no dominant allele",
        "accepted": [
            "evolution: a process of change over a period of time; homozygous: having two identical alleles of a particular gene; phenotype: the observable features of an organism; recessive: an allele that is only expressed when there is no dominant allele; variation: differences between individuals of the same species",
        ],
        "must_contain": ["change over", "identical alleles", "observable features", "only expressed", "differences between"],
        "memo": (
            "(i) evolution — a process of change over a period of time; [1]\n"
            "(ii) homozygous — having two identical alleles of a particular gene; [1]\n"
            "(iii) phenotype — the observable features of an organism; [1]\n"
            "(iv) recessive — an allele that is only expressed when there is no dominant allele; [1]\n"
            "(v) variation — differences between individuals of the same species; [1]\n"
            "[max 4 — one match is already given as a worked example]"
        ),
        "examiner_note": "Matching question was well answered. Most candidates scored full marks.",
        "explanation": "Standard genetics definitions — memorise the wording:\n• **Evolution** — change in a species over time (Darwin)\n• **Homozygous** — having two IDENTICAL alleles for a gene (e.g. HH or hh)\n• **Phenotype** — the OBSERVABLE features (eye colour, plant height — what you can see)\n• **Recessive** — an allele only expressed when NO dominant allele is present (e.g. hh shows the recessive trait)\n• **Variation** — differences BETWEEN individuals of the SAME species\n\nNot in the list: 'length of DNA that codes for a protein' = gene (just a distractor).",
    },
    {
        "q": "8(b)(i)", "marks": 2, "tier": "paid", "type": "free_text",
        "stem": Q8B_STEM, "diagram": None,
        "prompt": "**(b)(i)** Outline the symptoms of sickle-cell anaemia.",
        "memo": (
            "Any 2 of (1 mark each, max 2):\n"
            "- sickle-shaped / distorted / deformed red blood cells;\n"
            "- fewer (normal) red blood cells / reduced surface area;\n"
            "- less (not enough) haemoglobin/oxygen;\n"
            "- fatigue / exhaustion / breathlessness / less active / tiredness / anaemia;\n"
            "- sticky RBCs clump → blood clotting / thrombosis / heart attack / stroke / blocked capillaries;\n"
            "- pain crises / periods of pain / pain in joints and bones / swelling of hands or feet;\n"
            "- higher possibility of infections / kidney or lung damage / blindness;\n"
            "- yellowish / pale skin;\n"
            "- acute chest syndrome / hospitalisation for transfusion;"
        ),
        "rubric": "Award 1 mark each (max 2) for valid sickle-cell symptoms: sickle-shaped RBCs; fewer/abnormal RBCs; less haemoglobin → less O₂; fatigue/breathlessness/anaemia; clumping → thrombosis/stroke/heart attack/blocked capillaries; pain crises in joints/bones; swelling of hands/feet; jaundice (yellow skin); higher infection risk; organ damage. Reject vague 'sick' or generic 'pain' without location/mechanism.",
        "examiner_note": "Symptoms of sickle-cell anaemia are not known by most candidates. Poorly answered.",
        "explanation": "Sickle-cell anaemia (hh genotype) — the haemoglobin is faulty, so:\n• Red blood cells become **sickle/crescent-shaped** instead of round\n• These cells **carry less O₂** → fatigue, breathlessness, anaemia\n• They are **sticky** → clump together → **block capillaries** → painful crises in joints, bones, hands and feet\n• Blockages can cause **strokes, heart attacks, organ damage**\n• Pale/yellow (jaundice) skin from haemolysis\n\nList any TWO clear symptoms.",
    },
    {
        "q": "8(b)(ii)", "marks": 4, "tier": "paid", "type": "free_text",
        "stem": Q8B_STEM + "\n\nBoth parents do **not** suffer from sickle-cell anaemia, but their child does.", "diagram": None,
        "prompt": "**(b)(ii)** Use the alleles given in the key to **explain with a genetic diagram** how a child can inherit sickle-cell anaemia when both parents do not suffer from this condition.\n\nYour diagram must include:\n• Parents' genotypes and phenotypes\n• Gametes\n• Offspring genotypes and phenotypes",
        "memo": (
            "Full genetic diagram, marks distributed (4 total):\n"
            "[1] Parents' genotypes: Hh × Hh; both phenotype 'no sickle-cell / carrier'.\n"
            "[1] Gametes (each circled): H, h from father × H, h from mother.\n"
            "[1] Punnett square / cross showing offspring genotypes: HH, Hh, Hh, hh.\n"
            "[1] Offspring phenotypes with the hh child identified as having sickle-cell anaemia.\n"
            "Common deductions: diagram not labelled; wrong genotype used; gametes not separated; parents/offspring circled (only gametes should be).\n\n"
            "Example layout:\n"
            "  Parents:      Hh  ×  Hh    (both carriers, no symptoms)\n"
            "  Gametes:    (H)(h) × (H)(h)\n"
            "  Offspring:    HH   Hh   Hh   hh\n"
            "  Phenotype: normal carrier carrier sickle-cell\n"
            "  → 1 in 4 (25%) chance of a child with sickle-cell anaemia."
        ),
        "rubric": "4 marks distributed across the genetic-diagram conventions: [1] parents both Hh with their phenotype noted (both carriers, no symptoms); [1] gametes shown as H and h from each parent, circled; [1] cross/Punnett square showing offspring HH/Hh/Hh/hh; [1] offspring phenotypes — the hh child correctly identified as suffering from sickle-cell anaemia. PENALISE: unlabelled diagrams; wrong alleles (using Hb, A/a etc.); circling parent genotypes instead of gametes; missing offspring phenotype.",
        "examiner_note": "Poorly performed. The skill of drawing the genetic diagram is not yet mastered despite previous efforts. Issues: diagrams not labelled; wrong genotypes; sex-linked notation used by mistake; parents/offspring circled instead of gametes; sickle-cell phenotype not indicated in offspring.",
        "explanation": "Both parents look healthy → they must be **carriers** (Hh). The genetic diagram:\n\n```\n  Parents:        Hh    ×    Hh\n                  (carrier)   (carrier)\n  Gametes:      (H) (h)   ×   (H) (h)\n  Offspring:    HH    Hh    Hh    hh\n  Phenotype:  normal carrier carrier sickle-cell\n```\n\n**Key marking conventions:**\n• ONLY gametes get circled — not parents, not offspring\n• Label every genotype with its phenotype\n• Identify the hh child as having sickle-cell anaemia\n• Use the alleles GIVEN in the key (H/h) — don't invent your own (Hb, A/a, S/s)\n\n**Conclusion:** 1 in 4 children (25%) will have sickle-cell anaemia, even though neither parent suffers from it.",
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
        print(f"  {slug:22s} {crop.size[0]}x{crop.size[1]}")


# ─────────────────────────────────────────────────────────────────────────────
# SQL emission
# ─────────────────────────────────────────────────────────────────────────────

def sql_escape(s: str) -> str:
    if s is None:
        return "null"
    s = s.replace("\\", "\\\\").replace("'", "''").replace("\n", "\\n")
    return f"E'{s}'"


def build_prompt(q: dict) -> str:
    """Combine stem + prompt for a self-contained sub-part."""
    stem = q.get("stem", "")
    prompt = q["prompt"]
    return (stem + "\n\n" + prompt) if stem else prompt


def build_full_memo(q: dict) -> str:
    """Combine official mark scheme + examiner commentary."""
    memo = q.get("memo", "")
    note = q.get("examiner_note", "")
    if note:
        return memo + "\n\n**Examiner commentary:** " + note
    return memo


def build_correct_jsonb(q: dict) -> str:
    """Build the `correct` field for fill_in questions."""
    parts = [f"'accepted', jsonb_build_array("]
    accepted = q.get("accepted", [])
    accepted_strs = ",\n        ".join(f"'{a.replace(chr(39), chr(39)*2)}'" for a in accepted)
    parts.append("      " + accepted_strs)
    parts.append("    )")
    mc = q.get("must_contain")
    if mc:
        mc_strs = ", ".join(f"'{m}'" for m in mc)
        parts.append(f", 'must_contain', jsonb_build_array({mc_strs})")
    obj = "jsonb_build_object(\n      " + "\n".join(parts) + "\n    )"
    return obj


def emit_sql() -> None:
    out = []
    out.append("-- " + "=" * 75)
    out.append("-- NSSCO Biology 2024 Paper 2 (6116/2) — 8 questions, 37 sub-parts, 80 marks")
    out.append("-- Verbatim NIED wording from past-papers/nssco-biology/2024/6116-2.pdf")
    out.append("-- Mark scheme + commentary from DNEA Examiner's Report 2024 (pages 52-57)")
    out.append("-- Diagrams: public/past-papers/biology-nssco-2024-p2/*.png")
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
            out.append(f"    bio_id, 2024, '2', '{q['q']}', {q['marks']}, '{q['tier']}',")
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
            out.append(f"    bio_id, 2024, '2', '{q['q']}', {q['marks']}, '{q['tier']}',")
            out.append(f"    'free_text',")
            out.append(f"    {sql_escape(prompt)},")
            out.append(f"    {diagram_url},")
            out.append(f"    {sql_escape(memo)},")
            out.append(f"    {sql_escape(q['rubric'])},")
            out.append(f"    {sql_escape(q['explanation'])},")
            out.append(f"    true")
            out.append("  );")
        out.append("")

    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} structured sub-parts for Biology NSSCO 2024 Paper 2';")
    out.append("end $$;")

    MIGRATION_PATH.parent.mkdir(parents=True, exist_ok=True)
    MIGRATION_PATH.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"\nWrote migration: {MIGRATION_PATH.relative_to(ROOT)}  ({len(QUESTIONS)} rows)")


if __name__ == "__main__":
    print(f"Extracting {len(DIAGRAMS)} diagrams:")
    extract_diagrams()
    emit_sql()
    total_marks = sum(q["marks"] for q in QUESTIONS)
    by_q = {}
    for q in QUESTIONS:
        main_q = q["q"].split("(")[0]
        by_q.setdefault(main_q, 0)
        by_q[main_q] += q["marks"]
    print(f"\nMarks per question: {by_q}")
    print(f"Total: {total_marks} marks across {len(QUESTIONS)} sub-parts")
