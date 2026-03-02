import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getContentById } from '@/lib/content';

function isImageUrl(url: string): boolean {
  try {
    const path = new URL(url).pathname.toLowerCase();
    return /\.(jpe?g|png|gif|webp)(\?|$)/.test(path);
  } catch {
    return false;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getContentById(id);
  if (!item) return { title: 'Content | Mboniswa' };
  return {
    title: `${item.title} | Mboniswa`,
    description: item.description ?? undefined,
  };
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getContentById(id);
  if (!item) notFound();

  const mediaIsImage = item.media_url ? isImageUrl(item.media_url) : false;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-4">
          <Link
            href="/#feed"
            className="font-sans text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            ← Back to feed
          </Link>

          <article className="mt-6 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
            {item.media_url && mediaIsImage && (
              <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                <img
                  src={item.media_url}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-6 md:p-8">
              <span className="font-sans text-xs font-medium uppercase tracking-widest text-stone-500">
                {item.category}
              </span>
              {item.status_tag && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 font-sans text-xs font-medium text-amber-800">
                  {item.status_tag}
                </span>
              )}
              <h1 className="mt-2 font-serif text-2xl font-medium text-stone-900 md:text-3xl">
                {item.title}
              </h1>
              {item.description && (
                <p className="mt-4 font-sans text-base leading-relaxed text-stone-700">
                  {item.description}
                </p>
              )}
              {item.media_url && (
                <a
                  href={item.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block rounded-lg bg-stone-900 px-4 py-2 font-sans text-sm font-medium text-white hover:bg-stone-800"
                >
                  {mediaIsImage ? 'View image' : 'Watch / Listen'}
                </a>
              )}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
