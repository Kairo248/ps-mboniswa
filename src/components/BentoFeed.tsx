'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import type { ContentFeed } from '@/types/database';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function isImageUrl(url: string): boolean {
  try {
    const path = new URL(url).pathname.toLowerCase();
    return /\.(jpe?g|png|gif|webp)(\?|$)/.test(path);
  } catch {
    return false;
  }
}

const CARD_ASPECT = 'aspect-[3/4]';

function isHotEvent(item: ContentFeed): boolean {
  return item.category === 'Event' && item.status_tag === 'Hot';
}

/** Full-bleed hero block for Hot + Event: media only, copy sits on a bottom gradient (no card). */
function HotEventSpotlight({ item: ev }: { item: ContentFeed }) {
  const mediaIsImage = ev.media_url ? isImageUrl(ev.media_url) : false;

  return (
    <section className="relative min-h-[78vh] overflow-hidden sm:min-h-[82vh]">
      <div className="absolute inset-0 z-0">
        {ev.media_url ? (
          mediaIsImage ? (
            <img src={ev.media_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <video
              src={ev.media_url}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          )
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-amber-800 via-stone-900 to-stone-950" />
        )}
        <div className="absolute inset-0 bg-stone-950/25" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-stone-950/92 via-stone-950/55 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,191,36,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 flex min-h-[78vh] flex-col justify-end sm:min-h-[82vh]">
        <div className="mx-auto w-full max-w-3xl px-4 pb-10 pt-20 text-center sm:px-6 md:pb-14 md:pt-28">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300/50 bg-amber-400/20 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
            </span>
            Hot event
          </div>
          <h3 className="mt-5 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-white drop-shadow-md md:text-5xl lg:text-6xl">
            {ev.title}
          </h3>
          {ev.description ? (
            <p className="mt-4 font-sans text-lg leading-relaxed text-white/90 line-clamp-5 md:text-xl">
              {ev.description}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:mt-9">
            <Link
              href={`/content/${ev.id}`}
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 font-sans text-sm font-semibold text-stone-900 shadow-lg transition hover:bg-stone-100"
            >
              View event
            </Link>
            {ev.media_url ? (
              <a
                href={ev.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 font-sans text-sm font-medium text-white transition hover:bg-white/20"
              >
                {mediaIsImage ? 'Open image' : 'Watch / open video'}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function PromoSpotlight({ item: promo }: { item: ContentFeed }) {
  const mediaIsImage = promo.media_url ? isImageUrl(promo.media_url) : false;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 shadow-sm">
      <div className="absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.7),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.55),transparent_45%)]" />
      <div className="relative grid grid-cols-1 md:grid-cols-5">
        <div className="p-6 md:col-span-2 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-sans text-xs font-medium uppercase tracking-widest text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            Promo
          </div>
          <h3 className="mt-3 font-serif text-2xl font-medium tracking-tight text-white md:text-3xl">
            {promo.title}
          </h3>
          {promo.description ? (
            <p className="mt-3 font-sans text-sm leading-relaxed text-white/80 md:text-base line-clamp-4">
              {promo.description}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={`/content/${promo.id}`}
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 font-sans text-sm font-medium text-stone-900 hover:bg-stone-50"
            >
              View details
            </Link>
            {promo.media_url ? (
              <a
                href={promo.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/0 px-4 py-2 font-sans text-sm font-medium text-white hover:bg-white/10"
              >
                {mediaIsImage ? 'Open image' : 'Open video'}
              </a>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-3 bg-black/15">
          <div className="relative aspect-video w-full overflow-hidden">
            {promo.media_url ? (
              mediaIsImage ? (
                <img src={promo.media_url} alt={promo.title} className="h-full w-full object-cover" />
              ) : (
                <video
                  src={promo.media_url}
                  controls
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              )
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-sans text-sm text-white/60">Promo</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  item: feedItem,
  variant = 'regular',
}: {
  item: ContentFeed;
  index: number;
  variant?: 'regular' | 'featured';
}) {
  const isHot = feedItem.status_tag === 'Hot';
  const mediaIsImage = feedItem.media_url ? isImageUrl(feedItem.media_url) : false;
  const featured = variant === 'featured';

  return (
    <motion.article
      variants={item}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md flex flex-col min-h-0 ${
        featured ? 'md:flex-row' : CARD_ASPECT
      }`}
    >
      <div className={featured ? 'relative w-full md:w-[60%] bg-stone-100' : undefined}>
        {feedItem.media_url ? (
          featured ? (
            <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
              {mediaIsImage ? (
                <img
                  src={feedItem.media_url}
                  alt={feedItem.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={feedItem.media_url}
                  controls
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ) : mediaIsImage ? (
            <Link
              href={`/content/${feedItem.id}`}
              className="relative block w-full min-h-0 overflow-hidden bg-stone-100 min-[768px]:flex-[1] flex-[2]"
            >
              <img
                src={feedItem.media_url}
                alt={feedItem.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 380px"
              />
            </Link>
          ) : (
            <div className="flex-[1] min-h-[6rem] bg-stone-100" />
          )
        ) : (
          <div className={featured ? 'aspect-video w-full' : 'flex-[1] min-h-[6rem] bg-stone-100'} />
        )}
      </div>

      <div
        className={`flex flex-col gap-1 p-3 min-[768px]:p-4 flex-shrink-0 min-h-0 overflow-hidden ${
          featured ? 'flex-1 justify-center md:p-6' : 'flex-1 min-[768px]:flex-none'
        }`}
      >
        <span className="font-sans text-[10px] min-[768px]:text-xs font-medium uppercase tracking-widest text-stone-500">
          {feedItem.category}
        </span>
        <h3 className={`font-serif font-medium text-stone-900 ${featured ? 'text-lg md:text-2xl' : 'text-sm md:text-xl'} line-clamp-2`}>
          {feedItem.title}
        </h3>
        {feedItem.description && (
          <p className={`font-sans leading-relaxed text-stone-600 ${featured ? 'text-sm md:text-base line-clamp-3' : 'text-xs min-[768px]:text-sm line-clamp-1 min-[768px]:line-clamp-2 hidden min-[768px]:block'}`}>
            {feedItem.description}
          </p>
        )}
        <div className="mt-1 min-[768px]:mt-2 flex flex-wrap items-center gap-1.5 min-[768px]:gap-2">
          <Link
            href={`/content/${feedItem.id}`}
            className="font-sans text-xs min-[768px]:text-sm font-medium text-stone-700 underline hover:text-stone-900"
          >
            View details
          </Link>
          {feedItem.category === 'Music' && feedItem.platform_links && feedItem.platform_links.length > 0 && (
            <span className="font-sans text-[10px] min-[768px]:text-xs text-stone-500 hidden min-[768px]:inline">
              · {feedItem.platform_links.map((p) => p.name).join(', ')}
            </span>
          )}
          {feedItem.media_url && !mediaIsImage && !featured && (
            <a
              href={feedItem.media_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-medium text-stone-700 underline hover:text-stone-900"
            >
              Watch / Listen
            </a>
          )}
        </div>
      </div>
      {isHot && (
        <span className="absolute right-4 top-4 z-10 rounded-full bg-amber-100 px-2 py-0.5 font-sans text-xs font-medium text-amber-800">
          Hot
        </span>
      )}
    </motion.article>
  );
}

type BentoFeedProps = { items: ContentFeed[] };

export function BentoFeed({ items }: BentoFeedProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="feed" className="overflow-x-clip pt-0 pb-20 md:pb-28" ref={ref}>
      <div className="mx-auto max-w-6xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl font-medium text-stone-900 md:text-4xl"
        >
          Feed
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-2 font-sans text-stone-600"
        >
          Sermons, music, and events.
        </motion.p>

        {items.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mt-12 font-sans text-stone-500"
          >
            No content yet. Add items from the admin.
          </motion.p>
        ) : null}
      </div>

      {items.length > 0 ? (
        <div className="mt-12 space-y-8 md:space-y-10">
          {(() => {
            const promoItems = items.filter((i) => i.status_tag === 'Promo');
            const promo = promoItems[0] ?? null;
            const remaining = promo ? items.filter((i) => i.id !== promo.id) : items;

            const heroHotEvent = remaining.find(isHotEvent) ?? null;
            const hotStripItems =
              heroHotEvent !== null
                ? remaining.filter((i) => i.status_tag === 'Hot' && i.id !== heroHotEvent.id)
                : [];
            const regularItems =
              heroHotEvent !== null
                ? remaining.filter((i) => i.id !== heroHotEvent.id && i.status_tag !== 'Hot')
                : remaining;

            return (
              <>
                {promo && (
                  <div className="mx-auto max-w-6xl px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <PromoSpotlight item={promo} />
                    </motion.div>
                  </div>
                )}

                {heroHotEvent && (
                  <div className="relative w-[100vw] max-w-[100vw] ml-[calc(50%-50vw)]">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <HotEventSpotlight item={heroHotEvent} />
                    </motion.div>
                  </div>
                )}

                {(hotStripItems.length > 0 || regularItems.length > 0) && (
                  <div className="mx-auto max-w-6xl px-4 space-y-8 md:space-y-10">
                    {hotStripItems.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.06 }}
                        className="space-y-4"
                      >
                        <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                          More highlights
                        </p>
                        <motion.div
                          variants={container}
                          initial="hidden"
                          animate={isInView ? 'show' : 'hidden'}
                          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6"
                        >
                          {hotStripItems.map((feedItem, index) => (
                            <div key={feedItem.id} className="min-w-0">
                              <BentoCard item={feedItem} index={index} variant="regular" />
                            </div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}

                    {regularItems.length > 0 && (
                      <motion.div
                        variants={container}
                        initial="hidden"
                        animate={isInView ? 'show' : 'hidden'}
                        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6"
                      >
                        {regularItems.map((feedItem, index) => (
                          <div key={feedItem.id} className="min-w-0">
                            <BentoCard item={feedItem} index={index} variant="regular" />
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      ) : null}
    </section>
  );
}
