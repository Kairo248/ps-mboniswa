import { Suspense } from 'react';
import { Hero } from '@/components/Hero';
import { BentoFeed } from '@/components/BentoFeed';
import { ItinerarySection } from '@/components/ItinerarySection';
import { FloatingAction } from '@/components/FloatingAction';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getPublicContentFeed } from '@/lib/content';
import { getPublicItinerary } from '@/lib/itinerary';

function BentoFeedFallback() {
  return (
    <section
      id="feed"
      className="scroll-mt-[120px] border-t border-gold-500/25 bg-[#f4f1eb] py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 text-center font-sans text-sm text-stone-400">
        Loading media…
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [items, itinerary] = await Promise.all([
    getPublicContentFeed(),
    getPublicItinerary(),
  ]);

  return (
    <>
      <Navbar />
      <Hero />
      <main className="relative" id="top">
        <Suspense fallback={<BentoFeedFallback />}>
          <BentoFeed items={items} />
        </Suspense>
        <ItinerarySection items={itinerary} />

        <section
          id="contact"
          className="mx-auto mt-16 max-w-3xl scroll-mt-[120px] px-4 pb-24 text-center text-stone-800 sm:mt-20"
        >
          <p className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-gold-600">
            Get in touch
          </p>
          <h2 className="mt-2 font-sans text-2xl font-normal uppercase tracking-[0.12em] text-stone-900 md:text-3xl">
            Contact
          </h2>
          <p className="mt-5 font-sans text-sm leading-relaxed text-stone-600 md:text-base">
            For invitations, bookings, or prayer requests, use the quick actions in the bottom-right
            corner or send an email to{' '}
            <a
              href="mailto:vincentmboniswa@gmail.com"
              className="font-medium text-gold-700 underline decoration-gold-400/50 underline-offset-4 hover:text-gold-600"
            >
              vincentmboniswa@gmail.com
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
      <FloatingAction />
    </>
  );
}


