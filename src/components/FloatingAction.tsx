'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function FloatingAction() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/prayer"
                className="block rounded-full border border-gold-500/40 bg-stone-900 px-5 py-2.5 font-sans text-sm font-medium text-white shadow-lg ring-1 ring-gold-500/20"
              >
                Request Prayer
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, delay: 0.03 }}
            >
              <Link
                href="/book"
                className="block rounded-full border border-gold-500/40 bg-stone-900 px-5 py-2.5 font-sans text-sm font-medium text-white shadow-lg ring-1 ring-gold-500/20"
              >
                Book Artist
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, delay: 0.06 }}
            >
              <Link
                href="/admin"
                className="block rounded-full border border-white/20 bg-stone-900 px-5 py-2.5 font-sans text-sm font-medium text-stone-300 shadow-lg"
              >
                Admin
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/50 bg-stone-950 text-gold-400 shadow-lg transition-shadow hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gold-500/60"
        aria-expanded={expanded}
        aria-label={expanded ? 'Close menu' : 'Open menu'}
        whileTap={{ scale: 0.96 }}
      >
        <motion.span
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl leading-none text-white"
        >
          +
        </motion.span>
      </motion.button>
    </div>
  );
}
