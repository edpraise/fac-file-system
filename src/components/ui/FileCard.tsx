'use client';

import { Download, Trash2, Edit2, File as FileIcon, ExternalLink, Share2, Mail, MessageCircle, Eye } from 'lucide-react';
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
  onView?: (id: string) => void;
  isAdmin?: boolean;
}

export default function FileCard({ id, name, type, size, category, date, url, onDownload, onDelete, onEdit, onView, isAdmin }: FileCardProps) {
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
    const body = encodeURIComponent(`I've shared a file with you from FSCFN: ${name}\n\nDownload here: ${downloadUrl}`);
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

  const getFriendlyType = (mimeType: string) => {
    if (!mimeType) return 'document';
    const t = mimeType.toLowerCase();
    if (t.includes('word') || t.includes('officedocument.wordprocessingml') || t.includes('msword')) return 'Word Doc';
    if (t.includes('pdf')) return 'PDF';
    if (t.includes('spreadsheet') || t.includes('officedocument.spreadsheetml') || t.includes('excel') || t.includes('csv')) return 'Excel';
    if (t.includes('presentation') || t.includes('officedocument.presentationml') || t.includes('powerpoint')) return 'PowerPoint';
    if (t.includes('image')) return 'Image';
    if (t.includes('text/plain')) return 'Text';
    if (t.includes('zip') || t.includes('rar') || t.includes('tar') || t.includes('gzip')) return 'Archive';
    
    const parts = mimeType.split('/');
    const subType = parts[parts.length - 1].toUpperCase();
    return subType.length > 8 ? subType.substring(0, 8) + '...' : subType;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <FileIcon size={24} className={styles.fileIcon} />
        </div>
        <span className={styles.badge}>{getFriendlyType(type)}</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.fileName}>{name}</h3>
        <p className={styles.details}>
          {category} · Uploaded {date} · {size}
        </p>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Category</span>
            <span className={styles.metaValue}>{category}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {/* Top row: View + Download */}
        <div className={styles.topActions}>
          <button className={styles.viewBtn} onClick={() => onView?.(id)} title="Preview file">
            <Eye size={15} />
            <span>View</span>
          </button>
          <button className={styles.downloadBtn} onClick={() => onDownload?.(id)} title="Download file">
            <Download size={15} />
            <span>Download</span>
          </button>
        </div>

        {/* Bottom row: Share + Admin actions */}
        <div className={styles.bottomActions}>
          <div className={styles.shareWrapper} ref={shareRef}>
            <button className={styles.shareBtn} onClick={() => setShowShare(!showShare)}>
              <Share2 size={14} />
              <span>Share</span>
            </button>
            {showShare && (
              <div className={styles.shareDropdown}>
                <button onClick={shareEmail} className={styles.shareOption}>
                  <Mail size={14} /><span>Email</span>
                </button>
                <button onClick={shareWhatsApp} className={styles.shareOption}>
                  <MessageCircle size={14} /><span>WhatsApp</span>
                </button>
                <button onClick={copyLink} className={styles.shareOption}>
                  <ExternalLink size={14} /><span>Copy Link</span>
                </button>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className={styles.adminActions}>
              <button className={styles.iconAction} onClick={() => onEdit?.(id)} title="Edit">
                <Edit2 size={15} />
              </button>
              <button className={styles.iconActionDelete} onClick={() => onDelete?.(id)} title="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
