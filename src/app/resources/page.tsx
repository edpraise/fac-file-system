'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FileCard from '@/components/ui/FileCard';
import { Plus } from 'lucide-react';
import styles from './resources.module.css';

const categories = [
  'All', 'Training', 'internal memo', 'incoming file', 'outgoingfile', 'hcf biodata& documents'
];

const mockFiles = [
  { id: '1', name: 'Internal Memo - Security', category: 'internal memo', type: 'PDF', size: '2.4 MB', date: '2025-01-10' },
  { id: '2', name: 'Training Manual V1', category: 'Training', type: 'DOCX', size: '1.1 MB', date: '2025-02-15' },
  { id: '3', name: 'Incoming File - Admin', category: 'incoming file', type: 'PDF', size: '5.8 MB', date: '2025-03-01' },
  { id: '4', name: 'Staff Onboarding Video', category: 'Training', type: 'MP4', size: '3.2 MB', date: '2025-01-20' },
  { id: '5', name: 'Outgoing Memo - Dept', category: 'outgoingfile', type: 'PDF', size: '4.5 MB', date: '2025-02-05' },
  { id: '6', name: 'Biodata Forms', category: 'hcf biodata& documents', type: 'PDF', size: '1.8 MB', date: '2025-03-12' },
];

import { useEffect } from 'react';
import { getFilesAction, deleteFileAction } from '@/app/actions/fileActions';
import UploadModal from '@/components/ui/UploadModal';
import EditFileModal from '@/components/ui/EditFileModal';
import { toast } from 'react-hot-toast';
import { useSearch } from '@/components/providers/SearchProvider';

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [files, setFiles] = useState<any[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { searchQuery } = useSearch();

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const data = await getFilesAction({ 
        category: activeCategory,
        search: searchQuery
      });
      setFiles(data);
    } catch (error) {
      toast.error('Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [activeCategory, searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await deleteFileAction(id);
      toast.success('File deleted');
      fetchFiles();
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const handleEdit = (id: string) => {
    const file = files.find(f => f._id === id);
    if (file) {
      setEditingFile(file);
    }
  };

  const handleDownload = (id: string) => {
    const file = files.find(f => f._id === id);
    if (file) {
      let url = file.cloudinaryUrl;
      if (url && url.includes('cloudinary.com')) {
        url = url.replace('/upload/', '/upload/fl_attachment/');
      }
      window.open(url, '_blank');
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Resources</h1>
          <p>Access marketing materials, templates, and training resources</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(true)}>
          <Plus size={20} />
          <span>Add Resources</span>
        </button>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.categories}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`${styles.catBtn} ${activeCategory === cat ? styles.catActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading resources...</div>
      ) : (
        <div className={styles.fileGrid}>
          {files.map(file => (
            <FileCard 
              key={file._id}
              id={file._id}
              name={file.name}
              category={file.category}
              type={file.fileType}
              size={(file.size / 1024 / 1024).toFixed(1) + ' MB'}
              date={new Date(file.uploadDate).toLocaleDateString()}
              url={file.cloudinaryUrl}
              onDelete={handleDelete}
              onDownload={handleDownload}
              onEdit={handleEdit}
              isAdmin={true} // In real app, check session
            />
          ))}
          {files.length === 0 && (
            <div className={styles.emptyState}>No files found in this category.</div>
          )}
        </div>
      )}

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => {
          setIsUploadModalOpen(false);
          fetchFiles();
        }} 
      />

      <EditFileModal 
        isOpen={!!editingFile}
        file={editingFile}
        onClose={() => {
          setEditingFile(null);
          fetchFiles();
        }}
      />
    </DashboardLayout>
  );
}
