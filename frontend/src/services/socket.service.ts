import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../functions/cookies';
import { env } from '../functions/env';

const SOCKET_URL = env.SOCKET_URL;

class SocketService {
    private socket: Socket | null = null;
    private static instance: SocketService;

    private constructor() { }

    static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    connect(): Socket | null {
        const token = getAuthToken();

        if (!token) {
            console.warn('No auth token available for socket connection');
            return null;
        }

        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket?.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
        });

        return this.socket;
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    // Emit events
    emit(event: string, data?: unknown): void {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        }
    }

    // Join a room
    joinRoom(roomId: string): void {
        this.emit('join_room', roomId);
    }

    // Leave a room
    leaveRoom(roomId: string): void {
        this.emit('leave_room', roomId);
    }

    // Emit typing event
    emitTyping(roomId: string, isTyping: boolean): void {
        this.emit('typing', { roomId, isTyping });
    }
}

export const socketService = SocketService.getInstance();
export default socketService;
