'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Settings as SettingsIcon,
  Bell, Shield, Cloud, Database,
  Lock, Timer, Mail, AlertTriangle, HardDrive
} from 'lucide-react';
import styles from './settings.module.css';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>System Settings</h1>
            <p>Configure FSCFN platform preferences, security policies and integrations</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className={styles.settingsGrid}>

            {/* Security & Access */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIconBadge} style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' }}>
                  <Shield size={18} color="#2563eb" />
                </div>
                <h2>Security &amp; Access Control</h2>
              </div>
              <div className={styles.sectionBody}>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <h3><Lock size={13} style={{ display: 'inline', marginRight: 5 }} />Two-Factor Authentication</h3>
                    <p>Require a second verification step for all admin logins</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <h3><Timer size={13} style={{ display: 'inline', marginRight: 5 }} />Session Timeout</h3>
                    <p>Automatically log out inactive users after 30 minutes</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <h3><Shield size={13} style={{ display: 'inline', marginRight: 5 }} />IP Allowlisting</h3>
                    <p>Restrict login access to approved IP address ranges only</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Cloud Storage */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIconBadge} style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>
                  <Cloud size={18} color="#059669" />
                </div>
                <h2>Cloud Storage (Cloudinary)</h2>
              </div>
              <div className={styles.sectionBody}>
                <div className={styles.formGroup}>
                  <label>Default Upload Folder</label>
                  <input className={styles.input} type="text" defaultValue="gov_files" />
                </div>
                <div className={styles.formGroup}>
                  <label>Allowed File Formats</label>
                  <input className={styles.input} type="text" defaultValue=".pdf, .docx, .xlsx, .pptx, .jpg, .png" />
                </div>
                <div className={styles.formGroup}>
                  <label>Max File Size (MB)</label>
                  <input className={styles.input} type="number" defaultValue="50" />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIconBadge} style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
                  <Bell size={18} color="#d97706" />
                </div>
                <h2>Notification Preferences</h2>
              </div>
              <div className={styles.sectionBody}>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <h3><Mail size={13} style={{ display: 'inline', marginRight: 5 }} />Email Alerts</h3>
                    <p>Send email notifications for critical system activities</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <h3><AlertTriangle size={13} style={{ display: 'inline', marginRight: 5 }} />Audit Log Alerts</h3>
                    <p>Notify admins when sensitive files are deleted</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <h3><Bell size={13} style={{ display: 'inline', marginRight: 5 }} />Upload Notifications</h3>
                    <p>Alert administrators when new files are uploaded</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>

            {/* System & Database */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIconBadge} style={{ background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)' }}>
                  <Database size={18} color="#7c3aed" />
                </div>
                <h2>System &amp; Database</h2>
              </div>
              <div className={styles.sectionBody}>
                <div className={styles.formGroup}>
                  <label>Database Connection String</label>
                  <input className={styles.input} type="password" defaultValue="mongodb+srv://fscfn:••••••••" />
                </div>
                <div className={styles.formGroup}>
                  <label>Backup Frequency</label>
                  <input className={styles.input} type="text" defaultValue="Daily at 02:00 UTC" />
                </div>
                <div className={styles.formGroup}>
                  <label>Data Retention Period (days)</label>
                  <input className={styles.input} type="number" defaultValue="365" />
                </div>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <h3><HardDrive size={13} style={{ display: 'inline', marginRight: 5 }} />Auto-Backup</h3>
                    <p>Automatically back up database on schedule</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>

          </div>

          <div className={styles.saveRow}>
            <button type="submit" className={styles.saveBtn} id="save-settings-btn">
              <SettingsIcon size={16} style={{ display: 'inline', marginRight: 8 }} />
              Save All Settings
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
