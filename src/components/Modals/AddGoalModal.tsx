import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import './AddTransactionModal.css'; // Reusing modal styles

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose }) => {
    const { addGoal } = useFinance();
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !targetAmount || !deadline) return;

        addGoal({
            title,
            targetAmount: parseFloat(targetAmount),
            deadline,
            participants: ['Ben'] // Single user only
        });

        // Reset
        setTitle('');
        setTargetAmount('');
        setDeadline('');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Yeni Hedef Oluştur</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Hedef Başlığı</label>
                        <input
                            type="text"
                            placeholder="Örn: Alaçatı Tatili"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Hedef Tutar</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={targetAmount}
                            onChange={e => setTargetAmount(e.target.value)}
                            required
                        />
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

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>Ortak Kullanım</label>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                Yakında
                            </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0.5rem 0 0 0' }}>
                            Arkadaşlarınla ortak hedef oluşturma özelliği yakında eklenecek.
                        </p>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                        Hedef Oluştur
                    </button>
                </form>
            </div>
        </div>
    );
};
