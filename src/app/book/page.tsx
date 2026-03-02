import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookingForm } from '@/components/BookingForm';

export const metadata = {
  title: 'Book | Mboniswa',
  description: 'Book Mboniswa for your event — send a booking request via WhatsApp.',
};

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 md:text-4xl">
            Book
          </h1>
          <p className="mt-2 font-sans text-stone-600">
            Fill in the form below. You will be taken to WhatsApp to send your booking request.
          </p>
          <div className="mt-8">
            <BookingForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
