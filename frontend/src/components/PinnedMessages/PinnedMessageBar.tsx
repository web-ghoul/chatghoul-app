import { Pin, ChevronRight } from "lucide-react";
import type { Message } from "../../types/app.d";

interface PinnedMessageBarProps {
    pinnedMessages: any[];
    onClick: () => void;
}

const PinnedMessageBar = ({ pinnedMessages, onClick }: PinnedMessageBarProps) => {
    if (!pinnedMessages || pinnedMessages.length === 0) return null;

    const latestPin = pinnedMessages[pinnedMessages.length - 1];
    const message = latestPin.message as Message;

    const renderContent = () => {
        if (!message) return "Pinned message";
        if (message.type === 'image') return "Photo";
        if (message.type === 'video') return "Video";
        if (message.type === 'audio') return "Audio";
        if (message.type === 'file') return message.fileName || "File";
        return message.message;
    };

    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-2 bg-secondary/80 backdrop-blur-md border-b border-gray/10 cursor-pointer hover:bg-secondary transition-colors z-20"
        >
            <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-primary/10">
                <Pin className="w-3.5 h-3.5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-primary truncate">
                    Pinned Message {pinnedMessages.length > 1 && `(${pinnedMessages.length})`}
                </p>
                <p className="text-sm text-txt/70 truncate">
                    {renderContent()}
                </p>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-txt/40" />
        </div>
    );
};

export default PinnedMessageBar;
