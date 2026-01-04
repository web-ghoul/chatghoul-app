import { useState, useEffect, useCallback } from 'react';
import { useChatsStore } from '../globals/useChatsStore';
import roomService from '../services/room.service';
import type { Media } from '../types/app.d';

type MediaType = 'all' | 'image' | 'video' | 'audio' | 'file';

export function useMediaDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<MediaType>('all');
    const [media, setMedia] = useState<Media[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const currentRoom = useChatsStore((state) => state.room);

    useEffect(() => {
        if (!isOpen || !currentRoom) return;

        const fetchMedia = async () => {
            setIsLoading(true);
            try {
                const type = activeTab === 'all' ? undefined : activeTab;
                const data = await roomService.getRoomMedia(currentRoom, type);
                setMedia(data);
            } catch (error) {
                console.error('Failed to fetch media:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMedia();
    }, [isOpen, currentRoom, activeTab]);

    // Reset state when dialog closes
    const handleOpenChange = useCallback((open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setMedia([]);
            setActiveTab('all');
        }
    }, []);

    // Filter media by type
    const filteredMedia = activeTab === 'all'
        ? media
        : media.filter(m => m.type === activeTab);

    // Group media by type for counts
    const mediaCounts = {
        all: media.length,
        image: media.filter(m => m.type === 'image').length,
        video: media.filter(m => m.type === 'video').length,
        audio: media.filter(m => m.type === 'audio').length,
        file: media.filter(m => m.type === 'file').length,
    };

    return {
        isOpen,
        setIsOpen,
        handleOpenChange,
        activeTab,
        setActiveTab,
        media: filteredMedia,
        mediaCounts,
        isLoading,
        hasRoom: !!currentRoom,
    };
}

export default useMediaDialog;
