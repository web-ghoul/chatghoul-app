import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Room } from './room.schema';
import { Message } from './message.schema';

export type MediaDocument = Media & Document;

@Schema({ timestamps: true })
export class Media {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    uploader: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
    room: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Message', required: true })
    message: Types.ObjectId;

    @Prop({
        required: true,
        enum: ['image', 'video', 'audio', 'file'],
    })
    type: string;

    @Prop({ required: true })
    url: string;

    @Prop({ default: null })
    publicId: string; // Cloudinary Public ID

    @Prop({ default: null })
    fileName: string;

    @Prop({ default: null })
    mimetype: string;

    @Prop({ default: 0 })
    size: number; // in bytes
}

export const MediaSchema = SchemaFactory.createForClass(Media);

MediaSchema.index({ room: 1, type: 1, createdAt: -1 });
MediaSchema.index({ uploader: 1, type: 1, createdAt: -1 });
