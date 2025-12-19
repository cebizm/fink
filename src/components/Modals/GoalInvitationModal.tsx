import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import type { GoalInvitation } from '../../types';
import { acceptGoalInvitation, rejectGoalInvitation } from '../../services/firestore';
import './AddTransactionModal.css';

interface GoalInvitationModalProps {
    isOpen: boolean;
    invitation: GoalInvitation | null;
    onClose: () => void;
}

export const GoalInvitationModal: React.FC<GoalInvitationModalProps> = ({ isOpen, invitation, onClose }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !invitation) return null;

    const handleAccept = async () => {
        if (!invitation.inviteeId) return;

        setIsProcessing(true);
        try {
            await acceptGoalInvitation(invitation.id);
            alert(`'${invitation.goalData.title}' hedefine katıldın!`);
            onClose();
        } catch (error) {
            console.error('Error accepting invitation:', error);
            alert('Davet kabul edilirken hata oluştu');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        setIsProcessing(true);
        try {
            await rejectGoalInvitation(
                invitation.id,
                invitation.inviterId,
                invitation.inviteeEmail,
                invitation.goalData.title
            );
            alert('Davet reddedildi');
            onClose();
        } catch (error) {
            console.error('Error rejecting invitation:', error);
            alert('Davet reddedilirken hata oluştu');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <h2>Hedef Daveti</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '1rem 0' }}>
                    <div style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                            <strong>{invitation.inviterName}</strong> seni ortak hedefe davet ediyor
                        </p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
                            {invitation.goalData.title}
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                                    Hedef Tutar
                                </p>
                                <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                                    {formatCurrency(invitation.goalData.targetAmount)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                                    Hedef Tarihi
                                </p>
                                <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                                    {formatDate(invitation.goalData.deadline)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
                        Daveti kabul edersen, hedef her ikinizin listesinde görünecek ve birlikte katkıda bulunabileceksiniz.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button
                            onClick={handleReject}
                            disabled={isProcessing}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'transparent',
                                color: '#ef4444',
                                fontWeight: '600',
                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                opacity: isProcessing ? 0.6 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            <XCircle size={18} />
                            Reddet
                        </button>
                        <button
                            onClick={handleAccept}
                            disabled={isProcessing}
                            className="btn-primary"
                            style={{
                                padding: '0.75rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                opacity: isProcessing ? 0.6 : 1
                            }}
                        >
                            <CheckCircle size={18} />
                            {isProcessing ? 'İşleniyor...' : 'Kabul Et'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
