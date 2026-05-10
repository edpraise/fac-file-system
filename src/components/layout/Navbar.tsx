'use client';

import { Search, User as UserIcon, Menu, Moon, Sun } from 'lucide-react';
import styles from './Navbar.module.css';
import { useSearch } from '../providers/SearchProvider';
import { useTheme } from '../providers/ThemeProvider';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ userName, userRole, onMenuClick }: { 
  userName?: string, 
  userRole?: string,
  onMenuClick?: () => void 
}) {
  const { searchQuery, setSearchQuery } = useSearch();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.navbar}>
      <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Toggle sidebar">
        <Menu size={24} />
      </button>

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
        {/* Dark mode toggle */}
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          id="theme-toggle-btn"
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

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
