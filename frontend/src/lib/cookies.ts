import Cookies from 'js-cookie';
import { env } from './env';

export const AUTH_TOKEN_KEY = env.cookies.AUTH_TOKEN;

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
    expires: 7, // 7 days
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'strict',
};

export function setAuthToken(token: string): void {
    Cookies.set(AUTH_TOKEN_KEY, token, COOKIE_OPTIONS);
}

export function getAuthToken(): string | undefined {
    return Cookies.get(AUTH_TOKEN_KEY);
}

export function removeAuthToken(): void {
    Cookies.remove(AUTH_TOKEN_KEY, { path: '/' });
}
