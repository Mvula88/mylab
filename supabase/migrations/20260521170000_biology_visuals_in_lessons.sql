-- ============================================================================
-- Add real visuals (inline SVG) inside the 3 showcase Biology lessons so the
-- learner SEES the graphs, diagrams and structures instead of reading
-- descriptions of them.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- MATH LESSON — rewrite the direct/inverse proportion section with SVG graphs
-- ----------------------------------------------------------------------------
update public.lessons
set body_md = $$
> **In this lesson** you''ll get comfortable with the maths that comes up in NSSCO Biology — percentages, ratios, big and small numbers, and a magnification formula you''ll use almost every microscopy question.

Don''t worry if maths isn''t your strongest subject. This lesson goes slowly. Every rule has a worked example first, then your turn.

---

## 1. Percentages

A **percentage** is just a way of saying *"out of 100"*. So 30 % means **30 out of 100**.

### How to turn a fraction into a percentage

Steps:

1. Divide the top number by the bottom number
2. Multiply by 100
3. Write `%` at the end

### Worked example

You plant **40** seeds. **12** of them grow into plants. What percentage grew?

- Step 1: 12 ÷ 40 = 0.3
- Step 2: 0.3 × 100 = 30
- Step 3: write the percent sign → **30 %**

> **Try this yourself.** A class plants 80 seeds. 60 grow. What percentage grew?
>
> *Answer:* 60 ÷ 80 × 100 = **75 %**.

### How to find a percentage *of* a number

You want to know "15 % of 200 cm³". Two steps:

1. Times the number by the percent → 200 × 15 = 3000
2. Divide by 100 → 3000 ÷ 100 = **30 cm³**

In one line: **(percent × number) ÷ 100**.

> **One-line recap:** A percentage just means "so many out of 100".

---

## 2. Ratios

A **ratio** compares two amounts. If a genetic cross gives you "3 tall plants for every 1 short plant", that''s a **3:1 ratio**.

### How to use a ratio to find actual numbers

Steps:

1. Add the numbers in the ratio → this is the total "parts"
2. Divide the total amount by that number → this gives you **one part**
3. Multiply each side of the ratio by "one part"

### Worked example

A 3:1 ratio in 80 offspring. How many tall and how many short?

- Step 1: 3 + 1 = 4 parts total
- Step 2: 80 ÷ 4 = 20 → so 1 part = **20**
- Step 3: tall = 3 × 20 = **60**; short = 1 × 20 = **20**

Check: 60 + 20 = 80 ✓

> **One-line recap:** Add the parts in the ratio, divide the total by that number, and you''re done.

---

## 3. Big and small numbers (standard form)

Sometimes you have to work with very small things (a red blood cell, 0.000 007 m wide) or very big things (the number of base pairs in human DNA, about 3 000 000 000). Writing all those zeros gets messy and easy to get wrong.

So scientists use a shortcut called **standard form**.

### What it looks like

A standard form number always has two parts:

| Part | Example | What it does |
| --- | --- | --- |
| A digit between 1 and 10 | **7** | the "real" number |
| Times ten to some power | **× 10⁶** | how big or small to make it |

So `7 × 10⁶` means *seven, made one million times bigger* = **7 000 000**.

And `7 × 10⁻⁶` means *seven, made one million times smaller* = **0.000 007**.

### The powers of ten table (just memorise the top of it)

| Power | Means | Example |
| --- | --- | --- |
| 10⁶ | 1 000 000 (a million) | the average pulse beats per lifetime |
| 10³ | 1 000 (a thousand) | mm in a metre |
| 10² | 100 | percent |
| 10⁻³ | 0.001 (one thousandth) | mass of one mosquito (g) |
| 10⁻⁶ | 0.000 001 (one millionth) | size of a red blood cell (m) |

The little number on top of the 10 is called the **power** (or **exponent**). When it''s a normal number like 6, the answer gets bigger. When it has a minus sign like -6, the answer gets smaller.

### Worked example — going from a normal number to standard form

Write **0.000 045** in standard form.

The trick is to picture moving the decimal point one step at a time, **until there''s only one digit before it**.

```
Start:    0.000045
Step 1:   0.00045    (moved 1 step right)
Step 2:   0.0045     (moved 2 steps right)
Step 3:   0.045      (moved 3 steps right)
Step 4:   0.45       (moved 4 steps right)
Step 5:   4.5        (moved 5 steps right) ← stop here
```

