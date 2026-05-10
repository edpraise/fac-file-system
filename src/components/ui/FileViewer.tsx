'use client';

import { X, Download, ExternalLink, FileText, Image as ImageIcon, Video, File } from 'lucide-react';
import { useEffect } from 'react';
import styles from './FileViewer.module.css';

interface FileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    name: string;
    type: string;
    url?: string;
    size?: string;
    date?: string;
    category?: string;
  } | null;
}

function getFileCategory(type: string, url?: string): 'pdf' | 'image' | 'video' | 'office' | 'other' {
  const t = (type || '').toLowerCase();
  const u = (url || '').toLowerCase();
  if (t === 'pdf' || u.endsWith('.pdf')) return 'pdf';
  if (['jpg','jpeg','png','gif','webp','svg','bmp'].includes(t) || /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/.test(u)) return 'image';
  if (['mp4','webm','mov','avi','mkv'].includes(t) || /\.(mp4|webm|mov|avi|mkv)(\?|$)/.test(u)) return 'video';
  if (['docx','doc','xlsx','xls','pptx','ppt'].includes(t)) return 'office';
  return 'other';
}

function getViewerUrl(url: string, type: string): string {
  const cat = getFileCategory(type, url);
  if (cat === 'office' && url.includes('cloudinary.com')) {
    // Use Google Docs Viewer for Office files
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  }
  return url;
}

export default function FileViewer({ isOpen, onClose, file }: FileViewerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen || !file) return null;

  const fileCategory = getFileCategory(file.type, file.url);
  const cleanUrl = file.url?.replace('/upload/fl_attachment/', '/upload/') || '';

  const handleDownload = () => {
    const dlUrl = cleanUrl.includes('cloudinary.com')
      ? cleanUrl.replace('/upload/', '/upload/fl_attachment/')
      : cleanUrl;
    window.open(dlUrl, '_blank');
  };

  const renderViewer = () => {
    if (!cleanUrl) {
      return (
        <div className={styles.noPreview}>
          <File size={64} />
          <p>No preview available for this file.</p>
        </div>
      );
    }

    switch (fileCategory) {
      case 'pdf':
        return (
          <iframe
            src={`${cleanUrl}#toolbar=1`}
            className={styles.iframe}
            title={file.name}
          />
        );
      case 'image':
        return (
          <div className={styles.imageContainer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cleanUrl} alt={file.name} className={styles.image} />
          </div>
        );
      case 'video':
        return (
          <div className={styles.videoContainer}>
            <video controls className={styles.video} preload="metadata">
              <source src={cleanUrl} />
              Your browser does not support video playback.
            </video>
          </div>
        );
      case 'office':
        return (
          <iframe
            src={getViewerUrl(cleanUrl, file.type)}
            className={styles.iframe}
            title={file.name}
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        );
      default:
        return (
          <div className={styles.noPreview}>
            <FileText size={64} />
            <p>Preview not available for <strong>.{file.type}</strong> files.</p>
            <button className={styles.openBtn} onClick={() => window.open(cleanUrl, '_blank')}>
              <ExternalLink size={16} /> Open in New Tab
            </button>
          </div>
        );
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.fileInfo}>
            <div className={styles.fileIconBadge}>
              {fileCategory === 'pdf'   && <FileText size={20} />}
              {fileCategory === 'image' && <ImageIcon size={20} />}
              {fileCategory === 'video' && <Video size={20} />}
              {(fileCategory === 'office' || fileCategory === 'other') && <File size={20} />}
            </div>
            <div>
              <h2 className={styles.fileName}>{file.name}</h2>
              <p className={styles.fileMeta}>
                {file.type?.toUpperCase()}
                {file.size ? ` · ${file.size}` : ''}
                {file.category ? ` · ${file.category}` : ''}
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.downloadHeaderBtn} onClick={handleDownload} title="Download">
              <Download size={18} />
              <span>Download</span>
            </button>
            <button className={styles.closeBtn} onClick={onClose} title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className={styles.body}>
          {renderViewer()}
        </div>
      </div>
    </div>
  );
}
