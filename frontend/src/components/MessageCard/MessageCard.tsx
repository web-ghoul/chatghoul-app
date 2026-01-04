import DoubleCheckIcon from "../../icons/DoubleCheckIcon";
import CheckIcon from "../../icons/CheckIcon";
import type { Message } from "../../types/app.d";
import { useChatsStore } from "../../globals/useChatsStore";
import MessageMenu from "./MessageMenu";

interface MessageCardProps {
  message: Message;
  isOwn: boolean;
  showSender?: boolean;
}

const MessageCard = ({ message, isOwn, showSender = false }: MessageCardProps) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="max-w-xs">
            <img
              src={message.mediaUrl}
              alt="Image"
              className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
            {message.message && (
              <p className="text-sm text-white mt-2">{message.message}</p>
            )}
          </div>
        );
      case 'video':
        return (
          <div className="max-w-xs">
            <video
              src={message.mediaUrl}
              controls
              className="rounded-lg max-w-full h-auto"
            />
            {message.message && (
              <p className="text-sm text-white mt-2">{message.message}</p>
            )}
          </div>
        );
      case 'audio':
        return (
          <div className="max-w-xs grid gap-2">
            <audio src={message.mediaUrl} controls className="max-w-full" />
            {message.message && (
              <p className="text-sm text-white">{message.message}</p>
            )}
          </div>
        );
      case 'file':
        return (
          <div className="max-w-xs grid gap-2">
            <a
              href={message.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:underline"
            >
              <span className="text-2xl">📎</span>
              <span className="text-sm truncate">{message.fileName || 'Download file'}</span>
            </a>
            {message.message && (
              <p className="text-sm text-white">{message.message}</p>
            )}
          </div>
        );
      default:
        return (
          <p className={`text-sm text-white break-words ${isOwn ? "pr-6" : "pl-0"}`}>
            {message.message}
          </p>
        );
    }
  };

  const isRead = message.readBy && message.readBy.length > 0;
  const isDelivered = message.deliveredTo && message.deliveredTo.length > 0;

  return (
    <article className={`px-16 pb-3 flex ${isOwn ? "justify-end" : "justify-start"} items-end gap-2`}>
      {showSender && !isOwn && (
        <div
          className="w-8 h-8 rounded-full bg-gray-600 bg-cover bg-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => useChatsStore.getState().setRoomTab("info")}
          style={{
            backgroundImage: message.sender?.avatar
              ? `url('${message.sender.avatar}')`
              : undefined,
          }}
        >
          {!message.sender?.avatar && (
            <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
              {message.sender?.name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>
      )}

      <div className={`p-3 rounded-xl grid justify-stretch items-center gap-2 relative w-max max-w-[65%] shadow-md ${isOwn
        ? "rounded-tr-none bg-primary_dark"
        : "rounded-tl-none bg-secondary_light"
        }`}>
        {showSender && !isOwn && message.sender && (
          <p
            className="text-xs text-primary font-medium cursor-pointer hover:underline"
            onClick={() => useChatsStore.getState().setRoomTab("info")}
          >
            {message.sender.name}
          </p>
        )}

        <div className="flex justify-between items-start gap-2 group">
          {renderContent()}
          <MessageMenu
            messageId={message._id}
            isStarred={message.starredBy && message.starredBy.length > 0}
          />
        </div>

        <div className="flex justify-end items-center gap-2 text-txt">
          {message.starredBy && message.starredBy.length > 0 && (
            <span className="text-[10px]">⭐</span>
          )}
          <p className="text-xs font-medium">{formatTime(message.createdAt)}</p>
          {isOwn && (
            isRead
              ? <DoubleCheckIcon className="w-4 h-auto text-[#53bdeb]" />
              : isDelivered
                ? <DoubleCheckIcon className="w-4 h-auto text-txt" />
                : <CheckIcon className="w-4 h-auto text-txt" />
          )}
        </div>
      </div>
    </article>
  );
};

export default MessageCard;