You moved the decimal **5 steps**. Because the number is *small* (less than 1), the power is **negative**: **−5**.

So the answer is: **4.5 × 10⁻⁵**

### Going the other way — standard form back to a normal number

What does **3 × 10⁴** equal? Move the decimal 4 steps to the **right** (because the power is positive):

```
3        becomes
3.0      (start)
30.      (1 step)
300.     (2 steps)
3 000.   (3 steps)
30 000   (4 steps) ← answer
```

So `3 × 10⁴` = **30 000**.

> **Watch out.** A positive power makes the number *bigger*. A negative power makes it *smaller*. Always check by asking yourself "does this answer look right?"

> **One-line recap:** Standard form is a shortcut for very big or very small numbers. Move the decimal until there''s one digit before it, then write `× 10^something`.

---

## 4. Direct and inverse proportion — what the graphs look like

This is the bit you need to *see*, not just read about. Here are the two patterns drawn out:

<div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin:1.5rem 0;">
<figure style="margin:0;">
<svg viewBox="0 0 240 200" style="width:100%; height:auto; background:#fff; border:1px solid rgba(26,31,46,0.18);">
  <line x1="40" y1="20" x2="40" y2="170" stroke="#1a1f2e" stroke-width="1.5"/>
  <line x1="40" y1="170" x2="220" y2="170" stroke="#1a1f2e" stroke-width="1.5"/>
  <polygon points="40,15 36,23 44,23" fill="#1a1f2e"/>
  <polygon points="225,170 217,166 217,174" fill="#1a1f2e"/>
  <line x1="40" y1="170" x2="210" y2="30" stroke="#c2185b" stroke-width="3"/>
  <circle cx="40" cy="170" r="3" fill="#1a1f2e"/>
  <text x="40" y="188" font-family="IBM Plex Mono" font-size="9" text-anchor="middle">0</text>
  <text x="130" y="195" font-family="IBM Plex Mono" font-size="10" text-anchor="middle" fill="#1a1f2e">light intensity (x)</text>
  <text x="14" y="100" font-family="IBM Plex Mono" font-size="10" text-anchor="middle" fill="#1a1f2e" transform="rotate(-90 14 100)">rate (y)</text>
  <text x="130" y="14" font-family="Fraunces" font-style="italic" font-size="13" text-anchor="middle" fill="#c2185b">Direct proportion</text>
  <text x="160" y="60" font-family="IBM Plex Mono" font-size="9" fill="#c2185b">y ∝ x</text>
</svg>
<figcaption style="font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.12em; opacity:0.7; margin-top:0.5rem;">double x → y doubles</figcaption>
</figure>
<figure style="margin:0;">
<svg viewBox="0 0 240 200" style="width:100%; height:auto; background:#fff; border:1px solid rgba(26,31,46,0.18);">
  <line x1="40" y1="20" x2="40" y2="170" stroke="#1a1f2e" stroke-width="1.5"/>
  <line x1="40" y1="170" x2="220" y2="170" stroke="#1a1f2e" stroke-width="1.5"/>
  <polygon points="40,15 36,23 44,23" fill="#1a1f2e"/>
  <polygon points="225,170 217,166 217,174" fill="#1a1f2e"/>
  <path d="M 50 30 Q 90 60 120 110 Q 160 155 215 165" stroke="#c2185b" stroke-width="3" fill="none"/>
  <circle cx="40" cy="170" r="3" fill="#1a1f2e"/>
  <text x="40" y="188" font-family="IBM Plex Mono" font-size="9" text-anchor="middle">0</text>
  <text x="130" y="195" font-family="IBM Plex Mono" font-size="10" text-anchor="middle" fill="#1a1f2e">enzyme amount (x)</text>
  <text x="14" y="100" font-family="IBM Plex Mono" font-size="10" text-anchor="middle" fill="#1a1f2e" transform="rotate(-90 14 100)">time (y)</text>
  <text x="130" y="14" font-family="Fraunces" font-style="italic" font-size="13" text-anchor="middle" fill="#c2185b">Inverse proportion</text>
  <text x="160" y="60" font-family="IBM Plex Mono" font-size="9" fill="#c2185b">y ∝ 1/x</text>
