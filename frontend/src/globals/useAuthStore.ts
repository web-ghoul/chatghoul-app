import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthToken, removeAuthToken } from '../lib/cookies';
import type { User } from '../types/app.d';

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

interface AuthActions {
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setUser: (user) => {
                set({ user, isAuthenticated: !!user });
            },

            setToken: (token) => {
                set({ token });
                if (token) {
                    setAuthToken(token);
                } else {
                    removeAuthToken();
                }
            },

            setAuth: (user, token) => {
                set({ user, token, isAuthenticated: true });
                setAuthToken(token);
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
                removeAuthToken();
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
