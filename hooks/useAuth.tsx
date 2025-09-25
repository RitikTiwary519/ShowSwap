import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { auth, signInWithGoogle, signOut } from '../services/firebase';
import { ADMIN_UIDS } from '../constants';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    error: string | null;
    login: () => Promise<void>;
    loginWithAdminCredentials: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // onAuthStateChanged now uses the real Firebase listener
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
            // The onAuthStateChanged listener will handle setting the user
        } catch (error: any) {
            console.error("Login failed:", error);
            setError(error?.message || 'Google Sign-In failed.');
            setLoading(false);
        }
    };

    const loginWithAdminCredentials = (username: string, password: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setLoading(true);
            setTimeout(() => {
                if (username === 'alibaba' && password === 'khuljasimsim') {
                    const adminUser: User = {
                        uid: ADMIN_UIDS[0],
                        displayName: 'Admin User',
                        email: 'admin@showswap.io',
                        photoURL: 'https://picsum.photos/seed/admin/100'
                    };
                    setCurrentUser(adminUser);
                    setLoading(false);
                    resolve();
                } else {
                    setLoading(false);
                    reject(new Error('Invalid admin credentials'));
                }
            }, 500);
        });
    };

    const logout = async () => {
        // If the current user is an admin, it's a mock session.
        // Otherwise, it's a real Firebase session.
        if (currentUser && ADMIN_UIDS.includes(currentUser.uid)) {
            setCurrentUser(null);
        } else {
            await signOut();
            // The onAuthStateChanged listener will handle setting user to null
        }
    };

    const value = {
        currentUser,
        loading,
        error,
        login,
        loginWithAdminCredentials,
        logout,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};