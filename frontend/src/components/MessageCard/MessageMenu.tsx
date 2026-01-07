import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, Star, Trash, Pin, PinOff } from "lucide-react";
import { toast } from "sonner";
import { useChatsStore } from "../../globals/useChatsStore";

interface MessageMenuProps {
    messageId: string;
    isStarred: boolean;
    isPinned: boolean;
    roomId: string;
    isOwn: boolean;
}

const MessageMenu = ({ messageId, isStarred, isPinned, roomId, isOwn }: MessageMenuProps) => {
    const toggleMessageStar = useChatsStore((state) => state.toggleMessageStar);
    const deleteMessage = useChatsStore((state) => state.deleteMessage);
    const pinMessage = useChatsStore((state) => state.pinMessage);
    const unpinMessage = useChatsStore((state) => state.unpinMessage);

    const handleToggleStar = async () => {
        try {
            await toggleMessageStar(messageId);
            toast.success(isStarred ? "Message unstarred" : "Message starred");
        } catch (error) {
            toast.error("Failed to update star status");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteMessage(messageId);
            toast.success("Message deleted");
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    const handleTogglePin = async () => {
        try {
            if (isPinned) {
                await unpinMessage(roomId, messageId);
                toast.success("Message unpinned");
            } else {
                await pinMessage(roomId, messageId);
                toast.success("Message pinned");
            }
        } catch (error) {
            toast.error("Failed to update pin status");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity outline-none">
                <ChevronDown className="w-3.5 h-3.5 text-txt hover:text-white cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-secondary border-gray/20">
                <DropdownMenuItem onClick={handleToggleStar} className="gap-2 cursor-pointer">
                    <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    {isStarred ? "Unstar" : "Star"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTogglePin} className="gap-2 cursor-pointer">
                    {isPinned ? (
                        <>
                            <PinOff className="w-3.5 h-3.5" />
                            Unpin
                        </>
                    ) : (
                        <>
                            <Pin className="w-3.5 h-3.5" />
                            Pin
                        </>
                    )}
                </DropdownMenuItem>
                {isOwn && (
                    <DropdownMenuItem onClick={handleDelete} className="gap-2 text-red-400 hover:text-red-400 hover:bg-red-400/10 cursor-pointer">
                        <Trash className="w-3.5 h-3.5 text-red-400" />
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MessageMenu;
