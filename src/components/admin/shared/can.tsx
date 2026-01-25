"use client";

import React from "react";
import { usePermission } from "@/hooks/use-permission";

interface CanProps {
    permission: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Component wrapper để hiển thị nội dung dựa trên permission
 * @param permission - Permission cần check
 * @param children - Nội dung hiển thị nếu có permission
 * @param fallback - Nội dung hiển thị nếu không có permission (optional)
 * 
 * @example
 * <Can permission="posts.create">
 *   <button>Tạo bài viết</button>
 * </Can>
 * 
 * <Can permission="users.delete" fallback={<span>Không có quyền</span>}>
 *   <button>Xóa user</button>
 * </Can>
 */
export const Can: React.FC<CanProps> = ({ permission, children, fallback = null }) => {
    const hasPermission = usePermission(permission);

    return hasPermission ? <>{children}</> : <>{fallback}</>;
};
