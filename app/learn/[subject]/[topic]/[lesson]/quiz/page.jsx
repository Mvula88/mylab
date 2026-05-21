import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import PageShell from "@/components/PageShell";
import QuizTaker from "@/components/learner/QuizTaker";
import { createClient } from "@/lib/supabase/server";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "Quiz · Practikal" };

export default async function LearnerQuizPage({ params }) {
  const { subject, topic, lesson } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: lessonRow } = await supabase
    .from("lessons")
    .select("id, title, slug, topic:topics(slug, subjects(slug, name))")
    .eq("slug", lesson)
    .single();
  if (!lessonRow) notFound();

  const { data: activity } = await supabase
    .from("activities")
    .select("*")
    .eq("lesson_id", lessonRow.id)
    .eq("slug", "quiz")
    .eq("is_published", true)
    .maybeSingle();

  if (!activity) {
    return (
      <PageShell narrow>
        <BackToLesson subject={subject} topic={topic} lesson={lesson} title={lessonRow.title} />
        <h1 className="text-3xl mb-4" style={{ fontFamily: serif, fontWeight: 500 }}>
          No quiz yet
        </h1>
        <p className="text-sm opacity-75 leading-snug">
          The teacher hasn't published a quiz for this lesson yet. Check back later.
        </p>
      </PageShell>
    );
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("activity_id", activity.id)
    .order("sort_order");

  return (
    <PageShell narrow>
      <BackToLesson subject={subject} topic={topic} lesson={lesson} title={lessonRow.title} />

      <div className="text-[11px] uppercase text-stone-500 mb-3"
        style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
        {lessonRow.topic.subjects.name} · Quiz
      </div>
      <h1 className="text-3xl sm:text-4xl mb-3" style={{ fontFamily: serif, fontWeight: 500 }}>
        {activity.title}
      </h1>
      {activity.instructions && (
        <p className="text-sm opacity-80 mb-6 leading-snug">{activity.instructions}</p>
      )}
      <div className="text-[10px] uppercase opacity-60 mb-8"
        style={{ fontFamily: mono, letterSpacing: '0.22em' }}>
        {questions?.length || 0} questions · pass mark {activity.pass_threshold}%
      </div>

      {!user ? (
        <div className="p-6 border" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
          <p className="text-sm">
            <Link href={`/login?next=/learn/${subject}/${topic}/${lesson}/quiz`} className="underline">Sign in</Link> to take this quiz.
          </p>
        </div>
      ) : (questions?.length ?? 0) === 0 ? (
        <p className="text-sm opacity-75">No questions yet — your teacher is still building this quiz.</p>
      ) : (
        <QuizTaker
          activity={activity}
          questions={questions}
          slugs={{ subject, topic, lesson }}
        />
      )}
    </PageShell>
  );
}

function BackToLesson({ subject, topic, lesson, title }) {
  return (
    <Link href={`/learn/${subject}/${topic}/${lesson}`}
      className="inline-flex items-center gap-1 text-[10px] uppercase opacity-70 hover:opacity-100 mb-4"
      style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
      <ChevronLeft size={12} /> Back to {title}
    </Link>
  );
}
