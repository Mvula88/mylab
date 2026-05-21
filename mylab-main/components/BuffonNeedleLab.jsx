"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Shell, Header, Stat, QuizPanel, mono, PrimaryButton, SecondaryButton, Card, StatGrid } from "./LabUI";

// Buffon's needle: parallel lines distance d apart, needles length L (L ≤ d).
// Probability of crossing = 2L / (π d).
// π ≈ 2 L N / (d × crossings)
const D = 40;    // px between lines
const L = 30;    // needle length
const W = 560, H = 360;
const LINE_COUNT = Math.floor(H / D);

const QUIZ = [
  { q: "What does the proportion of needles that CROSS a line approach?",
    options: ["2L / (πd)  — Buffon's formula", "L / d", "π × L × d", "Random — no formula"], correct: 0 },
  { q: "Re-arrange for π given the crossing count C out of N needles:",
    options: ["π = 2LN / (dC)", "π = dC / (2LN)", "π = C/N", "π = N/C"], correct: 0 },
  { q: "Why does the estimate IMPROVE as N grows?",
    options: ["Needles get more accurate", "By the law of large numbers, the empirical proportion converges to the true probability", "π changes with N", "Random chance shrinks linearly"], correct: 1 },
  { q: "Does the ESTIMATE depend on the needle length L (provided L ≤ d)?",
    options: ["No — L cancels out", "Yes — appears in formula; longer needles → higher crossing probability → still gives π if used correctly", "Only if L > d", "Only if L = d"], correct: 1 },
];

function dropNeedle() {
  // Centre y uniform across the page; angle uniform in [0, π).
  const cy = Math.random() * H;
  const cx = Math.random() * W;
  const angle = Math.random() * Math.PI;
  const dy = (L / 2) * Math.sin(angle);
  const y1 = cy - dy, y2 = cy + dy;
  // Find nearest line(s)
  let crosses = false;
  for (let i = 0; i <= LINE_COUNT; i++) {
    const ly = i * D;
    if ((y1 <= ly && y2 >= ly) || (y2 <= ly && y1 >= ly)) { crosses = true; break; }
  }
  return { cx, cy, angle, crosses };
}

export default function BuffonNeedleLab() {
  const [needles, setNeedles] = useState([]);
  const [running, setRunning] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef(null);

  // Tick: add 5 needles per frame while running
  useEffect(() => {
    if (!running) return;
    let raf;
    const tick = () => {
      setNeedles((prev) => {
        const newOnes = [];
        for (let i = 0; i < 5; i++) newOnes.push(dropNeedle());
        return prev.length > 5000 ? prev : [...prev, ...newOnes];
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  // Render needles on canvas
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    // floor lines
    ctx.strokeStyle = "#1a1f2e"; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.4;
    for (let i = 0; i <= LINE_COUNT; i++) {
      ctx.beginPath(); ctx.moveTo(0, i * D); ctx.lineTo(W, i * D); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // needles
    needles.forEach((n) => {
      ctx.strokeStyle = n.crosses ? "#c2185b" : "#1a1f2e";
      ctx.lineWidth = 2; ctx.globalAlpha = 0.7;
      const dx = (L / 2) * Math.cos(n.angle), dy = (L / 2) * Math.sin(n.angle);
      ctx.beginPath();
      ctx.moveTo(n.cx - dx, n.cy - dy);
      ctx.lineTo(n.cx + dx, n.cy + dy);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }, [needles]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const dropOne = () => setNeedles((p) => [...p, dropNeedle()]);
  const reset = () => { setRunning(false); setNeedles([]); };

  const N = needles.length;
  const C = needles.filter((n) => n.crosses).length;
  const πEst = C > 0 ? (2 * L * N) / (D * C) : null;

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/maths" backLabel="Back to Maths" topic="Maths · Probability · Monte-Carlo">
      <Header
        title="Buffon's needle estimation of"
        accent="π"
        blurb="Drop a needle of length L onto a floor with parallel lines distance d apart (L ≤ d). The probability that the needle crosses a line is 2L/πd. Count crossings over N drops and re-arrange to estimate π."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden mb-4"
            style={{ aspectRatio: "14/9", backgroundColor: "#fdfbf3", border: "1px solid rgba(26,31,46,0.2)" }}>
            <canvas ref={canvasRef} width={W} height={H} style={{ width: "100%", height: "100%", display: "block" }} />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {!running ? <PrimaryButton onClick={start} icon={Play}>{N === 0 ? "Start dropping" : "Resume"}</PrimaryButton>
              : <SecondaryButton onClick={pause} icon={Pause}>Pause</SecondaryButton>}
            <SecondaryButton onClick={dropOne}>Drop one</SecondaryButton>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>

          <StatGrid cols={4}>
            <Stat label="Needles N" value={N.toString()} />
            <Stat label="Crossings C" value={C.toString()} />
            <Stat label="C / N" value={N > 0 ? (C / N).toFixed(3) : "—"} />
            <Stat label="π̂" value={πEst ? πEst.toFixed(5) : "—"} highlight={N > 1000} />
          </StatGrid>
        </div>

        <div className="lg:col-span-5">
          <Card label="Formula">
            <div className="text-sm" style={{ fontFamily: mono }}>P(cross) = 2L / (π d)</div>
            <div className="text-sm mt-1" style={{ fontFamily: mono }}>π ≈ 2 L N / (d C)</div>
            <div className="text-xs opacity-75 mt-2">L = {L}, d = {D}. As N grows, C/N → 2L/(πd), so π̂ stabilises around π = 3.14159…</div>
            {πEst && (
              <div className="text-xs mt-3 leading-snug" style={{ fontFamily: mono }}>
                Error vs true π: <span style={{ color: "#c2185b", fontWeight: 600 }}>{Math.abs(πEst - Math.PI).toFixed(4)}</span>
              </div>
            )}
          </Card>
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
