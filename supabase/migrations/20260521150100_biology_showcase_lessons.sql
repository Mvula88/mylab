-- ============================================================================
-- Three fully-fleshed Biology lessons with rich markdown bodies + quizzes,
-- so the user can evaluate the depth/style of the content I produce before
-- I write the remaining 48.
--
-- Showcase lessons:
--   1. Topic 1 / Mathematical Requirements  (drier foundational skill)
--   2. Topic 3 / Cell Structure & Organisation  (visual, lab-linked)
--   3. Topic 3 / Photosynthesis  (multi-lab, equation chemistry)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- LESSON 1 of 3 — Mathematical Requirements
-- ----------------------------------------------------------------------------
update public.lessons
set body_md = $$
> **In this lesson** you''ll review the maths you''ll use again and again in NSSCO Biology — averages, percentages, ratios, indices, standard form, and the kind of equation rearranging that comes up in magnification questions.

Biology is built on numbers. You''ll measure leaf length to the nearest millimetre, calculate the average bubble count from a class set of pondweed results, and convert between mm and µm when you describe the size of a chloroplast. Sloppy maths costs marks — and gives you the wrong answer for what''s really happening in the cell.

## Decimals, fractions and percentages

### Percentages

A **percentage** is a fraction out of 100. To turn a fraction into a percentage, multiply by 100:

- 12 out of 40 plants survived → 12 ÷ 40 = 0.30 → **30 %**

To find a percentage of a number, multiply by the percentage and divide by 100:

- 15 % of 200 cm³ → (15 × 200) ÷ 100 = **30 cm³**

> **Exam tip.** "Percentage change" = (final − initial) ÷ initial × 100. The sign matters — a negative number means it went down.

### Ratios

A **ratio** compares two quantities. If a Punnett square gives 3 tall : 1 short, that''s a 3:1 ratio. To work out actual numbers from a ratio, add the parts:

- 3:1 of 80 offspring → 4 parts total → 1 part = 20 → **60 tall, 20 short**

## Direct and inverse proportion

| Relationship | What it means | Biology example |
| --- | --- | --- |
| **Direct proportion** (y ∝ x) | y doubles when x doubles | Rate of photosynthesis ∝ light intensity (at low light) |
| **Inverse proportion** (y ∝ 1/x) | y halves when x doubles | Time for starch to disappear ∝ 1 / amylase concentration |

On a graph, direct proportion is a straight line through the origin. Inverse proportion is a curve that flattens.

## Indices and standard form

Big and small biology measurements use **standard form** (also called scientific notation).

- A red blood cell has a diameter of about **7 µm** = 7 × 10⁻⁶ m
- The human genome has about **3 × 10⁹** base pairs

Rules:

- 10² = 100, 10³ = 1000, 10⁶ = 1 000 000
- 10⁻³ = 0.001, 10⁻⁶ = 0.000 001

To convert 0.000 045 to standard form: move the decimal point right until you have one non-zero digit before it (you moved 5 places), then write × 10⁻⁵ → **4.5 × 10⁻⁵**.

## Rearranging the magnification equation

This one comes up in nearly every microscopy question:

> **magnification = image size ÷ actual size**

Rearrange to find what you need:

- **actual size** = image size ÷ magnification
- **image size** = magnification × actual size

Always check units. If the image size is in mm but the actual size in µm, convert first (1 mm = 1000 µm).

### Worked example

A drawing of a cheek cell is 60 mm wide. The magnification is × 400. What is the actual width?

1. Make sure units match — keep mm for now.
2. actual size = 60 mm ÷ 400 = **0.15 mm**
3. Convert to µm if asked → 0.15 × 1000 = **150 µm**

> **Try this.** A chloroplast appears 8 mm long at × 1000 magnification. What is its actual length in µm? *(Answer: 8 µm — try the calculation yourself first.)*

## Tools you''ll use

| Tool | What it measures |
| --- | --- |
| Ruler | Length / distance, in mm |
| Compasses | Drawing circles for pie charts and biological structures |
| Protractor | Angles — useful in joint movement and reflection diagrams |
| Stopwatch | Time, to the nearest second |
| Balance | Mass, in grams |
| Measuring cylinder | Volume of liquids, in cm³ |

When the quiz at the bottom of this lesson asks you to use the magnification equation, do the rearrangement on paper first — don''t try to do it all in your head.
$$
where slug = 'mathematical-requirements'
  and topic_id = (select id from public.topics
                  where slug = 'scientific-processes'
                  and subject_id = (select id from public.subjects where slug = 'biology'));


