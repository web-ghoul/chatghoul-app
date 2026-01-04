import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import socketService from '../lib/socketService';
import { useAuthStore } from '../globals/useAuthStore';
import { useSocketStore } from '../globals/useSocketStore';
import { useChatsStore } from '../globals/useChatsStore';
import messageService from '../services/message.service';
import type { Message } from '../types/app.d';

/**
 * Custom hook that manages all socket events
 * Handles: connect, disconnect, new_message, force_logout, typing, user_status
 */
export function useSocket() {
    const navigate = useNavigate();
    const { isAuthenticated, token, logout } = useAuthStore();
    const {
        setConnected,
        setTyping,
        setUserOnline,
        setUserOffline,
        openForceLogoutModal,
        reset: resetSocketStore
    } = useSocketStore();
    const { addMessage } = useChatsStore();

    const isInitialized = useRef(false);

    // Handle new message event
    const handleNewMessage = useCallback((message: Message) => {
        console.log('New message received:', message);
        addMessage(message);
        // Mark as delivered immediately
        if (message.room) {
            messageService.markAsDelivered(String(message.room))
                .catch(err => console.error('Failed to mark as delivered:', err));
        }
    }, [addMessage]);

    // Handle force logout event
    const handleForceLogout = useCallback((data: { message: string }) => {
        console.log('Force logout received:', data.message);
        openForceLogoutModal(data.message);
    }, [openForceLogoutModal]);

    // Handle typing event
    const handleTyping = useCallback((data: { roomId: string; userId: string; isTyping: boolean }) => {
        setTyping(data.roomId, data.userId, data.isTyping);
    }, [setTyping]);

    // Handle user status event
    const handleUserStatus = useCallback((data: { userId: string; status: 'online' | 'offline' }) => {
        if (data.status === 'online') {
            setUserOnline(data.userId);
        } else {
            setUserOffline(data.userId);
        }
    }, [setUserOnline, setUserOffline]);

    // Handle room joined confirmation
    const handleRoomJoined = useCallback((roomId: string) => {
        console.log('Joined room:', roomId);
    }, []);

    // Handle messages_read event
    const handleMessagesRead = useCallback((data: { roomId: string; userId: string }) => {
        console.log('Messages read in room:', data.roomId, 'by user:', data.userId);
        useChatsStore.getState().markRoomAsRead(data.roomId, data.userId);
    }, []);

    // Handle messages_delivered event
    const handleMessagesDelivered = useCallback((data: { roomId: string; userId: string }) => {
        console.log('Messages delivered in room:', data.roomId, 'to user:', data.userId);
        useChatsStore.getState().markRoomAsDelivered(data.roomId, data.userId);
    }, []);

    // Connect socket when authenticated
    useEffect(() => {
        if (!isAuthenticated || !token) {
            if (isInitialized.current) {
                socketService.disconnect();
                resetSocketStore();
                isInitialized.current = false;
            }
            return;
        }

        const socket = socketService.connect();

        if (!socket) {
            return;
        }

        isInitialized.current = true;

        // Set up event listeners
        socket.on('connect', () => {
            setConnected(true);
        });

        socket.on('disconnect', () => {
            setConnected(false);
        });

        socket.on('new_message', handleNewMessage);
        socket.on('messages_read', handleMessagesRead);
        socket.on('messages_delivered', handleMessagesDelivered);
        socket.on('force_logout', handleForceLogout);
        socket.on('typing', handleTyping);
        socket.on('user_status', handleUserStatus);
        socket.on('room_joined', handleRoomJoined);

        // Cleanup on unmount
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('new_message', handleNewMessage);
            socket.off('messages_read', handleMessagesRead);
            socket.off('messages_delivered', handleMessagesDelivered);
            socket.off('force_logout', handleForceLogout);
            socket.off('typing', handleTyping);
            socket.off('user_status', handleUserStatus);
            socket.off('room_joined', handleRoomJoined);
        };
    }, [
        isAuthenticated,
        token,
        setConnected,
        handleNewMessage,
        handleMessagesRead,
        handleMessagesDelivered,
        handleForceLogout,
        handleTyping,
        handleUserStatus,
        handleRoomJoined,
        resetSocketStore,
    ]);

    // Join/leave room helper
    const joinRoom = useCallback((roomId: string) => {
        socketService.joinRoom(roomId);
    }, []);

    const leaveRoom = useCallback((roomId: string) => {
        socketService.leaveRoom(roomId);
    }, []);

    // Emit typing event
    const emitTyping = useCallback((roomId: string, isTyping: boolean) => {
        socketService.emitTyping(roomId, isTyping);
    }, []);

    // Force logout handler - called when user clicks OK on modal
    const handleForceLogoutConfirm = useCallback(() => {
        logout();
        resetSocketStore();
        navigate('/login');
    }, [logout, resetSocketStore, navigate]);

    return {
        joinRoom,
        leaveRoom,
        emitTyping,
        handleForceLogoutConfirm,
        isConnected: socketService.isConnected(),
    };
}

export default useSocket;
