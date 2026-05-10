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
  Calendar,
  Upload,
  Download,
  UserPlus,
  Settings,
  Shield,
  Cpu,
  Database,
  Wifi
} from 'lucide-react';
import styles from './dashboard.module.css';
import { getDashboardStatsAction } from './actions/dashboardActions';
import { toast } from 'react-hot-toast';

const CAT_COLORS = ['#3b82f6', '#059669', '#a855f7', '#f97316', '#ef4444', '#06b6d4'];

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

  const totalCatFiles = categoryData.reduce((s: number, c: any) => s + (c.value || 0), 0) || 1;

  return (
    <DashboardLayout>
      <div className={styles.dashboard}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>System Overview</h1>
            <p>Secure government file management and audit system</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot}></span>
              All Systems Operational
            </div>
            <div className={styles.dateDisplay}>
              <Calendar size={15} />
              <span>{currentDate}</span>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.colorBlue}`}>
              <Files size={26} />
            </div>
            <div className={styles.statInfo}>
              <h3>Total Documents</h3>
              <p className={styles.statValue}>{stats.totalFiles}</p>
              <p className={styles.statMeta}>↑ 12% this month</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.colorGreen}`}>
              <Users size={26} />
            </div>
            <div className={styles.statInfo}>
              <h3>Active Personnel</h3>
              <p className={styles.statValue}>{stats.activeUsers}</p>
              <p className={styles.statMeta}>↑ 3 new this week</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.colorPurple}`}>
              <HardDrive size={26} />
            </div>
            <div className={styles.statInfo}>
              <h3>Storage Utilization</h3>
              <p className={styles.statValue}>{stats.totalStorage}</p>
              <p className={styles.statMeta}>68% capacity used</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.colorOrange}`}>
              <Activity size={26} />
            </div>
            <div className={styles.statInfo}>
              <h3>System Integrity</h3>
              <p className={styles.statValue}>100%</p>
              <p className={styles.statMeta}>No threats detected</p>
            </div>
          </div>
        </div>

        {/* ── KPI Banner ── */}
        <div className={styles.kpiBanner}>
          <div className={styles.kpiCard}>
            <div>
              <p className={styles.kpiLabel}>Uploads (30d)</p>
              <p className={styles.kpiValue}>1,284</p>
              <div className={styles.kpiBar}>
                <div className={styles.kpiBarFill} style={{ width: '72%' }}></div>
              </div>
            </div>
            <div className={styles.kpiChart}>
              {[30, 55, 40, 70, 60, 85, 75].map((h, i) => (
                <div key={i} className={styles.kpiBar2} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div>
              <p className={styles.kpiLabel}>Downloads (30d)</p>
              <p className={styles.kpiValue}>3,651</p>
              <div className={styles.kpiBar}>
                <div className={styles.kpiBarFill} style={{ width: '85%', background: 'linear-gradient(90deg, #6366f1, #a855f7)' }}></div>
              </div>
            </div>
            <div className={styles.kpiChart}>
              {[45, 60, 80, 65, 90, 70, 95].map((h, i) => (
                <div key={i} className={styles.kpiBar2} style={{ height: `${h}%`, background: 'linear-gradient(to top, #6366f1, #a855f7)' }} />
              ))}
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div>
              <p className={styles.kpiLabel}>Audit Events (30d)</p>
              <p className={styles.kpiValue}>542</p>
              <div className={styles.kpiBar}>
                <div className={styles.kpiBarFill} style={{ width: '44%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }}></div>
              </div>
            </div>
            <div className={styles.kpiChart}>
              {[20, 35, 25, 50, 30, 45, 40].map((h, i) => (
                <div key={i} className={styles.kpiBar2} style={{ height: `${h}%`, background: 'linear-gradient(to top, #f59e0b, #fbbf24)' }} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Grid: Audit + Distribution ── */}
        <div className={styles.mainGrid}>

          {/* Security Audit Trail */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Security Audit Trail</h2>
              <span className={styles.cardBadge}><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />Live</span>
            </div>
            <div className={styles.cardContent}>
              {recentLogs.length > 0 ? (
                recentLogs.map((log: any) => (
                  <div key={log._id} className={styles.logItem}>
                    <div className={styles.avatar}>
                      {log.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className={styles.logDetails}>
                      <p>
                        <strong>{log.userName}</strong>
                        <span style={{ color: '#64748b', margin: '0 4px' }}>performed</span>
                        <span className={styles.actionTag}>{log.action}</span>
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

          {/* Resource Distribution */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Resource Distribution</h2>
              <ArrowUpRight size={18} color="#64748b" />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.categoryList}>
                {categoryData.length > 0 ? (
                  categoryData.map((cat: any, i: number) => {
                    const pct = Math.round((cat.value / totalCatFiles) * 100);
                    return (
                      <div key={cat.name} className={styles.categoryItem}>
                        <div className={styles.categoryTop}>
                          <div className={styles.catLabel}>
                            <div className={styles.dot} style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                            <span>{cat.name}</span>
                          </div>
                          <span className={styles.count}>{cat.value}</span>
                        </div>
                        <div className={styles.catProgressBar}>
                          <div 
                            className={styles.catProgressFill}
                            style={{ width: `${pct}%`, background: CAT_COLORS[i % CAT_COLORS.length] }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Awaiting data categorization...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Grid: Quick Actions + System Health ── */}
        <div className={styles.bottomGrid}>

          {/* Quick Actions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Quick Actions</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.quickActions}>
                <button className={styles.actionBtn} id="quick-upload-btn">
                  <div className={styles.actionIcon} style={{ background: '#d1fae5' }}>
                    <Upload size={16} color="#059669" />
                  </div>
                  Upload File
                </button>
                <button className={styles.actionBtn} id="quick-download-btn">
                  <div className={styles.actionIcon} style={{ background: '#dbeafe' }}>
                    <Download size={16} color="#2563eb" />
                  </div>
                  Download Report
                </button>
                <button className={styles.actionBtn} id="quick-adduser-btn">
                  <div className={styles.actionIcon} style={{ background: '#f3e8ff' }}>
                    <UserPlus size={16} color="#7c3aed" />
                  </div>
                  Add Personnel
                </button>
                <button className={styles.actionBtn} id="quick-settings-btn">
                  <div className={styles.actionIcon} style={{ background: '#fef3c7' }}>
                    <Settings size={16} color="#d97706" />
                  </div>
                  System Settings
                </button>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>System Health</h2>
              <span className={styles.cardBadge}>Real-time</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.healthList}>
                {[
                  { label: 'CPU Usage',      pct: 42, color: '#3b82f6',  icon: <Cpu size={14} /> },
                  { label: 'Memory (RAM)',    pct: 68, color: '#8b5cf6',  icon: <Activity size={14} /> },
                  { label: 'Storage I/O',    pct: 31, color: '#10b981',  icon: <Database size={14} /> },
                  { label: 'Network Traffic',pct: 55, color: '#f59e0b',  icon: <Wifi size={14} /> },
                  { label: 'Security Score', pct: 98, color: '#059669',  icon: <Shield size={14} /> },
                ].map(({ label, pct, color, icon }) => (
                  <div key={label} className={styles.healthItem}>
                    <div className={styles.healthTop}>
                      <span className={styles.healthLabel} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {icon} {label}
                      </span>
                      <span className={styles.healthPct} style={{ color }}>{pct}%</span>
                    </div>
                    <div className={styles.healthBar}>
                      <div className={styles.healthFill} style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
