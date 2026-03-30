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
export const handleLogoutWithCache = async () => {
    if (typeof window !== 'undefined') {
        // 1. Clear React Query cache
        if (globalQueryClient) {
            globalQueryClient.clear();
            globalQueryClient.removeQueries();
        }

        // 2. Chờ API logout hoàn tất để server/proxy kịp xóa HttpOnly cookies
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout API failed:', error);
        }

        // Force clear isLoggedIn cookie on client-side (fallback an toàn)
        document.cookie = 'isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // 3. Xóa các localStorage info khác
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        localStorage.removeItem('permissions');
        localStorage.removeItem('roles');

        // 4. Redirect
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        if (currentPath !== '/auth/login' || !currentSearch.includes('reason=session_expired')) {
            window.location.href = '/auth/login?reason=session_expired';
        }
    }
};
