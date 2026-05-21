"use client";

import { useState, useRef } from "react";
import { Shell, Header, Stat, QuizPanel, mono, Card, StatGrid } from "./LabUI";

const FUNCTIONS = [
  { id: "x2",     name: "f(x) = x²",        fn: (x) => x * x,             d: (x) => 2 * x,                        sym: "2x" },
  { id: "x3",     name: "f(x) = x³ − 3x",   fn: (x) => x ** 3 - 3 * x,     d: (x) => 3 * x * x - 3,                sym: "3x² − 3" },
  { id: "sin",    name: "f(x) = sin x",     fn: (x) => Math.sin(x),       d: (x) => Math.cos(x),                  sym: "cos x" },
  { id: "exp",    name: "f(x) = eˣ",        fn: (x) => Math.exp(x),       d: (x) => Math.exp(x),                  sym: "eˣ" },
  { id: "lnx",    name: "f(x) = ln x",      fn: (x) => Math.log(x),       d: (x) => 1 / x,                        sym: "1 / x" },
];

const QUIZ = [
  { q: "The DERIVATIVE f'(x) at a point gives the:",
    options: ["Average value of f", "SLOPE of the tangent line to the curve at that point", "Area under f", "Value of f"], correct: 1 },
  { q: "If f(x) = x², then f'(x) = ?",
    options: ["x²", "2x", "x / 2", "2"], correct: 1 },
  { q: "Where on f(x) = x³ − 3x are the slopes ZERO?",
    options: ["At x = 0 only", "At x = ±1 (the stationary points: 3x² − 3 = 0)", "At x = ±√3", "Nowhere"], correct: 1 },
  { q: "A NEGATIVE derivative tells you that the function is:",
    options: ["Increasing", "Decreasing at that point", "Maximised", "Minimised"], correct: 1 },
];

