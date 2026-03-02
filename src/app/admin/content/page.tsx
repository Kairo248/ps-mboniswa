import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ContentDeleteButton } from './content-delete-button';
import type { ContentFeed } from '@/types/database';

export default async function ContentFeedPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('content_feed')
    .select('id, title, category, status_tag, created_at')
    .order('created_at', { ascending: false });
  const items = (data ?? []) as Pick<ContentFeed, 'id' | 'title' | 'category' | 'status_tag' | 'created_at'>[];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Content Feed</h1>
          <p className="text-neutral-600 text-sm mt-1">Sermons, music, and events</p>
        </div>
        <Link
          href="/admin/content/new"
          className="shrink-0 px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 w-fit"
        >
          Add content
        </Link>
      </div>

      {!items?.length ? (
        <p className="text-neutral-500 py-8">No content yet. Add your first item above.</p>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="md:hidden flex flex-col gap-3">
            {items.map((row) => (
              <div
                key={row.id}
                className="border border-neutral-200 rounded-xl p-4 flex flex-col gap-2"
              >
                <Link href={`/admin/content/${row.id}/edit`} className="font-medium text-neutral-900 hover:underline">
                  {row.title}
                </Link>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-neutral-600">{row.category}</span>
                  {row.status_tag && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-200 text-neutral-800">
                      {row.status_tag}
                    </span>
                  )}
                  <span className="text-neutral-500">{new Date(row.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Link href={`/admin/content/${row.id}/edit`} className="text-sm text-neutral-600 hover:underline">
                    Edit
                  </Link>
                  <ContentDeleteButton id={row.id} />
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: table */}
          <div className="hidden md:block border border-neutral-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-neutral-700">Title</th>
                  <th className="px-4 py-3 text-sm font-medium text-neutral-700">Category</th>
                  <th className="px-4 py-3 text-sm font-medium text-neutral-700">Status</th>
                  <th className="px-4 py-3 text-sm font-medium text-neutral-700">Created</th>
                  <th className="px-4 py-3 text-sm font-medium text-neutral-700 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/admin/content/${row.id}/edit`} className="font-medium text-neutral-900 hover:underline">
                        {row.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 text-sm">{row.category}</td>
                    <td className="px-4 py-3">
                      {row.status_tag ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-200 text-neutral-800">
                          {row.status_tag}
                        </span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-sm">
                      {new Date(row.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/content/${row.id}/edit`} className="text-sm text-neutral-600 hover:underline">
                          Edit
                        </Link>
                        <ContentDeleteButton id={row.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
