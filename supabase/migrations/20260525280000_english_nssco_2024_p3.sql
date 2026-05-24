-- ===========================================================================
-- NSSCO English as a Second Language 2024 Paper 3 (6109/3) — Speaking
-- 30 marks total. 5 Speaking Assessment Cards (A-E); the examiner picks ONE
-- for each candidate. Each card has 5 prompts. The conversation is recorded.
-- Marking: 3 bands (Structure / Vocabulary / Development & Fluency),
-- each /10, total /30. From DNEA Examiner''s Notes (page 7 of 6109/3/EX).
--
-- For self-study, we model each card as ONE essay-style question. The
-- learner types out what they would say across the 5 prompts. AI marks the
-- response against the 3-band rubric.
-- ===========================================================================

do $$
declare
  esl_id uuid;
begin
  select id into esl_id from public.subjects where slug = 'english-second-language' limit 1;
  if esl_id is null then raise notice 'English Second Language subject not found'; return; end if;

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ SPEAKING CARD A — Communication (30 marks)                          ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    esl_id, 2024, '3', 'A', 30, 'paid',
    'essay',
    E'**Speaking Card A: Communication**\n\n*There are several ways people communicate with each other.*\n\nDiscuss the topic using the following prompts, in the order given below:\n\n• a good conversation you had with someone, and what happened\n• different ways young and old people communicate, and why\n• whether it is easy to start a conversation with people you do not know\n• the opinion that social media influences how people communicate with each other\n• the idea that animals and people can communicate with each other.\n\nYou may introduce related ideas of your own to expand on these prompts.\n\n*Write your full response below as if you were speaking it in the test (you can practise saying it aloud first). Aim for 6–9 minutes of content (~250–400 words). AI will mark against the 3-band Speaking Assessment Grid: Structure /10, Vocabulary /10, Development & Fluency /10.*',
    E'**Speaking Assessment Criteria Grid — 3 bands × 10 marks (total 30):**\n\n**STRUCTURE (10)** — sentence construction, tenses, subject-verb agreement, pronouns, voice, simple/compound/complex sentences:\n• 9–10: range of structures used accurately and consistently, confidently in control.\n• 7–8: generally accurate range, errors only on complex sentences.\n• 5–6: simple structures used securely; venture beyond them with difficulty.\n• 3–4: very limited, errors restrict communication.\n• 1–2: rarely achieves communication.\n\n**VOCABULARY (10)** — choice, variety, paraphrase, synonyms:\n• 9–10: precise; shades of meaning; sophisticated ideas.\n• 7–8: sufficient range; conveys information confidently.\n• 5–6: simple ideas clear, but not fully successful.\n• 3–4: restricted; hesitation, repetition, searching for words.\n• 1–2: insufficient even for simple ideas.\n\n**DEVELOPMENT & FLUENCY (10)** — sustaining conversation, expanding, pronunciation, intonation, flow, pauses:\n• 9–10: sustained, responds to change of direction, original ideas, clear pronunciation.\n• 7–8: competent, relevant responses at length, generally clear.\n• 5–6: effort to respond; not fully successful; understandable.\n• 3–4: brief, widely spaced responses; some pronunciation difficulty.\n• 1–2: too brief to communicate; pronunciation causes serious difficulty.\n\n**Marking note:** the three bands are interconnected. It is NOT permissible to skip a band (e.g. you cannot award 8 for Structure, 4 for Vocabulary, 7 for D&F).',
    E'AI marker: score the response against the 3-band grid above. Output a mark out of 10 for EACH band (Structure, Vocabulary, Development & Fluency) PLUS a total /30. Give 2-3 sentences of feedback per band identifying one strength and one specific thing to work on. Be lenient: this grid is designed to credit positive achievement (NSSCO standard, not native-speaker).',
    E'**Card-specific tips (from DNEA 2024 commentary):**\n• Prompt 1: tell a SPECIFIC story — face-to-face? phone? what was discussed? what was the outcome?\n• Prompt 2: name 2-3 communication methods young people use (WhatsApp, TikTok, voice notes) AND name what older people use (face-to-face, letters, phone calls). Then explain WHY — older people prefer concentration / fewer interruptions, younger people prefer speed / multimedia.\n• Prompt 3: state your view AND give a reason — fear of reaction, shyness, language barrier.\n• Prompt 4: discuss BOTH sides — social media connects distant people, but reduces face-to-face talk and causes cyberbullying.\n• Prompt 5: humans → animals through tone, body language, hand signals; pets understand commands; animals → animals through scent, dance (bees), calls. Talk about pets at home if you have them.',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ SPEAKING CARD B — Shopping (30 marks)                               ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    esl_id, 2024, '3', 'B', 30, 'paid',
    'essay',
    E'**Speaking Card B: Shopping**\n\n*Recently, our shopping habits have been changing as the way we live changes.*\n\nDiscuss the topic using the following prompts, in the order given below:\n\n• a time when you went shopping, and what happened\n• whether you prefer to shop alone or with other people\n• how often you shop and where you shop\n• the idea that people prefer visiting large shopping centres to small shops\n• the suggestion that, in the future, we will buy online instead of buying in shops.\n\nYou may introduce related ideas of your own to expand on these prompts.\n\n*Write your full response below as if speaking. Aim for 6–9 minutes (~250–400 words). AI marks against the 3-band Speaking Grid: Structure /10, Vocabulary /10, Development & Fluency /10.*',
    E'**Speaking Assessment Criteria Grid — 3 bands × 10 marks (total 30):** Structure / Vocabulary / Development & Fluency (descriptors as for Card A). Bands are interconnected — do not skip.',
    E'AI marker: score the response against the 3-band grid. Output a mark per band + total /30 + 2-3 sentences of feedback per band (1 strength, 1 specific weakness).',
    E'**Card-specific tips:**\n• Prompt 1: pick ONE memorable shopping trip; what went well/wrong; who was there.\n• Prompt 2: state preference (alone for speed; with friends for opinions/fun) and give 1-2 reasons.\n• Prompt 3: rough frequency (e.g. weekly groceries with parents, monthly clothes shopping), and name the shops/markets you go to.\n• Prompt 4: argue one side — large centres offer variety and convenience BUT small shops are personal, support locals, and feel safer.\n• Prompt 5: predict — online shopping will grow because of delivery, comparison, and selection — BUT shops will survive for experience, social aspect, and trying things on.',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ SPEAKING CARD C — Parties (30 marks)                                ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    esl_id, 2024, '3', 'C', 30, 'paid',
    'essay',
    E'**Speaking Card C: Parties**\n\n*Parties are a good way to get together to celebrate a good occasion.*\n\nDiscuss the topic using the following prompts, in the order given below:\n\n• a party you remember going to, and what happened\n• what people do to organise a party\n• types of parties that are popular in your neighbourhood and why\n• the belief that a party is only good when there is good music\n• the challenges of having uninvited guests at a party.\n\nYou may introduce related ideas of your own to expand on these prompts.\n\n*Write your full response below as if speaking. Aim for 6–9 minutes (~250–400 words). AI marks against the 3-band Speaking Grid: Structure /10, Vocabulary /10, Development & Fluency /10.*',
    E'**Speaking Assessment Criteria Grid — 3 bands × 10 marks (total 30):** Structure / Vocabulary / Development & Fluency (descriptors as for Card A). Bands are interconnected — do not skip.',
    E'AI marker: score the response against the 3-band grid. Output a mark per band + total /30 + 2-3 sentences of feedback per band (1 strength, 1 specific weakness).',
    E'**Card-specific tips:**\n• Prompt 1: ONE specific party — birthday, wedding, traditional ceremony. Who, where, what happened.\n• Prompt 2: STEPS to organise — guest list, venue, food, music, decorations, invitations.\n• Prompt 3: name local party types — birthdays, weddings, baby showers, traditional ceremonies, Amapiano nights — and say WHY each is popular.\n• Prompt 4: argue both sides — yes, music sets mood and energy; no, food/people/conversation also matter.\n• Prompt 5: uninvited guests = embarrassment, not enough food, security risks, hosts feel disrespected.',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ SPEAKING CARD D — Daily life (30 marks)                             ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    esl_id, 2024, '3', 'D', 30, 'paid',
    'essay',
    E'**Speaking Card D: Daily life**\n\n*Our lives are changing more quickly now than in the past.*\n\nDiscuss the topic using the following prompts, in the order given below:\n\n• how you and your family spend a normal day\n• something that your grandparents used to do that you don''t now do\n• whether having the same daily routine every day is boring\n• the idea that traditions are dying out due to changes in how we live\n• the idea that in the future technology will change our daily lives.\n\nYou may introduce related ideas of your own to expand on these prompts.\n\n*Write your full response below as if speaking. Aim for 6–9 minutes (~250–400 words). AI marks against the 3-band Speaking Grid: Structure /10, Vocabulary /10, Development & Fluency /10.*',
    E'**Speaking Assessment Criteria Grid — 3 bands × 10 marks (total 30):** Structure / Vocabulary / Development & Fluency (descriptors as for Card A). Bands are interconnected — do not skip.',
    E'AI marker: score the response against the 3-band grid. Output a mark per band + total /30 + 2-3 sentences of feedback per band (1 strength, 1 specific weakness).',
    E'**Card-specific tips:**\n• Prompt 1: walk through one day — wake-up, school/chores, lunch, afternoon, evening. Use present simple ("I wake up at 6, then I…").\n• Prompt 2: contrast — grandparents fetched water from the well / wrote letters / ground their own grain; we use taps / phones / supermarket flour.\n• Prompt 3: give a view AND a reason — yes, predictability dulls; no, routine creates focus and reduces stress.\n• Prompt 4: yes, traditions are fading because of urbanisation and technology; no, many families still keep cultural ceremonies and language.\n• Prompt 5: tech in future — AI assistants, smart homes, drones, online school, electric cars — give 2-3 specific predictions.',
    true
  );

  -- ╔══════════════════════════════════════════════════════════════════════╗
  -- ║ SPEAKING CARD E — Making decisions (30 marks)                       ║
  -- ╚══════════════════════════════════════════════════════════════════════╝

  insert into public.past_paper_questions (
    subject_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, memo, rubric, explanation, is_published
  ) values (
    esl_id, 2024, '3', 'E', 30, 'paid',
    'essay',
    E'**Speaking Card E: Making decisions**\n\n*Life is all about the decisions we make. Some we regret, some we''re proud of.*\n\nDiscuss the topic using the following prompts, in the order given below:\n\n• decisions teenagers face every day\n• a situation in which you had to make a decision, and what happened\n• whether it is better to take your time or make a quick decision\n• what you should do if you realise you have made a bad decision\n• the opinion that parents should make decisions for their children.\n\nYou may introduce related ideas of your own to expand on these prompts.\n\n*Write your full response below as if speaking. Aim for 6–9 minutes (~250–400 words). AI marks against the 3-band Speaking Grid: Structure /10, Vocabulary /10, Development & Fluency /10.*',
    E'**Speaking Assessment Criteria Grid — 3 bands × 10 marks (total 30):** Structure / Vocabulary / Development & Fluency (descriptors as for Card A). Bands are interconnected — do not skip.',
    E'AI marker: score the response against the 3-band grid. Output a mark per band + total /30 + 2-3 sentences of feedback per band (1 strength, 1 specific weakness).',
    E'**Card-specific tips:**\n• Prompt 1: name common teen decisions — friend group, what to wear, study vs. play, peer pressure, social media use, subject choices.\n• Prompt 2: ONE story — what was the choice, who advised you, what did you decide, what happened.\n• Prompt 3: argue both sides — quick decisions for emergencies; careful thinking for big life choices (career, money).\n• Prompt 4: steps after a bad decision — admit it, apologise if needed, learn the lesson, plan how to recover.\n• Prompt 5: balanced view — young children need parents'' guidance; teenagers should be allowed practice with smaller decisions to build judgement.',
    true
  );

end $$;
