'use client';

import { useRef, useState, useTransition } from 'react';
import { Upload, Trash2, PlayCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { deleteLessonVideo } from '@/app/admin/lessons/actions';

const mono = '"IBM Plex Mono", monospace';

export default function VideoUploader({ lessonId, initialUrl, initialPath, onChange }) {
  const inputRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(initialUrl || '');
  const [videoPath, setVideoPath] = useState(initialPath || '');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  async function handleFile(file) {
    if (!file) return;
    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const path = `${lessonId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('lesson-videos')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('lesson-videos')
        .getPublicUrl(path);

      setVideoUrl(publicUrl);
      setVideoPath(path);
      onChange?.({ url: publicUrl, path });
      setProgress(100);
    } catch (e) {
      setError(e.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    if (!confirm('Remove this video?')) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set('id', lessonId);
      if (videoPath) fd.set('path', videoPath);
      const res = await deleteLessonVideo(fd);
      if (res?.error) {
        alert(res.error);
        return;
      }
      setVideoUrl('');
      setVideoPath('');
      onChange?.({ url: '', path: '' });
    });
  }

  return (
    <div className="space-y-3">
      {/* hidden fields so the parent form picks up the values on submit */}
      <input type="hidden" name="video_url" value={videoUrl} />
      <input type="hidden" name="video_storage_path" value={videoPath} />

      {videoUrl ? (
        <div className="space-y-2">
          <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', backgroundColor: '#0c1019' }}>
            <video controls src={videoUrl} className="absolute inset-0 w-full h-full" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] opacity-60 truncate"
              style={{ fontFamily: mono, letterSpacing: '0.12em' }}>
              {videoPath || videoUrl}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={pending}
              className="inline-flex items-center gap-1 text-[10px] uppercase py-1.5 px-3 shrink-0"
              style={{
                fontFamily: mono,
                letterSpacing: '0.22em',
                border: '1px solid rgba(194,24,91,0.4)',
                color: '#c2185b',
              }}
            >
              <Trash2 size={11} /> Remove video
            </button>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-[10px] uppercase opacity-70 hover:opacity-100"
            style={{ fontFamily: mono, letterSpacing: '0.22em' }}
          >
            Replace video
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full p-8 flex flex-col items-center justify-center gap-2 transition hover:bg-stone-900/5"
          style={{
            border: '1px dashed rgba(26,31,46,0.35)',
            backgroundColor: 'rgba(26,31,46,0.02)',
          }}
        >
          {uploading ? (
            <>
              <Upload size={20} strokeWidth={1.5} />
              <div className="text-[11px] uppercase" style={{ fontFamily: mono, letterSpacing: '0.22em' }}>
                Uploading… {progress}%
              </div>
            </>
          ) : (
            <>
              <PlayCircle size={24} strokeWidth={1.5} className="opacity-70" />
              <div className="text-[11px] uppercase" style={{ fontFamily: mono, letterSpacing: '0.22em' }}>
                Click to upload video
              </div>
              <div className="text-[10px] opacity-55">MP4 / WebM / MOV recommended</div>
            </>
          )}
        </button>
      )}

      {error && (
        <div className="text-[11px] px-3 py-2 border"
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

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
