import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import type { CreditCardInstallment } from '../../types';
import './AddDebtModal.css';

interface AddInstallmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (installment: Omit<CreditCardInstallment, 'id'>) => void;
}

export const AddInstallmentModal: React.FC<AddInstallmentModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [description, setDescription] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [installmentCount, setInstallmentCount] = useState('3');

    if (!isOpen) return null;

    const monthlyAmount = totalAmount && installmentCount
        ? parseFloat(totalAmount) / parseInt(installmentCount)
        : 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const parsedAmount = parseFloat(totalAmount.replace(',', '.'));
        const parsedCount = parseInt(installmentCount);

        if (!parsedAmount || parsedAmount <= 0) {
            alert('Lütfen geçerli bir tutar giriniz.');
            return;
        }

        onAdd({
            description,
            totalAmount: parsedAmount,
            installmentCount: parsedCount,
            paidInstallments: 0,
            monthlyAmount: parsedAmount / parsedCount,
            startDate: new Date().toISOString()
        });

        // Reset
        setDescription('');
        setTotalAmount('');
        setInstallmentCount('3');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
                <div className="modal-header">
                    <h2>Taksitli Harcama Ekle</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Harcama Açıklaması</label>
                        <div className="input-wrapper">
                            <ShoppingBag className="input-icon" size={20} />
                            <input
                                type="text"
                                className="add-debt-input"
                                placeholder="Örn: iPhone 15, Buzdolabı"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Toplam Tutar</label>
                        <div className="input-wrapper">
                            <span className="currency-symbol">₺</span>
                            <input
                                type="number"
                                className="add-debt-input"
                                placeholder="0.00"
                                value={totalAmount}
                                onChange={e => setTotalAmount(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Taksit Sayısı</label>
                        <div className="installment-buttons" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {[2, 3, 4, 6, 9, 12, 18, 24].map(count => (
                                <button
                                    key={count}
                                    type="button"
                                    className={`type-btn ${installmentCount === count.toString() ? 'active' : ''}`}
                                    onClick={() => setInstallmentCount(count.toString())}
                                    style={{ flex: '1', minWidth: '50px' }}
                                >
                                    {count}
                                </button>
                            ))}
                        </div>
                    </div>

                    {monthlyAmount > 0 && (
                        <div className="installment-preview" style={{
                            padding: '1rem',
                            background: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1rem',
                            textAlign: 'center'
                        }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Aylık Taksit Tutarı</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent-primary)' }}>
                                {monthlyAmount.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                            </div>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>İptal</button>
                        <button type="submit" className="btn-submit">Taksit Ekle</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
