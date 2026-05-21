import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ArrowRight, CheckCircle2, Clock, Circle } from "lucide-react";

// status: 'live' (built), 'dev' (in development), 'planned'
const NSSCO_CHEMISTRY = [
  { topic: "Scientific processes (Topic 1)", practicals: [
    { title: "Paper chromatography", status: "live", href: "/chromatography",
      note: "NSSCO 2024 Paper 3 Q1" },
    { title: "Filtration & crystallisation", status: "live", href: "/filtration",
      note: "NSSCO 2024 Paper 3 Q2 — rock salt" },
    { title: "Fractional distillation of wine / ethanol", status: "live", href: "/fractional-distillation" },
  ]},
  { topic: "Matter (Topic 2)", practicals: [
    { title: "Diffusion of gases (ammonia + HCl tube)", status: "live", href: "/gas-diffusion" },
    { title: "Reactivity of Group I metals with water", status: "live", href: "/group-1-metals" },
  ]},
  { topic: "Electrochemistry (Topic 5)", practicals: [
    { title: "Electrolysis of common electrolytes", status: "live", href: "/electrolysis",
      note: "PbBr₂ molten, H₂SO₄, HCl, NaCl brine, CuSO₄" },
    { title: "Electroplating zinc with copper", status: "live", href: "/electroplating" },
  ]},
  { topic: "Chemical reactions (Topic 6)", practicals: [
    { title: "Rate by gas collection (KClO₃ → O₂)", status: "live", href: "/gas-collection-rate",
      note: "NSSCO 2024 Paper 3 Q3" },
    { title: "Rate · Mg + HCl (concentration)", status: "live", href: "/rate-of-reaction" },
    { title: "Rate · Na₂S₂O₃ + HCl (turbidity)", status: "live", href: "/thiosulfate-rate" },
  ]},
  { topic: "Acids, bases and salts (Topic 7)", practicals: [
    { title: "Acid–base titration with phenolphthalein", status: "live", href: "/titration" },
    { title: "Preparation of insoluble salts (precipitation)", status: "live", href: "/insoluble-salts" },
    { title: "Preparation of soluble salts (acid + carbonate)", status: "live", href: "/soluble-salts" },
  ]},
  { topic: "Qualitative analysis (Topic 8)", practicals: [
    { title: "Cations + anions + gas tests (full)", status: "live", href: "/qualitative-analysis",
      note: "Annexe B wording · NSSCO 2024 Q4 + NSSCAS 2024 Q2" },
    { title: "Flame & gas tests drill", status: "live", href: "/flame-gas-tests" },
  ]},
  { topic: "Metals (Topic 9)", practicals: [
    { title: "Reactivity series — displacement reactions", status: "live", href: "/reactivity-series" },
  ]},
  { topic: "Organic chemistry (Topic 10)", practicals: [
    { title: "Fermentation + distillation of ethanol", status: "live", href: "/fermentation" },
    { title: "Test for unsaturation (bromine water)", status: "live", href: "/bromine-water" },
  ]},
];

const NSSCO_BIOLOGY = [
  { topic: "Food tests", practicals: [
    { title: "Iodine · Benedict's · Biuret · Emulsion", status: "live", href: "/food-tests",
      note: "Test for starch, reducing sugar, protein, lipid" },
    { title: "Identifying nutrients in real foods", status: "live", href: "/nutrients-in-foods" },
    { title: "Energy content of food (combustion calorimetry)", status: "live", href: "/food-energy" },
  ]},
  { topic: "Photosynthesis", practicals: [
    { title: "Starch test in a leaf", status: "live", href: "/photosynthesis" },
    { title: "Pondweed (Elodea) bubble counter", status: "live", href: "/elodea" },
    { title: "Need for CO₂ (bagged leaves)", status: "live", href: "/co2" },
    { title: "Hill reaction (DCPIP, A-level extension)", status: "live", href: "/hill-reaction" },
    { title: "Need for chlorophyll (variegated leaf)", status: "live", href: "/variegated-leaf" },
  ]},
  { topic: "Respiration", practicals: [
    { title: "Testing exhaled air for CO₂ (limewater)", status: "live", href: "/limewater-exhaled" },
    { title: "Respiration in germinating seeds (heat)", status: "live", href: "/germinating-seeds" },
    { title: "Comparing respiration rates (respirometer)", status: "live", href: "/respirometer" },
  ]},
  { topic: "Enzymes", practicals: [
    { title: "Effect of temperature on amylase activity", status: "live", href: "/enzyme-temperature" },
    { title: "Effect of pH on enzyme activity", status: "live", href: "/enzyme-ph" },
    { title: "Effect of substrate concentration on catalase", status: "live", href: "/enzyme-substrate" },
  ]},
  { topic: "Diffusion, osmosis & active transport", practicals: [
    { title: "Osmosis with potato cylinders", status: "live", href: "/osmosis-potato" },
    { title: "Diffusion into agar cubes (SA:V)", status: "live", href: "/diffusion-agar" },
    { title: "Visking tubing model of selective permeability", status: "live", href: "/visking-tubing" },
  ]},
  { topic: "Plant transport", practicals: [
    { title: "Transpiration with a potometer", status: "live", href: "/potometer" },
    { title: "Stained celery: xylem transport", status: "live", href: "/celery-xylem" },
  ]},
  { topic: "Microscopy", practicals: [
    { title: "Animal vs plant cells under the microscope", status: "live", href: "/microscopy-cells" },
    { title: "Mitosis stages in onion root tip", status: "live", href: "/mitosis" },
  ]},
  { topic: "Inheritance & variation", practicals: [
    { title: "Monohybrid cross simulator", status: "live", href: "/monohybrid" },
    { title: "Continuous vs discontinuous variation", status: "live", href: "/variation" },
  ]},
];

