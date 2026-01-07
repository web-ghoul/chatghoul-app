import { useChatsStore } from "../globals/useChatsStore";
import { useAuthStore } from "../globals/useAuthStore";
import { toast } from "sonner";
import { useCallback, useMemo } from "react";

export const useRoomMenu = () => {
    const currentRoomId = useChatsStore((state) => state.room);
    const rooms = useChatsStore((state) => state.rooms);
    const setRoom = useChatsStore((state) => state.setRoom);
    const setRoomTab = useChatsStore((state) => state.setRoomTab);
    const clearChat = useChatsStore((state) => state.clearChat);
    const deleteChat = useChatsStore((state) => state.deleteChat);
    const blockUser = useChatsStore((state) => state.blockUser);
    const unblockUser = useChatsStore((state) => state.unblockUser);
    const reportUser = useChatsStore((state) => state.reportUser);
    const currentUser = useAuthStore((state) => state.user);

    const room = useMemo(() => rooms.find(r => r._id === currentRoomId), [rooms, currentRoomId]);

    const otherParticipant = useMemo(() => {
        if (room?.type !== 'private') return null;
        return room.participants.find(p => String(p._id) !== String(currentUser?._id));
    }, [room, currentUser]);

    const isBlocked = useMemo(() => {
        if (!otherParticipant) return false;
        return currentUser?.blockedUsers?.includes(String(otherParticipant._id)) ?? false;
    }, [otherParticipant, currentUser]);

    const handleBlockToggle = useCallback(async () => {
        if (!otherParticipant) return;
        try {
            if (isBlocked) {
                await unblockUser(String(otherParticipant._id));
                toast.success("User unblocked");
            } else {
                await blockUser(String(otherParticipant._id));
                toast.success("User blocked");
            }
        } catch (error) {
            toast.error("Action failed");
        }
    }, [otherParticipant, isBlocked, unblockUser, blockUser]);

    const handleReport = useCallback(async () => {
        if (!otherParticipant) return;
        try {
            await reportUser(String(otherParticipant._id));
            toast.success("User reported");
        } catch (error) {
            toast.error("Failed to report user");
        }
    }, [otherParticipant, reportUser]);

    const handleClearChat = useCallback(async () => {
        if (!currentRoomId) return;
        try {
            await clearChat(currentRoomId);
            toast.success("Chat cleared");
        } catch (error) {
            toast.error("Failed to clear chat");
        }
    }, [currentRoomId, clearChat]);

    const handleDeleteChat = useCallback(async () => {
        if (!currentRoomId) return;
        try {
            await deleteChat(currentRoomId);
            toast.success("Chat deleted");
        } catch (error) {
            toast.error("Failed to delete chat");
        }
    }, [currentRoomId, deleteChat]);

    return {
        room,
        isBlocked,
        handleBlockToggle,
        handleReport,
        handleClearChat,
        handleDeleteChat,
        setRoom,
        setRoomTab,
        otherParticipant,
    };
};
