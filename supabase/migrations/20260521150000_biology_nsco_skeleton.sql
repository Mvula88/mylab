-- ============================================================================
-- NSSCO Biology (syllabus code 6116, NIED 2018) — complete topic tree + all
-- 51 lesson skeletons (title + learning objectives + lab attachments).
-- Showcase lessons get rich content via a follow-up migration.
-- Safe to re-run: deletes existing biology topics (cascades) and reseeds.
-- ============================================================================

-- 1) Wipe existing biology topics (cascades to lessons, activities, questions)
delete from public.topics
where subject_id = (select id from public.subjects where slug = 'biology');

-- 2) Insert the 5 official NSSCO Biology topics
with bio as (select id from public.subjects where slug = 'biology')
insert into public.topics (subject_id, slug, title, blurb, sort_order)
select bio.id, t.slug, t.title, t.blurb, t.sort_order from bio,
  (values
    ('scientific-processes',     'Scientific Processes',
     'Foundational maths, lab skills, measurement, data handling and experimental technique used throughout the course.', 10),
    ('classification-diversity', 'Classification & Diversity of Living Organisms',
     'How living organisms are grouped, named and adapted to their environments. ~5% of teaching time.', 20),
    ('organisation-maintenance', 'Organisation & Maintenance of the Organism',
     'Cells, transport, biological molecules, enzymes, nutrition, transport, gas exchange, respiration, excretion, co-ordination and homeostasis. ~60% of teaching time.', 30),
    ('development-continuity',   'Development of the Organism & Continuity of Life',
     'Cell division, reproduction in plants and humans, inheritance, variation, selection and evolution. ~20% of teaching time.', 40),
    ('organisms-environment',    'Organisms, Environment & Ecology',
     'Energy flow, biochemical cycles, populations, human impact and conservation. ~15% of teaching time.', 50)
  ) as t(slug, title, blurb, sort_order);

