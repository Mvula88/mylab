"use client";

import { useState } from "react";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, Card } from "./LabUI";

// reactivity rank: lower = more reactive
const METALS = [
  { id: "Mg", name: "Magnesium", colour: "#dadada", rank: 0 },
  { id: "Zn", name: "Zinc",      colour: "#b7b9c0", rank: 1 },
  { id: "Cu", name: "Copper",    colour: "#b96a2f", rank: 2 },
  { id: "Ag", name: "Silver",    colour: "#dededa", rank: 3 },
];

const SOLUTIONS = [
  { id: "Mg2+", label: "MgSO₄(aq)", host: "Mg", colour: "rgba(232,228,216,0.35)" },
  { id: "Zn2+", label: "ZnSO₄(aq)", host: "Zn", colour: "rgba(232,228,216,0.35)" },
  { id: "Cu2+", label: "CuSO₄(aq)", host: "Cu", colour: "rgba(36,118,179,0.55)" },
  { id: "Ag+",  label: "AgNO₃(aq)", host: "Ag", colour: "rgba(232,228,216,0.5)" },
];

const cellKey = (m, s) => `${m}-${s}`;

const QUIZ = [
  {
    q: "After testing all 16 combinations, what is the correct reactivity order (most → least)?",
    options: [
      "Cu > Zn > Mg > Ag",
      "Mg > Zn > Cu > Ag",
      "Ag > Cu > Zn > Mg",
      "Zn > Mg > Cu > Ag",
    ],
    correct: 1,
  },
  {
    q: "Why does copper metal go BLUE when placed in silver nitrate solution?",
    options: [
      "Copper is dyed by silver",
      "Copper is more reactive than silver and displaces it; Cu²⁺ ions form in solution (blue), and Ag deposits on the copper",
      "AgNO₃ is naturally blue",
      "Copper rusts",
    ],
    correct: 1,
  },
  {
    q: "Why does magnesium NOT react with magnesium sulfate solution?",
    options: [
      "Magnesium does not react with sulfates",
      "A metal CANNOT displace itself — Mg cannot reduce Mg²⁺",
      "The solution is too dilute",
      "Mg dissolves silently",
    ],
    correct: 1,
  },
  {
    q: "Ionic half-equation for the reaction between zinc and copper(II) sulfate:",
    options: [
      "Cu(s) + Zn²⁺(aq) → Cu²⁺(aq) + Zn(s)",
      "Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)",
      "Zn²⁺ + 2e⁻ → Zn",
      "ZnSO₄ + CuSO₄ → CuSO₄ + ZnSO₄",
    ],
    correct: 1,
  },
];

