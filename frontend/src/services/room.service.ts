import { ApiService } from './api.service';
import type { Room, CreateRoomPayload, Media } from '../types/app.d';

class RoomService extends ApiService {
    public async getRooms(): Promise<Room[]> {
        return this.get<Room[]>('/rooms');
    }

    public async getRoom(roomId: string): Promise<Room> {
        return this.get<Room>(`/rooms/${roomId}`);
    }

    public async createRoom(payload: CreateRoomPayload): Promise<Room> {
        return this.post<Room>('/rooms', payload);
    }

    public async togglePin(roomId: string): Promise<{ pinned: boolean }> {
        return this.patch<{ pinned: boolean }>(`/rooms/${roomId}/pin`);
    }

    public async getRoomMedia(roomId: string, type?: string): Promise<Media[]> {
        const params = type ? { type } : {};
        return this.get<Media[]>(`/rooms/${roomId}/media`, { params });
    }

    public async uploadFile(roomId: string, file: File): Promise<{
        url: string;
        fileName: string;
        size: number;
        mimetype: string;
        type: string;
    }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.post(`/rooms/${roomId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    public async pinMessage(roomId: string, messageId: string, durationSeconds?: number): Promise<Room> {
        return this.post<Room>(
            `/rooms/${roomId}/messages/${messageId}/pin`,
            { durationSeconds }
        );
    }

    public async unpinMessage(roomId: string, messageId: string): Promise<Room> {
        return this.delete<Room>(
            `/rooms/${roomId}/messages/${messageId}/pin`
        );
    }

    public async changeSuperAdmin(roomId: string, newSuperAdminId: string): Promise<Room> {
        return this.patch<Room>(
            `/rooms/${roomId}/super-admin`,
            { newSuperAdminId }
        );
    }

    public async deleteRoom(roomId: string): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/rooms/${roomId}`);
    }
}

export const roomService = new RoomService();
export default roomService;
