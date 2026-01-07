import { Link } from 'react-router-dom';
import LoginForm from '../../forms/LoginForm/LoginForm';
import { env } from '../../functions/env';

export default function LoginSection() {
    return (
        <div className="w-full max-w-md">
            {/* Logo & Header */}
            <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-in zoom-in duration-500">
                    <svg
                        className="w-12 h-12 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l4.93-1.36C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.46 14.12c-.23.64-.86 1.17-1.42 1.32-.38.1-1.21.23-3.51-.75-2.94-1.25-4.83-4.25-4.98-4.45-.14-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.01-2.43.23-.26.61-.38.97-.38.12 0 .22.01.31.02.3.01.45.02.64.5.24.59.81 1.99.88 2.13.08.14.13.31.03.5-.1.18-.15.3-.3.46-.14.16-.3.36-.43.48-.14.13-.28.27-.12.53.16.26.71 1.17 1.53 1.89 1.05.93 1.93 1.22 2.21 1.35.26.13.41.11.56-.07.16-.18.66-.77.84-1.03.18-.26.35-.22.59-.13.24.09 1.53.72 1.79.85.26.13.43.19.5.3.06.11.06.64-.17 1.27z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
                <p className="text-txt">Sign in to continue to ChatGhoul</p>
            </div>

            {/* LoginForm */}
            <LoginForm />

            {/* Register Link */}
            <p className="text-center mt-6 text-txt">
                Don't have an account?{' '}
                <Link
                    to={env.routes.REGISTER}
                    className="text-primary hover:text-primary/80 font-medium transition-all hover:underline underline-offset-4"
                >
                    Create account
                </Link>
            </p>
        </div>
    );
}
