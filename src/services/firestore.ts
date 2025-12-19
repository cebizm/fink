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
import type { Transaction, Subscription, Debt, Goal, Investment, User, SupportTicket, GoalInvitation } from '../types';

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
    // Remove undefined fields to prevent Firestore "Unsupported field value: undefined" error
    const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    await addDoc(collection(db, 'debts'), {
        ...cleanData,
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

// --- Goal Invitations ---
export const findUserByEmail = async (email: string): Promise<User | null> => {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return convertDoc<User>(snapshot.docs[0]);
};

export const createGoalInvitation = async (data: {
    inviterId: string;
    inviterEmail: string;
    inviterName: string;
    inviteeEmail: string;
    inviteeId: string;
    goalData: {
        title: string;
        targetAmount: number;
        deadline: string;
    };
}): Promise<string> => {
    const invitationRef = await addDoc(collection(db, 'goalInvitations'), {
        ...data,
        status: 'pending',
        createdAt: Timestamp.now(),
    });

    // Create notification for invitee
    await addDoc(collection(db, 'notifications'), {
        userId: data.inviteeId,
        type: 'goal_invitation',
        message: `${data.inviterName} seni '${data.goalData.title}' hedefine davet etti`,
        itemId: invitationRef.id,
        itemType: 'goal_invitation',
        invitationId: invitationRef.id,
        inviterName: data.inviterName,
        goalTitle: data.goalData.title,
        date: new Date().toISOString(),
        daysDiff: 0,
        createdAt: Timestamp.now()
    });

    return invitationRef.id;
};

export const subscribeToGoalInvitations = (userId: string, callback: (invitations: GoalInvitation[]) => void) => {
    const q = query(
        collection(db, 'goalInvitations'),
        where('inviteeId', '==', userId),
        where('status', '==', 'pending')
    );
    return onSnapshot(q, snapshot => {
        const invitations = snapshot.docs.map(doc => convertDoc<GoalInvitation>(doc));
        callback(invitations);
    });
};

export const acceptGoalInvitation = async (invitationId: string) => {
    // Get invitation data
    const invitationRef = doc(db, 'goalInvitations', invitationId);
    const invitationSnap = await getDoc(invitationRef);
    if (!invitationSnap.exists()) throw new Error('Invitation not found');

    const invitation = convertDoc<GoalInvitation>(invitationSnap);

    // Create goal with both users as owners
    const goalRef = await addDoc(collection(db, 'goals'), {
        title: invitation.goalData.title,
        targetAmount: invitation.goalData.targetAmount,
        currentAmount: 0,
        deadline: invitation.goalData.deadline,
        status: 'active',
        userId: invitation.inviterId, // For backward compatibility
        participants: [
            {
                id: invitation.inviterId,
                name: invitation.inviterName,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(invitation.inviterName)}&background=random`,
                totalContributed: 0,
                status: 'accepted'
            },
            {
                id: invitation.inviteeId,
                name: 'Ben',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(invitation.inviteeEmail)}&background=random`,
                totalContributed: 0,
                status: 'accepted'
            }
        ],
        createdAt: Timestamp.now()
    });

    // Update invitation status
    await updateDoc(invitationRef, {
        status: 'accepted',
        respondedAt: Timestamp.now()
    });

    return goalRef.id;
};

export const rejectGoalInvitation = async (invitationId: string, inviterUserId: string, inviterName: string, goalTitle: string) => {
    const invitationRef = doc(db, 'goalInvitations', invitationId);

    // Update invitation status
    await updateDoc(invitationRef, {
        status: 'rejected',
        respondedAt: Timestamp.now()
    });

    // Create rejection notification for inviter
    await addDoc(collection(db, 'notifications'), {
        userId: inviterUserId,
        type: 'goal_invitation_rejected',
        message: `${inviterName} '${goalTitle}' davetini reddetti`,
        itemId: invitationId,
        itemType: 'system',
        goalTitle: goalTitle,
        date: new Date().toISOString(),
        daysDiff: 0,
        createdAt: Timestamp.now()
    });
};