</svg>
<figcaption style="font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.12em; opacity:0.7; margin-top:0.5rem;">double x → y halves</figcaption>
</figure>
</div>

### Direct proportion (the graph on the left)

When one thing doubles, the other also doubles. They go up together. The graph is a **straight line that starts at zero** and goes up to the right.

**Biology example:** at low light, the rate of photosynthesis doubles when you double the light intensity.

### Inverse proportion (the graph on the right)

When one thing doubles, the other **halves**. They move in opposite directions. The graph is a **curve that drops down and flattens out** near zero.

**Biology example:** the time taken for amylase to break down all the starch *halves* when you double the enzyme concentration. More enzyme → less time.

> **One-line recap:** Straight line through zero = direct. Curve dropping to flat = inverse.

---

## 5. The magnification formula (you''ll use this every microscope question)

The formula is:

> **magnification = image size ÷ actual size**

You can flip the formula around to find what you need:

| You want to find | Use this |
| --- | --- |
| Magnification | image ÷ actual |
| Actual size | image ÷ magnification |
| Image size | magnification × actual |

### Worked example

A drawing of a cheek cell is **60 mm** wide. The microscope was set to **× 400** magnification. How wide is the real cell?

You want the **actual size**, so use: actual = image ÷ magnification

- Step 1: 60 ÷ 400 = **0.15 mm**

If the question asks in micrometres (µm), convert: 0.15 mm × 1000 = **150 µm**.

### Why we convert units

In biology, lengths come in different sizes:

- 1 metre (m) = 1000 millimetres (mm)
- 1 millimetre (mm) = 1000 micrometres (µm)
- So 1 m = 1 000 000 µm

If a question gives the image in mm and the actual size in µm, **convert one of them** before you divide. Mixing units gives you the wrong answer by a factor of 1000.

> **Try this yourself.** A chloroplast looks 8 mm long at × 1000 magnification. What is its real length in **µm**?
>
> *Answer:* 8 ÷ 1000 = 0.008 mm. Convert: 0.008 × 1000 = **8 µm**.

> **One-line recap:** Magnification = image ÷ actual. To find actual size, flip the formula.

---

## Tools you''ll need in the practical paper

| Tool | What it measures | Units |
| --- | --- | --- |
| Ruler | length | mm or cm |
| Stopwatch | time | seconds |
| Balance | mass | grams (g) |
| Measuring cylinder | volume of liquid | cm³ |
| Protractor | angles | degrees (°) |

That''s the whole maths kit for NSSCO Biology. Try the quiz when you''re ready — there are no trick questions, just the calculations from this lesson.
$$
where slug = 'mathematical-requirements'
  and topic_id = (select id from public.topics
                  where slug = 'scientific-processes'
                  and subject_id = (select id from public.subjects where slug = 'biology'));


-- ----------------------------------------------------------------------------
-- CELL STRUCTURE LESSON — add simple labelled SVG diagrams of animal/plant cells
-- ----------------------------------------------------------------------------
update public.lessons
set body_md = $$
> **In this lesson** you''ll meet the building blocks of every living thing — cells — and learn the names, structures and functions of the parts that make them work. You''ll also see how cells stack up into tissues, organs and organ systems.

Every plant, every animal, every fungus and every bacterium is made of cells. A cheek cell from inside your mouth and a palisade cell from inside an oak leaf look very different, but they share the same basic kit.

## What''s in a cell?

Here are the two cell types you need to recognise — animal on the left, plant on the right:

