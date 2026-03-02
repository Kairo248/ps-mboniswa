import { Hero } from '@/components/Hero';
import { BentoFeed } from '@/components/BentoFeed';
import { ItinerarySection } from '@/components/ItinerarySection';
import { FloatingAction } from '@/components/FloatingAction';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getPublicContentFeed } from '@/lib/content';
import { getPublicItinerary } from '@/lib/itinerary';

export default async function HomePage() {
  const [items, itinerary] = await Promise.all([
    getPublicContentFeed(),
    getPublicItinerary(),
  ]);

  return (
    <>
      <Navbar />
      <Hero />
      <main className="relative pt-20" id="top">
        <BentoFeed items={items} />
        <ItinerarySection items={itinerary} />

        <section
          id="contact"
          className="mx-auto mt-20 max-w-3xl px-4 pb-24 text-stone-800 sm:mt-24"
        >
          <h2 className="font-serif text-2xl font-medium tracking-tight text-stone-900 md:text-3xl">
            Contact
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-stone-700 md:text-base">
            For invitations, bookings, or prayer requests, use the quick actions in
            the bottom-right corner or send an email to
            {' '}
            <a
              href="mailto:bookings@mboniswa.co.za"
              className="font-medium text-stone-900 underline underline-offset-2"
            >
              bookings@mboniswa.co.za
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


