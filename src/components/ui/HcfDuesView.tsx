import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { getHcfDuesAction, toggleHcfDueAction } from '@/app/actions/hcfDuesActions';
import { ArrowLeft, Search, Printer, Check, Loader2, Share2, Mail, MessageCircle, Copy, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import styles from './HcfDuesView.module.css';

interface HcfDuesViewProps {
  onBack: () => void;
}

export default function HcfDuesView({ onBack }: HcfDuesViewProps) {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';

  const [duesData, setDuesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingCell, setUpdatingCell] = useState<string | null>(null); // e.g. "Abia-2022"
  const [showShare, setShowShare] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i);

  useEffect(() => {
    fetchDues();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShowShare(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDues = async () => {
    setLoading(true);
    try {
      const data = await getHcfDuesAction();
      setDuesData(data);
    } catch (error) {
      toast.error('Failed to load dues records');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (stateName: string, year: number, currentPaid: boolean) => {
    if (!isAdmin) {
      toast.error('Only administrators can update dues status');
      return;
    }

    const cellId = `${stateName}-${year}`;
    setUpdatingCell(cellId);

    try {
      const result = await toggleHcfDueAction(stateName, year, !currentPaid);
      if (result.success) {
        setDuesData(prev =>
          prev.map(item =>
            item.stateName === stateName
              ? { ...item, paidYears: result.paidYears }
              : item
          )
        );
        toast.success(`${stateName} dues for ${year} updated successfully`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update due status');
    } finally {
      setUpdatingCell(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generateSummaryText = () => {
    let text = `FSCFN - HCF Dues Payment Summary (2020 - ${currentYear})\n\n`;
    duesData.forEach(item => {
      const paid = item.paidYears.length > 0 ? item.paidYears.sort().join(', ') : 'None';
      const unpaid = years.filter(y => !item.paidYears.includes(y)).sort().join(', ');
      text += `${item.stateName}:\n - Paid Years: ${paid}\n - Unpaid Years: ${unpaid}\n\n`;
    });
    return text;
  };

  const generateCSVContent = () => {
    const headers = ['State', ...years.map(String)];
    const rows = duesData.map(item => [
      item.stateName,
      ...years.map(year => item.paidYears.includes(year) ? 'Paid' : 'Unpaid')
    ]);
    
    return [headers, ...rows]
      .map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  };

  const exportToCSV = () => {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FSCFN_HCF_Dues_${currentYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Excel (CSV) report downloaded!');
    setShowShare(false);
  };

  const copyCSV = () => {
    const csvContent = generateCSVContent();
    navigator.clipboard.writeText(csvContent);
    toast.success('Excel CSV data copied to clipboard!');
    setShowShare(false);
  };

  const copySummary = () => {
    const summary = generateSummaryText();
    navigator.clipboard.writeText(summary);
    toast.success('Summary copied to clipboard!');
    setShowShare(false);
  };

  const shareEmail = () => {
    const summary = generateSummaryText();
    const subject = encodeURIComponent('FSCFN - HCF Dues Payment Summary');
    const body = encodeURIComponent(summary);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShare(false);
  };

  const shareWhatsApp = () => {
    const summary = generateSummaryText();
    const text = encodeURIComponent(summary);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShare(false);
  };

  const filteredData = duesData.filter(item =>
    item.stateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${styles.container} printableArea`}>
      <button onClick={onBack} className={styles.backBtn}>
        <ArrowLeft size={16} />
        <span>Back to Resources</span>
      </button>

      {/* Print Header only visible during print */}
      <div className={styles.printHeader}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#004d30', marginBottom: '0.25rem' }}>
          FORUM OF STATE COMMISSIONERS FOR FINANCE OF NIGERIA (FSCFN)
        </h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
          HCF Dues Payment Overview (2020 - {currentYear})
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem' }}>
          Report Generated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>HCF Dues Management</h2>
          <p>Track, select, or mark states that have paid their annual dues from 2020 to date.</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.shareWrapper} ref={shareRef}>
            <button onClick={() => setShowShare(!showShare)} className="btn btn-outline" title="Share dues report">
              <Share2 size={16} />
              <span>Share</span>
            </button>
            {showShare && (
              <div className={styles.shareDropdown}>
                <button onClick={exportToCSV} className={styles.shareOption}>
                  <FileText size={14} /><span>Download Excel (CSV)</span>
                </button>
                <button onClick={copyCSV} className={styles.shareOption}>
                  <Copy size={14} /><span>Copy Excel Data</span>
                </button>
                <button onClick={copySummary} className={styles.shareOption}>
                  <Copy size={14} /><span>Copy Text Summary</span>
                </button>
                <button onClick={shareEmail} className={styles.shareOption}>
                  <Mail size={14} /><span>Share via Email</span>
                </button>
                <button onClick={shareWhatsApp} className={styles.shareOption}>
                  <MessageCircle size={14} /><span>Share via WhatsApp</span>
                </button>
              </div>
            )}
          </div>
          <button onClick={handlePrint} className="btn btn-primary" title="Print/Export report as PDF">
            <Printer size={16} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 className="spinner" size={32} />
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>State</th>
                  {years.map(year => (
                    <th key={year} style={{ textAlign: 'center' }}>{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => {
                  return (
                    <tr key={item.stateName} className={styles.stateRow}>
                      <td className={styles.stateName}>{item.stateName}</td>
                      {years.map(year => {
                        const isPaid = item.paidYears.includes(year);
                        const isUpdating = updatingCell === `${item.stateName}-${year}`;

                        return (
                          <td key={year} className={styles.checkboxCell}>
                            <label className={styles.checkboxLabel}>
                              <input
                                type="checkbox"
                                checked={isPaid}
                                disabled={!isAdmin || isUpdating}
                                onChange={() => handleToggle(item.stateName, year, isPaid)}
                                className={styles.checkboxInput}
                              />
                              <span className={styles.customCheckbox}>
                                {isUpdating ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : isPaid ? (
                                  <Check size={14} strokeWidth={3} />
                                ) : null}
                              </span>
                              <span className={styles.printOnlyStatus}>
                                {isPaid ? 'Paid' : '-'}
                              </span>
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={years.length + 1} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No states found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendIndicator} ${styles.legendPaid}`} />
              <span>Paid</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendIndicator} ${styles.legendUnpaid}`} />
              <span>Unpaid</span>
            </div>
            {!isAdmin && (
              <div style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--accent)' }}>
                * View-only mode. Administrator permissions required to edit.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
