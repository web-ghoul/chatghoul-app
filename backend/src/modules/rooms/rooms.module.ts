import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Room, RoomSchema } from '../../schemas/room.schema';

import { Media, MediaSchema } from '../../schemas/media.schema'; // Add this import
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // Add this import

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Room.name, schema: RoomSchema },
            { name: Media.name, schema: MediaSchema }, // Register Media
        ]),
        CloudinaryModule, // Add this module
    ],
    controllers: [RoomsController],
    providers: [RoomsService],
    exports: [RoomsService],
})
export class RoomsModule { }
