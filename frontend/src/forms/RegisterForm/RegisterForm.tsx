import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useRegisterForm } from '../../hooks/useRegisterForm';

export default function RegisterForm() {
    const {
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
    } = useRegisterForm();

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    autoComplete="name"
                    className="bg-secondary border-gray text-white placeholder:text-txt"
                />
                {errors.name && (
                    <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{errors.name}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                    className="bg-secondary border-gray text-white placeholder:text-txt"
                />
                {errors.email && (
                    <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{errors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">
                    Phone <span className="text-txt text-xs">(optional)</span>
                </Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    autoComplete="tel"
                    className="bg-secondary border-gray text-white placeholder:text-txt"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password (min 8 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        autoComplete="new-password"
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
                {errors.password && (
                    <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{errors.password}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="bg-secondary border-gray text-white placeholder:text-txt"
                />
                {errors.confirmPassword && (
                    <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{errors.confirmPassword}</p>
                )}
            </div>

            <Button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-md shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Creating account...
                    </>
                ) : (
                    'Create Account'
                )}
            </Button>
        </form>
    );
}
