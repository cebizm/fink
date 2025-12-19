import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Search, Filter, TrendingUp, TrendingDown, Calendar, Edit2, Trash2 } from 'lucide-react';
import { subMonths, subYears } from 'date-fns';
import { AddTransactionModal } from '../Modals/AddTransactionModal';
import './TransactionList.css';
import type { Transaction } from '../../types';

type DateRangeOption = 'lastMonth' | 'last6Months' | 'lastYear' | 'all' | 'custom';

export const TransactionList: React.FC = () => {
    const { transactions, isPrivacyMode, deleteTransaction } = useFinance();
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // Date Filtering State
    const [dateRange, setDateRange] = useState<DateRangeOption>('lastMonth');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const getFilteredByDate = (txs: Transaction[]) => {
        const now = new Date();

        switch (dateRange) {
            case 'lastMonth':
                const oneMonthAgo = subMonths(now, 1);
                return txs.filter(t => new Date(t.date) >= oneMonthAgo);

            case 'last6Months':
                const sixMonthsAgo = subMonths(now, 6);
                return txs.filter(t => new Date(t.date) >= sixMonthsAgo);

            case 'lastYear':
                const oneYearAgo = subYears(now, 1);
                return txs.filter(t => new Date(t.date) >= oneYearAgo);

            case 'all':
                return txs;

            case 'custom':
                if (!customStartDate || !customEndDate) return txs;
                const start = new Date(customStartDate);
                const end = new Date(customEndDate);
                // Set end date to end of day to be inclusive
                end.setHours(23, 59, 59, 999);

                return txs.filter(t => {
                    const d = new Date(t.date);
                    return d >= start && d <= end;
                });

            default:
                return txs;
        }
    };

    const dateFiltered = getFilteredByDate(transactions);

    const finalFilteredTransactions = dateFiltered
        .filter((t) => {
            if (filter === 'all') return true;
            return t.type === filter;
        })
        .filter((t) =>
            t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleEdit = (t: Transaction) => {
        setEditingTransaction(t);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
            deleteTransaction(id);
        }
    };

    return (
        <div className="transaction-list-page">
            <header className="page-header">
                <h2 className="text-2xl font-bold">İşlemler</h2>
                <p className="text-muted">Finansal geçmişinizi yönetin ve görüntüleyin.</p>
            </header>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="İşlemlerde ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Tümü
                    </button>
                    <button
                        className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
                        onClick={() => setFilter('income')}
                    >
                        Gelir
                    </button>
                    <button
                        className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
                        onClick={() => setFilter('expense')}
                    >
                        Gider
                    </button>
                </div>
            </div>

            {/* Date Filters */}
            <div className="date-filters">
                <div className="range-buttons">
                    <button
                        className={`range-btn ${dateRange === 'lastMonth' ? 'active' : ''}`}
                        onClick={() => setDateRange('lastMonth')}
                    >
                        Son 1 Ay
                    </button>
                    <button
                        className={`range-btn ${dateRange === 'last6Months' ? 'active' : ''}`}
                        onClick={() => setDateRange('last6Months')}
                    >
                        6 Ay
                    </button>
                    <button
                        className={`range-btn ${dateRange === 'lastYear' ? 'active' : ''}`}
                        onClick={() => setDateRange('lastYear')}
                    >
                        1 Yıl
                    </button>
                    <button
                        className={`range-btn ${dateRange === 'all' ? 'active' : ''}`}
                        onClick={() => setDateRange('all')}
                    >
                        Tüm Zamanlar
                    </button>
                    <button
                        className={`range-btn ${dateRange === 'custom' ? 'active' : ''}`}
                        onClick={() => setDateRange('custom')}
                    >
                        <Calendar size={14} /> Tarih Seç
                    </button>
                </div>

                {dateRange === 'custom' && (
                    <div className="custom-date-inputs">
                        <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="date-input"
                        />
                        <span className="text-muted">-</span>
                        <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="date-input"
                        />
                    </div>
                )}
            </div>

            <div className="card transaction-list-card">
                {finalFilteredTransactions.length > 0 ? (
                    <div className="full-transaction-list">
                        {finalFilteredTransactions.map((t) => (
                            <div key={t.id} className="transaction-row group" style={{ alignItems: 'center' }}>
                                <div className={`row-icon ${t.type}`}>
                                    {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                </div>
                                <div className="row-info">
                                    <p className="row-desc">{t.description}</p>
                                    <p className="row-cat">{t.category}</p>
                                </div>
                                <div className="row-date">
                                    {new Date(t.date).toLocaleDateString()}
                                </div>
                                <div className={`row-amount ${t.type}`}>
                                    {isPrivacyMode
                                        ? '**** ₺'
                                        : `${t.type === 'income' ? '+' : '-'}₺${t.amount.toLocaleString()}`
                                    }
                                </div>
                                <div className="row-actions">
                                    <button
                                        className="action-btn-icon edit"
                                        onClick={() => handleEdit(t)}
                                        title="Düzenle"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="action-btn-icon delete"
                                        onClick={() => handleDelete(t.id)}
                                        title="Sil"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-list-state">
                        <Filter size={48} className="text-muted mb-4" />
                        <p>Seçilen kriterlere uygun işlem bulunamadı.</p>
                        {dateRange === 'custom' && (!customStartDate || !customEndDate) && (
                            <p className="text-sm text-muted">Lütfen tarih aralığı seçiniz.</p>
                        )}
                    </div>
                )}
            </div>

            <div className="list-footer">
                <p className="text-muted text-sm">
                    Toplam {finalFilteredTransactions.length} işlem gösteriliyor.
                    {dateRange === 'lastMonth' && " Daha eski işlemler için filtreyi değiştirebilirsiniz."}
                </p>
            </div>

            <AddTransactionModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingTransaction(null);
                }}
                initialData={editingTransaction}
            />
        </div>
    );
};
