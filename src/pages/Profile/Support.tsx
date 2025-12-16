import React, { useState } from 'react';
import { ProfileSubPageLayout } from './ProfileSubPageLayout';
import { Mail, Phone, MapPin, Instagram, Twitter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { addSupportTicket } from '../../services/firestore';
import type { TicketStatus } from '../../types';

export const Support: React.FC = () => {
    const { user } = useAuth();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            await addSupportTicket({
                userId: user.id,
                userEmail: user.email,
                subject,
                message,
            });
            alert('Talebiniz alınmıştır! Ekibimiz en kısa sürede dönüş yapacaktır. 📨');
            setSubject('');
            setMessage('');
        } catch (error) {
            console.error(error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProfileSubPageLayout title="Destek">
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>İletişim Bilgileri</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--color-text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Mail size={18} /> support@finkapp.com
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Phone size={18} /> +90 (212) 555 00 00
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <MapPin size={18} /> Levent, İstanbul / Türkiye
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <Instagram className="cursor-pointer hover:text-primary" />
                        <Twitter className="cursor-pointer hover:text-primary" />
                    </div>
                </div>
            </div>

            <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0', opacity: 0.5 }} />

            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Bize Yazın</h3>
            <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: 0 }}>
                <div className="form-group">
                    <label>Konu</label>
                    <select
                        className="form-input"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        required
                    >
                        <option value="">Seçiniz...</option>
                        <option value="technical">Teknik Sorun</option>
                        <option value="billing">Ödeme / Abonelik</option>
                        <option value="suggestion">Öneri / İstek</option>
                        <option value="other">Diğer</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Mesajınız</label>
                    <textarea
                        className="form-input"
                        rows={4}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Size nasıl yardımcı olabiliriz?"
                        required
                        style={{ resize: 'vertical' }}
                    />
                </div>
                <button
                    type="submit"
                    className="auth-btn"
                    style={{ marginTop: '1rem' }}
                    disabled={loading}
                >
                    {loading ? 'Gönderiliyor...' : 'Gönder'}
                </button>
            </form>
        </ProfileSubPageLayout>
    );
};
