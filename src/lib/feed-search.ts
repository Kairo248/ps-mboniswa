import type { ContentFeed } from '@/types/database';

/** Case-insensitive match across title, description, category, status tag, and music platform names. */
export function filterContentFeedByQuery(items: ContentFeed[], raw: string): ContentFeed[] {
  const q = raw.trim().toLowerCase();
  if (!q) return items;

  return items.filter((item) => {
    if (item.title.toLowerCase().includes(q)) return true;
    if (item.description?.toLowerCase().includes(q)) return true;
    if (item.category.toLowerCase().includes(q)) return true;
    if (item.status_tag?.toLowerCase().includes(q)) return true;
    if (
      item.platform_links?.some(
        (p) =>
          p.name.toLowerCase().includes(q) || p.url.toLowerCase().includes(q)
      )
    ) {
      return true;
    }
    return false;
  });
}
