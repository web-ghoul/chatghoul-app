import { create } from "zustand";

export type SettingsState = {
    packageTab: number;
};

type SettingsActions = {
    setPackageTab: (payload: number) => void;
};

export const useSettingsStore = create<SettingsState & SettingsActions>((set) => ({
    packageTab: 0,

    setPackageTab: (payload) => set({ packageTab: payload }),
}));
