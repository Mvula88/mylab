"use client";

import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";

const FUNCTIONS = [
  { id: "x3-x-2", name: "f(x) = x³ − x − 2",  fn: (x) => x ** 3 - x - 2,    d: (x) => 3 * x * x - 1,         realRoot: 1.5214 },
  { id: "cos-x",  name: "f(x) = cos x − x",   fn: (x) => Math.cos(x) - x,   d: (x) => -Math.sin(x) - 1,      realRoot: 0.7391 },
  { id: "x2-2",   name: "f(x) = x² − 2",      fn: (x) => x * x - 2,         d: (x) => 2 * x,                 realRoot: Math.sqrt(2) },
  { id: "ex-2",   name: "f(x) = eˣ − 2",      fn: (x) => Math.exp(x) - 2,   d: (x) => Math.exp(x),           realRoot: Math.log(2) },
];

const QUIZ = [
  { q: "Newton's iteration formula is:",
    options: ["x_{n+1} = x_n + f(x_n)", "x_{n+1} = x_n − f(x_n) / f'(x_n)", "x_{n+1} = f'(x_n) / f(x_n)", "x_{n+1} = (x_n + b) / 2"], correct: 1 },
  { q: "Geometrically, each step is the:",
    options: ["Midpoint between two guesses", "Intersection of the tangent line at (x_n, f(x_n)) with the x-axis", "Average of f(x_n) and 0", "Halving of the interval"], correct: 1 },
  { q: "Newton's method can FAIL if:",
    options: ["The function is too smooth", "f'(x_n) = 0 (horizontal tangent) — next step is undefined", "Iterations are too small", "The function crosses the y-axis"], correct: 1 },
  { q: "Near a simple root, the convergence is QUADRATIC. What does this mean roughly?",
    options: ["Steps double", "The number of correct digits ROUGHLY DOUBLES per iteration", "It converges in two steps always", "The error halves"], correct: 1 },
];

