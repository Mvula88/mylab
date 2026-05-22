import Link from "next/link";
import PageShell from "@/components/PageShell";
import { LayoutDashboard, ListOrdered, FileText, FileQuestion, ScrollText, Users } from "lucide-react";

const mono = '"IBM Plex Mono", monospace';

const NAV = [
  { href: "/admin",          label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/syllabus", label: "Subjects & topics", icon: ListOrdered },
  { href: "/admin/lessons",  label: "Lessons & videos",  icon: FileText },
  { href: "/admin/quizzes",  label: "Quizzes",           icon: FileQuestion, soon: true },
  { href: "/admin/papers",   label: "Past papers",       icon: ScrollText },
  { href: "/admin/learners", label: "Learners",          icon: Users,        soon: true },
];

export default function AdminShell({ children, current }) {
  return (
    <PageShell>
      <div className="grid grid-cols-12 gap-6 sm:gap-10">
        <aside className="col-span-12 md:col-span-3">
          <div className="text-[11px] uppercase text-stone-500 mb-3"
            style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
            Admin
          </div>
          <nav className="space-y-1 border md:border-0" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
            {NAV.map((n) => {
              const active = current === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.soon ? "#" : n.href}
                  className={`flex items-center gap-2 px-3 py-2.5 text-[11px] uppercase ${
                    active ? "" : "hover:bg-stone-900/5"
                  } ${n.soon ? "opacity-40 cursor-not-allowed" : ""}`}
                  style={{
                    fontFamily: mono,
                    letterSpacing: "0.18em",
                    backgroundColor: active ? "#1a1f2e" : "transparent",
                    color: active ? "#e8e4d8" : "#1a1f2e",
                  }}
                >
                  <n.icon size={13} strokeWidth={1.6} />
                  <span className="flex-1">{n.label}</span>
                  {n.soon && <span className="text-[8px] opacity-60">soon</span>}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="col-span-12 md:col-span-9">{children}</div>
      </div>
    </PageShell>
  );
}
