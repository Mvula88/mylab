"use client";

import { useState, useRef, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Shell, Header, Stat, QuizPanel, mono, SecondaryButton, Card, StatGrid } from "./LabUI";

const W = 560, H = 420;

const QUIZ = [
  { q: "Pythagoras's theorem states that, for a right-angled triangle with legs a, b and hypotenuse c:",
    options: ["a² + b² = c²", "a + b = c", "a × b = c²", "a² − b² = c²"], correct: 0 },
  { q: "Geometric interpretation: the AREA of the square on the hypotenuse equals:",
    options: ["The sum of the areas of the squares on the two legs", "The difference of those areas", "The product of those areas", "Half of either of them"], correct: 0 },
  { q: "If a = 3, b = 4, then c = ?",
    options: ["5  (3² + 4² = 25 = 5²)", "7", "12", "25"], correct: 0 },
  { q: "Pythagorean triple: integers that satisfy a² + b² = c². Which set IS a triple?",
    options: ["(5, 12, 13)  — 25 + 144 = 169 = 13²", "(2, 3, 4)", "(4, 5, 8)", "(6, 7, 10)"], correct: 0 },
];

export default function PythagorasLab() {
  const [a, setA] = useState(60);
  const [b, setB] = useState(80);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const draggingRef = useRef(null);

  const c = Math.sqrt(a * a + b * b);

  // Right-angle vertex at (cx, cy). Legs go along +x (length a) and -y (length b).
  const cx = 180, cy = H - 120;
  const vA = { x: cx + a, y: cy };          // along x
  const vB = { x: cx,     y: cy - b };      // up

  const onMouseDown = (e, which) => {
    e.preventDefault();
    draggingRef.current = which;
  };
  const onMouseMove = (e) => {
    if (!draggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * W;
    const y = (e.clientY - rect.top) / rect.height * H;
    if (draggingRef.current === "a") {
      const newA = Math.max(20, Math.min(220, x - cx));
      setA(newA);
    } else if (draggingRef.current === "b") {
      const newB = Math.max(20, Math.min(180, cy - y));
      setB(newB);
    }
  };
  const onMouseUp = () => { draggingRef.current = null; };

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  // The squares
  // Square on a (below leg a)
  const sqA = { x: cx, y: cy, w: a };
  // Square on b (to the left of leg b)
  const sqB = { x: cx - b, y: cy - b, w: b };
  // Square on c (above the hypotenuse)
  // Hypotenuse goes from vA to vB. Perpendicular outward direction.
  const hx = vB.x - vA.x, hy = vB.y - vA.y;
  const hlen = Math.sqrt(hx * hx + hy * hy);
  const nx = -hy / hlen, ny = hx / hlen; // perpendicular (rotated 90° clockwise visually)
  const sqC = [
    vA,
    vB,
    { x: vB.x + nx * c, y: vB.y + ny * c },
    { x: vA.x + nx * c, y: vA.y + ny * c },
  ];
  const sqCPath = `M ${sqC[0].x} ${sqC[0].y} L ${sqC[1].x} ${sqC[1].y} L ${sqC[2].x} ${sqC[2].y} L ${sqC[3].x} ${sqC[3].y} Z`;

  return (
    <Shell back="/maths" backLabel="Back to Maths" topic="Maths · Geometry · Pythagoras">
      <Header
        title="The Pythagorean"
        accent="theorem"
        blurb="Drag the corners of the right triangle. The three squares built on its sides change size in response. No matter how you shape the triangle, the area of the square on the hypotenuse always equals the sum of the other two."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden mb-4"
            style={{ aspectRatio: "14/10", backgroundColor: "#fdfbf3", border: "1px solid rgba(26,31,46,0.2)", cursor: draggingRef.current ? "grabbing" : "default" }}
            onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            onTouchMove={(e) => { if (e.touches[0]) { e.clientX = e.touches[0].clientX; e.clientY = e.touches[0].clientY; onMouseMove(e); } }}
            onTouchEnd={onMouseUp}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full block">
              {/* squares */}
              <rect x={sqA.x} y={sqA.y} width={sqA.w} height={sqA.w} fill="#c2185b" opacity="0.22" stroke="#c2185b" strokeWidth="2" />
              <text x={sqA.x + sqA.w / 2} y={sqA.y + sqA.w / 2 + 5} textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#c2185b">a² = {(a * a).toFixed(0)}</text>
              <rect x={sqB.x} y={sqB.y} width={sqB.w} height={sqB.w} fill="#1a8af0" opacity="0.22" stroke="#1a8af0" strokeWidth="2" />
              <text x={sqB.x + sqB.w / 2} y={sqB.y + sqB.w / 2 + 5} textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#1a8af0">b² = {(b * b).toFixed(0)}</text>
              <path d={sqCPath} fill="#2e7d32" opacity="0.22" stroke="#2e7d32" strokeWidth="2" />
              <text x={(sqC[0].x + sqC[2].x) / 2} y={(sqC[0].y + sqC[2].y) / 2 + 5} textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#2e7d32">c² = {(c * c).toFixed(0)}</text>

              {/* triangle */}
              <polygon points={`${cx},${cy} ${vA.x},${vA.y} ${vB.x},${vB.y}`}
                fill="rgba(26,31,46,0.05)" stroke="#1a1f2e" strokeWidth="2" />

              {/* right-angle marker */}
              <path d={`M ${cx + 12} ${cy} L ${cx + 12} ${cy - 12} L ${cx} ${cy - 12}`}
                fill="none" stroke="#1a1f2e" strokeWidth="1.5" />

              {/* draggable corner handles */}
              <circle cx={vA.x} cy={vA.y} r="8" fill="#c2185b" stroke="#fdfbf3" strokeWidth="2"
                style={{ cursor: "grab" }}
                onMouseDown={(e) => onMouseDown(e, "a")}
                onTouchStart={(e) => onMouseDown(e, "a")} />
              <circle cx={vB.x} cy={vB.y} r="8" fill="#1a8af0" stroke="#fdfbf3" strokeWidth="2"
                style={{ cursor: "grab" }}
                onMouseDown={(e) => onMouseDown(e, "b")}
                onTouchStart={(e) => onMouseDown(e, "b")} />

              {/* side labels */}
              <text x={(cx + vA.x) / 2} y={cy + 14} textAnchor="middle" fontSize="13" fontFamily="monospace" fontStyle="italic">a = {a.toFixed(0)}</text>
              <text x={cx - 12} y={(cy + vB.y) / 2} textAnchor="end" fontSize="13" fontFamily="monospace" fontStyle="italic">b = {b.toFixed(0)}</text>
              <text x={(vA.x + vB.x) / 2 + 14} y={(vA.y + vB.y) / 2 - 8} fontSize="13" fontFamily="monospace" fontStyle="italic">c ≈ {c.toFixed(1)}</text>
            </svg>
          </div>

          <StatGrid cols={4}>
            <Stat label="a²" value={(a * a).toFixed(0)} />
            <Stat label="b²" value={(b * b).toFixed(0)} />
            <Stat label="a² + b²" value={(a * a + b * b).toFixed(0)} highlight />
            <Stat label="c²" value={(c * c).toFixed(0)} highlight />
          </StatGrid>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <SecondaryButton onClick={() => { setA(60); setB(80); }} icon={RotateCcw}>Reset (3-4-5)</SecondaryButton>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Pythagorean triples">
            <div className="text-xs leading-snug opacity-80 mb-2">
              Integer (a, b, c) that satisfy a² + b² = c²:
            </div>
            <ul className="text-xs space-y-0.5" style={{ fontFamily: mono }}>
              <li>· (3, 4, 5)   — 9 + 16 = 25</li>
              <li>· (5, 12, 13) — 25 + 144 = 169</li>
              <li>· (8, 15, 17) — 64 + 225 = 289</li>
              <li>· (7, 24, 25) — 49 + 576 = 625</li>
              <li>· (20, 21, 29)</li>
            </ul>
            <div className="text-xs opacity-75 mt-2">There are infinitely many; (m²−n², 2mn, m²+n²) generates them.</div>
          </Card>
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
