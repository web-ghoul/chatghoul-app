import { axiosInstance } from '../api/axiosInstance';
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

const userService = {
    // Search users
    searchUsers: async (query: string) => {
        const response = await axiosInstance.get<User[]>(`/users/search?q=${query}`);
        return response.data;
    },

    // Get my media
    getMyMedia: async (type: string) => {
        const response = await axiosInstance.get(`/users/me/media?type=${type}`);
        return response.data;
    },

    // Update profile (name, about, avatar string reset)
    updateProfile: async (payload: UpdateProfilePayload) => {
        const response = await axiosInstance.patch<User>('/users/me', payload);
        return response.data;
    },

    // Upload avatar
    updateAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await axiosInstance.patch<User>('/users/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Update settings
    updateSettings: async (payload: UpdateSettingsPayload) => {
        // Backend key is 'settings' but we pass payload. Wait, controller takes UpdateSettingsDto.
        // Let's check backend DTO structure. Assuming it takes partial settings object.
        const response = await axiosInstance.patch<User>('/users/me/settings', payload);
        return response.data;
    },

    // Block user
    blockUser: async (userId: string) => {
        const response = await axiosInstance.patch(`/users/${userId}/block`);
        return response.data;
    },

    // Unblock user
    unblockUser: async (userId: string) => {
        const response = await axiosInstance.patch(`/users/${userId}/unblock`);
        return response.data;
    },
};

export default userService;
