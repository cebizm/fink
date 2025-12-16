import React, { useState } from 'react';
import { X, Building2, Calendar, CreditCard } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import type { DebtType } from '../../types';
import './AddDebtModal.css';

interface AddDebtModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddDebtModal: React.FC<AddDebtModalProps> = ({ isOpen, onClose }) => {
    const { addDebt } = useFinance();
    const [type, setType] = useState<DebtType>('credit_card');

    // Form State
    const [bankName, setBankName] = useState('');
    const [name, setName] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [remainingAmount, setRemainingAmount] = useState('');

    // Dates & Installments
    const [cutoffDate, setCutoffDate] = useState(''); // Day of month
    const [dueDate, setDueDate] = useState(''); // Day of month
    const [installment, setInstallment] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addDebt({
            type,
            bankName,
            name,
            totalAmount: parseFloat(totalAmount),
            remainingAmount: parseFloat(remainingAmount),
            cutoffDate: cutoffDate ? parseInt(cutoffDate) : undefined,
            dueDate: dueDate ? parseInt(dueDate) : undefined,
            installment: installment ? parseFloat(installment) : undefined
        });

        // Reset
        setBankName('');
        setName('');
        setTotalAmount('');
        setRemainingAmount('');
        setCutoffDate('');
        setDueDate('');
        setInstallment('');

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Borç/Kredi Ekle</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Type Selector */}
                    <div className="type-selector">
                        <button
                            type="button"
                            className={`type-btn ${type === 'credit_card' ? 'active' : ''}`}
                            onClick={() => setType('credit_card')}
                        >
                            Kredi Kartı
                        </button>
                        <button
                            type="button"
                            className={`type-btn ${type === 'loan' ? 'active' : ''}`}
                            onClick={() => setType('loan')}
                        >
                            Kredi
                        </button>
                        <button
                            type="button"
                            className={`type-btn ${type === 'cash_advance' ? 'active' : ''}`}
                            onClick={() => setType('cash_advance')}
                        >
                            Nakit Avans
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Banka Adı</label>
                        <div className="input-wrapper">
                            <Building2 className="input-icon" size={20} />
                            <input
                                type="text"
                                className="add-debt-input"
                                placeholder="Örn: Garanti BBVA, İş Bankası"
                                value={bankName}
                                onChange={e => setBankName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Ürün Adı / Tanım</label>
                        <div className="input-wrapper">
                            <CreditCard className="input-icon" size={20} />
                            <input
                                type="text"
                                className="add-debt-input"
                                placeholder={type === 'credit_card' ? "Örn: Bonus Platinum" : "Örn: İhtiyaç Kredisi"}
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>{type === 'credit_card' ? 'Kart Limiti' : 'Toplam Çekilen Tutar'}</label>
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

                        <div className="form-group" style={{ flex: 1 }}>
                            <label>{type === 'credit_card' ? 'Güncel Borç' : 'Kalan Ana Para'}</label>
                            <div className="input-wrapper">
                                <span className="currency-symbol">₺</span>
                                <input
                                    type="number"
                                    className="add-debt-input"
                                    placeholder="0.00"
                                    value={remainingAmount}
                                    onChange={e => setRemainingAmount(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {type === 'credit_card' ? (
                        <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Hesap Kesim Günü</label>
                                <div className="input-wrapper">
                                    <Calendar className="input-icon" size={20} />
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        className="add-debt-input"
                                        placeholder="Gün (1-31)"
                                        value={cutoffDate}
                                        onChange={e => setCutoffDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Son Ödeme Günü</label>
                                <div className="input-wrapper">
                                    <Calendar className="input-icon" size={20} />
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        className="add-debt-input"
                                        placeholder="Gün (1-31)"
                                        value={dueDate}
                                        onChange={e => setDueDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Aylık Taksit Tutarı</label>
                                <div className="input-wrapper">
                                    <span className="currency-symbol">₺</span>
                                    <input
                                        type="number"
                                        className="add-debt-input"
                                        placeholder="0.00"
                                        value={installment}
                                        onChange={e => setInstallment(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Ödeme Günü</label>
                                <div className="input-wrapper">
                                    <Calendar className="input-icon" size={20} />
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        className="add-debt-input"
                                        placeholder="Gün (1-31)"
                                        value={dueDate}
                                        onChange={e => setDueDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>İptal</button>
                        <button type="submit" className="btn-submit">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
