import { useState, useEffect } from "react";
import { useChatsStore } from "../../globals/useChatsStore";
import userService from "../../services/user.service";
import roomService from "../../services/room.service";
import Icon from "../../components/Icon/Icon";
import { ArrowLeft, Check, Search, X } from "lucide-react";
import type { User } from "../../types/app.d";
import { toast } from "sonner";

const NewGroupSection = () => {
    const setChatTab = useChatsStore((state) => state.setChatTab);
    const addRoom = useChatsStore((state) => state.addRoom);
    const setRoom = useChatsStore((state) => state.setRoom);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [groupName, setGroupName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.searchUsers("");
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleUser = (user: User) => {
        if (selectedUsers.some(u => u._id === user._id)) {
            setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            toast.error("Please enter a group name");
            return;
        }
        try {
            const room = await roomService.createRoom({
                type: 'group',
                name: groupName,
                participants: selectedUsers.map(u => u._id),
            });
            addRoom(room);
            setRoom(room._id);
            setChatTab("chats");
            toast.success("Group created successfully");
        } catch (error) {
            toast.error("Failed to create group");
            console.error(error);
        }
    };

    return (
        <section className="grid justify-stretch items-start content-start gap-4 border-x-2 border-x-secondary h-screen py-2 bg-secondary/20">
            <header className="flex items-center gap-4 px-5 min-h-14 border-b border-gray/20">
                <Icon onClick={() => step === 1 ? setChatTab("chats") : setStep(1)}>
                    <ArrowLeft className="text-white w-4 h-4" />
                </Icon>
                <div className="grid">
                    <h1 className="text-xl text-white font-medium">New group</h1>
                    {step === 1 && <p className="text-xs text-txt">{selectedUsers.length} selected</p>}
                </div>
            </header>

            {step === 1 ? (
                <>
                    <div className="px-5">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedUsers.map(u => (
                                <div key={u._id} className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-1 rounded-full text-xs">
                                    <span>{u.name}</span>
                                    <X size={10} className="cursor-pointer" onClick={() => toggleUser(u)} />
                                </div>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt w-3.5 h-3.5" />
                            <input
                                className="w-full bg-secondary border-none rounded-lg py-1.5 pl-10 pr-4 text-white focus:ring-1 focus:ring-primary outline-none text-sm"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid overflow-y-auto h-full px-2 gap-1 mt-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => toggleUser(user)}
                                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-secondary transition-all cursor-pointer group"
                                >
                                    <div className="w-11 h-11 rounded-full bg-gray-600 flex-shrink-0 relative">
                                        {user.avatar ? (
                                            <img src={user.avatar} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full rounded-full flex items-center justify-center bg-primary/10 text-primary uppercase font-bold text-sm">
                                                {user.name?.charAt(0)}
                                            </div>
                                        )}
                                        {selectedUsers.some(u => u._id === user._id) && (
                                            <div className="absolute -bottom-1 -right-1 bg-primary text-black rounded-full p-0.5 border-2 border-background">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid">
                                        <h5 className="text-white font-medium text-sm">{user.name}</h5>
                                        <p className="text-[11px] text-txt truncate">{user.status || user.about || "Hey there! I am using ChatGhoul."}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {selectedUsers.length > 0 && (
                        <div className="flex justify-center p-4">
                            <button
                                onClick={() => setStep(2)}
                                className="bg-primary hover:bg-primary/90 text-black p-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                            >
                                <ArrowLeft className="rotate-180" size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="px-5 grid gap-8 animate-in fade-in slide-in-from-right-4">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full bg-secondary_light flex items-center justify-center text-txt hover:bg-secondary cursor-pointer border-2 border-dashed border-gray-500">
                            <div className="grid justify-items-center gap-1">
                                <span className="text-2xl">📷</span>
                                <span className="text-[10px] uppercase font-bold">Add Group Icon</span>
                            </div>
                        </div>
                        <div className="w-full relative">
                            <input
                                className="w-full bg-transparent border-b border-primary py-2 text-white focus:outline-none placeholder:text-txt/50"
                                placeholder="Group name..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="flex justify-between items-center text-xs text-txt uppercase font-bold tracking-wider">
                            <span>Participants</span>
                            <span>{selectedUsers.length}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {selectedUsers.map(u => (
                                <div key={u._id} className="grid justify-items-center gap-1">
                                    <div className="w-12 h-12 rounded-full bg-gray-600">
                                        <img src={u.avatar} className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    <span className="text-[10px] text-white truncate w-full text-center">{u.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center pt-8">
                        <button
                            onClick={handleCreateGroup}
                            className="bg-primary hover:bg-primary/90 text-black px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                        >
                            Create Group
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default NewGroupSection;
