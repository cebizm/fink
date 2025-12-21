import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, CalendarClock, Bell, PieChart, Wallet, Landmark, Moon, Sun, Target, Menu, X, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { PayDebtModal } from '../Modals/PayDebtModal';
import { GoalInvitationModal } from '../Modals/GoalInvitationModal';
import { VerifiedBadge } from '../Common/VerifiedBadge';
import { getInitials, getAvatarColor } from '../../utils/avatarUtils';
import './Navbar.css';

const navItems = [
    { icon: LayoutDashboard, label: 'Genel Bakış', path: '/dashboard' },
    { icon: Receipt, label: 'İşlemler', path: '/transactions' },
    { icon: CalendarClock, label: 'Abonelikler', path: '/subscriptions' },
    { icon: Landmark, label: 'Borçlar', path: '/debts' },
    { icon: Target, label: 'Hedefler', path: '/goals' },
    { icon: PieChart, label: 'Raporlar', path: '/reports' },
    { icon: Wallet, label: 'Birikimler', path: '/investments' },
];

export const Navbar: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { notifications, paySubscription, goalInvitations, clearNotification } = useFinance();
    const { user, logout } = useAuth();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [payModalDebtId, setPayModalDebtId] = useState<string | null>(null);
    const [invitationModalOpen, setInvitationModalOpen] = useState(false);
    const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null);
    const location = useLocation();

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const toggleNotif = () => setIsNotifOpen(!isNotifOpen);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.notification-wrapper')) {
                setIsNotifOpen(false);
            }
        };

        if (isNotifOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isNotifOpen]);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    {/* Hamburger Button (Mobile Only) */}
                    <button className="hamburger-btn" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
                        <div className="logo-text">Fink</div>
                    </Link>

                    <div className="nav-links">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <item.icon size={18} />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="navbar-right">
                    <button className="icon-btn theme-toggle" onClick={toggleTheme} title="Tema Değiştir">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <div className="notification-wrapper" style={{ position: 'relative' }}>
                        <button
                            className={`icon-btn ${isNotifOpen ? 'active' : ''}`}
                            onClick={toggleNotif}
                        >
                            <Bell size={20} />
                            {notifications.length > 0 && (
                                <span className="notification-badge">{notifications.length}</span>
                            )}
                        </button>

                        {isNotifOpen && (
                            <div className="notification-popover">
                                <div className="popover-header">
                                    <h3>Bildirimler</h3>
                                    <span className="badge">{notifications.length} Yeni</span>
                                </div>
                                <div className="popover-content">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div key={notif.id} className={`notification-item ${notif.type}`} style={{ position: 'relative', paddingRight: '2.5rem' }}>
                                                <div className="notif-content-left" style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                                                    <div className="notif-icon">
                                                        {notif.type === 'upcoming' ? <CalendarClock size={16} /> : <Receipt size={16} />}
                                                    </div>
                                                    <div className="notif-details">
                                                        <p className="notif-message">{notif.message}</p>
                                                        <p className="notif-date">{new Date(notif.date).toLocaleDateString('tr-TR')}</p>
                                                    </div>
                                                </div>

                                                {/* X button - fixed position on right */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        clearNotification(notif.id);
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        right: '0.75rem',
                                                        transform: 'translateY(-50%)',
                                                        background: 'none',
                                                        border: 'none',
                                                        color: 'var(--color-text-muted)',
                                                        cursor: 'pointer',
                                                        padding: '0.5rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        opacity: 0.6,
                                                        transition: 'opacity 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                                                    title="Bildirimi sil"
                                                >
                                                    <X size={16} />
                                                </button>

                                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                    {notif.itemType !== 'system' && (
                                                        <>
                                                            {notif.type === 'goal_invitation' ? (
                                                                <button
                                                                    className="btn-pay-sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedInvitationId(notif.invitationId || notif.itemId);
                                                                        setInvitationModalOpen(true);
                                                                        setIsNotifOpen(false);
                                                                    }}
                                                                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                                                                >
                                                                    Görüntüle
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="btn-pay-sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (notif.itemType === 'debt') {
                                                                            setPayModalDebtId(notif.itemId);
                                                                        } else if (notif.itemType === 'subscription') {
                                                                            if (confirm(`${notif.message}\nBunu ödendi olarak işaretlemek istiyor musunuz?`)) {
                                                                                paySubscription(notif.itemId);
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    Öde
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-state">
                                            <Bell size={24} className="text-muted" />
                                            <p>Bildiriminiz yok</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {user?.role === 'admin' && (
                        <Link to="/admin" className="icon-btn" title="Admin Paneli" style={{ marginRight: '0.5rem', color: '#7c3aed' }}>
                            <LayoutDashboard size={20} />
                        </Link>
                    )}

                    <Link to="/profile" style={{ textDecoration: 'none' }}>
                        <div className="user-profile">
                            <div className="avatar" style={{
                                backgroundColor: user?.avatar ? 'transparent' : getAvatarColor(user?.name || ''),
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {/* If we have auth, show user avatar, else Initials */}
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                ) : (
                                    getInitials(user?.name || "User")
                                )}
                            </div>
                            <div className="user-info">
                                <p className="user-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {user?.name || "Kullanıcı"}
                                    {user?.isPremium && <VerifiedBadge size={16} />}
                                </p>
                                <p className="user-plan">{user?.isPremium ? "Premium" : "Free"}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <span className="mobile-menu-title">Menü</span>
                    <button className="icon-btn" onClick={toggleMenu}><X size={24} /></button>
                </div>
                <div className="mobile-menu-items">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `mobile-menu-item ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}

                    {/* Admin Link for Mobile */}
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="mobile-menu-item" style={{ color: '#7c3aed' }}>
                            <LayoutDashboard size={20} />
                            Admin Paneli
                        </Link>
                    )}

                    <div className="mobile-menu-divider"></div>

                    <button className="mobile-menu-item text-danger" onClick={logout}>
                        <LogOut size={20} />
                        Çıkış Yap
                    </button>
                </div>
            </div>

            <PayDebtModal
                isOpen={!!payModalDebtId}
                debtId={payModalDebtId}
                onClose={() => setPayModalDebtId(null)}
            />

            <GoalInvitationModal
                isOpen={invitationModalOpen}
                invitation={goalInvitations.find(inv => inv.id === selectedInvitationId) || null}
                onClose={() => {
                    setInvitationModalOpen(false);
                    setSelectedInvitationId(null);
                }}
            />
        </nav >
    );
};
