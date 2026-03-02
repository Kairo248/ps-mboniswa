'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import type { Itinerary } from '@/types/database';

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const DATE_LOCALE = 'en-ZA';

function ItineraryCard({ event: e }: { event: Itinerary }) {
  const dateStr = new Date(e.event_date).toLocaleDateString(DATE_LOCALE, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Link href={`/events/${e.id}`}>
      <motion.article
        variants={item}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="group block overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        {e.image_url ? (
          <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
            <img
              src={e.image_url}
              alt={e.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-stone-100 flex items-center justify-center">
            <span className="font-sans text-sm text-stone-400">Event</span>
          </div>
        )}
        <div className="p-4 md:p-5">
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-stone-500">
            {dateStr}
          </p>
          <h3 className="mt-1 font-serif text-lg font-medium text-stone-900 md:text-xl group-hover:text-stone-700">
            {e.title}
          </h3>
          {e.location_name && (
            <p className="mt-1 font-sans text-sm text-stone-600">{e.location_name}</p>
          )}
          <p className="mt-2 font-sans text-xs font-medium text-stone-500">
            View details →
          </p>
        </div>
      </motion.article>
    </Link>
  );
}

type ItinerarySectionProps = { items: Itinerary[] };

export function ItinerarySection({ items }: ItinerarySectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="itinerary"
      className="mx-auto max-w-6xl px-4 py-20 md:py-28"
      ref={ref}
    >
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="font-serif text-3xl font-medium text-stone-900 md:text-4xl"
      >
        Upcoming events
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="mt-2 font-sans text-stone-600"
      >
        Where to find Mboniswa live.
      </motion.p>

      {items.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mt-8 font-sans text-stone-500"
        >
          No upcoming events. Check back later.
        </motion.p>
      ) : (
        <motion.div
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          variants={{
            show: {
              transition: { staggerChildren: 0.06, delayChildren: 0.12 },
            },
          }}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((event) => (
            <ItineraryCard key={event.id} event={event} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
