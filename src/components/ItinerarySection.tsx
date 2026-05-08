'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import type { Itinerary } from '@/types/database';

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const DATE_LOCALE = 'en-ZA';

const TAG_STYLES = [
  'bg-sky-100 text-sky-800',
  'bg-emerald-100 text-emerald-800',
  'bg-indigo-100 text-indigo-800',
] as const;

const TAG_LABELS = ['Ministry', 'Concert', 'Conference'] as const;

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ItineraryCard({ event: e, index }: { event: Itinerary; index: number }) {
  const dateStr = new Date(e.event_date).toLocaleDateString(DATE_LOCALE, {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const tagClass = TAG_STYLES[index % TAG_STYLES.length];
  const tagLabel = TAG_LABELS[index % TAG_LABELS.length];

  return (
    <motion.article
      variants={item}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-[min(100%,300px)] shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-stone-100/80"
    >
      <Link href={`/events/${e.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
          {e.image_url ? (
            <img
              src={e.image_url}
              alt=""
              className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
              <span className="font-sans text-sm font-medium text-stone-500">Event</span>
            </div>
          )}
          <div className="pointer-events-none absolute right-3 top-3 overflow-hidden rounded-full border-2 border-white shadow-md ring-1 ring-black/5">
            <Image
              src="/v-hero.jpeg"
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 object-cover"
              sizes="44px"
            />
          </div>
          <span
            className={`absolute bottom-3 left-3 rounded-md px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide shadow-sm ${tagClass}`}
          >
            {tagLabel}
          </span>
          <span
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white shadow-md backdrop-blur-[2px]"
            aria-hidden
          >
            <HeartIcon className="shrink-0" />
          </span>
        </div>
      </Link>

      <div className="p-4 md:p-5">
        <Link href={`/events/${e.id}`}>
          <h3 className="font-sans text-base font-bold leading-snug text-stone-900 line-clamp-2 hover:text-stone-700 md:text-[1.05rem]">
            {e.title}
          </h3>
        </Link>

        <div className="mt-3 space-y-2">
          <p className="flex items-start gap-2 font-sans text-sm leading-snug text-stone-500">
            <ClockIcon className="mt-0.5 shrink-0 text-stone-400" />
            {dateStr}
          </p>
          {e.location_name ? (
            <p className="flex items-start gap-2 font-sans text-sm leading-snug text-stone-500">
              <PinIcon className="mt-0.5 shrink-0 text-stone-400" />
              {e.location_name}
            </p>
          ) : (
            <p className="flex items-start gap-2 font-sans text-sm leading-snug text-stone-400">
              <PinIcon className="mt-0.5 shrink-0" />
              Location TBA
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
          {e.ticket_link ? (
            <a
              href={e.ticket_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-2 font-sans text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50"
              onClick={(ev) => ev.stopPropagation()}
            >
              Get ticket
            </a>
          ) : (
            <Link
              href={`/events/${e.id}`}
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-2 font-sans text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50"
            >
              View details
            </Link>
          )}
          <span className="text-right font-sans text-sm font-bold tabular-nums text-orange-600">
            {e.ticket_link ? 'Tickets' : 'Free'}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

type ItinerarySectionProps = { items: Itinerary[] };

export function ItinerarySection({ items }: ItinerarySectionProps) {
  const ref = useRef(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  function scrollNext() {
    scrollerRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  }

  return (
    <section
      id="itinerary"
      className="scroll-mt-[120px] border-t border-gold-500/20 bg-[#f4f1eb] py-20 md:py-28"
      ref={ref}
    >
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="max-w-2xl"
        >
          <h2 className="font-sans text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
            Upcoming Events
          </h2>
          <div className="mt-3 h-0.5 w-12 rounded-full bg-red-500" aria-hidden />
          <p className="mt-4 font-sans text-sm text-stone-500 md:text-base">
            Featured appearances from the ministry. Choose an event for full details and tickets.
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mt-10 font-sans text-stone-500"
          >
            No upcoming events. Check back later.
          </motion.p>
        ) : (
          <div className="relative mt-10 md:mt-12 md:pr-14">
            <motion.div
              initial="hidden"
              animate={isInView ? 'show' : 'hidden'}
              variants={{
                show: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.08 },
                },
              }}
              ref={scrollerRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 pl-0.5 pt-1 pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {items.map((event, index) => (
                <ItineraryCard key={event.id} event={event} index={index} />
              ))}
            </motion.div>

            <button
              type="button"
              onClick={scrollNext}
              className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 translate-x-1 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-md transition hover:bg-stone-50 md:flex"
              aria-label="Scroll events"
            >
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