-- ----------------------------------------------------------------------------
-- LESSON 2 of 3 — Cell Structure & Levels of Organisation
-- ----------------------------------------------------------------------------
update public.lessons
set body_md = $$
> **In this lesson** you''ll meet the building blocks of every living thing — cells — and learn the names, structures and functions of the parts that make them work. You''ll also see how cells stack up into tissues, organs and organ systems.

Every plant, every animal, every fungus and every bacterium is made of cells. A cheek cell from inside your mouth and a palisade cell from inside an oak leaf look very different, but they share the same basic kit: a **membrane** holding everything in, **cytoplasm** where reactions happen, and a **nucleus** carrying the instructions.

## Animal cells vs plant cells

Both have:

- **Cell (plasma) membrane** — a thin, partially permeable boundary that controls what goes in and out
- **Cytoplasm** — a jelly-like fluid where most chemical reactions happen
- **Nucleus** — contains the DNA and controls the cell
- **Mitochondria** — the site of **aerobic respiration**, where glucose is broken down to release energy
- **Ribosomes** — tiny grain-like structures that make proteins
- **Rough endoplasmic reticulum (RER)** — folded membranes studded with ribosomes; transports proteins

Plant cells also have:

- **Cell wall** made of cellulose — gives the cell its rigid shape
- **Large permanent vacuole** filled with **cell sap** — pushes the cytoplasm against the wall to keep the cell **turgid**
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

A single cell is just the starting point. Real biology happens at higher levels:

1. **Cell** — the basic unit (e.g. one palisade cell)
2. **Tissue** — a group of similar cells with a shared function (e.g. palisade tissue in a leaf)
3. **Organ** — several tissues working together (e.g. the leaf itself, or a kidney)
4. **Organ system** — several organs cooperating (e.g. the digestive system: mouth, oesophagus, stomach, intestines, liver, pancreas)
5. **Organism** — the whole living thing

> **Worth memorising.** Cell → tissue → organ → system → organism. Examiners ask you to put these in order all the time.

## What about bacteria?

Bacteria are different. They have a cell wall (but **not** made of cellulose), a cell membrane, cytoplasm and ribosomes — but **no proper nucleus**. Their DNA floats free in the cytoplasm as a single loop. We''ll come back to bacteria in the disease and biotechnology lessons.

## In the lab

The microscope lab attached to this lesson lets you compare a real cheek epithelium with onion epidermis cells. You''ll need to identify each structure, calculate magnification, and pick out the differences. Read the **What you should be able to do** list above before you open the lab — those are the exact skills the practical paper will test.
$$
where slug = 'cell-structure-organisation'
  and topic_id = (select id from public.topics
                  where slug = 'organisation-maintenance'
                  and subject_id = (select id from public.subjects where slug = 'biology'));


-- ----------------------------------------------------------------------------
-- LESSON 3 of 3 — Photosynthesis
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

## The three factors that limit photosynthesis

### 1. Light intensity

As light intensity rises, rate of photosynthesis rises in direct proportion — until something else runs out (usually CO₂). On a graph, you''ll see a straight line that levels off.

### 2. Carbon dioxide concentration

Atmospheric CO₂ is only **0.04 %** (400 ppm), which is often the limiting factor. Greenhouse growers raise it to 1000 ppm to get bigger yields.

### 3. Temperature

Photosynthesis is enzyme-controlled, so it follows the typical enzyme curve:

- Low temperature → slow (enzymes inactive)
- Around 25–35 °C → fastest (optimum)
- Above ~45 °C → drops sharply (enzymes denatured)

> **The idea of a limiting factor.** At any given moment, *one* of these three factors is holding the rate back. Increase the limiting factor and the rate goes up; increase any other one and nothing changes. This is the single most important concept in this topic — it comes up every year.

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


-- ============================================================================
-- QUIZZES — one per showcase lesson
-- ============================================================================

-- 0) Wipe any prior quiz attached to these 3 lessons so this migration is
--    safely re-runnable (cascades to questions and attempts).
delete from public.activities
where slug = 'quiz' and lesson_id in (
  select l.id from public.lessons l
  join public.topics tp on tp.id = l.topic_id
  join public.subjects s on s.id = tp.subject_id
  where s.slug = 'biology'
  and (
    (tp.slug = 'scientific-processes' and l.slug = 'mathematical-requirements')
    or (tp.slug = 'organisation-maintenance' and l.slug = 'cell-structure-organisation')
    or (tp.slug = 'organisation-maintenance' and l.slug = 'photosynthesis')
  )
);

