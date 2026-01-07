import { useAppStore } from "../../globals/useAppStore";
import { useAuthStore } from "../../globals/useAuthStore";
import userService from "../../services/user.service";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import Icon from "../../components/Icon/Icon";
import { toast } from "sonner";
import { wallpaperStyles } from "../../functions/wallpaper";

const WallpaperSettingsPanel = () => {
    const setSettingsTab = useAppStore((state) => state.setSettingsTab);
    const { user, setUser } = useAuthStore();

    const handleWallpaperChange = async (wallpaperId: string) => {
        try {
            const updatedUser = await userService.updateSettings({ chatWallpaper: wallpaperId });
            setUser(updatedUser);
            toast.success("Wallpaper updated");
        } catch (error) {
            toast.error("Failed to update wallpaper");
        }
    };

    const currentWallpaper = user?.settings?.chatWallpaper || "default";

    return (
        <div className="grid justify-stretch items-start content-start gap-0 h-full">
            {/* Header */}
            <header className="flex justify-start items-center gap-4 px-5 py-3 border-b border-secondary">
                <Icon variant="chats" onClick={() => setSettingsTab("chats")}>
                    <ArrowLeftIcon />
                </Icon>
                <h3 className="text-xl text-white font-medium">Wallpaper</h3>
            </header>

            {/* Content */}
            <div className="grid justify-stretch items-start gap-6 px-7 py-6 overflow-y-auto">
                <p className="text-txt text-sm">
                    Choose a wallpaper for your chat background
                </p>

                {/* Wallpaper Grid */}
                <div className="grid grid-cols-4 gap-3">
                    {wallpaperStyles.map((wallpaper) => (
                        <button
                            key={wallpaper.id}
                            onClick={() => handleWallpaperChange(wallpaper.id)}
                            className={`aspect-square rounded-xl relative overflow-hidden border-2 ${currentWallpaper === wallpaper.id ? 'border-primary' : 'border-secondary'} hover:border-primary transition-all cursor-pointer flex items-center justify-center`}
                            title={wallpaper.name}
                        >
                            <div className={`absolute inset-0 ${wallpaper.color}`} />
                            {currentWallpaper === wallpaper.id && (
                                <div className="relative z-10 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WallpaperSettingsPanel;
