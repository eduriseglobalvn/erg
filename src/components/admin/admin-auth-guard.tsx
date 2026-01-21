"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { httpClient, handleLogout } from "@/services/http-client";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

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
            "/auth/otp"
        ];

        // Check xem trang hiện tại có phải public không
        const isPublicPage = publicPaths.some((path) => pathname.startsWith(path));
        const token = localStorage.getItem("accessToken");

        const checkAuth = async () => {
            // TRƯỜNG HỢP 1: Trang Public (Login, Register...)
            if (isPublicPage) {
                // [NÂNG CAO] Nếu đã có Token mà lại vào trang Login -> Đá về Dashboard luôn
                // Giúp trải nghiệm mượt hơn, đỡ phải login lại
                if (token) {
                    try {
                        // Check nhẹ xem token còn sống không
                        await httpClient("/sessions/current");
                        router.push("/"); // Hoặc /admin/dashboard
                        return;
                    } catch {
                        // Token rác/hết hạn -> Ở lại trang login như bình thường
                        handleLogout(); // Xóa rác đi cho sạch
                    }
                }

                // Nếu chưa có token -> Cho phép hiển thị trang Login/Register
                setIsAuthenticated(true);
                setIsChecking(false);
                return;
            }

            // TRƯỜNG HỢP 2: Trang Private (Dashboard, Profile...)
            if (!token) {
                // Không có token -> Đá về login
                setIsAuthenticated(false);
                setIsChecking(false);
                router.push("/auth/login");
                return;
            }

            try {
                // Gọi API check session
                await httpClient("/sessions/current");
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Session revoked or expired:", error);
                setIsAuthenticated(false);
                handleLogout(); // Hàm này sẽ redirect về login
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
    // (Tránh trường hợp lộ nội dung trong tíc tắc trước khi redirect)
    const publicPaths = ["/auth/login", "/auth/register", "/auth/signup", "/auth/forgot-password", "/auth/reset-password", "/auth/change-password", "/auth/otp"];
    const isPublicPage = publicPaths.some((path) => pathname.startsWith(path));

    if (!isAuthenticated && !isPublicPage) {
        return null;
    }

    // 3. Render nội dung
    return <>{children}</>;
}