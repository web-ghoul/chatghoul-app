import { useAppStore } from "../../globals/useAppStore";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import Icon from "../../components/Icon/Icon";

const shortcuts = [
    { keys: ["Ctrl", "N"], description: "New chat" },
    { keys: ["Ctrl", "Shift", "N"], description: "New group" },
    { keys: ["Ctrl", "/"], description: "Search chats" },
    { keys: ["Ctrl", "E"], description: "Archive chat" },
    { keys: ["Ctrl", "Shift", "M"], description: "Mute chat" },
    { keys: ["Ctrl", "Backspace"], description: "Delete chat" },
    { keys: ["Ctrl", "P"], description: "Open profile" },
    { keys: ["Escape"], description: "Close panel / Go back" },
    { keys: ["Enter"], description: "Send message" },
    { keys: ["Shift", "Enter"], description: "New line" },
];

const KeyboardShortcutsPanel = () => {
    const setSettingsTab = useAppStore((state) => state.setSettingsTab);

    return (
        <div className="grid justify-stretch items-start content-start gap-0 h-full">
            {/* Header */}
            <header className="flex justify-start items-center gap-4 px-5 py-3 border-b border-secondary">
                <Icon variant="chats" onClick={() => setSettingsTab("main")}>
                    <ArrowLeftIcon />
                </Icon>
                <h3 className="text-xl text-white font-medium">Keyboard shortcuts</h3>
            </header>

            {/* Content */}
            <div className="grid justify-stretch items-start gap-3 px-7 py-6 overflow-y-auto">
                <p className="text-txt text-sm mb-2">
                    Use keyboard shortcuts to quickly navigate and perform actions
                </p>

                {shortcuts.map((shortcut, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[1fr_auto] items-center gap-4 py-2"
                    >
                        <p className="text-white text-sm">{shortcut.description}</p>
                        <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                                <span key={keyIndex} className="flex items-center gap-1">
                                    <kbd className="px-2 py-1 bg-secondary rounded text-xs text-txt font-mono border border-secondary_light">
                                        {key}
                                    </kbd>
                                    {keyIndex < shortcut.keys.length - 1 && (
                                        <span className="text-txt text-xs">+</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KeyboardShortcutsPanel;
