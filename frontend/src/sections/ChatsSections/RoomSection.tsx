import { useEffect, useRef, useState } from "react";
import ChatInput from "../../components/ChatInput/ChatInput";
import RoomHeader from "../../components/RoomHeader/RoomHeader";
import Swiper from "../../components/Swiper/Swiper";
import { useRoomMessages } from "../../hooks/useRoomMessages";
import { useChatsStore } from "../../globals/useChatsStore";
import { useAuthStore } from "../../globals/useAuthStore";
import { useSocketStore } from "../../globals/useSocketStore";

import MessageList from "./components/MessageList";
import TypingIndicator from "./components/TypingIndicator";
import { getWallpaperClass } from "../../functions/wallpaper";
import PinnedMessageBar from "../../components/PinnedMessages/PinnedMessageBar";
import PinnedMessagesSidebar from "../../components/PinnedMessages/PinnedMessagesSidebar";

const RoomSection = () => {
  const { messages, isLoading, currentUserId } = useRoomMessages();
  const currentRoom = useChatsStore((state) => state.room);
  const rooms = useChatsStore((state) => state.rooms);
  const { user } = useAuthStore();
  const typingUsers = useSocketStore((state) => state.typingUsers);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showPins, setShowPins] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get current room data
  const currentRoomData = rooms.find(r => r._id === currentRoom);
  const isGroupChat = currentRoomData?.type === 'group';

  // Get typing users for current room
  const roomTypingUsers = currentRoom ? typingUsers[currentRoom] || [] : [];

  // Wallpaper color
  const wallpaperClass = getWallpaperClass(user?.settings?.chatWallpaper);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && !showScrollDown) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, showScrollDown]);

  // Handle manual scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollDown(false);
  };

  // Monitor scroll position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollDown(!isAtBottom);
  };

  if (!currentRoomData) return null;

  return (
    <section className="flex flex-row h-screen w-full relative overflow-hidden bg-background">
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Background Layer (Color/Gradient) */}
        <div className={`absolute inset-0 z-0 ${wallpaperClass}`} />

        {/* Pattern Layer (Fixed WhatsApp pattern) */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none z-0 bg-repeat"
          style={{ backgroundImage: `url('https://static.whatsapp.net/rsrc.php/v4/y1/r/m5BEg2K4OR4.png')`, backgroundSize: '400px' }}
        />

        <RoomHeader onShowPins={() => setShowPins(true)} />

        <PinnedMessageBar
          pinnedMessages={currentRoomData.pinnedMessages}
          onClick={() => setShowPins(true)}
        />

        <div className="flex-1 relative min-h-0">
          <Swiper
            show={showScrollDown}
            onClick={scrollToBottom}
            unreadCount={user ? (currentRoomData?.unreadCounts as any)?.[String(user._id)] : 0}
          />

          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="h-full relative overflow-hidden grid">
              <MessageList
                messages={messages}
                currentUserId={currentUserId}
                isGroupChat={isGroupChat}
                messagesEndRef={messagesEndRef}
                onScroll={handleScroll}
                messagesContainerRef={messagesContainerRef}
              />
              <TypingIndicator roomTypingUsers={roomTypingUsers} />
            </div>
          )}
        </div>

        <ChatInput />
      </div>

      {showPins && (
        <PinnedMessagesSidebar
          room={currentRoomData}
          onClose={() => setShowPins(false)}
        />
      )}
    </section>
  );
};

export default RoomSection;
