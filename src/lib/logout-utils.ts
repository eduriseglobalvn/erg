// Re-export để dùng ở nơi khác
export { handleLogout } from '@/services/http-client';

// Singleton QueryClient instance để có thể access từ bên ngoài React components
let globalQueryClient: any = null;

export function setGlobalQueryClient(client: any) {
    globalQueryClient = client;
}

export function getGlobalQueryClient() {
    return globalQueryClient;
}

/**
 * Enhanced logout handler với cache clearing
 */
export const handleLogoutWithCache = () => {
    if (typeof window !== 'undefined') {
        // 1. Clear React Query cache
        if (globalQueryClient) {
            globalQueryClient.clear();
            globalQueryClient.removeQueries();
        }

        // 2. Gọi API logout qua proxy để XEM NHƯ proxy sẽ xóa HttpOnly cookie
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });

        // 3. Cả accessToken và refreshToken (cùng với isLoggedIn flag) sẽ bị proxy xóa thông qua cookie expiration 

        // 4. Xóa các localStorage info khác
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        localStorage.removeItem('permissions');
        localStorage.removeItem('roles');

        // 3. Redirect
        window.location.href = '/auth/login?reason=session_expired';
    }
};
