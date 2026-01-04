import { create } from "zustand";
import type { Room, Message } from "../types/app.d";
import { useAuthStore } from "./useAuthStore";

const sortRooms = (rooms: Room[]) => {
    const currentUserId = String(useAuthStore.getState().user?._id);
    return [...rooms].sort((a, b) => {
        const aPinned = a.pinnedBy?.some(id => String(id) === currentUserId);
        const bPinned = b.pinnedBy?.some(id => String(id) === currentUserId);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });
};

export type ChatsState = {
    room?: string;
    chatTab: "chats" | "new_chat" | "new_group" | "starred_messages";
    roomTab?: "info" | "permissions" | "media" | "search";
    rooms: Room[];
    messages: Record<string, Message[]>;
    isLoadingRooms: boolean;
    isLoadingMessages: boolean;
};

type ChatsActions = {
    setRoom: (payload?: string) => void;
    setChatTab: (payload: "chats" | "new_chat" | "new_group" | "starred_messages") => void;
    setRoomTab: (payload?: "info" | "permissions" | "media" | "search") => void;
    // Room actions
    setRooms: (rooms: Room[]) => void;
    addRoom: (room: Room) => void;
    updateRoom: (roomId: string, updates: Partial<Room>) => void;
    // Message actions
    setMessages: (roomId: string, messages: Message[]) => void;
    addMessage: (message: Message) => void;
    prependMessages: (roomId: string, messages: Message[]) => void;
    // Loading states
    setLoadingRooms: (loading: boolean) => void;
    setLoadingMessages: (loading: boolean) => void;
    markRoomAsRead: (roomId: string, userId: string) => void;
    markRoomAsDelivered: (roomId: string, userId: string) => void;
    // Reset
    reset: () => void;
};

const initialState: Omit<ChatsState, 'room'> = {
    chatTab: 'chats',
    roomTab: undefined,
    rooms: [],
    messages: {},
    isLoadingRooms: false,
    isLoadingMessages: false,
};

export const useChatsStore = create<ChatsState & ChatsActions>((set) => ({
    ...initialState,
    room: undefined,

    setRoom: (payload) => set({ room: payload }),
    setChatTab: (payload) => set({ chatTab: payload }),
    setRoomTab: (payload) => set({ roomTab: payload }),

    // Room actions
    setRooms: (rooms) => set({ rooms: sortRooms(rooms) }),
    addRoom: (room) => set((state) => ({
        rooms: sortRooms([room, ...state.rooms.filter(r => r._id !== room._id)])
    })),
    updateRoom: (roomId, updates) => set((state) => ({
        rooms: sortRooms(state.rooms.map(r => r._id === roomId ? { ...r, ...updates } : r))
    })),

    // Message actions
    setMessages: (roomId, messages) => set((state) => ({
        messages: { ...state.messages, [roomId]: messages }
    })),
    addMessage: (message) => set((state) => {
        const roomId = typeof message.room === 'string' ? message.room : message.room._id;
        const currentMessages = state.messages[roomId] || [];
        // Avoid duplicates
        if (currentMessages.some(m => m._id === message._id)) {
            return state;
        }
        return {
            messages: {
                ...state.messages,
                [roomId]: [...currentMessages, message]
            },
            // Update room's last message
            rooms: sortRooms(state.rooms.map(r =>
                r._id === roomId
                    ? { ...r, lastMessage: message, updatedAt: message.createdAt }
                    : r
            ))
        };
    }),
    prependMessages: (roomId, messages) => set((state) => ({
        messages: {
            ...state.messages,
            [roomId]: [...messages, ...(state.messages[roomId] || [])]
        }
    })),

    // Loading states
    setLoadingMessages: (loading: boolean) => set({ isLoadingMessages: loading }),
    setLoadingRooms: (loading) => set({ isLoadingRooms: loading }),

    markRoomAsRead: (roomId, userId) => set((state) => ({
        messages: {
            ...state.messages,
            [roomId]: (state.messages[roomId] || []).map(msg => ({
                ...msg,
                readBy: String(msg.sender._id) !== String(userId)
                    ? [...new Set([...(msg.readBy || []), userId])]
                    : msg.readBy,
                deliveredTo: String(msg.sender._id) !== String(userId)
                    ? [...new Set([...(msg.deliveredTo || []), userId])]
                    : msg.deliveredTo
            }))
        },
        rooms: state.rooms.map(r => {
            if (r._id !== roomId) return r;

            // Also update lastMessage if it's not from the person who read it
            const lastMessage = r.lastMessage;
            if (lastMessage && String(lastMessage.sender._id) !== String(userId)) {
                return {
                    ...r,
                    unreadCounts: { ...r.unreadCounts, [userId]: 0 },
                    lastMessage: {
                        ...lastMessage,
                        readBy: [...new Set([...(lastMessage.readBy || []), userId])],
                        deliveredTo: [...new Set([...(lastMessage.deliveredTo || []), userId])]
                    }
                };
            }

            return { ...r, unreadCounts: { ...r.unreadCounts, [userId]: 0 } };
        })
    })),

    markRoomAsDelivered: (roomId, userId) => set((state) => ({
        messages: {
            ...state.messages,
            [roomId]: (state.messages[roomId] || []).map(msg => ({
                ...msg,
                deliveredTo: String(msg.sender._id) !== String(userId)
                    ? [...new Set([...(msg.deliveredTo || []), userId])]
                    : msg.deliveredTo
            }))
        },
        rooms: state.rooms.map(r => {
            if (r._id !== roomId) return r;

            const lastMessage = r.lastMessage;
            if (lastMessage && String(lastMessage.sender._id) !== String(userId)) {
                return {
                    ...r,
                    lastMessage: {
                        ...lastMessage,
                        deliveredTo: [...new Set([...(lastMessage.deliveredTo || []), userId])]
                    }
                };
            }
            return r;
        })
    })),

    // Reset
    reset: () => set({ ...initialState, room: undefined }),
}));
