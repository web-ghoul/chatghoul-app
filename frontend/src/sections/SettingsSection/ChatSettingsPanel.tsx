import { useAppStore } from "../../globals/useAppStore";
import { useAuthStore } from "../../globals/useAuthStore";
import userService from "../../services/user.service";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import Icon from "../../components/Icon/Icon";
import { Switch } from "../../components/ui/switch";
import { toast } from "sonner";

const ChatSettingsPanel = () => {
    const setSettingsTab = useAppStore((state) => state.setSettingsTab);
    const { user, setUser } = useAuthStore();

    const handleToggle = async (key: string, value: boolean) => {
        try {
            const updatedUser = await userService.updateSettings({ [key]: value });
            setUser(updatedUser);
        } catch (error) {
            toast.error("Failed to update chat settings");
            console.error(error);
        }
    };

    const settings = user?.settings || {
        theme: "dark",
        enterIsSend: true,
    };

    return (
        <div className="grid justify-stretch items-start content-start gap-0 h-full">
            {/* Header */}
            <header className="flex justify-start items-center gap-4 px-5 py-3 border-b border-secondary">
                <Icon variant="chats" onClick={() => setSettingsTab("main")}>
                    <ArrowLeftIcon />
                </Icon>
                <h3 className="text-xl text-white font-medium">Chats</h3>
            </header>

            {/* Content */}
            <div className="grid justify-stretch items-start gap-6 px-7 py-6 overflow-y-auto">
                {/* Display section */}
                <div className="grid gap-2">
                    <p className="text-primary text-sm font-medium uppercase tracking-wider">
                        Display
                    </p>
                </div>

                {/* Theme */}
                <div
                    className="grid grid-cols-[1fr_auto] items-center gap-4 cursor-pointer hover:bg-secondary/30 -mx-7 px-7 py-3 transition-all"
                    onClick={() => setSettingsTab("chats-theme")}
                >
                    <div className="grid gap-1">
                        <p className="text-white text-base font-medium">Theme</p>
                        <p className="text-txt text-sm capitalize">{settings.theme}</p>
                    </div>
                </div>

                {/* Wallpaper */}
                <div
                    className="grid grid-cols-[1fr_auto] items-center gap-4 cursor-pointer hover:bg-secondary/30 -mx-7 px-7 py-3 transition-all"
                    onClick={() => setSettingsTab("chats-wallpaper")}
                >
                    <div className="grid gap-1">
                        <p className="text-white text-base font-medium">Wallpaper</p>
                        <p className="text-txt text-sm">Change chat wallpaper</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/50 border border-secondary"></div>
                </div>

                {/* Chat settings section ... */}
                <div className="grid gap-2 pt-4 border-t border-secondary">
                    <p className="text-primary text-sm font-medium uppercase tracking-wider">
                        Chat settings
                    </p>
                </div>

                {/* Enter is send */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="grid gap-1">
                        <p className="text-white text-base font-medium">Enter is send</p>
                        <p className="text-txt text-sm">
                            Press Enter to send a message. Use Shift+Enter for a new line.
                        </p>
                    </div>
                    <Switch
                        checked={settings.enterIsSend}
                        onCheckedChange={(val) => handleToggle("enterIsSend", val)}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary"
                    />
                </div>

                {/* Media visibility */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="grid gap-1">
                        <p className="text-white text-base font-medium">Media visibility</p>
                        <p className="text-txt text-sm">
                            Show newly downloaded media in your device's gallery
                        </p>
                    </div>
                    <Switch
                        defaultChecked={false}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary"
                    />
                </div>

            </div>
        </div>
    );
};

export default ChatSettingsPanel;
