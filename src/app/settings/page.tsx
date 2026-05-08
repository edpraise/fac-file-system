'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Settings as SettingsIcon, Bell, Shield, Cloud, HardDrive } from 'lucide-react';
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
          <h1>System Settings</h1>
          <p>Configure GovDrive platform preferences and security</p>
        </div>

        <form onSubmit={handleSave}>
          <div className={styles.section}>
            <h2><Shield size={20} color="#3b82f6" /> Security & Access</h2>
            <div className={styles.toggleGroup}>
              <div className={styles.toggleInfo}>
                <h3>Two-Factor Authentication</h3>
                <p>Require a second verification step for all admin logins</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            <div className={styles.toggleGroup}>
              <div className={styles.toggleInfo}>
                <h3>Session Timeout</h3>
                <p>Automatically log out inactive users after 30 minutes</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
          </div>

          <div className={styles.section}>
            <h2><Cloud size={20} color="#22c55e" /> Cloud Storage (Cloudinary)</h2>
            <div className={styles.formGroup}>
              <label>Default Upload Folder</label>
              <input className={styles.input} type="text" defaultValue="gov_files" />
            </div>
            <div className={styles.formGroup}>
              <label>Allowed File Formats</label>
              <input className={styles.input} type="text" defaultValue=".pdf, .docx, .xlsx, .pptx, .jpg, .png" />
            </div>
          </div>

          <div className={styles.section}>
            <h2><Bell size={20} color="#f59e0b" /> Notifications</h2>
            <div className={styles.toggleGroup}>
              <div className={styles.toggleInfo}>
                <h3>Email Alerts</h3>
                <p>Send email notifications for critical system activities</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            <div className={styles.toggleGroup}>
              <div className={styles.toggleInfo}>
                <h3>Audit Log Alerts</h3>
                <p>Notify admins when sensitive files are deleted</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
          </div>

          <button type="submit" className={styles.saveBtn}>
            Save All Settings
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
