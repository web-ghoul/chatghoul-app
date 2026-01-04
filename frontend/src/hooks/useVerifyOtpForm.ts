import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent, type ClipboardEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { env } from '../lib/env';

const OTP_LENGTH = 6;

export function useVerifyOtpForm() {
    const { verifyOtp, isLoading } = useAuth();
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const identifier = sessionStorage.getItem('resetIdentifier');

    useEffect(() => {
        if (!identifier) {
            navigate(env.routes.FORGOT_PASSWORD);
        }
    }, [identifier, navigate]);

    const submitOtp = useCallback(async (otpValue: string) => {
        if (otpValue.length !== OTP_LENGTH || !identifier) return;
        await verifyOtp({ identifier, otp: otpValue });
    }, [identifier, verifyOtp]);

    const handleChange = useCallback((index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }

        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newOtp.every((digit) => digit) && newOtp.join('').length === OTP_LENGTH) {
            submitOtp(newOtp.join(''));
        }
    }, [otp, submitOtp]);

    const handleKeyDown = useCallback((index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }, [otp]);

    const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
            inputRefs.current[nextIndex]?.focus();

            if (pastedData.length === OTP_LENGTH) {
                submitOtp(pastedData);
            }
        }
    }, [otp, submitOtp]);

    const handleSubmit = useCallback(async (e?: FormEvent) => {
        e?.preventDefault();
        await submitOtp(otp.join(''));
    }, [otp, submitOtp]);

    const handleResend = useCallback(() => {
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        navigate(env.routes.FORGOT_PASSWORD);
    }, [navigate]);

    return {
        otp,
        inputRefs,
        identifier,
        isLoading,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleSubmit,
        handleResend,
        isComplete: otp.join('').length === OTP_LENGTH,
    };
}
