"use client";

import { create } from 'zustand';

/**
 * Zustand store lưu trữ permissions và roles ở client-side.
 * Mirror nhẹ từ TanStack Query cache để tránh re-fetch khi chỉ cần check quyền.
 */
interface PermissionState {
    permissions: string[];
    roles: string[];
    isLoaded: boolean;

    // Actions
    setPermissions: (permissions: string[], roles: string[]) => void;
    clearPermissions: () => void;

    // Selectors (computed)
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string) => boolean;
}

export const usePermissionStore = create<PermissionState>((set, get) => ({
    permissions: [],
    roles: [],
    isLoaded: false,

    setPermissions: (permissions: string[], roles: string[]) => {
        set({ permissions, roles, isLoaded: true });
    },

    clearPermissions: () => {
        set({ permissions: [], roles: [], isLoaded: false });
    },

    hasPermission: (permission: string) => {
        return get().permissions.includes(permission);
    },

    hasRole: (role: string) => {
        return get().roles.includes(role);
    },
}));