export default function TangentGrapherLab() {
  const [fnId, setFnId] = useState("x3");
  const [xVal, setXVal] = useState(1.5);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const draggingRef = useRef(false);

  const fn = FUNCTIONS.find((f) => f.id === fnId);
  const slope = fn.d(xVal);
  const y = fn.fn(xVal);

  const W = 540, H = 360, padL = 36, padR = 12, padT = 12, padB = 28;
  const xMin = fn.id === "lnx" ? 0.1 : -3, xMax = 3;
  // y-range tuned per function
  const yRange = { x2: [-1, 9], x3: [-4, 4], sin: [-1.5, 1.5], exp: [-1, 12], lnx: [-2, 2] }[fn.id];
  const yMin = yRange[0], yMax = yRange[1];
  const xPx = (x) => padL + ((x - xMin) / (xMax - xMin)) * (W - padL - padR);
  const yPx = (y) => H - padB - ((y - yMin) / (yMax - yMin)) * (H - padT - padB);

  // Curve
  const curveD = [];
  for (let i = 0; i <= 240; i++) {
    const x = xMin + (i / 240) * (xMax - xMin);
    const yy = fn.fn(x);
    if (isFinite(yy)) curveD.push(`${i === 0 ? "M" : "L"} ${xPx(x)} ${yPx(yy)}`);
  }

  // Derivative curve (lighter)
  const derivD = [];
  for (let i = 0; i <= 240; i++) {
    const x = xMin + (i / 240) * (xMax - xMin);
    const yy = fn.d(x);
    if (isFinite(yy)) derivD.push(`${i === 0 ? "M" : "L"} ${xPx(x)} ${yPx(yy)}`);
  }

  // Tangent line: through (xVal, y), slope = slope
  const x1 = xMin, x2 = xMax;
  const ty1 = y + slope * (x1 - xVal);
  const ty2 = y + slope * (x2 - xVal);

  const onMove = (e) => {
    if (!draggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * W;
    const xRaw = xMin + ((x - padL) / (W - padL - padR)) * (xMax - xMin);
    setXVal(Math.max(xMin + 0.05, Math.min(xMax - 0.05, xRaw)));
  };
  const onDown = (e) => { e.preventDefault(); draggingRef.current = true; };
  const onUp = () => { draggingRef.current = false; };

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/maths" backLabel="Back to Maths" topic="Maths · Calculus · Derivatives">
      <Header
        title="Tangent line &"
        accent="derivative grapher"
        blurb="Drag the point along the curve. The tangent line follows; its slope IS the derivative f'(x) at that point. Plot the slope as a function of x to recover the derivative function f'(x)."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 mb-4">
            {FUNCTIONS.map((f) => (
              <button key={f.id} onClick={() => { setFnId(f.id); setXVal(f.id === "lnx" ? 1 : 1); }}
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

          <div className="relative overflow-hidden mb-3"
            style={{ backgroundColor: "#fdfbf3", border: "1px solid rgba(26,31,46,0.2)", cursor: draggingRef.current ? "grabbing" : "default" }}
            onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
            onTouchMove={(e) => { if (e.touches[0]) { e.clientX = e.touches[0].clientX; e.clientY = e.touches[0].clientY; onMove(e); } }}
            onTouchEnd={onUp}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
              {/* axes */}
              <line x1={padL} y1={yPx(0)} x2={W - padR} y2={yPx(0)} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
              <line x1={xPx(0)} y1={padT} x2={xPx(0)} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
              {/* derivative curve (light blue) */}
              <path d={derivD.join(" ")} fill="none" stroke="#1a8af0" strokeWidth="1.2" opacity="0.55" strokeDasharray="4,3" />
              {/* main curve */}
              <path d={curveD.join(" ")} fill="none" stroke="#1a1f2e" strokeWidth="2" />
              {/* tangent line */}
              <line x1={xPx(x1)} y1={yPx(ty1)} x2={xPx(x2)} y2={yPx(ty2)} stroke="#c2185b" strokeWidth="1.8" />
              {/* point */}
              <circle cx={xPx(xVal)} cy={yPx(y)} r="8" fill="#c2185b" stroke="#fdfbf3" strokeWidth="2"
                style={{ cursor: "grab" }} onMouseDown={onDown} onTouchStart={onDown} />
              {/* derivative point */}
              <circle cx={xPx(xVal)} cy={yPx(slope)} r="5" fill="#1a8af0" stroke="#fdfbf3" strokeWidth="1.5" />
              {/* labels */}
              <text x={W - padR} y={yPx(0) - 4} textAnchor="end" fontSize="10" fontFamily="monospace" opacity="0.55">x</text>
              <text x={W - padR - 4} y={padT + 12} textAnchor="end" fontSize="10" fontFamily="monospace" fill="#1a1f2e">f(x)</text>
              <text x={W - padR - 4} y={padT + 26} textAnchor="end" fontSize="10" fontFamily="monospace" fill="#1a8af0">f'(x)</text>
            </svg>
          </div>

          <div className="p-4" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>x</div>
            <input type="range" min={xMin + 0.05} max={xMax - 0.05} step="0.01" value={xVal} onChange={(e) => setXVal(parseFloat(e.target.value))} className="w-full" />
            <div className="text-sm" style={{ fontFamily: mono }}>x = {xVal.toFixed(3)}</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <StatGrid cols={1}>
            <Stat label="f(x)" value={y.toFixed(4)} />
            <Stat label="f'(x) — slope" value={slope.toFixed(4)} highlight />
            <Stat label="f'(x) = " value={fn.sym} />
          </StatGrid>
          <div className="mt-4">
            <Card label="Reading the picture">
              <div className="text-xs leading-snug opacity-80">
                Black curve is f(x). The pink line is the tangent at the point — its slope is f'(x), shown as the blue point on the dashed blue derivative curve. Drag the point; watch how the slope changes sign at maxima/minima.
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
