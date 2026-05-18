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
  Files,
  X
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

export default function Sidebar({ userRole, isOpen, onClose }: {
  userRole?: string,
  isOpen?: boolean,
  onClose?: () => void
}) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logoContainer}>
          <div className={styles.logoGroup}>
            <div className={styles.logo}>
              <img src="/flogo.JPG" alt="Logo" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
            </div>
            <span className={styles.brandName}>
              {/* FORUM OF STATE COMMISSIONERS FOR FINANCE OF NIGERIA */}
              FSCFN
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
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
                onClick={onClose}
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
    </>
  );
}
