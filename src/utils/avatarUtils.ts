export const getInitials = (name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const colors = [
    '#EF4444', // Red 500
    '#F97316', // Orange 500
    '#F59E0B', // Amber 500
    '#10B981', // Emerald 500
    '#3B82F6', // Blue 500
    '#6366F1', // Indigo 500
    '#8B5CF6', // Violet 500
    '#EC4899', // Pink 500
    '#14B8A6', // Teal 500
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