-- 1) Activities (one quiz per showcase lesson)
insert into public.activities (lesson_id, slug, title, instructions, pass_threshold, is_published)
select l.id, 'quiz', a.title, a.instructions, 60, true
from public.lessons l
join public.topics tp on tp.id = l.topic_id
join public.subjects s on s.id = tp.subject_id
join (values
  ('scientific-processes',     'mathematical-requirements',
   'Mathematical skills check',
   'Six questions to check you can do the maths every NSSCO Biology paper relies on.'),
  ('organisation-maintenance', 'cell-structure-organisation',
   'Cells — quick check',
   'Six questions on plant vs animal cells and the levels of organisation.'),
  ('organisation-maintenance', 'photosynthesis',
   'Photosynthesis — exam-style check',
   'Six questions covering the equation, limiting factors and the standard experiments.')
) as a(topic_slug, lesson_slug, title, instructions)
  on a.topic_slug = tp.slug and a.lesson_slug = l.slug
where s.slug = 'biology';


-- 2) Mathematical Requirements — 6 questions
with quiz as (
  select a.id as activity_id from public.activities a
  join public.lessons l on l.id = a.lesson_id
  join public.topics tp on tp.id = l.topic_id
  join public.subjects s on s.id = tp.subject_id
  where s.slug = 'biology' and tp.slug = 'scientific-processes'
    and l.slug = 'mathematical-requirements' and a.slug = 'quiz'
)
insert into public.questions
  (activity_id, type, prompt, points, sort_order, options, correct, tolerance, unit, case_sensitive, explanation)
select quiz.activity_id, q.type, q.prompt, q.points, q.sort_order,
       q.options::jsonb, q.correct::jsonb, q.tolerance::numeric, q.unit::text, q.case_sensitive::boolean, q.explanation
from quiz cross join (values
  ('mcq', 'A class plants 80 seeds. 60 germinate. What percentage germinated?', 1, 10,
   '[{"id":"a","text":"60%"},{"id":"b","text":"70%"},{"id":"c","text":"75%"},{"id":"d","text":"80%"}]',
   '"c"', null, null, null,
   '60 ÷ 80 × 100 = 75 %.'),
  ('mcq', 'In a Punnett square cross, 1200 offspring come out in a 3:1 ratio. How many show the recessive phenotype?', 1, 20,
   '[{"id":"a","text":"100"},{"id":"b","text":"300"},{"id":"c","text":"400"},{"id":"d","text":"900"}]',
   '"b"', null, null, null,
   '3 + 1 = 4 parts. 1 part = 1200 ÷ 4 = 300.'),
  ('true_false', 'Direct proportion gives a straight line that passes through the origin on a graph.', 1, 30,
   null, 'true', null, null, null,
   'Yes — that''s the defining feature of direct proportion.'),
  ('numeric', 'A drawing of a cell is 60 mm across at × 400 magnification. What is the actual width of the cell in mm?', 2, 40,
   null, '0.15', 0.01, 'mm', null,
   'actual size = image size ÷ magnification = 60 ÷ 400 = 0.15 mm.'),
  ('numeric', 'Convert 8 mm to µm.', 1, 50,
   null, '8000', 0, 'µm', null,
   '1 mm = 1000 µm, so 8 mm = 8 × 1000 = 8000 µm.'),
  ('fill_in', 'Write 0.000 045 in standard form. Use the format like "4.5 x 10^-5".', 1, 60,
   null, '["4.5 x 10^-5","4.5x10^-5","4.5×10⁻⁵","4.5 × 10⁻⁵"]', null, null, false,
   'Move the decimal 5 places right → 4.5, and 10⁻⁵.')
) as q(type, prompt, points, sort_order, options, correct, tolerance, unit, case_sensitive, explanation);


-- 3) Cell Structure & Organisation — 6 questions
with quiz as (
  select a.id as activity_id from public.activities a
  join public.lessons l on l.id = a.lesson_id
  join public.topics tp on tp.id = l.topic_id
  join public.subjects s on s.id = tp.subject_id
  where s.slug = 'biology' and tp.slug = 'organisation-maintenance'
    and l.slug = 'cell-structure-organisation' and a.slug = 'quiz'
)
insert into public.questions
  (activity_id, type, prompt, points, sort_order, options, correct, tolerance, unit, case_sensitive, explanation)
select quiz.activity_id, q.type, q.prompt, q.points, q.sort_order,
       q.options::jsonb, q.correct::jsonb, q.tolerance::numeric, q.unit::text, q.case_sensitive::boolean, q.explanation
