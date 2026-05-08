import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-stone-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-stone-400 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-xs uppercase tracking-widest text-stone-500 sm:text-sm">
          © {year} Pastor V Mboniswa
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs sm:text-sm">
          <Link href="/about" className="uppercase tracking-widest text-gold-400/90 hover:text-gold-300">
            About
          </Link>
          <Link href="/book" className="uppercase tracking-widest text-gold-400/90 hover:text-gold-300">
            Book
          </Link>
          <a href="#contact" className="uppercase tracking-widest text-gold-400/90 hover:text-gold-300">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
