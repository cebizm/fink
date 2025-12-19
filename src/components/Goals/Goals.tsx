import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { AddGoalModal } from '../Modals/AddGoalModal';
import { AddContributionModal } from '../Modals/AddContributionModal';
import './Goals.css';
import { Plus, Target, Check, Trash2 } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { FREE_TIER_LIMITS } from '../../constants/limits';
import { PremiumUpsellModal } from '../Modals/PremiumUpsellModal';

export const Goals: React.FC = () => {
    const { goals, deleteGoal } = useFinance();
    const { user } = useAuth();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpsellOpen, setIsUpsellOpen] = useState(false);
    const [contributionModalGoalId, setContributionModalGoalId] = useState<string | null>(null);

    const handleAddGoal = () => {
        if (!user?.isPremium && goals.length >= FREE_TIER_LIMITS.MAX_GOALS) {
            setIsUpsellOpen(true);
            return;
        }
        setIsAddModalOpen(true);
    };

    const getDaysLeft = (deadline: string) => {
        const diff = new Date(deadline).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="goals-container">
            <div className="goals-header">
                <div>
                    <h2>Hedefler</h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Hayallerine ulaşmak için birikim yap
                    </p>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleAddGoal}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} />
                    Yeni Hedef
                </button>
            </div>

            <div className="goals-grid">
                {goals.map((goal) => {
                    const percentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                    const isCompleted = goal.status === 'completed';
                    const daysLeft = getDaysLeft(goal.deadline);

                    return (
                        <div key={goal.id} className={`goal-card ${isCompleted ? 'completed' : 'active'}`}>
                            <div className="goal-header-row">
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 className="goal-title">{goal.title}</h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Bu hedefi silmek istediğinizden emin misiniz?')) {
                                                    deleteGoal(goal.id);
                                                }
                                            }}
                                            className="icon-btn-danger"
                                            title="Hedefi Sil"
                                            style={{ padding: '4px', marginTop: '-4px', marginRight: '-4px' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="goal-amounts" style={{ marginTop: '0.5rem', marginBottom: '1rem', textAlign: 'right' }}>
                                <div className="current-amount">{formatCurrency(goal.currentAmount)}</div>
                                <div className="target-amount">/ {formatCurrency(goal.targetAmount)}</div>
                            </div>

                            {/* Ultra-simple progress bar */}
                            <div style={{
                                width: '100%',
                                height: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '999px',
                                overflow: 'hidden',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    width: `${percentage}%`,
                                    height: '100%',
                                    backgroundColor: '#84cc16',
                                    borderRadius: '999px',
                                    transition: 'width 0.5s ease-out'
                                }}></div>
                            </div>

                            {/* Show contributions if shared goal */}
                            {goal.participants && goal.participants.length > 1 && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                                        Katkılar
                                    </div>
                                    {goal.participants.map((participant) => (
                                        <div key={participant.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '0.875rem',
                                            marginBottom: '0.25rem'
                                        }}>
                                            <span style={{ fontWeight: '500' }}>{participant.name}</span>
                                            <span style={{ fontWeight: '700' }}>{formatCurrency(participant.totalContributed)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="card-footer">
                                {isCompleted ? (
                                    <div className="completed-badge">
                                        <Check size={16} />
                                        Tamamlandı
                                    </div>
                                ) : (
                                    <div className="days-left">{daysLeft} Gün Kaldı</div>
                                )}

                                {!isCompleted && (
                                    <button
                                        className="add-money-btn"
                                        onClick={() => setContributionModalGoalId(goal.id)}
                                        title="Para Ekle"
                                    >
                                        <Plus size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {goals.length === 0 && (
                    <div className="empty-goals">
                        <Target size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3>Henüz bir hedefin yok</h3>
                        <p>Yeni bir hedef oluştur ve birikime başla!</p>
                    </div>
                )}
            </div>

            <AddGoalModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <AddContributionModal
                isOpen={!!contributionModalGoalId}
                onClose={() => setContributionModalGoalId(null)}
                goalId={contributionModalGoalId}
            />

            <PremiumUpsellModal
                isOpen={isUpsellOpen}
                onClose={() => setIsUpsellOpen(false)}
                description={`Ücretsiz planda en fazla ${FREE_TIER_LIMITS.MAX_GOALS} hedef belirleyebilirsiniz.`}
            />
        </div>
    );
};
