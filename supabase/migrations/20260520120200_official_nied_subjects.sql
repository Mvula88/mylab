-- ============================================================================
-- Replace seeded subject list with the OFFICIAL NIED promotional subjects.
-- Source: NIED syllabus index + Structure of Basic Education document.
-- NON-promotional subjects (Life Skills, PE, ICT-literacy, RME) are excluded.
-- Run AFTER 0001 and 0002. Safe to re-run.
-- ============================================================================

-- 1. Remove old/incorrect/non-promotional subjects AND subjects the platform
--    owner has chosen not to offer (all languages except English Second
--    Language; Art and Design). CASCADE removes any attached topics/lessons.
delete from public.subjects where slug in (
  -- prior-seed cleanups
  'religious-studies',     -- ends at Grade 9, not in NSSCO
  'physical-education',    -- non-promotional
  'life-skills',           -- non-promotional
  'english',               -- replaced by english-second-language
  'english-first',         -- replaced by english-second-language (kept only SL)
  'afrikaans',             -- replaced by english-second-language (kept only SL)
  'art',                   -- replaced by nothing (Arts removed)
  'home-ecology',          -- replaced by home-economics
  'agriculture',           -- replaced by agricultural-science
  -- platform-owner exclusions: keep ONLY English Second Language among languages
  'english-first-language',
  'afrikaans-first-language',
  'afrikaans-second-language',
  'oshindonga',
  'oshikwanyama',
  'otjiherero',
  'rukwangali',
  'rumanyo',
  'silozi',
  'setswana',
  'thimbukushu',
  'khoekhoegowab',
  'juhoansi',
  'german-first-language',
  'german-second-language',
  'portuguese',
  -- platform-owner exclusion: no Arts subjects
  'art-design'
);

-- 2. Upsert the official NIED promotional subject list.
insert into public.subjects (slug, name, curriculum, category, icon, blurb, has_labs, sort_order) values

  -- LANGUAGES ---------------------------------------------------------------
  ('english-second-language',  'English Second Language',         'both',  'languages', 'BookOpen',   'Reading, writing, listening and speaking. The compulsory English route for most learners.', false, 10),

  -- MATHEMATICS -------------------------------------------------------------
  ('mathematics',              'Mathematics',                     'both',  'maths',     'Sigma',      'Algebra, geometry, trigonometry, statistics and (at higher tiers) calculus.', true, 100),

  -- SCIENCES ----------------------------------------------------------------
  ('biology',                  'Biology',                         'both',  'science',   'Leaf',           'Life processes, ecology, human biology and Paper 3 practicals.', true, 110),
  ('chemistry',                'Chemistry',                       'both',  'science',   'FlaskConical',   'Atoms, reactions, organic & inorganic chemistry, Annexe B practicals.', true, 120),
  ('physics',                  'Physics',                         'both',  'science',   'Atom',           'Mechanics, electricity, waves, modern physics.', true, 130),
  ('agricultural-science',     'Agricultural Science',            'both',  'science',   'Sprout',         'Crop and animal husbandry, soil science, agricultural economics.', false, 140),
  ('physical-science',         'Physical Science',                'nssco', 'science',   'Atom',           'Combined Physics + Chemistry at NSSCO Ordinary tier. NSSCO only.', true, 150),

  -- HUMANITIES --------------------------------------------------------------
  ('geography',                'Geography',                       'both',  'humanities','Globe',          'Physical and human geography, fieldwork techniques.', true, 200),
  ('history',                  'History',                         'both',  'humanities','Landmark',       'Namibian, African and world history.', false, 210),
  ('development-studies',      'Development Studies',             'nssco', 'humanities','TrendingUp',     'Development, governance, citizenship and economic issues. NSSCO only.', false, 220),

  -- COMMERCE ----------------------------------------------------------------
  ('accounting',               'Accounting',                      'both',  'commerce',  'Calculator',     'Financial accounting principles, books of original entry, final accounts.', false, 300),
  ('economics',                'Economics',                       'both',  'commerce',  'BarChart3',      'Micro and macroeconomics, Namibian economy.', false, 310),
  ('business-studies',         'Business Studies',                'both',  'commerce',  'Briefcase',      'Business environment, marketing, finance and operations.', false, 320),
  ('entrepreneurship',         'Entrepreneurship',                'nssco', 'commerce',  'Rocket',         'Starting and running a business, opportunity recognition. NSSCO only.', false, 330),

  -- ICT ---------------------------------------------------------------------
  ('computer-studies',         'Computer Studies',                'nssco', 'ict',       'Monitor',        'NSSCO ICT applications, productivity software, intro programming.', false, 400),
  ('computer-science',         'Computer Science',                'nsscas','ict',       'Code2',          'NSSCAS algorithms, programming, data representation.', false, 410),

  -- PRACTICAL ---------------------------------------------------------------
  ('design-technology',        'Design and Technology',           'both',  'practical', 'Wrench',         'Designing, making and evaluating products.', false, 500),
  ('home-economics',           'Home Economics (Food & Nutrition)', 'nssco','practical', 'Home',           'Nutrition, textiles, family and resource management. NSSCO only.', false, 510),
  ('fashion-fabrics',          'Fashion and Fabrics',             'nssco', 'practical', 'Scissors',       'Garment construction, textile design. NSSCO only.', false, 520)

on conflict (slug) do update set
  name        = excluded.name,
  curriculum  = excluded.curriculum,
  category    = excluded.category,
  icon        = excluded.icon,
  blurb       = excluded.blurb,
  has_labs    = excluded.has_labs,
  sort_order  = excluded.sort_order;
