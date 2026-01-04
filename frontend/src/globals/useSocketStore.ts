import { create } from 'zustand';

interface SocketState {
    isConnected: boolean;
    typingUsers: Record<string, string[]>; // roomId -> array of userIds typing
    onlineUsers: Set<string>;
    forceLogoutOpen: boolean;
    forceLogoutMessage: string;
}

interface SocketActions {
    setConnected: (connected: boolean) => void;
    setTyping: (roomId: string, userId: string, isTyping: boolean) => void;
    setUserOnline: (userId: string) => void;
    setUserOffline: (userId: string) => void;
    setOnlineUsers: (userIds: string[]) => void;
    openForceLogoutModal: (message: string) => void;
    closeForceLogoutModal: () => void;
    reset: () => void;
}

const initialState: SocketState = {
    isConnected: false,
    typingUsers: {},
    onlineUsers: new Set(),
    forceLogoutOpen: false,
    forceLogoutMessage: '',
};

export const useSocketStore = create<SocketState & SocketActions>((set) => ({
    ...initialState,

    setConnected: (connected) => set({ isConnected: connected }),

    setTyping: (roomId, userId, isTyping) => set((state) => {
        const currentTyping = state.typingUsers[roomId] || [];
        let newTyping: string[];

        if (isTyping) {
            newTyping = currentTyping.includes(userId)
                ? currentTyping
                : [...currentTyping, userId];
        } else {
            newTyping = currentTyping.filter(id => id !== userId);
        }

        return {
            typingUsers: {
                ...state.typingUsers,
                [roomId]: newTyping,
            },
        };
    }),

    setUserOnline: (userId) => set((state) => {
        const newOnlineUsers = new Set(state.onlineUsers);
        newOnlineUsers.add(userId);
        return { onlineUsers: newOnlineUsers };
    }),

    setUserOffline: (userId) => set((state) => {
        const newOnlineUsers = new Set(state.onlineUsers);
        newOnlineUsers.delete(userId);
        return { onlineUsers: newOnlineUsers };
    }),

    setOnlineUsers: (userIds) => set({ onlineUsers: new Set(userIds) }),

    openForceLogoutModal: (message) => set({
        forceLogoutOpen: true,
        forceLogoutMessage: message
    }),

    closeForceLogoutModal: () => set({
        forceLogoutOpen: false,
        forceLogoutMessage: ''
    }),

    reset: () => set(initialState),
}));
