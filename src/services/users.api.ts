import { httpClient } from "./http-client";
import {
    User,
    UpdateProfilePayload,
    ChangePasswordPayload,
    UserSession,
    PaginatedResult
} from "@/types/user";

export const userApi = {
    // 1. Xem hồ sơ cá nhân
    // GET /users/me
    getMe: () => {
        return httpClient<User>('/users/me', {
            method: 'GET',
        });
    },

    // 2. Cập nhật hồ sơ (Dùng cho cả trang Profile và Onboarding)
    // PATCH /users/me
    updateProfile: (data: UpdateProfilePayload) => {
        return httpClient<User>('/users/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    // 2.5. Onboarding (Upload Avatar + Info)
    // POST /users/onboarding
    onboarding: (formData: FormData) => {
        return httpClient<User>('/users/onboarding', {
            method: 'POST',
            body: formData,
        });
    },

    // 3. Đổi mật khẩu
    // PUT /users/me/password
    changePassword: (data: ChangePasswordPayload) => {
        return httpClient<any>('/users/me/password', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // 4. Xem danh sách phiên đăng nhập
    // GET /users/me/sessions
    getMySessions: () => {
        return httpClient<UserSession[]>('/users/me/sessions', {
            method: 'GET',
        });
    },

    // 5. Đăng xuất thiết bị khác (Revoke)
    // DELETE /users/me/sessions/:id
    revokeSession: (sessionId: string) => {
        return httpClient<any>(`/users/me/sessions/${sessionId}`, {
            method: 'DELETE',
        });
    },

    // --- ADMIN AREA ---

    // 6. Lấy danh sách users (Admin)
    // GET /users?page=1&limit=10
    getAllUsers: (page = 1, limit = 10) => {
        return httpClient<PaginatedResult<User>>(`/users?page=${page}&limit=${limit}`, {
            method: 'GET',
        });
    }
};