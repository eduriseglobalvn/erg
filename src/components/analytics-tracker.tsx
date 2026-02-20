"use client"

import { useEffect } from "react";
import { usePageTracking } from "@/hooks/use-page-tracking"
import { useAnalytics } from "@/hooks/use-analytics"

export function AnalyticsTracker() {
    usePageTracking();
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const trackableElement = target.closest('[data-analytics]') as HTMLElement;

            if (trackableElement) {
                const eventName = trackableElement.getAttribute('data-analytics');
                const rawMetadata = trackableElement.getAttribute('data-analytics-metadata');

                let metadata = {};
                if (rawMetadata) {
                    try {
                        metadata = JSON.parse(rawMetadata);
                    } catch (e) {
                        console.warn('[Analytics] Failed to parse metadata:', rawMetadata);
                    }
                }

                if (eventName) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`%c[Analytics] 🎯 Click vào phần tử: ${eventName}`, "color: #ff8c00; font-style: italic;");
                    }
                    trackEvent(eventName, {
                        ...metadata,
                        element: trackableElement.tagName.toLowerCase(),
                        text: trackableElement.innerText?.substring(0, 50),
                    });
                }
            }
        };

        document.addEventListener('click', handleGlobalClick);
        return () => document.removeEventListener('click', handleGlobalClick);
    }, [trackEvent]);

    return null; // Component này không render UI, chỉ chạy logic tracking
}
