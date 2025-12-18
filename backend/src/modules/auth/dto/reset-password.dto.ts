import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    identifier: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    otp: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string;
}
