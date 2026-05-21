'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ExternalLink, Trash2 } from 'lucide-react';
import VideoUploader from './VideoUploader';
import { createLesson, updateLesson, deleteLesson } from '@/app/admin/lessons/actions';
import { LAB_SLUGS } from '@/lib/labs';

const mono = '"IBM Plex Mono", monospace';
const serif = '"Fraunces", Georgia, serif';

export default function LessonForm({ mode, lesson, subjects, topics }) {
  const router = useRouter();
  const isNew = mode === 'new';

  const [subjectId, setSubjectId] = useState(
    !isNew && lesson?.topic ? lesson.topic.subject_id : ''
  );
  const [topicId, setTopicId] = useState(lesson?.topic_id || '');
  const [title, setTitle] = useState(lesson?.title || '');
  const [bodyMd, setBodyMd] = useState(lesson?.body_md || '');
  const [labSlug, setLabSlug] = useState(lesson?.lab_slug || '');
  const [duration, setDuration] = useState(lesson?.duration_minutes || '');
  const [sortOrder, setSortOrder] = useState(lesson?.sort_order ?? 100);
  const [isPublished, setIsPublished] = useState(lesson?.is_published ?? false);

  const [error, setError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const [pending, startTransition] = useTransition();

  const availableTopics = subjectId
    ? topics.filter((t) => t.subject_id === subjectId)
    : [];

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.target);
    if (!isNew) fd.set('id', lesson.id);

    startTransition(async () => {
      const action = isNew ? createLesson : updateLesson;
      const res = await action(fd);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSavedAt(new Date());
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${lesson.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set('id', lesson.id);
      const res = await deleteLesson(fd);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Subject + topic (only when creating, or shown read-only when editing) */}
      {isNew ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Subject">
            <select
              value={subjectId}
              onChange={(e) => { setSubjectId(e.target.value); setTopicId(''); }}
              required
              className="w-full px-2.5 py-2 text-sm bg-transparent outline-none"
              style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }}
            >
              <option value="">— pick a subject —</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Topic">
            <select
              name="topic_id"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              required
              disabled={!subjectId}
              className="w-full px-2.5 py-2 text-sm bg-transparent outline-none disabled:opacity-50"
              style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }}
            >
              <option value="">— pick a topic —</option>
              {availableTopics.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
            {subjectId && availableTopics.length === 0 && (
              <div className="text-[10px] mt-1 opacity-70" style={{ fontFamily: mono }}>
                This subject has no topics yet. <Link href="/admin/syllabus" className="underline">Add one</Link>.
              </div>
            )}
          </Field>
        </div>
      ) : (
        <div className="text-[10px] uppercase opacity-65"
          style={{ fontFamily: mono, letterSpacing: '0.22em' }}>
          {lesson?.topic?.subjects?.name} → {lesson?.topic?.title}
          <input type="hidden" name="topic_id" value={lesson.topic_id} />
        </div>
      )}

      {/* Title */}
      <Field label="Lesson title">
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2.5 text-base bg-transparent outline-none"
          style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }}
        />
      </Field>

      {/* Body markdown */}
      <Field
        label="Lesson body"
        hint="Markdown supported — double-newline for paragraph breaks. Add your explanation, examples, diagrams (images by URL)."
      >
        <textarea
          name="body_md"
          value={bodyMd}
          onChange={(e) => setBodyMd(e.target.value)}
          rows={12}
          className="w-full px-3 py-2.5 text-sm bg-transparent outline-none leading-relaxed"
          style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }}
        />
      </Field>

      {/* Video upload (only when editing; need lessonId for storage path) */}
      {!isNew && (
        <Field label="Video" hint="Upload an MP4. The learner sees this player on the lesson page.">
          <VideoUploader
            lessonId={lesson.id}
            initialUrl={lesson.video_url}
            initialPath={lesson.video_storage_path}
          />
        </Field>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Lab slug */}
        <Field
          label="Attach a lab (optional)"
          hint="Pick an existing 3D lab to launch from this lesson."
        >
          <select
            name="lab_slug"
            value={labSlug}
            onChange={(e) => setLabSlug(e.target.value)}
            className="w-full px-2.5 py-2 text-sm bg-transparent outline-none"
            style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }}
          >
            <option value="">— no lab —</option>
            {LAB_SLUGS.map((slug) => (
              <option key={slug} value={slug}>{slug}</option>
            ))}
          </select>
          {labSlug && (
            <Link href={`/${labSlug}`} target="_blank"
              className="inline-flex items-center gap-1 text-[10px] uppercase mt-1 opacity-70 hover:opacity-100"
              style={{ fontFamily: mono, letterSpacing: '0.22em' }}>
              Preview lab <ExternalLink size={10} />
            </Link>
          )}
        </Field>

        {/* Duration */}
        <Field label="Duration (minutes)">
          <input
            name="duration_minutes"
            type="number"
            min="0"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-2.5 py-2 text-sm bg-transparent outline-none"
            style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }}
          />
        </Field>

        {/* Sort order */}
        <Field label="Order in topic">
          <input
            name="sort_order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-2.5 py-2 text-sm bg-transparent outline-none"
            style={{ fontFamily: serif, border: '1px solid rgba(26,31,46,0.25)' }}
          />
        </Field>
      </div>

      {/* Publish toggle */}
      <label className="flex items-center gap-3 select-none cursor-pointer">
        <input
          type="checkbox"
          name="is_published"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-sm" style={{ fontFamily: serif }}>
          Published — visible to learners
        </span>
      </label>

      {error && (
        <div className="text-xs px-3 py-2 border"
          style={{
            borderColor: 'rgba(194,24,91,0.4)',
            backgroundColor: 'rgba(194,24,91,0.06)',
            color: '#c2185b',
            fontFamily: mono,
          }}
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-900/15">
        {!isNew ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="inline-flex items-center gap-1 text-[11px] uppercase py-2.5 px-4"
            style={{
              fontFamily: mono,
              letterSpacing: '0.22em',
              border: '1px solid rgba(194,24,91,0.4)',
              color: '#c2185b',
            }}
          >
            <Trash2 size={12} /> Delete lesson
          </button>
        ) : <div />}

        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-[10px] opacity-60"
              style={{ fontFamily: mono, letterSpacing: '0.12em' }}>
              Saved {savedAt.toLocaleTimeString()}
            </span>
          )}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 py-2.5 px-5 text-[11px] uppercase active:scale-95 disabled:opacity-50"
            style={{
              fontFamily: mono,
              letterSpacing: '0.25em',
              backgroundColor: '#1a1f2e',
              color: '#e8e4d8',
            }}
          >
            <Save size={13} /> {pending ? 'Saving…' : isNew ? 'Create lesson' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase mb-1.5 opacity-65"
        style={{ fontFamily: mono, letterSpacing: '0.22em' }}>
        {label}
      </span>
      {children}
      {hint && <span className="block text-[10px] mt-1 opacity-60 leading-snug">{hint}</span>}
    </label>
  );
}
