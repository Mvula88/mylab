'use client';

import { Fragment, useMemo, useState } from "react";

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

// "1(a)"        → { main: 1 }
// "4(a)(ii)"    → { main: 4 }
// "7(a)"        → { main: 7 }
function parseMainNumber(qNumber) {
  const m = String(qNumber || "").match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

// Split a prompt into (stem, body) at the first sub-part marker like "**(a)**".
// Multiple sub-parts of the same main question repeat the same stem in their
// prompts — we strip it out so the card shows the stem ONCE.
function splitStemAndBody(prompt) {
  if (!prompt) return { stem: "", body: "" };
  const idx = prompt.indexOf("**(");
  if (idx === -1) return { stem: "", body: prompt.trim() };
  return {
    stem: prompt.slice(0, idx).trim(),
    body: prompt.slice(idx).trim(),
  };
}

// Group a flat list of rows into [{ main, items: [...] }, ...] in main order.
function groupQuestions(questions) {
  const groups = new Map();
  questions.forEach((q) => {
    const main = parseMainNumber(q.q_number);
    if (!groups.has(main)) groups.set(main, { main, items: [] });
    const { stem, body } = splitStemAndBody(q.prompt);
    groups.get(main).items.push({ ...q, stem, body });
  });
  return Array.from(groups.values()).sort((a, b) => a.main - b.main);
}

export default function PastPaperQuiz({ questions, totalMarks }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (qid, value) => setAnswers((prev) => ({ ...prev, [qid]: value }));

  const groups = useMemo(() => groupQuestions(questions), [questions]);

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
      {groups.map((group) => (
        <QuestionGroupCard
          key={group.main}
          group={group}
          answers={answers}
          setAnswer={setAnswer}
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

// Render one card for a whole numbered question (Q1, Q2, …).
// Sub-parts share the same card. Stem text and diagram URLs are de-duplicated
// across sub-parts so they appear at most once each within the card (and a
// second time only if a *different* stem/diagram is introduced lower down).
function QuestionGroupCard({ group, answers, setAnswer, submitted }) {
  const totalGroupMarks = group.items.reduce((s, it) => s + (it.marks || 0), 0);

  let lastStem = null;
  let lastDiagram = null;
  const plan = group.items.map((item) => {
    const showStem = item.stem && item.stem !== lastStem;
    const showDiagram = item.diagram_url && item.diagram_url !== lastDiagram;
    if (item.stem) lastStem = item.stem;
    if (item.diagram_url) lastDiagram = item.diagram_url;
    return { item, showStem, showDiagram };
  });

  return (
    <article
      className="bg-white border p-6 sm:p-8"
      style={{ borderColor: "rgba(26,31,46,0.15)" }}
    >
      <header className="flex items-baseline justify-between gap-4 mb-3 pb-3 border-b"
        style={{ borderColor: "rgba(26,31,46,0.1)" }}>
        <div className="text-[10px] uppercase opacity-70" style={{ fontFamily: mono, letterSpacing: "0.28em" }}>
          Question {group.main}
        </div>
        <div className="text-[10px] uppercase opacity-70"
          style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
          [{totalGroupMarks}]
        </div>
      </header>

      <div className="space-y-4">
        {plan.map(({ item, showStem, showDiagram }, idx) => (
          <Fragment key={item.id}>
            {showStem && (
              <div className="text-[15px] leading-relaxed">
                <Md text={item.stem} />
              </div>
            )}
            {showDiagram && (
              <div className="my-4 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.diagram_url}
                  alt={`Figure for question ${group.main}`}
                  className="max-w-full"
                  style={{ maxHeight: 360 }}
                />
              </div>
            )}
            <SubPart
              item={item}
              answer={answers[item.id]}
              onAnswer={(v) => setAnswer(item.id, v)}
              submitted={submitted}
              isLast={idx === plan.length - 1}
            />
          </Fragment>
        ))}
      </div>
    </article>
  );
}

function SubPart({ item, answer, onAnswer, submitted, isLast }) {
  const isAuto = item.type !== "free_text";
  const correct = submitted && isAuto && isAutoCorrect(item, answer);
  const wrong = submitted && isAuto && !isAutoCorrect(item, answer);

  return (
    <div className={isLast ? "" : "pb-4 border-b"} style={{ borderColor: "rgba(26,31,46,0.06)" }}>
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <div className="flex-1 min-w-0 text-[15px] leading-relaxed break-words">
          <Md text={item.body} className="block" />
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase opacity-70 shrink-0"
          style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
          {item.tier === "paid" && <span style={{ color: "#b88200" }}>AI</span>}
          <span className="px-2 py-0.5 border" style={{ borderColor: "rgba(26,31,46,0.25)" }}>
            [{item.marks}]
          </span>
        </div>
      </div>

      <div className="mt-2">
        <AnswerInput q={item} answer={answer} onAnswer={onAnswer} disabled={submitted} />
      </div>

      {submitted && (
        <div className="mt-4">
          {isAuto && (
            <div className="text-xs mb-2" style={{ fontFamily: mono, letterSpacing: "0.1em" }}>
              {correct ? (
                <span style={{ color: "#2e7d32" }}>✓ CORRECT — {item.marks} mark{item.marks === 1 ? "" : "s"}</span>
              ) : (
                <span style={{ color: "#c0392b" }}>✗ NOT MATCHED</span>
              )}
            </div>
          )}
          {item.type === "calculation" && answer && typeof answer === "object" && answer.working && (
            <div className="text-[13px] mb-2 bg-stone-50 border-l-2 p-3"
              style={{ borderColor: "rgba(26,31,46,0.25)" }}>
              <div className="text-[10px] uppercase opacity-70 mb-1"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                Your working
              </div>
              <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed">{answer.working}</pre>
            </div>
          )}
          {item.memo && (
            <div className="text-[13px] mb-2 bg-amber-50 border-l-2 p-3"
              style={{ borderColor: "#b88200" }}>
              <div className="text-[10px] uppercase opacity-70 mb-1"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                Mark scheme
              </div>
              <Md text={item.memo} className="block" />
            </div>
          )}
          {item.explanation && (
            <div className="text-[13px] opacity-85 leading-relaxed">
              <div className="text-[10px] uppercase opacity-70 mb-1"
                style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
                Explanation
              </div>
              <Md text={item.explanation} />
            </div>
          )}
        </div>
      )}
    </div>
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
      <textarea
        value={answer || ""}
        onChange={(e) => onAnswer(e.target.value)}
        disabled={disabled}
        rows={2}
        className="w-full p-3 border bg-white leading-relaxed resize-y"
        style={{ borderColor: "rgba(26,31,46,0.25)", minHeight: "3rem" }}
        placeholder="Type your answer…"
      />
    );
  }

  if (q.type === "calculation") {
    // answer is an object: { working: string, value: string, unit: string }
    const a = (answer && typeof answer === "object") ? answer : { working: "", value: "", unit: "" };
    const update = (patch) => onAnswer({ ...a, ...patch });
    const expectedUnit = (q.correct && q.correct.unit) || "";
    return (
      <div className="space-y-3">
        <div>
          <div className="text-[10px] uppercase opacity-70 mb-1"
            style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
            Working — show formula, substitution, calculation
          </div>
          <textarea
            value={a.working || ""}
            onChange={(e) => update({ working: e.target.value })}
            disabled={disabled}
            rows={4}
            className="w-full p-3 border bg-white font-mono text-[13px] leading-relaxed"
            style={{ borderColor: "rgba(26,31,46,0.25)" }}
            placeholder={"e.g.\nformula: F = ma\nF = 2 × 10 = …"}
          />
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[8rem]">
            <div className="text-[10px] uppercase opacity-70 mb-1"
              style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
              Final answer
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={a.value || ""}
              onChange={(e) => update({ value: e.target.value })}
              disabled={disabled}
              className="w-full p-3 border bg-white font-mono"
              style={{ borderColor: "rgba(26,31,46,0.25)" }}
              placeholder="number"
            />
          </div>
          <div className="w-28">
            <div className="text-[10px] uppercase opacity-70 mb-1"
              style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
              Unit{expectedUnit ? "" : " (if any)"}
            </div>
            <input
              type="text"
              value={a.unit || ""}
              onChange={(e) => update({ unit: e.target.value })}
              disabled={disabled}
              className="w-full p-3 border bg-white font-mono"
              style={{ borderColor: "rgba(26,31,46,0.25)" }}
              placeholder={expectedUnit || "e.g. m/s"}
            />
          </div>
        </div>
      </div>
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

  if (q.type === "calculation") {
    if (!q.correct || !answer || typeof answer !== "object") return false;
    const got = parseFloat(answer.value);
    const want = parseFloat(q.correct.value);
    if (Number.isNaN(got) || Number.isNaN(want)) return false;
    // Tolerance: absolute number, or a fraction (≤1 = fractional, >1 = absolute).
    const tolRaw = q.correct.tolerance;
    let tol = 0;
    if (tolRaw != null) {
      const t = parseFloat(tolRaw);
      tol = t <= 1 ? Math.abs(want) * t : t;
    }
    const numericOk = Math.abs(got - want) <= (tol || Math.abs(want) * 0.02);
    if (!numericOk) return false;
    // Unit check (case-insensitive, ignores spaces). If accept_units not provided,
    // only the numeric value is required.
    const accept = Array.isArray(q.correct.accept_units) ? q.correct.accept_units : null;
    if (!accept || accept.length === 0) return true;
    const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, "");
    const userUnit = norm(answer.unit);
    if (!userUnit) return false;
    return accept.some((u) => norm(u) === userUnit);
  }

  return false;
}
