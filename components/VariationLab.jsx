"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, Award, Users } from "lucide-react";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

// Box-Muller normal sampling
function gauss(mean, sd) {
  const u1 = Math.random(), u2 = Math.random();
  return mean + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function generateSample(n) {
  const people = [];
  for (let i = 0; i < n; i++) {
    const height = Math.round(gauss(165, 9));
    const roller = Math.random() < 0.75;
    people.push({ height, roller });
  }
  return people;
}

const QUIZ = [
  {
    q: "Height is an example of which TYPE of variation?",
    options: [
      "Discontinuous — only certain fixed values are possible",
      "Continuous — any value within a range is possible, producing a bell-shaped distribution",
      "Discrete and categorical",
      "Genetic only",
    ],
    correct: 1,
  },
  {
    q: "Tongue-rolling ability is an example of which TYPE of variation?",
    options: [
      "Continuous — can be measured on a sliding scale",
      "Discontinuous — only two distinct categories (can/cannot)",
      "Random environmental variation",
      "Quantitative continuous",
    ],
    correct: 1,
  },
  {
    q: "Which is the CORRECT type of graph for plotting CONTINUOUS variation in a population?",
    options: [
      "Bar chart with gaps between bars",
      "Pie chart",
      "Histogram — touching bars showing frequency across continuous ranges",
      "Scatter graph only",
    ],
    correct: 2,
  },
  {
    q: "Continuous variation in height usually has BOTH genetic and environmental causes. Which environmental factor is MOST relevant?",
    options: [
      "Country of birth alone",
      "Nutrition during childhood and adolescence",
      "Time spent indoors",
      "Day of the week tested",
    ],
    correct: 1,
  },
];

export default function VariationLab() {
  const [people, setPeople] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const sample = (size) => setPeople(generateSample(size));
  const reset = () => setPeople([]);

  const n = people.length;
  const rollers = people.filter((p) => p.roller).length;
  const nonRollers = n - rollers;

  // Height histogram bins (8 bins, 140–190 cm in 6.25cm bands → use 10cm: 140,150,160,170,180,190)
  const bins = [140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190];
  const histogram = bins.slice(0, -1).map((lo, i) => ({
    lo, hi: bins[i + 1],
    count: people.filter((p) => p.height >= lo && p.height < bins[i + 1]).length,
  }));
  const maxBin = Math.max(1, ...histogram.map((h) => h.count));

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
              Biology · Variation · Continuous vs discontinuous
            </div>
            <h1 className="text-3xl sm:text-4xl leading-[1.1] mb-3" style={{ fontWeight: 500 }}>
              <span style={{ fontStyle: "italic", color: "#c2185b" }}>Continuous</span> vs <span style={{ fontStyle: "italic", color: "#c2185b" }}>discontinuous</span> variation
            </h1>
            <p className="text-sm sm:text-base opacity-80 leading-snug mb-5">
              Generate a sample of students and measure two traits: height (any value possible — continuous) and tongue-rolling ability (you can or you can't — discontinuous). The two shapes of distribution tell you which kind of variation you're dealing with.
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {[20, 50, 200].map((sz) => (
                <button key={sz} onClick={() => sample(sz)}
                  className="py-2.5 px-4 text-[11px] uppercase active:scale-95 inline-flex items-center gap-2"
                  style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                  <Users size={12} /> Sample × {sz}
                </button>
              ))}
              <button onClick={reset}
                className="py-2.5 px-3 text-[10px] uppercase active:scale-95 inline-flex items-center gap-1.5"
                style={{ fontFamily: mono, letterSpacing: "0.22em", border: "1px solid rgba(26,31,46,0.3)" }}>
                <RotateCcw size={12} /> Reset
              </button>
              <div className="ml-auto text-sm" style={{ fontFamily: mono }}>n = {n}</div>
            </div>

            {n > 0 && (
              <>
                <div className="relative overflow-hidden mb-4 p-4"
                  style={{ backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)" }}>
                  <div className="text-[10px] uppercase text-stone-500 mb-3"
                    style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                    Histogram · Height (continuous)
                  </div>
                  <HistogramSVG histogram={histogram} maxBin={maxBin} />
                </div>

                <div className="relative overflow-hidden p-4"
                  style={{ backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)" }}>
                  <div className="text-[10px] uppercase text-stone-500 mb-3"
                    style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                    Bar chart · Tongue-rolling (discontinuous)
                  </div>
                  <BarChartSVG rollers={rollers} nonRollers={nonRollers} />
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="p-5 mb-4"
              style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
              <div className="text-[10px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                Key differences
              </div>
              <table className="w-full text-xs" style={{ fontFamily: mono }}>
                <thead>
                  <tr className="border-b border-stone-900/15">
                    <th className="text-left py-1.5 opacity-65"> </th>
                    <th className="text-left py-1.5 opacity-65">Continuous</th>
                    <th className="text-left py-1.5 opacity-65">Discontinuous</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-stone-900/8">
                    <td className="py-1.5 opacity-65">Values</td>
                    <td>any along a range</td>
                    <td>distinct categories</td>
                  </tr>
                  <tr className="border-b border-stone-900/8">
                    <td className="py-1.5 opacity-65">Plot</td>
                    <td>histogram</td>
                    <td>bar chart</td>
                  </tr>
                  <tr className="border-b border-stone-900/8">
                    <td className="py-1.5 opacity-65">Distribution</td>
                    <td>bell curve (normal)</td>
                    <td>discrete bars</td>
                  </tr>
                  <tr className="border-b border-stone-900/8">
                    <td className="py-1.5 opacity-65">Genes</td>
                    <td>many (polygenic)</td>
                    <td>one or few</td>
                  </tr>
                  <tr className="border-b border-stone-900/8">
                    <td className="py-1.5 opacity-65">Environment</td>
                    <td>major influence</td>
                    <td>little / none</td>
                  </tr>
                  <tr className="border-b border-stone-900/8">
                    <td className="py-1.5 opacity-65">Example</td>
                    <td>height, mass</td>
                    <td>blood group, tongue roll</td>
                  </tr>
                </tbody>
              </table>
            </div>

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

function HistogramSVG({ histogram, maxBin }) {
  const W = 500, H = 220;
  const padL = 36, padR = 12, padT = 12, padB = 40;
  const barW = (W - padL - padR) / histogram.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      {histogram.map((h, i) => {
        const barH = (h.count / maxBin) * (H - padT - padB);
        return (
          <g key={h.lo}>
            <rect x={padL + i * barW} y={H - padB - barH} width={barW - 1} height={barH}
              fill="#c2185b" opacity="0.7" />
            <text x={padL + i * barW + barW / 2} y={H - padB + 12} fontSize="9" fontFamily="monospace"
              textAnchor="middle" fill="#1a1f2e" opacity="0.65">
              {h.lo}
            </text>
            {h.count > 0 && (
              <text x={padL + i * barW + barW / 2} y={H - padB - barH - 4} fontSize="9" fontFamily="monospace"
                textAnchor="middle" fill="#1a1f2e">
                {h.count}
              </text>
            )}
          </g>
        );
      })}
      <text x={W / 2} y={H - 8} fontSize="10" fontFamily="monospace" textAnchor="middle" fill="#1a1f2e" opacity="0.65">height (cm)</text>
      <text x={padL - 4} y={padT + 6} fontSize="9" fontFamily="monospace" textAnchor="end" fill="#1a1f2e" opacity="0.65">freq</text>
    </svg>
  );
}

function BarChartSVG({ rollers, nonRollers }) {
  const W = 500, H = 180;
  const padL = 80, padR = 80, padT = 12, padB = 36;
  const totalH = H - padT - padB;
  const total = rollers + nonRollers;
  const rH = (rollers / total) * totalH;
  const nH = (nonRollers / total) * totalH;
  const barW = 80;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      {/* bar 1 */}
      <rect x={padL + 50} y={H - padB - rH} width={barW} height={rH} fill="#5fa83e" opacity="0.85" />
      <text x={padL + 50 + barW / 2} y={H - padB + 14} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#1a1f2e">
        Can roll
      </text>
      <text x={padL + 50 + barW / 2} y={H - padB - rH - 4} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#1a1f2e">
        {rollers}
      </text>
      {/* gap then bar 2 */}
      <rect x={padL + 50 + barW + 50} y={H - padB - nH} width={barW} height={nH} fill="#a3531c" opacity="0.85" />
      <text x={padL + 50 + barW + 50 + barW / 2} y={H - padB + 14} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#1a1f2e">
        Cannot roll
      </text>
      <text x={padL + 50 + barW + 50 + barW / 2} y={H - padB - nH - 4} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#1a1f2e">
        {nonRollers}
      </text>
      <text x={padL - 4} y={padT + 6} fontSize="9" fontFamily="monospace" textAnchor="end" fill="#1a1f2e" opacity="0.65">freq</text>
    </svg>
  );
}
