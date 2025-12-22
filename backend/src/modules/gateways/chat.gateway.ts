import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('ChatGateway');
    private userSockets: Map<string, Set<string>> = new Map();

    constructor(private readonly jwtService: JwtService) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.query.token;
            if (!token) {
                this.logger.warn(`Client connected without token: ${client.id}`);
                return;
            }

            const payload = this.jwtService.verify(token);
            const userId = payload.sub;

            let sockets = this.userSockets.get(userId);
            if (!sockets) {
                sockets = new Set();
                this.userSockets.set(userId, sockets);
            }
            sockets.add(client.id);
            client.data.userId = userId;

            this.logger.log(`User ${userId} connected with socket ${client.id}`);
        } catch (error) {
            this.logger.error(`Error during connection for client ${client.id}: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const userId = client.data.userId;
        const sockets = this.userSockets.get(userId);
        if (userId && sockets) {
            sockets.delete(client.id);
            if (sockets.size === 0) {
                this.userSockets.delete(userId);
            }
        }
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    forceLogout(userId: string) {
        const socketIds = this.userSockets.get(userId);
        if (socketIds && this.server) {
            this.logger.log(`Forcing logout for user ${userId} on ${socketIds.size} sockets`);
            socketIds.forEach(socketId => {
                const socket = this.server.sockets.sockets.get(socketId);
                if (socket) {
                    socket.emit('force_logout', { message: 'Logged in from another device' });
                    socket.disconnect();
                }
            });
            this.userSockets.delete(userId);
        }
    }

    @SubscribeMessage('join_room')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string,
    ) {
        client.join(roomId);
        this.logger.log(`Client ${client.id} joined room ${roomId}`);
        client.emit('room_joined', roomId);
    }

    @SubscribeMessage('leave_room')
    handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string,
    ) {
        client.leave(roomId);
        this.logger.log(`Client ${client.id} left room ${roomId}`);
    }

    // Helper method to emit events from services
    emitToRoom(roomId: string, event: string, data: any) {
        this.server.to(roomId).emit(event, data);
    }

    emitToUser(userId: string, event: string, data: any) {
        const socketIds = this.userSockets.get(userId);
        if (socketIds && this.server) {
            socketIds.forEach(socketId => {
                this.server.to(socketId).emit(event, data);
            });
        }
    }
}
