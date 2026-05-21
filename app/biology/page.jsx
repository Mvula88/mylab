import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ArrowRight, CheckCircle2, Clock, Circle, Leaf } from "lucide-react";

const TOPICS = [
  { title: "Food & nutrition", practicals: [
    { title: "Food tests (starch, sugar, protein, lipid)", status: "live", href: "/food-tests",
      note: "Iodine, Benedict's, Biuret, Emulsion" },
    { title: "Identifying nutrients in real foods", status: "live", href: "/nutrients-in-foods" },
    { title: "Energy content of food (combustion calorimetry)", status: "live", href: "/food-energy" },
  ]},
  { title: "Photosynthesis", practicals: [
    { title: "Starch test in a leaf (variegated, foil-covered, dark)", status: "live", href: "/photosynthesis" },
    { title: "Pondweed (Elodea) bubble counter", status: "live", href: "/elodea" },
    { title: "Need for CO₂ (bagged leaves)", status: "live", href: "/co2" },
    { title: "Hill reaction (DCPIP, A-level)", status: "live", href: "/hill-reaction" },
    { title: "Need for chlorophyll (variegated leaf)", status: "live", href: "/variegated-leaf" },
  ]},
  { title: "Respiration", practicals: [
    { title: "Testing exhaled air for CO₂", status: "live", href: "/limewater-exhaled" },
    { title: "Respiration in germinating seeds", status: "live", href: "/germinating-seeds" },
    { title: "Comparing rate of respiration in different organisms", status: "live", href: "/respirometer" },
  ]},
  { title: "Enzymes", practicals: [
    { title: "Effect of temperature on amylase / catalase", status: "live", href: "/enzyme-temperature" },
    { title: "Effect of pH on amylase", status: "live", href: "/enzyme-ph" },
    { title: "Effect of substrate concentration", status: "live", href: "/enzyme-substrate" },
  ]},
  { title: "Diffusion, osmosis & active transport", practicals: [
    { title: "Osmosis with potato cylinders", status: "live", href: "/osmosis-potato" },
    { title: "Diffusion into agar cubes (SA:V)", status: "live", href: "/diffusion-agar" },
    { title: "Visking tubing model of selective permeability", status: "live", href: "/visking-tubing" },
  ]},
  { title: "Plant transport", practicals: [
    { title: "Transpiration with a potometer", status: "live", href: "/potometer" },
    { title: "Stained celery: xylem transport", status: "live", href: "/celery-xylem" },
  ]},
  { title: "Microscopy", practicals: [
    { title: "Animal vs plant cells under the microscope", status: "live", href: "/microscopy-cells" },
    { title: "Mitosis stages in onion root tip", status: "live", href: "/mitosis" },
  ]},
  { title: "Inheritance & variation", practicals: [
    { title: "Monohybrid cross simulation", status: "live", href: "/monohybrid" },
    { title: "Continuous vs discontinuous variation", status: "live", href: "/variation" },
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

export default function BiologyPage() {
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
              <Leaf size={36} strokeWidth={1.5} className="mb-4" />
              <div className="text-[11px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
                Subject · Biology
              </div>
              <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-3" style={{ fontWeight: 500 }}>
                Practicals you can run <span style={{ fontStyle: "italic", color: "#c2185b" }}>repeatedly</span>, without reagents.
              </h1>
              <p className="text-base opacity-80 mb-5 leading-snug">
                Food tests, photosynthesis investigations, enzyme kinetics, osmosis — every required Biology practical for NSSCO, CAPS Life Sciences and Cambridge IGCSE / A-level. {liveCount} of {totalCount} practicals are live today.
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
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/5", border: "1px solid rgba(26,31,46,0.2)" }}>
                <img
                  src="/pics/lab-06.jpg"
                  alt="A researcher in a white coat and blue gloves pipetting a coloured sample into a rack of microtubes"
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
            Organised by syllabus topic. Applies to NSSCO, CAPS Life Sciences, and Cambridge IGCSE / A-level Biology.
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
