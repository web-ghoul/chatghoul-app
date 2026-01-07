import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthToken } from '../functions/cookies';
import { env } from '../functions/env';

import { useAuthStore } from '../globals/useAuthStore';

export abstract class ApiService {
    protected readonly http: AxiosInstance;

    constructor() {
        this.http = axios.create({
            baseURL: env.API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.http.interceptors.request.use(
            (config) => {
                const token = getAuthToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.http.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // removing auth token + clearing zustand store
                    useAuthStore.getState().logout();
                }
                return Promise.reject(error);
            }
        );
    }

    protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.http.get(url, config);
        return response.data;
    }

    protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.http.post(url, data, config);
        return response.data;
    }

    protected async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.http.patch(url, data, config);
        return response.data;
    }

    protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.http.put(url, data, config);
        return response.data;
    }

    protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.http.delete(url, config);
        return response.data;
    }
}
