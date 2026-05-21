"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, Award } from "lucide-react";

export const serif = '"Fraunces", Georgia, serif';
export const mono = '"IBM Plex Mono", monospace';

export function Shell({ children, back, backLabel, topic }) {
  return (
    <main className="min-h-screen w-full relative" style={{ backgroundColor: "#e8e4d8", color: "#1a1f2e", fontFamily: serif }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(#1a1f2e 1px, transparent 1px), linear-gradient(90deg, #1a1f2e 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />
      <div className="max-w-6xl mx-auto px-5 pt-8 pb-16 relative">
        <Link href={back}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase opacity-70 hover:opacity-100 mb-3"
          style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
          <ArrowLeft size={13} /> {backLabel}
        </Link>
        {topic && (
          <div className="text-[11px] uppercase text-stone-500 mb-3"
            style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
            {topic}
          </div>
        )}
        {children}
      </div>
    </main>
  );
}

export function Header({ title, accent, blurb }) {
  return (
    <>
      <h1 className="text-3xl sm:text-4xl leading-[1.1] mb-3" style={{ fontWeight: 500 }}>
        {title} <span style={{ fontStyle: "italic", color: "#c2185b" }}>{accent}</span>
      </h1>
      <p className="text-sm sm:text-base opacity-80 leading-snug mb-5">{blurb}</p>
    </>
  );
}

export function Stat({ label, value, highlight }) {
  return (
    <div>
      <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>{label}</div>
      <div className="text-lg" style={{ fontFamily: mono, fontWeight: 500, color: highlight ? "#c2185b" : undefined }}>{value}</div>
    </div>
  );
}

export function Card({ children, label, className = "" }) {
  return (
    <div className={`p-5 ${className}`}
      style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
      {label && (
        <div className="text-[10px] uppercase text-stone-500 mb-3"
          style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled, icon: Icon }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="py-2.5 px-4 text-[11px] uppercase active:scale-95 inline-flex items-center gap-2 disabled:opacity-40"
      style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
      {Icon && <Icon size={12} />} {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, disabled, icon: Icon }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="py-2.5 px-3 text-[10px] uppercase active:scale-95 inline-flex items-center gap-1.5 disabled:opacity-30"
      style={{ fontFamily: mono, letterSpacing: "0.22em", border: "1px solid rgba(26,31,46,0.3)" }}>
      {Icon && <Icon size={12} />} {children}
    </button>
  );
}

export function QuizPanel({ quiz, label = "Exam-style questions", answers, setAnswers, submitted, setSubmitted, score }) {
  return (
    <Card label={label}>
      {quiz.map((q, i) => (
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
          disabled={Object.keys(answers).length < quiz.length}
          className="w-full py-2.5 text-[11px] uppercase active:scale-95 disabled:opacity-40"
          style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
          Submit answers
        </button>
      ) : (
        <div className="p-4 mt-2 text-center" style={{ backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
          <Award size={16} color="#ec407a" className="mx-auto mb-2" />
          <div className="text-xl" style={{ fontWeight: 500 }}>{score} / {quiz.length} correct</div>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase opacity-80 hover:opacity-100"
            style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
            <RotateCcw size={12} /> Try again
          </button>
        </div>
      )}
    </Card>
  );
}

export function StatGrid({ children, cols = 2 }) {
  const c = cols === 2 ? "grid-cols-2" : cols === 3 ? "grid-cols-3" : "grid-cols-4";
  return (
    <div className={`grid ${c} gap-3 p-4`}
      style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
      {children}
    </div>
  );
}

export function ResultsTable({ label, columns, rows }) {
  return (
    <Card label={label}>
      <table className="w-full text-xs" style={{ fontFamily: mono }}>
        <thead>
          <tr className="border-b border-stone-900/15">
            {columns.map((c, i) => (
              <th key={i} className={`py-1.5 opacity-65 ${i === 0 ? "text-left" : "text-right"}`}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-stone-900/8">
              {row.map((cell, j) => (
                <td key={j} className={`py-1.5 ${j === 0 ? "" : "text-right"}`}>{cell ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
