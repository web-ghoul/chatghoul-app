import { useEffect, useCallback, useRef } from 'react';
import { useChatsStore } from '../globals/useChatsStore';
import { useAuthStore } from '../globals/useAuthStore';
import messageService from '../services/message.service';
import { socketService } from '../services/socket.service';

export function useRoomMessages() {
    const currentRoom = useChatsStore((state) => state.room);
    const messages = useChatsStore((state) => state.messages);
    const setMessages = useChatsStore((state) => state.setMessages);
    const prependMessages = useChatsStore((state) => state.prependMessages);
    const isLoadingMessages = useChatsStore((state) => state.isLoadingMessages);
    const setLoadingMessages = useChatsStore((state) => state.setLoadingMessages);
    const currentUser = useAuthStore((state) => state.user);

    const currentPageRef = useRef(1);
    const hasMoreRef = useRef(true);

    // Get messages for current room
    const roomMessages = currentRoom ? messages[currentRoom] || [] : [];

    const markAsRead = useCallback(async () => {
        if (!currentRoom || !currentUser) return;

        try {
            await messageService.markAsRead(currentRoom);
            useChatsStore.getState().markRoomAsRead(currentRoom, currentUser._id);
        } catch (error) {
            console.error('Failed to mark messages as read:', error);
        }
    }, [currentRoom, currentUser]);

    // Fetch messages when room changes
    useEffect(() => {
        if (!currentRoom) return;

        const fetchMessages = async () => {
            // Get current state to check if already loaded
            const currentRoomMessages = useChatsStore.getState().messages[currentRoom];

            // Skip if already loaded (even if empty array)
            if (currentRoomMessages !== undefined) {
                // Join room for real-time updates
                socketService.joinRoom(currentRoom);
                markAsRead(); // Still mark as read if we switch back
                return;
            }

            setLoadingMessages(true);
            currentPageRef.current = 1;
            hasMoreRef.current = true;

            try {
                const data = await messageService.getMessages(currentRoom, 1);
                setMessages(currentRoom, data);
                // Join room for real-time updates
                socketService.joinRoom(currentRoom);
                markAsRead();
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();

        // Leave room on cleanup
        return () => {
            if (currentRoom) {
                socketService.leaveRoom(currentRoom);
            }
        };
    }, [currentRoom, setMessages, setLoadingMessages, markAsRead]);

    // Also mark as read when new messages are added to the current room
    useEffect(() => {
        if (currentRoom && messages[currentRoom]?.length > 0) {
            const lastMsg = messages[currentRoom][messages[currentRoom].length - 1];
            if (String(lastMsg.sender._id) !== String(currentUser?._id) && !lastMsg.readBy?.includes(currentUser?._id as string)) {
                markAsRead();
            }
        }
    }, [currentRoom, currentRoom ? messages[currentRoom]?.length : 0, currentUser?._id, markAsRead]);

    // Load more (older) messages
    const loadMore = useCallback(async () => {
        if (!currentRoom || isLoadingMessages || !hasMoreRef.current) return;

        setLoadingMessages(true);
        const nextPage = currentPageRef.current + 1;

        try {
            const data = await messageService.getMessages(currentRoom, nextPage);
            if (data.length === 0) {
                hasMoreRef.current = false;
            } else {
                prependMessages(currentRoom, data);
                currentPageRef.current = nextPage;
            }
        } catch (error) {
            console.error('Failed to load more messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    }, [currentRoom, isLoadingMessages, setLoadingMessages, prependMessages]);

    return {
        messages: roomMessages,
        isLoading: isLoadingMessages,
        loadMore,
        hasMore: hasMoreRef.current,
        currentUserId: currentUser?._id,
    };
}

export default useRoomMessages;
