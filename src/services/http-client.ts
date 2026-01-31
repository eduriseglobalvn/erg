// src/services/http-client.ts
"use client";

/**
 * HTTP Client với Next.js Proxy
 * 
 * ✅ Tất cả requests đều đi qua Next.js proxy tại /api/*
 * ✅ Next.js tự động forward sang Backend (cấu hình trong next.config.ts)
 * ✅ Same-Origin requests → Bypass CORS, AdBlock
 * ✅ Auto refresh token khi hết hạn
 */

interface CustomRequestInit extends RequestInit {
    requireAuth?: boolean;
}

// --- BIẾN TOÀN CỤC ĐỂ QUẢN LÝ REFRESH TOKEN ---
// isRefreshing: Cái khóa để ngăn 10 request cùng gọi refresh 1 lúc (Race Condition)
let isRefreshing = false;
// failedQueue: Hàng chờ chứa các request bị lỗi 401 đang đợi token mới
let failedQueue: any[] = [];

// Hàm xử lý hàng chờ sau khi refresh xong (hoặc thất bại)
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const httpClient = async <T>(
    endpoint: string,
    options?: CustomRequestInit
): Promise<T> => {
    const { requireAuth = true, ...fetchOptions } = options || {};

    // Helper lấy token từ LocalStorage
    const getAccessToken = () => localStorage.getItem('accessToken');
    const getRefreshToken = () => localStorage.getItem('refreshToken');
    const getUserId = () => localStorage.getItem('userId'); // Cần lưu userId lúc login

    // Helper tạo headers
    const createHeaders = (token: string | null) => {
        const headers = new Headers(fetchOptions.headers);

        // Chỉ set JSON nếu không phải là FormData (để browser tự xử lý multipart)
        if (!(fetchOptions.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json');
        }

        if (requireAuth && token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    };

    // ✅ Transform endpoint to always start with /api/
    // This ensures absolute paths from root
    let url: string;
    if (endpoint.startsWith('/api/')) {
        // Already has /api/ prefix
        url = endpoint;
    } else if (endpoint.startsWith('/')) {
        // Has / but not /api/, add /api prefix
        url = `/api${endpoint}`;
    } else {
        // No leading /, add /api/ prefix
        url = `/api/${endpoint}`;
    }

    console.log('[httpClient] Endpoint:', endpoint, '→ URL:', url);

    try {
        // --- BƯỚC 1: GỬI REQUEST LẦN ĐẦU ---
        const response = await fetch(url, {
            ...fetchOptions,
            headers: createHeaders(getAccessToken()),
        });

        // Nếu thành công -> trả về data
        if (response.ok) {
            // Xử lý trường hợp response body rỗng
            const contentLength = response.headers.get('Content-Length');
            if (contentLength === '0') return {} as T;
            return response.json();
        }

        // --- BƯỚC 2: XỬ LÝ KHI GẶP LỖI 401 (TOKEN HẾT HẠN) ---
        if (response.status === 401 && requireAuth) {

            // Nếu đang có 1 thằng khác đi refresh rồi -> Xếp hàng đợi
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (newToken: string) => {
                            // Khi có token mới, thực hiện lại request này
                            const newHeaders = createHeaders(newToken);
                            resolve(
                                fetch(url, { ...fetchOptions, headers: newHeaders }).then((res) => res.json())
                            );
                        },
                        reject: (err: any) => reject(err),
                    });
                });
            }

            // Nếu chưa ai refresh -> Mình xung phong đi refresh
            isRefreshing = true;
            const refreshToken = getRefreshToken();
            const userId = getUserId();

            if (refreshToken && userId) {
                try {
                    // ✅ Gọi API Refresh qua proxy
                    const refreshResponse = await fetch('/api/auth/refresh', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, refreshToken }),
                    });

                    if (refreshResponse.ok) {
                        const data = await refreshResponse.json();

                        // 1. Lưu token mới vào LocalStorage
                        localStorage.setItem('accessToken', data.accessToken);
                        localStorage.setItem('refreshToken', data.refreshToken);

                        // 2. Giải phóng hàng chờ (báo cho các ông kia là có token rồi)
                        processQueue(null, data.accessToken);
                        isRefreshing = false;

                        // 3. Thực hiện lại request của chính mình
                        return httpClient<T>(endpoint, options);
                    } else {
                        // Refresh thất bại (RefreshToken hết hạn/bị thu hồi) -> ĐÁ RA
                        throw new Error('Session expired');
                    }
                } catch (error) {
                    processQueue(error, null);
                    isRefreshing = false;
                    handleLogout(); // Hàm logout
                    throw error;
                }
            } else {
                // Không có refreshToken -> Logout luôn
                handleLogout();
                throw new Error('No refresh token available');
            }
        }

        // Các lỗi khác (403, 404, 500...)
        const errorData = await response.json().catch(() => ({}));
        // [MODIFIED] Trả về full errorData message để frontend handle logic
        throw new Error(errorData.message || JSON.stringify(errorData) || `HTTP Error ${response.status}`);

    } catch (error) {
        throw error;
    }
};

// --- HÀM LOGOUT & ĐÁ NGƯỜI DÙNG RA ---
export const handleLogout = () => {
    if (typeof window !== 'undefined') {
        // Dynamic import to avoid circular dependency
        import('@/lib/logout-utils').then(({ handleLogoutWithCache }) => {
            handleLogoutWithCache();
        });
    }
};