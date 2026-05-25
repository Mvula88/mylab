-- ===========================================================================
-- NSSCO English Second Language 2023 Paper 3 (6109/3) — Speaking
-- 30 marks total. 5 Speaking Cards (A-E); the examiner picks ONE per
-- candidate. Each card has 5 prompts. The conversation is recorded.
-- Marking: 3 bands (Structure / Vocabulary / Development & Fluency),
-- each /10, total /30. From DNEA Examiner's Notes 2023 (page 7).
--
-- Cards 2023: A Relaxing, B Animals, C Books, D Mobile phones, E Privacy
-- ===========================================================================

do $$
declare
  esl_id uuid;
begin
  select id into esl_id from public.subjects where slug = 'english-second-language' limit 1;
  if esl_id is null then raise notice 'English Second Language subject not found'; return; end if;

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ SPEAKING CARD A — Relaxing                                          ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2023, '3', 'A', 30, 'paid', 'essay',
    E'**Speaking Card A: Relaxing**\n\n*Some people don''t always find enough time to relax because of their busy lifestyles.*\n\nDiscuss the topic using the following prompts, in the order given below:\n\n• how you normally spend your free time\n• the activities that usually keep people busy and why\n• your advice on what schools can do to help learners relax\n• the view that people nowadays have more ways to relax than in the past\n• the view that relaxing is the same as wasting time.\n\nYou may introduce related ideas of your own to expand on these prompts.\n\n*Write your full response below as if you were speaking it. Aim for 6–9 minutes (~250–400 words). AI will mark against the 3-band Speaking Assessment Grid: Structure /10, Vocabulary /10, Development & Fluency /10.*',
    E'**Speaking Assessment Criteria Grid — 3 bands × 10 marks (total 30):**\n\n**STRUCTURE (10)** — sentences, tenses, subject-verb agreement, pronouns, sentence types:\n• 9–10: range of accurate structures, confidently in control.\n• 7–8: generally accurate, errors on complex sentences.\n• 5–6: simple structures secure, difficulty venturing further.\n• 3–4: limited, errors restrict communication.\n• 1–2: rarely achieves communication.\n\n**VOCABULARY (10)** — choice, variety, paraphrase, synonyms:\n• 9–10: precise; shades of meaning; sophisticated.\n• 7–8: sufficient; competent.\n• 5–6: simple ideas clear, not fully successful.\n• 3–4: restricted; hesitation, repetition.\n• 1–2: insufficient for simple ideas.\n\n**DEVELOPMENT & FLUENCY (10)** — sustaining, expanding, pronunciation, flow:\n• 9–10: sustained, original ideas, clear pronunciation.\n• 7–8: competent, relevant at length, generally clear.\n• 5–6: effort needed; understandable.\n• 3–4: brief, widely spaced; some pronunciation difficulty.\n• 1–2: too brief; serious pronunciation issues.\n\n**Marking note:** bands are interconnected. Examiners must NOT skip a band.',
    E'AI marker: score against the 3-band grid. Output a mark out of 10 for EACH band (Structure, Vocabulary, Development & Fluency) PLUS a total /30. Give 2-3 sentences feedback per band with one strength and one specific weakness.',
    E'**Card-specific tips:**\n• Prompt 1: name 2-3 specific free-time activities (reading, sport, music, time with friends).\n• Prompt 2: list things that keep people busy (work, school, chores, social media) + why (responsibilities, deadlines, financial pressure).\n• Prompt 3: practical school suggestions (longer breaks, relaxation/meditation sessions, sports facilities, mental health support).\n• Prompt 4: balanced view — more digital tools (Netflix, gaming, social) BUT also more pressure and notifications.\n• Prompt 5: argue both sides — relaxing reduces stress and improves focus, but excessive idle time can waste opportunities.',
    true);

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ SPEAKING CARD B — Animals                                           ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2023, '3', 'B', 30, 'paid', 'essay',
    E'**Speaking Card B: Animals**\n\n*People and animals have lived next to each other for a long time.*\n\nDiscuss the topic using the following prompts, in the order given below:\n\n• your favourite animal and why you like it\n• ways animals can help people in their everyday lives\n• whether it is possible for any animals to live in cities\n• the idea that wild animals should not be kept in zoos\n• the opinion that protecting all animals, and the environment, should be our priority.\n\nYou may introduce related ideas of your own to expand on these prompts.\n\n*Write your full response below as if you were speaking it. Aim for 6–9 minutes (~250–400 words). AI marks against the 3-band Speaking Grid: Structure /10, Vocabulary /10, Development & Fluency /10.*',
    E'**Speaking Assessment Criteria Grid — 3 bands × 10 marks (total 30):** Structure / Vocabulary / Development & Fluency (descriptors as for Card A). Bands are interconnected — do not skip.',
    E'AI marker: score against the 3-band grid. Output a mark per band + total /30 + 2-3 sentences feedback per band (1 strength, 1 specific weakness).',
    E'**Card-specific tips (DNEA 2023 noted candidates struggled with zoos vs. nature reserves and wild vs. domestic):**\n• Prompt 1: name ONE specific animal (dog, cheetah, elephant, parrot) and give 2-3 reasons.\n• Prompt 2: working animals — guide dogs, K9 police dogs, donkeys for transport, cats for pest control, livestock for food.\n• Prompt 3: distinguish DOMESTIC city animals (pets, pigeons, rats, sometimes monkeys/peacocks) from WILD animals — most wild animals cannot adapt to cities.\n• Prompt 4: argue both sides — zoos give education and breeding programmes for endangered species, BUT animals lose freedom and natural behaviour; NATURE RESERVES are different (larger, more natural).\n• Prompt 5: priority for environment — humans depend on biodiversity for food, climate, medicine; counterargument — humans also need development.',
    true);

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ SPEAKING CARD C — Books                                             ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2023, '3', 'C', 30, 'paid', 'essay',
    E'**Speaking Card C: Books**\n\n*Many people enjoy reading different types of books in their spare time.*\n\nDiscuss the topic using the following prompts, in the order given below:\n\n• your favourite type of book and why you like it\n• a book you read as a child and what it was about\n• reasons why people should read\n• whether what people enjoy reading changes as they get older\n• the view that the information we find on the internet is just as reliable as the information we find in books.\n\nYou may introduce related ideas of your own to expand on these prompts.\n\n*Write your full response below as if you were speaking it. Aim for 6–9 minutes (~250–400 words). AI marks against the 3-band Speaking Grid: Structure /10, Vocabulary /10, Development & Fluency /10.*',
    E'**Speaking Assessment Criteria Grid — 3 bands × 10 marks (total 30):** Structure / Vocabulary / Development & Fluency (descriptors as for Card A). Bands are interconnected — do not skip.',
    E'AI marker: score against the 3-band grid. Output a mark per band + total /30 + 2-3 sentences feedback per band (1 strength, 1 specific weakness).',
    E'**Card-specific tips (DNEA 2023 noted that "most candidates do not read" — try to do better):**\n• Prompt 1: pick a SPECIFIC genre (fiction/fantasy/biography/poetry) and explain WHY (relaxation, learning, imagination).\n• Prompt 2: name a CHILDHOOD book and give a 2-3 sentence plot summary. If you can''t remember one, name a textbook or folk tale you read.\n• Prompt 3: reasons — vocabulary, knowledge, imagination, empathy, escape from screens, exam preparation.\n• Prompt 4: yes — picture books → chapter books → YA → adult novels. Tastes mature with experience.\n• Prompt 5: argue both sides — internet is fast and free BUT can be inaccurate; books are checked and edited BUT may be outdated. Verify both.',
    true);

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ SPEAKING CARD D — Mobile phones                                     ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2023, '3', 'D', 30, 'paid', 'essay',
    E'**Speaking Card D: Mobile phones**\n\n*Many people have a mobile phone nowadays and would find life difficult without it.*\n\nDiscuss the topic using the following prompts, in the order given below:\n\n• what you, and other people you know, use mobile phones for\n• places where people shouldn''t use their mobile phones, and why\n• the opinion that there should be an age limit on when children can have their own mobile phone\n• the idea that learners should be allowed to have their mobile phones in lessons to help them learn\n• the view that mobile phones have already replaced most face-to-face communication.\n\nYou may introduce related ideas of your own to expand on these prompts.\n\n*Write your full response below as if you were speaking it. Aim for 6–9 minutes (~250–400 words). AI marks against the 3-band Speaking Grid: Structure /10, Vocabulary /10, Development & Fluency /10.*',
    E'**Speaking Assessment Criteria Grid — 3 bands × 10 marks (total 30):** Structure / Vocabulary / Development & Fluency (descriptors as for Card A). Bands are interconnected — do not skip.',
    E'AI marker: score against the 3-band grid. Output a mark per band + total /30 + 2-3 sentences feedback per band (1 strength, 1 specific weakness).',
    E'**Card-specific tips:**\n• Prompt 1: name 4-5 uses (calls, messages, social media, maps, payments, school work, photos, music). Then note who in your family uses it for what (e.g. mum for banking, dad for news).\n• Prompt 2: name places + reasons (cinemas — disturbs others; petrol stations — fire risk; while driving — accidents; classrooms — distraction; hospitals — interferes with equipment).\n• Prompt 3: argue both sides — limit (focus, screen time, safety, cyberbullying) vs. no limit (safety contact with parents, learning, responsibility).\n• Prompt 4: yes for some uses (research, calculator, language apps) BUT no for others (cheating, distraction, social media). Suggest controlled use.\n• Prompt 5: balanced — phones reduce face-to-face conversation BUT also connect people far away. The QUALITY of in-person time is what matters.',
    true);

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ SPEAKING CARD E — Privacy                                           ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  insert into public.past_paper_questions (subject_id, paper_year, paper_no, q_number, marks, tier, type, prompt, memo, rubric, explanation, is_published) values (
    esl_id, 2023, '3', 'E', 30, 'paid', 'essay',
    E'**Speaking Card E: Privacy**\n\n*Everybody likes to spend some time on their own and keep some things private from others.*\n\nDiscuss the topic using the following prompts, in the order given below:\n\n• things that you prefer to do on your own and why\n• an occasion when you spent time with a lot of people, and what happened\n• reasons why people like to spend time on their own\n• the idea that social media takes away our privacy\n• whether it is right for the media to publish news about the lives of famous people.\n\nYou may introduce related ideas of your own to expand on these prompts.\n\n*Write your full response below as if you were speaking it. Aim for 6–9 minutes (~250–400 words). AI marks against the 3-band Speaking Grid: Structure /10, Vocabulary /10, Development & Fluency /10.*',
    E'**Speaking Assessment Criteria Grid — 3 bands × 10 marks (total 30):** Structure / Vocabulary / Development & Fluency (descriptors as for Card A). Bands are interconnected — do not skip.',
    E'AI marker: score against the 3-band grid. Output a mark per band + total /30 + 2-3 sentences feedback per band (1 strength, 1 specific weakness).',
    E'**Card-specific tips:**\n• Prompt 1: 2-3 things you prefer alone (reading, studying, listening to music) + WHY (concentration, recharging, introvert nature).\n• Prompt 2: ONE specific occasion (wedding, festival, school trip) — what happened, how you felt about being surrounded by people.\n• Prompt 3: reasons — reduce stimulation, think clearly, recharge, pursue solo hobbies, deal with emotions.\n• Prompt 4: yes — public posts, location sharing, photos, data collection by apps; counter — users can control privacy settings.\n• Prompt 5: argue both sides — public figures accept reduced privacy as a trade-off for fame; BUT their families and private lives still deserve protection (e.g. children).',
    true);

end $$;
