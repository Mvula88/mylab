-- ============================================================================
-- Topic 2: Classification & Diversity — both lessons fully written with
-- rich teaching voice, embedded SVG visuals, and 6-question quizzes each.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- LESSON 1: Hierarchical Classification & Binomial Naming
-- ----------------------------------------------------------------------------
update public.lessons
set body_md = $$
> **In this lesson** you''ll learn how scientists group every living thing on earth into a tidy tree, why each species has a two-word Latin name, and how to use a yes/no "key" to identify any organism in front of you.

There are about **8.7 million** species of living things on Earth. To make sense of them, scientists group similar species together using a system called **classification**. You''ll need to use this system in the exam — not memorise all 8.7 million.

---

## 1. Why classify?

Imagine you walked into a supermarket where every product was on one giant shelf, in no order. You''d never find the milk. A supermarket sorts things into aisles → sections → shelves → brands. Biology does the same thing for living things.

Classification helps biologists:

- **Find** any organism by its features
- **Show how species are related** (close cousins vs distant ones)
- **Predict** features — if two organisms are in the same group, they probably share other features too
- **Communicate** — a scientist in Namibia uses the same name as a scientist in Japan for the same species

---

## 2. The seven-level hierarchy

Every living thing fits into seven nested groups, biggest to smallest:

<div style="margin:1.5rem 0;">
<svg viewBox="0 0 560 240" style="width:100%; height:auto; background:#fff; border:1px solid rgba(26,31,46,0.18);">
  <g font-family="Fraunces" font-size="12">
    <rect x="40" y="20" width="480" height="26" fill="#fdebef" stroke="#c2185b" stroke-width="1.5"/>
    <text x="280" y="38" text-anchor="middle" fill="#1a1f2e" font-style="italic">Kingdom (e.g. Animalia)</text>
    <rect x="80" y="50" width="400" height="26" fill="#fdebef" stroke="#c2185b" stroke-width="1.5"/>
    <text x="280" y="68" text-anchor="middle" fill="#1a1f2e" font-style="italic">Phylum (Chordata)</text>
    <rect x="120" y="80" width="320" height="26" fill="#fdebef" stroke="#c2185b" stroke-width="1.5"/>
    <text x="280" y="98" text-anchor="middle" fill="#1a1f2e" font-style="italic">Class (Mammalia)</text>
    <rect x="160" y="110" width="240" height="26" fill="#fdebef" stroke="#c2185b" stroke-width="1.5"/>
    <text x="280" y="128" text-anchor="middle" fill="#1a1f2e" font-style="italic">Order (Primates)</text>
    <rect x="200" y="140" width="160" height="26" fill="#fdebef" stroke="#c2185b" stroke-width="1.5"/>
    <text x="280" y="158" text-anchor="middle" fill="#1a1f2e" font-style="italic">Family (Hominidae)</text>
    <rect x="220" y="170" width="120" height="26" fill="#fdebef" stroke="#c2185b" stroke-width="1.5"/>
    <text x="280" y="188" text-anchor="middle" fill="#1a1f2e" font-style="italic">Genus (Homo)</text>
    <rect x="240" y="200" width="80" height="26" fill="#c2185b" stroke="#c2185b" stroke-width="1.5"/>
    <text x="280" y="218" text-anchor="middle" fill="#fefcf3" font-weight="600">Species</text>
    <text x="328" y="218" fill="#1a1f2e" font-style="italic">(sapiens)</text>
  </g>
  <text x="20" y="35" font-family="IBM Plex Mono" font-size="10" fill="#1a1f2e">broad</text>
  <text x="20" y="220" font-family="IBM Plex Mono" font-size="10" fill="#1a1f2e">narrow</text>
</svg>
</div>

The example on the right shows **humans** classified all the way down. Every step adds more features that the group shares.

> **Memory trick.** "**K**ing **P**hilip **C**ame **O**ver **F**or **G**reat **S**oup" — first letter of each level: Kingdom, Phylum, Class, Order, Family, Genus, Species.

> **One-line recap.** Big groups split into smaller groups, smallest group is a species.

---

## 3. The binomial naming system

A **species** is the smallest group — it''s a set of organisms that can breed with each other and produce **fertile offspring**.

Every species has a unique **two-word Latin name** called its **binomial name**. The two words are:

1. **Genus** — always written with a **capital letter**
2. **Species** — always **lowercase**

Both are written in **italics** (or underlined when hand-written).

| Common name | Binomial name |
| --- | --- |
| Human | *Homo sapiens* |
| Lion | *Panthera leo* |
| African elephant | *Loxodonta africana* |
| Mopane worm | *Gonimbrasia belina* |
| Welwitschia (a Namibian plant) | *Welwitschia mirabilis* |
| Domestic dog | *Canis familiaris* |

