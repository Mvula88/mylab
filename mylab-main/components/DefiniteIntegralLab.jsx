"use client";

import { useState } from "react";
import { Shell, Header, Stat, QuizPanel, mono, Card, StatGrid } from "./LabUI";

const FUNCTIONS = [
  { id: "x2",    name: "f(x) = x²",          fn: (x) => x * x,             trueInt: (a, b) => (b ** 3 - a ** 3) / 3 },
  { id: "sin",   name: "f(x) = sin x",       fn: (x) => Math.sin(x),       trueInt: (a, b) => -Math.cos(b) + Math.cos(a) },
  { id: "exp",   name: "f(x) = eˣ",          fn: (x) => Math.exp(x),       trueInt: (a, b) => Math.exp(b) - Math.exp(a) },
  { id: "xsinx", name: "f(x) = x sin x",      fn: (x) => x * Math.sin(x),   trueInt: (a, b) => -b * Math.cos(b) + Math.sin(b) + a * Math.cos(a) - Math.sin(a) },
];

const METHODS = [
  { id: "left",  name: "Left rectangles" },
  { id: "right", name: "Right rectangles" },
  { id: "mid",   name: "Midpoint" },
  { id: "trap",  name: "Trapezium" },
];

const QUIZ = [
  { q: "A definite integral ∫ₐᵇ f(x) dx represents:",
    options: ["The slope at x=a", "The (signed) AREA between the curve y=f(x) and the x-axis, from x=a to x=b", "The maximum of f", "The midpoint of [a, b]"], correct: 1 },
  { q: "As the number of rectangles n increases, the Riemann sum approaches:",
    options: ["Zero", "The exact value of the integral", "f(b) − f(a)", "f(a)+f(b)"], correct: 1 },
  { q: "For a positive concave-up function, LEFT rectangles always:",
    options: ["Over-estimate the area", "Under-estimate the area", "Give the exact value", "Cancel out"], correct: 1 },
  { q: "The TRAPEZIUM rule is more accurate than left/right rectangles for smooth f. Why?",
    options: ["It uses both endpoints — equivalent to averaging the left and right estimates", "It uses parabolic arcs", "It samples random points", "It cancels rounding errors"], correct: 0 },
];

