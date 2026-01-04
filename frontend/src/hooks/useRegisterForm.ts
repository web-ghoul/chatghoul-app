import { useState, type FormEvent, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

export function useRegisterForm() {
    const { register, isLoading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const isValidEmail = useCallback((email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), []);

    const errors = useMemo(() => {
        const errs: Record<string, string> = {};
        if (name.trim() && name.trim().length < 2) {
            errs.name = "Name must be at least 2 characters";
        }
        if (email.trim() && !isValidEmail(email)) {
            errs.email = "Please enter a valid email";
        }
        if (password && password.length < 8) {
            errs.password = "Password must be at least 8 characters";
        }
        if (confirmPassword && password !== confirmPassword) {
            errs.confirmPassword = "Passwords do not match";
        }
        return errs;
    }, [name, email, password, confirmPassword, isValidEmail]);

    const isFormValid = useMemo(() =>
        name.trim().length >= 2 &&
        isValidEmail(email) &&
        password.length >= 8 &&
        password === confirmPassword,
        [name, email, password, confirmPassword, isValidEmail]);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        await register({
            name: name.trim(),
            email: email.trim(),
            password,
            phone: phone.trim() || undefined,
        });
    }, [isFormValid, name, email, password, phone, register]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    return {
        name,
        setName,
        email,
        setEmail,
        phone,
        setPhone,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        togglePasswordVisibility,
        handleSubmit,
        isLoading,
        isFormValid,
        errors,
        isValidEmail,
    };
}
