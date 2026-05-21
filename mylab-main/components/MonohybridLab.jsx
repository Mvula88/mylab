"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, Award, Play } from "lucide-react";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

const GENOTYPES = ["TT", "Tt", "tt"];
const PHENOTYPE = {
  TT: { p: "Tall", colour: "#5fa83e", emoji: "🌻" },
  Tt: { p: "Tall", colour: "#5fa83e", emoji: "🌻" },
  tt: { p: "Short", colour: "#a3531c", emoji: "🌱" },
};

const QUIZ = [
  {
    q: "Two heterozygous tall plants (Tt × Tt) are crossed. What is the EXPECTED phenotype ratio?",
    options: ["1 Tall : 1 Short", "3 Tall : 1 Short", "All Tall", "1 Tall : 3 Short"],
    correct: 1,
  },
  {
    q: "A test cross is used to find the genotype of a tall plant. What is the SECOND parent?",
    options: ["TT (homozygous dominant)", "Tt (heterozygous)", "tt (homozygous recessive)", "Any tall plant"],
    correct: 2,
  },
  {
    q: "If a test cross (Unknown × tt) produces ONLY tall offspring, the unknown parent's genotype is:",
    options: ["Tt", "TT", "tt", "Cannot tell"],
    correct: 1,
  },
  {
    q: "Why do real-world offspring numbers vary around the expected ratio (e.g. 297 : 103 instead of exactly 300 : 100 out of 400)?",
    options: [
      "Fertilisation is random — the predicted ratio is a probability, not a guarantee. Bigger samples get closer to it",
      "Mutations during meiosis",
      "Pollen quality varies",
      "Mendel's laws are inaccurate",
    ],
    correct: 0,
  },
];

function gametes(geno) {
  return [geno[0], geno[1]];
}

function offspring(p1, p2) {
  const a = gametes(p1)[Math.floor(Math.random() * 2)];
  const b = gametes(p2)[Math.floor(Math.random() * 2)];
  return [a, b].sort((x, y) => (x === "T" ? -1 : 1)).join(""); // sort so 'T' comes first
}

function punnett(p1, p2) {
  const g1 = gametes(p1);
  const g2 = gametes(p2);
  const rows = g1.map((a) => g2.map((b) => [a, b].sort((x, y) => (x === "T" ? -1 : 1)).join("")));
  return rows;
}

function expected(p1, p2) {
  const sq = punnett(p1, p2).flat();
  const counts = {};
  sq.forEach((g) => { counts[g] = (counts[g] || 0) + 1; });
  return counts;
}

