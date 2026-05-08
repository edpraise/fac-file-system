'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Shield, Mail, Building2, UserCog } from 'lucide-react';
import styles from './users.module.css';
import { getUsersAction, updateUserRoleAction } from '@/app/actions/userActions';
import { toast } from 'react-hot-toast';
import CreateUserModal from '@/components/ui/CreateUserModal';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getUsersAction();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRoleAction(userId, newRole);
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>User Management</h1>
            <p>Manage system access and roles for government personnel</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <UserCog size={18} />
            <span>Add New User</span>
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading users...</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>{user.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{user.name}</div>
                          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={16} color="#94a3b8" />
                        {user.department}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.admin : styles.staff}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className={styles.status}>
                        <div className={styles.statusDot} />
                        Active
                      </div>
                    </td>
                    <td>
                      <select 
                        className={styles.select}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      >
                        <option value="staff">Make Staff</option>
                        <option value="admin">Make Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <CreateUserModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchUsers}
        />
      </div>
    </DashboardLayout>
  );
}
