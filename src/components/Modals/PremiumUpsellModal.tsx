
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check } from 'lucide-react';
import { PREMIUM_PRICE } from '../../constants/limits';
import './PremiumUpsellModal.css';

interface PremiumUpsellModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export const PremiumUpsellModal: React.FC<PremiumUpsellModalProps> = ({
    isOpen,
    onClose,
    title = "Premium'a Yükseltin",
    description = "Bu özelliği kullanmak ve limitleri kaldırmak için Premium üyeliğe geçin."
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleUpgrade = () => {
        onClose();
        navigate('/premium');
    };

    return (
        <div className="upsell-modal-overlay" onClick={onClose}>
            <div className="upsell-modal-content" onClick={e => e.stopPropagation()}>
                <div className="upsell-icon-wrapper">
                    <Crown size={32} color="black" />
                </div>

                <h2 className="upsell-title">{title}</h2>
                <p className="upsell-description">{description}</p>

                <div className="upsell-features">
                    <div className="upsell-feature-item">
                        <Check size={16} color="#10B981" />
                        <span>Sınırsız Borç Takibi</span>
                    </div>
                    <div className="upsell-feature-item">
                        <Check size={16} color="#10B981" />
                        <span>Sınırsız Hedef & Ortak Kullanım</span>
                    </div>
                    <div className="upsell-feature-item">
                        <Check size={16} color="#10B981" />
                        <span>Yapay Zeka Raporları</span>
                    </div>
                </div>

                <button className="upsell-btn-primary" onClick={handleUpgrade}>
                    Hemen Yükselt - ₺{PREMIUM_PRICE}/ay
                </button>

                <button className="upsell-btn-secondary" onClick={onClose}>
                    Belki Daha Sonra
                </button>
            </div>
        </div>
    );
};
