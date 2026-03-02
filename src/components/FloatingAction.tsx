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
                href="#request-prayer"
                className="rounded-full border border-stone-200 bg-white px-5 py-2.5 font-sans text-sm font-medium text-stone-800 shadow-lg ring-1 ring-stone-900/5 block"
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
                href="#book-artist"
                className="rounded-full border border-stone-200 bg-white px-5 py-2.5 font-sans text-sm font-medium text-stone-800 shadow-lg ring-1 ring-stone-900/5 block"
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
                className="rounded-full border border-stone-200 bg-white px-5 py-2.5 font-sans text-sm font-medium text-stone-800 shadow-lg ring-1 ring-stone-900/5 block"
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
        className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-white shadow-lg ring-1 ring-stone-900/10 transition-shadow hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-stone-400"
        aria-expanded={expanded}
        aria-label={expanded ? 'Close menu' : 'Open menu'}
        whileTap={{ scale: 0.96 }}
      >
        <motion.span
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl leading-none"
        >
          +
        </motion.span>
      </motion.button>
    </div>
  );
}
