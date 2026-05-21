'use client';

import { useState, useTransition } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { saveQuestion } from '@/app/admin/lessons/[id]/quiz/actions';

const mono = '"IBM Plex Mono", monospace';
const serif = '"Fraunces", Georgia, serif';

const TYPES = [
  { value: 'mcq',         label: 'Multiple choice' },
  { value: 'true_false',  label: 'True / False' },
  { value: 'numeric',     label: 'Numeric answer' },
  { value: 'fill_in',     label: 'Fill-in / short answer' },
  { value: 'free_text',   label: 'Free text (AI marked — Stage 4)' },
];

export default function QuestionEditor({ lessonId, activityId, question, onDone }) {
  const isNew = !question;
  const initial = question || { type: 'mcq', options: [{ id: 'a', text: '' }, { id: 'b', text: '' }], correct: 'a' };

  const [type, setType] = useState(initial.type);
  const [prompt, setPrompt] = useState(initial.prompt || '');
  const [points, setPoints] = useState(initial.points || 1);
  const [explanation, setExplanation] = useState(initial.explanation || '');

  // MCQ state
  const [options, setOptions] = useState(initial.options || [{ id: 'a', text: '' }, { id: 'b', text: '' }]);
  const [correctOption, setCorrectOption] = useState(initial.type === 'mcq' ? initial.correct : 'a');

  // True/False
  const [correctTf, setCorrectTf] = useState(initial.type === 'true_false' ? !!initial.correct : true);

  // Numeric
  const [correctNumeric, setCorrectNumeric] = useState(initial.type === 'numeric' ? initial.correct ?? '' : '');
  const [tolerance, setTolerance] = useState(initial.tolerance ?? 0);
  const [unit, setUnit] = useState(initial.unit || '');

  // Fill-in
  const [fillIn, setFillIn] = useState(
    initial.type === 'fill_in' && Array.isArray(initial.correct) ? initial.correct.join('\n') : ''
  );
  const [caseSensitive, setCaseSensitive] = useState(!!initial.case_sensitive);

  // Free text rubric
  const [rubric, setRubric] = useState(initial.rubric || '');

  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  function addOption() {
    if (options.length >= 8) return;
    const nextId = String.fromCharCode(97 + options.length);
    setOptions([...options, { id: nextId, text: '' }]);
  }
  function removeOption(i) {
    const next = options.filter((_, idx) => idx !== i)
      .map((o, idx) => ({ id: String.fromCharCode(97 + idx), text: o.text }));
    setOptions(next);
    if (!next.find((o) => o.id === correctOption)) setCorrectOption(next[0]?.id || 'a');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.target);
    if (question?.id) fd.set('id', question.id);
    fd.set('activity_id', activityId);
    fd.set('lesson_id', lessonId);
    fd.set('type', type);

    startTransition(async () => {
      const res = await saveQuestion(fd);
      if (res?.error) { setError(res.error); return; }
      onDone?.();
    });
  }

  return (
    <form onSubmit={handleSubmit}
      className="p-4 space-y-4"
      style={{ border: '1px solid rgba(26,31,46,0.35)', backgroundColor: 'rgba(26,31,46,0.04)' }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-[10px] uppercase opacity-65"
          style={{ fontFamily: mono, letterSpacing: '0.22em' }}>
          {isNew ? 'New question' : 'Edit question'}
        </div>
        <button type="button" onClick={() => onDone?.()}
          className="text-[10px] uppercase opacity-60 hover:opacity-100"
          style={{ fontFamily: mono, letterSpacing: '0.22em' }}>
          <X size={12} className="inline mr-1" /> Cancel
        </button>
      </div>

      <Field label="Question type">
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="w-full px-2.5 py-2 text-sm bg-transparent outline-none"
          style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }}>
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </Field>

      <Field label="Question prompt">
        <textarea name="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} required
          className="w-full px-3 py-2.5 text-sm bg-transparent outline-none"
          style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
      </Field>

      {/* TYPE-SPECIFIC FIELDS */}
      {type === 'mcq' && (
        <Field label="Options" hint="Pick the radio button next to the correct answer.">
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input type="radio" name="correct_option" value={opt.id}
                  checked={correctOption === opt.id}
                  onChange={() => setCorrectOption(opt.id)} className="w-4 h-4" />
                <span className="text-[10px] opacity-60 w-4" style={{ fontFamily: mono }}>{opt.id})</span>
                <input
                  name={`option_${i}_text`}
                  value={opt.text}
                  onChange={(e) => {
                    const next = [...options];
                    next[i] = { ...next[i], text: e.target.value };
                    setOptions(next);
                  }}
                  className="flex-1 px-2 py-1.5 text-sm bg-white/50 outline-none"
                  style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.2)' }}
                />
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(i)}
                    className="p-1 hover:bg-red-100">
                    <Trash2 size={12} style={{ color: '#c2185b' }} />
                  </button>
                )}
              </div>
            ))}
            {options.length < 8 && (
              <button type="button" onClick={addOption}
                className="inline-flex items-center gap-1 text-[10px] uppercase py-1.5 px-2.5 opacity-70 hover:opacity-100"
                style={{ fontFamily: mono, letterSpacing: '0.22em', border: '1px dashed rgba(26,31,46,0.35)' }}>
                <Plus size={11} /> Add option
              </button>
            )}
          </div>
        </Field>
      )}

      {type === 'true_false' && (
        <Field label="Correct answer">
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="correct_tf" value="true"
                checked={correctTf} onChange={() => setCorrectTf(true)} className="w-4 h-4" />
              True
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="correct_tf" value="false"
                checked={!correctTf} onChange={() => setCorrectTf(false)} className="w-4 h-4" />
              False
            </label>
          </div>
        </Field>
      )}

      {type === 'numeric' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Correct value">
            <input name="correct_numeric" type="number" step="any" required
              value={correctNumeric} onChange={(e) => setCorrectNumeric(e.target.value)}
              className="w-full px-2.5 py-2 text-sm bg-transparent outline-none"
              style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
          </Field>
          <Field label="Tolerance (±)" hint="Allow ±this many around the correct value.">
            <input name="tolerance" type="number" step="any" min="0"
              value={tolerance} onChange={(e) => setTolerance(e.target.value)}
              className="w-full px-2.5 py-2 text-sm bg-transparent outline-none"
              style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
          </Field>
          <Field label="Unit (optional)">
            <input name="unit" value={unit} onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. cm, °C, mol/dm³"
              className="w-full px-2.5 py-2 text-sm bg-transparent outline-none"
              style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
          </Field>
        </div>
      )}

      {type === 'fill_in' && (
        <Field label="Accepted answers (one per line)"
          hint="Any of these will mark correct. Spaces around answers are trimmed.">
          <textarea name="correct_fill_in" rows={4}
            value={fillIn} onChange={(e) => setFillIn(e.target.value)} required
            className="w-full px-3 py-2.5 text-sm bg-transparent outline-none"
            style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
          <label className="flex items-center gap-2 mt-2 text-xs">
            <input type="checkbox" name="case_sensitive"
              checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
            Case-sensitive (matches must use exact capitalisation)
          </label>
        </Field>
      )}

      {type === 'free_text' && (
        <Field label="Marking rubric (for AI)"
          hint="What does a good answer mention? Used by Haiku in Stage 4 to mark.">
          <textarea name="rubric" rows={4}
            value={rubric} onChange={(e) => setRubric(e.target.value)}
            placeholder="e.g. Must mention chlorophyll, sunlight, water, CO₂. Award marks for explaining the role of each."
            className="w-full px-3 py-2.5 text-sm bg-transparent outline-none"
            style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
        </Field>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Points">
          <input name="points" type="number" min="1" value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-full px-2.5 py-2 text-sm bg-transparent outline-none"
            style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
        </Field>
        <Field label="Order">
          <input name="sort_order" type="number" defaultValue={question?.sort_order ?? 100}
            className="w-full px-2.5 py-2 text-sm bg-transparent outline-none"
            style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
        </Field>
      </div>

      <Field label="Explanation (shown after marking, optional)">
        <textarea name="explanation" rows={2}
          value={explanation} onChange={(e) => setExplanation(e.target.value)}
          placeholder="Why is this the answer? Shown to the learner when results display."
          className="w-full px-3 py-2.5 text-sm bg-transparent outline-none"
          style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
      </Field>

      {error && (
        <div className="text-[11px] px-3 py-2 border"
          style={{ borderColor: 'rgba(194,24,91,0.4)', backgroundColor: 'rgba(194,24,91,0.06)', color: '#c2185b', fontFamily: mono }}>
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={pending}
          className="inline-flex items-center gap-2 py-2.5 px-5 text-[11px] uppercase active:scale-95 disabled:opacity-50"
          style={{ fontFamily: mono, letterSpacing: '0.25em', backgroundColor: '#1a1f2e', color: '#e8e4d8' }}>
          <Save size={13} /> {pending ? 'Saving…' : 'Save question'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase mb-1.5 opacity-65"
        style={{ fontFamily: mono, letterSpacing: '0.22em' }}>{label}</span>
      {children}
      {hint && <span className="block text-[10px] mt-1 opacity-60 leading-snug">{hint}</span>}
    </label>
  );
}
