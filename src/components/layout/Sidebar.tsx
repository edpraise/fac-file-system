'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  FolderSearch, 
  History, 
  Users, 
  Settings, 
  LogOut,
  Files
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { signOut } from 'next-auth/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Files, label: 'Resources', href: '/resources' },
  { icon: History, label: 'Activity Logs', href: '/logs' },
  { icon: Users, label: 'User Management', href: '/users', adminOnly: true },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <FileText size={20} color="white" />
        </div>
        <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>GovDrive</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          if (item.adminOnly && userRole !== 'admin') return null;
          
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={() => signOut()}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
