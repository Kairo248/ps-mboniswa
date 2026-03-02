import { createClient } from '@/lib/supabase/server';
import type { ContentFeed } from '@/types/database';

export async function getPublicContentFeed(): Promise<ContentFeed[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('content_feed')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as ContentFeed[];
}

export async function getContentById(id: string): Promise<ContentFeed | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('content_feed')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as ContentFeed;
}
