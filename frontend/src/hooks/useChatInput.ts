import { useState, useCallback, useRef, useEffect } from 'react';
import { useChatsStore } from '../globals/useChatsStore';
import { useAuthStore } from '../globals/useAuthStore';
import messageService from '../services/message.service';
import roomService from '../services/room.service';
import { socketService } from '../services/socket.service';
import { toast } from 'sonner';

export function useChatInput() {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Media preview states
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'image' | 'video' | 'audio' | 'file'>('file');

    const currentRoom = useChatsStore((state) => state.room);
    const addMessage = useChatsStore((state) => state.addMessage);

    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTypingRef = useRef(false);

    // Handle typing indicator
    const handleTypingChange = useCallback((value: string) => {
        setMessage(value);

        if (!currentRoom) return;

        // Start typing if not already
        if (!isTypingRef.current && value.length > 0) {
            isTypingRef.current = true;
            socketService.emitTyping(currentRoom, true);
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing after 2 seconds of inactivity
        if (value.length > 0) {
            typingTimeoutRef.current = setTimeout(() => {
                if (currentRoom && isTypingRef.current) {
                    isTypingRef.current = false;
                    socketService.emitTyping(currentRoom, false);
                }
            }, 2000);
        } else {
            // Immediately stop typing if message is empty
            if (isTypingRef.current) {
                isTypingRef.current = false;
                socketService.emitTyping(currentRoom, false);
            }
        }
    }, [currentRoom]);

    // Send text message
    const sendMessage = useCallback(async () => {
        if (!message.trim() || !currentRoom || isSending) return;

        setIsSending(true);

        // Stop typing indicator
        if (isTypingRef.current) {
            isTypingRef.current = false;
            socketService.emitTyping(currentRoom, false);
        }

        try {
            const newMessage = await messageService.sendMessage(currentRoom, {
                message: message.trim(),
                type: 'text',
            });
            addMessage(newMessage);
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        } finally {
            setIsSending(false);
        }
    }, [message, currentRoom, isSending, addMessage]);

    // Stage file for preview
    const onSelectFile = useCallback((file: File) => {
        let type: 'image' | 'video' | 'audio' | 'file' = 'file';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';

        setFileType(type);
        setPendingFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }, []);

    const clearPendingFile = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPendingFile(null);
        setPreviewUrl(null);
    }, [previewUrl]);

    // Perform actual file upload and send
    const submitFile = useCallback(async () => {
        if (!pendingFile || !currentRoom || isSending) return;

        setIsSending(true);
        try {
            const uploadData = await roomService.uploadFile(currentRoom, pendingFile);

            const newMessage = await messageService.sendMessage(currentRoom, {
                type: fileType,
                mediaUrl: uploadData.url,
                fileName: uploadData.fileName,
                // Include the current message state as a caption
                message: message.trim(),
            });

            addMessage(newMessage);
            toast.success('File sent');
            setMessage(''); // Clear caption
            clearPendingFile();
        } catch (error) {
            console.error('Failed to send file:', error);
            toast.error('Failed to send file');
        } finally {
            setIsSending(false);
        }
    }, [currentRoom, isSending, addMessage, pendingFile, fileType, message, clearPendingFile]);

    // Handle key press (Enter to send)
    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        const { user } = useAuthStore.getState();
        const enterIsSend = user?.settings?.enterIsSend !== false; // Default to true

        if (e.key === 'Enter') {
            if (enterIsSend && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
            // If enterIsSend is false, we don't preventDefault, allowing the default behavior
            // Note: standard HTML 'input' doesn't support new lines even with Shift+Enter.
        }
    }, [sendMessage]);

    // Cleanup URLs on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (currentRoom && isTypingRef.current) {
                socketService.emitTyping(currentRoom, false);
            }
        };
    }, [currentRoom, previewUrl]);

    const room = useChatsStore((state) => state.rooms.find(r => r._id === currentRoom));
    const user = useAuthStore((state) => state.user);

    const getUserId = (u: any): string => {
        if (!u) return '';
        return typeof u === 'string' ? u : u._id;
    };

    const isGroupAdmin = room?.type === 'group' && (
        getUserId(room.superAdmin) === user?._id ||
        room.admins?.some(a => getUserId(a) === user?._id)
    );

    const canSendMessages = room?.type !== 'group' ||
        room.permissions?.sendMessages !== 'admins' ||
        isGroupAdmin;

    return {
        message,
        setMessage: handleTypingChange,
        isSending,
        sendMessage,
        onSelectFile,
        submitFile,
        clearPendingFile,
        pendingFile,
        previewUrl,
        fileType,
        handleKeyPress,
        isDisabled: !currentRoom || !canSendMessages,
    };
}

export default useChatInput;
