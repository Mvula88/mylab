import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ArrowRight, CheckCircle2, Clock, Circle, Atom } from "lucide-react";

const TOPICS = [
  { title: "Mechanics", practicals: [
    { title: "Simple pendulum — period vs length, find g", status: "live", href: "/pendulum" },
    { title: "Hooke's law (spring extension vs load)", status: "live", href: "/hookes-law" },
    { title: "Density by displacement (irregular solid)", status: "live", href: "/density-displacement" },
    { title: "Friction on an inclined plane", status: "live", href: "/friction-incline" },
  ]},
  { title: "Light & optics", practicals: [
    { title: "Refraction through a glass block (Snell's law)", status: "live", href: "/refraction" },
    { title: "Focal length of a converging lens", status: "live", href: "/lens-focal-length" },
    { title: "Reflection from a plane mirror", status: "live", href: "/plane-mirror" },
  ]},
  { title: "Electricity", practicals: [
    { title: "Ohm's law (V/I for a fixed resistor)", status: "live", href: "/ohms-law" },
    { title: "Resistance vs length of constantan wire", status: "live", href: "/resistance-wire" },
  ]},
  { title: "Thermal physics", practicals: [
    { title: "Specific heat capacity of water (electrical method)", status: "live", href: "/specific-heat-capacity" },
    { title: "Boyle's law (gas syringe + pressure gauge)", status: "live", href: "/boyles-law" },
  ]},
  { title: "Waves & sound", practicals: [
    { title: "Resonance tube — speed of sound in air", status: "live", href: "/resonance-tube" },
  ]},
  { title: "Magnetism & electromagnetism", practicals: [
    { title: "Electromagnet strength vs current / turns", status: "live", href: "/electromagnet" },
  ]},
];

function StatusBadge({ status }) {
  const mono = '"IBM Plex Mono", monospace';
  const map = {
    live: { Icon: CheckCircle2, label: "live", colour: "#2e7d32" },
    dev:  { Icon: Clock,        label: "in dev", colour: "#c79a3a" },
    planned: { Icon: Circle,    label: "planned", colour: "#a0a0a0" },
  };
  const m = map[status] || map.planned;
  return (
    <span className="inline-flex items-center gap-1 text-[9px] uppercase shrink-0"
      style={{ fontFamily: mono, letterSpacing: "0.18em", color: m.colour }}>
      <m.Icon size={11} /> {m.label}
    </span>
  );
}

function PracticalRow({ p }) {
  const mono = '"IBM Plex Mono", monospace';
  const Body = (
    <>
      <div className="flex-1 min-w-0">
        <div className="text-sm leading-snug" style={{ fontWeight: 500 }}>{p.title}</div>
        {p.note && <div className="text-[10px] opacity-55" style={{ fontFamily: mono }}>{p.note}</div>}
      </div>
      <StatusBadge status={p.status} />
    </>
  );
  if (p.status === "live" && p.href) {
    return (
      <Link href={p.href}
        className="flex items-center justify-between gap-3 py-1.5 px-2 -mx-2 hover:bg-stone-900/5 transition">
        {Body}
      </Link>
    );
  }
  return <div className="flex items-center justify-between gap-3 py-1.5 px-2 -mx-2 opacity-70">{Body}</div>;
}

export default function PhysicsPage() {
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';
  const liveCount = TOPICS.flatMap(t => t.practicals).filter(p => p.status === "live").length;
  const totalCount = TOPICS.flatMap(t => t.practicals).length;

  return (
    <main className="min-h-screen w-full relative"
      style={{ backgroundColor: "#e8e4d8", color: "#1a1f2e", fontFamily: serif }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#1a1f2e 1px, transparent 1px), linear-gradient(90deg, #1a1f2e 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

      <SiteHeader />

      <section className="relative">
        <div className="max-w-5xl mx-auto px-5 pt-14 pb-10 sm:pt-20 sm:pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <Atom size={36} strokeWidth={1.5} className="mb-4" />
              <div className="text-[11px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
                Subject · Physics
              </div>
              <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-3" style={{ fontWeight: 500 }}>
                Apparatus you can <span style={{ fontStyle: "italic", color: "#c2185b" }}>drag, rotate and read</span>.
              </h1>
              <p className="text-base opacity-80 mb-5 leading-snug">
                Pendulum oscillations, refraction angles, springs, circuits, calorimetry. Every measurement is read from a virtual instrument with the same precision the exam asks for. {liveCount} of {totalCount} practicals live today.
              </p>
              <Link href="/labs"
                className="inline-flex items-center gap-2 py-3 px-5 text-[11px] uppercase active:scale-95"
                style={{
                  fontFamily: mono, letterSpacing: "0.25em",
                  backgroundColor: "#1a1f2e", color: "#e8e4d8", fontWeight: 500,
                }}>
                See Live Labs <ArrowRight size={13} />
              </Link>
            </div>
            <div className="md:col-span-5">
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/5", border: "1px solid rgba(26,31,46,0.2)", backgroundColor: "#0a0c12" }}>
                <img
                  src="/pics/lab-10.jpg"
                  alt="Iridescent soap-film bubbles on a black background — refraction, interference and surface tension at play"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative" style={{ backgroundColor: "rgba(26,31,46,0.03)" }}>
        <div className="max-w-5xl mx-auto px-5 py-10 sm:py-14">
          <h2 className="text-2xl mb-2" style={{ fontWeight: 500 }}>Topic coverage</h2>
          <p className="text-sm opacity-75 mb-8 max-w-xl">
            For NSSCO, CAPS Physical Sciences (Physics strand) and Cambridge IGCSE / A-level Physics.
          </p>
          {TOPICS.map((t) => (
            <div key={t.title} className="mb-8">
              <div className="text-[11px] uppercase opacity-60 mb-1 pb-1 border-b border-stone-900/10"
                style={{ fontFamily: mono, letterSpacing: "0.18em" }}>
                {t.title}
              </div>
              <div className="divide-y divide-stone-900/8">
                {t.practicals.map((p) => <PracticalRow key={p.title} p={p} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
