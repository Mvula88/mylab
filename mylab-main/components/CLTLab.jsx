"use client";

import { useState } from "react";
import { RotateCcw, Shuffle } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";

const DISTROS = [
  { id: "uniform",  name: "Uniform on [0, 1]",     sample: () => Math.random(), mean: 0.5,   sd: Math.sqrt(1/12) },
  { id: "expo",     name: "Exponential (λ = 2)",    sample: () => -Math.log(1 - Math.random()) / 2, mean: 0.5, sd: 0.5 },
  { id: "bimodal",  name: "Bimodal (mix of two Gaussians)",
    sample: () => Math.random() < 0.5 ? gauss(0.25, 0.06) : gauss(0.75, 0.06), mean: 0.5, sd: 0.27 },
  { id: "discrete", name: "Discrete die {1..6} (rescaled to 0..1)",
    sample: () => (Math.floor(Math.random() * 6) + 1) / 6, mean: 7/12, sd: Math.sqrt(35/144) / 6 },
];

function gauss(mu, sd) {
  const u1 = Math.random(), u2 = Math.random();
  return mu + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

const QUIZ = [
  { q: "What does the Central Limit Theorem say?",
    options: ["All distributions are normal", "The sum (or mean) of N independent samples from a finite-variance distribution approaches a NORMAL distribution as N → ∞", "Samples from a uniform distribution are normal", "Random samples are always Gaussian"], correct: 1 },
  { q: "If the underlying distribution has variance σ², what is the variance of the SAMPLE MEAN of N draws?",
    options: ["σ²", "σ² / N", "N × σ²", "σ × √N"], correct: 1 },
  { q: "Standard error of the mean (SE) = σ / √N. If N quadruples, SE:",
    options: ["Quadruples", "Halves", "Stays the same", "Doubles"], correct: 1 },
  { q: "CLT requires (loosely) that the underlying distribution has:",
    options: ["A symmetric shape", "Finite mean and finite variance — does NOT need to be normal-shaped", "An infinite support", "Zero mean"], correct: 1 },
];

export default function CLTLab() {
  const [distroId, setDistroId] = useState("bimodal");
  const [sampleSize, setSampleSize] = useState(20);
  const [meanSamples, setMeanSamples] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const distro = DISTROS.find((d) => d.id === distroId);

  const drawMeans = (n) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < sampleSize; j++) sum += distro.sample();
      out.push(sum / sampleSize);
    }
    setMeanSamples((prev) => [...prev, ...out]);
  };

  const reset = () => setMeanSamples([]);
  const switchDistro = (id) => { setDistroId(id); setMeanSamples([]); };
  const setSize = (s) => { setSampleSize(s); setMeanSamples([]); };

  // Histogram bins
  const BIN_COUNT = 30;
  const xMin = 0, xMax = 1;
  const bins = new Array(BIN_COUNT).fill(0);
  meanSamples.forEach((x) => {
    const k = Math.min(BIN_COUNT - 1, Math.max(0, Math.floor((x - xMin) / (xMax - xMin) * BIN_COUNT)));
    bins[k]++;
  });

  // Also draw the underlying distribution for comparison (sample 5000 from it once)
  const [underlying] = useState(() => {
    const ub = new Array(BIN_COUNT).fill(0);
    for (let i = 0; i < 5000; i++) {
      const x = distro.sample();
      const k = Math.min(BIN_COUNT - 1, Math.max(0, Math.floor((x - xMin) / (xMax - xMin) * BIN_COUNT)));
      ub[k]++;
    }
    return ub;
  });

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  // Expected SE
  const SE = distro.sd / Math.sqrt(sampleSize);

  return (
    <Shell back="/maths" backLabel="Back to Maths" topic="Maths · Probability · Central Limit Theorem">
      <Header
        title="Central Limit"
        accent="Theorem"
        blurb="Take many samples (each of size n) from any distribution with finite variance. Compute the mean of each sample. As n grows, the distribution of those means approaches a NORMAL distribution centred on the true mean — regardless of the underlying distribution's shape."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
            {DISTROS.map((d) => (
              <button key={d.id} onClick={() => switchDistro(d.id)}
                className="p-2 transition active:scale-95 text-left"
                style={{
                  backgroundColor: d.id === distroId ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                  border: `1px solid ${d.id === distroId ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                  color: d.id === distroId ? "#e8e4d8" : "#1a1f2e",
                }}>
                <div className="text-[11px] leading-tight">{d.name}</div>
              </button>
            ))}
          </div>

          <div className="p-4 mb-3" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>sample size n</div>
            <input type="range" min="1" max="100" step="1" value={sampleSize} onChange={(e) => setSize(parseInt(e.target.value))} className="w-full" />
            <div className="text-sm" style={{ fontFamily: mono }}>n = {sampleSize}</div>
          </div>

          <div className="relative overflow-hidden mb-3 p-4" style={{ backgroundColor: "#fdfbf3", border: "1px solid rgba(26,31,46,0.2)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-2" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>Underlying distribution (5000 raw samples)</div>
            <Hist bins={underlying} colour="#1a8af0" />
          </div>

          <div className="relative overflow-hidden mb-3 p-4" style={{ backgroundColor: "#fdfbf3", border: "1px solid rgba(26,31,46,0.2)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-2" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>Distribution of sample MEANS — should look Gaussian as n grows</div>
            <Hist bins={bins} colour="#c2185b" expectedMean={distro.mean} expectedSE={SE} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PrimaryButton onClick={() => drawMeans(100)} icon={Shuffle}>Draw × 100</PrimaryButton>
            <SecondaryButton onClick={() => drawMeans(1000)} icon={Shuffle}>× 1000</SecondaryButton>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>{meanSamples.length} means drawn</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Theory">
            <div className="text-xs" style={{ fontFamily: mono }}>
              μ_x̄ = μ (mean of means equals population mean)
              <br />
              σ_x̄ = σ / √n  (SE of the mean)
            </div>
            <div className="text-xs mt-3 leading-snug" style={{ fontFamily: mono }}>
              μ = {distro.mean.toFixed(3)} · σ ≈ {distro.sd.toFixed(3)}
              <br />
              expected SE = σ/√n = <span style={{ color: "#c2185b", fontWeight: 600 }}>{SE.toFixed(4)}</span>
            </div>
            <div className="text-xs opacity-75 mt-3 leading-snug">
              Watch what happens when you switch to a wildly skewed distribution and crank n up — the histogram of means still becomes a tidy bell curve. That is the magic of CLT.
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

function Hist({ bins, colour, expectedMean, expectedSE }) {
  const W = 480, H = 130, padL = 30, padR = 8, padT = 6, padB = 22;
  const max = Math.max(1, ...bins);
  const bw = (W - padL - padR) / bins.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      {bins.map((b, i) => {
        const h = (b / max) * (H - padT - padB);
        return <rect key={i} x={padL + i * bw} y={H - padB - h} width={bw - 0.5} height={h} fill={colour} opacity="0.75" />;
      })}
      {expectedMean != null && (
        <line x1={padL + (expectedMean) * (W - padL - padR)} y1={padT} x2={padL + (expectedMean) * (W - padL - padR)} y2={H - padB}
          stroke="#2e7d32" strokeWidth="1.5" strokeDasharray="3,2" />
      )}
      {expectedSE != null && expectedMean != null && (
        <>
          <line x1={padL + (expectedMean - expectedSE) * (W - padL - padR)} y1={padT} x2={padL + (expectedMean - expectedSE) * (W - padL - padR)} y2={H - padB} stroke="#2e7d32" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
          <line x1={padL + (expectedMean + expectedSE) * (W - padL - padR)} y1={padT} x2={padL + (expectedMean + expectedSE) * (W - padL - padR)} y2={H - padB} stroke="#2e7d32" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
        </>
      )}
      <text x={padL} y={H - 4} fontSize="9" fontFamily="monospace" fill="#1a1f2e" opacity="0.5">0</text>
      <text x={W - padR} y={H - 4} fontSize="9" fontFamily="monospace" textAnchor="end" fill="#1a1f2e" opacity="0.5">1</text>
    </svg>
  );
}
