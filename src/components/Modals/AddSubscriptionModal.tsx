import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
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
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addSubscription({
            name: formData.name,
            amount: parseFloat(formData.amount),
            frequency: formData.frequency,
            nextPaymentDate: formData.nextPaymentDate,
            category: formData.category,
            type: formData.type,
        });
        onClose();
        setFormData({
            name: '',
            amount: '',
            frequency: 'monthly',
            nextPaymentDate: new Date().toISOString().split('T')[0],
            category: '',
            type: 'subscription',
        });
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
                                onClick={() => setFormData({ ...formData, type: 'subscription' })}
                            >
                                Dijital Abonelik
                            </button>
                            <button
                                type="button"
                                className={`type-btn-lg ${formData.type === 'bill' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, type: 'bill' })}
                            >
                                Fatura
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">İsim</label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={formData.type === 'subscription' ? "Örn. Netflix, Spotify" : "Örn. Elektrik, Su"}
                        />
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
