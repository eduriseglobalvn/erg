// src/types/user.ts

// 1. Thông tin User cơ bản trả về từ API
export interface User {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    role: string;
    isProfileCompleted: boolean;
    // Thêm các trường khác tùy entity của bạn (jobPosition, address, etc...)
    phoneNumber?: string;
    bio?: string;
    address?: string;
    createdAt: string;
}

// 2. Payload cập nhật hồ sơ
export interface UpdateProfilePayload {
    fullName?: string;
    phoneNumber?: string;
    bio?: string;
    address?: string;
    avatarUrl?: string;
    // Các trường khác cho phép update
}

// 3. Payload đổi mật khẩu
export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

// 4. Thông tin Session (Phiên đăng nhập)
export interface UserSession {
    id: string;
    ipAddress: string;
    userAgent: string;
    lastActiveAt: string;
    isCurrent?: boolean; // Frontend có thể tự so sánh ID để biết có phải session hiện tại ko
}

// 5. Response phân trang cho Admin
export interface PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}