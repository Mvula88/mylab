import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FlaskConical, GraduationCap, Sparkles } from "lucide-react";
import PageShell from "@/components/PageShell";
import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "My Practikal" };

export default async function MePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/me");

  const [{ data: profile }, { data: subjects }, { data: progress }, { data: labs }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("subjects").select("slug, name, category, blurb, has_labs").order("sort_order"),
      supabase
        .from("lesson_progress")
        .select("lesson_id, started_at, completed_at, lessons(title, slug, topic_id, topics(slug, subject_id, subjects(slug, name)))")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(5),
      supabase
        .from("lab_attempts")
        .select("lab_slug, opened_at, completed_at, score")
        .eq("user_id", user.id)
        .order("opened_at", { ascending: false })
        .limit(5),
    ]);

  const completedCount = (progress || []).filter((p) => p.completed_at).length;
  const labCount = (labs || []).length;
  const greeting = profile?.full_name?.split(" ")[0] || "there";

  return (
    <PageShell>
      <div className="text-[11px] uppercase text-stone-500 mb-3"
        style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
        Your learning hub
      </div>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <h1 className="text-4xl sm:text-5xl leading-[1.05]" style={{ fontWeight: 500 }}>
          Hello, <span style={{ color: "#c2185b", fontStyle: "italic" }}>{greeting}</span>.
        </h1>
        <LogoutButton />
      </div>

      {/* stats strip */}
      <div className="grid grid-cols-3 gap-4 pb-8 mb-10 border-b border-stone-900/15">
        <Stat label="Lessons completed" value={completedCount} />
        <Stat label="Labs attempted" value={labCount} />
        <Stat label="Curriculum" value={(profile?.curriculum || "nssco").toUpperCase()} />
      </div>

      {/* recent activity */}
      {(progress?.length || labs?.length) ? (
        <section className="mb-12">
          <div className="text-[11px] uppercase text-stone-500 mb-4"
            style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
            Recent activity
          </div>
          <div className="space-y-2">
            {progress?.map((p) => (
              <ActivityRow
                key={`l-${p.lesson_id}`}
                icon={GraduationCap}
                title={p.lessons?.title || "Lesson"}
                subtitle={p.lessons?.topics?.subjects?.name}
                status={p.completed_at ? "completed" : "in progress"}
                href={`/learn/${p.lessons?.topics?.subjects?.slug}/${p.lessons?.topics?.slug}/${p.lessons?.slug}`}
              />
            ))}
            {labs?.map((l, i) => (
              <ActivityRow
                key={`lab-${i}`}
                icon={FlaskConical}
                title={labTitle(l.lab_slug)}
                subtitle="Lab attempt"
                status={l.completed_at ? "completed" : "opened"}
                href={`/${l.lab_slug}`}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-12 p-6 border" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
          <div className="flex items-start gap-3">
            <Sparkles size={20} strokeWidth={1.5} className="mt-1" />
            <div>
              <div className="text-lg mb-1" style={{ fontWeight: 500 }}>
                Pick a subject below to begin.
              </div>
              <p className="text-sm opacity-75 leading-snug">
                Each subject takes you through topics, video lessons, activities and (where it makes sense) a hands-on 3D lab.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* subjects */}
      <section>
        <div className="text-[11px] uppercase text-stone-500 mb-4"
          style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
          Your subjects
        </div>
        <h2 className="text-2xl mb-6" style={{ fontWeight: 500 }}>
          Pick where you want to <span style={{ fontStyle: "italic" }}>study</span> today.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects?.map((s) => (
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
                {s.category || "subject"}{s.has_labs ? " · has labs" : ""}
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

function ActivityRow({ icon: Icon, title, subtitle, status, href }) {
  return (
    <Link href={href || "#"}
      className="flex items-center justify-between gap-3 py-2.5 px-3 -mx-3 hover:bg-stone-900/5 transition">
      <div className="flex items-center gap-3 min-w-0">
        <Icon size={16} strokeWidth={1.5} />
        <div className="min-w-0">
          <div className="text-sm truncate" style={{ fontWeight: 500 }}>{title}</div>
          {subtitle && <div className="text-[10px] opacity-55" style={{ fontFamily: mono }}>{subtitle}</div>}
        </div>
      </div>
      <span className="text-[9px] uppercase opacity-65 shrink-0"
        style={{ fontFamily: mono, letterSpacing: "0.18em" }}>
        {status}
      </span>
    </Link>
  );
}

function labTitle(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
