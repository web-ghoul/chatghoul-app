import { useState, useEffect, type FormEvent, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { env } from '../functions/env';

export function useResetPasswordForm() {
    const { resetPassword, isLoading } = useAuth();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const identifier = sessionStorage.getItem('resetIdentifier');
    const otp = sessionStorage.getItem('verifiedOtp');

    useEffect(() => {
        if (!identifier || !otp) {
            navigate(env.routes.FORGOT_PASSWORD);
        }
    }, [identifier, otp, navigate]);

    const passwordChecks = useMemo(() => ({
        length: newPassword.length >= 8,
        uppercase: /[A-Z]/.test(newPassword),
        lowercase: /[a-z]/.test(newPassword),
        number: /\d/.test(newPassword),
    }), [newPassword]);

    const isPasswordStrong = passwordChecks.length;
    const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
    const isFormValid = isPasswordStrong && passwordsMatch;

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (!isFormValid || !identifier || !otp) return;
        await resetPassword({ identifier, otp, newPassword });
    }, [isFormValid, identifier, otp, newPassword, resetPassword]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    return {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        togglePasswordVisibility,
        passwordChecks,
        isPasswordStrong,
        passwordsMatch,
        isFormValid,
        handleSubmit,
        isLoading,
        identifier,
        otp,
    };
}
