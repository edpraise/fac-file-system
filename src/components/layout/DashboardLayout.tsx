'use client';

import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <span>Loading GovDrive...</span>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as any;

  return (
    <div className="container">
      <Sidebar userRole={user.role} />
      <main className="main-content">
        <Navbar userName={user.name} userRole={user.role} />
        {children}
      </main>
    </div>
  );
}
