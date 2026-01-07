import type { Message } from "../../types/app.d";
import { useAppStore } from "../../globals/useAppStore";

interface MessageContentProps {
    message: Message;
    isOwn: boolean;
}

const MessageContent = ({ message, isOwn }: MessageContentProps) => {
    const setViewerImageUrl = useAppStore((state) => state.setViewerImageUrl);

    switch (message.type) {
        case 'image':
            return (
                <div className="max-w-xs">
                    <img
                        src={message.mediaUrl}
                        alt="Image"
                        onClick={() => setViewerImageUrl(message.mediaUrl!)}
                        className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                    />
                    {message.message && (
                        <p className="text-sm text-white mt-2">{message.message}</p>
                    )}
                </div>
            );
        case 'video':
            return (
                <div className="max-w-xs">
                    <video
                        src={message.mediaUrl}
                        controls
                        className="rounded-lg max-w-full h-auto"
                    />
                    {message.message && (
                        <p className="text-sm text-white mt-2">{message.message}</p>
                    )}
                </div>
            );
        case 'audio':
            return (
                <div className="max-w-xs grid gap-2">
                    <audio src={message.mediaUrl} controls className="max-w-full" />
                    {message.message && (
                        <p className="text-sm text-white">{message.message}</p>
                    )}
                </div>
            );
        case 'file':
            return (
                <div className="max-w-xs grid gap-2">
                    <a
                        href={message.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white hover:underline"
                    >
                        <span className="text-2xl">📎</span>
                        <span className="text-sm truncate">{message.fileName || 'Download file'}</span>
                    </a>
                    {message.message && (
                        <p className="text-sm text-white">{message.message}</p>
                    )}
                </div>
            );
        default:
            return (
                <p className={`text-sm text-white break-words ${isOwn ? "pr-6" : "pl-0"}`}>
                    {message.message}
                </p>
            );
    }
};

export default MessageContent;
