import { useEffect, useState, useMemo, useCallback } from "react";
import { useChatsStore } from "../globals/useChatsStore";
import roomService from "../services/room.service";

export function useRoomsList() {
    const rooms = useChatsStore((state) => state.rooms);
    const setRooms = useChatsStore((state) => state.setRooms);
    const isLoadingRooms = useChatsStore((state) => state.isLoadingRooms);
    const setLoadingRooms = useChatsStore((state) => state.setLoadingRooms);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchRooms = useCallback(async () => {
        setLoadingRooms(true);
        try {
            const data = await roomService.getRooms();
            setRooms(data);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        } finally {
            setLoadingRooms(false);
        }
    }, [setRooms, setLoadingRooms]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            if (room.name?.toLowerCase().includes(query)) return true;
            return room.participants.some((p) =>
                p.name?.toLowerCase().includes(query)
            );
        });
    }, [rooms, searchQuery]);

    return {
        rooms: filteredRooms,
        searchQuery,
        setSearchQuery,
        isLoadingRooms,
        refreshRooms: fetchRooms,
    };
}
