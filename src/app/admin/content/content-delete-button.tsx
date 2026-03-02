'use client';

import { useRouter } from 'next/navigation';
import { deleteContent } from '../actions/content';
import { useState } from 'react';

export function ContentDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this content item?')) return;
    setLoading(true);
    const { error } = await deleteContent(id);
    if (error) alert(error);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {loading ? '…' : 'Delete'}
    </button>
  );
}
