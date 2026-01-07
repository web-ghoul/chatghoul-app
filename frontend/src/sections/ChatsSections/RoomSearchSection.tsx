import { useState, useMemo } from "react";
import { useChatsStore } from "../../globals/useChatsStore";
import { useAuthStore } from "../../globals/useAuthStore";
import CloseIcon from "../../icons/CloseIcon";
import Icon from "../../components/Icon/Icon";
import SearchInput from "../../components/SearchInput/SearchInput";
import MessageCard from "../../components/MessageCard/MessageCard";

const RoomSearchSection = () => {
    const setRoomTab = useChatsStore((state) => state.setRoomTab);
    const currentRoomId = useChatsStore((state) => state.room);
    const messages = useChatsStore((state) => state.messages[currentRoomId || ""] || []);
    const currentUser = useAuthStore((state) => state.user);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMessages = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return messages.filter(m =>
            m.type === 'text' &&
            m.message?.toLowerCase().includes(searchQuery.toLowerCase())
        ).reverse(); // Show newest first in results
    }, [messages, searchQuery]);

    const handleMessageClick = (messageId: string) => {
        const element = document.getElementById(`msg-${messageId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('animate-pulse', 'bg-primary/10');
            setTimeout(() => {
                element.classList.remove('animate-pulse', 'bg-primary/10');
            }, 2000);
        }
    };

    return (
        <section className="grid justify-stretch items-start content-start gap-0 bg-background h-screen w-[400px] border-l border-secondary">
            {/* Header */}
            <header className="flex justify-start items-center gap-4 px-5 py-3 bg-background border-b border-secondary_light">
                <Icon variant="chats" onClick={() => setRoomTab(undefined)}>
                    <CloseIcon className="text-txt" />
                </Icon>
                <h3 className="text-lg text-white font-medium">Search messages</h3>
            </header>

            {/* Search Input */}
            <div className="px-4 py-3">
                <SearchInput
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(val) => setSearchQuery(val)}
                />
            </div>

            {/* Search Results */}
            <div className="grid justify-stretch items-start gap-2 px-2 py-2 overflow-y-auto no-scrollbar h-[calc(100vh-130px)]">
                {searchQuery.trim() ? (
                    filteredMessages.length > 0 ? (
                        filteredMessages.map((msg) => {
                            const isOwn = String(msg.sender._id) === String(currentUser?._id);
                            return (
                                <div
                                    key={msg._id}
                                    className="cursor-pointer hover:bg-secondary/20 p-2 rounded-lg transition-colors border-b border-secondary/10 last:border-0"
                                    onClick={() => handleMessageClick(msg._id)}
                                >
                                    <div className="flex justify-between items-center mb-1 px-2">
                                        <span className="text-[10px] text-primary font-medium">
                                            {isOwn ? "You" : msg.sender.name}
                                        </span>
                                        <span className="text-[10px] text-txt">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="scale-90 origin-top-left -mb-4">
                                        <MessageCard
                                            message={msg}
                                            isOwn={isOwn}
                                            showSender={false}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-txt text-sm text-center py-8">
                            No messages found
                        </p>
                    )
                ) : (
                    <p className="text-txt text-sm text-center py-8">
                        Search for messages in this chat
                    </p>
                )}
            </div>
        </section>
    );
};

export default RoomSearchSection;

