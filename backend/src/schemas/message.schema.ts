import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
    room: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: Types.ObjectId;

    @Prop({ default: null })
    message: string;

    @Prop({
        required: true,
        enum: ['text', 'image', 'video', 'audio', 'file'],
        default: 'text',
    })
    type: string;

    @Prop({ default: null })
    mediaUrl: string;

    @Prop({ default: null })
    fileName: string; // Useful for files

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    readBy: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    deliveredTo: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    starredBy: Types.ObjectId[];

    @Prop({ default: false })
    isPinned: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ room: 1, createdAt: -1 });
