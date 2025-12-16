import React, { useState } from 'react';
import { ProfileSubPageLayout } from './ProfileSubPageLayout';
import { Plus } from 'lucide-react';
import './PaymentMethods.css';

// Brand Logos - Optimized Sizing

const MastercardLogo = () => (
    <svg width="36" height="24" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', maxHeight: '100%' }}>
        <circle cx="10" cy="10" r="10" fill="#EB001B" />
        <circle cx="22" cy="10" r="10" fill="#F79E1B" fillOpacity="0.8" />
    </svg>
);

const VisaLogo = () => (
    // Standard Visa Aspect Ratio is roughly 3:1. ViewBox 0 0 100 32 fits nice.
    <svg width="44" height="15" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', maxHeight: '100%' }}>
        <path d="M43.7 1.8L37.1 31.2H29.1L35.7 1.8H43.7ZM71.2 21.6C71.3 16.3 64 15.6 64.1 13.5C64.1 12.8 64.7 12.1 66.8 11.9C67.9 11.8 70.8 11.7 73.5 13L74.1 9.8C73.2 9.3 71.3 8.9 69.1 8.9C63.5 8.9 59.5 11.9 59.4 16.2C59.4 19.3 62.2 21 64.3 22C66.5 23.1 67.2 23.7 67.2 24.8C67.2 26.3 65.4 27 63.8 27C61 27 59.3 26.1 58 25.5L57.4 28.8C58.7 29.4 61 29.9 63.5 29.9C69.4 29.9 73.3 26.9 73.4 22.4L73.3 21.2L71.2 21.6ZM94 29.9H100L94.7 1.8H88.8C87.5 1.8 86.4 2.6 85.9 3.9L80.8 29.8H88.6L89.6 27H94.5L94 29.9ZM90.7 22.6L92.7 16.9L93.9 22.6H90.7ZM20.8 1.8L15.4 16L12 3.5C11.8 2.8 11.5 2.6 10.6 2.3C8.9 1.8 6.2 1.3 4.3 0.9L4.6 2.3C6.3 2.7 9.1 3.2 11.4 6.2L14.7 21.4L18.7 29.9H25L32.2 1.8H20.8Z" fill="#1434CB" />
    </svg>
);

const TroyLogo = () => (
    // Troy aspect ratio 500:200 = 2.5:1. 
    // Ensuring it fits in the 60x40 box. 50px width matches ~20px height.
    <svg width="50" height="20" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', maxHeight: '100%' }}>
        <path d="M129.4 46.1L120.9 98.4H90.8V125.7H116.5L108.6 179H78.5V190.5C78.5 204.6 84.1 209.6 96.6 209.6H120.6L112.1 262H93.3C52.6 262 17.4 242.4 17.4 186.2V125.7H-6.10352e-05V98.4H17.4L25.3 46.1H129.4Z" fill="#52565e" />
        <path d="M166.4 98.4H223.3L218.9 125.6H179.6L158.4 262H97.3L122.8 98.4H166.4Z" fill="#52565e" />
        <path d="M228.9 180.2C228.9 135 259.9 98.4 305.8 98.4C351.7 98.4 382.7 135 382.7 180.2C382.7 225.4 351.7 262 305.8 262C259.9 262 228.9 225.4 228.9 180.2ZM323.5 180.2C323.5 162.7 317.1 148.2 305.8 148.2C294.5 148.2 288.1 162.7 288.1 180.2C288.1 197.7 294.5 212.2 305.8 212.2C317.1 212.2 323.5 197.7 323.5 180.2Z" fill="#00aec7" />
        <path d="M389.3 98.4H445.8L413.4 290.4C406.8 329.8 376.1 346.5 336 346.5L327.9 345.8L337.2 295.4C340.5 295.9 344.3 296.2 347.8 296.2C364.6 296.2 371.7 288.3 374.9 269.4L376.1 262L312.4 98.4H374.5L402.6 186.5L389.3 98.4Z" fill="#52565e" />
        {/* Simplified R trademark circle */}
        <circle cx="485" cy="250" r="10" stroke="#52565e" strokeWidth="2" />
        <text x="481" y="254" fill="#52565e" fontSize="12" fontFamily="Arial" fontWeight="bold">R</text>
    </svg>
);

interface SavedCard {
    id: string;
    last4: string;
    brand: 'visa' | 'mastercard' | 'troy';
    expiry: string;
    isDefault: boolean;
}

export const PaymentMethods: React.FC = () => {
    const [cards, setCards] = useState<SavedCard[]>([]);

    const handleSetDefault = (id: string) => {
        setCards(cards.map(c => ({
            ...c,
            isDefault: c.id === id
        })));
    };

    const handleDelete = (id: string) => {
        if (confirm('Bu kartı silmek istediğinize emin misiniz?')) {
            setCards(cards.filter(c => c.id !== id));
        }
    };

    const handleAddCard = () => {
        alert("Yeni kart ekleme simülasyonu çalıştı.");
    };

    return (
        <ProfileSubPageLayout title="Ödeme Yöntemleri">
            <div className="payment-methods-container">
                <p className="intro-text">
                    Google Pay stilinde yönetilen kayıtlı kartlarınız.
                </p>

                <div className="cards-list">
                    {cards.map(card => (
                        <div key={card.id} className="payment-card-google">
                            <div className="card-main-content">
                                <div className="card-logo-box">
                                    {card.brand === 'mastercard' && <MastercardLogo />}
                                    {card.brand === 'visa' && <VisaLogo />}
                                    {card.brand === 'troy' && <TroyLogo />}
                                </div>
                                <div className="card-text-info">
                                    <div className="card-title">
                                        {card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} •••• {card.last4}
                                    </div>
                                    <div className="card-subtitle">
                                        Son kullanma tarihi: {card.expiry}
                                    </div>
                                </div>
                            </div>

                            <div className="card-actions-footer">
                                {!card.isDefault && (
                                    <button
                                        className="text-action-btn"
                                        onClick={() => handleSetDefault(card.id)}
                                    >
                                        Varsayılan Yap
                                    </button>
                                )}
                                {card.isDefault && (
                                    <span className="default-text">Varsayılan</span>
                                )}
                                <button
                                    className="text-action-btn delete"
                                    onClick={() => handleDelete(card.id)}
                                >
                                    Kaldır
                                </button>
                                <button className="text-action-btn">
                                    Düzenle
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button onClick={handleAddCard} className="google-add-btn">
                        <Plus size={18} /> Ödeme yöntemi ekle
                    </button>
                </div>
            </div>
        </ProfileSubPageLayout>
    );
};
