'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';


export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/v-hero.jpeg"
          alt="Pastor Vincent Mboniswa"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-stone-950/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-4 max-w-2xl rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-12"
      >
        <h1 className="font-serif text-4xl font-medium tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">
          Pastor Mboniswa
        </h1>
        <p className="mt-4 font-sans text-lg leading-relaxed text-white/95 md:text-xl">
          Gospel artist & pastor. Music, ministry, and presence for every season.
        </p>
        <p className="mt-5 font-sans text-sm uppercase tracking-widest text-white/80">
          Listen · Worship · Connect
        </p>
      </motion.div>
    </section>
  );
}
