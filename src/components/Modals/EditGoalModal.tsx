import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import './AddTransactionModal.css';

interface EditGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    goalId: string | null;
}

export const EditGoalModal: React.FC<EditGoalModalProps> = ({ isOpen, onClose, goalId }) => {
    const { goals, updateGoal } = useFinance();

    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [currency, setCurrency] = useState<'TRY' | 'USD' | 'EUR' | 'GBP'>('TRY');

    const goal = goals.find(g => g.id === goalId);

    useEffect(() => {
        if (goal && isOpen) {
            setTitle(goal.title);
            setTargetAmount(goal.targetAmount.toString());
            setCurrentAmount(goal.currentAmount.toString());
            setDeadline(goal.deadline.split('T')[0]);
            setCurrency(goal.currency || 'TRY');
        }
    }, [goal, isOpen]);

    if (!isOpen || !goal) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateGoal(goalId!, {
            title,
            targetAmount: parseFloat(targetAmount) || 0,
            currentAmount: parseFloat(currentAmount) || 0,
            deadline: new Date(deadline).toISOString(),
            currency
        });

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Hedefi Düzenle</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Hedef Adı</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Hedef Tutar</label>
                            <input
                                type="number"
                                value={targetAmount}
                                onChange={e => setTargetAmount(e.target.value)}
                                placeholder="50000"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Mevcut Birikim</label>
                            <input
                                type="number"
                                value={currentAmount}
                                onChange={e => setCurrentAmount(e.target.value)}
                                placeholder="12500"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ width: '100px' }}>
                            <label>Birim</label>
                            <select
                                value={currency}
                                onChange={e => setCurrency(e.target.value as any)}
                                style={{ height: '44px' }}
                            >
                                <option value="TRY">₺ TL</option>
                                <option value="USD">$ USD</option>
                                <option value="EUR">€ EUR</option>
                                <option value="GBP">£ GBP</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Hedef Tarihi</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                            required
                        />
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
