-- ============================================================================
-- Storage bucket for lesson videos (and any future lesson media).
-- Bucket is PUBLIC so learners can stream videos directly; writes are
-- gated to admins via storage.objects RLS.
-- Safe to re-run.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('lesson-videos', 'lesson-videos', true)
on conflict (id) do update set public = true;

-- Public read (anyone can stream the video URL)
drop policy if exists "lesson-videos: public read" on storage.objects;
create policy "lesson-videos: public read"
  on storage.objects for select
  using (bucket_id = 'lesson-videos');

-- Admin-only insert
drop policy if exists "lesson-videos: admin insert" on storage.objects;
create policy "lesson-videos: admin insert"
  on storage.objects for insert
  with check (bucket_id = 'lesson-videos' and public.is_admin());

-- Admin-only update
drop policy if exists "lesson-videos: admin update" on storage.objects;
create policy "lesson-videos: admin update"
  on storage.objects for update
  using (bucket_id = 'lesson-videos' and public.is_admin());

-- Admin-only delete
drop policy if exists "lesson-videos: admin delete" on storage.objects;
create policy "lesson-videos: admin delete"
  on storage.objects for delete
  using (bucket_id = 'lesson-videos' and public.is_admin());
