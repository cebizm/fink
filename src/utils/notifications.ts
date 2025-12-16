import type { Subscription, Debt, Notification } from '../types';

export const getNotifications = (subscriptions: Subscription[], debts: Debt[]): Notification[] => {
    const notifications: Notification[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Subscriptions
    subscriptions.forEach((sub) => {
        const paymentDate = new Date(sub.nextPaymentDate);
        paymentDate.setHours(0, 0, 0, 0);

        const timeDiff = paymentDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff < 0) {
            notifications.push({
                id: `sub-overdue-${sub.id}`,
                type: 'overdue',
                message: `${sub.name} ödemesi ${Math.abs(daysDiff)} gün gecikti!`,
                itemId: sub.id,
                itemType: 'subscription',
                daysDiff: daysDiff,
                date: today.toISOString(),
            });
        } else if (daysDiff <= 3) {
            const dayString = daysDiff === 0 ? 'bugün' : daysDiff === 1 ? 'yarın' : `${daysDiff} gün içinde`;
            notifications.push({
                id: `sub-upcoming-${sub.id}`,
                type: 'upcoming',
                message: `${sub.name} ödemesi ${dayString}.`,
                itemId: sub.id,
                itemType: 'subscription',
                daysDiff: daysDiff,
                date: today.toISOString(),
            });
        }
    });

    // 2. Debts
    debts.forEach((debt) => {
        if (!debt.dueDate) return;

        // Calculate next occurrence of the due date
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        let targetDate = new Date(currentYear, currentMonth, debt.dueDate);
        targetDate.setHours(0, 0, 0, 0);

        // If this month's date has passed, check next month?
        // Actually, strictly speaking, if today is 16th and due is 15th, it's virtually "overdue" if checks strictly,
        // but for a static day property, typically users care about the *upcoming* one or *active* one.
        // If it's passed, let's assume looking at next month for "upcoming",
        // BUT we might want to flag "This month's payment might be overdue" if we tracked status.
        // We optimize for "Approaching".

        // Strategy: If targetDate < today, it implies the *next* relevant date is next month.
        // (Unless we assume the user missed it, but without a "paid" status on debts, we can't annoy them with overdue forever).
        if (targetDate < today) {
            targetDate = new Date(currentYear, currentMonth + 1, debt.dueDate);
        }

        const timeDiff = targetDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff <= 3) {
            const dayString = daysDiff === 0 ? 'bugün' : daysDiff === 1 ? 'yarın' : `${daysDiff} gün içinde`;
            notifications.push({
                id: `debt-upcoming-${debt.id}`,
                type: 'upcoming',
                message: `${debt.bankName} - ${debt.name} ödemesi ${dayString}. (Son Ödeme: Ayın ${debt.dueDate}'i)`,
                itemId: debt.id,
                itemType: 'debt',
                daysDiff: daysDiff,
                date: today.toISOString(),
            });
        }
    });

    return notifications.sort((a, b) => a.daysDiff - b.daysDiff);
};
