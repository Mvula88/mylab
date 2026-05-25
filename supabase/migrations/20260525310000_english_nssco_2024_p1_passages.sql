-- ===========================================================================
-- NSSCO English 2024 Paper 1 — rewrite to include verbatim reading passages.
--
-- The original migration (20260525260000) had the questions but referenced
-- "see paper PDF" for the passages. This migration deletes those rows and
-- re-inserts them with the full passage text embedded as the stem of each
-- sub-part. The renderer (PastPaperQuiz.jsx) dedupes equal stems within one
-- question group, so each passage shows ONCE per task card and the sub-parts
-- follow underneath.
--
-- Structure:
--   Q1  (Task 1, "Hondeklip Bay")          — 10 fill_in sub-parts 1(a)-1(j)
--   Q2  (Task 2, "Study routine")          — 9 mcq sub-parts 2(a)-2(i)
--   Q3  (Task 3, "Orbisculate")            — 1 free_text (8 marks)
--   Q4  (Task 4, "Binge-watching")         — 8 mcq sub-parts 4(a)-4(h)
--   Q5  (Task 5, Guided report)            — 1 essay (15 marks)
--   Q6a (Task 6a, Argumentative)           — 1 essay (20 marks)
--   Q6b (Task 6b, Narrative)               — 1 essay (20 marks)
--   Q6c (Task 6c, Descriptive)             — 1 essay (20 marks)
-- ===========================================================================

do $$
declare
  esl_id uuid;
  hondeklip_stem text;
  study_stem text;
  orbisculate_stem text;
  binge_stem text;
