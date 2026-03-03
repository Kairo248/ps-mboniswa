'use client';

import { useState } from 'react';

function buildWhatsAppMessage(form: {
  name: string;
  phone: string;
  request: string;
}): string {
  const lines = [
    '*Prayer request*',
    '',
    `Name: ${form.name}`,
    form.phone ? `Phone: ${form.phone}` : '',
    '',
    form.request ? `Request:\n${form.request}` : '',
  ].filter(Boolean);
  return lines.join('\n');
}

export function PrayerRequestForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [request, setRequest] = useState('');

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = buildWhatsAppMessage({
      name: name.trim(),
      phone: phone.trim(),
      request: request.trim(),
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
          placeholder="How we can call you"
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
        <span className="text-sm font-medium text-stone-700">Prayer request *</span>
        <textarea
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          required
          rows={5}
          className="rounded-lg border border-stone-300 px-3 py-2 font-sans text-stone-900"
          placeholder="Share what you would like us to pray for..."
        />
      </label>
      <button
        type="submit"
        disabled={!isValid}
        className="mt-2 rounded-lg bg-stone-900 px-4 py-3 font-sans text-sm font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send via WhatsApp
      </button>
      <p className="text-xs text-stone-500">
        You will be taken to WhatsApp with your prayer request ready to send. We will pray for you.
      </p>
    </form>
  );
}
