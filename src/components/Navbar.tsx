'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const mainLinks = [
  { href: '/about', label: 'About' },
  { href: '/book', label: 'Book' },
  { href: '/prayer', label: 'Prayer' },
  { href: '#feed', label: 'Listen' },
  { href: '#contact', label: 'Contact' },
];

function MediaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const linkActive = (href: string) => {
    if (href.startsWith('#')) return false;
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-stone-950/92 shadow-[0_1px_0_rgba(212,175,55,0.12)] backdrop-blur-md">
      {/* Top utility bar */}
      <div className="border-b border-white/5 bg-black/60">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-6 px-4 py-2">
          <a
            href="#feed"
            className="inline-flex items-center gap-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-gold-400 transition hover:text-gold-300"
          >
            <MediaIcon className="text-gold-400" />
            Media
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-gold-400 transition hover:text-gold-300"
          >
            <MailIcon className="text-gold-400" />
            Contact us
          </a>
        </div>
      </div>

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link href="/" className="group flex flex-col leading-tight">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-400 md:text-[11px]">
            Gospel · Music · Ministry
          </span>
          <span className="font-sans text-lg font-medium tracking-[0.06em] text-white md:text-xl">
            Pastor V Mboniswa
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex lg:gap-2">
          {mainLinks.map((link) => {
            const active = linkActive(link.href);
            const className = `px-3 pb-2 pt-1 font-sans text-[13px] font-medium uppercase tracking-[0.12em] transition ${
              active ? 'text-gold-400' : 'text-white/90 hover:text-gold-300'
            }`;
            const inner = (
              <span className="relative inline-block">
                {link.label}
                {active ? (
                  <span className="absolute -bottom-0.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[5px] border-b-[6px] border-x-transparent border-b-gold-400" />
                ) : null}
              </span>
            );
            return link.href.startsWith('#') ? (
              <a key={link.href} href={link.href} className={className}>
                {inner}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className={className}>
                {inner}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-white/5 text-white md:hidden"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="relative block h-3.5 w-3.5">
            <span
              className={`absolute inset-x-0 top-0 h-0.5 rounded-full bg-white transition-transform ${
                open ? 'translate-y-1.5 rotate-45' : ''
              }`}
            />
            <span
              className={`absolute inset-x-0 top-1.5 h-0.5 rounded-full bg-white transition-opacity ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute inset-x-0 top-3 h-0.5 rounded-full bg-white transition-transform ${
                open ? '-translate-y-1.5 -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/10 bg-stone-950 md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col px-4 py-3">
              {mainLinks.map((link) => {
                const active = linkActive(link.href);
                const cls = `rounded px-2 py-2.5 font-sans text-sm font-medium uppercase tracking-widest ${
                  active ? 'bg-white/10 text-gold-400' : 'text-white/90 hover:bg-white/5'
                }`;
                return link.href.startsWith('#') ? (
                  <a key={link.href} href={link.href} onClick={() => setOpen(false)} className={cls}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={cls}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