const NSSCO_PHYSICS = [
  { topic: "Mechanics", practicals: [
    { title: "Simple pendulum — period vs length, find g", status: "live", href: "/pendulum" },
    { title: "Hooke's law — extension vs load", status: "live", href: "/hookes-law" },
    { title: "Density of irregular solid (displacement)", status: "live", href: "/density-displacement" },
    { title: "Friction on an inclined plane", status: "live", href: "/friction-incline" },
  ]},
  { topic: "Light & optics", practicals: [
    { title: "Refraction through a glass block (Snell)", status: "live", href: "/refraction" },
    { title: "Focal length of a converging lens", status: "live", href: "/lens-focal-length" },
    { title: "Reflection from a plane mirror", status: "live", href: "/plane-mirror" },
  ]},
  { topic: "Thermal physics", practicals: [
    { title: "Specific heat capacity of water", status: "live", href: "/specific-heat-capacity" },
    { title: "Boyle's law (gas syringe + pressure)", status: "live", href: "/boyles-law" },
  ]},
  { topic: "Electricity & magnetism", practicals: [
    { title: "Ohm's law (V/I for a resistor)", status: "live", href: "/ohms-law" },
    { title: "Resistance vs length of wire", status: "live", href: "/resistance-wire" },
    { title: "Electromagnet — coil and current", status: "live", href: "/electromagnet" },
  ]},
  { topic: "Sound & waves", practicals: [
    { title: "Resonance tube — speed of sound", status: "live", href: "/resonance-tube" },
  ]},
];

const NSSCAS_NOTE = {
  title: "NSSCAS · Advanced Subsidiary Level",
  blurb: "Cambridge-style AS Chemistry (8224), Biology (8328) and Physics (8323) practical papers. Required apparatus and observation precision is higher; we mirror Paper 3 question style.",
  examples: [
    { title: "Iodine clock kinetics (H₂O₂ + KI + thiosulfate)", status: "live", href: "/iodine-clock",
      note: "NSSCAS 2024 Paper 3 Q1" },
    { title: "Hill reaction · DCPIP decolourisation", status: "live", href: "/hill-reaction" },
    { title: "Standardised acid-base titration (alloy redox)", status: "live", href: "/alloy-redox-titration" },
    { title: "Calorimetry — enthalpy of neutralisation", status: "live", href: "/enthalpy-neutralisation" },
  ],
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

export default function NamibiaPage() {
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
                🇳🇦 Namibia · NSSCO 6117 · NSSCAS 8224
              </div>
              <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-4" style={{ fontWeight: 500 }}>
                Built for the <span style={{ fontStyle: "italic", color: "#c2185b" }}>DNEA</span> syllabus.
              </h1>
              <p className="text-base opacity-80 mb-6 leading-snug">
                Practikal maps onto the Namibia Senior Secondary Certificate syllabuses for Biology, Chemistry and Physics. Every required Paper 3 practical from the official syllabus is on our roadmap; the observation wording follows NSSCO Annexe B exactly so what students see in the simulation is what gets marked correct in the exam.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs opacity-70 mb-6" style={{ fontFamily: mono }}>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> NSSCO 6117 syllabus (Grade 10–11)</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> NSSCAS 8224 syllabus (AS Level)</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> Past-paper question style</span>
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
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", border: "1px solid rgba(26,31,46,0.2)" }}>
                <img
                  src="/pics/lab-13.jpg"
                  alt="A 250 mL volumetric flask resting on an open periodic table"
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
                  NSSCO Annexe B · verbatim
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative" style={{ backgroundColor: "rgba(26,31,46,0.03)" }}>
        <div className="max-w-5xl mx-auto px-5 py-10 sm:py-14">
          <h2 className="text-2xl mb-2" style={{ fontWeight: 500 }}>NSSCO · Ordinary Level coverage</h2>
          <p className="text-sm opacity-75 mb-8 max-w-xl">
            Practical topics from the official NSSCO syllabus document. Status reflects current build state — everything will be live by end of roadmap.
          </p>
          <SubjectBlock title="Chemistry · 6117/3" topics={NSSCO_CHEMISTRY} />
          <SubjectBlock title="Biology · 6114/3" topics={NSSCO_BIOLOGY} />
          <SubjectBlock title="Physics · 6116/3" topics={NSSCO_PHYSICS} />
        </div>
      </section>

      <section className="relative">
        <div className="max-w-5xl mx-auto px-5 py-12 sm:py-16">
          <h2 className="text-2xl mb-1" style={{ fontWeight: 500 }}>{NSSCAS_NOTE.title}</h2>
          <p className="text-sm opacity-75 mb-6 max-w-xl">{NSSCAS_NOTE.blurb}</p>
          <div className="divide-y divide-stone-900/8 max-w-2xl">
            {NSSCAS_NOTE.examples.map((p) => <PracticalRow key={p.title} p={p} />)}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="max-w-5xl mx-auto px-5 py-12">
          <div
            className="p-7 sm:p-10 text-center"
            style={{ backgroundColor: "#1a1f2e", color: "#e8e4d8" }}
          >
            <h2 className="text-2xl sm:text-3xl leading-tight mb-3" style={{ fontWeight: 500 }}>
              Try the labs that are already live.
            </h2>
            <p className="text-sm opacity-75 mb-6 max-w-lg mx-auto leading-snug">
              {`9 chemistry labs, 5 biology labs, 2 physics labs and 2 maths labs are running today. Free to use, no sign-up required.`}
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
