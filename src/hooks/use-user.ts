import { useAuth } from './use-auth';

/**
 * Hook để lấy thông tin user hiện tại
 * Đây là wrapper đơn giản của useAuth để dễ sử dụng trong components
 */
export function useUser() {
    const { data: auth, isLoading, isError } = useAuth();

    return {
        user: auth?.user,
        permissions: auth?.permissions || [],
        roles: auth?.roles || [],
        isLoading,
        isError,
        isAuthenticated: !!auth?.user
    };
}

/**
 * Hook để check permission cụ thể
 */
export function useHasPermission(permission: string) {
    const { permissions } = useUser();
    return permissions.includes(permission);
}

/**
 * Hook để check role cụ thể
 */
export function useHasRole(role: string) {
    const { roles } = useUser();
    return roles.includes(role);
}
