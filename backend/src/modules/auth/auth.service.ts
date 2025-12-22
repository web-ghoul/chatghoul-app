import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { User, UserDocument } from '../../schemas/user.schema';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChatGateway } from '../gateways/chat.gateway';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private mailService: MailService,
        @Inject(CACHE_MANAGER) private cacheManager: any,
        private chatGateway: ChatGateway,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, phone, password } = registerDto;

        const existingUser = await this.userModel.findOne({
            $or: [{ email }, { phone }],
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new ConflictException('Email already in use');
            }
            if (existingUser.phone === phone) {
                throw new ConflictException('Phone number already in use');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userModel.create({
            ...registerDto,
            password: hashedPassword,
        });

        // Send welcome email (async, don't await blocking)
        this.mailService.sendWelcomeEmail({ name: user.name, email: user.email });

        const token = this.generateToken(user);

        return {
            message: 'Registration successful',
            user: this.sanitizeUser(user),
            token,
        };
    }

    async login(loginDto: LoginDto) {
        const { identifier, password } = loginDto;

        const user = await this.userModel.findOne({
            $or: [{ email: identifier }, { phone: identifier }],
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.isBlocked) {
            throw new UnauthorizedException('Account is blocked');
        }

        if (user.isDeleted) {
            throw new UnauthorizedException('Account is deleted');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Force logout from other devices
        this.chatGateway.forceLogout(user._id.toString());

        // Update status to online
        user.status = 'online';
        await user.save();

        const token = this.generateToken(user);

        return {
            message: 'Login successful',
            user: this.sanitizeUser(user),
            token,
        };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const { identifier } = forgotPasswordDto;

        const user = await this.userModel.findOne({
            $or: [{ email: identifier }, { phone: identifier }],
        });

        if (!user) {
            // Don't reveal user existence
            return {
                message: 'If an account exists, an OTP has been sent.',
            };
        }

        const otp = this.generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Store in cache: key=identifier, value={otp, attempts}, ttl=10 mins (600s)
        await this.cacheManager.set(
            `otp:${identifier}`,
            { hash: hashedOtp, attempts: 0 },
            600 * 1000,
        );

        // Send OTP email
        await this.mailService.sendOtpEmail(user.email, otp);

        return {
            message: 'OTP sent successfully',
            expiresIn: '10 minutes',
        };
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        const { identifier, otp } = verifyOtpDto;

        await this.validateOtp(identifier, otp);

        return {
            valid: true,
            message: 'OTP verified successfully',
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { identifier, otp, newPassword } = resetPasswordDto;

        await this.validateOtp(identifier, otp);

        const user = await this.userModel.findOne({
            $or: [{ email: identifier }, { phone: identifier }],
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Clear OTP from cache
        await this.cacheManager.del(`otp:${identifier}`);

        // Send confirmation
        this.mailService.sendPasswordResetConfirmation(user.email);

        return {
            message: 'Password reset successfully',
        };
    }

    // --- Helpers ---

    private async validateOtp(identifier: string, otp: string) {
        const cacheKey = `otp:${identifier}`;
        const cachedData = await this.cacheManager.get(cacheKey);

        if (!cachedData) {
            throw new BadRequestException('OTP expired or invalid');
        }

        if (cachedData.attempts >= 5) {
            await this.cacheManager.del(cacheKey); // Clear it to force new OTP flow
            throw new BadRequestException('Too many failed attempts. Please request a new OTP.');
        }

        const isValid = await bcrypt.compare(otp, cachedData.hash);

        if (!isValid) {
            // Increment attempts
            await this.cacheManager.set(
                cacheKey,
                { ...cachedData, attempts: cachedData.attempts + 1 },
                600 * 1000, // Reset TTL to original window or keep remaining? 
                // Cache manager implementation usually resets TTL on set. 
                // For simplicity reusing 10 min, but ideally keeps remaining time.
            );
            throw new BadRequestException('Invalid OTP');
        }

        return true;
    }

    private generateToken(user: UserDocument) {
        const payload = { sub: user._id, email: user.email };
        return this.jwtService.sign(payload);
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private sanitizeUser(user: UserDocument) {
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }
}
