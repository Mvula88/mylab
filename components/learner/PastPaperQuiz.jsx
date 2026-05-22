'use client';

import { useMemo, useState } from "react";

const mono = '"IBM Plex Mono", monospace';

// Minimal markdown → safe HTML for question prompts / memos.
// Handles **bold**, *italic*, and newlines. Everything else is escaped.
function renderMd(text) {
  if (!text) return "";
  const esc = String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/\n/g, "<br/>");
}

function Md({ text, className }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: renderMd(text) }} />;
}

export default function PastPaperQuiz({ questions, totalMarks }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (qid, value) => setAnswers((prev) => ({ ...prev, [qid]: value }));

  const score = useMemo(() => {
    if (!submitted) return null;
    let auto = 0;
    let autoMax = 0;
    let pendingMarks = 0;
    questions.forEach((q) => {
      if (q.type === "free_text") {
        pendingMarks += q.marks || 0;
        return;
      }
      autoMax += q.marks || 0;
      if (isAutoCorrect(q, answers[q.id])) auto += q.marks || 0;
    });
    return { auto, autoMax, pendingMarks };
  }, [submitted, answers, questions]);

  return (
    <div className="space-y-5">
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          q={q}
          answer={answers[q.id]}
          onAnswer={(v) => setAnswer(q.id, v)}
          submitted={submitted}
        />
      ))}

      {!submitted ? (
        <div className="text-center pt-6">
          <button
            type="button"
            onClick={() => {
              setSubmitted(true);
              if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-7 py-3 text-xs uppercase"
            style={{
              fontFamily: mono,
              letterSpacing: "0.22em",
              backgroundColor: "#1a1f2e",
              color: "#e8e4d8",
            }}
          >
            Submit answers
          </button>
        </div>
      ) : (
        <div className="bg-white border p-6 mt-8" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
          <div className="text-[10px] uppercase opacity-70 mb-2"
            style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
            Result
          </div>
          <div className="text-2xl mb-3" style={{ fontWeight: 500 }}>
            {score.auto} / {score.autoMax} auto-marked
          </div>
          {score.pendingMarks > 0 && (
            <p className="text-sm opacity-75">
              {score.pendingMarks} marks left for AI marking (extended-response questions). Top up your wallet
              to have these marked.
            </p>
          )}
          <p className="text-xs opacity-55 mt-3" style={{ fontFamily: mono }}>
            Scroll up to see your answers next to the mark scheme.
          </p>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ q, answer, onAnswer, submitted }) {
  const isAuto = q.type !== "free_text";
  const correct = submitted && isAuto && isAutoCorrect(q, answer);
  const wrong = submitted && isAuto && !isAutoCorrect(q, answer);

  return (
    <article
      className="bg-white border p-6 sm:p-8"
      style={{ borderColor: correct ? "#2e7d32" : wrong ? "#c0392b" : "rgba(26,31,46,0.15)" }}
    >
      <header className="flex items-baseline justify-between gap-4 mb-3">
        <div className="text-[10px] uppercase opacity-70" style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
          Question {q.q_number}
        </div>
        <div className="flex items-center gap-3 text-[10px] uppercase opacity-70"
          style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
          {q.tier === "paid" && <span style={{ color: "#b88200" }}>AI · paid</span>}
          <span className="px-2 py-0.5 border" style={{ borderColor: "rgba(26,31,46,0.25)" }}>
            [{q.marks}]
          </span>
        </div>
      </header>

      <Md text={q.prompt} className="block text-[15px] leading-relaxed" />

      {q.diagram_url && (
        <div className="my-5 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={q.diagram_url}
            alt={`Figure for question ${q.q_number}`}
            className="max-w-full"
            style={{ maxHeight: 360 }}
          />
        </div>
      )}

      <div className="mt-4">
        <AnswerInput q={q} answer={answer} onAnswer={onAnswer} disabled={submitted} />
      </div>

      {submitted && (
        <div className="mt-5 pt-5 border-t" style={{ borderColor: "rgba(26,31,46,0.12)" }}>
          {isAuto && (
            <div className="text-xs mb-2" style={{ fontFamily: mono, letterSpacing: "0.1em" }}>
              {correct ? (
                <span style={{ color: "#2e7d32" }}>✓ CORRECT — {q.marks} mark{q.marks === 1 ? "" : "s"}</span>
              ) : (
                <span style={{ color: "#c0392b" }}>✗ NOT MATCHED</span>
              )}
            </div>
          )}
          {q.memo && (
            <div className="text-[13px] mb-3 bg-amber-50 border-l-2 p-3"
              style={{ borderColor: "#b88200" }}>
              <div className="text-[10px] uppercase opacity-70 mb-1"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                Mark scheme
              </div>
              <Md text={q.memo} className="block" />
            </div>
          )}
          {q.explanation && (
            <div className="text-[13px] opacity-85 leading-relaxed">
              <div className="text-[10px] uppercase opacity-70 mb-1"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                Explanation
              </div>
              <Md text={q.explanation} />
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function AnswerInput({ q, answer, onAnswer, disabled }) {
  if (q.type === "mcq") {
    const options = Array.isArray(q.options) ? q.options : [];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const checked = answer === opt.id;
          return (
            <label
              key={opt.id}
              className={`flex items-center gap-3 p-3 border cursor-pointer transition ${
                checked ? "bg-stone-900/5" : "hover:bg-stone-900/[0.03]"
              }`}
              style={{ borderColor: checked ? "#1a1f2e" : "rgba(26,31,46,0.2)" }}
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                value={opt.id}
                checked={checked}
                onChange={() => onAnswer(opt.id)}
                disabled={disabled}
              />
              <span className="font-semibold mr-2 uppercase">{opt.id}</span>
              <span className="text-[14px]">{opt.text}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (q.type === "true_false") {
    return (
      <div className="flex gap-3">
        {["true", "false"].map((v) => (
          <label key={v}
            className="flex-1 flex items-center gap-2 p-3 border cursor-pointer"
            style={{ borderColor: answer === v ? "#1a1f2e" : "rgba(26,31,46,0.2)" }}
          >
            <input
              type="radio"
              name={`q-${q.id}`}
              value={v}
              checked={answer === v}
              onChange={() => onAnswer(v)}
              disabled={disabled}
            />
            <span className="capitalize">{v}</span>
          </label>
        ))}
      </div>
    );
  }

  if (q.type === "numeric") {
    return (
      <input
        type="number"
        step="any"
        value={answer || ""}
        onChange={(e) => onAnswer(e.target.value)}
        disabled={disabled}
        className="w-full p-3 border bg-white font-mono"
        style={{ borderColor: "rgba(26,31,46,0.25)" }}
        placeholder="Type your numeric answer…"
      />
    );
  }

  if (q.type === "fill_in") {
    return (
      <input
        type="text"
        value={answer || ""}
        onChange={(e) => onAnswer(e.target.value)}
        disabled={disabled}
        className="w-full p-3 border bg-white"
        style={{ borderColor: "rgba(26,31,46,0.25)" }}
        placeholder="Type your answer…"
      />
    );
  }

  // free_text — textarea sized by marks
  const rows = Math.min(8, Math.max(3, (q.marks || 1) + 1));
  return (
    <textarea
      value={answer || ""}
      onChange={(e) => onAnswer(e.target.value)}
      disabled={disabled}
      rows={rows}
      className="w-full p-3 border bg-white text-[14px] leading-relaxed"
      style={{ borderColor: "rgba(26,31,46,0.25)" }}
      placeholder="Write your answer here…"
    />
  );
}

// ── Auto-marking helpers ────────────────────────────────────────────────────
// Only used for non-free_text questions. Free-text is AI-marked separately.

function isAutoCorrect(q, answer) {
  if (answer == null || answer === "") return false;

  if (q.type === "mcq") {
    return q.correct === answer || (q.correct && q.correct.id === answer);
  }

  if (q.type === "true_false") {
    const want = String(q.correct).toLowerCase();
    return want === String(answer).toLowerCase();
  }

  if (q.type === "numeric") {
    const got = parseFloat(answer);
    const want = parseFloat(q.correct);
    if (Number.isNaN(got) || Number.isNaN(want)) return false;
    const tol = q.tolerance != null ? parseFloat(q.tolerance) : 0;
    return Math.abs(got - want) <= tol;
  }

  if (q.type === "fill_in") {
    const cmp = (s) => (q.case_sensitive ? String(s) : String(s).toLowerCase()).trim();
    const userAns = cmp(answer);
    if (!q.correct) return false;
    if (Array.isArray(q.correct.accepted)) {
      if (q.correct.accepted.some((a) => cmp(a) === userAns)) return true;
    }
    if (Array.isArray(q.correct.must_contain)) {
      return q.correct.must_contain.every((needle) => userAns.includes(cmp(needle)));
    }
    return false;
  }

  return false;
}
