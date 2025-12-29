import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CreditCard, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { AddDebtModal } from '../Modals/AddDebtModal';
import { PayDebtModal } from '../Modals/PayDebtModal';
import type { Debt } from '../../types';
import './Debts.css';
import { startOfMonth, startOfYear, isAfter } from 'date-fns';

type Period = 'monthly' | 'yearly';

import { useAuth } from '../../context/AuthContext';
import { FREE_TIER_LIMITS } from '../../constants/limits';
import { PremiumUpsellModal } from '../Modals/PremiumUpsellModal';

export const Debts: React.FC = () => {
    const { debts, deleteDebt, isPrivacyMode, transactions } = useFinance();
    const { user } = useAuth();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpsellOpen, setIsUpsellOpen] = useState(false);
    const [payModalDebtId, setPayModalDebtId] = useState<string | null>(null);
    const [period, setPeriod] = useState<Period>('monthly');

    const handleAddDebt = () => {
        if (!user?.isPremium && debts.length >= FREE_TIER_LIMITS.MAX_DEBTS) {
            setIsUpsellOpen(true);
            return;
        }
        setIsAddModalOpen(true);
    };

    // ... Rest of the component ...

    // Bank Brand Colors & Gradients (letter-based logos)
    const BANK_BRANDS: Record<string, { color: string, gradient: string }> = {
        'Garanti BBVA': { color: '#00A650', gradient: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)' },
        'Garanti': { color: '#00A650', gradient: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)' },
        'Yapı Kredi': { color: '#0047AB', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
        'Akbank': { color: '#FF0000', gradient: 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)' },
        'Ziraat Bankası': { color: '#E3001B', gradient: 'linear-gradient(135deg, #991b1b 0%, #e11d48 100%)' },
        'Ziraat': { color: '#E3001B', gradient: 'linear-gradient(135deg, #991b1b 0%, #e11d48 100%)' },
        'İş Bankası': { color: '#1E3A8A', gradient: 'linear-gradient(135deg, #172554 0%, #3b82f6 100%)' },
        'İşbank': { color: '#1E3A8A', gradient: 'linear-gradient(135deg, #172554 0%, #3b82f6 100%)' },
        'Enpara': { color: '#8B5CF6', gradient: 'linear-gradient(135deg, #6d28d9 0%, #a78bfa 100%)' },
        'QNB Finansbank': { color: '#7B2D8E', gradient: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)' },
        'Finansbank': { color: '#7B2D8E', gradient: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)' },
        'Vakıfbank': { color: '#FFD700', gradient: 'linear-gradient(135deg, #ca8a04 0%, #fbbf24 100%)' },
        'Halkbank': { color: '#0066B3', gradient: 'linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)' },
        'TEB': { color: '#00529B', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
        'Denizbank': { color: '#003366', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)' },
        'ING': { color: '#FF6200', gradient: 'linear-gradient(135deg, #c2410c 0%, #fb923c 100%)' },
        'HSBC': { color: '#DB0011', gradient: 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)' },
    };

    const getBankStyle = (name: string) => {
        // Check for partial match
        for (const [key, value] of Object.entries(BANK_BRANDS)) {
            if (name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())) {
                return value;
            }
        }
        return { color: '#71717a', gradient: 'linear-gradient(135deg, #3f3f46 0%, #71717a 100%)' };
    };

    // Get bank initial for fallback logo
    const getBankInitial = (name: string) => {
        const words = name.split(' ');
        if (words.length >= 2) {
            return words[0][0] + words[1][0];
        }
        return name.substring(0, 2).toUpperCase();
    };

    const [expandedBank, setExpandedBank] = useState<string | null>(null);

    const toggleBank = (bankName: string) => {
        if (expandedBank === bankName) {
            setExpandedBank(null); // Close if already open
        } else {
            setExpandedBank(bankName); // Open this one, close others
        }
    };

    // Grouping
    const groupedDebts = useMemo(() => {
        const groups: Record<string, Debt[]> = {};
        debts.forEach(d => {
            if (!groups[d.bankName]) groups[d.bankName] = [];
            groups[d.bankName].push(d);
        });
        return groups;
    }, [debts]);

    const totalDebt = debts.reduce((acc, curr) => acc + curr.remainingAmount, 0);

    // Calculate Paid Amount based on Transactions
    const { totalPaid, paymentRatio } = useMemo(() => {
        const now = new Date();
        let startDate: Date;

        if (period === 'monthly') {
            startDate = startOfMonth(now);
        } else {
            startDate = startOfYear(now);
        }

        // Filter transactions strictly related to EXISTING debts
        const debtPayments = transactions.filter((t: any) =>
            t.debtId &&
            t.type === 'expense' &&
            isAfter(new Date(t.date), startDate)
        );

        const paid = debtPayments.reduce((acc: number, curr: any) => acc + curr.amount, 0);

        // Ratio logic: 
        // Logic asked: "Pays 1000 of 5000 debt -> remaining 4000".
        // Total Volume = Paid so far + Remaining.
        const totalVolume = paid + totalDebt;
        const ratio = totalVolume > 0 ? (paid / totalVolume) * 100 : 0;

        return { totalPaid: paid, paymentRatio: ratio };
    }, [transactions, period, totalDebt]);


    const getProgressColor = (debt: Debt) => {
        const ratio = debt.remainingAmount / debt.totalAmount;
        if (ratio > 0.8) return '#ef4444';
        if (ratio > 0.5) return '#f59e0b';
        return '#10b981';
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'credit_card': return 'Kredi Kartı';
            case 'loan': return 'Kredi';
            case 'cash_advance': return 'Nakit Avans';
            default: return type;
        }
    };

    const getNextPaymentDate = (debt: Debt) => {
        if (!debt.dueDate) return null;
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        let paymentDate = new Date(currentYear, currentMonth, debt.dueDate);

        if (paymentDate < today) {
            paymentDate = new Date(currentYear, currentMonth + 1, debt.dueDate);
        }

        return paymentDate;
    };

    return (
        <div className="debts-page">
            <div className="debts-header">
                <h2>Borçlar</h2>
                <div className="header-actions">
                    {/* Period Filter Toggle */}
                    <div className="period-toggle">
                        <button
                            className={`toggle-btn ${period === 'monthly' ? 'active' : ''}`}
                            onClick={() => setPeriod('monthly')}
                        >
                            Aylık
                        </button>
                        <button
                            className={`toggle-btn ${period === 'yearly' ? 'active' : ''}`}
                            onClick={() => setPeriod('yearly')}
                        >
                            Yıllık
                        </button>
                    </div>

                    <button className="btn-add-debt" onClick={handleAddDebt}>
                        <Plus size={20} />
                        Yeni Borç Ekle
                    </button>
                </div>
            </div>

            <div className="debt-stats-grid">
                <div className="debt-stat-card">
                    <span className="debt-stat-label">Toplam Borç</span>
                    <span className="debt-stat-value">
                        {isPrivacyMode ? '**** ₺' : `₺${totalDebt.toLocaleString()}`}
                    </span>
                    <span className="debt-stat-sub">
                        {debts.length} Aktif Kalem
                    </span>
                </div>

                <div className="debt-stat-card">
                    <span className="debt-stat-label">Ödenen ({period === 'monthly' ? 'Bu Ay' : 'Bu Yıl'})</span>
                    <span className="debt-stat-value success">
                        {isPrivacyMode ? '**** ₺' : `₺${totalPaid.toLocaleString()}`}
                    </span>
                    <span className="debt-stat-sub">
                        Kapatılan Borç Tutarı
                    </span>
                </div>

                <div className="debt-stat-card">
                    <span className="debt-stat-label">Ödeme İlerlemesi</span>
                    <span className="debt-stat-value">
                        %{Math.round(paymentRatio)}
                    </span>
                    <div className="stat-progress-bg">
                        <div
                            className="stat-progress-fill"
                            style={{ width: `${paymentRatio}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {Object.entries(groupedDebts).map(([bankName, items]) => {
                const isExpanded = expandedBank === bankName;
                const brand = getBankStyle(bankName);

                return (
                    <div className="bank-group" key={bankName} style={{ borderColor: isExpanded ? brand.color : 'var(--border-color)' }}>
                        <div
                            className="bank-header"
                            onClick={() => toggleBank(bankName)}
                            style={{
                                cursor: 'pointer',
                                background: isExpanded ? `linear-gradient(to right, ${brand.color}15, transparent)` : 'var(--bg-secondary)'
                            }}
                        >
                            <div className="bank-info">
                                <div
                                    className="bank-icon"
                                    style={{
                                        backgroundColor: brand.color,
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        boxShadow: `0 4px 12px ${brand.color}40`
                                    }}
                                >
                                    {getBankInitial(bankName)}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="bank-name">{bankName}</span>
                                    <span className="bank-count-sub text-muted" style={{ fontSize: '0.75rem' }}>{items.length} Kalem Borç</span>
                                </div>
                            </div>
                            <div className="bank-header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span className="bank-total" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                        {isPrivacyMode ? '**** ₺' : `₺${items.reduce((acc, curr) => acc + curr.remainingAmount, 0).toLocaleString()}`}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Toplam Borç</span>
                                </div>
                                <button
                                    className="toggle-bank-btn"
                                    style={{
                                        background: isExpanded ? brand.color : 'transparent',
                                        border: 'none',
                                        padding: '0.5rem',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: isExpanded ? 'white' : 'var(--text-secondary)',
                                        transition: 'all 0.2s',
                                        boxShadow: isExpanded ? `0 4px 12px ${brand.color}40` : 'none'
                                    }}
                                >
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="debt-list">
                                {items.map(debt => {
                                    const nextPay = getNextPaymentDate(debt);
                                    const progress = Math.min((debt.remainingAmount / debt.totalAmount) * 100, 100);

                                    if (debt.type === 'credit_card') {
                                        return (
                                            <div
                                                className="credit-card-visual"
                                                key={debt.id}
                                                style={{ background: brand.gradient }}
                                            >
                                                <div className="card-bg-overlay"></div>
                                                <div className="card-top">
                                                    <span className="card-bank">{debt.bankName}</span>
                                                    <CreditCard size={24} className="card-logo-icon" />
                                                </div>
                                                <div className="card-chip-row">
                                                    <div className="card-chip"></div>
                                                    <div className="contactless-icon">
                                                        <span></span><span></span><span></span>
                                                    </div>
                                                </div>
                                                <div className="card-number">
                                                    <span>****</span><span>****</span><span>****</span><span>{debt.totalAmount.toString().slice(0, 4) || '1234'}</span>
                                                </div>
                                                <div className="card-info-row">
                                                    <div className="card-info-group">
                                                        <label>Kart Adı</label>
                                                        <span className="info-value">{debt.name}</span>
                                                    </div>
                                                    <div className="card-info-group right">
                                                        <label>Son Ödeme</label>
                                                        <span className="info-value">
                                                            {nextPay ? nextPay.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="card-footer">
                                                    <div className="limit-info">
                                                        <span className="label">Limit</span>
                                                        <span className="value">
                                                            {isPrivacyMode ? '****' : `₺${debt.totalAmount.toLocaleString()}`}
                                                        </span>
                                                    </div>
                                                    <div className="debt-info">
                                                        <span className="label">Borç</span>
                                                        <span className="value warning" style={{ color: 'white' }}>
                                                            {isPrivacyMode ? '****' : `₺${debt.remainingAmount.toLocaleString()}`}
                                                        </span>
                                                    </div>
                                                    <div className="card-actions">
                                                        <button
                                                            className="card-action-btn pay"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPayModalDebtId(debt.id);
                                                            }}
                                                            title="Ödeme Yap"
                                                        >
                                                            <Wallet size={16} />
                                                        </button>
                                                        <button
                                                            className="card-action-btn delete"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteDebt(debt.id);
                                                            }}
                                                            title="Sil"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Standard List Item
                                    return (
                                        <div className="debt-item" key={debt.id}>
                                            <div className="debt-meta">
                                                <p className="name">{debt.name}</p>
                                                <p className="type">{getTypeLabel(debt.type)}</p>
                                            </div>

                                            <div className="debt-amount">
                                                <label>Güncel Borç</label>
                                                <span>
                                                    {isPrivacyMode ? '**** ₺' : `₺${debt.remainingAmount.toLocaleString()}`}
                                                </span>
                                            </div>

                                            <div className="debt-dates">
                                                {nextPay && (
                                                    <>
                                                        <label>Sonraki Ödeme</label>
                                                        <span>{nextPay.toLocaleDateString('tr-TR')}</span>
                                                    </>
                                                )}
                                            </div>

                                            <div className="debt-progress">
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${progress}%`,
                                                            backgroundColor: getProgressColor(debt)
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="progress-text">
                                                    Toplam: {isPrivacyMode ? '**** ₺' : `₺${debt.totalAmount.toLocaleString()}`}
                                                </span>
                                            </div>

                                            <div className="item-actions">
                                                <button
                                                    className="action-btn pay"
                                                    onClick={() => setPayModalDebtId(debt.id)}
                                                    title="Ödeme Yap"
                                                >
                                                    <Wallet size={18} />
                                                </button>
                                                <button
                                                    className="action-btn"
                                                    onClick={() => deleteDebt(debt.id)}
                                                    title="Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )
            })}

            <AddDebtModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <PayDebtModal
                isOpen={!!payModalDebtId}
                debtId={payModalDebtId}
                onClose={() => setPayModalDebtId(null)}
            />
            <PremiumUpsellModal
                isOpen={isUpsellOpen}
                onClose={() => setIsUpsellOpen(false)}
                description={`Ücretsiz planda en fazla ${FREE_TIER_LIMITS.MAX_DEBTS} borç takip edebilirsiniz.`}
            />
        </div>
    );
};
