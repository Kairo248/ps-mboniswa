'use client';

import { useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import type { ContentCategory, ContentFeed } from '@/types/database';
import { filterContentFeedByQuery } from '@/lib/feed-search';

const CARD_SURFACE =
  'rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-stone-100/80 transition-shadow hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)]';

const FEED_CATEGORY_TAG: Record<ContentCategory, string> = {
  Sermon: 'bg-emerald-100 text-emerald-800',
  Music: 'bg-indigo-100 text-indigo-800',
  Event: 'bg-sky-100 text-sky-800',
};

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

function isHotEvent(item: ContentFeed): boolean {
  return item.category === 'Event' && item.status_tag === 'Hot';
}

/** Hot + Event: full-width media in a rounded “hero card” with itinerary-style type. */
function HotEventSpotlight({ item: ev }: { item: ContentFeed }) {
  const mediaIsImage = ev.media_url ? isImageUrl(ev.media_url) : false;

  return (
    <section
      className={`relative min-h-[72vh] overflow-hidden sm:min-h-[76vh] md:min-h-[78vh] ${CARD_SURFACE}`}
    >
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
          <h3 className="mt-5 font-sans text-4xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-md md:text-5xl lg:text-6xl">
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
              className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-5 py-2.5 font-sans text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50"
            >
              View event
            </Link>
            {ev.media_url ? (
              <a
                href={ev.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-white/45 bg-white/10 px-5 py-2.5 font-sans text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
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
    <section className={`relative overflow-hidden ${CARD_SURFACE}`}>
      <div className="relative grid grid-cols-1 md:grid-cols-5">
        <div className="flex flex-col justify-center p-6 md:col-span-2 md:p-8">
          <div className="h-0.5 w-12 rounded-full bg-red-500" aria-hidden />
          <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-md bg-amber-100 px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-amber-900">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Promo
          </div>
          <h3 className="mt-3 font-sans text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
            {promo.title}
          </h3>
          {promo.description ? (
            <p className="mt-3 font-sans text-sm leading-relaxed text-stone-600 md:text-base line-clamp-4">
              {promo.description}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/content/${promo.id}`}
              className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-2 font-sans text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50"
            >
              View details
            </Link>
            {promo.media_url ? (
              <a
                href={promo.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 font-sans text-sm font-medium text-stone-800 transition hover:bg-stone-100"
              >
                {mediaIsImage ? 'Open image' : 'Open video'}
              </a>
            ) : null}
          </div>
        </div>

        <div className="relative md:col-span-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 md:aspect-auto md:min-h-[280px]">
            {promo.media_url ? (
              mediaIsImage ? (
                <img src={promo.media_url} alt="" className="h-full w-full object-cover md:absolute md:inset-0" />
              ) : (
                <video
                  src={promo.media_url}
                  controls
                  preload="metadata"
                  className="h-full w-full object-cover md:absolute md:inset-0"
                />
              )
            ) : (
              <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
                <span className="font-sans text-sm font-medium text-stone-500">Promo</span>
              </div>
            )}
            <div className="pointer-events-none absolute right-3 top-3 overflow-hidden rounded-full border-2 border-white shadow-md ring-1 ring-black/5">
              <Image src="/v-hero.jpeg" alt="" width={44} height={44} className="h-11 w-11 object-cover" sizes="44px" />
            </div>
            <span className="absolute bottom-3 left-3 rounded-md bg-amber-100 px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-amber-900 shadow-sm">
              Featured
            </span>
            <span
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white shadow-md backdrop-blur-[2px]"
              aria-hidden
            >
              <HeartIcon className="shrink-0" />
            </span>
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
  const catTag = FEED_CATEGORY_TAG[feedItem.category];
  const footerLabel = feedItem.status_tag ?? feedItem.category;

  const imageOverlays = (
    <>
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
      {isHot ? (
        <span className="absolute left-3 top-3 rounded-md bg-amber-100 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-amber-900 shadow-sm">
          Hot
        </span>
      ) : null}
      <span
        className={`absolute bottom-3 left-3 rounded-md px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide shadow-sm ${catTag}`}
      >
        {feedItem.category}
      </span>
      <span
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white shadow-md backdrop-blur-[2px]"
        aria-hidden
      >
        <HeartIcon className="shrink-0" />
      </span>
    </>
  );

  if (featured) {
    return (
      <motion.article
        variants={item}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`group relative flex min-h-0 flex-col overflow-hidden md:flex-row ${CARD_SURFACE}`}
      >
        <div className="relative w-full shrink-0 bg-stone-100 md:w-[58%]">
          <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:min-h-[240px]">
            {feedItem.media_url ? (
              mediaIsImage ? (
                <Link href={`/content/${feedItem.id}`} className="block h-full w-full md:absolute md:inset-0">
                  <img
                    src={feedItem.media_url}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </Link>
              ) : (
                <div className="relative h-full w-full md:absolute md:inset-0">
                  <video
                    src={feedItem.media_url}
                    controls
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                </div>
              )
            ) : (
              <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
                <span className="font-sans text-sm text-stone-500">{feedItem.category}</span>
              </div>
            )}
            {imageOverlays}
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center p-5 md:p-7">
          <h3 className="font-sans text-xl font-bold leading-snug text-stone-900 line-clamp-3 md:text-2xl">
            <Link href={`/content/${feedItem.id}`} className="hover:text-stone-700">
              {feedItem.title}
            </Link>
          </h3>
          {feedItem.description ? (
            <p className="mt-3 font-sans text-sm leading-relaxed text-stone-600 line-clamp-3 md:text-base">
              {feedItem.description}
            </p>
          ) : null}
          {feedItem.category === 'Music' &&
            feedItem.platform_links &&
            feedItem.platform_links.length > 0 && (
              <p className="mt-2 font-sans text-xs text-stone-400">
                {feedItem.platform_links.map((p) => p.name).join(' · ')}
              </p>
            )}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
            <Link
              href={`/content/${feedItem.id}`}
              className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-2 font-sans text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50"
            >
              View details
            </Link>
            <span className="font-sans text-sm font-bold text-orange-600">{footerLabel}</span>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      variants={item}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex min-h-0 flex-col overflow-hidden ${CARD_SURFACE}`}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-stone-100">
        {feedItem.media_url ? (
          mediaIsImage ? (
            <Link href={`/content/${feedItem.id}`} className="relative block h-full w-full">
              <img
                src={feedItem.media_url}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 380px"
              />
            </Link>
          ) : (
            <Link href={`/content/${feedItem.id}`} className="relative block h-full w-full">
              <video
                src={feedItem.media_url}
                muted
                preload="metadata"
                className="h-full w-full object-cover"
                playsInline
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/25">
                <span className="rounded-full bg-white/95 px-3 py-1.5 font-sans text-xs font-semibold text-stone-900 shadow-md">
                  Watch
                </span>
              </span>
            </Link>
          )
        ) : (
          <Link
            href={`/content/${feedItem.id}`}
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300 transition hover:opacity-95"
          >
            <span className="font-sans text-sm font-medium text-stone-500">{feedItem.category}</span>
          </Link>
        )}
        {imageOverlays}
      </div>

      <div className="flex flex-col p-4 md:p-5">
        <h3 className="font-sans text-base font-bold leading-snug text-stone-900 line-clamp-2 md:text-[1.05rem]">
          <Link href={`/content/${feedItem.id}`} className="hover:text-stone-700">
            {feedItem.title}
          </Link>
        </h3>
        {feedItem.description ? (
          <p className="mt-2 font-sans text-sm leading-relaxed text-stone-500 line-clamp-2 md:line-clamp-3">
            {feedItem.description}
          </p>
        ) : null}
        {feedItem.category === 'Music' &&
          feedItem.platform_links &&
          feedItem.platform_links.length > 0 && (
            <p className="mt-2 font-sans text-xs text-stone-400 line-clamp-1">
              {feedItem.platform_links.map((p) => p.name).join(' · ')}
            </p>
          )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-4">
          <Link
            href={`/content/${feedItem.id}`}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white px-3 py-2 font-sans text-xs font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50 min-[768px]:px-4 min-[768px]:text-sm"
          >
            View details
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {feedItem.media_url && !mediaIsImage ? (
              <a
                href={feedItem.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs font-semibold text-orange-600 underline decoration-orange-600/30 underline-offset-2 hover:text-orange-700 min-[768px]:text-sm"
              >
                Open video
              </a>
            ) : null}
            <span className="text-right font-sans text-xs font-bold text-orange-600 min-[768px]:text-sm">
              {footerLabel}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

type BentoFeedProps = { items: ContentFeed[] };

export function BentoFeed({ items }: BentoFeedProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const searchParams = useSearchParams();
  const q = searchParams.get('q')?.trim() ?? '';
  const filteredItems = useMemo(() => filterContentFeedByQuery(items, q), [items, q]);

  return (
    <section
      id="feed"
      className="scroll-mt-[120px] overflow-x-clip border-t border-gold-500/25 bg-[#f4f1eb] pt-14 pb-20 md:pt-16 md:pb-28"
      ref={ref}
    >
      <div className="mx-auto max-w-6xl px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="font-sans text-xs font-medium uppercase tracking-[0.28em] text-gold-600"
        >
          Media
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.04 }}
          className="mt-3 font-sans text-3xl font-normal uppercase tracking-[0.12em] text-stone-900 md:text-4xl"
        >
          Sermons, music & events
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 font-sans text-sm text-stone-600 md:text-base"
        >
          Browse the latest from the ministry.
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

      {items.length > 0 && filteredItems.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.45 }}
          className="mx-auto mt-10 max-w-xl px-4 text-center font-sans text-stone-600"
        >
          No results for &ldquo;{q}&rdquo;. Try different words, or{' '}
          <a href="/#feed" className="font-medium text-gold-700 underline decoration-gold-400/40 underline-offset-2">
            clear the search
          </a>
          .
        </motion.p>
      ) : null}

      {items.length > 0 && filteredItems.length > 0 ? (
        <div className="mt-12 space-y-8 md:space-y-10">
          {(() => {
            const promoItems = filteredItems.filter((i) => i.status_tag === 'Promo');
            const promo = promoItems[0] ?? null;
            const remaining = promo ? filteredItems.filter((i) => i.id !== promo.id) : filteredItems;

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
                  <div className="relative w-[100vw] max-w-[100vw] ml-[calc(50%-50vw)] px-3 sm:px-4 md:px-6">
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