from quiz cross join (values
  ('mcq', 'Which of these structures is found in plant cells but NOT in animal cells?', 1, 10,
   '[{"id":"a","text":"Cell membrane"},{"id":"b","text":"Mitochondria"},{"id":"c","text":"Chloroplast"},{"id":"d","text":"Nucleus"}]',
   '"c"', null, null, null,
   'Chloroplasts are exclusive to plant cells (and only in green tissue). The other three are in both.'),
  ('mcq', 'Why do muscle cells contain many more mitochondria than skin cells?', 1, 20,
   '[{"id":"a","text":"They need to divide quickly"},{"id":"b","text":"They need lots of energy to contract"},{"id":"c","text":"They store more glucose"},{"id":"d","text":"They produce more proteins"}]',
   '"b"', null, null, null,
   'Mitochondria release energy by aerobic respiration. Muscle contraction needs a lot of it.'),
  ('true_false', 'The cell wall in a plant is made of cellulose.', 1, 30,
   null, 'true', null, null, null,
   'Plant cell walls are cellulose. Bacterial cell walls are made of something different (peptidoglycan).'),
  ('true_false', 'Animal cells have a small temporary vacuole, not a large permanent one.', 1, 40,
   null, 'true', null, null, null,
   'Correct. Only plant cells have the large permanent central vacuole filled with cell sap.'),
  ('fill_in', 'A group of similar cells working together is called a ____.', 1, 50,
   null, '["tissue"]', null, null, false,
   'Cell → tissue → organ → system → organism.'),
  ('mcq', 'Which sequence shows the levels of organisation in the correct order, smallest to largest?', 2, 60,
   '[{"id":"a","text":"Cell → organ → tissue → system → organism"},{"id":"b","text":"Cell → tissue → organ → system → organism"},{"id":"c","text":"Tissue → cell → organ → organism → system"},{"id":"d","text":"Organism → system → organ → tissue → cell"}]',
   '"b"', null, null, null,
   'Cell → tissue → organ → system → organism. Memorise this.')
) as q(type, prompt, points, sort_order, options, correct, tolerance, unit, case_sensitive, explanation);


-- 4) Photosynthesis — 6 questions
with quiz as (
  select a.id as activity_id from public.activities a
  join public.lessons l on l.id = a.lesson_id
  join public.topics tp on tp.id = l.topic_id
  join public.subjects s on s.id = tp.subject_id
  where s.slug = 'biology' and tp.slug = 'organisation-maintenance'
    and l.slug = 'photosynthesis' and a.slug = 'quiz'
)
insert into public.questions
  (activity_id, type, prompt, points, sort_order, options, correct, tolerance, unit, case_sensitive, explanation)
select quiz.activity_id, q.type, q.prompt, q.points, q.sort_order,
       q.options::jsonb, q.correct::jsonb, q.tolerance::numeric, q.unit::text, q.case_sensitive::boolean, q.explanation
from quiz cross join (values
  ('mcq', 'Which of these is NOT needed for photosynthesis?', 1, 10,
   '[{"id":"a","text":"Carbon dioxide"},{"id":"b","text":"Water"},{"id":"c","text":"Oxygen"},{"id":"d","text":"Light"}]',
   '"c"', null, null, null,
   'Oxygen is a *product* of photosynthesis, not a reactant. The plant releases it into the air.'),
  ('fill_in', 'Complete the word equation: carbon dioxide + water → ______ + oxygen', 1, 20,
   null, '["glucose"]', null, null, false,
   'Glucose is the sugar made during photosynthesis. It''s often stored as starch.'),
  ('true_false', 'In the starch test, a leaf containing starch turns blue-black with iodine.', 1, 30,
   null, 'true', null, null, null,
   'Correct — the exam mark scheme accepts "blue-black" and rejects vague answers like "dark".'),
  ('mcq', 'In the Elodea bubble-counting experiment, why does the rate of bubble production stop increasing once the lamp is very close?', 2, 40,
   '[{"id":"a","text":"The water gets too hot for the pondweed"},{"id":"b","text":"Carbon dioxide has become the limiting factor"},{"id":"c","text":"The pondweed is producing too much glucose"},{"id":"d","text":"Oxygen is now used up faster than it is made"}]',
   '"b"', null, null, null,
   'When light is no longer limiting, something else (usually CO₂) becomes the limiting factor — rate plateaus.'),
  ('mcq', 'A plant is "destarched" before a photosynthesis investigation. Why?', 1, 50,
   '[{"id":"a","text":"To kill the leaf so it can be tested"},{"id":"b","text":"To remove the chlorophyll"},{"id":"c","text":"So any starch found at the end must have been made during the experiment"},{"id":"d","text":"To remove water from the cells"}]',
   '"c"', null, null, null,
   'Destarching (48 hours in the dark) removes existing starch, so the test result is unambiguous.'),
  ('numeric', 'Approximately what percentage of atmospheric air is carbon dioxide? Answer to 2 decimal places.', 1, 60,
   null, '0.04', 0.01, '%', null,
   'CO₂ makes up about 0.04 % of the atmosphere (400 ppm).')
) as q(type, prompt, points, sort_order, options, correct, tolerance, unit, case_sensitive, explanation);
