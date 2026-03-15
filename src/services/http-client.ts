// src/services/http-client.ts

/**
 * HTTP Client Isomorphic (Chạy được cả Client & Server)
 * 
 * ✅ Tự động nhận diện môi trường (Client/Server)
 * ✅ Ở Client: Sử dụng localStorage, handle refresh token queue
 * ✅ Ở Server: Fetch trực tiếp, dùng API_URL từ env
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

// --- BIẾN TOÀN CỤC (CHỈ DÙNG Ở CLIENT) ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

export const httpClient = async <T>(
    endpoint: string,
    options?: CustomRequestInit
): Promise<T> => {
    const isServer = typeof window === 'undefined';
    const { requireAuth = true, ...fetchOptions } = options || {};

    const getUserId = () => {
        if (isServer) return null;
        return localStorage.getItem('userId');
    };

    // Helper tạo headers
    const createHeaders = () => {
        const headers = new Headers(fetchOptions.headers);
        if (!(fetchOptions.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json');
        }
        return headers;
    };

    // ✅ Resolve URL
    let url: string;
    if (isServer) {
        // Trên Server, gọi trực tiếp Backend URL
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const cleanEndpoint = endpoint.startsWith('/api/') ? endpoint.replace('/api/', '/') : (endpoint.startsWith('/') ? endpoint : `/${endpoint}`);
        url = `${backendUrl}${cleanEndpoint}`;
    } else {
        // Ở Client, đi qua proxy /api/
        if (endpoint.startsWith('/api/')) url = endpoint;
        else if (endpoint.startsWith('/')) url = `/api${endpoint}`;
        else url = `/api/${endpoint}`;
    }

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers: createHeaders(),
        });

        if (response.ok) {
            const contentLength = response.headers.get('Content-Length');
            if (contentLength === '0') return {} as T;
            return response.json();
        }

        // --- LỖI 401 (CHỈ XỬ LÝ REFRESH Ở CLIENT) ---
        if (response.status === 401 && requireAuth && !isServer) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => {
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

            isRefreshing = true;
            const userId = getUserId();

            if (userId) {
                try {
                    const refreshResponse = await fetch('/api/auth/refresh', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId }),
                    });

                    if (refreshResponse.ok) {
                        processQueue(null);
                        isRefreshing = false;
                        return httpClient<T>(endpoint, options);
                    } else {
                        throw new ApiError('Session expired', 401);
                    }
                } catch (error) {
                    processQueue(error, null);
                    isRefreshing = false;
                    handleLogout();
                    throw error;
                }
            } else {
                handleLogout();
                throw new ApiError('No refresh token available', 401);
            }
        }

        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
            errorData.message || errorData.error || `HTTP Error ${response.status}`,
            response.status,
            errorData
        );

    } catch (error) {
        throw error;
    }
};

export const handleLogout = () => {
    if (typeof window !== 'undefined') {
        import('@/lib/logout-utils').then(({ handleLogoutWithCache }) => {
            handleLogoutWithCache();
        });
    }
};