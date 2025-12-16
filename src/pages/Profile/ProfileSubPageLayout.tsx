
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Profile.css'; // Reusing profile styles

interface ProfileSubPageLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const ProfileSubPageLayout: React.FC<ProfileSubPageLayoutProps> = ({ title, children }) => {
    const navigate = useNavigate();

    return (
        <div className="profile-container">
            <header className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => navigate('/profile')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        marginLeft: '-0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--color-text-primary)'
                    }}
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ margin: 0 }}>{title}</h2>
            </header>
            <div className="profile-card" style={{ display: 'block' }}>
                {children}
            </div>
        </div>
    );
};
