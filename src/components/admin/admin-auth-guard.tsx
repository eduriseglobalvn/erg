"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { httpClient, handleLogout } from "@/services/http-client";
import { PermissionDeniedDialog } from "@/components/admin/shared/permission-denied-dialog";
import { userApi } from "@/services/users.api";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [showPermissionDenied, setShowPermissionDenied] = useState(false);

    useEffect(() => {
        // 1. Định nghĩa danh sách Public Routes (Không cần Token)
        // [QUAN TRỌNG] Phải liệt kê đủ tất cả các trang Auth ở đây
        const publicPaths = [
            "/auth/login",
            "/auth/register",
            "/auth/signup",          // <--- Fix lỗi của bạn ở đây
            "/auth/forgot-password",
            "/auth/reset-password",
            "/auth/change-password", // Trang đặt lại pass từ email (có token trên URL nhưng chưa login)
            "/auth/otp",
            "/403"                   // Trang 403 không cần auth check
        ];

        // Check xem trang hiện tại có phải public không
        const isPublicPage = publicPaths.some((path) => pathname.startsWith(path));
        const token = localStorage.getItem("accessToken");

        const checkAuth = async () => {
            // TRƯỜNG HỢP 1: Trang Public (Login, Register...)
            if (isPublicPage) {
                // [NÂNG CAO] Nếu đã có Token mà lại vào trang Login -> Đá về Dashboard luôn
                if (token) {
                    try {
                        await httpClient("/sessions/current");
                        router.push("/");
                        return;
                    } catch {
                        handleLogout();
                    }
                }

                setIsAuthenticated(true);
                setIsChecking(false);
                return;
            }

            // TRƯỜNG HỢP 2: Trang Private
            if (!token) {
                setIsAuthenticated(false);
                setIsChecking(false);
                router.push("/auth/login");
                return;
            }

            try {
                // [FIX] Gọi song song cả Session (lấy permissions) và Me (lấy isProfileCompleted)
                // Vì API /sessions/current không trả về isProfileCompleted
                const [sessionRes, userRes]: [any, any] = await Promise.all([
                    httpClient("/sessions/current"),
                    userApi.getMe()
                ]);

                const sessionData = sessionRes.data || sessionRes;
                const userData = userRes.data || userRes;

                // Merge thông tin user từ /users/me vào session user
                // userData chứa profile đầy đủ bao gồm isProfileCompleted
                const fullUser = {
                    ...sessionData.user,
                    ...userData
                };

                // Kiểm tra status của user
                if (fullUser) {
                    const userStatus = fullUser.status;

                    // Nếu user bị BANNED hoặc BLOCKED -> Logout ngay
                    if (userStatus === 'BANNED' || userStatus === 'BLOCKED') {
                        console.error(`Account is ${userStatus}`);
                        setIsAuthenticated(false);
                        handleLogout();
                        return;
                    }

                    // Nếu user vẫn PENDING (chưa verify PIN) -> Redirect về verify
                    if (userStatus === 'PENDING') {
                        setIsAuthenticated(false);
                        setIsChecking(false);
                        router.push(`/auth/otp?email=${encodeURIComponent(fullUser.email)}&mode=activation`);
                        return;
                    }

                    // Lưu permissions vào localStorage
                    if (sessionData.accessControl) {
                        localStorage.setItem('permissions', JSON.stringify(sessionData.accessControl.permissions || []));
                        localStorage.setItem('roles', JSON.stringify(sessionData.accessControl.roles || []));

                        const permissions = sessionData.accessControl.permissions || [];
                        const roles = sessionData.accessControl.roles || [];

                        // Nếu user không có quyền gì cả -> Hiển thị dialog
                        if (permissions.length === 0 && roles.length === 0) {
                            setIsChecking(false);
                            setShowPermissionDenied(true);
                            return;
                        }
                    } else {
                        // Không có accessControl -> Hiển thị dialog
                        setIsChecking(false);
                        setShowPermissionDenied(true);
                        return;
                    }

                    // [CẢI THIỆN] Check localStorage xem có cờ isProfileCompleted không (fallback)
                    let isCompleted = fullUser.isProfileCompleted;

                    // Fallback check localStorage
                    if (!isCompleted) {
                        try {
                            const storedUserStr = localStorage.getItem('user');
                            if (storedUserStr) {
                                const storedUser = JSON.parse(storedUserStr);
                                if (storedUser.isProfileCompleted) {
                                    isCompleted = true;
                                    fullUser.isProfileCompleted = true;
                                }
                            }
                        } catch (e) { }
                    }

                    // Update user info in localStorage
                    localStorage.setItem('user', JSON.stringify(fullUser));

                    // [MỚI] Logic chuyển hướng Onboarding
                    const skipOnboarding = sessionStorage.getItem("skipOnboarding") === "true";

                    if (!isCompleted && !skipOnboarding && pathname !== '/onboarding') {
                        setIsAuthenticated(false);
                        setIsChecking(false);
                        router.push('/onboarding');
                        return;
                    }

                    // Nếu đã hoàn thành hồ sơ mà vẫn ở trang onboarding -> Đẩy về home
                    if (isCompleted && pathname === '/onboarding') {
                        setIsAuthenticated(false);
                        setIsChecking(false);
                        router.push('/');
                        return;
                    }
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error("Session revoked or expired:", error);
                setIsAuthenticated(false);
                handleLogout();
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

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

    // 2. Nếu là trang Private mà chưa Auth -> Không render gì cả (đợi redirect)
    // TRỪ KHI đang hiển thị popup permission denied (vẫn cho render để hiện popup)
    const publicPaths = ["/auth/login", "/auth/register", "/auth/signup", "/auth/forgot-password", "/auth/reset-password", "/auth/change-password", "/auth/otp", "/403"];
    const isPublicPage = publicPaths.some((path) => pathname.startsWith(path));

    // Nếu Permission Denied -> Render Dialog
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

    if (!isAuthenticated && !isPublicPage) {
        return null;
    }

    // 3. Render nội dung
    return <>{children}</>;
}