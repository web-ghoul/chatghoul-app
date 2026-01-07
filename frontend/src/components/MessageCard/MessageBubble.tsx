import type { ReactNode } from "react";

interface MessageBubbleProps {
    isOwn: boolean;
    children: ReactNode;
}

const MessageBubble = ({ isOwn, children }: MessageBubbleProps) => {
    return (
        <div className={`p-3 rounded-xl grid justify-stretch items-center gap-2 relative w-max max-w-[65%] shadow-md ${isOwn
            ? "rounded-tr-none bg-primary_dark"
            : "rounded-tl-none bg-secondary_light"
            }`}>
            {children}
        </div>
    );
};

export default MessageBubble;
