"use client";

import { useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { Shell, Header, Stat, QuizPanel, mono, SecondaryButton, Card, StatGrid } from "./LabUI";

const PHI = (1 + Math.sqrt(5)) / 2; // golden ratio

function fibSeq(n) {
  const f = [0, 1];
  while (f.length < n) f.push(f[f.length - 1] + f[f.length - 2]);
  return f;
}

const QUIZ = [
  { q: "Definition of the Fibonacci sequence:",
    options: ["F(n) = n × F(n-1)", "F(n) = F(n-1) + F(n-2), with F(0)=0, F(1)=1", "F(n) = 2 × F(n-1)", "F(n) = n²"], correct: 1 },
  { q: "The ratio F(n+1)/F(n) approaches:",
    options: ["1", "2", "φ = (1 + √5)/2 ≈ 1.618 — the GOLDEN RATIO", "π"], correct: 2 },
  { q: "Binet's closed-form formula expresses F(n) using which numbers?",
    options: ["Integers only", "φ and 1/φ (and √5)", "π and e", "Powers of 10"], correct: 1 },
  { q: "Where in nature does the golden ratio show up?",
    options: ["Spiral arrangements of seeds in a sunflower head, pine cones, leaf phyllotaxis", "Boiling points of liquids", "Speed of light", "Atomic mass"], correct: 0 },
];

export default function FibonacciLab() {
  const [n, setN] = useState(12);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const seq = fibSeq(n + 1);
  const ratios = [];
  for (let i = 2; i < seq.length; i++) ratios.push(seq[i] / seq[i - 1]);

  // Golden spiral squares (each side = F_k)
  // Place squares spiralling outward
  // For visualisation we limit to first 8 squares
  const SQ_COUNT = Math.min(8, n);
  const sqList = [];
  let cx = 0, cy = 0;
  let dir = 0; // 0=right, 1=up, 2=left, 3=down
  for (let i = 0; i < SQ_COUNT; i++) {
    const s = seq[i + 1] || 1;
    let x, y;
    if (i === 0) { x = 0; y = 0; }
    else {
      const prev = sqList[i - 1];
      if (dir === 0) { x = prev.x + prev.s; y = prev.y; }
      else if (dir === 1) { x = prev.x - (s - prev.s); y = prev.y - s; }
      else if (dir === 2) { x = prev.x - s; y = prev.y - (s - prev.s); }
      else              { x = prev.x; y = prev.y + prev.s; }
    }
    sqList.push({ x, y, s });
    dir = (dir + 1) % 4;
  }
  const xs = sqList.map((s) => s.x); const ys = sqList.map((s) => s.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs.map((x, i) => x + sqList[i].s));
  const yMin = Math.min(...ys), yMax = Math.max(...ys.map((y, i) => y + sqList[i].s));
  const W = 540, H = 360, padL = 16, padR = 16, padT = 16, padB = 16;
  const xRange = xMax - xMin, yRange = yMax - yMin;
  const scale = Math.min((W - padL - padR) / xRange, (H - padT - padB) / yRange);
  const cxOff = (W - xRange * scale) / 2 - xMin * scale;
  const cyOff = (H - yRange * scale) / 2 - yMin * scale;

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);
  const latest = ratios[ratios.length - 1];

  return (
    <Shell back="/maths" backLabel="Back to Maths" topic="Maths · Sequences · Fibonacci">
      <Header
        title="Fibonacci & the"
        accent="golden ratio"
        blurb="Each Fibonacci number is the sum of the two before. The ratio of successive Fibonacci numbers approaches φ = (1 + √5)/2 — the golden ratio — and the squared-square construction traces out the golden spiral, found in seeds, shells and galaxies."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden mb-4" style={{ backgroundColor: "#fdfbf3", border: "1px solid rgba(26,31,46,0.2)" }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
              {sqList.map((sq, i) => (
                <g key={i}>
                  <rect x={cxOff + sq.x * scale} y={cyOff + sq.y * scale}
                    width={sq.s * scale} height={sq.s * scale}
                    fill="#c2185b" opacity={0.08 + i * 0.05}
                    stroke="#c2185b" strokeWidth="1.5" />
                  <text x={cxOff + (sq.x + sq.s / 2) * scale} y={cyOff + (sq.y + sq.s / 2) * scale + 4}
                    textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#1a1f2e">{sq.s}</text>
                </g>
              ))}
              {/* Golden spiral arcs through each square */}
              {sqList.map((sq, i) => {
                const dirIdx = i % 4;
                const r = sq.s * scale;
                let cx, cy, startAng, endAng;
                if (dirIdx === 0) { cx = cxOff + (sq.x + sq.s) * scale; cy = cyOff + (sq.y + sq.s) * scale; startAng = Math.PI; endAng = 1.5 * Math.PI; }
                else if (dirIdx === 1) { cx = cxOff + sq.x * scale;       cy = cyOff + (sq.y + sq.s) * scale; startAng = 1.5 * Math.PI; endAng = 2 * Math.PI; }
                else if (dirIdx === 2) { cx = cxOff + sq.x * scale;       cy = cyOff + sq.y * scale;          startAng = 0;            endAng = 0.5 * Math.PI; }
                else                   { cx = cxOff + (sq.x + sq.s) * scale; cy = cyOff + sq.y * scale;       startAng = 0.5 * Math.PI; endAng = Math.PI; }
                const x1 = cx + r * Math.cos(startAng), y1 = cy + r * Math.sin(startAng);
                const x2 = cx + r * Math.cos(endAng),   y2 = cy + r * Math.sin(endAng);
                return <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke="#1a1f2e" strokeWidth="2" />;
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <SecondaryButton onClick={() => setN(Math.max(3, n - 1))} icon={Minus}>Less</SecondaryButton>
            <SecondaryButton onClick={() => setN(Math.min(30, n + 1))} icon={Plus}>More</SecondaryButton>
            <SecondaryButton onClick={() => setN(12)} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>n = {n}</div>
          </div>

          <Card label="Sequence">
            <div className="text-xs leading-relaxed" style={{ fontFamily: mono, wordBreak: "break-all" }}>
              {seq.slice(0, n + 1).join(", ")}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <StatGrid cols={1}>
            <Stat label="Last F(n)" value={seq[n].toString()} />
            <Stat label="F(n+1) / F(n)" value={latest ? latest.toFixed(8) : "—"} highlight />
            <Stat label="φ (golden ratio)" value={PHI.toFixed(8)} />
            <Stat label="Error" value={latest ? Math.abs(latest - PHI).toExponential(2) : "—"} />
          </StatGrid>
          <div className="mt-4">
            <Card label="Convergence to φ">
              <table className="w-full text-xs" style={{ fontFamily: mono }}>
                <thead>
                  <tr className="border-b border-stone-900/15">
                    <th className="text-left py-1.5 opacity-65">n</th>
                    <th className="text-right py-1.5 opacity-65">F(n+1)/F(n)</th>
                  </tr>
                </thead>
                <tbody>
                  {ratios.slice(-8).map((r, i) => (
                    <tr key={i} className="border-b border-stone-900/8">
                      <td className="py-1.5">{ratios.length - 8 + i + 2}</td>
                      <td className="text-right py-1.5">{r.toFixed(10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
