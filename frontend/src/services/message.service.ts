import { ApiService } from './api.service';
import type { Message, SendMessagePayload } from '../types/app.d';

class MessageService extends ApiService {
    public async getMessages(roomId: string, page: number = 1): Promise<Message[]> {
        return this.get<Message[]>(
            `/rooms/${roomId}/messages`,
            { params: { page } }
        );
    }

    public async sendMessage(roomId: string, payload: SendMessagePayload): Promise<Message> {
        return this.post<Message>(
            `/rooms/${roomId}/messages`,
            payload
        );
    }

    public async toggleStar(messageId: string): Promise<{ starred: boolean }> {
        return this.patch<{ starred: boolean }>(
            `/messages/${messageId}/star`
        );
    }

    public async getStarredMessages(page: number = 1): Promise<Message[]> {
        return this.get<Message[]>(
            '/messages/starred',
            { params: { page } }
        );
    }

    public async markAsRead(roomId: string): Promise<{ success: boolean }> {
        return this.post<{ success: boolean }>(
            `/rooms/${roomId}/messages/mark-read`
        );
    }

    public async markAsDelivered(roomId: string): Promise<{ success: boolean }> {
        return this.post<{ success: boolean }>(
            `/rooms/${roomId}/messages/mark-delivered`
        );
    }

    public async deleteMessage(messageId: string): Promise<{ success: boolean }> {
        return this.delete<{ success: boolean }>(
            `/messages/${messageId}`
        );
    }
}

export const messageService = new MessageService();
export default messageService;
