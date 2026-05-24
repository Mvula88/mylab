-- ===========================================================================
-- NSSCO English as a Second Language 2024 Paper 2 (6109/2) — Listening
-- 40 marks total. Five tasks (audio-driven — see paper PDF for full prompts).
--   Task 1 (8)  — Four short recordings, 2 questions each (a-b)        fill_in
--   Task 2 (8)  — Gap-fill: "A delivery service" — 8 blanks (a-h)      fill_in
--   Task 3 (6)  — Multiple-matching 6 speakers to opinions A-G         mcq
--   Task 4 (8)  — MCQ: interview with Helvi, radio presenter           mcq
--   Task 5 (10) — Short answer: interview with Kelvin about a walk     fill_in
--
-- IMPORTANT — this is a LISTENING paper. The audio is not yet hosted on the
-- platform. Until audio is uploaded, these questions function as a TRANSCRIPT-
-- LESS reference: the learner cannot hear the recording, so the questions
-- are presented as "what would the answer be IF the audio said X" — students
-- using this for revision should consult a teacher or the audio file.
-- Answer keys + commentary from DNEA Examiners Report 2024 (pages 197-200).
-- ===========================================================================

do $$
declare
  esl_id uuid;
begin
  select id into esl_id from public.subjects where slug = 'english-second-language' limit 1;
  if esl_id is null then raise notice 'English Second Language subject not found'; return; end if;

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ TASK 1 — Four short recordings, 2 sub-parts each (8 × 1 mark)       ║
  -- ║ "No more than three words, or a number"                             ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  -- Q1(a)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '1a', 1, 'free',
    'fill_in',
    E'**Task 1 — Four short recordings**\n*(Audio not yet hosted — answer assumes you have heard the recording. Write no more than three words, or a number.)*\n\n**1. (a)** What time will Martha''s parcel be delivered?',
    jsonb_build_object('accepted', jsonb_build_array('4:30','16:30','four thirty','four-thirty','4.30','16.30','half past four','half-past four')),
    E'Correct response: **4:30 / four thirty** [1 mark]. Exceptionally well answered. Marks lost for: repeating details ("16:30 in the afternoon", "16:30pm"); writing 04:30 (= morning); misspelling the words.',
    E'Write the time clearly. Either 12-hour ("4:30" / "four thirty") or 24-hour ("16:30") format scores. Don''t combine them.',
    true
  );

  -- Q1(b)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '1b', 1, 'free',
    'fill_in',
    E'**1. (b)** How much will Martha be charged for the courier service?',
    jsonb_build_object('accepted', jsonb_build_array('N$150','N$150.00','N$ 150','N$ 150.00','one hundred and fifty Namibia dollars','one hundred and fifty Namibian dollars')),
    E'Correct response: **N$150.00 / One hundred and fifty Namibia dollars** [1 mark]. Marks lost for: repeating "N$150.00 Namibia dollars"; just "150 dollars" without specifying currency; "$150 US currency"; misspelling words.',
    E'Write the figure with the currency symbol (N$150) OR the amount in words including the currency (one hundred and fifty Namibia dollars). Don''t double up.',
    true
  );

  -- Q2(a)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '2a', 1, 'free',
    'fill_in',
    E'**2. (a)** When will the new teacher start?',
    jsonb_build_object('accepted', jsonb_build_array('next week')),
    E'Correct response: **next week** [1 mark]. Marks lost for "tomorrow"; "next weeks" (plural changes meaning); misspellings ("nex week", "weak"); extra info ("until next week", "delayed until next week", "next week until the mid-term break").',
    E'The exact phrase **next week** scores. Don''t add filler.',
    true
  );

  -- Q2(b)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '2b', 1, 'free',
    'fill_in',
    E'**2. (b)** Where is the farewell party going to be held?',
    jsonb_build_object('accepted', jsonb_build_array('school hall','the school hall','in the school hall')),
    E'Correct response: **(school) hall** [1 mark]. Misspellings "school wall", "school hole", "school holle", "school whole" not credited. Distractor "school garden" was wrong.',
    E'**School hall** — both words required, both spelt correctly.',
    true
  );

  -- Q3(a)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '3a', 1, 'free',
    'fill_in',
    E'**3. (a)** Which item will the girl''s group sell?',
    jsonb_build_object('accepted', jsonb_build_array('banana bread')),
    E'Correct response: **banana bread** [1 mark]. Distractors "coconut biscuits" / "doughnuts" were wrong. Misspellings ("bannanna", "benana") not credited.',
    E'Listen carefully to the noun the speakers commit to (banana bread), not the distractors they discuss.',
    true
  );

  -- Q3(b)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '3b', 1, 'free',
    'fill_in',
    E'**3. (b)** What will the funds be used for?',
    jsonb_build_object('accepted', jsonb_build_array('buy books','to buy books','buying books')),
    E'Correct response: **(to) buy books** [1 mark]. "Buy textbooks" or just "books" lost the mark. "By"/"bye" instead of "buy" not credited.',
    E'The verb "buy" is essential — funds will be used **to buy books**.',
    true
  );

  -- Q4(a)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '4a', 1, 'free',
    'fill_in',
    E'**4. (a)** Who are the intended participants?',
    jsonb_build_object('accepted', jsonb_build_array('teenagers')),
    E'Correct response: **teenagers** [1 mark]. Misspellings ("teenangers", "teaneger", "teenages", "tinenger") not credited. "Former teenagers" or wrong prepositions ("to teenagers", "on teenagers") also failed.',
    E'Just the noun **teenagers** — no preposition, no qualifier.',
    true
  );

  -- Q4(b)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '4b', 1, 'free',
    'fill_in',
    E'**4. (b)** What will the workshop focus on?',
    jsonb_build_object('accepted', jsonb_build_array('voluntary services')),
    E'Correct response: **voluntary services** [1 mark]. Low success rate — both words required and spelt correctly. Wrong: "volonteer", "involuntary", "services to the voluntary", "cultural voluntary services". Misspellings of "services" ("servises", "serveces") also failed.',
    E'**Voluntary services** — two words, both required, both spelt correctly.',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ TASK 2 — "A delivery service" gap-fill (8 × 1 mark)                 ║
  -- ║ One or two words, or a number, in each gap                          ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  -- Q5 (a) innovation
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '5a', 1, 'free',
    'fill_in',
    E'**Task 2: "A delivery service"** — Listen and complete the notes (one or two words, or a number, per gap).\n\n**(a)** Noah''s delivery company stands out because its focus is on ____________.',
    jsonb_build_object('accepted', jsonb_build_array('innovation')),
    E'Correct response: **innovation** [1 mark]. Misspellings ("inovetion", "enovation") and additions ("more innovation") not credited.',
    E'Single word — **innovation**. Spell carefully: i-n-n-o-v-a-t-i-o-n.',
    true
  );

  -- Q5 (b) values
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '5b', 1, 'free',
    'fill_in',
    E'**(b)** When initially planning his business, Noah decided ____________ were essential to consider.',
    jsonb_build_object('accepted', jsonb_build_array('values')),
    E'Correct response: **values** [1 mark]. Few got it. Adding "this/that/his" or an adjective ("more value") changed the meaning and lost the mark.',
    E'Just the noun **values** (plural, no determiner or adjective).',
    true
  );

  -- Q5 (c) working overtime
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '5c', 1, 'free',
    'fill_in',
    E'**(c)** As well as having a tight budget, he was able to save the funds he needed to start his business by ____________.',
    jsonb_build_object('accepted', jsonb_build_array('working overtime')),
    E'Correct response: **working overtime** [1 mark]. Just "overtime", "work" or "work overtime" did NOT score — the gerund form (-ing) is required because it follows "by".',
    E'After "by + verb", we need a gerund — **working overtime**. Both words required.',
    true
  );

  -- Q5 (d) data
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '5d', 1, 'free',
    'fill_in',
    E'**(d)** He believes that the use of ____________ is a good way to create new opportunities.',
    jsonb_build_object('accepted', jsonb_build_array('data','reliable data')),
    E'Correct response: **data** [1 mark]. Adding "reliable" (not in audio) lost the mark.',
    E'Single word — **data**. Don''t add adjectives unless you heard them.',
    true
  );

  -- Q5 (e) online visibility
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '5e', 1, 'free',
    'fill_in',
    E'**(e)** ____________ is most vital in supporting business growth.',
    jsonb_build_object('must_contain', jsonb_build_array('online','visibility')),
    E'Correct response: **Online visibility** [1 mark]. Most candidates failed — many only wrote "online". Misspelling "visibility" as "possibility", "visibilitie", "visability" or plural "visibilities" was not credited.',
    E'**Both words** required — **online visibility**. The blank is followed by "is most vital" → singular noun phrase.',
    true
  );

  -- Q5 (f) trends
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '5f', 1, 'free',
    'fill_in',
    E'**(f)** Apart from ordering food, business owners can also gain an understanding of ____________ related to consumer behaviour.',
    jsonb_build_object('accepted', jsonb_build_array('trends','trend','the trends')),
    E'Correct response: **trend(s)** [1 mark]. Misspellings "trand", "trans", "trades" failed. Adding "new" or "learn about" also lost the mark.',
    E'Single noun — **trend** or **trends**. Either form scores.',
    true
  );

  -- Q5 (g) 320 000
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '5g', 1, 'free',
    'fill_in',
    E'**(g)** The food delivery platform currently has about ____________ customers.',
    jsonb_build_object('accepted', jsonb_build_array('320 000','320,000','320000','three hundred and twenty thousand')),
    E'Correct response: **320 000** [1 mark]. Common errors: "3200" (dropped a zero), "32 000" (dropped a zero), "420 000" (the distractor).',
    E'Listen carefully to the zeros — **320 000**. Three hundred and twenty thousand. Write with a space or comma between groups of three digits if you''re writing the figure.',
    true
  );

  -- Q5 (h) coast
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '5h', 1, 'free',
    'fill_in',
    E'**(h)** He hopes to take the business to the ____________ next.',
    jsonb_build_object('accepted', jsonb_build_array('coast','the coast')),
    E'Correct response: **coast** [1 mark]. Confusing "coast" with "cost" changed the meaning; "coastal" (adjective) was not credited.',
    E'**Coast** — the noun (the shore). Don''t confuse with "cost" (price) or "coastal" (adjective).',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ TASK 3 — Six speakers → opinions A-G (6 × 1 mark)                   ║
  -- ║ Each speaker uses ONE letter; G is the extra (unused) option.       ║
  -- ║ Modelled as MCQ with all 7 options shown.                           ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  -- Speaker 1
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '6a', 1, 'free',
    'mcq',
    E'**Task 3 — Six speakers on preparing for important events.** For each speaker, choose the opinion they express. Each letter is used ONCE; one letter is left over.\n\n**Speaker 1** — Which opinion does this speaker express?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','I was determined to work hard.'),
      jsonb_build_object('id','B','text','I overcame my fear of failure.'),
      jsonb_build_object('id','C','text','I felt overwhelmed by the workload.'),
      jsonb_build_object('id','D','text','I could not be persuaded to do things differently.'),
      jsonb_build_object('id','E','text','I learned something new about myself.'),
      jsonb_build_object('id','F','text','I needed a lot of encouragement from others.'),
      jsonb_build_object('id','G','text','I think others were amused by my efforts.')
    ),
    to_jsonb('G'::text),
    E'**G** [1 mark]. Speaker 1 → G.',
    E'Match the speaker''s overall message to a single opinion. Speaker 1 emphasises that others found their efforts amusing.',
    true
  );

  -- Speaker 2
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '6b', 1, 'free',
    'mcq',
    E'**Speaker 2** — Which opinion does this speaker express?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','I was determined to work hard.'),
      jsonb_build_object('id','B','text','I overcame my fear of failure.'),
      jsonb_build_object('id','C','text','I felt overwhelmed by the workload.'),
      jsonb_build_object('id','D','text','I could not be persuaded to do things differently.'),
      jsonb_build_object('id','E','text','I learned something new about myself.'),
      jsonb_build_object('id','F','text','I needed a lot of encouragement from others.'),
      jsonb_build_object('id','G','text','I think others were amused by my efforts.')
    ),
    to_jsonb('D'::text),
    E'**D** [1 mark]. Speaker 2 → D.',
    E'Speaker 2 sticks firmly to their own method despite suggestions from others.',
    true
  );

  -- Speaker 3
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '6c', 1, 'free',
    'mcq',
    E'**Speaker 3** — Which opinion does this speaker express?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','I was determined to work hard.'),
      jsonb_build_object('id','B','text','I overcame my fear of failure.'),
      jsonb_build_object('id','C','text','I felt overwhelmed by the workload.'),
      jsonb_build_object('id','D','text','I could not be persuaded to do things differently.'),
      jsonb_build_object('id','E','text','I learned something new about myself.'),
      jsonb_build_object('id','F','text','I needed a lot of encouragement from others.'),
      jsonb_build_object('id','G','text','I think others were amused by my efforts.')
    ),
    to_jsonb('A'::text),
    E'**A** [1 mark]. Speaker 3 → A.',
    E'Speaker 3 commits to working hard as their main idea.',
    true
  );

  -- Speaker 4
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '6d', 1, 'free',
    'mcq',
    E'**Speaker 4** — Which opinion does this speaker express?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','I was determined to work hard.'),
      jsonb_build_object('id','B','text','I overcame my fear of failure.'),
      jsonb_build_object('id','C','text','I felt overwhelmed by the workload.'),
      jsonb_build_object('id','D','text','I could not be persuaded to do things differently.'),
      jsonb_build_object('id','E','text','I learned something new about myself.'),
      jsonb_build_object('id','F','text','I needed a lot of encouragement from others.'),
      jsonb_build_object('id','G','text','I think others were amused by my efforts.')
    ),
    to_jsonb('C'::text),
    E'**C** [1 mark]. Speaker 4 → C.',
    E'Speaker 4 mentions feeling crushed by the amount of work.',
    true
  );

  -- Speaker 5
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '6e', 1, 'free',
    'mcq',
    E'**Speaker 5** — Which opinion does this speaker express?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','I was determined to work hard.'),
      jsonb_build_object('id','B','text','I overcame my fear of failure.'),
      jsonb_build_object('id','C','text','I felt overwhelmed by the workload.'),
      jsonb_build_object('id','D','text','I could not be persuaded to do things differently.'),
      jsonb_build_object('id','E','text','I learned something new about myself.'),
      jsonb_build_object('id','F','text','I needed a lot of encouragement from others.'),
      jsonb_build_object('id','G','text','I think others were amused by my efforts.')
    ),
    to_jsonb('E'::text),
    E'**E** [1 mark]. Speaker 5 → E.',
    E'Speaker 5 made a personal discovery during the preparation.',
    true
  );

  -- Speaker 6
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '6f', 1, 'free',
    'mcq',
    E'**Speaker 6** — Which opinion does this speaker express?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','I was determined to work hard.'),
      jsonb_build_object('id','B','text','I overcame my fear of failure.'),
      jsonb_build_object('id','C','text','I felt overwhelmed by the workload.'),
      jsonb_build_object('id','D','text','I could not be persuaded to do things differently.'),
      jsonb_build_object('id','E','text','I learned something new about myself.'),
      jsonb_build_object('id','F','text','I needed a lot of encouragement from others.'),
      jsonb_build_object('id','G','text','I think others were amused by my efforts.')
    ),
    to_jsonb('B'::text),
    E'**B** [1 mark]. Speaker 6 → B. (Letter F is the extra — left unused.)',
    E'Speaker 6 talks about defeating their fear of failure.',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ TASK 4 — Helvi the radio presenter, 8 MCQs (8 × 1 mark)             ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  -- Q4.1
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '7a', 1, 'free',
    'mcq',
    E'**Task 4 — Interview with Helvi, a radio presenter.** Tick (✓) the correct answer.\n\n**(1)** What helped Helvi in deciding on her career choice?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','input from co-workers'),
      jsonb_build_object('id','B','text','what she learnt on her degree course'),
      jsonb_build_object('id','C','text','her supervisor''s encouragement'),
      jsonb_build_object('id','D','text','varied practical experience')
    ),
    to_jsonb('D'::text),
    E'**D — varied practical experience** [1 mark].',
    E'Helvi credits the variety of hands-on experience for guiding her career choice.',
    true
  );

  -- Q4.2
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '7b', 1, 'free',
    'mcq',
    E'**(2)** While growing up, Helvi wanted to become a ...',
    jsonb_build_array(
      jsonb_build_object('id','A','text','celebrity.'),
      jsonb_build_object('id','B','text','lawyer.'),
      jsonb_build_object('id','C','text','presenter.'),
      jsonb_build_object('id','D','text','psychologist.')
    ),
    to_jsonb('D'::text),
    E'**D — psychologist** [1 mark].',
    E'As a child she wanted to be a psychologist; she only later moved into presenting.',
    true
  );

  -- Q4.3
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '7c', 1, 'free',
    'mcq',
    E'**(3)** Helvi likes her job so much because she finds it ...',
    jsonb_build_array(
      jsonb_build_object('id','A','text','rewarding.'),
      jsonb_build_object('id','B','text','engaging.'),
      jsonb_build_object('id','C','text','relaxing.'),
      jsonb_build_object('id','D','text','sociable.')
    ),
    to_jsonb('A'::text),
    E'**A — rewarding** [1 mark].',
    E'She says the job gives her a sense of reward — being on air and connecting with listeners.',
    true
  );

  -- Q4.4
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '7d', 1, 'free',
    'mcq',
    E'**(4)** Helvi realised she was a good presenter when she ...',
    jsonb_build_array(
      jsonb_build_object('id','A','text','advanced in her job.'),
      jsonb_build_object('id','B','text','got nominated for an award.'),
      jsonb_build_object('id','C','text','was given positive feedback from loved ones.'),
      jsonb_build_object('id','D','text','received an invitation for an overseas course.')
    ),
    to_jsonb('D'::text),
    E'**D** [1 mark].',
    E'The invitation to an overseas training course was the moment that confirmed her ability.',
    true
  );

  -- Q4.5
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '7e', 1, 'free',
    'mcq',
    E'**(5)** Helvi gets her new content material from ...',
    jsonb_build_array(
      jsonb_build_object('id','A','text','friends.'),
      jsonb_build_object('id','B','text','real life.'),
      jsonb_build_object('id','C','text','written materials.'),
      jsonb_build_object('id','D','text','broadcasting channels.')
    ),
    to_jsonb('B'::text),
    E'**B — real life** [1 mark].',
    E'Helvi says everyday life gives her the topics — she observes situations around her.',
    true
  );

  -- Q4.6
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '7f', 1, 'free',
    'mcq',
    E'**(6)** Helvi says her working hours ...',
    jsonb_build_array(
      jsonb_build_object('id','A','text','are very tiring.'),
      jsonb_build_object('id','B','text','change from time to time.'),
      jsonb_build_object('id','C','text','include volunteer work.'),
      jsonb_build_object('id','D','text','offer no leisure.')
    ),
    to_jsonb('A'::text),
    E'**A — are very tiring** [1 mark].',
    E'She talks about the demanding nature of the schedule.',
    true
  );

  -- Q4.7
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '7g', 1, 'free',
    'mcq',
    E'**(7)** What does Helvi enjoy most during her time off?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','carrying out housework'),
      jsonb_build_object('id','B','text','socialising with loved ones'),
      jsonb_build_object('id','C','text','spending time outdoors'),
      jsonb_build_object('id','D','text','going away somewhere')
    ),
    to_jsonb('C'::text),
    E'**C — spending time outdoors** [1 mark].',
    E'Her favourite leisure activity is being outside.',
    true
  );

  -- Q4.8
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '7h', 1, 'free',
    'mcq',
    E'**(8)** What does Helvi believe is essential to becoming a good presenter?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','planning your finances'),
      jsonb_build_object('id','B','text','having passion for the job'),
      jsonb_build_object('id','C','text','organising your schedule'),
      jsonb_build_object('id','D','text','building contacts with others')
    ),
    to_jsonb('B'::text),
    E'**B — having passion for the job** [1 mark].',
    E'Helvi believes passion is the foundation of a good presenter.',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ TASK 5 — Kelvin''s walk, short answers (10 marks)                    ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  -- Q5(a)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '8a', 1, 'free',
    'fill_in',
    E'**Task 5 — Interview with Kelvin about a walk.**\n\n**(a)** What was the main reason for Kelvin to do the walk?',
    jsonb_build_object('accepted', jsonb_build_array('surroundings','my surroundings','his surroundings','the surroundings')),
    E'Correct response: **(my/his) surroundings** [1 mark]. Misspellings ("sarrounding", "sorondings", "sorrounding", "surronding") not credited.',
    E'**Surroundings** — the environment / landscape he wanted to experience.',
    true
  );

  -- Q5(b)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '8b', 1, 'free',
    'fill_in',
    E'**(b)** Which factor contributed to the success of the walk?',
    jsonb_build_object('accepted', jsonb_build_array('team effort')),
    E'Correct response: **team effort** [1 mark]. Poorly answered. Variants that changed the meaning were NOT credited: "team work", "teams effort", "parents input or effort", "help from parents", "family input", "team effort from people".',
    E'**Team effort** — exactly. Don''t substitute synonyms; the exam wants the words from the audio.',
    true
  );

  -- Q5(c)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '8c', 1, 'free',
    'fill_in',
    E'**(c)** What was the most important item Kelvin took along?',
    jsonb_build_object('accepted', jsonb_build_array('sun protection')),
    E'Correct response: **sun protection** [1 mark]. Misspellings that changed the meaning ("suns protection", "son protection", "sunny protection", "sun protaction", "sum protection") were not credited.',
    E'**Sun protection** — both words, both spelt correctly.',
    true
  );

  -- Q5(d)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '8d', 1, 'free',
    'fill_in',
    E'**(d)** How long was Kelvin''s final leg of the walk to reach his destination?',
    jsonb_build_object('accepted', jsonb_build_array('15 km','15km','15 kilometres','15 kilometers','fifteen kilometres','fifteen km')),
    E'Correct response: **15 km** [1 mark]. Misspellings of "kilometres" or extra distracting details lost the mark.',
    E'**15 km** — number + unit. Either the abbreviation (km) or the full word (kilometres) is accepted.',
    true
  );

  -- Q5(e)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '8e', 1, 'free',
    'fill_in',
    E'**(e)** Why did Kelvin choose to walk barefoot?',
    jsonb_build_object('must_contain', jsonb_build_array('challenge')),
    E'Correct response: **to add (something extra) to the challenge** [1 mark]. Misspellings of "challenge" ("challange") or incomplete answers lost the mark.',
    E'The keyword is **challenge** — Kelvin wanted to make the walk harder/more challenging.',
    true
  );

  -- Q5(f)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '8f', 1, 'free',
    'fill_in',
    E'**(f)** What did Kelvin say had been his biggest challenge during the walk?',
    jsonb_build_object('accepted', jsonb_build_array('cold nights','the cold nights')),
    E'Correct response: **cold nights** [1 mark]. Variants that changed the meaning ("colds night", "could night", "coldness night", "colder night") were not credited.',
    E'**Cold nights** — adjective + plural noun, in that order.',
    true
  );

  -- Q5(g)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '8g', 1, 'free',
    'fill_in',
    E'**(g)** What did Kelvin find most memorable during his journey?',
    jsonb_build_object('must_contain', jsonb_build_array('original','family','house')),
    E'Correct response: **sleeping in the original family house** [1 mark]. Poorly answered. "Origin" instead of "original" lost the mark; leaving out "family" or "house" made the answer incomplete; switching the adjective order lost marks.',
    E'**Sleeping in the original family house** — all three keywords (original, family, house) and the adjective order matter.',
    true
  );

  -- Q5(h)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '8h', 1, 'free',
    'fill_in',
    E'**(h)** How did Kelvin feel after discovering that the route he chose was the original wagon trail?',
    jsonb_build_object('accepted', jsonb_build_array('proud','he felt proud','very proud')),
    E'Correct response: **proud** [1 mark]. Misspellings ("pround", "ploud", "proude") or adding "more" failed.',
    E'A single feeling word — **proud**.',
    true
  );

  -- Q5(i)(i)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '8i', 1, 'free',
    'fill_in',
    E'**(i)** What does Kelvin wish to gain from the Quest Africa programme? Give **two** details.\n\n**(i)** First detail',
    jsonb_build_object('accepted', jsonb_build_array('practical skills','lifelong friendships')),
    E'Correct response (either detail accepted in either box): **practical skills** OR **lifelong friendships** [1 mark]. The two details may be given in any order.',
    E'**Practical skills** — both words required. Misspellings ("particles", "pratical", "pactical") or just "practical" without "skills" lost the mark.',
    true
  );

  -- Q5(i)(ii)
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '2', '8j', 1, 'free',
    'fill_in',
    E'**(ii)** Second detail',
    jsonb_build_object('accepted', jsonb_build_array('lifelong friendships','practical skills')),
    E'Correct response (either detail accepted in either box): **lifelong friendships** OR **practical skills** [1 mark]. Adding extra words ("making lifelong friendships", "provide lifelong friendships", "to find lifelong friendships", "longlife friends") failed.',
    E'**Lifelong friendships** — exact phrase. The order of the two details (i) and (ii) doesn''t matter.',
    true
  );

end $$;
