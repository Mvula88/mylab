"""Build the NSSCO Biology 2023 Paper 1 question set: diagrams + SQL migration.

Single source of truth for all 40 MCQ questions. Verbatim NIED wording for the
prompt; official answers and per-question commentary come from the DNEA
Examiners Report 2023 (Biology section).

Outputs:
  - public/past-papers/biology-nssco-2023-p1/q{N}-{slug}.png  (per-question crops)
  - supabase/migrations/{ts}_biology_nssco_2023_p1.sql        (40 INSERT rows)

Run:
  PYTHONIOENCODING=utf-8 python scripts/build_2023_p1.py
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "scripts" / "_extracted" / "2023-p1"
PNG_DIR = ROOT / "public" / "past-papers" / "biology-nssco-2023-p1"
MIGRATION_PATH = ROOT / "supabase" / "migrations" / "20260525000000_biology_nssco_2023_p1.sql"

QUESTIONS = [
    # ── Q1: average (text only) ─────────────────────────────────────────────
    {
        "q": "1", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "A Grade 11 learner measured the length of three potato pieces that were left in distilled water for 1 hour.\n\nHe then added all three measurements together and divided the sum by 3.\n\nWhich mathematical procedure did the learner use?",
        "options": [("a", "average"), ("b", "fraction"), ("c", "percentage"), ("d", "ratio")],
        "commentary": "A — average [1 mark]. About 67% of candidates knew the correct answer. Options B and D also attracted candidates, likely due to guessing.",
        "explanation": "An **average** (mean) is calculated by **adding all values then dividing by the number of values**. Here: (length₁ + length₂ + length₃) ÷ 3 = the formula for a mean. A fraction is a part of a whole, a percentage is a fraction × 100, and a ratio compares two quantities — none of those match what the learner did.",
        "diagram": None,
    },
    # ── Q2: virus diagram (labels A-D) ──────────────────────────────────────
    {
        "q": "2", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The diagram shows the structure of a virus.\n\nWhich labelled structure is the genetic material?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "C [1 mark]. The majority of candidates, close to 80%, answered this question correctly.",
        "explanation": "Viruses have only THREE parts:\n• An outer **protein coat (capsid)** — labels A/B point to the hexagonal shell and its surface spikes\n• **Genetic material (DNA or RNA)** *inside* the coat — that's the coiled strand labelled C\n• Sometimes envelope proteins/spikes for attaching to host cells — labelled D\n\nThe genetic material is always *inside*, never on the surface.",
        "diagram": ("page-02", 0.26, 0.52, 0.18, 0.85, "virus"),
    },
    # ── Q3: cell structure–function table (text only) ───────────────────────
    {
        "q": "3", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "Which row correctly matches a cell structure to its function?",
        "options": [
            ("a", "mitochondria — photosynthesis"),
            ("b", "ribosomes — protein synthesis"),
            ("c", "rough endoplasmic reticulum — digestion"),
            ("d", "vesicles — respiration"),
        ],
        "commentary": "B [1 mark]. The functions of cell parts seem to be known by many candidates as 73.6% were able to find the correct answer.",
        "explanation": "Correct structure → function pairs:\n• **Mitochondria** → respiration (NOT photosynthesis — that's chloroplasts)\n• **Ribosomes** → **protein synthesis** ✓\n• **Rough endoplasmic reticulum** → transports proteins (NOT digestion)\n• **Vesicles** → transport substances within the cell (NOT respiration)\n\nOnly row B is correct.",
        "diagram": None,
    },
    # ── Q4: substances Q & R across membrane (diagram) ──────────────────────
    {
        "q": "4", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "The diagram shows two substances **Q** and **R** moving across a cell membrane into the cell.\n\nWhat can be done to facilitate the entry of substance **R** into the cell?",
        "options": [
            ("a", "reduce the amount of substance Q outside the cell"),
            ("b", "use optimum temperature around the cell"),
            ("c", "increase the amount of substance R inside the cell"),
            ("d", "use ATP energy for the process"),
        ],
        "commentary": "D — use ATP energy [1 mark]. Many candidates found this question difficult; only 38.5% answered correctly. The concentration of R is lower OUTSIDE the cell and higher INSIDE — moving against the gradient requires active transport, which needs ATP.",
        "explanation": "Look at substance R in the diagram: there are FEWER R molecules outside the cell and MORE inside. To move R from low (outside) to high (inside) is going **against the concentration gradient**.\n\n• Diffusion / osmosis = passive, only moves DOWN a gradient — useless here\n• **Active transport** = moves substances AGAINST a gradient, but it COSTS energy → ATP is required\n\nSo the only way to facilitate R's entry is by **using ATP**.",
        "diagram": ("page-03", 0.04, 0.32, 0.04, 0.95, "membrane-transport"),
    },
    # ── Q5: protein basic units (diagram) ───────────────────────────────────
    {
        "q": "5", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The diagram shows the structure of a protein molecule.\n\nWhat are the basic units making up a protein molecule?",
        "options": [("a", "amino acids"), ("b", "fatty acids"), ("c", "glycerol"), ("d", "glucose")],
        "commentary": "A — amino acids [1 mark]. This question was easy and 74.3% of candidates answered it correctly.",
        "explanation": "Three nutrients you must know by their building blocks:\n• **Protein** → made of **amino acids** ✓\n• **Lipid (fat)** → made of fatty acids + glycerol\n• **Carbohydrate** → made of simple sugars like glucose\n\nA long chain of amino acids folds into a protein. The little blocks in the diagram represent individual amino acids joined together.",
        "diagram": ("page-03", 0.46, 0.74, 0.08, 0.80, "protein-molecule"),
    },
    # ── Q6: enzyme temperature graph (diagram) ──────────────────────────────
    {
        "q": "6", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The diagram shows the effect of temperature on an enzyme-controlled reaction.\n\nWhich letter represents the optimum temperature for this enzyme-controlled reaction?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "C [1 mark]. It was easy for most candidates to spot that the optimum temperature is where the rate of reaction was at its highest. Close to 80% of candidates found the correct answer.",
        "explanation": "**Optimum temperature** = the temperature where the enzyme works **FASTEST** = the **PEAK** of the curve.\n\n• A — low rate, way below optimum\n• B — going up, but not yet at peak\n• **C — the peak (highest rate)** ✓\n• D — rate falling because the enzyme is starting to denature\n\nAlways look for the highest point on the graph.",
        "diagram": ("page-04", 0.05, 0.42, 0.08, 0.82, "enzyme-temperature-graph"),
    },
    # ── Q7: chloroplasts in leaf (text only) ────────────────────────────────
    {
        "q": "7", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "Which leaf tissue contains the most chloroplasts?",
        "options": [("a", "lower epidermis"), ("b", "palisade mesophyll"), ("c", "spongy mesophyll"), ("d", "upper epidermis")],
        "commentary": "B — palisade mesophyll [1 mark]. Slightly more than 60% of candidates answered correctly. The question appears easy and was targeting the E grade or lower candidates but 38.8% of candidates failed to find the correct answer.",
        "explanation": "Tissues of a leaf and their chloroplast content:\n• **Palisade mesophyll** — packed columns of cells *just below the top surface*, full of chloroplasts — most photosynthesis happens here ✓\n• Spongy mesophyll — has chloroplasts, but fewer, and the cells are loosely arranged\n• Upper & lower epidermis — protective layers; almost no chloroplasts (they'd block light)\n\nPalisade is closest to the light, so it gets the most chloroplasts.",
        "diagram": None,
    },
    # ── Q8: rinsing leaf in starch test (text only) ─────────────────────────
    {
        "q": "8", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "When carrying out a starch test on a leaf, the following four steps are carried out\n\n1. boil a leaf in water\n2. boil a leaf in ethanol\n3. rinse the leaf in water\n4. add iodine solution to a leaf\n\nWhy is step 3 necessary?",
        "options": [
            ("a", "to break the cell membranes"),
            ("b", "to decolourise the leaf"),
            ("c", "to soften the leaf"),
            ("d", "to break cell walls"),
        ],
        "commentary": "C [1 mark]. At least 52.5% of the candidates knew the reason why the leaf has to be rinsed in water after being boiled in ethanol. Such knowledge is enhanced by carrying out the practical work during teaching.",
        "explanation": "What each step does in the starch test:\n1. **Boil in water** — kills cells and breaks cell membranes/walls\n2. **Boil in ethanol** — removes chlorophyll (this decolourises the leaf)\n3. **Rinse in water** — **softens the leaf** so iodine can penetrate the now-brittle tissue ✓\n4. **Add iodine** — blue-black colour = starch present\n\nA leaf taken out of hot ethanol is dry and brittle. Rinsing in water *softens* it so iodine can reach the inside.",
        "diagram": None,
    },
    # ── Q9: swollen thyroid (text only) ─────────────────────────────────────
    {
        "q": "9", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "Which nutrient is lacking from the diet of a person with a swollen thyroid gland?",
        "options": [("a", "iodine"), ("b", "iron"), ("c", "vitamin A"), ("d", "vitamin C")],
        "commentary": "A — iodine [1 mark]. The performance was satisfactory. The second most popular option was B; some candidates confuse iodine with iron.",
        "explanation": "A swollen thyroid is called a **goitre**. It's caused by **iodine deficiency** — without iodine, the thyroid cannot make its hormone (thyroxine) and *swells* trying to compensate.\n\nDeficiency cheat-sheet:\n• **Iodine** — goitre (swollen thyroid) ✓\n• Iron — anaemia (low haemoglobin)\n• Vitamin A — night blindness\n• Vitamin C — scurvy",
        "diagram": None,
    },
    # ── Q10: cholera site (text only) ───────────────────────────────────────
    {
        "q": "10", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Which part of the alimentary canal is affected by the cholera bacterium?",
        "options": [("a", "large intestine"), ("b", "oesophagus"), ("c", "small intestine"), ("d", "stomach")],
        "commentary": "C — small intestine [1 mark]. Straightforward knowledge recall, but only 37.9% of candidates got it right. Many opted for D (stomach) because in everyday speech we call the whole abdominal area 'stomach'.",
        "explanation": "**Cholera** is caused by *Vibrio cholerae* bacteria. They attach to the wall of the **small intestine** and release a toxin that makes the gut pump water OUT of the body — causing severe watery diarrhoea and dehydration.\n\nThe stomach is too acidic for the bacteria to survive long; the large intestine just collects what comes from the small intestine. The damage starts in the **small intestine**.",
        "diagram": None,
    },
    # ── Q11: villus diagram (labels A-D) ────────────────────────────────────
    {
        "q": "11", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The diagram shows a structure of a villus.\n\nWhich labelled part of the villus absorbs fatty acids?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "A [1 mark]. The majority of candidates answered the question correctly. A handful opted for B, which shows that they know the structures involved in absorption but are not sure of the substances absorbed.",
        "explanation": "A villus has two transport vessels:\n• **Lacteal** — a central lymph vessel — absorbs **fats (fatty acids + glycerol)** — label **A** ✓\n• **Blood capillaries** — surround the lacteal — absorb sugars and amino acids\n\nFatty acids are too big to enter the blood directly, so they go into the lacteal (lymph) first. The labels C/D point to blood capillaries below the villus.",
        "diagram": ("page-05", 0.26, 0.78, 0.18, 0.78, "villus"),
    },
    # ── Q12: leaf internal — evaporation site (diagram) ─────────────────────
    {
        "q": "12", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The diagram shows the internal structure of a leaf.\n\nAt which part does evaporation takes place?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "C [1 mark]. Poorly answered — only 14.4% answered correctly. Most candidates picked D (stoma). Vapour FORMS at the surfaces of the spongy mesophyll cells (C); it then LEAVES through the stoma (D).",
        "explanation": "Two different steps that learners confuse:\n• **Evaporation** of water = water turns from liquid to vapour. This happens on the WET surfaces of **spongy mesophyll cells** (label C) where water from the cells meets the air in the air spaces.\n• **Diffusion out** of the leaf = water VAPOUR moves out through the stomata (label D).\n\nWater changes state *inside* the leaf (at C) before it leaves through the hole (D).",
        "diagram": ("page-06", 0.04, 0.40, 0.10, 0.82, "leaf-internal"),
    },
    # ── Q13: heart chamber oxygen (text only) ───────────────────────────────
    {
        "q": "13", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "Which chamber of the heart receives blood with the highest oxygen concentration?",
        "options": [("a", "left atrium"), ("b", "left ventricle"), ("c", "right atrium"), ("d", "right ventricle")],
        "commentary": "A — left atrium [1 mark]. Only 41.8% of candidates found the correct answer. Studying and understanding the content is much more useful than only revising past question papers.",
        "explanation": "Flow of blood through the heart:\n• Body → **right atrium** (deoxygenated) → right ventricle → LUNGS (gets oxygen) → **left atrium** (oxygenated) → left ventricle → body\n\nThe **left atrium RECEIVES** the freshly-oxygenated blood coming from the lungs through the pulmonary veins. So it holds blood with the highest oxygen concentration.\n\n(The left ventricle has the same oxygen level, but it doesn't *receive* the blood — the atrium does.)",
        "diagram": None,
    },
    # ── Q14: lymphatic function (text only) ─────────────────────────────────
    {
        "q": "14", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "What is the function of the lymphatic system?",
        "options": [("a", "excrete waste"), ("b", "protection from infections"), ("c", "supply oxygen"), ("d", "transport blood")],
        "commentary": "B — protection from infections [1 mark]. About 57.2% of candidates knew the function. Among all the options, only B applies to the lymphatic system.",
        "explanation": "The **lymphatic system** has two main jobs:\n• Returns tissue fluid (lymph) to the blood\n• **Houses lymphocytes (white blood cells)** that fight infection — this is its IMMUNE / protective role ✓\n\nThe other options match different systems:\n• Excretion → kidneys, skin, lungs\n• Oxygen supply → respiratory + circulatory systems\n• Blood transport → circulatory system (heart + blood vessels)",
        "diagram": None,
    },
    # ── Q15: oxygen carrier (text only) ─────────────────────────────────────
    {
        "q": "15", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Which blood component transports oxygen?",
        "options": [("a", "plasma"), ("b", "platelets"), ("c", "red blood cells"), ("d", "white blood cells")],
        "commentary": "C — red blood cells [1 mark]. This was the third easiest question, resulting in 81.6% of candidates answering it correctly.",
        "explanation": "Four parts of blood and what they do:\n• **Red blood cells** — carry **oxygen** using the protein haemoglobin ✓\n• White blood cells — fight infection\n• Platelets — help blood clot\n• Plasma — liquid that carries dissolved substances (CO₂, salts, glucose, urea)\n\nOnly red blood cells contain haemoglobin, which binds oxygen.",
        "diagram": None,
    },
    # ── Q16: inspired vs expired air (text only) ────────────────────────────
    {
        "q": "16", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which two substances may be found in lower concentration in the inspired air compared to expired air?",
        "options": [
            ("a", "nitrogen and oxygen"),
            ("b", "nitrogen and water"),
            ("c", "oxygen and carbon dioxide"),
            ("d", "water and carbon dioxide"),
        ],
        "commentary": "D — water and carbon dioxide [1 mark]. Required candidates to know which gases are waste/excess in expired air. Only 34.7% answered correctly.",
        "explanation": "The question asks: which gases are **LOWER in inspired** (breathed-in) air than in **expired** (breathed-out) air? In other words: which gases do we ADD to the air as we breathe out?\n\n• **Carbon dioxide** — we make CO₂ during respiration → exhale more of it ✓\n• **Water vapour** — lungs are moist; we exhale water vapour ✓\n• Oxygen — we USE it → less in expired air, MORE in inspired (opposite)\n• Nitrogen — body doesn't use it, same in both\n\nSo the two that are LOWER in inspired air = water and CO₂.",
        "diagram": None,
    },
    # ── Q17: tar accumulation health condition (text only) ──────────────────
    {
        "q": "17", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which health condition is most likely caused by the accumulation of a layer of tar from tobacco smoke in the lungs?",
        "options": [
            ("a", "coronary heart disease"),
            ("b", "high blood pressure"),
            ("c", "low oxygen carrying capacity"),
            ("d", "lung cancer"),
        ],
        "commentary": "D — lung cancer [1 mark]. The majority of candidates, 72.4%, answered this question correctly.",
        "explanation": "Tobacco smoke harm — match the chemical to the disease:\n• **Tar** — contains carcinogens (cancer-causing chemicals) that build up in the lungs → **lung cancer** ✓\n• Nicotine → addiction + raises blood pressure → contributes to coronary heart disease\n• Carbon monoxide → binds to haemoglobin → low oxygen carrying capacity\n\nThe question specifies **tar**, so the matching disease is lung cancer.",
        "diagram": None,
    },
    # ── Q18: anaerobic respiration product in humans (text only) ────────────
    {
        "q": "18", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Which is a product of anaerobic respiration in humans?",
        "options": [("a", "alcohol"), ("b", "carbon dioxide"), ("c", "lactic acid"), ("d", "water")],
        "commentary": "C — lactic acid [1 mark]. About 65% found the correct answer. Many opted for B (carbon dioxide), forgetting the question is about ANAEROBIC respiration in HUMANS.",
        "explanation": "Anaerobic respiration depends on the organism:\n• **Humans (animals)** → glucose → **lactic acid** + a little energy ✓\n• Yeast (plants) → glucose → alcohol (ethanol) + carbon dioxide + a little energy\n\nCO₂ and water are products of **aerobic** respiration — the question specifically asks about ANAEROBIC respiration. And alcohol is yeast, not humans.",
        "diagram": None,
    },
    # ── Q19: liver function (text only) ─────────────────────────────────────
    {
        "q": "19", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Which function is performed by the liver?",
        "options": [
            ("a", "controlling blood pH"),
            ("b", "producing insulin"),
            ("c", "producing urea"),
            ("d", "removing salts"),
        ],
        "commentary": "C — producing urea [1 mark]. Close to 50% found the correct answer. A significant number opted for B; while insulin acts on the liver, it is produced by the pancreas — NOT the liver.",
        "explanation": "What the liver does (key roles):\n• **Produces urea** from excess amino acids (deamination) — urea is then excreted by the kidneys ✓\n• Stores glycogen and releases glucose\n• Makes bile\n• Breaks down old red blood cells\n• Detoxifies alcohol and drugs\n\nThe distractors belong to other organs: blood pH is controlled by lungs/kidneys, insulin is made by the **pancreas**, and salts are removed by the **kidneys**.",
        "diagram": None,
    },
    # ── Q20: dialysis removes (text only) ───────────────────────────────────
    {
        "q": "20", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which substance is removed from blood by a dialysis machine?",
        "options": [("a", "amino acids"), ("b", "glucose"), ("c", "salts"), ("d", "urea")],
        "commentary": "D — urea [1 mark]. Only 62.4% of candidates found the correct answer although the question appears simple.",
        "explanation": "A dialysis machine does the job of a failed kidney: it removes **waste** from the blood while keeping useful substances.\n\n• **Urea** = nitrogenous waste → REMOVED ✓\n• Amino acids, glucose → useful → KEPT in blood\n• Salts → only EXCESS is removed; the dialysis fluid contains salts at the normal blood level so there's no NET loss\n\nThe one thing the body has TOO MUCH of (and must lose) is urea.",
        "diagram": None,
    },
    # ── Q21: seedlings tropism (diagram) ────────────────────────────────────
    {
        "q": "21", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "The diagram shows seedlings with roots shortly after germination, and then two days after.  Light is acting from upwards and gravity from downward.\n\nWhich growth responses are shown after two days?",
        "options": [
            ("a", "negative gravitropism and negative phototropism"),
            ("b", "negative phototropism and positive gravitropism"),
            ("c", "positive gravitropism and positive phototropism"),
            ("d", "positive phototropism and negative gravitropism"),
        ],
        "commentary": "D [1 mark]. The diagram shows that two days after germination, the SHOOTS were turning UPWARDS — toward light and away from gravity. Only about 45% gave the correct answer.",
        "explanation": "Tropism naming = direction + stimulus:\n• **Positive** = growth TOWARDS the stimulus\n• **Negative** = growth AWAY from the stimulus\n\nShoots in the diagram grow UPWARDS:\n• Light is from ABOVE → growing toward light = **positive phototropism** ✓\n• Gravity acts DOWN → growing UP = **AGAINST** gravity = **negative gravitropism** ✓\n\n(Roots show the opposite: positive gravitropism + negative phototropism.)",
        "diagram": ("page-08", 0.18, 0.45, 0.10, 0.85, "seedlings-tropism"),
    },
    # ── Q22: neurone-effector attachment (diagram) ──────────────────────────
    {
        "q": "22", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "The diagram shows two neurones and the direction of impulse transmission.\n\nAt which labelled point will a neurone attach to an effector?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "D [1 mark]. Candidates needed to know the structures of motor and sensory neurones. The second most popular option was C — candidates didn't know which part of the motor neurone connects with the effector.",
        "explanation": "Two neurones in the diagram:\n• Top neurone = **sensory** (carries impulse from a receptor in) — labels A and B on this one\n• Bottom neurone = **motor** (carries impulse OUT to an effector)\n\nAn **effector** is a muscle or gland that responds. The motor neurone's **axon ENDS** at the effector. Label **D** is at the *terminal end* of the motor neurone — that's where it attaches to the effector. C is the cell body, A and B are on the wrong (sensory) neurone.",
        "diagram": ("page-08", 0.48, 0.86, 0.10, 0.90, "neurones"),
    },
    # ── Q23: eye light detector (text only) ─────────────────────────────────
    {
        "q": "23", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which part of the eye detects light?",
        "options": [("a", "cornea"), ("b", "iris"), ("c", "pupil"), ("d", "retina")],
        "commentary": "D — retina [1 mark]. The light receptors are at the BACK of the eye (in the retina). Only 29.2% answered correctly.",
        "explanation": "Light enters the eye through several parts, but is only DETECTED at one:\n• **Cornea** — transparent front; bends (refracts) light\n• **Iris** — coloured muscle that controls pupil size\n• **Pupil** — the hole light passes through (not a structure)\n• **Retina** — the LIGHT-SENSITIVE layer at the BACK; contains rods + cones (the photoreceptors) ✓\n\nOnly the retina has cells that turn light into nerve impulses.",
        "diagram": None,
    },
    # ── Q24: eye near accommodation (text only) ─────────────────────────────
    {
        "q": "24", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "Which change enables the eye to accommodate a near object?",
        "options": [
            ("a", "ciliary muscles contract"),
            ("b", "ciliary muscles relax"),
            ("c", "suspensory ligaments tighten"),
            ("d", "lens become thinner"),
        ],
        "commentary": "A — ciliary muscles contract [1 mark]. Only about 41% answered correctly. Accommodation can only be mastered if all parts are studied in relation to one another.",
        "explanation": "Accommodation for a **NEAR** object — three linked changes:\n1. **Ciliary muscles CONTRACT** (tighten) ✓\n2. **Suspensory ligaments SLACKEN** (loosen) — so they're NOT tightening (C is wrong)\n3. **Lens becomes FATTER / thicker** (more convex) — so it bends light more (D is wrong)\n\nFor a FAR object, it's the opposite: muscles relax, ligaments tighten, lens becomes thinner.",
        "diagram": None,
    },
    # ── Q25: adrenaline organ (diagram with A-D labels) ─────────────────────
    {
        "q": "25", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The diagram shows some organs of the endocrine system.\n\nWhich organ produces adrenaline?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "C [1 mark]. About 58% answered correctly. It is puzzling that this cohort struggled even on questions presented with familiar diagrams.",
        "explanation": "Endocrine glands in the diagram:\n• A — **thyroid** (in the neck) → produces thyroxine\n• B — **pancreas** → produces insulin / glucagon\n• **C — adrenal glands** (sit on top of the kidneys) → produce **adrenaline** ✓\n• D — **ovaries / testes** → reproductive hormones\n\nAdrenaline is the 'fight-or-flight' hormone made by the small triangular adrenal glands above the kidneys.",
        "diagram": ("page-09", 0.30, 0.78, 0.18, 0.82, "endocrine-organs"),
    },
    # ── Q26: blood glucose flowchart (diagram) ──────────────────────────────
    {
        "q": "26", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The diagram shows changes in blood glucose level and hormonal secretion.\n\nWhich letter shows the response resulting in a reduction in blood glucose level?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "A [1 mark]. Only 25% answered correctly. The question could be solved by knowing the roles of insulin and glucagon in blood-sugar regulation.",
        "explanation": "Insulin and glucagon do **opposite** jobs:\n• When blood glucose is **HIGH** → pancreas releases **insulin** → liver stores glucose as glycogen → blood glucose **DROPS** ✓\n• When blood glucose is **LOW** → pancreas releases **glucagon** → liver releases glucose → blood glucose **RISES**\n\nIn the flowchart, the route 'INCREASE in blood glucose → increase in **insulin**' is the response that REDUCES the level → that's **A**.",
        "diagram": ("page-10", 0.04, 0.44, 0.04, 0.96, "blood-glucose-flowchart"),
    },
    # ── Q27: mitosis products (text only) ───────────────────────────────────
    {
        "q": "27", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Which statement describes the products of mitosis correctly?",
        "options": [
            ("a", "four genetically identical cells"),
            ("b", "four genetically different cells"),
            ("c", "two genetically identical cells"),
            ("d", "two genetically different cells"),
        ],
        "commentary": "C — two genetically identical cells [1 mark]. The majority of candidates, more than 70%, scored.",
        "explanation": "**Mitosis vs meiosis** — memorise the difference:\n• **Mitosis** → **2** daughter cells, genetically **IDENTICAL** to the parent (used for growth + repair) ✓\n• Meiosis → 4 daughter cells, genetically DIFFERENT (used for making gametes)\n\nKey trick: 'mIToSIS' has the word 'IT IS' — IT IS the same as the parent.",
        "diagram": None,
    },
    # ── Q28: flower part receiving pollen (text only) ───────────────────────
    {
        "q": "28", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which structure of the flower receives pollen grains during pollination?",
        "options": [("a", "anther"), ("b", "filament"), ("c", "petal"), ("d", "stigma")],
        "commentary": "D — stigma [1 mark]. More than 80% of candidates answered this question correctly.",
        "explanation": "Flower parts and roles:\n• Anther → **makes** pollen (male)\n• Filament → stalk that holds the anther\n• Petal → attracts pollinators\n• **Stigma** → sticky tip at the top of the female part; RECEIVES pollen during pollination ✓\n\nPollination = pollen moves FROM anther → TO stigma. The stigma is where it lands.",
        "diagram": None,
    },
    # ── Q29: ovulation stage (diagram) ──────────────────────────────────────
    {
        "q": "29", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The diagram shows some stages in the female reproductive system.\n\nWhich stage is ovulation?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "A [1 mark]. The diagram has been used in many past questions. Only 53.7% answered correctly — assumed some candidates didn't read the question but reproduced answers seen in past papers.",
        "explanation": "**Ovulation** = the moment a mature egg is RELEASED from the ovary.\n\nIn the diagram:\n• **A — egg leaving the ovary** = OVULATION ✓\n• B — egg moving in the oviduct (fallopian tube)\n• C — fertilisation occurring\n• D — implantation in the uterus wall\n\nOvulation is the *first* event in the journey — the egg breaking out of the ovary.",
        "diagram": ("page-11", 0.04, 0.36, 0.04, 0.85, "female-reproductive"),
    },
    # ── Q30: developmental stages order (text only) ─────────────────────────
    {
        "q": "30", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "Which sequence shows the correct developmental stages in humans?",
        "options": [
            ("a", "embryo  →  zygote  →  fetus"),
            ("b", "zygote  →  embryo  →  fetus"),
            ("c", "fetus  →  embryo  →  zygote"),
            ("d", "zygote  →  fetus  →  embryo"),
        ],
        "commentary": "B [1 mark]. About 41% failed to spot the correct sequence. The most popular incorrect option was A, as candidates confused embryo with fetus.",
        "explanation": "Three stages in order, smallest to most developed:\n1. **Zygote** — the single cell formed at fertilisation (egg + sperm fused)\n2. **Embryo** — the ball of cells in the first ~8 weeks; organs starting to form\n3. **Fetus** — from ~9 weeks until birth; recognisable as a baby\n\nMemory hook: Z-E-F (alphabetical order is also developmental order).",
        "diagram": None,
    },
    # ── Q31: AIDS pathogen (text only) ──────────────────────────────────────
    {
        "q": "31", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which type of pathogen causes AIDS?",
        "options": [("a", "bacterium"), ("b", "fungus"), ("c", "protozoan"), ("d", "virus")],
        "commentary": "D — virus [1 mark]. This question was answered correctly by close to 80% of candidates.",
        "explanation": "AIDS is caused by **HIV (Human Immunodeficiency Virus)** — clue is in the name. HIV destroys white blood cells (helper T cells) so the immune system can no longer fight infections.\n\nOther pathogen examples to know:\n• Bacterium → cholera, TB\n• Fungus → athlete's foot, ringworm\n• Protozoan → malaria\n• Virus → AIDS ✓, influenza, COVID-19, common cold",
        "diagram": None,
    },
    # ── Q32: mice inheritance recessive (diagram) ───────────────────────────
    {
        "q": "32", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "The diagram shows how characteristics are inherited in mice.\n\nWhich mouse in the diagram shows that the white hair characteristic is recessive?",
        "options": [
            ("a", "Bb parent"),
            ("b", "bb parent"),
            ("c", "Bb offspring"),
            ("d", "bb offspring"),
        ],
        "commentary": "C — Bb offspring [1 mark]. Test crosses determine the genotype of parents by looking at the phenotype of offspring. Only 14.4% answered correctly.",
        "explanation": "**Recessive** = the allele is only expressed when both copies are present (e.g. **bb**). It's MASKED when paired with a dominant allele (e.g. Bb).\n\nWhich mouse PROVES white is recessive?\n• **Bb offspring** is **BLACK** even though it CARRIES the white allele (b) — that proves the b (white) allele was masked by the dominant B → so b/white IS recessive ✓\n• The bb mouse is white because both alleles are b — that just tells you bb gives white, not which is dominant.\n• Looking at the Bb mouse and seeing 'b is hidden under B' is the proof.",
        "diagram": ("page-12", 0.04, 0.30, 0.10, 0.85, "mice-inheritance"),
    },
    # ── Q33: identical alleles term (text only) ─────────────────────────────
    {
        "q": "33", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "Which term is used to describe an organism as having two identical alleles of a particular gene?",
        "options": [("a", "heterozygous"), ("b", "homozygous"), ("c", "genotype"), ("d", "phenotype")],
        "commentary": "B — homozygous [1 mark]. Slightly more than 60% answered correctly. It is expected for more candidates to perform well in knowledge-recall questions.",
        "explanation": "Memorise four genetics words:\n• **Homozygous** = two **SAME** alleles (e.g. BB or bb) — 'homo' means same ✓\n• Heterozygous = two DIFFERENT alleles (e.g. Bb) — 'hetero' means different\n• Genotype = the combination of alleles (e.g. Bb)\n• Phenotype = the physical appearance (e.g. black hair)\n\nIdentical alleles → homozygous.",
        "diagram": None,
    },
    # ── Q34: variation controlled by genetics only (text only) ──────────────
    {
        "q": "34", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which type of variation is controlled by genetic factors only?",
        "options": [("a", "human height"), ("b", "size of leaves"), ("c", "skin colour"), ("d", "tongue rolling")],
        "commentary": "D — tongue rolling [1 mark]. Only half of candidates answered correctly. Examples of variations should be emphasised.",
        "explanation": "Some variation is caused by genes alone; some is caused by genes + environment.\n\n**Genetic only** (you can't change it by lifestyle):\n• **Tongue rolling** ✓ — you either have the gene or you don't\n• Blood group, eye colour, gender\n\n**Genes + environment**:\n• Human height — genes set a range, but nutrition/exercise affect actual height\n• Skin colour — genes + sun exposure (tanning)\n• Size of leaves — genes + water, light, nutrients\n\nTongue rolling is the only one in the list that isn't affected by environment.",
        "diagram": None,
    },
    # ── Q35: dry-environment plants (text only) ─────────────────────────────
    {
        "q": "35", "marks": 1, "tier": "free", "correct": "d",
        "prompt": "Which term is generally used to describe plants that are adapted to grow in dry environments?",
        "options": [("a", "dictotyledons"), ("b", "hydrophytes"), ("c", "monocotyledons"), ("d", "xerophytes")],
        "commentary": "D — xerophytes [1 mark]. About 76% identified the plants as xerophytes. The most popular wrong answer was B (hydrophytes) — distinction needs to be made between the two.",
        "explanation": "Root meanings make these easy:\n• **'Xero-' = dry** → **xerophytes** = plants of DRY places (e.g. cacti, !nara melon) ✓\n• 'Hydro-' = water → hydrophytes = plants of WATER (e.g. water lily)\n• Monocotyledons / dicotyledons = grouping by number of seed leaves — not by environment\n\nDry → xero → **xerophyte**.",
        "diagram": None,
    },
    # ── Q36: animals eating only plants (text only) ─────────────────────────
    {
        "q": "36", "marks": 1, "tier": "free", "correct": "c",
        "prompt": "Which organisms are described as animals that obtain their energy by eating plants only?",
        "options": [("a", "carnivores"), ("b", "decomposers"), ("c", "herbivores"), ("d", "omnivores")],
        "commentary": "C — herbivores [1 mark]. The majority of candidates, 73%, answered this question correctly.",
        "explanation": "Feeding categories:\n• **Herbivore** — eats ONLY plants (e.g. cow, springbok) ✓\n• Carnivore — eats ONLY animals (e.g. lion, cheetah)\n• Omnivore — eats BOTH plants and animals (e.g. human, pig)\n• Decomposer — breaks down dead material (e.g. fungi, bacteria)\n\nThe key word in the question is 'plants ONLY' → herbivore.",
        "diagram": None,
    },
    # ── Q37: food web → chain (diagram) ─────────────────────────────────────
    {
        "q": "37", "marks": 1, "tier": "free", "correct": "a",
        "prompt": "The diagram shows a food web.\n\nWhich food chain is from this food web?",
        "options": [
            ("a", "vegetation  →  rabbits  →  stoats  →  foxes"),
            ("b", "vegetation  →  voles  →  spiders  →  toads"),
            ("c", "vegetation  →  voles  →  rabbits  →  spiders"),
            ("d", "vegetation  →  spiders  →  kestrels  →  stoats"),
        ],
        "commentary": "A [1 mark]. This was the easiest question in the paper and 88.5% of candidates also found it easy.",
        "explanation": "A valid **food chain** must have arrows that ALL exist in the food web — and each arrow must point FROM the eaten TO the eater.\n\nCheck each option against the web:\n• **A: vegetation → rabbits → stoats → foxes** — all arrows exist ✓\n• B — voles don't eat spiders (voles are herbivores)\n• C — rabbits don't eat voles\n• D — spiders don't eat vegetation directly (they eat insects)\n\nA is the only chain where every arrow is in the web.",
        "diagram": ("page-13", 0.18, 0.50, 0.10, 0.80, "food-web"),
    },
    # ── Q38: nitrate → nitrogen gas (text only) ─────────────────────────────
    {
        "q": "38", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "Which process breaks down nitrates into nitrogen gas?",
        "options": [("a", "decomposition"), ("b", "denitrification"), ("c", "nitrification"), ("d", "nitrogen fixation")],
        "commentary": "B — denitrification [1 mark]. The nitrogen cycle continues to be a problem to candidates. Only 31% answered correctly.",
        "explanation": "The four nitrogen-cycle steps — names give you the meaning:\n• **Denitrification** — 'DE-nitrification' = removes nitrogen — bacteria convert **nitrates → nitrogen GAS (N₂)** ✓\n• Nitrification — bacteria convert ammonia → nitrites → nitrates (build-up)\n• Nitrogen fixation — N₂ gas → nitrates (the OPPOSITE of denitrification)\n• Decomposition — breaks dead material into ammonia (separate step)\n\nBreaks DOWN nitrates → DEnitrification.",
        "diagram": None,
    },
    # ── Q39: pond ecosystem letter (diagram) ────────────────────────────────
    {
        "q": "39", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "The diagram shows a pond.\n\nWhich letter represents an ecosystem?",
        "options": [("a", "A"), ("b", "B"), ("c", "C"), ("d", "D")],
        "commentary": "B [1 mark]. More than 70% of candidates answered the question correctly.",
        "explanation": "Ecology levels (smallest → biggest):\n• **Organism** — a single living thing (the crowned crane = A)\n• **Population** — all members of ONE species in one place\n• **Community** — all the populations together (C — all the species near the pond)\n• **Habitat** — the place where an organism lives (D — the pond water itself)\n• **Ecosystem** — the **community + its non-living environment** (B — pond water, plants, animals, sunlight, soil, etc., all interacting) ✓\n\nAn ecosystem is the WHOLE thing — that's the bracket that includes everything.",
        "diagram": ("page-14", 0.06, 0.40, 0.06, 0.90, "pond-ecosystem"),
    },
    # ── Q40: education method (text only) ───────────────────────────────────
    {
        "q": "40", "marks": 1, "tier": "free", "correct": "b",
        "prompt": "Which method of sustaining fish stock involves teaching fishermen and a community at large about the importance of maintaining fish stock?",
        "options": [("a", "captive breeding"), ("b", "education"), ("c", "re-stocking"), ("d", "setting fishing quotas")],
        "commentary": "B — education [1 mark]. Close to 50% of candidates answered correctly, although the question seemed easy. Candidates should read questions carefully.",
        "explanation": "Match the method to its keyword:\n• **Education** — *teaching* people about fish sustainability → that's what the question describes ✓\n• Captive breeding — breeding fish in tanks/farms\n• Re-stocking — putting young fish back into the wild\n• Fishing quotas — legal limits on how many fish can be caught\n\nThe question literally says 'teaching' — education is the only matching option.",
        "diagram": None,
    },
]


def _flatten_to_white(img: Image.Image) -> Image.Image:
    """Composite an RGBA image onto a white background; pass through RGB."""
    if img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        return bg
    return img.convert("RGB")


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
        img = _flatten_to_white(Image.open(page_path))
        W, H = img.size
        crop = img.crop((int(W * x_left), int(H * y_top), int(W * x_right), int(H * y_bot)))
        out_name = f"q{q['q']}-{slug}.png"
        crop.save(PNG_DIR / out_name, optimize=True)
        print(f"  Q{q['q']:>2}: {out_name:34s} {crop.size[0]}x{crop.size[1]}")


def sql_escape(s: str) -> str:
    if s is None:
        return "null"
    s = s.replace("\\", "\\\\").replace("'", "''").replace("\n", "\\n")
    return f"E'{s}'"


def options_jsonb(options: list[tuple[str, str]]) -> str:
    parts = []
    for oid, otext in options:
        otext_safe = otext.replace("'", "''")
        parts.append(f"jsonb_build_object('id','{oid}','text','{otext_safe}')")
    return "jsonb_build_array(\n      " + ",\n      ".join(parts) + "\n    )"


def emit_sql() -> None:
    out = []
    out.append("-- " + "=" * 75)
    out.append("-- NSSCO Biology 2023 Paper 1 (6116/1) — 40 MCQ questions, 40 marks")
    out.append("-- Verbatim NIED wording. Official answers + commentary from")
    out.append("-- the DNEA Examiners Report 2023 (Biology section).")
    out.append("-- Diagrams cropped from past-papers/nssco-biology/2023/")
    out.append("-- into public/past-papers/biology-nssco-2023-p1/")
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
        if q["diagram"] is not None:
            slug = q["diagram"][5]
            diagram_url = f"'/past-papers/biology-nssco-2023-p1/q{q['q']}-{slug}.png'"
        else:
            diagram_url = "null"

        out.append(f"  -- ─── Q{q['q']} ──────────────────────────────────────────────────────")
        out.append("  insert into public.past_paper_questions (")
        out.append("    subject_id, paper_year, paper_no, q_number, marks, tier,")
        out.append("    type, prompt, options, correct, diagram_url, memo, explanation, is_published")
        out.append("  ) values (")
        out.append(f"    bio_id, 2023, '1', '{q['q']}', {q['marks']}, '{q['tier']}',")
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

    out.append(f"  raise notice 'Inserted {len(QUESTIONS)} MCQ questions for Biology NSSCO 2023 Paper 1';")
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
