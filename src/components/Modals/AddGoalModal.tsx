import React, { useState } from 'react';
import { X, Plus, Users, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import './AddTransactionModal.css'; // Reusing modal styles

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose }) => {
    const { addGoal } = useFinance();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [newParticipant, setNewParticipant] = useState('');
    const [participants, setParticipants] = useState<string[]>(['Ben']); // Default user

    if (!isOpen) return null;

    const handleAddParticipant = () => {
        if (newParticipant.trim()) {
            setParticipants([...participants, newParticipant.trim()]);
            setNewParticipant('');
        }
    };

    const handleRemoveParticipant = (index: number) => {
        setParticipants(participants.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !targetAmount || !deadline) return;

        addGoal({
            title,
            targetAmount: parseFloat(targetAmount),
            deadline,
            participants
        });

        // Reset
        setTitle('');
        setTargetAmount('');
        setDeadline('');
        setParticipants(['Ben']);
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
                            <label>Katılımcılar</label>
                            {!user?.isPremium && (
                                <span
                                    onClick={() => window.location.href = '/premium'}
                                    style={{ fontSize: '0.75rem', color: '#B45309', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Crown size={12} /> Premium ile Paylaş
                                </span>
                            )}
                        </div>
                        <div className="participant-input-row" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder={!user?.isPremium ? "Ortak kullanım Premium'a özeldir" : "Arkadaş Ekle (İsim)"}
                                value={newParticipant}
                                onChange={e => setNewParticipant(e.target.value)}
                                disabled={!user?.isPremium}
                                style={{ opacity: !user?.isPremium ? 0.7 : 1 }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddParticipant();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleAddParticipant}
                                disabled={!user?.isPremium}
                                style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', opacity: !user?.isPremium ? 0.5 : 1 }}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {participants.map((p, index) => (
                                <div
                                    key={index}
                                    style={{
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.875rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}
                                >
                                    <Users size={14} />
                                    {p}
                                    {index > 0 && ( // Don't allow removing self ('Ben')
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveParticipant(index)}
                                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, marginLeft: '4px' }}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                        Hedef Oluştur
                    </button>
                </form>
            </div>
        </div>
    );
};
