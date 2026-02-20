import { httpClient } from './http-client';

export const seoLoggingApi = {
    log404: async (url: string, referrer?: string) => {
        try {
            await httpClient('/seo/404', {
                method: 'POST',
                body: JSON.stringify({
                    url,
                    referrer: referrer || (typeof document !== 'undefined' ? document.referrer : ''),
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side',
                }),
            });
        } catch (error) {
            // Silently fail for logging
            console.warn('Failed to log 404 error:', error);
        }
    }
};
