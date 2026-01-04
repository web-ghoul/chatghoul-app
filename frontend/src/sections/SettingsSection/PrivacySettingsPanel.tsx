import { useAppStore } from "../../globals/useAppStore";
import { useAuthStore } from "../../globals/useAuthStore";
import userService from "../../services/user.service";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import Icon from "../../components/Icon/Icon";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";

const PrivacySettingsPanel = () => {
    const setSettingsTab = useAppStore((state) => state.setSettingsTab);
    const { user, setUser } = useAuthStore();

    const handlePrivacyChange = async (key: 'avatarPrivacy' | 'aboutPrivacy', value: string) => {
        try {
            // @ts-ignore
            const updatedUser = await userService.updateSettings({ [key]: value });
            setUser(updatedUser);
            toast.success("Privacy settings updated");
        } catch (error) {
            toast.error("Failed to update privacy settings");
        }
    };

    return (
        <div className="grid justify-stretch items-start content-start gap-0 h-full">
            {/* Header */}
            <header className="flex justify-start items-center gap-4 px-5 py-3 border-b border-secondary">
                <Icon variant="chats" onClick={() => setSettingsTab("main")}>
                    <ArrowLeftIcon />
                </Icon>
                <h3 className="text-xl text-white font-medium">Privacy</h3>
            </header>

            {/* Content */}
            <div className="grid justify-stretch items-start gap-6 px-7 py-6 overflow-y-auto">
                {/* Who can see my info section */}
                <div className="grid gap-2">
                    <p className="text-primary text-sm font-medium uppercase tracking-wider">
                        Who can see my personal info
                    </p>
                </div>

                {/* Profile photo */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="grid gap-1">
                        <p className="text-white text-base font-medium">Profile photo</p>
                    </div>
                    <Select
                        defaultValue={user?.settings?.avatarPrivacy || "everyone"}
                        onValueChange={(val) => handlePrivacyChange('avatarPrivacy', val)}
                    >
                        <SelectTrigger className="w-32 bg-secondary border-secondary text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-secondary border-secondary">
                            <SelectItem value="everyone" className="text-white hover:bg-secondary_light focus:bg-secondary_light focus:text-white">Everyone</SelectItem>
                            <SelectItem value="contacts" className="text-white hover:bg-secondary_light focus:bg-secondary_light focus:text-white">My contacts</SelectItem>
                            <SelectItem value="nobody" className="text-white hover:bg-secondary_light focus:bg-secondary_light focus:text-white">Nobody</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* About */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="grid gap-1">
                        <p className="text-white text-base font-medium">About</p>
                    </div>
                    <Select
                        defaultValue={user?.settings?.aboutPrivacy || "everyone"}
                        onValueChange={(val) => handlePrivacyChange('aboutPrivacy', val)}
                    >
                        <SelectTrigger className="w-32 bg-secondary border-secondary text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-secondary border-secondary">
                            <SelectItem value="everyone" className="text-white hover:bg-secondary_light focus:bg-secondary_light focus:text-white">Everyone</SelectItem>
                            <SelectItem value="contacts" className="text-white hover:bg-secondary_light focus:bg-secondary_light focus:text-white">My contacts</SelectItem>
                            <SelectItem value="nobody" className="text-white hover:bg-secondary_light focus:bg-secondary_light focus:text-white">Nobody</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default PrivacySettingsPanel;
