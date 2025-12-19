import React, { useState } from 'react';
import { X, Crown, Mail } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { findUserByEmail, createGoalInvitation } from '../../services/firestore';
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
    const [inviteeEmail, setInviteeEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !targetAmount || !deadline || !user) return;

        setError('');

        try {
            // If there's an invitee email, create invitation (Premium only)
            if (inviteeEmail.trim()) {
                if (!user.isPremium) {
                    setError('Ortak hedef oluşturma özelliği Premium kullanıcılara özeldir.');
                    return;
                }

                setIsSearching(true);

                // Find invitee by email
                const inviteeUser = await findUserByEmail(inviteeEmail.trim());
                if (!inviteeUser) {
                    setError('Bu email adresiyle kayıtlı kullanıcı bulunamadı.');
                    setIsSearching(false);
                    return;
                }

                if (inviteeUser.id === user.id) {
                    setError('Kendinizi hedefe davet edemezsiniz.');
                    setIsSearching(false);
                    return;
                }

                // Create invitation
                await createGoalInvitation({
                    inviterId: user.id,
                    inviterEmail: user.email,
                    inviterName: user.name,
                    inviteeEmail: inviteeUser.email,
                    inviteeId: inviteeUser.id,
                    goalData: {
                        title,
                        targetAmount: parseFloat(targetAmount),
                        deadline
                    }
                });

                alert('Davet gönderildi! Kullanıcı daveti kabul edince hedef oluşturulacak.');
            } else {
                // Solo goal - create immediately
                addGoal({
                    title,
                    targetAmount: parseFloat(targetAmount),
                    deadline,
                    participants: ['Ben']
                });
            }

            // Reset and close
            setTitle('');
            setTargetAmount('');
            setDeadline('');
            setInviteeEmail('');
            setIsSearching(false);
            onClose();
        } catch (err: any) {
            console.error('Error creating goal/invitation:', err);
            setError(err.message || 'Bir hata oluştu');
            setIsSearching(false);
        }
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
                            {!user?.isPremium && (
                                <span style={{ fontSize: '0.75rem', color: '#B45309', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={() => window.location.href = '/premium'}
                                >
                                    <Crown size={12} /> Premium
                                </span>
                            )}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                            <input
                                type="email"
                                placeholder={user?.isPremium ? "Arkadaşının email'i" : "Premium ile ortak hedef oluştur"}
                                value={inviteeEmail}
                                onChange={e => setInviteeEmail(e.target.value)}
                                disabled={!user?.isPremium}
                                style={{
                                    paddingLeft: '35px',
                                    opacity: !user?.isPremium ? 0.6 : 1,
                                    cursor: !user?.isPremium ? 'not-allowed' : 'text'
                                }}
                            />
                        </div>
                        {inviteeEmail && user?.isPremium && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0.5rem 0 0 0' }}>
                                Davet gönderilecek. Kullanıcı kabul edince hedef oluşturulacak.
                            </p>
                        )}
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            color: '#ef4444',
                            fontSize: '0.875rem',
                            marginBottom: '1rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                        disabled={isSearching}
                    >
                        {isSearching ? 'Kullanıcı Aranıyor...' : inviteeEmail ? 'Davet Gönder' : 'Hedef Oluştur'}
                    </button>
                </form>
            </div>
        </div>
    );
};
