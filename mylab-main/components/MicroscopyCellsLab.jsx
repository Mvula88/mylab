"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, Award } from "lucide-react";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

// Slides: each has features positioned in normalised coords (0..100 in viewbox)
const SLIDES = [
  {
    id: "cheek",
    label: "Cheek epithelial cells (animal)",
    stain: "Methylene blue",
    blurb: "Loose, irregular, single layer. Stained with methylene blue (binds DNA so nucleus shows up).",
    features: [
      { id: "membrane",  x: 28, y: 35, name: "Cell-surface membrane",
        info: "Outer boundary, partially permeable. No cell wall in animal cells." },
      { id: "cytoplasm", x: 50, y: 60, name: "Cytoplasm",
        info: "Pale blue jelly-like content where enzymes work." },
      { id: "nucleus",   x: 62, y: 38, name: "Nucleus",
        info: "Dark blue/purple central body; contains DNA." },
    ],
  },
  {
    id: "onion",
    label: "Onion epidermis (plant)",
    stain: "Iodine",
    blurb: "Rectangular cells arranged in tight rows, like brickwork. Iodine stain darkens starch and nucleus.",
    features: [
      { id: "wall",      x: 18, y: 30, name: "Cell wall",
        info: "Rigid, made of cellulose. Gives the cell its boxy shape (not present in animal cells)." },
      { id: "membrane",  x: 22, y: 50, name: "Cell-surface membrane",
        info: "Just inside the cell wall, partially permeable." },
      { id: "cytoplasm", x: 40, y: 65, name: "Cytoplasm",
        info: "Pushed to the edge by the large central vacuole." },
      { id: "nucleus",   x: 35, y: 35, name: "Nucleus",
        info: "Often pushed against the cell wall." },
      { id: "vacuole",   x: 60, y: 55, name: "Vacuole",
        info: "Large, central; filled with cell sap. Maintains turgor." },
    ],
  },
];

const QUIZ = [
  {
    q: "Which of these is found in PLANT cells but NOT in animal cells?",
    options: ["Nucleus", "Cytoplasm", "Cell-surface membrane", "Cellulose cell wall"],
    correct: 3,
  },
  {
    q: "Why is methylene blue stain used for cheek cells?",
    options: [
      "It dissolves the cytoplasm",
      "It binds to DNA, making the nucleus visible against the otherwise colourless cytoplasm",
      "It kills bacteria on the slide",
      "It changes the magnification",
    ],
    correct: 1,
  },
  {
    q: "What is the function of the LARGE central VACUOLE in mature plant cells?",
    options: [
      "Photosynthesis",
      "Stores cell sap and maintains TURGOR pressure, pushing the cytoplasm and membrane against the cell wall — giving the cell mechanical support",
      "Produces proteins",
      "Stores oxygen",
    ],
    correct: 1,
  },
  {
    q: "Cheek cells lack chloroplasts. Why does this make biological sense?",
    options: [
      "Chloroplasts are too large to fit in animal cells",
      "Animal cells obtain energy by consuming food, not by photosynthesising — they don't need chloroplasts",
      "Cheek cells are too small",
      "Methylene blue would destroy chloroplasts",
    ],
    correct: 1,
  },
];

