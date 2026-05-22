import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";
import NewPastPaperQuestionForm from "@/components/admin/NewPastPaperQuestionForm";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "Add past-paper question · Admin" };

export default async function NewPastPaperPage({ searchParams }) {
  const sp = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/papers/new");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/me?error=admin-only");

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, slug, name, category")
    .order("category")
    .order("sort_order");

  const { data: topics } = await supabase
    .from("topics")
    .select("id, slug, title, subject_id")
    .order("sort_order");

  // Pre-fill from query string when adding more Qs to the same paper
  const initial = {
    subjectId: sp?.subject || "",
    paperYear: sp?.year || new Date().getFullYear() - 1,
    paperNo: sp?.no || "",
  };

  return (
    <AdminShell current="/admin/papers">
      <div className="mb-8">
        <div className="text-[11px] uppercase text-stone-500 mb-3"
          style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
          Past papers · New question
        </div>
        <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: serif, fontWeight: 500 }}>
          Add a rewritten past-paper question
        </h1>
        <p className="text-sm opacity-75 mt-2 max-w-2xl leading-snug">
          Rewrite the question so it&apos;s no longer a verbatim NIED copy, but keeps the same intent and mark allocation. Keep the original memo (mark scheme) verbatim.
        </p>
      </div>

      <NewPastPaperQuestionForm
        subjects={subjects || []}
        topics={topics || []}
        initial={initial}
      />
    </AdminShell>
  );
}
