"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";
import { Shell, Header, Stat, QuizPanel, mono, PrimaryButton, SecondaryButton, Card, StatGrid } from "./LabUI";

const W = 560, H = 360;
const PALETTE = ["#c2185b", "#1a8af0", "#2e7d32", "#a85a1a", "#7b1fa2", "#0097a7"];

const QUIZ = [
  { q: "For a 1-D symmetric random walk of N steps, the EXPECTED distance from origin grows as:",
    options: ["O(N)", "O(√N)", "O(log N)", "O(N²)"], correct: 1 },
  { q: "Two walks that started together diverge. Why does the AVERAGE end position over many walks tend to ZERO?",
    options: ["Walks slow down at the boundary", "By symmetry — equally likely to go +1 or −1 each step, so E[X] = 0", "Steps cancel deterministically", "Random walks are bounded"], correct: 1 },
  { q: "In 2-D, the path returns to origin INFINITELY often (with probability 1). In 3-D, the probability of return is:",
    options: ["Also 1 — same as 2-D", "Less than 1 — the walker can escape to infinity (Pólya's theorem)", "Exactly 0", "Depends on starting direction"], correct: 1 },
  { q: "Mean-square displacement (⟨r²⟩) grows linearly with N. This is the basis of:",
    options: ["Kepler's laws", "Diffusion (Einstein's Brownian-motion result)", "Newton's third law", "Quantum entanglement"], correct: 1 },
];

export default function RandomWalkLab() {
  const [walks, setWalks] = useState([{ id: 0, path: [{ x: 0, y: 0 }], color: PALETTE[0] }]);
  const [running, setRunning] = useState(false);
  const [dim, setDim] = useState("2d");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef(null);
  const walksRef = useRef(walks);
  walksRef.current = walks;
  const dimRef = useRef(dim);
  dimRef.current = dim;

  useEffect(() => {
    if (!running) return;
    let raf;
    const tick = () => {
      setWalks((prev) => prev.map((w) => {
        const last = w.path[w.path.length - 1];
        let dx, dy;
        if (dimRef.current === "1d") {
          dx = Math.random() < 0.5 ? -1 : 1; dy = 0;
        } else {
          const a = Math.random() * Math.PI * 2;
          dx = Math.cos(a); dy = Math.sin(a);
        }
        const next = { x: last.x + dx, y: last.y + dy };
        return { ...w, path: w.path.length > 5000 ? w.path : [...w.path, next] };
      }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  // Render
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    // axes
    ctx.strokeStyle = "#1a1f2e"; ctx.lineWidth = 1; ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
    if (dim === "2d") { ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); }
    ctx.globalAlpha = 1;

    walks.forEach((w) => {
      if (w.path.length < 2) return;
      ctx.strokeStyle = w.color; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.85;
      ctx.beginPath();
      if (dim === "1d") {
        // x position over step count
        const xScale = (W - 20) / Math.max(50, w.path.length);
        ctx.moveTo(10, H / 2 - w.path[0].x * 2);
        w.path.forEach((p, i) => ctx.lineTo(10 + i * xScale, H / 2 - p.x * 2));
      } else {
        ctx.moveTo(W / 2 + w.path[0].x * 2.5, H / 2 + w.path[0].y * 2.5);
        w.path.forEach((p) => ctx.lineTo(W / 2 + p.x * 2.5, H / 2 + p.y * 2.5));
      }
      ctx.stroke();
      // endpoint marker
      const last = w.path[w.path.length - 1];
      ctx.fillStyle = w.color;
      if (dim === "1d") {
        const xScale = (W - 20) / Math.max(50, w.path.length);
        ctx.beginPath(); ctx.arc(10 + (w.path.length - 1) * xScale, H / 2 - last.x * 2, 3, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(W / 2 + last.x * 2.5, H / 2 + last.y * 2.5, 3, 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
  }, [walks, dim]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const addWalk = () => setWalks((p) => [...p, { id: p.length, path: [{ x: 0, y: 0 }], color: PALETTE[p.length % PALETTE.length] }]);
  const reset = () => { setRunning(false); setWalks([{ id: 0, path: [{ x: 0, y: 0 }], color: PALETTE[0] }]); };

  const N = walks[0]?.path.length || 0;
  const distances = walks.map((w) => {
    const last = w.path[w.path.length - 1];
    return Math.sqrt(last.x * last.x + last.y * last.y);
  });
  const meanDist = distances.length > 0 ? distances.reduce((a, b) => a + b, 0) / distances.length : 0;
  const expectedDist = Math.sqrt(N);

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/maths" backLabel="Back to Maths" topic="Maths · Probability · Random walks">
      <Header
        title="Random walks &"
        accent="diffusion"
        blurb="At each step the walker takes a unit move in a random direction. Over many steps, the mean distance from origin grows as √N (not N) — the hallmark of diffusive behaviour. Run several walks in parallel to see this clearly."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <select value={dim} onChange={(e) => { setDim(e.target.value); reset(); }}
              className="px-3 py-2 text-sm" style={{ fontFamily: mono, backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.25)" }}>
              <option value="1d">1-D (position vs step)</option>
              <option value="2d">2-D (planar walk)</option>
            </select>
          </div>

          <div className="relative overflow-hidden mb-4"
            style={{ aspectRatio: "14/9", backgroundColor: "#fdfbf3", border: "1px solid rgba(26,31,46,0.2)" }}>
            <canvas ref={canvasRef} width={W} height={H} style={{ width: "100%", height: "100%", display: "block" }} />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {!running ? <PrimaryButton onClick={start} icon={Play}>{N === 1 ? "Start" : "Resume"}</PrimaryButton>
              : <SecondaryButton onClick={pause} icon={Pause}>Pause</SecondaryButton>}
            <SecondaryButton onClick={addWalk} icon={Shuffle} disabled={walks.length >= 6}>Add walk</SecondaryButton>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>

          <StatGrid cols={3}>
            <Stat label="Steps N" value={N.toString()} />
            <Stat label="Mean |r|" value={meanDist.toFixed(1)} />
            <Stat label="Expected √N" value={expectedDist.toFixed(1)} />
          </StatGrid>
        </div>

        <div className="lg:col-span-5">
          <Card label="Why √N?">
            <div className="text-xs leading-snug opacity-80">
              Variance ADDS for independent steps: ⟨r²⟩ = N × ⟨step²⟩. So ⟨|r|⟩ scales as √N. This is the diffusion law — root-mean-square displacement grows with the square root of time.
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
