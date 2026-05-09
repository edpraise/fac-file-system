'use client';

import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <span>Loading FSCFN...</span>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as any;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="container">
      <Sidebar userRole={user.role} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="main-content">
        <Navbar 
          userName={user.name} 
          userRole={user.role} 
          onMenuClick={toggleSidebar} 
        />
        {children}
      </main>
    </div>
  );
}
