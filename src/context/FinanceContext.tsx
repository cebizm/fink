import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Transaction, Subscription, Investment, Debt, Goal, FinanceContextType, Notification, GoalInvitation } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getNotifications } from '../utils/notifications';
import { useAuth } from './AuthContext';
import {
    subscribeToTransactions, addTransactionToDb, deleteTransactionFromDb, updateTransactionInDb,
    subscribeToSubscriptions, addSubscriptionToDb, deleteSubscriptionFromDb, updateSubscriptionInDb,
    subscribeToDebts, addDebtToDb, deleteDebtFromDb, updateDebtInDb,
    subscribeToGoals, addGoalToDb, deleteGoalFromDb, updateGoalInDb,
    subscribeToInvestments, addInvestmentToDb, deleteInvestmentFromDb, updateInvestmentInDb,
    subscribeToGoalInvitations, acceptGoalInvitation, rejectGoalInvitation
} from '../services/firestore';

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    // State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [goalInvitations, setGoalInvitations] = useState<GoalInvitation[]>([]);
    const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
    const [systemNotifications] = useState<Notification[]>([]);
    const [isLoadingRates] = useState<boolean>(false);

    // Initial Data Fetch & Real-time Subscription
    useEffect(() => {
        if (!user) {
            // Clear data on logout
            setTransactions([]);
            setSubscriptions([]);
            setInvestments([]);
            setDebts([]);
            setGoals([]);
            setGoalInvitations([]);
            return;
        }

        const unsubTrans = subscribeToTransactions(user.id, setTransactions);
        const unsubSubs = subscribeToSubscriptions(user.id, setSubscriptions);
        const unsubDebts = subscribeToDebts(user.id, setDebts);
        const unsubGoals = subscribeToGoals(user.id, setGoals);
        const unsubInvest = subscribeToInvestments(user.id, setInvestments);
        const unsubInvitations = subscribeToGoalInvitations(user.id, setGoalInvitations);

        return () => {
            unsubTrans();
            unsubSubs();
            unsubDebts();
            unsubGoals();
            unsubInvest();
            unsubInvitations();
        };
    }, [user]);

    // Local Storage for Settings Only
    useEffect(() => {
        const savedPrivacy = localStorage.getItem('fink_privacy_mode');
        if (savedPrivacy) setIsPrivacyMode(JSON.parse(savedPrivacy));
    }, []);

    useEffect(() => localStorage.setItem('fink_privacy_mode', JSON.stringify(isPrivacyMode)), [isPrivacyMode]);

    // Actions
    const togglePrivacyMode = () => setIsPrivacyMode(prev => !prev);

    // Wrappers around Firestore Service
    const addTransaction = (t: Omit<Transaction, 'id'>) => {
        if (user) addTransactionToDb(user.id, t);
    };
    const updateTransaction = (id: string, t: Partial<Transaction>) => {
        updateTransactionInDb(id, t);
    };
    const deleteTransaction = (id: string) => deleteTransactionFromDb(id);

    const addSubscription = (s: Omit<Subscription, 'id'>) => {
        if (user) addSubscriptionToDb(user.id, s);
    };
    const deleteSubscription = (id: string) => deleteSubscriptionFromDb(id);

    const paySubscription = (id: string) => {
        const sub = subscriptions.find(s => s.id === id);
        if (!sub || !user) return;

        addTransactionToDb(user.id, {
            type: 'expense',
            amount: sub.amount,
            category: sub.category,
            description: `${sub.name} Ödemesi`,
            date: new Date().toISOString()
        });

        // Calculate next date (Simple +1 month logic for now, or based on frequency)
        const currentNextDate = new Date(sub.nextPaymentDate);
        let nextDate = new Date(currentNextDate);

        if (sub.frequency === 'weekly') {
            nextDate.setDate(nextDate.getDate() + 7);
        } else if (sub.frequency === 'yearly') {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
        } else {
            // Default to monthly
            nextDate.setMonth(nextDate.getMonth() + 1);
        }

        updateSubscriptionInDb(sub.id, { nextPaymentDate: nextDate.toISOString() });
    };

    const addInvestment = (i: Omit<Investment, 'id'>) => {
        if (user) addInvestmentToDb(user.id, i);
    };
    const deleteInvestment = (id: string) => deleteInvestmentFromDb(id);
    const updateInvestmentPrice = (id: string, newPrice: number) => {
        updateInvestmentInDb(id, { currentPrice: newPrice });
    };

    const refreshMarketRates = async () => { };

    const addDebt = async (d: Omit<Debt, 'id'>) => {
        if (!user) return;
        try {
            await addDebtToDb(user.id, d);
        } catch (error) {
            console.error("Error adding debt:", error);
            alert("Borç eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };
    const deleteDebt = (id: string) => deleteDebtFromDb(id);
    const updateDebt = (id: string, d: Partial<Debt>) => updateDebtInDb(id, d);

    const payDebt = (id: string, amount: number) => {
        const debt = debts.find(d => d.id === id);
        if (!debt || !user) return;

        const newRemaining = Math.max(0, debt.remainingAmount - amount);
        updateDebtInDb(id, { remainingAmount: newRemaining });

        addTransactionToDb(user.id, {
            type: 'expense',
            amount,
            category: 'Debt Payment',
            description: `${debt.bankName} - ${debt.name} Ödemesi`,
            date: new Date().toISOString(),
            debtId: id
        });
    };

    // Goals Actions
    const addGoal = (goalData: Omit<Goal, 'id' | 'currentAmount' | 'status' | 'participants'> & { participants: string[] }) => {
        if (!user) return;
        // Construct the full object for Firestore
        const newGoalData = {
            title: goalData.title,
            targetAmount: goalData.targetAmount,
            currentAmount: 0,
            deadline: goalData.deadline,
            status: 'active' as const,
            participants: goalData.participants.map(name => ({
                id: uuidv4(),
                name,
                totalContributed: 0,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                status: (name === 'Ben' ? 'accepted' : 'pending') as "pending" | "accepted" | "rejected"
            }))
        };
        addGoalToDb(user.id, newGoalData);
    };

    const deleteGoal = (id: string) => deleteGoalFromDb(id);

    const addContribution = (goalId: string, participantId: string, amount: number) => {
        const goal = goals.find(g => g.id === goalId);
        if (!goal || !user) return;

        // Calculate new state
        const updatedParticipants = goal.participants.map(p =>
            p.id === participantId
                ? { ...p, totalContributed: (p.totalContributed || 0) + amount }
                : p
        );
        const newCurrentAmount = updatedParticipants.reduce((sum, p) => sum + (p.totalContributed || 0), 0);
        const newStatus = newCurrentAmount >= goal.targetAmount ? 'completed' : 'active';

        // Update DB
        updateGoalInDb(goalId, {
            participants: updatedParticipants,
            currentAmount: newCurrentAmount,
            status: newStatus
        });

        // Add transaction
        if (amount > 0) {
            addTransactionToDb(user.id, {
                type: 'expense',
                amount,
                category: 'Savings',
                description: `${goal.title} Katkısı`,
                date: new Date().toISOString()
            });
        }
    };

    // Derived
    const notifications = [...systemNotifications, ...getNotifications(subscriptions, debts)];
    const totalBalance = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
    const now = new Date();
    const monthlyIncome = transactions
        .filter(t => t.type === 'income' && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
        .reduce((acc, t) => acc + t.amount, 0);
    const monthlyExpenses = transactions
        .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
        .reduce((acc, t) => acc + t.amount, 0);

    const value: FinanceContextType = {
        transactions, subscriptions, debts, investments,
        addTransaction, deleteTransaction, updateTransaction,
        addSubscription, deleteSubscription, paySubscription,
        addDebt, deleteDebt, updateDebt, payDebt,
        addInvestment, deleteInvestment, updateInvestmentPrice,
        refreshMarketRates, isLoadingRates,
        goals, addGoal, deleteGoal, addContribution,
        goalInvitations,
        acceptInvitation: handleAcceptInvitation,
        rejectInvitation: handleRejectInvitation,
        totalBalance, monthlyIncome, monthlyExpenses, notifications,
        isPrivacyMode, togglePrivacyMode
    };

    return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
};
