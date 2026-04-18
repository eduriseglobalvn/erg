// src/services/http-client.ts

import { buildBackendApiUrl, fetchWithBackendFallback } from '@/lib/backend-url';

/**
 * HTTP Client Isomorphic (Chạy được cả Client & Server)
 *
 * ✅ Tự động nhận diện môi trường (Client/Server)
 * ✅ Ở Client: Sử dụng HttpOnly cookie session qua Next proxy
 * ✅ Ở Server: Fetch trực tiếp backend URL từ env
 *
 * [BE v2026-03] Rate limit headers:
 *   - X-RateLimit-Limit / X-RateLimit-Remaining / X-RateLimit-Reset (perIp)
 *   - X-RateLimit-User-Limit / X-RateLimit-User-Remaining / X-RateLimit-User-Reset (perUser)
 *   - X-RateLimit-IpUser-Limit / X-RateLimit-IpUser-Remaining / X-RateLimit-IpUser-Reset (perIpUser)
 */

export interface CustomRequestInit extends RequestInit {
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

export function isBackendUnavailableError(error: unknown): boolean {
    if (error instanceof ApiError) {
        if (error.status === 503) return true;
        if (typeof error.message === 'string' && error.message.includes('Backend unavailable')) {
            return true;
        }
    }

    if (error instanceof Error) {
        return error.message.includes('Backend unavailable') || error.message.includes('fetch failed');
    }

    return false;
}

export function isAuthFailureError(error: unknown): boolean {
    return error instanceof ApiError && (error.status === 401 || error.status === 403);
}

/** Error class cho rate limit (429) */
export class RateLimitError extends ApiError {
    public retryAfterMs: number;

    constructor(retryAfterMs: number, retryAfterSec?: number, message?: string, headers?: RateLimitHeaders) {
        super(
            message || `Too many requests. Please try again in ${retryAfterSec ?? Math.ceil(retryAfterMs / 1000)}s.`,
            429,
            { retryAfterMs, retryAfterSec, rateLimit: headers }
        );
        this.name = 'RateLimitError';
        this.retryAfterMs = retryAfterMs;
    }
}

/** Rate limit headers shape — xuất hiện trong mọi response khi endpoint có @ApplyRateLimit */
export interface RateLimitHeaders {
    limit?: number;
    remaining?: number;
    reset?: number;
    userLimit?: number;
    userRemaining?: number;
    userReset?: number;
    ipUserLimit?: number;
    ipUserRemaining?: number;
    ipUserReset?: number;
}

interface FailedQueueEntry {
    resolve: () => void;
    reject: (error: unknown) => void;
}

/**
 * Global store lưu rate limit info của endpoint vừa gọi.
 * Component/service nào cần hiển thị "còn X requests" có thể đọc từ đây.
 *
 * Key = endpoint path (đã normalize), Value = headers + timestamp
 */
const rateLimitCache = new Map<string, { headers: RateLimitHeaders; timestamp: number }>();

const RATE_LIMIT_CACHE_TTL = 60_000; // cache 60s

/** Đọc rate limit headers từ Response và lưu vào cache */
const extractRateLimitHeaders = (response: Response, endpoint: string): RateLimitHeaders => {
    const headers: RateLimitHeaders = {};

    const limit = response.headers.get('X-RateLimit-Limit');
    if (limit !== null) headers.limit = parseInt(limit, 10);

    const remaining = response.headers.get('X-RateLimit-Remaining');
    if (remaining !== null) headers.remaining = parseInt(remaining, 10);

    const reset = response.headers.get('X-RateLimit-Reset');
    if (reset !== null) headers.reset = parseInt(reset, 10);

    const userLimit = response.headers.get('X-RateLimit-User-Limit');
    if (userLimit !== null) headers.userLimit = parseInt(userLimit, 10);

    const userRemaining = response.headers.get('X-RateLimit-User-Remaining');
    if (userRemaining !== null) headers.userRemaining = parseInt(userRemaining, 10);

    const userReset = response.headers.get('X-RateLimit-User-Reset');
    if (userReset !== null) headers.userReset = parseInt(userReset, 10);

    const ipUserLimit = response.headers.get('X-RateLimit-IpUser-Limit');
    if (ipUserLimit !== null) headers.ipUserLimit = parseInt(ipUserLimit, 10);

    const ipUserRemaining = response.headers.get('X-RateLimit-IpUser-Remaining');
    if (ipUserRemaining !== null) headers.ipUserRemaining = parseInt(ipUserRemaining, 10);

    const ipUserReset = response.headers.get('X-RateLimit-IpUser-Reset');
    if (ipUserReset !== null) headers.ipUserReset = parseInt(ipUserReset, 10);

    // Chỉ cache nếu có ít nhất 1 header
    if (Object.keys(headers).length > 0) {
        rateLimitCache.set(endpoint, { headers, timestamp: Date.now() });
    }

    return headers;
};

/**
 * Lấy rate limit info cho một endpoint.
 * Trả về null nếu không có data hoặc cache đã hết hạn.
 *
 * @param endpoint - endpoint path (vd: "/auth/login")
 */
export const getRateLimitInfo = (endpoint: string): RateLimitHeaders | null => {
    const cached = rateLimitCache.get(endpoint);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > RATE_LIMIT_CACHE_TTL) {
        rateLimitCache.delete(endpoint);
        return null;
    }
    return cached.headers;
};

