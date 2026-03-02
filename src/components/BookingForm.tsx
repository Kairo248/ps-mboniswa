'use client';

import { useState } from 'react';

const EVENT_TYPES = [
  'Concert / Live performance',
  'Church service / Ministry',
  'Conference / Event',
  'Other',
];

function buildWhatsAppMessage(form: {
  name: string;
  phone: string;
  eventType: string;
  preferredDate: string;
  message: string;
}): string {
  const lines = [
    '*Booking request*',
    '',
    `Name: ${form.name}`,
    `Phone: ${form.phone || '—'}`,
    `Event type: ${form.eventType}`,
    `Preferred date: ${form.preferredDate || '—'}`,
    '',
    form.message ? `Message:\n${form.message}` : '',
  ].filter(Boolean);
  return lines.join('\n');
}

export function BookingForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = buildWhatsAppMessage({
      name: name.trim(),
      phone: phone.trim(),
      eventType,
      preferredDate: preferredDate.trim(),
      message: message.trim(),
    });
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isValid = name.trim().length > 0 && whatsappNumber.length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      {!whatsappNumber && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          WhatsApp number is not configured. Set NEXT_PUBLIC_WHATSAPP_NUMBER in your environment.
        </p>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-stone-700">Your name *</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-lg border border-stone-300 px-3 py-2 font-sans text-stone-900"
          placeholder="e.g. John Doe"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-stone-700">Phone (optional)</span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 font-sans text-stone-900"
          placeholder="e.g. 071 234 5678"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-stone-700">Event type</span>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 font-sans text-stone-900"
        >
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-stone-700">Preferred date</span>
        <input
          type="text"
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 font-sans text-stone-900"
          placeholder="e.g. 15 March 2025 or TBC"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-stone-700">Message / details</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="rounded-lg border border-stone-300 px-3 py-2 font-sans text-stone-900"
          placeholder="Venue, expected audience, special requests..."
        />
      </label>
      <button
        type="submit"
        disabled={!isValid}
        className="mt-2 rounded-lg bg-stone-900 px-4 py-3 font-sans text-sm font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Open in WhatsApp
      </button>
      <p className="text-xs text-stone-500">
        You will be taken to WhatsApp with your message ready to send. Complete the booking by sending the message there.
      </p>
    </form>
  );
}