<div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin:1.5rem 0;">
<figure style="margin:0;">
<svg viewBox="0 0 260 220" style="width:100%; height:auto; background:#fff; border:1px solid rgba(26,31,46,0.18);">
  <ellipse cx="130" cy="115" rx="115" ry="85" fill="#fdebef" stroke="#1a1f2e" stroke-width="2"/>
  <circle cx="105" cy="105" r="32" fill="#c2185b" opacity="0.25" stroke="#1a1f2e" stroke-width="1.5"/>
  <ellipse cx="170" cy="135" rx="18" ry="10" fill="#1a1f2e" opacity="0.7"/>
  <ellipse cx="80" cy="155" rx="14" ry="8" fill="#1a1f2e" opacity="0.7"/>
  <circle cx="155" cy="80" r="4" fill="#1a1f2e"/>
  <circle cx="190" cy="100" r="4" fill="#1a1f2e"/>
  <circle cx="100" cy="170" r="4" fill="#1a1f2e"/>
  <text x="130" y="14" font-family="Fraunces" font-style="italic" font-size="13" text-anchor="middle" fill="#c2185b">Animal cell</text>
  <text x="105" y="108" font-family="IBM Plex Mono" font-size="9" text-anchor="middle" fill="#1a1f2e">nucleus</text>
  <line x1="170" y1="135" x2="220" y2="155" stroke="#1a1f2e" stroke-width="0.8"/>
  <text x="240" y="158" font-family="IBM Plex Mono" font-size="8" fill="#1a1f2e" text-anchor="middle">mitochondria</text>
  <line x1="245" y1="80" x2="225" y2="100" stroke="#1a1f2e" stroke-width="0.8"/>
  <text x="248" y="76" font-family="IBM Plex Mono" font-size="8" fill="#1a1f2e" text-anchor="middle">cell membrane</text>
  <line x1="100" y1="170" x2="40" y2="195" stroke="#1a1f2e" stroke-width="0.8"/>
  <text x="40" y="208" font-family="IBM Plex Mono" font-size="8" fill="#1a1f2e" text-anchor="middle">cytoplasm</text>
</svg>
</figure>
<figure style="margin:0;">
<svg viewBox="0 0 260 220" style="width:100%; height:auto; background:#fff; border:1px solid rgba(26,31,46,0.18);">
  <rect x="20" y="30" width="220" height="170" fill="#e8f5e9" stroke="#2e7d32" stroke-width="4"/>
  <rect x="28" y="38" width="204" height="154" fill="#fff" stroke="#1a1f2e" stroke-width="1"/>
  <rect x="60" y="65" width="140" height="100" fill="#d0e5d8" opacity="0.6" stroke="#1a1f2e" stroke-width="0.8"/>
  <circle cx="55" cy="80" r="20" fill="#c2185b" opacity="0.25" stroke="#1a1f2e" stroke-width="1.2"/>
  <ellipse cx="95" cy="55" rx="10" ry="6" fill="#2e7d32"/>
  <ellipse cx="175" cy="55" rx="10" ry="6" fill="#2e7d32"/>
  <ellipse cx="215" cy="100" rx="10" ry="6" fill="#2e7d32"/>
  <ellipse cx="195" cy="175" rx="10" ry="6" fill="#2e7d32"/>
  <ellipse cx="50" cy="170" rx="10" ry="6" fill="#2e7d32"/>
  <text x="130" y="14" font-family="Fraunces" font-style="italic" font-size="13" text-anchor="middle" fill="#c2185b">Plant cell</text>
  <text x="55" y="83" font-family="IBM Plex Mono" font-size="8" text-anchor="middle" fill="#1a1f2e">nucleus</text>
  <text x="130" y="120" font-family="IBM Plex Mono" font-size="9" text-anchor="middle" fill="#1a1f2e">vacuole</text>
  <line x1="95" y1="55" x2="40" y2="40" stroke="#1a1f2e" stroke-width="0.8"/>
  <text x="40" y="34" font-family="IBM Plex Mono" font-size="8" fill="#2e7d32" text-anchor="middle">chloroplast</text>
  <line x1="20" y1="115" x2="0" y2="115" stroke="#1a1f2e" stroke-width="0.8"/>
  <text x="-2" y="125" font-family="IBM Plex Mono" font-size="8" fill="#1a1f2e" text-anchor="end" transform="translate(0,0)">cell wall</text>
</svg>
</figure>
</div>

Both types have:

- **Cell (plasma) membrane** — the thin boundary that controls what goes in and out
- **Cytoplasm** — jelly-like fluid where most chemical reactions happen
- **Nucleus** — contains DNA, controls the cell
- **Mitochondria** — site of **aerobic respiration**, releases energy
- **Ribosomes** — tiny grains that make proteins

Plant cells **also** have three extra things you need to know:

- **Cell wall** made of cellulose — gives the rigid box shape
- **Large permanent vacuole** filled with **cell sap** — pushes the cytoplasm against the wall so the cell stays **turgid** (firm)
- **Chloroplasts** containing chlorophyll — where photosynthesis happens (only in green parts of the plant)