### Why use Latin? Why not just English names?

A "robin" in Europe is a different bird from a "robin" in Namibia. But there''s only ever **one** *Erithacus rubecula* and only one *Cossypha caffra*. The binomial name lets scientists in any country know exactly which species you mean.

> **Watch out.** When you write a binomial name in an exam, the genus must be capitalised, the species lowercase, and both italicised. *Panthera leo* — correct. panthera leo — wrong. Panthera Leo — wrong.

> **One-line recap.** Every species has a unique two-word Latin name: *Genus species*.

---

## 4. Using a dichotomous key

A **dichotomous key** ("dichotomous" = "split in two") is a tool to identify an unknown organism. It asks a series of yes/no questions. Each answer sends you to the next question — until you arrive at the species.

### Example: identify these four small Namibian animals

You find one of these four critters in your garden. Use the key to identify it.

<div style="margin:1.5rem 0;">
<svg viewBox="0 0 600 280" style="width:100%; height:auto; background:#fff; border:1px solid rgba(26,31,46,0.18);">
  <g font-family="IBM Plex Mono" font-size="11" fill="#1a1f2e">
    <rect x="200" y="10" width="200" height="40" fill="#1a1f2e"/>
    <text x="300" y="35" text-anchor="middle" fill="#fefcf3">Q1: Does it have a backbone?</text>
    <line x1="250" y1="50" x2="120" y2="90" stroke="#1a1f2e" stroke-width="1.5"/>
    <line x1="350" y1="50" x2="480" y2="90" stroke="#1a1f2e" stroke-width="1.5"/>
    <text x="170" y="78" fill="#c2185b" font-size="10">NO</text>
    <text x="430" y="78" fill="#2e7d32" font-size="10">YES</text>
    <rect x="20" y="90" width="200" height="40" fill="#1a1f2e"/>
    <text x="120" y="115" text-anchor="middle" fill="#fefcf3">Q2: Has 8 legs?</text>
    <rect x="380" y="90" width="200" height="40" fill="#1a1f2e"/>
    <text x="480" y="115" text-anchor="middle" fill="#fefcf3">Q3: Lives in water?</text>
    <line x1="65" y1="130" x2="40" y2="170" stroke="#1a1f2e" stroke-width="1.5"/>
    <line x1="175" y1="130" x2="200" y2="170" stroke="#1a1f2e" stroke-width="1.5"/>
    <text x="48" y="158" fill="#c2185b" font-size="10">NO</text>
    <text x="186" y="158" fill="#2e7d32" font-size="10">YES</text>
    <line x1="425" y1="130" x2="400" y2="170" stroke="#1a1f2e" stroke-width="1.5"/>
    <line x1="535" y1="130" x2="560" y2="170" stroke="#1a1f2e" stroke-width="1.5"/>
    <text x="408" y="158" fill="#c2185b" font-size="10">NO</text>
    <text x="546" y="158" fill="#2e7d32" font-size="10">YES</text>
    <rect x="0" y="170" width="80" height="40" fill="#c2185b"/>
    <text x="40" y="195" text-anchor="middle" fill="#fefcf3">Insect</text>
    <rect x="160" y="170" width="80" height="40" fill="#c2185b"/>
    <text x="200" y="195" text-anchor="middle" fill="#fefcf3">Spider</text>
    <rect x="360" y="170" width="80" height="40" fill="#c2185b"/>
    <text x="400" y="195" text-anchor="middle" fill="#fefcf3">Lizard</text>
    <rect x="520" y="170" width="80" height="40" fill="#c2185b"/>
    <text x="560" y="195" text-anchor="middle" fill="#fefcf3">Tilapia fish</text>
  </g>
  <text x="20" y="260" font-family="Fraunces" font-style="italic" font-size="11" fill="#1a1f2e">Read the key from top to bottom — yes/no at each step.</text>
</svg>
</div>

> **Try this yourself.** You find an animal with no backbone and only 6 legs. Walk through the key. *Answer:* Q1 → NO → Q2 → NO → **Insect**.

### How to build your own key (you may have to in the exam)

1. Pick the most obvious difference between two groups of your organisms
2. Write a yes/no question about that difference (Q1)
3. For each side of Q1, repeat: pick a feature that splits that group again
4. Stop when each "branch" leads to just one species

> **One-line recap.** A dichotomous key is a series of yes/no questions that narrows down an unknown organism to its species.
$$
where slug = 'classification-binomial-naming'
  and topic_id = (select id from public.topics
                  where slug = 'classification-diversity'
                  and subject_id = (select id from public.subjects where slug = 'biology'));


