import { useState } from "react";
import { useAppStore } from "../../globals/useAppStore";
import SettingsMenuItem from "../../components/SettingsMenuItem/SettingsMenuItem";
import PrivacyIcon from "../../icons/PrivacyIcon";
import ChatSettingsIcon from "../../icons/ChatSettingsIcon";
import NotificationIcon from "../../icons/NotificationIcon";
import KeyboardIcon from "../../icons/KeyboardIcon";
import HelpIcon from "../../icons/HelpIcon";
import LogoutIcon from "../../icons/LogoutIcon";
import LogoutModal from "../../modals/LogoutModal";

const SettingsMenuList = () => {
    const setSettingsTab = useAppStore((state) => state.setSettingsTab);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    return (
        <div className="grid justify-stretch items-start gap-0">
            <SettingsMenuItem
                icon={<PrivacyIcon />}
                title="Privacy"
                description="Last seen, profile photo, about"
                onClick={() => setSettingsTab("privacy")}
            />
            <SettingsMenuItem
                icon={<ChatSettingsIcon />}
                title="Chats"
                description="Wallpaper, enter is send"
                onClick={() => setSettingsTab("chats")}
            />
            <SettingsMenuItem
                icon={<NotificationIcon />}
                title="Notifications"
                description="Message, group, call tones"
                onClick={() => setSettingsTab("notifications")}
            />
            <SettingsMenuItem
                icon={<KeyboardIcon />}
                title="Keyboard shortcuts"
                onClick={() => setSettingsTab("shortcuts")}
            />
            <SettingsMenuItem
                icon={<HelpIcon />}
                title="Help"
                description="Help center, contact us, privacy policy"
                onClick={() => setSettingsTab("help")}
            />
            <SettingsMenuItem
                icon={<LogoutIcon />}
                title="Log out"
                logout
                onClick={handleLogout}
            />
            <LogoutModal
                open={isLogoutModalOpen}
                onOpenChange={setIsLogoutModalOpen}
            />
        </div>
    );
};

export default SettingsMenuList;
