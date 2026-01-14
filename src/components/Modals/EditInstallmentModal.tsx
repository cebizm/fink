import React, { useState, useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import type { CreditCardInstallment } from '../../types';
import './AddDebtModal.css';

interface EditInstallmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (data: Partial<CreditCardInstallment>) => void;
    installment: CreditCardInstallment | null;
}

export const EditInstallmentModal: React.FC<EditInstallmentModalProps> = ({ isOpen, onClose, onUpdate, installment }) => {
    const [description, setDescription] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [installmentCount, setInstallmentCount] = useState('');
    const [paidInstallments, setPaidInstallments] = useState('');

    useEffect(() => {
        if (installment && isOpen) {
            setDescription(installment.description);
            setTotalAmount(installment.totalAmount.toString());
            setInstallmentCount(installment.installmentCount.toString());
            setPaidInstallments(installment.paidInstallments.toString());
        }
    }, [installment, isOpen]);

    if (!isOpen || !installment) return null;

    const monthlyAmount = totalAmount && installmentCount
        ? parseFloat(totalAmount) / parseInt(installmentCount)
        : 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const parsedAmount = parseFloat(totalAmount.toString().replace(',', '.'));
        const parsedCount = parseInt(installmentCount);
        const parsedPaid = parseInt(paidInstallments);

        if (!parsedAmount || parsedAmount <= 0) {
            alert('Lütfen geçerli bir tutar giriniz.');
            return;
        }

        onUpdate({
            description,
            totalAmount: parsedAmount,
            installmentCount: parsedCount,
            paidInstallments: parsedPaid,
            monthlyAmount: parsedAmount / parsedCount
        });

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
                <div className="modal-header">
                    <h2>Taksit Düzenle</h2>
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

                    <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Taksit Sayısı</label>
                            <input
                                type="number"
                                className="add-debt-input"
                                value={installmentCount}
                                onChange={e => setInstallmentCount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Ödenen Taksit</label>
                            <input
                                type="number"
                                className="add-debt-input"
                                value={paidInstallments}
                                onChange={e => setPaidInstallments(e.target.value)}
                                required
                                max={installmentCount} // Cannot pay more than total
                            />
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
                        <button type="submit" className="btn-submit">Güncelle</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
