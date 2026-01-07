import { create } from "zustand";

type TabTypes = "chats" | "settings" | "profile" | "media";
type SettingsTabTypes = "main" | "privacy" | "chats" | "chats-theme" | "chats-wallpaper" | "notifications" | "shortcuts" | "help";

export type AppState = {
  tab: TabTypes;
  tabsStack: TabTypes[];
  settingsTab: SettingsTabTypes;
  viewerImageUrl: string | null;
};

type AppActions = {
  setTab: (payload: TabTypes) => void;
  setTabsStackBack: () => void;
  setSettingsTab: (payload: SettingsTabTypes) => void;
  setViewerImageUrl: (payload: string | null) => void;
};

export const useAppStore = create<AppState & AppActions>((set) => ({
  tab: "chats",
  tabsStack: ["chats"],
  settingsTab: "main",
  viewerImageUrl: null,

  setTab: (payload) => {
    return set((state) => {
      // Reset settings tab when entering settings
      const newSettingsTab = payload === "settings" ? "main" : state.settingsTab;
      return { tab: payload, tabsStack: [payload, ...state.tabsStack], settingsTab: newSettingsTab };
    });
  },
  setTabsStackBack: () => {
    return set((state) => {
      return {
        tab: state.tabsStack[1],
        tabsStack: state.tabsStack.slice(1),
        settingsTab: "main",
      };
    });
  },
  setSettingsTab: (payload) => {
    return set(() => {
      return { settingsTab: payload };
    });
  },
  setViewerImageUrl: (payload) => set({ viewerImageUrl: payload }),
}));
