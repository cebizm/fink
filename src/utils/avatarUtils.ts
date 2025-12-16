export const getInitials = (name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const colors = [
    '#3B82F6', // Blue 500
    '#6366F1', // Indigo 500
    '#8B5CF6', // Violet 500
    '#A855F7', // Purple 500
    '#0EA5E9', // Sky 500
    '#2563EB', // Blue 600
    '#7C3AED', // Violet 600
    '#4F46E5', // Indigo 600
    '#9333EA', // Purple 600
];

export const getAvatarColor = (name: string): string => {
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
};
