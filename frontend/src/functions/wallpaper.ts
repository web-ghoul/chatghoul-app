export interface WallpaperStyle {
    id: string;
    name: string;
    color: string;
}

export const wallpaperStyles: WallpaperStyle[] = [
    { id: "default", name: "Default (Dark)", color: "bg-[#0b141a]" },
    { id: "light", name: "Classic Light", color: "bg-[#efe7de]" },
    { id: "teal", name: "Teal", color: "bg-[#005c4b]" },
    { id: "blue", name: "Blue", color: "bg-[#1d3557]" },
    { id: "purple", name: "Purple", color: "bg-[#331d2c]" },
    { id: "rose", name: "Rose", color: "bg-[#4a1c1c]" },
    { id: "mint", name: "Mint", color: "bg-[#1c4a4a]" },
    { id: "gradient-1", name: "Ocean", color: "bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]" },
    { id: "gradient-2", name: "Sunset", color: "bg-gradient-to-br from-[#4c1d95] to-[#7c3aed]" },
];

export const getWallpaperClass = (id?: string) => {
    if (!id) return wallpaperStyles[0].color;
    const style = wallpaperStyles.find((s) => s.id === id);
    return style ? style.color : wallpaperStyles[0].color;
};
