import type { User } from "../../types/app.d";
import { useChatsStore } from "../../globals/useChatsStore";

interface MessageAvatarProps {
    show: boolean;
    sender?: User;
}

const MessageAvatar = ({ show, sender }: MessageAvatarProps) => {
    if (!show || !sender) return null;

    return (
        <div
            className="w-8 h-8 rounded-full bg-gray-600 bg-cover bg-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => useChatsStore.getState().setRoomTab("info")}
            style={{
                backgroundImage: sender.avatar
                    ? `url('${sender.avatar}')`
                    : undefined,
            }}
        >
            {!sender.avatar && (
                <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                    {sender.name?.charAt(0).toUpperCase() || '?'}
                </div>
            )}
        </div>
    );
};

export default MessageAvatar;
