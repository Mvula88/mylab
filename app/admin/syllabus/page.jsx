import AdminShell from "@/components/admin/AdminShell";
import TopicManager from "@/components/admin/TopicManager";
import { createClient } from "@/lib/supabase/server";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export const metadata = { title: "Subjects & topics · Admin" };

export default async function AdminSyllabusPage() {
  const supabase = await createClient();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, slug, name, curriculum, category, sort_order")
    .order("sort_order");

  const { data: topics } = await supabase
    .from("topics")
    .select("id, subject_id, slug, title, blurb, sort_order, lessons(id)")
    .order("sort_order");

  const topicsBySubject = {};
  (topics || []).forEach((t) => {
    if (!topicsBySubject[t.subject_id]) topicsBySubject[t.subject_id] = [];
    topicsBySubject[t.subject_id].push({
      ...t,
      lessons_count: t.lessons?.length || 0,
    });
  });

  const subjectsByCategory = {};
  (subjects || []).forEach((s) => {
    const key = s.category || "other";
    if (!subjectsByCategory[key]) subjectsByCategory[key] = [];
    subjectsByCategory[key].push(s);
  });

  const order = ["languages", "maths", "science", "humanities", "commerce", "ict", "practical", "arts", "other"];

  return (
    <AdminShell current="/admin/syllabus">
      <div className="text-[11px] uppercase text-stone-500 mb-3"
        style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
        Subjects & topics
      </div>
      <h1 className="text-3xl sm:text-4xl mb-3" style={{ fontFamily: serif, fontWeight: 500 }}>
        Build out your <span style={{ color: "#c2185b", fontStyle: "italic" }}>syllabus tree</span>.
      </h1>
      <p className="text-sm opacity-75 mb-8 max-w-2xl leading-snug">
        Each subject below shows the topics inside it. Add topics here; then go to <strong>Lessons & videos</strong> to add lessons inside each topic.
      </p>

      {order.filter((k) => subjectsByCategory[k]?.length).map((key) => (
        <section key={key} className="mb-10">
          <div className="text-[10px] uppercase text-stone-500 mb-4"
            style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
            {labelFor(key)}
          </div>
          {subjectsByCategory[key].map((s) => (
            <TopicManager
              key={s.id}
              subject={s}
              topics={topicsBySubject[s.id] || []}
            />
          ))}
        </section>
      ))}
    </AdminShell>
  );
}

function labelFor(key) {
  return {
    languages: "Languages", maths: "Mathematics", science: "Sciences",
    humanities: "Humanities", commerce: "Commerce", ict: "ICT & Computing",
    practical: "Practical & vocational", arts: "Arts", other: "Other",
  }[key];
}
