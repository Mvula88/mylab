"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, Award, Play, FastForward } from "lucide-react";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

// Cubes of phenolphthalein-NaOH agar (purple) placed in 1.0 M HCl.
// As acid diffuses in, agar fades purple → colourless from outside inward.
// Time-to-decolourise ∝ size² (diffusion is L²/D)
const CUBES = [
  { size: 1, color: "#a64ce0", time: 60 },
  { size: 2, color: "#a64ce0", time: 240 },
  { size: 3, color: "#a64ce0", time: 540 },
];

const SIM_MAX = 600; // seconds
const REAL_DURATION = 12; // seconds for whole animation

const QUIZ = [
  {
    q: "Which cube decolourised first?",
    options: ["1 cm cube", "2 cm cube", "3 cm cube", "All at the same time"],
    correct: 0,
  },
  {
    q: "Calculate the surface-area-to-volume ratio of the 1 cm cube and the 3 cm cube.",
    options: [
      "Both equal 6 : 1",
      "1 cm cube has SA:V = 6 : 1; 3 cm cube has SA:V = 2 : 1",
      "1 cm has 1:1; 3 cm has 3:1",
      "Cannot be calculated",
    ],
    correct: 1,
  },
  {
    q: "Why does the SMALLEST cube decolourise FASTEST?",
    options: [
      "It contains less phenolphthalein",
      "Its large surface-area-to-volume ratio means a higher rate of diffusion of acid relative to its volume — the diffusing acid only has a short distance to reach the centre",
      "It floats higher in the acid",
      "It is less concentrated than the others",
    ],
    correct: 1,
  },
  {
    q: "This experiment models which biological limit?",
    options: [
      "Why eyes are spherical",
      "Why cells are SMALL — past a certain size, diffusion alone cannot supply the cell centre quickly enough; large organisms therefore need transport systems",
      "Why food contains energy",
      "Why osmosis requires water",
    ],
    correct: 1,
  },
];

