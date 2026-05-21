import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Upload, ListOrdered, FileQuestion, Users, ScrollText } from "lucide-react";
import PageShell from "@/components/PageShell";
import { createClient } from "@/lib/supabase/server";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "Admin · Practikal" };

export default async function AdminHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/me?error=admin-only");

  const [{ count: subjectCount }, { count: topicCount }, { count: lessonCount }, { count: learnerCount }] =
    await Promise.all([
      supabase.from("subjects").select("*", { count: "exact", head: true }),
      supabase.from("topics").select("*", { count: "exact", head: true }),
      supabase.from("lessons").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "learner"),
    ]);

  const tiles = [
    {
      title: "Lessons & video upload",
      blurb: "Add lesson content, upload videos to Supabase Storage, attach a lab.",
      href: "/admin/lessons",
      icon: Upload,
      status: "Ready",
    },
    {
      title: "Subjects & topics",
      blurb: "Edit the syllabus tree — add or reorder NSSCO/NSSCAS subjects and topics.",
      href: "/admin/syllabus",
      icon: ListOrdered,
      status: "Ready",
    },
    {
      title: "Quizzes & activities",
      blurb: "Add multiple-choice, fill-in, numeric and free-text questions per lesson.",
      href: "/admin/quizzes",
      icon: FileQuestion,
      status: "Stage 3 — coming next",
    },
    {
      title: "Past papers",
      blurb: "Upload past exam papers and mark schemes for AI-assisted marking.",
      href: "/admin/papers",
      icon: ScrollText,
      status: "Stage 4",
    },
    {
      title: "Learners",
      blurb: "See who's signed up and their progress.",
      href: "/admin/learners",
      icon: Users,
      status: "Stage 5",
    },
  ];

  return (
    <PageShell>
      <div className="text-[11px] uppercase text-stone-500 mb-3"
        style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
        Admin
      </div>
      <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-3" style={{ fontWeight: 500 }}>
        Welcome, <span style={{ color: "#c2185b", fontStyle: "italic" }}>{profile?.full_name?.split(" ")[0] || "admin"}</span>.
      </h1>
      <p className="text-base opacity-80 max-w-2xl mb-10 leading-snug">
        This is your control room. Add subjects, upload videos, write lessons, attach labs, build quizzes, and watch learners progress.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-8 mb-10 border-b border-stone-900/15">
        <Stat label="Subjects" value={subjectCount ?? 0} />
        <Stat label="Topics" value={topicCount ?? 0} />
        <Stat label="Lessons" value={lessonCount ?? 0} />
        <Stat label="Learners" value={learnerCount ?? 0} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="block p-5 transition active:scale-[0.99] hover:-translate-y-0.5"
            style={{
              backgroundColor: "rgba(26,31,46,0.04)",
              border: "1px solid rgba(26,31,46,0.18)",
            }}
          >
            <t.icon size={22} strokeWidth={1.5} className="mb-3" />
            <div className="text-lg mb-1" style={{ fontWeight: 500 }}>{t.title}</div>
            <p className="text-xs opacity-75 leading-snug mb-3">{t.blurb}</p>
            <div className="text-[10px] uppercase opacity-55 flex items-center justify-between"
              style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
              <span>{t.status}</span>
              <ArrowRight size={11} />
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-3xl" style={{ fontFamily: serif, fontWeight: 500 }}>{value}</div>
      <div className="text-[10px] uppercase opacity-60 mt-1"
        style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
        {label}
      </div>
    </div>
  );
}
