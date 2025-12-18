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
}
