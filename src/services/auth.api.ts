import { httpClient } from "./http-client";
import {
    LoginResponse,
    LoginPayload,
    RegisterPayload,
    VerifyPinPayload,
    ForgotPasswordPayload,
    ResetPasswordPayload
} from "@/types/auth"; // Bạn tự định nghĩa types nhé

export const authApi = {
    login: (data: LoginPayload) => {
        return httpClient<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
            requireAuth: false, // API này không cần token
        });
    },

    register: (data: RegisterPayload) => {
        return httpClient<any>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
            requireAuth: false,
        });
    },

    verifyPin: (data: VerifyPinPayload) => {
        return httpClient<any>('/auth/verify-pin', {
            method: 'POST',
            body: JSON.stringify(data),
            requireAuth: false,
        });
    },

    resendPin: (email: string) => {
        return httpClient<any>('/auth/resend-pin', {
            method: 'POST',
            body: JSON.stringify({ email }),
            requireAuth: false,
        });
    },

    forgotPassword: (email: string) => {
        return httpClient<any>('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
            requireAuth: false,
        });
    },

    resetPassword: (data: ResetPasswordPayload) => {
        return httpClient<any>('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
            requireAuth: false,
        });
    },

    getProfile: () => {
        return httpClient<any>('/users/me', {
            method: 'GET',
            requireAuth: true,
        });
    },

    logout: () => {
        return httpClient<any>('/auth/logout', {
            method: 'POST',
            requireAuth: true,
        });
    }
};