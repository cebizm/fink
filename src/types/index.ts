export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
  debtId?: string; // Link to Debt if this is a debt payment
}

export type SubscriptionFrequency = 'monthly' | 'yearly' | 'weekly';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: SubscriptionFrequency;
  nextPaymentDate: string; // ISO string
  category: string;
  type: 'subscription' | 'bill';
  platformId?: string; // Optional: links to subscriptionPlatforms
}

export type InvestmentType = 'currency' | 'gold' | 'stock' | 'deposit';

export interface Investment {
  id: string;
  type: InvestmentType;
  name: string; // e.g. "USD", "Gram Altın", "Apple"
  amount: number; // Quantity
  purchasePrice: number; // Unit price at purchase
  currentPrice: number; // Current market price (user updated)
  date: string;
}

export type DebtType = 'credit_card' | 'loan' | 'cash_advance';

export interface Debt {
  id: string;
  bankName: string;
  type: DebtType;
  name: string; // "Bonus Card", "İhtiyaç Kredisi"
  totalAmount: number; // Limit or Total Loan Amount
  remainingAmount: number; // Current Debt or Remaining Loan
  cutoffDate?: number; // Day of month (1-31)
  dueDate?: number; // Day of month (1-31)
  installment?: number; // Monthly installment amount
}

export type NotificationType = 'upcoming' | 'overdue' | 'goal_invitation' | 'goal_invitation_rejected';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  itemId: string;
  itemType: 'subscription' | 'debt' | 'system' | 'goal_invitation';
  daysDiff: number;
  date: string;
  // For goal invitations
  invitationId?: string;
  inviterName?: string;
  goalTitle?: string;
}

export interface GoalInvitation {
  id: string;
  inviterId: string;
  inviterEmail: string;
  inviterName: string;
  inviteeEmail: string;
  inviteeId?: string;
  goalId?: string; // ID of the goal that was created
  goalData: {
    title: string;
    targetAmount: number;
    deadline: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any; // Firestore Timestamp
  respondedAt?: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isPremium: boolean;
  role: 'user' | 'admin';
  lastLogin?: string; // ISO string
  privacySettings?: {
    marketingEmail: boolean;
    marketingSms: boolean;
    dataSharing: boolean;
  };
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string; // 'technical' | 'billing' | 'suggestion' | 'other'
  message: string;
  status: TicketStatus;
  createdAt: string; // ISO string
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string; // URL or initials
  totalContributed: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO string
  participants: Participant[];
  status: 'active' | 'completed';
  userId?: string; // For backward compatibility with legacy single-user goals
}

export interface FinanceContextType {
  transactions: Transaction[];
  subscriptions: Subscription[];
  debts: Debt[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  deleteSubscription: (id: string) => void;
  paySubscription: (id: string) => void;
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  deleteDebt: (id: string) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  payDebt: (id: string, amount: number) => void;
  investments: Investment[];
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  deleteInvestment: (id: string) => void;
  updateInvestmentPrice: (id: string, newPrice: number) => void;
  refreshMarketRates: () => Promise<void>;
  isLoadingRates: boolean;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount' | 'status' | 'participants'> & { participants: string[] }) => void;
  deleteGoal: (id: string) => void;
  addContribution: (goalId: string, participantId: string, amount: number) => void;

  // Goal Invitations
  goalInvitations: GoalInvitation[];
  acceptInvitation: (invitationId: string) => Promise<void>;
  rejectInvitation: (invitationId: string, inviterUserId: string, inviterName: string, goalTitle: string) => Promise<void>;

  // Notifications
  clearNotification: (notificationId: string) => Promise<void>;

  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  notifications: Notification[];
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
}
