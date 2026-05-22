'use client';

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { createPastPaperQuestion } from "@/app/admin/papers/actions";

const mono = '"IBM Plex Mono", monospace';

const TYPE_OPTIONS = [
  { value: "mcq",        label: "Multiple choice" },
  { value: "true_false", label: "True / False" },
  { value: "numeric",    label: "Numeric answer" },
  { value: "fill_in",    label: "Fill in the blank" },
  { value: "free_text",  label: "Free-text (AI marked)" },
];

const PAPER_OPTIONS = ["1", "2", "3", "4", "5", "6"];

export default function NewPastPaperQuestionForm({ subjects, topics, initial = {} }) {
  const sp = useSearchParams();
  const justAdded = sp.get("added") === "1";

  const [subjectId, setSubjectId] = useState(initial.subjectId || "");
  const [topicId, setTopicId] = useState("");
  const [paperYear, setPaperYear] = useState(initial.paperYear || new Date().getFullYear() - 1);
  const [paperNo, setPaperNo] = useState(initial.paperNo || "");
  const [qNumber, setQNumber] = useState("");
  const [marks, setMarks] = useState(1);
  const [tier, setTier] = useState("free");
  const [type, setType] = useState("mcq");
  const [prompt, setPrompt] = useState("");
  const [memo, setMemo] = useState("");
  const [explanation, setExplanation] = useState("");
  const [rubric, setRubric] = useState("");

  // Type-specific state
  const [optionsRaw, setOptionsRaw] = useState("a|Option A\nb|Option B\nc|Option C\nd|Option D");
  const [correctId, setCorrectId] = useState("a");
  const [correctTf, setCorrectTf] = useState("true");
  const [correctNum, setCorrectNum] = useState("");
  const [tolerance, setTolerance] = useState("");
  const [unit, setUnit] = useState("");
  const [acceptedRaw, setAcceptedRaw] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);

  const filteredTopics = useMemo(() => {
    if (!subjectId) return [];
    return topics.filter((t) => t.subject_id === subjectId);
  }, [subjectId, topics]);

  return (
    <form action={createPastPaperQuestion} className="space-y-6 max-w-3xl">
      {justAdded && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm p-3 rounded">
          ✓ Question saved. Paper {paperNo} {paperYear} is pre-filled below — add the next one.
        </div>
      )}

      <Fieldset legend="Where this question came from">
        <Row>
          <Field label="Subject">
            <select
              name="subject_id"
              required
              value={subjectId}
              onChange={(e) => { setSubjectId(e.target.value); setTopicId(""); }}
              className="w-full px-3 py-2 border bg-white"
              style={{ borderColor: "rgba(26,31,46,0.3)" }}
            >
              <option value="">— pick subject —</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Topic (optional)">
            <select
              name="topic_id"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full px-3 py-2 border bg-white"
              style={{ borderColor: "rgba(26,31,46,0.3)" }}
              disabled={!subjectId}
            >
              <option value="">— spans topics or unsure —</option>
              {filteredTopics.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </Field>
        </Row>
        <Row>
          <Field label="Paper year">
            <input
              type="number"
              name="paper_year"
              required
              value={paperYear}
              onChange={(e) => setPaperYear(e.target.value)}
              className="w-full px-3 py-2 border bg-white"
              style={{ borderColor: "rgba(26,31,46,0.3)" }}
            />
          </Field>
          <Field label="Paper no.">
            <select
              name="paper_no"
              required
              value={paperNo}
              onChange={(e) => setPaperNo(e.target.value)}
              className="w-full px-3 py-2 border bg-white"
              style={{ borderColor: "rgba(26,31,46,0.3)" }}
            >
              <option value="">—</option>
              {PAPER_OPTIONS.map((n) => <option key={n} value={n}>Paper {n}</option>)}
            </select>
          </Field>
          <Field label="Question no.">
            <input
              type="text"
              name="q_number"
              required
              placeholder="e.g. 1, 1a, 2(b)(ii)"
              value={qNumber}
              onChange={(e) => setQNumber(e.target.value)}
              className="w-full px-3 py-2 border bg-white"
              style={{ borderColor: "rgba(26,31,46,0.3)" }}
            />
          </Field>
          <Field label="Marks">
            <input
              type="number"
              name="marks"
              min="1"
              required
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className="w-full px-3 py-2 border bg-white"
              style={{ borderColor: "rgba(26,31,46,0.3)" }}
            />
          </Field>
        </Row>
      </Fieldset>

      <Fieldset legend="Question content (rewritten, NOT verbatim NIED)">
        <Row>
          <Field label="Type">
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border bg-white"
              style={{ borderColor: "rgba(26,31,46,0.3)" }}
            >
              {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Tier">
            <select
              name="tier"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full px-3 py-2 border bg-white"
              style={{ borderColor: "rgba(26,31,46,0.3)" }}
            >
              <option value="free">Free (auto-marked)</option>
              <option value="paid">Paid (AI-marked — uses learner wallet)</option>
            </select>
          </Field>
        </Row>

        <Field label="Question prompt (rewritten)">
          <textarea
            name="prompt"
            required
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Reword the original NIED question to preserve intent but avoid copying it verbatim."
            className="w-full px-3 py-2 border bg-white font-mono text-sm"
            style={{ borderColor: "rgba(26,31,46,0.3)" }}
          />
        </Field>

        {/* Type-specific answer fields */}
        {type === "mcq" && (
          <>
            <Field label="Options (one per line: `id|text`)">
              <textarea
                name="options_raw"
                rows={5}
                value={optionsRaw}
                onChange={(e) => setOptionsRaw(e.target.value)}
                className="w-full px-3 py-2 border bg-white font-mono text-xs"
                style={{ borderColor: "rgba(26,31,46,0.3)" }}
              />
            </Field>
            <Field label="Correct option id">
              <input
                type="text"
                name="correct_id"
                required
                value={correctId}
                onChange={(e) => setCorrectId(e.target.value)}
                className="w-full px-3 py-2 border bg-white font-mono"
                style={{ borderColor: "rgba(26,31,46,0.3)" }}
              />
            </Field>
          </>
        )}

        {type === "true_false" && (
          <Field label="Correct answer">
            <select
              name="correct_tf"
              value={correctTf}
              onChange={(e) => setCorrectTf(e.target.value)}
              className="w-full px-3 py-2 border bg-white"
              style={{ borderColor: "rgba(26,31,46,0.3)" }}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </Field>
        )}

        {type === "numeric" && (
          <Row>
            <Field label="Correct value">
              <input
                type="number"
                step="any"
                name="correct_num"
                required
                value={correctNum}
                onChange={(e) => setCorrectNum(e.target.value)}
                className="w-full px-3 py-2 border bg-white font-mono"
                style={{ borderColor: "rgba(26,31,46,0.3)" }}
              />
            </Field>
            <Field label="Tolerance (±)">
              <input
                type="number"
                step="any"
                name="tolerance"
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
                className="w-full px-3 py-2 border bg-white font-mono"
                style={{ borderColor: "rgba(26,31,46,0.3)" }}
              />
            </Field>
            <Field label="Unit">
              <input
                type="text"
                name="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. cm³, mol/dm³"
                className="w-full px-3 py-2 border bg-white"
                style={{ borderColor: "rgba(26,31,46,0.3)" }}
              />
            </Field>
          </Row>
        )}

        {type === "fill_in" && (
          <>
            <Field label="Accepted answers (one per line)">
              <textarea
                name="accepted_raw"
                rows={3}
                value={acceptedRaw}
                onChange={(e) => setAcceptedRaw(e.target.value)}
                placeholder="water&#10;H2O"
                className="w-full px-3 py-2 border bg-white font-mono text-sm"
                style={{ borderColor: "rgba(26,31,46,0.3)" }}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="case_sensitive"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
              />
              Case sensitive
            </label>
          </>
        )}

        {type === "free_text" && (
          <Field label="Marking rubric (for the AI marker)">
            <textarea
              name="rubric"
              required
              rows={4}
              value={rubric}
              onChange={(e) => setRubric(e.target.value)}
              placeholder="e.g. 1 mark for naming the dependent variable, 1 mark for explaining why it must be controlled."
              className="w-full px-3 py-2 border bg-white text-sm"
              style={{ borderColor: "rgba(26,31,46,0.3)" }}
            />
          </Field>
        )}
      </Fieldset>

      <Fieldset legend="Mark scheme & explanation">
        <Field label="Memo (NIED mark scheme — verbatim is OK here, it's internal)">
          <textarea
            name="memo"
            rows={4}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="e.g. (3 marks): blue-black colour [1], indicates starch [1], reducing sugar absent [1]."
            className="w-full px-3 py-2 border bg-white text-sm"
            style={{ borderColor: "rgba(26,31,46,0.3)" }}
          />
        </Field>

        <Field label="Explanation (shown to the learner after answering)">
          <textarea
            name="explanation"
            rows={3}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Walks the learner through how to arrive at the answer."
            className="w-full px-3 py-2 border bg-white text-sm"
            style={{ borderColor: "rgba(26,31,46,0.3)" }}
          />
        </Field>
      </Fieldset>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_published" defaultChecked />
        Publish (visible to learners in topic tests / final exams)
      </label>

      <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
        <button
          type="submit"
          className="px-5 py-2.5 text-xs uppercase"
          style={{
            fontFamily: mono, letterSpacing: "0.18em",
            backgroundColor: "#1a1f2e", color: "#e8e4d8",
          }}
        >
          Save question
        </button>
        <a href="/admin/papers" className="text-xs underline opacity-70">Back to papers</a>
      </div>
    </form>
  );
}

function Fieldset({ legend, children }) {
  return (
    <fieldset className="border p-4" style={{ borderColor: "rgba(26,31,46,0.18)" }}>
      <legend className="px-2 text-[11px] uppercase opacity-70"
        style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
        {legend}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

function Row({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase opacity-70 mb-1.5"
        style={{ fontFamily: mono, letterSpacing: "0.22em" }}>
        {label}
      </div>
      {children}
    </label>
  );
}
