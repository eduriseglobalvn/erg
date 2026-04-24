const LOCAL_BACKEND_FALLBACKS = [
    'http://127.0.0.1:8080',
    'http://localhost:8080',
    'http://127.0.0.1:3003',
    'http://localhost:3003',
];

function normalizeBaseUrl(value?: string | null): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    return trimmed.replace(/\/+$/, '');
}

export function getBackendBaseCandidates(): string[] {
    const candidates = [
        normalizeBaseUrl(process.env.BACKEND_URL),
        normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL),
        ...LOCAL_BACKEND_FALLBACKS,
    ].filter((value): value is string => Boolean(value));

    return Array.from(new Set(candidates));
}

export function getPreferredBackendBaseUrl(): string {
    return getBackendBaseCandidates()[0] || 'http://localhost:8080';
}

export function buildBackendApiUrl(path: string, baseUrl = getPreferredBackendBaseUrl()): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
}

export async function fetchWithBackendFallback(path: string, init?: RequestInit): Promise<Response> {
    const candidates = getBackendBaseCandidates();
    let lastError: unknown;

    for (const baseUrl of candidates) {
        try {
            const url = buildBackendApiUrl(path, baseUrl);
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Backend Connectivity] Attempting fetch: ${url}`);
            }
            return await fetch(url, init);
        } catch (error) {
            lastError = error;
        }
    }

    const lastMessage = lastError instanceof Error ? lastError.message : 'timeout or connection refused';

    // Log detailed internal info ONLY to server-side console, NEVER return to client
    if (process.env.NODE_ENV === 'development') {
        console.error(`[Backend Connectivity] Exhausted candidates: ${candidates.join(', ')}.`);
        console.error(`[Backend Connectivity] Last error:`, lastError);
    }

    throw new Error('Dịch vụ đang tạm thời không khả dụng. Vui lòng thử lại sau.');
}
