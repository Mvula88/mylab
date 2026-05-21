'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { submitQuiz } from '@/app/learn/[subject]/[topic]/[lesson]/quiz/actions';

const mono = '"IBM Plex Mono", monospace';
const serif = '"Fraunces", Georgia, serif';

export default function QuizTaker({ activity, questions, slugs }) {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  function setAnswer(qid, value) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const unanswered = questions.filter((q) => answers[q.id] === undefined || answers[q.id] === '');
    if (unanswered.length) {
      if (!confirm(`${unanswered.length} question${unanswered.length === 1 ? ' is' : 's are'} unanswered. Submit anyway?`)) return;
    }
    startTransition(async () => {
      const res = await submitQuiz({
        activityId: activity.id,
        responses: answers,
        subjectSlug: slugs.subject,
        topicSlug: slugs.topic,
        lessonSlug: slugs.lesson,
      });
      if (res?.error) { setError(res.error); return; }
      router.push(`/learn/${slugs.subject}/${slugs.topic}/${slugs.lesson}/quiz/result/${res.attemptId}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {questions.map((q, i) => (
        <div key={q.id} className="pb-6 border-b border-stone-900/10">
          <div className="text-[10px] uppercase opacity-55 mb-2"
            style={{ fontFamily: mono, letterSpacing: '0.22em', color: '#ec407a' }}>
            Q{i + 1} · {q.points} pt{q.points === 1 ? '' : 's'}
          </div>
          <div className="text-lg mb-4 leading-snug" style={{ fontFamily: serif, fontWeight: 500 }}>
            {q.prompt}
          </div>
          <QuestionInput question={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
        </div>
      ))}

      {error && (
        <div className="text-xs px-3 py-2 border"
          style={{ borderColor: 'rgba(194,24,91,0.4)', backgroundColor: 'rgba(194,24,91,0.06)', color: '#c2185b', fontFamily: mono }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={pending}
        className="inline-flex items-center gap-2 py-3 px-6 text-[12px] uppercase active:scale-95 disabled:opacity-50"
        style={{ fontFamily: mono, letterSpacing: '0.25em',
          backgroundColor: '#1a1f2e', color: '#e8e4d8', fontWeight: 500 }}>
        <CheckCircle2 size={14} /> {pending ? 'Marking…' : 'Submit answers'}
      </button>
    </form>
  );
}

function QuestionInput({ question, value, onChange }) {
  if (question.type === 'mcq') {
    return (
      <div className="space-y-2">
        {(question.options || []).map((opt) => (
          <label key={opt.id}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-stone-900/5 transition"
            style={{
              border: '1px solid ' + (value === opt.id ? '#1a1f2e' : 'rgba(26,31,46,0.18)'),
              backgroundColor: value === opt.id ? 'rgba(26,31,46,0.05)' : 'transparent',
            }}>
            <input type="radio" name={question.id} value={opt.id}
              checked={value === opt.id} onChange={() => onChange(opt.id)} className="w-4 h-4" />
            <span className="text-[10px] opacity-60 w-4" style={{ fontFamily: mono }}>{opt.id})</span>
            <span className="text-sm" style={{ fontFamily: serif }}>{opt.text}</span>
          </label>
        ))}
      </div>
    );
  }
  if (question.type === 'true_false') {
    return (
      <div className="flex gap-3">
        {[{ label: 'True', val: true }, { label: 'False', val: false }].map((opt) => (
          <label key={opt.label}
            className="flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer"
            style={{
              border: '1px solid ' + (value === opt.val ? '#1a1f2e' : 'rgba(26,31,46,0.18)'),
              backgroundColor: value === opt.val ? 'rgba(26,31,46,0.05)' : 'transparent',
              fontFamily: serif,
            }}>
            <input type="radio" name={question.id}
              checked={value === opt.val} onChange={() => onChange(opt.val)} className="w-4 h-4" />
            {opt.label}
          </label>
        ))}
      </div>
    );
  }
  if (question.type === 'numeric') {
    return (
      <div className="flex items-center gap-2">
        <input type="number" step="any" value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="px-3 py-2.5 text-base bg-transparent outline-none w-48"
          style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
        {question.unit && (
          <span className="text-sm opacity-70" style={{ fontFamily: serif }}>{question.unit}</span>
        )}
      </div>
    );
  }
  if (question.type === 'fill_in') {
    return (
      <input type="text" value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-base bg-transparent outline-none"
        style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
    );
  }
  if (question.type === 'free_text') {
    return (
      <div className="space-y-2">
        <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={5}
          className="w-full px-3 py-2.5 text-base bg-transparent outline-none leading-relaxed"
          style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
        <div className="text-[10px] opacity-60" style={{ fontFamily: mono }}>
          AI marking arrives in Stage 4 — for now this won't be scored.
        </div>
      </div>
    );
  }
  return null;
}
