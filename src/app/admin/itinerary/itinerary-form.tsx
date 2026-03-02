'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import type { Itinerary } from '@/types/database';
import type { ItineraryFormState } from '../actions/itinerary';

type Action = (prev: ItineraryFormState, formData: FormData) => Promise<ItineraryFormState>;

type Props = {
  action: Action;
  initial?: Itinerary | null;
};

function toLocalDateTime(iso: string) {
  try {
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

export function ItineraryForm({ action, initial }: Props) {
  const [state, formAction] = useActionState(action, {} as ItineraryFormState);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (filePreview) URL.revokeObjectURL(filePreview);
    if (!file) {
      setFilePreview(null);
      return;
    }
    setFilePreview(URL.createObjectURL(file));
  };

  const previewSrc = filePreview ?? initial?.image_url ?? null;

  return (
    <form action={formAction} className="max-w-xl flex flex-col gap-4">
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-700">Title *</span>
        <input
          type="text"
          name="title"
          required
          defaultValue={initial?.title}
          className="border border-neutral-300 rounded-lg px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-700">Event date & time *</span>
        <input
          type="datetime-local"
          name="event_date"
          required
          defaultValue={initial ? toLocalDateTime(initial.event_date) : ''}
          className="border border-neutral-300 rounded-lg px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-700">Location name</span>
        <input
          type="text"
          name="location_name"
          defaultValue={initial?.location_name ?? ''}
          className="border border-neutral-300 rounded-lg px-3 py-2"
          placeholder="Venue or city"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-700">Location coordinates</span>
        <input
          type="text"
          name="location_coord"
          defaultValue={initial?.location_coord ?? ''}
          className="border border-neutral-300 rounded-lg px-3 py-2"
          placeholder="e.g. -26.2041, 28.0473 or address"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-700">Ticket link</span>
        <input
          type="url"
          name="ticket_link"
          defaultValue={initial?.ticket_link ?? ''}
          className="border border-neutral-300 rounded-lg px-3 py-2"
          placeholder="https://..."
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-700">Image (upload)</span>
        <input
          type="file"
          name="image_file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="border border-neutral-300 rounded-lg px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-800 file:px-4 file:py-2 file:text-white file:text-sm"
        />
        <span className="text-xs text-neutral-500 mt-0.5">JPEG, PNG, GIF, WebP. Max 10 MB.</span>
        {previewSrc && (
          <div className="mt-2 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50 aspect-video max-w-sm">
            <img
              src={previewSrc}
              alt="Preview"
              className="h-full w-full object-contain"
            />
          </div>
        )}
      </label>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800"
        >
          {initial ? 'Save changes' : 'Add event'}
        </button>
        <a
          href="/admin/itinerary"
          className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
