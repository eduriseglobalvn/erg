import type { QueryClient } from '@tanstack/react-query';
import { devWarn } from '@/lib/dev-logger';

// Re-export để dùng ở nơi khác
export { handleLogout } from '@/services/http-client';

// Zustand permission store — lazy import để tránh circular dependency
const clearPermissionStore = () => {
    try {
        const { usePermissionStore } = require('@/store/permission-store');
        usePermissionStore.getState().clearPermissions();
    } catch {
        // Store chưa được hydrate, bỏ qua
    }
};

let globalQueryClient: QueryClient | null = null;

export function setGlobalQueryClient(client: QueryClient) {
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
            devWarn('Logout API failed:', error);
        }

        try {
            const { signOut } = await import('next-auth/react');
            await signOut({
                redirect: false,
                callbackUrl: '/auth/login?reason=session_expired',
            });
        } catch (error) {
            devWarn('NextAuth logout failed:', error);
        }

        // Force clear isLoggedIn cookie on client-side (fallback an toàn)
        document.cookie = 'isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'clientUserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'authProvider=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'accountType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // 3. Clear Zustand permission store
        clearPermissionStore();

        // 4. Xóa các localStorage info khác
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        localStorage.removeItem('permissions');
        localStorage.removeItem('roles');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // 5. Redirect
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        if (currentPath !== '/auth/login' || !currentSearch.includes('reason=session_expired')) {
            window.location.href = '/auth/login?reason=session_expired';
        }
    }
};
