import { Download, Trash2, Edit2, File as FileIcon, ExternalLink, Share2, Mail, MessageCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import styles from './FileCard.module.css';

interface FileCardProps {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
  date: string;
  url?: string;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  isAdmin?: boolean;
}

export default function FileCard({ 
  id, 
  name, 
  type, 
  size, 
  category, 
  date, 
  url,
  onDownload, 
  onDelete, 
  onEdit,
  isAdmin 
}: FileCardProps) {
  const [showShare, setShowShare] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShowShare(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDownloadUrl = (originalUrl?: string) => {
    if (!originalUrl) return '';
    if (originalUrl.includes('cloudinary.com')) {
      return originalUrl.replace('/upload/', '/upload/fl_attachment/');
    }
    return originalUrl;
  };

  const shareEmail = () => {
    const downloadUrl = getDownloadUrl(url);
    const subject = encodeURIComponent(`Shared File: ${name}`);
    const body = encodeURIComponent(`I've shared a file with you from FSCFN: ${name}\n\nYou can download it here: ${downloadUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShare(false);
  };

  const shareWhatsApp = () => {
    const downloadUrl = getDownloadUrl(url);
    const text = encodeURIComponent(`Download this file from FSCFN: ${name}\n${downloadUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShare(false);
  };

  const copyLink = () => {
    const downloadUrl = getDownloadUrl(url);
    if (downloadUrl) {
      navigator.clipboard.writeText(downloadUrl);
      import('react-hot-toast').then(({ toast }) => toast.success('Download link copied!'));
    }
    setShowShare(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <FileIcon size={24} className={styles.fileIcon} />
        </div>
        <span className={styles.badge}>{type || 'document'}</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.fileName}>{name}</h3>
        <p className={styles.details}>
          {category} resource uploaded on {date}. Size: {size}
        </p>
        
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Category</span>
            <span className={styles.metaValue}>{category}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.mainActions}>
          <button className={styles.downloadBtn} onClick={() => onDownload?.(id)}>
            <Download size={16} />
            <span>Download</span>
          </button>
          
          <div className={styles.shareWrapper} ref={shareRef}>
            <button 
              className={styles.shareBtn} 
              onClick={() => setShowShare(!showShare)}
              title="Share Resource"
            >
              <Share2 size={16} />
            </button>

            {showShare && (
              <div className={styles.shareDropdown}>
                <button onClick={shareEmail} className={styles.shareOption}>
                  <Mail size={14} />
                  <span>Email</span>
                </button>
                <button onClick={shareWhatsApp} className={styles.shareOption}>
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </button>
                <button onClick={copyLink} className={styles.shareOption}>
                  <ExternalLink size={14} />
                  <span>Copy Link</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {isAdmin && (
          <div className={styles.adminActions}>
            <button className={styles.iconAction} onClick={() => onEdit?.(id)} title="Edit">
              <Edit2 size={16} />
            </button>
            <button className={styles.iconActionDelete} onClick={() => onDelete?.(id)} title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
