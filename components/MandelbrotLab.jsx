"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, Plus, Minus } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, Card } from "./LabUI";

const W = 540, H = 420;

const QUIZ = [
  { q: "The Mandelbrot set is the set of complex numbers c for which:",
    options: ["|c| < 1", "The iteration z₀ = 0, z_{n+1} = z_n² + c stays BOUNDED forever", "Re(c) > 0", "c is rational"], correct: 1 },
  { q: "Mandelbrot is famous for being:",
    options: ["A polynomial of degree 2", "A FRACTAL — self-similar at every zoom level", "A linear function", "A prime-number sieve"], correct: 1 },
  { q: "Why are points coloured by their ESCAPE time?",
    options: ["For decoration only", "Points outside the set escape to ∞ at different speeds — escape time encodes how 'close' they are to the boundary", "All points escape at the same speed", "Colour is random"], correct: 1 },
  { q: "Which test reliably proves a point ESCAPES (is NOT in the set)?",
    options: ["|z| > 2 at some iteration — then |z| → ∞", "Iterating 10 times", "z = 0", "Re(c) > 2"], correct: 0 },
];

const PALETTE = ["#1a1f2e", "#3a2a5c", "#5a2a8a", "#9c3a8a", "#c2185b", "#e87a3a", "#f7c948", "#fdfbf3"];

function mandelbrot(cx, cy, maxIter) {
  let zx = 0, zy = 0;
  for (let i = 0; i < maxIter; i++) {
    const x2 = zx * zx, y2 = zy * zy;
    if (x2 + y2 > 4) return i;
    const newZx = x2 - y2 + cx;
    const newZy = 2 * zx * zy + cy;
    zx = newZx; zy = newZy;
  }
  return maxIter;
}

export default function MandelbrotLab() {
  const canvasRef = useRef(null);
  const [view, setView] = useState({ cx: -0.5, cy: 0, scale: 1.5 });
  const [maxIter, setMaxIter] = useState(120);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(W, H);
    const aspect = W / H;
    const xMin = view.cx - view.scale * aspect;
    const xMax = view.cx + view.scale * aspect;
    const yMin = view.cy - view.scale;
    const yMax = view.cy + view.scale;
    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const x = xMin + (px / W) * (xMax - xMin);
        const y = yMin + (py / H) * (yMax - yMin);
        const it = mandelbrot(x, y, maxIter);
        const idx = (py * W + px) * 4;
        if (it === maxIter) {
          img.data[idx] = 26; img.data[idx + 1] = 31; img.data[idx + 2] = 46;
        } else {
          const k = Math.log(it + 1) / Math.log(maxIter);
          const palIdx = Math.min(PALETTE.length - 1, Math.floor(k * PALETTE.length));
          const hex = PALETTE[palIdx];
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          img.data[idx] = r; img.data[idx + 1] = g; img.data[idx + 2] = b;
        }
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [view, maxIter]);

  const onCanvasClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width * W;
    const py = (e.clientY - rect.top) / rect.height * H;
    const aspect = W / H;
    const xMin = view.cx - view.scale * aspect;
    const xMax = view.cx + view.scale * aspect;
    const yMin = view.cy - view.scale;
    const yMax = view.cy + view.scale;
    const newCx = xMin + (px / W) * (xMax - xMin);
    const newCy = yMin + (py / H) * (yMax - yMin);
    setView({ cx: newCx, cy: newCy, scale: view.scale * 0.5 });
  };

  const zoomOut = () => setView((v) => ({ ...v, scale: v.scale * 2 }));
  const reset = () => setView({ cx: -0.5, cy: 0, scale: 1.5 });
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/maths" backLabel="Back to Maths" topic="Maths · Iteration · Fractals">
      <Header
        title="The Mandelbrot"
        accent="set"
        blurb="Iterate z → z² + c starting at z = 0. The Mandelbrot set is the dark region where this iteration stays bounded forever. Click anywhere on the image to zoom in by 2×; explore the fractal coastline of the set."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden mb-4"
            style={{ aspectRatio: `${W} / ${H}`, backgroundColor: "#1a1f2e", border: "1px solid rgba(26,31,46,0.2)", cursor: "crosshair" }}>
            <canvas ref={canvasRef} width={W} height={H} style={{ width: "100%", height: "100%", display: "block" }} onClick={onCanvasClick} />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <SecondaryButton onClick={zoomOut} icon={Minus}>Zoom out</SecondaryButton>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset view</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>
              centre ({view.cx.toFixed(4)}, {view.cy.toFixed(4)}) · scale {view.scale.toExponential(2)}
            </div>
          </div>

          <div className="p-4" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>iteration depth</div>
            <input type="range" min="32" max="500" step="16" value={maxIter} onChange={(e) => setMaxIter(parseInt(e.target.value))} className="w-full" />
            <div className="text-sm" style={{ fontFamily: mono }}>maxIter = {maxIter}  (higher = finer boundary, slower render)</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="The iteration">
            <div className="text-sm" style={{ fontFamily: mono }}>z₀ = 0</div>
            <div className="text-sm mt-1" style={{ fontFamily: mono }}>z_{`{n+1}`} = z_n² + c</div>
            <div className="text-xs opacity-75 mt-2">
              Black = inside the set (bounded). Colour = how many iterations until |z| exceeded 2 (escaped to ∞). Zooming in reveals miniature copies of the whole set everywhere along the boundary.
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
