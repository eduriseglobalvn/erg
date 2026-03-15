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

    // 5.5 Admin tạo User mới
    // POST /users
    createUser: (data: any) => {
        return httpClient<User>('/users', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // 6. Lấy danh sách users (Admin)
    // GET /users?page=1&limit=10&search=keyword
    getAllUsers: (page = 1, limit = 10, search?: string) => {
        let url = `/users?page=${page}&limit=${limit}`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        return httpClient<PaginatedResult<User>>(url, {
            method: 'GET',
        });
    },

    // 7. Bulk Update Status (B-M11)
    bulkUpdateStatus: (userIds: string[], status: 'ACTIVE' | 'BANNED' | 'BLOCKED') => {
        return httpClient('/users/bulk-status', {
            method: 'POST',
            body: JSON.stringify({ userIds, status }),
        });
    },

    // 8. Bulk Delete (B-M11)
    bulkDelete: (userIds: string[]) => {
        return httpClient('/users/bulk-delete', {
            method: 'POST',
            body: JSON.stringify({ userIds }),
        });
    }
};