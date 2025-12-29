
import React, { useState } from 'react';
import { ProfileSubPageLayout } from './ProfileSubPageLayout';
import { Check, Lock } from 'lucide-react';

export const LanguageSettings: React.FC = () => {
    const [lang] = useState('tr'); // Fixed to Turkish for now

    const languages = [
        { code: 'tr', name: 'Türkçe', flag: '🇹🇷', available: true },
        { code: 'en', name: 'English', flag: '🇬🇧', available: false },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪', available: false },
        { code: 'es', name: 'Español', flag: '🇪🇸', available: false },
    ];

    return (
        <ProfileSubPageLayout title="Dil Seçenekleri">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {languages.map(l => (
                    <div
                        key={l.code}
                        style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '1.25rem 1rem',
                            borderBottom: '1px solid var(--border-color)',
                            cursor: l.available ? 'pointer' : 'not-allowed',
                            backgroundColor: lang === l.code ? 'var(--color-bg-secondary)' : 'transparent',
                            opacity: l.available ? 1 : 0.5
                        }}
                    >
                        <span style={{ fontWeight: lang === l.code ? 600 : 400, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>{l.flag}</span> {l.name}
                        </span>
                        {lang === l.code && l.available && <Check size={20} color="var(--color-accent-success)" />}
                        {!l.available && (
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.75rem',
                                color: 'var(--color-text-secondary)',
                                backgroundColor: 'var(--color-bg-secondary)',
                                padding: '4px 8px',
                                borderRadius: '4px'
                            }}>
                                <Lock size={12} /> Yakında
                            </span>
                        )}
                    </div>
                ))}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '2rem', textAlign: 'center' }}>
                Diğer diller yakında eklenecektir.
            </p>
        </ProfileSubPageLayout>
    );
};
