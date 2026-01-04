import { useEffect, useRef, useState } from "react";
import ChatInput from "../../components/ChatInput/ChatInput";
import MessageCard from "../../components/MessageCard/MessageCard";
import RoomHeader from "../../components/RoomHeader/RoomHeader";
import Swiper from "../../components/Swiper/Swiper";
import { useRoomMessages } from "../../hooks/useRoomMessages";
import { useChatsStore } from "../../globals/useChatsStore";
import { useAuthStore } from "../../globals/useAuthStore";
import { useSocketStore } from "../../globals/useSocketStore";

const RoomSection = () => {
  const { messages, isLoading, currentUserId } = useRoomMessages();
  const currentRoom = useChatsStore((state) => state.room);
  const rooms = useChatsStore((state) => state.rooms);
  const currentUser = useAuthStore((state) => state.user);
  const typingUsers = useSocketStore((state) => state.typingUsers);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get current room data
  const currentRoomData = rooms.find(r => r._id === currentRoom);
  const isGroupChat = currentRoomData?.type === 'group';

  // Get typing users for current room
  const roomTypingUsers = currentRoom ? typingUsers[currentRoom] || [] : [];

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

  return (
    <section className="grid justify-stretch items-center grid-rows-[auto_1fr_auto] bg-background h-screen w-full relative">
      <div
        className="absolute opacity-[0.06] left-0 top-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: `url('https://static.whatsapp.net/rsrc.php/v4/y1/r/m5BEg2K4OR4.png')`,
        }}
      ></div>
      <Swiper
        show={showScrollDown}
        onClick={scrollToBottom}
        unreadCount={currentUser ? currentRoomData?.unreadCounts?.[String(currentUser._id)] : 0}
      />
      <RoomHeader />
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="grid justify-stretch items-start content-start overflow-y-auto h-full w-full py-4 z-10 scroll-smooth"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-txt">
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              isOwn={String(message.sender._id) === String(currentUserId)}
              showSender={isGroupChat}
            />
          ))
        )}
        {/* Typing indicator */}
        {roomTypingUsers.length > 0 && (
          <div className="px-16 pb-3 flex justify-start items-center">
            <div className="p-3 rounded-xl rounded-tl-none bg-secondary_light">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput />
    </section>
  );
};

export default RoomSection;
