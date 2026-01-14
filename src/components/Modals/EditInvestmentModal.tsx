import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import './AddTransactionModal.css';

interface EditInvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    investmentId: string | null;
}

export const EditInvestmentModal: React.FC<EditInvestmentModalProps> = ({ isOpen, onClose, investmentId }) => {
    const { investments, updateInvestment } = useFinance();

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');

    const investment = investments.find(i => i.id === investmentId);

    useEffect(() => {
        if (investment && isOpen) {
            setName(investment.name);
            setAmount(investment.amount?.toString() || '');
            setPurchasePrice(investment.purchasePrice?.toString() || '');
            setCurrentPrice(investment.currentPrice?.toString() || '');
        }
    }, [investment, isOpen]);

    if (!isOpen || !investment) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateInvestment(investmentId!, {
            name,
            amount: parseFloat(amount) || 0,
            purchasePrice: parseFloat(purchasePrice) || 0,
            currentPrice: parseFloat(currentPrice) || 0
        });

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Yatırımı Düzenle</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Varlık Adı</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Miktar ({investment.type === 'gold' ? 'gr' : 'adet'})</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Alış Fiyatı (₺)</label>
                            <input
                                type="number"
                                value={purchasePrice}
                                onChange={e => setPurchasePrice(e.target.value)}
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Güncel Fiyat (₺)</label>
                            <input
                                type="number"
                                value={currentPrice}
                                onChange={e => setCurrentPrice(e.target.value)}
                                step="0.01"
                                required
                            />
                        </div>
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
