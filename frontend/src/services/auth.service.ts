import { ApiService } from './api.service';
import type {
    AuthResponse,
    RegisterPayload,
    LoginPayload,
    ForgotPasswordPayload,
    VerifyOtpPayload,
    ResetPasswordPayload,
    OtpResponse,
    VerifyOtpResponse,
    MessageResponse,
} from '../types/app.d';

class AuthService extends ApiService {
    public async register(payload: RegisterPayload): Promise<AuthResponse> {
        return this.post<AuthResponse>('/auth/register', payload);
    }

    public async login(payload: LoginPayload): Promise<AuthResponse> {
        return this.post<AuthResponse>('/auth/login', payload);
    }

    public async forgotPassword(payload: ForgotPasswordPayload): Promise<OtpResponse> {
        return this.post<OtpResponse>('/auth/forgot-password', payload);
    }

    public async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
        return this.post<VerifyOtpResponse>('/auth/verify-otp', payload);
    }

    public async resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
        return this.post<MessageResponse>('/auth/reset-password', payload);
    }
}

export const authService = new AuthService();
export default authService;
