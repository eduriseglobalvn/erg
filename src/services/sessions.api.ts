import { httpClient } from "./http-client";

export interface SessionContext {
    user: {
        id: string;
        email: string;
        fullName: string;
        avatarUrl?: string;
        status: 'PENDING' | 'ACTIVE' | 'BANNED' | 'BLOCKED';
    };
    accessControl: {
        roles: string[];
        permissions: string[];
    };
    session: {
        id: string;
        ipAddress: string;
        lastActiveAt: string;
        expiresAt: string;
    };
    system: {
        serverTime: string;
        version: string;
    };
}

export const sessionsApi = {
    /**
     * GET /sessions/current
     * Lấy thông tin session hiện tại bao gồm user, roles, permissions
     * Đây là API quan trọng nhất để lấy permissions sau khi login
     */
    getCurrent: () => {
        return httpClient<SessionContext>('/sessions/current', {
            method: 'GET',
            requireAuth: true,
        });
    },
};
