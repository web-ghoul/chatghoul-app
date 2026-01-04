import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import authService from '../services/auth.service';
import { useAuthStore } from '../globals/useAuthStore';
import type {
    RegisterPayload,
    LoginPayload,
    ForgotPasswordPayload,
    VerifyOtpPayload,
    ResetPasswordPayload,
} from '../types/app.d';

interface UseAuthReturn {
    isLoading: boolean;
    error: string | null;
    login: (payload: LoginPayload) => Promise<boolean>;
    register: (payload: RegisterPayload) => Promise<boolean>;
    forgotPassword: (payload: ForgotPasswordPayload) => Promise<boolean>;
    verifyOtp: (payload: VerifyOtpPayload) => Promise<boolean>;
    resetPassword: (payload: ResetPasswordPayload) => Promise<boolean>;
    logout: () => void;
}

export function useAuth(): UseAuthReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setAuth, logout: storeLogout } = useAuthStore();

    const handleError = useCallback((err: unknown) => {
        const message =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            (err as Error)?.message ||
            'An unexpected error occurred';
        setError(message);
        toast.error(message);
        return false;
    }, []);

    const login = useCallback(
        async (payload: LoginPayload): Promise<boolean> => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await authService.login(payload);
                setAuth(response.user, response.token);
                toast.success(response.message || 'Login successful!');
                navigate('/');
                return true;
            } catch (err) {
                return handleError(err);
            } finally {
                setIsLoading(false);
            }
        },
        [setAuth, navigate, handleError]
    );

    const register = useCallback(
        async (payload: RegisterPayload): Promise<boolean> => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await authService.register(payload);
                setAuth(response.user, response.token);
                toast.success(response.message || 'Registration successful!');
                navigate('/');
                return true;
            } catch (err) {
                return handleError(err);
            } finally {
                setIsLoading(false);
            }
        },
        [setAuth, navigate, handleError]
    );

    const forgotPassword = useCallback(
        async (payload: ForgotPasswordPayload): Promise<boolean> => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await authService.forgotPassword(payload);
                toast.success(response.message || 'OTP sent successfully!');
                sessionStorage.setItem('resetIdentifier', payload.identifier);
                navigate('/verify-otp');
                return true;
            } catch (err) {
                return handleError(err);
            } finally {
                setIsLoading(false);
            }
        },
        [navigate, handleError]
    );

    const verifyOtp = useCallback(
        async (payload: VerifyOtpPayload): Promise<boolean> => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await authService.verifyOtp(payload);
                toast.success(response.message || 'OTP verified!');
                sessionStorage.setItem('verifiedOtp', payload.otp);
                navigate('/reset-password');
                return true;
            } catch (err) {
                return handleError(err);
            } finally {
                setIsLoading(false);
            }
        },
        [navigate, handleError]
    );

    const resetPassword = useCallback(
        async (payload: ResetPasswordPayload): Promise<boolean> => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await authService.resetPassword(payload);
                toast.success(response.message || 'Password reset successfully!');
                sessionStorage.removeItem('resetIdentifier');
                sessionStorage.removeItem('verifiedOtp');
                navigate('/login');
                return true;
            } catch (err) {
                return handleError(err);
            } finally {
                setIsLoading(false);
            }
        },
        [navigate, handleError]
    );

    const logout = useCallback(() => {
        storeLogout();
        toast.success('Logged out successfully');
        navigate('/login');
    }, [storeLogout, navigate]);

    return {
        isLoading,
        error,
        login,
        register,
        forgotPassword,
        verifyOtp,
        resetPassword,
        logout,
    };
}

export default useAuth;