-- ----------------------------------------------------------------------------
-- LESSON 2: Diversity of Organisms
-- ----------------------------------------------------------------------------
update public.lessons
set body_md = $$
> **In this lesson** you''ll learn the main groups of living things you must recognise for NSSCO Biology — viruses, plants, and the major animal groups — and the features that tell them apart at a glance.

The world has so many living things that we have to put them into groups to make sense of them. NSSCO asks you to recognise the **kingdoms** and the main **animal phyla** plus **vertebrate classes**.

---

## 1. The big picture

Living things are usually divided into five kingdoms:

<div style="margin:1.5rem 0;">
<svg viewBox="0 0 600 200" style="width:100%; height:auto; background:#fff; border:1px solid rgba(26,31,46,0.18);">
  <g font-family="Fraunces" font-size="12">
    <rect x="10" y="20" width="110" height="160" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2"/>
    <text x="65" y="40" text-anchor="middle" font-weight="600" fill="#2e7d32">Plants</text>
    <text x="65" y="60" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">cellulose walls</text>
    <text x="65" y="74" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">chloroplasts</text>
    <text x="65" y="88" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">photosynthesis</text>
    <text x="65" y="155" text-anchor="middle" font-size="22">🌳</text>

    <rect x="130" y="20" width="110" height="160" fill="#fef3e0" stroke="#c79a3a" stroke-width="2"/>
    <text x="185" y="40" text-anchor="middle" font-weight="600" fill="#c79a3a">Animals</text>
    <text x="185" y="60" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">no cell wall</text>
    <text x="185" y="74" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">eat other organisms</text>
    <text x="185" y="88" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">move around</text>
    <text x="185" y="155" text-anchor="middle" font-size="22">🦁</text>

    <rect x="250" y="20" width="110" height="160" fill="#f3e5f5" stroke="#8e24aa" stroke-width="2"/>
    <text x="305" y="40" text-anchor="middle" font-weight="600" fill="#8e24aa">Fungi</text>
    <text x="305" y="60" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">chitin walls</text>
    <text x="305" y="74" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">no chloroplasts</text>
    <text x="305" y="88" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">break down dead matter</text>
    <text x="305" y="155" text-anchor="middle" font-size="22">🍄</text>

    <rect x="370" y="20" width="110" height="160" fill="#e3f2fd" stroke="#1976d2" stroke-width="2"/>
    <text x="425" y="40" text-anchor="middle" font-weight="600" fill="#1976d2">Protoctists</text>
    <text x="425" y="60" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">single-celled</text>
    <text x="425" y="74" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">true nucleus</text>
    <text x="425" y="88" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">e.g. Amoeba, malaria</text>

    <rect x="490" y="20" width="100" height="160" fill="#ffebee" stroke="#c2185b" stroke-width="2"/>
    <text x="540" y="40" text-anchor="middle" font-weight="600" fill="#c2185b">Bacteria</text>
    <text x="540" y="60" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">no nucleus</text>
    <text x="540" y="74" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">simple wall</text>
    <text x="540" y="88" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#1a1f2e">e.g. E. coli, TB</text>
  </g>
</svg>
</div>

> **Where do viruses fit?** They don''t. Viruses aren''t put in any kingdom because most biologists don''t consider them truly alive.

---

## 2. Viruses — are they alive?

A virus has just two parts:

- A **protein coat** (capsid) on the outside
- **Genetic material** (DNA or RNA) on the inside

That''s it. No cytoplasm, no organelles, no respiration, no movement, no growth on their own.

| Feature of living things | Virus? |
| --- | --- |
| Made of cells | ✘ |
| Carries out respiration | ✘ |
| Reproduces on its own | ✘ (only inside a host cell) |
| Has genetic material | ✔ |
| Mutates and evolves | ✔ |

This is why we say "**viruses are on the borderline of living and non-living**" — they have some features but lack the most important one (cellular structure).

Examples you should know: HIV (causes AIDS), measles virus, influenza, COVID-19, the rabies virus.

---

## 3. Flowering plants — monocots vs dicots

The two main groups of flowering plants are split by the **number of seed leaves** (cotyledons) the seedling has.

