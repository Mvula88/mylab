import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { Plus, ScrollText, ChevronRight, CircleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "Past papers · Admin" };

export default async function AdminPapersPage({ searchParams }) {
  const sp = await searchParams;
  const filterSubject = sp?.subject || "";
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/papers");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/me?error=admin-only");

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, slug, name, category")
    .order("category")
    .order("sort_order");

  // Group counts: per (subject, year, paper_no) — use the view
  const { data: papers } = await supabase
    .from("past_papers")
    .select("*")
    .order("paper_year", { ascending: false });

  const subjectsById = Object.fromEntries((subjects || []).map((s) => [s.id, s]));
  const visible = filterSubject
    ? (papers || []).filter((p) => p.subject_id === filterSubject)
    : (papers || []);

  // Group by subject for the list
  const grouped = {};
  for (const p of visible) {
    const s = subjectsById[p.subject_id];
    if (!s) continue;
    grouped[s.id] = grouped[s.id] || { subject: s, papers: [] };
    grouped[s.id].papers.push(p);
  }

  return (
    <AdminShell current="/admin/papers">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-[11px] uppercase text-stone-500 mb-3"
            style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
            Past papers
          </div>
          <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: serif, fontWeight: 500 }}>
            Past papers (rewritten)
          </h1>
          <p className="text-sm opacity-75 mt-2 max-w-xl leading-snug">
            Rewritten NIED past-paper questions, tagged by subject &amp; topic. Used as the source for topic tests and final exams. Free tier = auto-marked; paid tier = AI-marked against the memo.
          </p>
        </div>
        <Link
          href="/admin/papers/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase"
          style={{
            fontFamily: mono, letterSpacing: "0.18em",
            backgroundColor: "#1a1f2e", color: "#e8e4d8",
          }}
        >
          <Plus size={13} /> New question
        </Link>
      </div>

      {/* Subject filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/papers"
          className="px-3 py-1.5 text-[11px] uppercase border"
          style={{
            fontFamily: mono, letterSpacing: "0.18em",
            backgroundColor: !filterSubject ? "#1a1f2e" : "transparent",
            color: !filterSubject ? "#e8e4d8" : "#1a1f2e",
            borderColor: "rgba(26,31,46,0.18)",
          }}
        >
          All
        </Link>
        {(subjects || []).map((s) => (
          <Link
            key={s.id}
            href={`/admin/papers?subject=${s.id}`}
            className="px-3 py-1.5 text-[11px] uppercase border"
            style={{
              fontFamily: mono, letterSpacing: "0.18em",
              backgroundColor: filterSubject === s.id ? "#1a1f2e" : "transparent",
              color: filterSubject === s.id ? "#e8e4d8" : "#1a1f2e",
              borderColor: "rgba(26,31,46,0.18)",
            }}
          >
            {s.name}
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {visible.length === 0 && (
        <div className="border p-8 text-center" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
          <ScrollText size={32} strokeWidth={1.2} className="mx-auto mb-3 opacity-40" />
          <div className="text-sm opacity-75 mb-1">No past-paper questions yet.</div>
          <div className="text-xs opacity-55 mb-4">
            Add the first one to seed the topic-test and final-exam pools.
          </div>
          <Link
            href="/admin/papers/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase"
            style={{ fontFamily: mono, letterSpacing: "0.18em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}
          >
            <Plus size={13} /> Add first question
          </Link>
        </div>
      )}

      {/* Grouped list */}
      <div className="space-y-8">
        {Object.values(grouped).map(({ subject, papers }) => (
          <section key={subject.id}>
            <div className="flex items-baseline justify-between mb-3 pb-2 border-b" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
              <h2 className="text-xl" style={{ fontFamily: serif, fontWeight: 500 }}>{subject.name}</h2>
              <div className="text-[10px] uppercase opacity-55" style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                {papers.length} paper{papers.length === 1 ? "" : "s"}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {papers.map((p) => (
                <Link
                  key={`${p.paper_year}-${p.paper_no}`}
                  href={`/admin/papers/paper?subject=${p.subject_id}&year=${p.paper_year}&no=${encodeURIComponent(p.paper_no)}`}
                  className="block p-4 transition hover:-translate-y-0.5 border"
                  style={{ borderColor: "rgba(26,31,46,0.18)" }}
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-base" style={{ fontWeight: 500 }}>
                        {p.paper_year} · Paper {p.paper_no}
                      </div>
                      <div className="text-xs opacity-60 mt-0.5">
                        {p.question_count} question{p.question_count === 1 ? "" : "s"} · {p.total_marks} marks
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!p.fully_published && (
                        <CircleAlert size={14} className="text-amber-600" />
                      )}
                      <ChevronRight size={14} className="opacity-50" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}
