import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import './PayDebtModal.css';

interface PayDebtModalProps {
    isOpen: boolean;
    onClose: () => void;
    debtId: string | null;
}

export const PayDebtModal: React.FC<PayDebtModalProps> = ({ isOpen, onClose, debtId }) => {
    const { debts, payDebt, isPrivacyMode } = useFinance();
    const [amount, setAmount] = useState('');

    const debt = debts.find(d => d.id === debtId);

    if (!isOpen || !debt) return null;

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (numAmount > 0) {
            payDebt(debt.id, numAmount);
            setAmount('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="pay-modal-content" onClick={e => e.stopPropagation()}>
                <div className="pay-modal-header">
                    <h3>Ödeme Yap: {debt.name}</h3>
                </div>

                <div className="current-debt-info">
                    <span className="debt-label">Güncel Borç</span>
                    <span className="debt-val">
                        {isPrivacyMode ? '**** ₺' : `₺${debt.remainingAmount.toLocaleString()}`}
                    </span>
                </div>

                <form onSubmit={handlePay}>
                    {/* Quick payment buttons for credit cards */}
                    {debt.type === 'credit_card' && debt.remainingAmount > 0 && (
                        <div className="quick-payment-buttons" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            {debt.minimumPaymentRate && (
                                <button
                                    type="button"
                                    className="quick-pay-btn"
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                    onClick={() => setAmount(Math.ceil(debt.remainingAmount * (debt.minimumPaymentRate! / 100)).toString())}
                                >
                                    Asgari (%{debt.minimumPaymentRate})
                                    <br />
                                    <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                                        ₺{Math.ceil(debt.remainingAmount * (debt.minimumPaymentRate / 100)).toLocaleString()}
                                    </span>
                                </button>
                            )}
                            <button
                                type="button"
                                className="quick-pay-btn"
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                                onClick={() => setAmount(debt.remainingAmount.toString())}
                            >
                                Tam Ödeme
                                <br />
                                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                                    ₺{debt.remainingAmount.toLocaleString()}
                                </span>
                            </button>
                        </div>
                    )}

                    <div className="pay-input-wrapper">
                        <span className="currency-prefix">₺</span>
                        <input
                            type="number"
                            className="pay-input"
                            placeholder="Tutar giriniz"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            max={debt.remainingAmount} // Limit payment to debt amount? or allow overpay? Strict for now.
                            step="0.01"
                            autoFocus
                        />
                    </div>

                    <div className="pay-actions">
                        <button type="button" className="btn-pay-cancel" onClick={onClose}>
                            İptal
                        </button>
                        <button type="submit" className="btn-pay-confirm">
                            Öde
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
