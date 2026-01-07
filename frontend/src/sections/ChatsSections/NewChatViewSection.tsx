import { useState, useEffect } from "react";
import { useChatsStore } from "../../globals/useChatsStore";
import userService from "../../services/user.service";
import roomService from "../../services/room.service";
import NewChatHeader from "../../components/NewChatHeader/NewChatHeader";
import AddUsersIcon from "../../icons/AddUsersIcon";
import { Search } from "lucide-react";
import type { User, Room } from "../../types/app.d";
import { toast } from "sonner";

const NewChatViewSection = () => {
    const setChatTab = useChatsStore((state) => state.setChatTab);
    const addRoom = useChatsStore((state) => state.addRoom);
    const setRoom = useChatsStore((state) => state.setRoom);
    const rooms = useChatsStore((state) => state.rooms);

    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Search users when query changes
    useEffect(() => {
        const searchUsers = async () => {
            if (!searchQuery.trim()) {
                setUsers([]);
                return;
            }
            setIsLoading(true);
            try {
                const data = await userService.searchUsers(searchQuery);
                setUsers(data);
            } catch (error) {
                console.error("Failed to search users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const handleUserClick = async (user: User) => {
        try {
            // Check if private room already exists with this user
            const existingRoom = rooms.find(
                (r: Room) =>
                    r.type === "private" &&
                    r.participants?.some((p: any) =>
                        typeof p === "string" ? p === user._id : p._id === user._id
                    )
            );

            if (existingRoom) {
                // Open existing room
                setRoom(existingRoom._id);
                setChatTab("chats");
                return;
            }

            // Create new private chat
            const room = await roomService.createRoom({
                type: "private",
                participants: [user._id],
            });
            addRoom(room);
            setRoom(room._id);
            setChatTab("chats");
            toast.success("Chat started");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to start chat");
            console.error(error);
        }
    };

    return (
        <section className="grid justify-stretch items-start content-start gap-4 border-x-2 border-x-secondary h-screen py-2 bg-secondary/20">
            <NewChatHeader />

            {/* Search Input */}
            <div className="px-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt w-3.5 h-3.5" />
                    <input
                        className="w-full bg-secondary border-none rounded-lg py-1.5 pl-10 pr-4 text-white focus:ring-1 focus:ring-primary outline-none text-sm"
                        placeholder="Search users by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            {/* New Group Button */}
            <div className="px-4 w-full">
                <button
                    className="transition-all hover:bg-secondary rounded-lg p-3 flex justify-start items-center gap-6 w-full hover:cursor-pointer"
                    onClick={() => setChatTab("new_group")}
                >
                    <div className="bg-primary p-2 text-black w-11 h-11 flex justify-center items-center rounded-full">
                        <AddUsersIcon className="w-5 h-auto" />
                    </div>
                    <h5 className="font-medium text-white text-sm">New Group</h5>
                </button>
            </div>

            {/* User List */}
            <div className="grid overflow-y-auto h-full px-2 gap-1">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : users.length > 0 ? (
                    users.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => handleUserClick(user)}
                            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-secondary transition-all cursor-pointer group"
                        >
                            <div className="w-11 h-11 rounded-full bg-gray-600 flex-shrink-0">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        className="w-full h-full rounded-full object-cover"
                                        alt={user.name}
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full flex items-center justify-center bg-primary/10 text-primary uppercase font-bold">
                                        {user.name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="grid">
                                <h5 className="text-white font-medium">{user.name}</h5>
                                <p className="text-xs text-txt truncate">
                                    {user.about || "Hey there! I am using ChatGhoul."}
                                </p>
                            </div>
                        </div>
                    ))
                ) : searchQuery.trim() ? (
                    <div className="flex items-center justify-center h-32 text-txt">
                        No users found
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32 text-txt text-sm px-8 text-center">
                        Search for users to start a conversation
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewChatViewSection;
