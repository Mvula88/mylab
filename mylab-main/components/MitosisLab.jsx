"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, Award } from "lucide-react";

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

const STAGES = [
  { id: "inter",  label: "Interphase",  short: "Inter",  blurb: "Chromatin spread out as fine threads; nucleus clearly visible." },
  { id: "pro",    label: "Prophase",    short: "Pro",    blurb: "Chromosomes condensed and visible; nuclear membrane breaks down." },
  { id: "meta",   label: "Metaphase",   short: "Meta",   blurb: "Chromosomes line up across the centre of the cell." },
  { id: "ana",    label: "Anaphase",    short: "Ana",    blurb: "Chromatids pulled apart, moving to opposite poles." },
  { id: "telo",   label: "Telophase",   short: "Telo",   blurb: "Two new nuclei reform; chromosomes decondense; cell starts dividing." },
];

// 24 cells in a 6×4 grid. Each has a true stage.
const CELLS = [
  // row 0
  { x: 0, y: 0, stage: "inter" }, { x: 1, y: 0, stage: "inter" }, { x: 2, y: 0, stage: "pro" },
  { x: 3, y: 0, stage: "inter" }, { x: 4, y: 0, stage: "inter" }, { x: 5, y: 0, stage: "telo" },
  // row 1
  { x: 0, y: 1, stage: "inter" }, { x: 1, y: 1, stage: "meta" }, { x: 2, y: 1, stage: "inter" },
  { x: 3, y: 1, stage: "ana" },   { x: 4, y: 1, stage: "inter" }, { x: 5, y: 1, stage: "inter" },
  // row 2
  { x: 0, y: 2, stage: "telo" },  { x: 1, y: 2, stage: "inter" }, { x: 2, y: 2, stage: "inter" },
  { x: 3, y: 2, stage: "pro" },   { x: 4, y: 2, stage: "inter" }, { x: 5, y: 2, stage: "ana" },
  // row 3
  { x: 0, y: 3, stage: "inter" }, { x: 1, y: 3, stage: "inter" }, { x: 2, y: 3, stage: "telo" },
  { x: 3, y: 3, stage: "inter" }, { x: 4, y: 3, stage: "inter" }, { x: 5, y: 3, stage: "inter" },
];

export default function MitosisLab() {
  const [answers, setAnswers] = useState({}); // cellKey → stageId
  const [submitted, setSubmitted] = useState(false);

  const cellKey = (c) => `${c.x}-${c.y}`;
  const correctCount = CELLS.filter((c) => answers[cellKey(c)] === c.stage).length;
  const stageCount = (sid) => CELLS.filter((c) => c.stage === sid).length;
  const mitoticIndex = ((24 - stageCount("inter")) / 24 * 100).toFixed(1);

  const submit = () => setSubmitted(true);
  const reset = () => { setAnswers({}); setSubmitted(false); };

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
              Biology · Mitosis · Onion root tip
            </div>
            <h1 className="text-3xl sm:text-4xl leading-[1.1] mb-3" style={{ fontWeight: 500 }}>
              Identifying <span style={{ fontStyle: "italic", color: "#c2185b" }}>mitosis stages</span>
            </h1>
            <p className="text-sm sm:text-base opacity-80 leading-snug mb-5">
              A field of view from a squashed onion root tip stained with aceto-orcein. Each cell is caught at a different stage of the cell cycle. Click each cell and choose the stage. Once all 24 are classified, calculate the mitotic index.
            </p>

            <div className="relative overflow-hidden mb-4"
              style={{ aspectRatio: "1/1", backgroundColor: "#0a0c12", border: "1px solid rgba(26,31,46,0.2)", maxHeight: 550 }}>
              <MitosisField cells={CELLS} answers={answers} setAnswers={setAnswers} submitted={submitted} cellKey={cellKey} />
            </div>

            <div className="grid grid-cols-5 gap-1 mb-3">
              {STAGES.map((s) => (
                <div key={s.id}
                  className="px-2 py-1.5 text-center"
                  style={{
                    backgroundColor: "rgba(232,228,216,0.5)",
                    border: "1px solid rgba(26,31,46,0.18)",
                  }}>
                  <div className="text-[10px] uppercase" style={{ fontFamily: mono, letterSpacing: "0.18em", color: STAGE_COLOURS[s.id] }}>
                    {s.short}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-5 mb-4"
              style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
              <div className="text-[10px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                Stage guide
              </div>
              <div className="space-y-2">
                {STAGES.map((s) => (
                  <div key={s.id}>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs uppercase" style={{ fontFamily: mono, letterSpacing: "0.18em", color: STAGE_COLOURS[s.id], fontWeight: 600 }}>
                        {s.label}
                      </span>
                    </div>
                    <div className="text-[11px] opacity-75 leading-snug">{s.blurb}</div>
                  </div>
                ))}
              </div>
            </div>

            {!submitted ? (
              <button onClick={submit}
                disabled={Object.keys(answers).length < CELLS.length}
                className="w-full py-3 text-[11px] uppercase active:scale-95 disabled:opacity-40"
                style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                Submit classifications ({Object.keys(answers).length} / {CELLS.length})
              </button>
            ) : (
              <div className="p-5"
                style={{ backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Award size={16} color="#ec407a" />
                  <div className="text-[10px] uppercase"
                    style={{ fontFamily: mono, letterSpacing: "0.22em", color: "#ec407a" }}>
                    Results
                  </div>
                </div>
                <div className="text-2xl mb-3" style={{ fontWeight: 500 }}>
                  {correctCount} / {CELLS.length} cells correctly classified
                </div>
                <div className="text-sm mb-3 leading-snug opacity-85">
                  Mitotic index = cells in mitosis ÷ total cells × 100<br />
                  &nbsp;&nbsp;= ({24 - stageCount("inter")} ÷ 24) × 100 = <span style={{ color: "#ec407a", fontWeight: 600 }}>{mitoticIndex} %</span>
                </div>
                <div className="text-xs opacity-75 leading-snug">
                  A high mitotic index is expected in root tip tissue — it is the zone of active growth, so a substantial fraction of cells are dividing at any moment.
                </div>
                <button onClick={reset}
                  className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase opacity-80 hover:opacity-100"
                  style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                  <RotateCcw size={12} /> Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

const STAGE_COLOURS = {
  inter: "#5970a8",
  pro:   "#9c4ebf",
  meta:  "#c2185b",
  ana:   "#ec407a",
  telo:  "#5fa83e",
};

function MitosisField({ cells, answers, setAnswers, submitted, cellKey }) {
  const GRID_W = 6, GRID_H = 4;
  const SIZE = 500;
  const cellW = SIZE / GRID_W;
  const cellH = SIZE / GRID_H;

  return (
    <svg viewBox="0 0 500 500" className="w-full h-full">
      <rect x="0" y="0" width="500" height="500" fill="#0a0c12" />
      {/* Stained slide background */}
      <rect x="0" y="0" width="500" height="500" fill="#f6dfd6" opacity="0.45" />
      {cells.map((c) => {
        const cx = c.x * cellW + cellW / 2;
        const cy = c.y * cellH + cellH / 2;
        const key = cellKey(c);
        const answer = answers[key];
        const isCorrect = submitted && answer === c.stage;
        const isWrong = submitted && answer && answer !== c.stage;
        return (
          <g key={key}>
            {/* cell wall (rectangular plant cell) */}
            <rect
              x={c.x * cellW + 4}
              y={c.y * cellH + 4}
              width={cellW - 8}
              height={cellH - 8}
              fill="#fde7d6"
              stroke="#a85a1a"
              strokeWidth="1.5"
              opacity="0.85"
            />
            {/* chromatin pattern per stage */}
            <ChromatinPattern stage={c.stage} cx={cx} cy={cy} cw={cellW} ch={cellH} />
            {/* indicator */}
            {answer && !submitted && (
              <rect x={c.x * cellW + 4} y={c.y * cellH + 4} width={cellW - 8} height={cellH - 8}
                fill={STAGE_COLOURS[answer]} opacity="0.18" />
            )}
            {submitted && (
              <rect x={c.x * cellW + 4} y={c.y * cellH + 4} width={cellW - 8} height={cellH - 8}
                fill={isCorrect ? "#7ad59d" : "#ec407a"} opacity="0.22" />
            )}
            {/* dropdown trigger */}
            <foreignObject x={c.x * cellW + cellW / 2 - 30} y={c.y * cellH + cellH - 22} width="60" height="18">
              <select
                value={answer || ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [key]: e.target.value }))}
                disabled={submitted}
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  padding: "1px 2px",
                  border: "1px solid rgba(0,0,0,0.3)",
                  background: "rgba(255,255,255,0.85)",
                  width: 60,
                }}
              >
                <option value="">stage…</option>
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>{s.short}</option>
                ))}
              </select>
            </foreignObject>
          </g>
        );
      })}
      <text x="250" y="490" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#e8e4d8" letterSpacing="2">×600 · ACETO-ORCEIN</text>
    </svg>
  );
}

