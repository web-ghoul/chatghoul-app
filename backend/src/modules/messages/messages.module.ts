import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Message, MessageSchema } from '../../schemas/message.schema';
import { Room, RoomSchema } from '../../schemas/room.schema';
import { Media, MediaSchema } from '../../schemas/media.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
            { name: Room.name, schema: RoomSchema },
            { name: Media.name, schema: MediaSchema },
        ]),
    ],
    controllers: [MessagesController],
    providers: [MessagesService],
    exports: [MessagesService],
})
export class MessagesModule { }
