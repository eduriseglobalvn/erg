import { useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '@/services/http-client';
import { userApi } from '@/services/users.api';

/**
 * Custom hook để fetch và cache authentication data
 * Sử dụng trong AdminAuthGuard và các component khác cần check auth
 */
export function useAuth() {
    return useQuery({
        queryKey: ['auth', 'session'],
        queryFn: async () => {
            const [sessionRes, userRes] = await Promise.all([
                httpClient('/sessions/current', { requireAuth: true }),
                userApi.getMe()
            ]);

            const sessionData = sessionRes.data || sessionRes;
            const userData = userRes.data || userRes;

            // Merge thông tin user từ /users/me vào session user
            const fullUser = {
                ...sessionData.user,
                ...userData
            };

            return {
                session: sessionData,
                user: fullUser,
                permissions: sessionData.accessControl?.permissions || [],
                roles: sessionData.accessControl?.roles || []
            };
        },
        staleTime: 5 * 60 * 1000, // Cache 5 phút
        gcTime: 10 * 60 * 1000, // Garbage collection sau 10 phút
        retry: false, // Không retry nếu fail (để logout ngay)
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
    });
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
