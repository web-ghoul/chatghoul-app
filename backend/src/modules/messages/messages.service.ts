import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../../schemas/message.schema';
import { Room, RoomDocument } from '../../schemas/room.schema';
import { Media, MediaDocument } from '../../schemas/media.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatGateway } from '../gateways/chat.gateway';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
        @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
        private chatGateway: ChatGateway,
    ) { }

    async sendMessage(roomId: string, sendMessageDto: SendMessageDto, senderId: string) {
        const room = await this.roomModel.findById(roomId);
        if (!room) {
            throw new NotFoundException('Room not found');
        }

        if (!room.participants.some((id) => id.toString() === senderId)) {
            throw new ForbiddenException('You are not a participant in this room');
        }

        if (room.type === 'group' && room.permissions?.sendMessages === 'admins') {
            const isAdmin = room.admins.some(id => id.toString() === senderId) || room.superAdmin.toString() === senderId;
            if (!isAdmin) {
                throw new ForbiddenException('Only admins can send messages in this group');
            }
        }

        const newMessage = await this.messageModel.create({
            room: roomId,
            sender: senderId,
            ...sendMessageDto,
            readBy: [],
            deliveredTo: [],
        });

        if (sendMessageDto.type !== 'text' && sendMessageDto.mediaUrl) {
            await this.mediaModel.create({
                uploader: senderId,
                room: roomId,
                message: newMessage._id,
                type: sendMessageDto.type,
                url: sendMessageDto.mediaUrl,
                fileName: sendMessageDto.fileName,
            });
        }

        await this.roomModel.findByIdAndUpdate(roomId, {
            lastMessage: newMessage._id,
            updatedAt: new Date(),
            $inc: { [`unreadCounts.${senderId}`]: 0 },
        });
        room.participants.forEach(pId => {
            if (pId.toString() !== senderId) {
                const current = room.unreadCounts.get(pId.toString()) || 0;
                room.unreadCounts.set(pId.toString(), current + 1);
            }
        });
        room.markModified('unreadCounts');
        room.lastMessage = newMessage._id as any;
        await room.save();

        const populatedMessage = await newMessage.populate('sender', 'name avatar');

        this.chatGateway.emitToRoom(roomId, 'new_message', populatedMessage);

        return populatedMessage;
    }

    async getMessages(roomId: string, userId: string, page: number = 1, limit: number = 50) {
        const room = await this.roomModel.findById(roomId);
        if (!room) {
            throw new NotFoundException('Room not found');
        }
        if (!room.participants.some(id => id.toString() === userId)) {
            throw new ForbiddenException('Access denied');
        }

        const messages = await this.messageModel
            .find({ room: roomId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('sender', 'name avatar')
            .exec();

        return messages.reverse();
    }
}
