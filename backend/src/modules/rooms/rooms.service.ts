import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from '../../schemas/room.schema';
import { Message, MessageDocument } from '../../schemas/message.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { Media, MediaDocument } from '../../schemas/media.schema'; // Add this import
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Add this import
import { UsersService } from '../users/users.service';

@Injectable()
export class RoomsService {
    constructor(
        @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        @InjectModel(Media.name) private mediaModel: Model<MediaDocument>, // Inject MediaModel
        private readonly cloudinaryService: CloudinaryService, // Inject Service
        private readonly usersService: UsersService,
    ) { }

    async createRoom(createRoomDto: CreateRoomDto, creatorId: string) {
        const { type, participants } = createRoomDto;

        // Ensure creator is in participants
        const uniqueParticipants = Array.from(new Set([...participants, creatorId]));

        if (type === 'private') {
            if (uniqueParticipants.length !== 2) {
                throw new BadRequestException('Private chat must have exactly 2 participants');
            }

            // Check if private room already exists specific to these 2 users
            const existingRoom = await this.roomModel.findOne({
                type: 'private',
                participants: { $all: uniqueParticipants, $size: 2 },
            });

            if (existingRoom) {
                return existingRoom;
            }

            const newRoom = new this.roomModel({
                type: 'private',
                participants: uniqueParticipants,
                createdBy: creatorId,
            });

            return newRoom.save();
        } else {
            // Group Chat
            const newRoom = new this.roomModel({
                ...createRoomDto,
                participants: uniqueParticipants,
                createdBy: creatorId,
                superAdmin: creatorId,
                admins: [creatorId], // Creator is strictly an admin initially
            });

            return newRoom.save();
        }
    }

    async getUserRooms(userId: string) {
        const rooms = await this.roomModel
            .find({ participants: userId })
            .populate('participants', 'name avatar status about settings contacts')
            .populate('lastMessage')
            .sort({ updatedAt: -1 })
            .exec();

        rooms.forEach(room => {
            room.participants = room.participants.map(p => this.usersService.sanitizeUserProfile(p, userId)) as any;
        });

        return rooms.sort((a, b) => {
            const aPinned = a.pinnedBy.some(id => id.toString() === userId);
            const bPinned = b.pinnedBy.some(id => id.toString() === userId);
            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;
            return 0;
        });
    }

    async togglePin(roomId: string, userId: string) {
        const room = await this.roomModel.findById(roomId);
        if (!room) {
            throw new NotFoundException('Room not found');
        }

        if (!room.participants.some(id => id.toString() === userId)) {
            throw new ForbiddenException('You are not a participant in this room');
        }

        const userIdObj = new Types.ObjectId(userId);
        const index = room.pinnedBy.findIndex(id => id.equals(userIdObj));

        if (index === -1) {
            room.pinnedBy.push(userIdObj);
        } else {
            room.pinnedBy.splice(index, 1);
        }

        await room.save();
        return { pinned: index === -1 };
    }

    async getRoomById(roomId: string, userId: string) {
        const room = await this.roomModel.findById(roomId)
            .populate('participants', 'name avatar status lastSeen about phone email settings contacts')
            .populate('admins', 'name avatar about settings contacts')
            .populate('superAdmin', 'name avatar about settings contacts')
            .populate({
                path: 'pinnedMessages.message',
                populate: { path: 'sender', select: 'name avatar about settings contacts' }
            })
            .populate('pinnedMessages.pinnedBy', 'name avatar about settings contacts');

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        if (!room.participants.some(id => id['_id'] ? id['_id'].toString() === userId : id.toString() === userId)) {
            throw new ForbiddenException('You are not a participant in this room');
        }

        // Sanitize users in the room
        room.participants = room.participants.map(p => this.usersService.sanitizeUserProfile(p, userId)) as any;
        room.admins = room.admins.map(a => this.usersService.sanitizeUserProfile(a, userId)) as any;
        if (room.superAdmin) {
            room.superAdmin = this.usersService.sanitizeUserProfile(room.superAdmin, userId);
        }
        room.pinnedMessages.forEach(pm => {
            pm.pinnedBy = this.usersService.sanitizeUserProfile(pm.pinnedBy, userId);
            if (pm.message && pm.message['sender']) {
                pm.message['sender'] = this.usersService.sanitizeUserProfile(pm.message['sender'], userId);
            }
        });

        // Filter and cleanup expired messages
        const now = new Date();
        const activePins = room.pinnedMessages.filter(pm => !pm.expiresAt || pm.expiresAt > now);

        if (activePins.length !== room.pinnedMessages.length) {
            // Clean up in background if needed, but for now just return filtered
            room.pinnedMessages = activePins;
            await this.roomModel.updateOne(
                { _id: roomId },
                { $set: { pinnedMessages: activePins.map(pm => ({ ...pm, message: pm.message['_id'] || pm.message, pinnedBy: pm.pinnedBy['_id'] || pm.pinnedBy })) } }
            );
        }

        return room;
    }

