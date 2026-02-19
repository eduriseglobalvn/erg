"use client"

import { analyticsApi } from "@/services/analytics.api";

/**
 * Hook to manually track events (behaviors)
 */
export function useAnalytics() {
    const trackEvent = (eventName: string, metadata: Record<string, any> = {}) => {
        try {
            if (typeof window === 'undefined') return;

            // Get visitId from sessionStorage
            const visitId = sessionStorage.getItem('erg_visit_id');

            if (process.env.NODE_ENV === 'development') {
                console.log(`%c[Analytics] 🖱️ Đang track hành vi: ${eventName}`, "color: #ff8c00; font-weight: bold;", metadata);
            }

            if (!visitId) {
                console.warn('[Analytics] ❌ Không thể track behavior: Chưa có visitId trong bộ nhớ');
                return;
            }

            analyticsApi.trackBehavior({
                sessionInternalId: visitId,
                eventType: eventName,
                metadata: {
                    ...metadata,
                    timestamp: new Date().toISOString(),
                    pathname: window.location.pathname,
                }
            }).then(() => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`%c[Analytics] ✅ Đã gửi behavior: ${eventName}`, "color: #ff8c00;");
                }
            });
        } catch (error) {
            console.error('[Analytics] trackEvent error:', error);
        }
    };

    return { trackEvent };
}
