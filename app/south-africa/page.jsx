import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ArrowRight, CheckCircle2, Clock, Circle } from "lucide-react";

const CAPS_PHYSICAL_SCIENCES = [
  { topic: "Matter & materials · Grade 10–11", practicals: [
    { title: "Separation of mixtures (filtration / crystallisation)", status: "live", href: "/filtration" },
    { title: "Paper chromatography", status: "live", href: "/chromatography" },
    { title: "Heating curve of a pure substance", status: "planned" },
  ]},
  { topic: "Chemical change · acid–base", practicals: [
    { title: "Acid–base titration (strong acid / strong base)", status: "live", href: "/titration" },
    { title: "pH of common substances", status: "dev" },
    { title: "Preparation of insoluble salts", status: "dev" },
  ]},
  { topic: "Chemical change · rates", practicals: [
    { title: "Rate by gas collection (KClO₃ → O₂)", status: "live", href: "/gas-collection-rate" },
    { title: "Rate · Mg + HCl (concentration)", status: "live", href: "/rate-of-reaction" },
    { title: "Rate · Na₂S₂O₃ + HCl (turbidity)", status: "planned" },
  ]},
  { topic: "Chemical change · electrochemistry · Grade 12", practicals: [
    { title: "Electrolysis · molten and aqueous electrolytes", status: "live", href: "/electrolysis" },
    { title: "Galvanic / voltaic cells (Zn–Cu)", status: "planned" },
  ]},
  { topic: "Chemical analysis · Grade 12", practicals: [
    { title: "Qualitative analysis of unknown salts", status: "live", href: "/qualitative-analysis" },
    { title: "Flame & gas tests", status: "live", href: "/flame-gas-tests" },
  ]},
  { topic: "Mechanics · Grade 10–12", practicals: [
    { title: "Simple pendulum / measuring g", status: "live", href: "/pendulum" },
    { title: "Hooke's law for a spring", status: "dev" },
    { title: "Newton's second law (F = ma)", status: "planned" },
  ]},
  { topic: "Waves, sound & light · Grade 10–11", practicals: [
    { title: "Refraction through a glass block (Snell)", status: "live", href: "/refraction" },
    { title: "Speed of sound (resonance tube)", status: "planned" },
    { title: "Focal length of a converging lens", status: "planned" },
  ]},
  { topic: "Electricity & magnetism · Grade 10–12", practicals: [
    { title: "Ohm's law for a resistor", status: "dev" },
    { title: "Resistance of a wire (vs length)", status: "planned" },
    { title: "Series vs parallel resistor combinations", status: "planned" },
  ]},
];

const CAPS_LIFE_SCIENCES = [
  { topic: "Cells, tissues & nutrition · Grade 10–11", practicals: [
    { title: "Food tests (starch, sugar, protein, lipid)", status: "live", href: "/food-tests" },
    { title: "Identifying nutrients in real foods", status: "live", href: "/nutrients-in-foods" },
    { title: "Energy content of food (combustion calorimetry)", status: "live", href: "/food-energy" },
    { title: "Microscopy of plant and animal cells", status: "live", href: "/microscopy-cells" },
  ]},
  { topic: "Photosynthesis · Grade 11", practicals: [
    { title: "Starch test in a leaf", status: "live", href: "/photosynthesis" },
    { title: "Need for CO₂ (bagged leaves)", status: "live", href: "/co2" },
    { title: "Effect of light intensity (Elodea bubbles)", status: "live", href: "/elodea" },
    { title: "Need for chlorophyll (variegated leaf)", status: "live", href: "/variegated-leaf" },
  ]},
  { topic: "Respiration · Grade 11", practicals: [
    { title: "Testing exhaled air for CO₂ (limewater)", status: "live", href: "/limewater-exhaled" },
    { title: "Respiration in germinating seeds (heat)", status: "live", href: "/germinating-seeds" },
    { title: "Comparing rate of respiration", status: "live", href: "/respirometer" },
  ]},
  { topic: "Enzymes · Grade 10–11", practicals: [
    { title: "Effect of temperature on enzyme activity", status: "live", href: "/enzyme-temperature" },
    { title: "Effect of pH on enzyme activity", status: "live", href: "/enzyme-ph" },
    { title: "Effect of substrate concentration", status: "live", href: "/enzyme-substrate" },
  ]},
  { topic: "Cell transport · Grade 10", practicals: [
    { title: "Osmosis with potato cylinders", status: "live", href: "/osmosis-potato" },
    { title: "Diffusion into agar cubes (SA:V)", status: "live", href: "/diffusion-agar" },
    { title: "Visking tubing — selective permeability", status: "live", href: "/visking-tubing" },
  ]},
  { topic: "Plant transport · Grade 10–11", practicals: [
    { title: "Transpiration with a potometer", status: "live", href: "/potometer" },
    { title: "Stained celery: xylem transport", status: "live", href: "/celery-xylem" },
  ]},
  { topic: "Cell division · Grade 10–11", practicals: [
    { title: "Mitosis stages in onion root tip", status: "live", href: "/mitosis" },
  ]},
  { topic: "Inheritance & variation · Grade 12", practicals: [
    { title: "Monohybrid cross simulator", status: "live", href: "/monohybrid" },
    { title: "Continuous vs discontinuous variation", status: "live", href: "/variation" },
  ]},
];

