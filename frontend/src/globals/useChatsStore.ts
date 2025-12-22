import { create } from "zustand";

export type ChatsState = {
    room?: string;
    chatTab:"chats"|"new_chat"|"new_group";
    roomTab?:"info"|"permissions"|"media"
};

type ChatsActions = {
    setRoom: (payload?: string) => void;
    setChatTab: (payload: "chats"|"new_chat"|"new_group") => void;
    setRoomTab: (payload?: "info"|"permissions"|"media") => void;
};

export const useChatsStore = create<ChatsState & ChatsActions>((set) => ({
    room: undefined,
    chatTab: 'chats',
    roomTab: undefined,

    setRoom: (payload) => set({ room: payload }),
    setChatTab: (payload) => set({ chatTab: payload }),
    setRoomTab: (payload) => set({ roomTab: payload }),
}));
