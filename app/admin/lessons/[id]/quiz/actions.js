'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function ensureActivity(lessonId) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('activities')
    .select('id')
    .eq('lesson_id', lessonId)
    .eq('slug', 'quiz')
    .maybeSingle();
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from('activities')
    .insert({ lesson_id: lessonId, slug: 'quiz', title: 'Quiz', is_published: false })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateActivity(formData) {
  const supabase = await createClient();
  const id = formData.get('id');
  const lessonId = formData.get('lesson_id');
  const title = (formData.get('title') || 'Quiz').toString().trim();
  const instructions = (formData.get('instructions') || '').toString().trim() || null;
  const pass_threshold = parseInt(formData.get('pass_threshold')) || 60;
  const is_published = formData.get('is_published') === 'on';

  const { error } = await supabase
    .from('activities')
    .update({ title, instructions, pass_threshold, is_published })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/lessons/${lessonId}/quiz`);
  return { ok: true };
}

export async function saveQuestion(formData) {
  const supabase = await createClient();
  const id = formData.get('id');           // present if editing
  const activity_id = formData.get('activity_id');
  const lessonId = formData.get('lesson_id');
  const type = formData.get('type');
  const prompt = (formData.get('prompt') || '').toString().trim();
  const points = parseInt(formData.get('points')) || 1;
  const sort_order = parseInt(formData.get('sort_order')) || 100;
  const explanation = (formData.get('explanation') || '').toString().trim() || null;

  if (!activity_id || !prompt || !type) return { error: 'Type, prompt and activity are required.' };

  let options = null;
  let correct = null;
  let case_sensitive = null;
  let tolerance = null;
  let unit = null;
  let rubric = null;

  if (type === 'mcq') {
    const opts = [];
    for (let i = 0; i < 8; i++) {
      const text = formData.get(`option_${i}_text`);
      if (text && text.toString().trim()) {
        opts.push({ id: String.fromCharCode(97 + i), text: text.toString().trim() });
      }
    }
    options = opts;
    correct = formData.get('correct_option') || (opts[0]?.id ?? 'a');
  } else if (type === 'true_false') {
    correct = formData.get('correct_tf') === 'true';
  } else if (type === 'numeric') {
    correct = Number(formData.get('correct_numeric'));
    tolerance = Number(formData.get('tolerance')) || 0;
    unit = (formData.get('unit') || '').toString().trim() || null;
  } else if (type === 'fill_in') {
    const raw = (formData.get('correct_fill_in') || '').toString();
    correct = raw.split('\n').map((s) => s.trim()).filter(Boolean);
    case_sensitive = formData.get('case_sensitive') === 'on';
  } else if (type === 'free_text') {
    rubric = (formData.get('rubric') || '').toString().trim() || null;
  }

  const payload = {
    activity_id, type, prompt, points, sort_order, explanation,
    options, correct, case_sensitive, tolerance, unit, rubric,
  };

  let error;
  if (id) {
    ({ error } = await supabase.from('questions').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('questions').insert(payload));
  }
  if (error) return { error: error.message };
  revalidatePath(`/admin/lessons/${lessonId}/quiz`);
  return { ok: true };
}

export async function deleteQuestion(formData) {
  const supabase = await createClient();
  const id = formData.get('id');
  const lessonId = formData.get('lesson_id');
  const { error } = await supabase.from('questions').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/lessons/${lessonId}/quiz`);
  return { ok: true };
}
