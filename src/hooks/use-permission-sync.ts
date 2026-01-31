import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

/**
 * Hook để tự động sync permissions với server mỗi 5 phút
 * Chỉ chạy khi user đã authenticated
 */
export function usePermissionSync() {
    const queryClient = useQueryClient();

    useEffect(() => {
        // Chỉ sync nếu có token
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // Refetch auth data mỗi 5 phút
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
