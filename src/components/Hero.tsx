'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { FeedSearchForm } from '@/components/FeedSearchForm';

function IconWatch({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" fill="currentColor" />
    </svg>
  );
}

function IconPrayer({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function IconBooking({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 16l2 2 4-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconEvents({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 16l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroSearchFallback() {
  return (
    <div className="mt-10 flex w-full max-w-xl mx-auto items-center border border-white/55 bg-white/5 px-5 py-3.5 opacity-90 md:py-4">
      <span className="font-sans text-sm font-medium uppercase tracking-[0.2em] text-white/55">
        Search
      </span>
    </div>
  );
}

const YOUTUBE_CHANNEL = 'https://www.youtube.com/channel/UCFJkyuDyyPcZ6n42B5Segjg';

const tiles = [
  { href: YOUTUBE_CHANNEL, label: 'Watch', Icon: IconWatch },
  { href: '/prayer', label: 'Prayer', Icon: IconPrayer },
  { href: '/book', label: 'Booking', Icon: IconBooking },
  { href: '#itinerary', label: 'Events', Icon: IconEvents },
] as const;

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-[108px] md:pt-[116px]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/v-hero.jpeg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-stone-950/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-transparent to-stone-950/75" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,175,55,0.08),transparent_55%)]" />
      </div>

      {/* Carousel-style dots (decorative) */}
      <div
        className="pointer-events-none absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2.5 md:left-6 md:flex lg:left-10"
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`block h-2 w-2 rounded-full ${i === 0 ? 'bg-gold-400' : 'bg-white/35'}`}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-24 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <h1 className="font-sans text-3xl font-normal uppercase tracking-[0.14em] text-white drop-shadow-sm sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-tight">
            Welcome to the ministry
          </h1>
          <p className="mt-4 font-sans text-sm font-medium uppercase tracking-[0.28em] text-gold-400 md:text-base">
            What can we help you find?
          </p>

          <Suspense fallback={<HeroSearchFallback />}>
            <FeedSearchForm variant="hero" />
          </Suspense>

          <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {tiles.map(({ href, label, Icon }) => {
              const tileClass =
                'flex flex-col items-center justify-center gap-3 border border-white/25 bg-white/10 px-3 py-8 text-center backdrop-blur-sm transition hover:border-gold-400/40 hover:bg-white/15 md:min-h-[140px] md:py-10';
              const inner = (
                <>
                  <Icon className="text-white" />
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white md:text-xs">
                    {label}
                  </span>
                </>
              );
              if (href.startsWith('http')) {
                return (
                  <a
                    key={href + label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={tileClass}
                  >
                    {inner}
                  </a>
                );
              }
              if (href.startsWith('#')) {
                return (
                  <a key={href + label} href={href} className={tileClass}>
                    {inner}
                  </a>
                );
              }
              return (
                <Link key={href + label} href={href} className={tileClass}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      <a
        href="#feed"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center border border-white/35 bg-white/10 p-2.5 text-white/90 backdrop-blur-sm transition hover:border-gold-400/50 hover:text-gold-400"
        aria-label="Scroll to feed"
      >
        <ChevronDown className="animate-bounce" />
      </a>
    </section>
  );
}
