import { useEffect } from "react";
import { useAppStore } from "../globals/useAppStore";
import { useChatsStore } from "../globals/useChatsStore";

export const useKeyboardShortcuts = () => {
    const setTab = useAppStore((state) => state.setTab);
    const setSettingsTab = useAppStore((state) => state.setSettingsTab);
    const { chatTab, setChatTab, setRoom } = useChatsStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if user is typing in an input or textarea
            const target = e.target as HTMLElement;
            const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

            // Shortcuts that work even when typing (like Escape)
            if (e.key === "Escape") {
                // If in settings, go back to main settings or close settings
                const currentState = useAppStore.getState();
                if (currentState.tab === "settings") {
                    if (currentState.settingsTab !== "main") {
                        setSettingsTab("main");
                    } else {
                        setTab("chats");
                    }
                } else if (chatTab !== "chats") {
                    setChatTab("chats");
                } else {
                    setRoom(undefined);
                }
                return;
            }

            // Shortcuts that only work when NOT typing
            if (!isTyping) {
                // New Chat: Ctrl + N
                if (e.ctrlKey && e.key === "n") {
                    e.preventDefault();
                    setTab("chats");
                    setChatTab("new_chat");
                }

                // New Group: Ctrl + Shift + N
                if (e.ctrlKey && e.shiftKey && e.key === "N") {
                    e.preventDefault();
                    setTab("chats");
                    setChatTab("new_group");
                }

                // Search Chats: Ctrl + /
                if (e.ctrlKey && e.key === "/") {
                    e.preventDefault();
                    // Focus logic would go here if we had a ref
                    setTab("chats");
                }

                // Open Profile: Ctrl + P
                if (e.ctrlKey && e.key === "p") {
                    e.preventDefault();
                    setTab("profile");
                }

                // Open Settings: Ctrl + , (not in the list but common, let's stick to the list)
                // The list in KeyboardShortcutsPanel has specific ones.
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setTab, setSettingsTab, chatTab, setChatTab, setRoom]);
};
