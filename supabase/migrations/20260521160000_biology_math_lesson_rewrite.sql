-- ============================================================================
-- Rewrite the Mathematical Requirements lesson in plain, scaffolded language
-- after user feedback that the standard-form section was too academic.
-- ============================================================================

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

## 4. Direct and inverse proportion

These are just two ways that one thing can change with another.

### Direct proportion

When one thing doubles, the other also doubles. They go up together. On a graph, this is a **straight line through zero**.

Biology example: at low light, the rate of photosynthesis doubles when you double the light intensity.

### Inverse proportion

When one thing doubles, the other **halves**. They move in opposite directions. On a graph, this is a curve that bends down and flattens.

Biology example: the time taken for amylase to break down all the starch halves when you double the enzyme concentration.

> **One-line recap:** Direct = they go up together. Inverse = one goes up, the other goes down.

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
