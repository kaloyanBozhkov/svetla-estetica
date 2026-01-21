import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { AdminSidebar } from './AdminSidebar';
import type { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await isAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen p-4 pt-20 lg:p-8 lg:pt-24">{children}</main>
    </div>
  );
}
