import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import LessonForm from "@/components/admin/LessonForm";
import { createClient } from "@/lib/supabase/server";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "New lesson · Admin" };

export default async function NewLessonPage() {
  const supabase = await createClient();
  const [{ data: subjects }, { data: topics }] = await Promise.all([
    supabase.from("subjects").select("id, name").order("sort_order"),
    supabase.from("topics").select("id, subject_id, title, sort_order").order("sort_order"),
  ]);

  return (
    <AdminShell current="/admin/lessons">
      <Link href="/admin/lessons" className="inline-flex items-center gap-1 text-[10px] uppercase opacity-70 hover:opacity-100 mb-4"
        style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
        <ChevronLeft size={12} /> Back to lessons
      </Link>
      <h1 className="text-3xl sm:text-4xl mb-8" style={{ fontFamily: serif, fontWeight: 500 }}>
        New <span style={{ color: "#c2185b", fontStyle: "italic" }}>lesson</span>
      </h1>
      <LessonForm mode="new" subjects={subjects || []} topics={topics || []} />
    </AdminShell>
  );
}
