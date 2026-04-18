import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { hasLoggedInCookie } from '@/lib/client-session';

/**
 * Hook để tự động làm mới auth session cache mỗi 5 phút.
 * Chỉ chạy khi user đã authenticated (có isLoggedIn cookie).
 * Không sync permissions thực sự — chỉ invalidate TanStack Query cache.
 */
export function useAuthRefresh() {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!hasLoggedInCookie()) return;

        const interval = setInterval(() => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, [queryClient]);
}

/**
 * Hook để clear toàn bộ cache khi logout
 */
export function useClearCacheOnLogout() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.clear();
        queryClient.removeQueries();
    };
}
