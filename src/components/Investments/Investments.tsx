import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TrendingUp, TrendingDown, Plus, Wallet, Coins, Landmark, Archive, Eye, EyeOff, RefreshCw } from 'lucide-react';
import './Investments.css';
import { AddInvestmentModal } from '../Modals/AddInvestmentModal';
import type { InvestmentType } from '../../types';

export const Investments: React.FC = () => {
    const { investments, deleteInvestment, updateInvestmentPrice, isPrivacyMode, togglePrivacyMode, refreshMarketRates, isLoadingRates } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<InvestmentType | 'all'>('all');

    const handleRefresh = async () => {
        await refreshMarketRates();
    };

    // --- Helpers ---
    const getTypeLabel = (type: InvestmentType) => {
        switch (type) {
            case 'currency': return 'Döviz';
            case 'gold': return 'Altın';
            case 'stock': return 'Hisse Senedi';
            case 'deposit': return 'Mevduat';
            default: return type;
        }
    };

    const getIcon = (type: InvestmentType) => {
        switch (type) {
            case 'currency': return <Coins size={24} />;
            case 'gold': return <Archive size={24} />;
            case 'stock': return <TrendingUp size={24} />;
            case 'deposit': return <Landmark size={24} />;
            default: return <Wallet size={24} />;
        }
    };

    // --- Calculations ---
    const filteredInvestments = investments.filter(inv =>
        filter === 'all' ? true : inv.type === filter
    );

    const totalCurrentValue = filteredInvestments.reduce((acc, inv) => {
        const val = (inv.amount || 0) * (inv.currentPrice || 0);
        return acc + val;
    }, 0);

    const totalCost = filteredInvestments.reduce((acc, inv) => {
        const cost = (inv.amount || 0) * (inv.purchasePrice || 0);
        return acc + cost;
    }, 0);

    const totalProfitLossItem = totalCurrentValue - totalCost;
    const totalProfitLossPct = totalCost === 0 ? 0 : (totalProfitLossItem / totalCost) * 100;

    return (
        <div className="investments-page">
            <div className="investments-header">
                <h2>Birikimler & Yatırımlar</h2>
                <div className="header-actions">
                    <button
                        className="btn-secondary"
                        onClick={handleRefresh}
                        disabled={isLoadingRates}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '0.5rem' }}
                    >
                        <RefreshCw size={18} className={isLoadingRates ? 'spin-anim' : ''} />
                        {isLoadingRates ? 'Güncelleniyor...' : 'Piyasayı Güncelle'}
                    </button>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} />
                        Yeni Ekle
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="investments-summary">
                <div className="summary-card total-value">
                    <div className="summary-label-row">
                        <span className="summary-label">Toplam Varlık Değeri</span>
                        <button
                            className="privacy-toggle-btn-small"
                            onClick={togglePrivacyMode}
                            title={isPrivacyMode ? "Göster" : "Gizle"}
                        >
                            {isPrivacyMode ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    </div>
                    <span className="summary-val">
                        {isPrivacyMode ? '**** ₺' : `${totalCurrentValue.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺`}
                    </span>
                </div>

                <div className="summary-card profit-loss">
                    <span className="summary-label">Toplam Kar / Zarar</span>
                    <div className="pl-wrapper">
                        <span className={`summary-val ${totalProfitLossItem >= 0 ? 'text-success' : 'text-danger'}`}>
                            {isPrivacyMode
                                ? '**** ₺'
                                : `${totalProfitLossItem >= 0 ? '+' : ''}${totalProfitLossItem.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺`
                            }
                        </span>
                        <div className={`pl-badge ${totalProfitLossPct >= 0 ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                            {totalProfitLossPct >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            %{Math.abs(totalProfitLossPct).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="investments-tabs">
                {(['all', 'currency', 'gold', 'stock', 'deposit'] as const).map(f => (
                    <button
                        key={f}
                        className={`tab-btn ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? 'Tümü' : getTypeLabel(f as InvestmentType)}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="investments-grid">
                {filteredInvestments.length === 0 ? (
                    <div className="empty-state">
                        {filter === 'stock' ? (
                            <>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚀</div>
                                <p style={{ fontSize: '1rem', fontWeight: 600 }}>Bu Özellik Çok Yakında Gelecek!</p>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    Borsa verilerini gerçek zamanlı takip edebileceksiniz.
                                </p>
                            </>
                        ) : (
                            <>
                                <Wallet size={48} className="text-muted" />
                                <p>Henüz bir varlık eklenmemiş.</p>
                                <button className="btn-text" onClick={() => setIsModalOpen(true)}>Hemen Ekle</button>
                            </>
                        )}
                    </div>
                ) : (
                    filteredInvestments.map((inv) => {
                        // Safety checks for corrupted data
                        const safePurchasePrice = inv.purchasePrice || 0;
                        const safeCurrentPrice = inv.currentPrice || 0;
                        const safeAmount = inv.amount || 0;

                        const cost = safeAmount * safePurchasePrice;
                        const valid = safeAmount * safeCurrentPrice;
                        const pl = valid - cost;
                        // Avoid division by zero
                        const plPct = cost === 0 ? 0 : (pl / cost) * 100;

                        return (
                            <div key={inv.id} className="investment-card card">
                                <div className="inv-header">
                                    <div className={`inv-icon-wrapper type-${inv.type}`}>
                                        {getIcon(inv.type)}
                                    </div>
                                    <div className="inv-info">
                                        <h4 className="inv-name">{inv.name || 'İsimsiz Varlık'}</h4>
                                        <span className="inv-amount">
                                            {inv.type === 'deposit'
                                                ? 'Ana Para'
                                                : `${safeAmount.toLocaleString('tr-TR')} ${inv.type === 'gold' ? 'gr' : 'adet'}`
                                            }
                                        </span>
                                    </div>
                                    <button className="btn-icon-danger" onClick={() => deleteInvestment(inv.id)} title="Sil">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                    </button>
                                </div>

                                <div className="inv-body">
                                    <div className="inv-row">
                                        <span className="label">Alış Fiyatı</span>
                                        <span className="val">
                                            {isPrivacyMode ? '**** ₺' : `${safePurchasePrice.toLocaleString('tr-TR', { maximumFractionDigits: 4 })} ₺`}
                                        </span>
                                    </div>
                                    <div className="inv-row">
                                        <span className="label">Güncel Fiyat</span>
                                        <div className="price-editor" style={{ maxWidth: 'none', width: 'auto' }}>
                                            <input
                                                type={isPrivacyMode ? "password" : "number"}
                                                value={Number.isNaN(inv.currentPrice) ? '' : inv.currentPrice}
                                                step="0.0001"
                                                onChange={(e) => updateInvestmentPrice(inv.id, parseFloat(e.target.value) || 0)}
                                                className="price-input"
                                                style={{ width: '100px', textAlign: 'right' }}
                                            />
                                            <span className="currency-symbol">₺</span>
                                        </div>
                                    </div>
                                    <hr className="divider" />
                                    <div className="inv-row total">
                                        <span className="label">Toplam Değer</span>
                                        <span className="val primary">
                                            {isPrivacyMode ? '**** ₺' : `${valid.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺`}
                                        </span>
                                    </div>
                                    <div className="inv-footer">
                                        <span className={`pl-text ${pl >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {isPrivacyMode
                                                ? '**** ₺'
                                                : `${pl >= 0 ? '+' : ''}${pl.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺`
                                            }
                                            <span className="pl-mypct">
                                                (%{Math.abs(plPct).toFixed(2)})
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <AddInvestmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};
