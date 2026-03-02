'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type ItineraryFormState = { error?: string; success?: boolean };

const BUCKET = 'content-media';
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB for event images

async function uploadItineraryImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  file: File
): Promise<string | null> {
  if (!file.size || !ALLOWED_IMAGE_TYPES.includes(file.type)) return null;
  if (file.size > MAX_SIZE_BYTES) return null;
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 100);
  const path = `itinerary/${userId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return null;
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}

export async function createItinerary(_prev: ItineraryFormState, formData: FormData): Promise<ItineraryFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const title = formData.get('title') as string;
  const event_date = formData.get('event_date') as string;
  const location_name = (formData.get('location_name') as string) || null;
  const location_coord = (formData.get('location_coord') as string) || null;
  const ticket_link = (formData.get('ticket_link') as string) || null;
  const imageFile = formData.get('image_file') as File | null;

  if (!title?.trim()) return { error: 'Title is required' };
  if (!event_date) return { error: 'Event date is required' };

  let image_url: string | null = null;
  if (imageFile?.size && imageFile.size > 0) {
    const uploaded = await uploadItineraryImage(supabase, user.id, imageFile);
    if (uploaded) image_url = uploaded;
  }

  // @ts-expect-error Database generic can infer never for Insert; payload matches schema
  const { error } = await supabase.from('itinerary').insert({
    title: title.trim(),
    event_date: new Date(event_date).toISOString(),
    location_name: location_name?.trim() || null,
    location_coord: location_coord?.trim() || null,
    ticket_link: ticket_link?.trim() || null,
    image_url,
    created_by: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/admin/itinerary');
  redirect('/admin/itinerary');
}

export async function updateItinerary(
  id: string,
  _prev: ItineraryFormState,
  formData: FormData
): Promise<ItineraryFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const title = formData.get('title') as string;
  const event_date = formData.get('event_date') as string;
  const location_name = (formData.get('location_name') as string) || null;
  const location_coord = (formData.get('location_coord') as string) || null;
  const ticket_link = (formData.get('ticket_link') as string) || null;
  const imageFile = formData.get('image_file') as File | null;

  if (!title?.trim()) return { error: 'Title is required' };
  if (!event_date) return { error: 'Event date is required' };

  const updatePayload: Record<string, unknown> = {
    title: title.trim(),
    event_date: new Date(event_date).toISOString(),
    location_name: location_name?.trim() || null,
    location_coord: location_coord?.trim() || null,
    ticket_link: ticket_link?.trim() || null,
  };
  if (imageFile?.size && imageFile.size > 0) {
    const uploaded = await uploadItineraryImage(supabase, user.id, imageFile);
    if (uploaded) updatePayload.image_url = uploaded;
  }

  const { error } = await supabase
    .from('itinerary')
    // @ts-expect-error Database generic can infer never for Update; payload matches schema
    .update(updatePayload)
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/admin/itinerary');
  redirect('/admin/itinerary');
}

export async function deleteItinerary(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase.from('itinerary').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/admin/itinerary');
  return {};
}