<div style="margin:1.5rem 0;">
<svg viewBox="0 0 600 220" style="width:100%; height:auto; background:#fff; border:1px solid rgba(26,31,46,0.18);">
  <g font-family="Fraunces" font-size="12">
    <text x="150" y="25" text-anchor="middle" font-weight="600" fill="#2e7d32" font-style="italic">Monocots (1 seed leaf)</text>
    <line x1="150" y1="160" x2="150" y2="200" stroke="#2e7d32" stroke-width="3"/>
    <path d="M 150 160 Q 130 110 100 90 Q 130 130 145 150" fill="none" stroke="#2e7d32" stroke-width="2"/>
    <path d="M 150 160 Q 170 110 200 90 Q 170 130 155 150" fill="none" stroke="#2e7d32" stroke-width="2"/>
    <text x="150" y="215" text-anchor="middle" font-family="IBM Plex Mono" font-size="10" fill="#1a1f2e">parallel leaf veins · maize, grass, palm</text>

    <text x="450" y="25" text-anchor="middle" font-weight="600" fill="#c2185b" font-style="italic">Dicots (2 seed leaves)</text>
    <line x1="450" y1="160" x2="450" y2="200" stroke="#c2185b" stroke-width="3"/>
    <ellipse cx="420" cy="100" rx="35" ry="22" fill="none" stroke="#c2185b" stroke-width="2"/>
    <ellipse cx="480" cy="100" rx="35" ry="22" fill="none" stroke="#c2185b" stroke-width="2"/>
    <path d="M 420 100 L 410 90 M 420 100 L 430 90 M 420 100 L 410 110 M 420 100 L 430 110" stroke="#c2185b" stroke-width="0.8"/>
    <path d="M 480 100 L 470 90 M 480 100 L 490 90 M 480 100 L 470 110 M 480 100 L 490 110" stroke="#c2185b" stroke-width="0.8"/>
    <text x="450" y="215" text-anchor="middle" font-family="IBM Plex Mono" font-size="10" fill="#1a1f2e">branching leaf veins · bean, rose, oak</text>
  </g>
</svg>
</div>

| Feature | Monocots | Dicots |
| --- | --- | --- |
| Seed leaves | 1 | 2 |
| Leaf veins | parallel | branching (net-like) |
| Petals | in 3s | in 4s or 5s |
| Roots | fibrous (many thin) | one big tap root |
| Examples | maize, palm, grass, lily | bean, sunflower, rose, oak |

---

## 4. The main animal groups

NSSCO splits animals into **invertebrates** (no backbone) and **vertebrates** (backbone).

### Invertebrate phyla

- **Molluscs** — soft body, often a shell (snails, slugs, mussels, octopus)
- **Annelids** — long body in segments (earthworms, leeches)
- **Arthropods** — hard exoskeleton, jointed legs. The biggest group. Split into four classes:
  - **Insects** — 3 body parts, **6 legs**, usually wings (bees, butterflies, ants, mopane worms)
  - **Arachnids** — 2 body parts, **8 legs**, no wings (spiders, scorpions, ticks)
  - **Crustaceans** — many legs, gills, hard shell (crabs, prawns, woodlice)
  - **Myriapods** — many legs in segments (centipedes, millipedes)

### Vertebrate classes

| Class | Body covering | Reproduction | Body temperature | Examples |
| --- | --- | --- | --- | --- |
| **Fish** | scales | eggs, in water | cold-blooded | tilapia, kingklip |
| **Amphibians** | moist skin | eggs in water, young live there too | cold-blooded | frogs, toads |
| **Reptiles** | dry scales | eggs on land (leathery shell) | cold-blooded | snakes, lizards, tortoises |
| **Birds** | feathers | hard-shelled eggs | warm-blooded | ostrich, eagle, weaver |
| **Mammals** | fur or hair | give birth to live young, feed milk | warm-blooded | lion, springbok, human |

> **Memory trick for vertebrates.** Fish → Amphibians → Reptiles → Birds → Mammals. Notice how each step the body covering gets more sophisticated and animals are better adapted to life on land.

---

## 5. Quick spot-the-group practice

Look at the description, name the group:

1. Soft body, no backbone, lives in a shell → ??? *(Mollusc)*
2. 8 legs, 2 body parts → ??? *(Arachnid — a spider)*
3. Hatches from a hard-shelled egg, has feathers → ??? *(Bird)*
4. Cold-blooded, lives in water, scales → ??? *(Fish)*
5. Drinks its mother''s milk → ??? *(Mammal)*

If you got 4/5 or 5/5, you''ve nailed it.

> **One-line recap.** Plants do photosynthesis. Fungi decompose. Animals split into invertebrates (no backbone) and vertebrates (5 classes: fish, amphibians, reptiles, birds, mammals).
$$
where slug = 'diversity-of-organisms'
  and topic_id = (select id from public.topics
                  where slug = 'classification-diversity'
                  and subject_id = (select id from public.subjects where slug = 'biology'));


