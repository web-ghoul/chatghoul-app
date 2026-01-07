import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateRoomDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsObject()
    @IsOptional()
    permissions?: {
        sendMessages?: 'everyone' | 'admins';
        editSettings?: 'everyone' | 'admins';
        addMembers?: 'everyone' | 'admins';
    };
}
