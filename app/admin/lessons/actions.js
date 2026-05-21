'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function toSlug(s) {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function pickFields(formData) {
  const topic_id = formData.get('topic_id');
  const title = (formData.get('title') || '').toString().trim();
  const body_md = (formData.get('body_md') || '').toString();
  const lab_slug = (formData.get('lab_slug') || '').toString().trim() || null;
  const video_url = (formData.get('video_url') || '').toString().trim() || null;
  const video_storage_path = (formData.get('video_storage_path') || '').toString().trim() || null;
  const duration_minutes = parseInt(formData.get('duration_minutes')) || null;
  const sort_order = parseInt(formData.get('sort_order')) || 100;
  const is_published = formData.get('is_published') === 'on';
  return { topic_id, title, body_md, lab_slug, video_url, video_storage_path, duration_minutes, sort_order, is_published };
}

export async function createLesson(formData) {
  const supabase = await createClient();
  const f = pickFields(formData);
  if (!f.topic_id || !f.title) return { error: 'Topic and title are required.' };
  const slug = toSlug(f.title);

  const { data, error } = await supabase
    .from('lessons')
    .insert({ ...f, slug })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath('/admin/lessons');
  redirect(`/admin/lessons/${data.id}?created=1`);
}

export async function updateLesson(formData) {
  const supabase = await createClient();
  const id = formData.get('id');
  if (!id) return { error: 'Missing id.' };
  const f = pickFields(formData);
  if (!f.title) return { error: 'Title is required.' };

  const update = { ...f };
  // Don't overwrite slug from title — keep the original slug stable
  delete update.topic_id; // topic stays put once created

  const { error } = await supabase.from('lessons').update(update).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/lessons');
  revalidatePath(`/admin/lessons/${id}`);
  return { ok: true };
}

export async function deleteLesson(formData) {
  const supabase = await createClient();
  const id = formData.get('id');
  if (!id) return { error: 'Missing id.' };

  // Try to delete the video from storage too, if any
  const { data: lesson } = await supabase
    .from('lessons')
    .select('video_storage_path')
    .eq('id', id)
    .single();
  if (lesson?.video_storage_path) {
    await supabase.storage.from('lesson-videos').remove([lesson.video_storage_path]);
  }

  const { error } = await supabase.from('lessons').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/lessons');
  redirect('/admin/lessons');
}

export async function deleteLessonVideo(formData) {
  const supabase = await createClient();
  const id = formData.get('id');
  const path = formData.get('path');
  if (!id) return { error: 'Missing id.' };
  if (path) {
    await supabase.storage.from('lesson-videos').remove([path]);
  }
  const { error } = await supabase
    .from('lessons')
    .update({ video_url: null, video_storage_path: null })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/lessons/${id}`);
  return { ok: true };
}
