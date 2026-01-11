// Popular subscription platforms with their logos and branding
export interface SubscriptionPlatform {
    id: string;
    name: string;
    logo: string;
    color: string;
    category: string;
    type: 'subscription' | 'bill';
}

export const subscriptionPlatforms: SubscriptionPlatform[] = [
    // Streaming Services
    {
        id: 'netflix',
        name: 'Netflix',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/netflix.svg',
        color: '#E50914',
        category: 'Eğlence',
        type: 'subscription'
    },
    {
        id: 'spotify',
        name: 'Spotify',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/spotify.svg',
        color: '#1DB954',
        category: 'Müzik',
        type: 'subscription'
    },
    {
        id: 'youtube',
        name: 'YouTube Premium',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg',
        color: '#FF0000',
        category: 'Eğlence',
        type: 'subscription'
    },
    {
        id: 'disney',
        name: 'Disney+',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/disneyplus.svg',
        color: '#113CCF',
        category: 'Eğlence',
        type: 'subscription'
    },
    {
        id: 'amazon-prime',
        name: 'Amazon Prime',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/amazonprime.svg',
        color: '#00A8E1',
        category: 'Eğlence',
        type: 'subscription'
    },
    {
        id: 'apple-music',
        name: 'Apple Music',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/applemusic.svg',
        color: '#FA243C',
        category: 'Müzik',
        type: 'subscription'
    },
    {
        id: 'apple-tv',
        name: 'Apple TV+',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/appletv.svg',
        color: '#000000',
        category: 'Eğlence',
        type: 'subscription'
    },
    {
        id: 'hbo-max',
        name: 'HBO Max',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/hbo.svg',
        color: '#5822B4',
        category: 'Eğlence',
        type: 'subscription'
    },
    {
        id: 'twitch',
        name: 'Twitch',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitch.svg',
        color: '#9146FF',
        category: 'Eğlence',
        type: 'subscription'
    },
    // Gaming
    {
        id: 'playstation',
        name: 'PlayStation Plus',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/playstation.svg',
        color: '#003791',
        category: 'Oyun',
        type: 'subscription'
    },
    {
        id: 'xbox',
        name: 'Xbox Game Pass',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/xbox.svg',
        color: '#107C10',
        category: 'Oyun',
        type: 'subscription'
    },
    {
        id: 'steam',
        name: 'Steam',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/steam.svg',
        color: '#000000',
        category: 'Oyun',
        type: 'subscription'
    },
    // Cloud & Productivity
    {
        id: 'icloud',
        name: 'iCloud',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/icloud.svg',
        color: '#3693F3',
        category: 'Bulut',
        type: 'subscription'
    },
    {
        id: 'google-one',
        name: 'Google One',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg',
        color: '#4285F4',
        category: 'Bulut',
        type: 'subscription'
    },
    {
        id: 'dropbox',
        name: 'Dropbox',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/dropbox.svg',
        color: '#0061FF',
        category: 'Bulut',
        type: 'subscription'
    },
    {
        id: 'microsoft-365',
        name: 'Microsoft 365',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoft.svg',
        color: '#D83B01',
        category: 'Üretkenlik',
        type: 'subscription'
    },
    // Communication
    {
        id: 'zoom',
        name: 'Zoom',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/zoom.svg',
        color: '#2D8CFF',
        category: 'İletişim',
        type: 'subscription'
    },
    {
        id: 'slack',
        name: 'Slack',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/slack.svg',
        color: '#4A154B',
        category: 'İletişim',
        type: 'subscription'
    },
    // Design & Dev
    {
        id: 'figma',
        name: 'Figma',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/figma.svg',
        color: '#F24E1E',
        category: 'Tasarım',
        type: 'subscription'
    },
    {
        id: 'adobe',
        name: 'Adobe Creative Cloud',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/adobe.svg',
        color: '#FF0000',
        category: 'Tasarım',
        type: 'subscription'
    },
    {
        id: 'github',
        name: 'GitHub Pro',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg',
        color: '#181717',
        category: 'Geliştirme',
        type: 'subscription'
    },
    // Turkish Bills
    {
        id: 'elektrik',
        name: 'Elektrik',
        logo: '',
        color: '#FFC107',
        category: 'Fatura',
        type: 'bill'
    },
    {
        id: 'su',
        name: 'Su',
        logo: '',
        color: '#2196F3',
        category: 'Fatura',
        type: 'bill'
    },
    {
        id: 'dogalgaz',
        name: 'Doğalgaz',
        logo: '',
        color: '#FF5722',
        category: 'Fatura',
        type: 'bill'
    },
    {
        id: 'internet',
        name: 'İnternet',
        logo: '',
        color: '#9C27B0',
        category: 'Fatura',
        type: 'bill'
    },
    {
        id: 'telefon',
        name: 'Telefon',
        logo: '',
        color: '#4CAF50',
        category: 'Fatura',
        type: 'bill'
    },
    {
        id: 'turkcell',
        name: 'Turkcell',
        logo: '',
        color: '#FFD100',
        category: 'Fatura',
        type: 'bill'
    },
    {
        id: 'vodafone',
        name: 'Vodafone',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/vodafone.svg',
        color: '#E60000',
        category: 'Fatura',
        type: 'bill'
    },
    {
        id: 'turk-telekom',
        name: 'Türk Telekom',
        logo: '',
        color: '#00A0E3',
        category: 'Fatura',
        type: 'bill'
    },
    // E-Commerce & Shopping
    {
        id: 'trendyol',
        name: 'Trendyol',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/trendyol.svg',
        color: '#F27A1A',
        category: 'Alışveriş',
        type: 'subscription'
    },
    {
        id: 'hepsiburada',
        name: 'Hepsiburada Premium',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/hepsiburada.svg',
        color: '#FF6000',
        category: 'Alışveriş',
        type: 'subscription'
    },
    // Design & Productivity
    {
        id: 'canva',
        name: 'Canva Pro',
        logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/canva.svg',
        color: '#00C4CC',
        category: 'Üretkenlik',
        type: 'subscription'
    }
];

// Helper function to find platform by name
export const findPlatformByName = (name: string): SubscriptionPlatform | undefined => {
    const lowerName = name.toLowerCase();
    return subscriptionPlatforms.find(p =>
        p.name.toLowerCase().includes(lowerName) ||
        p.id.toLowerCase().includes(lowerName)
    );
};

// Helper function to search platforms
export const searchPlatforms = (query: string, type?: 'subscription' | 'bill'): SubscriptionPlatform[] => {
    const lowerQuery = query.toLowerCase();
    return subscriptionPlatforms.filter(p => {
        const matchesQuery = p.name.toLowerCase().includes(lowerQuery) ||
            p.id.toLowerCase().includes(lowerQuery);
        const matchesType = !type || p.type === type;
        return matchesQuery && matchesType;
    });
};