> **Key idea.** Animal cells have **none** of those three plant-only structures. If you see a chloroplast or a cell wall in a question, you''re looking at a plant.

### A side-by-side comparison

| Structure | Animal cell | Plant cell |
| --- | --- | --- |
| Cell membrane | ✔ | ✔ |
| Cell wall (cellulose) | ✘ | ✔ |
| Nucleus | ✔ | ✔ |
| Cytoplasm | ✔ | ✔ |
| Mitochondria | ✔ | ✔ |
| Chloroplasts | ✘ | ✔ (only in green tissues) |
| Permanent vacuole | ✘ | ✔ |

## Why cells with high energy demand have lots of mitochondria

Mitochondria are the **site of aerobic respiration** — they release the energy locked up in glucose. A cell that has to do a lot of work needs a lot of mitochondria to power it.

- **Muscle cells** — have to contract on demand → packed with mitochondria
- **Sperm cells** — have to swim a long way → mitochondria in the middle piece, right next to the tail
- **Liver cells** — do hundreds of reactions per second → very high mitochondrial count

## Levels of organisation

A single cell is just the starting point. Real biology happens at higher levels. Here''s the ladder:

<div style="margin:1.5rem 0;">
<svg viewBox="0 0 600 90" style="width:100%; height:auto; background:#fff; border:1px solid rgba(26,31,46,0.18);">
  <g font-family="Fraunces" font-size="13" text-anchor="middle">
    <circle cx="60" cy="45" r="22" fill="#fdebef" stroke="#c2185b" stroke-width="2"/>
    <text x="60" y="50">cell</text>
    <text x="60" y="85" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">1</text>

    <text x="118" y="50" font-size="20" fill="#1a1f2e">→</text>

    <rect x="142" y="20" width="60" height="50" fill="#fdebef" stroke="#c2185b" stroke-width="2"/>
    <text x="172" y="50">tissue</text>
    <text x="172" y="85" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">2</text>

    <text x="225" y="50" font-size="20" fill="#1a1f2e">→</text>

    <ellipse cx="280" cy="45" rx="34" ry="25" fill="#fdebef" stroke="#c2185b" stroke-width="2"/>
    <text x="280" y="50">organ</text>
    <text x="280" y="85" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">3</text>

    <text x="335" y="50" font-size="20" fill="#1a1f2e">→</text>

    <rect x="360" y="18" width="80" height="55" rx="6" fill="#fdebef" stroke="#c2185b" stroke-width="2"/>
    <text x="400" y="50">system</text>
    <text x="400" y="85" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">4</text>

    <text x="460" y="50" font-size="20" fill="#1a1f2e">→</text>

    <ellipse cx="535" cy="45" rx="50" ry="32" fill="#fdebef" stroke="#c2185b" stroke-width="2"/>
    <text x="535" y="50">organism</text>
    <text x="535" y="85" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">5</text>
  </g>
</svg>
</div>

Step by step:

1. **Cell** — the basic unit (e.g. one palisade cell)
2. **Tissue** — a group of similar cells with a shared function (e.g. palisade tissue in a leaf)
3. **Organ** — several tissues working together (e.g. the leaf itself, or a kidney)
4. **Organ system** — several organs cooperating (e.g. the digestive system: mouth, oesophagus, stomach, intestines, liver, pancreas)
5. **Organism** — the whole living thing

> **Worth memorising.** Cell → tissue → organ → system → organism. Examiners ask you to put these in order all the time.

## What about bacteria?

Bacteria are different. They have a cell wall (but **not** made of cellulose), a cell membrane, cytoplasm and ribosomes — but **no proper nucleus**. Their DNA floats free in the cytoplasm as a single loop. We''ll come back to bacteria in the disease and biotechnology lessons.

## In the lab

The microscope lab attached to this lesson lets you compare a real cheek epithelium with onion epidermis cells. You''ll need to identify each structure, calculate magnification, and pick out the differences.
$$
where slug = 'cell-structure-organisation'
  and topic_id = (select id from public.topics
                  where slug = 'organisation-maintenance'
                  and subject_id = (select id from public.subjects where slug = 'biology'));


