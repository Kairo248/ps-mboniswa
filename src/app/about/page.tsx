import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'About | Pastor Vincent Mboniswa',
  description:
    'About Pastor Vincent Mboniswa — South African gospel artist, hymns & melodies, Xhosa worship, and ministry.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 md:text-4xl">
            About Pastor Vincent Mboniswa
          </h1>

          <figure className="mt-8 overflow-hidden rounded-2xl bg-stone-100">
            <Image
              src="/v-about.jpeg"
              alt="Pastor Vincent Mboniswa"
              width={800}
              height={1000}
              className="aspect-[4/5] w-full object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </figure>

          <p className="mt-8 font-sans text-base leading-relaxed text-stone-700">
            Pastor Vincent Mboniswa is a South African gospel artist and pastor who
            serves through hymn-based music, teaching, and ministry. He creates and
            performs primarily in African languages, with many of his songs featuring
            Xhosa lyrics—bringing timeless truths and worship into the heart of
            local expression.
          </p>

          <section className="mt-10">
            <h2 className="font-serif text-xl font-medium text-stone-900">
              Music & Ministry
            </h2>
            <p className="mt-3 font-sans text-base leading-relaxed text-stone-700">
              His work centers on the{' '}
              <strong className="font-semibold text-stone-800">
                Hymns & Melodies
              </strong>{' '}
              series—recorded projects that blend classic hymnody with fresh
              arrangements and live worship. Beloved tracks include{' '}
              <span className="italic text-stone-600">Aneliswe (Live)</span>,{' '}
              <span className="italic text-stone-600">Thixo Ulilanga</span>,{' '}
              <span className="italic text-stone-600">Makabongwe</span>, and{' '}
              <span className="italic text-stone-600">Akumnyama Xha Ukhona</span>.
              His music is available on Apple Music, Spotify, Audiomack, and iHeart.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl font-medium text-stone-900">
              Favorite Scriptures
            </h2>
            <blockquote className="mt-4 border-l-4 border-stone-300 bg-stone-50 py-4 pl-5 pr-4 font-serif text-lg italic leading-relaxed text-stone-800">
              “And we know that in all things God works for the good of those who
              love him, who have been called according to his purpose.”
              <cite className="mt-2 block font-sans text-base not-italic text-stone-600">
                — Romans 8:28 (NIV)
              </cite>
            </blockquote>
            <blockquote className="mt-4 border-l-4 border-stone-300 bg-stone-50 py-4 pl-5 pr-4 font-serif text-lg italic leading-relaxed text-stone-800">
              “For the revelation awaits an appointed time; it speaks of the end
              and will not prove false. Though it linger, wait for it; it will
              certainly come and will not delay.”
              <cite className="mt-2 block font-sans text-base not-italic text-stone-600">
                — Habakkuk 2:3 (NIV)
              </cite>
            </blockquote>
          </section>

          <section className="mt-10 rounded-lg border border-stone-200 bg-stone-50/50 p-5">
            <h2 className="font-serif text-xl font-medium text-stone-900">
              Invite & Book
            </h2>
            <p className="mt-3 font-sans text-base leading-relaxed text-stone-700">
              For bookings, events, or ministry invitations, use the{' '}
              <Link
                href="/book"
                className="font-medium text-stone-900 underline underline-offset-2 hover:text-stone-700"
              >
                booking form
              </Link>{' '}
              to send a message via WhatsApp.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
