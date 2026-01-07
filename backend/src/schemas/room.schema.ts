import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Message } from './message.schema';

export type RoomDocument = Room & Document;

@Schema()
class RoomPermissions {
    @Prop({ enum: ['everyone', 'admins'], default: 'everyone' })
    sendMessages: string;

    @Prop({ enum: ['everyone', 'admins'], default: 'admins' })
    editSettings: string;

    @Prop({ enum: ['everyone', 'admins'], default: 'admins' })
    addMembers: string;
}

@Schema()
class PinnedMessage {
    @Prop({ type: Types.ObjectId, ref: 'Message', required: true })
    message: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    pinnedBy: Types.ObjectId;

    @Prop({ type: Date })
    expiresAt: Date;
}

@Schema({ timestamps: true })
export class Room {
    @Prop({ required: true, enum: ['private', 'group'], default: 'private' })
    type: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
    participants: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;

    // Group specific fields
    @Prop({ type: Types.ObjectId, ref: 'User' })
    superAdmin: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    admins: Types.ObjectId[];

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    image: string;

    @Prop({ type: RoomPermissions, default: () => ({}) })
    permissions: RoomPermissions;

    @Prop({ type: Types.ObjectId, ref: 'Message' })
    lastMessage: Types.ObjectId;

    @Prop({ type: Map, of: Number, default: {} })
    unreadCounts: Map<string, number>;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    pinnedBy: Types.ObjectId[];

    @Prop({ type: [PinnedMessage], default: [] })
    pinnedMessages: PinnedMessage[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.index({ participants: 1 });
RoomSchema.index({ type: 1 });
