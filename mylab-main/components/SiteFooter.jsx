import Link from "next/link";

export default function SiteFooter() {
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  return (
    <footer
      className="relative z-10 border-t border-stone-900/10 mt-16"
      style={{ backgroundColor: "#1a1f2e", color: "#e8e4d8", fontFamily: serif }}
    >
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xl" style={{ fontWeight: 600 }}>Practikal</span>
            <span className="text-xl" style={{ color: "#ec407a", fontWeight: 700, lineHeight: 1 }}>.</span>
          </div>
          <p className="text-xs opacity-65 leading-snug max-w-xs">
            Exam-aligned interactive science practicals for secondary schools in Southern Africa.
          </p>
        </div>
        <div>
          <div
            className="text-[10px] uppercase opacity-55 mb-3"
            style={{ fontFamily: mono, letterSpacing: "0.22em" }}
          >
            Subjects
          </div>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/biology" className="opacity-80 hover:opacity-100">Biology</Link></li>
            <li><Link href="/chemistry" className="opacity-80 hover:opacity-100">Chemistry</Link></li>
            <li><Link href="/physics" className="opacity-80 hover:opacity-100">Physics</Link></li>
            <li><Link href="/maths" className="opacity-80 hover:opacity-100">Maths</Link></li>
          </ul>
        </div>
        <div>
          <div
            className="text-[10px] uppercase opacity-55 mb-3"
            style={{ fontFamily: mono, letterSpacing: "0.22em" }}
          >
            Curricula
          </div>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/namibia" className="opacity-80 hover:opacity-100">Namibia · NSSCO / NSSCAS</Link></li>
            <li><Link href="/south-africa" className="opacity-80 hover:opacity-100">South Africa · CAPS / IEB / IGCSE</Link></li>
          </ul>
        </div>
        <div>
          <div
            className="text-[10px] uppercase opacity-55 mb-3"
            style={{ fontFamily: mono, letterSpacing: "0.22em" }}
          >
            Platform
          </div>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/labs" className="opacity-80 hover:opacity-100">All Labs</Link></li>
            <li><a href="mailto:hello@practikal.app" className="opacity-80 hover:opacity-100">Contact</a></li>
          </ul>
        </div>
      </div>
      <div
        className="border-t border-white/10 py-4 px-5 text-[10px] text-center opacity-50"
        style={{ fontFamily: mono, letterSpacing: "0.18em" }}
      >
        © 2026 Practikal — early preview
      </div>
    </footer>
  );
}
