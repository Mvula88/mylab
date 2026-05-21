"use client";

import { useState, useEffect, useRef } from "react";
import { Shell, Header, QuizPanel, mono, Card } from "./LabUI";

const W = 540, H = 400;

const QUIZ = [
  { q: "The logistic map is:",
    options: ["x_{n+1} = r · x_n · (1 − x_n)", "x_{n+1} = x_n + r", "x_{n+1} = r · x_n²", "x_{n+1} = r / x_n"], correct: 0 },
  { q: "For r below 3, the iteration converges to a SINGLE fixed point. What happens between r ≈ 3 and r ≈ 3.45?",
    options: ["Still single fixed point", "PERIOD-DOUBLING begins — the system oscillates between 2 values", "Diverges to infinity", "Stays at zero"], correct: 1 },
  { q: "What is the FEIGENBAUM constant δ ≈ 4.6692, and what does it count?",
    options: ["The number of bifurcations", "The ratio between successive period-doubling parameter intervals — UNIVERSAL across many systems", "The first chaotic r value", "The number of fixed points"], correct: 1 },
  { q: "For r > about 3.57, what behaviour dominates?",
    options: ["Single fixed point", "Period-4 cycles forever", "CHAOS — points fill a band of values aperiodically; small input changes amplify", "Linear growth"], correct: 2 },
];

export default function LogisticMapLab() {
  const canvasRef = useRef(null);
  const cobwebRef = useRef(null);
  const [r, setR] = useState(3.5);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Bifurcation diagram (full one rendered once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fdfbf3"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(26, 31, 46, 0.55)";
    const rMin = 2.5, rMax = 4.0;
    for (let px = 0; px < W; px++) {
      const rValue = rMin + (px / W) * (rMax - rMin);
      let x = 0.5;
      for (let i = 0; i < 200; i++) x = rValue * x * (1 - x); // settle
      for (let i = 0; i < 100; i++) {
        x = rValue * x * (1 - x);
        const py = H - x * H;
        ctx.fillRect(px, py, 1, 1);
      }
    }
    // r marker line
    const rPx = ((r - rMin) / (rMax - rMin)) * W;
    ctx.strokeStyle = "#c2185b"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(rPx, 0); ctx.lineTo(rPx, H); ctx.stroke();
  }, [r]);

  // Cobweb / time series for current r
  useEffect(() => {
    const c = cobwebRef.current;
    if (!c) return;
    const W2 = 540, H2 = 200;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fdfbf3"; ctx.fillRect(0, 0, W2, H2);
    // axes
    ctx.strokeStyle = "#1a1f2e"; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.moveTo(30, H2 - 25); ctx.lineTo(W2 - 5, H2 - 25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, 5); ctx.lineTo(30, H2 - 25); ctx.stroke();
    ctx.globalAlpha = 1;
    // iterate and plot x_n
    let x = 0.5;
    const N = 80;
    const ys = [];
    for (let i = 0; i < N; i++) { x = r * x * (1 - x); ys.push(x); }
    const xStep = (W2 - 40) / N;
    ctx.strokeStyle = "#c2185b"; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ys.forEach((y, i) => {
      const px = 30 + i * xStep;
      const py = (H2 - 25) - y * (H2 - 30);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.fillStyle = "#c2185b";
    ys.forEach((y, i) => {
      const px = 30 + i * xStep;
      const py = (H2 - 25) - y * (H2 - 30);
      ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = "#1a1f2e"; ctx.font = "10px monospace";
    ctx.fillText("0", 5, H2 - 22);
    ctx.fillText("1", 14, 12);
    ctx.fillText("x_n vs n", W2 / 2 - 20, 14);
  }, [r]);

  let regime;
  if (r < 3) regime = "Fixed point";
  else if (r < 3.45) regime = "Period-2 (oscillates between 2 values)";
  else if (r < 3.54) regime = "Period-4";
  else if (r < 3.57) regime = "Period-8 / period-doubling cascade";
  else if (r > 3.83 && r < 3.86) regime = "Period-3 window — embedded order in chaos!";
  else regime = "Chaos — sensitive dependence on initial conditions";

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/maths" backLabel="Back to Maths" topic="Maths · Iteration · Chaos">
      <Header
        title="The logistic map &"
        accent="bifurcation diagram"
        blurb="The innocuous recurrence x_{n+1} = r · x_n · (1 − x_n) hides a full menagerie of behaviour. As r climbs from 2.5 to 4, the long-term values bifurcate again and again — and eventually plunge into chaos."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden mb-3"
            style={{ aspectRatio: `${W} / ${H}`, backgroundColor: "#fdfbf3", border: "1px solid rgba(26,31,46,0.2)" }}>
            <canvas ref={canvasRef} width={W} height={H} style={{ width: "100%", height: "100%", display: "block" }} />
          </div>

          <div className="p-4 mb-3" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>parameter r (2.5 → 4.0)</div>
            <input type="range" min="2.5" max="4" step="0.005" value={r} onChange={(e) => setR(parseFloat(e.target.value))} className="w-full" />
            <div className="text-sm" style={{ fontFamily: mono }}>r = {r.toFixed(3)} · <span style={{ color: "#c2185b", fontWeight: 600 }}>{regime}</span></div>
          </div>

          <div className="relative overflow-hidden" style={{ backgroundColor: "#fdfbf3", border: "1px solid rgba(26,31,46,0.2)" }}>
            <div className="text-[10px] uppercase opacity-60 px-3 pt-2" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>Time series x₀, x₁, x₂, …</div>
            <canvas ref={cobwebRef} width="540" height="200" style={{ width: "100%", display: "block" }} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Why this matters">
            <div className="text-xs leading-snug opacity-85">
              The logistic map was originally a toy model for population growth. The deeper discovery (May, Feigenbaum, 1970s) was that the SAME bifurcation cascade — with the SAME universal constants δ ≈ 4.669 and α ≈ 2.503 — appears in completely unrelated systems: dripping faucets, electronic oscillators, heart-rate variability. It is the canonical example of "deterministic chaos."
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
