import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FlaskConical, PlayCircle, CheckCircle2, FileQuestion } from "lucide-react";
import PageShell from "@/components/PageShell";
import LessonActions from "@/components/LessonActions";
import LessonBody from "@/components/learner/LessonBody";
import { createClient } from "@/lib/supabase/server";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export async function generateMetadata({ params }) {
  const { lesson } = await params;
  return { title: `${lesson} · Practikal` };
}

export default async function LessonPage({ params }) {
  const { subject: subjectSlug, topic: topicSlug, lesson: lessonSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Resolve the lesson via the slug chain
  const { data: subject } = await supabase
    .from("subjects")
    .select("id, slug, name")
    .eq("slug", subjectSlug)
    .single();
  if (!subject) notFound();

  const { data: topic } = await supabase
    .from("topics")
    .select("id, slug, title")
    .eq("subject_id", subject.id)
    .eq("slug", topicSlug)
    .single();
  if (!topic) notFound();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, slug, title, body_md, video_url, lab_slug, is_published")
    .eq("topic_id", topic.id)
    .eq("slug", lessonSlug)
    .single();
  if (!lesson || !lesson.is_published) notFound();

  // Sibling lessons for "next" link
  const { data: siblings } = await supabase
    .from("lessons")
    .select("id, slug, title, sort_order")
    .eq("topic_id", topic.id)
    .eq("is_published", true)
    .order("sort_order");
  const idx = siblings?.findIndex((s) => s.id === lesson.id) ?? -1;
  const next = idx >= 0 ? siblings[idx + 1] : null;

  // Check if a published quiz exists for this lesson
  const { data: quizActivity } = await supabase
    .from("activities")
    .select("id, title, pass_threshold, questions(id)")
    .eq("lesson_id", lesson.id)
    .eq("slug", "quiz")
    .eq("is_published", true)
    .maybeSingle();
  const quizQuestionCount = quizActivity?.questions?.length || 0;

  // Mark as started (idempotent)
  if (user) {
    await supabase
      .from("lesson_progress")
      .upsert(
        { user_id: user.id, lesson_id: lesson.id, started_at: new Date().toISOString() },
        { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
      );
  }

  // Has this user already completed it?
  let alreadyCompleted = false;
  if (user) {
    const { data: prog } = await supabase
      .from("lesson_progress")
      .select("completed_at")
      .eq("user_id", user.id)
      .eq("lesson_id", lesson.id)
      .single();
    alreadyCompleted = !!prog?.completed_at;
  }

  return (
    <PageShell narrow>
      {/* breadcrumb */}
      <div className="text-[11px] uppercase text-stone-500 mb-4"
        style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
        <Link href="/learn" className="opacity-70 hover:opacity-100">Syllabus</Link>
        <span className="mx-2 opacity-40">/</span>
        <Link href={`/learn/${subject.slug}`} className="opacity-70 hover:opacity-100">{subject.name}</Link>
        <span className="mx-2 opacity-40">/</span>
        <span className="opacity-70">{topic.title}</span>
      </div>

      <h1 className="text-3xl sm:text-4xl leading-[1.1] mb-2" style={{ fontWeight: 500 }}>
        {lesson.title}
      </h1>
      {alreadyCompleted && (
        <div className="inline-flex items-center gap-1 text-[10px] uppercase mt-1 mb-6"
          style={{ fontFamily: mono, letterSpacing: "0.22em", color: "#2e7d32" }}>
          <CheckCircle2 size={12} /> completed
        </div>
      )}

      {/* video */}
      {lesson.video_url ? (
        <div className="my-8 relative overflow-hidden" style={{ aspectRatio: "16/9", backgroundColor: "#0c1019" }}>
          <video controls className="absolute inset-0 w-full h-full" src={lesson.video_url} />
        </div>
      ) : (
        <div className="my-8 p-6 border flex items-center gap-3"
          style={{ borderColor: "rgba(26,31,46,0.18)", backgroundColor: "rgba(26,31,46,0.03)" }}>
          <PlayCircle size={20} strokeWidth={1.5} className="opacity-60" />
          <p className="text-xs opacity-70 leading-snug" style={{ fontFamily: mono }}>
            No video yet for this lesson. The admin will upload one shortly.
          </p>
        </div>
      )}

      {/* body */}
      {lesson.body_md && (
        <div className="mb-10">
          <LessonBody>{lesson.body_md}</LessonBody>
        </div>
      )}

      {/* lab CTA */}
      {lesson.lab_slug && (
        <Link
          href={`/${lesson.lab_slug}?from=${subject.slug}/${topic.slug}/${lesson.slug}`}
          className="block my-8 p-5 transition hover:-translate-y-0.5"
          style={{
            backgroundColor: "#1a1f2e",
            color: "#e8e4d8",
            border: "1px solid #1a1f2e",
          }}
        >
          <div className="text-[10px] uppercase opacity-65 mb-1"
            style={{ fontFamily: mono, letterSpacing: "0.28em", color: "#ec407a" }}>
            Hands-on lab
          </div>
          <div className="text-xl mb-2 flex items-center gap-3" style={{ fontWeight: 500 }}>
            <FlaskConical size={20} strokeWidth={1.5} /> Open the interactive lab for this lesson
          </div>
          <p className="text-sm opacity-75 leading-snug">
            Run the experiment yourself. The 3D apparatus is drag-to-rotate; observations match the NSSCO mark scheme.
          </p>
          <div className="mt-3 text-[10px] uppercase flex items-center gap-1"
            style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
            Launch <ArrowRight size={11} />
          </div>
        </Link>
      )}

      {/* Quiz CTA */}
      {quizActivity && quizQuestionCount > 0 && (
        <Link
          href={`/learn/${subject.slug}/${topic.slug}/${lesson.slug}/quiz`}
          className="block my-8 p-5 transition hover:-translate-y-0.5"
          style={{
            backgroundColor: "rgba(236,64,122,0.08)",
            border: "1px solid rgba(236,64,122,0.35)",
          }}
        >
          <div className="text-[10px] uppercase opacity-70 mb-1"
            style={{ fontFamily: mono, letterSpacing: "0.28em", color: "#c2185b" }}>
            Check your understanding
          </div>
          <div className="text-xl mb-2 flex items-center gap-3" style={{ fontWeight: 500 }}>
            <FileQuestion size={20} strokeWidth={1.5} /> Take the quiz
          </div>
          <p className="text-sm opacity-75 leading-snug">
            {quizQuestionCount} question{quizQuestionCount === 1 ? '' : 's'} · auto-marked · pass mark {quizActivity.pass_threshold}%.
          </p>
          <div className="mt-3 text-[10px] uppercase flex items-center gap-1"
            style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
            Start <ArrowRight size={11} />
          </div>
        </Link>
      )}

      {/* actions: mark complete + next */}
      <div className="mt-10 pt-6 border-t border-stone-900/15">
        <LessonActions
          lessonId={lesson.id}
          alreadyCompleted={alreadyCompleted}
          nextHref={next ? `/learn/${subject.slug}/${topic.slug}/${next.slug}` : `/learn/${subject.slug}`}
          nextLabel={next ? `Next: ${next.title}` : `Back to ${subject.name}`}
        />
      </div>
    </PageShell>
  );
}
