-- ===========================================================================
-- NSSCO English as a Second Language 2024 Paper 1 (6109/1) — Reading and Writing
-- 70 marks total. Six tasks:
--   Task 1  (10) — Reading comp. short answer ("Hondeklip Bay")        fill_in
--   Task 2  (9)  — Multiple-matching A-D ("4 students study routine") mcq
--   Task 3  (8)  — Note-making (orbisculate) — 3 headings              free_text
--   Task 4  (8)  — Multiple-choice A-D ("Binge-watching")              mcq
--   Task 5  (15) — Guided report writing                                essay
--   Task 6  (20) — Extended essay (3 topics, choose 1)                  essay
-- Answer keys + commentary from DNEA Examiners Report 2024
-- (English as a Second Language section, pages 187-196).
-- ===========================================================================

do $$
declare
  esl_id uuid;
begin
  select id into esl_id from public.subjects where slug = 'english-second-language' limit 1;
  if esl_id is null then raise notice 'English Second Language subject not found'; return; end if;

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ TASK 1 — Reading: "Hondeklip Bay" (10 × 1 mark)                     ║
  -- ║ Short-answer comprehension. Answers must be lifted near-verbatim    ║
  -- ║ from the passage; minor spelling tolerated by `must_contain`.       ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  -- Q1
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '1', 1, 'free',
    'fill_in',
    E'**SECTION A — READING**\n\n**Task 1: "Hondeklip Bay"** — Read the article (see paper PDF) and answer the questions that follow.\n\n**(1)** How is Hondeklip Bay different from other holiday destinations at the time of the writer''s visit?',
    jsonb_build_object('accepted', jsonb_build_array('quiet','it is quiet','a quiet town')),
    E'Correct response: **quiet** [1 mark]. Well attempted, but marks lost for incorrect spelling (e.g. "quit", "quite") or for over-lifting "natural surroundings make this quiet town a real escape".',
    E'The first paragraph contrasts Hondeklip Bay with other holiday spots: while everywhere else has children running and crowds on the beach, Hondeklip Bay''s campsite is deserted and the beach empty. The single word that captures this contrast is **quiet** — drawn directly from "this quiet town".',
    true
  );

  -- Q2
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '2', 1, 'free',
    'fill_in',
    E'**(2)** What is prohibited along the Hondeklip Bay coast?',
    jsonb_build_object('accepted', jsonb_build_array('littering','litter')),
    E'Correct response: **littering** [1 mark]. Very well answered. A full lift "notices reminding us to refrain from littering" was NOT credited — only the one-word activity that is prohibited.',
    E'The text says "notices reminding us to refrain from littering". The activity being prohibited is **littering**. Write only the prohibited action, not the whole sentence.',
    true
  );

  -- Q3
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '3', 1, 'free',
    'fill_in',
    E'**(3)** What brings the writer to Hondeklip Bay?',
    jsonb_build_object('accepted', jsonb_build_array('curiosity','out of curiosity','his curiosity')),
    E'Correct response: **curiosity** [1 mark]. Challenging — most candidates lifted "you love it or out of curiosity" instead of pinpointing the single reason that applies to the writer.',
    E'The writer says "You come here because you love it or out of curiosity. I am in the latter category" — "the latter" = curiosity. Only the writer''s specific motive is wanted, so **curiosity** is the precise answer.',
    true
  );

  -- Q4
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '4', 1, 'free',
    'fill_in',
    E'**(4)** What is unique about the residents'' accommodations?',
    jsonb_build_object('accepted', jsonb_build_array('bright colours','their bright colours','bright colors')),
    E'Correct response: **bright colours** [1 mark]. Mostly well attempted. "Bright coloured" (adjective form) was NOT credited — the question asks for a noun feature.',
    E'"The tiny brick houses here with their bright colours are noticeably different from the plains of grey scrubland surrounding them." The distinguishing feature is **bright colours** (the houses stand out from the grey land).',
    true
  );

  -- Q5
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '5', 1, 'free',
    'fill_in',
    E'**(5)** What suggests that Hondeklip Bay is a forgotten place?',
    jsonb_build_object('accepted', jsonb_build_array('no development','there has been no development','absolutely no development')),
    E'Correct response: **no development** [1 mark]. Well answered, but careless wording like "on development" cost marks.',
    E'"There has been absolutely no development in a very long time." Lack of new building/growth signals a forgotten place — the precise phrase is **no development**.',
    true
  );

  -- Q6
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '6', 1, 'free',
    'fill_in',
    E'**(6)** Why does the writer believe that he is welcome in Hondeklip Bay?',
    jsonb_build_object('must_contain', jsonb_build_array('wave')),
    E'Correct response: **A wave from a (car) guard** [1 mark]. Generally well attempted. Confused responses like "He waved at the car guard" or "a wave from a car" were not credited.',
    E'"A wave from a car guard when we make eye contact puts a smile on my face, and this makes me feel right at home." The friendly gesture from a stranger — **a wave from a (car) guard** — is what makes the writer feel welcome.',
    true
  );

  -- Q7
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '7', 1, 'free',
    'fill_in',
    E'**(7)** When was Hondeklip Bay first recognised as a place of business?',
    jsonb_build_object('accepted', jsonb_build_array('1846','in 1846')),
    E'Correct response: **1846** [1 mark]. Very few candidates got this right — most chose "1852" (first ore shipped), "300 years ago" (copper discovered), or "two decades later" (Port Nolloth took over).',
    E'"It all changed when Captain Thomas Grace sailed into the bay in **1846**. He immediately realised the bay was only 100 kilometres from the copper, and in 1852 the first load of ore was shipped out." The bay was **recognised** as a business location in 1846 (the moment of discovery); 1852 was when business began.',
    true
  );

  -- Q8
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '8', 1, 'free',
    'fill_in',
    E'**(8)** What is the writer''s reaction when he first sees what he thought was the "Dog Stone"?',
    jsonb_build_object('accepted', jsonb_build_array('disappointment','disappointed','his disappointment')),
    E'Correct response: **disappointment** [1 mark]. Mixed — pronoun confusion ("He failed to hide my disappointment") or fragments ("hide my disappointment") lost the mark.',
    E'"I failed to hide my disappointment at my find only to laugh at myself later when I found out that it was actually Platklip Point." The reaction is **disappointment** — give the noun, not the whole phrase.',
    true
  );

  -- Q9
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '9', 1, 'free',
    'fill_in',
    E'**(9)** What was the most impressive thing the writer saw at Hondeklip Bay?',
    jsonb_build_object('must_contain', jsonb_build_array('sunset')),
    E'Correct response: **(magnificent) sunset** [1 mark]. Mostly well answered. Plural "sunsets" was not credited (the writer mentions one specific sunset on his last night).',
    E'"…there was the most magnificent sunset that took my breath away and it will always be the thing I think of first when I look back on my visit to Hondeklip Bay." The most impressive sight is **the (magnificent) sunset** — singular.',
    true
  );

  -- Q10
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '10', 1, 'free',
    'fill_in',
    E'**(10)** What is it that the writer feels Hondeklip Bay could offer him?',
    jsonb_build_object('accepted', jsonb_build_array('manageable pace','a manageable pace','more manageable pace','a more manageable pace')),
    E'Correct response: **manageable pace** [1 mark]. Frequently overlooked. Incorrect responses included "life is moving too quickly", "a slower life", and "Life goes on everywhere" — the question asks what *appeals* to the writer, not what he is escaping.',
    E'"Life goes on everywhere, yet in Hondeklip Bay, it moves at a more manageable pace. I could get used to such a lifestyle." What the bay offers the writer is a **(more) manageable pace** of life.',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ TASK 2 — "Study routine" 4 students A-D (9 × 1 mark)                ║
  -- ║ Multiple-matching: read each statement, choose which of the four    ║
  -- ║ students (A Hein, B Kensani, C Charlotte, D Hatago) it best describes. ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  -- Q11
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '11', 1, 'free',
    'mcq',
    E'**Task 2: "Study routine during the holiday"**\n\nFour students (A = Hein, B = Kensani, C = Charlotte, D = Hatago) describe their study routines. For each statement, choose the student it best describes.\n\n**(11)** Which student requires little encouragement to be rewarded for work done?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','Hein'),
      jsonb_build_object('id','B','text','Kensani'),
      jsonb_build_object('id','C','text','Charlotte'),
      jsonb_build_object('id','D','text','Hatago')
    ),
    to_jsonb('B'::text),
    E'**B — Kensani** [1 mark]. One of the most challenging questions of the task.',
    E'Kensani says: "I do get a sense of achievement very easily. One good hour of study entitles me to half an hour off; two or three hours of solid studying mean I can watch TV…" — she rewards herself with very little effort. Other students need *more* before they reward themselves.',
    true
  );

  -- Q12
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '12', 1, 'free',
    'mcq',
    E'**(12)** Which student finds it difficult to come up with a suitable schedule?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','Hein'),
      jsonb_build_object('id','B','text','Kensani'),
      jsonb_build_object('id','C','text','Charlotte'),
      jsonb_build_object('id','D','text','Hatago')
    ),
    to_jsonb('D'::text),
    E'**D — Hatago** [1 mark]. Challenging.',
    E'Hatago says: "When I have to draw up my study timetable I have to get their final approval. It usually takes about five tries before I get their approval." — five rewrites = struggling to land on a suitable schedule.',
    true
  );

  -- Q13
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '13', 1, 'free',
    'mcq',
    E'**(13)** Which student says that it''s essential to spend some time in the company of others?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','Hein'),
      jsonb_build_object('id','B','text','Kensani'),
      jsonb_build_object('id','C','text','Charlotte'),
      jsonb_build_object('id','D','text','Hatago')
    ),
    to_jsonb('A'::text),
    E'**A — Hein** [1 mark].',
    E'Hein says: "I''ve got to have contact with the outside world and people, or I''ll go completely mad." That''s the only "must have company" statement in the text.',
    true
  );

  -- Q14
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '14', 1, 'free',
    'mcq',
    E'**(14)** Which student admits to not actually working for the whole time allocated for studying?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','Hein'),
      jsonb_build_object('id','B','text','Kensani'),
      jsonb_build_object('id','C','text','Charlotte'),
      jsonb_build_object('id','D','text','Hatago')
    ),
    to_jsonb('B'::text),
    E'**B — Kensani** [1 mark].',
    E'Kensani says: "I officially sit with my books for around three hours, but I''ll do an hour''s work." — sitting ≠ working. She admits the allocated 3 hours produces only 1 hour of real study.',
    true
  );

  -- Q15
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '15', 1, 'free',
    'mcq',
    E'**(15)** Which student feels comfortable with the study habits that have been established?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','Hein'),
      jsonb_build_object('id','B','text','Kensani'),
      jsonb_build_object('id','C','text','Charlotte'),
      jsonb_build_object('id','D','text','Hatago')
    ),
    to_jsonb('C'::text),
    E'**C — Charlotte** [1 mark]. Challenging.',
    E'Charlotte says: "This suits me, and I would not like to change what already works" and "It''s a routine that suits me and, to be honest, I''m always a little worried about breaking it." — clear comfort with what is established.',
    true
  );

  -- Q16
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '16', 1, 'free',
    'mcq',
    E'**(16)** Which student sometimes knows beforehand that studying will be ineffective?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','Hein'),
      jsonb_build_object('id','B','text','Kensani'),
      jsonb_build_object('id','C','text','Charlotte'),
      jsonb_build_object('id','D','text','Hatago')
    ),
    to_jsonb('D'::text),
    E'**D — Hatago** [1 mark].',
    E'Hatago says: "Now and then I wake up and just know it''s not going to work because I''m just not in the right mood." — knowing IN ADVANCE that the day will be ineffective.',
    true
  );

  -- Q17
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '17', 1, 'free',
    'mcq',
    E'**(17)** Which student has anxiety when working on a study plan?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','Hein'),
      jsonb_build_object('id','B','text','Kensani'),
      jsonb_build_object('id','C','text','Charlotte'),
      jsonb_build_object('id','D','text','Hatago')
    ),
    to_jsonb('B'::text),
    E'**B — Kensani** [1 mark]. Well answered.',
    E'Kensani opens with: "I always get so nervous when I have to set up a timetable." Direct statement of anxiety.',
    true
  );

  -- Q18
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '18', 1, 'free',
    'mcq',
    E'**(18)** Which student has strong professional desires?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','Hein'),
      jsonb_build_object('id','B','text','Kensani'),
      jsonb_build_object('id','C','text','Charlotte'),
      jsonb_build_object('id','D','text','Hatago')
    ),
    to_jsonb('A'::text),
    E'**A — Hein** [1 mark]. Well answered.',
    E'Hein says: "I have a certain career in mind and I know I have to sacrifice a lot for it." — a concrete career ambition driving the study habits.',
    true
  );

  -- Q19
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '19', 1, 'free',
    'mcq',
    E'**(19)** Which student forces themselves to get something done when having difficulties?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','Hein'),
      jsonb_build_object('id','B','text','Kensani'),
      jsonb_build_object('id','C','text','Charlotte'),
      jsonb_build_object('id','D','text','Hatago')
    ),
    to_jsonb('C'::text),
    E'**C — Charlotte** [1 mark]. Well answered.',
    E'Charlotte says: "If it''s not going well, I keep pushing at it to get it sorted out" and "the only way I get concentration back is by pushing it." — pushing through = forcing oneself.',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ TASK 3 — Note-making: "A new word" (orbisculate) (8 marks)          ║
  -- ║ Three headings, candidate adds notes under each. AI-marked          ║
  -- ║ against the memo (full possible-answer list).                       ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    esl_id, 2024, '1', '20', 8, 'paid',
    'free_text',
    E'**Task 3: Note-making — "A new word" (orbisculate)**\n\nYou are going to give a presentation in your English class about the new word "orbisculate". Make short notes under each heading as the basis for your presentation.\n\nUse this format (one note per bullet, on its own line, under the correct heading):\n\n**Where the word is already used/found** *(up to 3 marks)*\n• T-shirts *(given)*\n• \n• \n• \n\n**The criteria to get words into the dictionary** *(up to 3 marks — each note should start with a VERB)*\n• \n• \n• \n\n**The roles of lexicographers** *(up to 2 marks)*\n• \n•',
    E'**Possible answers (DNEA mark scheme):**\n\n**Where the word is already used/found** (1 mark per acceptable response, max 3):\n• T-shirts *(given)*\n1. In the Krieger household\n2. Urban Dictionary\n3. Online crossword puzzle\n4. Comic strips\n5. Petition\n\n**The criteria to get words into the dictionary** (1 mark each, max 3 — the VERB should form part of the response):\n6. Used in a variety of contexts\n7. Used in publications with large and broad readership\n8. Frequently used\n9. (have) sustained use\n10. Describe a concrete experience\n\n**The roles of lexicographers** (1 mark each, max 2):\n11. Write and edit dictionaries\n12. Search through databases\n13. Track word for years/decades\n14. Judge whether there is enough evidence\n\n**NOTE:** Correct responses only earn the mark if placed UNDER THE CORRECT HEADING. "Sustainable" is not acceptable (changes the meaning). "Readership" misspelled as "leadership" loses the mark.',
    E'Award up to 3 marks for heading 1, up to 3 for heading 2, up to 2 for heading 3 (total max 8). Each acceptable note in the right place = 1 mark. Notes that paraphrase but obscure meaning, are in the wrong section, or combine two ideas on one bullet do not score. Verbs are required for heading 2 items.',
    E'**How to score this in self-study:** copy the heading structure exactly, write ONE idea per bullet, lift the wording from the text where possible (the examiner explicitly says "Candidates do not have to use their own words"). Don''t squeeze two ideas onto one line. For heading 2, begin each note with a past-participle verb form like "Used…", "Frequently used", "(have) sustained…", "Describe…" — that''s how the mark scheme is keyed.',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ TASK 4 — MCQ on "Binge-watching" (8 × 1 mark)                       ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  -- Q21
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '21', 1, 'free',
    'mcq',
    E'**Task 4: "Binge-watching"**\n\nRead the article (see paper PDF) and answer the questions that follow.\n\n**(21)** What point does the writer make about binge-watching in the first paragraph?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','It offers the best entertainment.'),
      jsonb_build_object('id','B','text','It can ease real-life tension.'),
      jsonb_build_object('id','C','text','It''s the only way to escape worry.'),
      jsonb_build_object('id','D','text','It''s pleasing to most viewers.')
    ),
    to_jsonb('B'::text),
    E'**B** [1 mark].',
    E'Paragraph 1 ends: "It''s interesting that binge-watching can have this effect — that it can really reduce stress for some people in their day-to-day existence even as the drama on the screen gets more intense." Reduce stress = **ease real-life tension** (B). The opening question "but does it always provide the most enjoyable entertainment?" rules out A.',
    true
  );

  -- Q22
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '22', 1, 'free',
    'mcq',
    E'**(22)** In paragraph 2, what does the writer say about people who binge-watch?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','They are often surprised by the time they spend.'),
      jsonb_build_object('id','B','text','They are putting their physical health at risk.'),
      jsonb_build_object('id','C','text','They are criticised for their actions illogically.'),
      jsonb_build_object('id','D','text','They often don''t like to admit to wasting time.')
    ),
    to_jsonb('C'::text),
    E'**C** [1 mark].',
    E'Paragraph 2: "for some reason, being a bookworm is seen in a more favourable light to being a binge-watcher." The writer asks why we don''t voice the same concerns about page-turners — i.e. binge-watchers are criticised for no logical reason. That''s C — **criticised illogically**.',
    true
  );

  -- Q23
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '23', 1, 'free',
    'mcq',
    E'**(23)** Binge-watching is so addictive because …',
    jsonb_build_array(
      jsonb_build_object('id','A','text','viewers find these shows insightful.'),
      jsonb_build_object('id','B','text','viewers find it difficult to turn the screen off.'),
      jsonb_build_object('id','C','text','the brain does not get exhausted.'),
      jsonb_build_object('id','D','text','the brain does not like unfinished things.')
    ),
    to_jsonb('D'::text),
    E'**D** [1 mark].',
    E'"Although viewers find these series compelling, it is really that the brain likes to settle all the details that keeps us from reaching for the remote control." The brain wants to FINISH — unfinished things bother it. That''s D.',
    true
  );

  -- Q24
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '24', 1, 'free',
    'mcq',
    E'**(24)** What is the main reason for viewers to keep watching a show even when it is bad?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','They know it will improve.'),
      jsonb_build_object('id','B','text','They dislike wasting their time.'),
      jsonb_build_object('id','C','text','They believe they have to keep going.'),
      jsonb_build_object('id','D','text','They are still interested in the conclusion.')
    ),
    to_jsonb('B'::text),
    E'**B** [1 mark].',
    E'"People generally want to feel that they have spent their time well. That is mainly why people who have put a lot of time into something are more likely to want to continue." So the MAIN reason = they dislike wasting the time they''ve already invested. That''s B (a sunk-cost effect).',
    true
  );

  -- Q25
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '25', 1, 'free',
    'mcq',
    E'**(25)** Mary Jonathan says she sometimes feels pressured because of …',
    jsonb_build_array(
      jsonb_build_object('id','A','text','how quickly episodes are released.'),
      jsonb_build_object('id','B','text','threats to her job security.'),
      jsonb_build_object('id','C','text','how hard it is to remember the series.'),
      jsonb_build_object('id','D','text','the demand for greater profit.')
    ),
    to_jsonb('D'::text),
    E'**D** [1 mark].',
    E'Mary says: "I must force myself to do my part so that **networks maximise their streaming revenue**." The pressure comes from networks needing more profit/revenue — D.',
    true
  );

  -- Q26
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '26', 1, 'free',
    'mcq',
    E'**(26)** Mary Jonathan feels her work is always ...',
    jsonb_build_array(
      jsonb_build_object('id','A','text','demanding.'),
      jsonb_build_object('id','B','text','enjoyable.'),
      jsonb_build_object('id','C','text','exciting.'),
      jsonb_build_object('id','D','text','surprising.')
    ),
    to_jsonb('A'::text),
    E'**A — demanding** [1 mark].',
    E'Mary says her job is "challenging" and "it certainly consistently makes me use my brain cells" — i.e. ALWAYS demanding. The enjoyment is only "when a series is memorable" (not always). So A.',
    true
  );

  -- Q27
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '27', 1, 'free',
    'mcq',
    E'**(27)** What is the writer''s final advice?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','Viewers should aim to pace themselves.'),
      jsonb_build_object('id','B','text','Viewers should try to exercise their brains.'),
      jsonb_build_object('id','C','text','Viewers should choose what works best for them.'),
      jsonb_build_object('id','D','text','Viewers should be aware of the impact of binge-watching.')
    ),
    to_jsonb('C'::text),
    E'**C** [1 mark].',
    E'Final sentence: "But whether you decide to get fully absorbed in binge-watching or only give it a try, make sure to **select the option that is most appropriate for you personally**." That''s "choose what works best for them" — C.',
    true
  );

  -- Q28
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, is_published
  ) values (
    esl_id, 2024, '1', '28', 1, 'free',
    'mcq',
    E'**(28)** The main purpose of this text is to …',
    jsonb_build_array(
      jsonb_build_object('id','A','text','explain how binge-watching works.'),
      jsonb_build_object('id','B','text','provide information on binge-watching.'),
      jsonb_build_object('id','C','text','describe the effects of binge-watching.'),
      jsonb_build_object('id','D','text','provide a strong opinion on binge-watching.')
    ),
    to_jsonb('B'::text),
    E'**B** [1 mark].',
    E'The article is balanced (rhetorical questions, both sides, "everyone is different"), so it''s NOT a strong opinion (D). It covers reasons, examples, an expert, and tips for self-management — i.e. **provides information**. Not just one effect (C) and not a step-by-step mechanism (A). The right umbrella is B.',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ TASK 5 — Guided report writing (15 marks: 8 content + 7 language)   ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    esl_id, 2024, '1', '29', 15, 'paid',
    'essay',
    E'**SECTION B — WRITING**\n\n**Task 5: Guided writing — Report (100–150 words)**\n\nYou participated in an activity at school to raise funds for a good cause in your community. You and your group completed the task successfully, and you should report back to the Life Skills teacher.\n\nWrite a **report** in which you:\n\n• describe HOW you raised the funds;\n• explain WHO or WHAT you chose to help and WHY;\n• say WHAT YOU HAVE LEARNED through this experience.\n\nYour report should be between **100 to 150 words** long.\n\nYou will receive up to **8 marks for the content**, and up to **7 marks for the style and accuracy** of your language.',
    E'**Mark scheme (DNEA 2024):**\n\n**Content (8 marks)** — 3 prompts must all be addressed AND interconnected:\n• **Prompt 1 (HOW)**: explain the fundraising METHOD (e.g. car wash, bake sale, sponsored walk) — not just list activities. Must take place AT SCHOOL.\n• **Prompt 2 (WHO/WHAT and WHY)**: name the beneficiary (a charity, a community member, a cause) AND give reasons for the choice. Must be in YOUR COMMUNITY. Don''t describe the people who helped you.\n• **Prompt 3 (WHAT YOU LEARNED)**: reflect on personal growth — teamwork, importance of community service, event organisation, empathy. Must link back to the activity in prompts 1 & 2.\n\n**Style and accuracy (7 marks)**:\n• Register: formal, addressed to "Life Skills teacher" — not chatty.\n• Tense: predominantly past tense (some present/future allowed for prompt 3).\n• Format: report — headed paragraphs, no salutation/sign-off of a letter or speech.\n• Range: varied sentence structures, topic-related vocabulary.\n• Mechanics: capital letters, full stops, paragraph breaks. No PENCIL — pen only.\n\n**Common pitfalls**: misreading "funds" as "fun"; writing about who helped YOU instead of who you helped; activity outside school; unrealistic claims (e.g. car wash earning enough to build a library).',
    E'AI marker: score this response against the mark scheme above. Output BOTH a content mark out of 8 AND a language mark out of 7, plus 2-3 sentences of feedback identifying the strongest prompt and the weakest.',
    E'**Tips for self-study:**\n1. Plan briefly: pick a school activity (e.g. cake sale, sponsored read, fun run); pick ONE community beneficiary (e.g. a local old-age home, an orphanage); pick ONE lesson learned.\n2. Use a report format — title, sub-headings or clear paragraphs.\n3. Stay in the past tense for prompts 1 & 2; you may shift to present/future for prompt 3.\n4. Aim for 120 words — within the 100-150 range, with no padding.\n5. Connect the prompts: the LESSON should grow from the EXPERIENCE described in prompts 1 & 2.',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ TASK 6 — Extended essay (20 marks: 10 content + 10 language)        ║
  -- ║ One question with three topics (a), (b), (c) — student chooses 1.   ║
  -- ║ We seed THREE separate essay questions (each as q6a, q6b, q6c) so   ║
  -- ║ the learner can attempt any/all.                                    ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  -- Q6 (a) — Argumentative essay
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    esl_id, 2024, '1', '30a', 20, 'paid',
    'essay',
    E'**Task 6: Extended writing — choose ONE topic (200–250 words)**\n\n**(a) — Argumentative essay**\n\n*Should the government give each young person a social grant of N$2 000.00 a month for five years after they complete high school?*\n\nWrite an essay in which you clearly STATE YOUR OPINION.\n\nYour essay should be between **200 – 250 words** long.\n\nYou will receive up to **10 marks for the content**, and up to **10 marks for the style and accuracy** of your language.',
    E'**Mark scheme (DNEA 2024) — Argumentative essay**:\n\n**Content (10 marks):**\n• **Clear stance** — agree, disagree, or qualified position — stated upfront and held throughout.\n• **3–4 strong reasons** supporting the stance, each developed with examples or evidence.\n• **Counter-argument** acknowledged briefly and rebutted (optional but raises the band).\n• **Conclusion** restating the position, not just summarising.\n• Topic-relevance: the focus must be on the GRANT itself (its value, fairness, sustainability, impact on youth motivation) — not on what young people could buy with N$2 000.\n\n**Style and accuracy (10 marks):**\n• Argumentative register — modal verbs (should, could, would), discourse markers (firstly, however, in contrast, therefore).\n• Varied complex sentences; topic-related vocabulary (welfare, sustainability, unemployment, economic burden, dependency).\n• Mechanics, paragraphing, punctuation.\n\n**Common pitfalls**: presenting both sides without choosing one; treating N$2 000 as a fortune that solves all problems; offering advice on selection criteria instead of arguing for/against the grant; descriptive paragraphs instead of argumentative ones.',
    E'AI marker: score this response against the mark scheme above. Output BOTH a content mark out of 10 AND a language mark out of 10, plus 3-4 sentences of feedback covering: (1) clarity of stance, (2) strength of reasoning, (3) discourse markers / argumentative register, (4) one specific language error to fix.',
    E'**Planning tip:** decide your side in 30 seconds and stick to it.\n• FOR: reduces youth poverty, boosts local spending, gives time to find work or study, reduces crime.\n• AGAINST: creates dependency, government can''t afford it, would discourage job-seeking, better to invest in skills/training.\nAim for 4 paragraphs: introduction (stance), 2 supporting paragraphs, 1 counter-rebuttal, 1 conclusion (or fold the rebuttal into the conclusion).',
    true
  );

  -- Q6 (b) — Narrative essay
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    esl_id, 2024, '1', '30b', 20, 'paid',
    'essay',
    E'**Task 6: Extended writing — choose ONE topic (200–250 words)**\n\n**(b) — Narrative essay**\n\nYou were given the responsibility of planning a day out for a group of friends, but things did not go according to plan.\n\nWrite an essay in which you TELL THE STORY of what happened.\n\nYour essay should be between **200 – 250 words** long.\n\nYou will receive up to **10 marks for the content**, and up to **10 marks for the style and accuracy** of your language.',
    E'**Mark scheme (DNEA 2024) — Narrative essay**:\n\n**Content (10 marks):**\n• **Single-day setting** — events must take place on ONE day (not a weekend, week or holiday).\n• **Clear plan stated upfront** — what the day was meant to look like.\n• **Specific things that went wrong** — explicitly named (transport broke down, plans cancelled, weather change, lost something, etc.) — not vague.\n• **Resolution** — show what happened in the end. Don''t leave it hanging.\n• **Balanced structure**: don''t spend the whole essay on build-up. Show the failure and its consequences.\n• **First-person narration** with realistic, relatable detail.\n\n**Style and accuracy (10 marks):**\n• Past tense throughout (simple, continuous, perfect).\n• Time connectives (first, then, suddenly, eventually, after that).\n• Direct speech allowed and rewarded if punctuated correctly.\n• Vivid descriptive language (sensory details).\n\n**Common pitfalls**: misreading "responsibility" as a school task; off-topic plans (drawing house plans!); narrating multiple days; build-up takes 90% of the essay and ending is rushed.',
    E'AI marker: score this response against the mark scheme above. Output BOTH a content mark out of 10 AND a language mark out of 10, plus 3-4 sentences of feedback covering: (1) clarity of original plan, (2) impact of the thing that went wrong, (3) tense consistency, (4) one specific language error to fix.',
    E'**Planning tip:** sketch a 5-step arc on rough paper:\n1. Setup — what the plan was, who was coming.\n2. Excitement — the day starts.\n3. Turning point — something specific goes wrong.\n4. Reaction — how the group handled it.\n5. Outcome — how the day ended, lesson learned (optional).\nKeep build-up to ~30% so you have space for the WRONG part and the resolution.',
    true
  );

  -- Q6 (c) — Descriptive essay
  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    esl_id, 2024, '1', '30c', 20, 'paid',
    'essay',
    E'**Task 6: Extended writing — choose ONE topic (200–250 words)**\n\n**(c) — Descriptive essay**\n\n*My favourite hang-out spot*\n\nWrite an essay in which you GIVE A DESCRIPTION and say HOW YOU FELT THE FIRST TIME you went there.\n\nYour essay should be between **200 – 250 words** long.\n\nYou will receive up to **10 marks for the content**, and up to **10 marks for the style and accuracy** of your language.',
    E'**Mark scheme (DNEA 2024) — Descriptive essay**:\n\n**Content (10 marks) — two distinct halves**:\n• **Description (about 60%)** — concrete, specific sensory details (sight, sound, smell, touch, taste). Avoid vague phrases like "it''s a vibrant place" or "the spot has a positive energy". Show, don''t tell: name the trees, the colour of the walls, the type of music, the people who hang out there.\n• **First-visit feelings (about 40%)** — describe the EMOTIONS you felt the FIRST time you went there. Not general motivations to visit, not your current feelings — your INITIAL impressions.\n\n**Style and accuracy (10 marks):**\n• Rich vocabulary — adjectives, adverbs, similes/metaphors used appropriately.\n• Mostly present tense for the description; past tense for the first-visit narrative.\n• Paragraph structure: clear separation between description and feelings.\n• No narrative drift — this is a description, not a story.\n\n**Common pitfalls**: confusing "spot" with "sport" (writing about soccer, netball); writing about a once-off destination (Etosha, a wedding venue); describing a fictional/abstract place (your imagination, your brain); listing disconnected phrases instead of full sentences.',
    E'AI marker: score this response against the mark scheme above. Output BOTH a content mark out of 10 AND a language mark out of 10, plus 3-4 sentences of feedback covering: (1) concreteness of description, (2) emotional honesty of first-visit memory, (3) sensory range, (4) one specific language error to fix.',
    E'**Planning tip:** pick a REAL place you go to often — a park bench, a friend''s veranda, the school library, a particular tree, a corner shop. Brainstorm 5 sensory details (one per sense), then 3 things you felt the FIRST time you went. Open with a single arresting image, weave the senses through 2–3 paragraphs, then close with your first-visit emotions.',
    true
  );

end $$;