export default function ReactivitySeriesLab() {
  const [results, setResults] = useState({}); // cellKey → revealed
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const test = (m, s) => {
    setResults((r) => ({ ...r, [cellKey(m, s)]: true }));
  };

  const reset = () => setResults({});
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  // determine reaction
  const reactsBetween = (metalId, solnId) => {
    const m = METALS.find((x) => x.id === metalId);
    const s = SOLUTIONS.find((x) => x.id === solnId);
    const hostMetal = METALS.find((x) => x.id === s.host);
    return m.rank < hostMetal.rank; // metal is more reactive than the metal in the salt
  };

  const observation = (metalId, solnId) => {
    const m = METALS.find((x) => x.id === metalId);
    const s = SOLUTIONS.find((x) => x.id === solnId);
    if (!reactsBetween(metalId, solnId)) return "No reaction.";
    const host = METALS.find((x) => x.id === s.host);
    if (solnId === "Cu2+") return `Blue solution fades; brown ${host.id} deposit on the ${m.id} strip.`;
    if (solnId === "Ag+") return `Silvery crystals form on the ${m.id} strip; solution turns ${m.id === "Cu" ? "blue (Cu²⁺)" : "colourless (M²⁺)"}.`;
    if (solnId === "Zn2+") return `Grey Zn deposit forms on the ${m.id} strip.`;
    return "Reaction proceeds.";
  };

  return (
    <Shell back="/chemistry" backLabel="Back to Chemistry" topic="Chemistry · Reactivity series · Displacement">
      <Header
        title="The"
        accent="reactivity series"
        blurb="A 4 × 4 set of test tubes. In each tube a metal strip is placed in a solution of another metal's salt. A more reactive metal displaces a less reactive one from its salt — you can watch which combinations react."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden mb-4 p-4" style={{ backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)" }}>
            <Matrix METALS={METALS} SOLUTIONS={SOLUTIONS} results={results} test={test} reactsBetween={reactsBetween} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>{Object.keys(results).length} / 16 tested</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Latest observation">
            {Object.keys(results).length === 0 ? (
              <div className="text-xs opacity-60">Click any cell in the matrix to drop the metal into the solution.</div>
            ) : (
              <div className="text-xs space-y-2">
                {Object.keys(results).slice(-3).reverse().map((key) => {
                  const [m, s] = key.split("-");
                  return (
                    <div key={key} className="leading-snug">
                      <span style={{ fontFamily: mono, color: "#c2185b", fontWeight: 600 }}>
                        {m} + {SOLUTIONS.find((x) => x.id === s).label}:
                      </span>{" "}
                      {observation(m, s)}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {Object.keys(results).length === 16 && (
            <div className="mt-4">
              <Card label="Reactivity series concluded">
                <div className="text-base text-center my-2" style={{ fontFamily: mono, fontWeight: 600 }}>
                  Mg &gt; Zn &gt; Cu &gt; Ag
                </div>
                <div className="text-xs opacity-75 leading-snug">
                  Each row of the matrix shows fewer reactions as you move down (the metal is less reactive); each column shows more reactions toward the right (the salt's metal is less reactive).
                </div>
              </Card>
            </div>
          )}

          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Matrix({ METALS, SOLUTIONS, results, test, reactsBetween }) {
  const cellSize = 100;
  const W = 600, H = 480;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Column headers (solutions) */}
      {SOLUTIONS.map((s, j) => (
        <text key={s.id} x={130 + j * cellSize + cellSize / 2} y="30" textAnchor="middle"
          fontSize="11" fontFamily="monospace" fill="#1a1f2e" fontWeight="600">{s.label}</text>
      ))}
      {/* Row headers (metals) */}
      {METALS.map((m, i) => (
        <text key={m.id} x="100" y={70 + i * cellSize + cellSize / 2} textAnchor="end"
          fontSize="13" fontFamily="monospace" fill="#1a1f2e" fontWeight="600">{m.id}</text>
      ))}
      {/* Grid */}
      {METALS.map((m, i) =>
        SOLUTIONS.map((s, j) => {
          const key = cellKey(m.id, s.id);
          const tested = !!results[key];
          const reaction = reactsBetween(m.id, s.id);
          const x = 130 + j * cellSize;
          const y = 50 + i * cellSize;
          return (
            <g key={key} onClick={() => test(m.id, s.id)} style={{ cursor: tested ? "default" : "pointer" }}>
              <rect x={x} y={y} width={cellSize - 4} height={cellSize - 4}
                fill={tested ? (reaction ? "rgba(46,125,50,0.12)" : "rgba(26,31,46,0.05)") : "rgba(232,228,216,0.65)"}
                stroke="#1a1f2e" strokeWidth="1" />
              {/* mini test tube */}
              <rect x={x + 35} y={y + 12} width={cellSize - 78} height={cellSize - 38}
                fill="#fff" stroke="#1a1f2e" strokeWidth="0.8" opacity="0.85" />
              <rect x={x + 36} y={y + 30} width={cellSize - 80} height={cellSize - 60}
                fill={s.colour} />
              {/* metal strip */}
              <rect x={x + cellSize / 2 - 5} y={y + 25} width="10" height={cellSize - 50}
                fill={tested && reaction && s.id === "Cu2+" ? "#b96a2f" : tested && reaction && s.id === "Ag+" ? "#dedede" : m.colour} stroke="#1a1f2e" strokeWidth="0.5" />
              {tested && (
                <g>
                  {reaction ? (
                    <CheckCircle2 size={14} color="#2e7d32" x={x + cellSize - 24} y={y + 6} />
                  ) : null}
                  <text x={x + 4} y={y + cellSize - 8} fontSize="9" fontFamily="monospace" fill={reaction ? "#2e7d32" : "rgba(26,31,46,0.6)"}>
                    {reaction ? "reacts" : "no reaction"}
                  </text>
                </g>
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}
