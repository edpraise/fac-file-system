'use client';

import { Download, Trash2, Edit2, File as FileIcon, ExternalLink } from 'lucide-react';
import styles from './FileCard.module.css';

interface FileCardProps {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
  date: string;
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
  onDownload, 
  onDelete, 
  onEdit,
  isAdmin 
}: FileCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <FileIcon size={24} className={styles.fileIcon} />
        </div>
        <span className={styles.badge}>document</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.fileName}>{name}</h3>
        <p className={styles.details}>
          Complete {category} guidelines including logo usage, color palette, typography, and marketing templates.
        </p>
        
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Category</span>
            <span className={styles.metaValue}>{category}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.downloadBtn} onClick={() => onDownload?.(id)}>
          <Download size={16} />
          <span>Download Files</span>
        </button>
        
        {isAdmin && (
          <div className={styles.adminActions}>
            <button className={styles.iconAction} onClick={() => onEdit?.(id)}>
              <Edit2 size={16} />
            </button>
            <button className={styles.iconActionDelete} onClick={() => onDelete?.(id)}>
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
