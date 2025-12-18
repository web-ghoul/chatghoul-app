import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: this.configService.get<boolean>('SMTP_SECURE'),
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASSWORD'),
            },
        });
    }

    async sendWelcomeEmail(user: { name: string; email: string }) {
        await this.transporter.sendMail({
            from: this.configService.get<string>('EMAIL_FROM'),
            to: user.email,
            subject: 'Welcome to ChatGhoul!',
            text: `Hello ${user.name},\n\nWelcome to ChatGhoul! We are excited to have you on board.\n\nBest regards,\nThe ChatGhoul Team`,
        });
    }

    async sendOtpEmail(email: string, otp: string) {
        await this.transporter.sendMail({
            from: this.configService.get<string>('EMAIL_FROM'),
            to: email,
            subject: 'ChatGhoul Verification Code',
            text: `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, please ignore this email.`,
        });
    }

    async sendPasswordResetConfirmation(email: string) {
        await this.transporter.sendMail({
            from: this.configService.get<string>('EMAIL_FROM'),
            to: email,
            subject: 'Password Changed Successfully',
            text: `Your password has been changed successfully.\n\nIf you did not perform this action, please contact support immediately.`,
        });
    }
}
