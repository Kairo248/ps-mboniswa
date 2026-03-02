import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ItineraryForm } from '../../itinerary-form';
import { updateItinerary } from '../../../actions/itinerary';
import type { Itinerary } from '@/types/database';

type Props = { params: Promise<{ id: string }> };

export default async function EditItineraryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('itinerary').select('*').eq('id', id).single();
  const item = data as Itinerary | null;
  if (!item) notFound();

  const updateAction = updateItinerary.bind(null, id);

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <Link href="/admin/itinerary" className="text-sm text-neutral-600 hover:underline">
          ← Itinerary
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-2">Edit event</h1>
        <p className="text-neutral-600 text-sm mt-1 truncate">{item.title}</p>
      </div>
      <ItineraryForm action={updateAction} initial={item} />
    </div>
  );
}
