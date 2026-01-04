// Environment variables with type safety
export const env = {
    // API
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',

    // Routes
    routes: {
        HOME: import.meta.env.VITE_ROUTE_HOME || '/',
        LOGIN: import.meta.env.VITE_ROUTE_LOGIN || '/login',
        REGISTER: import.meta.env.VITE_ROUTE_REGISTER || '/register',
        FORGOT_PASSWORD: import.meta.env.VITE_ROUTE_FORGOT_PASSWORD || '/forgot-password',
        VERIFY_OTP: import.meta.env.VITE_ROUTE_VERIFY_OTP || '/verify-otp',
        RESET_PASSWORD: import.meta.env.VITE_ROUTE_RESET_PASSWORD || '/reset-password',
    },

    // Cookie Names
    cookies: {
        AUTH_TOKEN: import.meta.env.VITE_AUTH_TOKEN_COOKIE || 'auth_token',
    },

    // LocalStorage Keys
    storage: {
        AUTH: import.meta.env.VITE_STORAGE_AUTH || 'auth-storage',
        SETTINGS: import.meta.env.VITE_STORAGE_SETTINGS || 'settings-storage',
    },
} as const;

export default env;
