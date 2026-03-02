import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200/70 bg-cream/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-xs sm:text-sm">
          © {year} Mboniswa. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
          <Link href="/about" className="hover:text-stone-900">
            About
          </Link>
          <span className="hidden text-stone-300 sm:inline">•</span>
          <Link href="/book" className="hover:text-stone-900">
            Book
          </Link>
          <span className="hidden text-stone-300 sm:inline">•</span>
          <a href="#contact" className="hover:text-stone-900">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

