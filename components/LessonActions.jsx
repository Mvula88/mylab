'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const mono = '"IBM Plex Mono", monospace';

export default function LessonActions({ lessonId, alreadyCompleted, nextHref, nextLabel }) {
  const router = useRouter();
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [saving, setSaving] = useState(false);

  async function markComplete() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login?next=' + encodeURIComponent(window.location.pathname));
      return;
    }
    await supabase
      .from('lesson_progress')
      .upsert(
        { user_id: user.id, lesson_id: lessonId, completed_at: new Date().toISOString() },
        { onConflict: 'user_id,lesson_id' }
      );
    setCompleted(true);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {!completed ? (
        <button
          onClick={markComplete}
          disabled={saving}
          className="inline-flex items-center gap-2 py-3 px-5 text-[11px] uppercase active:scale-95 disabled:opacity-50"
          style={{
            fontFamily: mono,
            letterSpacing: '0.25em',
            backgroundColor: '#1a1f2e',
            color: '#e8e4d8',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={14} /> {saving ? 'Saving…' : 'Mark complete'}
        </button>
      ) : (
        <span className="inline-flex items-center gap-2 py-3 px-5 text-[11px] uppercase"
          style={{
            fontFamily: mono,
            letterSpacing: '0.25em',
            border: '1px solid rgba(46,125,50,0.4)',
            color: '#2e7d32',
          }}
        >
          <CheckCircle2 size={14} /> Completed
        </span>
      )}

      <Link
        href={nextHref}
        className="inline-flex items-center gap-2 py-3 px-5 text-[11px] uppercase active:scale-95"
        style={{
          fontFamily: mono,
          letterSpacing: '0.25em',
          border: '1px solid rgba(26,31,46,0.35)',
        }}
      >
        {nextLabel} <ArrowRight size={12} />
      </Link>
    </div>
  );
}
