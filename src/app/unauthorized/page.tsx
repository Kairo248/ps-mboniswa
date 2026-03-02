import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-2">Access denied</h1>
      <p className="text-neutral-600 mb-6">
        You don’t have permission to view this page. Only super admins can access the admin area.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
      >
        Back to home
      </Link>
    </main>
  );
}
