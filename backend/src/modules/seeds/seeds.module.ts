import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { Room, RoomSchema } from '../../schemas/room.schema';
import { Message, MessageSchema } from '../../schemas/message.schema';
import { SeedsController } from './seeds.controller';
import { SeedsService } from './seeds.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Room.name, schema: RoomSchema },
            { name: Message.name, schema: MessageSchema },
        ]),
    ],
    controllers: [SeedsController],
    providers: [SeedsService],
})
export class SeedsModule { }
