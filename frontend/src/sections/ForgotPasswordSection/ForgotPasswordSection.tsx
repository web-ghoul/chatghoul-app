import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ForgotPasswordForm from '../../forms/ForgotPasswordForm/ForgotPasswordForm';
import { env } from '../../lib/env';

export default function ForgotPasswordSection() {
    return (
        <div className="w-full max-w-md">
            <Link
                to={env.routes.LOGIN}
                className="inline-flex items-center gap-2 text-txt hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                Back to login
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
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Forgot Password?</h1>
                <p className="text-txt">
                    Enter your email or phone number and we'll send you an OTP to reset your password.
                </p>
            </div>

            <ForgotPasswordForm />

            <p className="text-center mt-6 text-txt text-sm">
                Remembered your password?{' '}
                <Link
                    to={env.routes.LOGIN}
                    className="text-primary hover:text-primary/80 font-medium transition-all hover:underline underline-offset-4"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
