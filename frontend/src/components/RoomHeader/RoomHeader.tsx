import { useChatsStore } from "../../globals/useChatsStore";
import { useAuthStore } from "../../globals/useAuthStore";
import { useSocketStore } from "../../globals/useSocketStore";
import SearchIcon from "../../icons/SearchIcon";
import Icon from "../Icon/Icon";
import RoomMenu from "./RoomMenu";

const RoomHeader = () => {
  const currentRoomId = useChatsStore((state) => state.room);
  const rooms = useChatsStore((state) => state.rooms);
  const setRoomTab = useChatsStore((state) => state.setRoomTab);
  const currentUser = useAuthStore((state) => state.user);
  const onlineUsers = useSocketStore((state) => state.onlineUsers);

  const room = rooms.find((r) => r._id === currentRoomId);

  if (!room) return <header className="h-[64px] bg-background border-b border-border/10" />;

  // Get display info based on room type (DRY with RoomCard)
  const getDisplayInfo = () => {
    if (room.type === 'group') {
      return {
        name: room.name || 'Group Chat',
        avatar: room.image,
        isOnline: false,
      };
    } else {
      const otherParticipant = room.participants.find(
        (p) => String(p._id) !== String(currentUser?._id)
      );
      // If it's a chat with self, otherParticipant might be undefined or the user themselves
      const participant = otherParticipant || room.participants[0];

      return {
        name: participant?.name || 'Unknown User',
        avatar: participant?.avatar,
        isOnline: participant ? onlineUsers.has(participant._id) : false,
      };
    }
  };

  const displayInfo = getDisplayInfo();

  return (
    <header className="flex justify-between items-center gap-4 px-4 h-[64px] bg-background z-10">
      <div
        className="flex items-center gap-3 cursor-pointer hover:bg-secondary_light/30 -ml-2 pl-2 pr-4 py-1.5 rounded-lg transition-all"
        onClick={() => setRoomTab("info")}
      >
        <div className="relative">
          <div
            className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: displayInfo.avatar ? `url('${displayInfo.avatar}')` : undefined
            }}
          >
            {!displayInfo.avatar && (
              <span className="text-primary text-sm font-semibold">
                {displayInfo.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {displayInfo.isOnline && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></div>
          )}
        </div>
        <div className="grid justify-start items-center gap-0">
          <h3 className="text-white text-base font-medium line-clamp-1">{displayInfo.name}</h3>
          <p className="text-txt text-xs">{displayInfo.isOnline ? 'online' : 'click here for group info'}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Icon variant="chats" onClick={() => setRoomTab("search")}>
          <SearchIcon className="text-txt w-5 h-auto" />
        </Icon>
        <RoomMenu />
      </div>
    </header>
  );
};

export default RoomHeader;
