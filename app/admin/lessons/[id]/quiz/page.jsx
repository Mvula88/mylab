import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import QuizBuilder from "@/components/admin/QuizBuilder";
import { createClient } from "@/lib/supabase/server";
import { ensureActivity } from "./actions";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "Quiz · Admin" };

export default async function AdminLessonQuizPage({ params }) {
  const { id: lessonId } = await params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, title, slug, topic:topics(slug, subjects(slug, name))")
    .eq("id", lessonId)
    .single();
  if (!lesson) notFound();

  // Make sure there's an activity row (creates one if not).
  const activityId = await ensureActivity(lessonId);

  const [{ data: activity }, { data: questions }] = await Promise.all([
    supabase.from("activities").select("*").eq("id", activityId).single(),
    supabase.from("questions").select("*").eq("activity_id", activityId).order("sort_order"),
  ]);

  const learnerUrl = `/learn/${lesson.topic.subjects.slug}/${lesson.topic.slug}/${lesson.slug}/quiz`;

  return (
    <AdminShell current="/admin/lessons">
      <Link href={`/admin/lessons/${lessonId}`}
        className="inline-flex items-center gap-1 text-[10px] uppercase opacity-70 hover:opacity-100 mb-4"
        style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
        <ChevronLeft size={12} /> Back to lesson
      </Link>

      <div className="flex items-end justify-between flex-wrap gap-3 mb-2">
        <div>
          <div className="text-[11px] uppercase text-stone-500 mb-2"
            style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
            {lesson.topic.subjects.name} → {lesson.title}
          </div>
          <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: serif, fontWeight: 500 }}>
            Quiz <span style={{ color: "#c2185b", fontStyle: "italic" }}>builder</span>
          </h1>
        </div>
        <Link href={learnerUrl} target="_blank"
          className="inline-flex items-center gap-1 text-[10px] uppercase py-2 px-3"
          style={{ fontFamily: mono, letterSpacing: "0.22em",
            border: "1px solid rgba(26,31,46,0.35)" }}>
          Preview as learner <ExternalLink size={11} />
        </Link>
      </div>

      <p className="text-sm opacity-75 mb-8 max-w-2xl leading-snug">
        Add questions below. Auto-marked types (MCQ, True/False, Numeric, Fill-in) grade instantly.
        Free-text questions will use AI marking once Stage 4 is built.
      </p>

      <QuizBuilder lessonId={lessonId} activity={activity} questions={questions || []} />
    </AdminShell>
  );
}
