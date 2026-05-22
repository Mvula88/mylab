import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import PastPaperQuiz from "@/components/learner/PastPaperQuiz";
import { createClient } from "@/lib/supabase/server";

const mono = '"IBM Plex Mono", monospace';

export async function generateMetadata({ params }) {
  const { subject, paper } = await params;
  return { title: `${subject} · Past Paper ${paper} · Practikal` };
}

export default async function PastPaperPage({ params }) {
  const { subject: subjectSlug, paper } = await params;

  // Accept either "2020-p2" or "2020-2" formats
  const m = paper.match(/^(\d{4})-p?(\w+)$/i);
  if (!m) notFound();
  const year = parseInt(m[1], 10);
  const paperNo = m[2];

  const supabase = await createClient();

  const { data: subject } = await supabase
    .from("subjects")
    .select("id, slug, name")
    .eq("slug", subjectSlug)
    .single();
  if (!subject) notFound();

  const { data: rows } = await supabase
    .from("past_paper_questions")
    .select("id, q_number, marks, tier, type, prompt, options, correct, case_sensitive, diagram_url, memo, explanation")
    .eq("subject_id", subject.id)
    .eq("paper_year", year)
    .eq("paper_no", paperNo)
    .eq("is_published", true);

  if (!rows || rows.length === 0) notFound();

  // Natural sort by q_number ("1(a)" before "10(a)", "2(b)(i)" before "2(b)(ii)")
  const pad = (s) => String(s).replace(/\d+/g, (n) => n.padStart(4, "0"));
  const questions = rows.slice().sort((a, b) => pad(a.q_number).localeCompare(pad(b.q_number)));

  const totalMarks = questions.reduce((s, q) => s + (q.marks || 0), 0);
  const subjectLabel = subject.name;
  const paperLabel = `${year} · Paper ${paperNo}`;

  return (
    <PageShell narrow>
      <div className="text-[11px] uppercase text-stone-500 mb-3"
        style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
        <Link href="/learn" className="opacity-70 hover:opacity-100">Syllabus</Link>
        <span className="mx-2 opacity-40">/</span>
        <Link href={`/learn/${subject.slug}`} className="opacity-70 hover:opacity-100">{subjectLabel}</Link>
        <span className="mx-2 opacity-40">/</span>
        Past papers
        <span className="mx-2 opacity-40">/</span>
        {paperLabel}
      </div>

      <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-4" style={{ fontWeight: 500 }}>
        {subjectLabel} · {paperLabel}
      </h1>

      <div className="flex gap-6 pb-6 mb-8 border-b border-stone-900/15 text-[10px] uppercase opacity-70"
        style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
        <span>{questions.length} questions</span>
        <span>{totalMarks} marks</span>
        <span>verbatim · NIED</span>
      </div>

      <PastPaperQuiz questions={questions} totalMarks={totalMarks} />
    </PageShell>
  );
}
