import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsEnum(['text', 'image', 'video', 'audio', 'file'])
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsOptional()
    mediaUrl?: string; // Optional if type is text

    @IsString()
    @IsOptional()
    fileName?: string;
}
