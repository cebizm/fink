import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot,
    Timestamp,
    setDoc,
    getDocs,
    getDoc,
    orderBy // Added orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
// Force Rebuild for Vercel - Fix Debts
import type { Transaction, Subscription, Debt, Goal, Investment, User, SupportTicket } from '../types';

// Generic helper to convert Firestore data to our app types
const convertDoc = <T>(doc: any): T => {
    const data = doc.data();
    // Convert Firestore Timestamp to ISO strings if needed, or keep as is
    // For now, we assume simple mapping but might need date conversion
    return {
        id: doc.id,
        ...data
    } as T;
};

// --- Transactions ---
export const subscribeToTransactions = (userId: string, callback: (data: Transaction[]) => void) => {
    const q = query(collection(db, 'transactions'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => convertDoc<Transaction>(doc));
        callback(items);
    });
};

export const addTransactionToDb = async (userId: string, data: Omit<Transaction, 'id'>) => {
    await addDoc(collection(db, 'transactions'), {
        ...data,
        userId,
        createdAt: Timestamp.now()
    });
};

export const deleteTransactionFromDb = async (id: string) => {
    await deleteDoc(doc(db, 'transactions', id));
};

export const updateTransactionInDb = async (id: string, data: Partial<Transaction>) => {
    await updateDoc(doc(db, 'transactions', id), data);
};

// --- Subscriptions ---
export const subscribeToSubscriptions = (userId: string, callback: (data: Subscription[]) => void) => {
    const q = query(collection(db, 'subscriptions'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => convertDoc<Subscription>(doc));
        callback(items);
    });
};

export const addSubscriptionToDb = async (userId: string, data: Omit<Subscription, 'id'>) => {
    await addDoc(collection(db, 'subscriptions'), {
        ...data,
        userId,
        createdAt: Timestamp.now()
    });
};

export const updateSubscriptionInDb = async (id: string, data: Partial<Subscription>) => {
    await updateDoc(doc(db, 'subscriptions', id), data);
};

export const deleteSubscriptionFromDb = async (id: string) => {
    await deleteDoc(doc(db, 'subscriptions', id));
};

// --- Debts ---
export const subscribeToDebts = (userId: string, callback: (data: Debt[]) => void) => {
    const q = query(collection(db, 'debts'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => convertDoc<Debt>(doc));
        callback(items);
    });
};

export const addDebtToDb = async (userId: string, data: Omit<Debt, 'id'>) => {
    await addDoc(collection(db, 'debts'), {
        ...data,
        userId,
        createdAt: Timestamp.now()
    });
};

export const updateDebtInDb = async (id: string, data: Partial<Debt>) => {
    await updateDoc(doc(db, 'debts', id), data);
};

export const deleteDebtFromDb = async (id: string) => {
    await deleteDoc(doc(db, 'debts', id));
};

// --- Goals ---
export const subscribeToGoals = (userId: string, callback: (data: Goal[]) => void) => {
    const q = query(collection(db, 'goals'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => convertDoc<Goal>(doc));
        callback(items);
    });
};

export const addGoalToDb = async (userId: string, data: Omit<Goal, 'id'>) => {
    await addDoc(collection(db, 'goals'), {
        ...data,
        userId,
        createdAt: Timestamp.now()
    });
};
export const updateGoalInDb = async (id: string, data: Partial<Goal>) => {
    await updateDoc(doc(db, 'goals', id), data);
};

export const deleteGoalFromDb = async (id: string) => {
    await deleteDoc(doc(db, 'goals', id));
};

// --- Investments ---
export const subscribeToInvestments = (userId: string, callback: (data: Investment[]) => void) => {
    const q = query(collection(db, 'investments'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => convertDoc<Investment>(doc));
        callback(items);
    });
};

export const addInvestmentToDb = async (userId: string, data: Omit<Investment, 'id'>) => {
    await addDoc(collection(db, 'investments'), {
        ...data,
        userId,
        createdAt: Timestamp.now()
    });
};

export const updateInvestmentInDb = async (id: string, data: Partial<Investment>) => {
    await updateDoc(doc(db, 'investments', id), data);
};

export const deleteInvestmentFromDb = async (id: string) => {
    await deleteDoc(doc(db, 'investments', id));
};

// --- User Management (Admin) ---
export const syncUserToDb = async (authUser: any) => {
    if (!authUser) return;
    const userRef = doc(db, 'users', authUser.uid);

    // We only update lastLogin and basic info. 
    // We do NOT overwrite 'role' or 'isPremium' if they exist, 
    // but we set defaults if they don't.
    // However, setDoc with merge doesn't separate "default if missing" easily without a read first.
    // For efficiency, we'll just merge what we know.
    // If we want to set default role='user', we can do it on creation only?
    // Let's read first.

    // Actually, merging is safer. If field doesn't exist, it adds it.
    // But if we pass { role: 'user' }, it overwrites admin.
    // So we just update generic fields.

    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        // Update existing user: only update meta fields
        await setDoc(userRef, {
            email: authUser.email,
            name: authUser.displayName,
            avatar: authUser.photoURL,
            lastLogin: new Date().toISOString()
        }, { merge: true });
    } else {
        // Create new user: set defaults including role
        await setDoc(userRef, {
            email: authUser.email,
            name: authUser.displayName,
            avatar: authUser.photoURL,
            lastLogin: new Date().toISOString(),
            role: 'user',
            isPremium: false
        });
    }

    const updatedSnapshot = await getDoc(userRef);
    return { id: updatedSnapshot.id, ...updatedSnapshot.data() } as User;
};

export const getAllUsers = async () => {
    const q = query(collection(db, 'users')); // Add limits if needed
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertDoc<User>(doc));
};

// --- Support System ---
export const addSupportTicket = async (data: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    await addDoc(collection(db, 'support_tickets'), {
        ...data,
        status: 'open',
        createdAt: new Date().toISOString()
    });
};

export const getSupportTickets = async () => {
    const q = query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertDoc<SupportTicket>(doc));
};

export const updateTicketStatus = async (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => {
    await updateDoc(doc(db, 'support_tickets', ticketId), { status });
};

export const updateUserPremiumStatus = async (userId: string, isPremium: boolean) => {
    await updateDoc(doc(db, 'users', userId), { isPremium });
};

