'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import type { ContentFeed, PlatformLink } from '@/types/database';
import type { ContentFormState } from '../actions/content';

const CATEGORIES = ['Sermon', 'Music', 'Event'] as const;
const STATUS_TAGS = ['Hot', 'New', 'Popular', 'Live'] as const;

const PLATFORM_OPTIONS = [
  'Spotify',
  'Apple Music',
  'YouTube Music',
  'Audiomack',
  'iHeart',
  'Other',
] as const;

const ACCEPT_MEDIA = 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime';
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function isImageUrl(url: string): boolean {
  try {
    const path = new URL(url).pathname.toLowerCase();
    return /\.(jpe?g|png|gif|webp)(\?|$)/.test(path);
  } catch {
    return false;
  }
}

type Action = (prev: ContentFormState, formData: FormData) => Promise<ContentFormState>;

type Props = {
  action: Action;
  initial?: ContentFeed | null;
};

function normalizePlatformLinks(raw: unknown): PlatformLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is { name?: string; url?: string } => x != null && typeof x === 'object')
    .map((x) => ({ name: String(x.name ?? '').trim(), url: String(x.url ?? '').trim() }))
    .filter((x) => x.name || x.url);
}

export function ContentForm({ action, initial }: Props) {
  const [state, formAction] = useActionState(action, {} as ContentFormState);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'video' | null>(null);
  const [category, setCategory] = useState<typeof CATEGORIES[number]>(
    initial?.category ?? 'Sermon'
  );
  const [platformLinks, setPlatformLinks] = useState<PlatformLink[]>(() =>
    normalizePlatformLinks(initial?.platform_links)
  );

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
      setSelectedFileType(null);
      return;
    }
    setFilePreview(URL.createObjectURL(file));
    setSelectedFileType(IMAGE_TYPES.includes(file.type) ? 'image' : 'video');
  };

  const showCurrent = initial?.media_url && !filePreview;
  const currentIsImage = initial?.media_url ? isImageUrl(initial.media_url) : false;

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
        <span className="text-sm font-medium text-neutral-700">Description</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ''}
          className="border border-neutral-300 rounded-lg px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-700">Photo or video (upload)</span>
        <input
          type="file"
          name="media_file"
          accept={ACCEPT_MEDIA}
          onChange={handleFileChange}
          className="border border-neutral-300 rounded-lg px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-800 file:px-4 file:py-2 file:text-white file:text-sm"
        />
        <span className="text-xs text-neutral-500 mt-0.5">
          Images: JPEG, PNG, GIF, WebP. Videos: MP4, WebM. Max 50 MB.
        </span>
        {(showCurrent || filePreview) && (
          <div className="mt-2 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50 aspect-video max-w-sm">
            {filePreview ? (
              selectedFileType === 'image' ? (
                <img src={filePreview} alt="Preview" className="h-full w-full object-contain" />
              ) : (
                <video src={filePreview} controls className="h-full w-full object-contain" />
              )
            ) : showCurrent && currentIsImage ? (
              <img src={initial!.media_url!} alt="Current" className="h-full w-full object-contain" />
            ) : showCurrent ? (
              <video src={initial!.media_url!} controls className="h-full w-full object-contain" />
            ) : null}
          </div>
        )}
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-700">Category *</span>
        <select
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof CATEGORIES[number])}
          className="border border-neutral-300 rounded-lg px-3 py-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      {category === 'Music' && (
        <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50/50 p-4">
          <span className="text-sm font-medium text-neutral-700">Digital platforms (for this song)</span>
          <p className="text-xs text-neutral-500">
            Add links where this song is available (Spotify, Apple Music, etc.).
          </p>
          {platformLinks.map((link, i) => (
            <div key={i} className="flex flex-wrap items-end gap-2">
              <label className="flex flex-col gap-1 min-w-[8rem]">
                <span className="text-xs text-neutral-500">Platform</span>
                <select
                  value={link.name && PLATFORM_OPTIONS.includes(link.name as typeof PLATFORM_OPTIONS[number]) ? link.name : (link.name || 'Spotify')}
                  onChange={(e) => {
                    const next = [...platformLinks];
                    next[i] = { ...next[i], name: e.target.value };
                    setPlatformLinks(next);
                  }}
                  className="border border-neutral-300 rounded-lg px-2 py-1.5 text-sm"
                >
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 flex-1 min-w-[12rem]">
                <span className="text-xs text-neutral-500">URL</span>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => {
                    const next = [...platformLinks];
                    next[i] = { ...next[i], url: e.target.value };
                    setPlatformLinks(next);
                  }}
                  placeholder="https://..."
                  className="border border-neutral-300 rounded-lg px-2 py-1.5 text-sm"
                />
              </label>
              <button
                type="button"
                onClick={() => setPlatformLinks(platformLinks.filter((_, j) => j !== i))}
                className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPlatformLinks([...platformLinks, { name: 'Spotify', url: '' }])}
            className="self-start rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            + Add platform
          </button>
          <input
            type="hidden"
            name="platform_links"
            value={JSON.stringify(platformLinks.filter((l) => l.url.trim()))}
          />
        </div>
      )}
      {category !== 'Music' && (
        <input type="hidden" name="platform_links" value="[]" />
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-700">Status tag</span>
        <select
          name="status_tag"
          defaultValue={initial?.status_tag ?? ''}
          className="border border-neutral-300 rounded-lg px-3 py-2"
        >
          <option value="">None</option>
          {STATUS_TAGS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800"
        >
          {initial ? 'Save changes' : 'Create content'}
        </button>
        <a
          href="/admin/content"
          className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
