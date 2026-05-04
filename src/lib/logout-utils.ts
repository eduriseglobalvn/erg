import type { QueryClient } from '@tanstack/react-query';
import { buildBackendApiUrl, getPreferredBrowserBackendBaseUrl, shouldUseDirectBrowserApi } from '@/lib/backend-url';
import { clearClientAuthSession } from '@/lib/client-auth-session';
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

        // 2. Notify backend directly in direct API mode; keep proxy as rollback mode.
        try {
            const directApi = shouldUseDirectBrowserApi();
            await fetch(
                directApi
                    ? buildBackendApiUrl('/api/auth/logout', getPreferredBrowserBackendBaseUrl())
                    : '/api/auth/logout',
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );
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

        clearClientAuthSession();

        // 3. Clear Zustand permission store
        clearPermissionStore();

        // 5. Redirect
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        if (currentPath !== '/auth/login' || !currentSearch.includes('reason=session_expired')) {
            window.location.href = '/auth/login?reason=session_expired';
        }
    }
};
