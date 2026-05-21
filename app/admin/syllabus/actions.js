'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

function toSlug(s) {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function createTopic(formData) {
  const supabase = await createClient();
  const subject_id = formData.get('subject_id');
  const title = (formData.get('title') || '').toString().trim();
  const blurb = (formData.get('blurb') || '').toString().trim() || null;
  const sort_order = parseInt(formData.get('sort_order')) || 100;
  if (!subject_id || !title) return { error: 'Subject and title are required.' };

  const slug = toSlug(title);
  const { error } = await supabase
    .from('topics')
    .insert({ subject_id, slug, title, blurb, sort_order });
  if (error) return { error: error.message };
  revalidatePath('/admin/syllabus');
  return { ok: true };
}

export async function updateTopic(formData) {
  const supabase = await createClient();
  const id = formData.get('id');
  const title = (formData.get('title') || '').toString().trim();
  const blurb = (formData.get('blurb') || '').toString().trim() || null;
  const sort_order = parseInt(formData.get('sort_order')) || 100;
  if (!id || !title) return { error: 'Title is required.' };

  const { error } = await supabase
    .from('topics')
    .update({ title, blurb, sort_order })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/syllabus');
  return { ok: true };
}

export async function deleteTopic(formData) {
  const supabase = await createClient();
  const id = formData.get('id');
  if (!id) return { error: 'Missing id.' };
  const { error } = await supabase.from('topics').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/syllabus');
  return { ok: true };
}
