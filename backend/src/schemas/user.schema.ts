import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: null })
    avatar: string;

    @Prop({ default: null })
    about: string;

    @Prop({ unique: true, sparse: true })
    phone: string;

    @Prop({ default: 'offline', enum: ['online', 'offline', 'away'] })
    status: string;

    @Prop({ default: Date.now })
    lastSeen: Date;

    @Prop({ default: false })
    isBlocked: boolean;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ default: [] })
    blockedUsers: string[];

    @Prop({ default: [] })
    contacts: string[];

    @Prop({
        type: {
            theme: { type: String, default: 'light' },
            chatWallpaper: { type: String, default: null },
            enterIsSend: { type: Boolean, default: true },
        },
        default: () => ({ theme: 'light', chatWallpaper: null, enterIsSend: true }),
    })
    settings: {
        theme: string;
        chatWallpaper: string;
        enterIsSend: boolean;
    };

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ status: 1 });
