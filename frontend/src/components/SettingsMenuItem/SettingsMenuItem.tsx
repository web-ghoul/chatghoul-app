import type { ReactNode } from "react";

interface SettingsMenuItemProps {
    icon: ReactNode;
    title: string;
    description?: string;
    onClick?: () => void;
    logout?: boolean;
}

const SettingsMenuItem = ({
    icon,
    title,
    description,
    onClick,
    logout
}: SettingsMenuItemProps) => {
    return (
        <article className="px-5">
            <div
                onClick={onClick}
                className={`grid grid-cols-[auto_1fr_auto] justify-stretch items-center gap-4 p-4 transition-all hover:bg-secondary/50 cursor-pointer`}
            >
                <div className={`flex justify-center items-center w-9 h-9 rounded-full ${logout ? "text-red-400" : "text-txt"} [&_svg]:h-5 [&_svg]:w-5`}>
                    {icon}
                </div>
                <div className="grid justify-stretch items-center gap-0.5">
                    <h6 className={`text-lg font-medium ${logout ? "text-red-400" : "text-white"}`}>{title}</h6>
                    {description && (
                        <p className="text-txt text-sm truncate">{description}</p>
                    )}
                </div>
            </div>
        </article>
    );
};

export default SettingsMenuItem;
