'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getActivityLogsAction } from '@/app/actions/fileActions';
import { toast } from 'react-hot-toast';
import styles from './logs.module.css';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getActivityLogsAction();
        setLogs(data);
      } catch (error) {
        toast.error('Failed to fetch activity logs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <h1>Activity Logs</h1>
        <p>Audit trail of all file management actions</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Action</th>
              <th>Resource</th>
              <th>Performed By</th>
              <th>Date & Time</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td data-label="Action">
                  <span className={`${styles.actionBadge} ${styles[log.action]}`}>
                    {log.action}
                  </span>
                </td>
                <td data-label="Resource">{log.fileName || 'N/A'}</td>
                <td data-label="Performed By">{log.userName || 'System'}</td>
                <td data-label="Date & Time">{new Date(log.timestamp).toLocaleString()}</td>
                <td data-label="Details" className={styles.details}>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && !isLoading && (
          <div className={styles.empty}>No logs recorded yet.</div>
        )}
      </div>
    </DashboardLayout>
  );
}
