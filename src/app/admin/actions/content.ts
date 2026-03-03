'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { ContentCategory, ContentStatusTag, ContentFeedInsert, ContentFeedUpdate, PlatformLink } from '@/types/database';

export type ContentFormState = { error?: string; success?: boolean };

const BUCKET = 'content-media';
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

function parsePlatformLinks(raw: FormDataEntryValue | null): PlatformLink[] {
  if (raw == null || typeof raw !== 'string') return [];
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x): x is { name?: string; url?: string } => x != null && typeof x === 'object')
      .map((x) => ({ name: String(x.name ?? '').trim(), url: String(x.url ?? '').trim() }))
      .filter((x) => x.url);
  } catch {
    return [];
  }
}

async function uploadMedia(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, file: File): Promise<string | null> {
  if (!file.size || !ALLOWED_TYPES.includes(file.type)) return null;
  if (file.size > MAX_SIZE_BYTES) return null;

  const ext = file.name.split('.').pop() || 'bin';
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 100);
  const path = `${userId}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return null;

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}

export async function createContent(_prev: ContentFormState, formData: FormData): Promise<ContentFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const title = formData.get('title') as string;
  const description = (formData.get('description') as string) || null;
  const mediaFile = formData.get('media_file') as File | null;
  const category = formData.get('category') as ContentCategory;
  const status_tag = (formData.get('status_tag') as ContentStatusTag) || null;
  const platform_links = parsePlatformLinks(formData.get('platform_links'));

  if (!title?.trim()) return { error: 'Title is required' };
  if (!category || !['Sermon', 'Music', 'Event'].includes(category)) {
    return { error: 'Category must be Sermon, Music, or Event' };
  }

  let media_url: string | null = null;
  if (mediaFile?.size && mediaFile.size > 0) {
    const uploaded = await uploadMedia(supabase, user.id, mediaFile);
    if (!uploaded) return { error: 'Invalid or too large file. Use image (JPEG/PNG/GIF/WebP) or video (MP4/WebM), max 50 MB.' };
    media_url = uploaded;
  }

  const row: ContentFeedInsert = {
    title: title.trim(),
    description: description?.trim() || null,
    media_url,
    category,
    status_tag: status_tag && ['Hot', 'New', 'Popular', 'Live'].includes(status_tag) ? status_tag : null,
    platform_links: platform_links.length > 0 ? platform_links : null,
    created_by: user.id,
  };
  // @ts-expect-error Database generic can infer never for Insert; payload matches schema
  const { error } = await supabase.from('content_feed').insert(row);

  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/admin/content');
  redirect('/admin/content');
}

export async function updateContent(
  id: string,
  _prev: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const title = formData.get('title') as string;
  const description = (formData.get('description') as string) || null;
  const mediaFile = formData.get('media_file') as File | null;
  const category = formData.get('category') as ContentCategory;
  const status_tag = (formData.get('status_tag') as ContentStatusTag) || null;
  const platform_links = parsePlatformLinks(formData.get('platform_links'));

  if (!title?.trim()) return { error: 'Title is required' };
  if (!category || !['Sermon', 'Music', 'Event'].includes(category)) {
    return { error: 'Category must be Sermon, Music, or Event' };
  }

  const update: ContentFeedUpdate = {
    title: title.trim(),
    description: description?.trim() || null,
    category,
    status_tag: status_tag && ['Hot', 'New', 'Popular', 'Live'].includes(status_tag) ? status_tag : null,
    platform_links: platform_links.length > 0 ? platform_links : null,
  };
  if (mediaFile?.size && mediaFile.size > 0) {
    const uploaded = await uploadMedia(supabase, user.id, mediaFile);
    if (!uploaded) return { error: 'Invalid or too large file. Use image (JPEG/PNG/GIF/WebP) or video (MP4/WebM), max 50 MB.' };
    update.media_url = uploaded;
  }

  // @ts-expect-error Database generic can infer never for Update; payload matches schema
  const { error } = await supabase.from('content_feed').update(update).eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/admin/content');
  redirect('/admin/content');
}

export async function deleteContent(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase.from('content_feed').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/admin/content');
  return {};
}
