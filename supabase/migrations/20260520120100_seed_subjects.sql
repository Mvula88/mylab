-- ============================================================================
-- Seed: NSSCO + NSSCAS subjects, plus a starter set of Biology topics &
-- lessons that link straight into the existing 3D lab pages.
-- Run AFTER 0001_init_learning_platform.sql.
-- Safe to re-run: uses ON CONFLICT DO NOTHING.
-- ============================================================================

-- ---- NSSCO subjects (Ordinary Level — Grade 10–11) ----------------------
insert into public.subjects (slug, name, curriculum, category, icon, blurb, has_labs, sort_order) values
  ('biology',            'Biology',                       'both',  'science',    'Leaf',           'Life processes, ecology, human biology and Paper 3 practicals.', true,  10),
  ('chemistry',          'Chemistry',                     'both',  'science',    'FlaskConical',   'Atoms, reactions, organic & inorganic chemistry, Annexe B practicals.', true,  20),
  ('physics',            'Physics',                       'both',  'science',    'Atom',           'Mechanics, electricity, waves, modern physics.', true,  30),
  ('mathematics',        'Mathematics',                   'both',  'maths',      'Sigma',          'Algebra, geometry, trigonometry, statistics, calculus.', true,  40),
  ('english',            'English as Second Language',    'nssco', 'languages',  'BookOpen',       'Reading, writing, listening and speaking for NSSCO.', false, 50),
  ('english-first',      'English First Language',        'nsscas','languages',  'BookOpen',       'Advanced reading, writing and literary analysis for NSSCAS.', false, 51),
  ('afrikaans',          'Afrikaans Second Language',     'both',  'languages',  'Languages',      'Afrikaans tweede taal.', false, 60),
  ('geography',          'Geography',                     'both',  'humanities', 'Globe',          'Physical and human geography, fieldwork techniques.', true,  70),
  ('history',            'History',                       'both',  'humanities', 'Landmark',       'Namibian, African and world history.', false, 80),
  ('development-studies','Development Studies',           'both',  'humanities', 'TrendingUp',     'Development, governance, citizenship and economic issues.', false, 90),
  ('religious-studies',  'Religious & Moral Education',   'nssco', 'humanities', 'BookHeart',      'World religions, ethics and moral reasoning.', false, 95),
  ('accounting',         'Accounting',                    'both',  'commerce',   'Calculator',     'Financial accounting principles, books of original entry, final accounts.', false, 100),
  ('economics',          'Economics',                     'both',  'commerce',   'BarChart3',      'Micro and macroeconomics, Namibian economy.', false, 110),
  ('business-studies',   'Business Studies',              'nssco', 'commerce',   'Briefcase',      'Business environment, marketing, finance and operations.', false, 120),
  ('computer-studies',   'Computer Studies',              'both',  'practical',  'Monitor',        'ICT fundamentals, applications, programming basics.', false, 130),
  ('agriculture',        'Agriculture',                   'nssco', 'practical',  'Sprout',         'Crop and animal husbandry, soil science, agricultural economics.', false, 140),
  ('design-technology',  'Design & Technology',           'nssco', 'practical',  'Wrench',         'Designing, making and evaluating products.', false, 150),
  ('home-ecology',       'Home Ecology',                  'nssco', 'practical',  'Home',           'Nutrition, textiles, family and resource management.', false, 160),
  ('art',                'Art',                           'nssco', 'practical',  'Palette',        'Studio art, drawing, painting, design.', false, 170),
  ('physical-education', 'Physical Education',            'nssco', 'practical',  'Activity',       'Theory and practice of sport, fitness and health.', false, 180),
  ('life-skills',        'Life Skills',                   'nssco', 'humanities', 'HeartHandshake', 'Personal development, careers, civics.', false, 190)
on conflict (slug) do nothing;

-- ---- Biology topics ------------------------------------------------------
with bio as (select id from public.subjects where slug = 'biology')
insert into public.topics (subject_id, slug, title, blurb, sort_order)
select bio.id, t.slug, t.title, t.blurb, t.sort_order from bio,
  (values
    ('cells-microscopy',     'Cells & Microscopy',                'Plant and animal cells, organelles, mitosis.', 10),
    ('food-nutrition',       'Food & Nutrition',                  'Testing for biological molecules and energy content.', 20),
    ('enzymes',              'Enzymes',                           'How temperature, pH and substrate affect enzyme activity.', 30),
    ('photosynthesis',       'Photosynthesis',                    'Light, chlorophyll, CO₂ and the starch test.', 40),
    ('respiration',          'Respiration',                       'Aerobic and anaerobic respiration; respirometry.', 50),
    ('transport-plants',     'Transport in Plants',               'Xylem, phloem, transpiration, potometer.', 60),
    ('diffusion-osmosis',    'Diffusion, Osmosis & Active Transport', 'Surface-area-to-volume; potato osmosis; agar diffusion.', 70),
    ('inheritance-variation','Inheritance & Variation',           'Monohybrid crosses, continuous vs discontinuous variation.', 80)
  ) as t(slug, title, blurb, sort_order)
