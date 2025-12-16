import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CreditCard, Calendar, Plus, Trash2, Smartphone, Zap, Droplets, Wifi, Eye, EyeOff } from 'lucide-react';
import { AddSubscriptionModal } from '../Modals/AddSubscriptionModal';
import './SubscriptionList.css';

export const SubscriptionList: React.FC = () => {
    const { subscriptions, deleteSubscription, isPrivacyMode, togglePrivacyMode } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'subscription' | 'bill'>('subscription');

    const filteredSubscriptions = subscriptions.filter(s => {
        // If 'type' is undefined (legacy data), treat as subscription
        const type = s.type || 'subscription';
        return type === activeTab;
    });

    const totalMonthlyFixed = subscriptions
        .filter(s => s.frequency === 'monthly')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const getIcon = (name: string, type: 'subscription' | 'bill') => {
        if (type === 'bill') {
            const lowerName = name.toLowerCase();
            if (lowerName.includes('elektrik')) return <Zap size={24} />;
            if (lowerName.includes('su')) return <Droplets size={24} />;
            if (lowerName.includes('internet') || lowerName.includes('wifi')) return <Wifi size={24} />;
            if (lowerName.includes('telefon') || lowerName.includes('gsm')) return <Smartphone size={24} />;
            return <CreditCard size={24} />;
        }
        return <CreditCard size={24} />;
    };

    return (
        <div className="subscription-page">
            <header className="page-header">
                <div className="header-content">
                    <div>
                        <h2 className="text-2xl font-bold">Abonelikler ve Faturalar</h2>
                        <p className="text-muted">Tekrarlayan giderlerinizi takip edin.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> Yeni Ekle
                    </button>
                </div>
            </header>

            <div className="summary-cards">
                <div className="card summary-card">
                    <div className="summary-header">
                        <h3>Aylık Sabit Maliyet</h3>
                        <button
                            className="privacy-toggle-btn-small"
                            onClick={togglePrivacyMode}
                            title={isPrivacyMode ? "Göster" : "Gizle"}
                        >
                            {isPrivacyMode ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    </div>
                    <p className="summary-amount">
                        {isPrivacyMode ? '**** ₺' : `₺${totalMonthlyFixed.toLocaleString()}`}
                    </p>
                </div>
                <div className="card summary-card">
                    <h3>Aktif {activeTab === 'subscription' ? 'Abonelik' : 'Fatura'}</h3>
                    <p className="summary-amount">{filteredSubscriptions.length}</p>
                </div>
            </div>

            <div className="sub-tabs">
                <button
                    className={`sub-tab ${activeTab === 'subscription' ? 'active' : ''}`}
                    onClick={() => setActiveTab('subscription')}
                >
                    Dijital Abonelikler
                </button>
                <button
                    className={`sub-tab ${activeTab === 'bill' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bill')}
                >
                    Faturalar
                </button>
            </div>

            <div className="subscriptions-grid">
                {filteredSubscriptions.map((sub) => (
                    <div key={sub.id} className="card subscription-card">
                        <div className={`sub-icon ${activeTab}`}>
                            {getIcon(sub.name, sub.type || 'subscription')}
                        </div>
                        <div className="sub-details">
                            <h4 className="sub-name">{sub.name}</h4>
                            <p className="sub-cat">{sub.category}</p>
                            <div className="sub-meta">
                                <span className="sub-freq">
                                    {sub.frequency === 'monthly' ? 'Aylık' : sub.frequency === 'yearly' ? 'Yıllık' : 'Haftalık'}
                                </span>
                                <span className="sub-date"><Calendar size={12} /> Sonraki: {new Date(sub.nextPaymentDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="sub-actions">
                            <div className="sub-cost">
                                {isPrivacyMode ? '**** ₺' : `₺${sub.amount.toLocaleString()}`}
                            </div>
                            <button
                                className="btn-icon-danger"
                                onClick={() => deleteSubscription(sub.id)}
                                title="Sil"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredSubscriptions.length === 0 && (
                    <div className="empty-subs">
                        <p>Henüz {activeTab === 'subscription' ? 'abonelik' : 'fatura'} eklenmemiş.</p>
                    </div>
                )}
            </div>

            <AddSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
