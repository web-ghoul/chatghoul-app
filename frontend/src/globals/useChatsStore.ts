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
    roomTab?: "info" | "permissions" | "media" | "search" | "starred";
    rooms: Room[];
    messages: Record<string, Message[]>;
    isLoadingRooms: boolean;
    isLoadingMessages: boolean;
};

export type ChatsActions = {
    setRoom: (payload?: string) => void;
    setChatTab: (payload: "chats" | "new_chat" | "new_group" | "starred_messages") => void;
    setRoomTab: (payload?: "info" | "permissions" | "media" | "search" | "starred") => void;
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
    // User actions
    blockUser: (targetId: string) => Promise<void>;
    unblockUser: (targetId: string) => Promise<void>;
    reportUser: (targetId: string) => Promise<void>;
    // Message star
    toggleMessageStar: (messageId: string) => Promise<void>;
    // Message delete
    deleteMessage: (messageId: string) => Promise<void>;
    // Message pin
    pinMessage: (roomId: string, messageId: string) => Promise<void>;
    unpinMessage: (roomId: string, messageId: string) => Promise<void>;
    // Room actions (Phase 2)
    clearChat: (roomId: string) => Promise<void>;
    deleteChat: (roomId: string) => Promise<void>;
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

    blockUser: async (targetId) => {
        const { user } = useAuthStore.getState();
        if (!user) return;
        try {
            const { default: userService } = await import("../services/user.service");
            await userService.blockUser(targetId);
            useAuthStore.getState().setUser({
                ...user,
                blockedUsers: [...(user.blockedUsers || []), targetId]
            });
        } catch (error) {
            console.error("Failed to block user:", error);
            throw error;
        }
    },

    unblockUser: async (targetId) => {
        const { user } = useAuthStore.getState();
        if (!user) return;
        try {
            const { default: userService } = await import("../services/user.service");
            await userService.unblockUser(targetId);
            useAuthStore.getState().setUser({
                ...user,
                blockedUsers: (user.blockedUsers || []).filter(id => id !== targetId)
            });
        } catch (error) {
            console.error("Failed to unblock user:", error);
            throw error;
        }
    },

    reportUser: async (targetId) => {
        const { user } = useAuthStore.getState();
        if (!user) return;
        try {
            const { default: userService } = await import("../services/user.service");
            await userService.reportUser(targetId);
            useAuthStore.getState().setUser({
                ...user,
                reportedUsers: [...(user.reportedUsers || []), targetId]
            });
        } catch (error) {
            console.error("Failed to report user:", error);
            throw error;
        }
    },

    toggleMessageStar: async (messageId) => {
        const { user } = useAuthStore.getState();
        if (!user) return;
        const currentUserId = user._id;

        try {
            const { default: messageService } = await import("../services/message.service");
            const { starred } = await messageService.toggleStar(messageId);

            set((state) => {
                const newMessages = { ...state.messages };
                Object.keys(newMessages).forEach(roomId => {
                    newMessages[roomId] = newMessages[roomId].map(m => {
                        if (m._id === messageId) {
                            const starredBy = m.starredBy || [];
                            return {
                                ...m,
                                starredBy: starred
                                    ? [...new Set([...starredBy, currentUserId])]
                                    : starredBy.filter(id => id !== currentUserId)
                            };
                        }
                        return m;
                    });
                });

                // Also update lastMessage in rooms
                const newRooms = state.rooms.map(r => {
                    if (r.lastMessage?._id === messageId) {
                        const starredBy = r.lastMessage.starredBy || [];
                        return {
                            ...r,
                            lastMessage: {
                                ...r.lastMessage,
                                starredBy: starred
                                    ? [...new Set([...starredBy, currentUserId])]
                                    : starredBy.filter(id => id !== currentUserId)
                            }
                        };
                    }
                    return r;
                });

                return { messages: newMessages, rooms: newRooms };
            });
        } catch (error) {
            console.error("Failed to toggle message star:", error);
            throw error;
        }
    },

    deleteMessage: async (messageId) => {
        try {
            const { default: messageService } = await import("../services/message.service");
            await messageService.deleteMessage(messageId);

            set((state) => {
                const newMessages = { ...state.messages };
                Object.keys(newMessages).forEach(roomId => {
                    newMessages[roomId] = newMessages[roomId].filter(m => m._id !== messageId);
                });

                // Also update lastMessage in rooms if it's the deleted one
                const newRooms = state.rooms.map(r => {
                    if (r.lastMessage?._id === messageId) {
                        return { ...r, lastMessage: undefined }; // The room list will refresh anyway or we can fetch last message later
                    }
                    return r;
                });

                return { messages: newMessages, rooms: newRooms };
            });
        } catch (error) {
            console.error("Failed to delete message:", error);
            throw error;
        }
    },

    pinMessage: async (roomId, messageId) => {
        try {
            const { default: roomService } = await import("../services/room.service");
            const updatedRoom = await roomService.pinMessage(roomId, messageId);

            set((state) => {
                const newMessages = { ...state.messages };
                if (newMessages[roomId]) {
                    newMessages[roomId] = newMessages[roomId].map(m =>
                        m._id === messageId ? { ...m, isPinned: true } : m
                    );
                }

                return {
                    rooms: state.rooms.map(r => r._id === roomId ? updatedRoom : r),
                    messages: newMessages
                };
            });
        } catch (error) {
            console.error("Failed to pin message:", error);
            throw error;
        }
    },

    unpinMessage: async (roomId, messageId) => {
        try {
            const { default: roomService } = await import("../services/room.service");
            const updatedRoom = await roomService.unpinMessage(roomId, messageId);

            set((state) => {
                const newMessages = { ...state.messages };
                if (newMessages[roomId]) {
                    newMessages[roomId] = newMessages[roomId].map(m =>
                        m._id === messageId ? { ...m, isPinned: false } : m
                    );
                }

                return {
                    rooms: state.rooms.map(r => r._id === roomId ? updatedRoom : r),
                    messages: newMessages
                };
            });
        } catch (error) {
            console.error("Failed to unpin message:", error);
            throw error;
        }
    },

    clearChat: async (roomId) => {
        try {
            const { default: roomService } = await import("../services/room.service");
            await roomService.clearRoomMessages(roomId);
            set((state) => ({
                messages: { ...state.messages, [roomId]: [] },
                rooms: state.rooms.map(r => r._id === roomId ? { ...r, lastMessage: undefined } : r)
            }));
        } catch (error) {
            console.error("Failed to clear chat:", error);
            throw error;
        }
    },

    deleteChat: async (roomId) => {
        try {
            const { default: roomService } = await import("../services/room.service");
            await roomService.deleteRoom(roomId);
            set((state) => ({
                rooms: state.rooms.filter(r => r._id !== roomId),
                room: state.room === roomId ? undefined : state.room,
                messages: { ...state.messages, [roomId]: [] }
            }));
        } catch (error) {
            console.error("Failed to delete chat:", error);
            throw error;
        }
    },

    // Reset
    reset: () => set({ ...initialState, room: undefined }),
}));