export default function DefiniteIntegralLab() {
  const [fnId, setFnId] = useState("x2");
  const [a, setA] = useState(0);
  const [b, setB] = useState(2);
  const [n, setN] = useState(8);
  const [method, setMethod] = useState("mid");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const fn = FUNCTIONS.find((f) => f.id === fnId);
  const dx = (b - a) / n;

  // Compute Riemann sum
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const xL = a + i * dx, xR = a + (i + 1) * dx;
    if (method === "left") sum += fn.fn(xL) * dx;
    else if (method === "right") sum += fn.fn(xR) * dx;
    else if (method === "mid") sum += fn.fn((xL + xR) / 2) * dx;
    else if (method === "trap") sum += ((fn.fn(xL) + fn.fn(xR)) / 2) * dx;
  }
  const trueVal = fn.trueInt(a, b);
  const error = Math.abs(sum - trueVal);

  // Plot
  const W = 540, H = 280, padL = 36, padR = 12, padT = 12, padB = 28;
  // Find y-range of the function over [a, b] for scaling
  let yMin = Infinity, yMax = -Infinity;
  for (let s = 0; s <= 200; s++) {
    const x = a + (s / 200) * (b - a);
    const y = fn.fn(x);
    yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
  }
  yMin = Math.min(0, yMin); yMax = Math.max(0, yMax);
  const xRange = b - a;
  const yRange = (yMax - yMin) || 1;
  const xPx = (x) => padL + ((x - a) / xRange) * (W - padL - padR);
  const yPx = (y) => H - padB - ((y - yMin) / yRange) * (H - padT - padB);
  const zeroY = yPx(0);

  // Curve path
  const curveD = [];
  for (let s = 0; s <= 200; s++) {
    const x = a + (s / 200) * xRange;
    const y = fn.fn(x);
    curveD.push(`${s === 0 ? "M" : "L"} ${xPx(x)} ${yPx(y)}`);
  }

  // Rectangles
  const rects = [];
  for (let i = 0; i < n; i++) {
    const xL = a + i * dx, xR = a + (i + 1) * dx;
    let height;
    if (method === "left") height = fn.fn(xL);
    else if (method === "right") height = fn.fn(xR);
    else if (method === "mid") height = fn.fn((xL + xR) / 2);
    else { // trap — draw a trapezium polygon instead
      const yL = fn.fn(xL), yR = fn.fn(xR);
      rects.push({ trap: true, x1: xPx(xL), x2: xPx(xR), y1: yPx(yL), y2: yPx(yR), zero: zeroY });
      continue;
    }
    rects.push({ x: xPx(xL), w: xPx(xR) - xPx(xL), y: yPx(Math.max(0, height)), h: Math.abs(yPx(height) - zeroY) });
  }

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/maths" backLabel="Back to Maths" topic="Maths · Calculus · Riemann sums">
      <Header
        title="Definite integral as"
        accent="area under a curve"
        blurb="A definite integral is the area between a function and the x-axis between two limits. Approximate it with rectangles of equal width, then crank n up: the sum converges to the exact area, no matter the function."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
            {FUNCTIONS.map((f) => (
              <button key={f.id} onClick={() => setFnId(f.id)}
                className="p-2 transition active:scale-95 text-left"
                style={{
                  backgroundColor: f.id === fnId ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                  border: `1px solid ${f.id === fnId ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                  color: f.id === fnId ? "#e8e4d8" : "#1a1f2e",
                }}>
                <div className="text-[12px]" style={{ fontFamily: mono }}>{f.name}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {METHODS.map((m) => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className="p-2 transition active:scale-95 text-left"
                style={{
                  backgroundColor: m.id === method ? "#c2185b" : "rgba(26,31,46,0.05)",
                  border: `1px solid ${m.id === method ? "#c2185b" : "rgba(26,31,46,0.15)"}`,
                  color: m.id === method ? "#fdfbf3" : "#1a1f2e",
                }}>
                <div className="text-[11px]">{m.name}</div>
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden mb-3" style={{ backgroundColor: "#fdfbf3", border: "1px solid rgba(26,31,46,0.2)" }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
              {/* axes */}
              <line x1={padL} y1={zeroY} x2={W - padR} y2={zeroY} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
              <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
              {/* rectangles */}
              {rects.map((r, i) =>
                r.trap ? (
                  <polygon key={i} points={`${r.x1},${r.zero} ${r.x1},${r.y1} ${r.x2},${r.y2} ${r.x2},${r.zero}`}
                    fill="#c2185b" opacity="0.25" stroke="#c2185b" strokeWidth="0.8" />
                ) : (
                  <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h}
                    fill="#c2185b" opacity="0.25" stroke="#c2185b" strokeWidth="0.8" />
                )
              )}
              {/* curve */}
              <path d={curveD.join(" ")} fill="none" stroke="#1a1f2e" strokeWidth="1.8" />
              {/* labels */}
              <text x={xPx(a)} y={H - 4} fontSize="10" fontFamily="monospace" fill="#1a1f2e">{a}</text>
              <text x={xPx(b)} y={H - 4} fontSize="10" fontFamily="monospace" textAnchor="end" fill="#1a1f2e">{b}</text>
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div>
              <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>a</div>
              <input type="range" min="-3" max="3" step="0.1" value={a} onChange={(e) => setA(parseFloat(e.target.value))} className="w-full" />
              <div className="text-sm" style={{ fontFamily: mono }}>a = {a.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>b</div>
              <input type="range" min="-3" max="3" step="0.1" value={b} onChange={(e) => setB(parseFloat(e.target.value))} className="w-full" />
              <div className="text-sm" style={{ fontFamily: mono }}>b = {b.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>n rectangles</div>
              <input type="range" min="1" max="200" step="1" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="w-full" />
              <div className="text-sm" style={{ fontFamily: mono }}>n = {n}</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <StatGrid cols={1}>
            <Stat label="Riemann estimate" value={sum.toFixed(4)} />
            <Stat label="Exact (analytical)" value={trueVal.toFixed(4)} highlight />
            <Stat label="Error" value={error.toFixed(5)} />
          </StatGrid>
          <div className="mt-4">
            <Card label="Insight">
              <div className="text-xs leading-snug opacity-80">
                For smooth, well-behaved functions: midpoint and trapezium converge much faster (error ≈ O(1/n²)) than plain left/right rectangles (O(1/n)). Simpson's rule does even better (O(1/n⁴)) — try it at very small n.
              </div>
            </Card>
          </div>
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
