import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
    @IsEnum(['private', 'group'])
    @IsNotEmpty()
    type: string;

    @IsArray()
    @IsNotEmpty()
    participants: string[];

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    image?: string;
}