begin
  select id into esl_id from public.subjects where slug = 'english-second-language' limit 1;
  if esl_id is null then raise notice 'English Second Language subject not found'; return; end if;

  -- Clear old Paper 1 rows for 2024 so we can re-insert cleanly.
  delete from public.past_paper_questions
   where subject_id = esl_id and paper_year = 2024 and paper_no = '1';

  -- ─── PASSAGE 1: Hondeklip Bay (Task 1) ────────────────────────────────
  hondeklip_stem := E'**SECTION A — READING**\n\n**Task 1 — "Hondeklip Bay"**\n\nRead the following article and then answer the questions that follow.\n\n*Hondeklip Bay*\n\nIt is early January – peak holiday season. In all the other towns and villages, children can be seen running around. Some are building sand castles, and crowds of people are relaxing under the beach umbrellas. Hondeklip Bay''s natural surroundings make this quiet town a real escape, something that people at Bristol Bay long for. The campsite at the ocean''s edge is deserted. The beach too, except for notices reminding us to refrain from littering. This is a typical scene in this sparsely populated West Coast area.\n\nIt is about 90 kilometres north-west of Garies, but you won''t pass through here accidentally. You come here because you love it or out of curiosity. I am in the latter category, but it is only a matter of time before I end up in the former.\n\nI am sitting on the deck of one of the self-catering wooden cabins close to the sea. I can see most of Hondeklip Bay from my veranda. The tiny brick houses here with their bright colours are noticeably different from the plains of grey scrubland surrounding them. You have to drive to the nearest town to fill up your car or withdraw money. The restaurants, shops and police station are all within walking distance of each other. There has been absolutely no development in a very long time.\n\nThe next morning, I go look for the "Dog Stone", the canine-shaped rock that the town was named after. On the way there, I find activity! At Sam''s Restaurant, a few people sit outside on benches, waiting for their fish and chips, following my every move. A wave from a car guard when we make eye contact puts a smile on my face, and this makes me feel right at home.\n\nWhy on earth does Hondeklip Bay even exist? About 300 years ago, copper was discovered near present-day Okiep. The closest safe harbour was at the mouth of the Orange River, about 200 kilometres to the north. It was much too far to transport the ore by ox wagon. It all changed when Captain Thomas Grace sailed into the bay in 1846. He immediately realised the bay was only 100 kilometres from the copper, and in 1852 the first load of ore was shipped out. Two decades later, however, Port Nolloth had replaced Hondeklip Bay as the ore-export harbour of choice.\n\nAfter passing a small, isolated house, I reach a ruin. I eventually come to a large, smooth rock that looks like a little piece of Mars. I examine the rock from all sides, but it doesn''t look like a dog to me. I failed to hide my disappointment at my find only to laugh at myself later when I found out that it was actually Platklip Point. Dog Stone is the smallish rock in front of the police station.\n\nOn my last night, as I was walking along the beach, passing unusual rock formations and towering trees, there was the most magnificent sunset that took my breath away and it will always be the thing I think of first when I look back on my visit to Hondeklip Bay.\n\nHondeklip Bay is still on my mind six months later. I often think of this place on days when it seems like life is moving too quickly. Hondeklip Bay fulfills a need I occasionally have, so I would like to go back one day. Life goes on everywhere, yet in Hondeklip Bay, it moves at a more manageable pace. I could get used to such a lifestyle.\n\n*(Go! Magazine: June/July 2022)*';

  -- Task 1 Q1(a) — "How is Hondeklip Bay different…"
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '1(a)', 1, 'free', 'fill_in',
    hondeklip_stem || E'\n\n**(a)** How is Hondeklip Bay different from other holiday destinations at the time of the writer''s visit?',
    jsonb_build_object('accepted', jsonb_build_array('quiet','it is quiet','a quiet town')),
    E'Correct response: **quiet** [1 mark]. Marks lost for misspellings ("quit", "quite") or over-lifting "natural surroundings make this quiet town a real escape".',
    E'Para 1 contrasts other busy holiday spots with Hondeklip Bay (deserted campsite, empty beach). The single descriptive word is **quiet**.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '1(b)', 1, 'free', 'fill_in',
    hondeklip_stem || E'\n\n**(b)** What is prohibited along the Hondeklip Bay coast?',
    jsonb_build_object('accepted', jsonb_build_array('littering','litter')),
    E'Correct response: **littering** [1 mark]. A full lift "notices reminding us to refrain from littering" was NOT credited — only the one-word action.',
    E'The text says "notices reminding us to refrain from littering". The prohibited activity is **littering** — give the action, not the whole sentence.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '1(c)', 1, 'free', 'fill_in',
    hondeklip_stem || E'\n\n**(c)** What brings the writer to Hondeklip Bay?',
    jsonb_build_object('accepted', jsonb_build_array('curiosity','out of curiosity','his curiosity')),
    E'Correct response: **curiosity** [1 mark]. Challenging — most candidates lifted "you love it or out of curiosity" instead of pinpointing the writer''s specific motive.',
    E'"You come here because you love it or out of curiosity. I am in the latter category" — "the latter" = curiosity. Only the writer''s specific motive is wanted, so **curiosity**.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '1(d)', 1, 'free', 'fill_in',
    hondeklip_stem || E'\n\n**(d)** What is unique about the residents'' accommodations?',
    jsonb_build_object('accepted', jsonb_build_array('bright colours','their bright colours','bright colors')),
    E'Correct response: **bright colours** [1 mark]. "Bright coloured" (adjective form) was NOT credited — the question asks for the noun feature.',
    E'"The tiny brick houses here with their bright colours are noticeably different from the plains of grey scrubland." Distinguishing feature: **bright colours**.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '1(e)', 1, 'free', 'fill_in',
    hondeklip_stem || E'\n\n**(e)** What suggests that Hondeklip Bay is a forgotten place?',
    jsonb_build_object('accepted', jsonb_build_array('no development','there has been no development','absolutely no development')),
    E'Correct response: **no development** [1 mark]. Careless wording like "on development" cost marks.',
    E'"There has been absolutely no development in a very long time." Lack of new building/growth signals a forgotten place — **no development**.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '1(f)', 1, 'free', 'fill_in',
    hondeklip_stem || E'\n\n**(f)** Why does the writer believe that he is welcome in Hondeklip Bay?',
    jsonb_build_object('must_contain', jsonb_build_array('wave')),
    E'Correct response: **A wave from a (car) guard** [1 mark]. Confused responses ("He waved at the car guard", "a wave from a car") were not credited.',
    E'"A wave from a car guard when we make eye contact puts a smile on my face, and this makes me feel right at home." The friendly gesture — **a wave from a (car) guard** — makes the writer feel welcome.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '1(g)', 1, 'free', 'fill_in',
    hondeklip_stem || E'\n\n**(g)** When was Hondeklip Bay first recognised as a place of business?',
    jsonb_build_object('accepted', jsonb_build_array('1846','in 1846')),
    E'Correct response: **1846** [1 mark]. Very few got it right — most chose "1852" (first ore shipped), "300 years ago" (copper discovered), or "two decades later" (Port Nolloth took over).',
    E'"It all changed when Captain Thomas Grace sailed into the bay in **1846**…" Recognised in 1846 (the moment of discovery); 1852 was when business actually began.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '1(h)', 1, 'free', 'fill_in',
    hondeklip_stem || E'\n\n**(h)** What is the writer''s reaction when he first sees what he thought was the "Dog Stone"?',
    jsonb_build_object('accepted', jsonb_build_array('disappointment','disappointed','his disappointment')),
    E'Correct response: **disappointment** [1 mark]. Mixed answers — pronoun confusion ("He failed to hide my disappointment") or fragments ("hide my disappointment") lost the mark.',
    E'"I failed to hide my disappointment at my find…" Reaction: **disappointment** — give the noun, not the whole phrase.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '1(i)', 1, 'free', 'fill_in',
    hondeklip_stem || E'\n\n**(i)** What was the most impressive thing the writer saw at Hondeklip Bay?',
    jsonb_build_object('must_contain', jsonb_build_array('sunset')),
    E'Correct response: **(magnificent) sunset** [1 mark]. Plural "sunsets" was NOT credited (the writer mentions one specific sunset on his last night).',
    E'"…there was the most magnificent sunset that took my breath away and it will always be the thing I think of first…" The most impressive sight: **the (magnificent) sunset** — singular.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '1(j)', 1, 'free', 'fill_in',
    hondeklip_stem || E'\n\n**(j)** What is it that the writer feels Hondeklip Bay could offer him?',
    jsonb_build_object('accepted', jsonb_build_array('manageable pace','a manageable pace','more manageable pace','a more manageable pace')),
    E'Correct response: **manageable pace** [1 mark]. Frequently overlooked. Wrong: "life is moving too quickly", "a slower life", "Life goes on everywhere" — the question asks what APPEALS to the writer, not what he is escaping.',
    E'"Life goes on everywhere, yet in Hondeklip Bay, it moves at a more manageable pace. I could get used to such a lifestyle." What the bay offers: a **(more) manageable pace** of life.',
    true);

  -- ─── PASSAGE 2: Four students on study routine (Task 2) ───────────────
  study_stem := E'**Task 2 — Study routine during the holiday**\n\nRead the following article in which four students talk about their study routine during the holiday and then answer the questions that follow.\n\n**A — Hein**\nI''m not good at mixing days; it''s either work or play. If it''s a study day, then I''ll go to my father''s study. It''s completely shut off from the rest of the house. I take my time to work out a timetable that I try to stick to. Sometimes getting started is quite challenging; other days, it''s effortless. I have a certain career in mind and I know I have to sacrifice a lot for it. I''m not the sort of person who says "I wish I had that opportunity". I realised early on that I could grab it any time I wanted. I''ve learned to start studying early and to keep my afternoons open. I can''t talk in the middle of studying; if I do, the morning is over. But I''ve got to have contact with the outside world and people, or I''ll go completely mad.\n\n**B — Kensani**\nI always get so nervous when I have to set up a timetable. I think it''s a question of making the necessary arrangements. I used to be so bad at getting myself organised. I officially sit with my books for around three hours, but I''ll do an hour''s work. And yes, I do get a sense of achievement very easily. One good hour of study entitles me to half an hour off; two or three hours of solid studying mean I can watch TV or hang out with friends. Although I like having people around me, I can do without that distraction when I get serious with my studies. I do understand that studying is crucial for success and better career options later in life. I always start out very slowly and then gather speed towards the end.\n\n**C — Charlotte**\nI''m completely jealous of people who study in the morning and do what they like in the afternoon. I work through the day. If it''s not going well, I keep pushing at it to get it sorted out. I don''t go through a lot of subjects; I tend to choose just one and run with it. It''s easier than setting up a timetable that you might not stick to. This suits me, and I would not like to change what already works. I study at the local library. It''s good to have a geographical break between home and study. When I arrive there, I''ll search for a good spot and study until lunchtime. I definitely feel sleepy after lunch; that''s when I will just walk around for a while, but in the end, the only way I get concentration back is by pushing it. I''ve been doing this since I started high school. It''s a routine that suits me and, to be honest, I''m always a little worried about breaking it.\n\n**D — Hatago**\nI''ll do anything to put off starting to study. I have breakfast, scroll through social media, and talk to my siblings. Now and then I wake up and just know it''s not going to work because I''m just not in the right mood, but I know that it''s only temporary. Once you''ve gotten the first subject out of the way, you know that it''s going to be OK. My parents also put a lot of pressure on me. When I have to draw up my study timetable I have to get their final approval. It usually takes about five tries before I get their approval. I study until 13:30. After a heavy study session, I like to treat myself to a nice activity or snack. My friends don''t understand why I put in so much effort, but I feel almost obliged to make the most of my holiday for my future''s sake.\n\nFor each question, write the correct letter **A**, **B**, **C** or **D**.';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '2(a)', 1, 'free', 'mcq',
    study_stem || E'\n\n**(a)** Which student requires little encouragement to be rewarded for work done?',
    jsonb_build_array(jsonb_build_object('id','A','text','Hein'),jsonb_build_object('id','B','text','Kensani'),jsonb_build_object('id','C','text','Charlotte'),jsonb_build_object('id','D','text','Hatago')),
    to_jsonb('B'::text),
    E'**B — Kensani** [1 mark]. One of the most challenging questions of the task.',
    E'Kensani: "I do get a sense of achievement very easily. One good hour of study entitles me to half an hour off…" — she rewards herself with very little effort.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '2(b)', 1, 'free', 'mcq',
    study_stem || E'\n\n**(b)** Which student finds it difficult to come up with a suitable schedule?',
    jsonb_build_array(jsonb_build_object('id','A','text','Hein'),jsonb_build_object('id','B','text','Kensani'),jsonb_build_object('id','C','text','Charlotte'),jsonb_build_object('id','D','text','Hatago')),
    to_jsonb('D'::text),
    E'**D — Hatago** [1 mark]. Challenging.',
    E'Hatago: "It usually takes about five tries before I get their approval." — five rewrites = struggling to land on a suitable schedule.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '2(c)', 1, 'free', 'mcq',
    study_stem || E'\n\n**(c)** Which student says that it''s essential to spend some time in the company of others?',
    jsonb_build_array(jsonb_build_object('id','A','text','Hein'),jsonb_build_object('id','B','text','Kensani'),jsonb_build_object('id','C','text','Charlotte'),jsonb_build_object('id','D','text','Hatago')),
    to_jsonb('A'::text),
    E'**A — Hein** [1 mark].',
    E'Hein: "I''ve got to have contact with the outside world and people, or I''ll go completely mad."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '2(d)', 1, 'free', 'mcq',
    study_stem || E'\n\n**(d)** Which student admits to not actually working for the whole time allocated for studying?',
    jsonb_build_array(jsonb_build_object('id','A','text','Hein'),jsonb_build_object('id','B','text','Kensani'),jsonb_build_object('id','C','text','Charlotte'),jsonb_build_object('id','D','text','Hatago')),
    to_jsonb('B'::text),
    E'**B — Kensani** [1 mark].',
    E'Kensani: "I officially sit with my books for around three hours, but I''ll do an hour''s work." — sitting ≠ working.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '2(e)', 1, 'free', 'mcq',
    study_stem || E'\n\n**(e)** Which student feels comfortable with the study habits that have been established?',
    jsonb_build_array(jsonb_build_object('id','A','text','Hein'),jsonb_build_object('id','B','text','Kensani'),jsonb_build_object('id','C','text','Charlotte'),jsonb_build_object('id','D','text','Hatago')),
    to_jsonb('C'::text),
    E'**C — Charlotte** [1 mark]. Challenging.',
    E'Charlotte: "This suits me, and I would not like to change what already works" + "It''s a routine that suits me… I''m always a little worried about breaking it."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '2(f)', 1, 'free', 'mcq',
    study_stem || E'\n\n**(f)** Which student sometimes knows beforehand that studying will be ineffective?',
    jsonb_build_array(jsonb_build_object('id','A','text','Hein'),jsonb_build_object('id','B','text','Kensani'),jsonb_build_object('id','C','text','Charlotte'),jsonb_build_object('id','D','text','Hatago')),
    to_jsonb('D'::text),
    E'**D — Hatago** [1 mark].',
    E'Hatago: "Now and then I wake up and just know it''s not going to work because I''m just not in the right mood."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '2(g)', 1, 'free', 'mcq',
    study_stem || E'\n\n**(g)** Which student has anxiety when working on a study plan?',
    jsonb_build_array(jsonb_build_object('id','A','text','Hein'),jsonb_build_object('id','B','text','Kensani'),jsonb_build_object('id','C','text','Charlotte'),jsonb_build_object('id','D','text','Hatago')),
    to_jsonb('B'::text),
    E'**B — Kensani** [1 mark]. Well answered.',
    E'Kensani opens with: "I always get so nervous when I have to set up a timetable."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '2(h)', 1, 'free', 'mcq',
    study_stem || E'\n\n**(h)** Which student has strong professional desires?',
    jsonb_build_array(jsonb_build_object('id','A','text','Hein'),jsonb_build_object('id','B','text','Kensani'),jsonb_build_object('id','C','text','Charlotte'),jsonb_build_object('id','D','text','Hatago')),
    to_jsonb('A'::text),
    E'**A — Hein** [1 mark]. Well answered.',
    E'Hein: "I have a certain career in mind and I know I have to sacrifice a lot for it."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '2(i)', 1, 'free', 'mcq',
    study_stem || E'\n\n**(i)** Which student forces themselves to get something done when having difficulties?',
    jsonb_build_array(jsonb_build_object('id','A','text','Hein'),jsonb_build_object('id','B','text','Kensani'),jsonb_build_object('id','C','text','Charlotte'),jsonb_build_object('id','D','text','Hatago')),
    to_jsonb('C'::text),
    E'**C — Charlotte** [1 mark]. Well answered.',
    E'Charlotte: "If it''s not going well, I keep pushing at it to get it sorted out" + "the only way I get concentration back is by pushing it."',
    true);

  -- ─── PASSAGE 3: Orbisculate / "A new word" (Task 3) ───────────────────
  orbisculate_stem := E'**Task 3 — Note-making: "A new word"**\n\nRead the following article about a family''s quest to get the word "orbisculate" into the dictionary, and then complete the notes that follow.\n\n*A new word*\n\nYou know when you dig into a grapefruit and, suddenly, its juice squirts you in the eye? There''s a word for it: "orbisculate".\n\nHilary and Jonathan Krieger''s dad invented the perfect word. They started a quest to get it into the dictionary. The word is so visual that T-shirts showing what the word means, with a cartoon piece of citrus, are also for sale.\n\nIn the early 2000s, Hilary''s friend accidentally squirted himself with an orange slice. ''Oh, the orange just orbisculated,'' she recalls saying. ''It did what?'' he asked. When Hilary opened the dictionary to show him the word, she could not find it there. ''I was in such shock''. Her father confessed that he had made up the word. In honour of the father, in April 2020, Hilary spent a lot of time talking with friends and family, and the "orbisculate" story kept coming up. ''I began to think, "Orbisculate" is such a great word; it should be in the dictionary.''\n\nHilary and Jonathan are trying to get the made-up word into any dictionary, but it''s not easy. So far, it''s graced the online halls of Urban Dictionary. Encouraging people to use "orbisculate" in a wide variety of contexts will leave a compelling trail of evidence for lexicographers (people who write and edit dictionaries) to follow. Strangers who were inspired by their campaign used the word in an online crossword puzzle. But just because people are writing about their campaign online doesn''t mean that the word will get into the dictionary.\n\nMerriam-Webster adds about 1 000 new words to its master database every year. Editors at the dictionary''s office search through databases for new words. ''What we''re looking for is usage in publications with a large and broad readership,'' says senior editor Emily Brewster. ''We are looking for frequent use. This means that the word has been used that way over time.''\n\nBrewster and her colleagues generally track words for years or even decades before nominating them for dictionary status. ''If it''s a trendy word that comes and goes we should ensure that it can''t sneak in. There are a lot of slang terms that don''t always stick around. It''s important, therefore, that the word being considered must have sustained use.''\n\nBut if a word really takes off, it can quickly become official. Words describing a concrete experience that affects many people tend to get picked up. ''That''s one of the things "orbisculate" has going for it – there is no single word that describes the way some fruits squirt into your eyes,'' Brewster says. ''We still need to judge whether there is enough evidence to put a new word in; that judgment will be reviewed by more senior colleagues.''\n\nJonathan has found some ways to have fun spreading the word. The "orbisculate" website has 50 goals to help get the word used in different places. If it was used in a book and on the radio, that would make it more likely than if it was just used on one of those platforms. So far, "orbisculate" has appeared in comic strips. The siblings hope the word will feature in a song or that some citrus-named celebrities will use it. Or you can always sign the petition to get the word into the dictionary.\n\n*(Adapted, Reader''s Digest Canada; October 2022)*';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2024, '1', '3', 8, 'paid', 'free_text',
    orbisculate_stem || E'\n\n**(3)** You are going to give a presentation in your English class about the new word "orbisculate". Make short notes under each heading as the basis for your presentation. **The first one has been done for you.**\n\nUse this format (one note per bullet, on its own line, under the correct heading):\n\n**Where the word is already used/found** *(up to 3 marks)*\n• T-shirts *(given)*\n• \n• \n• \n\n**The criteria to get words into the dictionary** *(up to 3 marks — each note should start with a VERB)*\n• \n• \n• \n\n**The roles of lexicographers** *(up to 2 marks)*\n• \n•',
    E'**Possible answers (DNEA mark scheme):**\n\n**Where the word is already used/found** (max 3):\n• T-shirts *(given)*\n1. In the Krieger household\n2. Urban Dictionary\n3. Online crossword puzzle\n4. Comic strips\n5. Petition\n\n**The criteria to get words into the dictionary** (max 3 — verb required):\n6. Used in a variety of contexts\n7. Used in publications with large and broad readership\n8. Frequently used\n9. (have) sustained use\n10. Describe a concrete experience\n\n**The roles of lexicographers** (max 2):\n11. Write and edit dictionaries\n12. Search through databases\n13. Track word for years/decades\n14. Judge whether there is enough evidence\n\nCorrect responses only earn the mark IF placed under the correct heading.',
    E'Award up to 3 marks for heading 1, up to 3 for heading 2, up to 2 for heading 3 (total max 8). Each acceptable note in the right place = 1 mark. Notes that paraphrase but obscure meaning, are in the wrong section, or combine two ideas on one bullet do not score. Verbs are required for heading 2 items.',
    E'**Self-study tip:** copy the heading structure exactly, ONE idea per bullet, lift wording from the text where possible — the examiner says "Candidates do not have to use their own words." For heading 2, start each note with a past-participle verb form ("Used…", "Frequently used", "(have) sustained…", "Describe…").',
    true);

  -- ─── PASSAGE 4: Binge-watching (Task 4) ───────────────────────────────
  binge_stem := E'**Task 4 — "Binge-watching"**\n\nRead the following article about binge-watching and then answer the questions that follow.\n\n*Binge-watching*\n\nBinge-watching TV series is tempting, but does it always provide the most enjoyable entertainment? How many times have you tuned in to watch just one episode of a TV series only to find yourself still watching TV three hours later, absorbed in the lives and lessons of imagined world and characters, any concerns temporarily put to one side? It''s interesting that binge-watching can have this effect – that it can really reduce stress for some people in their day-to-day existence even as the drama on the screen gets more intense.\n\nAdults may feel guilty about spending hours watching episode after episode of a drama and parents may nag children to go and be more active. The number of people, young and old alike, who admit to spending longer than they had planned glued to the screen is quite hard to believe. But do we voice the same concerns if those individuals are turning page after page in a novel, glued to a similar storyline? To put it bluntly, for some reason, being a bookworm is seen in a more favourable light to being a binge-watcher.\n\nSome would argue that experiencing a series fully engaged, versus taking breaks between episodes, can affect its impact on the viewer. Firstly, however, it''s helpful to understand why viewers can become hooked. Although viewers find these series compelling, it is really that the brain likes to settle all the details that keeps us from reaching for the remote control. The mere fact that the next episode gets loaded immediately is significant. These series tease the brain by overloading it with content. Reaching the end is sometimes all that''s needed to make the experience worthwhile.\n\nThe brain is also naturally wired to minimise energy waste. People generally want to feel that they have spent their time well. That is mainly why people who have put a lot of time into something are more likely to want to continue. Imagine, for example, a person has tuned into a new drama without first checking how many episodes are in the series. After a few hours, they decide to look. If they''ve watched four out of six episodes, they might be disappointed, but if they''re only halfway through a boring plot, they''d likely be fed up. Despite this, many would still continue to at least reach the end. You often hear people say about a long-running show that it "gets really good around season three", and you continue watching, hoping that it will.\n\nMary Jonathan, a TV critic, is paid for her marathon efforts: "I have to preview and write up reviews. With this job, I must force myself to do my part so that networks maximise their streaming revenue. Networks often send several episodes or even full seasons to critics in advance, which means I''m binging days or even weeks ahead of the public". I have to plan very carefully so that I am finished with one assignment and ready to be able to accept new jobs as they come up. The fact that it is so challenging does not bother me. Does this spoil her enjoyment? Well it depends, when a series is memorable, it can be the best job in the world – really engaging with a world the series created. That isn''t always the case, though, but some may be surprised to hear that it certainly consistently makes me use my brain cells.\n\nLet''s face it, sometimes the urge to binge-watch is too strong. It would be easy to suggest that you need to exercise parts of the brain responsible for impulse control, but will it really work when you need to hit the off switch? You often hear that you just need to pace yourself and that it''s not a bad suggestion either. Everyone is different and some people have a more powerful reward system or less powerful self-control areas. Sometimes, binge-watching can give the mind a sense of weightlessness that is hard to find elsewhere. Occasionally, however, it might be less effective and even harmful to sleep and focus. But whether you decide to get fully absorbed in binge-watching or only give it a try, make sure to select the option that is most appropriate for you personally.\n\n*(Adapted, Breathe, Issue 36/2021)*';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '4(a)', 1, 'free', 'mcq',
    binge_stem || E'\n\n**(a)** What point does the writer make about binge-watching in the first paragraph?',
    jsonb_build_array(jsonb_build_object('id','A','text','It offers the best entertainment.'),jsonb_build_object('id','B','text','It can ease real-life tension.'),jsonb_build_object('id','C','text','It''s the only way to escape worry.'),jsonb_build_object('id','D','text','It''s pleasing to most viewers.')),
    to_jsonb('B'::text),
    E'**B** [1 mark].',
    E'Para 1 ends: "binge-watching can have this effect – that it can really reduce stress for some people" = **ease real-life tension** (B).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '4(b)', 1, 'free', 'mcq',
    binge_stem || E'\n\n**(b)** In paragraph 2, what does the writer say about people who binge-watch?',
    jsonb_build_array(jsonb_build_object('id','A','text','They are often surprised by the time they spend.'),jsonb_build_object('id','B','text','They are putting their physical health at risk.'),jsonb_build_object('id','C','text','They are criticised for their actions illogically.'),jsonb_build_object('id','D','text','They often don''t like to admit to wasting time.')),
    to_jsonb('C'::text),
    E'**C** [1 mark].',
    E'Para 2: "being a bookworm is seen in a more favourable light to being a binge-watcher" — same behaviour viewed differently = **criticised illogically** (C).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '4(c)', 1, 'free', 'mcq',
    binge_stem || E'\n\n**(c)** Binge-watching is so addictive because …',
    jsonb_build_array(jsonb_build_object('id','A','text','viewers find these shows insightful.'),jsonb_build_object('id','B','text','viewers find it difficult to turn the screen off.'),jsonb_build_object('id','C','text','the brain does not get exhausted.'),jsonb_build_object('id','D','text','the brain does not like unfinished things.')),
    to_jsonb('D'::text),
    E'**D** [1 mark].',
    E'"it is really that the brain likes to settle all the details that keeps us from reaching for the remote control." The brain wants to FINISH — **doesn''t like unfinished things** (D).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '4(d)', 1, 'free', 'mcq',
    binge_stem || E'\n\n**(d)** What is the main reason for viewers to keep watching a show even when it is bad?',
    jsonb_build_array(jsonb_build_object('id','A','text','They know it will improve.'),jsonb_build_object('id','B','text','They dislike wasting their time.'),jsonb_build_object('id','C','text','They believe they have to keep going.'),jsonb_build_object('id','D','text','They are still interested in the conclusion.')),
    to_jsonb('B'::text),
    E'**B** [1 mark].',
    E'"People generally want to feel that they have spent their time well. That is mainly why people who have put a lot of time into something are more likely to want to continue." Sunk-cost effect = **dislike wasting time** (B).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '4(e)', 1, 'free', 'mcq',
    binge_stem || E'\n\n**(e)** Mary Jonathan says she sometimes feels pressured because of …',
    jsonb_build_array(jsonb_build_object('id','A','text','how quickly episodes are released.'),jsonb_build_object('id','B','text','threats to her job security.'),jsonb_build_object('id','C','text','how hard it is to remember the series.'),jsonb_build_object('id','D','text','the demand for greater profit.')),
    to_jsonb('D'::text),
    E'**D** [1 mark].',
    E'Mary: "I must force myself to do my part so that **networks maximise their streaming revenue**." Pressure from profit demands — (D).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '4(f)', 1, 'free', 'mcq',
    binge_stem || E'\n\n**(f)** Mary Jonathan feels her work is always ...',
    jsonb_build_array(jsonb_build_object('id','A','text','demanding.'),jsonb_build_object('id','B','text','enjoyable.'),jsonb_build_object('id','C','text','exciting.'),jsonb_build_object('id','D','text','surprising.')),
    to_jsonb('A'::text),
    E'**A — demanding** [1 mark].',
    E'Mary describes her job as "challenging" and "it certainly consistently makes me use my brain cells" — always demanding. Enjoyment is only "when a series is memorable" (not always).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '4(g)', 1, 'free', 'mcq',
    binge_stem || E'\n\n**(g)** What is the writer''s final advice?',
    jsonb_build_array(jsonb_build_object('id','A','text','Viewers should aim to pace themselves.'),jsonb_build_object('id','B','text','Viewers should try to exercise their brains.'),jsonb_build_object('id','C','text','Viewers should choose what works best for them.'),jsonb_build_object('id','D','text','Viewers should be aware of the impact of binge-watching.')),
    to_jsonb('C'::text),
    E'**C** [1 mark].',
    E'Final sentence: "make sure to **select the option that is most appropriate for you personally**" = choose what works best for them (C).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2024, '1', '4(h)', 1, 'free', 'mcq',
    binge_stem || E'\n\n**(h)** The main purpose of this text is to …',
    jsonb_build_array(jsonb_build_object('id','A','text','explain how binge-watching works.'),jsonb_build_object('id','B','text','provide information on binge-watching.'),jsonb_build_object('id','C','text','describe the effects of binge-watching.'),jsonb_build_object('id','D','text','provide a strong opinion on binge-watching.')),
    to_jsonb('B'::text),
    E'**B** [1 mark].',
    E'The article is balanced (rhetorical questions, both sides, "everyone is different") — NOT a strong opinion (D). It covers reasons, examples, an expert, tips for self-management = **provides information** (B).',
    true);

  -- ─── TASK 5: Guided report writing (15 marks) ─────────────────────────
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2024, '1', '5', 15, 'paid', 'essay',
    E'**SECTION B — WRITING**\n\n**Task 5: Guided writing — Report (100–150 words)**\n\nYou participated in an activity at school to raise funds for a good cause in your community. You and your group completed the task successfully, and you should report back to the Life Skills teacher.\n\nWrite a **report** in which you:\n\n• describe HOW you raised the funds;\n• explain WHO or WHAT you chose to help and WHY;\n• say WHAT YOU HAVE LEARNED through this experience.\n\nYour report should be between **100 to 150 words** long.\n\nYou will receive up to **8 marks for the content**, and up to **7 marks for the style and accuracy** of your language.',
    E'**Mark scheme (DNEA 2024):**\n\n**Content (8 marks)** — all three prompts addressed AND interconnected:\n• **Prompt 1 (HOW)**: explain the fundraising METHOD (car wash, bake sale, sponsored walk) — not just list activities. Must take place AT SCHOOL.\n• **Prompt 2 (WHO/WHAT and WHY)**: name the beneficiary AND give reasons for the choice. Must be in YOUR COMMUNITY. Don''t describe the people who helped you.\n• **Prompt 3 (WHAT YOU LEARNED)**: reflect on personal growth — teamwork, community service, event organisation, empathy. Must link back to prompts 1 & 2.\n\n**Style and accuracy (7 marks)**:\n• Register: formal, addressed to "Life Skills teacher".\n• Tense: predominantly past tense (some present/future allowed for prompt 3).\n• Format: report — headed paragraphs, no salutation/sign-off.\n• Range: varied sentence structures, topic-related vocabulary.\n• Mechanics: capitals, full stops, paragraph breaks. PEN only — no pencil.\n\n**Common pitfalls**: misreading "funds" as "fun"; writing about who helped YOU instead of who you helped; activity outside school; unrealistic claims.',
    E'AI marker: score this response against the mark scheme above. Output BOTH a content mark out of 8 AND a language mark out of 7, plus 2-3 sentences of feedback identifying the strongest prompt and the weakest.',
    E'**Self-study tips:**\n1. Pick a school activity (cake sale, sponsored read, fun run), ONE community beneficiary (old-age home, orphanage), ONE lesson learned.\n2. Use report format — title, sub-headings or clear paragraphs.\n3. Stay in past tense for prompts 1 & 2; shift to present/future for prompt 3.\n4. Aim for 120 words — no padding.\n5. Connect the prompts: the LESSON should grow from the EXPERIENCE.',
    true);

  -- ─── TASK 6 (a) Argumentative ─────────────────────────────────────────
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2024, '1', '6a', 20, 'paid', 'essay',
    E'**Task 6: Extended writing — choose ONE topic (200–250 words)**\n\n**(a) — Argumentative essay**\n\n*Should the government give each young person a social grant of N$2 000.00 a month for five years after they complete high school?*\n\nWrite an essay in which you clearly STATE YOUR OPINION.\n\nYour essay should be between **200 – 250 words** long.\n\nYou will receive up to **10 marks for the content**, and up to **10 marks for the style and accuracy** of your language.',
    E'**Mark scheme (DNEA 2024) — Argumentative essay**:\n\n**Content (10 marks):**\n• **Clear stance** upfront, held throughout.\n• **3–4 strong reasons** developed with examples.\n• **Counter-argument** acknowledged and rebutted (optional, raises the band).\n• **Conclusion** restating the position.\n• Focus on the GRANT (value, fairness, sustainability, impact) — not on what to buy with N$2 000.\n\n**Style and accuracy (10 marks):**\n• Argumentative register — modals (should, could, would), discourse markers (firstly, however, in contrast, therefore).\n• Varied complex sentences; topic-related vocabulary (welfare, sustainability, unemployment, dependency).\n• Mechanics, paragraphing, punctuation.\n\n**Common pitfalls**: both sides without a position; treating N$2 000 as a fortune; advising on selection criteria instead of arguing.',
    E'AI marker: score against the scheme above. Output content /10 + language /10 + 3-4 sentences feedback covering (1) clarity of stance, (2) reasoning, (3) register, (4) one specific language error.',
    E'**Planning tip:** decide your side in 30 seconds and stick to it.\n• FOR: reduces youth poverty, boosts spending, time to find work/study, reduces crime.\n• AGAINST: creates dependency, unaffordable, discourages job-seeking, invest in skills instead.\n4 paragraphs: intro (stance) → 2 supporting → 1 counter-rebuttal → conclusion.',
    true);

  -- ─── TASK 6 (b) Narrative ─────────────────────────────────────────────
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2024, '1', '6b', 20, 'paid', 'essay',
    E'**Task 6: Extended writing — choose ONE topic (200–250 words)**\n\n**(b) — Narrative essay**\n\nYou were given the responsibility of planning a day out for a group of friends, but things did not go according to plan.\n\nWrite an essay in which you TELL THE STORY of what happened.\n\nYour essay should be between **200 – 250 words** long.\n\nYou will receive up to **10 marks for the content**, and up to **10 marks for the style and accuracy** of your language.',
    E'**Mark scheme (DNEA 2024) — Narrative essay**:\n\n**Content (10 marks):**\n• **Single-day setting** — ONE day only.\n• **Original plan stated upfront**.\n• **Specific things that went wrong** — explicitly named.\n• **Resolution** — show how it ended.\n• **Balanced structure** — don''t spend the whole essay on build-up.\n• First-person, realistic detail.\n\n**Style and accuracy (10 marks):**\n• Past tense throughout (simple/continuous/perfect).\n• Time connectives (first, then, suddenly, eventually).\n• Direct speech rewarded if punctuated correctly.\n• Vivid sensory language.\n\n**Common pitfalls**: misreading "responsibility" as a school task; off-topic plans; narrating multiple days; rushed ending.',
    E'AI marker: score against the scheme above. Output content /10 + language /10 + 3-4 sentences feedback covering (1) clarity of plan, (2) impact of the failure, (3) tense consistency, (4) one specific language error.',
    E'**Planning tip:** 5-step arc — setup, excitement, turning point, reaction, outcome. Keep build-up to ~30% so you have space for what went WRONG and the resolution.',
    true);

  -- ─── TASK 6 (c) Descriptive ───────────────────────────────────────────
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2024, '1', '6c', 20, 'paid', 'essay',
    E'**Task 6: Extended writing — choose ONE topic (200–250 words)**\n\n**(c) — Descriptive essay**\n\n*My favourite hang-out spot*\n\nWrite an essay in which you GIVE A DESCRIPTION and say HOW YOU FELT THE FIRST TIME you went there.\n\nYour essay should be between **200 – 250 words** long.\n\nYou will receive up to **10 marks for the content**, and up to **10 marks for the style and accuracy** of your language.',
    E'**Mark scheme (DNEA 2024) — Descriptive essay**:\n\n**Content (10 marks) — two distinct halves**:\n• **Description (~60%)** — concrete sensory details (sight, sound, smell, touch, taste). Avoid "vibrant", "positive energy". Show, don''t tell.\n• **First-visit feelings (~40%)** — emotions you felt the FIRST time. Not motivations, not current feelings — INITIAL impressions.\n\n**Style and accuracy (10 marks):**\n• Rich vocabulary — adjectives, adverbs, similes/metaphors.\n• Present tense for description, past for first-visit narrative.\n• Clear paragraph separation between description and feelings.\n• No narrative drift — this is description, not a story.\n\n**Common pitfalls**: confusing "spot" with "sport" (soccer, netball); once-off destinations (Etosha, wedding venue); abstract places (brain, imagination); list of disconnected phrases.',
    E'AI marker: score against the scheme above. Output content /10 + language /10 + 3-4 sentences feedback covering (1) concreteness, (2) emotional honesty, (3) sensory range, (4) one specific language error.',
    E'**Planning tip:** pick a REAL place you go often. Brainstorm 5 sensory details (one per sense), then 3 first-visit emotions. Open with one arresting image, weave senses through 2–3 paragraphs, close with first-visit feelings.',
    true);

end $$;
