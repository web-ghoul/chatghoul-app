import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { RoomMessagesController } from './room-messages.controller';
import { MessagesService } from './messages.service';
import { Message, MessageSchema } from '../../schemas/message.schema';
import { Room, RoomSchema } from '../../schemas/room.schema';
import { Media, MediaSchema } from '../../schemas/media.schema';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
            { name: Room.name, schema: RoomSchema },
            { name: Media.name, schema: MediaSchema },
        ]),
        UsersModule,
    ],
    controllers: [MessagesController, RoomMessagesController],
    providers: [MessagesService],
    exports: [MessagesService],
})
export class MessagesModule { }
