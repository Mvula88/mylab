import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, FlaskConical, PlayCircle, CheckCircle2, Circle } from "lucide-react";
import PageShell from "@/components/PageShell";
import { createClient } from "@/lib/supabase/server";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export async function generateMetadata({ params }) {
  const { subject } = await params;
  return { title: `${subject} · Practikal` };
}

export default async function SubjectPage({ params }) {
  const { subject: subjectSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: subject } = await supabase
    .from("subjects")
    .select("id, slug, name, blurb, has_labs, curriculum, category")
    .eq("slug", subjectSlug)
    .single();
  if (!subject) notFound();

  const { data: topics } = await supabase
    .from("topics")
    .select("id, slug, title, blurb, sort_order, lessons(id, slug, title, lab_slug, video_url, is_published, sort_order)")
    .eq("subject_id", subject.id)
    .order("sort_order");

  // Pull this learner's completed lesson ids for tick marks
  let completedIds = new Set();
  if (user) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id, completed_at")
      .eq("user_id", user.id);
    completedIds = new Set((progress || []).filter((p) => p.completed_at).map((p) => p.lesson_id));
  }

  const lessonCount = (topics || []).reduce((n, t) => n + (t.lessons?.filter((l) => l.is_published).length || 0), 0);
  const labCount = (topics || []).reduce((n, t) => n + (t.lessons?.filter((l) => l.is_published && l.lab_slug).length || 0), 0);

  return (
    <PageShell>
      <div className="text-[11px] uppercase text-stone-500 mb-3"
        style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
        <Link href="/learn" className="opacity-70 hover:opacity-100">Syllabus</Link>
        <span className="mx-2 opacity-40">/</span>
        {subject.name}
      </div>
      <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-4 max-w-3xl" style={{ fontWeight: 500 }}>
        {subject.name}
      </h1>
      {subject.blurb && <p className="text-base opacity-80 max-w-2xl mb-8 leading-snug">{subject.blurb}</p>}

      <div className="flex gap-6 pb-6 mb-10 border-b border-stone-900/15 text-[10px] uppercase opacity-70"
        style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
        <span>{topics?.length || 0} topics</span>
        <span>{lessonCount} lessons</span>
        {subject.has_labs && <span>{labCount} hands-on labs</span>}
      </div>

      {(topics || []).length === 0 ? (
        <div className="p-8 border" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
          <p className="text-sm opacity-75">
            No topics published yet for {subject.name}. The admin can add them from the dashboard.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {topics.map((topic, i) => {
            const lessons = (topic.lessons || []).filter((l) => l.is_published).sort((a, b) => a.sort_order - b.sort_order);
            return (
              <section key={topic.id}>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-[11px] uppercase opacity-55"
                    style={{ fontFamily: mono, letterSpacing: "0.28em", color: "#ec407a" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl" style={{ fontWeight: 500 }}>{topic.title}</h2>
                </div>
                {topic.blurb && (
                  <p className="text-sm opacity-70 mb-3 max-w-2xl leading-snug">{topic.blurb}</p>
                )}
                {lessons.length === 0 ? (
                  <p className="text-xs opacity-55" style={{ fontFamily: mono }}>
                    No lessons yet.
                  </p>
                ) : (
                  <div className="border-t border-stone-900/10">
                    {lessons.map((lesson) => {
                      const done = completedIds.has(lesson.id);
                      return (
                        <Link
                          key={lesson.id}
                          href={`/learn/${subject.slug}/${topic.slug}/${lesson.slug}`}
                          className="flex items-center justify-between gap-3 py-3 px-2 -mx-2 border-b border-stone-900/10 hover:bg-stone-900/5 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {done ? (
                              <CheckCircle2 size={16} strokeWidth={1.8} style={{ color: "#2e7d32" }} />
                            ) : (
                              <Circle size={16} strokeWidth={1.5} className="opacity-35" />
                            )}
                            <div className="min-w-0">
                              <div className="text-sm" style={{ fontWeight: 500 }}>{lesson.title}</div>
                              <div className="flex gap-3 mt-0.5 text-[10px] opacity-60"
                                style={{ fontFamily: mono, letterSpacing: "0.12em" }}>
                                {lesson.video_url && <span className="inline-flex items-center gap-1"><PlayCircle size={11} /> video</span>}
                                {lesson.lab_slug && <span className="inline-flex items-center gap-1"><FlaskConical size={11} /> lab</span>}
                              </div>
                            </div>
                          </div>
                          <ChevronRight size={16} className="opacity-40 shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
