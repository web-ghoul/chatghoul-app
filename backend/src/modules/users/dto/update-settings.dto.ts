import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
    @IsString()
    @IsOptional()
    theme?: string;

    @IsString()
    @IsOptional()
    chatWallpaper?: string;

    @IsBoolean()
    @IsOptional()
    enterIsSend?: boolean;

    @IsString()
    @IsOptional()
    avatarPrivacy?: 'everyone' | 'contacts' | 'nobody';

    @IsString()
    @IsOptional()
    aboutPrivacy?: 'everyone' | 'contacts' | 'nobody';
}
