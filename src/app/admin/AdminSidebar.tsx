'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutForm } from './sign-out-form';

const navLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/content', label: 'Content Feed' },
  { href: '/admin/itinerary', label: 'Itinerary' },
];

export function AdminSidebar({ userEmail }: { userEmail?: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex md:hidden items-center justify-between gap-2 border-b border-neutral-200 bg-white px-4 py-3 sticky top-0 z-30">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-semibold text-neutral-800">Admin</span>
        <span className="w-10" aria-hidden />
      </div>

      {/* Overlay when drawer is open */}
      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          aria-label="Close menu"
        />
      )}

      {/* Sidebar: drawer on mobile, fixed sidebar on desktop */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 md:z-auto
          w-64 md:w-56 flex flex-col border-r border-neutral-200 bg-neutral-50
          transform transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-4 md:pt-4 border-b md:border-b-0 border-neutral-200">
          <h2 className="font-semibold text-neutral-800">Admin</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-200 md:hidden"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm ${
                pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
                  ? 'bg-neutral-200 text-neutral-900 font-medium'
                  : 'text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4 pt-4 border-t border-neutral-200">
          <p className="px-3 py-1 text-sm text-neutral-500 truncate" title={userEmail ?? ''}>
            {userEmail}
          </p>
          <SignOutForm />
        </div>
      </aside>
    </>
  );
}
