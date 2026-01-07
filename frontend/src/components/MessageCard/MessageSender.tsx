import { useChatsStore } from "../../globals/useChatsStore";
import type { User } from "../../types/app.d";

interface MessageSenderProps {
    show: boolean;
    sender?: User;
}

const MessageSender = ({ show, sender }: MessageSenderProps) => {
    if (!show || !sender) return null;

    return (
        <p
            className="text-xs text-primary font-medium cursor-pointer hover:underline"
            onClick={() => useChatsStore.getState().setRoomTab("info")}
        >
            {sender.name}
        </p>
    );
};

export default MessageSender;
