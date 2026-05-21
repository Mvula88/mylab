import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { Plus, PlayCircle, FlaskConical, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "Lessons · Admin" };

export default async function AdminLessonsPage({ searchParams }) {
  const sp = await searchParams;
  const filterSubject = sp?.subject || '';
  const supabase = await createClient();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, slug, name")
    .order("sort_order");

  let query = supabase
    .from("lessons")
    .select("id, title, slug, video_url, lab_slug, is_published, sort_order, updated_at, topic_id, topics(id, title, subject_id, subjects(id, slug, name))")
    .order("updated_at", { ascending: false });

  const { data: lessons } = await query;

  const filtered = filterSubject
    ? (lessons || []).filter((l) => l.topics?.subjects?.id === filterSubject)
    : (lessons || []);

  return (
    <AdminShell current="/admin/lessons">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-[11px] uppercase text-stone-500 mb-3"
            style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
            Lessons & videos
          </div>
          <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: serif, fontWeight: 500 }}>
            All <span style={{ color: "#c2185b", fontStyle: "italic" }}>lessons</span>
          </h1>
        </div>
        <Link
          href="/admin/lessons/new"
          className="inline-flex items-center gap-2 py-2.5 px-5 text-[11px] uppercase active:scale-95"
          style={{
            fontFamily: mono,
            letterSpacing: "0.25em",
            backgroundColor: "#1a1f2e",
            color: "#e8e4d8",
          }}
        >
          <Plus size={13} /> New lesson
        </Link>
      </div>

      {/* Subject filter */}
      <form className="mb-6">
        <select
          name="subject"
          defaultValue={filterSubject}
          onChange={(e) => e.target.form.submit()}
          className="px-3 py-2 text-sm bg-transparent outline-none"
          style={{ fontFamily: serif, border: "1px solid rgba(26,31,46,0.25)" }}
        >
          <option value="">All subjects</option>
          {subjects?.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </form>

      {filtered.length === 0 ? (
        <div className="p-8 border" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
          <p className="text-sm opacity-75">
            No lessons {filterSubject ? "for this subject" : "yet"}.{" "}
            <Link href="/admin/lessons/new" className="underline">Create the first one</Link>.
          </p>
        </div>
      ) : (
        <div className="border-t border-stone-900/15">
          {filtered.map((l) => (
            <Link
              key={l.id}
              href={`/admin/lessons/${l.id}`}
              className="flex items-center justify-between gap-3 py-3 px-2 -mx-2 border-b border-stone-900/10 hover:bg-stone-900/5 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                {l.is_published ? (
                  <CheckCircle2 size={15} strokeWidth={1.7} style={{ color: "#2e7d32" }} />
                ) : (
                  <Circle size={15} strokeWidth={1.5} className="opacity-35" />
                )}
                <div className="min-w-0">
                  <div className="text-sm" style={{ fontWeight: 500 }}>{l.title}</div>
                  <div className="text-[10px] opacity-60 flex gap-2 items-center"
                    style={{ fontFamily: mono, letterSpacing: "0.12em" }}>
                    <span>{l.topics?.subjects?.name}</span>
                    <span className="opacity-50">·</span>
                    <span>{l.topics?.title}</span>
                    {l.video_url && (<><span className="opacity-50">·</span><span className="inline-flex items-center gap-1"><PlayCircle size={10} /> video</span></>)}
                    {l.lab_slug && (<><span className="opacity-50">·</span><span className="inline-flex items-center gap-1"><FlaskConical size={10} /> {l.lab_slug}</span></>)}
                  </div>
                </div>
              </div>
              <ChevronRight size={15} className="opacity-40 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
