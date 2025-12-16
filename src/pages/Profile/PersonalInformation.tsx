
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProfileSubPageLayout } from './ProfileSubPageLayout';

export const PersonalInformation: React.FC = () => {
    const { user, updateUser } = useAuth();
    // Initialize with optional chaining in case fields are missing (though they shouldn't be for mock user)
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ name, email, phone });
        alert('Bilgileriniz güncellendi! ✅');
    };

    return (
        <ProfileSubPageLayout title="Kişisel Bilgiler">
            <form onSubmit={handleSave} className="auth-form" style={{ marginTop: 0 }}>
                <div className="form-group">
                    <label>Ad Soyad</label>
                    <input
                        className="form-input"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>E-posta</label>
                    <input
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Telefon Numarası</label>
                    <input
                        className="form-input"
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+90 5XX XXX XX XX"
                    />
                </div>
                <button type="submit" className="auth-btn" style={{ marginTop: '1rem' }}>
                    Kaydet
                </button>
            </form>
        </ProfileSubPageLayout>
    );
};
