'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, Pencil, Save, X } from 'lucide-react';
import { createTopic, updateTopic, deleteTopic } from '@/app/admin/syllabus/actions';

const mono = '"IBM Plex Mono", monospace';
const serif = '"Fraunces", Georgia, serif';

export default function TopicManager({ subject, topics }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pending, startTransition] = useTransition();

  function submit(action, fd, after) {
    startTransition(async () => {
      const res = await action(fd);
      if (res?.error) {
        alert(res.error);
        return;
      }
      after?.();
    });
  }

  return (
    <div className="mb-10">
      <div className="flex items-baseline justify-between gap-3 mb-3 pb-2 border-b border-stone-900/15">
        <div>
          <div className="text-lg" style={{ fontFamily: serif, fontWeight: 500 }}>{subject.name}</div>
          <div className="text-[10px] uppercase opacity-55"
            style={{ fontFamily: mono, letterSpacing: '0.22em' }}>
            {subject.curriculum === 'both' ? 'NSSCO · NSSCAS' : subject.curriculum?.toUpperCase()}
            {' · '}{topics?.length || 0} topic{topics?.length === 1 ? '' : 's'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAdding(!adding)}
          className="inline-flex items-center gap-1 text-[10px] uppercase py-1.5 px-3"
          style={{
            fontFamily: mono,
            letterSpacing: '0.22em',
            border: '1px solid rgba(26,31,46,0.35)',
          }}
        >
          {adding ? <X size={12} /> : <Plus size={12} />} {adding ? 'Cancel' : 'Add topic'}
        </button>
      </div>

      {adding && (
        <form
          action={(fd) => {
            fd.set('subject_id', subject.id);
            submit(createTopic, fd, () => setAdding(false));
          }}
          className="mb-4 p-3 space-y-2"
          style={{ border: '1px solid rgba(26,31,46,0.18)', backgroundColor: 'rgba(26,31,46,0.03)' }}
        >
          <Input name="title" placeholder="Topic title (e.g. Photosynthesis)" required />
          <Input name="blurb" placeholder="Short description (optional)" />
          <div className="flex items-center gap-2">
            <Input name="sort_order" type="number" defaultValue="100" className="w-24" placeholder="Order" />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-1 text-[10px] uppercase py-2 px-3 ml-auto"
              style={{
                fontFamily: mono,
                letterSpacing: '0.22em',
                backgroundColor: '#1a1f2e',
                color: '#e8e4d8',
              }}
            >
              <Save size={12} /> {pending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {topics?.length ? (
        <div>
          {topics.map((t) =>
            editingId === t.id ? (
              <form
                key={t.id}
                action={(fd) => {
                  fd.set('id', t.id);
                  submit(updateTopic, fd, () => setEditingId(null));
                }}
                className="my-2 p-3 space-y-2"
                style={{ border: '1px solid rgba(26,31,46,0.35)', backgroundColor: 'rgba(26,31,46,0.04)' }}
              >
                <Input name="title" defaultValue={t.title} required />
                <Input name="blurb" defaultValue={t.blurb || ''} placeholder="Short description (optional)" />
                <div className="flex items-center gap-2">
                  <Input name="sort_order" type="number" defaultValue={t.sort_order} className="w-24" />
                  <button type="button" onClick={() => setEditingId(null)}
                    className="text-[10px] uppercase py-2 px-3 ml-auto"
                    style={{ fontFamily: mono, letterSpacing: '0.22em', border: '1px solid rgba(26,31,46,0.35)' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={pending}
                    className="inline-flex items-center gap-1 text-[10px] uppercase py-2 px-3"
                    style={{ fontFamily: mono, letterSpacing: '0.22em', backgroundColor: '#1a1f2e', color: '#e8e4d8' }}>
                    <Save size={12} /> Save
                  </button>
                </div>
              </form>
            ) : (
              <div key={t.id}
                className="flex items-center justify-between gap-3 py-2.5 px-2 -mx-2 border-b border-stone-900/10">
                <div className="min-w-0">
                  <div className="text-sm" style={{ fontWeight: 500 }}>{t.title}</div>
                  {t.blurb && <div className="text-[11px] opacity-60 truncate">{t.blurb}</div>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] opacity-50" style={{ fontFamily: mono }}>
                    {t.lessons_count || 0} lesson{t.lessons_count === 1 ? '' : 's'}
                  </span>
                  <button type="button" onClick={() => setEditingId(t.id)}
                    className="p-1.5 hover:bg-stone-900/5" title="Edit topic">
                    <Pencil size={13} strokeWidth={1.6} />
                  </button>
                  <form action={(fd) => {
                      fd.set('id', t.id);
                      if (confirm(`Delete "${t.title}" and all its lessons?`)) submit(deleteTopic, fd);
                    }}>
                    <button type="submit"
                      className="p-1.5 hover:bg-red-100" title="Delete topic">
                      <Trash2 size={13} strokeWidth={1.6} style={{ color: '#c2185b' }} />
                    </button>
                  </form>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <p className="text-xs opacity-55" style={{ fontFamily: mono }}>
          No topics yet. Add one above.
        </p>
      )}
    </div>
  );
}

function Input({ className = '', ...rest }) {
  return (
    <input
      {...rest}
      className={`w-full px-2.5 py-2 bg-transparent text-sm outline-none ${className}`}
      style={{
        fontFamily: serif,
        border: '1px solid rgba(26,31,46,0.25)',
      }}
    />
  );
}
