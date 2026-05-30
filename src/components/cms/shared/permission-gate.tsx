"use client";

import { usePermission, useRole } from "@/hooks/use-permission";
import { ReactNode } from "react";

interface PermissionGateProps {
    children: ReactNode;
    permission?: string;
    role?: string;
    requireAll?: boolean; // Nếu cần cả permission VÀ role, mặc định là HOẶC
    fallback?: ReactNode;
}

/**
 * Component quản lý việc hiển thị nội dung dựa trên quyền hạn của người dùng.
 * @param permission - Quyền cần kiểm tra (ví dụ: 'users.read')
 * @param role - Role cần kiểm tra (ví dụ: 'admin')
 * @param requireAll - Nếu true, yêu cầu cả permission VÀ role. Mặc định false (HOẶC)
 * @param fallback - Nội dung hiển thị thay thế nếu không có quyền (mặc định return null)
 */
export function PermissionGate({
    children,
    permission,
    role,
    requireAll = false,
    fallback = null,
}: PermissionGateProps) {
    const { hasPermission, isLoading: isPermissionLoading } = usePermission(permission || "");
    const hasRole = useRole(role || "");

    // Nếu đang tải thì tạm thời ẩn
    if (permission && isPermissionLoading) {
        return null;
    }

    let isAllowed = false;

    if (permission && role) {
        isAllowed = requireAll ? (hasPermission && hasRole) : (hasPermission || hasRole);
    } else if (permission) {
        isAllowed = hasPermission;
    } else if (role) {
        isAllowed = hasRole;
    } else {
        // Không truyền reqirement nào thì luôn show
        isAllowed = true;
    }

    if (!isAllowed) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