on conflict (subject_id, slug) do nothing;

-- ---- Biology lessons linked to existing 3D lab pages --------------------
-- Each lesson has a `lab_slug` that maps to an existing /<lab_slug> page.
-- body_md is intentionally short — admin can fill in via Stage 2 dashboard.
with t as (
  select tp.id as topic_id, tp.slug as topic_slug
  from public.topics tp
  join public.subjects s on s.id = tp.subject_id
  where s.slug = 'biology'
)
insert into public.lessons (topic_id, slug, title, body_md, lab_slug, is_published, sort_order)
select t.topic_id, l.slug, l.title, l.body_md, l.lab_slug, true, l.sort_order
from t join (values
  -- cells-microscopy
  ('cells-microscopy',  'animal-vs-plant-cells', 'Animal vs Plant Cells',
   'Compare animal and plant cells under the microscope. Use the interactive microscope to identify the nucleus, cell wall, chloroplasts and vacuole.',
   'microscopy-cells', 10),
  ('cells-microscopy',  'mitosis-onion',         'Mitosis in Onion Root Tip',
   'Identify the stages of mitosis (prophase, metaphase, anaphase, telophase) in a stained onion root tip.',
   'mitosis', 20),

  -- food-nutrition
  ('food-nutrition',    'food-tests',            'Testing for Biological Molecules',
   'Iodine for starch, Benedict''s for reducing sugars, Biuret for protein, ethanol emulsion for lipids. Match observation to mark scheme exactly.',
   'food-tests', 10),
  ('food-nutrition',    'nutrients-real-foods',  'Nutrients in Real Foods',
   'Apply all four food tests to six real foods. Predict the nutrient profile of each.',
   'nutrients-in-foods', 20),
  ('food-nutrition',    'food-energy',           'Energy Content of Food',
   'Burn a peanut under water and calculate kJ per gram using q = mcΔT.',
   'food-energy', 30),

  -- enzymes
  ('enzymes',           'enzyme-temperature',    'Effect of Temperature on Amylase',
   'Vary temperature across five water baths. Find the optimum and the denaturation point.',
   'enzyme-temperature', 10),
  ('enzymes',           'enzyme-ph',             'Effect of pH on Amylase',
   'Five buffered pH values. The optimum is around pH 7 for amylase.',
   'enzyme-ph', 20),
  ('enzymes',           'enzyme-substrate',      'Effect of Substrate Concentration on Catalase',
   'Vary H₂O₂ concentration and measure rate of O₂ release.',
   'enzyme-substrate', 30),

  -- photosynthesis
  ('photosynthesis',    'leaf-starch-test',      'Starch Test in a Leaf',
   'Boil, decolourise, stain. Variegated, foil-covered and dark-kept leaves.',
   'photosynthesis', 10),
  ('photosynthesis',    'elodea-bubbles',        'Pondweed Bubble Counter (Elodea)',
   'Count O₂ bubbles released by Elodea under different light intensities.',
   'elodea', 20),
  ('photosynthesis',    'co2-need',              'Need for CO₂',
   'Compare bagged leaves with soda lime, sodium bicarbonate, and a water control.',
   'co2', 30),

  -- respiration
  ('respiration',       'limewater-exhaled',     'Inhaled vs Exhaled Air',
   'Use the U-tube limewater apparatus to compare CO₂ in inhaled vs exhaled air.',
   'limewater-exhaled', 10),
  ('respiration',       'germinating-seeds',     'Heat from Germinating Seeds',
   'Live vs dead seeds in vacuum flasks. Live flask warms — evidence that respiration releases heat.',
   'germinating-seeds', 20),

  -- transport-plants
  ('transport-plants',  'celery-xylem',          'Stained Celery: Xylem Transport',
   'Stain water with food colouring and watch it travel up celery xylem vessels.',
   'celery-xylem', 10),

  -- diffusion-osmosis
  ('diffusion-osmosis', 'osmosis-potato',        'Osmosis with Potato Cylinders',
   'Mass change of potato cylinders in different sucrose concentrations.',
   'osmosis-potato', 10),
  ('diffusion-osmosis', 'diffusion-agar',        'Diffusion into Agar Cubes',
   'Surface-area-to-volume ratio: smaller cubes are coloured all the way through faster.',
   'diffusion-agar', 20),

  -- inheritance-variation
  ('inheritance-variation', 'monohybrid-cross',  'Monohybrid Cross Simulation',
   'Predict and check phenotype ratios in a monohybrid cross.',
   'monohybrid', 10)
) as l(topic_slug, slug, title, body_md, lab_slug, sort_order)
on t.topic_slug = l.topic_slug
on conflict (topic_id, slug) do nothing;
