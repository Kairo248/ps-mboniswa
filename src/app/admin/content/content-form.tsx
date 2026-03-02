'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import type { ContentFeed } from '@/types/database';
import type { ContentFormState } from '../actions/content';

const CATEGORIES = ['Sermon', 'Music', 'Event'] as const;
const STATUS_TAGS = ['Hot', 'New', 'Popular', 'Live'] as const;

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

export function ContentForm({ action, initial }: Props) {
  const [state, formAction] = useActionState(action, {} as ContentFormState);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'video' | null>(null);

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
          defaultValue={initial?.category}
          className="border border-neutral-300 rounded-lg px-3 py-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
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