export default function NewtonMethodLab() {
  const [fnId, setFnId] = useState("x3-x-2");
  const [x0, setX0] = useState(2.5);
  const [iters, setIters] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const fn = FUNCTIONS.find((f) => f.id === fnId);

  const step = () => {
    if (iters.length >= 20) return;
    const xPrev = iters.length === 0 ? x0 : iters[iters.length - 1].xNew;
    const y = fn.fn(xPrev);
    const slope = fn.d(xPrev);
    const xNew = xPrev - y / slope;
    setIters((prev) => [...prev, { xPrev, y, slope, xNew }]);
  };

  const runAll = () => {
    let cur = iters.length === 0 ? x0 : iters[iters.length - 1].xNew;
    const more = [];
    for (let i = 0; i < 15; i++) {
      const y = fn.fn(cur);
      const slope = fn.d(cur);
      if (Math.abs(slope) < 1e-12) break;
      const xNew = cur - y / slope;
      more.push({ xPrev: cur, y, slope, xNew });
      if (Math.abs(y) < 1e-10) break;
      cur = xNew;
    }
    setIters((prev) => [...prev, ...more]);
  };

  const reset = () => setIters([]);

  // Plot
  const W = 540, H = 320, padL = 36, padR = 12, padT = 12, padB = 28;
  const xMin = fn.id === "cos-x" ? -1 : -3;
  const xMax = fn.id === "cos-x" ? 2 : 3;
  const allXs = [x0, ...iters.flatMap((it) => [it.xPrev, it.xNew])];
  // y-range
  let ys = [];
  for (let i = 0; i <= 200; i++) ys.push(fn.fn(xMin + (i / 200) * (xMax - xMin)));
  const yMin = Math.min(-1, ...ys), yMax = Math.max(1, ...ys);
  const xPx = (x) => padL + ((x - xMin) / (xMax - xMin)) * (W - padL - padR);
  const yPx = (y) => H - padB - ((y - yMin) / (yMax - yMin)) * (H - padT - padB);
  const curveD = [];
  for (let i = 0; i <= 240; i++) {
    const x = xMin + (i / 240) * (xMax - xMin);
    const y = fn.fn(x);
    curveD.push(`${i === 0 ? "M" : "L"} ${xPx(x)} ${yPx(y)}`);
  }

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);
  const lastX = iters.length === 0 ? x0 : iters[iters.length - 1].xNew;
  const err = Math.abs(lastX - fn.realRoot);

  return (
    <Shell back="/maths" backLabel="Back to Maths" topic="Maths · Calculus · Newton's method">
      <Header
        title="Newton's"
        accent="root-finder"
        blurb="Pick a starting guess. Draw the tangent at that point. Where the tangent crosses the x-axis is your next guess. Repeat. The method converges (usually quickly) to a root of the function — but it can also misbehave."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
            {FUNCTIONS.map((f) => (
              <button key={f.id} onClick={() => { setFnId(f.id); setIters([]); }}
                className="p-2 transition active:scale-95 text-left"
                style={{
                  backgroundColor: f.id === fnId ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                  border: `1px solid ${f.id === fnId ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                  color: f.id === fnId ? "#e8e4d8" : "#1a1f2e",
                }}>
                <div className="text-[11px]" style={{ fontFamily: mono }}>{f.name}</div>
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden mb-3" style={{ backgroundColor: "#fdfbf3", border: "1px solid rgba(26,31,46,0.2)" }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
              <line x1={padL} y1={yPx(0)} x2={W - padR} y2={yPx(0)} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
              <line x1={xPx(0)} y1={padT} x2={xPx(0)} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
              <path d={curveD.join(" ")} fill="none" stroke="#1a1f2e" strokeWidth="2" />
              {/* iteration lines */}
              {iters.map((it, i) => (
                <g key={i}>
                  {/* vertical from x-axis to f(xPrev) */}
                  <line x1={xPx(it.xPrev)} y1={yPx(0)} x2={xPx(it.xPrev)} y2={yPx(it.y)} stroke="#c2185b" strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
                  {/* tangent line from (xPrev, y) to (xNew, 0) */}
                  <line x1={xPx(it.xPrev)} y1={yPx(it.y)} x2={xPx(it.xNew)} y2={yPx(0)} stroke="#c2185b" strokeWidth="1.5" />
                  {/* points */}
                  <circle cx={xPx(it.xPrev)} cy={yPx(it.y)} r="3" fill="#c2185b" />
                  <circle cx={xPx(it.xNew)} cy={yPx(0)} r="3" fill="#1a8af0" />
                </g>
              ))}
              {/* initial point */}
              {iters.length === 0 && (
                <circle cx={xPx(x0)} cy={yPx(0)} r="5" fill="#1a8af0" />
              )}
              {/* true root marker */}
              <circle cx={xPx(fn.realRoot)} cy={yPx(0)} r="4" fill="none" stroke="#2e7d32" strokeWidth="2" />
              <text x={xPx(fn.realRoot)} y={yPx(0) - 8} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#2e7d32">root</text>
            </svg>
          </div>

          <div className="p-4 mb-3" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>x₀ initial guess</div>
            <input type="range" min={-3} max={3} step="0.05" value={x0} onChange={(e) => { setX0(parseFloat(e.target.value)); setIters([]); }} className="w-full" />
            <div className="text-sm" style={{ fontFamily: mono }}>x₀ = {x0.toFixed(2)}</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PrimaryButton onClick={step} icon={Play} disabled={iters.length >= 20}>Single step</PrimaryButton>
            <SecondaryButton onClick={runAll}>Run to convergence</SecondaryButton>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Iterations">
            <table className="w-full text-xs" style={{ fontFamily: mono }}>
              <thead>
                <tr className="border-b border-stone-900/15">
                  <th className="text-left py-1.5 opacity-65">n</th>
                  <th className="text-right py-1.5 opacity-65">xₙ</th>
                  <th className="text-right py-1.5 opacity-65">f(xₙ)</th>
                  <th className="text-right py-1.5 opacity-65">|xₙ − root|</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-900/8">
                  <td className="py-1.5">0</td>
                  <td className="text-right py-1.5">{x0.toFixed(6)}</td>
                  <td className="text-right py-1.5">{fn.fn(x0).toFixed(4)}</td>
                  <td className="text-right py-1.5">{Math.abs(x0 - fn.realRoot).toFixed(6)}</td>
                </tr>
                {iters.map((it, i) => (
                  <tr key={i} className="border-b border-stone-900/8">
                    <td className="py-1.5">{i + 1}</td>
                    <td className="text-right py-1.5">{it.xNew.toFixed(6)}</td>
                    <td className="text-right py-1.5">{fn.fn(it.xNew).toFixed(4)}</td>
                    <td className="text-right py-1.5">{Math.abs(it.xNew - fn.realRoot).toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs opacity-75 mt-2">Reference root: <span style={{ color: "#2e7d32", fontFamily: mono, fontWeight: 600 }}>{fn.realRoot.toFixed(6)}</span></div>
          </Card>
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