    async pinMessage(roomId: string, messageId: string, userId: string, durationSeconds?: number) {
        const room = await this.roomModel.findById(roomId);
        if (!room) throw new NotFoundException('Room not found');

        if (!room.participants.some(id => id.toString() === userId)) {
            throw new ForbiddenException('You are not a participant in this room');
        }

        if (room.type === 'group') {
            const isAdmin = room.admins.some(id => id.toString() === userId) || room.superAdmin.toString() === userId;
            if (!isAdmin) {
                throw new ForbiddenException('Only admins can pin messages in this group');
            }
        }

        const message = await this.messageModel.findById(messageId);
        if (!message || message.room.toString() !== roomId) {
            throw new BadRequestException('Message does not belong to this room');
        }

        if (room.pinnedMessages.some(pm => pm.message.toString() === messageId)) {
            throw new BadRequestException('Message is already pinned');
        }

        const expiresAt = durationSeconds ? new Date(Date.now() + durationSeconds * 1000) : null;

        room.pinnedMessages.push({
            message: new Types.ObjectId(messageId),
            pinnedBy: new Types.ObjectId(userId),
            expiresAt,
        } as any);

        return room.save();
    }

    async unpinMessage(roomId: string, messageId: string, userId: string) {
        const room = await this.roomModel.findById(roomId);
        if (!room) throw new NotFoundException('Room not found');

        if (!room.participants.some(id => id.toString() === userId)) {
            throw new ForbiddenException('You are not a participant in this room');
        }

        if (room.type === 'group') {
            const isAdmin = room.admins.some(id => id.toString() === userId) || room.superAdmin.toString() === userId;
            if (!isAdmin) {
                throw new ForbiddenException('Only admins can unpin messages in this group');
            }
        }

        room.pinnedMessages = room.pinnedMessages.filter(pm => pm.message.toString() !== messageId) as any;

        return room.save();
    }

    async changeSuperAdmin(roomId: string, newSuperAdminId: string, currentUserId: string) {
        const room = await this.roomModel.findById(roomId);
        if (!room) {
            throw new NotFoundException('Room not found');
        }

        if (room.type !== 'group') {
            throw new BadRequestException('Cannot change admin of a private chat');
        }

        if (room.superAdmin.toString() !== currentUserId) {
            throw new ForbiddenException('Only the Super Admin can transfer ownership');
        }

        if (!room.participants.some(id => id.toString() === newSuperAdminId)) {
            throw new BadRequestException('New Super Admin must be a participant of the room');
        }

        room.superAdmin = new Types.ObjectId(newSuperAdminId);
        if (!room.admins.some(id => id.toString() === newSuperAdminId)) {
            room.admins.push(new Types.ObjectId(newSuperAdminId));
        }

        return room.save();
    }

    async getRoomMedia(roomId: string, userId: string, type?: string) {
        const room = await this.roomModel.findById(roomId);
        if (!room) {
            throw new NotFoundException('Room not found');
        }
        if (!room.participants.some(id => id.toString() === userId)) {
            throw new ForbiddenException('You are not a participant in this room');
        }

        const filter: any = { room: roomId };
        if (type) {
            filter.type = type;
        }
        return this.mediaModel.find(filter).sort({ createdAt: -1 }).populate('uploader', 'name avatar');
    }

    async uploadFile(roomId: string, userId: string, file: Express.Multer.File) {
        const room = await this.roomModel.findById(roomId);
        if (!room) {
            throw new NotFoundException('Room not found');
        }
        if (!room.participants.some(id => id.toString() === userId)) {
            throw new ForbiddenException('You are not a participant in this room');
        }

        let folderType = 'others';
        if (file.mimetype.startsWith('image/')) folderType = 'images';
        else if (file.mimetype.startsWith('video/')) folderType = 'videos';
        else if (file.mimetype.startsWith('audio/')) folderType = 'audios';

        const folder = `chatghoul/rooms/${roomId}/${folderType}`;

        const url = await this.cloudinaryService.uploadImage(file, folder);

        return {
            url,
            fileName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            type: folderType === 'others' ? 'file' : (folderType === 'images' ? 'image' : (folderType === 'videos' ? 'video' : 'audio'))
        };
    }
}
