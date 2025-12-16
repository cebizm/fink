
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ChevronRight, CreditCard, Shield, Moon, Sun, LogOut, User, MessageCircle, Globe, Trash2 } from 'lucide-react';
import { VerifiedBadge } from '../../components/Common/VerifiedBadge';
import './Profile.css';

export const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // Mock Delete Account Logic
    const handleDeleteAccount = () => {
        if (confirm("Hesabınızı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")) {
            // In a real app, we would call an API here.
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    if (!user) return null;

    return (
        <div className="profile-container">
            <header className="profile-header">
                <h2>Profilim</h2>
            </header>

            <div className="profile-card">
                <img src={user.avatar} alt={user.name} className="profile-avatar" />
                <div className="profile-info">




                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {user.name}
                        {user.isPremium && <VerifiedBadge size={26} />}
                    </h3>
                    <p className="profile-email">{user.email}</p>
                    {user.isPremium && <span className="profile-badge">PREMIUM</span>}
                </div>
            </div>

            <div className="settings-section">
                <div className="settings-item" onClick={() => navigate('/profile/personal')}>
                    <div className="settings-label">
                        <User size={20} />
                        <span>Kişisel Bilgiler</span>
                    </div>
                    <div className="settings-value">
                        <ChevronRight size={16} />
                    </div>
                </div>

                <div className="settings-item" onClick={() => navigate('/profile/payments')}>
                    <div className="settings-label">
                        <CreditCard size={20} />
                        <span>Kayıtlı Kartlarım</span>
                    </div>
                    <div className="settings-value">
                        <ChevronRight size={16} />
                    </div>
                </div>

                <div className="settings-item" onClick={() => navigate('/premium')}>
                    <div className="settings-label">
                        <CreditCard size={20} />
                        <span>Abonelik Yönetimi</span>
                    </div>
                    <div className="settings-value">
                        {user.isPremium ? 'Aktif' : 'Ücretsiz'} <ChevronRight size={16} />
                    </div>
                </div>

                <div className="settings-item" onClick={() => navigate('/profile/privacy')}>
                    <div className="settings-label">
                        <Shield size={20} />
                        <span>Gizlilik & İletişim</span>
                    </div>
                    <div className="settings-value">
                        <ChevronRight size={16} />
                    </div>
                </div>

                <div className="settings-item" onClick={() => navigate('/profile/support')}>
                    <div className="settings-label">
                        <MessageCircle size={20} />
                        <span>Destek</span>
                    </div>
                    <div className="settings-value">
                        <ChevronRight size={16} />
                    </div>
                </div>

                <div className="settings-item" onClick={() => navigate('/profile/language')}>
                    <div className="settings-label">
                        <Globe size={20} />
                        <span>Dil Seçenekleri</span>
                    </div>
                    <div className="settings-value">
                        {/* Default to TR for now */}
                        Türkçe 🇹🇷 <ChevronRight size={16} />
                    </div>
                </div>

                <div className="settings-item" onClick={toggleTheme}>
                    <div className="settings-label">
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        <span>Görünüm</span>
                    </div>
                    <div className="settings-value">
                        {theme === 'dark' ? 'Koyu Mod' : 'Aydınlık Mod'} <ChevronRight size={16} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <button className="logout-btn" onClick={logout}>
                    <LogOut size={18} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} />
                    Çıkış Yap
                </button>

                <button
                    className="logout-btn"
                    onClick={handleDeleteAccount}
                    style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}
                >
                    <Trash2 size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} />
                    Hesabımı Sil
                </button>
            </div>
        </div>
    );
};
