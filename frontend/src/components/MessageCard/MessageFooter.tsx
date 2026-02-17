import DoubleCheckIcon from "../../icons/DoubleCheckIcon";
import CheckIcon from "../../icons/CheckIcon";
import type { Message } from "../../types/app.d";

interface MessageFooterProps {
  message: Message;
  isOwn: boolean;
}

const MessageFooter = ({ message, isOwn }: MessageFooterProps) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isRead =
    message.readBy &&
    message.readBy.some(
      (id) => String(id) !== String(message.sender?._id || message.sender),
    );
  const isDelivered =
    message.deliveredTo &&
    message.deliveredTo.some(
      (id) => String(id) !== String(message.sender?._id || message.sender),
    );

  return (
    <div className="flex justify-end items-center gap-2 text-txt">
      {message.starredBy && message.starredBy.length > 0 && (
        <span className="text-[10px]">⭐</span>
      )}
      <p className="text-xs font-medium">{formatTime(message.createdAt)}</p>
      {isOwn &&
        (isRead ? (
          <DoubleCheckIcon className="w-4 h-auto text-[#53bdeb]" />
        ) : isDelivered ? (
          <DoubleCheckIcon className="w-4 h-auto text-txt" />
        ) : (
          <CheckIcon className="w-4 h-auto text-txt" />
        ))}
    </div>
  );
};

export default MessageFooter;
