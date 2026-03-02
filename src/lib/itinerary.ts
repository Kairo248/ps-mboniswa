import { createClient } from '@/lib/supabase/server';
import type { Itinerary } from '@/types/database';

export async function getPublicItinerary(): Promise<Itinerary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('itinerary')
    .select('*')
    .order('event_date', { ascending: true });

  if (error) return [];
  return (data ?? []) as Itinerary[];
}

export async function getItineraryById(id: string): Promise<Itinerary | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('itinerary')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as Itinerary;
}
