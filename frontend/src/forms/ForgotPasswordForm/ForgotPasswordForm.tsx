import { Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useForgotPasswordForm } from '../../hooks/useForgotPasswordForm';

export default function ForgotPasswordForm() {
    const {
        identifier,
        setIdentifier,
        handleSubmit,
        isLoading,
        canSubmit,
    } = useForgotPasswordForm();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="identifier">Email or Phone</Label>
                <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter your email or phone number"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={isLoading}
                    autoComplete="username"
                    className="bg-secondary border-gray text-white placeholder:text-txt"
                />
            </div>

            <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-md shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Sending OTP...
                    </>
                ) : (
                    'Send OTP'
                )}
            </Button>
        </form>
    );
}
