import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import PageShell from "@/components/PageShell";
import QuizResult from "@/components/learner/QuizResult";
import { createClient } from "@/lib/supabase/server";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "Quiz result · Practikal" };

export default async function QuizResultPage({ params }) {
  const { subject, topic, lesson, attemptId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/learn/${subject}/${topic}/${lesson}/quiz/result/${attemptId}`);

  const { data: attempt } = await supabase
    .from("activity_attempts")
    .select("*, activities(*, lessons(*, topic:topics(*, subjects(*))))")
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .single();
  if (!attempt) notFound();

  const [{ data: questions }, { data: responses }] = await Promise.all([
    supabase.from("questions").select("*").eq("activity_id", attempt.activity_id).order("sort_order"),
    supabase.from("question_responses").select("*").eq("attempt_id", attemptId),
  ]);

  // Find the next published lesson in this topic (if any) for the "Next" button
  const topicId = attempt.activities?.lessons?.topic?.id;
  const currentSortOrder = attempt.activities?.lessons?.sort_order ?? 0;
  let nextLessonHref = null;
  if (topicId) {
    const { data: nextLesson } = await supabase
      .from("lessons")
      .select("slug, sort_order")
      .eq("topic_id", topicId)
      .eq("is_published", true)
      .gt("sort_order", currentSortOrder)
      .order("sort_order")
      .limit(1)
      .maybeSingle();
    if (nextLesson) nextLessonHref = `/learn/${subject}/${topic}/${nextLesson.slug}`;
  }

  // Also mark the lesson complete once they've attempted the quiz
  await supabase
    .from("lesson_progress")
    .upsert(
      {
        user_id: user.id,
        lesson_id: attempt.activities.lessons.id,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );

  return (
    <PageShell narrow>
      <Link href={`/learn/${subject}/${topic}/${lesson}/quiz`}
        className="inline-flex items-center gap-1 text-[10px] uppercase opacity-70 hover:opacity-100 mb-4"
        style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
        <ChevronLeft size={12} /> Back to quiz
      </Link>

      <div className="text-[11px] uppercase text-stone-500 mb-3"
        style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
        {attempt.activities.lessons.topic.subjects.name} · Quiz result
      </div>
      <h1 className="text-3xl sm:text-4xl mb-8" style={{ fontFamily: serif, fontWeight: 500 }}>
        {attempt.activities.title}
      </h1>

      <QuizResult
        attempt={attempt}
        activity={attempt.activities}
        questions={questions || []}
        responses={responses || []}
        slugs={{ subject, topic, lesson }}
        nextLessonHref={nextLessonHref}
      />
    </PageShell>
  );
}
