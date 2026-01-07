import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Media, MediaDocument } from '../../schemas/media.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    async getMe(userId: string) {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async searchUsers(query: string, currentUserId: string) {
        if (!query) return [];

        const users = await this.userModel
            .find({
                $and: [
                    { _id: { $ne: currentUserId } }, // Exclude self
                    {
                        $or: [
                            { email: { $regex: query, $options: 'i' } },
                            { phone: { $regex: query, $options: 'i' } },
                            { name: { $regex: query, $options: 'i' } },
                        ],
                    },
                    { isDeleted: false },
                    { isBlocked: false },
                ],
            })
            .select('name email phone avatar about status lastSeen settings contacts')
            .limit(20);

        return users.map(user => this.sanitizeUserProfile(user, currentUserId));
    }

    public sanitizeUserProfile(user: any, requesterId: string): any {
        if (!user) return user;

        const userObj = user.toObject ? user.toObject() : user;
        const targetId = userObj._id.toString();

        // Don't sanitize if it's the user's own profile
        if (targetId === requesterId) return userObj;

        const settings = userObj.settings || {};
        const isContact = userObj.contacts?.some(id => id.toString() === requesterId);

        // Sanitize Avatar
        if (settings.avatarPrivacy === 'nobody' || (settings.avatarPrivacy === 'contacts' && !isContact)) {
            userObj.avatar = null;
        }

        // Sanitize About
        if (settings.aboutPrivacy === 'nobody' || (settings.aboutPrivacy === 'contacts' && !isContact)) {
            userObj.about = null;
        }

        // Remove sensitive fields that shouldn't be leaked during sanitization but might be in the object
        delete userObj.settings;
        delete userObj.contacts;
        delete userObj.blockedUsers;
        delete userObj.reportedUsers;
        delete userObj.password;

        return userObj;
    }

    async getUserMedia(userId: string, type?: string) {
        const filter: any = { uploader: userId };
        if (type) {
            filter.type = type;
        }
        return this.mediaModel.find(filter).sort({ createdAt: -1 }).populate('room', 'name type');
    }

    async updateProfile(userId: string, updateProfileDto: any) {
        const { email, phone } = updateProfileDto;
        const user = await this.userModel.findById(userId);

        if (!user) throw new NotFoundException('User not found');

        if (email && email !== user.email) {
            const existing = await this.userModel.findOne({ email });
            if (existing) throw new ConflictException('Email already in use');
        }

        if (phone && phone !== user.phone) {
            const existing = await this.userModel.findOne({ phone });
            if (existing) throw new ConflictException('Phone already in use');
        }

        return this.userModel.findByIdAndUpdate(userId, updateProfileDto, { new: true });
    }

    async updateSettings(userId: string, updateSettingsDto: any) {
        const updateData: any = {};
        for (const key in updateSettingsDto) {
            updateData[`settings.${key}`] = updateSettingsDto[key];
        }

        return this.userModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
    }

    async blockUser(userId: string, targetId: string) {
        if (userId === targetId) {
            throw new ConflictException('Cannot block yourself');
        }
        return this.userModel.findByIdAndUpdate(userId, {
            $addToSet: { blockedUsers: targetId }
        }, { new: true });
    }

    async unblockUser(userId: string, targetId: string) {
        return this.userModel.findByIdAndUpdate(userId, {
            $pull: { blockedUsers: targetId }
        }, { new: true });
    }

    async reportUser(userId: string, targetId: string) {
        if (userId === targetId) {
            throw new ConflictException('Cannot report yourself');
        }
        return this.userModel.findByIdAndUpdate(userId, {
            $addToSet: { reportedUsers: targetId }
        }, { new: true });
    }

    async updateAvatar(userId: string, file: Express.Multer.File) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        const folder = this.cloudinaryService.getUserFolder(userId, 'avatars');
        const avatarUrl = await this.cloudinaryService.uploadImage(file, folder);

        user.avatar = avatarUrl;
        return user.save();
    }
}
