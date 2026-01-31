"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { handleLogout } from "@/services/http-client";
import { PermissionDeniedDialog } from "@/components/admin/shared/permission-denied-dialog";
import { useAuth } from "@/hooks/use-auth";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [showPermissionDenied, setShowPermissionDenied] = useState(false);

    // Danh sách Public Routes (Không cần Token)
    const publicPaths = [
        "/auth/login",
        "/auth/register",
        "/auth/signup",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/auth/change-password",
        "/auth/otp",
        "/403"
    ];

    const isPublicPage = publicPaths.some((path) => pathname.startsWith(path));
    const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

    // Sử dụng useAuth hook với TanStack Query
    const { data: auth, isLoading: isChecking, isError } = useAuth();

    useEffect(() => {
        // TRƯỜNG HỢP 1: Trang Public (Login, Register...)
        if (isPublicPage) {
            // Nếu đã có Token mà lại vào trang Login -> Đá về Dashboard luôn
            if (token && auth) {
                router.push("/");
            }
            return;
        }

        // TRƯỜNG HỢP 2: Trang Private - Không có token
        if (!token) {
            router.push("/auth/login");
            return;
        }

        // TRƯỜNG HỢP 3: Query failed (session expired/revoked)
        if (isError) {
            console.error("Session revoked or expired");
            handleLogout();
            return;
        }

        // TRƯỜNG HỢP 4: Auth data loaded - Validate user status
        if (auth?.user) {
            const userStatus = auth.user.status;

            // Nếu user bị BANNED hoặc BLOCKED -> Logout ngay
            if (userStatus === 'BANNED' || userStatus === 'BLOCKED') {
                console.error(`Account is ${userStatus}`);
                handleLogout();
                return;
            }

            // Nếu user vẫn PENDING (chưa verify PIN) -> Redirect về verify
            if (userStatus === 'PENDING') {
                router.push(`/auth/otp?email=${encodeURIComponent(auth.user.email)}&mode=activation`);
                return;
            }

            // Lưu permissions vào localStorage
            if (auth.permissions || auth.roles) {
                localStorage.setItem('permissions', JSON.stringify(auth.permissions));
                localStorage.setItem('roles', JSON.stringify(auth.roles));

                // Nếu user không có quyền gì cả -> Hiển thị dialog
                if (auth.permissions.length === 0 && auth.roles.length === 0) {
                    setShowPermissionDenied(true);
                    return;
                }
            } else {
                // Không có accessControl -> Hiển thị dialog
                setShowPermissionDenied(true);
                return;
            }

            // Check profile completion
            const skipOnboarding = sessionStorage.getItem("skipOnboarding") === "true";
            const isCompleted = auth.user.isProfileCompleted;

            if (!isCompleted && !skipOnboarding && pathname !== '/onboarding') {
                router.push('/onboarding');
                return;
            }

            // Nếu đã hoàn thành hồ sơ mà vẫn ở trang onboarding -> Đẩy về home
            if (isCompleted && pathname === '/onboarding') {
                router.push('/');
                return;
            }

            // Update user info in localStorage
            localStorage.setItem('user', JSON.stringify(auth.user));
        }
    }, [auth, isError, pathname, router, isPublicPage, token]);

    // --- RENDER UI ---

    // 1. Đang kiểm tra -> Hiện Loading (Blur màn hình)
    if (isChecking) {
        return (
            <div className="relative w-full h-full min-h-screen">
                {/* Lớp nền nội dung bị làm mờ để tránh giật layout */}
                <div className="w-full h-full blur-md pointer-events-none select-none opacity-50 fixed inset-0 z-0 bg-white">
                    {/* Render children mờ ảo ở dưới để giữ layout (optional) */}
                </div>

                {/* Loading Spinner */}
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-600 font-medium text-sm animate-pulse">Đang xác thực...</p>
                </div>
            </div>
        )
    }

    // 2. Nếu Permission Denied -> Render Dialog
    if (showPermissionDenied) {
        return (
            <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <PermissionDeniedDialog
                    open={true}
                    // Không cho đóng dialog bằng cách click ra ngoài (modal)
                    onOpenChange={() => { }}
                />
            </div>
        );
    }

    // 3. Nếu là trang Private mà chưa có auth data -> Không render gì cả (đợi redirect)
    if (!isPublicPage && !auth) {
        return null;
    }

    // 4. Render nội dung
    return <>{children}</>;
}