export default function DiffusionAgarLab() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const rafRef = useRef(null);
  const t0Ref = useRef(0);
  const startedRef = useRef(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!running) return;
    t0Ref.current = performance.now();
    startedRef.current = time;
    const tick = (now) => {
      const dt = now - t0Ref.current;
      const newT = Math.min(SIM_MAX, startedRef.current + (dt / (REAL_DURATION * 1000)) * SIM_MAX);
      setTime(newT);
      if (newT < SIM_MAX && running) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setRunning(false);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [running]);

  const start = () => setRunning(true);
  const reset = () => { setRunning(false); setTime(0); };
  const skip = () => { setRunning(false); setTime(SIM_MAX); };
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
              Biology · Diffusion · Surface-area-to-volume
            </div>
            <h1 className="text-3xl sm:text-4xl leading-[1.1] mb-3" style={{ fontWeight: 500 }}>
              Diffusion into <span style={{ fontStyle: "italic", color: "#c2185b" }}>agar cubes</span>
            </h1>
            <p className="text-sm sm:text-base opacity-80 leading-snug mb-5">
              Three agar cubes of side 1 cm, 2 cm and 3 cm have been made purple with phenolphthalein indicator and dilute sodium hydroxide. They are placed in dilute hydrochloric acid. As acid diffuses in from every face, the indicator fades to colourless. Time how long each cube takes to decolourise completely.
            </p>

            <div className="relative overflow-hidden mb-4"
              style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)" }}>
              <AgarCubes time={time} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!running && time < SIM_MAX ? (
                <button onClick={start}
                  className="py-2.5 px-4 text-[11px] uppercase active:scale-95 inline-flex items-center gap-2"
                  style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                  <Play size={12} /> {time === 0 ? "Add HCl & start clock" : "Resume"}
                </button>
              ) : running ? (
                <button onClick={() => setRunning(false)}
                  className="py-2.5 px-4 text-[11px] uppercase active:scale-95"
                  style={{ fontFamily: mono, letterSpacing: "0.22em", border: "1px solid rgba(26,31,46,0.3)" }}>
                  Pause
                </button>
              ) : null}
              <button onClick={skip}
                className="py-2.5 px-3 text-[10px] uppercase active:scale-95 inline-flex items-center gap-1.5"
                style={{ fontFamily: mono, letterSpacing: "0.22em", border: "1px solid rgba(26,31,46,0.3)" }}>
                <FastForward size={12} /> Skip to end
              </button>
              <button onClick={reset}
                className="py-2.5 px-3 text-[10px] uppercase active:scale-95 inline-flex items-center gap-1.5"
                style={{ fontFamily: mono, letterSpacing: "0.22em", border: "1px solid rgba(26,31,46,0.3)" }}>
                <RotateCcw size={12} /> Reset
              </button>
              <div className="ml-auto text-sm" style={{ fontFamily: mono }}>
                t = {Math.floor(time)} s
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-5"
              style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
              <div className="text-[10px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                Surface area / volume table
              </div>
              <table className="w-full text-xs" style={{ fontFamily: mono }}>
                <thead>
                  <tr className="border-b border-stone-900/15">
                    <th className="text-left py-1.5 opacity-65">Side</th>
                    <th className="text-right py-1.5 opacity-65">SA</th>
                    <th className="text-right py-1.5 opacity-65">V</th>
                    <th className="text-right py-1.5 opacity-65">SA:V</th>
                    <th className="text-right py-1.5 opacity-65">t (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {CUBES.map((c) => {
                    const SA = 6 * c.size * c.size;
                    const V = c.size ** 3;
                    const ratio = (SA / V).toFixed(1);
                    const done = c.time <= time;
                    return (
                      <tr key={c.size} className="border-b border-stone-900/8">
                        <td className="py-1.5">{c.size} cm</td>
                        <td className="text-right py-1.5">{SA} cm²</td>
                        <td className="text-right py-1.5">{V} cm³</td>
                        <td className="text-right py-1.5">{ratio} : 1</td>
                        <td className="text-right py-1.5" style={{ color: done ? "#2e7d32" : undefined }}>
                          {done ? c.time : (time > 0 ? "…" : "—")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-5 mt-4"
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

function AgarCubes({ time }) {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full">
      <rect x="0" y="380" width="800" height="70" fill="#e6dec8" />
      <rect x="0" y="375" width="800" height="5" fill="#1a1f2e" opacity="0.15" />

      {/* big beaker behind */}
      <path d="M 80 160 L 80 370 L 720 370 L 720 160"
        fill="rgba(167,212,236,0.3)" stroke="#1a1f2e" strokeWidth="1.5" opacity="0.85" />
      <line x1="80" y1="160" x2="720" y2="160" stroke="#1a1f2e" strokeWidth="1" opacity="0.7" />
      <rect x="80" y="180" width="640" height="190" fill="rgba(255,255,255,0.15)" />

      {/* HCl label */}
      <text x="400" y="150" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#1a1f2e" letterSpacing="2">
        DILUTE HCl
      </text>

      {/* Cubes */}
      {CUBES.map((c, i) => {
        const cx = 200 + i * 200;
        const cy = 280;
        const pixelSize = 30 + c.size * 25; // scale up for visibility
        // Fraction decolourised at this time
        const frac = Math.min(1, time / c.time);
        // Decolourise from outside: ring of purple shrinks
        return (
          <g key={c.size}>
            {/* shadow */}
            <ellipse cx={cx} cy={cy + pixelSize/2 + 8} rx={pixelSize/2} ry="4" fill="#1a1f2e" opacity="0.15" />
            {/* outer (decolourised) */}
            <rect
              x={cx - pixelSize/2}
              y={cy - pixelSize/2}
              width={pixelSize}
              height={pixelSize}
              fill="#f4e8f4"
              stroke="#1a1f2e"
              strokeWidth="1"
              opacity="0.95"
            />
            {/* inner (still purple) */}
            <rect
              x={cx - pixelSize/2 + pixelSize * frac * 0.5}
              y={cy - pixelSize/2 + pixelSize * frac * 0.5}
              width={pixelSize * (1 - frac)}
              height={pixelSize * (1 - frac)}
              fill={c.color}
              opacity="0.9"
              style={{ transition: "all 0.05s linear" }}
            />
            <text x={cx} y={cy + pixelSize/2 + 28} textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#1a1f2e" letterSpacing="1">
              {c.size} cm
            </text>
            <text x={cx} y={cy + pixelSize/2 + 44} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#1a1f2e" opacity="0.6">
              SA:V = {(6 / c.size).toFixed(1)} : 1
            </text>
            {frac >= 1 && (
              <text x={cx} y={cy - pixelSize/2 - 8} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#2e7d32">
                ✓ {c.time} s
              </text>
            )}
          </g>
        );
      })}

      <text x="40" y="40" fontSize="11" fontFamily="monospace" fill="#1a1f2e" letterSpacing="2">
        PHENOLPHTHALEIN-NaOH AGAR + DILUTE HCl
      </text>
    </svg>
  );
}
