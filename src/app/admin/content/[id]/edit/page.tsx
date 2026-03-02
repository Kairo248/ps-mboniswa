import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ContentForm } from '../../content-form';
import { updateContent } from '../../../actions/content';
import type { ContentFeed } from '@/types/database';

type Props = { params: Promise<{ id: string }> };

export default async function EditContentPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('content_feed').select('*').eq('id', id).single();
  const item = data as ContentFeed | null;
  if (!item) notFound();

  const updateAction = updateContent.bind(null, id);

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <Link href="/admin/content" className="text-sm text-neutral-600 hover:underline">
          ← Content Feed
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-2">Edit content</h1>
        <p className="text-neutral-600 text-sm mt-1 truncate">{item.title}</p>
      </div>
      <ContentForm action={updateAction} initial={item} />
    </div>
  );
}
