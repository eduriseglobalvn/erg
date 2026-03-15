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
    signal?: AbortSignal;
}

export class ApiError extends Error {
    constructor(
        public message: string,
        public status?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
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

    const getUserId = () => localStorage.getItem('userId'); // Cần lưu userId lúc login

    // Helper tạo headers
    const createHeaders = () => {
        const headers = new Headers(fetchOptions.headers);

        // Chỉ set JSON nếu không phải là FormData (để browser tự xử lý multipart)
        if (!(fetchOptions.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json');
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


    try {
        // --- BƯỚC 1: GỬI REQUEST LẦN ĐẦU ---
        const response = await fetch(url, {
            ...fetchOptions,
            headers: createHeaders(),
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
                        resolve: () => {
                            // Khi proxy đã tự động renew cookie
                            const newHeaders = createHeaders();
                            resolve(
                                fetch(url, { ...fetchOptions, headers: newHeaders }).then(async (res) => {
                                    if (res.ok) {
                                        const contentLength = res.headers.get('Content-Length');
                                        if (contentLength === '0') return {};
                                        return res.json();
                                    }
                                    const errorData = await res.json().catch(() => ({}));
                                    throw new ApiError(errorData.message || `HTTP Error ${res.status}`, res.status, errorData);
                                })
                            );
                        },
                        reject: (err: any) => reject(err),
                    });
                });
            }

            // Nếu chưa ai refresh -> Mình xung phong đi refresh
            isRefreshing = true;
            const userId = getUserId();

            if (userId) { // Chúng ta không còn kiểm tra refreshToken ở client nữa vì nó nằm trong HttpOnly cookie
                try {
                    // ✅ Gọi API Refresh qua proxy (Cookie refreshToken sẽ tự động gửi đi do same-origin)
                    const refreshResponse = await fetch('/api/auth/refresh', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId }), // Không truyền refreshToken client-side
                    });

                    if (refreshResponse.ok) {
                        // Cookie was updated by proxy

                        // 2. Giải phóng hàng chờ (báo cho các ông kia là có token rồi)
                        processQueue(null);
                        isRefreshing = false;

                        // 3. Thực hiện lại request của chính mình
                        return httpClient<T>(endpoint, options);
                    } else {
                        // Refresh thất bại (RefreshToken hết hạn/bị thu hồi) -> ĐÁ RA
                        throw new ApiError('Session expired', 401);
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
                throw new ApiError('No refresh token available', 401);
            }
        }

        // Các lỗi khác (403, 404, 500...)
        const errorData = await response.json().catch(() => ({}));

        // Trả về ApiError chuẩn hóa để frontend handle logic
        throw new ApiError(
            errorData.message || errorData.error || `HTTP Error ${response.status}`,
            response.status,
            errorData
        );

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