-- ----------------------------------------------------------------------------
-- PHOTOSYNTHESIS LESSON — add limiting-factor graphs
-- ----------------------------------------------------------------------------
update public.lessons
set body_md = $$
> **In this lesson** you''ll learn how green plants build their own food from carbon dioxide and water using light energy, the equation that summarises the whole process, and how to design experiments to investigate the factors that limit the rate.

Without photosynthesis, there is no life on land. Every leaf, every blade of grass, every algae cell in a pond is doing the same chemistry: capturing **light energy** with the green pigment **chlorophyll**, and using it to combine carbon dioxide from the air with water from the soil to make **glucose** (a sugar) and **oxygen** (released into the air).

## The word and chemical equations

> **Word equation:**
>
> carbon dioxide + water → glucose + oxygen
> (in the presence of light and chlorophyll)

The balanced chemical equation:

> 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂

Read this carefully. Six molecules of carbon dioxide and six of water make **one** molecule of glucose and **six** of oxygen. Light and chlorophyll are written above the arrow because they''re needed for the reaction but aren''t used up.

## What does the glucose get used for?

The plant doesn''t leave glucose floating around. It uses it in four ways:

- **Respiration** — to release energy for the plant''s own life processes
- **Stored as starch** — a long chain of glucose units, insoluble (so it doesn''t affect water potential)
- **Converted into cellulose** — to build cell walls
- **Made into proteins** (with added nitrate) — for growth and enzyme production

## The three factors that limit photosynthesis — see the graphs

This is the bit you must be able to **draw**. Here are the three classic graphs:

<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; margin:1.5rem 0;">

<figure style="margin:0;">
<svg viewBox="0 0 220 180" style="width:100%; height:auto; background:#fff; border:1px solid rgba(26,31,46,0.18);">
  <line x1="35" y1="20" x2="35" y2="155" stroke="#1a1f2e" stroke-width="1.5"/>
  <line x1="35" y1="155" x2="205" y2="155" stroke="#1a1f2e" stroke-width="1.5"/>
  <polygon points="35,15 31,23 39,23" fill="#1a1f2e"/>
  <polygon points="210,155 202,151 202,159" fill="#1a1f2e"/>
  <path d="M 35 155 L 110 60 L 200 50" stroke="#2e7d32" stroke-width="3" fill="none"/>
  <line x1="110" y1="60" x2="110" y2="155" stroke="#1a1f2e" stroke-width="0.6" stroke-dasharray="3,3"/>
  <text x="110" y="170" font-family="IBM Plex Mono" font-size="8" text-anchor="middle" fill="#1a1f2e">limit reached</text>
  <text x="115" y="15" font-family="Fraunces" font-style="italic" font-size="11" text-anchor="middle" fill="#2e7d32">Light intensity</text>
  <text x="115" y="178" font-family="IBM Plex Mono" font-size="9" text-anchor="middle" fill="#1a1f2e">light intensity →</text>
  <text x="15" y="88" font-family="IBM Plex Mono" font-size="9" text-anchor="middle" fill="#1a1f2e" transform="rotate(-90 15 88)">rate →</text>
</svg>
</figure>

<figure style="margin:0;">
<svg viewBox="0 0 220 180" style="width:100%; height:auto; background:#fff; border:1px solid rgba(26,31,46,0.18);">
  <line x1="35" y1="20" x2="35" y2="155" stroke="#1a1f2e" stroke-width="1.5"/>
  <line x1="35" y1="155" x2="205" y2="155" stroke="#1a1f2e" stroke-width="1.5"/>
  <polygon points="35,15 31,23 39,23" fill="#1a1f2e"/>
  <polygon points="210,155 202,151 202,159" fill="#1a1f2e"/>
  <path d="M 35 155 L 100 65 L 200 55" stroke="#2e7d32" stroke-width="3" fill="none"/>
  <text x="115" y="15" font-family="Fraunces" font-style="italic" font-size="11" text-anchor="middle" fill="#2e7d32">CO₂ concentration</text>
  <text x="115" y="178" font-family="IBM Plex Mono" font-size="9" text-anchor="middle" fill="#1a1f2e">CO₂ →</text>
  <text x="15" y="88" font-family="IBM Plex Mono" font-size="9" text-anchor="middle" fill="#1a1f2e" transform="rotate(-90 15 88)">rate →</text>
