import { useEffect, useState } from "react";
import { useChatsStore } from "../../globals/useChatsStore";
import messageService from "../../services/message.service";
import MessageCard from "../../components/MessageCard/MessageCard";
import Icon from "../../components/Icon/Icon";
import { ArrowLeft } from "lucide-react";
import type { Message, Room } from "../../types/app.d";

const StarredMessagesSection = () => {
    const setChatTab = useChatsStore((state) => state.setChatTab);
    const [starredMessages, setStarredMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStarred = async () => {
            try {
                const data = await messageService.getStarredMessages();
                setStarredMessages(data);
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
                <Icon onClick={() => setChatTab("chats")}>
                    <ArrowLeft className="text-white w-5 h-auto" />
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
                    starredMessages.map((message) => (
                        <div key={message._id} className="grid gap-1">
                            <div className="px-2 py-1 text-[10px] text-primary bg-primary/10 w-max rounded">
                                {(message.room as Room)?.name || "Chat"}
                            </div>
                            <MessageCard
                                message={message}
                                isOwn={false}
                            />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default StarredMessagesSection;
