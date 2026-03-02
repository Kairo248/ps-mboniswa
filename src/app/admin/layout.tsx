import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <AdminSidebar userEmail={user.email} />
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
