import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useResetPasswordForm } from '../../hooks/useResetPasswordForm';

export default function ResetPasswordForm() {
    const {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        togglePasswordVisibility,
        passwordChecks,
        passwordsMatch,
        isFormValid,
        handleSubmit,
        isLoading,
    } = useResetPasswordForm();

    const PasswordCheck = ({ valid, text }: { valid: boolean; text: string }) => (
        <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${valid ? 'text-primary' : 'text-txt'}`}>
            {valid ? <Check size={14} className="animate-in zoom-in" /> : <X size={14} />}
            {text}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                    <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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

                {/* Password strength indicators */}
                {newPassword && (
                    <div className="mt-3 space-y-1.5 p-3.5 bg-secondary/50 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <PasswordCheck valid={passwordChecks.length} text="At least 8 characters" />
                        <PasswordCheck valid={passwordChecks.uppercase} text="One uppercase letter" />
                        <PasswordCheck valid={passwordChecks.lowercase} text="One lowercase letter" />
                        <PasswordCheck valid={passwordChecks.number} text="One number" />
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="bg-secondary border-gray text-white placeholder:text-txt"
                />
                {confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-destructive animate-in fade-in">Passwords do not match</p>
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
                        Resetting password...
                    </>
                ) : (
                    'Reset Password'
                )}
            </Button>
        </form>
    );
}
