import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  FlaskConical, Atom, Leaf, Sigma,
  GraduationCap, Users, ShieldCheck, Wifi,
  ArrowRight, CheckCircle2,
} from "lucide-react";

export default function Home() {
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  const subjects = [
    {
      icon: Leaf,
      name: "Biology",
      href: "/biology",
      practicals: "20+ practicals",
      blurb: "Food tests, photosynthesis investigations, microscopy, enzymes, transport. Every NSSCO Biology Paper 3 practical, with mark-scheme observations.",
    },
    {
      icon: FlaskConical,
      name: "Chemistry",
      href: "/chemistry",
      practicals: "25+ practicals",
      blurb: "Qualitative analysis, titration, rate of reaction, electrolysis, organic chemistry. Observation wording from NSSCO Annexe B.",
    },
    {
      icon: Atom,
      name: "Physics",
      href: "/physics",
      practicals: "18+ practicals",
      blurb: "Pendulum, refraction, Hooke's law, Ohm's law, electromagnetism. Apparatus you can drag, rotate and read.",
    },
    {
      icon: Sigma,
      name: "Maths",
      href: "/maths",
      practicals: "10+ explorations",
      blurb: "Monte Carlo π, Galton board, probability simulations, calculus visualisations. Build intuition by running, not just reading.",
    },
  ];

  const valueProps = [
    {
      icon: ShieldCheck,
      title: "Exam-faithful observations",
      blurb: "Every result, colour and wording matches the NSSCO Annexe B / CAIE mark scheme — so what students see here is what gets marked correct on Paper 3.",
    },
    {
      icon: Wifi,
      title: "Works on the phone in your pocket",
      blurb: "No lab, no chemicals, no power outages. Runs in the browser. Offline-ready mode in development for schools with patchy connectivity.",
    },
    {
      icon: GraduationCap,
      title: "Built for the syllabuses students actually sit",
      blurb: "Namibia NSSCO + NSSCAS, South Africa CAPS / IEB / IGCSE / Cambridge A-level. Topic and practical coverage maps onto the official syllabus.",
    },
    {
      icon: Users,
      title: "For students AND for teachers",
      blurb: "Students drill and self-prep for the practical paper. Teachers project a working experiment in class, with the exam vocabulary built in.",
    },
  ];

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

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-5 pt-12 pb-16 sm:pt-20 sm:pb-24 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
            <div className="md:col-span-7">
              <div
                className="text-[11px] uppercase text-stone-500 mb-4"
                style={{ fontFamily: mono, letterSpacing: "0.28em" }}
              >
                For NSSCO · NSSCAS · CAPS · IGCSE schools
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-5" style={{ fontWeight: 500 }}>
                Every science practical your students must sit — <span style={{ color: "#c2185b", fontStyle: "italic" }}>working, on any device</span>.
              </h1>
              <p className="text-base sm:text-lg opacity-80 mb-7 leading-snug">
                Practikal is a 3D interactive science lab for secondary schools in Southern Africa. Run titrations, qualitative analysis, photosynthesis investigations and electrolysis — with the exam-faithful results students will be marked on.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  href="/labs"
                  className="inline-flex items-center gap-2 py-3.5 px-6 text-[12px] uppercase active:scale-95"
                  style={{
                    fontFamily: mono,
                    letterSpacing: "0.25em",
                    backgroundColor: "#1a1f2e",
                    color: "#e8e4d8",
                    fontWeight: 500,
                  }}
                >
                  Try a Lab Free <ArrowRight size={14} />
                </Link>
                <Link
                  href="/namibia"
                  className="inline-flex items-center gap-2 py-3.5 px-6 text-[12px] uppercase active:scale-95"
                  style={{
                    fontFamily: mono,
                    letterSpacing: "0.25em",
                    border: "1px solid rgba(26,31,46,0.35)",
                  }}
                >
                  See NSSCO Coverage
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs opacity-70" style={{ fontFamily: mono }}>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> Annexe B observation wording</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> Drag-to-rotate 3D apparatus</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> Mark-scheme-aligned scoring</span>
              </div>
            </div>
            <div className="md:col-span-5 relative">
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/5", border: "1px solid rgba(26,31,46,0.2)" }}>
                <img
                  src="/pics/lab-05.jpg"
                  alt="Laboratory glassware on a wooden bench at dawn — flasks, beakers and a stoppered volumetric, coloured liquids catching the light"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, rgba(26,31,46,0) 55%, rgba(26,31,46,0.55) 100%)",
                  }}
                />
                <div
                  className="absolute left-3 bottom-3 text-[9px] uppercase"
                  style={{
                    fontFamily: mono,
                    letterSpacing: "0.28em",
                    color: "#e8e4d8",
                  }}
                >
                  Volumetric · Stoppered · Calibrated
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM STATEMENT ────────────────────────────────────────── */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-5 py-14 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5">
              <div
                className="text-[11px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.28em" }}
              >
                The problem
              </div>
              <h2 className="text-3xl leading-tight mb-5" style={{ fontWeight: 500 }}>
                Most schools sit Paper 3. Most schools can't run Paper 3.
              </h2>
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/2", border: "1px solid rgba(26,31,46,0.2)" }}>
                <img
                  src="/pics/lab-04.jpg"
                  alt="Empty beakers, conical flasks and a pipette on a lab bench"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "saturate(0.85)" }}
                />
              </div>
            </div>
            <div className="md:col-span-7 text-base opacity-80 leading-snug space-y-3">
              <p>
                Across Namibia and South Africa, secondary students sit a practical or Alternative-to-Practical paper that counts for 20–25% of their final science grade. Most of them have <span style={{ fontStyle: "italic" }}>never actually carried out</span> the experiments they're being tested on.
              </p>
              <p>
                Reagents run out. Glassware breaks. Power cuts. Class sizes mean each student gets one shot at a titration in their entire schooling. Examining boards know this — that's why the Alternative-to-Practical paper exists.
              </p>
              <p style={{ fontWeight: 500 }}>
                Practikal fills that gap. Every required practical, simulated end-to-end, with the exam vocabulary baked in.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4 mt-2 border-t border-stone-900/15">
                <div>
                  <div className="text-3xl" style={{ fontWeight: 500 }}>20–25%</div>
                  <div className="text-[10px] uppercase opacity-60 mt-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>
                    of grade is practical
                  </div>
                </div>
                <div>
                  <div className="text-3xl" style={{ fontWeight: 500 }}>1 in 4</div>
                  <div className="text-[10px] uppercase opacity-60 mt-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>
                    schools fully equipped
                  </div>
                </div>
                <div>
                  <div className="text-3xl" style={{ fontWeight: 500 }}>0</div>
                  <div className="text-[10px] uppercase opacity-60 mt-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>
                    reagents needed here
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SUBJECTS ─────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-5 py-14 sm:py-20">
          <div
            className="text-[11px] uppercase text-stone-500 mb-3"
            style={{ fontFamily: mono, letterSpacing: "0.28em" }}
          >
            Subjects covered
          </div>
          <h2 className="text-3xl leading-tight mb-8 max-w-2xl" style={{ fontWeight: 500 }}>
            Four subjects. <span style={{ fontStyle: "italic" }}>Every required practical.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {subjects.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="block p-5 transition active:scale-[0.99] hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "rgba(26,31,46,0.04)",
                    border: "1px solid rgba(26,31,46,0.18)",
                  }}
                >
                  <Icon size={28} strokeWidth={1.5} className="mb-3" />
                  <div className="text-xl mb-1" style={{ fontWeight: 500 }}>{s.name}</div>
                  <div
                    className="text-[10px] uppercase opacity-55 mb-3"
                    style={{ fontFamily: mono, letterSpacing: "0.18em" }}
                  >
                    {s.practicals}
                  </div>
                  <p className="text-xs opacity-75 leading-snug">{s.blurb}</p>
                  <div
                    className="mt-4 text-[10px] uppercase flex items-center gap-1"
                    style={{ fontFamily: mono, letterSpacing: "0.22em" }}
                  >
                    Explore <ArrowRight size={11} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPS ──────────────────────────────────────────────── */}
      <section className="relative" style={{ backgroundColor: "rgba(26,31,46,0.03)" }}>
        <div className="max-w-6xl mx-auto px-5 py-14 sm:py-20">
          <div
            className="text-[11px] uppercase text-stone-500 mb-3"
            style={{ fontFamily: mono, letterSpacing: "0.28em" }}
          >
            What makes it different
          </div>
          <h2 className="text-3xl leading-tight mb-8 max-w-2xl" style={{ fontWeight: 500 }}>
            Not another generic STEM sim. Built for <span style={{ fontStyle: "italic" }}>your syllabus</span>.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {valueProps.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="p-5"
                  style={{
                    backgroundColor: "rgba(232,228,216,0.7)",
                    border: "1px solid rgba(26,31,46,0.15)",
                  }}
                >
                  <Icon size={24} strokeWidth={1.5} className="mb-3" />
                  <div className="text-lg mb-1" style={{ fontWeight: 500 }}>{v.title}</div>
                  <p className="text-xs opacity-75 leading-snug">{v.blurb}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CURRICULA ────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-5 py-14 sm:py-20">
          <div
            className="text-[11px] uppercase text-stone-500 mb-3"
            style={{ fontFamily: mono, letterSpacing: "0.28em" }}
          >
            Pick your country
          </div>
          <h2 className="text-3xl leading-tight mb-8 max-w-2xl" style={{ fontWeight: 500 }}>
            Aligned to the examining boards your school <span style={{ fontStyle: "italic" }}>actually sits</span>.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link
              href="/namibia"
              className="block p-6 transition active:scale-[0.99] hover:-translate-y-0.5"
              style={{
                backgroundColor: "rgba(26,31,46,0.04)",
                border: "1px solid rgba(26,31,46,0.18)",
              }}
            >
              <div className="text-2xl mb-1" style={{ fontWeight: 500 }}>🇳🇦 Namibia</div>
              <div
                className="text-[10px] uppercase opacity-55 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}
              >
                NSSCO 6117 · NSSCAS 8224 · MoEAC / DNEA
              </div>
              <p className="text-sm opacity-75 leading-snug mb-3">
                Every Ordinary-Level Paper 3 practical and Advanced-Subsidiary Paper 3 practical mapped to the DNEA syllabus and recent past papers. Observation wording follows NSSCO Annexe B exactly.
              </p>
              <div
                className="text-[10px] uppercase flex items-center gap-1"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}
              >
                See coverage <ArrowRight size={11} />
              </div>
            </Link>
            <Link
              href="/south-africa"
              className="block p-6 transition active:scale-[0.99] hover:-translate-y-0.5"
              style={{
                backgroundColor: "rgba(26,31,46,0.04)",
                border: "1px solid rgba(26,31,46,0.18)",
              }}
            >
              <div className="text-2xl mb-1" style={{ fontWeight: 500 }}>🇿🇦 South Africa</div>
              <div
                className="text-[10px] uppercase opacity-55 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}
              >
                CAPS · IEB · Cambridge IGCSE / A-level
              </div>
              <p className="text-sm opacity-75 leading-snug mb-3">
                Coverage of CAPS Grade 10–12 Physical Sciences and Life Sciences practicals, IEB equivalents, and Cambridge IGCSE / A-level Paper 6 (Alternative to Practical) and Paper 5.
              </p>
              <div
                className="text-[10px] uppercase flex items-center gap-1"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}
              >
                See coverage <ArrowRight size={11} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="relative" style={{ backgroundColor: "rgba(26,31,46,0.03)" }}>
        <div className="max-w-6xl mx-auto px-5 py-14 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
            <div className="md:col-span-5">
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", border: "1px solid rgba(26,31,46,0.2)" }}>
                <img
                  src="/pics/lab-06.jpg"
                  alt="A scientist in a white coat and blue nitrile gloves pipettes a coloured sample into a rack of microtubes"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, rgba(26,31,46,0) 60%, rgba(26,31,46,0.55) 100%)",
                  }}
                />
                <div
                  className="absolute left-3 bottom-3 text-[9px] uppercase"
                  style={{ fontFamily: mono, letterSpacing: "0.28em", color: "#e8e4d8" }}
                >
                  Aim → method → result
                </div>
              </div>
            </div>
            <div className="md:col-span-7">
              <div
                className="text-[11px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.28em" }}
              >
                How it works
              </div>
              <h2 className="text-3xl leading-tight mb-10 max-w-xl" style={{ fontWeight: 500 }}>
                Three clicks from <span style={{ fontStyle: "italic" }}>aim</span> to scored result.
              </h2>
              <div className="space-y-7">
                {[
                  {
                    step: "01",
                    title: "Pick a practical",
                    blurb: "Choose from your syllabus list. Read the aim. Set the variables — lamp distance, acid concentration, leaf condition, whatever the experiment needs.",
                  },
                  {
                    step: "02",
                    title: "Run the experiment",
                    blurb: "Watch the apparatus in 3D — burette dripping, leaf decolourising, gas syringe filling. Real-time animations of the chemistry/biology/physics, not slideshows.",
                  },
                  {
                    step: "03",
                    title: "Get scored on the exam questions",
                    blurb: "After running, answer the exact questions a past paper would ask. Mark-scheme explanations show why your answer was right or wrong.",
                  },
                ].map((s) => (
                  <div key={s.step} className="grid grid-cols-12 gap-4">
                    <div
                      className="col-span-2 text-[11px] uppercase pt-1"
                      style={{ fontFamily: mono, letterSpacing: "0.28em", color: "#ec407a", fontWeight: 600 }}
                    >
                      {s.step}
                    </div>
                    <div className="col-span-10">
                      <div className="text-xl mb-1" style={{ fontWeight: 500 }}>{s.title}</div>
                      <p className="text-sm opacity-75 leading-snug">{s.blurb}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-5 py-14 sm:py-20">
          <div
            className="relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0"
            style={{ backgroundColor: "#1a1f2e", color: "#e8e4d8" }}
          >
            <div className="relative md:col-span-5" style={{ minHeight: 260 }}>
              <img
                src="/pics/lab-09.jpg"
                alt="A rack of test tubes holding solutions of different colours under stage lighting"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(26,31,46,0) 50%, rgba(26,31,46,0.95) 100%)",
                }}
              />
            </div>
            <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
              <div
                className="text-[11px] uppercase mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.28em", color: "#ec407a" }}
              >
                Free · No sign-up
              </div>
              <h2 className="text-3xl sm:text-4xl leading-tight mb-3" style={{ fontWeight: 500 }}>
                Try a working lab. <span style={{ color: "#ec407a", fontStyle: "italic" }}>No sign-up.</span>
              </h2>
              <p className="text-sm opacity-75 mb-7 max-w-lg leading-snug">
                The full Qualitative Analysis lab is open to try — identify an unknown cation and anion using the NSSCO standard tests. Free, in your browser, right now.
              </p>
              <div>
                <Link
                  href="/qualitative-analysis"
                  className="inline-flex items-center gap-2 py-3.5 px-6 text-[12px] uppercase active:scale-95"
                  style={{
                    fontFamily: mono,
                    letterSpacing: "0.25em",
                    backgroundColor: "#e8e4d8",
                    color: "#1a1f2e",
                    fontWeight: 500,
                  }}
                >
                  Open the Lab <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
