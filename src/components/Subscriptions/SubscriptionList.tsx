import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CreditCard, Calendar, Plus, Trash2, Smartphone, Zap, Droplets, Wifi, Eye, EyeOff, Pencil } from 'lucide-react';
import { AddSubscriptionModal } from '../Modals/AddSubscriptionModal';
import { EditSubscriptionModal } from '../Modals/EditSubscriptionModal';
import { subscriptionPlatforms, findPlatformByName } from '../../constants/subscriptionPlatforms';
import './SubscriptionList.css';

export const SubscriptionList: React.FC = () => {
    const { subscriptions, deleteSubscription, isPrivacyMode, togglePrivacyMode } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editSubscriptionId, setEditSubscriptionId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'subscription' | 'bill'>('subscription');

    const filteredSubscriptions = subscriptions.filter(s => {
        // If 'type' is undefined (legacy data), treat as subscription
        const type = s.type || 'subscription';
        return type === activeTab;
    });

    const totalMonthlyFixed = subscriptions
        .filter(s => s.frequency === 'monthly')
        .reduce((acc, curr) => acc + curr.amount, 0);

    // Get platform by ID or name
    const getPlatform = (platformId?: string, name?: string) => {
        if (platformId) {
            return subscriptionPlatforms.find(p => p.id === platformId);
        }
        if (name) {
            return findPlatformByName(name);
        }
        return undefined;
    };

    const getIcon = (sub: { name: string; type?: 'subscription' | 'bill'; platformId?: string }) => {
        const platform = getPlatform(sub.platformId, sub.name);

        // Helper to check if color is light
        const isLightColor = (hex: string) => {
            const c = hex.replace('#', '');
            const r = parseInt(c.substring(0, 2), 16);
            const g = parseInt(c.substring(2, 4), 16);
            const b = parseInt(c.substring(4, 6), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 155;
        };

        if (platform && platform.logo) {
            const lightBg = isLightColor(platform.color);
            return (
                <div
                    className="platform-logo"
                    style={{ backgroundColor: platform.color }}
                >
                    <img
                        src={platform.logo}
                        alt={platform.name}
                        style={{ filter: lightBg ? 'brightness(0)' : 'brightness(0) invert(1)' }}
                    />
                </div>
            );
        }

        if (platform && !platform.logo) {
            return (
                <div
                    className="platform-logo"
                    style={{ backgroundColor: platform.color }}
                >
                    <span>{platform.name.charAt(0)}</span>
                </div>
            );
        }

        // Fallback for bills without logos
        const type = sub.type || 'subscription';
        if (type === 'bill') {
            const lowerName = sub.name.toLowerCase();
            if (lowerName.includes('elektrik')) return <Zap size={24} />;
            if (lowerName.includes('su')) return <Droplets size={24} />;
            if (lowerName.includes('internet') || lowerName.includes('wifi')) return <Wifi size={24} />;
            if (lowerName.includes('telefon') || lowerName.includes('gsm')) return <Smartphone size={24} />;
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
                            {getIcon(sub)}
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
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                    className="btn-icon-danger"
                                    onClick={() => setEditSubscriptionId(sub.id)}
                                    title="Düzenle"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    className="btn-icon-danger"
                                    onClick={() => deleteSubscription(sub.id)}
                                    title="Sil"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
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
            <EditSubscriptionModal
                isOpen={!!editSubscriptionId}
                onClose={() => setEditSubscriptionId(null)}
                subscriptionId={editSubscriptionId}
            />
        </div >
    );
};
