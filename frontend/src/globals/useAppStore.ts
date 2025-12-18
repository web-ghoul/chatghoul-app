import { create } from "zustand";

export type AppState = {
  tab: "chats"|"settings"|"media"|"profile";
};

type AppActions = {
  setTab: (payload: "chats"|"settings"|"media"|"profile") => void;
};

export const useAppStore = create<AppState & AppActions>((set) => ({
  tab: 'chats',

  setTab: (payload) => set({ tab: payload }),
}));
