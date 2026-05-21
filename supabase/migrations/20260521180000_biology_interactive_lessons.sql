-- ============================================================================
-- Embed interactive lesson components into the showcase lessons.
-- Components are registered by name in LessonBody.jsx; here we just drop
-- the placeholder div into body_md.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PHOTOSYNTHESIS — add the LimitingFactorExplorer right after the 3 graphs
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

## See the limiting factor live

The graph below is the same shape as graph 1 above — but this time **you** control the CO₂ and temperature. Drag the sliders and watch the plateau move up or down. Notice when light is no longer the bottleneck — and which factor is.

<div data-lesson-component="limiting-factor-explorer"></div>

> **What to notice.** When CO₂ is high AND temperature is around 30 °C, the curve plateaus high — light becomes the limit. Drop CO₂ low and the plateau crashes even with brilliant light. Crank temperature past 40 °C and the curve collapses as enzymes denature.

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


-- ----------------------------------------------------------------------------
-- OSMOSIS — add a full body with the OsmosisExplorer interactive
-- ----------------------------------------------------------------------------
update public.lessons
set body_md = $$
> **In this lesson** you''ll see how water moves through cell membranes — and why a wilted plant perks back up after a drink. The concept is called **osmosis**, and once you''ve played with the explorer below it''ll click for good.

## What osmosis actually is

**Osmosis** is the net movement of **water** from where there''s **more water** (a dilute solution, or pure water) to where there''s **less water** (a concentrated solution) — across a **partially permeable membrane**.

Three things to lock in:

- It''s only **water** that moves (the dissolved solute can''t fit through the membrane)
- The membrane is **partially permeable** — it lets small water molecules through but blocks bigger solute molecules
- Water moves **down its concentration gradient** — from high water → low water

## See it for yourself

Drag the slider below. Watch a plant cell sit in different solutions and see what happens.

<div data-lesson-component="osmosis-explorer"></div>

## The three words you must know

| Term | Outside solution | What happens to a plant cell |
| --- | --- | --- |
| **Hypotonic** | More dilute than the cell | Water moves IN → cell swells and pushes on the wall → **turgid** (firm) |
| **Isotonic** | Same concentration as the cell | No net movement → cell is normal / **flaccid** |
| **Hypertonic** | More concentrated than the cell | Water moves OUT → cytoplasm pulls away from wall → **plasmolysis** |

> **Why plant cells don''t burst.** The strong cellulose **cell wall** stops the cell from bursting in dilute solution — it just goes turgid (firm). An animal cell, with no wall, **does** burst in pure water (the technical name is **lysis**).

## Why this matters in real plants

- **Turgor pressure** is what holds non-woody plants up. Wilt = cells have lost water = no turgor = floppy stems and leaves.
- **Root hair cells** use osmosis to pull water out of damp soil. Their long thin shape gives a huge surface area, and the cell sap is more concentrated than the soil water, so water rushes in.
- A salty diet shrivels cells — that''s why an over-salted snail dies.

## In the lab

The attached lab gives you potato cylinders in different sucrose concentrations. You measure their mass before and after, and plot mass change against concentration. The point where mass doesn''t change is where the sucrose concentration matches the inside of the potato cells — that''s the **isotonic** point.

## One-line recap

Water moves from dilute to concentrated through a partially permeable membrane. Plant cells go turgid in pure water, plasmolysed in salty water, and normal in matching solutions.
$$
where slug = 'osmosis'
  and topic_id = (select id from public.topics
                  where slug = 'organisation-maintenance'
                  and subject_id = (select id from public.subjects where slug = 'biology'));
