import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MessageSquare, Shield, Check, X, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers, getSupportTickets } from '../../services/firestore';
import type { User, SupportTicket } from '../../types';
import './AdminDashboard.css';

export const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'users' | 'tickets'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersData, ticketsData] = await Promise.all([
                getAllUsers(),
                getSupportTickets()
            ]);
            setUsers(usersData);
            setTickets(ticketsData);
        } catch (error) {
            console.error("Failed to load admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolveTicket = async (ticketId: string) => {
        if (!confirm('Bu talebi çözüldü olarak işaretlemek istediğinize emin misiniz?')) return;

        try {
            // Dynamically import to avoid circular dependencies if any, or just import at top. 
            // Better to add import at top.
            const { updateTicketStatus } = await import('../../services/firestore');
            await updateTicketStatus(ticketId, 'resolved');

            // Optimistic update
            setTickets(prev => prev.map(t =>
                t.id === ticketId ? { ...t, status: 'resolved' } : t
            ));

            alert('Talep kapatıldı! ✅');
        } catch (error) {
            console.error(error);
            alert('Bir hata oluştu.');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div className="admin-title">
                    <Shield size={28} className="text-primary" />
                    <h1>Yönetim Paneli</h1>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/')}>
                    Ana Sayfaya Dön
                </button>
            </header>

            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <Users size={20} />
                    Kullanıcılar ({users.length})
                </button>
                <button
                    className={`admin-tab ${activeTab === 'tickets' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tickets')}
                >
                    <MessageSquare size={20} />
                    Destek Talepleri ({tickets.length})
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'users' && (
                    <div className="users-section">
                        <div className="search-bar">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Kullanıcı ara..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="data-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Kullanıcı</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>Üyelik</th>
                                        <th>Son Görülme</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u.id}>
                                            <td className="user-cell">
                                                <img src={u.avatar} alt={u.name} className="user-avatar-sm" />
                                                <span>{u.name}</span>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>
                                                {u.isPremium ? (
                                                    <span className="badge premium">Premium</span>
                                                ) : (
                                                    <span className="badge free">Free</span>
                                                )}
                                            </td>
                                            <td>
                                                {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('tr-TR', {
                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                }) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'tickets' && (
                    <div className="tickets-section">
                        {tickets.length === 0 ? (
                            <div className="empty-state">Henüz destek talebi yok.</div>
                        ) : (
                            <div className="tickets-list">
                                {tickets.map(ticket => (
                                    <div key={ticket.id} className="ticket-card">
                                        <div className="ticket-header">
                                            <span className={`ticket-status ${ticket.status}`}>
                                                {ticket.status === 'open' ? 'Açık' : 'Çözüldü'}
                                            </span>
                                            <span className="ticket-date">
                                                {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                        <h3 className="ticket-subject">{ticket.subject}</h3>
                                        <p className="ticket-message">{ticket.message}</p>
                                        <div className="ticket-footer">
                                            <span className="ticket-user">
                                                Gönderen: <strong>{ticket.userEmail}</strong>
                                            </span>
                                            {ticket.status !== 'resolved' && (
                                                <button
                                                    className="btn-resolve"
                                                    onClick={() => handleResolveTicket(ticket.id)}
                                                >
                                                    <Check size={16} /> Çözüldü Olarak İşaretle
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