export default function MonohybridLab() {
  const [p1, setP1] = useState("Tt");
  const [p2, setP2] = useState("Tt");
  const [results, setResults] = useState({ TT: 0, Tt: 0, tt: 0 });
  const [n, setN] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const run = (count) => {
    const r = { TT: 0, Tt: 0, tt: 0 };
    for (let i = 0; i < count; i++) {
      const g = offspring(p1, p2);
      r[g]++;
    }
    setResults((prev) => ({
      TT: prev.TT + r.TT,
      Tt: prev.Tt + r.Tt,
      tt: prev.tt + r.tt,
    }));
    setN((x) => x + count);
  };

  const reset = () => { setResults({ TT: 0, Tt: 0, tt: 0 }); setN(0); };

  const exp = expected(p1, p2);  // counts out of 4
  const expRatio = (g) => ((exp[g] || 0) / 4 * 100).toFixed(1);
  const obsRatio = (g) => (n === 0 ? "—" : (results[g] / n * 100).toFixed(1));

  const tallObs = (results.TT + results.Tt);
  const shortObs = results.tt;
  const tallExp = ((exp.TT || 0) + (exp.Tt || 0)) / 4 * n;
  const shortExp = (exp.tt || 0) / 4 * n;

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <main className="min-h-screen w-full relative"
      style={{ backgroundColor: "#e8e4d8", color: "#1a1f2e", fontFamily: serif }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#1a1f2e 1px, transparent 1px), linear-gradient(90deg, #1a1f2e 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

      <div className="max-w-6xl mx-auto px-5 pt-8 pb-16 relative">
        <Link href="/biology"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase opacity-70 hover:opacity-100 mb-5"
          style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
          <ArrowLeft size={13} /> Back to Biology
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="text-[11px] uppercase text-stone-500 mb-3"
              style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
              Biology · Inheritance · Monohybrid cross
            </div>
            <h1 className="text-3xl sm:text-4xl leading-[1.1] mb-3" style={{ fontWeight: 500 }}>
              <span style={{ fontStyle: "italic", color: "#c2185b" }}>Monohybrid</span> cross simulator
            </h1>
            <p className="text-sm sm:text-base opacity-80 leading-snug mb-5">
              A single gene with two alleles: T (tall, dominant) and t (short, recessive). Pick the genotype of each parent. The Punnett square shows the predicted gamete combinations. Run the cross 100 or 1000 times to see how observed offspring compare with expectation.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Parent 1", value: p1, setter: setP1 },
                { label: "Parent 2", value: p2, setter: setP2 },
              ].map((par) => (
                <div key={par.label} className="p-3"
                  style={{ backgroundColor: "rgba(232,228,216,0.5)", border: "1px solid rgba(26,31,46,0.18)" }}>
                  <div className="text-[10px] uppercase opacity-60 mb-2" style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                    {par.label}
                  </div>
                  <div className="flex gap-1">
                    {GENOTYPES.map((g) => (
                      <button key={g}
                        onClick={() => { par.setter(g); reset(); }}
                        className="flex-1 py-2 text-sm transition active:scale-95"
                        style={{
                          backgroundColor: par.value === g ? "#1a1f2e" : "transparent",
                          color: par.value === g ? "#e8e4d8" : "#1a1f2e",
                          border: "1px solid rgba(26,31,46,0.25)",
                          fontFamily: mono,
                        }}>
                        {g}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] opacity-65 mt-2">
                    {PHENOTYPE[par.value].p} ({par.value === "Tt" ? "heterozygous" : "homozygous"})
                  </div>
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden mb-4 p-4"
              style={{ backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)" }}>
              <PunnettSquare p1={p1} p2={p2} />
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button onClick={() => run(100)}
                className="py-2.5 px-4 text-[11px] uppercase active:scale-95 inline-flex items-center gap-2"
                style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                <Play size={12} /> Run × 100
              </button>
              <button onClick={() => run(1000)}
                className="py-2.5 px-4 text-[11px] uppercase active:scale-95 inline-flex items-center gap-2"
                style={{ fontFamily: mono, letterSpacing: "0.22em", border: "1px solid rgba(26,31,46,0.3)" }}>
                <Play size={12} /> Run × 1000
              </button>
              <button onClick={reset}
                className="py-2.5 px-3 text-[10px] uppercase active:scale-95 inline-flex items-center gap-1.5"
                style={{ fontFamily: mono, letterSpacing: "0.22em", border: "1px solid rgba(26,31,46,0.3)" }}>
                <RotateCcw size={12} /> Reset
              </button>
              <div className="ml-auto text-sm" style={{ fontFamily: mono }}>
                n = {n}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-5 mb-4"
              style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
              <div className="text-[10px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                Genotypes
              </div>
              <table className="w-full text-xs" style={{ fontFamily: mono }}>
                <thead>
                  <tr className="border-b border-stone-900/15">
                    <th className="text-left py-1.5 opacity-65">Genotype</th>
                    <th className="text-right py-1.5 opacity-65">obs</th>
                    <th className="text-right py-1.5 opacity-65">obs %</th>
                    <th className="text-right py-1.5 opacity-65">exp %</th>
                  </tr>
                </thead>
                <tbody>
                  {["TT", "Tt", "tt"].map((g) => (
                    <tr key={g} className="border-b border-stone-900/8">
                      <td className="py-1.5">{g}</td>
                      <td className="text-right py-1.5">{results[g]}</td>
                      <td className="text-right py-1.5">{obsRatio(g)}</td>
                      <td className="text-right py-1.5">{expRatio(g)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-[10px] uppercase text-stone-500 mt-4 mb-2" style={{ fontFamily: mono, letterSpacing: "0.22em" }}>Phenotypes</div>
              <table className="w-full text-xs" style={{ fontFamily: mono }}>
                <thead>
                  <tr className="border-b border-stone-900/15">
                    <th className="text-left py-1.5 opacity-65">Phenotype</th>
                    <th className="text-right py-1.5 opacity-65">obs</th>
                    <th className="text-right py-1.5 opacity-65">exp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-stone-900/8">
                    <td className="py-1.5">Tall</td>
                    <td className="text-right py-1.5">{tallObs}</td>
                    <td className="text-right py-1.5">{tallExp.toFixed(0)}</td>
                  </tr>
                  <tr className="border-b border-stone-900/8">
                    <td className="py-1.5">Short</td>
                    <td className="text-right py-1.5">{shortObs}</td>
                    <td className="text-right py-1.5">{shortExp.toFixed(0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {n > 0 && (
              <div className="p-5 mb-4"
                style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
                <div className="text-[10px] uppercase text-stone-500 mb-3"
                  style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                  Phenotype distribution
                </div>
                <PhenoBar tall={tallObs} short={shortObs} n={n} />
              </div>
            )}

            <div className="p-5"
              style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
              <div className="text-[10px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                Exam-style questions
              </div>
              {QUIZ.map((q, i) => (
                <div key={i} className="mb-4">
                  <div className="text-sm mb-2" style={{ fontWeight: 500 }}>{i + 1}. {q.q}</div>
                  <div className="space-y-1.5">
                    {q.options.map((opt, j) => {
                      const sel = answers[i] === j;
                      const isCorrect = submitted && q.correct === j;
                      const isWrong = submitted && sel && q.correct !== j;
                      return (
                        <button key={j}
                          onClick={() => !submitted && setAnswers((a) => ({ ...a, [i]: j }))}
                          disabled={submitted}
                          className="block w-full text-left px-3 py-2 text-xs transition active:scale-[0.99]"
                          style={{
                            backgroundColor: isCorrect ? "rgba(46,125,50,0.18)" : isWrong ? "rgba(194,24,91,0.18)" : sel ? "#1a1f2e" : "rgba(232,228,216,0.5)",
                            color: sel && !submitted ? "#e8e4d8" : "#1a1f2e",
                            border: `1px solid ${isCorrect ? "#2e7d32" : isWrong ? "#c2185b" : "rgba(26,31,46,0.18)"}`,
                          }}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!submitted ? (
                <button onClick={() => setSubmitted(true)}
                  disabled={Object.keys(answers).length < QUIZ.length}
                  className="w-full py-2.5 text-[11px] uppercase active:scale-95 disabled:opacity-40"
                  style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                  Submit answers
                </button>
              ) : (
                <div className="p-4 mt-2 text-center" style={{ backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                  <Award size={16} color="#ec407a" className="mx-auto mb-2" />
                  <div className="text-xl" style={{ fontWeight: 500 }}>{score} / {QUIZ.length} correct</div>
                  <button onClick={() => { setAnswers({}); setSubmitted(false); }}
                    className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase opacity-80 hover:opacity-100"
                    style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                    <RotateCcw size={12} /> Try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function PunnettSquare({ p1, p2 }) {
  const g1 = gametes(p1);
  const g2 = gametes(p2);
  return (
    <svg viewBox="0 0 400 280" className="w-full max-h-72">
      {/* axis labels */}
      <text x="200" y="20" textAnchor="middle" fontSize="13" fontFamily="serif" fontStyle="italic" fill="#1a1f2e">
        Parent 2: {p2}
      </text>
      <text x="30" y="160" fontSize="13" fontFamily="serif" fontStyle="italic" fill="#1a1f2e"
        transform="rotate(-90 30 160)">
        Parent 1: {p1}
      </text>
      {/* gametes top */}
      {g2.map((g, i) => (
        <text key={i} x={140 + i * 110} y="55" textAnchor="middle" fontSize="20" fontFamily="monospace" fill="#1a1f2e" fontWeight="600">
          {g}
        </text>
      ))}
      {/* gametes left */}
      {g1.map((g, i) => (
        <text key={i} x="80" y={120 + i * 90} textAnchor="middle" fontSize="20" fontFamily="monospace" fill="#1a1f2e" fontWeight="600">
          {g}
        </text>
      ))}
      {/* boxes */}
      {g1.map((a, i) =>
        g2.map((b, j) => {
          const combo = [a, b].sort((x, y) => (x === "T" ? -1 : 1)).join("");
          const phen = PHENOTYPE[combo];
          return (
            <g key={`${i}-${j}`}>
              <rect x={100 + j * 110} y={75 + i * 90} width="100" height="80"
                fill={phen.colour} opacity="0.55"
                stroke="#1a1f2e" strokeWidth="1.5" />
              <text x={150 + j * 110} y={115 + i * 90} textAnchor="middle" fontSize="22" fontFamily="monospace" fontWeight="600" fill="#1a1f2e">
                {combo}
              </text>
              <text x={150 + j * 110} y={138 + i * 90} textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#1a1f2e" opacity="0.7">
                {phen.p}
              </text>
            </g>
          );
        })
      )}
    </svg>
  );
}

function PhenoBar({ tall, short, n }) {
  const pT = (tall / n) * 100;
  const pS = (short / n) * 100;
  return (
    <div>
      <div className="flex h-10 overflow-hidden" style={{ border: "1px solid rgba(26,31,46,0.2)" }}>
        <div style={{ width: `${pT}%`, backgroundColor: "#5fa83e", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="text-xs" style={{ fontFamily: mono, color: "#fff" }}>Tall {pT.toFixed(1)}%</span>
        </div>
        <div style={{ width: `${pS}%`, backgroundColor: "#a3531c", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="text-xs" style={{ fontFamily: mono, color: "#fff" }}>{pS > 5 ? `Short ${pS.toFixed(1)}%` : `${pS.toFixed(1)}%`}</span>
        </div>
      </div>
    </div>
  );
}
