-- ===========================================================================
-- NSSCO English Second Language 2023 Paper 1 (6109/1) — Reading and Writing
-- 70 marks total. Six tasks with verbatim reading passages embedded.
--   Q1 (Task 1) — 9 fill_in short-answer comprehension ("Smart, strong, beautiful or wise?")
--                 NB: Q7 has TWO sub-answers (a + b), so 10 marks total / 9 questions.
--   Q2 (Task 2) — 9 mcq multiple-matching (4 people on jobs)
--   Q3 (Task 3) — 1 free_text note-making (graphic novels), 8 marks
--   Q4 (Task 4) — 8 mcq (chocolatier interview)
--   Q5 (Task 5) — 1 essay guided article (15 marks)
--   Q6 (Task 6) — 3 essay alternatives (a/b/c, 20 marks each)
-- Answer keys + commentary from DNEA Examiners Report 2023 (pp. 195-200).
-- ===========================================================================

do $$
declare
  esl_id uuid;
  iq_stem text;
  jobs_stem text;
  novels_stem text;
  choc_stem text;
begin
  select id into esl_id from public.subjects where slug = 'english-second-language' limit 1;
  if esl_id is null then raise notice 'English Second Language subject not found'; return; end if;

  -- ─── PASSAGE 1: "Smart, strong, beautiful … or wise?" (Task 1) ─────────
  iq_stem := E'**SECTION A — READING**\n\n**Task 1 — "Smart, strong, beautiful … or wise?"**\n\nRead the following article and then answer the questions that follow.\n\n*Smart, strong, beautiful … or wise?*\n\nAre doctors, lawyers, biochemists and other very intelligent humans better or happier people than an average individual who is less intelligent?\n\nThere is, of course, the Intelligence Quotient (IQ) test to measure intelligence, but is this really the benchmark for a successful life – an idea that is surprisingly common amongst people? Critics have been questioning this test for years, especially since what is seen as intelligent in a two-year-old baby is not similar to that in a fifteen-year-old child or a forty-year-old adult. And of course, a high IQ cannot assure you success one day. Their critique is largely based on the fact that a high IQ tells researchers nothing about a test-taker''s creativity.\n\nInterest in intelligence dates back thousands of years. In 1905, French psychologist Alfred Binet developed the first IQ test. As time went on, psychologists refined the test and developed many more. The first IQ test wasn''t invented to measure intelligence but to measure the mental ability of children. The IQ test gained popularity in the early 20th century. However, today, it''s the sportsmen and models who are seen as examples of success, not because of their IQ, but because they earn more money than the super intelligent. We''re also taught by the media that fame and money is all we need to make us content in life.\n\nIf someone is not very smart, beautiful or sporty, is he or she less human now? No! You can''t reduce yourself to how symmetrical your nose is or how well you can catch a ball.\n\nResearch proves that the super-successful and smart ones are not necessarily the happiest people. We must therefore fight against a one-sided education system that measures intelligence by IQ. The IQ test, and what it implies about being human, is outdated and no longer applicable in our complex modern life.\n\nIt is true, however, that good knowledge of mathematics, the natural and commerce sciences, history, languages and computer science is definitely required in the adult world. It will make it easier to get a job that you might even like. While such knowledge is beneficial for a good adult life, I have complete faith in a healthy value system to maximise growth in every individual.\n\nThere''s a big difference between being smart and being wise. Do sums, play sports, smile at the camera if you like but practice your wisdom too. This will enhance good value systems. An intelligent person does well in tests and a wise person displays a good character. And happiness cannot be measured by an IQ test.\n\n*(Discover Magazine: July 2020)*';

  -- Q1
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '1(a)', 1, 'free', 'fill_in',
    iq_stem || E'\n\n**(a)** What do many people believe is the direct result of being intelligent?',
    jsonb_build_object('accepted', jsonb_build_array('a successful life','successful life')),
    E'Correct response: **a successful life** [1 mark]. Generally well answered. Answering in the form of a question ("but is this really the benchmark for a successful life") did not score.',
    E'Para 2: "the Intelligence Quotient (IQ) test to measure intelligence, but is this really the benchmark for a successful life…" — people believe intelligence leads to **a successful life**.',
    true);

  -- Q2
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '1(b)', 1, 'free', 'fill_in',
    iq_stem || E'\n\n**(b)** What is thought to be overlooked in an IQ test?',
    jsonb_build_object('accepted', jsonb_build_array('creativity','a test-taker''s creativity')),
    E'Correct response: **creativity** [1 mark]. Adding "nothing about a test-taker''s creativity" or misspellings ("test-takes", "testers") lost the mark.',
    E'"a high IQ tells researchers nothing about a test-taker''s creativity." The one-word answer: **creativity**.',
    true);

  -- Q3
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '1(c)', 1, 'free', 'fill_in',
    iq_stem || E'\n\n**(c)** What did early testing focus on?',
    jsonb_build_object('accepted', jsonb_build_array('mental ability of children','the mental ability of children')),
    E'Correct response: **mental ability of children** [1 mark]. Very well answered.',
    E'"The first IQ test wasn''t invented to measure intelligence but to measure the **mental ability of children**." — all 5 words required.',
    true);

  -- Q4
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '1(d)', 1, 'free', 'fill_in',
    iq_stem || E'\n\n**(d)** Why are famous people nowadays regarded as successful?',
    jsonb_build_object('must_contain', jsonb_build_array('more')),
    E'Correct response: **they earn more (money)** [1 mark]. Well answered.',
    E'"…sportsmen and models who are seen as examples of success, not because of their IQ, but because **they earn more money than the super intelligent**." Key word: **more**.',
    true);

  -- Q5
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '1(e)', 1, 'free', 'fill_in',
    iq_stem || E'\n\n**(e)** What influences people''s understanding of happiness nowadays?',
    jsonb_build_object('accepted', jsonb_build_array('media','the media')),
    E'Correct response: **(the) media** [1 mark]. Provided the most incorrect responses. Most candidates wrote "fame and money" — these are the RESULTS, not the cause. A grammatically unsound "media that fame and money" was not accepted.',
    E'"We''re also taught by the **media** that fame and money is all we need to make us content in life." — the influence is **(the) media**, not the things media teaches us about.',
    true);

  -- Q6
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '1(f)', 1, 'free', 'fill_in',
    iq_stem || E'\n\n**(f)** What needs to be challenged to address the overestimation of IQ tests?',
    jsonb_build_object('must_contain', jsonb_build_array('one-sided')),
    E'Correct response: **one-sided education system** [1 mark]. Well answered. Omitting "one-sided" lost the mark.',
    E'"We must therefore fight against a **one-sided education system** that measures intelligence by IQ." — keyword: **one-sided**.',
    true);

  -- Q7(a) — first answer for Q7 (worth 1 mark)
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '1(g)(i)', 1, 'free', 'fill_in',
    iq_stem || E'\n\n**(g)** According to the writer, why is it still important to do certain subjects at school? Give **two** reasons.\n\n**(i)** First reason',
    jsonb_build_object('accepted', jsonb_build_array('easier to get a job','to get a job','for a good adult life','for a good life')),
    E'Correct responses (either accepted in either box): **easier to get a job** OR **for a good (adult) life** [1 mark]. "Required in the adult world" or "healthy value systems" did not match the question.',
    E'"It will make it **easier to get a job** that you might even like. While such knowledge is beneficial **for a good adult life**…" — give either reason.',
    true);

  -- Q7(b) — second answer for Q7 (worth 1 mark)
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '1(g)(ii)', 1, 'free', 'fill_in',
    iq_stem || E'\n\n**(ii)** Second reason',
    jsonb_build_object('accepted', jsonb_build_array('for a good adult life','for a good life','easier to get a job','to get a job')),
    E'Correct responses (either accepted in either box): **for a good (adult) life** OR **easier to get a job** [1 mark]. The two reasons may be given in any order.',
    E'Same passage — give whichever reason was not used in (i).',
    true);

  -- Q8
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '1(h)', 1, 'free', 'fill_in',
    iq_stem || E'\n\n**(h)** What does the writer firmly believe in?',
    jsonb_build_object('must_contain', jsonb_build_array('healthy','value')),
    E'Correct response: **healthy value system** [1 mark]. Generally well answered. Omitting "healthy" or replacing with "health" failed; just "complete faith" did not score.',
    E'"I have complete faith in a **healthy value system** to maximise growth in every individual." — both "healthy" AND "value" required.',
    true);

  -- Q9
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '1(i)', 1, 'free', 'fill_in',
    iq_stem || E'\n\n**(i)** What is improved by using your wisdom?',
    jsonb_build_object('must_contain', jsonb_build_array('value')),
    E'Correct response: **good value systems** [1 mark]. Generally well attempted. Weaker candidates wrote "good character" — that''s what a wise person DISPLAYS, not what is improved.',
    E'"…practice your wisdom too. This will enhance **good value systems**." — answer: **good value systems**, not "good character".',
    true);

  -- ─── PASSAGE 2: Four people on jobs (Task 2) ──────────────────────────
  jobs_stem := E'**Task 2 — "Four people share their thoughts on their jobs"**\n\nRead the following article in which four people share their thoughts on their jobs.\n\n**A — Katongo**\nI am an online business owner, selling women''s clothing. I have always dreamed of doing my own thing and after the first few years of sheer panic, I feel much calmer. This will always be a risky job but ultimately a very rewarding one. It isn''t exactly the most ideal job in some people''s eyes, but I enjoy what I do, which for me, is more important. My job offers me independence, something I had strived to have my entire life. I earn enough to afford a nice, comfortable life, and the fact that I''m my own boss, gives me freedom to leave and travel whenever I feel like it. I usually take a vacation at times that a normal job would not have allowed. Looking at me now, travelling the world, what''s not to love?\n\n**B — Alex**\nAfter school I worked in a bank because they had a vacancy at that time. It''s a great job if you like sitting at the same desk every day surrounded by the same familiar faces. The most frustrating part of the job is that it isn''t leading anywhere career-wise. I respect my work and like the money I get from it, but I can''t imagine doing it forever. I really can''t. The routine kills me. There are days I just want to hand in my notice and walk away from it all. Those are the days when I realise that what I''m doing does not amount to much and is pretty pointless. I''d like to set myself up as a freelance photographer, but for now I will still keep on doing what I''m doing because I also do not see myself as a risk taker. I guess I''m too used to the security my job offers now.\n\n**C — Lee**\nI had a responsible job that I worked hard for. Most people would consider being an eye surgeon pretty rewarding both financially and emotionally. I wasn''t keen to leave, but the long shifts and the sheer volume of patients got me down. I wanted to use my knowledge and experience in other ways. I left my job and eventually started up my own business. I''m my own boss so I make my own decisions, which is very convenient and satisfactory. I have to be strict with myself about taking holidays though. I like the fact that it is a bit more routine than what I''m used to. I am not in contact with co-workers from my previous job and don''t miss that life at all. I don''t regret my decision for one minute. I''m doing the type of work that really suits me and my abilities.\n\n**D — Bongile**\nI worked in a busy studio as a radio copywriter, but was never made to feel welcome in the marketing department. I guess they just didn''t like my face. Otherwise, the work was fun and the money was good. However, that didn''t stop me from looking at what other people were doing and thinking that there were other jobs out there where I could make better use of my skills. Then I was spotted by one of the radio executives. He liked my way with words and gave me a presenting slot on a radio programme. I jumped at the chance, but underestimated the skills involved. Without training, the new job is proving difficult. It would have been better to start as an intern first to follow somebody experienced and learn the skills. But I just didn''t want to miss the great opportunity. However, now that I''ve been given this opportunity, I''m quite optimistic about making the best of it.\n\nFor each question, write the correct letter **A**, **B**, **C** or **D**.';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '2(a)', 1, 'free', 'mcq',
    jobs_stem || E'\n\n**(a)** Which person feels that the colleagues were unfriendly?',
    jsonb_build_array(jsonb_build_object('id','A','text','Katongo'),jsonb_build_object('id','B','text','Alex'),jsonb_build_object('id','C','text','Lee'),jsonb_build_object('id','D','text','Bongile')),
    to_jsonb('D'::text),
    E'**D — Bongile** [1 mark].',
    E'Bongile: "was never made to feel welcome in the marketing department. I guess they just didn''t like my face."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '2(b)', 1, 'free', 'mcq',
    jobs_stem || E'\n\n**(b)** Which person has got used to the uncertainty of the job?',
    jsonb_build_array(jsonb_build_object('id','A','text','Katongo'),jsonb_build_object('id','B','text','Alex'),jsonb_build_object('id','C','text','Lee'),jsonb_build_object('id','D','text','Bongile')),
    to_jsonb('A'::text),
    E'**A — Katongo** [1 mark]. Challenging.',
    E'Katongo: "after the first few years of sheer panic, I feel much calmer. This will always be a risky job but ultimately a very rewarding one." — got used to the risk/uncertainty.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '2(c)', 1, 'free', 'mcq',
    jobs_stem || E'\n\n**(c)** Which person is hopeful about the future?',
    jsonb_build_array(jsonb_build_object('id','A','text','Katongo'),jsonb_build_object('id','B','text','Alex'),jsonb_build_object('id','C','text','Lee'),jsonb_build_object('id','D','text','Bongile')),
    to_jsonb('D'::text),
    E'**D — Bongile** [1 mark].',
    E'Bongile closes: "now that I''ve been given this opportunity, I''m quite optimistic about making the best of it."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '2(d)', 1, 'free', 'mcq',
    jobs_stem || E'\n\n**(d)** Which person lacks a sense of purpose?',
    jsonb_build_array(jsonb_build_object('id','A','text','Katongo'),jsonb_build_object('id','B','text','Alex'),jsonb_build_object('id','C','text','Lee'),jsonb_build_object('id','D','text','Bongile')),
    to_jsonb('B'::text),
    E'**B — Alex** [1 mark]. Challenging.',
    E'Alex: "what I''m doing does not amount to much and is pretty pointless." — feeling of no purpose.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '2(e)', 1, 'free', 'mcq',
    jobs_stem || E'\n\n**(e)** Which person had a problem with the workload?',
    jsonb_build_array(jsonb_build_object('id','A','text','Katongo'),jsonb_build_object('id','B','text','Alex'),jsonb_build_object('id','C','text','Lee'),jsonb_build_object('id','D','text','Bongile')),
    to_jsonb('C'::text),
    E'**C — Lee** [1 mark].',
    E'Lee: "the long shifts and the sheer volume of patients got me down."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '2(f)', 1, 'free', 'mcq',
    jobs_stem || E'\n\n**(f)** Which person enjoys the flexibility the job offers?',
    jsonb_build_array(jsonb_build_object('id','A','text','Katongo'),jsonb_build_object('id','B','text','Alex'),jsonb_build_object('id','C','text','Lee'),jsonb_build_object('id','D','text','Bongile')),
    to_jsonb('A'::text),
    E'**A — Katongo** [1 mark].',
    E'Katongo: "I''m my own boss, gives me freedom to leave and travel whenever I feel like it. I usually take a vacation at times that a normal job would not have allowed."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '2(g)', 1, 'free', 'mcq',
    jobs_stem || E'\n\n**(g)** Which person needed more of a challenge?',
    jsonb_build_array(jsonb_build_object('id','A','text','Katongo'),jsonb_build_object('id','B','text','Alex'),jsonb_build_object('id','C','text','Lee'),jsonb_build_object('id','D','text','Bongile')),
    to_jsonb('D'::text),
    E'**D — Bongile** [1 mark]. Challenging.',
    E'Bongile: "looking at what other people were doing and thinking that there were other jobs out there where I could make better use of my skills."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '2(h)', 1, 'free', 'mcq',
    jobs_stem || E'\n\n**(h)** Which person is happy to feel in control?',
    jsonb_build_array(jsonb_build_object('id','A','text','Katongo'),jsonb_build_object('id','B','text','Alex'),jsonb_build_object('id','C','text','Lee'),jsonb_build_object('id','D','text','Bongile')),
    to_jsonb('C'::text),
    E'**C — Lee** [1 mark].',
    E'Lee: "I''m my own boss so I make my own decisions, which is very convenient and satisfactory."',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '2(i)', 1, 'free', 'mcq',
    jobs_stem || E'\n\n**(i)** Which person feels there are no prospects of promotion?',
    jsonb_build_array(jsonb_build_object('id','A','text','Katongo'),jsonb_build_object('id','B','text','Alex'),jsonb_build_object('id','C','text','Lee'),jsonb_build_object('id','D','text','Bongile')),
    to_jsonb('B'::text),
    E'**B — Alex** [1 mark].',
    E'Alex: "The most frustrating part of the job is that it isn''t leading anywhere career-wise."',
    true);

  -- ─── PASSAGE 3: "Beyond words" / graphic novels (Task 3) ──────────────
  novels_stem := E'**Task 3 — Note-making: "Beyond words" (graphic novels)**\n\nRead the following article about graphic novels and then complete the notes that follow.\n\n*Beyond words*\n\nGraphic novels, or comics, have earned a reputation over the years for being all superheroes, sidekicks and saving the day. But while there''s certainly a rich tradition of high-action comic-book heroes, there''s far more to this exciting and ever-evolving art form than that. Their clever storytelling makes for a much wider and diverse following.\n\nWhile compilations of comic strips and cartoon stories have been published in comic books form since the 1920s, the birth of the modern graphic novel began in the 1970s. The turn of the 21st century proved to be a golden period for graphic novels.\n\nThere are a huge number of graphic novels out there and the variety can feel overwhelming, but the process of choosing any new book should be fun. If this is still new to you, you can go to the library where you can browse different graphic novels. This is a good way to get to see what is out there. Just think about what kind of stories you enjoy. Do you want to laugh? Cry? Learn something new? Do you want to commit to a large series or stick with a stand-alone story? And then there''s the artwork! All graphic novels contain a lot of pictures, but some have more words than others. Consider how much you can comfortably read and how much you''ll learn from the artwork.\n\nSome illustrations specialise in highly detailed scenes, while others use a more minimalistic style. Some use lots of bright colours to get their point across, others prefer to stick to black, white and grey. This is all a matter of personal taste. Try reading different styles and genres and you''ll soon discover which ones you like best.\n\nAdmittedly, graphic novels were often banished to the darkest corner of the library, or tucked away in specialist bookshops, but with their popularity on the rise, more and more are finding their way into the mainstream.\n\nWhen approaching graphic novels, it''s important to be open to a new reading experience. For example, where a text would describe a person''s face, a graphic novel can show what it looks like. Graphic novels provide deeper worlds to be explored, full of spaces, colours and compositions that convey meaning and tone. Even the shape of the panels adds something that cannot be found in a traditional book. A great aspect is their ability to use multiple forms of communication. In reality, we communicate more with facial expression and body language than with the written or spoken word. Our eyes and movements can tell the truth when our voice may not.\n\nThe dialogue and longer texts in graphic novels are combined to make them easy and quick to read. This is especially helpful in our increasingly hurried lives, since many people simply do not have much time for pleasure reading.\n\nFor the reluctant reader who is intimidated by the word-filled pages of traditional books, graphic novels introduce readers to the pleasures of reading by providing new ways to comprehend stories through images and words. The plots are captivating with exciting twists and turns to keep the reader engaged. Even younger children who aren''t interested in reading are more likely to read graphic novels.\n\nTake pleasure in how these books engage so many senses, and enjoy!\n\n*(Adapted: Teen Breathe Magazine: February 2022)*';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2023, '1', '3', 8, 'paid', 'free_text',
    novels_stem || E'\n\n**(3)** You are going to give a talk about graphic novels during the Readathon week. Make short notes under each heading as the basis of your talk. **The first one has been done for you.**\n\nUse this format (one note per bullet, on its own line, under the correct heading):\n\n**Tips for people who are new to reading graphic novels** *(up to 3 marks — each note should start with a VERB)*\n• browse different graphic novels at your library. *(given)*\n• \n• \n• \n\n**The appeal of graphic novels** *(up to 5 marks)*\n• \n• \n• \n• \n•',
    E'**Possible answers (DNEA mark scheme):**\n\n**Tips for people who are new to reading graphic novels** (max 3 — verb required):\n• browse different graphic novels at your library. *(given)*\n1. Think about what kind of stories you enjoy\n2. Consider how much you can comfortably read\n3. Consider how much you''ll learn from the artwork\n4. Try reading different styles and genres\n5. Be open to a new reading experience\n\n**The appeal of graphic novels** (max 5):\n6. Clever storytelling\n7. Provide deeper worlds to be explored\n8. Use multiple forms of communication\n9. Easy and quick to read\n10. Provide new ways to comprehend stories\n11. Plots are captivating\n12. (these books) engage so many senses\n\n**NOTE:** Correct responses only earn the mark IF placed under the correct heading.',
    E'Award up to 3 marks for heading 1, up to 5 for heading 2 (total max 8). Each acceptable note in the right place = 1 mark. Notes that paraphrase but obscure meaning, in the wrong section, or combine two ideas on one bullet do not score. Verbs are required for heading 1 items.',
    E'**Self-study tip:** copy the heading structure exactly, ONE idea per bullet, lift wording from the text where possible. For heading 1 (Tips), start each note with a verb (Think, Consider, Try, Be). Heading 2 is more generous (5 marks across 7 possible answers) — list the strongest 5.',
    true);

  -- ─── PASSAGE 4: "A career in chocolate" (Task 4) ──────────────────────
  choc_stem := E'**Task 4 — "A career in chocolate"**\n\nRead the following article about a chocolatier and then answer the questions that follow.\n\n*A career in chocolate*\n\nIn 2009, Ann turned her passion for chocolate into a business making raw chocolate. She started doing this, after realising how delicious, easy and healthy it was and how little access people had to it. She thought there was a definite need for healthy chocolate.\n\nHer job involves coming up with more nutritious chocolate combinations and then building them into amazing, edible treats, which excites her a lot. She also makes time to teach upcoming, but very talented chocolatiers about her style of chocolate. To hear them say that she has inspired them makes her feel very proud. Almost as much, in fact, as seeing all her beautiful creations being sold in upmarket outlets. It''s far more rewarding than any award she has ever received.\n\nWhen she decided to start her own business, she knew being self-employed would be demanding. That, and the fact that she wouldn''t have a workplace to go to in the morning, was a strange idea. The most worrying aspect was her unfamiliarity with the world of chocolate – she is a qualified lawyer. Many people find knowing how to produce lots of different types of chocolate creations quite difficult and prefer to specialise in one type only. Ann thinks that you should not limit yourself.\n\n"When you start your own thing, there is so much information at your fingertips which is good and scary at the same time." Her relatives believed in her dream and were her first customers. Ann encountered many other business people and entrepreneurs and was surprised by how many tips she managed to get from them, particularly from other women in the business and networking groups. In general, every entrepreneur needs to get as much support as they can and should not be scared of making mistakes. It is a good idea for them to work out the financial implications, from packaging to marketing and unexpected costs. Formal qualifications are not always needed, but Ann strongly suggests that they learn from and speak to as many different experts and people in the industry as possible.\n\nAnn does a lot of face-to-face marketing through demos and workshops in store. She loves seeing people''s faces when they try her raw chocolate recipes for the first time. Her biggest wish is to enable people to make delicious, raw chocolates and she aims to reach everyone who is looking for more nutritious substitutes. "It is amazing to see women who love cooking, baking and eating healthily." A lot of adolescents keep coming back for more and she is thinking about creating something specifically for them. She is also followed by a circle of exclusive and sophisticated chocoholics who indulge in her authentic and original creations.\n\nAnyone can pursue a chocolatier career. "Of course the expectation is to come up with original concepts all the time and to be technically strong in your executions, but this comes from constantly focusing on getting better. It''s making the effort to keep doing that, every single day, which is essential. Without that, you would not succeed." Ann further says the moment you think that you''ve mastered it all, you might as well give up. Her job has moments when there is far too much work and you''re moving from one job to the next and from one creation to the next. The rare occasions she has to go out to work at a client''s place add a little diversity to the workplace experience. "You have to learn to welcome the unexpected, and make the most of the quieter times when they happen, because they don''t usually last long." The repetitiveness of a typical job would have been frustrating.\n\nAnn hardly gets time off, but on the odd occasion that she does, she loves getting together with her family and watching TV. She still spends a lot of her free time with activities related to her work – like researching new combinations. She''s also always very keen to read up on what others in the field are up to, but nothing gives her as much as pleasure as sitting in her garden quietly and listening to the humming of insects.\n\n*(Adapted: TalentedLadiesClub.com/Nov. 2021)*';

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '4(a)', 1, 'free', 'mcq',
    choc_stem || E'\n\n**(a)** What does Ann like most about her job?',
    jsonb_build_array(jsonb_build_object('id','A','text','working with extremely good chocolatiers'),jsonb_build_object('id','B','text','getting her end-product in shops'),jsonb_build_object('id','C','text','creating different types of chocolates'),jsonb_build_object('id','D','text','receiving prizes for the quality of her work')),
    to_jsonb('B'::text),
    E'**B** [1 mark].',
    E'"…seeing all her beautiful creations being sold in upmarket outlets. It''s far more rewarding than any award she has ever received." Getting her product in shops = B.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '4(b)', 1, 'free', 'mcq',
    choc_stem || E'\n\n**(b)** What did Ann find particularly challenging about her job?',
    jsonb_build_array(jsonb_build_object('id','A','text','creating a wide range of chocolates'),jsonb_build_object('id','B','text','having no official office space'),jsonb_build_object('id','C','text','knowing very little about the industry'),jsonb_build_object('id','D','text','working on her own all the time')),
    to_jsonb('C'::text),
    E'**C** [1 mark].',
    E'"The most worrying aspect was her unfamiliarity with the world of chocolate – she is a qualified lawyer." Coming from law into chocolate = knowing very little about the industry (C).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '4(c)', 1, 'free', 'mcq',
    choc_stem || E'\n\n**(c)** What did Ann find easier than expected?',
    jsonb_build_array(jsonb_build_object('id','A','text','making sales early on'),jsonb_build_object('id','B','text','getting the support of her family'),jsonb_build_object('id','C','text','finding available information'),jsonb_build_object('id','D','text','getting advice from peers')),
    to_jsonb('D'::text),
    E'**D** [1 mark]. Challenging.',
    E'"Ann encountered many other business people and entrepreneurs and was **surprised by how many tips she managed to get** from them, particularly from other women in the business and networking groups." Surprised = easier than expected. Advice from peers = D.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '4(d)', 1, 'free', 'mcq',
    choc_stem || E'\n\n**(d)** Ann recommends that people who would like to start their own business should …',
    jsonb_build_array(jsonb_build_object('id','A','text','consult a range of professionals.'),jsonb_build_object('id','B','text','understand that it is trial and error.'),jsonb_build_object('id','C','text','work out all possible costing involved.'),jsonb_build_object('id','D','text','get a certificate where necessary.')),
    to_jsonb('A'::text),
    E'**A** [1 mark]. Challenging.',
    E'"Ann strongly suggests that they learn from and speak to as many different experts and people in the industry as possible." = consult a range of professionals (A).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '4(e)', 1, 'free', 'mcq',
    choc_stem || E'\n\n**(e)** Ann''s ideal customers are …',
    jsonb_build_array(jsonb_build_object('id','A','text','high-end chocolate lovers.'),jsonb_build_object('id','B','text','youth who show interest in her.'),jsonb_build_object('id','C','text','people wanting healthy alternatives.'),jsonb_build_object('id','D','text','women who love cooking and baking.')),
    to_jsonb('C'::text),
    E'**C** [1 mark]. Challenging.',
    E'"Her biggest wish is to enable people to make delicious, raw chocolates and she aims to reach everyone who is looking for more **nutritious substitutes**." = people wanting healthy alternatives (C). The other options name specific groups but C captures the IDEAL — everyone looking for healthy alternatives.',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '4(f)', 1, 'free', 'mcq',
    choc_stem || E'\n\n**(f)** Ann believes the most important factor to consider for a chocolatier is their …',
    jsonb_build_array(jsonb_build_object('id','A','text','motivation to keep improving.'),jsonb_build_object('id','B','text','excellent skills as a chocolatier.'),jsonb_build_object('id','C','text','consistent ability to be creative.'),jsonb_build_object('id','D','text','over-confident attitude.')),
    to_jsonb('A'::text),
    E'**A** [1 mark].',
    E'"…this comes from constantly focusing on getting better. It''s making the effort to keep doing that, every single day, which is essential. Without that, you would not succeed." = motivation to keep improving (A).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '4(g)', 1, 'free', 'mcq',
    choc_stem || E'\n\n**(g)** What does Ann say about a typical working week?',
    jsonb_build_array(jsonb_build_object('id','A','text','Every week is extremely busy.'),jsonb_build_object('id','B','text','No two weeks are the same.'),jsonb_build_object('id','C','text','There is a routine to how things are done.'),jsonb_build_object('id','D','text','Each week involves a lot of travel.')),
    to_jsonb('B'::text),
    E'**B** [1 mark]. Challenging.',
    E'"Her job has moments when there is far too much work… The rare occasions she has to go out to work at a client''s place add a little diversity… make the most of the quieter times when they happen, because they don''t usually last long." Constantly varied = no two weeks are the same (B).',
    true);

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, options, correct, memo, explanation, is_published) values (
    esl_id, 2023, '1', '4(h)', 1, 'free', 'mcq',
    choc_stem || E'\n\n**(h)** What does Ann most enjoy doing in her free time?',
    jsonb_build_array(jsonb_build_object('id','A','text','spending time with her loved ones'),jsonb_build_object('id','B','text','researching new recipes'),jsonb_build_object('id','C','text','spending time outdoors'),jsonb_build_object('id','D','text','comparing her business with others')),
    to_jsonb('C'::text),
    E'**C** [1 mark].',
    E'"nothing gives her as much as pleasure as sitting in her garden quietly and listening to the humming of insects." = spending time outdoors (C). She also loves family/TV and research, but the strongest enjoyment is the garden.',
    true);

  -- ─── TASK 5: Guided article writing (15 marks) ────────────────────────
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2023, '1', '5', 15, 'paid', 'essay',
    E'**SECTION B — WRITING**\n\n**Task 5: Guided writing — Article (100–150 words)**\n\nYour school has started a new health and fitness club and you were asked to promote the club so that more learners can join.\n\nWrite an **article for the school newspaper** to encourage learners to join the new club.\n\nIn your article, you should:\n\n• describe what ACTIVITIES the club will offer,\n• explain how learners would BENEFIT from joining the club,\n• say what you are MOST LOOKING FORWARD TO and why.\n\nYour article should be between **100 to 150 words** long.\n\nYou will receive up to **8 marks for the content**, and up to **7 marks for the style and accuracy** of your language.',
    E'**Mark scheme (DNEA 2023):**\n\n**Content (8 marks)** — all three prompts addressed AND interconnected:\n• **Prompt 1 (ACTIVITIES)**: list HEALTH and FITNESS activities (running, yoga, gym sessions, healthy cooking demos, nutrition workshops, dance fitness, swimming). NOT random clubs like debate/English/science. The "gym" alone is not a single activity.\n• **Prompt 2 (BENEFITS)**: link to health and fitness specifically — improved stamina, better posture, weight management, stress relief, healthier eating habits, energy for studies. Don''t repeat prompt 1.\n• **Prompt 3 (LOOKING FORWARD)**: pick ONE specific aspect and say WHY in 1-2 sentences. "Meeting new friends through the club", "trying my first yoga class", etc.\n\n**Style and accuracy (7 marks)**:\n• Format: article with a HEADING + clear paragraphs (NOT a "grocery list").\n• Register: appropriate for a school newspaper — engaging, direct, not too formal.\n• Tense: mostly future tense ("will offer", "you will gain"), with reflective sentences in prompt 3.\n• Mechanics: capitals, full stops, paragraph breaks.\n\n**Common pitfalls**: writing about an existing club (the task says NEW); writing about a launch day; misinterpreting "club" as a bar/nightclub; listing benefits like "travel overseas" or "professional soccer"; ignoring "health and fitness".',
    E'AI marker: score this response against the mark scheme above. Output BOTH a content mark out of 8 AND a language mark out of 7, plus 2-3 sentences of feedback identifying the strongest prompt and the weakest.',
    E'**Self-study tips:**\n1. Open with a catchy HEADING — e.g. "Get Fit, Stay Strong: Join the New H&F Club!"\n2. Paragraph 1: introduce the club (it''s NEW, who can join, where it meets).\n3. Paragraph 2: 3-4 health/fitness activities.\n4. Paragraph 3: 2-3 concrete benefits.\n5. Paragraph 4: your personal excitement + a closing call to action.\n6. Aim for 120 words — within range, no padding.',
    true);

  -- ─── TASK 6 (a) Argumentative ─────────────────────────────────────────
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2023, '1', '6a', 20, 'paid', 'essay',
    E'**Task 6: Extended writing — choose ONE topic (200–250 words)**\n\n**(a) — Argumentative essay**\n\n*The youth of today attach too much importance to buying and wearing fashionable and branded clothes.* Write an essay expressing your views.\n\nWrite about **200 – 250 words**.\n\nYou will receive up to **10 marks for the content**, and up to **10 marks for the style and accuracy** of your language.',
    E'**Mark scheme (DNEA 2023) — Argumentative essay**:\n\n**Content (10 marks):**\n• **Clear stance** — agree, disagree, or qualified.\n• **3–4 strong reasons** with examples (peer pressure, social media influence, self-expression, brand prestige, cost vs. value).\n• Focus on the **YOUTH OF TODAY** — not all age groups.\n• Distinguish between "fashionable" (currently trendy styles) and "branded" (named labels like Nike, Adidas, Gucci).\n• Take a position on whether they attach TOO MUCH importance (or not).\n• Counter-argument and rebuttal raise the band.\n\n**Style and accuracy (10 marks):**\n• Argumentative register — modals (should, would, must), discourse markers (firstly, however, in contrast, therefore).\n• Topic-related vocabulary (peer pressure, materialism, identity, status symbol, brand loyalty).\n• Mechanics, paragraphing, punctuation.\n\n**Common pitfalls**: writing generally about clothes; describing what young people wear without taking a stance; conflating fashionable and branded; advising parents/youth; focusing on consequences without arguing.',
    E'AI marker: score against the scheme above. Output content /10 + language /10 + 3-4 sentences feedback covering (1) clarity of stance, (2) reasoning, (3) discourse markers, (4) one specific language error to fix.',
    E'**Planning tip:** decide your side fast and hold it.\n• YES (they DO attach too much importance): drives debt, distracts from studies, breeds materialism, peer pressure causes anxiety.\n• NO (it''s not excessive): clothes = self-expression, branded items are durable, fashion supports the economy and creative industries.\nStructure: intro (stance), 2-3 supporting paragraphs, counter+rebuttal, conclusion.',
    true);

  -- ─── TASK 6 (b) Narrative ─────────────────────────────────────────────
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2023, '1', '6b', 20, 'paid', 'essay',
    E'**Task 6: Extended writing — choose ONE topic (200–250 words)**\n\n**(b) — Narrative essay**\n\n*"I will never forget that day at school."* Write a story in which you share what happened that made the day unforgettable.\n\nWrite about **200 – 250 words**.\n\nYou will receive up to **10 marks for the content**, and up to **10 marks for the style and accuracy** of your language.',
    E'**Mark scheme (DNEA 2023) — Narrative essay**:\n\n**Content (10 marks):**\n• **ONE DAY** at school — not a hostel experience, not a holiday, not multiple days.\n• **Memorable incident must happen AT SCHOOL** (or directly tied to a school event), not at home or a shop.\n• **Coherent storyline** with clear beginning → middle → end.\n• **Effective conclusion** — show why the day is unforgettable.\n• Avoid: drinking, drugs, sexual content, violent fights — these were flagged as disturbing scenarios.\n• Realistic and age-appropriate detail.\n\n**Style and accuracy (10 marks):**\n• Past tense throughout (simple, continuous, perfect).\n• Time connectives (first, then, suddenly, finally).\n• Direct speech rewarded if punctuated correctly.\n• Vivid description.\n\n**Common pitfalls**: writing about a hostel (not the same as school); off-school incidents; multi-day stories; no resolution; cliché or disturbing scenarios.',
    E'AI marker: score against the scheme above. Output content /10 + language /10 + 3-4 sentences feedback covering (1) clarity of "unforgettable" event, (2) coherence of plot, (3) tense consistency, (4) one specific language error to fix.',
    E'**Planning tip:** 5-step arc on ONE day at school:\n1. Setup — ordinary school day, who was there.\n2. Hint — small detail signalling something different.\n3. Event — the unforgettable thing happens (a competition won, a brave act, a teacher''s kindness, an embarrassing moment).\n4. Reaction — how you/others felt.\n5. Reflection — one closing sentence on why it sticks with you.\nAvoid violent or inappropriate content — pick something age-appropriate.',
    true);

  -- ─── TASK 6 (c) Descriptive (self) ────────────────────────────────────
  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2023, '1', '6c', 20, 'paid', 'essay',
    E'**Task 6: Extended writing — choose ONE topic (200–250 words)**\n\n**(c) — Descriptive essay**\n\n*"I am unique."* Write an essay in which you express the qualities/characteristics that make you so unique.\n\nWrite about **200 – 250 words**.\n\nYou will receive up to **10 marks for the content**, and up to **10 marks for the style and accuracy** of your language.',
    E'**Mark scheme (DNEA 2023) — Descriptive essay (self)**:\n\n**Content (10 marks):**\n• **Specific qualities/characteristics** (not generic "I am kind" — give examples that SHOW the quality).\n• Mix of **physical traits, personality, talents, beliefs, experiences** that combine to make YOU unique.\n• Each quality supported with a brief example or scenario.\n• Personal and genuine voice — first person.\n• Avoid clichés ("I am beautiful inside and out") without backing them up.\n\n**Style and accuracy (10 marks):**\n• Mostly present tense ("I am", "I love", "I believe"), with occasional past for examples.\n• Adjectives, adverbs, similes used purposefully.\n• Cohesion: each paragraph tied to a distinct quality.\n• Mechanics, paragraphing, punctuation.\n\n**Common pitfalls**: listing generic adjectives without examples; writing about what others say about you instead of what YOU are; turning into a CV (achievements list) instead of a portrait.',
    E'AI marker: score against the scheme above. Output content /10 + language /10 + 3-4 sentences feedback covering (1) concreteness of qualities, (2) personal voice, (3) sentence variety, (4) one specific language error to fix.',
    E'**Planning tip:** pick 3-4 specific qualities that combine to make you unique:\n• ONE physical/inherited (left-handed, height, voice, ethnicity)\n• ONE personality trait (curious, patient, stubborn) — with a SCENARIO\n• ONE talent or interest (music, drawing, coding, sport, languages)\n• ONE belief or value (faith, family loyalty, honesty)\nFor each, SHOW not TELL — give a 1-2 sentence example. Open with one arresting image of yourself; close with a sentence on why this combination matters.',
    true);

end $$;
