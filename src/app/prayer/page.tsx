import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PrayerRequestForm } from '@/components/PrayerRequestForm';

export const metadata = {
  title: 'Prayer request | Mboniswa',
  description:
    'Submit a prayer request to Pastor Vincent Mboniswa — we will pray for you.',
};

export default function PrayerPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 md:text-4xl">
            Prayer request
          </h1>
          <p className="mt-2 font-sans text-stone-600">
            Share your need with us. You will be taken to WhatsApp to send your prayer request.
          </p>
          <div className="mt-8">
            <PrayerRequestForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
