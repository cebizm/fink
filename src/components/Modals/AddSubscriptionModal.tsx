import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { searchPlatforms, type SubscriptionPlatform } from '../../constants/subscriptionPlatforms';
import '../Modals/AddTransactionModal.css'; // Reuse styles
import './AddSubscriptionModal.css';

interface AddSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ isOpen, onClose }) => {
    const { addSubscription } = useFinance();
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        frequency: 'monthly' as 'monthly' | 'yearly' | 'weekly',
        nextPaymentDate: new Date().toISOString().split('T')[0],
        category: '',
        type: 'subscription' as 'subscription' | 'bill',
        platformId: '' as string,
    });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<SubscriptionPlatform | null>(null);

    // Filter suggestions based on input and type
    const suggestions = useMemo(() => {
        if (!formData.name || formData.name.length < 1) return [];
        return searchPlatforms(formData.name, formData.type).slice(0, 6);
    }, [formData.name, formData.type]);

    if (!isOpen) return null;

    const handlePlatformSelect = (platform: SubscriptionPlatform) => {
        setSelectedPlatform(platform);
        setFormData({
            ...formData,
            name: platform.name,
            category: platform.category,
            platformId: platform.id,
        });
        setShowSuggestions(false);
    };

    const handleNameChange = (value: string) => {
        setFormData({ ...formData, name: value, platformId: '' });
        setSelectedPlatform(null);
        setShowSuggestions(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addSubscription({
            name: formData.name,
            amount: parseFloat(formData.amount),
            frequency: formData.frequency,
            nextPaymentDate: formData.nextPaymentDate,
            category: formData.category,
            type: formData.type,
            platformId: formData.platformId || undefined,
        });
        onClose();
        setFormData({
            name: '',
            amount: '',
            frequency: 'monthly',
            nextPaymentDate: new Date().toISOString().split('T')[0],
            category: '',
            type: 'subscription',
            platformId: '',
        });
        setSelectedPlatform(null);
    };

    const handleTypeChange = (type: 'subscription' | 'bill') => {
        setFormData({ ...formData, type, name: '', category: '', platformId: '' });
        setSelectedPlatform(null);
    };

    // Helper to check if color is light
    const isLightColor = (hex: string) => {
        const c = hex.replace('#', '');
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <header className="modal-header">
                    <h3 className="modal-title">Abonelik / Fatura Ekle</h3>
                    <button onClick={onClose} className="modal-close">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Tür</label>
                        <div className="type-toggle-group">
                            <button
                                type="button"
                                className={`type-btn-lg ${formData.type === 'subscription' ? 'active' : ''}`}
                                onClick={() => handleTypeChange('subscription')}
                            >
                                Dijital Abonelik
                            </button>
                            <button
                                type="button"
                                className={`type-btn-lg ${formData.type === 'bill' ? 'active' : ''}`}
                                onClick={() => handleTypeChange('bill')}
                            >
                                Fatura
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">İsim</label>
                        <div className="autocomplete-container">
                            {selectedPlatform && selectedPlatform.logo && (
                                <div
                                    className="selected-platform-icon"
                                    style={{ backgroundColor: selectedPlatform.color }}
                                >
                                    <img
                                        src={selectedPlatform.logo}
                                        alt={selectedPlatform.name}
                                        style={{ filter: isLightColor(selectedPlatform.color) ? 'brightness(0)' : 'brightness(0) invert(1)' }}
                                    />
                                </div>
                            )}
                            <input
                                type="text"
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder={formData.type === 'subscription' ? "Netflix, Spotify..." : "Elektrik, Su..."}
                                className={selectedPlatform?.logo ? 'has-icon' : ''}
                                autoComplete="off"
                            />

                            {showSuggestions && suggestions.length > 0 && (
                                <div className="suggestions-dropdown">
                                    {suggestions.map((platform) => (
                                        <div
                                            key={platform.id}
                                            className="suggestion-item"
                                            onClick={() => handlePlatformSelect(platform)}
                                        >
                                            <div
                                                className="suggestion-icon"
                                                style={{ backgroundColor: platform.color }}
                                            >
                                                {platform.logo ? (
                                                    <img
                                                        src={platform.logo}
                                                        alt={platform.name}
                                                        style={{ filter: isLightColor(platform.color) ? 'brightness(0)' : 'brightness(0) invert(1)' }}
                                                    />
                                                ) : (
                                                    <span>{platform.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="suggestion-info">
                                                <span className="suggestion-name">{platform.name}</span>
                                                <span className="suggestion-category">{platform.category}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Tutar</label>
                        <input
                            type="number"
                            id="amount"
                            required
                            min="0"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group">
                        <label>Sıklık</label>
                        <div className="type-toggle">
                            <button
                                type="button"
                                className={`type-btn ${formData.frequency === 'monthly' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, frequency: 'monthly' })}
                            >
                                Aylık
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${formData.frequency === 'yearly' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, frequency: 'yearly' })}
                            >
                                Yıllık
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${formData.frequency === 'weekly' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, frequency: 'weekly' })}
                            >
                                Haftalık
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Kategori</label>
                        <input
                            type="text"
                            id="category"
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Örn. Eğlence, Faturalar"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Sonraki Ödeme Tarihi</label>
                        <input
                            type="date"
                            id="date"
                            required
                            value={formData.nextPaymentDate}
                            onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            İptal
                        </button>
                        <button type="submit" className="btn-primary">
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

