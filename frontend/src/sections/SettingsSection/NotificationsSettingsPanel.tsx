import { useAppStore } from "../../globals/useAppStore";
import { useAuthStore } from "../../globals/useAuthStore";
import userService from "../../services/user.service";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import Icon from "../../components/Icon/Icon";
import { Switch } from "../../components/ui/switch";
import { toast } from "sonner";

const NotificationsSettingsPanel = () => {
    const setSettingsTab = useAppStore((state) => state.setSettingsTab);
    const { user, setUser } = useAuthStore();

    const handleToggle = async (key: string, value: boolean) => {
        try {
            const updatedUser = await userService.updateSettings({ [key]: value });
            setUser(updatedUser);
        } catch (error) {
            toast.error("Failed to update notification settings");
            console.error(error);
        }
    };

    const settings = user?.settings || {
        messageNotifications: true,
        showPreviews: true,
        reactionNotifications: true,
        sounds: true
    };

    return (
        <div className="grid justify-stretch items-start content-start gap-0 h-full">
            {/* Header */}
            <header className="flex justify-start items-center gap-4 px-5 py-3 border-b border-secondary">
                <Icon variant="chats" onClick={() => setSettingsTab("main")}>
                    <ArrowLeftIcon />
                </Icon>
                <h3 className="text-xl text-white font-medium">Notifications</h3>
            </header>

            {/* Content ... */}
            <div className="grid justify-stretch items-start gap-6 px-7 py-6 overflow-y-auto">
                {/* Message notifications */}
                <div className="grid gap-2">
                    <p className="text-primary text-sm font-medium uppercase tracking-wider">
                        Messages
                    </p>
                </div>

                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="grid gap-1">
                        <p className="text-white text-base font-medium">
                            Message notifications
                        </p>
                        <p className="text-txt text-sm">
                            Show notifications for new messages
                        </p>
                    </div>
                    <Switch
                        checked={settings.messageNotifications}
                        onCheckedChange={(val) => handleToggle("messageNotifications", val)}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary"
                    />
                </div>

                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="grid gap-1">
                        <p className="text-white text-base font-medium">Show previews</p>
                        <p className="text-txt text-sm">
                            Display message text in notifications
                        </p>
                    </div>
                    <Switch
                        checked={settings.showPreviews}
                        onCheckedChange={(val) => handleToggle("showPreviews", val)}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary"
                    />
                </div>

                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="grid gap-1">
                        <p className="text-white text-base font-medium">
                            Show reaction notifications
                        </p>
                    </div>
                    <Switch
                        checked={settings.reactionNotifications}
                        onCheckedChange={(val) => handleToggle("reactionNotifications", val)}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary"
                    />
                </div>

                {/* Sounds */}
                <div className="grid gap-2 pt-4 border-t border-secondary">
                    <p className="text-primary text-sm font-medium uppercase tracking-wider">
                        Sounds
                    </p>
                </div>

                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="grid gap-1">
                        <p className="text-white text-base font-medium">Sounds</p>
                        <p className="text-txt text-sm">
                            Play sounds for incoming messages
                        </p>
                    </div>
                    <Switch
                        checked={settings.sounds}
                        onCheckedChange={(val) => handleToggle("sounds", val)}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary"
                    />
                </div>
            </div>
        </div>
    );
};

export default NotificationsSettingsPanel;
