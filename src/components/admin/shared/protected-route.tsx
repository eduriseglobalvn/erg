"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePermission } from "@/hooks/use-permission";

interface ProtectedRouteProps {
    permission: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    redirectTo?: string;
}

/**
 * Component bảo vệ route dựa trên permission
 * Nếu user không có permission, sẽ redirect về trang 403 hoặc trang tùy chỉnh
 * 
 * @example
 * <ProtectedRoute permission="users.read">
 *   <UsersPage />
 * </ProtectedRoute>
 * 
 * @example
 * <ProtectedRoute 
 *   permission="posts.delete" 
 *   redirectTo="/dashboard"
 * >
 *   <DeletePostPage />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    permission,
    children,
    fallback = null,
    redirectTo = "/403",
}) => {
    const router = useRouter();
    const hasPermission = usePermission(permission);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Đợi một chút để hook usePermission load xong
        const timer = setTimeout(() => {
            setIsChecking(false);

            if (!hasPermission) {
                router.push(redirectTo);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [hasPermission, router, redirectTo]);

    // Đang kiểm tra permission
    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Không có permission
    if (!hasPermission) {
        return <>{fallback}</>;
    }

    // Có permission - render children
    return <>{children}</>;
};
