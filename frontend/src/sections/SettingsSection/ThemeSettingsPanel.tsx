import { useAppStore } from "../../globals/useAppStore";
import { useAuthStore } from "../../globals/useAuthStore";
import userService from "../../services/user.service";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import Icon from "../../components/Icon/Icon";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { toast } from "sonner";

const ThemeSettingsPanel = () => {
    const setSettingsTab = useAppStore((state) => state.setSettingsTab);
    const { user, setUser } = useAuthStore();

    const handleThemeChange = async (value: string) => {
        try {
            const updatedUser = await userService.updateSettings({ theme: value });
            setUser(updatedUser);
            toast.success("Theme updated");
        } catch (error) {
            toast.error("Failed to update theme");
        }
    };

    return (
        <div className="grid justify-stretch items-start content-start gap-0 h-full">
            {/* Header */}
            <header className="flex justify-start items-center gap-4 px-5 py-3 border-b border-secondary">
                <Icon variant="chats" onClick={() => setSettingsTab("chats")}>
                    <ArrowLeftIcon />
                </Icon>
                <h3 className="text-xl text-white font-medium">Theme</h3>
            </header>

            {/* Content */}
            <div className="grid justify-stretch items-start gap-6 px-7 py-6 overflow-y-auto">
                <p className="text-txt text-sm">
                    Choose a theme for the ChatGhoul desktop app
                </p>

                <RadioGroup
                    defaultValue={user?.settings?.theme || "dark"}
                    onValueChange={handleThemeChange}
                    className="grid gap-4"
                >
                    {/* Light Theme */}
                    <label
                        htmlFor="light"
                        className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 rounded-xl bg-secondary/50 cursor-pointer hover:bg-secondary transition-all"
                    >
                        <div className="w-16 h-12 rounded-lg bg-white border-2 border-gray flex items-end justify-center p-1">
                            <div className="w-10 h-6 rounded bg-primary/80"></div>
                        </div>
                        <div className="grid gap-1">
                            <p className="text-white text-base font-medium">Light</p>
                            <p className="text-txt text-sm">Classic light appearance</p>
                        </div>
                        <RadioGroupItem
                            value="light"
                            id="light"
                            className="border-txt data-[state=checked]:border-primary"
                        />
                    </label>

                    {/* Dark Theme */}
                    <label
                        htmlFor="dark"
                        className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 rounded-xl bg-secondary/50 cursor-pointer hover:bg-secondary transition-all"
                    >
                        <div className="w-16 h-12 rounded-lg bg-background border-2 border-secondary flex items-end justify-center p-1">
                            <div className="w-10 h-6 rounded bg-primary/80"></div>
                        </div>
                        <div className="grid gap-1">
                            <p className="text-white text-base font-medium">Dark</p>
                            <p className="text-txt text-sm">A sleek, dark appearance</p>
                        </div>
                        <RadioGroupItem
                            value="dark"
                            id="dark"
                            className="border-txt data-[state=checked]:border-primary"
                        />
                    </label>

                    {/* System Default */}
                    <label
                        htmlFor="system"
                        className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 rounded-xl bg-secondary/50 cursor-pointer hover:bg-secondary transition-all"
                    >
                        <div className="w-16 h-12 rounded-lg overflow-hidden border-2 border-secondary flex">
                            <div className="w-1/2 bg-white"></div>
                            <div className="w-1/2 bg-background"></div>
                        </div>
                        <div className="grid gap-1">
                            <p className="text-white text-base font-medium">System default</p>
                            <p className="text-txt text-sm">Match your device settings</p>
                        </div>
                        <RadioGroupItem
                            value="system"
                            id="system"
                            className="border-txt data-[state=checked]:border-primary"
                        />
                    </label>
                </RadioGroup>
            </div>
        </div>
    );
};

export default ThemeSettingsPanel;
