import { useState, useEffect } from "react";
import { useChatsStore } from "../../globals/useChatsStore";
import { useAuthStore } from "../../globals/useAuthStore";
import { useSocketStore } from "../../globals/useSocketStore";
import CloseIcon from "../../icons/CloseIcon";
import Icon from "../../components/Icon/Icon";
import DocumentIcon from "../../icons/DocumentIcon";
import roomService from "../../services/room.service";
import type { Media } from "../../types/app.d";

const RoomInfoSection = () => {
  const currentRoomId = useChatsStore((state) => state.room);
  const rooms = useChatsStore((state) => state.rooms);
  const setRoomTab = useChatsStore((state) => state.setRoomTab);
  const currentUser = useAuthStore((state) => state.user);
  const onlineUsers = useSocketStore((state) => state.onlineUsers);

  const [media, setMedia] = useState<Media[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  const room = rooms.find((r) => r._id === currentRoomId);

  useEffect(() => {
    if (!currentRoomId) return;

    const fetchRecentMedia = async () => {
      setIsLoadingMedia(true);
      try {
        const data = await roomService.getRoomMedia(currentRoomId);
        setMedia(data.slice(0, 3)); // Only show last 3 for preview
      } catch (error) {
        console.error('Failed to fetch media:', error);
      } finally {
        setIsLoadingMedia(false);
      }
    };

    fetchRecentMedia();
  }, [currentRoomId]);

  if (!room) return null;

  const getDisplayInfo = () => {
    if (room.type === 'group') {
      return {
        name: room.name || 'Group Chat',
        avatar: room.image,
        description: room.description || 'Hey there! I am using ChatGhoul.',
        phone: `${room.participants.length} participants`,
        isOnline: false,
      };
    } else {
      const otherParticipant = room.participants.find(
        (p) => String(p._id) !== String(currentUser?._id)
      );
      const participant = otherParticipant || room.participants[0];

      return {
        name: participant?.name || 'Unknown User',
        avatar: participant?.avatar,
        description: participant?.about || 'Hey there! I am using ChatGhoul.',
        phone: participant?.phone || '',
        isOnline: participant ? onlineUsers.has(participant._id) : false,
      };
    }
  };

  const info = getDisplayInfo();

  return (
    <section className="grid justify-stretch items-start content-start gap-0 bg-background border-l border-secondary h-screen w-[400px] overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex justify-start items-center gap-4 px-5 py-3 bg-secondary border-b border-secondary_light shrink-0">
        <Icon variant="chats" onClick={() => setRoomTab(undefined)}>
          <CloseIcon className="text-txt" />
        </Icon>
        <h3 className="text-lg text-white font-medium">
          {room.type === 'group' ? 'Group info' : 'Contact info'}
        </h3>
      </header>

      {/* Profile Section */}
      <div className="grid justify-center items-center gap-4 py-8 px-6 bg-secondary text-center">
        <div
          className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center mx-auto bg-cover bg-center shadow-xl ring-4 ring-background"
          style={{ backgroundImage: info.avatar ? `url('${info.avatar}')` : undefined }}
        >
          {!info.avatar && (
            <span className="text-primary text-6xl font-semibold">
              {info.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="grid gap-1">
          <h2 className="text-white text-2xl font-medium">{info.name}</h2>
          <p className="text-txt text-sm font-medium">{info.phone}</p>
          {info.isOnline && <p className="text-primary text-xs font-semibold">online</p>}
        </div>
      </div>

      {/* About Section */}
      <div className="grid gap-2 px-6 py-4 border-b border-secondary bg-secondary/30">
        <p className="text-txt text-xs uppercase tracking-wider font-semibold">About</p>
        <p className="text-white text-sm leading-relaxed">{info.description}</p>
      </div>

      {/* Media, Links, Docs */}
      <div className="grid gap-2 px-6 py-4 border-b border-secondary bg-secondary/30">
        <div className="flex justify-between items-center">
          <p className="text-txt text-xs uppercase tracking-wider font-semibold">Media, links and docs</p>
          <button
            onClick={() => setRoomTab("media")}
            className="text-primary text-xs hover:underline font-medium"
          >
            {media.length > 0 ? 'View all' : ''}
          </button>
        </div>

        {isLoadingMedia ? (
          <div className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-primary"></div>
          </div>
        ) : media.length === 0 ? (
          <p className="text-txt text-xs py-2 italic text-center">No common media</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 py-2">
            {media.map((item) => (
              <div
                key={item._id}
                onClick={() => setRoomTab("media")}
                className="aspect-square rounded-lg bg-secondary flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all shadow-sm"
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                ) : item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <div className="p-1 text-center">
                    <span className="text-xl">
                      {item.type === 'audio' ? '🎵' : '📎'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions (Mock) */}
      <div className="grid gap-0 py-2">
        <button className="flex items-center gap-4 px-6 py-3 hover:bg-secondary/50 transition-all text-left">
          <DocumentIcon className="text-txt w-5 h-auto text-primary" />
          <div className="grid">
            <span className="text-white text-sm">Starred messages</span>
          </div>
        </button>
      </div>

      {/* Participants Section (for Groups) */}
      {room.type === 'group' && (
        <div className="grid gap-2 border-t border-secondary py-4 bg-secondary/30">
          <div className="px-6 flex justify-between items-center mb-1">
            <p className="text-txt text-xs uppercase tracking-wider font-semibold">
              {room.participants.length} participants
            </p>
          </div>
          <div className="grid gap-0">
            {room.participants.map((participant) => (
              <div
                key={participant._id}
                className="flex items-center gap-4 px-6 py-3 hover:bg-secondary/50 transition-all cursor-pointer group"
              >
                <div
                  className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0 bg-cover bg-center"
                  style={{ backgroundImage: participant.avatar ? `url('${participant.avatar}')` : undefined }}
                >
                  {!participant.avatar && (
                    <div className="w-full h-full flex items-center justify-center text-primary font-semibold text-sm">
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 border-b border-secondary/30 pb-3 mt-1 group-last:border-0">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white text-sm font-medium truncate">{participant.name}</h4>
                    {onlineUsers.has(participant._id) && (
                      <span className="text-[10px] text-primary font-semibold">online</span>
                    )}
                  </div>
                  <p className="text-txt text-xs truncate">
                    {participant.about || 'Available'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Block & Report */}
      <div className="grid gap-0 py-2 border-t border-secondary mt-4">
        <button className="flex items-center gap-4 px-6 py-3 hover:bg-red-400/10 transition-all text-left group">
          <span className="text-red-400 text-sm group-hover:underline">Block {info.name}</span>
        </button>
        <button className="flex items-center gap-4 px-6 py-3 hover:bg-red-400/10 transition-all text-left group">
          <span className="text-red-400 text-sm group-hover:underline">Report {info.name}</span>
        </button>
      </div>
    </section>
  );
};

export default RoomInfoSection;
