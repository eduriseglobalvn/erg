import { httpClient } from '@/services/http-client';

export const accessControlApi = {
    // === ROLES ===
    getRoles: () => httpClient('/access-control/roles'),

    getRoleById: (id: string) => httpClient(`/access-control/roles/${id}`),

    createRole: (data: { name: string; description?: string; permissions?: string[] }) =>
        httpClient('/access-control/roles', { method: 'POST', body: JSON.stringify(data) }),

    updateRole: (id: string, data: { name?: string; description?: string; permissions?: string[] }) =>
        httpClient(`/access-control/roles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    deleteRole: (id: string) => httpClient(`/access-control/roles/${id}`, { method: 'DELETE' }),

    // === PERMISSIONS ===
    getPermissions: () => httpClient('/access-control/permissions'),

    // === USERS ===
    // Lấy quyền hiện tại của user
    getUserPermissions: (userId: string) =>
        httpClient(`/access-control/users/${userId}/permissions`),

    // Gán roles
    assignRoles: (userId: string, roleIds: string[]) =>
        httpClient(`/access-control/users/${userId}/roles`, { method: 'POST', body: JSON.stringify({ roleIds }) }),

    // Gỡ role
    removeRole: (userId: string, roleId: string) =>
        httpClient(`/access-control/users/${userId}/roles/${roleId}`, { method: 'DELETE' }),

    // Thêm permission override
    addPermissionOverride: (
        userId: string,
        data: {
            permissionId: string;
            grantType: 'GRANT' | 'DENY';
            reason?: string;
            expiresAt?: string;
        }
    ) => httpClient(`/access-control/users/${userId}/permissions`, { method: 'POST', body: JSON.stringify(data) }),

    // Gỡ permission override
    removePermissionOverride: (userId: string, overrideId: string) =>
        httpClient(`/access-control/users/${userId}/permissions/${overrideId}`, { method: 'DELETE' }),

    // Preview thay đổi
    previewChanges: (userId: string, changes: Record<string, unknown>) =>
        httpClient(`/access-control/users/${userId}/preview`, { method: 'POST', body: JSON.stringify(changes) }),

    // Bulk assign role
    bulkAssignRole: (userIds: string[], roleId: string) =>
        httpClient('/access-control/bulk-assign-role', { method: 'POST', body: JSON.stringify({ userIds, roleId }) }),
};
