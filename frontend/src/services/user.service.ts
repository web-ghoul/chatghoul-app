import { ApiService } from './api.service';
import type { User } from '../types/app.d';

export interface UpdateProfilePayload {
    name?: string;
    about?: string;
    avatar?: string;
    phone?: string;
    email?: string;
}

export interface UpdateSettingsPayload {
    theme?: string;
    chatWallpaper?: string;
    enterIsSend?: boolean;
    avatarPrivacy?: 'everyone' | 'contacts' | 'nobody';
    aboutPrivacy?: 'everyone' | 'contacts' | 'nobody';
    messageNotifications?: boolean;
    showPreviews?: boolean;
    reactionNotifications?: boolean;
    sounds?: boolean;
}

class UserService extends ApiService {
    // Get current user profile
    public async getMe(): Promise<User> {
        return this.get<User>('/users/me');
    }

    // Search users
    public async searchUsers(query: string): Promise<User[]> {
        return this.get<User[]>(`/users/search?q=${query}`);
    }

    // Get my media
    public async getMyMedia(type: string): Promise<any> {
        return this.get(`/users/me/media?type=${type}`);
    }

    // Update profile (name, about, avatar string reset)
    public async updateProfile(payload: UpdateProfilePayload): Promise<User> {
        return this.patch<User>('/users/me', payload);
    }

    // Upload avatar
    public async updateAvatar(file: File): Promise<User> {
        const formData = new FormData();
        formData.append('avatar', file);
        return this.patch<User>('/users/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    // Update settings
    public async updateSettings(payload: UpdateSettingsPayload): Promise<User> {
        return this.patch<User>('/users/me/settings', payload);
    }

    // Block user
    public async blockUser(userId: string): Promise<any> {
        return this.patch(`/users/${userId}/block`);
    }

    // Unblock user
    public async unblockUser(userId: string): Promise<any> {
        return this.patch(`/users/${userId}/unblock`);
    }

    // Report user
    public async reportUser(userId: string): Promise<any> {
        return this.patch(`/users/${userId}/report`);
    }
}

export const userService = new UserService();
export default userService;
