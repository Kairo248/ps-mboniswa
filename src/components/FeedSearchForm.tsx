'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = { variant: 'hero' | 'feed' };

const DEBOUNCE_MS = 240;

function useDebouncedSearchUrl(
  value: string,
  router: ReturnType<typeof useRouter>,
  qInUrl: string
) {
  useEffect(() => {
    const id = window.setTimeout(() => {
      const trimmed = value.trim();
      const current = qInUrl.trim();
      if (trimmed === current) return;
      const next = trimmed
        ? `/?q=${encodeURIComponent(trimmed)}#feed`
        : '/#feed';
      router.replace(next, { scroll: false });
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [value, router, qInUrl]);
}

export function FeedSearchForm({ variant }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQ = searchParams.get('q') ?? '';
  const [value, setValue] = useState(urlQ);

  useEffect(() => {
    setValue(urlQ);
  }, [urlQ]);

  useDebouncedSearchUrl(value, router, urlQ);

  function syncToUrlNow() {
    const trimmed = value.trim();
    const current = (searchParams.get('q') ?? '').trim();
    if (trimmed === current) return;
    const next = trimmed ? `/?q=${encodeURIComponent(trimmed)}#feed` : '/#feed';
    router.replace(next, { scroll: false });
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    syncToUrlNow();
  }

  function clear() {
    setValue('');
    router.replace('/#feed', { scroll: false });
  }

  const isHero = variant === 'hero';
  const showClear = !isHero && value.trim().length > 0;

  return (
    <form
      role="search"
      onSubmit={submit}
      className={
        isHero
          ? 'group mt-10 flex w-full max-w-xl mx-auto items-center gap-3 border border-white/55 bg-white/5 px-5 py-3.5 backdrop-blur-[2px] transition hover:border-gold-400/60 hover:bg-white/10 md:py-4'
          : 'mx-auto mt-8 flex max-w-xl items-center gap-2 border border-gold-500/35 bg-white px-4 py-3 shadow-sm'
      }
    >
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search messages, music & events"
        autoComplete="off"
        className={
          isHero
            ? 'min-w-0 flex-1 bg-transparent font-sans text-sm text-white placeholder:text-white/45 outline-none md:text-base'
            : 'min-w-0 flex-1 bg-transparent font-sans text-sm text-stone-900 placeholder:text-stone-400 outline-none md:text-base'
        }
        aria-label="Search media"
      />
      {showClear ? (
        <button
          type="button"
          onClick={clear}
          className="shrink-0 rounded border border-stone-200 px-2 py-1 font-sans text-xs font-medium uppercase tracking-wider text-stone-600 hover:bg-stone-50"
        >
          Clear
        </button>
      ) : null}
      <span
        className={
          isHero
            ? 'shrink-0 text-white/80 pointer-events-none'
            : 'shrink-0 text-stone-500 pointer-events-none'
        }
        aria-hidden
      >
        <SearchIcon />
      </span>
    </form>
  );
}
