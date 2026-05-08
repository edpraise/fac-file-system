'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock, ExternalLink } from 'lucide-react';
import { getNotificationsAction, markAsReadAction, markAllAsReadAction } from '@/app/actions/notificationActions';
import styles from './NotificationDropdown.module.css';
import Link from 'next/link';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await getNotificationsAction();
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadAction(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsReadAction();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        className={styles.bellBtn} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className={styles.markAllBtn}>
                Mark all read
              </button>
            )}
          </div>

          <div className={styles.content}>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n._id} 
                  className={`${styles.item} ${!n.read ? styles.unread : ''}`}
                  onClick={() => !n.read && handleMarkAsRead(n._id)}
                >
                  <div className={styles.itemHeader}>
                    <span className={styles.type}>{n.title}</span>
                    {!n.read && <div className={styles.unreadDot} />}
                  </div>
                  <p className={styles.message}>{n.message}</p>
                  <div className={styles.footer}>
                    <div className={styles.time}>
                      <Clock size={12} />
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    {n.link && (
                      <Link href={n.link} className={styles.link} onClick={() => setIsOpen(false)}>
                        View <ExternalLink size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.empty}>
                <p>No new notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
