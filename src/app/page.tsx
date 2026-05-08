'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Files, 
  Users, 
  HardDrive, 
  Activity,
  ArrowUpRight,
  Clock,
  Calendar
} from 'lucide-react';
import styles from './dashboard.module.css';
import { getDashboardStatsAction } from './actions/dashboardActions';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getDashboardStatsAction();
        setData(stats);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className={styles.dashboard}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Initializing Secure Workspace...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, recentLogs, categoryData } = data;
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <DashboardLayout>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>System Overview</h1>
            <p>Secure government file management and audit system.</p>
          </div>
          <div className={styles.dateDisplay}>
            <Calendar size={16} />
            <span>{currentDate}</span>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.blue}`}>
              <Files size={28} />
            </div>
            <div className={styles.statInfo}>
              <h3>Total Documents</h3>
              <p className={styles.statValue}>{stats.totalFiles}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.green}`}>
              <Users size={28} />
            </div>
            <div className={styles.statInfo}>
              <h3>Active Personnel</h3>
              <p className={styles.statValue}>{stats.activeUsers}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.purple}`}>
              <HardDrive size={28} />
            </div>
            <div className={styles.statInfo}>
              <h3>Storage Utilization</h3>
              <p className={styles.statValue}>{stats.totalStorage}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.orange}`}>
              <Activity size={28} />
            </div>
            <div className={styles.statInfo}>
              <h3>System Integrity</h3>
              <p className={styles.statValue}>100%</p>
            </div>
          </div>
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Security Audit Trail</h2>
              <Clock size={20} color="#64748b" />
            </div>
            <div className={styles.cardContent}>
              {recentLogs.length > 0 ? (
                recentLogs.map((log: any) => (
                  <div key={log._id} className={styles.logItem}>
                    <div className={styles.avatar}>
                      {log.userName?.charAt(0) || 'U'}
                    </div>
                    <div className={styles.logDetails}>
                      <p>
                        <strong>{log.userName}</strong> 
                        <span style={{ color: '#64748b', margin: '0 4px' }}>performed</span>
                        <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>{log.action}</code>
                        <span style={{ color: '#64748b', margin: '0 4px' }}>on</span>
                        <strong>{log.fileName || 'system resource'}</strong>
                      </p>
                      <span className={styles.logTime}>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No recent activity detected.</p>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Resource Distribution</h2>
              <ArrowUpRight size={20} color="#64748b" />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.categoryList}>
                {categoryData.length > 0 ? (
                  categoryData.map((cat: any, i: number) => (
                    <div key={cat.name} className={styles.categoryItem}>
                      <div className={styles.catLabel}>
                        <div 
                          className={styles.dot} 
                          style={{ background: ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ef4444'][i % 5] }}
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span className={styles.count}>{cat.value}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Awaiting data categorization...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
