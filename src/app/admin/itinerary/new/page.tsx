import Link from 'next/link';
import { ItineraryForm } from '../itinerary-form';
import { createItinerary } from '../../actions/itinerary';

export default function NewItineraryPage() {
  return (
    <div>
      <div className="mb-6 md:mb-8">
        <Link href="/admin/itinerary" className="text-sm text-neutral-600 hover:underline">
          ← Itinerary
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-2">Add event</h1>
        <p className="text-neutral-600 text-sm mt-1">Upcoming appearance</p>
      </div>
      <ItineraryForm action={createItinerary} />
    </div>
  );
}
