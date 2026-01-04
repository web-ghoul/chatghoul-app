import { useAppStore } from "../../globals/useAppStore";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import Icon from "../../components/Icon/Icon";
import SettingsMenuItem from "../../components/SettingsMenuItem/SettingsMenuItem";
import HelpIcon from "../../icons/HelpIcon";
import DocumentIcon from "../../icons/DocumentIcon";

const HelpSettingsPanel = () => {
    const setSettingsTab = useAppStore((state) => state.setSettingsTab);

    return (
        <div className="grid justify-stretch items-start content-start gap-0 h-full">
            {/* Header */}
            <header className="flex justify-start items-center gap-4 px-5 py-3 border-b border-secondary">
                <Icon variant="chats" onClick={() => setSettingsTab("main")}>
                    <ArrowLeftIcon />
                </Icon>
                <h3 className="text-xl text-white font-medium">Help</h3>
            </header>

            {/* Content */}
            <div className="grid justify-stretch items-start gap-0 overflow-y-auto">
                <SettingsMenuItem
                    icon={<HelpIcon className="w-5 h-5" />}
                    title="Help center"
                    description="Get help, contact us"
                    onClick={() => window.open("https://faq.whatsapp.com", "_blank")}
                />
                <SettingsMenuItem
                    icon={<DocumentIcon className="w-5 h-5" />}
                    title="Terms and Privacy Policy"
                    onClick={() =>
                        window.open("https://www.whatsapp.com/legal", "_blank")
                    }
                />

                {/* App info */}
                <div className="grid gap-2 px-7 py-6 mt-4 border-t border-secondary">
                    <p className="text-txt text-sm">ChatGhoul Web</p>
                    <p className="text-txt text-xs">Version 1.0.0</p>
                    <p className="text-txt text-xs mt-2">
                        © {new Date().getFullYear()} ChatGhoul. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpSettingsPanel;