-- 3) Insert all 51 lesson skeletons
--    body_md here is a brief placeholder (objectives). Rich text + quizzes
--    are layered on top via the next migration. is_published=true so the
--    learner sees the full syllabus tree from day 1.
with t as (
  select tp.id as topic_id, tp.slug as topic_slug
  from public.topics tp
  join public.subjects s on s.id = tp.subject_id
  where s.slug = 'biology'
)
insert into public.lessons (topic_id, slug, title, body_md, lab_slug, is_published, sort_order)
select t.topic_id, l.slug, l.title, l.body_md, l.lab_slug, true, l.sort_order
from t join (values

  -- ============================================================================
  -- TOPIC 1: SCIENTIFIC PROCESSES
  -- ============================================================================
  ('scientific-processes', 'mathematical-requirements',
   'Mathematical Requirements',
$$> **What you''ll learn**: the maths you''ll use every lesson — arithmetic, decimals, fractions, percentages, ratios, indices, equations, ruler/protractor work, direct vs inverse proportion.

This lesson is being prepared. Full notes and the video are on their way. In the meantime, here are the **learning objectives** straight from the NSSCO syllabus:

### What you should be able to do

- Add, subtract, multiply and divide with decimals, fractions and percentages
- Use ratios and reciprocals
- Use a ruler, compasses and a protractor
- Recognise direct and inverse proportion
- Work with indices (powers and standard form)
- Rearrange simple equations
$$,
   null, 10),

  ('scientific-processes', 'planning-investigations',
   'Planning & Conducting Investigations',
$$> **What you''ll learn**: how a scientist plans a fair experiment — variables, hypothesis, lab safety.

### What you should be able to do

- Handle apparatus safely
- Identify the **independent**, **dependent** and **constant (control)** variables in an experiment
- State a hypothesis and aim in terms of the variables
- Explain what makes an investigation "fair"
$$,
   null, 20),

  ('scientific-processes', 'recording-tables-graphs',
   'Recording, Tables & Graphs',
$$> **What you''ll learn**: how to record measurements in tables and turn them into graphs that examiners will mark as correct.

### What you should be able to do

- Organise raw data into a results table
- Choose the right scale and axes
- Label units on every axis
- Plot **independent** variable on the x-axis and **dependent** variable on the y-axis
- Read information off bar charts, pie charts, line graphs and pictograms
$$,
   null, 30),

  ('scientific-processes', 'units-errors-uncertainty',
   'Units, Errors & Uncertainty',
$$> **What you''ll learn**: SI units, prefixes (milli, micro, kilo), standard notation, random vs systematic errors, and what to do with anomalous results.

### What you should be able to do

- Use SI base units and derived units, with prefixes (k, d, c, m, µ)
- Convert between standard form and ordinary numbers (e.g. 6.5 × 10⁻³)
- Tell the difference between a **random error** and a **systematic error**
- Identify anomalous results and suggest improvements to method
$$,
   null, 40),

  ('scientific-processes', 'experimental-techniques',
   'Experimental Techniques',
$$> **What you''ll learn**: choosing the right apparatus, doing the standard chemical tests (limewater, hydrogencarbonate indicator, litmus, Universal Indicator), and drawing biological specimens properly.

### What you should be able to do

- Pick the right apparatus to measure time, temperature, mass, volume (burette, pipette, measuring cylinder)
- Use chemical tests: **limewater** (CO₂), **hydrogencarbonate indicator** (CO₂ in solution), **litmus** and **Universal Indicator** (pH)
- Draw biological specimens with **magnification** and **labels** to exam standard
$$,
   null, 50),

  -- ============================================================================
  -- TOPIC 2: CLASSIFICATION & DIVERSITY
  -- ============================================================================
  ('classification-diversity', 'classification-binomial-naming',
   'Hierarchical Classification & Binomial Naming',
$$> **What you''ll learn**: how scientists group every living thing on earth into a tidy tree, and why each species gets a two-word Latin name.

### What you should be able to do

- Explain that organisms are grouped by shared features (kingdom → phylum → class → order → family → genus → species)
- Describe **binomial naming** (genus + species, e.g. *Homo sapiens*)
- Construct and use a **dichotomous key** to identify an unknown organism
$$,
   null, 10),

  ('classification-diversity', 'diversity-of-organisms',
   'Diversity of Organisms',
$$> **What you''ll learn**: the main groups of organisms — viruses, flowering plants (mono/dicot), animals (molluscs, annelids, arthropods, vertebrates) — and their key features.

### What you should be able to do

- Outline the structure of a virus (protein coat + genetic material) and debate whether viruses are alive
- Recognise features of flowering plants: monocot vs dicot
- Identify these animal groups: **molluscs, annelids, arthropods** (insects, arachnids, crustaceans, myriapods), **vertebrates** (fish, amphibians, reptiles, birds, mammals)
- Observe and draw locally-found organisms, picking out diagnostic and adaptive features
$$,
   null, 20),

  -- ============================================================================
  -- TOPIC 3: ORGANISATION & MAINTENANCE (the big one — 60% of course)
  -- ============================================================================
  ('organisation-maintenance', 'the-microscope',
   'The Microscope',
$$> **What you''ll learn**: how to use a light microscope, and how to calculate magnification and real specimen size in mm and micrometres (µm).

### What you should be able to do

- Use a simple light microscope (low and high power)
- Calculate **magnification** = image size ÷ actual size
- Calculate actual specimen size when given magnification
- Convert between mm and µm (1 mm = 1000 µm)
$$,
   'microscopy-cells', 10),

  ('organisation-maintenance', 'cell-structure-organisation',
   'Cell Structure & Levels of Organisation',
$$> **What you''ll learn**: what plant and animal cells look like, the function of each organelle, and how cells are organised into tissues, organs, systems and the whole organism.

### What you should be able to do

- Compare a plant cell (palisade) with an animal cell (liver): identify cell membrane, cell wall, cytoplasm, nucleus, vacuoles, chloroplasts
- State the function of the rough ER, ribosomes, vesicles and **mitochondria**
- Explain why cells with high energy demand have lots of mitochondria
- Sequence: cell → tissue → organ → system → organism
$$,
   'microscopy-cells', 20),

  ('organisation-maintenance', 'diffusion',
   'Diffusion',
$$> **What you''ll learn**: how molecules spread from high to low concentration on their own, driven by random kinetic motion.

### What you should be able to do

- Define **diffusion** and explain that it is driven by the random kinetic energy of molecules
- Explain how surface area, temperature, concentration gradient and distance affect rate
- Give biological examples (gas exchange in lungs and leaves; uptake of food)
$$,
   'diffusion-agar', 30),

  ('organisation-maintenance', 'osmosis',
   'Osmosis',
$$> **What you''ll learn**: water moving across a partially permeable membrane — what hypotonic, isotonic and hypertonic mean for plant and animal cells.

### What you should be able to do

- Define **osmosis** as the net movement of water from a region of high water potential to low
- Predict what happens to plant and animal cells in hypotonic, isotonic and hypertonic solutions
- Define **turgor**, **turgid**, **flaccid** and **plasmolysis**
- Explain why plants need turgid cells for support
$$,
   'osmosis-potato', 40),

  ('organisation-maintenance', 'active-transport',
   'Active Transport',
$$> **What you''ll learn**: how cells move substances against the concentration gradient using energy from respiration.

### What you should be able to do

- Define **active transport** (low to high concentration, using respiratory energy)
- Give examples: root-hair ion uptake; glucose uptake by villi and kidney tubules
- Outline the role of carrier proteins in the cell membrane
$$,
   null, 50),

  ('organisation-maintenance', 'biological-molecules-food-tests',
   'Biological Molecules & Food Tests',
$$> **What you''ll learn**: the four main groups of biological molecules and how to test for each.

### What you should be able to do

- Describe synthesis of starch/glycogen, proteins, fats from monomers
- State the role of carbohydrates, fats, proteins and water in living things
- Explain that protein shape comes from amino acid sequence
- Describe DNA as a double helix with A-T and C-G base pairing
- Carry out food tests: **Benedict''s** (reducing sugars), **iodine** (starch), **biuret** (protein), **ethanol emulsion** (fats), **DCPIP** (vitamin C)
$$,
   'food-tests', 60),

  ('organisation-maintenance', 'enzymes',
   'Enzymes',
$$> **What you''ll learn**: how enzymes work as biological catalysts and what affects their activity.

### What you should be able to do

- Define **catalyst** and **enzyme**
- Explain the **active site**, the enzyme-substrate complex, and product formation
- Explain the effect of **temperature** and **pH** (shape, fit, denaturation)
- Describe enzyme uses in germination, washing powders and the food industry
$$,
   'enzyme-temperature', 70),

  ('organisation-maintenance', 'plant-nutrition-leaf-structure',
   'Plant Nutrition: Leaf Structure',
$$> **What you''ll learn**: how a leaf is built to do photosynthesis.

### What you should be able to do

- Identify cellular/tissue structure of a dicot leaf in cross-section
- Relate **chloroplasts** to photosynthesis, **stomata** to gas exchange, **xylem/phloem** to transport
- Explain how the leaf is adapted for its function
$$,
   'microscopy-cells', 80),

  ('organisation-maintenance', 'mineral-requirements',
   'Mineral Requirements',
$$> **What you''ll learn**: the mineral ions plants need and what happens when they''re deficient.

### What you should be able to do

- State the importance of **nitrate (N)**, **phosphate (P)**, **magnesium (Mg)** and **iron (Fe)**
- Explain the deficiency effects on plant growth
$$,
   null, 90),

  ('organisation-maintenance', 'photosynthesis',
   'Photosynthesis',
$$> **What you''ll learn**: how green plants turn sunlight into food, and how to investigate the limiting factors.

### What you should be able to do

- State the word and balanced chemical equation for photosynthesis
- Investigate need for chlorophyll, light and CO₂ (using controls)
- Describe the effect of light intensity, CO₂ concentration and temperature on rate
- Define **limiting factor**
- Explain how greenhouse growers use CO₂ enrichment, lighting and temperature
$$,
   'photosynthesis', 100),

  ('organisation-maintenance', 'human-nutrition',
   'Human Nutrition: Diet & Nutrients',
$$> **What you''ll learn**: what a balanced diet looks like at different ages and activity levels — and what happens when it goes wrong.

### What you should be able to do

- Identify causes and effects of deficiency of vitamins A, D, C, iodine and iron
- Describe a balanced diet for children, adults, nursing mothers, athletes, PLHIV
- Discuss malnutrition: starvation, constipation, coronary heart disease, obesity, scurvy
- Discuss over-consumption in Namibia and causes of famine
$$,
   'nutrients-in-foods', 110),

  ('organisation-maintenance', 'alimentary-canal',
   'Alimentary Canal',
$$> **What you''ll learn**: the journey of food through the human body — mouth to anus.

### What you should be able to do

- Define **ingestion**, **digestion** (mechanical + chemical), **absorption**, **egestion**
- Describe the function of mouth, oesophagus, stomach, small intestine, colon and anus
- Describe cholera: toxin → chloride secretion → osmotic water loss → diarrhoea
$$,
   null, 120),

  ('organisation-maintenance', 'digestion',
   'Digestion',
$$> **What you''ll learn**: how the digestive enzymes break down starch, protein and fats — and how pH and bile help.

### What you should be able to do

- Explain why digestive enzymes have specific pH and temperature optima
- Describe digestion of starch by **amylase**, protein by **protease**, fats by **lipase**
- Explain the role of **HCl** in the stomach
- Explain the role of **bile** in neutralisation and **emulsification** of fats
$$,
   'enzyme-substrate', 130),

  ('organisation-maintenance', 'absorption',
   'Absorption',
$$> **What you''ll learn**: how the small intestine is built to absorb the maximum amount of food into the blood.

### What you should be able to do

- Identify the small intestine as the main site of absorption
- Explain how **villi**, capillaries and lacteals are adapted (large surface area, thin walls, good blood supply)
- Describe the hepatic portal vein and the liver''s role in excess glucose, amino acid breakdown and fat storage
- Note that water is absorbed in both the small intestine and the colon
$$,
   null, 140),

  ('organisation-maintenance', 'transport-in-plants',
   'Transport in Plants',
$$> **What you''ll learn**: how water and minerals move from soil up through the plant, and what controls how fast.

### What you should be able to do

- Identify dicot root and stem structure (epidermis with root hairs, cortex, xylem, phloem)
- Explain the pathway: root → xylem → leaves → stomata
- Define and describe **transpiration**
- Describe how temperature, wind, humidity and light intensity affect rate
- Describe **wilting** and **xerophyte** adaptations (Aloe, Euphorbia, Quiver tree)
- Define **translocation**
$$,
   'celery-xylem', 150),

  ('organisation-maintenance', 'heart-circulation',
   'Heart & Circulation',
$$> **What you''ll learn**: how the heart pumps blood through a double circulation, and what damages it.

### What you should be able to do

- Describe the gross structure and function of the heart
- Draw the external mammalian heart
- Describe adaptations of arteries, veins and capillaries
- Explain the double circulation
- Describe the effect of exercise on pulse rate
- Describe causes and treatments of heart attack
- Describe the function of the lymphatic system
$$,
   null, 160),

  ('organisation-maintenance', 'blood',
   'Blood',
$$> **What you''ll learn**: the components of blood and how each contributes to transport and defence.

### What you should be able to do

- Identify red and white blood cells under a microscope
- State the function of red cells, white cells, platelets and plasma
- Distinguish **lymphocytes** from **phagocytes**
- Describe clotting (fibrinogen → fibrin)
- Explain transfer of materials between capillaries and tissue fluid
$$,
   'microscopy-cells', 170),

  ('organisation-maintenance', 'defence-against-disease',
   'Defence Against Disease',
$$> **What you''ll learn**: how the immune system fights pathogens, and how vaccines train it ahead of time.

### What you should be able to do

- Define **pathogen**
- Describe mechanical/chemical barriers, antibody production and phagocytosis
- Distinguish **active** and **passive** immunity
- Explain how vaccination works (memory cells)
- Discuss the importance of passive immunity in breast-fed infants
$$,
   null, 180),

  ('organisation-maintenance', 'gas-exchange-in-humans',
   'Gas Exchange in Humans',
$$> **What you''ll learn**: how the lungs are adapted for gas exchange and what tobacco smoke does to them.

### What you should be able to do

- Distinguish **breathing** from **respiration**
- List features of a good gas exchange surface (large SA, thin, good blood supply, ventilation)
- Explain the roles of intercostal muscles and tracheal cartilage
- Compare inspired and expired air
- Describe the effect of exercise on rate and depth of breathing
- Describe the effects of CO, nicotine and tar in tobacco smoke; describe COPD
$$,
   'limewater-exhaled', 190),

  ('organisation-maintenance', 'aerobic-respiration',
   'Aerobic Respiration',
$$> **What you''ll learn**: how cells release energy from glucose using oxygen.

### What you should be able to do

- Define **aerobic respiration**
- State the word and balanced chemical equation
- List the body''s uses of energy released by respiration
- Investigate oxygen uptake by germinating seeds and the effect of temperature
$$,
   'germinating-seeds', 200),

  ('organisation-maintenance', 'anaerobic-respiration',
   'Anaerobic Respiration',
$$> **What you''ll learn**: how cells release energy without oxygen — in muscles and in yeast.

### What you should be able to do

- Define **anaerobic respiration**
- State the word equation in muscle (glucose → lactic acid)
- State the chemical equation in yeast (glucose → ethanol + CO₂)
- Explain **oxygen debt** and lactic acid removal
- Describe its role in brewing and bread-making
- Compare aerobic vs anaerobic energy yield
$$,
   'respirometer', 210),

  ('organisation-maintenance', 'excretion-in-humans',
   'Excretion in Humans',
$$> **What you''ll learn**: how the liver and kidneys remove waste products from the blood.

### What you should be able to do

- Define **deamination**
- Describe formation of urea and breakdown of alcohol, drugs and hormones in the liver
- Identify the ureter, bladder and urethra
- Describe kidney functions (remove urea and excess water; reabsorb glucose and salts)
- Outline dialysis vs kidney transplant
$$,
   'visking-tubing', 220),

  ('organisation-maintenance', 'coordination-in-plants',
   'Co-ordination in Plants',
$$> **What you''ll learn**: how plants sense and respond to their environment using growth substances.

### What you should be able to do

- Define **plant growth substances**
- Define **gravitropism** and **phototropism**
- Explain chemical control by auxins
- Describe synthetic growth substances as weed killers
- Explain tropisms as auxin-driven differential growth
$$,
   'germinating-seeds', 230),

  ('organisation-maintenance', 'nervous-control-in-humans',
   'Nervous Control in Humans',
$$> **What you''ll learn**: how the nervous system carries signals around the body, and how the eye works.

### What you should be able to do

- Identify sensory, relay and motor neurones
- Identify effectors (muscles, glands)
- Define **synapse** and explain transmission
- Distinguish voluntary and involuntary actions
- Describe a simple reflex arc
- Draw a transverse section of the spinal cord
- Describe the structure of the eye (cornea, iris, pupil, lens, retina, optic nerve, blind spot)
- Explain the pupil reflex and accommodation
- Compare rods and cones
- Compare nervous and hormonal control
$$,
   null, 240),

  ('organisation-maintenance', 'drugs',
   'Drugs',
$$> **What you''ll learn**: how antibiotics work, and why alcohol and heroin are dangerous.

### What you should be able to do

- Define **drug**
- Explain antibiotics for bacterial infection and why they don''t work against viruses
- Describe the effects of excessive alcohol and heroin: depressant effects, reaction time, liver damage, addiction, social impact, HIV risk
$$,
   null, 250),

  ('organisation-maintenance', 'hormones-in-humans',
   'Hormones in Humans',
$$> **What you''ll learn**: chemical messengers — what they are and what they do.

### What you should be able to do

- Define **hormone**
- Identify: adrenal glands → adrenaline; pancreas → insulin; testes → testosterone; ovaries → oestrogen
- Explain the role of adrenaline in metabolic control
$$,
   null, 260),

  ('organisation-maintenance', 'homeostasis',
   'Homeostasis',
$$> **What you''ll learn**: how the body keeps its internal conditions steady — temperature and blood glucose.

### What you should be able to do

- Define **homeostasis**
- Explain **negative feedback**
- Describe temperature regulation in ectotherms and endotherms
- Describe sweating, shivering, vasodilation and vasoconstriction
- Explain control of blood glucose by insulin and glucagon
- Describe symptoms and treatment of Type 1 diabetes
$$,
   null, 270),

  -- ============================================================================
  -- TOPIC 4: DEVELOPMENT & CONTINUITY OF LIFE
  -- ============================================================================
  ('development-continuity', 'cell-division-mitosis-meiosis',
   'Cell Division (Mitosis & Meiosis)',
$$> **What you''ll learn**: the two kinds of cell division — one for growth/repair, one for sex cells.

### What you should be able to do

- Define **mitosis** and describe its role in growth, repair and asexual reproduction
- Observe mitosis in root tip squashes
- Define **meiosis** as reduction division producing haploid, genetically different cells
- State its role in gamete production and variation
- Distinguish mitosis from meiosis
$$,
   'mitosis', 10),

  ('development-continuity', 'asexual-and-sexual-reproduction',
   'Asexual & Sexual Reproduction',
$$> **What you''ll learn**: the two ways living things make more of themselves, and the trade-offs of each.

### What you should be able to do

- Define **asexual reproduction** with examples (bacteria, fungal spores, potato tubers)
- List advantages and disadvantages of asexual reproduction
- Define **sexual reproduction** and **fertilisation**
- List advantages and disadvantages of sexual reproduction
$$,
   null, 20),

  ('development-continuity', 'sexual-reproduction-in-plants',
   'Sexual Reproduction in Plants',
$$> **What you''ll learn**: how flowers are built for cross-pollination, and how seeds get dispersed.

### What you should be able to do

- Define **self-** and **cross-pollination**
- Compare adaptations of insect- and wind-pollinated flowers
- Identify agents of pollination
- Describe pollen tube growth and fertilisation
- Explain implications for variation
- Explain the importance of seed dispersal
$$,
   null, 30),

  ('development-continuity', 'sex-hormones-menstrual-cycle',
   'Sex Hormones & Menstrual Cycle',
$$> **What you''ll learn**: the four hormones that drive the menstrual cycle and pregnancy.

### What you should be able to do

- State sites of oestrogen and progesterone production
- Describe the role of **FSH**, **LH**, **oestrogen** and **progesterone** in the menstrual cycle and pregnancy
$$,
   null, 40),

  ('development-continuity', 'sexual-reproduction-in-humans',
   'Sexual Reproduction in Humans',
$$> **What you''ll learn**: human reproductive anatomy and the journey from fertilisation to birth.

### What you should be able to do

- Identify parts and functions of the male and female reproductive systems
- Define **fertilisation**
- Describe the function of the placenta and umbilical cord
- Outline fetal development, labour and birth
- Compare breast vs bottle feeding
$$,
   null, 50),

  ('development-continuity', 'birth-control-fertility',
   'Birth Control & Fertility',
$$> **What you''ll learn**: the methods used to prevent pregnancy and to treat infertility.

### What you should be able to do

- Outline natural, chemical (IUD, pill, implant, injection), barrier (condom, femidom, diaphragm) and surgical (vasectomy, tubal ligation) methods
- Explain the use of hormones in contraception and fertility treatments
- Discuss social aspects
$$,
   null, 60),

  ('development-continuity', 'sexually-transmitted-infections',
   'Sexually Transmitted Infections',
$$> **What you''ll learn**: how HIV is transmitted, how it''s prevented, and what it means for Namibia.

### What you should be able to do

- Define **STI**
- Describe methods of HIV transmission and prevention
- Discuss the vulnerability of Namibians to opportunistic illnesses due to HIV/AIDS
- Discuss the socio-economic consequences for Namibia
$$,
   null, 70),

  ('development-continuity', 'growth-and-development',
   'Growth & Development',
$$> **What you''ll learn**: how to measure growth, the conditions seeds need to germinate, and how to draw a growth curve.

### What you should be able to do

- Define **growth** (increase in dry mass/size) and **development** (increase in complexity)
- State the environmental conditions for germination
- Describe methods of measuring growth in plants and mammals
- Construct and explain a growth curve
$$,
   'germinating-seeds', 80),

  ('development-continuity', 'chromosomes-genes-proteins',
   'Chromosomes, Genes & Proteins',
$$> **What you''ll learn**: how DNA codes for proteins, and the language of genetics.

### What you should be able to do

- Define **inheritance**, **chromosome**, **homologous chromosomes**, **haploid**, **diploid**, **gene**, **allele**
- Explain the genetic code (base sequence → amino acid order → protein)
- Explain how DNA controls cell function through proteins, antibodies and receptors
$$,
   null, 90),

  ('development-continuity', 'monohybrid-inheritance',
   'Monohybrid Inheritance',
$$> **What you''ll learn**: how to predict the offspring of a genetic cross using Punnett squares.

### What you should be able to do

- Define **genotype**, **phenotype**, **homozygous**, **heterozygous**, **dominant**, **recessive**
- Predict 1:1 and 3:1 ratios using genetic diagrams
- Describe sex inheritance (XX, XY)
- Use a **test cross**
- Predict co-dominance and sex-linkage crosses
$$,
   'monohybrid', 100),

  ('development-continuity', 'variation',
   'Variation',
$$> **What you''ll learn**: where differences between individuals come from, and how mutations happen.

### What you should be able to do

- Define **variation**
- Explain that phenotypic variation comes from genes plus environment
- Distinguish **continuous** (e.g. human height) from **discontinuous** (e.g. ABO blood groups) variation
- Define **gene mutation**
- Discuss effects of radiation and chemicals on mutation rate
- Describe Down''s syndrome
- Describe sickle-cell anaemia and its link to malaria distribution
$$,
   'variation', 110),

  ('development-continuity', 'selection-and-evolution',
   'Adaptive Features, Selection & Evolution',
$$> **What you''ll learn**: why organisms are well-suited to their environment, and how species change over time.

### What you should be able to do

- Define **adaptive features** and **adaptation**
- Describe hydrophyte and xerophyte adaptations
- Define **natural selection** and describe the process (variation → struggle → competition → reproduction by best adapted)
- Define **evolution**
- Use antibiotic-resistant bacteria as an example of natural selection
- Define and apply **artificial selection**
$$,
   null, 120),

  -- ============================================================================
  -- TOPIC 5: ORGANISMS, ENVIRONMENT & ECOLOGY
  -- ============================================================================
  ('organisms-environment', 'energy-flow-food-webs',
   'Energy Flow, Food Chains & Food Webs',
$$> **What you''ll learn**: how energy from the sun flows through living things, and why food chains rarely have more than 5 links.

### What you should be able to do

- Describe energy flow as heat/light through ecosystems
- Define **producer**, **consumer** (herbivore, carnivore), **decomposer**, **trophic level**
- Construct food chains and food webs
- Identify trophic levels and pyramids of numbers and biomass
- Explain why food chains rarely exceed five levels
- Explain why eating plants is more efficient than eating animals
$$,
   null, 10),

  ('organisms-environment', 'biochemical-cycling',
   'Biochemical Cycling',
$$> **What you''ll learn**: how nitrogen and carbon cycle through the biosphere, and how humans disturb the balance.

### What you should be able to do

- Describe the **nitrogen cycle**: decomposition, nitrification, nitrogen fixation, denitrification
- Describe the **carbon cycle**: photosynthesis, respiration, feeding, decomposition, fossilisation, combustion
- Discuss the effects of fossil-fuel combustion and deforestation on the O₂/CO₂ balance and climate
$$,
   null, 20),

  ('organisms-environment', 'population',
   'Population',
$$> **What you''ll learn**: the sigmoid growth curve, limiting factors, and the implications of human population growth.

### What you should be able to do

- Define **population**, **community**, **ecosystem**
- Identify the phases of a sigmoid growth curve and the role of limiting factors
- Describe human population increase and its environmental implications
- Interpret population graphs
$$,
   null, 30),

  ('organisms-environment', 'food-supply-habitat-pollution',
   'Food Supply, Habitat Destruction & Pollution',
$$> **What you''ll learn**: how human activity damages ecosystems — monoculture, deforestation, pollution and waste.

### What you should be able to do

- Describe impacts of monoculture and intensive livestock farming
- Describe reasons for habitat destruction and effects of deforestation
- Describe sources and effects of water pollution: chemical waste, sewage, fertilisers, **eutrophication**
- Discuss overuse of fertilisers
- Describe causes, effects and reduction of acid rain
- Describe the impact of non-biodegradable plastics
- Explain the role of recycling
$$,
   null, 40),

  ('organisms-environment', 'conservation',
   'Conservation',
$$> **What you''ll learn**: how we protect species and ecosystems for the future, including Namibian case studies like rhino conservation.

### What you should be able to do

- Define **conservation** and **sustainable development**
- Give reasons to conserve non-renewable resources
- Describe sustaining forests and fish stocks (education, quotas, restocking)
- Outline sewage treatment
- Describe reasons species become endangered/extinct
- Describe conservation methods (captive breeding, seed banks, monitoring)
- Discuss advantages and disadvantages of tourism
- Investigate rhino poaching impact on Namibian tourism
$$,
   null, 50)

) as l(topic_slug, slug, title, body_md, lab_slug, sort_order)
on t.topic_slug = l.topic_slug;
