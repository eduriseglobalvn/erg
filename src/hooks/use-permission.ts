"use client";

import { useEffect, useState } from "react";

/**
 * Hook để kiểm tra permission của user hiện tại
 * @param permission - Tên permission cần check (vd: 'posts.create')
 * @returns boolean - true nếu user có permission, false nếu không
 */
export const usePermission = (permission: string): boolean => {
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const permissionsStr = localStorage.getItem('permissions');
                if (permissionsStr) {
                    const permissions: string[] = JSON.parse(permissionsStr);
                    setHasPermission(permissions.includes(permission));
                } else {
                    setHasPermission(false);
                }
            } catch (error) {
                console.error('Failed to parse permissions:', error);
                setHasPermission(false);
            }
        }
    }, [permission]);

    return hasPermission;
};

/**
 * Hook để kiểm tra role của user hiện tại
 * @param role - Tên role cần check (vd: 'admin')
 * @returns boolean - true nếu user có role, false nếu không
 */
export const useRole = (role: string): boolean => {
    const [hasRole, setHasRole] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const rolesStr = localStorage.getItem('roles');
                if (rolesStr) {
                    const roles: string[] = JSON.parse(rolesStr);
                    setHasRole(roles.includes(role));
                } else {
                    setHasRole(false);
                }
            } catch (error) {
                console.error('Failed to parse roles:', error);
                setHasRole(false);
            }
        }
    }, [role]);

    return hasRole;
};

/**
 * Hook để lấy tất cả permissions của user
 * @returns string[] - Mảng các permissions
 */
export const usePermissions = (): string[] => {
    const [permissions, setPermissions] = useState<string[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const permissionsStr = localStorage.getItem('permissions');
                if (permissionsStr) {
                    setPermissions(JSON.parse(permissionsStr));
                }
            } catch (error) {
                console.error('Failed to parse permissions:', error);
                setPermissions([]);
            }
        }
    }, []);

    return permissions;
};

/**
 * Hook để lấy tất cả roles của user
 * @returns string[] - Mảng các roles
 */
export const useRoles = (): string[] => {
    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const rolesStr = localStorage.getItem('roles');
                if (rolesStr) {
                    setRoles(JSON.parse(rolesStr));
                }
            } catch (error) {
                console.error('Failed to parse roles:', error);
                setRoles([]);
            }
        }
    }, []);

    return roles;
};
