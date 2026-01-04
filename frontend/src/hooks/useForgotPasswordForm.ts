import { useState, type FormEvent, useCallback } from 'react';
import { useAuth } from './useAuth';

export function useForgotPasswordForm() {
    const { forgotPassword, isLoading } = useAuth();
    const [identifier, setIdentifier] = useState('');

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        const trimmedIdentifier = identifier.trim();
        if (!trimmedIdentifier) return;
        await forgotPassword({ identifier: trimmedIdentifier });
    }, [identifier, forgotPassword]);

    const canSubmit = !isLoading && identifier.trim().length > 0;

    return {
        identifier,
        setIdentifier,
        handleSubmit,
        isLoading,
        canSubmit,
    };
}
