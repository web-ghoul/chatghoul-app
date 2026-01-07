import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
    @IsString()
    @IsOptional()
    message?: string;

    @IsEnum(['text', 'image', 'video', 'audio', 'file'])
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsOptional()
    mediaUrl?: string;

    @IsString()
    @IsOptional()
    fileName?: string;
}
