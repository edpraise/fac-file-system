'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import styles from './UploadModal.module.css'; // Reusing styles
import { updateFileAction } from '@/app/actions/fileActions';
import { toast } from 'react-hot-toast';

interface EditFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: any;
}

const categories = [
  'Training', 'internal memo', 'incoming file', 'outgoingfile', 'hcf biodata& documents'
];

export default function EditFileModal({ isOpen, onClose, file }: EditFileModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [tags, setTags] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (file) {
      setName(file.name || '');
      setCategory(file.category || categories[0]);
      setTags(file.tags?.join(', ') || '');
    }
  }, [file]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await updateFileAction(file._id, {
        name,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      });
      toast.success('File updated successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Edit Resource</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Resource Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Annual Report 2024"
              required 
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Tags (comma separated)</label>
              <input 
                type="text" 
                value={tags} 
                onChange={(e) => setTags(e.target.value)} 
                placeholder="policy, urgent, internal" 
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isUpdating}>
            {isUpdating ? <Loader2 className={styles.spinner} /> : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
