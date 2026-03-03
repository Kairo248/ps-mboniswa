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

function BentoCard({
  item: feedItem,
}: {
  item: ContentFeed;
  index: number;
}) {
  const isHot = feedItem.status_tag === 'Hot';
  const mediaIsImage = feedItem.media_url ? isImageUrl(feedItem.media_url) : false;

  return (
    <motion.article
      variants={item}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md flex flex-col ${CARD_ASPECT} min-h-0`}
    >
      {feedItem.media_url && mediaIsImage ? (
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
      )}
      <div className="flex flex-col gap-1 p-2 min-[768px]:p-4 flex-shrink-0 min-h-0 overflow-hidden flex-1 min-[768px]:flex-none">
        <span className="font-sans text-[10px] min-[768px]:text-xs font-medium uppercase tracking-widest text-stone-500">
          {feedItem.category}
        </span>
        <h3 className="font-serif text-sm md:text-xl font-medium text-stone-900 line-clamp-1 md:line-clamp-2">
          {feedItem.title}
        </h3>
        {feedItem.description && (
          <p className="font-sans text-xs min-[768px]:text-sm leading-relaxed text-stone-600 line-clamp-1 min-[768px]:line-clamp-2 hidden min-[768px]:block">
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
          {feedItem.media_url && !mediaIsImage && (
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
    <section id="feed" className="mx-auto max-w-6xl px-4 py-20 md:py-28" ref={ref}>
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
      ) : (
        <div className="mt-12 space-y-8 md:space-y-10">
          {(() => {
            const hotItems = items.filter((i) => i.status_tag === 'Hot');
            const regularItems = items.filter((i) => i.status_tag !== 'Hot');

            return (
              <>
                {hotItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="relative -mx-4 px-4 md:-mx-6 md:px-6"
                  >
                    <h3 className="font-sans text-sm font-medium uppercase tracking-widest text-stone-500 mb-3">
                      Hot
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth md:gap-6">
                      {hotItems.map((feedItem, index) => (
                        <div
                          key={feedItem.id}
                          className="flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_45%] lg:flex-[0_0_380px] snap-start"
                        >
                          <BentoCard item={feedItem} index={index} />
                        </div>
                      ))}
                    </div>
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
                        <BentoCard item={feedItem} index={index} />
                      </div>
                    ))}
                  </motion.div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </section>
  );
}
