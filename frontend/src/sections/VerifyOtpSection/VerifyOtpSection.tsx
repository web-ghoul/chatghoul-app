import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VerifyOtpForm from '../../forms/VerifyOtpForm/VerifyOtpForm';
import { useVerifyOtpForm } from '../../hooks/useVerifyOtpForm';
import { env } from '../../functions/env';

export default function VerifyOtpSection() {
    const { identifier } = useVerifyOtpForm();

    if (!identifier) return null;

    return (
        <div className="w-full max-w-md">
            <Link
                to={env.routes.FORGOT_PASSWORD}
                className="inline-flex items-center gap-2 text-txt hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                Back
            </Link>

            <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-in zoom-in duration-500">
                    <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Verify OTP</h1>
                <p className="text-txt">
                    We've sent a 6-digit code to{' '}
                    <span className="text-white font-medium">{identifier}</span>
                </p>
            </div>

            <VerifyOtpForm />
        </div>
    );
}
