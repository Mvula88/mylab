'use client';

import { useState, useTransition } from 'react';
import { Plus, Pencil, Trash2, CheckCircle2, Circle, Save } from 'lucide-react';
import QuestionEditor from './QuestionEditor';
import { updateActivity, deleteQuestion } from '@/app/admin/lessons/[id]/quiz/actions';

const mono = '"IBM Plex Mono", monospace';
const serif = '"Fraunces", Georgia, serif';

const TYPE_LABEL = {
  mcq: 'Multiple choice',
  true_false: 'True / False',
  numeric: 'Numeric',
  fill_in: 'Fill-in',
  free_text: 'Free text',
};

export default function QuizBuilder({ lessonId, activity, questions }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pending, startTransition] = useTransition();

  function handleSettings(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set('id', activity.id);
    fd.set('lesson_id', lessonId);
    startTransition(async () => {
      const res = await updateActivity(fd);
      if (res?.error) alert(res.error);
    });
  }

  function handleDelete(qid) {
    if (!confirm('Delete this question?')) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set('id', qid);
      fd.set('lesson_id', lessonId);
      const res = await deleteQuestion(fd);
      if (res?.error) alert(res.error);
    });
  }

  return (
    <div className="space-y-8">
      {/* Quiz settings */}
      <form onSubmit={handleSettings}
        className="p-4 space-y-3"
        style={{ border: '1px solid rgba(26,31,46,0.18)', backgroundColor: 'rgba(26,31,46,0.03)' }}>
        <div className="text-[10px] uppercase opacity-65"
          style={{ fontFamily: mono, letterSpacing: '0.22em' }}>Quiz settings</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Quiz title">
            <input name="title" defaultValue={activity.title}
              className="w-full px-2.5 py-2 text-sm bg-transparent outline-none"
              style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
          </Field>
          <Field label="Pass threshold (%)">
            <input name="pass_threshold" type="number" min="0" max="100"
              defaultValue={activity.pass_threshold}
              className="w-full px-2.5 py-2 text-sm bg-transparent outline-none"
              style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
          </Field>
          <label className="flex items-end gap-2 pb-2">
            <input type="checkbox" name="is_published" defaultChecked={activity.is_published} className="w-4 h-4" />
            <span className="text-sm" style={{ fontFamily: serif }}>Published</span>
          </label>
        </div>
        <Field label="Instructions (optional)">
          <textarea name="instructions" rows={2} defaultValue={activity.instructions || ''}
            placeholder="Shown to learner above the questions."
            className="w-full px-3 py-2 text-sm bg-transparent outline-none"
            style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }} />
        </Field>
        <div className="flex justify-end">
          <button type="submit" disabled={pending}
            className="inline-flex items-center gap-1 text-[10px] uppercase py-2 px-3"
            style={{ fontFamily: mono, letterSpacing: '0.22em',
              backgroundColor: '#1a1f2e', color: '#e8e4d8' }}>
            <Save size={11} /> {pending ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>

      {/* Question list */}
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-3 pb-2 border-b border-stone-900/15">
          <div className="text-lg" style={{ fontFamily: serif, fontWeight: 500 }}>
            Questions ({questions.length})
          </div>
          {!adding && editingId === null && (
            <button type="button" onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1 text-[10px] uppercase py-1.5 px-3"
              style={{ fontFamily: mono, letterSpacing: '0.22em',
                border: '1px solid rgba(26,31,46,0.35)' }}>
              <Plus size={12} /> Add question
            </button>
          )}
        </div>

        {adding && (
          <div className="mb-4">
            <QuestionEditor
              lessonId={lessonId}
              activityId={activity.id}
              onDone={() => setAdding(false)}
            />
          </div>
        )}

        {questions.length === 0 && !adding ? (
          <p className="text-xs opacity-55" style={{ fontFamily: mono }}>
            No questions yet. Click <strong>Add question</strong> to start.
          </p>
        ) : (
          <div>
            {questions.map((q, i) =>
              editingId === q.id ? (
                <div key={q.id} className="my-2">
                  <QuestionEditor
                    lessonId={lessonId}
                    activityId={activity.id}
                    question={q}
                    onDone={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div key={q.id}
                  className="flex items-start justify-between gap-3 py-3 px-2 -mx-2 border-b border-stone-900/10">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span className="text-[10px] uppercase opacity-55 pt-0.5"
                      style={{ fontFamily: mono, letterSpacing: '0.22em', color: '#ec407a' }}>
                      Q{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm" style={{ fontWeight: 500 }}>{q.prompt}</div>
                      <div className="text-[10px] opacity-55 flex gap-2 mt-1"
                        style={{ fontFamily: mono, letterSpacing: '0.12em' }}>
                        <span>{TYPE_LABEL[q.type] || q.type}</span>
                        <span className="opacity-50">·</span>
                        <span>{q.points} pt{q.points === 1 ? '' : 's'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => setEditingId(q.id)}
                      className="p-1.5 hover:bg-stone-900/5" title="Edit">
                      <Pencil size={13} strokeWidth={1.6} />
                    </button>
                    <button type="button" onClick={() => handleDelete(q.id)}
                      className="p-1.5 hover:bg-red-100" title="Delete">
                      <Trash2 size={13} strokeWidth={1.6} style={{ color: '#c2185b' }} />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase mb-1.5 opacity-65"
        style={{ fontFamily: mono, letterSpacing: '0.22em' }}>{label}</span>
      {children}
    </label>
  );
}
