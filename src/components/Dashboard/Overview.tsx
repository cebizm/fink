import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ArrowUpRight, ArrowDownRight, Wallet, AlertCircle, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
import './Overview.css';

export const Overview: React.FC = () => {
    const { totalBalance, monthlyIncome, monthlyExpenses, transactions, notifications, paySubscription, clearNotification, isPrivacyMode, togglePrivacyMode } = useFinance();

    // Get recent transactions (last 5)
    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <div className="overview-container">
            <header className="page-header">
                <h2 className="text-2xl font-bold">Genel Bakış</h2>
                <p className="text-muted">Tekrar hoş geldiniz, işte finansal özetiniz.</p>
            </header>

            <div className="stats-grid">
                <div className="card stat-card total-balance">
                    <div className="stat-icon-wrapper balance">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <div className="stat-label-row">
                            <p className="stat-label">Toplam Bakiye</p>
                            <button
                                className="privacy-toggle-btn"
                                onClick={togglePrivacyMode}
                                title={isPrivacyMode ? "Göster" : "Gizle"}
                            >
                                {isPrivacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <h3 className="stat-value">
                            {isPrivacyMode ? '**** ₺' : `₺${totalBalance.toLocaleString()}`}
                        </h3>
                    </div>
                </div>

                <div className="card stat-card income">
                    <div className="stat-icon-wrapper income">
                        <ArrowUpRight size={24} />
                    </div>
                    <div>
                        <p className="stat-label">Aylık Gelir</p>
                        <h3 className="stat-value text-success">
                            {isPrivacyMode ? '**** ₺' : `+₺${monthlyIncome.toLocaleString()}`}
                        </h3>
                    </div>
                </div>

                <div className="card stat-card expense">
                    <div className="stat-icon-wrapper expense">
                        <ArrowDownRight size={24} />
                    </div>
                    <div>
                        <p className="stat-label">Aylık Gider</p>
                        <h3 className="stat-value text-danger">
                            {isPrivacyMode ? '**** ₺' : `-₺${monthlyExpenses.toLocaleString()}`}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="content-grid">
                <div className="card recent-activity">
                    <h3 className="card-title">Son Hareketler</h3>
                    {recentTransactions.length > 0 ? (
                        <div className="transaction-list">
                            {recentTransactions.map((t) => (
                                <div key={t.id} className="transaction-item">
                                    <div className={`transaction-icon ${t.type}`}>
                                        {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    </div>
                                    <div className="transaction-info">
                                        <p className="transaction-desc">{t.description}</p>
                                        <p className="transaction-date">{new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`transaction-amount ${t.type}`}>
                                        {isPrivacyMode
                                            ? '**** ₺'
                                            : `${t.type === 'income' ? '+' : '-'}₺${t.amount.toLocaleString()}`
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <AlertCircle size={32} className="text-muted" />
                            <p>Henüz işlem yok</p>
                        </div>
                    )}
                </div>

                <div className="card notifications-card">
                    <h3 className="card-title">Bildirimler</h3>
                    {notifications.length > 0 ? (
                        <div className="notification-list">
                            {notifications.map(n => (
                                <div key={n.id} className={`notification-item ${n.type}`} style={{ position: 'relative', paddingRight: '2.5rem' }}>
                                    <div className="notif-content">
                                        <AlertCircle size={20} className="notif-icon" />
                                        <p>{n.message}</p>
                                    </div>

                                    <button
                                        onClick={() => clearNotification(n.id)}
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            right: '0.75rem',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-text-muted)',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            fontSize: '1.2rem',
                                            lineHeight: 1,
                                            opacity: 0.6,
                                            transition: 'opacity 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                                        title="Bildirimi sil"
                                    >
                                        ×
                                    </button>

                                    {(n.type === 'upcoming' || n.type === 'overdue') && n.itemType !== 'system' ? (
                                        <button
                                            className="btn-pay-xs"
                                            onClick={() => {
                                                if (n.itemType === 'subscription') {
                                                    paySubscription(n.itemId);
                                                } else if (n.itemType === 'debt') {
                                                    // For now, just alert or redirect, typically main pay is via Navbar/Debts
                                                    alert('Borç ödemek için Borçlar sayfasına veya üst menüdeki bildirime gidin.');
                                                }
                                            }}
                                        >
                                            Öde
                                        </button>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>Yeni bildirim yok</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
