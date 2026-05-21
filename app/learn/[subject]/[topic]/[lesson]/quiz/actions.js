'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { gradeQuestion, summarise } from '@/lib/grade';

export async function submitQuiz({ activityId, responses, subjectSlug, topicSlug, lessonSlug }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Sign in to submit.' };

  // Fetch the activity + questions on the server so the learner can't tamper.
  const [{ data: activity }, { data: questions }] = await Promise.all([
    supabase.from('activities').select('id, pass_threshold').eq('id', activityId).single(),
    supabase.from('questions').select('*').eq('activity_id', activityId).order('sort_order'),
  ]);
  if (!activity) return { error: 'Quiz not found.' };

  // Create the attempt
  const { data: attempt, error: attemptErr } = await supabase
    .from('activity_attempts')
    .insert({ user_id: user.id, activity_id: activityId, started_at: new Date().toISOString() })
    .select('id')
    .single();
  if (attemptErr) return { error: attemptErr.message };

  // Grade each question + insert response rows
  const gradedRows = (questions || []).map((q) => {
    const responseValue = responses[q.id];
    const result = gradeQuestion(q, responseValue);
    return {
      attempt_id: attempt.id,
      question_id: q.id,
      response: responseValue ?? null,
      is_correct: result.isCorrect,
      points_awarded: result.pointsAwarded,
      feedback: result.feedback,
      points: q.points,
    };
  });

  if (gradedRows.length) {
    const insertable = gradedRows.map(({ points, ...r }) => r);
    const { error: respErr } = await supabase.from('question_responses').insert(insertable);
    if (respErr) return { error: respErr.message };
  }

  const summary = summarise(gradedRows);
  const passed = summary.percent >= (activity.pass_threshold ?? 60);

  await supabase
    .from('activity_attempts')
    .update({
      submitted_at: new Date().toISOString(),
      score: summary.score,
      max_score: summary.maxScore,
      passed,
    })
    .eq('id', attempt.id);

  revalidatePath(`/learn/${subjectSlug}/${topicSlug}/${lessonSlug}/quiz`);
  return { ok: true, attemptId: attempt.id };
}
