import { create } from "zustand";

type TabTypes = "chats" | "settings" | "profile";

export type AppState = {
  tab: TabTypes;
  tabsStack: TabTypes[];
};

type AppActions = {
  setTab: (payload: TabTypes) => void;
  setTabsStackBack: () => void;
};

export const useAppStore = create<AppState & AppActions>((set) => ({
  tab: "chats",
  tabsStack: ["chats"],

  setTab: (payload) => {
    return set((state) => {
      return { tab: payload, tabsStack: [payload, ...state.tabsStack] };
    });
  },
  setTabsStackBack: () => {
    return set((state) => {
      return {
        tab: state.tabsStack[1],
        tabsStack: state.tabsStack.slice(1),
      };
    });
  },
}));
