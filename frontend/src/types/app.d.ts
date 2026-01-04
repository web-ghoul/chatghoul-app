// User types
export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    status: 'online' | 'offline';
    about?: string;
    lastSeen?: string;
    createdAt: string;
    updatedAt: string;
    settings?: {
        theme?: string;
        chatWallpaper?: string;
        enterIsSend?: boolean;
        avatarPrivacy?: 'everyone' | 'contacts' | 'nobody';
        aboutPrivacy?: 'everyone' | 'contacts' | 'nobody';
    };
}

// Room types
export interface Room {
    _id: string;
    type: 'private' | 'group';
    participants: User[];
    createdBy: string;
    superAdmin?: string;
    admins?: string[];
    name?: string;
    description?: string;
    image?: string;
    lastMessage?: Message;
    unreadCounts: Record<string, number>;
    pinnedBy: string[];
    createdAt: string;
    updatedAt: string;
}

// Message types
export interface Message {
    _id: string;
    room: string | Room;
    sender: User;
    message: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'file';
    mediaUrl?: string;
    fileName?: string;
    readBy: string[];
    deliveredTo: string[];
    starredBy: string[];
    createdAt: string;
    updatedAt: string;
}

// Media types
export interface Media {
    _id: string;
    uploader: string;
    room: string;
    message: string;
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    fileName?: string;
    createdAt: string;
}

// Payload types
export interface CreateRoomPayload {
    type: 'private' | 'group';
    participants: string[];
    name?: string;
    description?: string;
}

export interface SendMessagePayload {
    message?: string;
    type?: 'text' | 'image' | 'video' | 'audio' | 'file';
    mediaUrl?: string;
    fileName?: string;
}

// Auth types
export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

export interface LoginPayload {
    identifier: string;
    password: string;
}

export interface ForgotPasswordPayload {
    identifier: string;
}

export interface VerifyOtpPayload {
    identifier: string;
    otp: string;
}

export interface ResetPasswordPayload {
    identifier: string;
    otp: string;
    newPassword: string;
}

export interface MessageResponse {
    message: string;
}

export interface OtpResponse {
    message: string;
    expiresIn?: string;
}

export interface VerifyOtpResponse {
    valid: boolean;
    message: string;
}

