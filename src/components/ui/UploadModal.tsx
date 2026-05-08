'use client';

import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import styles from './UploadModal.module.css';
import { uploadFileAction } from '@/app/actions/fileActions';
import { toast } from 'react-hot-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  'Branding', 'Templates', 'Legal Forms', 'Training', 'Market Research', 'External Tools'
];

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('tags', tags);

    try {
      await uploadFileAction(formData);
      toast.success('File uploaded successfully');
      onClose();
      // Reset form
      setFile(null);
      setName('');
      setCategory(categories[0]);
      setTags('');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Upload Resource</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.dropzone}>
            <input 
              type="file" 
              id="fileUpload" 
              className={styles.fileInput}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="fileUpload" className={styles.dropzoneLabel}>
              <Upload size={32} className={styles.uploadIcon} />
              <span>{file ? file.name : 'Click to select or drag and drop'}</span>
              <span className={styles.hint}>PDF, DOCX, Images (Max 10MB)</span>
            </label>
          </div>

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

          <button type="submit" className={styles.submitBtn} disabled={isUploading}>
            {isUploading ? <Loader2 className={styles.spinner} /> : 'Upload to GovDrive'}
          </button>
        </form>
      </div>
    </div>
  );
}
