"use client";

import { useState, useRef } from "react";
import { Shell, Header, Stat, QuizPanel, mono, Card, StatGrid } from "./LabUI";

const W = 520, H = 420;
const R = 150;
const CX = W / 2, CY = H / 2;

const QUIZ = [
  { q: "On the UNIT circle (r = 1), the coordinates of the point at angle θ from +x are:",
    options: ["(cos θ, sin θ)", "(sin θ, cos θ)", "(θ, 1−θ)", "(tan θ, cot θ)"], correct: 0 },
  { q: "At θ = π/2 (90°), the values of (cos θ, sin θ) are:",
    options: ["(1, 0)", "(0, 1)", "(0.5, 0.866)", "(0.707, 0.707)"], correct: 1 },
  { q: "Identity: cos² θ + sin² θ = ?",
    options: ["0", "1  — Pythagoras applied to the unit circle", "2", "tan² θ"], correct: 1 },
  { q: "Why does tan θ blow up at θ = π/2?",
    options: ["Tan is undefined", "tan θ = sin θ / cos θ; at 90°, cos θ = 0, so tan is undefined (→ ∞)", "The unit circle ends at 90°", "Trig functions stop working"], correct: 1 },
];

export default function UnitCircleLab() {
  const [theta, setTheta] = useState(Math.PI / 6); // 30°
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const draggingRef = useRef(false);

  const cosT = Math.cos(theta), sinT = Math.sin(theta);
  const tanT = Math.tan(theta);
  const px = CX + R * cosT;
  const py = CY - R * sinT;

  const onDown = (e) => { e.preventDefault(); draggingRef.current = true; };
  const onMove = (e) => {
    if (!draggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * W - CX;
    const y = -((e.clientY - rect.top) / rect.height * H - CY);
    let t = Math.atan2(y, x);
    if (t < 0) t += 2 * Math.PI;
    setTheta(t);
  };
  const onUp = () => { draggingRef.current = false; };

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/maths" backLabel="Back to Maths" topic="Maths · Geometry · Trigonometry">
      <Header
        title="Trigonometry of the"
        accent="unit circle"
        blurb="Drag the point around the unit circle. The horizontal coordinate is cos θ; the vertical coordinate is sin θ. The tangent line at the point intersects the x-axis at tan θ — a single picture for all three primary trig functions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden mb-4"
            style={{ aspectRatio: "13/10", backgroundColor: "#fdfbf3", border: "1px solid rgba(26,31,46,0.2)", cursor: draggingRef.current ? "grabbing" : "default" }}
            onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
            onTouchMove={(e) => { if (e.touches[0]) { e.clientX = e.touches[0].clientX; e.clientY = e.touches[0].clientY; onMove(e); } }}
            onTouchEnd={onUp}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full block">
              {/* axes */}
              <line x1="0" y1={CY} x2={W} y2={CY} stroke="#1a1f2e" strokeWidth="0.8" opacity="0.4" />
              <line x1={CX} y1="0" x2={CX} y2={H} stroke="#1a1f2e" strokeWidth="0.8" opacity="0.4" />
              {/* tick marks for 0.5, 1 */}
              {[-1, -0.5, 0.5, 1].map((t) => (
                <g key={t}>
                  <line x1={CX + t * R} y1={CY - 4} x2={CX + t * R} y2={CY + 4} stroke="#1a1f2e" />
                  <text x={CX + t * R} y={CY + 16} fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.55">{t}</text>
                  <line x1={CX - 4} y1={CY - t * R} x2={CX + 4} y2={CY - t * R} stroke="#1a1f2e" />
                </g>
              ))}
              {/* unit circle */}
              <circle cx={CX} cy={CY} r={R} fill="none" stroke="#1a1f2e" strokeWidth="1.5" />
              {/* radius line */}
              <line x1={CX} y1={CY} x2={px} y2={py} stroke="#1a1f2e" strokeWidth="1.5" />
              {/* sine (vertical drop) */}
              <line x1={px} y1={CY} x2={px} y2={py} stroke="#c2185b" strokeWidth="3" />
              {/* cosine (horizontal projection) */}
              <line x1={CX} y1={CY} x2={px} y2={CY} stroke="#1a8af0" strokeWidth="3" />
              {/* tangent line on the circle, extended to x-axis */}
              {Math.abs(Math.cos(theta)) > 1e-4 && (
                <line x1={px} y1={py} x2={CX + R / Math.cos(theta)} y2={CY}
                  stroke="#2e7d32" strokeWidth="1.5" strokeDasharray="4,3" />
              )}
              {/* tangent vertical at x = 1 (alternative interpretation) */}
              <line x1={CX + R} y1={CY} x2={CX + R} y2={CY - R * Math.tan(theta)} stroke="#2e7d32" strokeWidth="2.5" />
              {/* point */}
              <circle cx={px} cy={py} r="8" fill="#c2185b" stroke="#fdfbf3" strokeWidth="2"
                style={{ cursor: "grab" }}
                onMouseDown={onDown}
                onTouchStart={onDown} />
              {/* angle arc */}
              <path d={describeArc(CX, CY, 35, 0, theta)} stroke="#c2185b" strokeWidth="1.5" fill="none" />
              <text x={CX + 45 * Math.cos(theta / 2)} y={CY - 45 * Math.sin(theta / 2) + 4}
                fontSize="13" fontFamily="serif" fontStyle="italic" fill="#c2185b">θ</text>
              {/* axis labels */}
              <text x={W - 12} y={CY - 6} textAnchor="end" fontSize="10" fontFamily="monospace" opacity="0.6">cos →</text>
              <text x={CX + 4} y="14" fontSize="10" fontFamily="monospace" opacity="0.6">↑ sin</text>
              <text x={CX + R + 4} y={CY - R * Math.tan(theta) / 2} fontSize="10" fontFamily="monospace" fill="#2e7d32">tan</text>
            </svg>
          </div>

          <div className="p-4 mb-3" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>angle θ (0 → 2π)</div>
            <input type="range" min="0" max={2 * Math.PI} step="0.01" value={theta} onChange={(e) => setTheta(parseFloat(e.target.value))} className="w-full" />
            <div className="text-sm" style={{ fontFamily: mono }}>θ = {theta.toFixed(3)} rad ≈ {(theta * 180 / Math.PI).toFixed(1)}°</div>
          </div>

          <StatGrid cols={3}>
            <Stat label="cos θ" value={cosT.toFixed(4)} />
            <Stat label="sin θ" value={sinT.toFixed(4)} />
            <Stat label="tan θ" value={Math.abs(tanT) > 1000 ? "→ ±∞" : tanT.toFixed(4)} />
          </StatGrid>
        </div>

        <div className="lg:col-span-5">
          <Card label="Key identities">
            <div className="text-xs space-y-1" style={{ fontFamily: mono }}>
              <div>cos² θ + sin² θ = 1</div>
              <div>tan θ = sin θ / cos θ</div>
              <div>sin(θ + 2π) = sin θ   (period 2π)</div>
              <div>cos(-θ) = cos θ       (even)</div>
              <div>sin(-θ) = -sin θ      (odd)</div>
            </div>
          </Card>
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function describeArc(cx, cy, r, t1, t2) {
  const x1 = cx + r * Math.cos(t1), y1 = cy - r * Math.sin(t1);
  const x2 = cx + r * Math.cos(t2), y2 = cy - r * Math.sin(t2);
  const large = (t2 - t1) > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 0 ${x2} ${y2}`;
}
