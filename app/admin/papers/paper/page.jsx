import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { Plus, ChevronLeft, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "Paper · Admin" };

export default async function PaperViewPage({ searchParams }) {
  const sp = await searchParams;
  const subjectId = sp?.subject;
  const year = sp?.year;
  const no = sp?.no;
  if (!subjectId || !year || !no) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/papers");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/me?error=admin-only");

  const { data: subject } = await supabase
    .from("subjects").select("id, name").eq("id", subjectId).single();
  if (!subject) notFound();

  const { data: questions } = await supabase
    .from("past_paper_questions")
    .select("id, q_number, marks, type, tier, prompt, memo, is_published, topic_id, topics(title)")
    .eq("subject_id", subjectId)
    .eq("paper_year", year)
    .eq("paper_no", no)
    .order("q_number");

  const addUrl = `/admin/papers/new?subject=${subjectId}&year=${year}&no=${encodeURIComponent(no)}`;

  return (
    <AdminShell current="/admin/papers">
      <div className="mb-6">
        <Link href="/admin/papers" className="inline-flex items-center gap-1 text-xs opacity-70 hover:opacity-100 mb-3">
          <ChevronLeft size={14} /> Back to papers
        </Link>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-[11px] uppercase text-stone-500 mb-3"
              style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
              {subject.name}
            </div>
            <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: serif, fontWeight: 500 }}>
              {year} · Paper {no}
            </h1>
            <p className="text-sm opacity-75 mt-2">
              {questions?.length || 0} question{questions?.length === 1 ? "" : "s"} ·
              {" "}{(questions || []).reduce((s, q) => s + q.marks, 0)} marks total
            </p>
          </div>
          <Link
            href={addUrl}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase"
            style={{
              fontFamily: mono, letterSpacing: "0.18em",
              backgroundColor: "#1a1f2e", color: "#e8e4d8",
            }}
          >
            <Plus size={13} /> Add another question to this paper
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {(questions || []).map((q) => (
          <article key={q.id} className="border p-4" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-baseline gap-3">
                <div className="text-lg" style={{ fontFamily: serif, fontWeight: 500 }}>Q{q.q_number}</div>
                <div className="text-[10px] uppercase opacity-60" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>
                  {q.type} · {q.tier} · {q.marks} mark{q.marks === 1 ? "" : "s"}
                </div>
                {q.topics?.title && (
                  <div className="text-xs opacity-60">Topic: {q.topics.title}</div>
                )}
              </div>
              {!q.is_published && (
                <div className="inline-flex items-center gap-1 text-[10px] text-amber-700">
                  <AlertCircle size={12} /> draft
                </div>
              )}
            </div>
            <div className="text-sm leading-snug whitespace-pre-wrap">{q.prompt}</div>
            {q.memo && (
              <details className="mt-2 text-xs opacity-70">
                <summary className="cursor-pointer">Memo</summary>
                <div className="mt-1 p-2 bg-stone-100 whitespace-pre-wrap">{q.memo}</div>
              </details>
            )}
          </article>
        ))}
        {(!questions || questions.length === 0) && (
          <div className="border p-6 text-center text-sm opacity-70" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
            No questions yet on this paper. Add the first one →
          </div>
        )}
      </div>
    </AdminShell>
  );
}
