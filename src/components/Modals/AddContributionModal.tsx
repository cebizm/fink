import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import './AddTransactionModal.css'; // Reusing modal styles

interface AddContributionModalProps {
    isOpen: boolean;
    onClose: () => void;
    goalId: string | null;
}

export const AddContributionModal: React.FC<AddContributionModalProps> = ({ isOpen, onClose, goalId }) => {
    const { goals, addContribution } = useFinance();
    const [amount, setAmount] = useState('');
    const [selectedParticipantId, setSelectedParticipantId] = useState('');

    const goal = goals.find(g => g.id === goalId);

    useEffect(() => {
        if (isOpen && goal && goal.participants.length > 0) {
            setSelectedParticipantId(goal.participants[0].id);
        }
    }, [isOpen, goal]);

    if (!isOpen || !goal) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !selectedParticipantId) return;

        addContribution(goal.id, selectedParticipantId, parseFloat(amount));

        // Reset
        setAmount('');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Para Ekle</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>{goal.title}</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Kim Yatırıyor?</label>
                        <select
                            value={selectedParticipantId}
                            onChange={e => setSelectedParticipantId(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--color-bg-primary)',
                                color: 'var(--color-text-primary)'
                            }}
                        >
                            {goal.participants.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Tutar</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        Katkı Ekle
                    </button>
                </form>
            </div>
        </div>
    );
};
