import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ArrowRight, CheckCircle2, Clock, Circle, FlaskConical } from "lucide-react";

const TOPICS = [
  { title: "Qualitative analysis", practicals: [
    { title: "Cations + anions + gas tests (full)", status: "live", href: "/qualitative-analysis",
      note: "All Annexe B tests; NSSCO Paper 3 / NSSCAS Paper 3 core" },
    { title: "Flame & gas tests drill", status: "live", href: "/flame-gas-tests" },
  ]},
  { title: "Separation & purification", practicals: [
    { title: "Filtration + crystallisation (rock salt)", status: "live", href: "/filtration" },
    { title: "Paper chromatography", status: "live", href: "/chromatography" },
    { title: "Fractional distillation (wine → ethanol)", status: "live", href: "/fractional-distillation" },
    { title: "Diffusion of gases (NH₃ + HCl tube)", status: "live", href: "/gas-diffusion" },
  ]},
  { title: "Rates of reaction", practicals: [
    { title: "KClO₃ → O₂ in a gas syringe", status: "live", href: "/gas-collection-rate" },
    { title: "Mg + HCl (concentration effect)", status: "live", href: "/rate-of-reaction" },
    { title: "Iodine clock (H₂O₂ + KI + thiosulfate)", status: "live", href: "/iodine-clock" },
    { title: "Na₂S₂O₃ + HCl (turbidity timer)", status: "live", href: "/thiosulfate-rate" },
  ]},
  { title: "Acids, bases & salts", practicals: [
    { title: "Acid–base titration (phenolphthalein)", status: "live", href: "/titration" },
    { title: "Insoluble salt preparation (precipitation)", status: "live", href: "/insoluble-salts" },
    { title: "Soluble salt preparation (acid + carbonate)", status: "live", href: "/soluble-salts" },
    { title: "Standardised redox titration (alloy)", status: "live", href: "/alloy-redox-titration" },
  ]},
  { title: "Electrochemistry", practicals: [
    { title: "Electrolysis of 6 electrolytes", status: "live", href: "/electrolysis" },
    { title: "Electroplating zinc with copper", status: "live", href: "/electroplating" },
  ]},
  { title: "Organic chemistry", practicals: [
    { title: "Test for unsaturation (Br₂ water)", status: "live", href: "/bromine-water" },
    { title: "Fermentation of glucose to ethanol", status: "live", href: "/fermentation" },
  ]},
  { title: "Metals & reactivity", practicals: [
    { title: "Reactivity series (displacement)", status: "live", href: "/reactivity-series" },
    { title: "Reactivity of Group I metals with water", status: "live", href: "/group-1-metals" },
  ]},
  { title: "Calorimetry & energetics", practicals: [
    { title: "Enthalpy of neutralisation", status: "live", href: "/enthalpy-neutralisation" },
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
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 px-2 -mx-2 opacity-70">
      {Body}
    </div>
  );
}

export default function ChemistryPage() {
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
              <FlaskConical size={36} strokeWidth={1.5} className="mb-4" />
              <div className="text-[11px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
                Subject · Chemistry
              </div>
              <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-3" style={{ fontWeight: 500 }}>
                Every Chemistry practical the <span style={{ fontStyle: "italic", color: "#c2185b" }}>exam</span> can throw at you.
              </h1>
              <p className="text-base opacity-80 mb-5 leading-snug">
                From qualitative analysis (the single largest chunk of Paper 3) through titration, electrolysis, rates and organic chemistry. Every observation matches NSSCO Annexe B and the Cambridge mark scheme. {liveCount} of {totalCount} practicals are live today; the rest are on the roadmap.
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
                  src="/pics/lab-01.jpg"
                  alt="Volumetric flask of blue solution, conical flasks of green and orange solutions on a white bench"
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
            Organised by syllabus topic — applies to NSSCO, CAPS, IGCSE and Cambridge AS / A-level (which share most content).
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
