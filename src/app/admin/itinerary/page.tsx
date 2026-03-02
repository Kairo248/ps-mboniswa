import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ItineraryDeleteButton } from './itinerary-delete-button';
import type { Itinerary } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function ItineraryPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('itinerary')
    .select('*')
    .order('event_date', { ascending: true });
  if (error) {
    console.error('Itinerary fetch error:', error);
  }
  const items = (data ?? []) as Itinerary[];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Itinerary</h1>
          <p className="text-neutral-600 text-sm mt-1">Upcoming appearances</p>
        </div>
        <Link
          href="/admin/itinerary/new"
          className="shrink-0 px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 w-fit"
        >
          Add event
        </Link>
      </div>

      {!items?.length ? (
        <p className="text-neutral-500 py-8">No events yet. Add your first appearance above.</p>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="md:hidden flex flex-col gap-3">
            {items.map((row) => (
              <div
                key={row.id}
                className="border border-neutral-200 rounded-xl overflow-hidden"
              >
                {row.image_url && (
                  <div className="aspect-video w-full bg-neutral-100">
                    <img src={row.image_url} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-4 flex flex-col gap-2">
                  <Link href={`/admin/itinerary/${row.id}/edit`} className="font-medium text-neutral-900 hover:underline">
                    {row.title}
                  </Link>
                  <p className="text-neutral-600 text-sm">
                    {new Date(row.event_date).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  {row.location_name && (
                    <p className="text-neutral-500 text-sm">{row.location_name}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Link href={`/admin/itinerary/${row.id}/edit`} className="text-sm text-neutral-600 hover:underline">
                      Edit
                    </Link>
                    {row.ticket_link && (
                      <a href={row.ticket_link} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:underline">
                        Tickets
                      </a>
                    )}
                    <ItineraryDeleteButton id={row.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: table */}
          <div className="hidden md:block border border-neutral-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-neutral-700 w-16">Image</th>
                  <th className="px-4 py-3 text-sm font-medium text-neutral-700">Event</th>
                  <th className="px-4 py-3 text-sm font-medium text-neutral-700">Date & time</th>
                  <th className="px-4 py-3 text-sm font-medium text-neutral-700">Location</th>
                  <th className="px-4 py-3 text-sm font-medium text-neutral-700 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-3">
                      {row.image_url ? (
                        <img src={row.image_url} alt="" className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <span className="text-neutral-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/itinerary/${row.id}/edit`} className="font-medium text-neutral-900 hover:underline">
                        {row.title}
                      </Link>
                      {row.ticket_link && (
                        <a
                          href={row.ticket_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-xs text-neutral-500 hover:underline"
                        >
                          Tickets
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 text-sm">
                      {new Date(row.event_date).toLocaleString('en-ZA', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 text-sm">{row.location_name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/itinerary/${row.id}/edit`} className="text-sm text-neutral-600 hover:underline">
                          Edit
                        </Link>
                        <ItineraryDeleteButton id={row.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
