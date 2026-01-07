import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Search, X, Check, Loader2, UserPlus } from "lucide-react";
import userService from "../services/user.service";
import roomService from "../services/room.service";
import { useChatsStore } from "../globals/useChatsStore";
import type { User } from "../types/app.d";
import { toast } from "sonner";

interface AddMembersModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roomId: string;
    existingParticipants: string[];
}

const AddMembersModal = ({ open, onOpenChange, roomId, existingParticipants }: AddMembersModalProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            fetchUsers();
            setSelectedUsers([]);
            setSearchQuery("");
        }
    }, [open]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await userService.searchUsers("");
            // Filter out existing participants
            setUsers(data.filter(u => !existingParticipants.includes(u._id)));
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleUser = (user: User) => {
        if (selectedUsers.some(u => u._id === user._id)) {
            setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleAddMembers = async () => {
        if (selectedUsers.length === 0) return;
        setIsSubmitting(true);
        try {
            const updatedRoom = await roomService.addParticipants(roomId, selectedUsers.map(u => u._id));
            useChatsStore.getState().updateRoom(roomId, updatedRoom);
            toast.success(`${selectedUsers.length} member(s) added`);
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to add members");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-secondary border-gray/20 p-0 overflow-hidden sm:max-w-[480px] rounded-2xl shadow-2xl">
                <DialogHeader className="px-6 py-5 bg-secondary_light/30 border-b border-gray/10">
                    <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <UserPlus size={18} />
                        </div>
                        Add members
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-5 p-6">
                    {/* Search */}
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-txt group-focus-within:text-primary transition-colors">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            className="w-full bg-background/50 border border-gray/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm transition-all shadow-inner"
                            placeholder="Search by name, email or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Selected Users */}
                    {selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-1 animate-in fade-in slide-in-from-top-2 duration-300">
                            {selectedUsers.map(u => (
                                <div key={u._id} className="flex items-center gap-2 bg-primary text-black font-bold px-3 py-1.5 rounded-full text-xs shadow-lg shadow-primary/20 animate-in zoom-in-95">
                                    <span>{u.name}</span>
                                    <button
                                        onClick={() => toggleUser(u)}
                                        className="hover:bg-black/10 rounded-full p-0.5"
                                    >
                                        <X size={12} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* User List Title */}
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-txt tracking-widest px-1">
                        <span>Available Contacts</span>
                        <span>{filteredUsers.length} Users</span>
                    </div>

                    {/* User List */}
                    <div className="grid overflow-y-auto max-h-[320px] gap-2 pr-1 custom-scrollbar min-h-[100px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <Loader2 className="animate-spin text-primary" size={32} />
                                <span className="text-txt text-sm font-medium animate-pulse">Scanning users...</span>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
                                <div className="text-3xl opacity-20">👤</div>
                                <p className="text-txt text-sm font-medium italic">No matches found for your search</p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => {
                                const isSelected = selectedUsers.some(u => u._id === user._id);
                                return (
                                    <div
                                        key={user._id}
                                        onClick={() => toggleUser(user)}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer group border ring-offset-background ${isSelected
                                            ? 'bg-primary/10 border-primary/50 shadow-inner'
                                            : 'bg-secondary_light/10 border-gray/5 hover:border-primary/30 hover:bg-secondary_light/20'
                                            }`}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 relative border border-gray/10 overflow-hidden shadow-sm">
                                            {user.avatar ? (
                                                <img src={user.avatar} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary font-bold text-base bg-gradient-to-br from-primary/5 to-primary/20">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-primary/40 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in zoom-in-95">
                                                    <div className="bg-primary text-black rounded-full p-0.5 shadow-2xl scale-110">
                                                        <Check size={16} strokeWidth={4} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h5 className="text-white font-bold text-sm truncate group-hover:text-primary transition-colors">{user.name}</h5>
                                                <span className="text-txt text-[10px] font-bold tabular-nums opacity-60 bg-secondary px-1.5 py-0.5 rounded-md">{user.phone}</span>
                                            </div>
                                            <p className="text-[11px] text-txt/70 truncate mt-0.5">{user.about || "Hey there! I am using ChatGhoul."}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="p-6 bg-secondary_light/20 border-t border-gray/10 flex gap-3">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="flex-1 py-3 text-sm font-bold text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        Maybe later
                    </button>
                    <button
                        disabled={selectedUsers.length === 0 || isSubmitting}
                        onClick={handleAddMembers}
                        className="flex-[1.5] py-3 bg-primary hover:bg-primary/90 text-black rounded-xl text-sm font-black shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <span>ADD {selectedUsers.length > 0 && selectedUsers.length} MEMBERS</span>}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddMembersModal;
