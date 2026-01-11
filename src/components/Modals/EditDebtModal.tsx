import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import './AddDebtModal.css';

interface EditDebtModalProps {
    isOpen: boolean;
    onClose: () => void;
    debtId: string | null;
}

export const EditDebtModal: React.FC<EditDebtModalProps> = ({ isOpen, onClose, debtId }) => {
    const { debts, updateDebt } = useFinance();

    const [name, setName] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [remainingAmount, setRemainingAmount] = useState('');
    const [minimumPaymentRate, setMinimumPaymentRate] = useState('20');
    const [cutoffDate, setCutoffDate] = useState('');
    const [dueDate, setDueDate] = useState('');

    const debt = debts.find(d => d.id === debtId);

    useEffect(() => {
        if (debt) {
            setName(debt.name);
            setTotalAmount(debt.totalAmount.toString());
            setRemainingAmount(debt.remainingAmount.toString());
            setMinimumPaymentRate((debt.minimumPaymentRate || 20).toString());
            setCutoffDate(debt.cutoffDate?.toString() || '');
            setDueDate(debt.dueDate?.toString() || '');
        }
    }, [debt, isOpen]);

    if (!isOpen || !debt) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const parsedTotal = parseFloat(totalAmount.replace(',', '.')) || 0;
        const parsedRemaining = parseFloat(remainingAmount.replace(',', '.')) || 0;

        updateDebt(debtId!, {
            name,
            totalAmount: parsedTotal,
            remainingAmount: parsedRemaining,
            minimumPaymentRate: parseFloat(minimumPaymentRate) || 20,
            cutoffDate: cutoffDate ? parseInt(cutoffDate) : undefined,
            dueDate: dueDate ? parseInt(dueDate) : undefined
        });

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <h2>Kart Düzenle</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Kart Adı</label>
                        <input
                            type="text"
                            className="add-debt-input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Kart Limiti</label>
                            <div className="input-wrapper">
                                <span className="currency-symbol">₺</span>
                                <input
                                    type="number"
                                    className="add-debt-input"
                                    value={totalAmount}
                                    onChange={e => setTotalAmount(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Güncel Borç</label>
                            <div className="input-wrapper">
                                <span className="currency-symbol">₺</span>
                                <input
                                    type="number"
                                    className="add-debt-input"
                                    value={remainingAmount}
                                    onChange={e => setRemainingAmount(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Hesap Kesim Günü</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                className="add-debt-input"
                                placeholder="1-31"
                                value={cutoffDate}
                                onChange={e => setCutoffDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Son Ödeme Günü</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                className="add-debt-input"
                                placeholder="1-31"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Asgari Ödeme Oranı (%)</label>
                        <div className="input-wrapper">
                            <span className="currency-symbol">%</span>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                className="add-debt-input"
                                value={minimumPaymentRate}
                                onChange={e => setMinimumPaymentRate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>İptal</button>
                        <button type="submit" className="btn-submit">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