const IGCSE = {
  title: "Cambridge IGCSE & A-level",
  blurb: "Many South African independent and international schools sit Cambridge IGCSE and Cambridge AS / A-level. Paper 6 (Alternative to Practical) and Paper 5 (Planning, Analysis, Evaluation) questions follow the same style as NSSCO. We cover the same syllabus content.",
  examples: [
    { title: "Iodine clock investigation (Paper 5 style)", status: "live", href: "/iodine-clock",
      note: "Cambridge AS Chemistry 9701 Paper 5 + NSSCAS 8224 Paper 3" },
    { title: "Qualitative analysis (Paper 6 / Paper 5)", status: "live", href: "/qualitative-analysis",
      note: "Standard Cambridge cation + anion procedure" },
    { title: "Hill reaction (DCPIP)", status: "live", href: "/hill-reaction",
      note: "Cambridge A-level Biology 9700" },
  ],
};

const IEB_NOTE = {
  title: "IEB · Independent Examinations Board",
  blurb: "Many South African private schools write the IEB Physical Sciences and Life Sciences exams. Practical content overlaps heavily with CAPS — the IEB practical investigation tasks and skill set match what is covered here.",
};

function StatusBadge({ status }) {
  const mono = '"IBM Plex Mono", monospace';
  const map = {
    live: { Icon: CheckCircle2, label: "live", colour: "#2e7d32" },
    dev:  { Icon: Clock,        label: "in dev", colour: "#c79a3a" },
    planned: { Icon: Circle,    label: "planned", colour: "#a0a0a0" },
  };
  const m = map[status] || map.planned;
  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] uppercase shrink-0"
      style={{ fontFamily: mono, letterSpacing: "0.18em", color: m.colour }}
    >
      <m.Icon size={11} /> {m.label}
    </span>
  );
}

function PracticalRow({ p }) {
  const mono = '"IBM Plex Mono", monospace';
  if (p.status === "live" && p.href) {
    return (
      <Link
        href={p.href}
        className="flex items-center justify-between gap-3 py-1.5 px-2 -mx-2 hover:bg-stone-900/5 transition"
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm leading-snug truncate" style={{ fontWeight: 500 }}>{p.title}</div>
          {p.note && <div className="text-[10px] opacity-55" style={{ fontFamily: mono }}>{p.note}</div>}
        </div>
        <StatusBadge status={p.status} />
      </Link>
    );
  }
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 px-2 -mx-2 opacity-70">
      <div className="flex-1 min-w-0">
        <div className="text-sm leading-snug truncate">{p.title}</div>
        {p.note && <div className="text-[10px] opacity-55" style={{ fontFamily: mono }}>{p.note}</div>}
      </div>
      <StatusBadge status={p.status} />
    </div>
  );
}