// --- BIẾN TOÀN CỤC (CHỈ DÙNG Ở CLIENT) ---
let isRefreshing = false;
let failedQueue: FailedQueueEntry[] = [];

const processQueue = (error?: unknown) => {
    failedQueue.forEach((pendingRequest) => {
        if (error) {
            pendingRequest.reject(error);
            return;
        }

        pendingRequest.resolve();
    });
    failedQueue = [];
};

export const httpClient = async <T>(
    endpoint: string,
    options?: CustomRequestInit
): Promise<T> => {
    const isServer = typeof window === 'undefined';
    const { requireAuth = true, ...fetchOptions } = options || {};

    const createHeaders = () => {
        const headers = new Headers(fetchOptions.headers);

        if (
            fetchOptions.body &&
            !(fetchOptions.body instanceof FormData) &&
            !headers.has('Content-Type')
        ) {
            headers.set('Content-Type', 'application/json');
        }

        return headers;
    };

    let url: string;
    let serverPath = '';
    if (isServer) {
        serverPath = endpoint.startsWith('/api/')
            ? endpoint
            : (endpoint.startsWith('/') ? `/api${endpoint}` : `/api/${endpoint}`);
        url = buildBackendApiUrl(serverPath);
    } else {
        if (endpoint.startsWith('/api/')) url = endpoint;
        else if (endpoint.startsWith('/')) url = `/api${endpoint}`;
        else url = `/api/${endpoint}`;
    }

    try {
        const response = isServer
            ? await fetchWithBackendFallback(serverPath, {
                ...fetchOptions,
                headers: createHeaders(),
                credentials: fetchOptions.credentials ?? 'same-origin',
            })
            : await fetch(url, {
                ...fetchOptions,
                headers: createHeaders(),
                credentials: fetchOptions.credentials ?? 'include',
            });

        if (response.ok) {
            // [BE v2026-03] Extract & store rate limit headers vào cache
            extractRateLimitHeaders(response, endpoint);
            const contentLength = response.headers.get('Content-Length');
            if (contentLength === '0') return {} as T;
            return response.json();
        }

        // --- LỖI 429 (RATE LIMIT) — CẢ SERVER LẪN CLIENT ---
        if (response.status === 429) {
            // Extract headers trước khi đọc body (headers bị consume sau khi đọc body)
            const rlHeaders = extractRateLimitHeaders(response, endpoint);
            const errorData = await response.json().catch(() => ({}));
            // Ưu tiên retry-after header từ BE (giây), fallback body retryAfter (giây), fallback 60s
            const retryAfterHeader = response.headers.get('retry-after');
            let retryAfterSec = retryAfterHeader ? parseInt(retryAfterHeader) : (errorData.retryAfter ?? 60);
            // Nếu retry-after là Unix timestamp thay vì số giây, tính lại
            if (!retryAfterHeader && retryAfterSec > 1_000_000_000) {
                retryAfterSec = Math.max(1, Math.ceil((retryAfterSec * 1000 - Date.now()) / 1000));
            }
            const retryAfterMs = retryAfterSec * 1000;
            throw new RateLimitError(retryAfterMs, retryAfterSec, errorData.message || `Too many requests. Try again in ${retryAfterSec}s.`, rlHeaders);
        }

        // --- LỖI 401 (CHỈ XỬ LÝ REFRESH Ở CLIENT) ---
        if (response.status === 401 && requireAuth && !isServer) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => {
                            httpClient<T>(endpoint, options).then(resolve).catch(reject);
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshResponse = await fetch('/api/auth/refresh', {
                    method: 'POST',
                    credentials: 'include',
                });

                if (!refreshResponse.ok) {
                    throw new ApiError('Session expired', 401);
                }

                processQueue();
                isRefreshing = false;
                return httpClient<T>(endpoint, options);
            } catch (error) {
                processQueue(error);
                isRefreshing = false;
                handleLogout();
                throw error;
            }
        }

        const errorData = await response.json().catch(() => ({}));

        // ISSUE 2 FIX: Xử lý 403 BANNED / BLOCKED — logout ngay lập tức
        if (response.status === 403 && !isServer) {
            const msg = (errorData.message || '').toLowerCase();
            if (msg.includes('banned') || msg.includes('blocked')) {
                handleLogout();
                throw new ApiError('Tài khoản đã bị khóa', 403, errorData);
            }
        }

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
