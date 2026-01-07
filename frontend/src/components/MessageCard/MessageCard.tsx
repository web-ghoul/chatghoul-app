import type { Message } from "../../types/app.d";
import { useAuthStore } from "../../globals/useAuthStore";
import MessageMenu from "./MessageMenu";
import MessageAvatar from "./MessageAvatar";
import MessageBubble from "./MessageBubble";
import MessageSender from "./MessageSender";
import MessageContent from "./MessageContent";
import MessageFooter from "./MessageFooter";

interface MessageCardProps {
  message: Message;
  isOwn: boolean;
  showSender?: boolean;
}

const MessageCard = ({ message, isOwn, showSender = false }: MessageCardProps) => {
  return (
    <article
      id={`msg-${message._id}`}
      className={`px-16 pb-3 flex ${isOwn ? "justify-end" : "justify-start"} items-end gap-2 scroll-mt-20`}
    >
      <MessageAvatar show={showSender && !isOwn} sender={message.sender} />

      <MessageBubble isOwn={isOwn}>
        <MessageSender show={showSender && !isOwn} sender={message.sender} />

        <div className="flex justify-between items-start gap-2 group">
          <MessageContent message={message} isOwn={isOwn} />
          <MessageMenu
            messageId={message._id}
            isStarred={message.starredBy && message.starredBy.some(id => String(id) === String(useAuthStore.getState().user?._id))}
            isPinned={message.isPinned}
            roomId={typeof message.room === 'string' ? message.room : (message.room?._id || '')}
            isOwn={isOwn}
          />
        </div>

        <MessageFooter message={message} isOwn={isOwn} />
      </MessageBubble>
    </article>
  );
};

// Compound properties
MessageCard.Avatar = MessageAvatar;
MessageCard.Bubble = MessageBubble;
MessageCard.Sender = MessageSender;
MessageCard.Content = MessageContent;
MessageCard.Footer = MessageFooter;

export default MessageCard;
