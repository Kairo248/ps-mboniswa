import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [{ count: contentCount }, { count: itineraryCount }] = await Promise.all([
    supabase.from('content_feed').select('*', { count: 'exact', head: true }),
    supabase.from('itinerary').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">Dashboard</h1>
      <p className="text-neutral-600 text-sm sm:text-base mb-6 sm:mb-8">Manage your content and upcoming appearances.</p>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 max-w-2xl">
        <Link
          href="/admin/content"
          className="block p-4 sm:p-6 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          <h2 className="font-semibold text-lg text-neutral-900 mb-1">Content Feed</h2>
          <p className="text-neutral-600 text-sm mb-3">
            Sermons, music, and events. Add media and set category or status tags.
          </p>
          <p className="text-sm font-medium text-neutral-500">
            {contentCount ?? 0} item{(contentCount ?? 0) !== 1 ? 's' : ''}
          </p>
        </Link>
        <Link
          href="/admin/itinerary"
          className="block p-4 sm:p-6 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          <h2 className="font-semibold text-lg text-neutral-900 mb-1">Itinerary</h2>
          <p className="text-neutral-600 text-sm mb-3">
            Upcoming appearances: dates, locations, and ticket links.
          </p>
          <p className="text-sm font-medium text-neutral-500">
            {itineraryCount ?? 0} event{(itineraryCount ?? 0) !== 1 ? 's' : ''}
          </p>
        </Link>
      </div>
    </div>
  );
}
