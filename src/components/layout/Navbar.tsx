'use client';

import { Search, Bell, User as UserIcon } from 'lucide-react';
import styles from './Navbar.module.css';
import { useSearch } from '../providers/SearchProvider';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ userName, userRole }: { userName?: string, userRole?: string }) {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className={styles.navbar}>
      <div className={styles.searchContainer}>
        <Search size={20} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search documents, tags, or categories..." 
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <NotificationDropdown />
        
        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName || 'User'}</span>
            <span className={styles.userRole}>{userRole || 'Staff'}</span>
          </div>
          <div className={styles.avatar}>
            <UserIcon size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
