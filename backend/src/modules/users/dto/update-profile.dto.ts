import { IsEmail, IsOptional, IsString, IsPhoneNumber, Matches } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString() // Typically phone validators are strict, but IsString with regex or simpler check is often used.
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    about?: string;

    @IsString()
    @IsOptional()
    avatar?: string;
}
