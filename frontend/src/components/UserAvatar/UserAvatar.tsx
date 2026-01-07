import { cn } from "../../functions/utils";

interface UserAvatarProps {
    src?: string;
    name?: string;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    onClick?: () => void;
}

const UserAvatar = ({ src, name, size = "md", className, onClick }: UserAvatarProps) => {
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-lg",
        xl: "w-18 h-18 text-2xl",
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative bg-cover bg-center bg-no-repeat rounded-full overflow-hidden bg-secondary group border border-secondary shrink-0",
                sizeClasses[size],
                onClick && "cursor-pointer hover:opacity-80 transition-opacity",
                className
            )}
            style={{
                backgroundImage: src ? `url('${src}')` : 'none',
            }}
        >
            {!src && (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold uppercase">
                    {name?.charAt(0) || "?"}
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