function ChromatinPattern({ stage, cx, cy, cw, ch }) {
  if (stage === "inter") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={cw * 0.18} fill="#7d97c1" opacity="0.85" />
        {/* dotty chromatin */}
        {[...Array(8)].map((_, i) => (
          <circle key={i} cx={cx + Math.cos(i) * cw * 0.08} cy={cy + Math.sin(i * 1.3) * cw * 0.08} r="1.5" fill="#1a2548" opacity="0.7" />
        ))}
      </g>
    );
  }
  if (stage === "pro") {
    return (
      <g>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={cx - cw * 0.16 + i * cw * 0.08} y={cy - ch * 0.1} width="3" height={ch * 0.18} fill="#5a2c08" opacity="0.95" transform={`rotate(${i * 15} ${cx} ${cy})`} />
        ))}
        <circle cx={cx} cy={cy} r={cw * 0.20} fill="none" stroke="#5a2c08" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.5" />
      </g>
    );
  }
  if (stage === "meta") {
    return (
      <g>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={cx - cw * 0.12 + i * cw * 0.07} y={cy - 2} width="3" height="5" fill="#5a2c08" opacity="0.95" />
        ))}
        <line x1={cx - cw * 0.25} y1={cy} x2={cx + cw * 0.25} y2={cy} stroke="#1a1f2e" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.5" />
      </g>
    );
  }
  if (stage === "ana") {
    return (
      <g>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={cx - cw * 0.30 + i * 4} y={cy - 4 + i * 2} width="3" height="6" fill="#5a2c08" opacity="0.95" />
            <rect x={cx + cw * 0.20 + i * 4} y={cy - 4 + i * 2} width="3" height="6" fill="#5a2c08" opacity="0.95" />
          </g>
        ))}
      </g>
    );
  }
  if (stage === "telo") {
    return (
      <g>
        <circle cx={cx - cw * 0.18} cy={cy} r={cw * 0.12} fill="#7d97c1" opacity="0.85" />
        <circle cx={cx + cw * 0.18} cy={cy} r={cw * 0.12} fill="#7d97c1" opacity="0.85" />
        <line x1={cx} y1={cy - ch * 0.18} x2={cx} y2={cy + ch * 0.18} stroke="#5a2c08" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
      </g>
    );
  }
  return null;
}
