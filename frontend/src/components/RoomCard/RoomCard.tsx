import { useChatsStore } from "../../globals/useChatsStore";
import { useAuthStore } from "../../globals/useAuthStore";
import { useSocketStore } from "../../globals/useSocketStore";
import type { Room } from "../../types/app.d";
import Menu from "./Menu";
import CheckIcon from "../../icons/CheckIcon";
import DoubleCheckIcon from "../../icons/DoubleCheckIcon";

interface RoomCardProps {
  room: Room;
}

const RoomCard = ({ room }: RoomCardProps) => {
  const currentRoom = useChatsStore((state) => state.room);
  const setRoom = useChatsStore((state) => state.setRoom);
  const currentUser = useAuthStore((state) => state.user);
  const onlineUsers = useSocketStore((state) => state.onlineUsers);

  // Get display info based on room type
  const getDisplayInfo = () => {
    if (room.type === 'group') {
      return {
        name: room.name || 'Group Chat',
        avatar: room.image,
        isOnline: false, // Groups don't have online status
      };
    } else {
      // Private chat - show the other participant
      const otherParticipant = room.participants.find(
        (p) => String(p._id) !== String(currentUser?._id)
      ) || room.participants[0];

      return {
        name: otherParticipant?.name || 'Unknown User',
        avatar: otherParticipant?.avatar,
        isOnline: otherParticipant ? onlineUsers.has(otherParticipant._id) : false,
        otherParticipant,
      };
    }
  };

  const displayInfo = getDisplayInfo();
  const unreadCount = currentUser ? room.unreadCounts?.[String(currentUser._id)] : 0;
  const isPinned = currentUser ? room.pinnedBy?.some(id => String(id) === String(currentUser._id)) : false;

  // Format date ...
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  // Get last message preview ...
  const getLastMessagePreview = () => {
    if (!room.lastMessage) return '';
    const msg = room.lastMessage;
    if (msg.type !== 'text') {
      if (msg.message) return msg.message; // Show caption if it exists

      const typeEmoji = {
        image: '📷 Photo',
        video: '🎥 Video',
        audio: '🎵 Audio',
        file: '📎 File',
      };
      return typeEmoji[msg.type] || msg.type;
    }
    return msg.message || '';
  };

  return (
    <article
      onClick={() => setRoom(room._id)}
      className={`grid justify-stretch items-center gap-3 transition-all hover:bg-secondary rounded-xl p-4 group grid-cols-[auto_1fr] hover:cursor-pointer ${currentRoom === room._id ? "bg-secondary" : ""
        }`}
    >
      <div className="relative">
        <div
          className="bg-cover bg-center bg-no-repeat w-13 h-13 rounded-full bg-gray-600"
          style={{
            backgroundImage: displayInfo.avatar
              ? `url('${displayInfo.avatar}')`
              : undefined,
          }}
        >
          {!displayInfo.avatar && (
            <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-lg">
              {displayInfo.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/* Online indicator */}
        {displayInfo.isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background"></div>
        )}
      </div>
      <div className="grid justify-stretch items-center gap-2">
        <div className="flex justify-between items-center gap-1">
          <div className="flex items-center gap-2">
            {isPinned && <span className="text-primary text-xs">📌</span>}
            <h6 className="text-md line-clamp-1 text-white font-normal">
              {displayInfo.name}
            </h6>
          </div>
          <div className="flex items-center gap-2 relative overflow-hidden transition-all group-hover:pr-7">
            <h6 className="text-sm text-txt font-normal whitespace-nowrap">
              {formatDate(room.lastMessage?.createdAt || room.updatedAt)}
            </h6>
            <Menu room={room} otherParticipant={displayInfo.otherParticipant} />
          </div>
        </div>
        <div className="flex justify-between items-center gap-1">
          <div className="flex items-center gap-1 min-w-0">
            {room.lastMessage && String(room.lastMessage.sender?._id) === String(currentUser?._id) && (
              <>
                {room.lastMessage.readBy?.length > 0 ? (
                  <DoubleCheckIcon className="w-4 h-auto text-[#53bdeb] flex-shrink-0" />
                ) : room.lastMessage.deliveredTo?.length > 0 ? (
                  <DoubleCheckIcon className="w-4 h-auto text-txt flex-shrink-0" />
                ) : (
                  <CheckIcon className="w-4 h-auto text-txt flex-shrink-0" />
                )}
              </>
            )}
            <p className="text-sm text-txt line-clamp-1">
              {getLastMessagePreview()}
            </p>
          </div>
          {(unreadCount !== undefined && unreadCount > 0) && (
            <div className="flex-shrink-0">
              <p className="bg-primary py-0.5 px-2 font-bold text-background rounded-full text-xs">
                {unreadCount > 99 ? '99+' : unreadCount}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
