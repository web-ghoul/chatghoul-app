import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useLoginForm } from '../../hooks/useLoginForm';
import { env } from '../../lib/env';

export default function LoginForm() {
    const {
        identifier,
        setIdentifier,
        password,
        setPassword,
        showPassword,
        togglePasswordVisibility,
        handleSubmit,
        isLoading,
        canSubmit,
    } = useLoginForm();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="identifier">Email or Phone</Label>
                <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter your email or phone"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={isLoading}
                    autoComplete="username"
                    className="bg-secondary border-gray text-white placeholder:text-txt"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        autoComplete="current-password"
                        className="bg-secondary border-gray text-white placeholder:text-txt pr-10"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-txt hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <div className="flex justify-end">
                <Link
                    to={env.routes.FORGOT_PASSWORD}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                    Forgot password?
                </Link>
            </div>

            <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-md shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </Button>
        </form>
    );
}
