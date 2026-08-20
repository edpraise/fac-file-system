'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FileCard from '@/components/ui/FileCard';
import FileViewer from '@/components/ui/FileViewer';
import { Plus, Folder } from 'lucide-react';
import styles from './resources.module.css';
import { getFilesAction, deleteFileAction } from '@/app/actions/fileActions';
import UploadModal from '@/components/ui/UploadModal';
import EditFileModal from '@/components/ui/EditFileModal';
import { toast } from 'react-hot-toast';
import { useSearch } from '@/components/providers/SearchProvider';
import HcfDuesView from '@/components/ui/HcfDuesView';

const categories = ['All', 'Training', 'internal memo', 'incoming file', 'outgoingfile', 'hcf biodata& documents', 'Expenditure and Financial Overview'];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [files, setFiles] = useState<any[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<any>(null);
  const [viewingFile, setViewingFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHcfDues, setShowHcfDues] = useState(false);
  const { searchQuery } = useSearch();

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const data = await getFilesAction({ category: activeCategory, search: searchQuery });
      setFiles(data);
    } catch (error) {
      toast.error('Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setShowHcfDues(false);
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
    if (file) setEditingFile(file);
  };

  const handleView = (id: string) => {
    const file = files.find(f => f._id === id);
    if (file) {
      setViewingFile({
        name: file.name,
        type: file.fileType,
        url: file.cloudinaryUrl,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        date: new Date(file.uploadDate).toLocaleDateString(),
        category: file.category,
      });
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

  const showFolderCard = (activeCategory === 'Expenditure and Financial Overview' || activeCategory === 'All') &&
    (!searchQuery || 'hcf dues'.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <DashboardLayout>
      {showHcfDues ? (
        <HcfDuesView onBack={() => setShowHcfDues(false)} />
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1>Resources</h1>
              <p>Access and manage official FSCFN documents and training materials</p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(true)}>
              <Plus size={20} />
              <span>Add Resource</span>
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
              {showFolderCard && (
                <div
                  className={styles.folderCard}
                  onClick={() => setShowHcfDues(true)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(0, 135, 81, 0.1)', borderRadius: '12px', color: 'var(--accent)' }}>
                      <Folder size={32} />
                    </div>
                    <span className="badge">Folder</span>
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--foreground)' }}>HCF Dues</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--subtext-color)' }}>
                      Nigerian States Annual Dues Tracker (2020 - Present)
                    </p>
                  </div>
                </div>
              )}
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
                  onView={handleView}
                  isAdmin={true}
                />
              ))}
              {files.length === 0 && !showFolderCard && (
                <div className={styles.emptyState}>No files found in this category.</div>
              )}
            </div>
          )}
        </>
      )}

      {/* File Viewer Modal */}
      <FileViewer
        isOpen={!!viewingFile}
        file={viewingFile}
        onClose={() => setViewingFile(null)}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => { setIsUploadModalOpen(false); fetchFiles(); }}
      />

      <EditFileModal
        isOpen={!!editingFile}
        file={editingFile}
        onClose={() => { setEditingFile(null); fetchFiles(); }}
      />
    </DashboardLayout>
  );
}
