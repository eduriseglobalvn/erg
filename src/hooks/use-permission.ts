"use client";

import { useAuth } from "./use-auth";

/**
 * Hook để kiểm tra permission của user hiện tại
 * @param permission - Tên permission cần check (vd: 'posts.create')
 * @returns boolean - true nếu user có permission, false nếu không
 */
export const usePermission = (permission: string) => {
    const { data: auth, isLoading } = useAuth();
    const hasPermission = auth?.permissions?.includes(permission) || false;

    return { hasPermission, isLoading };
};

/**
 * Hook để kiểm tra role của user hiện tại
 * @param role - Tên role cần check (vd: 'admin')
 * @returns boolean - true nếu user có role, false nếu không
 */
export const useRole = (role: string): boolean => {
    const { data: auth } = useAuth();
    return auth?.roles?.includes(role) || false;
};

/**
 * Hook để lấy tất cả permissions của user
 * @returns string[] - Mảng các permissions
 */
export const usePermissions = (): string[] => {
    const { data: auth } = useAuth();
    return auth?.permissions || [];
};

/**
 * Hook để lấy tất cả roles của user
 * @returns string[] - Mảng các roles
 */
export const useRoles = (): string[] => {
    const { data: auth } = useAuth();
    return auth?.roles || [];
};

/**
 * Hook tiện ích đồng bộ: Kiểm tra nhanh user có permission cụ thể hay không.
 * (Hợp nhất theo yêu cầu useCanAccess của tài liệu)
 * @param permission Tên quyền cần kiểm tra
 */
export const useCanAccess = (permission: string) => {
    return usePermission(permission);
};
