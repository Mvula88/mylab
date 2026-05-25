-- ===========================================================================
-- NSSCO English Second Language 2023 Paper 2 (6109/2) — Listening
-- 40 marks total, with audio TRANSCRIPTS embedded as stems (sourced from
-- the Teacher's Text 6109/2/23). Learners can read the transcript on-screen
-- — equivalent to hearing the audio.
--
--   Q1 (Task 1) — 4 short recordings, 2 questions each (8 marks)         fill_in
--   Q2 (Task 2) — Growing Cocoa gap-fill, 8 blanks (8 marks)             fill_in
--   Q3 (Task 3) — 6 speakers → A-G multiple-matching (6 marks)           mcq
--   Q4 (Task 4) — Zoë Maasdorp tennis interview, 8 MCQs (8 marks)        mcq
--   Q5 (Task 5) — Ben Lusel university tour interview, 10 short (10 marks) fill_in
-- Answer keys + commentary from DNEA Examiners Report 2023 (pp. 201-204).
-- ===========================================================================

do $$
declare
  esl_id uuid;
  t1q1_stem text;
  t1q2_stem text;
  t1q3_stem text;
  t1q4_stem text;
  t2_stem text;
  t3_stem text;
  t4_stem text;
  t5_stem text;
begin
  select id into esl_id from public.subjects where slug = 'english-second-language' limit 1;
  if esl_id is null then raise notice 'English Second Language subject not found'; return; end if;

  -- ─── TASK 1: Four short recordings (verbatim transcripts) ─────────────

  t1q1_stem := E'**Task 1 — Four short recordings**\n\nYou will hear four short recordings. *Write no more than three words, or a number, for each answer.*\n\n*Audio transcript embedded below.*\n\n**Recording 1:**\n\n"There are rainforests in over 80 countries throughout the world. A huge area of tropical rainforests is found in Africa but not as much as in Asia. However, in Latin America, you find almost half of the world''s rainforest. It is calculated that we are losing one and a half acres of rainforest every second. Rainforests once extended over fourteen percent of the earth''s land surface, now they extend over only six percent, but contain over fifty percent of the world''s wildlife."';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '1(a)', 1, 'free', 'fill_in',
    t1q1_stem || E'\n\n**(a)** Which part of the world has the most rainforest?',
    jsonb_build_object('accepted', jsonb_build_array('Latin America','latin america')),
    E'Correct response: **Latin America** [1 mark]. Fairly well answered. Misspellings of the name lost the mark.',
    E'"in Latin America, you find almost half of the world''s rainforest." — half is more than the Asian or African share, so **Latin America** has the most.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '1(b)', 1, 'free', 'fill_in',
    t1q1_stem || E'\n\n**(b)** At the moment, how much of the earth''s surface does the rainforest cover?',
    jsonb_build_object('accepted', jsonb_build_array('six percent','6 percent','6%','six %','6 %','six per cent')),
    E'Correct response: **six percent / 6%** [1 mark]. Well answered. Adding "over" before the answer lost the mark.',
    E'"now they extend over only **six percent**" — the CURRENT figure (fourteen percent was historical, fifty percent is wildlife, not surface).',
    true);

  t1q2_stem := E'**Recording 2:**\n\n*Audio transcript:*\n\n**Woman:** How was your trip?\n**Man:** Okay, I guess. It was very crowded but I managed to get a window seat.\n**Woman:** Are you glad you chose to come by bus rather than train?\n**Man:** Definitely, it''s quicker even if it was more expensive. It was fun because I was sitting next to people who were having a really interesting conversation.\n**Woman:** I hate having to listen to other people''s conversations. They usually chat about boring stuff like their plans for the day.\n**Man:** These people were chatting about soccer. I was longing to join in but I kept pretending to read an article about politics on my phone.';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '1(c)', 1, 'free', 'fill_in',
    t1q2_stem || E'\n\n**(a)** How did the man decide to travel?',
    jsonb_build_object('accepted', jsonb_build_array('by bus','bus','by bus.')),
    E'Correct response: **by bus** [1 mark]. Well answered. Wrong prepositions ("via bus", "through bus", "into bus") lost the mark.',
    E'"Are you glad you chose to come by bus rather than train?" — Man confirms: **by bus**.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '1(d)', 1, 'free', 'fill_in',
    t1q2_stem || E'\n\n**(b)** What were the people near the man talking about?',
    jsonb_build_object('accepted', jsonb_build_array('soccer','about soccer')),
    E'Correct response: **(about) soccer** [1 mark]. Misspellings ("socer", "soccar") or changing to "football" lost the mark — use the exact word from the audio.',
    E'"These people were chatting about **soccer**." — not "politics" (that''s what the MAN pretended to read), not "their plans for the day" (that''s the woman''s example of boring chat).',
    true);

  t1q3_stem := E'**Recording 3:**\n\n*Audio transcript:*\n\n"This Friday, Namibia Airline is offering plane tickets at special prices. Flight tickets to the Maldives are the most popular and are available at a twenty-five percent discount. What''s more, you can travel to Europe, at a fifty percent discount on the normal price. There are only two hundred tickets available and bookings can be made online daily. This offer is available annually, so if you''re interested, go to our website to book your flight."';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '1(e)', 1, 'free', 'fill_in',
    t1q3_stem || E'\n\n**(a)** Where can you currently fly for half price?',
    jsonb_build_object('accepted', jsonb_build_array('Europe','to Europe')),
    E'Correct response: **(to) Europe** [1 mark]. Well answered. Misspelling "Europe" lost the mark.',
    E'"you can travel to **Europe**, at a **fifty percent discount** on the normal price." — half price = 50% off = Europe (not Maldives, which is 25% off).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '1(f)', 1, 'free', 'fill_in',
    t1q3_stem || E'\n\n**(b)** How often is the special offer made?',
    jsonb_build_object('accepted', jsonb_build_array('annually','yearly','every year')),
    E'Correct response: **annually** [1 mark]. Fairly well answered. Misspellings ("anualy", "annally") lost the mark; "annual" (adjective) was NOT credited — the question needs an adverb of frequency.',
    E'"This offer is available **annually**" — once a year. Not "daily" (that''s how bookings work).',
    true);

  t1q4_stem := E'**Recording 4:**\n\n*Audio transcript:*\n\n**Reporter:** We have recently learned that all schools are closing earlier this year. What changes have you made to your school''s year plan?\n**Principal:** We need to finalise everything one week earlier, starting on 15th November, as the last day for pupils will be on 22nd November, with the teachers finishing on the 23rd.\n**Reporter:** What was the teachers'' reaction to this news?\n**Principal:** Many teachers are worried because there''s so much to do, including our end-of-year sports competition. And then there''s a prize-giving ceremony, which is always the highlight of our school calendar. To say thank you to all our teachers, we''ll also be organising a school party for all the staff.';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '1(g)', 1, 'free', 'fill_in',
    t1q4_stem || E'\n\n**(a)** When do the learners finish school this year?',
    jsonb_build_object('accepted', jsonb_build_array('22nd November','22 November','twenty-two November','22nd Nov','22/11')),
    E'Correct response: **22nd November / Twenty-two November** [1 mark]. Misspelling "Novermber" or wrong dates (21, 27, 22 December) lost the mark.',
    E'"the last day for pupils will be on **22nd November**" — pupils = learners. The 23rd is for teachers, not learners.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '1(h)', 1, 'free', 'fill_in',
    t1q4_stem || E'\n\n**(b)** Which activity is everybody looking forward to before the school year ends?',
    jsonb_build_object('must_contain', jsonb_build_array('prize')),
    E'Correct response: **prize-giving (ceremony)** [1 mark]. Confusing "prize" with "price" failed; misspelling "ceremony" failed; changing to "award" was discouraged.',
    E'"there''s a **prize-giving ceremony**, which is always the **highlight of our school calendar**." Highlight = what everybody looks forward to.',
    true);

  -- ─── TASK 2: Growing Cocoa (verbatim transcript + 8 gaps) ─────────────
  t2_stem := E'**Task 2 — "Growing Cocoa"**\n\nYou will hear a talk given by a farmer, David Moloi, about growing cocoa. *Write one or two words, or a number, in each gap.*\n\n*Audio transcript:*\n\n"Hello, I am David Moloi, a farmer. I''ve come to talk to you today about growing cocoa. Growing cocoa is no simple task. Cocoa beans are usually harvested on small farms in many different countries, with each farm producing only around 800 kg of cocoa beans per year. And most of this cocoa comes from West Africa, but countries where cocoa beans are also grown include, for example, Honduras and Thailand.\n\nCocoa is a delicate, sensitive plant. It requires enough rainfall as well as hot temperature to mature. Cocoa plants don''t respond well to too much direct sunlight or strong winds. They also require rainforest trees to offer shade and protection from too much light and damage caused by wind. Because cocoa farms are sensitive to this type of climate, for example in Ghana, a major decline in production was experienced in the 1970s, and the industry nearly collapsed in the early 1980s. However, the production of cocoa in Ghana steadily recovered in the mid-1990s — increasing to twice the size post-2003.\n\nFarmers need to make sure they protect the cocoa trees, fertilise the soil, and watch for signs of disease or distress. With proper care, most cocoa trees produce pods, which are long narrow parts of the plant that contain the cocoa beans, by the fifth year and can continue for another thirty years. A typical pod contains thirty to forty beans and there are about thirty pods per tree; approximately 400 beans are required to make one pound of cocoa.\n\nMost countries have two periods of peak production per year: a main harvest, and a smaller harvest. Cocoa farmers use long-handled steel tools to reach the pods and cut them without wounding the soft bark of the tree. Farmers then use baskets to carry the harvested cocoa pods.\n\nPost-harvest processing has the biggest impact on cocoa quality and, consequently, on cocoa taste. The farmer removes the beans from the pods, packs them into boxes, and then wraps them in banana leaves for at least seven days to boil or ferment. Fermentation is a chemical change that happens in vegetable and animal substances. This process produces heat, which has a positive impact on the flavour of the cocoa. The beans are then dried for several days and, after that, packed into sacks and sold to a buying station."';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '2(a)', 1, 'free', 'fill_in',
    t2_stem || E'\n\n**(a)** The majority of cocoa is produced in ____________.',
    jsonb_build_object('accepted', jsonb_build_array('West Africa','west africa')),
    E'Correct response: **West Africa** [1 mark]. Wrong: "West of Africa" / "Western Africa".',
    E'"most of this cocoa comes from **West Africa**" — exact phrase from the audio.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '2(b)', 1, 'free', 'fill_in',
    t2_stem || E'\n\n**(b)** The cocoa plant needs plenty of rainwater and ____________ to grow.',
    jsonb_build_object('must_contain', jsonb_build_array('hot')),
    E'Correct response: **hot temperature** [1 mark]. "high temperature" was a common wrong answer — listen for the EXACT word.',
    E'"It requires enough rainfall as well as **hot temperature** to mature." — exact word: "hot", not "high".',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '2(c)', 1, 'free', 'fill_in',
    t2_stem || E'\n\n**(c)** In the ____________ the production of cocoa in Ghana almost came to an end…',
    jsonb_build_object('accepted', jsonb_build_array('1980s','early 1980s','1980''s')),
    E'Correct response: **1980s** [1 mark]. "1980" (singular year) was wrong — the audio says "early 1980s" referring to the decade.',
    E'"the industry nearly collapsed in the **early 1980s**." — gap takes the decade ("the 1980s").',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '2(d)', 1, 'free', 'fill_in',
    t2_stem || E'\n\n**(d)** …but then after ____________ it doubled.',
    jsonb_build_object('accepted', jsonb_build_array('2003','post-2003')),
    E'Correct response: **2003** [1 mark]. "in 2003" added a preposition that doesn''t fit the sentence ("after in 2003" makes no sense).',
    E'"increasing to twice the size **post-2003**." — twice = doubled. Year: 2003.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '2(e)', 1, 'free', 'fill_in',
    t2_stem || E'\n\n**(e)** To make one pound of cocoa, you will need around ____________ beans.',
    jsonb_build_object('accepted', jsonb_build_array('400','four hundred')),
    E'Correct response: **400** [1 mark]. "four hundreds" (plural) is incorrect English.',
    E'"approximately **400** beans are required to make one pound of cocoa."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '2(f)', 1, 'free', 'fill_in',
    t2_stem || E'\n\n**(f)** During harvests, farmers cut the pods that contain the beans and collect them in ____________.',
    jsonb_build_object('accepted', jsonb_build_array('baskets','baskets.')),
    E'Correct response: **baskets** [1 mark]. Misspelling "buskets" lost the mark.',
    E'"Farmers then use **baskets** to carry the harvested cocoa pods."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '2(g)', 1, 'free', 'fill_in',
    t2_stem || E'\n\n**(g)** After the harvest, beans are covered with ____________ for a week.',
    jsonb_build_object('must_contain', jsonb_build_array('banana')),
    E'Correct response: **banana leaves** [1 mark]. "bananas leaves" or "banana leafs" lost the mark.',
    E'"wraps them in **banana leaves** for at least seven days." — singular "banana", plural "leaves".',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '2(h)', 1, 'free', 'fill_in',
    t2_stem || E'\n\n**(h)** The cocoa ____________ improves when the beans get warm.',
    jsonb_build_object('accepted', jsonb_build_array('flavour','flavor','taste')),
    E'Correct response: **flavour** [1 mark]. Misspellings "flaver" / "flavar" / "favour" lost the mark.',
    E'"This process produces heat, which has a positive impact on the **flavour** of the cocoa."',
    true);

  -- ─── TASK 3: 6 speakers on plans after school ─────────────────────────
  t3_stem := E'**Task 3 — Six speakers on plans after high school**\n\nYou will hear six high school learners talking about what they are going to do after high school. *Use each letter only once. One letter is left over.*\n\n*Audio transcript:*\n\n**Speaker 1:** I''m going to study next year. I am very much looking forward to being in the city and making new friends. I think it should be fun to be on your own and be able to make your own decisions. However, my parents are worried about my safety and will arrange for me to stay with my uncle and aunt. I hope all my classes are in the evening so I can work to earn some money during the day. I''m really looking forward to next year.\n\n**Speaker 2:** My parents and I decided that I would first run their business for a year or two to gain experience. My parents have been dreaming of touring overseas for a long time. They want me to run the business while they''re away. I would eventually like to go to university to do a degree in Business Management or any other courses of that type. Hopefully, by that time, I''ll have put aside enough funds for my education.\n\n**Speaker 3:** I have worked so hard at school and would easily be accepted at any university, but I do not want to see books again for at least one full year. I have already met an agent who is going to arrange for my au pair work abroad. I would like to be somewhere in Europe so that I can easily travel to nearby countries. I''m going to miss my friends though, but looking forward to seeing other places and meeting new friends.\n\n**Speaker 4:** I''ve been accepted by the university in our town and will be studying next year. I look forward to staying on campus and cannot wait to meet my new roommates. My parents have saved enough money for my studies and I will not have to work while studying. I''m also excited about the many places in the city and would definitely like to go see a movie on the big screen often. So I should use my pocket money wisely to be able to entertain myself throughout the year.\n\n**Speaker 5:** After school, a wonderful adventure awaits me. Ever since I was a boy, I have dreamed of climbing the world''s highest mountains. I have been saving enough money all my life to travel around the globe for one year. My parents say they approve of my plans because they both like the outdoors. After completing my mission, I want to go to college here in town and shoot adventure movies as a hobby.\n\n**Speaker 6:** I already have a job for next year. I''ve been accepted at one of the commercial banks in town. I''m quite lucky because the bank offers long holidays and there are possibilities for promotion too. It has always been my dream to be a bank manager one day, so I think that''s the route I want to take. I plan to work very hard to achieve this, but I will also make sure that I''m still able to hang out with my friends and go to the cinema at the weekend.';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '3(a)', 1, 'free', 'mcq',
    t3_stem || E'\n\n**Speaker 1** — Which opinion does this speaker express?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','I''m going to work for an institution that cares for its staff.'),
      jsonb_build_object('id','B','text','I''m planning to get a job overseas.'),
      jsonb_build_object('id','C','text','I want to save money to study in the future.'),
      jsonb_build_object('id','D','text','I will explore the world with my own savings.'),
      jsonb_build_object('id','E','text','I''m keen to get a job while still studying.'),
      jsonb_build_object('id','F','text','I want to learn some useful skills while studying.'),
      jsonb_build_object('id','G','text','I will study locally and make use of the facilities there.')
    ),
    to_jsonb('E'::text),
    E'**E** [1 mark]. Speaker 1 → E.',
    E'Speaker 1: "I hope all my classes are in the evening so I can **work to earn some money during the day**." — a job WHILE studying = E.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '3(b)', 1, 'free', 'mcq',
    t3_stem || E'\n\n**Speaker 2** — Which opinion does this speaker express?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','I''m going to work for an institution that cares for its staff.'),
      jsonb_build_object('id','B','text','I''m planning to get a job overseas.'),
      jsonb_build_object('id','C','text','I want to save money to study in the future.'),
      jsonb_build_object('id','D','text','I will explore the world with my own savings.'),
      jsonb_build_object('id','E','text','I''m keen to get a job while still studying.'),
      jsonb_build_object('id','F','text','I want to learn some useful skills while studying.'),
      jsonb_build_object('id','G','text','I will study locally and make use of the facilities there.')
    ),
    to_jsonb('C'::text),
    E'**C** [1 mark]. Speaker 2 → C.',
    E'Speaker 2: "Hopefully, by that time, I''ll have **put aside enough funds for my education**." — saving money to study later = C.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '3(c)', 1, 'free', 'mcq',
    t3_stem || E'\n\n**Speaker 3** — Which opinion does this speaker express?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','I''m going to work for an institution that cares for its staff.'),
      jsonb_build_object('id','B','text','I''m planning to get a job overseas.'),
      jsonb_build_object('id','C','text','I want to save money to study in the future.'),
      jsonb_build_object('id','D','text','I will explore the world with my own savings.'),
      jsonb_build_object('id','E','text','I''m keen to get a job while still studying.'),
      jsonb_build_object('id','F','text','I want to learn some useful skills while studying.'),
      jsonb_build_object('id','G','text','I will study locally and make use of the facilities there.')
    ),
    to_jsonb('B'::text),
    E'**B** [1 mark]. Speaker 3 → B.',
    E'Speaker 3: "I have already met an agent who is going to arrange for my **au pair work abroad**." — au pair work in Europe = job overseas = B.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '3(d)', 1, 'free', 'mcq',
    t3_stem || E'\n\n**Speaker 4** — Which opinion does this speaker express?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','I''m going to work for an institution that cares for its staff.'),
      jsonb_build_object('id','B','text','I''m planning to get a job overseas.'),
      jsonb_build_object('id','C','text','I want to save money to study in the future.'),
      jsonb_build_object('id','D','text','I will explore the world with my own savings.'),
      jsonb_build_object('id','E','text','I''m keen to get a job while still studying.'),
      jsonb_build_object('id','F','text','I want to learn some useful skills while studying.'),
      jsonb_build_object('id','G','text','I will study locally and make use of the facilities there.')
    ),
    to_jsonb('G'::text),
    E'**G** [1 mark]. Speaker 4 → G.',
    E'Speaker 4: "I''ve been accepted by the university **in our town**… excited about the many places in the city." — local university + uses local facilities = G.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '3(e)', 1, 'free', 'mcq',
    t3_stem || E'\n\n**Speaker 5** — Which opinion does this speaker express?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','I''m going to work for an institution that cares for its staff.'),
      jsonb_build_object('id','B','text','I''m planning to get a job overseas.'),
      jsonb_build_object('id','C','text','I want to save money to study in the future.'),
      jsonb_build_object('id','D','text','I will explore the world with my own savings.'),
      jsonb_build_object('id','E','text','I''m keen to get a job while still studying.'),
      jsonb_build_object('id','F','text','I want to learn some useful skills while studying.'),
      jsonb_build_object('id','G','text','I will study locally and make use of the facilities there.')
    ),
    to_jsonb('D'::text),
    E'**D** [1 mark]. Speaker 5 → D.',
    E'Speaker 5: "I have been **saving enough money all my life to travel around the globe** for one year." — own savings + world travel = D.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '3(f)', 1, 'free', 'mcq',
    t3_stem || E'\n\n**Speaker 6** — Which opinion does this speaker express?',
    jsonb_build_array(
      jsonb_build_object('id','A','text','I''m going to work for an institution that cares for its staff.'),
      jsonb_build_object('id','B','text','I''m planning to get a job overseas.'),
      jsonb_build_object('id','C','text','I want to save money to study in the future.'),
      jsonb_build_object('id','D','text','I will explore the world with my own savings.'),
      jsonb_build_object('id','E','text','I''m keen to get a job while still studying.'),
      jsonb_build_object('id','F','text','I want to learn some useful skills while studying.'),
      jsonb_build_object('id','G','text','I will study locally and make use of the facilities there.')
    ),
    to_jsonb('A'::text),
    E'**A** [1 mark]. Speaker 6 → A. (F is the extra unused option.)',
    E'Speaker 6: "I''ve been accepted at one of the **commercial banks** in town. I''m quite lucky because the **bank offers long holidays and there are possibilities for promotion** too." — institution that cares for staff = A.',
    true);

  -- ─── TASK 4: Zoë Maasdorp tennis interview ────────────────────────────
  t4_stem := E'**Task 4 — Interview with Zoë Maasdorp, professional tennis player**\n\nYou will hear an interview with Zoë Maasdorp. Tick (✓) the correct answer.\n\n*Audio transcript:*\n\n**Interviewer:** Welcome to today''s programme on Women in Sport. I''m delighted to have with me Zoë Maasdorp, one of the greatest stars in the world of tennis. Zoë, why tennis?\n\n**Zoë:** Well, I might''ve gone into netball like my mates did if I hadn''t listened to my father. He used to play tennis and was always talking about his matches and how he missed playing. It fascinated me because I used to watch old videos of him playing when I was in high school. I started off here in the school league, making sure to take part in all competitions. One day, out of the blue I won the Regional cup and as they say, the rest was history. **It all came naturally to me!**\n\n**Interviewer:** Is it a demanding sport?\n\n**Zoë:** You bet! People underestimate the **strength required** – sometimes I can''t feel my hands at the end of practices. That''s the toughest thing because you''ve got to get up and start all over again the next day. I practice more than four times a day for three hours – that''s tricky in the time available. And when you''re having a bad day – not getting the techniques right, you might have to put more hours into practice. Also, don''t forget the trash talk of supporters which affects your emotional well-being.\n\n**Interviewer:** Of all the tournaments, which one do you like to participate in?\n\n**Zoë:** This is the question I''m always asked by people sitting next to me on airplanes or at parties, and by my mother''s friends. I''m very keen on Wimbledon. It''s a tournament with a fascinating history, of course just like the French Open, Roland Garros. And it''s incredibly lovely to take part in it too. But **my standard answer is always the Australian Open**. It''s hard to give a reason why. I just love playing in the tournament and keep wanting to go back again and again, nothing like the US Open.\n\n**Interviewer:** How do you feel being centre stage when playing in those big tournaments?\n\n**Zoë:** I still cannot get used to sold-out venues when playing. I remember the first time lots of kids came from one of the tennis clubs. They watched while I was producing a couple of aces and then started chanting my name. I''d been warned it might happen, so I was kind of expecting it, but **I still wanted to hide**. Even now I feel uncomfortable when this happens – I''m just playing the sport that I adore.\n\n**Interviewer:** What''s the most difficult side of your career as a professional sportsperson?\n\n**Zoë:** There are so many! Most of us in this profession find it difficult to disregard bad publicity. You should never let it bother you. Also, we do struggle with defeat. No one wants to lose, but it is part of the game. Personally, I hate letting my fans down. However, the **biggest obstacle is to remain positive**. No matter what happens in your career, you have to keep going if you want to succeed as a professional sportsperson.\n\n**Interviewer:** What would you say is your greatest achievement?\n\n**Zoë:** I was always told at school that I''d have to work hard to get into university so I''d say **managing to get a degree**. Doing that even tops having won some trophies, which certainly has been a personal accomplishment. That my tennis career has inspired lots of youngsters is also quite special, of course. The mass media definitely played a big role in it. Being televised and on the front covers of magazines and newspapers put a lot of pressure on me to achieve more.\n\n**Interviewer:** Is there anything you wish now that you''d done when you were younger?\n\n**Zoë:** I certainly regret wanting to play like someone else – one should never take their natural gifts for granted. I remember my mother telling me, at a very young age, that practice makes perfect, so that''s what I did. Sometimes I wonder though, why I''ve never tried playing doubles. I think we can all learn from each other and one should never stop educating themselves whatever they do, even in a sport like tennis.\n\n**Interviewer:** So what are your plans for the coming year?\n\n**Zoë:** To tell the truth, I sometimes feel like locking my tennis racquet and my passport away and staying at home to catch up with my family and friends. I''ve also thought about going to Australia to learn how to surf on their beautiful beaches. And, in fact, I''ve been offered a full-time coaching job there, at a local university. **What I''ve actually decided to do is go and stay in a friend''s beach house and experiment with writing a novel.** It''s a new venture for me and I''m quite excited about the prospect.';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '4(a)', 1, 'free', 'mcq',
    t4_stem || E'\n\n**(1)** Zoë decided to become a tennis player when she …',
    jsonb_build_array(jsonb_build_object('id','A','text','was playing in high school.'),jsonb_build_object('id','B','text','won a regional competition.'),jsonb_build_object('id','C','text','discovered that she had an ability for it.'),jsonb_build_object('id','D','text','was convinced by her father.')),
    to_jsonb('D'::text),
    E'**D** [1 mark].',
    E'"if I hadn''t listened to my father." Her father''s influence is what shifted her from netball (peer choice) to tennis = D.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '4(b)', 1, 'free', 'mcq',
    t4_stem || E'\n\n**(2)** What does Zoë say is the most difficult thing about playing tennis?',
    jsonb_build_array(jsonb_build_object('id','A','text','how physically demanding it is'),jsonb_build_object('id','B','text','how mean fans can be to the players'),jsonb_build_object('id','C','text','how easily things can go wrong'),jsonb_build_object('id','D','text','how long the practice hours are')),
    to_jsonb('A'::text),
    E'**A** [1 mark].',
    E'"People underestimate the **strength required** – sometimes I can''t feel my hands at the end of practices. **That''s the toughest thing**" = physically demanding (A).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '4(c)', 1, 'free', 'mcq',
    t4_stem || E'\n\n**(3)** Which tournament is Zoë''s favourite?',
    jsonb_build_array(jsonb_build_object('id','A','text','American Open'),jsonb_build_object('id','B','text','Wimbledon'),jsonb_build_object('id','C','text','Australian Open'),jsonb_build_object('id','D','text','Roland Garos')),
    to_jsonb('C'::text),
    E'**C** [1 mark].',
    E'"my standard answer is always the **Australian Open**. It''s hard to give a reason why. I just love playing in the tournament and keep wanting to go back again and again."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '4(d)', 1, 'free', 'mcq',
    t4_stem || E'\n\n**(4)** How did Zoë feel when some children came to watch her play?',
    jsonb_build_array(jsonb_build_object('id','A','text','embarrassed by the attention she received'),jsonb_build_object('id','B','text','surprised by their reaction to her performance'),jsonb_build_object('id','C','text','excited to play the sports she loves wholeheartedly'),jsonb_build_object('id','D','text','pleased with how she played while they were there')),
    to_jsonb('A'::text),
    E'**A** [1 mark].',
    E'"started chanting my name… **I still wanted to hide**. Even now I feel uncomfortable when this happens" = embarrassed by attention (A).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '4(e)', 1, 'free', 'mcq',
    t4_stem || E'\n\n**(5)** What does Zoë find most challenging about her tennis career?',
    jsonb_build_array(jsonb_build_object('id','A','text','disappointing her fans'),jsonb_build_object('id','B','text','losing a game'),jsonb_build_object('id','C','text','staying motivated'),jsonb_build_object('id','D','text','ignoring the media')),
    to_jsonb('C'::text),
    E'**C** [1 mark].',
    E'"the **biggest obstacle is to remain positive**. No matter what happens in your career, you have to keep going" = staying motivated (C). The other things are mentioned but "biggest" = C.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '4(f)', 1, 'free', 'mcq',
    t4_stem || E'\n\n**(6)** Which of her achievements is Zoë most proud of?',
    jsonb_build_array(jsonb_build_object('id','A','text','having a successful tennis career'),jsonb_build_object('id','B','text','being on television'),jsonb_build_object('id','C','text','graduating from university'),jsonb_build_object('id','D','text','winning several grand slams')),
    to_jsonb('C'::text),
    E'**C** [1 mark].',
    E'"I''d say **managing to get a degree**. Doing that even **tops** having won some trophies" — degree beats everything else = C.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '4(g)', 1, 'free', 'mcq',
    t4_stem || E'\n\n**(7)** Zoë wishes that when she was younger …',
    jsonb_build_array(jsonb_build_object('id','A','text','she had refused to play doubles.'),jsonb_build_object('id','B','text','she had forced herself to play harder.'),jsonb_build_object('id','C','text','she had listened to somebody''s advice.'),jsonb_build_object('id','D','text','she had been less influenced by other players.')),
    to_jsonb('D'::text),
    E'**D** [1 mark].',
    E'"I certainly **regret wanting to play like someone else** – one should never take their natural gifts for granted." — being less influenced by other players = D.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '4(h)', 1, 'free', 'mcq',
    t4_stem || E'\n\n**(8)** What does Zoë plan to do next year?',
    jsonb_build_array(jsonb_build_object('id','A','text','write a book'),jsonb_build_object('id','B','text','be with loved-ones'),jsonb_build_object('id','C','text','try a different sport'),jsonb_build_object('id','D','text','take up a coaching position')),
    to_jsonb('A'::text),
    E'**A** [1 mark].',
    E'"What I''ve actually decided to do is go and stay in a friend''s beach house and **experiment with writing a novel**." = write a book (A). She MENTIONED but did NOT choose family time, surfing, or coaching.',
    true);

  -- ─── TASK 5: Ben Lusel university tour interview ──────────────────────
  t5_stem := E'**Task 5 — Interview with Ben Lusel about his work as a university tour guide**\n\nYou will hear the interview. Write short answers.\n\n*Audio transcript:*\n\n**Interviewer:** Hello Ben. Thanks for making time to talk to us today. What made you decide to become a university tour guide?\n\n**Ben:** During my years in high school, my teachers encouraged us to go on several university tours, though **I initially read about university tours on social media**. And after hearing about my cousin''s most memorable experiences on university tours it didn''t take long for me to make the choice.\n\n**Interviewer:** Mmm…. that sounds interesting! And what is a university tour all about then?\n\n**Ben:** Well, a university tour is a tour of a university''s campus. Potential students, families and other visitors take university tours to learn about the university''s facilities. You get to learn about the programmes offered by the institution and **above all, student life**. This is essential for students in their overall learning experience.\n\n**Interviewer:** So what is the most essential characteristic a good university tour guide needs to have?\n\n**Ben:** The nature of the job demands excellent people skills; being comfortable speaking with a large diverse group of people; and reliability. **A smile can really go a long way and takes priority over everything else.** It is helpful to practice your flexibility in presentations and keep an open mind to change.\n\n**Interviewer:** What is the best way for a university tour guide to prepare for a tour?\n\n**Ben:** Well, I''m given a package including helpful notes and a route by the university I work for, though these aren''t always enough. I''m always cautious about using the university''s website, as it takes them some time to update information. I tend to **visit all the key places around campus beforehand**, something I couldn''t do without.\n\n**Interviewer:** How do you spend your typical day before going on a university tour?\n\n**Ben:** My day as a tour guide begins when I arrive in the University''s Admissions Office, located in Denman Hall. If my co-workers are already there, which isn''t always the case, we enjoy sharing details of what happened on our tours the day before. Each and every day, **I begin my work by assisting with the graphic design project**. The end of the day starts with sorting out the necessary documents and filing them before I''m finally ready to go home again.\n\n**Interviewer:** Are you always eager to go on a university tour?\n\n**Ben:** Oh, yes. I like that I get to meet new people every tour and connect with them and help them decide where they want to go to university. I''m always fascinated to hear about their stories and backgrounds, as each one is truly unique. **But nothing beats the mini hiking sessions**, something that most find challenging. Of course, **another highlight for me is the trip by boat**. Though the tour route may stay the same from day to day, the experience is unique every time.\n\n**Interviewer:** Is there an ideal time to go on a university tour?\n\n**Ben:** Oh, definitely. One has to consider the time of year that they visit. During the summer and the holiday season, many universities may not offer tours. Some universities will be less populated during these periods, so it''s unlikely you''ll get to learn about everything. **The end of summer is perfect**, most universities have sessions that begin at this stage. And they are likely to last anywhere from 40 minutes to one hour.\n\n**Interviewer:** But I''m curious about one thing. Aren''t virtual tours a preferred option nowadays?\n\n**Ben:** Although virtual tours can be a great place to begin when it comes to exploring a prospective university, **nothing beats an in-person tour to truly get a feel for the university campus**. My colleagues feel however that this can be especially important if you are planning to move away from home for university. They argue that you''ll be there for the next few years and this could be one of the biggest investments you''ll make in your lifetime, so you''ll want to ensure you''re happy with your final selection.\n\n**Interviewer:** One more question, Ben, how do you respond when someone asks you a challenging question?\n\n**Ben:** Despite the amount of time I invest in preparation, I always get a few prospective students who have done research about our institution and tend to be knowledgeable. I have seen some colleagues who panic or pretend to know the answer but instead just mix things up. One of my colleagues even told me he never admits that he doesn''t know the answer — it just seems terrifying to him, **but that''s exactly what I do**. Luckily, it doesn''t happen very often.\n\n**Interviewer:** Wow! What an informative session. Thank you for your time, Ben.\n**Ben:** You are welcome.';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '5(a)', 1, 'free', 'fill_in',
    t5_stem || E'\n\n**(a)** How did Ben first hear about university tours?',
    jsonb_build_object('must_contain', jsonb_build_array('social media')),
    E'Correct response: **(Read about them on) social media** [1 mark]. Well answered.',
    E'"I initially read about university tours on **social media**." — not from teachers (encouraged later), not from his cousin (HEARD about, after social media).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '5(b)', 1, 'free', 'fill_in',
    t5_stem || E'\n\n**(b)** What is the most important information that is provided during a university tour?',
    jsonb_build_object('accepted', jsonb_build_array('student life','Student life','about student life')),
    E'Correct response: **Student life** [1 mark]. Misspelling "stundents" lost the mark.',
    E'"You get to learn about the programmes offered by the institution and **above all, student life**." — "above all" = most important = student life.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '5(c)', 1, 'free', 'fill_in',
    t5_stem || E'\n\n**(c)** What does Ben say is the most important quality for a university tour guide?',
    jsonb_build_object('accepted', jsonb_build_array('smile','a smile')),
    E'Correct response: **(a) smile** [1 mark]. Poorly answered. Misspellings "simile", "smell", "smille" failed. The distractors "flexibility" and "people''s skills" were wrong — those are mentioned but not THE most important.',
    E'"**A smile can really go a long way and takes priority over everything else.**" — "takes priority over everything else" = most important = smile.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '5(d)', 1, 'free', 'fill_in',
    t5_stem || E'\n\n**(d)** What does Ben believe to be an effective way to prepare for a university tour?',
    jsonb_build_object('must_contain', jsonb_build_array('key places')),
    E'Correct response: **Visit key places around the campus** [1 mark]. Poorly answered. Incomplete answers ("visit key places…" or "visit places around the campus") failed.',
    E'"I tend to **visit all the key places around campus beforehand**, something I couldn''t do without." — both "key places" AND "campus" required.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '5(e)', 1, 'free', 'fill_in',
    t5_stem || E'\n\n**(e)** What activity does Ben always do first after he arrives at the university campus?',
    jsonb_build_object('must_contain', jsonb_build_array('graphic design')),
    E'Correct response: **assisting with the graphic design project** [1 mark]. Poorly answered. Misspelling "graphic" or "design" failed; incomplete answers ("graphic design project" without "assisting" / "with") failed; adding "by" before the answer failed.',
    E'"Each and every day, I **begin** my work by **assisting with the graphic design project**." — "begin" = first activity.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '5(f)', 1, 'free', 'fill_in',
    t5_stem || E'\n\n**(f)** What activities does Ben look forward to most during his tours? Give **two** details.\n\n**(i)** First detail',
    jsonb_build_object('accepted', jsonb_build_array('mini-hiking sessions','mini hiking sessions','mini hiking','trip by boat','boat trip','the trip by boat')),
    E'Correct responses (either detail in either box): **mini-hiking sessions** OR **trip by boat** [1 mark]. The two details may be given in any order. Incomplete ("…hiking session" or "mini-hiking…") failed; misspelling "hicking"/"hikking" failed.',
    E'"nothing beats the **mini hiking sessions**… another highlight for me is the **trip by boat**." — write both keywords.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '5(g)', 1, 'free', 'fill_in',
    t5_stem || E'\n\n**(ii)** Second detail',
    jsonb_build_object('accepted', jsonb_build_array('trip by boat','boat trip','the trip by boat','mini-hiking sessions','mini hiking sessions','mini hiking')),
    E'Correct responses (either detail in either box): **trip by boat** OR **mini-hiking sessions** [1 mark]. Misspelling "boat" as "bout" failed.',
    E'Either of the two details from (f)(i). The order does not matter.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '5(h)', 1, 'free', 'fill_in',
    t5_stem || E'\n\n**(g)** When is the best time to go on a university tour?',
    jsonb_build_object('accepted', jsonb_build_array('end of summer','the end of summer','at the end of summer')),
    E'Correct response: **end of summer** [1 mark]. Well answered. "Summer end" or "end summer" lost the mark.',
    E'"**The end of summer is perfect**, most universities have sessions that begin at this stage."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '5(i)', 1, 'free', 'fill_in',
    t5_stem || E'\n\n**(h)** Why does Ben think that a visit to the university is worthwhile?',
    jsonb_build_object('must_contain', jsonb_build_array('feel','university')),
    E'Correct response: **get a feel for the university/campus** [1 mark]. Poorly answered. Many candidates showed no comprehension of the question.',
    E'"nothing beats an in-person tour to truly **get a feel for the university campus**." — keywords: "feel" + "university/campus".',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '2', '5(j)', 1, 'free', 'fill_in',
    t5_stem || E'\n\n**(i)** What does Ben do when he is asked a difficult question during a university tour?',
    jsonb_build_object('must_contain', jsonb_build_array('know')),
    E'Correct response: **Admits he does not know (the answer)** [1 mark]. Poorly answered. Many candidates said what Ben DOESN''T do instead of what he DOES. This was a high-level inference question.',
    E'"One of my colleagues even told me he never admits that he doesn''t know the answer — it just seems terrifying to him, **but that''s exactly what I do**." — opposite of the colleague = Ben DOES admit he doesn''t know.',
    true);

end $$;
