
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ProfileSubPageLayout } from './ProfileSubPageLayout';

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: checked ? 'var(--color-accent-primary)' : '#ccc',
                borderRadius: '34px', transition: '0.4s'
            }}>
                <span style={{
                    position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px',
                    backgroundColor: 'white', borderRadius: '50%', transition: '0.4s',
                    transform: checked ? 'translateX(24px)' : 'translateX(0)'
                }} />
            </span>
        </label>
    </div>
);

export const PrivacySettings: React.FC = () => {
    const { user, updateUser } = useAuth();

    // Default to true if undefined
    const [email, setEmail] = useState(user?.privacySettings?.marketingEmail ?? true);
    const [sms, setSms] = useState(user?.privacySettings?.marketingSms ?? false);
    const [data, setData] = useState(user?.privacySettings?.dataSharing ?? true);

    const handleSave = () => {
        updateUser({
            privacySettings: {
                marketingEmail: email,
                marketingSms: sms,
                dataSharing: data
            }
        });
        alert('Tercihleriniz kaydedildi.');
    };

    return (
        <ProfileSubPageLayout title="Gizlilik & İletişim">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>İletişim İzinleri</h3>
            <Toggle label="Kampanya E-postaları" checked={email} onChange={setEmail} />
            <Toggle label="SMS Bildirimleri" checked={sms} onChange={setSms} />

            <h3 style={{ fontSize: '1rem', margin: '2rem 0 1rem', color: 'var(--color-text-secondary)' }}>Veri Ayarları</h3>
            <Toggle label="Kişiselleştirilmiş Öneriler" checked={data} onChange={setData} />

            <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>KVKK Bilgilendirmesi</h4>
                <p>
                    Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında işlenmektedir.
                    Detaylı bilgi için <Link to="/kvkk" style={{ color: 'var(--color-accent-primary)' }}>Aydınlatma Metni</Link>'ni inceleyebilirsiniz.
                </p>
                <p style={{ marginTop: '0.5rem' }}>
                    Veri işleme izinlerinizi dilediğiniz zaman bu panelden değiştirebilirsiniz.
                </p>
            </div>

            <button onClick={handleSave} className="auth-btn" style={{ marginTop: '2rem' }}>
                Değişiklikleri Kaydet
            </button>
        </ProfileSubPageLayout>
    );
};
