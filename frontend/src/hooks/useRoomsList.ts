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
    const { user } = (
      await import("../globals/useAuthStore")
    ).useAuthStore.getState();
    if (!user) return;

    setLoadingRooms(true);
    try {
      const data = await roomService.getRooms();
      setRooms(data);

      // Catch-up: Mark any room with unread messages as delivered
      data.forEach(async (room: any) => {
        const unreadCount = room.unreadCounts?.[user._id] || 0;
        if (unreadCount > 0) {
          try {
            const { default: messageService } =
              await import("../services/message.service");
            await messageService.markAsDelivered(room._id);
          } catch (err) {
            console.error(`Failed to mark room ${room._id} as delivered:`, err);
          }
        }
      });
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
        p.name?.toLowerCase().includes(query),
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