function SubjectBlock({ title, topics }) {
  const mono = '"IBM Plex Mono", monospace';
  return (
    <div className="mb-12">
      <div
        className="text-[11px] uppercase text-stone-500 mb-3 pb-1.5 border-b border-stone-900/15"
        style={{ fontFamily: mono, letterSpacing: "0.28em" }}
      >
        {title}
      </div>
      {topics.map((t) => (
        <div key={t.topic} className="mb-4">
          <div className="text-[11px] uppercase opacity-60 mb-1"
               style={{ fontFamily: mono, letterSpacing: "0.18em" }}>
            {t.topic}
          </div>
          <div className="divide-y divide-stone-900/8">
            {t.practicals.map((p) => <PracticalRow key={p.title} p={p} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SouthAfricaPage() {
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  return (
    <main
      className="min-h-screen w-full relative"
      style={{ backgroundColor: "#e8e4d8", color: "#1a1f2e", fontFamily: serif }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#1a1f2e 1px, transparent 1px), linear-gradient(90deg, #1a1f2e 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <SiteHeader />

      <section className="relative">
        <div className="max-w-5xl mx-auto px-5 pt-14 pb-10 sm:pt-20 sm:pb-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <div
                className="text-[11px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.28em" }}
              >
                🇿🇦 South Africa · CAPS · IEB · Cambridge IGCSE
              </div>
              <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-4" style={{ fontWeight: 500 }}>
                Aligned to <span style={{ fontStyle: "italic", color: "#c2185b" }}>CAPS</span>, IEB and Cambridge.
              </h1>
              <p className="text-base opacity-80 mb-6 leading-snug">
                Practikal supports the practical components of South African secondary science across the three main exam routes: CAPS Physical Sciences and Life Sciences, IEB Sciences, and Cambridge IGCSE / A-level. Same syllabuses your school sits — same skills tested, same observation language used.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs opacity-70 mb-6" style={{ fontFamily: mono }}>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> CAPS Grade 10–12</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> IEB equivalents</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> Cambridge IGCSE Paper 6 + A-level Paper 5</span>
              </div>
              <Link
                href="/labs"
                className="inline-flex items-center gap-2 py-3 px-5 text-[11px] uppercase active:scale-95"
                style={{
                  fontFamily: mono,
                  letterSpacing: "0.25em",
                  backgroundColor: "#1a1f2e",
                  color: "#e8e4d8",
                  fontWeight: 500,
                }}
              >
                See Live Labs <ArrowRight size={13} />
              </Link>
            </div>
            <div className="md:col-span-5">
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/2", border: "1px solid rgba(26,31,46,0.2)" }}>
                <img
                  src="/pics/lab-12.jpg"
                  alt="A beaker placed on a printed periodic table, magnifying the elements below"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, rgba(26,31,46,0) 60%, rgba(26,31,46,0.45) 100%)",
                  }}
                />
                <div
                  className="absolute left-3 bottom-3 text-[9px] uppercase"
                  style={{ fontFamily: mono, letterSpacing: "0.28em", color: "#e8e4d8" }}
                >
                  CAPS · IEB · Cambridge IGCSE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative" style={{ backgroundColor: "rgba(26,31,46,0.03)" }}>
        <div className="max-w-5xl mx-auto px-5 py-10 sm:py-14">
          <h2 className="text-2xl mb-2" style={{ fontWeight: 500 }}>CAPS coverage</h2>
          <p className="text-sm opacity-75 mb-8 max-w-xl">
            Practical investigations from the official CAPS document for Grade 10–12 Physical Sciences and Life Sciences. Status reflects current build state.
          </p>
          <SubjectBlock title="Physical Sciences · CAPS" topics={CAPS_PHYSICAL_SCIENCES} />
          <SubjectBlock title="Life Sciences · CAPS" topics={CAPS_LIFE_SCIENCES} />
        </div>
      </section>

      <section className="relative">
        <div className="max-w-5xl mx-auto px-5 py-12 sm:py-16">
          <h2 className="text-2xl mb-1" style={{ fontWeight: 500 }}>{IGCSE.title}</h2>
          <p className="text-sm opacity-75 mb-6 max-w-xl">{IGCSE.blurb}</p>
          <div className="divide-y divide-stone-900/8 max-w-2xl mb-8">
            {IGCSE.examples.map((p) => <PracticalRow key={p.title} p={p} />)}
          </div>
          <h3 className="text-xl mb-1" style={{ fontWeight: 500 }}>{IEB_NOTE.title}</h3>
          <p className="text-sm opacity-75 max-w-xl">{IEB_NOTE.blurb}</p>
        </div>
      </section>

      <section className="relative">
        <div className="max-w-5xl mx-auto px-5 py-12">
          <div
            className="p-7 sm:p-10 text-center"
            style={{ backgroundColor: "#1a1f2e", color: "#e8e4d8" }}
          >
            <h2 className="text-2xl sm:text-3xl leading-tight mb-3" style={{ fontWeight: 500 }}>
              For schools, teachers and matric students.
            </h2>
            <p className="text-sm opacity-75 mb-6 max-w-lg mx-auto leading-snug">
              Open any lab on a desktop, tablet, or phone. No install, no sign-up, no chemicals to order.
            </p>
            <Link
              href="/labs"
              className="inline-flex items-center gap-2 py-3 px-5 text-[11px] uppercase active:scale-95"
              style={{
                fontFamily: mono,
                letterSpacing: "0.25em",
                backgroundColor: "#e8e4d8",
                color: "#1a1f2e",
                fontWeight: 500,
              }}
            >
              Open the Lab Library <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
