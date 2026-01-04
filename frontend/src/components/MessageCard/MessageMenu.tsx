import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, Star, Trash } from "lucide-react";
import messageService from "../../services/message.service";
import { toast } from "sonner";
import { useChatsStore } from "../../globals/useChatsStore";

interface MessageMenuProps {
    messageId: string;
    isStarred: boolean;
}

const MessageMenu = ({ messageId, isStarred }: MessageMenuProps) => {
    const room = useChatsStore((state) => state.room);
    const messages = useChatsStore((state) => state.messages);
    const setMessages = useChatsStore((state) => state.setMessages);

    const handleToggleStar = async () => {
        try {
            await messageService.toggleStar(messageId);
            toast.success(isStarred ? "Message unstarred" : "Message starred");

            if (room) {
                const updatedMessages = (messages[room] || []).map(m =>
                    m._id === messageId ? { ...m, starredBy: isStarred ? [] : ["me"] } : m
                );
                setMessages(room, updatedMessages);
            }
        } catch (error) {
            toast.error("Failed to update star status");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity outline-none">
                <ChevronDown className="w-4 h-4 text-txt hover:text-white cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-secondary border-gray/20">
                <DropdownMenuItem onClick={handleToggleStar} className="gap-2 cursor-pointer">
                    <Star className={`w-4 h-4 ${isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    {isStarred ? "Unstar" : "Star"}
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer">
                    <Trash className="w-4 h-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MessageMenu;
