import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from '../../schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';

import { Media, MediaDocument } from '../../schemas/media.schema'; // Add this import
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Add this import

@Injectable()
export class RoomsService {
    constructor(
        @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
        @InjectModel(Media.name) private mediaModel: Model<MediaDocument>, // Inject MediaModel
        private readonly cloudinaryService: CloudinaryService, // Inject Service
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
        return this.roomModel
            .find({ participants: userId })
            .populate('participants', 'name avatar status') // Adjusted fields
            .populate('lastMessage')
            .sort({ updatedAt: -1 });
    }

    async getRoomById(roomId: string, userId: string) {
        const room = await this.roomModel.findById(roomId)
            .populate('participants', 'name avatar status lastSeen about phone email')
            .populate('admins', 'name avatar')
            .populate('superAdmin', 'name avatar');

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        if (!room.participants.some(id => id.toString() === userId)) {
            throw new ForbiddenException('You are not a participant in this room');
        }

        return room;
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

        // Update super admin and ensure they are also in admins list
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

        // Determine folder based on file mimetype
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
