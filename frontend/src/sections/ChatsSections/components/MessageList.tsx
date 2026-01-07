import MessageCard from "../../../components/MessageCard/MessageCard";

interface MessageListProps {
    messages: any[];
    currentUserId: string | undefined;
    isGroupChat: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    messagesContainerRef: React.RefObject<HTMLDivElement | null>;
}

const MessageList = ({
    messages,
    currentUserId,
    isGroupChat,
    messagesEndRef,
    onScroll,
    messagesContainerRef
}: MessageListProps) => {
    return (
        <div
            ref={messagesContainerRef}
            onScroll={onScroll}
            className="grid justify-stretch items-start content-start overflow-y-auto h-full w-full py-4 z-10 scroll-smooth"
        >
            {messages.length === 0 ? (
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
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
