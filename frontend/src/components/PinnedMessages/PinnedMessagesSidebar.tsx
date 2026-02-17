import { X, Pin } from "lucide-react";
import Icon from "../Icon/Icon";
import MessageCard from "../MessageCard/MessageCard";
import { useAuthStore } from "../../globals/useAuthStore";
import type { Room, Message } from "../../types/app.d";

interface PinnedMessagesSidebarProps {
  room: Room;
  onClose: () => void;
}

const PinnedMessagesSidebar = ({
  room,
  onClose,
}: PinnedMessagesSidebarProps) => {
  const currentUser = useAuthStore((state) => state.user);
  const pinnedMessages = room.pinnedMessages || [];

  const scrollToMessage = (messageId: string) => {
    const element = document.getElementById(`msg-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("bg-primary/10");
      setTimeout(() => {
        element.classList.remove("bg-primary/10");
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-l border-gray/10 w-[350px]">
      <div className="flex items-center justify-between p-4 border-b border-gray/10">
        <div className="flex items-center gap-2">
          <Icon active children={<Pin className="w-4 h-4" />} />
          <h2 className="text-lg font-semibold">Pinned Messages</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-secondary rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {pinnedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-txt/50 text-center px-4">
            <Pin className="w-10 h-10 mb-4 opacity-20" />
            <p>No pinned messages yet</p>
            <p className="text-sm mt-1">
              Pin important messages to find them easily later.
            </p>
          </div>
        ) : (
          pinnedMessages
            .map((pm: any) => {
              const message = pm.message as Message;
              const isOwn =
                String(message?.sender?._id || message?.sender) ===
                String(currentUser?._id);

              return (
                <div
                  key={message?._id || pm.message}
                  className="cursor-pointer hover:bg-secondary/50 p-2 rounded-xl transition-colors ring-1 ring-gray/5"
                  onClick={() => message?._id && scrollToMessage(message._id)}
                >
                  <div className="scale-90 origin-top-left pointer-events-none opacity-80">
                    <MessageCard
                      message={message}
                      isOwn={isOwn}
                      showSender={room.type === "group"}
                    />
                  </div>
                  <div className="mt-2 px-2 flex justify-between items-center text-[10px] text-txt/40">
                    <span>Pinned by {pm.pinnedBy?.name || "User"}</span>
                    {pm.expiresAt && (
                      <span>
                        Expires {new Date(pm.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
            .reverse()
        )}
      </div>
    </div>
  );
};

export default PinnedMessagesSidebar;
