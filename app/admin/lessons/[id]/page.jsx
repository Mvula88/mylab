import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink, FileQuestion } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import LessonForm from "@/components/admin/LessonForm";
import { createClient } from "@/lib/supabase/server";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "Edit lesson · Admin" };

export default async function EditLessonPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const justCreated = sp?.created === "1";

  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*, topic:topics(id, slug, title, subject_id, subjects(id, slug, name))")
    .eq("id", id)
    .single();
  if (!lesson) notFound();

  const learnerUrl = `/learn/${lesson.topic.subjects.slug}/${lesson.topic.slug}/${lesson.slug}`;

  return (
    <AdminShell current="/admin/lessons">
      <Link href="/admin/lessons"
        className="inline-flex items-center gap-1 text-[10px] uppercase opacity-70 hover:opacity-100 mb-4"
        style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
        <ChevronLeft size={12} /> Back to lessons
      </Link>

      <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
        <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: serif, fontWeight: 500 }}>
          Edit lesson
        </h1>
        <div className="flex items-center gap-2">
          <Link href={`/admin/lessons/${id}/quiz`}
            className="inline-flex items-center gap-1 text-[10px] uppercase py-2 px-3"
            style={{ fontFamily: mono, letterSpacing: "0.22em",
              border: "1px solid rgba(26,31,46,0.35)" }}>
            <FileQuestion size={11} /> Manage quiz
          </Link>
          <Link href={learnerUrl} target="_blank"
            className="inline-flex items-center gap-1 text-[10px] uppercase py-2 px-3"
            style={{ fontFamily: mono, letterSpacing: "0.22em",
              border: "1px solid rgba(26,31,46,0.35)" }}>
            View as learner <ExternalLink size={11} />
          </Link>
        </div>
      </div>

      {justCreated && (
        <div className="mb-6 text-[11px] px-3 py-2 border"
          style={{
            borderColor: "rgba(46,125,50,0.4)",
            backgroundColor: "rgba(46,125,50,0.06)",
            color: "#2e7d32",
            fontFamily: mono,
          }}
        >
          Lesson created. You can now upload the video and refine the content.
        </div>
      )}

      <LessonForm mode="edit" lesson={lesson} subjects={[]} topics={[]} />
    </AdminShell>
  );
}
