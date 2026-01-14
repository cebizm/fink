import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import './AddTransactionModal.css';

interface EditSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscriptionId: string | null;
}

export const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({ isOpen, onClose, subscriptionId }) => {
    const { subscriptions, updateSubscription } = useFinance();

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [nextPaymentDate, setNextPaymentDate] = useState('');

    const subscription = subscriptions.find(s => s.id === subscriptionId);

    useEffect(() => {
        if (subscription && isOpen) {
            setName(subscription.name);
            setAmount(subscription.amount.toString());
            setNextPaymentDate(subscription.nextPaymentDate.split('T')[0]);
        }
    }, [subscription, isOpen]);

    if (!isOpen || !subscription) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateSubscription(subscriptionId!, {
            amount: parseFloat(amount) || 0,
            nextPaymentDate: new Date(nextPaymentDate).toISOString()
        });

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Aboneliği Düzenle</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Abonelik Adı</label>
                        <input
                            type="text"
                            value={name}
                            disabled
                            style={{ opacity: 0.7, cursor: 'not-allowed' }}
                        />
                        <small style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                            Abonelik adı değiştirilemez
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Fiyat (₺)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Sonraki Ödeme Tarihi</label>
                        <input
                            type="date"
                            value={nextPaymentDate}
                            onChange={e => setNextPaymentDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>İptal</button>
                        <button type="submit" className="btn-submit">Güncelle</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
