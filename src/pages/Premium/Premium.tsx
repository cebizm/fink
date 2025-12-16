
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PREMIUM_PRICE, FREE_TIER_LIMITS } from '../../constants/limits';
import { VerifiedBadge } from '../../components/Common/VerifiedBadge';
import './Premium.css';

export const PremiumPage: React.FC = () => {
    const navigate = useNavigate();
    const { updateUser, user } = useAuth();

    const handleSubscribe = () => {
        // Feature disabled for now
        alert("Bu özellik şu an bakım aşamasındadır. Çok yakında hizmetinizde olacak! 🚀");
    };

    const handleCancel = () => {
        if (confirm("Premium üyeliğinizi iptal etmek istediğinize emin misiniz? Özelliklerinizi kaybedeceksiniz.")) {
            updateUser({ isPremium: false });
            alert("Üyeliğiniz iptal edildi. Premium avantajlarını kaybettiniz.");
            navigate('/');
        }
    };

    if (user?.isPremium) {
        return (
            <div className="premium-page-container">
                <button
                    onClick={() => navigate(-1)}
                    style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)' }}
                >
                    <ArrowLeft size={32} />
                </button>
                <div style={{ marginTop: '4rem', padding: '3rem', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: '2px solid #FFD700' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Zaten Premium Üyesiniz! 🌟</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Tüm özelliklerin keyfini sınırsızca çıkarıyorsunuz.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="plan-btn outline" onClick={() => navigate('/')} style={{ width: 'auto', padding: '0.75rem 2rem' }}>
                            Ana Sayfa
                        </button>
                        <button
                            className="plan-btn"
                            onClick={handleCancel}
                            style={{ width: 'auto', padding: '0.75rem 2rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}
                        >
                            <X size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> İptal Et
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="premium-page-container">
            <button
                onClick={() => navigate(-1)}
                style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)' }}
            >
                <ArrowLeft size={32} />
            </button>

            <div className="premium-hero">
                <span className="premium-badge">DAHA FAZLA GÜÇ</span>
                <h1 className="premium-title">Fink Premium</h1>
                <p className="premium-subtitle">Sınırları kaldırın, yapay zeka ile geleceği görün ve ailenizle birlikte yönetin.</p>
            </div>

            <div className="pricing-cards">
                <div className="pricing-card">
                    <div className="card-header">
                        <div className="plan-name">Ücretsiz</div>
                        <div className="plan-price">₺0<span className="plan-period">/ay</span></div>
                    </div>
                    <ul className="plan-features">
                        <li className="feature-item"><Check size={20} /> Gelir/Gider Takibi</li>
                        <li className="feature-item"><Check size={20} /> Maksimum {FREE_TIER_LIMITS.MAX_DEBTS} Borç</li>
                        <li className="feature-item"><Check size={20} /> Maksimum {FREE_TIER_LIMITS.MAX_GOALS} Hedef</li>
                        <li className="feature-item disabled"><X size={20} /> Ortak Hesap Kullanımı</li>
                        <li className="feature-item disabled"><X size={20} /> AI Raporları & Tahminler</li>
                    </ul>
                    <button className="plan-btn outline" disabled>Mevcut Plan</button>
                </div>

                <div className="pricing-card featured">
                    <div className="card-header">




                        <div className="plan-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Premium
                            <VerifiedBadge size={24} />
                        </div>
                        <div className="plan-price">₺{PREMIUM_PRICE}<span className="plan-period">/ay</span></div>
                    </div>
                    <ul className="plan-features">
                        <li className="feature-item"><Check size={20} color="#10B981" /> <strong>Sınırsız</strong> Borç Ekleme</li>
                        <li className="feature-item"><Check size={20} color="#10B981" /> <strong>Sınırsız</strong> Hedef Ekleme</li>
                        <li className="feature-item"><Check size={20} color="#10B981" /> Ortak Hesap & Paylaşım</li>
                        <li className="feature-item"><Check size={20} color="#10B981" /> AI Detaylı Raporlar</li>
                        <li className="feature-item"><Check size={20} color="#10B981" /> Gelecek Ay Tahminleri</li>
                    </ul>
                    <button className="btn-plan primary" onClick={handleSubscribe} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-lg)', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#FBBF24', color: 'black', border: 'none' }}>Premium'a Geç</button>
                    <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        Dilediğiniz zaman iptal edebilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
};
