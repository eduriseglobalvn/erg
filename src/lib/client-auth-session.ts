type AuthUserPayload = {
    id?: string;
    provider?: string;
    accountType?: string;
    roles?: string[];
    permissions?: string[];
    [key: string]: unknown;
};

type AuthTokenPayload = {
    accessToken?: string;
    refreshToken?: string;
    user?: AuthUserPayload;
    permissions?: string[];
    roles?: string[];
    data?: AuthTokenPayload;
};

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';
const USER_ID_KEY = 'userId';
const PERMISSIONS_KEY = 'permissions';
const ROLES_KEY = 'roles';

function browserStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
}

function normalizeAuthPayload(payload: AuthTokenPayload | null | undefined): AuthTokenPayload | null {
    if (!payload) return null;
    return payload.data || payload;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

function expireCookie(name: string, path = '/') {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

function readCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const cookie = document.cookie
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

export function getClientAccessToken(): string | null {
    return null;
}

export function getClientRefreshToken(): string | null {
    return null;
}

export function hasClientAuthSession(): boolean {
    return readCookie('isLoggedIn') === 'true';
}

export function setClientAuthSession(payload: AuthTokenPayload | null | undefined) {
    const storage = browserStorage();
    if (!storage) return;

    const data = normalizeAuthPayload(payload);
    if (!data) return;

    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);

    if (data.accessToken || data.refreshToken || data.user) {
        writeCookie('isLoggedIn', 'true', 30 * 24 * 60 * 60);
    }

    if (data.user) {
        storage.setItem(USER_KEY, JSON.stringify(data.user));
        if (data.user.id) {
            storage.setItem(USER_ID_KEY, data.user.id);
            writeCookie('clientUserId', data.user.id, 30 * 24 * 60 * 60);
        }
        if (data.user.provider) {
            writeCookie('authProvider', data.user.provider, 30 * 24 * 60 * 60);
        }
        if (data.user.accountType) {
            writeCookie('accountType', data.user.accountType, 30 * 24 * 60 * 60);
        }
    }

    const permissions = data.permissions || data.user?.permissions;
    if (permissions) {
        storage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
    }

    const roles = data.roles || data.user?.roles;
    if (roles) {
        storage.setItem(ROLES_KEY, JSON.stringify(roles));
    }
}

export function clearClientAuthSession() {
    const storage = browserStorage();
    if (storage) {
        storage.removeItem(ACCESS_TOKEN_KEY);
        storage.removeItem(REFRESH_TOKEN_KEY);
        storage.removeItem(USER_ID_KEY);
        storage.removeItem(USER_KEY);
        storage.removeItem(PERMISSIONS_KEY);
        storage.removeItem(ROLES_KEY);
    }

    expireCookie('isLoggedIn');
    expireCookie('clientUserId');
    expireCookie('authProvider');
    expireCookie('accountType');
    expireCookie('erg_access_token');
    expireCookie('erg_refresh_token');
    expireCookie('accessToken', '/api');
    expireCookie('refreshToken', '/api');
}
