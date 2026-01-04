// @ts-nocheck
// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Room, RoomDocument } from '../../schemas/room.schema';
import { Message, MessageDocument } from '../../schemas/message.schema';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

@Injectable()
export class SeedsService {
    private readonly logger = new Logger(SeedsService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    ) { }

    async reset() {
        this.logger.log('Resetting database...');
        await this.messageModel.deleteMany({});
        await this.roomModel.deleteMany({});
        await this.userModel.deleteMany({});
        this.logger.log('Database cleared.');
        return { message: 'Database cleared' };
    }

    async run() {
        this.logger.log('Starting seed...');
        await this.reset();

        // 1. Create Users
        const users = await this.seedUsers(10);
        this.logger.log(`Created ${users.length} users.`);

        // 2. Create Rooms
        const rooms = await this.seedRooms(users);
        this.logger.log(`Created ${rooms.length} rooms.`);

        // 3. Create Messages
        await this.seedMessages(users, rooms);
        this.logger.log('Seeding complete.');

        return { message: 'Seeding complete' };
    }

    private async seedUsers(count: number): Promise<UserDocument[]> {
        const passwordHash = await bcrypt.hash('password123', 10);
        const usersData = [];

        // Create one main test user
        usersData.push({
            name: 'Test User',
            email: 'test@example.com',
            password: passwordHash,
            avatar: faker.image.avatar(),
            about: 'I am a test user.',
            status: 'online',
        });

        for (let i = 0; i < count - 1; i++) {
            usersData.push({
                name: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                password: passwordHash,
                avatar: faker.image.avatar(),
                about: faker.lorem.sentence(),
                status: faker.helpers.arrayElement(['online', 'offline', 'away']),
            });
        }

        return this.userModel.create(usersData);
    }

    private async seedRooms(users: UserDocument[]): Promise<RoomDocument[]> {
        const roomsData = [];
        const mainUser = users[0];

        // Create Private Chats (everyone chats with mainUser)
        for (let i = 1; i < users.length; i++) {
            const peer = users[i];
            roomsData.push({
                type: 'private',
                participants: [mainUser._id, peer._id],
                createdBy: mainUser._id,
                unreadCounts: (() => {
                    const map = new Map<string, number>();
                    map.set(mainUser._id.toString(), 0);
                    map.set(peer._id.toString(), 0);
                    return map;
                })(),
            });
        }

        // Create 2 Group Chats
        const groupParticipants1 = users.slice(0, 5).map(u => u._id);
        roomsData.push({
            type: 'group',
            name: 'Dev Team',
            description: 'Discussion about development',
            image: faker.image.urlLoremFlickr({ category: 'tech' }),
            participants: groupParticipants1,
            createdBy: mainUser._id,
            admins: [mainUser._id],
            unreadCounts: (() => {
                const map = new Map<string, number>();
                groupParticipants1.forEach(id => map.set(id.toString(), 0));
                return map;
            })(),
        });

        const groupParticipants2 = users.slice(4, 9).map(u => u._id);
        roomsData.push({
            type: 'group',
            name: 'General',
            image: faker.image.urlLoremFlickr({ category: 'abstract' }),
            participants: groupParticipants2,
            createdBy: users[4]._id,
            admins: [users[4]._id],
            unreadCounts: (() => {
                const map = new Map<string, number>();
                groupParticipants2.forEach(id => map.set(id.toString(), 0));
                return map;
            })(),
        });

        return this.roomModel.create(roomsData);
    }

    private async seedMessages(users: UserDocument[], rooms: RoomDocument[]) {
        for (const room of rooms) {
            const messageCount = faker.number.int({ min: 10, max: 30 });
            let lastMessageId: Types.ObjectId | null = null;
            let lastMessageTime = new Date();
            lastMessageTime.setDate(lastMessageTime.getDate() - 2); // Start 2 days ago

            // Determine participants for this room to pick valid senders
            // Need to fetch or rely on what's in 'room' object.
            // room.participants is array of ObjectIds.
            const participantIds = room.participants.map(p => p.toString());

            for (let i = 0; i < messageCount; i++) {
                // Advance time by random minutes
                lastMessageTime = new Date(lastMessageTime.getTime() + faker.number.int({ min: 1, max: 120 }) * 60000);

                // Pick random sender from participants
                const senderId = faker.helpers.arrayElement(participantIds);

                const message = await this.messageModel.create({
                    room: room._id,
                    sender: new Types.ObjectId(senderId), // Explicitly cast to ObjectId
                    message: faker.lorem.sentence(),
                    type: 'text',
                    readBy: [], // Simple logic: unread for now, or randomize
                    createdAt: lastMessageTime,
                } as any);
                lastMessageId = (message as any)._id;
            }

            // Update room with last message
            if (lastMessageId) {
                room.lastMessage = lastMessageId;
                await room.save();
            }
        }
    }
}
