import { useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient, isBackendUnavailableError } from '@/services/http-client';
import { usePermissionStore } from '@/store/permission-store';
import { useEffect } from 'react';
import { hasLoggedInCookie } from '@/lib/client-session';

/**
 * Custom hook để fetch và cache authentication data
 * Sử dụng trong AdminAuthGuard và các component khác cần check auth
 */
export function useAuth() {
    const setPermissions = usePermissionStore((s) => s.setPermissions);
    const clearPermissions = usePermissionStore((s) => s.clearPermissions);

    const query = useQuery({
        queryKey: ['auth', 'session'],
        queryFn: async () => {
            const sessionRes = await httpClient('/sessions/current', { requireAuth: true });
            const sessionData = (sessionRes as any).data || sessionRes;

            const permissions = sessionData.accessControl?.permissions || [];
            const roles = sessionData.accessControl?.roles || [];

            const fullUser = {
                ...sessionData.user,
                role: roles[0] || null,
            };

            return {
                session: sessionData,
                user: fullUser,
                permissions,
                roles
            };
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
        enabled: typeof window !== 'undefined' && hasLoggedInCookie()
    });

    useEffect(() => {
        if (query.data) {
            setPermissions(query.data.permissions, query.data.roles);
            return;
        }

        if (!hasLoggedInCookie()) {
            clearPermissions();
            return;
        }

        if (query.isError && !isBackendUnavailableError(query.error)) {
            clearPermissions();
        }
    }, [clearPermissions, query.data?.permissions, query.data?.roles, query.error, query.isError, setPermissions]);

    return query;
}

/**
 * Hook để invalidate auth cache (dùng khi logout hoặc login mới)
 */
export function useInvalidateAuth() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: ['auth'] });
    };
}
