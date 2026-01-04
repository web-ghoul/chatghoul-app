import { useState, type FormEvent, useCallback } from 'react';
import { useAuth } from './useAuth';

export function useLoginForm() {
    const { login, isLoading } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (!identifier.trim() || !password.trim()) return;
        await login({ identifier, password });
    }, [identifier, password, login]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const canSubmit = !isLoading && identifier.trim() && password.trim();

    return {
        identifier,
        setIdentifier,
        password,
        setPassword,
        showPassword,
        togglePasswordVisibility,
        handleSubmit,
        isLoading,
        canSubmit,
    };
}
