import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getItineraryById } from '@/lib/itinerary';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getItineraryById(id);
  if (!event) return { title: 'Event | Mboniswa' };
  return {
    title: `${event.title} | Mboniswa`,
    description: event.location_name
      ? `${event.title} — ${event.location_name}`
      : event.title,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getItineraryById(id);
  if (!event) notFound();

  const dateStr = new Date(event.event_date).toLocaleDateString('en-ZA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const mapUrl =
    event.location_coord &&
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location_coord)}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-4">
          <Link
            href="/#itinerary"
            className="font-sans text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            ← Back to upcoming events
          </Link>

          <article className="mt-6 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
            {event.image_url && (
              <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-6 md:p-8">
              <p className="font-sans text-sm font-medium uppercase tracking-widest text-stone-500">
                {dateStr}
              </p>
              <h1 className="mt-2 font-serif text-2xl font-medium text-stone-900 md:text-3xl">
                {event.title}
              </h1>
              {event.location_name && (
                <p className="mt-4 font-sans text-base text-stone-700">
                  {event.location_name}
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                {event.ticket_link && (
                  <a
                    href={event.ticket_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg bg-stone-900 px-4 py-2 font-sans text-sm font-medium text-white hover:bg-stone-800"
                  >
                    Get tickets
                  </a>
                )}
                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg border border-stone-300 px-4 py-2 font-sans text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    View on map
                  </a>
                )}
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
