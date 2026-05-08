'use client';

import { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import styles from './UploadModal.module.css'; // Reusing modal styles
import { createUserAction } from '@/app/actions/userActions';
import { toast } from 'react-hot-toast';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const departments = ['ICT', 'Legal', 'Marketing', 'Finance', 'Administration', 'Operations'];

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    department: departments[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createUserAction(formData);
      toast.success('User created successfully');
      onSuccess();
      onClose();
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'staff',
        department: departments[0],
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add New Personnel</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              placeholder="e.g. John Doe"
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Official Email</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              placeholder="name@gov.ng"
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Temporary Password</label>
            <input 
              type="password" 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              placeholder="••••••••"
              required 
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>Department</label>
              <select 
                value={formData.department} 
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Initial Role</label>
              <select 
                value={formData.role} 
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className={styles.spinner} /> : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
