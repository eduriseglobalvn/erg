// src/types/auth.ts

export interface LoginPayload {
    email?: string;
    password?: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        fullName: string;
        role: string;
        avatarUrl?: string;
    };
}

export interface RegisterPayload {
    email: string;
    password: string;
    fullName: string;
}

export interface VerifyPinPayload {
    email: string;
    pin: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    email: string;
    pin: string;
    newPassword: string;
}