</svg>
</figure>

<figure style="margin:0;">
<svg viewBox="0 0 220 180" style="width:100%; height:auto; background:#fff; border:1px solid rgba(26,31,46,0.18);">
  <line x1="35" y1="20" x2="35" y2="155" stroke="#1a1f2e" stroke-width="1.5"/>
  <line x1="35" y1="155" x2="205" y2="155" stroke="#1a1f2e" stroke-width="1.5"/>
  <polygon points="35,15 31,23 39,23" fill="#1a1f2e"/>
  <polygon points="210,155 202,151 202,159" fill="#1a1f2e"/>
  <path d="M 35 145 Q 80 100, 115 55 Q 145 50, 160 80 Q 175 130, 195 152" stroke="#2e7d32" stroke-width="3" fill="none"/>
  <line x1="125" y1="55" x2="125" y2="155" stroke="#1a1f2e" stroke-width="0.6" stroke-dasharray="3,3"/>
  <text x="125" y="170" font-family="IBM Plex Mono" font-size="8" text-anchor="middle" fill="#1a1f2e">optimum ~30°C</text>
  <text x="115" y="15" font-family="Fraunces" font-style="italic" font-size="11" text-anchor="middle" fill="#2e7d32">Temperature</text>
  <text x="115" y="178" font-family="IBM Plex Mono" font-size="9" text-anchor="middle" fill="#1a1f2e">temperature →</text>
  <text x="15" y="88" font-family="IBM Plex Mono" font-size="9" text-anchor="middle" fill="#1a1f2e" transform="rotate(-90 15 88)">rate →</text>
</svg>
</figure>

</div>

### 1. Light intensity

As light intensity rises, the rate of photosynthesis rises with it — but only **up to a point**. After that, the line goes flat. That''s because something else (usually CO₂) becomes the limiting factor.

### 2. Carbon dioxide concentration

Same shape as light. Atmospheric CO₂ is only **0.04 %** (400 ppm), which is often what holds rate back. Greenhouse growers raise it to about 1000 ppm to get bigger yields.

### 3. Temperature

This one is different — it goes UP, peaks at the **optimum** (around 30 °C for most plants), then drops sharply as the enzymes that run photosynthesis are **denatured** by heat.

> **The big idea: a limiting factor.** At any given moment, *one* of these three things is holding the rate back. Increase the limiting factor and the rate goes up. Increase any other one and nothing changes. This is the single most important concept in this topic — it comes up every year.

## Investigating photosynthesis (the four classic experiments)

You''ll work through each of these in the labs:

1. **Need for chlorophyll** — variegated leaf, starch test. Only the green parts turn blue-black. (Lab: *variegated-leaf*)
2. **Need for light** — destarched plant, half a leaf covered in foil, starch test. Only the exposed half turns blue-black. (Lab: *photosynthesis*)
3. **Need for CO₂** — destarched leaf in a polythene bag with soda lime (absorbs CO₂). That leaf does **not** turn blue-black. (Lab: *co2*)
4. **Rate vs light intensity** — Elodea pondweed underwater, count oxygen bubbles per minute at different lamp distances. (Lab: *elodea*)

All four start with **destarching** — leaving the plant in the dark for 48 hours so any existing starch is used up. That way, any starch found at the end of the experiment must have been made during the experiment.

### The starch test — exact wording matters

Boil leaf in water (kills it, breaks cell walls) → boil in ethanol with a water bath (removes chlorophyll) → wash in cold water (softens the leaf) → add iodine solution. **Blue-black = starch present. Brown = no starch.**

Mark schemes accept these words exactly. "Goes dark" doesn''t score the mark — "blue-black" does.

## Putting it to work — greenhouses

A commercial greenhouse can speed up photosynthesis by removing all three limiting factors at once:

- Burn paraffin heaters → adds CO₂ **and** raises temperature
- Long-lasting fluorescent lighting → high light intensity 24 hours a day
- Result: tomato plants that grow year-round and produce 3–4× the fruit of an outdoor crop

This is also good revision for **why** photosynthesis matters in the real world.
$$
where slug = 'photosynthesis'
  and topic_id = (select id from public.topics
                  where slug = 'organisation-maintenance'
                  and subject_id = (select id from public.subjects where slug = 'biology'));
