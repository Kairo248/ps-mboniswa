import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'About | Mboniswa',
  description: 'About Mboniswa — gospel artist and pastor.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 md:text-4xl">
            About
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-stone-700">
            Mboniswa is a gospel artist and pastor, serving through music, teaching,
            and ministry. This space brings together live moments, recorded
            projects, and upcoming appearances so you can stay close to the
            journey.
          </p>
          <p className="mt-4 font-sans text-base leading-relaxed text-stone-700">
            For bookings or invitations, use the{' '}
            <Link
              href="/book"
              className="font-medium text-stone-900 underline underline-offset-2 hover:text-stone-700"
            >
              booking form
            </Link>
            {' '}to send a message via WhatsApp.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
