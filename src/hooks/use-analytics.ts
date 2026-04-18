"use client"

import { analyticsApi } from "@/services/analytics.api";
import { devLog, devWarn } from "@/lib/dev-logger";

/**
 * Hook to manually track events (behaviors)
 */
export function useAnalytics() {
    const trackEvent = (eventName: string, metadata: Record<string, unknown> = {}) => {
        try {
            if (typeof window === 'undefined') return;

            const visitId = sessionStorage.getItem('erg_visit_id');

            devLog(
                `%c[Analytics] 🖱️ Đang track hành vi: ${eventName}`,
                "color: #ff8c00; font-weight: bold;",
                metadata
            );

            if (!visitId) {
                devWarn('[Analytics] ❌ Không thể track behavior: Chưa có visitId trong bộ nhớ');
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
                devLog(`%c[Analytics] ✅ Đã gửi behavior: ${eventName}`, "color: #ff8c00;");
            });
        } catch (error) {
            devWarn('[Analytics] trackEvent error:', error);
        }
    };

    return { trackEvent };
}
