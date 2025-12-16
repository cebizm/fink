import type { Transaction } from '../types';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format, isWithinInterval, subMonths, subWeeks, subYears } from 'date-fns';
import { tr } from 'date-fns/locale';

export type PeriodType = 'weekly' | 'monthly' | 'yearly';

export interface TimeSeriesData {
    label: string;
    income: number;
    expense: number;
    date: Date;
}

export interface PeriodStats {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
}

export const getPeriodLabel = (date: Date, type: PeriodType): string => {
    if (type === 'weekly') {
        return `${format(startOfWeek(date, { weekStartsOn: 1 }), 'd MMM', { locale: tr })} - ${format(endOfWeek(date, { weekStartsOn: 1 }), 'd MMM', { locale: tr })}`;
    } else if (type === 'monthly') {
        return format(date, 'MMMM yyyy', { locale: tr });
    } else {
        return format(date, 'yyyy', { locale: tr });
    }
};

export const groupTransactionsByPeriod = (
    transactions: Transaction[],
    type: PeriodType,
    limit: number = 6 // Last 6 periods
): TimeSeriesData[] => {
    const result: TimeSeriesData[] = [];
    const today = new Date();

    for (let i = limit - 1; i >= 0; i--) {
        let date = new Date();
        let start: Date, end: Date;

        if (type === 'weekly') {
            date = subWeeks(today, i);
            start = startOfWeek(date, { weekStartsOn: 1 });
            end = endOfWeek(date, { weekStartsOn: 1 });
        } else if (type === 'monthly') {
            date = subMonths(today, i);
            start = startOfMonth(date);
            end = endOfMonth(date);
        } else { // yearly
            date = subYears(today, i);
            start = startOfYear(date);
            end = endOfYear(date);
        }

        const periodTrans = transactions.filter(t =>
            isWithinInterval(new Date(t.date), { start, end })
        );

        const income = periodTrans
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);

        const expense = periodTrans
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);

        result.push({
            label: getPeriodLabel(date, type),
            income,
            expense,
            date: start
        });
    }

    return result;
};

export const calculateStatsForPeriod = (
    transactions: Transaction[],
    periodDate: Date,
    type: PeriodType
): PeriodStats => {
    let start: Date, end: Date;

    if (type === 'weekly') {
        start = startOfWeek(periodDate, { weekStartsOn: 1 });
        end = endOfWeek(periodDate, { weekStartsOn: 1 });
    } else if (type === 'monthly') {
        start = startOfMonth(periodDate);
        end = endOfMonth(periodDate);
    } else {
        start = startOfYear(periodDate);
        end = endOfYear(periodDate);
    }

    const filtered = transactions.filter(t =>
        isWithinInterval(new Date(t.date), { start, end })
    );

    const totalIncome = filtered
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = filtered
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        transactionCount: filtered.length
    };
};
