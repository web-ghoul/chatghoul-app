import { useAppStore } from "../../globals/useAppStore";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import Icon from "../../components/Icon/Icon";

const WallpaperSettingsPanel = () => {
    const setSettingsTab = useAppStore((state) => state.setSettingsTab);

    // Wallpaper color options
    const wallpaperColors = [
        { id: "default", color: "bg-gradient-to-br from-primary/20 to-primary/50", name: "Default" },
        { id: "dark", color: "bg-background", name: "Dark" },
        { id: "teal", color: "bg-gradient-to-br from-teal-900 to-teal-700", name: "Teal" },
        { id: "purple", color: "bg-gradient-to-br from-purple-900 to-purple-700", name: "Purple" },
        { id: "blue", color: "bg-gradient-to-br from-blue-900 to-blue-700", name: "Blue" },
        { id: "green", color: "bg-gradient-to-br from-green-900 to-green-700", name: "Green" },
        { id: "orange", color: "bg-gradient-to-br from-orange-900 to-orange-700", name: "Orange" },
        { id: "red", color: "bg-gradient-to-br from-red-900 to-red-700", name: "Red" },
    ];

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
                    {wallpaperColors.map((wallpaper) => (
                        <button
                            key={wallpaper.id}
                            className={`aspect-square rounded-xl ${wallpaper.color} border-2 border-secondary hover:border-primary transition-all cursor-pointer flex items-center justify-center`}
                            title={wallpaper.name}
                        >
                            {wallpaper.id === "default" && (
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Doodles option */}
                <div className="grid gap-4 pt-4 border-t border-secondary">
                    <p className="text-primary text-sm font-medium uppercase tracking-wider">
                        Options
                    </p>
                    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                        <div className="grid gap-1">
                            <p className="text-white text-base font-medium">Add doodles</p>
                            <p className="text-txt text-sm">
                                Show WhatsApp-style doodles on the wallpaper
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WallpaperSettingsPanel;
