import { useChatsStore } from "../../globals/useChatsStore";
import { useAuthStore } from "../../globals/useAuthStore";
import roomService from "../../services/room.service";
import userService from "../../services/user.service";
import BlockIcon from "../../icons/BlockIcon";
import ChevronDownIcon from "../../icons/ChevronDownIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import LogoutIcon from "../../icons/LogoutIcon";
import PinIcon from "../../icons/PinIcon";
import { Image } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import type { Room, User } from "../../types/app.d";

interface MenuProps {
  room: Room;
  otherParticipant?: User;
}

const Menu = ({ room, otherParticipant }: MenuProps) => {
  const { updateRoom, rooms, setRooms, setRoom, setRoomTab } = useChatsStore();
  const { user } = useAuthStore();

  const handlePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { pinned } = await roomService.togglePin(room._id);
      const updatedPinnedBy = pinned
        ? [...(room.pinnedBy || []), user?._id].filter(Boolean) as string[]
        : (room.pinnedBy || []).filter(id => id !== user?._id);

      updateRoom(room._id, { pinnedBy: updatedPinnedBy });
      toast.success(pinned ? "Chat pinned" : "Chat unpinned");
    } catch (error) {
      toast.error("Failed to pin chat");
    }
  };

  const handleBlock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!otherParticipant) return;
    try {
      await userService.blockUser(otherParticipant._id);
      toast.success(`${otherParticipant.name} blocked`);
    } catch (error) {
      toast.error("Failed to block user");
    }
  };

  const handleDeleteOrExit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const isGroup = room.type === 'group';
    try {
      await roomService.deleteRoom(room._id);
      // Remove from frontend list
      setRooms(rooms.filter(r => r._id !== room._id));
      setRoom(undefined);
      toast.success(isGroup ? "Exited group" : "Chat deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const handleMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRoom(room._id);
    setRoomTab("media");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className="outline-none text-txt absolute transition-all right-0 translate-x-10 group-hover:translate-x-0 cursor-pointer"
      >
        <ChevronDownIcon className="w-6 h-auto" />
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={handlePin}>
          <PinIcon />
          {room.pinnedBy?.some(id => String(id) === String(user?._id)) ? "Unpin chat" : "Pin chat"}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleMedia}>
          <Image className="w-4 h-4 mr-2" />
          Chat media
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-500/30" />

        {room.type === 'private' && otherParticipant && (
          <DropdownMenuItem onClick={handleBlock} className="hover:bg-red-400/15 hover:text-red-400 group text-red-400">
            <BlockIcon className="transition-all text-red-400" />
            Block
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleDeleteOrExit} className="hover:bg-red-400/15 hover:text-red-400 group text-red-400">
          {room.type === 'group' ? (
            <>
              <LogoutIcon className="transition-all text-red-400" />
              Exit group
            </>
          ) : (
            <>
              <DeleteIcon className="transition-all text-red-400" />
              Delete chat
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
