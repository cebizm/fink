import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncUserToDb } from '../services/firestore';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth'; // Fix: type-only import
import { auth } from '../firebase'; // Import auth instance
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>; // Added
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper helper to map Firebase user to our app User type
const mapUser = (firebaseUser: FirebaseUser): User => {
    return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Kullanıcı',
        email: firebaseUser.email || '',
        phone: firebaseUser.phoneNumber || '',
        avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'U')}&background=0D8ABC&color=fff`,
        isPremium: false,
        role: 'user', // Default role
        lastLogin: new Date().toISOString(),
        privacySettings: {
            marketingEmail: true,
            marketingSms: false,
            dataSharing: true
        }
    };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for auth state changes (real-time)
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // 1. Map basic auth data
                const initialUser = mapUser(firebaseUser);
                // 2. Sync with Firestore (create/update lastLogin)
                // This returns the full user data from DB (including role/premium)
                try {
                    const fullUser = await syncUserToDb(firebaseUser);
                    if (fullUser) {
                        setUser({ ...initialUser, ...fullUser });
                    } else {
                        setUser(initialUser);
                    }
                } catch (error) {
                    console.error("Error syncing user:", error);
                    setUser(initialUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (name: string, email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update display name immediately after registration
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: name
            });
            // Force update local state to show name immediately
            setUser({ ...mapUser(userCredential.user), name });
        }
    };

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const updateUser = (data: Partial<User>) => {
        // Local update for mostly visual/mock things for now.
        // In real app, we'd update Firestore user document here.
        setUser(prev => prev ? { ...prev, ...data } : null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, resetPassword, logout, updateUser }}>
            {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    fontFamily: 'system-ui'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>☁️</div>
                    <h2>Fink Sunucuya Bağlanıyor...</h2>
                    <p style={{ color: '#666' }}>Lütfen bekleyin (İlk açılış birkaç saniye sürebilir)</p>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