export default function MicroscopyCellsLab() {
  const [slideId, setSlideId] = useState(SLIDES[0].id);
  const [revealed, setRevealed] = useState({}); // slideId+featureId → true
  const [activeFeature, setActiveFeature] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const slide = SLIDES.find((s) => s.id === slideId);
  const slideRevealed = SLIDES.reduce((acc, s) => acc + s.features.filter((f) => revealed[`${s.id}-${f.id}`]).length, 0);
  const totalFeatures = SLIDES.reduce((acc, s) => acc + s.features.length, 0);

  const onClickFeature = (fid) => {
    setActiveFeature(fid);
    setRevealed((r) => ({ ...r, [`${slideId}-${fid}`]: true }));
  };

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  const activeFeatureObj = slide.features.find((f) => f.id === activeFeature);

  return (
    <main className="min-h-screen w-full relative"
      style={{ backgroundColor: "#e8e4d8", color: "#1a1f2e", fontFamily: serif }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#1a1f2e 1px, transparent 1px), linear-gradient(90deg, #1a1f2e 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

      <div className="max-w-6xl mx-auto px-5 pt-8 pb-16 relative">
        <Link href="/biology"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase opacity-70 hover:opacity-100 mb-5"
          style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
          <ArrowLeft size={13} /> Back to Biology
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="text-[11px] uppercase text-stone-500 mb-3"
              style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
              Biology · Microscopy · Cells
            </div>
            <h1 className="text-3xl sm:text-4xl leading-[1.1] mb-3" style={{ fontWeight: 500 }}>
              <span style={{ fontStyle: "italic", color: "#c2185b" }}>Animal vs plant</span> cells under the microscope
            </h1>
            <p className="text-sm sm:text-base opacity-80 leading-snug mb-5">
              Two prepared slides at ×400. Cheek epithelial cells stained with methylene blue; onion epidermis stained with iodine. Click the features on each slide to identify them — then compare animal vs plant structure.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {SLIDES.map((s) => {
                const active = s.id === slideId;
                return (
                  <button key={s.id} onClick={() => { setSlideId(s.id); setActiveFeature(null); }}
                    className="p-3 transition active:scale-95"
                    style={{
                      backgroundColor: active ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                      border: `1px solid ${active ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                      color: active ? "#e8e4d8" : "#1a1f2e",
                    }}>
                    <div className="text-sm leading-tight" style={{ fontWeight: 500 }}>{s.label}</div>
                    <div className="text-[10px] opacity-65 mt-1" style={{ fontFamily: mono }}>{s.stain}</div>
                  </button>
                );
              })}
            </div>

            <div className="relative overflow-hidden mb-4"
              style={{ aspectRatio: "1/1", backgroundColor: "#0a0c12", border: "1px solid rgba(26,31,46,0.2)", maxHeight: 500 }}>
              {slide.id === "cheek" ? (
                <CheekSlide revealed={revealed} slideId={slideId} onClick={onClickFeature} active={activeFeature} features={slide.features} />
              ) : (
                <OnionSlide revealed={revealed} slideId={slideId} onClick={onClickFeature} active={activeFeature} features={slide.features} />
              )}
            </div>

            <div className="text-xs opacity-75 leading-snug">
              {slide.blurb}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-5 mb-4"
              style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
              <div className="text-[10px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                Features in this slide
              </div>
              <div className="space-y-1.5">
                {slide.features.map((f) => {
                  const isRevealed = revealed[`${slide.id}-${f.id}`];
                  return (
                    <div key={f.id}
                      onClick={() => isRevealed && setActiveFeature(f.id)}
                      className="flex items-center gap-2 py-1.5 px-2 cursor-pointer"
                      style={{
                        backgroundColor: activeFeature === f.id ? "rgba(194,24,91,0.1)" : "transparent",
                        opacity: isRevealed ? 1 : 0.4,
                      }}>
                      {isRevealed ? <CheckCircle2 size={12} color="#2e7d32" /> : <span className="w-3 h-3 rounded-full border border-stone-900/30" />}
                      <span className="text-sm">{f.name}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-[11px] opacity-60 mt-3" style={{ fontFamily: mono }}>
                {slideRevealed} / {totalFeatures} features identified across both slides
              </div>
            </div>

            {activeFeatureObj && (
              <div className="p-4 mb-4"
                style={{ backgroundColor: "rgba(232,228,216,0.5)", border: "1px solid rgba(26,31,46,0.18)" }}>
                <div className="text-[10px] uppercase text-stone-500 mb-1"
                  style={{ fontFamily: mono, letterSpacing: "0.22em", color: "#c2185b" }}>
                  {activeFeatureObj.name}
                </div>
                <div className="text-xs leading-snug">{activeFeatureObj.info}</div>
              </div>
            )}

            <div className="p-5"
              style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
              <div className="text-[10px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                Exam-style questions
              </div>
              {QUIZ.map((q, i) => (
                <div key={i} className="mb-4">
                  <div className="text-sm mb-2" style={{ fontWeight: 500 }}>{i + 1}. {q.q}</div>
                  <div className="space-y-1.5">
                    {q.options.map((opt, j) => {
                      const sel = answers[i] === j;
                      const isCorrect = submitted && q.correct === j;
                      const isWrong = submitted && sel && q.correct !== j;
                      return (
                        <button key={j}
                          onClick={() => !submitted && setAnswers((a) => ({ ...a, [i]: j }))}
                          disabled={submitted}
                          className="block w-full text-left px-3 py-2 text-xs transition active:scale-[0.99]"
                          style={{
                            backgroundColor: isCorrect ? "rgba(46,125,50,0.18)" : isWrong ? "rgba(194,24,91,0.18)" : sel ? "#1a1f2e" : "rgba(232,228,216,0.5)",
                            color: sel && !submitted ? "#e8e4d8" : "#1a1f2e",
                            border: `1px solid ${isCorrect ? "#2e7d32" : isWrong ? "#c2185b" : "rgba(26,31,46,0.18)"}`,
                          }}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!submitted ? (
                <button onClick={() => setSubmitted(true)}
                  disabled={Object.keys(answers).length < QUIZ.length}
                  className="w-full py-2.5 text-[11px] uppercase active:scale-95 disabled:opacity-40"
                  style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                  Submit answers
                </button>
              ) : (
                <div className="p-4 mt-2 text-center" style={{ backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                  <Award size={16} color="#ec407a" className="mx-auto mb-2" />
                  <div className="text-xl" style={{ fontWeight: 500 }}>{score} / {QUIZ.length} correct</div>
                  <button onClick={() => { setAnswers({}); setSubmitted(false); }}
                    className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase opacity-80 hover:opacity-100"
                    style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                    <RotateCcw size={12} /> Try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* Eyepiece view */
function CheekSlide({ revealed, slideId, onClick, active, features }) {
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full">
      {/* black field around circular eyepiece */}
      <rect x="0" y="0" width="500" height="500" fill="#0a0c12" />
      <defs>
        <clipPath id="eyepiece">
          <circle cx="250" cy="250" r="240" />
        </clipPath>
      </defs>
      <g clipPath="url(#eyepiece)">
        <rect x="0" y="0" width="500" height="500" fill="#c0d7ec" opacity="0.45" />
        {/* scattered cheek cells — irregular blob shapes */}
        {[
          [140, 175, 1.0], [310, 250, 1.1], [220, 360, 0.9], [380, 130, 0.95],
          [80, 320, 0.9], [400, 380, 1.0],
        ].map(([cx, cy, scale], i) => (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={70 * scale} ry={50 * scale} fill="#b9c7e3" opacity="0.7" />
            <ellipse cx={cx} cy={cy} rx={70 * scale} ry={50 * scale} fill="none" stroke="#5970a8" strokeWidth="1.5" opacity="0.85" />
            {/* nucleus */}
            <circle cx={cx + 5} cy={cy - 4} r={10 * scale} fill="#43508a" opacity="0.95" />
          </g>
        ))}
        {/* Feature hotspots */}
        {features.map((f) => {
          const x = f.x * 5;
          const y = f.y * 5;
          const isRev = revealed[`${slideId}-${f.id}`];
          const isActive = active === f.id;
          return (
            <g key={f.id} onClick={() => onClick(f.id)} style={{ cursor: "pointer" }}>
              <circle cx={x} cy={y} r="14" fill={isActive ? "#ec407a" : isRev ? "#7ad59d" : "#fff"}
                opacity={isRev ? 0.5 : 0.25} stroke="#ec407a" strokeWidth="2" />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="700"
                fill={isRev ? "#0a0c12" : "#fff"}>+</text>
              {isRev && (
                <text x={x + 18} y={y + 4} fontSize="9" fontFamily="monospace" fill="#fff" opacity="0.85">{f.name}</text>
              )}
            </g>
          );
        })}
      </g>
      <circle cx="250" cy="250" r="240" fill="none" stroke="#1a1f2e" strokeWidth="6" />
      <text x="250" y="490" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#e8e4d8" letterSpacing="2">×400</text>
    </svg>
  );
}

function OnionSlide({ revealed, slideId, onClick, active, features }) {
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full">
      <rect x="0" y="0" width="500" height="500" fill="#0a0c12" />
      <defs>
        <clipPath id="eyepiece2">
          <circle cx="250" cy="250" r="240" />
        </clipPath>
      </defs>
      <g clipPath="url(#eyepiece2)">
        <rect x="0" y="0" width="500" height="500" fill="#f3e7c8" opacity="0.55" />
        {/* brickwork of onion cells: rectangular */}
        {Array.from({ length: 4 }).map((_, row) => (
          Array.from({ length: 3 }).map((__, col) => {
            const offset = row % 2 === 0 ? 0 : 80;
            const x = 30 + col * 160 + offset;
            const y = 60 + row * 100;
            return (
              <g key={`${row}-${col}`}>
                <rect x={x} y={y} width="150" height="90" fill="#e8c98f" opacity="0.85"
                  stroke="#a3531c" strokeWidth="3" />
                {/* nucleus */}
                <circle cx={x + 30 + (row + col) * 6} cy={y + 50} r="8" fill="#5a2c08" opacity="0.95" />
              </g>
            );
          })
        )).flat()}
      </g>
      {/* Feature hotspots (outside clip) */}
      <g>
        {features.map((f) => {
          const x = f.x * 5;
          const y = f.y * 5;
          const isRev = revealed[`${slideId}-${f.id}`];
          const isActive = active === f.id;
          return (
            <g key={f.id} onClick={() => onClick(f.id)} style={{ cursor: "pointer" }}>
              <circle cx={x} cy={y} r="14" fill={isActive ? "#ec407a" : isRev ? "#7ad59d" : "#fff"}
                opacity={isRev ? 0.5 : 0.4} stroke="#ec407a" strokeWidth="2" />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="700"
                fill={isRev ? "#0a0c12" : "#1a1f2e"}>+</text>
              {isRev && (
                <text x={x + 18} y={y + 4} fontSize="9" fontFamily="monospace" fill="#1a1f2e" opacity="0.85">{f.name}</text>
              )}
            </g>
          );
        })}
      </g>
      <circle cx="250" cy="250" r="240" fill="none" stroke="#1a1f2e" strokeWidth="6" />
      <text x="250" y="490" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#e8e4d8" letterSpacing="2">×400</text>
    </svg>
  );
}
