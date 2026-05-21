import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import { createClient } from "@/lib/supabase/server";

const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "Learn · Practikal" };

export default async function LearnIndex() {
  const supabase = await createClient();
  const { data: subjects } = await supabase
    .from("subjects")
    .select("slug, name, category, blurb, has_labs, curriculum")
    .order("sort_order");

  // Group by category
  const groups = {};
  (subjects || []).forEach((s) => {
    const key = s.category || "other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });

  const order = ["languages", "maths", "science", "humanities", "commerce", "ict", "practical", "arts", "other"];
  const labels = {
    languages: "Languages",
    maths: "Mathematics",
    science: "Sciences",
    humanities: "Humanities",
    commerce: "Commerce",
    ict: "ICT & Computing",
    practical: "Practical & vocational",
    arts: "Arts",
    other: "Other",
  };

  return (
    <PageShell>
      <div className="text-[11px] uppercase text-stone-500 mb-3"
        style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
        Syllabus · NSSCO · NSSCAS
      </div>
      <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-4 max-w-3xl" style={{ fontWeight: 500 }}>
        Every subject you sit, in <span style={{ color: "#c2185b", fontStyle: "italic" }}>one place</span>.
      </h1>
      <p className="text-base opacity-80 max-w-2xl mb-12 leading-snug">
        Pick a subject. Work through its topics. Watch the lesson, do the activity, get marked. Where there's an experiment, the 3D lab is right there in the topic.
      </p>

      {order.filter((k) => groups[k]?.length).map((key) => (
        <section key={key} className="mb-12">
          <div className="text-[11px] uppercase text-stone-500 mb-4 flex items-baseline justify-between"
            style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
            <span>{labels[key]}</span>
            <span className="text-[9px] opacity-50">{groups[key].length} subject{groups[key].length === 1 ? "" : "s"}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {groups[key].map((s) => (
              <Link
                key={s.slug}
                href={`/learn/${s.slug}`}
                className="block p-5 transition active:scale-[0.99] hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(26,31,46,0.04)",
                  border: "1px solid rgba(26,31,46,0.18)",
                }}
              >
                <div className="text-[10px] uppercase opacity-55 mb-2"
                  style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                  {s.curriculum === "both" ? "NSSCO · NSSCAS" : s.curriculum?.toUpperCase()}
                  {s.has_labs ? " · has labs" : ""}
                </div>
                <div className="text-lg mb-1" style={{ fontWeight: 500 }}>{s.name}</div>
                {s.blurb && <p className="text-xs opacity-75 leading-snug">{s.blurb}</p>}
                <div className="mt-4 text-[10px] uppercase flex items-center gap-1"
                  style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                  Open <ArrowRight size={11} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {!subjects?.length && (
        <div className="p-8 border" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
          <p className="text-sm opacity-75">
            No subjects yet. If you're the admin, run the seed SQL in your Supabase project to populate the NSSCO/NSSCAS subject list.
          </p>
        </div>
      )}
    </PageShell>
  );
}
