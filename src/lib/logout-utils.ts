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

        // 2. Xóa localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        localStorage.removeItem('permissions');
        localStorage.removeItem('roles');

        // 3. Redirect
        window.location.href = '/auth/login?reason=session_expired';
    }
};
