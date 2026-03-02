import Link from 'next/link';
import { ContentForm } from '../content-form';
import { createContent } from '../../actions/content';

export default function NewContentPage() {
  return (
    <div>
      <div className="mb-6 md:mb-8">
        <Link href="/admin/content" className="text-sm text-neutral-600 hover:underline">
          ← Content Feed
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-2">Add content</h1>
        <p className="text-neutral-600 text-sm mt-1">Sermon, music, or event</p>
      </div>
      <ContentForm action={createContent} />
    </div>
  );
}
