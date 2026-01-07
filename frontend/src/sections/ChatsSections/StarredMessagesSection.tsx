import React, { useEffect, useState } from "react";
import { useChatsStore } from "../../globals/useChatsStore";
import messageService from "../../services/message.service";
import MessageCard from "../../components/MessageCard/MessageCard";
import Icon from "../../components/Icon/Icon";
import { ArrowLeft } from "lucide-react";
import type { Message, Room } from "../../types/app.d";
import { useAuthStore } from "../../globals/useAuthStore";

const StarredMessagesSection: React.FC<{ isRoomSpecific?: boolean }> = ({ isRoomSpecific = false }) => {
    const setChatTab = useChatsStore((state) => state.setChatTab);
    const setRoomTab = useChatsStore((state) => state.setRoomTab);
    const currentRoomId = useChatsStore((state) => state.room);
    const setRoom = useChatsStore((state) => state.setRoom);
    const currentUser = useAuthStore((state) => state.user);
    const [starredMessages, setStarredMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleMessageClick = (message: Message) => {
        const roomId = typeof message.room === 'string' ? message.room : message.room._id;
        if (String(currentRoomId) !== String(roomId)) {
            setRoom(roomId);
        }

        // Wait for room to change and messages to (hopefully) be in DOM
        setTimeout(() => {
            const element = document.getElementById(`msg-${message._id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('animate-pulse', 'bg-primary/10');
                setTimeout(() => {
                    element.classList.remove('animate-pulse', 'bg-primary/10');
                }, 2000);
            }
        }, 100);
    };

    useEffect(() => {
        const fetchStarred = async () => {
            try {
                const data = await messageService.getStarredMessages();
                const filtered = isRoomSpecific && currentRoomId
                    ? data.filter(m => {
                        const mRoomId = typeof m.room === 'string' ? m.room : m.room._id;
                        return String(mRoomId) === String(currentRoomId);
                    })
                    : data;
                setStarredMessages(filtered);
            } catch (error) {
                console.error("Failed to fetch starred messages:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStarred();
    }, []);

    return (
        <section className="grid justify-stretch items-start content-start gap-4 border-x-2 border-x-secondary h-screen py-2 bg-secondary/20">
            <header className="flex items-center gap-4 px-5 min-h-14 border-b border-gray/20">
                <Icon onClick={() => isRoomSpecific ? setRoomTab("info") : setChatTab("chats")}>
                    <ArrowLeft className="text-white w-4 h-4" />
                </Icon>
                <h1 className="text-xl text-white font-medium">Starred messages</h1>
            </header>

            <div className="grid justify-stretch items-center overflow-y-auto h-full px-4 gap-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : starredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-txt text-center">
                        <p className="text-lg">No starred messages</p>
                        <p className="text-sm">Star messages to easily find them later.</p>
                    </div>
                ) : (
                    starredMessages.map((message) => {
                        const isOwn = String(message.sender._id) === String(currentUser?._id);
                        return (
                            <div
                                key={message._id}
                                className="grid gap-1 border-b border-secondary/20 pb-4 cursor-pointer hover:bg-secondary/10 transition-colors p-2 rounded-lg"
                                onClick={() => handleMessageClick(message)}
                            >
                                <div className="flex justify-between items-center px-2">
                                    <div className="px-2 py-0.5 text-[10px] text-primary bg-primary/10 w-max rounded font-medium">
                                        {!isRoomSpecific && ((message.room as Room)?.name || "Chat")}
                                        {isOwn ? " (You)" : ` (${message.sender.name})`}
                                    </div>
                                    <span className="text-[10px] text-txt">
                                        {formatDate(message.createdAt)}
                                    </span>
                                </div>
                                <MessageCard
                                    message={message}
                                    isOwn={isOwn}
                                    showSender={!isOwn}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default StarredMessagesSection;
