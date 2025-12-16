
import React, { useState } from 'react';
import { ProfileSubPageLayout } from './ProfileSubPageLayout';
import { Check } from 'lucide-react';

export const LanguageSettings: React.FC = () => {
    const [lang, setLang] = useState('tr');

    const languages = [
        { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
    ];

    return (
        <ProfileSubPageLayout title="Dil Seçenekleri">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {languages.map(l => (
                    <div
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '1.25rem 1rem',
                            borderBottom: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            backgroundColor: lang === l.code ? 'var(--color-bg-secondary)' : 'transparent'
                        }}
                    >
                        <span style={{ fontWeight: lang === l.code ? 600 : 400, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>{l.flag}</span> {l.name}
                        </span>
                        {lang === l.code && <Check size={20} color="var(--color-accent-success)" />}
                    </div>
                ))}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '2rem', textAlign: 'center' }}>
                Uygulama dili değiştirildiğinde bazı içerikler sunucu yanıtına bağlı olarak varsayılan dilde kalabilir.
            </p>
        </ProfileSubPageLayout>
    );
};
