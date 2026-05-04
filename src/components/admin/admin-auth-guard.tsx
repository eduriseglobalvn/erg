"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { handleLogout, isAuthFailureError, isBackendUnavailableError } from "@/services/http-client";
import { PermissionDeniedDialog } from "@/components/admin/shared/permission-denied-dialog";
import { useAuth } from "@/hooks/use-auth";
import { hasLoggedInCookie } from "@/lib/client-session";

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
        "/auth/google",
        "/403"
    ];

    const isPublicPage = publicPaths.some((path) => pathname.startsWith(path));
    const hasSessionCookie = hasLoggedInCookie();

    // Sử dụng useAuth hook với TanStack Query
    const { data: auth, isLoading: isChecking, isError, error } = useAuth();
    const isBackendUnavailable = isBackendUnavailableError(error);

    useEffect(() => {
        // TRƯỜNG HỢP 1: Trang Public (Login, Register...)
        if (isPublicPage) {
            // Nếu đã có Token mà lại vào trang Login -> Đá về Dashboard luôn
            if (hasSessionCookie && auth) {
                router.replace("/");
            }
            return;
        }

        // TRƯỜNG HỢP 2: Trang Private - Không có token
        if (!hasSessionCookie) {
            router.replace("/auth/login");
            return;
        }

        // TRƯỜNG HỢP 3: Query failed (session expired/revoked)
        if (isError) {
            if (isBackendUnavailable) {
                console.error("Backend is temporarily unavailable");
                return;
            }

            if (isAuthFailureError(error) || !hasSessionCookie) {
                console.error("Session revoked or expired");
                handleLogout();
                return;
            }

            return;
        }

        // TRƯỜNG HỢP 4: Auth data loaded - Validate user status
        if (auth?.user) {
            const userStatus = auth.user.status;
            const userEmail = auth.user.email;
            const isRootAdmin = userEmail?.trim().toLowerCase() === 'admin@erg.edu.vn';

            // Nếu user bị BANNED hoặc BLOCKED -> Logout ngay
            if (userStatus === 'BANNED' || userStatus === 'BLOCKED') {
                console.error(`Account is ${userStatus}`);
                handleLogout();
                return;
            }

            // Nếu user vẫn PENDING (chưa verify PIN) -> Redirect về verify
            if (userStatus === 'PENDING' && !isRootAdmin) {
                router.replace(`/auth/otp?email=${encodeURIComponent(auth.user.email)}&mode=activation`);
                return;
            }

            // Xem xét permissions lưu trữ trên useAuth trực tiếp, bỏ localStorage
            if (auth.permissions || auth.roles) {
                // Remove saving into localStorage, use useAuth directly

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

            // Check profile completion - Skip if admin or explicitly skipped
            const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'admin', 'super_admin'];
            
            // Safe check for roles and user email
            const roles = auth?.roles || [];
            const userRole = auth?.user?.role;
            const isAdmin = 
                roles.some((role: string) => adminRoles.includes(role)) || 
                (userRole && adminRoles.includes(userRole)) ||
                isRootAdmin;

            const skipOnboarding = sessionStorage.getItem("skipOnboarding") === "true";
            const isCompleted = auth.user.isProfileCompleted;

            if (!isCompleted && !skipOnboarding && !isAdmin && pathname !== '/onboarding') {
                router.replace('/onboarding');
                return;
            }

            if ((isCompleted || isAdmin) && pathname === '/onboarding') {
                router.replace('/');
                return;
            }

        }
    }, [auth, error, hasSessionCookie, isBackendUnavailable, isError, pathname, router, isPublicPage]);

    // --- RENDER UI ---

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // ... (rest of useEffect logic remains same, but we need to ensure mounted is defined before the big useEffect if we put it there)
    // Actually, simply adding the state at top and modifying the isChecking condition is enough.

    // 1. Đang kiểm tra -> Hiện Loading (Blur màn hình)
    if (isChecking && mounted) {
        return (
            <div className="relative w-full h-full min-h-screen" suppressHydrationWarning>
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

    if (!isPublicPage && hasSessionCookie && isBackendUnavailable) {
        return (
            <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
                    <h2 className="text-lg font-semibold text-gray-900">Backend đang tạm thời chưa kết nối</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Phiên đăng nhập của bạn chưa bị xóa. Ứng dụng đang không kết nối được tới API nên mình chưa chuyển bạn về trang đăng nhập.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        Thử lại
                    </button>
                </div>
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
