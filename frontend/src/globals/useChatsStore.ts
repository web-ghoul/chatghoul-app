import { create } from "zustand";

export type ChatsState = {
    user?: string;
    chatTab:"chats"|"new_chat"|"new_group";
    roomTab?:"info"|"permissions"|"media"
};

type ChatsActions = {
    setUser: (payload?: string) => void;
    setChatTab: (payload: "chats"|"new_chat"|"new_group") => void;
    setRoomTab: (payload?: "info"|"permissions"|"media") => void;
};

export const useChatsStore = create<ChatsState & ChatsActions>((set) => ({
    user: undefined,
    chatTab: 'chats',
    roomTab: undefined,

    setUser: (payload) => set({ user: payload }),
    setChatTab: (payload) => set({ chatTab: payload }),
    setRoomTab: (payload) => set({ roomTab: payload }),
}));
